// ============================================================
// VISA.JS — ST★R Tours & Travels
// Realistic visa application: types, fees, processing times,
// document checklists, 3-step flow (Application -> Docs -> Review)
// ============================================================

// ---- Visa data: fee (INR), processing days, validity, max stay, documents ----
var visaData = {
  Tourist: {
    "Australia": { fee: 15900, process: 15, validity: "1 year", stay: "90 days", docs: ["Passport (6 months validity)", "Travel Itinerary", "Bank Statement (3 months)", "Return Ticket", "Health Insurance", "Photo (white background)"] },
    "Brazil": { fee: 10500, process: 8, validity: "10 years", stay: "90 days", docs: ["Passport (6 months validity)", "Visa Application Form", "Photo", "Return Ticket", "Hotel Booking"] },
    "Chile": { fee: 8500, process: 7, validity: "1 year", stay: "90 days", docs: ["Passport (6 months validity)", "Visa Application Form", "Return Ticket", "Bank Statement"] },
    "China": { fee: 12500, process: 10, validity: "1 year", stay: "60 days", docs: ["Passport (6 months validity)", "Visa Application Form", "Photo", "Hotel Booking", "Flight Itinerary"] },
    "Egypt": { fee: 6500, process: 5, validity: "3 months", stay: "30 days", docs: ["Passport (6 months validity)", "Visa Application Form", "Photo", "Hotel Booking", "Return Ticket"] },
    "France": { fee: 11200, process: 12, validity: "5 years", stay: "90 days", docs: ["Passport (6 months validity)", "Visa Application Form", "Photo", "Travel Insurance", "Bank Statement (3 months)", "Accommodation Proof", "Flight Reservation"] },
    "Germany": { fee: 11200, process: 12, validity: "5 years", stay: "90 days", docs: ["Passport (6 months validity)", "Visa Application Form", "Photo", "Travel Insurance", "Bank Statement (3 months)", "Accommodation Proof"] },
    "Greece": { fee: 11200, process: 12, validity: "5 years", stay: "90 days", docs: ["Passport (6 months validity)", "Visa Application Form", "Photo", "Travel Insurance", "Bank Statement", "Flight Reservation"] },
    "Iceland": { fee: 11200, process: 12, validity: "5 years", stay: "90 days", docs: ["Passport (6 months validity)", "Travel Plan", "Photograph", "Travel Insurance", "Bank Statement"] },
    "Indonesia": { fee: 7500, process: 4, validity: "1 year", stay: "60 days", docs: ["Passport (6 months validity)", "Return Ticket", "Hotel Details", "Bank Statement"] },
    "Italy": { fee: 11200, process: 12, validity: "5 years", stay: "90 days", docs: ["Passport (6 months validity)", "Visa Application Form", "Photo", "Travel Insurance", "Bank Statement", "Hotel Booking"] },
    "Japan": { fee: 9800, process: 5, validity: "3 months", stay: "15 days", docs: ["Passport (6 months validity)", "Return Ticket", "Hotel Booking", "Itinerary", "Sponsor Letter", "Bank Statement"] },
    "Kenya": { fee: 6200, process: 3, validity: "3 months", stay: "90 days", docs: ["Passport (6 months validity)", "Visa Form", "Yellow Fever Certificate", "Return Ticket"] },
    "Maldives": { fee: 0, process: 0, validity: "On arrival", stay: "30 days", docs: ["Passport (6 months validity)", "Hotel Booking", "Return Ticket"] },
    "Malaysia": { fee: 4500, process: 3, validity: "3 months", stay: "30 days", docs: ["Passport (6 months validity)", "Return Ticket", "Hotel Booking", "Photo"] },
    "Mexico": { fee: 10800, process: 10, validity: "1 year", stay: "180 days", docs: ["Passport (6 months validity)", "Visa Application Form", "Photo", "Bank Statement", "Return Ticket"] },
    "Morocco": { fee: 5800, process: 6, validity: "6 months", stay: "90 days", docs: ["Passport (6 months validity)", "Visa Form", "Hotel Confirmation", "Return Ticket"] },
    "Netherlands": { fee: 11200, process: 12, validity: "5 years", stay: "90 days", docs: ["Passport (6 months validity)", "Proof of Funds", "Visa Application", "Photo", "Travel Insurance"] },
    "New Zealand": { fee: 17400, process: 20, validity: "1 year", stay: "90 days", docs: ["Passport (6 months validity)", "Health Check", "Financial Documents", "Return Ticket"] },
    "Norway": { fee: 11200, process: 12, validity: "5 years", stay: "90 days", docs: ["Passport (6 months validity)", "Bank Statement", "Accommodation", "Travel Insurance"] },
    "Peru": { fee: 7200, process: 7, validity: "6 months", stay: "90 days", docs: ["Passport (6 months validity)", "Visa Form", "Travel Itinerary", "Bank Statement"] },
    "Russia": { fee: 11500, process: 10, validity: "1 year", stay: "30 days", docs: ["Passport (6 months validity)", "Visa Application Form", "Photo", "Invitation Letter", "Hotel Booking", "Travel Insurance"] },
    "Singapore": { fee: 0, process: 3, validity: "2 years", stay: "30 days", docs: ["Passport (6 months validity)", "Return Ticket", "Hotel Booking", "Bank Statement"] },
    "South Africa": { fee: 9800, process: 10, validity: "3 months", stay: "30 days", docs: ["Passport (6 months validity)", "Yellow Fever Certificate", "Travel Insurance", "Bank Statement", "Return Ticket"] },
    "Spain": { fee: 11200, process: 12, validity: "5 years", stay: "90 days", docs: ["Passport (6 months validity)", "Visa Application Form", "Photo", "Bank Statement", "Travel Insurance", "Accommodation Proof"] },
    "Sri Lanka": { fee: 3200, process: 2, validity: "6 months", stay: "30 days", docs: ["Passport (6 months validity)", "Return Ticket", "Hotel Booking"] },
    "Switzerland": { fee: 11200, process: 12, validity: "5 years", stay: "90 days", docs: ["Passport (6 months validity)", "Travel Insurance", "Flight Details", "Bank Statement", "Accommodation Proof"] },
    "Thailand": { fee: 0, process: 0, validity: "On arrival", stay: "60 days", docs: ["Passport (6 months validity)", "Return Ticket", "Hotel Booking", "Photo"] },
    "Turkey": { fee: 6800, process: 3, validity: "6 months", stay: "30 days", docs: ["Passport (6 months validity)", "Photo", "Return Ticket", "Hotel Booking"] },
    "United Arab Emirates": { fee: 7200, process: 5, validity: "1 year", stay: "30 days", docs: ["Passport (6 months validity)", "Photograph", "Hotel Booking", "Return Ticket"] },
    "United Kingdom": { fee: 18500, process: 21, validity: "6 months", stay: "180 days", docs: ["Passport (6 months validity)", "Financial Documents", "Accommodation Proof", "Employment Proof", "Travel History"] },
    "United States": { fee: 22100, process: 25, validity: "10 years", stay: "180 days", docs: ["Passport (6 months validity)", "Photograph", "DS-160 Confirmation", "Appointment Letter", "Bank Statement", "Employment Proof", "Travel Itinerary"] },
    "Vietnam": { fee: 5200, process: 5, validity: "3 months", stay: "30 days", docs: ["Passport (6 months validity)", "Visa Application Form", "Photo", "Return Ticket"] }
  },  Business: {
    "Germany": { fee: 14500, process: 10, validity: "5 years", stay: "90 days", docs: ["Passport (6 months validity)", "Business Invitation Letter", "Company Registration Proof", "Photo", "Travel Insurance"] },
    "United Kingdom": { fee: 21500, process: 15, validity: "6 months", stay: "180 days", docs: ["Passport (6 months validity)", "Invitation Letter from UK Company", "Company Bank Statement", "Business License"] },
    "United States": { fee: 28500, process: 20, validity: "10 years", stay: "180 days", docs: ["Passport (6 months validity)", "DS-160 Confirmation", "Appointment Letter", "Business Invitation", "Company Documents"] },
    "China": { fee: 14800, process: 8, validity: "1 year", stay: "60 days", docs: ["Passport (6 months validity)", "Invitation Letter", "Business License", "Visa Application Form"] },
    "Singapore": { fee: 9500, process: 5, validity: "2 years", stay: "60 days", docs: ["Passport (6 months validity)", "Business Invitation", "Company Letter", "Return Ticket"] },
    "Japan": { fee: 12800, process: 6, validity: "1 year", stay: "90 days", docs: ["Passport (6 months validity)", "Invitation Letter", "Business Itinerary", "Company Registration"] },
    "Australia": { fee: 20500, process: 15, validity: "1 year", stay: "90 days", docs: ["Passport (6 months validity)", "Business Invitation", "Company Profile", "Bank Statement"] }
  },
  Student: {
    "United Kingdom": { fee: 48300, process: 20, validity: "Course length", stay: "Course length", docs: ["Passport (6 months validity)", "CAS Letter (Confirmation of Acceptance)", "English Test Result", "Financial Evidence (28 days)", "Academic Documents", "Photo"] },
    "United States": { fee: 27200, process: 25, validity: "Course length", stay: "Course length", docs: ["Passport (6 months validity)", "I-20 Form", "SEVIS Fee Receipt", "DS-160 Confirmation", "Appointment Letter", "Financial Documents"] },
    "Canada": { fee: 22400, process: 35, validity: "Course length", stay: "Course length", docs: ["Passport (6 months validity)", "Letter of Acceptance", "Financial Proof", "Statement of Purpose", "Medical Exam Report"] },
    "Australia": { fee: 31800, process: 30, validity: "Course length", stay: "Course length", docs: ["Passport (6 months validity)", "CoE (Confirmation of Enrolment)", "English Test Result", "Financial Evidence", "Health Insurance"] },
    "Germany": { fee: 9800, process: 25, validity: "Course length", stay: "Course length", docs: ["Passport (6 months validity)", "Admission Letter", "Blocked Account Proof", "Academic Documents", "Motivation Letter"] },
    "New Zealand": { fee: 24500, process: 30, validity: "Course length", stay: "Course length", docs: ["Passport (6 months validity)", "Offer of Place", "Financial Evidence", "English Test Result"] }
  },
  Work: {
    "United Kingdom": { fee: 61200, process: 30, validity: "Up to 5 years", stay: "Up to 5 years", docs: ["Passport (6 months validity)", "Certificate of Sponsorship", "Job Contract", "English Test Result", "Financial Evidence"] },
    "Germany": { fee: 15500, process: 25, validity: "Up to 4 years", stay: "Up to 4 years", docs: ["Passport (6 months validity)", "Employment Contract", "Qualification Certificates", "Work Permit Approval"] },
    "United Arab Emirates": { fee: 25000, process: 15, validity: "2 years", stay: "2 years", docs: ["Passport (6 months validity)", "Employment Contract", "Medical Test", "Police Clearance", "Photograph"] },
    "Singapore": { fee: 13500, process: 10, validity: "2 years", stay: "2 years", docs: ["Passport (6 months validity)", "Employment Pass Approval", "Medical Report", "Educational Certificates"] },
    "Qatar": { fee: 18500, process: 20, validity: "2 years", stay: "2 years", docs: ["Passport (6 months validity)", "Work Contract", "Medical Test", "Police Clearance", "Qatar ID Application"] }
  },
  Medical: {
    "Germany": { fee: 12500, process: 12, validity: "3 months", stay: "90 days", docs: ["Passport (6 months validity)", "Hospital Admission Letter", "Doctor's Report", "Financial Evidence", "Travel Insurance"] },
    "United States": { fee: 24500, process: 20, validity: "3 months", stay: "90 days", docs: ["Passport (6 months validity)", "Medical Appointment Letter", "Doctor's Referral", "Financial Documents", "DS-160 Confirmation"] },
    "Thailand": { fee: 6200, process: 5, validity: "3 months", stay: "90 days", docs: ["Passport (6 months validity)", "Hospital Admission Letter", "Doctor's Report", "Financial Evidence"] },
    "India": { fee: 4500, process: 5, validity: "6 months", stay: "180 days", docs: ["Passport (6 months validity)", "Hospital Admission Letter", "Doctor's Report", "Financial Evidence", "Medical Attendant Details"] }
  }
};

