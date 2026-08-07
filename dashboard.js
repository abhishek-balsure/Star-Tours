(function() {
  function sanitize(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  async function renderDashboard() {
    const token = localStorage.getItem('star_token');
    
    if (!token) {
      document.getElementById('bookingsList').innerHTML = `
        <div class="empty-state">
          <i class="fas fa-lock"></i>
          <p>Please <a href="auth.html" style="display:inline; padding:0; background:none; color:var(--accent);">login</a> to view your dashboard</p>
        </div>`;
      document.getElementById('visaList').innerHTML = `
        <div class="empty-state">
          <i class="fas fa-lock"></i>
          <p>Please <a href="auth.html" style="display:inline; padding:0; background:none; color:var(--accent);">login</a> to view your dashboard</p>
        </div>`;
      return;
    }

    try {
      // Check role for admin panel
      const meRes = await fetch('http://localhost:5000/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (meRes.ok) {
        const meData = await meRes.json();
        const stored = JSON.parse(localStorage.getItem('star_user') || '{}');
        localStorage.setItem('star_user', JSON.stringify(meData.user || stored));
        if (meData.user && meData.user.role === 'admin') {
          renderAdminPanel();
        }
      }

      // Fetch bookings
      const bookingRes = await fetch('http://localhost:5000/api/bookings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (bookingRes.ok) {
        const data = await bookingRes.json();
        renderBookings(data.bookings || []);
      }

      // Fetch visas
      const visaRes = await fetch('http://localhost:5000/api/visas', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (visaRes.ok) {
        const data = await visaRes.json();
        renderVisas(data.applications || data.visas || []);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    }
  }

  // ==================== ADMIN PANEL ====================
  function api(path, options) {
    const token = localStorage.getItem('star_token');
    return fetch('http://localhost:5000' + path, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...(options?.headers || {})
      }
    }).then(async res => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed');
      return data;
    });
  }

  async function renderAdminPanel() {
    const section = document.getElementById('adminSection');
    if (section) section.classList.add('visible');

    try {
      const stats = await api('/api/admin/stats');
      renderAdminStats(stats.stats);

      const users = await api('/api/admin/users');
      renderAdminUsers(users.users || []);

      const bookings = await api('/api/bookings');
      renderAdminBookings(bookings.bookings || []);

      const visas = await api('/api/visas');
      renderAdminVisas(visas.visas || []);

      const contacts = await api('/api/contacts');
      renderAdminContacts(contacts.contacts || []);
    } catch (err) {
      console.error('Admin panel failed:', err);
    }
  }

  function renderAdminStats(stats) {
    const el = document.getElementById('adminStats');
    if (!el) return;
    el.innerHTML = [
      { icon: 'fa-users', value: stats.users, label: 'Total Users' },
      { icon: 'fa-suitcase-rolling', value: stats.bookings, label: 'Total Bookings' },
      { icon: 'fa-passport', value: stats.visas, label: 'Visa Applications' }
    ].map(s => `
      <div class="stat-card">
        <i class="fas ${s.icon}"></i>
        <div class="stat-value">${s.value}</div>
        <div class="stat-label">${s.label}</div>
      </div>
    `).join('');
  }

  function renderAdminUsers(users) {
    const el = document.getElementById('adminUsersTable');
    if (!el) return;
    el.innerHTML = `
      <table class="admin-table">
        <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Action</th></tr></thead>
        <tbody>
          ${users.map(u => `
            <tr>
              <td>${sanitize(u.name || '-')}</td>
              <td>${sanitize(u.email || '-')}</td>
              <td>${sanitize(u.role || 'user')}</td>
              <td>${u.role !== 'admin' ? `<button class="btn-del" data-id="${u._id}">Delete</button>` : '<span style="color:var(--accent)">Admin</span>'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    el.querySelectorAll('.btn-del').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!confirm('Delete this user?')) return;
        api('/api/admin/users/' + btn.dataset.id, { method: 'DELETE' })
          .then(() => renderAdminPanel())
          .catch(err => alert(err.message));
      });
    });
  }

  function renderAdminBookings(bookings) {
    const el = document.getElementById('adminBookingsTable');
    if (!el) return;
    el.innerHTML = `
      <table class="admin-table">
        <thead><tr><th>Customer</th><th>Destination</th><th>Cost</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>
          ${bookings.map(b => {
            const cost = b.costs ? '&#8377;' + Number(b.costs.totalCost || 0).toLocaleString() : 'N/A';
            return `
              <tr>
                <td>${sanitize(b.name || '-')}</td>
                <td>${sanitize(b.destination || '-')}</td>
                <td>${cost}</td>
                <td><span class="status-badge">${sanitize(b.status || 'confirmed')}</span></td>
                <td>
                  <select class="status-select" data-id="${b._id}" data-type="booking">
                    <option value="confirmed" ${b.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                    <option value="cancelled" ${b.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                  </select>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    `;
    el.querySelectorAll('.status-select').forEach(sel => {
      sel.addEventListener('change', () => {
        api('/api/bookings/' + sel.dataset.id + '/status', {
          method: 'PUT',
          body: JSON.stringify({ status: sel.value })
        }).catch(err => alert(err.message));
      });
    });
  }

  function renderAdminVisas(visas) {
    const el = document.getElementById('adminVisasTable');
    if (!el) return;
    el.innerHTML = `
      <table class="admin-table">
        <thead><tr><th>Applicant</th><th>Country</th><th>Type</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>
          ${visas.map(v => `
            <tr>
              <td>${sanitize(v.fullName || '-')}</td>
              <td>${sanitize(v.country || '-')}</td>
              <td>${sanitize(v.visaType || '-')}</td>
              <td><span class="status-badge">${sanitize(v.status || 'pending')}</span></td>
              <td>
                <select class="status-select" data-id="${v._id}" data-type="visa">
                  <option value="pending" ${v.status === 'pending' ? 'selected' : ''}>Pending</option>
                  <option value="approved" ${v.status === 'approved' ? 'selected' : ''}>Approved</option>
                  <option value="rejected" ${v.status === 'rejected' ? 'selected' : ''}>Rejected</option>
                </select>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    el.querySelectorAll('.status-select').forEach(sel => {
      sel.addEventListener('change', () => {
        api('/api/visas/' + sel.dataset.id + '/status', {
          method: 'PUT',
          body: JSON.stringify({ status: sel.value })
        }).catch(err => alert(err.message));
      });
    });
  }

  function renderAdminContacts(contacts) {
    const el = document.getElementById('adminContactsTable');
    if (!el) return;
    if (!contacts.length) {
      el.innerHTML = '<div class="empty-state"><i class="fas fa-envelope-open"></i><p>No messages yet</p></div>';
      return;
    }
    el.innerHTML = `
      <table class="admin-table">
        <thead><tr><th>Name</th><th>Email</th><th>Subject</th><th>Message</th><th>Action</th></tr></thead>
        <tbody>
          ${contacts.map(c => `
            <tr>
              <td>${sanitize(c.name || '-')}</td>
              <td>${sanitize(c.email || '-')}</td>
              <td>${sanitize(c.subject || '-')}</td>
              <td style="max-width:280px">${sanitize(c.message || '-')}</td>
              <td><button class="btn-del" data-id="${c._id}">Delete</button></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    el.querySelectorAll('.btn-del').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!confirm('Delete this message?')) return;
        api('/api/contacts/' + btn.dataset.id, { method: 'DELETE' })
          .then(() => renderAdminPanel())
          .catch(err => alert(err.message));
      });
    });
  }

  function renderBookings(bookings) {
    const container = document.getElementById('bookingsList');
    if (!bookings.length) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-suitcase-rolling"></i>
          <p>No bookings yet</p>
          <a href="tours.html">Browse Tours</a>
        </div>
      `;
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
      
      return `
        <div class="d-card" id="booking-${id}">
          <div class="d-row"><span class="label">Booking ID</span><span class="value">${sanitize(String(id))}</span></div>
          <div class="d-row"><span class="label">Destination</span><span class="value">${dest}</span></div>
          <div class="d-row"><span class="label">Travel Date</span><span class="value">${sanitize(travelDate)}</span></div>
          <div class="d-row"><span class="label">Return Date</span><span class="value">${sanitize(returnDate)}</span></div>
          <div class="d-row"><span class="label">Travelers</span><span class="value">${sanitize(String(travelers))}</span></div>
          <div class="d-row"><span class="label">Total Cost</span><span class="value">${cost}</span></div>
          <div class="d-row"><span class="label">Status</span><span class="value"><span class="status-badge" style="background:${badgeBg}; color:${badgeColor}">${status.charAt(0).toUpperCase() + status.slice(1)}</span></span></div>
          ${status !== 'cancelled' ? `<div class="d-actions"><button class="btn-cancel" data-id="${id}" data-type="booking">Cancel</button></div>` : ''}
        </div>
      `;
    }).join('');
    
    container.querySelectorAll('.btn-cancel[data-type="booking"]').forEach(btn => {
      btn.addEventListener('click', () => cancelBooking(btn.dataset.id));
    });
  }

  function renderVisas(visas) {
    const container = document.getElementById('visaList');
    if (!visas.length) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-passport"></i>
          <p>No visa applications yet</p>
          <a href="visa.html">Apply for Visa</a>
        </div>
      `;
      return;
    }
    
    container.innerHTML = visas.map(v => {
      const id = v._id || v.id;
      const status = sanitize(v.status || 'pending');
      return `
        <div class="d-card" id="visa-${id}">
          <div class="d-row"><span class="label">Application ID</span><span class="value">${sanitize(String(id))}</span></div>
          <div class="d-row"><span class="label">Country</span><span class="value">${sanitize(v.country || 'N/A')}</span></div>
          <div class="d-row"><span class="label">Visa Type</span><span class="value">${sanitize(v.visaType || 'N/A')}</span></div>
          <div class="d-row"><span class="label">Full Name</span><span class="value">${sanitize(v.fullName || 'N/A')}</span></div>
          <div class="d-row"><span class="label">Status</span><span class="value"><span class="status-badge">${status.charAt(0).toUpperCase() + status.slice(1)}</span></span></div>
          <div class="d-actions"><button class="btn-cancel" data-id="${id}" data-type="visa">Cancel</button></div>
        </div>
      `;
    }).join('');
    
    container.querySelectorAll('.btn-cancel[data-type="visa"]').forEach(btn => {
      btn.addEventListener('click', () => deleteVisa(btn.dataset.id));
    });
  }

  async function cancelBooking(id) {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    const token = localStorage.getItem('star_token');
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${id}/cancel`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
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
      const res = await fetch(`http://localhost:5000/api/visas/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
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
