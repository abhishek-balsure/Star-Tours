function sanitize(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
  return /^[6-9]\d{9}$/.test(phone);
}

function validatePassport(passport) {
  return /^[A-Z]{1,2}\d{6,9}$/.test(passport.toUpperCase());
}

function validateVisaForm() {
  const visaType = document.getElementById('visaType')?.value || '';
  const country = document.getElementById('country')?.value || '';
  const fullName = document.getElementById('fullName')?.value?.trim() || '';
  const email = document.getElementById('email')?.value?.trim() || '';
  const phone = document.getElementById('phone')?.value?.trim() || '';
  const passport = document.getElementById('passport')?.value?.trim() || '';
  const nationality = document.getElementById('nationality')?.value || '';
  const travelDates = document.getElementById('travelDates')?.value || '';

  const errors = [];

  if (!visaType) errors.push('Please select a visa type');
  if (!country) errors.push('Please enter destination country');
  if (!fullName || fullName.length < 2) errors.push('Please enter a valid full name');
  if (!validateEmail(email)) errors.push('Please enter a valid email address');
  if (!validatePhone(phone)) errors.push('Please enter a valid 10-digit phone number');
  if (!validatePassport(passport)) errors.push('Please enter a valid passport number');
  if (!nationality) errors.push('Please enter your nationality');
  if (!travelDates) errors.push('Please enter travel dates');

  return errors;
}

function submitVisa() {
  const errors = validateVisaForm();

  if (errors.length > 0) {
    showVisaError(errors);
    return false;
  }

  const visaType = sanitize(document.getElementById('visaType').value);
  const country = sanitize(document.getElementById('country').value);
  const fullName = sanitize(document.getElementById('fullName').value.trim());
  const email = sanitize(document.getElementById('email').value.trim());
  const phone = sanitize(document.getElementById('phone').value.trim());
  const passport = sanitize(document.getElementById('passport').value.trim());
  const nationality = sanitize(document.getElementById('nationality').value);
  const travelDates = sanitize(document.getElementById('travelDates').value);

  const application = {
    visaType, country, fullName, email, phone, passport, nationality, travelDates
  };

  const token = localStorage.getItem('star_token');
  if (!token) {
    showVisaError(['You must be logged in to apply for a visa. Please login from the menu.']);
    return false;
  }

  fetch('http://localhost:5000/api/visas', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(application)
  })
    .then(async (res) => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit application');
      showVisaSuccess(data.visa);
    })
    .catch((err) => {
      showVisaError([err.message]);
    });

  return false;
}

function showVisaError(errors) {
  const form = document.querySelector('.visa-form');
  if (!form) return;

  const existingError = form.querySelector('.visa-error');
  if (existingError) existingError.remove();

  const errorDiv = document.createElement('div');
  errorDiv.className = 'visa-error';
  errorDiv.innerHTML = `
    <div style="background:#ffe6e6;padding:20px;border-radius:10px;text-align:center;">
      <h2 style="color:#cc0000;margin-bottom:10px;">Application Failed</h2>
      <ul style="text-align:left;list-style:none;">
        ${errors.map(e => `<li style="color:#cc0000;margin:5px 0;">• ${e}</li>`).join('')}
      </ul>
      <button onclick="location.reload()" style="margin-top:15px;padding:10px 20px;background:#0077cc;color:white;border:none;border-radius:5px;cursor:pointer;">Try Again</button>
    </div>
  `;

  form.prepend(errorDiv);
}

function showVisaSuccess(application) {
  window.lastVisa = application;
  const container = document.querySelector('.container');
  if (!container) return;

  container.innerHTML = `
    <div class="success-card">
      <div class="success-icon">&#9989;</div>
      <h2>Application Submitted Successfully</h2>
      <p>Thank you, <strong>${application.fullName}</strong>.</p>
      <p>Your visa application for <strong>${application.country}</strong> 
        (<strong>${application.visaType}</strong>) has been received.</p>
      <p><em>Application ID: ${application._id || application.id}</em></p>
      <p>We will contact you via email or phone shortly.</p>
      <button onclick="downloadVisaInvoice()" class="btn">&#128196; Download Invoice</button>
      <br>
      <a href="index.html" class="btn-home">&larr; Back to Home</a>
    </div>
  `;
}