var currentStep = 1;
var uploadedDocs = {};
var selectedData = null;

// ============================================================
// STEP NAVIGATION
// ============================================================
function goToStep(step) {
  currentStep = step;
  [1, 2, 3].forEach(function (n) {
    document.getElementById('step' + n).style.display = n === step ? 'block' : 'none';
  });
  document.querySelectorAll('.step-item').forEach(function (el, i) {
    var n = i + 1;
    el.classList.toggle('active', n === step);
    el.classList.toggle('done', n < step);
  });
  document.getElementById('line1').classList.toggle('done', step > 1);
  document.getElementById('line2').classList.toggle('done', step > 2);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function validateStep1() {
  var errors = [];
  var type = document.getElementById('visaType').value;
  var country = document.getElementById('country').value;
  var fullName = document.getElementById('fullName').value.trim();
  var nationality = document.getElementById('nationality').value.trim();
  var email = document.getElementById('email').value.trim();
  var phone = document.getElementById('phone').value.trim();
  var passport = document.getElementById('passport').value.trim();
  var exp = document.getElementById('passportExpiry').value;
  var start = document.getElementById('travelStart').value;
  var end = document.getElementById('travelEnd').value;

  if (!type) errors.push('Please select a visa type');
  if (!country) errors.push('Please select a destination country');
  if (fullName.length < 3) errors.push('Enter the full name as printed in the passport');
  if (!nationality) errors.push('Enter your nationality');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Enter a valid email address');
  if (!/^\+?[0-9\s-]{10,15}$/.test(phone)) errors.push('Enter a valid phone number');
  if (!/^[A-Za-z]{1,2}[0-9]{6,9}$/.test(passport)) errors.push('Enter a valid passport number (e.g. M1234567)');
  if (!exp) errors.push('Select the passport expiry date');
  if (!start || !end) errors.push('Select planned arrival and departure dates');
  if (start && end && new Date(end) <= new Date(start)) errors.push('Departure date must be after arrival date');
  if (exp) {
    var expDate = new Date(exp);
    var need = new Date();
    need.setMonth(need.getMonth() + 6);
    if (expDate < need) errors.push('Passport must be valid for at least 6 months');
  }

  showVisaError(errors);
  return errors.length === 0;
}

function nextStep() {
  if (currentStep === 1) {
    if (validateStep1()) goToStep(2);
  } else if (currentStep === 2) {
    goToStep(3);
  }
}

function prevStep() {
  goToStep(currentStep - 1);
}

// ============================================================
// DATA LOADING
// ============================================================
function populateCountries() {
  var visaType = document.getElementById('visaType').value;
  var countrySelect = document.getElementById('country');
  countrySelect.innerHTML = '<option value="">-- Select Country --</option>';

  if (visaType && visaData[visaType]) {
    Object.keys(visaData[visaType]).sort().forEach(function (country) {
      var opt = document.createElement('option');
      opt.value = country;
      opt.textContent = country;
      countrySelect.appendChild(opt);
    });
  }

  document.getElementById('visaInfoCard').classList.remove('visible');
  selectedData = null;
  updateReview();
}

function showCountryInfo() {
  var type = document.getElementById('visaType').value;
  var country = document.getElementById('country').value;
  var card = document.getElementById('visaInfoCard');

  if (type && country && visaData[type] && visaData[type][country]) {
    var d = visaData[type][country];
    selectedData = { docs: d.docs, fee: d.fee, process: d.process, validity: d.validity, stay: d.stay, country: country, type: type };
    document.getElementById('infoFee').textContent = d.fee === 0 ? 'Free' : '₹' + d.fee.toLocaleString('en-IN');
    document.getElementById('infoProcessing').textContent = d.process === 0 ? 'Same day' : d.process + ' days';
    document.getElementById('infoValidity').textContent = d.validity;
    document.getElementById('infoStay').textContent = d.stay;
    card.classList.add('visible');
    generateDocumentFields();
  } else {
    card.classList.remove('visible');
    document.getElementById('documentsContainer').innerHTML = '';
  }
  updateReview();
}

// ============================================================
// DOCUMENT CHECKLIST
// ============================================================
function generateDocumentFields() {
  var container = document.getElementById('documentsContainer');
  container.innerHTML = '';
  uploadedDocs = {};

  if (!selectedData) return;

  selectedData.docs.forEach(function (docName, idx) {
    var item = document.createElement('div');
    item.className = 'doc-item';
    item.id = 'doc-item-' + idx;

    item.innerHTML =
      '<div class="doc-icon"><i class="fas fa-file-pdf"></i></div>' +
      '<div class="doc-body">' +
        '<div class="doc-name">' + docName + '</div>' +
        '<div class="doc-file">Not attached yet</div>' +
      '</div>' +
      '<button type="button" class="doc-upload-btn" data-idx="' + idx + '">' +
        '<i class="fas fa-upload"></i> <span>Upload</span>' +
      '</button>' +
      '<input type="file" id="doc-input-' + idx + '" accept=".pdf,.jpg,.png,.jpeg" data-idx="' + idx + '">';

    container.appendChild(item);
  });

  container.querySelectorAll('.doc-upload-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.getElementById('doc-input-' + btn.dataset.idx).click();
    });
  });

  container.querySelectorAll('input[type="file"]').forEach(function (input) {
    input.addEventListener('change', function () {
      var file = input.files[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) {
        showToast('File too large (max 5MB): ' + file.name, 'error');
        input.value = '';
        return;
      }
      uploadedDocs[input.dataset.idx] = file.name;
      var item = document.getElementById('doc-item-' + input.dataset.idx);
      item.classList.add('uploaded');
      item.querySelector('.doc-file').textContent = '✓ ' + file.name + ' (' + (file.size / 1024).toFixed(0) + ' KB)';
      item.querySelector('.doc-upload-btn span').textContent = 'Change';
      updateReview();
    });
  });
}

