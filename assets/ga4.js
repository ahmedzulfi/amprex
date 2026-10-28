/* GA4: consent first, one page view per document, no form values or user IDs. */
(function () {
  'use strict';
  if (window.amprexAnalytics) return;
  var measurementId = 'G-3GP7PB10WQ';
  var storageKey = 'amprex_analytics_consent_v1';
  var enabled = false;
  var started = false;
  var sent = new Set();
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag('consent', 'default', {
    analytics_storage: 'denied', ad_storage: 'denied',
    ad_user_data: 'denied', ad_personalization: 'denied'
  });

  function safeLocation() {
    var url = new URL(window.location.href);
    var clean = new URL(url.origin + url.pathname);
    // Preserve campaign attribution while dropping arbitrary query strings and hashes.
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'utm_id'].forEach(function (key) {
      var value = url.searchParams.get(key);
      if (value && !/@|%40/i.test(value)) clean.searchParams.set(key, value.slice(0, 200));
    });
    return clean.href;
  }
  function safeReferrer() {
    try { var url = new URL(document.referrer); return url.origin + url.pathname; }
    catch (_) { return ''; }
  }
  function start() {
    if (started) return;
    started = true;
    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      page_location: safeLocation(), page_referrer: safeReferrer(),
      allow_google_signals: false, allow_ad_personalization_signals: false
    });
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
    document.head.appendChild(script);
  }
  function readChoice() {
    try {
      var choice = JSON.parse(window.localStorage.getItem(storageKey));
      if (choice && Date.now() - choice.time < 180 * 86400000) return choice.value;
    } catch (_) {}
    return null;
  }
  function choose(value) {
    enabled = value === 'granted';
    try { window.localStorage.setItem(storageKey, JSON.stringify({ value: value, time: Date.now() })); } catch (_) {}
    window['ga-disable-' + measurementId] = !enabled;
    window.gtag('consent', 'update', { analytics_storage: enabled ? 'granted' : 'denied' });
    if (enabled) start();
    else {
      // Remove this property's analytics cookies when consent is withdrawn.
      ['_ga', '_ga_' + measurementId.slice(2).replace(/-/g, '')].forEach(function (name) {
        ['', window.location.hostname, '.amprexhq.com'].forEach(function (domain) {
          document.cookie = name + '=; Max-Age=0; path=/' + (domain ? '; domain=' + domain : '') + '; SameSite=Lax; Secure';
        });
      });
    }
    var panel = document.getElementById('amprex-analytics-consent');
    if (panel) panel.remove();
  }
  function showChoices() {
    if (document.getElementById('amprex-analytics-consent')) return;
    var panel = document.createElement('section');
    panel.id = 'amprex-analytics-consent';
    panel.setAttribute('aria-label', 'Website analytics preferences');
    panel.style.cssText = 'position:fixed;bottom:56px;left:16px;right:16px;max-width:520px;z-index:2147483647;background:#20221b;color:#fff;padding:20px;border:1px solid #747966;border-radius:12px;font:14px/1.5 Arial,sans-serif;box-shadow:0 8px 32px #0006;box-sizing:border-box';
    var text = document.createElement('p');
    text.textContent = 'Allow website analytics? With your permission, Google Analytics measures visits, traffic sources and site use. It receives no contact form details. Your choice here controls Google Analytics only.';
    text.style.margin = '0 0 14px';
    panel.appendChild(text);
    ['Allow analytics', 'Reject analytics'].forEach(function (label, index) {
      var button = document.createElement('button');
      button.type = 'button';
      button.textContent = label;
      button.style.cssText = 'padding:10px 14px;margin:4px 8px 0 0;border:1px solid #c7d19c;border-radius:6px;background:#20221b;color:#fff;font:inherit;cursor:pointer';
      button.addEventListener('click', function () { choose(index === 0 ? 'granted' : 'denied'); });
      panel.appendChild(button);
    });
    document.body.appendChild(panel);
  }
  window.amprexAnalytics = {
    conversion: function (formType, eventId) {
      if (!enabled || !eventId || sent.has(eventId)) return;
      sent.add(eventId);
      window.gtag('event', formType === 'newsletter' ? 'newsletter_signup' : 'generate_lead', {
        send_to: measurementId, form_type: formType,
        page_location: safeLocation(), page_referrer: safeReferrer()
      });
    },
    preferences: showChoices
  };
  function init() {
    var control = document.createElement('button');
    control.type = 'button';
    control.textContent = 'Analytics preferences';
    control.style.cssText = 'position:fixed;bottom:12px;left:16px;z-index:2147483646;padding:8px 12px;border:1px solid #747966;border-radius:6px;background:#20221b;color:#fff;font:12px Arial,sans-serif;cursor:pointer';
    control.addEventListener('click', showChoices);
    document.body.appendChild(control);
    var choice = readChoice();
    if (choice === 'granted' || choice === 'denied') choose(choice);
    else showChoices();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
