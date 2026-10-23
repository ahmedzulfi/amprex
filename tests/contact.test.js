const test = require('node:test');
const assert = require('node:assert/strict');
const nodemailer = require('nodemailer');
const handler = require('../api/contact');
const { sourceUrl } = require('../lib/meta-conversions');

test('confirmed mail delivery gates conversions, and CAPI shares the browser event ID', async t => {
  const original = { ...process.env };
  const originalTransport = nodemailer.createTransport;
  const originalFetch = global.fetch;
  t.after(() => {
    process.env = original;
    nodemailer.createTransport = originalTransport;
    global.fetch = originalFetch;
  });
  process.env.SMTP_HOST = 'smtp.example.com';
  process.env.SMTP_USER = 'test@example.com';
  process.env.SMTP_PASS = 'test-only';
  delete process.env.META_CAPI_ENABLED;
  let mails = 0;
  let calls = [];
  let failMail = false;
  nodemailer.createTransport = () => ({ sendMail: async () => {
    if (failMail) throw new Error('Test SMTP rejection');
    mails++;
  }});
  global.fetch = async (url, options) => {
    calls.push({ url, options, payload: JSON.parse(options.body) });
    return { ok: true, json: async () => ({ events_received: 1 }) };
  };
  async function submit(body) {
    const response = { statusCode: 200, setHeader() {}, status(code) { this.statusCode = code; return this; }, json(value) { this.body = value; return this; } };
    await handler({ method: 'POST', headers: { 'user-agent': 'test-agent', 'x-forwarded-for': '192.0.2.1' }, body }, response);
    return response;
  }
  const contact = { name: 'Test', email: 'test@example.com', phone: '+12025550148', message: 'Test only', formType: 'contact', eventId: 'submission-test-123', metadata: { sourceUrl: 'https://www.amprexhq.com/contact?email=private' } };
  let result = await submit(contact);
  assert.equal(result.statusCode, 200);
  assert.equal(result.body.submitted, true);
  assert.equal(result.body.eventId, contact.eventId);
  assert.equal(mails, 1);
  assert.equal(calls.length, 0, 'CAPI remains disabled until configured');

  process.env.META_CAPI_ENABLED = 'true';
  process.env.META_CAPI_ACCESS_TOKEN = 'test-token';
  process.env.META_GRAPH_API_VERSION = 'v25.0';
  result = await submit(contact);
  assert.equal(calls.length, 1);
  const event = calls[0].payload.data[0];
  assert.equal(event.event_name, 'Lead');
  assert.equal(event.event_id, result.body.eventId);
  assert.equal(event.event_source_url, 'https://www.amprexhq.com/contact');
  assert.match(event.user_data.em[0], /^[a-f0-9]{64}$/);
  assert.ok(!JSON.stringify(event).includes('test@example.com'));

  result = await submit({ email: 'newsletter@example.com', formType: 'newsletter', eventId: 'newsletter-test-123' });
  assert.equal(result.statusCode, 200);
  assert.equal(calls.at(-1).payload.data[0].event_name, 'NewsletterSignup');

  const before = { mails, events: calls.length };
  result = await submit({ ...contact, website: 'bot spam' });
  assert.equal(result.body.submitted, false);
  result = await submit({ ...contact, email: 'bad-email' });
  assert.equal(result.statusCode, 400);
  result = await submit({ ...contact, name: {} });
  assert.equal(result.statusCode, 400);
  assert.equal(mails, before.mails);
  assert.equal(calls.length, before.events);

  failMail = true;
  result = await submit(contact);
  assert.equal(result.statusCode, 500);
  assert.equal(calls.length, before.events, 'Failed delivery must never emit CAPI');
  failMail = false;
  global.fetch = async () => { throw new Error('Meta unavailable'); };
  result = await submit(contact);
  assert.equal(result.statusCode, 200, 'A tracking outage cannot negate delivered mail');

  delete process.env.SMTP_USER;
  result = await submit(contact);
  assert.equal(result.statusCode, 503);
  assert.equal(result.body.success, false);
  assert.equal(sourceUrl('https://malicious.example/contact?x=1'), 'https://www.amprexhq.com/contact');
});
