const { createHash } = require('node:crypto');

const hash = value => createHash('sha256').update(value).digest('hex');
const allowedHosts = new Set(['amprexhq.com', 'www.amprexhq.com']);

function sourceUrl(value) {
  try {
    const url = new URL(value);
    if (url.protocol === 'https:' && allowedHosts.has(url.hostname)) {
      return url.origin + url.pathname; // No query strings or form contents in event URLs.
    }
  } catch (_) {}
  return 'https://www.amprexhq.com/contact';
}

async function sendConversion(req, submission) {
  // Remains off until a server-only token and explicit enablement are configured.
  if (process.env.META_CAPI_ENABLED !== 'true' || !process.env.META_CAPI_ACCESS_TOKEN) return false;
  const user = { em: [hash(submission.email.trim().toLowerCase())] };
  const digits = submission.phone.replace(/\D/g, '');
  if (digits) user.ph = [hash(digits)];
  const headers = req.headers || {};
  if (headers['user-agent']) user.client_user_agent = headers['user-agent'];
  const forwarded = headers['x-forwarded-for'];
  if (typeof forwarded === 'string') user.client_ip_address = forwarded.split(',')[0].trim();
  const metadata = submission.metadata || {};
  for (const name of ['fbp', 'fbc']) {
    if (typeof metadata[name] === 'string' && /^fb\.\d\.\d+\.[A-Za-z0-9._-]+$/.test(metadata[name])) {
      user[name] = metadata[name].slice(0, 256);
    }
  }
  const newsletter = submission.formType === 'newsletter';
  const payload = {
    data: [{
      event_name: newsletter ? 'NewsletterSignup' : 'Lead',
      event_time: Math.floor(Date.now() / 1000),
      event_id: submission.eventId,
      action_source: 'website',
      event_source_url: sourceUrl(metadata.sourceUrl),
      user_data: user,
      custom_data: { form_type: submission.formType }
    }]
  };
  if (process.env.META_TEST_EVENT_CODE) payload.test_event_code = process.env.META_TEST_EVENT_CODE;
  const version = process.env.META_GRAPH_API_VERSION;
  if (!/^v\d+\.\d+$/.test(version || '')) {
    console.warn('[Meta CAPI] Configure META_GRAPH_API_VERSION before enabling.');
    return false;
  }
  try {
    const response = await fetch(`https://graph.facebook.com/${version}/1100681762872290/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.META_CAPI_ACCESS_TOKEN}` },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(4000)
    });
    const result = await response.json();
    if (!response.ok || result.events_received !== 1) {
      console.warn('[Meta CAPI] Event was not accepted:', response.status);
      return false;
    }
    return true;
  } catch (_) {
    // An analytics outage must never turn an already-delivered enquiry into an error.
    console.warn('[Meta CAPI] Event delivery unavailable.');
    return false;
  }
}

module.exports = { sendConversion, sourceUrl };