// ============================================================
// REVIEW + SUBMIT
// ============================================================
function updateReview() {
  document.getElementById('rsType').textContent = document.getElementById('visaType').value || '—';
  document.getElementById('rsCountry').textContent = document.getElementById('country').value || '—';
  var d = selectedData;
  document.getElementById('rsFee').textContent = d ? (d.fee === 0 ? 'Free' : '₹' + d.fee.toLocaleString('en-IN')) : '—';
  document.getElementById('rsName').textContent = document.getElementById('fullName').value.trim() || '—';
  document.getElementById('rsNat').textContent = document.getElementById('nationality').value.trim() || '—';
  document.getElementById('rsEmail').textContent = document.getElementById('email').value.trim() || '—';
  document.getElementById('rsPhone').textContent = document.getElementById('phone').value.trim() || '—';
  document.getElementById('rsPassport').textContent = document.getElementById('passport').value.trim() || '—';
  var s = document.getElementById('travelStart').value;
  var e = document.getElementById('travelEnd').value;
  document.getElementById('rsDates').textContent = (s && e) ? s + ' -> ' + e : '—';
  document.getElementById('rsDocs').textContent = Object.keys(uploadedDocs).length + ' / ' + (selectedData ? selectedData.docs.length : 0) + ' attached';
}

