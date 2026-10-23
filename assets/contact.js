/**
 * Amprex Form Handler
 * Handles Contact Form and Newsletter Submissions with AJAX to /api/contact
 */
(function() {
  function getApiEndpoint() {
    return '/api/contact';
  }

  // --- CONTACT FORM HANDLER ---
  function initContactForm() {
    var forms = document.querySelectorAll('form.framer-1hifdkt, #amprex-contact-form');
    if (!forms || forms.length === 0) {
      // Fallback: search for any form that contains a Message textarea
      var textareas = document.querySelectorAll('textarea[name="Message"], textarea[name="message"]');
      var list = [];
      textareas.forEach(function(ta) {
        if (ta.form) list.push(ta.form);
      });
      forms = list;
    }

    forms.forEach(function(form) {
      if (form.dataset.formAttached) return;
      form.dataset.formAttached = 'true';

      var submitBtn = form.querySelector('button[type="submit"]');
      var statusBox = form.querySelector('.amprex-form-status');

      if (!statusBox) {
        statusBox = document.createElement('div');
        statusBox.className = 'amprex-form-status';
        statusBox.style.cssText = 'display:none;padding:14px 18px;border-radius:10px;font-size:14px;line-height:1.5;margin-top:16px;text-align:center;font-weight:600;font-family:Inter,sans-serif;width:100%;box-sizing:border-box;';
        form.appendChild(statusBox);
      }

      form.addEventListener('submit', async function(e) {
        e.preventDefault();
        e.stopPropagation();

        var nameInput = form.querySelector('[name="Name"], [name="name"]');
        var emailInput = form.querySelector('[name="Email"], [name="email"]');
        var phoneInput = form.querySelector('[name="Phone number"], [name="Phone"], [name="phone"]');
        var messageInput = form.querySelector('textarea[name="Message"], textarea[name="message"]');
        var honeypotInput = form.querySelector('[name="website"]');

        var name = nameInput ? nameInput.value.trim() : '';
        var email = emailInput ? emailInput.value.trim() : '';
        var phone = phoneInput ? phoneInput.value.trim() : '';
        var message = messageInput ? messageInput.value.trim() : '';
        var honeypot = honeypotInput ? honeypotInput.value.trim() : '';

        if (!email || !email.includes('@')) {
          showStatus(statusBox, 'Please provide a valid email address.', 'error');
          return;
        }

        var btnTextEl = submitBtn ? (submitBtn.querySelector('.framer-text') || submitBtn) : null;
        var originalBtnText = btnTextEl ? btnTextEl.innerText : 'Send message';

        if (submitBtn) {
          submitBtn.disabled = true;
          if (btnTextEl) btnTextEl.innerText = 'Sending...';
          submitBtn.style.opacity = '0.7';
        }

        showStatus(statusBox, 'Sending your inquiry...', 'info');

        try {
          var res = await fetch(getApiEndpoint(), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: name,
              email: email,
              phone: phone,
              message: message,
              website: honeypot,
              formType: 'contact'
            })
          });

          var data = await res.json().catch(function() { return {}; });

          if (res.ok && data.success) {
            try {
              if (typeof window.fbq === 'function') {
                window.fbq('track', 'Lead', {
                  content_name: 'Contact Form Submission',
                  form_type: 'contact'
                });
              }
            } catch (pixelErr) {
              console.warn('Meta Pixel tracking error:', pixelErr);
            }

            showStatus(statusBox, '✓ ' + (data.message || 'Thank you! Your message has been received. Our team will reach out shortly.'), 'success');
            form.reset();
            if (btnTextEl) btnTextEl.innerText = 'Sent! ✓';
            setTimeout(function() {
              if (btnTextEl) btnTextEl.innerText = originalBtnText;
              if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
              }
            }, 4000);
          } else {
            showStatus(statusBox, '⚠ ' + (data.error || 'Failed to send message. Please try again or reach out on Instagram / LinkedIn.'), 'error');
            if (btnTextEl) btnTextEl.innerText = originalBtnText;
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.style.opacity = '1';
            }
          }
        } catch (err) {
          console.error('Contact form submission error:', err);
          showStatus(statusBox, '⚠ Network error. Please verify your connection or try again shortly.', 'error');
          if (btnTextEl) btnTextEl.innerText = originalBtnText;
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
          }
        }
      });
    });
  }

  function showStatus(el, msg, type) {
    if (!el) return;
    el.style.display = 'block';
    el.innerText = msg;
    if (type === 'success') {
      el.style.background = 'rgba(243, 255, 201, 0.15)';
      el.style.border = '1px solid rgba(243, 255, 201, 0.4)';
      el.style.color = 'rgb(243, 255, 201)';
    } else if (type === 'error') {
      el.style.background = 'rgba(255, 80, 80, 0.15)';
      el.style.border = '1px solid rgba(255, 80, 80, 0.4)';
      el.style.color = '#ff8080';
    } else {
      el.style.background = 'rgba(243, 255, 201, 0.05)';
      el.style.border = '1px solid rgba(243, 255, 201, 0.2)';
      el.style.color = 'rgb(169, 173, 155)';
    }
  }

  // --- FOOTER NEWSLETTER FORMS ---
  function initFooterForms() {
    var footerForms = document.querySelectorAll('form.framer-cx9ye5, footer form');
    footerForms.forEach(function(form) {
      if (form.dataset.newsletterAttached) return;
      form.dataset.newsletterAttached = 'true';

      form.addEventListener('submit', async function(e) {
        e.preventDefault();
        e.stopPropagation();

        var emailInput = form.querySelector('input[type="email"], input[name="Email"], input[name="email"]');
        var submitBtn = form.querySelector('button[type="submit"]');
        var btnTextEl = submitBtn ? (submitBtn.querySelector('.framer-text') || submitBtn) : null;
        var email = emailInput ? emailInput.value.trim() : '';

        if (!email || !email.includes('@')) {
          alert('Please enter a valid email address.');
          return;
        }

        var origBtnText = btnTextEl ? btnTextEl.innerText : 'Subscribe';
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.style.opacity = '0.7';
          if (btnTextEl) btnTextEl.innerText = '...';
        }

        try {
          var res = await fetch(getApiEndpoint(), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: email,
              formType: 'newsletter'
            })
          });

          var data = await res.json().catch(function() { return {}; });
          if (res.ok && data.success) {
            try {
              if (typeof window.fbq === 'function') {
                window.fbq('track', 'Lead', {
                  content_name: 'Newsletter Subscription',
                  form_type: 'newsletter'
                });
              }
            } catch (pixelErr) {
              console.warn('Meta Pixel tracking error:', pixelErr);
            }
            if (emailInput) emailInput.value = '';
            if (btnTextEl) {
              btnTextEl.innerText = 'Subscribed! ✓';
              setTimeout(function() {
                btnTextEl.innerText = origBtnText;
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
              }, 4000);
            } else {
              alert('Thank you for subscribing to Amprex updates!');
            }
          } else {
            alert(data.error || 'Could not subscribe at this time. Please try again.');
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.style.opacity = '1';
              if (btnTextEl) btnTextEl.innerText = origBtnText;
            }
          }
        } catch (err) {
          console.error('Newsletter submission error:', err);
          alert('Subscription error. Please check your connection and try again.');
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
            if (btnTextEl) btnTextEl.innerText = origBtnText;
          }
        }
      });
    });
  }

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

  function initAll() {
    initContactForm();
    initFooterForms();
    updateActiveNavLink();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  // Support dynamic Framer DOM mounts
  var observer = new MutationObserver(function() {
    initAll();
  });
  if (document.body) {
    observer.observe(document.body, { childList: true, subtree: true });
  } else {
    document.addEventListener('DOMContentLoaded', function() {
      observer.observe(document.body, { childList: true, subtree: true });
    });
  }
})();
