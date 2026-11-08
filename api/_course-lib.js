// Shared helpers for the course member area (code + password sign-in, signed cookie session).
//
// Env vars (Vercel -> Settings -> Environment Variables):
//   COURSE_SECRET   required: long random string used to sign session cookies
//   COURSE_USERS    required: JSON object  { "<CODE>": { "s": "<salt hex>", "h": "<scrypt hash hex>", "n": "<name, optional>", "exp": "<YYYY-MM-DD, optional>" } }
//                   Create entries with:  node tools/course-access.js "<name>"
// Removing an entry from COURSE_USERS (and redeploying) revokes that member's access, including live sessions.
const crypto = require('crypto');

const COOKIE = 'tico_course';
const SESSION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const ALLOWED_HOSTS = ['ticofinance.co.il', 'www.ticofinance.co.il'];

function configured() { return !!(process.env.COURSE_SECRET && process.env.COURSE_USERS); }

function users() {
  try { return JSON.parse(process.env.COURSE_USERS || '{}'); } catch (e) { return {}; }
}

function normCode(c) { return String(c || '').trim().toUpperCase().replace(/\s+/g, ''); }

function hashPassword(password, saltHex) {
  return crypto.scryptSync(String(password), Buffer.from(saltHex, 'hex'), 32, { N: 16384, r: 8, p: 1 }).toString('hex');
}

function safeEqualHex(a, b) {
  const x = Buffer.from(String(a), 'hex'), y = Buffer.from(String(b), 'hex');
  return x.length === y.length && x.length > 0 && crypto.timingSafeEqual(x, y);
}

// Always runs one scrypt, even for an unknown code, so timing does not reveal which codes exist.
const DUMMY_SALT = crypto.randomBytes(16).toString('hex');
function verifyLogin(code, password) {
  const all = users(), entry = all[normCode(code)];
  const salt = entry ? entry.s : DUMMY_SALT;
  const got = hashPassword(password, salt);
  if (!entry) return null;
  if (!safeEqualHex(got, entry.h)) return null;
  if (entry.exp && Date.now() > Date.parse(entry.exp + 'T23:59:59Z')) return null;
  return { code: normCode(code), name: entry.n || '', exp: entry.exp || '' };
}

function b64u(buf) { return Buffer.from(buf).toString('base64url'); }

function sign(payload) {
  const body = b64u(JSON.stringify(payload));
  const sig = crypto.createHmac('sha256', process.env.COURSE_SECRET).update(body).digest('base64url');
  return body + '.' + sig;
}

function readToken(token) {
  if (!token || token.indexOf('.') < 0) return null;
  const [body, sig] = token.split('.');
  const want = crypto.createHmac('sha256', process.env.COURSE_SECRET).update(body).digest('base64url');
  const a = Buffer.from(sig), b = Buffer.from(want);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  let p; try { p = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')); } catch (e) { return null; }
  if (!p || !p.c || !p.e || Date.now() > p.e) return null;
  return p;
}

function cookieHeader(value, maxAgeSec) {
  return `${COOKIE}=${value}; Path=/api; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAgeSec}`;
}

function getCookie(req, name) {
  const raw = String(req.headers.cookie || '');
  for (const part of raw.split(';')) {
    const i = part.indexOf('=');
    if (i > 0 && part.slice(0, i).trim() === name) return part.slice(i + 1).trim();
  }
  return '';
}

// Current member from the cookie, only if the code still exists in COURSE_USERS and has not expired.
function session(req) {
  if (!configured()) return null;
  const p = readToken(getCookie(req, COOKIE));
  if (!p) return null;
  const entry = users()[p.c];
  if (!entry) return null;
  if (entry.exp && Date.now() > Date.parse(entry.exp + 'T23:59:59Z')) return null;
  return { code: p.c, name: entry.n || '' };
}

function allowedOrigin(req) {
  const o = req.headers.origin || '';
  if (!o) return true;
  try {
    const h = new URL(o).hostname;
    return ALLOWED_HOSTS.includes(h) || h.endsWith('.vercel.app') || h === 'localhost';
  } catch (e) { return false; }
}

// Best-effort limits (memory is per serverless instance): slows guessing, does not stop a determined attacker.
const tries = new Map();
function limited(key, max, windowMs) {
  const now = Date.now();
  const arr = (tries.get(key) || []).filter((t) => now - t < windowMs);
  arr.push(now); tries.set(key, arr);
  if (tries.size > 5000) tries.clear();
  return arr.length > max;
}

function send(res, status, body) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.status(status).json(body);
}

module.exports = { COOKIE, SESSION_MS, configured, users, normCode, hashPassword, verifyLogin, sign, readToken, cookieHeader, session, allowedOrigin, limited, send };