function sanitize(str) {
  var div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function showVisaError(errors) {
  var box = document.getElementById('visaErrorBox');
  if (!box) return;
  if (!errors.length) {
    box.innerHTML = '';
    return;
  }
  box.innerHTML = '<strong><i class="fas fa-exclamation-circle"></i> Please fix the following:</strong><ul>' +
    errors.map(function (e) { return '<li>' + e + '</li>'; }).join('') + '</ul>';
}

// ============================================================
// SUBMIT
// ============================================================
document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('visaForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      submitVisa();
    });
  }

  populateCountries();

  var typeSel = document.getElementById('visaType');
  var countrySel = document.getElementById('country');
  if (typeSel) typeSel.addEventListener('change', populateCountries);
  if (countrySel) countrySel.addEventListener('change', showCountryInfo);

  var today = new Date();
  var todayStr = today.toISOString().split('T')[0];
  var startField = document.getElementById('travelStart');
  var endField = document.getElementById('travelEnd');
  if (startField) startField.min = todayStr;
  if (startField) {
    startField.addEventListener('change', function () {
      if (endField) endField.min = this.value;
    });
  }

  var storedUser = localStorage.getItem('star_user');
  if (storedUser) {
    try {
      var user = JSON.parse(storedUser);
      var nameInput = document.getElementById('fullName');
      var emailInput = document.getElementById('email');
      if (nameInput && !nameInput.value) nameInput.value = user.name || '';
      if (emailInput && !emailInput.value) emailInput.value = user.email || '';
    } catch (e) {}
  }
});