function downloadVisaInvoice() {
  let app = window.lastVisa;
  if (!app) return;
  const appId = app._id || app.id;
  const appDate = app.createdAt || app.timestamp || new Date().toISOString();

  const el = document.createElement('div');
  el.innerHTML = `
    <div style="padding:40px;font-family:Arial,sans-serif;max-width:800px;margin:0 auto;color:#333;">
      <div style="text-align:center;border-bottom:3px solid #003366;padding-bottom:20px;margin-bottom:30px;">
        <h1 style="color:#003366;margin:0;font-size:28px;">ST&#9733;R Tours &amp; Travels</h1>
        <p style="color:#666;margin:5px 0;">Your journey begins with us</p>
      </div>
      <h2 style="color:#003366;">Visa Application Invoice</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        <tr><td style="padding:6px 10px;width:150px;"><strong>Application ID:</strong></td><td style="padding:6px 10px;">${appId}</td></tr>
        <tr><td style="padding:6px 10px;"><strong>Date:</strong></td><td style="padding:6px 10px;">${new Date(appDate).toLocaleDateString()}</td></tr>
        <tr><td style="padding:6px 10px;"><strong>Status:</strong></td><td style="padding:6px 10px;">${(app.status || 'pending').charAt(0).toUpperCase() + (app.status || 'pending').slice(1)}</td></tr>
      </table>
      <h3 style="color:#003366;border-bottom:1px solid #ddd;padding-bottom:5px;">Applicant Details</h3>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        <tr><td style="padding:6px 10px;width:150px;"><strong>Full Name:</strong></td><td style="padding:6px 10px;">${app.fullName || ''}</td></tr>
        <tr><td style="padding:6px 10px;"><strong>Email:</strong></td><td style="padding:6px 10px;">${app.email || ''}</td></tr>
        <tr><td style="padding:6px 10px;"><strong>Phone:</strong></td><td style="padding:6px 10px;">${app.phone || ''}</td></tr>
        <tr><td style="padding:6px 10px;"><strong>Nationality:</strong></td><td style="padding:6px 10px;">${app.nationality || ''}</td></tr>
        <tr><td style="padding:6px 10px;"><strong>Passport:</strong></td><td style="padding:6px 10px;">${app.passport || ''}</td></tr>
      </table>
      <h3 style="color:#003366;border-bottom:1px solid #ddd;padding-bottom:5px;">Visa Details</h3>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        <tr><td style="padding:6px 10px;width:150px;"><strong>Visa Type:</strong></td><td style="padding:6px 10px;">${app.visaType || ''}</td></tr>
        <tr><td style="padding:6px 10px;"><strong>Destination:</strong></td><td style="padding:6px 10px;">${app.country || ''}</td></tr>
        <tr><td style="padding:6px 10px;"><strong>Travel Dates:</strong></td><td style="padding:6px 10px;">${app.travelDates || ''}</td></tr>
      </table>
      <div style="margin-top:40px;padding-top:20px;border-top:2px solid #003366;text-align:center;color:#999;font-size:12px;">
        <p>Thank you for choosing ST&#9733;R Tours &amp; Travels!</p>
        <p>This is a computer-generated invoice.</p>
      </div>
    </div>
  `;
  document.body.appendChild(el);
  el.style.position = 'fixed';
  el.style.top = '0';
  el.style.left = '0';
  el.style.width = '800px';
  el.style.zIndex = '-1';
  el.style.pointerEvents = 'none';

  html2pdf().set({
    margin: [10, 10, 10, 10],
    filename: `STAR-Visa-Invoice-${appId}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, letterRendering: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  }).from(el).save().then(() => {
    document.body.removeChild(el);
  }).catch(() => {
    document.body.removeChild(el);
  });
}
