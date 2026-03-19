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
    id: Date.now(),
    visaType, country, fullName, email, phone, passport, nationality, travelDates,
    timestamp: new Date().toISOString()
  };

  // Save to localStorage
  const applications = JSON.parse(localStorage.getItem('visaApplications') || '[]');
  applications.push(application);
  localStorage.setItem('visaApplications', JSON.stringify(applications));

  // Show success
  showVisaSuccess(application);
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
  const container = document.querySelector('.visa-application');
  if (!container) return;

  container.innerHTML = `
    <div class="submission-success">
      <h2>Application Submitted Successfully</h2>
      <p>Thank you, <strong>${application.fullName}</strong>.</p>
      <p>Your visa application for <strong>${application.country}</strong> 
        (<strong>${application.visaType}</strong>) has been received.</p>
      <p><em>Application ID: ${application.id}</em></p>
      <p>We will contact you via email or phone shortly.</p>
      <a class="home-button" href="index.html">Back to Home</a>
    </div>
  `;
}
