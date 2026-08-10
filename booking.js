(function () {
  // ============================================================
  // DESTINATION CATALOG — daily base cost per person (INR)
  // ============================================================
  var DESTINATIONS = {
    "Goa Beach":           { daily: 4500, intl: false },
    "Rishikesh":           { daily: 3500, intl: false },
    "Manali":              { daily: 4200, intl: false },
    "Himachal":            { daily: 4200, intl: false },
    "Shimla":              { daily: 4200, intl: false },
    "Andaman":             { daily: 6500, intl: false },
    "Kerala Backwaters":   { daily: 4800, intl: false },
    "Sikkim Darjeeling":   { daily: 4500, intl: false },
    "Jaipur":              { daily: 3800, intl: false },
    "Udaipur":             { daily: 4000, intl: false },
    "Jaisalmer":           { daily: 3800, intl: false },
    "Rann of Kutch":       { daily: 4000, intl: false },
    "Mysore":              { daily: 3500, intl: false },
    "Coorg":               { daily: 3800, intl: false },
    "Varanasi":            { daily: 3600, intl: false },
    "Tawang":              { daily: 5000, intl: false },
    "Bali":                { daily: 8000, intl: true },
    "Dubai":               { daily: 9000, intl: true },
    "Thailand":            { daily: 7500, intl: true },
    "Sri Lanka":           { daily: 7000, intl: true },
    "Vietnam":             { daily: 7200, intl: true },
    "Maldives":            { daily: 15000, intl: true },
    "Singapore":           { daily: 9500, intl: true },
    "Malaysia":            { daily: 8500, intl: true },
    "Turkey":              { daily: 9000, intl: true },
    "Egypt":               { daily: 8800, intl: true },
    "Japan":               { daily: 14000, intl: true },
    "South Korea":         { daily: 12000, intl: true },
    "China":               { daily: 10000, intl: true },
    "Australia":           { daily: 15000, intl: true },
    "New Zealand":         { daily: 16000, intl: true },
    "Europe":              { daily: 13000, intl: true },
    "France":              { daily: 13000, intl: true },
    "Paris":               { daily: 13000, intl: true },
    "Switzerland":         { daily: 14500, intl: true },
    "Italy":               { daily: 12500, intl: true },
    "Rome":                { daily: 12500, intl: true },
    "Venice":              { daily: 12500, intl: true },
    "Spain":               { daily: 12000, intl: true },
    "Barcelona":           { daily: 12000, intl: true },
    "Greece":              { daily: 11000, intl: true },
    "Santorini":           { daily: 11000, intl: true },
    "Iceland":             { daily: 16000, intl: true },
    "Norway":              { daily: 15000, intl: true },
    "United Kingdom":      { daily: 14000, intl: true },
    "London":              { daily: 14000, intl: true },
    "Netherlands":         { daily: 12500, intl: true },
    "Amsterdam":           { daily: 12500, intl: true },
    "Germany":             { daily: 13000, intl: true },
    "Russia":              { daily: 11000, intl: true },
    "United States":       { daily: 16000, intl: true },
    "America":             { daily: 16000, intl: true },
    "New York City":       { daily: 16500, intl: true },
    "Canada":              { daily: 15500, intl: true },
    "Mexico":              { daily: 10000, intl: true },
    "Brazil":              { daily: 10500, intl: true },
    "Chile and Peru":      { daily: 10000, intl: true },
    "South Africa":        { daily: 9500, intl: true },
    "Cape Town":           { daily: 9500, intl: true },
    "Kenya":               { daily: 9000, intl: true },
    "Morocco":             { daily: 8500, intl: true },
    "Marrakech":           { daily: 8500, intl: true },
    "Greenland":           { daily: 17000, intl: true },
    "Egypt":               { daily: 8800, intl: true }
  };

  var HOTEL_RATES = { "3star": 1500, "4star": 2500, "5star": 4000 };
  var MEAL_RATES = { veg: 800, nonveg: 1100, both: 1400 };
  var GUIDE_RATE = 1200;
  var FLIGHT_INTERNATIONAL = { economy: 18000, business: 45000, firstclass: 75000 };
  var FLIGHT_DOMESTIC = { economy: 5500, business: 12000, firstclass: 20000 };
  var VISA_ASSIST_INTL = 8000;
  var LUXURY_RATE = 5000;
  var GST = 0.05;

  var uploadId = null;

  function sanitize(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function fmt(n) {
    return '₹' + Math.round(n).toLocaleString('en-IN');
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function getDestInfo() {
    var dest = document.getElementById('destination').value;
    return DESTINATIONS[dest] || null;
  }

  function calculateCost() {
    var days = parseInt(document.getElementById('days').value) || 1;
    var people = parseInt(document.getElementById('people').value) || 1;
    var isInternational = document.getElementById('international').checked;
    var isLuxury = document.getElementById('luxury').checked;
    var flight = document.getElementById('flight').value;
    var hotelType = document.getElementById('hotel').value;
    var meal = document.getElementById('meal').value;
    var guider = document.getElementById('guider').value;
    var dest = getDestInfo();

    var destDaily = dest ? dest.daily : (isInternational ? 8000 : 4000);

    var destFee = destDaily * days;
    var hotelFee = HOTEL_RATES[hotelType] * days;
    var flightFee = (isInternational ? FLIGHT_INTERNATIONAL[flight] : FLIGHT_DOMESTIC[flight]);
    var restaurantFee = MEAL_RATES[meal] * days;
    var guiderFee = guider === 'yes' ? GUIDE_RATE * days : 0;
    var visaFee = isInternational ? VISA_ASSIST_INTL : 0;
    var luxuryFee = isLuxury ? LUXURY_RATE * days : 0;

    var subtotalPerPerson = destFee + hotelFee + flightFee + restaurantFee + guiderFee + visaFee + luxuryFee;
    var subtotal = subtotalPerPerson * people;

    var discountPct = 0;
    if (people >= 10) discountPct = 0.10;
    else if (people >= 5) discountPct = 0.05;
    var discount = subtotal * discountPct;
    var gstAmount = (subtotal - discount) * GST;
    var totalCost = subtotal - discount + gstAmount;

    return {
      destDaily: destDaily,
      destFee: destFee,
      hotelFee: hotelFee,
      flightFee: flightFee,
      restaurantFee: restaurantFee,
      guiderFee: guiderFee,
      visaFee: visaFee,
      luxuryFee: luxuryFee,
      subtotal: subtotal,
      discount: discount,
      discountPct: discountPct,
      gst: gstAmount,
      totalPerPerson: (subtotal - discount) / people + gstAmount / people,
      totalCost: totalCost
    };
  }

  function validateForm() {
    var name = document.getElementById('name').value.trim();
    var email = document.getElementById('email').value.trim();
    var destination = document.getElementById('destination').value;
    var days = parseInt(document.getElementById('days').value) || 0;
    var people = parseInt(document.getElementById('people').value) || 0;
    var date = document.getElementById('date').value;
    var returnDate = document.getElementById('return').value;

    var errors = [];
    if (!name || name.length < 2) errors.push('Please enter a valid name');
    if (!validateEmail(email)) errors.push('Please enter a valid email address');
    if (!destination) errors.push('Please select a destination');
    if (days < 1 || days > 60) errors.push('Please enter a valid number of days (1-60)');
    if (people < 1 || people > 100) errors.push('Please enter valid number of people (1-100)');
    if (!date) errors.push('Please select a travel date');
    if (!returnDate) errors.push('Please select a return date');

    return errors;
  }

  function calculateReturnDate() {
    var travelDate = document.getElementById('date').value;
    var days = parseInt(document.getElementById('days').value);
    if (travelDate && days) {
      var startDate = new Date(travelDate);
      startDate.setDate(startDate.getDate() + days);
      var returnDate = startDate.toISOString().split('T')[0];
      var returnInput = document.getElementById('return');
      if (returnInput) returnInput.value = returnDate;
    }
    updatePriceDisplay();
  }

  function updatePriceDisplay() {
    var cost = calculateCost();
    document.getElementById('pDest').textContent = fmt(cost.destFee) + ' (' + fmt(cost.destDaily) + '/day)';
    document.getElementById('pHotel').textContent = fmt(cost.hotelFee);
    document.getElementById('pFlight').textContent = fmt(cost.flightFee);
    document.getElementById('pMeals').textContent = fmt(cost.restaurantFee);
    document.getElementById('pGuide').textContent = fmt(cost.guiderFee);
    document.getElementById('pVisa').textContent = fmt(cost.visaFee);
    document.getElementById('pLuxury').textContent = fmt(cost.luxuryFee);
    document.getElementById('pGst').textContent = fmt(cost.gst);

    var discRow = document.getElementById('discountRow');
    if (cost.discount > 0) {
      discRow.style.display = '';
      document.getElementById('pDiscount').textContent = '- ' + fmt(cost.discount) + ' (' + (cost.discountPct * 100) + '%)';
    } else {
      discRow.style.display = 'none';
    }

    document.getElementById('pTotal').textContent = fmt(cost.totalCost);
  }

  function syncInternational() {
    var dest = getDestInfo();
    var intlCheck = document.getElementById('international');
    if (dest) {
      intlCheck.checked = dest.intl;
      intlCheck.disabled = true;
      intlCheck.parentElement.style.opacity = '0.6';
    } else {
      intlCheck.disabled = false;
      intlCheck.parentElement.style.opacity = '1';
    }
    updatePriceDisplay();
  }

  async function submitBooking() {
    var errors = validateForm();
    if (errors.length > 0) {
      showError(errors);
      return false;
    }

    var dest = getDestInfo();
    var isInternational = document.getElementById('international').checked;
    var isLuxury = document.getElementById('luxury').checked;
    var name = sanitize(document.getElementById('name').value.trim());
    var email = sanitize(document.getElementById('email').value.trim());
    var destination = sanitize(document.getElementById('destination').value.trim());
    var days = parseInt(document.getElementById('days').value);
    var people = parseInt(document.getElementById('people').value);
    var date = document.getElementById('date').value;
    var returnDate = document.getElementById('return').value;
    var flight = document.getElementById('flight').value;
    var hotelType = document.getElementById('hotel').value;
    var meal = document.getElementById('meal').value;
    var guider = document.getElementById('guider').value;

    var costs = calculateCost();

    var bookingPayload = {
      name: name,
      email: email,
      destination: destination,
      days: days,
      people: people,
      date: date,
      returnDate: returnDate,
      flight: flight,
      hotelType: hotelType,
      meal: meal,
      guider: guider,
      isInternational: isInternational,
      isLuxury: isLuxury,
      costs: {
        travelFee: costs.destFee,
        hotelFee: costs.hotelFee,
        flightFee: costs.flightFee,
        restaurantFee: costs.restaurantFee,
        guiderFee: costs.guiderFee,
        visaFee: costs.visaFee,
        luxuryFee: costs.luxuryFee,
        subtotal: costs.subtotal,
        discount: costs.discount,
        gst: costs.gst,
        totalPerPerson: costs.totalPerPerson,
        totalCost: costs.totalCost
      }
    };

    var token = localStorage.getItem('star_token');
    if (!token) {
      showError(['You must be logged in to make a booking. Please login from the menu.']);
      return false;
    }

    var btn = document.getElementById('submitBtn');
    var originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    btn.disabled = true;

    try {
      var response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(bookingPayload)
      });

      var data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit booking');
      }

      showSuccess(data.booking);
    } catch (err) {
      showError([err.message]);
    } finally {
      btn.innerHTML = originalText;
      btn.disabled = false;
    }
  }

  function showError(errors) {
    var msg = document.getElementById('bookingMessage');
    if (!msg) return;
    msg.className = 'show error';
    msg.innerHTML = '<strong>Please fix the following:</strong><ul>' + errors.map(function (e) { return '<li>' + e + '</li>'; }).join('') + '</ul>';
    msg.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function showSuccess(booking) {
    window.lastBooking = booking;
    var form = document.querySelector('.booking-form');
    if (!form) return;
    var costs = booking.costs;

    form.innerHTML =
      '<div class="success-card">' +
        '<div class="success-icon">&#9989;</div>' +
        '<h2>Booking Successful!</h2>' +
        '<p>Thank you, <strong>' + booking.name + '</strong>. Your tour to <strong>' + booking.destination + '</strong> is confirmed from <strong>' + booking.date + '</strong> to <strong>' + booking.returnDate + '</strong>.</p>' +
        '<p><strong>Travelers:</strong> ' + booking.people + '<br><strong>Total Cost (incl. GST):</strong> &#8377;' + Math.round(costs.totalCost).toLocaleString('en-IN') + '</p>' +
        '<p><em>Booking ID: ' + booking._id + '</em></p>' +
        '<button id="downloadInvoiceBtn" class="btn">&#128196; Download Invoice</button>' +
        '<br><a href="dashboard.html" class="btn-home">&rarr; View in Dashboard</a>' +
      '</div>';

    document.getElementById('downloadInvoiceBtn').addEventListener('click', downloadInvoice);
  }

  function downloadInvoice() {
    var booking = window.lastBooking;
    if (!booking) return;
    var costs = booking.costs;

    var el = document.createElement('div');
    el.innerHTML =
      '<div style="padding:40px;font-family:Arial,sans-serif;max-width:800px;margin:0 auto;color:#333;">' +
        '<div style="text-align:center;border-bottom:3px solid #003366;padding-bottom:20px;margin-bottom:30px;">' +
          '<h1 style="color:#003366;margin:0;font-size:28px;">ST&#9733;R Tours &amp; Travels</h1>' +
          '<p style="color:#666;margin:5px 0;">Your journey begins with us</p>' +
        '</div>' +
        '<h2 style="color:#003366;">Booking Invoice</h2>' +
        '<table style="width:100%;border-collapse:collapse;margin-bottom:20px;">' +
          '<tr><td style="padding:6px 10px;width:150px;"><strong>Booking ID:</strong></td><td style="padding:6px 10px;">' + booking._id + '</td></tr>' +
          '<tr><td style="padding:6px 10px;"><strong>Date:</strong></td><td style="padding:6px 10px;">' + new Date(booking.createdAt).toLocaleDateString() + '</td></tr>' +
          '<tr><td style="padding:6px 10px;"><strong>Status:</strong></td><td style="padding:6px 10px;">' + (booking.status || 'confirmed') + '</td></tr>' +
        '</table>' +
        '<h3 style="color:#003366;border-bottom:1px solid #ddd;padding-bottom:5px;">Customer Details</h3>' +
        '<table style="width:100%;border-collapse:collapse;margin-bottom:20px;">' +
          '<tr><td style="padding:6px 10px;width:150px;"><strong>Name:</strong></td><td style="padding:6px 10px;">' + booking.name + '</td></tr>' +
          '<tr><td style="padding:6px 10px;"><strong>Email:</strong></td><td style="padding:6px 10px;">' + booking.email + '</td></tr>' +
        '</table>';
    el.innerHTML +=
      '<h3 style="color:#003366;border-bottom:1px solid #ddd;padding-bottom:5px;">Trip Details</h3>' +
      '<table style="width:100%;border-collapse:collapse;margin-bottom:20px;">' +
        '<tr><td style="padding:6px 10px;width:150px;"><strong>Destination:</strong></td><td style="padding:6px 10px;">' + booking.destination + '</td></tr>' +
        '<tr><td style="padding:6px 10px;"><strong>Travel Date:</strong></td><td style="padding:6px 10px;">' + booking.date + '</td></tr>' +
        '<tr><td style="padding:6px 10px;"><strong>Return Date:</strong></td><td style="padding:6px 10px;">' + booking.returnDate + '</td></tr>' +
        '<tr><td style="padding:6px 10px;"><strong>Duration:</strong></td><td style="padding:6px 10px;">' + booking.days + ' days</td></tr>' +
        '<tr><td style="padding:6px 10px;"><strong>Travelers:</strong></td><td style="padding:6px 10px;">' + booking.people + '</td></tr>' +
        '<tr><td style="padding:6px 10px;"><strong>Flight:</strong></td><td style="padding:6px 10px;">' + booking.flight.charAt(0).toUpperCase() + booking.flight.slice(1) + '</td></tr>' +
        '<tr><td style="padding:6px 10px;"><strong>Hotel:</strong></td><td style="padding:6px 10px;">' + booking.hotelType + '</td></tr>' +
        '<tr><td style="padding:6px 10px;"><strong>Meal:</strong></td><td style="padding:6px 10px;">' + booking.meal + '</td></tr>' +
        '<tr><td style="padding:6px 10px;"><strong>Guide:</strong></td><td style="padding:6px 10px;">' + (booking.guider === 'yes' ? 'Yes' : 'No') + '</td></tr>' +
      '</table>';

    function row(label, amount, bold) {
      return '<tr style="border-bottom:1px solid #eee;' + (bold ? 'background:#f0f7ff;font-weight:bold;' : '') + '">' +
        '<td style="padding:8px 10px;">' + label + '</td>' +
        '<td style="padding:8px 10px;text-align:right;">' + amount + '</td></tr>';
    }

    el.innerHTML +=
      '<h3 style="color:#003366;border-bottom:1px solid #ddd;padding-bottom:5px;">Cost Breakdown</h3>' +
      '<table style="width:100%;border-collapse:collapse;">' +
        '<tr style="background:#003366;color:#fff;"><th style="padding:10px;text-align:left;">Item</th><th style="padding:10px;text-align:right;">Amount</th></tr>' +
        row('Base Travel (' + booking.days + ' days)', '&#8377;' + Math.round(costs.travelFee).toLocaleString('en-IN')) +
        row('Hotel Fee', '&#8377;' + Math.round(costs.hotelFee).toLocaleString('en-IN')) +
        row('Flight Fee', '&#8377;' + Math.round(costs.flightFee).toLocaleString('en-IN')) +
        row('Meals Fee', '&#8377;' + Math.round(costs.restaurantFee).toLocaleString('en-IN')) +
        row('Guide Fee', '&#8377;' + Math.round(costs.guiderFee).toLocaleString('en-IN')) +
        row('Visa Assistance', '&#8377;' + Math.round(costs.visaFee).toLocaleString('en-IN')) +
        row('Luxury Package', '&#8377;' + Math.round(costs.luxuryFee).toLocaleString('en-IN')) +
        row('Subtotal', '&#8377;' + Math.round(costs.subtotal).toLocaleString('en-IN')) +
        row('Group Discount', '- &#8377;' + Math.round(costs.discount || 0).toLocaleString('en-IN')) +
        row('GST (5%)', '&#8377;' + Math.round(costs.gst || 0).toLocaleString('en-IN')) +
        row('Grand Total', '&#8377;' + Math.round(costs.totalCost).toLocaleString('en-IN'), true) +
      '</table>' +
      '<div style="margin-top:40px;padding-top:20px;border-top:2px solid #003366;text-align:center;color:#999;font-size:12px;">' +
        '<p>Thank you for choosing ST&#9733;R Tours &amp; Travels!</p>' +
        '<p>This is a computer-generated invoice.</p>' +
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
      filename: 'STAR-Tours-Invoice-' + booking._id + '.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        width: el.scrollWidth,
        height: el.scrollHeight
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }).from(el).save().then(function () {
      document.body.removeChild(el);
    }).catch(function (err) {
      console.error('PDF failed:', err);
      document.body.removeChild(el);
    });
  }

  // ============================================================
  // INIT
  // ============================================================
  function init() {
    var destSel = document.getElementById('destination');
    var sorted = Object.keys(DESTINATIONS).sort();
    sorted.forEach(function (name) {
      var opt = document.createElement('option');
      opt.value = name;
      opt.textContent = name + ' (' + (DESTINATIONS[name].intl ? 'Intl' : 'Domestic') + ')';
      destSel.appendChild(opt);
    });

    var today = new Date();
    var todayStr = today.toISOString().split('T')[0];
    var dateField = document.getElementById('date');
    if (dateField) {
      dateField.min = todayStr;
      dateField.addEventListener('change', function () {
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

    var form = document.getElementById('bookingForm');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        submitBooking();
      });
    }

    var params = new URLSearchParams(window.location.search);
    var destInput = document.getElementById('destination');
    var daysInput = document.getElementById('days');
    var dateInput = document.getElementById('date');

    if (params.has('destination') && destInput) destInput.value = params.get('destination');
    if (params.has('duration') && daysInput) daysInput.value = params.get('duration');
    if (params.has('date') && dateInput) {
      dateInput.value = params.get('date');
    }

    if (destInput) destInput.addEventListener('change', syncInternational);
    if (daysInput) daysInput.addEventListener('input', calculateReturnDate);
    document.getElementById('people').addEventListener('input', updatePriceDisplay);
    document.getElementById('international').addEventListener('change', updatePriceDisplay);
    document.getElementById('luxury').addEventListener('change', updatePriceDisplay);
    document.getElementById('flight').addEventListener('change', updatePriceDisplay);
    document.getElementById('hotel').addEventListener('change', updatePriceDisplay);
    document.getElementById('meal').addEventListener('change', updatePriceDisplay);
    document.getElementById('guider').addEventListener('change', updatePriceDisplay);

    var storedUser = localStorage.getItem('star_user');
    if (storedUser) {
      try {
        var user = JSON.parse(storedUser);
        var nameInput = document.getElementById('name');
        var emailInput = document.getElementById('email');
        if (nameInput && !nameInput.value) nameInput.value = user.name;
        if (emailInput && !emailInput.value) emailInput.value = user.email;
      } catch (e) {}
    }

    syncInternational();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
