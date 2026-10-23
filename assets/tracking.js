/* One Pixel instance per document. Form conversions are sent only after delivery. */
(function () {
  if (window.amprexTracking) return;
  var pixelId = '1100681762872290';
  var sent = new Set();
  if (!window.fbq) {
    var fbq = window.fbq = function () {
      fbq.callMethod ? fbq.callMethod.apply(fbq, arguments) : fbq.queue.push(arguments);
    };
    window._fbq = fbq;
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = '2.0';
    fbq.queue = [];
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://connect.facebook.net/en_US/fbevents.js';
    document.head.appendChild(script);
  }
  window.amprexTracking = {
    conversion: function (formType, eventId) {
      if (!eventId || sent.has(eventId)) return;
      sent.add(eventId);
      var newsletter = formType === 'newsletter';
      window.fbq(newsletter ? 'trackCustom' : 'track', newsletter ? 'NewsletterSignup' : 'Lead', {
        content_name: newsletter ? 'Newsletter Subscription' : 'Contact Form Submission',
        form_type: formType
      }, { eventID: eventId });
    }
  };
  window.fbq('init', pixelId);
  window.fbq('track', 'PageView');
})();
