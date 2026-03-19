function sanitize(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateForm() {
  const name = document.getElementById('name')?.value?.trim() || '';
  const email = document.getElementById('email')?.value?.trim() || '';
  const destination = document.getElementById('destination')?.value?.trim() || '';
  const days = parseInt(document.getElementById('days')?.value) || 0;
  const people = parseInt(document.getElementById('people')?.value) || 0;
  const date = document.getElementById('date')?.value || '';
  const returnDate = document.getElementById('return')?.value || '';

  const errors = [];

  if (!name || name.length < 2) errors.push('Please enter a valid name');
  if (!validateEmail(email)) errors.push('Please enter a valid email address');
  if (!destination) errors.push('Please enter a destination');
  if (days < 1 || days > 365) errors.push('Please enter valid number of days (1-365)');
  if (people < 1 || people > 100) errors.push('Please enter valid number of people (1-100)');
  if (!date) errors.push('Please select a travel date');
  if (!returnDate) errors.push('Please select a return date');

  return errors;
}

function calculateCost() {
  const days = parseInt(document.getElementById('days')?.value) || 1;
  const people = parseInt(document.getElementById('people')?.value) || 1;
  const isInternational = document.getElementById('international')?.checked || false;
  const isLuxury = document.getElementById('luxury')?.checked || false;
  const flight = document.getElementById('flight')?.value || 'economy';
  const hotelType = document.getElementById('hotel')?.value || '3star';
  const guider = document.getElementById('guider')?.value || 'no';

  let travelFee = 2000 * days;
  let guiderFee = (guider === 'yes') ? 1500 * days : 0;
  let visaFee = isInternational ? 50000 : 0;
  let luxuryFee = isLuxury ? 3000 * days : 0;
  let restaurantFee = 2000 * days;

  let hotelFee;
  switch (hotelType) {
    case '3star': hotelFee = 1500 * days; break;
    case '4star': hotelFee = 2500 * days; break;
    case '5star': hotelFee = 4000 * days; break;
    default: hotelFee = 2000 * days;
  }

  let flightFee;
  if (isInternational) {
    switch (flight) {
      case 'economy': flightFee = 10000; break;
      case 'business': flightFee = 25000; break;
      case 'firstclass': flightFee = 35000; break;
      default: flightFee = 20000;
    }
  } else {
    switch (flight) {
      case 'economy': flightFee = 5000; break;
      case 'business': flightFee = 10000; break;
      case 'firstclass': flightFee = 15000; break;
      default: flightFee = 5000;
    }
  }

  const totalPerPerson = travelFee + guiderFee + visaFee + luxuryFee + restaurantFee + hotelFee + flightFee;
  const totalCost = totalPerPerson * people;

  return { travelFee, guiderFee, visaFee, luxuryFee, restaurantFee, hotelFee, flightFee, totalPerPerson, totalCost };
}

function submitBooking() {
  const errors = validateForm();

  if (errors.length > 0) {
    showError(errors);
    return false;
  }

  const name = sanitize(document.getElementById('name').value.trim());
  const email = sanitize(document.getElementById('email').value.trim());
  const destination = sanitize(document.getElementById('destination').value.trim());
  const days = parseInt(document.getElementById('days').value);
  const people = parseInt(document.getElementById('people').value);
  const date = document.getElementById('date').value;
  const returnDate = document.getElementById('return').value;
  const isInternational = document.getElementById('international').checked;
  const isLuxury = document.getElementById('luxury').checked;
  const flight = document.getElementById('flight').value;
  const hotelType = document.getElementById('hotel').value;
  const meal = document.getElementById('meal').value;
  const guider = document.getElementById('guider').value;

  const costs = calculateCost();

  const booking = {
    id: Date.now(),
    name, email, destination, days, people, date, returnDate,
    flight, hotelType, meal, guider,
    isInternational, isLuxury,
    costs,
    timestamp: new Date().toISOString()
  };

  // Save to localStorage
  const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
  bookings.push(booking);
  localStorage.setItem('bookings', JSON.stringify(bookings));

  // Show success
  showSuccess(booking);
  return false;
}

function showError(errors) {
  const modal = document.getElementById('bookingModal');
  if (!modal) return;

  const existingError = modal.querySelector('.booking-error');
  if (existingError) existingError.remove();

  const errorDiv = document.createElement('div');
  errorDiv.className = 'booking-error';
  errorDiv.innerHTML = `
    <h2>Booking Failed</h2>
    <ul>${errors.map(e => `<li>${e}</li>`).join('')}</ul>
    <a href="#" onclick="location.reload()" class="btn-home">Try Again</a>
  `;

  modal.querySelector('.booking-form-content').prepend(errorDiv);
  modal.scrollIntoView({ behavior: 'smooth' });
}

function showSuccess(booking) {
  const modal = document.getElementById('bookingModal');
  if (!modal) return;

  const { costs } = booking;

  modal.innerHTML = `
    <div class="booking-form-content booking-success">
      <h2>Booking Successful!</h2>
      <p>Thank you, <strong>${booking.name}</strong>. Your tour to <strong>${booking.destination}</strong> is confirmed from <strong>${booking.date}</strong> to <strong>${booking.returnDate}</strong>.</p>
      <p><strong>Total People:</strong> ${booking.people}<br><strong>Total Cost:</strong> ₹${costs.totalCost.toLocaleString()}</p>
      <p><em>Booking ID: ${booking.id}</em></p>
      <a href="index.html" class="btn-home">Back to Home</a>
    </div>
  `;
}

function calculateReturnDate() {
  const travelDate = document.getElementById("date")?.value;
  const days = parseInt(document.getElementById("days")?.value);
  if (travelDate && days) {
    const startDate = new Date(travelDate);
    startDate.setDate(startDate.getDate() + days);
    const returnDate = startDate.toISOString().split('T')[0];
    const returnInput = document.getElementById("return");
    if (returnInput) returnInput.value = returnDate;
  }
  calculateCostDisplay();
}

function calculateCostDisplay() {
  const cost = calculateCost();
  const costEl = document.getElementById('estimatedCost');
  if (costEl) costEl.textContent = cost.totalCost.toLocaleString();
}

// Pre-fill from URL
window.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const destInput = document.getElementById('destination');
  const daysInput = document.getElementById('days');
  const dateInput = document.getElementById('date');

  if (params.has('destination') && destInput) destInput.value = params.get('destination');
  if (params.has('duration') && daysInput) daysInput.value = params.get('duration');
  if (params.has('date') && dateInput) {
    dateInput.value = params.get('date');
    calculateReturnDate();
  }

  // Add event listeners
  const dateField = document.getElementById('date');
  const daysField = document.getElementById('days');
  const peopleField = document.getElementById('people');
  const intlCheck = document.getElementById('international');
  const luxuryCheck = document.getElementById('luxury');
  const flightSel = document.getElementById('flight');
  const hotelSel = document.getElementById('hotel');
  const guiderSel = document.getElementById('guider');

  if (dateField) dateField.addEventListener('change', calculateReturnDate);
  if (daysField) daysField.addEventListener('input', calculateReturnDate);
  if (peopleField) peopleField.addEventListener('input', calculateCostDisplay);
  if (intlCheck) intlCheck.addEventListener('change', calculateCostDisplay);
  if (luxuryCheck) luxuryCheck.addEventListener('change', calculateCostDisplay);
  if (flightSel) flightSel.addEventListener('change', calculateCostDisplay);
  if (hotelSel) hotelSel.addEventListener('change', calculateCostDisplay);
  if (guiderSel) guiderSel.addEventListener('change', calculateCostDisplay);
});
