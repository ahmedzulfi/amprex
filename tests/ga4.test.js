const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const code = fs.readFileSync(require.resolve('../assets/ga4.js'), 'utf8');

function fixture(choice) {
  const nodes = [];
  const cookies = [];
  const values = new Map();
  if (choice) values.set('amprex_analytics_consent_v1', JSON.stringify({value: choice, time: Date.now()}));
  const document = {
    readyState: 'complete', referrer: 'https://www.linkedin.com/feed/?email=private@example.com',
    createElement(tag) {
      return {tag, children: [], style: {}, setAttribute() {}, appendChild(child) { this.children.push(child); },
        addEventListener(event, fn) { this[event] = fn; }, remove() { nodes.splice(nodes.indexOf(this), 1); }};
    },
    getElementById(id) { return nodes.find(node => node.id === id); },
    head: { appendChild(node) { nodes.push(node); } },
    body: { appendChild(node) { nodes.push(node); } }
  };
  Object.defineProperty(document, 'cookie', {set(value) { cookies.push(value); }});
  const window = { location: {href: 'https://www.amprexhq.com/contact?utm_source=linkedin&utm_medium=social&email=private@example.com#secret', hostname: 'www.amprexhq.com'},
    localStorage: {getItem: key => values.get(key), setItem: (key, value) => values.set(key, value)} };
  const context = vm.createContext({window, document, URL, Date, Set});
  vm.runInContext(code, context);
  return { window, document, nodes, cookies, rerun() { vm.runInContext(code, context); }, calls() {return Array.from(window.dataLayer, args => Array.from(args));} };
}

test('no Google script or conversion before consent; rejection remains disabled', () => {
  const f = fixture();
  f.window.amprexAnalytics.conversion('contact', 'a');
  assert.equal(f.nodes.filter(n => n.tag === 'script').length, 0);
  assert.equal(f.calls().filter(c => c[0] === 'event').length, 0);
  f.document.getElementById('amprex-analytics-consent').children[2].click();
  assert.equal(f.nodes.filter(n => n.tag === 'script').length, 0);
  assert.equal(f.window['ga-disable-G-3GP7PB10WQ'], true);
});

test('consent initializes one page view and preserves attribution without private query data', () => {
  const f = fixture();
  f.document.getElementById('amprex-analytics-consent').children[1].click();
  f.rerun();
  const configs = f.calls().filter(c => c[0] === 'config');
  assert.equal(configs.length, 1);
  assert.equal(f.nodes.filter(n => n.tag === 'script').length, 1);
  assert.equal(configs[0][2].page_location, 'https://www.amprexhq.com/contact?utm_source=linkedin&utm_medium=social');
  assert.equal(configs[0][2].page_referrer, 'https://www.linkedin.com/feed/');
  assert.equal(configs[0][2].allow_google_signals, false);
  f.window.amprexAnalytics.conversion('contact', 'a');
  f.window.amprexAnalytics.conversion('contact', 'a');
  f.window.amprexAnalytics.conversion('newsletter', 'b');
  assert.deepEqual(f.calls().filter(c => c[0] === 'event').map(c => c[1]), ['generate_lead', 'newsletter_signup']);
  assert.ok(!JSON.stringify(f.calls()).includes('private@example.com'));
});

test('stored choice is respected and withdrawal prevents later conversions', () => {
  const f = fixture('granted');
  assert.equal(f.nodes.filter(n => n.tag === 'script').length, 1);
  f.window.amprexAnalytics.preferences();
  f.document.getElementById('amprex-analytics-consent').children[2].click();
  f.window.amprexAnalytics.conversion('contact', 'after-withdrawal');
  assert.equal(f.calls().filter(c => c[0] === 'event').length, 0);
  assert.ok(f.cookies.some(c => c.startsWith('_ga=;')));
  assert.equal(fixture('denied').nodes.filter(n => n.tag === 'script').length, 0);
});
