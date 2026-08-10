// ============================================================
// COMPONENTS.JS — ST★R Tours & Travels
// Dynamically injects the Navbar and Footer into all pages.
// Includes logic for the hamburger menu, active links, and dark mode.
// ============================================================

(function () {
  // --- Navbar Template ---
  const navbarHTML = `
  <nav class="navbar">
    <div class="brand">
      <a href="index.html" style="display:flex; align-items:center; gap:14px; text-decoration:none;">
        <img loading="lazy" src="Logo/Logoo.png" alt="STAR Tours Logo">
        <span class="brand-name" style="pointer-events:none;">ＳＴ ✪ Ｒ Tours & Travels</span>
      </a>
      <button class="hamburger" aria-label="Toggle menu">
        <span></span><span></span><span></span>
      </button>
    </div>

    <ul class="nav-links" id="navbar-menu">
      <li><a href="index.html" class="nav-item" data-page="index.html"><i class="fas fa-home"></i><span>Home</span></a></li>
      <li><a href="about.html" class="nav-item" data-page="about.html"><i class="fas fa-user-friends"></i><span>About</span></a></li>
      <li><a href="gallery.html" class="nav-item" data-page="gallery.html"><i class="fas fa-images"></i><span>Gallery</span></a></li>
      <li><a href="visa.html" class="nav-item" data-page="visa.html"><i class="fas fa-passport"></i><span>Visa</span></a></li>
      <li><a href="contact.html" class="nav-item" data-page="contact.html"><i class="fas fa-envelope"></i><span>Contact</span></a></li>
      <li><a href="booking.html" class="nav-item nav-cta" data-page="booking.html"><i class="fas fa-plane-departure"></i><span>Book Now</span></a></li>
      <li><a href="dashboard.html" class="nav-item" data-page="dashboard.html"><i class="fas fa-tachometer-alt"></i><span>Dashboard</span></a></li>
      <li id="auth-link-container"></li>
      <li><button class="dark-toggle" id="darkModeToggle" aria-label="Toggle dark mode"><i class="fas fa-moon"></i></button></li>
    </ul>
  </nav>
  `;

  // --- Footer Template ---
  const footerHTML = `
  <footer class="footer">
    <div class="footer-section left">
      <img src="Logo/Logoo.png" alt="Globe Icon" />
      <span>ＳＴ ✪ Ｒ Tours and Travels</span>
      <p>Your journey begins with us.</p>
    </div>

    <div class="footer-section center">
      <h4>Quick Links</h4>
      <a href="index.html"><i class="fas fa-home"></i> Home</a>
      <a href="about.html"><i class="fas fa-user-friends"></i> About</a>
      <a href="visa.html"><i class="fas fa-passport"></i> Visa</a>
      <a href="gallery.html"><i class="fas fa-images"></i> Gallery</a>
      <a href="booking.html"><i class="fas fa-map-marked-alt"></i> Book Now</a>
      <a href="contact.html"><i class="fas fa-envelope"></i> Contact</a>
    </div>

    <div class="footer-section right">
      <h4>Contact Us</h4>
      <p><i class="fas fa-envelope"></i> info@stours.com</p>
      <p><i class="fas fa-phone-alt"></i> +91-9876543210</p>
      <div class="socials">
        <a href="https://instagram.com/abhi_balsure_033" target="_blank" title="Instagram"><i class="fab fa-instagram"></i></a><br>
        <a href="https://twitter.com" target="_blank" title="Twitter"><i class="fab fa-twitter"></i></a><br>
        <a href="https://facebook.com" target="_blank" title="Facebook"><i class="fab fa-facebook-f"></i></a>
      </div>
    </div>
  </footer>
  `;

  function initComponents() {
    // Inject Navbar
    const navbarPlaceholder = document.getElementById('navbar-placeholder');
    if (navbarPlaceholder) {
      navbarPlaceholder.innerHTML = navbarHTML;
    }

    // Inject Footer
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
      footerPlaceholder.innerHTML = footerHTML;
    }

    // --- Toast container (once) ---
    if (!document.getElementById('toastContainer')) {
      const toastWrap = document.createElement('div');
      toastWrap.id = 'toastContainer';
      toastWrap.className = 'toast-container';
      document.body.appendChild(toastWrap);
    }

    // --- Back-to-top button ---
    if (!document.getElementById('backToTop')) {
      const backTop = document.createElement('button');
      backTop.id = 'backToTop';
      backTop.setAttribute('aria-label', 'Back to top');
      backTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
      backTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      document.body.appendChild(backTop);
    } else {
      document.getElementById('backToTop').addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // Show/hide on scroll
    const backToTopEl = document.getElementById('backToTop');
    const navbar = document.querySelector('.navbar');
    const onScroll = () => {
      if (backToTopEl) backToTopEl.classList.toggle('visible', window.scrollY > 400);
      if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 10);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // --- Dynamic Auth Link ---
    const authContainer = document.getElementById('auth-link-container');
    if (authContainer) {
      const token = localStorage.getItem('star_token');
      if (token) {
        authContainer.innerHTML = '<a href="#" id="logout-btn" class="nav-item" style="color:var(--accent);">Logout</a>';
        document.getElementById('logout-btn').addEventListener('click', (e) => {
          e.preventDefault();
          localStorage.removeItem('star_token');
          localStorage.removeItem('star_user');
          window.location.href = 'index.html';
        });
      } else {
        authContainer.innerHTML = '<a href="auth.html" class="nav-item" data-page="auth.html">Login</a>';
      }
    }

    // --- Set Active Nav Link ---
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-item').forEach(link => {
      if (link.getAttribute('data-page') === currentPath) {
        link.classList.add('active');
      }
    });

    // --- Hamburger Logic ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
      hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        hamburger.classList.toggle('active');
      });

      // Close menu when link clicked (mobile UX)
      navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          navLinks.classList.remove('open');
          hamburger.classList.remove('active');
        });
      });

      // Close on outside click
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.navbar')) {
          navLinks.classList.remove('open');
          hamburger.classList.remove('active');
        }
      });
    }

    // --- Dark Mode Logic ---
    const toggle = document.getElementById('darkModeToggle');
    const icon = toggle ? toggle.querySelector('i') : null;

    function applyTheme(isDark) {
      document.body.classList.toggle('dark-mode', isDark);
      if (icon) {
        icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
      }
      localStorage.setItem('star-dark-mode', isDark ? '1' : '0');
    }

    if (localStorage.getItem('star-dark-mode') === '1') {
      applyTheme(true);
    }

    if (toggle) {
      toggle.addEventListener('click', () => {
        applyTheme(!document.body.classList.contains('dark-mode'));
      });
    }
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initComponents);
  } else {
    initComponents();
  }
})();

// ============================================================
// Global Toast Notification helper
// Usage: showToast('Message', 'success'|'error'|'info');
// ============================================================
function showToast(message, type) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const icons = { success: 'fas fa-check-circle', error: 'fas fa-exclamation-circle', info: 'fas fa-info-circle' };
  const icon = icons[type] || icons.info;

  const toast = document.createElement('div');
  toast.className = 'toast ' + (type || 'info');
  toast.innerHTML = '<i class="' + icon + '" style="margin-top:2px;"></i><span>' + message + '</span>' +
    '<button class="toast-close" aria-label="Dismiss">&times;</button>';
  container.appendChild(toast);

  const dismiss = () => {
    if (!toast.classList.contains('hide')) {
      toast.classList.add('hide');
      setTimeout(() => toast.remove(), 300);
    }
  };

  toast.querySelector('.toast-close').addEventListener('click', dismiss);
  setTimeout(dismiss, 4000);
}
window.showToast = showToast;
