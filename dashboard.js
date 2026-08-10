(function () {
  function sanitize(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function fmt(n) {
    return '₹' + Math.round(Number(n || 0)).toLocaleString('en-IN');
  }

  function statusBadge(status) {
    var s = (status || 'pending').toLowerCase();
    var label = s.charAt(0).toUpperCase() + s.slice(1);
    return '<span class="status-badge ' + s + '">' + label + '</span>';
  }

  function getToken() {
    return localStorage.getItem('star_token');
  }

  function api(path, options) {
    return fetch('http://localhost:5000' + path, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + getToken(),
        ...(options && options.headers ? options.headers : {})
      }
    }).then(async function (res) {
      var data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed');
      return data;
    });
  }

  async function renderDashboard() {
    var token = getToken();

    var guestNote = document.getElementById('guestNote');
    var tabs = document.getElementById('dashTabs');
    var userStats = document.getElementById('userStats');

    if (!token) {
      guestNote.style.display = 'block';
      tabs.style.display = 'none';
      userStats.style.display = 'none';
      document.getElementById('tabBookings').classList.remove('active');
      document.getElementById('tabVisas').classList.remove('active');
      document.getElementById('tabWishlist').classList.remove('active');
      return;
    }

    guestNote.style.display = 'none';
    tabs.style.display = 'flex';
    userStats.style.display = 'grid';

    try {
      var meRes = await fetch('http://localhost:5000/api/auth/me', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      var userName = '';
      if (meRes.ok) {
        var meData = await meRes.json();
        var stored = JSON.parse(localStorage.getItem('star_user') || '{}');
        var user = meData.user || stored;
        localStorage.setItem('star_user', JSON.stringify(user));
        userName = user.name || 'Traveler';
        var avatar = document.getElementById('userAvatar');
        if (avatar) {
          avatar.textContent = userName.charAt(0).toUpperCase();
        }
        document.getElementById('heroName').textContent = 'Hello, ' + userName + '!';
        document.getElementById('heroSub').textContent = "Here's what's happening with your trips";
        var badge = document.getElementById('roleBadge');
        if (user.role === 'admin') {
          badge.style.display = 'inline-block';
          renderAdminPanel();
        } else {
          badge.style.display = 'none';
        }
      }

      var bookingRes = await fetch('http://localhost:5000/api/bookings', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      var bookings = [];
      if (bookingRes.ok) {
        var bookingData = await bookingRes.json();
        bookings = bookingData.bookings || [];
      }

      var visaRes = await fetch('http://localhost:5000/api/visas', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      var visas = [];
      if (visaRes.ok) {
        var visaData = await visaRes.json();
        visas = visaData.visas || visaData.applications || [];
      }

      var wishRes = await fetch('http://localhost:5000/api/wishlist', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      var wishlist = [];
      if (wishRes.ok) {
        var wishData = await wishRes.json();
        wishlist = wishData.wishlist || [];
      }

      renderUserStats(bookings, visas, wishlist);
      renderBookings(bookings);
      renderVisas(visas);
      renderWishlist(wishlist);

      document.getElementById('tabCountBookings').textContent = bookings.length;
      document.getElementById('tabCountVisas').textContent = visas.length;
      document.getElementById('tabCountWishlist').textContent = wishlist.length;

      bindTabs();
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    }
  }

  function bindTabs() {
    var tabs = document.querySelectorAll('.dash-tab');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        var panels = document.querySelectorAll('.tab-panel');
        panels.forEach(function (p) { p.classList.remove('active'); });
        var target = document.getElementById('tab' + tab.dataset.tab.charAt(0).toUpperCase() + tab.dataset.tab.slice(1));
        if (target) target.classList.add('active');
      });
    });
  }

  function renderUserStats(bookings, visas, wishlist) {
    var spent = 0;
    bookings.forEach(function (b) {
      if (b.status !== 'cancelled' && b.costs) {
        spent += Number(b.costs.totalCost || 0);
      }
    });
    document.getElementById('usBookings').textContent = bookings.length;
    document.getElementById('usSpent').textContent = fmt(spent);
    document.getElementById('usVisas').textContent = visas.length;
    document.getElementById('usWishlist').textContent = wishlist.length;
  }

  // ==================== USER: BOOKINGS ====================
  function renderBookings(bookings) {
    var container = document.getElementById('bookingsList');
    if (!bookings.length) {
      container.innerHTML =
        '<div class="empty-state">' +
          '<i class="fas fa-suitcase-rolling"></i>' +
          '<p>No bookings yet — plan your next adventure!</p>' +
          '<a href="booking.html"><i class="fas fa-plane-departure"></i> Book a Tour</a>' +
        '</div>';
      return;
    }

    container.innerHTML = bookings.map(function (b) {
      var id = b._id || b.id;
      var cost = b.costs ? fmt(b.costs.totalCost) : 'N/A';
      var status = b.status || 'confirmed';
      return '<div class="d-card" id="booking-' + id + '">' +
        '<div class="d-head">' +
          '<div><div class="d-title">' + sanitize(b.destination || 'N/A') + '</div>' +
          '<div class="d-sub">' + sanitize(String(id)) + '</div></div>' +
          statusBadge(status) +
        '</div>' +
        '<div class="d-rows">' +
          '<div class="d-row"><span class="label">Travel Date</span><span class="value">' + sanitize(b.date || 'N/A') + '</span></div>' +
          '<div class="d-row"><span class="label">Return Date</span><span class="value">' + sanitize(b.returnDate || 'N/A') + '</span></div>' +
          '<div class="d-row"><span class="label">Duration</span><span class="value">' + sanitize(String(b.days || 'N/A')) + ' days</span></div>' +
          '<div class="d-row"><span class="label">Travelers</span><span class="value">' + sanitize(String(b.people || 'N/A')) + '</span></div>' +
          '<div class="d-row"><span class="label">Total Cost</span><span class="value">' + cost + '</span></div>' +
        '</div>' +
        (status !== 'cancelled'
          ? '<div class="d-actions"><button class="btn-cancel" data-id="' + id + '" data-type="booking">Cancel</button></div>'
          : '') +
      '</div>';
    }).join('');

    container.querySelectorAll('.btn-cancel[data-type="booking"]').forEach(function (btn) {
      btn.addEventListener('click', function () { cancelBooking(btn.dataset.id); });
    });
  }

  // ==================== USER: VISAS ====================
  function renderVisas(visas) {
    var container = document.getElementById('visaList');
    if (!visas.length) {
      container.innerHTML =
        '<div class="empty-state">' +
          '<i class="fas fa-passport"></i>' +
          '<p>No visa applications yet</p>' +
          '<a href="visa.html"><i class="fas fa-file-alt"></i> Apply for a Visa</a>' +
        '</div>';
      return;
    }

    container.innerHTML = visas.map(function (v) {
      var id = v._id || v.id;
      var status = v.status || 'pending';
      return '<div class="d-card" id="visa-' + id + '">' +
        '<div class="d-head">' +
          '<div><div class="d-title">' + sanitize(v.country || 'N/A') + '</div>' +
          '<div class="d-sub">' + sanitize(v.visaType || '') + ' • ' + sanitize(String(id)) + '</div></div>' +
          statusBadge(status) +
        '</div>' +
        '<div class="d-rows">' +
          '<div class="d-row"><span class="label">Full Name</span><span class="value">' + sanitize(v.fullName || 'N/A') + '</span></div>' +
          '<div class="d-row"><span class="label">Travel Dates</span><span class="value">' + sanitize(v.travelDates || 'N/A') + '</span></div>' +
          (v.fee !== undefined ? '<div class="d-row"><span class="label">Visa Fee</span><span class="value">' + (Number(v.fee) === 0 ? 'Free' : fmt(v.fee)) + '</span></div>' : '') +
          (v.processingDays ? '<div class="d-row"><span class="label">Processing</span><span class="value">~' + sanitize(String(v.processingDays)) + ' days</span></div>' : '') +
        '</div>' +
        '<div class="d-actions"><button class="btn-remove" data-id="' + id + '" data-type="visa">Cancel Application</button></div>' +
      '</div>';
    }).join('');

    container.querySelectorAll('.btn-remove[data-type="visa"]').forEach(function (btn) {
      btn.addEventListener('click', function () { deleteVisa(btn.dataset.id); });
    });
  }

  // ==================== USER: WISHLIST ====================
  function renderWishlist(wishlist) {
    var container = document.getElementById('wishlistList');
    if (!wishlist.length) {
      container.innerHTML =
        '<div class="empty-state">' +
          '<i class="fas fa-heart"></i>' +
          '<p>Your wishlist is empty — save destinations you love!</p>' +
          '<a href="index.html"><i class="fas fa-compass"></i> Explore Destinations</a>' +
        '</div>';
      return;
    }

    container.innerHTML = wishlist.map(function (dest) {
      return '<div class="d-card">' +
        '<div class="d-head">' +
          '<div><div class="d-title"><i class="fas fa-map-marker-alt" style="color:var(--accent);margin-right:6px;"></i>' + sanitize(dest) + '</div>' +
          '<div class="d-sub">Saved destination</div></div>' +
        '</div>' +
        '<div class="d-actions">' +
          '<a class="btn-book-small" href="booking.html?destination=' + encodeURIComponent(dest) + '"><i class="fas fa-plane-departure"></i> Book Now</a>' +
          '<button class="btn-remove" data-dest="' + encodeURIComponent(dest) + '">Remove</button>' +
        '</div>' +
      '</div>';
    }).join('');

    container.querySelectorAll('.btn-remove').forEach(function (btn) {
      btn.addEventListener('click', function () { removeWishlistItem(btn.dataset.dest); });
    });
  }

  async function removeWishlistItem(dest) {
    try {
      await api('/api/wishlist/' + encodeURIComponent(dest), { method: 'DELETE' });
      if (typeof showToast === 'function') showToast('Removed from wishlist', 'success');
      renderDashboard();
    } catch (err) {
      if (typeof showToast === 'function') showToast(err.message, 'error');
    }
  }

  async function cancelBooking(id) {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    try {
      var res = await api('/api/bookings/' + id + '/cancel', { method: 'PUT' });
      if (typeof showToast === 'function') showToast('Booking cancelled', 'info');
      renderDashboard();
    } catch (err) {
      if (typeof showToast === 'function') showToast(err.message, 'error');
    }
  }

  async function deleteVisa(id) {
    if (!confirm('Are you sure you want to cancel this visa application?')) return;
    try {
      await api('/api/visas/' + id, { method: 'DELETE' });
      if (typeof showToast === 'function') showToast('Visa application cancelled', 'info');
      renderDashboard();
    } catch (err) {
      if (typeof showToast === 'function') showToast(err.message, 'error');
    }
  }

  // ==================== ADMIN PANEL ====================
  var adminState = { users: [], bookings: [], visas: [], reviews: [], contacts: [] };

  async function renderAdminPanel() {
    var section = document.getElementById('adminSection');
    if (section) section.classList.add('visible');
    try {
      var stats = await api('/api/admin/stats');
      renderAdminStats(stats.stats);
      var users = await api('/api/admin/users');
      adminState.users = users.users || [];
      renderAdminUsers(adminState.users);
      var bookings = await api('/api/bookings');
      adminState.bookings = bookings.bookings || [];
      renderAdminBookings(adminState.bookings);
      var visas = await api('/api/visas');
      adminState.visas = visas.visas || [];
      renderAdminVisas(adminState.visas);
      var reviews = await api('/api/admin/reviews');
      adminState.reviews = reviews.reviews || [];
      renderAdminReviews(adminState.reviews);
      var contacts = await api('/api/contacts');
      adminState.contacts = contacts.contacts || [];
      renderAdminContacts(adminState.contacts);
    } catch (err) {
      console.error('Admin panel failed:', err);
    }
  }

  function renderAdminStats(stats) {
    var el = document.getElementById('adminStats');
    if (!el) return;
    var cards = [
      { icon: 'fa-users', value: stats.users, label: 'Users' },
      { icon: 'fa-suitcase-rolling', value: stats.bookings, label: 'Bookings' },
      { icon: 'fa-passport', value: stats.visas, label: 'Visa Apps' },
      { icon: 'fa-rupee-sign', value: fmt(stats.revenue), label: 'Revenue' },
      { icon: 'fa-clock', value: stats.pendingVisas, label: 'Pending Visas' },
      { icon: 'fa-check-circle', value: stats.approvedVisas, label: 'Approved Visas' },
      { icon: 'fa-star', value: stats.reviews, label: 'Reviews' },
      { icon: 'fa-envelope', value: stats.contacts, label: 'Messages' }
    ];
    el.innerHTML = cards.map(function (s) {
      return '<div class="stat-card">' +
        '<i class="fas ' + s.icon + '"></i>' +
        '<div class="stat-value">' + s.value + '</div>' +
        '<div class="stat-label">' + s.label + '</div>' +
      '</div>';
    }).join('');
  }

  function filterTable(list, query, fields) {
    var q = (query || '').toLowerCase().trim();
    if (!q) return list;
    return list.filter(function (item) {
      return fields.some(function (f) {
        return String(item[f] || '').toLowerCase().indexOf(q) !== -1;
      });
    });
  }

  function renderAdminUsers(users) {
    var el = document.getElementById('adminUsersTable');
    if (!el) return;
    el.innerHTML =
      '<table class="admin-table">' +
        '<thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Action</th></tr></thead>' +
        '<tbody>' +
          users.map(function (u) {
            var joined = u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-';
            return '<tr>' +
              '<td>' + sanitize(u.name || '-') + '</td>' +
              '<td>' + sanitize(u.email || '-') + '</td>' +
              '<td>' + sanitize(u.role || 'user') + '</td>' +
              '<td>' + joined + '</td>' +
              '<td>' + (u.role !== 'admin' ? '<button class="btn-del" data-id="' + u._id + '">Delete</button>' : '<span class="admin-chip">Admin</span>') + '</td>' +
            '</tr>';
          }).join('') +
        '</tbody>' +
      '</table>';
    el.querySelectorAll('.btn-del').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (!confirm('Delete this user?')) return;
        api('/api/admin/users/' + btn.dataset.id, { method: 'DELETE' })
          .then(function () {
            if (typeof showToast === 'function') showToast('User deleted', 'success');
            renderAdminPanel();
          })
          .catch(function (err) { if (typeof showToast === 'function') showToast(err.message, 'error'); });
      });
    });
  }

  function renderAdminBookings(bookings) {
    var el = document.getElementById('adminBookingsTable');
    if (!el) return;
    el.innerHTML =
      '<table class="admin-table">' +
        '<thead><tr><th>Customer</th><th>Destination</th><th>Travelers</th><th>Cost</th><th>Status</th><th>Action</th></tr></thead>' +
        '<tbody>' +
          bookings.map(function (b) {
            var cost = b.costs ? fmt(b.costs.totalCost) : 'N/A';
            var status = b.status || 'confirmed';
            return '<tr>' +
              '<td>' + sanitize(b.name || '-') + '</td>' +
              '<td>' + sanitize(b.destination || '-') + '</td>' +
              '<td>' + sanitize(String(b.people || '-')) + '</td>' +
              '<td>' + cost + '</td>' +
              '<td>' + statusBadge(status) + '</td>' +
              '<td>' +
                '<select class="status-select" data-id="' + b._id + '" data-type="booking">' +
                  '<option value="confirmed"' + (status === 'confirmed' ? ' selected' : '') + '>Confirmed</option>' +
                  '<option value="pending"' + (status === 'pending' ? ' selected' : '') + '>Pending</option>' +
                  '<option value="cancelled"' + (status === 'cancelled' ? ' selected' : '') + '>Cancelled</option>' +
                '</select> ' +
                '<button class="btn-del" data-id="' + b._id + '" data-del="booking">Delete</button>' +
              '</td>' +
            '</tr>';
          }).join('') +
        '</tbody>' +
      '</table>';
    bindStatusSelects(el, 'booking');
    bindDeleteButtons(el, 'booking');
  }

  function renderAdminVisas(visas) {
    var el = document.getElementById('adminVisasTable');
    if (!el) return;
    el.innerHTML =
      '<table class="admin-table">' +
        '<thead><tr><th>Applicant</th><th>Country</th><th>Type</th><th>Status</th><th>Action</th></tr></thead>' +
        '<tbody>' +
          visas.map(function (v) {
            var status = v.status || 'pending';
            return '<tr>' +
              '<td>' + sanitize(v.fullName || '-') + '</td>' +
              '<td>' + sanitize(v.country || '-') + '</td>' +
              '<td>' + sanitize(v.visaType || '-') + '</td>' +
              '<td>' + statusBadge(status) + '</td>' +
              '<td>' +
                '<select class="status-select" data-id="' + v._id + '" data-type="visa">' +
                  '<option value="pending"' + (status === 'pending' ? ' selected' : '') + '>Pending</option>' +
                  '<option value="approved"' + (status === 'approved' ? ' selected' : '') + '>Approved</option>' +
                  '<option value="rejected"' + (status === 'rejected' ? ' selected' : '') + '>Rejected</option>' +
                '</select> ' +
                '<button class="btn-del" data-id="' + v._id + '" data-del="visa">Delete</button>' +
              '</td>' +
            '</tr>';
          }).join('') +
        '</tbody>' +
      '</table>';
    bindStatusSelects(el, 'visa');
    bindDeleteButtons(el, 'visa');
  }

  function renderAdminReviews(reviews) {
    var el = document.getElementById('adminReviewsTable');
    if (!el) return;
    if (!reviews.length) {
      el.innerHTML = '<div class="empty-state"><i class="fas fa-star"></i><p>No reviews yet</p></div>';
      return;
    }
    el.innerHTML =
      '<table class="admin-table">' +
        '<thead><tr><th>User</th><th>Destination</th><th>Rating</th><th>Comment</th><th>Action</th></tr></thead>' +
        '<tbody>' +
          reviews.map(function (r) {
            var stars = '';
            var n = Number(r.rating || 0);
            for (var i = 1; i <= 5; i++) {
              stars += i <= n ? '<i class="fas fa-star" style="color:#f9c851;font-size:0.8rem;"></i>' : '<i class="far fa-star" style="color:#ccc;font-size:0.8rem;"></i>';
            }
            return '<tr>' +
              '<td>' + sanitize(r.userName || '-') + '</td>' +
              '<td>' + sanitize(r.destination || '-') + '</td>' +
              '<td>' + stars + '</td>' +
              '<td style="max-width:260px">' + sanitize(r.comment || '-') + '</td>' +
              '<td><button class="btn-del" data-id="' + r._id + '" data-del="review">Delete</button></td>' +
            '</tr>';
          }).join('') +
        '</tbody>' +
      '</table>';
    bindDeleteButtons(el, 'review');
  }

  function renderAdminContacts(contacts) {
    var el = document.getElementById('adminContactsTable');
    if (!el) return;
    if (!contacts.length) {
      el.innerHTML = '<div class="empty-state"><i class="fas fa-envelope-open"></i><p>No messages yet</p></div>';
      return;
    }
    el.innerHTML =
      '<table class="admin-table">' +
        '<thead><tr><th>Name</th><th>Email</th><th>Subject</th><th>Message</th><th>Date</th><th>Action</th></tr></thead>' +
        '<tbody>' +
          contacts.map(function (c) {
            var date = c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '-';
            return '<tr>' +
              '<td>' + sanitize(c.name || '-') + '</td>' +
              '<td>' + sanitize(c.email || '-') + '</td>' +
              '<td>' + sanitize(c.subject || '-') + '</td>' +
              '<td style="max-width:260px">' + sanitize(c.message || '-') + '</td>' +
              '<td>' + date + '</td>' +
              '<td><button class="btn-del" data-id="' + c._id + '" data-del="contact">Delete</button></td>' +
            '</tr>';
          }).join('') +
        '</tbody>' +
      '</table>';
    bindDeleteButtons(el, 'contact');
  }

  function bindStatusSelects(el, type) {
    el.querySelectorAll('.status-select').forEach(function (sel) {
      sel.addEventListener('change', function () {
        var url = type === 'booking'
          ? '/api/bookings/' + sel.dataset.id + '/status'
          : '/api/visas/' + sel.dataset.id + '/status';
        api(url, {
          method: 'PUT',
          body: JSON.stringify({ status: sel.value })
        }).then(function () {
          if (typeof showToast === 'function') showToast('Status updated', 'success');
        }).catch(function (err) {
          if (typeof showToast === 'function') showToast(err.message, 'error');
        });
      });
    });
  }

  function bindDeleteButtons(el, type) {
    el.querySelectorAll('.btn-del[data-del]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (!confirm('Delete this ' + type + '?')) return;
        var url;
        switch (type) {
          case 'booking': url = '/api/bookings/' + btn.dataset.id; break;
          case 'visa': url = '/api/visas/' + btn.dataset.id; break;
          case 'review': url = '/api/admin/reviews/' + btn.dataset.id; break;
          case 'contact': url = '/api/contacts/' + btn.dataset.id; break;
        }
        api(url, { method: 'DELETE' })
          .then(function () {
            if (typeof showToast === 'function') showToast(type.charAt(0).toUpperCase() + type.slice(1) + ' deleted', 'success');
            renderAdminPanel();
          })
          .catch(function (err) { if (typeof showToast === 'function') showToast(err.message, 'error'); });
      });
    });
  }

  function bindSearch(inputId, renderer, listKey, fields) {
    var input = document.getElementById(inputId);
    if (!input) return;
    input.addEventListener('input', function () {
      renderer(filterTable(adminState[listKey], input.value, fields));
    });
  }

  function bindAdminSearches() {
    bindSearch('searchUsers', renderAdminUsers, 'users', ['name', 'email']);
    bindSearch('searchBookings', renderAdminBookings, 'bookings', ['name', 'email', 'destination']);
    bindSearch('searchVisas', renderAdminVisas, 'visas', ['fullName', 'country', 'visaType', 'email']);
    bindSearch('searchReviews', renderAdminReviews, 'reviews', ['userName', 'destination', 'comment']);
    bindSearch('searchContacts', renderAdminContacts, 'contacts', ['name', 'email', 'subject', 'message']);
  }

  document.addEventListener('DOMContentLoaded', function () {
    bindAdminSearches();
    renderDashboard();
  });
})();
