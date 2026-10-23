const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const code = fs.readFileSync(require.resolve('../assets/tracking.js'), 'utf8');

test('reloading tracking code initializes one Pixel and one PageView per document', () => {
  const calls = [];
  const window = { fbq: (...args) => calls.push(args) };
  const context = vm.createContext({ window, Set });
  vm.runInContext(code, context);
  vm.runInContext(code, context);
  assert.equal(calls.filter(call => call[0] === 'init').length, 1);
  assert.equal(calls.filter(call => call[1] === 'PageView').length, 1);
  window.amprexTracking.conversion('contact', 'submission-123');
  window.amprexTracking.conversion('contact', 'submission-123');
  const leads = calls.filter(call => call[1] === 'Lead');
  assert.equal(leads.length, 1);
  assert.equal(leads[0][3].eventID, 'submission-123');
  window.amprexTracking.conversion('newsletter', 'newsletter-123');
  assert.equal(calls.filter(call => call[1] === 'NewsletterSignup').length, 1);
  assert.equal(calls.filter(call => call[1] === 'Lead').length, 1);
});

test('all exported pages load shared tracking once; placeholder contact links are removed', () => {
  const path = require('node:path');
  let pages = 0;
  function visit(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (['.git', 'node_modules', 'assets'].includes(entry.name)) continue;
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) visit(file);
      else if (file.endsWith('.html')) {
        const html = fs.readFileSync(file, 'utf8');
        assert.equal((html.match(/src="\/assets\/tracking\.js"/g) || []).length, 1, file);
        assert.ok(!html.includes("fbq('init'"), file);
        assert.ok(!/mailto:support@example\.com|tel:\+123|tel:\+1(?:%20| )?\(?800/.test(html), file);
        pages++;
      }
    }
  }
  visit(require('node:path').join(__dirname, '..'));
  assert.equal(pages, 28);
});
