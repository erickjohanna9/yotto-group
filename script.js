// ===== YOTTO GROUP — Scripts =====

// Menu mobile
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
if (burger && navLinks) {
  burger.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));
}

// Formulaire de contact
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    document.getElementById('formNote').textContent =
      '✅ Merci ! Votre demande est envoyée à YOTTO GROUP. Nous vous répondons rapidement sur WhatsApp ou Facebook.';
    contactForm.reset();
  });
}

// ===== Paiement =====
const payForm = document.getElementById('payForm');
const params = new URLSearchParams(window.location.search);
const prePack = params.get('pack');
const serviceSelect = document.getElementById('service');
const packRecap = document.getElementById('packRecap');
const amountInput = document.getElementById('amount');

if (prePack && serviceSelect) {
  serviceSelect.value = prePack;
  serviceSelect.dispatchEvent(new Event('change'));
}
if (serviceSelect) {
  serviceSelect.addEventListener('change', () => {
    const opt = serviceSelect.selectedOptions[0];
    const price = opt ? opt.getAttribute('data-price') : '';
    if (price) {
      amountInput.value = price;
      amountInput.readOnly = true;
      if (packRecap) {
        packRecap.classList.add('visible');
        document.getElementById('packName').textContent = opt.textContent.split(' — ')[0];
        document.getElementById('packPrice').textContent = Number(price).toLocaleString('fr-FR') + ' FCFA';
      }
    } else {
      amountInput.value = '';
      amountInput.readOnly = false;
      if (packRecap) packRecap.classList.remove('visible');
    }
  });
}

const methodInput = document.getElementById('method');
const phoneField = document.getElementById('phoneField');
const phoneInput = document.getElementById('phone');
const methodLabels = {
  wave: 'Wave 🌊', orange: 'Orange Money 🟠', mtn: 'MTN MoMo 🟡',
  moov: 'Moov Money 🔵', card: 'Carte bancaire 💳', virement: 'Virement bancaire 🏦'
};
document.querySelectorAll('.pay-method').forEach(el => {
  el.addEventListener('click', () => {
    document.querySelectorAll('.pay-method').forEach(m => m.classList.remove('selected'));
    el.classList.add('selected');
    const method = el.getAttribute('data-method');
    methodInput.value = method;
    if (method === 'virement' || method === 'card') {
      phoneField.style.display = 'none';
      phoneInput.removeAttribute('required');
    } else {
      phoneField.style.display = 'block';
      phoneInput.setAttribute('required', 'required');
    }
  });
});

if (payForm) {
  payForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const result = document.getElementById('payResult');
    const ussdBox = document.getElementById('ussdBox');
    const method = methodInput.value;
    const amount = Number(amountInput.value);
    const phone = phoneInput.value.replace(/\s/g, '');

    if (!method) {
      result.style.display = 'block'; result.className = 'error';
      result.textContent = '⚠️ Veuillez choisir un moyen de paiement.';
      return;
    }
    if (['wave','orange','mtn','moov'].includes(method) && !/^\+?\d{8,13}$/.test(phone)) {
      result.style.display = 'block'; result.className = 'error';
      result.textContent = '⚠️ Numéro Mobile Money invalide (8 à 13 chiffres).';
      return;
    }

    const ref = 'YOTTO-' + Date.now().toString(36).toUpperCase();

    if (method === 'virement') {
      result.style.display = 'block'; result.className = 'success';
      result.innerHTML = `🏦 <strong>Instructions de virement</strong> — Réf : <strong>${ref}</strong><br>
        Virez ${amount.toLocaleString('fr-FR')} FCFA (XOF) sur le compte de YOTTO GROUP (RIB communiqué sur demande) avec cette référence. Reçu envoyé dès validation.`;
      ussdBox.style.display = 'none';
      return;
    }
    if (method === 'card') {
      result.style.display = 'block'; result.className = 'success';
      result.innerHTML = `💳 Paiement carte initié — Réf : <strong>${ref}</strong> · ${amount.toLocaleString('fr-FR')} FCFA via Visa/Mastercard (redirection 3D-Secure — démonstration).`;
      ussdBox.style.display = 'none';
      return;
    }

    ussdBox.style.display = 'block';
    ussdBox.innerHTML = `📲 <strong>Demande envoyée sur ${phone}</strong><br>
      ${methodLabels[method]} — Montant : <strong>${amount.toLocaleString('fr-FR')} FCFA</strong> — Réf : <strong>${ref}</strong><br><br>
      Composez le code USSD affiché sur votre téléphone et entrez votre code PIN pour confirmer.`;
    result.style.display = 'block'; result.className = 'success';
    result.innerHTML = `✅ <strong>Paiement confirmé ! Merci ${document.getElementById('name').value || ''}.</strong><br>
      ${amount.toLocaleString('fr-FR')} FCFA via ${methodLabels[method]} — Réf : <strong>${ref}</strong><br>
      Reçu envoyé à ${document.getElementById('email').value}.<br>
      <small>📘 <a href="https://www.facebook.com/profile.php?id=100063998702095" target="_blank" rel="noopener">Suivez YOTTO GROUP sur Facebook</a></small>`;
    ussdBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}