function submitVisa() {
  var attached = Object.keys(uploadedDocs).length;
  if (selectedData && attached < selectedData.docs.length) {
    showToast('Please attach all required documents before submitting.', 'error');
    goToStep(2);
    return;
  }

  var token = localStorage.getItem('star_token');
  if (!token) {
    showVisaError(['You must be logged in to apply for a visa. Please login from the menu.']);
    showToast('You must be logged in to apply for a visa.', 'error');
    return false;
  }

  var start = document.getElementById('travelStart').value;
  var end = document.getElementById('travelEnd').value;

  var application = {
    visaType: sanitize(document.getElementById('visaType').value),
    country: sanitize(document.getElementById('country').value),
    fullName: sanitize(document.getElementById('fullName').value.trim()),
    nationality: sanitize(document.getElementById('nationality').value.trim()),
    email: sanitize(document.getElementById('email').value.trim()),
    phone: sanitize(document.getElementById('phone').value.trim()),
    passport: sanitize(document.getElementById('passport').value.trim()),
    passportExpiry: document.getElementById('passportExpiry').value,
    travelDates: start + ' to ' + end,
    documents: Object.keys(uploadedDocs).map(function (k) { return uploadedDocs[k]; }),
    fee: selectedData ? selectedData.fee : 0,
    processingDays: selectedData ? selectedData.process : null
  };

  var btn = document.getElementById('submitVisaBtn');
  var originalText = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
  btn.disabled = true;

  fetch('http://localhost:5000/api/visas', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify(application)
  })
    .then(function (res) { return res.json().then(function (data) { return { ok: res.ok, data: data }; }); })
    .then(function (r) {
      if (!r.ok) throw new Error(r.data.error || 'Failed to submit application');
      showVisaSuccess(r.data.visa);
    })
    .catch(function (err) {
      showToast(err.message, 'error');
      showVisaError([err.message]);
    })
    .then(function () {
      btn.innerHTML = originalText;
      btn.disabled = false;
    });

  return false;
}

