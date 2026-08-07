(function() {
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

  async function submitBooking() {
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

    const bookingPayload = {
      name, email, destination, days, people, date, returnDate,
      flight, hotelType, meal, guider,
      isInternational, isLuxury,
      costs
    };

    const token = localStorage.getItem('star_token');
    if (!token) {
      showError(['You must be logged in to make a booking. Please login from the menu.']);
      return false;
    }

    const btn = document.querySelector('.submit-btn');
    const originalText = btn.textContent;
    btn.textContent = 'Processing...';
    btn.disabled = true;

    try {
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bookingPayload)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit booking');
      }

      showSuccess(data.booking);
    } catch (err) {
      showError([err.message]);
    } finally {
      btn.textContent = originalText;
      btn.disabled = false;
    }
  }

  function showError(errors) {
    const msg = document.getElementById('bookingMessage');
    if (!msg) return;
    msg.className = 'show error';
    msg.innerHTML = `<strong>Please fix the following:</strong><ul>${errors.map(e => `<li>${e}</li>`).join('')}</ul>`;
    msg.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function showSuccess(booking) {
    window.lastBooking = booking; // Need this globally for invoice download
    const form = document.querySelector('.booking-form');
    if (!form) return;
    const { costs } = booking;
    form.innerHTML = `
      <div class="success-card">
        <div class="success-icon">&#9989;</div>
        <h2>Booking Successful!</h2>
        <p>Thank you, <strong>${booking.name}</strong>. Your tour to <strong>${booking.destination}</strong> is confirmed from <strong>${booking.date}</strong> to <strong>${booking.returnDate}</strong>.</p>
        <p><strong>Travelers:</strong> ${booking.people}<br><strong>Total Cost:</strong> &#8377;${costs.totalCost.toLocaleString()}</p>
        <p><em>Booking ID: ${booking._id}</em></p>
        <button id="downloadInvoiceBtn" class="btn">&#128196; Download Invoice</button>
        <br>
        <a href="index.html" class="btn-home">&larr; Back to Home</a>
      </div>
    `;
    document.getElementById('downloadInvoiceBtn').addEventListener('click', downloadInvoice);
  }

  function downloadInvoice() {
    const booking = window.lastBooking;
    if (!booking) return;
    const { costs } = booking;

    const el = document.createElement('div');
    el.innerHTML = `
      <div style="padding:40px;font-family:Arial,sans-serif;max-width:800px;margin:0 auto;color:#333;">
        <div style="text-align:center;border-bottom:3px solid #003366;padding-bottom:20px;margin-bottom:30px;">
          <h1 style="color:#003366;margin:0;font-size:28px;">ST&#9733;R Tours &amp; Travels</h1>
          <p style="color:#666;margin:5px 0;">Your journey begins with us</p>
        </div>
        <h2 style="color:#003366;">Booking Invoice</h2>
        <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
          <tr><td style="padding:6px 10px;width:150px;"><strong>Booking ID:</strong></td><td style="padding:6px 10px;">${booking._id}</td></tr>
          <tr><td style="padding:6px 10px;"><strong>Date:</strong></td><td style="padding:6px 10px;">${new Date(booking.createdAt).toLocaleDateString()}</td></tr>
        </table>
        <h3 style="color:#003366;border-bottom:1px solid #ddd;padding-bottom:5px;">Customer Details</h3>
        <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
          <tr><td style="padding:6px 10px;width:150px;"><strong>Name:</strong></td><td style="padding:6px 10px;">${booking.name}</td></tr>
          <tr><td style="padding:6px 10px;"><strong>Email:</strong></td><td style="padding:6px 10px;">${booking.email}</td></tr>
        </table>
        <h3 style="color:#003366;border-bottom:1px solid #ddd;padding-bottom:5px;">Trip Details</h3>
        <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
          <tr><td style="padding:6px 10px;width:150px;"><strong>Destination:</strong></td><td style="padding:6px 10px;">${booking.destination}</td></tr>
          <tr><td style="padding:6px 10px;"><strong>Travel Date:</strong></td><td style="padding:6px 10px;">${booking.date}</td></tr>
          <tr><td style="padding:6px 10px;"><strong>Return Date:</strong></td><td style="padding:6px 10px;">${booking.returnDate}</td></tr>
          <tr><td style="padding:6px 10px;"><strong>Duration:</strong></td><td style="padding:6px 10px;">${booking.days} days</td></tr>
          <tr><td style="padding:6px 10px;"><strong>Travelers:</strong></td><td style="padding:6px 10px;">${booking.people}</td></tr>
          <tr><td style="padding:6px 10px;"><strong>Flight:</strong></td><td style="padding:6px 10px;">${booking.flight.charAt(0).toUpperCase() + booking.flight.slice(1)}</td></tr>
          <tr><td style="padding:6px 10px;"><strong>Hotel:</strong></td><td style="padding:6px 10px;">${booking.hotelType}</td></tr>
          <tr><td style="padding:6px 10px;"><strong>Meal:</strong></td><td style="padding:6px 10px;">${booking.meal}</td></tr>
          <tr><td style="padding:6px 10px;"><strong>Guide:</strong></td><td style="padding:6px 10px;">${booking.guider === 'yes' ? 'Yes' : 'No'}</td></tr>
        </table>
        <h3 style="color:#003366;border-bottom:1px solid #ddd;padding-bottom:5px;">Cost Breakdown</h3>
        <table style="width:100%;border-collapse:collapse;">
          <tr style="background:#003366;color:#fff;">
            <th style="padding:10px;text-align:left;">Item</th>
            <th style="padding:10px;text-align:right;">Amount</th>
          </tr>
          <tr style="border-bottom:1px solid #eee;"><td style="padding:8px 10px;">Travel Fee (${booking.days} days)</td><td style="padding:8px 10px;text-align:right;">&#8377;${costs.travelFee.toLocaleString()}</td></tr>
          <tr style="border-bottom:1px solid #eee;"><td style="padding:8px 10px;">Hotel Fee</td><td style="padding:8px 10px;text-align:right;">&#8377;${costs.hotelFee.toLocaleString()}</td></tr>
          <tr style="border-bottom:1px solid #eee;"><td style="padding:8px 10px;">Flight Fee</td><td style="padding:8px 10px;text-align:right;">&#8377;${costs.flightFee.toLocaleString()}</td></tr>
          <tr style="border-bottom:1px solid #eee;"><td style="padding:8px 10px;">Meals Fee</td><td style="padding:8px 10px;text-align:right;">&#8377;${costs.restaurantFee.toLocaleString()}</td></tr>
          ${costs.guiderFee > 0 ? '<tr style="border-bottom:1px solid #eee;"><td style="padding:8px 10px;">Guide Fee</td><td style="padding:8px 10px;text-align:right;">&#8377;' + costs.guiderFee.toLocaleString() + '</td></tr>' : ''}
          ${costs.visaFee > 0 ? '<tr style="border-bottom:1px solid #eee;"><td style="padding:8px 10px;">Visa Fee</td><td style="padding:8px 10px;text-align:right;">&#8377;' + costs.visaFee.toLocaleString() + '</td></tr>' : ''}
          ${costs.luxuryFee > 0 ? '<tr style="border-bottom:1px solid #eee;"><td style="padding:8px 10px;">Luxury Package</td><td style="padding:8px 10px;text-align:right;">&#8377;' + costs.luxuryFee.toLocaleString() + '</td></tr>' : ''}
          <tr style="background:#f0f7ff;font-weight:bold;">
            <td style="padding:12px 10px;font-size:1.1em;">Grand Total</td>
            <td style="padding:12px 10px;text-align:right;font-size:1.1em;">&#8377;${costs.totalCost.toLocaleString()}</td>
          </tr>
        </table>
        <div style="margin-top:40px;padding-top:20px;border-top:2px solid #003366;text-align:center;color:#999;font-size:12px;">
          <p>Thank you for choosing ST&#9733;R Tours &amp; Travels!</p>
          <p>This is a computer-generated invoice.</p>
        </div>
      </div>
    `;
    document.body.appendChild(el);

    const origDisplay = el.style.display;
    el.style.position = 'fixed';
    el.style.top = '0';
    el.style.left = '0';
    el.style.width = '800px';
    el.style.zIndex = '-1';
    el.style.pointerEvents = 'none';

    html2pdf().set({
      margin: [10, 10, 10, 10],
      filename: `STAR-Tours-Invoice-${booking._id}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        width: el.scrollWidth,
        height: el.scrollHeight
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }).from(el).save().then(() => {
      document.body.removeChild(el);
    }).catch((err) => {
      console.error('PDF failed:', err);
      document.body.removeChild(el);
    });
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

  // Pre-fill from URL and event listeners
  window.addEventListener('DOMContentLoaded', () => {
    // Block past dates on the travel date picker
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const dateField = document.getElementById('date');
    if (dateField) {
      dateField.min = todayStr;
      dateField.addEventListener('change', function() {
        if (this.value && this.value < todayStr) {
          if (typeof showToast === 'function') {
            showToast('Travel date cannot be in the past.', 'error');
          } else {
            alert('Travel date cannot be in the past.');
          }
          this.value = '';
          calculateReturnDate();
        }
      });
    }

    // Attach form submit
    const form = document.getElementById('bookingForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        submitBooking();
      });
    }

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
    const daysField = document.getElementById('days');
    const peopleField = document.getElementById('people');
    const intlCheck = document.getElementById('international');
    const luxuryCheck = document.getElementById('luxury');
    const flightSel = document.getElementById('flight');
    const hotelSel = document.getElementById('hotel');
    const guiderSel = document.getElementById('guider');

    if (daysField) daysField.addEventListener('input', calculateReturnDate);
    if (peopleField) peopleField.addEventListener('input', calculateCostDisplay);
    if (intlCheck) intlCheck.addEventListener('change', calculateCostDisplay);
    if (luxuryCheck) luxuryCheck.addEventListener('change', calculateCostDisplay);
    if (flightSel) flightSel.addEventListener('change', calculateCostDisplay);
    if (hotelSel) hotelSel.addEventListener('change', calculateCostDisplay);
    if (guiderSel) guiderSel.addEventListener('change', calculateCostDisplay);
    
    // Auto populate user info if logged in
    const storedUser = localStorage.getItem('star_user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        if (nameInput && !nameInput.value) nameInput.value = user.name;
        if (emailInput && !emailInput.value) emailInput.value = user.email;
      } catch(e) {}
    }
  });

})();
