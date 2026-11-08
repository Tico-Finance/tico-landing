#!/usr/bin/env node
// Offline test of the course sign-in flow (no network, no real secrets): node tools/test-course-auth.js
process.env.COURSE_SECRET = 'test-secret-' + 'x'.repeat(32);
const crypto = require('crypto');
const L = require('../api/_course-lib');
const login = require('../api/course-login');
const content = require('../api/course-content');
const logout = require('../api/course-logout');

const salt = crypto.randomBytes(16).toString('hex');
const expired = crypto.randomBytes(16).toString('hex');
process.env.COURSE_USERS = JSON.stringify({
  'TICO-TEST-0001': { s: salt, h: L.hashPassword('good-pass', salt), n: 'Tester' },
  'TICO-TEST-OLD1': { s: expired, h: L.hashPassword('old-pass', expired), exp: '2020-01-01' }
});

let fails = 0;
const ok = (c, m) => { console.log((c ? 'ok   ' : 'FAIL ') + m); if (!c) fails++; };
function call(h, { method = 'POST', body, headers = {} } = {}) {
  return new Promise((resolve) => {
    const out = { headers: {}, status: 200, body: null };
    const req = { method, headers, body, socket: {} };
    const res = { setHeader: (k, v) => { out.headers[k.toLowerCase()] = v; }, status(s) { out.status = s; return this; }, json(b) { out.body = b; resolve(out); } };
    h(req, res);
  });
}
(async () => {
  let r = await call(login, { body: { code: 'TICO-TEST-0001', password: 'wrong' } });
  ok(r.status === 401 && !r.headers['set-cookie'], 'wrong password rejected, no cookie');
  r = await call(login, { body: { code: 'NOPE', password: 'good-pass' } });
  ok(r.status === 401 && r.body.error === 'bad_credentials', 'unknown code gets the same generic error');
  r = await call(login, { body: { code: 'TICO-TEST-OLD1', password: 'old-pass' } });
  ok(r.status === 401, 'expired access rejected');
  r = await call(login, { body: { code: ' tico-test-0001 ', password: 'good-pass' } });
  ok(r.status === 200 && /HttpOnly/.test(r.headers['set-cookie']) && /Secure/.test(r.headers['set-cookie']) && /SameSite=Strict/.test(r.headers['set-cookie']), 'correct login (code is case/space tolerant) sets HttpOnly+Secure+SameSite cookie');
  const cookie = r.headers['set-cookie'].split(';')[0];

  r = await call(content, { method: 'GET', headers: {} });
  ok(r.status === 401, 'content without cookie is refused');
  r = await call(content, { method: 'GET', headers: { cookie: cookie + 'x' } });
  ok(r.status === 401, 'tampered cookie is refused');
  r = await call(content, { method: 'GET', headers: { cookie } });
  ok(r.status === 200 && Array.isArray(r.body.modules) && r.body.modules.length === 7, 'valid cookie gets the 7 modules');

  const users = JSON.parse(process.env.COURSE_USERS); delete users['TICO-TEST-0001'];
  process.env.COURSE_USERS = JSON.stringify(users);
  r = await call(content, { method: 'GET', headers: { cookie } });
  ok(r.status === 401, 'revoking the code (removed from COURSE_USERS) kills the live session');

  r = await call(logout, { body: {} });
  ok(r.status === 200 && /Max-Age=0/.test(r.headers['set-cookie']), 'logout clears the cookie');
  r = await call(login, { body: { code: 'A', password: 'b' }, headers: { origin: 'https://evil.example' } });
  ok(r.status === 403, 'foreign origin is refused');

  delete process.env.COURSE_SECRET;
  r = await call(content, { method: 'GET', headers: { cookie } });
  ok(r.status === 503, 'missing configuration answers 503 (area shows "not open yet")');

  process.env.COURSE_SECRET = 'test-secret-' + 'x'.repeat(32);
  for (let i = 0; i < 9; i++) await call(login, { body: { code: 'SPAM', password: 'x' }, headers: { 'x-forwarded-for': '9.9.9.9' } });
  r = await call(login, { body: { code: 'SPAM', password: 'x' }, headers: { 'x-forwarded-for': '9.9.9.9' } });
  ok(r.status === 429, 'repeated guesses are rate limited');
  console.log(fails ? `\n${fails} FAILED` : '\nall passed');
  process.exit(fails ? 1 : 0);
})();
