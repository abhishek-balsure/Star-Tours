// ============================================================
// NAVBAR.JS — ST★R Tours & Travels
// Shared navbar hamburger toggle for ALL pages.
// Include this script at the bottom of every HTML page.
// ============================================================

(function () {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    hamburger.classList.toggle('active');
  });

  // Close menu when any nav link is clicked (mobile UX)
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
    });
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar')) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
    }
  });

  // ============================================================
  // DARK MODE TOGGLE
  // ============================================================
  const toggle = document.getElementById('darkModeToggle');
  const icon = toggle ? toggle.querySelector('i') : null;

  function applyTheme(isDark) {
    document.body.classList.toggle('dark-mode', isDark);
    if (icon) {
      icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    }
    localStorage.setItem('star-dark-mode', isDark ? '1' : '0');
  }

  // Restore saved preference
  if (localStorage.getItem('star-dark-mode') === '1') {
    applyTheme(true);
  }

  if (toggle) {
    toggle.addEventListener('click', () => {
      applyTheme(!document.body.classList.contains('dark-mode'));
    });
  }
})();