function showVisaSuccess(application) {
  window.lastVisa = application;
  var form = document.getElementById('visaForm');
  if (!form) return;

  var feeText = application.fee ? '₹' + Number(application.fee).toLocaleString('en-IN') : 'Free';
  var appId = application._id || application.id;

  form.innerHTML =
    '<div class="success-card">' +
      '<div class="success-icon">&#9989;</div>' +
      '<h2>Application Submitted</h2>' +
      '<p>Thank you, <strong>' + application.fullName + '</strong>.</p>' +
      '<p>Your <strong>' + application.visaType + '</strong> visa application for <strong>' + application.country + '</strong> has been received.</p>' +
      '<div class="app-id">Application ID: ' + appId + '</div>' +
      '<p><strong>Visa fee:</strong> ' + feeText +
      (application.processingDays ? ' &nbsp;&bull;&nbsp; <strong>Processing:</strong> approx. ' + application.processingDays + ' days' : '') + '</p>' +
      '<p>Track your application status anytime from your <a href="dashboard.html" style="color:var(--primary);font-weight:700;">Dashboard</a>.</p>' +
      '<button onclick="downloadVisaInvoice()" class="btn">&#128196; Download Invoice</button>' +
      '<br><a href="index.html" class="btn-home">&larr; Back to Home</a>' +
    '</div>';
}

