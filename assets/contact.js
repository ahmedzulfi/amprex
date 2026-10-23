/* Delegated capture handler survives Framer remounts without duplicate submissions. */
(function () {
  if (window.amprexFormsReady) return;
  window.amprexFormsReady = true;
  var pending = new WeakSet();
  function value(form, selector) {
    var field = form.querySelector(selector);
    return field ? field.value.trim() : '';
  }
  function cookie(name) {
    var match = document.cookie.split('; ').find(function (part) { return part.startsWith(name + '='); });
    return match ? match.slice(name.length + 1) : '';
  }
  function status(form, message, error) {
    var box = form.querySelector('.amprex-form-status');
    if (!box) {
      box = document.createElement('div');
      box.className = 'amprex-form-status';
      box.setAttribute('role', 'status');
      box.setAttribute('aria-live', 'polite');
      box.style.cssText = 'padding:14px 18px;border-radius:10px;font:14px/1.5 Inter,sans-serif;margin-top:16px;width:100%;box-sizing:border-box;';
      form.appendChild(box);
    }
    box.style.color = error ? '#ff8080' : '#f3ffc9';
    box.style.background = error ? 'rgba(255,80,80,.15)' : 'rgba(243,255,201,.15)';
    box.textContent = message;
  }
  document.addEventListener('submit', async function (event) {
    var form = event.target;
    if (!form || form.tagName !== 'FORM') return;
    var contact = !!form.querySelector('textarea[name="Message"], textarea[name="message"]');
    var newsletter = !contact && form.matches('form.framer-cx9ye5, footer form');
    if (!contact && !newsletter) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (pending.has(form)) return;
    if (!form.reportValidity()) return;
    var email = value(form, '[name="Email"], [name="email"], input[type="email"]');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      status(form, 'Please enter a valid email address.', true);
      return;
    }
    var formType = contact ? 'contact' : 'newsletter';
    var eventId = window.crypto && window.crypto.randomUUID ? window.crypto.randomUUID() : Date.now() + '-' + Math.random().toString(36).slice(2);
    var body = {
      name: value(form, '[name="Name"], [name="name"]'),
      email: email,
      phone: value(form, '[name="Phone number"], [name="Phone"], [name="phone"]'),
      message: value(form, 'textarea[name="Message"], textarea[name="message"]'),
      website: value(form, '[name="website"]'),
      formType: formType,
      eventId: eventId,
      metadata: { sourceUrl: location.origin + location.pathname, fbp: cookie('_fbp'), fbc: cookie('_fbc') }
    };
    var button = form.querySelector('button[type="submit"]');
    var label = button && (button.querySelector('.framer-text') || button);
    var original = label ? label.textContent : '';
    pending.add(form);
    if (button) button.disabled = true;
    if (label) label.textContent = 'Sending…';
    status(form, 'Sending…', false);
    try {
      var response = await fetch('/api/contact', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
      });
      var result = await response.json();
      if (!response.ok || !result.success || result.warning === 'SMTP_CREDENTIALS_PENDING') {
        status(form, result.error || 'Could not send. Please try again or email hello.amprex@gmail.com.', true);
        return;
      }
      // Honeypot requests receive a neutral response, but never count as conversions.
      if (result.submitted !== false && !body.website && window.amprexTracking) {
        try { window.amprexTracking.conversion(formType, result.eventId || eventId); }
        catch (_) { console.warn('Conversion tracking unavailable; enquiry was delivered.'); }
      }
      form.reset();
      status(form, result.message || (contact ? 'Thank you! Your message has been received.' : 'Thank you for subscribing!'), false);
    } catch (_) {
      status(form, 'Could not confirm delivery. Please try again or email hello.amprex@gmail.com.', true);
    } finally {
      pending.delete(form);
      if (button) button.disabled = false;
      if (label) label.textContent = original;
    }
  }, true);

  // --- NAVBAR ACTIVE HIGHLIGHT ---
  function updateActiveNavLink() {
    var rawPath = window.location.pathname.replace(/\/index\.html$/, '') || '/';
    var path = rawPath.endsWith('/') ? rawPath : (rawPath + '/');
    var navLinks = document.querySelectorAll('nav a[href]');

    navLinks.forEach(function(link) {
      var href = link.getAttribute('href');
      if (!href) return;
      var cleanHref = href.replace(/\/index\.html$/, '');
      if (!cleanHref.endsWith('/')) cleanHref += '/';

      var isMatch = false;
      if (cleanHref === '/' && (path === '/' || path === '/index.html' || path === '')) {
        isMatch = true;
      } else if (cleanHref !== '/' && path.startsWith(cleanHref)) {
        isMatch = true;
      }

      if (link.classList.contains('framer-zN2um')) {
        if (isMatch) {
          link.classList.remove('framer-v-qjlno0');
          link.classList.add('framer-v-18kcryo');
          link.dataset.framerName = 'Active';
          link.style.backgroundColor = 'var(--token-60e80955-6a00-4025-b930-d753d40d1742, rgb(47, 49, 38))';
        } else {
          link.classList.remove('framer-v-18kcryo');
          link.classList.add('framer-v-qjlno0');
          link.dataset.framerName = 'Default';
          link.style.backgroundColor = 'var(--token-ec7ead57-59a6-41b5-b190-6ec8d33ac6a4, rgba(0, 0, 0, 0))';
        }
      }
    });
  }


  function initAll() { updateActiveNavLink(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initAll);
  else initAll();
  new MutationObserver(initAll).observe(document.body, { childList: true, subtree: true });
})();
