/* Local UI test server: synthetic mail only, no Meta transmissions or credentials. */
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
process.env.SMTP_HOST = 'smtp.example.com';
process.env.SMTP_USER = 'local-test@example.com';
process.env.SMTP_PASS = 'local-test';
delete process.env.META_CAPI_ENABLED;
require('nodemailer').createTransport = () => ({ sendMail: async mail => {
  if (mail.replyTo === 'fail@example.com') throw new Error('Local test: SMTP unavailable');
  console.log('LOCAL TEST MAIL', mail.subject);
}});
const handler = require('../api/contact');
const instrumentation = `<script>
window.localTrackingCalls=[];
window.fbq=function(){window.localTrackingCalls.push(Array.from(arguments));};
document.addEventListener('DOMContentLoaded',function(){
 var panel=document.createElement('pre');panel.id='local-test-events';
 panel.style.cssText='position:fixed;bottom:0;left:0;z-index:999999;background:#fff;color:#111;max-height:150px;overflow:auto;font:12px monospace;padding:8px';
 document.body.appendChild(panel);
 setInterval(function(){panel.textContent='LOCAL SIMULATION (no external mail or Meta)\\n'+JSON.stringify(window.localTrackingCalls);},200);
});</script>`;
http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1');
  if (url.pathname === '/api/contact') {
    let data = '';
    for await (const chunk of req) data += chunk;
    try { req.body = JSON.parse(data); } catch (_) { req.body = {}; }
    res.status = code => { res.statusCode = code; return res; };
    res.json = value => { res.setHeader('Content-Type','application/json'); res.end(JSON.stringify(value)); return res; };
    return handler(req, res);
  }
  let file = path.resolve(root, '.' + decodeURIComponent(url.pathname));
  if (!file.startsWith(root + path.sep) && file !== root) { res.statusCode=403; return res.end(); }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file)) { res.statusCode=404; return res.end(); }
  const types={'.html':'text/html','.js':'application/javascript','.mjs':'application/javascript','.css':'text/css','.svg':'image/svg+xml','.json':'application/json'};
  res.setHeader('Content-Type',types[path.extname(file)] || 'application/octet-stream');
  res.setHeader('Cache-Control','no-store');
  if (file.endsWith('.html')) return res.end(fs.readFileSync(file,'utf8').replace('<head>','<head>'+instrumentation));
  fs.createReadStream(file).pipe(res);
}).listen(4173,'127.0.0.1',()=>console.log('Local synthetic test site: http://127.0.0.1:4173'));