// ============================================================
// INVOICE (PDF)
// ============================================================
function downloadVisaInvoice() {
  var app = window.lastVisa;
  if (!app) return;
  var appId = app._id || app.id;
  var appDate = app.createdAt || app.timestamp || new Date().toISOString();

  var el = document.createElement('div');
  el.innerHTML =
    '<div style="padding:40px;font-family:Arial,sans-serif;max-width:800px;margin:0 auto;color:#333;">' +
      '<div style="text-align:center;border-bottom:3px solid #003366;padding-bottom:20px;margin-bottom:30px;">' +
        '<h1 style="color:#003366;margin:0;font-size:28px;">ST&#9733;R Tours &amp; Travels</h1>' +
        '<p style="color:#666;margin:5px 0;">Your journey begins with us</p>' +
      '</div>' +
      '<h2 style="color:#003366;">Visa Application Invoice</h2>' +
      '<table style="width:100%;border-collapse:collapse;margin-bottom:20px;">' +
        '<tr><td style="padding:6px 10px;width:150px;"><strong>Application ID:</strong></td><td style="padding:6px 10px;">' + appId + '</td></tr>' +
        '<tr><td style="padding:6px 10px;"><strong>Date:</strong></td><td style="padding:6px 10px;">' + new Date(appDate).toLocaleDateString() + '</td></tr>' +
        '<tr><td style="padding:6px 10px;"><strong>Status:</strong></td><td style="padding:6px 10px;">' + (app.status || 'pending').charAt(0).toUpperCase() + (app.status || 'pending').slice(1) + '</td></tr>' +
      '</table>' +
      '<h3 style="color:#003366;border-bottom:1px solid #ddd;padding-bottom:5px;">Applicant Details</h3>' +
      '<table style="width:100%;border-collapse:collapse;margin-bottom:20px;">' +
        '<tr><td style="padding:6px 10px;width:150px;"><strong>Full Name:</strong></td><td style="padding:6px 10px;">' + (app.fullName || '') + '</td></tr>' +
        '<tr><td style="padding:6px 10px;"><strong>Email:</strong></td><td style="padding:6px 10px;">' + (app.email || '') + '</td></tr>' +
        '<tr><td style="padding:6px 10px;"><strong>Phone:</strong></td><td style="padding:6px 10px;">' + (app.phone || '') + '</td></tr>' +
        '<tr><td style="padding:6px 10px;"><strong>Nationality:</strong></td><td style="padding:6px 10px;">' + (app.nationality || '') + '</td></tr>' +
        '<tr><td style="padding:6px 10px;"><strong>Passport:</strong></td><td style="padding:6px 10px;">' + (app.passport || '') + '</td></tr>' +
      '</table>' +
      '<h3 style="color:#003366;border-bottom:1px solid #ddd;padding-bottom:5px;">Visa Details</h3>' +
      '<table style="width:100%;border-collapse:collapse;margin-bottom:20px;">' +
        '<tr><td style="padding:6px 10px;width:150px;"><strong>Visa Type:</strong></td><td style="padding:6px 10px;">' + (app.visaType || '') + '</td></tr>' +
        '<tr><td style="padding:6px 10px;"><strong>Destination:</strong></td><td style="padding:6px 10px;">' + (app.country || '') + '</td></tr>' +
        '<tr><td style="padding:6px 10px;"><strong>Travel Dates:</strong></td><td style="padding:6px 10px;">' + (app.travelDates || '') + '</td></tr>' +
        '<tr><td style="padding:6px 10px;"><strong>Visa Fee:</strong></td><td style="padding:6px 10px;">' + (app.fee ? '₹' + Number(app.fee).toLocaleString('en-IN') : 'Free') + '</td></tr>' +
      '</table>' +
      '<div style="margin-top:40px;padding-top:20px;border-top:2px solid #003366;text-align:center;color:#999;font-size:12px;">' +
        '<p>Thank you for choosing ST&#9733;R Tours &amp; Travels!</p>' +
        '<p>This is a computer-generated invoice. Visa fees are collected by the respective embassy.</p>' +
      '</div>' +
    '</div>';
  document.body.appendChild(el);
  el.style.position = 'fixed';
  el.style.top = '0';
  el.style.left = '0';
  el.style.width = '800px';
  el.style.zIndex = '-1';
  el.style.pointerEvents = 'none';

  html2pdf().set({
    margin: [10, 10, 10, 10],
    filename: 'STAR-Visa-Invoice-' + appId + '.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, letterRendering: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  }).from(el).save().then(function () {
    document.body.removeChild(el);
  }).catch(function () {
    document.body.removeChild(el);
  });
}
