(function() {
  function sanitize(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  async function renderDashboard() {
    const token = localStorage.getItem('star_token');
    
    if (!token) {
      document.getElementById('bookingsList').innerHTML = \`
        <div class="empty-state">
          <i class="fas fa-lock"></i>
          <p>Please <a href="auth.html" style="display:inline; padding:0; background:none; color:var(--accent);">login</a> to view your dashboard</p>
        </div>\`;
      document.getElementById('visaList').innerHTML = \`
        <div class="empty-state">
          <i class="fas fa-lock"></i>
          <p>Please <a href="auth.html" style="display:inline; padding:0; background:none; color:var(--accent);">login</a> to view your dashboard</p>
        </div>\`;
      return;
    }

    try {
      // Fetch bookings
      const bookingRes = await fetch('http://localhost:5000/api/bookings', {
        headers: { 'Authorization': \`Bearer \${token}\` }
      });
      if (bookingRes.ok) {
        const data = await bookingRes.json();
        renderBookings(data.bookings || []);
      }

      // Fetch visas
      const visaRes = await fetch('http://localhost:5000/api/visas', {
        headers: { 'Authorization': \`Bearer \${token}\` }
      });
      if (visaRes.ok) {
        const data = await visaRes.json();
        renderVisas(data.applications || data.visas || []);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    }
  }

  function renderBookings(bookings) {
    const container = document.getElementById('bookingsList');
    if (!bookings.length) {
      container.innerHTML = \`
        <div class="empty-state">
          <i class="fas fa-suitcase-rolling"></i>
          <p>No bookings yet</p>
          <a href="tours.html">Browse Tours</a>
        </div>
      \`;
      return;
    }
    
    container.innerHTML = bookings.map(b => {
      const cost = b.costs ? '&#8377;' + Number(b.costs.totalCost || 0).toLocaleString() : 'N/A';
      const travelDate = b.date || 'N/A';
      const returnDate = b.returnDate || 'N/A';
      const travelers = b.people || 'N/A';
      const dest = sanitize(b.destination || 'N/A');
      const status = sanitize(b.status || 'confirmed');
      const id = b._id || b.id;
      
      let badgeColor = status === 'cancelled' ? '#f44336' : '#2e7d32';
      let badgeBg = status === 'cancelled' ? '#ffebee' : '#e8f5e9';
      
      return \`
        <div class="d-card" id="booking-\${id}">
          <div class="d-row"><span class="label">Booking ID</span><span class="value">\${sanitize(String(id))}</span></div>
          <div class="d-row"><span class="label">Destination</span><span class="value">\${dest}</span></div>
          <div class="d-row"><span class="label">Travel Date</span><span class="value">\${sanitize(travelDate)}</span></div>
          <div class="d-row"><span class="label">Return Date</span><span class="value">\${sanitize(returnDate)}</span></div>
          <div class="d-row"><span class="label">Travelers</span><span class="value">\${sanitize(String(travelers))}</span></div>
          <div class="d-row"><span class="label">Total Cost</span><span class="value">\${cost}</span></div>
          <div class="d-row"><span class="label">Status</span><span class="value"><span class="status-badge" style="background:\${badgeBg}; color:\${badgeColor}">\${status.charAt(0).toUpperCase() + status.slice(1)}</span></span></div>
          \${status !== 'cancelled' ? \`<div class="d-actions"><button class="btn-cancel" data-id="\${id}" data-type="booking">Cancel</button></div>\` : ''}
        </div>
      \`;
    }).join('');
    
    container.querySelectorAll('.btn-cancel[data-type="booking"]').forEach(btn => {
      btn.addEventListener('click', () => cancelBooking(btn.dataset.id));
    });
  }

  function renderVisas(visas) {
    const container = document.getElementById('visaList');
    if (!visas.length) {
      container.innerHTML = \`
        <div class="empty-state">
          <i class="fas fa-passport"></i>
          <p>No visa applications yet</p>
          <a href="visa.html">Apply for Visa</a>
        </div>
      \`;
      return;
    }
    
    container.innerHTML = visas.map(v => {
      const id = v._id || v.id;
      const status = sanitize(v.status || 'pending');
      return \`
        <div class="d-card" id="visa-\${id}">
          <div class="d-row"><span class="label">Application ID</span><span class="value">\${sanitize(String(id))}</span></div>
          <div class="d-row"><span class="label">Country</span><span class="value">\${sanitize(v.country || 'N/A')}</span></div>
          <div class="d-row"><span class="label">Visa Type</span><span class="value">\${sanitize(v.visaType || 'N/A')}</span></div>
          <div class="d-row"><span class="label">Full Name</span><span class="value">\${sanitize(v.fullName || 'N/A')}</span></div>
          <div class="d-row"><span class="label">Status</span><span class="value"><span class="status-badge">\${status.charAt(0).toUpperCase() + status.slice(1)}</span></span></div>
          <div class="d-actions"><button class="btn-cancel" data-id="\${id}" data-type="visa">Cancel</button></div>
        </div>
      \`;
    }).join('');
    
    container.querySelectorAll('.btn-cancel[data-type="visa"]').forEach(btn => {
      btn.addEventListener('click', () => deleteVisa(btn.dataset.id));
    });
  }

  async function cancelBooking(id) {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    const token = localStorage.getItem('star_token');
    try {
      const res = await fetch(\`http://localhost:5000/api/bookings/\${id}/cancel\`, {
        method: 'PUT',
        headers: { 'Authorization': \`Bearer \${token}\` }
      });
      if (res.ok) {
        renderDashboard(); // Refresh
      } else {
        alert('Failed to cancel booking');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to server');
    }
  }

  async function deleteVisa(id) {
    if (!confirm('Are you sure you want to cancel this visa application?')) return;
    const token = localStorage.getItem('star_token');
    try {
      const res = await fetch(\`http://localhost:5000/api/visas/\${id}\`, {
        method: 'DELETE',
        headers: { 'Authorization': \`Bearer \${token}\` }
      });
      if (res.ok) {
        renderDashboard(); // Refresh
      } else {
        alert('Failed to cancel visa application');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to server');
    }
  }

  document.addEventListener('DOMContentLoaded', renderDashboard);
})();
