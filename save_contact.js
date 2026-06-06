function sanitize(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function saveContact() {
  const name = sanitize(document.getElementById('name')?.value?.trim() || '');
  const email = sanitize(document.getElementById('email')?.value?.trim() || '');
  const subject = sanitize(document.getElementById('subject')?.value?.trim() || '');
  const message = sanitize(document.getElementById('message')?.value?.trim() || '');

  const errors = [];

  if (!name || name.length < 2) {
    errors.push('Please enter your name');
  }
  if (!validateEmail(email)) {
    errors.push('Please enter a valid email');
  }
  if (!message || message.length < 5) {
    errors.push('Please enter a message (at least 5 characters)');
  }

  if (errors.length > 0) {
    alert(errors.join('\n'));
    return false;
  }

  const contact = {
    id: Date.now(),
    name,
    email,
    subject,
    message,
    timestamp: new Date().toISOString()
  };

  // Save to localStorage
  const contacts = JSON.parse(localStorage.getItem('contactMessages') || '[]');
  contacts.push(contact);
  localStorage.setItem('contactMessages', JSON.stringify(contacts));

  // Show success message
  const form = document.getElementById('contactForm');
  if (form) {
    form.innerHTML = `
      <div style="background:#e6f9e6;padding:30px;border-radius:10px;text-align:center;margin:20px auto;max-width:500px;">
        <h2 style="color:#2e7d32;margin-bottom:15px;">Message Sent!</h2>
        <p>Thank you, <strong>${name}</strong>!</p>
        <p>We have received your message and will contact you soon.</p>
        <a href="index.html" style="display:inline-block;margin-top:15px;padding:10px 20px;background:#0077cc;color:white;text-decoration:none;border-radius:5px;">Back to Home</a>
      </div>
    `;
  }

  return false;
}

// For inline usage
window.saveContact = saveContact;
