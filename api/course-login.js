// POST { code, password } -> sets a signed HttpOnly session cookie. Never reveals which part was wrong.
const L = require('./_course-lib');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return L.send(res, 405, { ok: false, error: 'method' });
  if (!L.allowedOrigin(req)) return L.send(res, 403, { ok: false, error: 'origin' });
  if (!L.configured()) return L.send(res, 503, { ok: false, error: 'not_configured' });

  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  const body = typeof req.body === 'string' ? safeParse(req.body) : (req.body || {});
  const code = L.normCode(body.code), password = String(body.password || '');
  if (L.limited('ip:' + ip, 8, 10 * 60 * 1000) || (code && L.limited('code:' + code, 10, 10 * 60 * 1000))) {
    return L.send(res, 429, { ok: false, error: 'rate' });
  }
  if (!code || !password || code.length > 40 || password.length > 100) return L.send(res, 400, { ok: false, error: 'invalid' });

  const m = L.verifyLogin(code, password);
  if (!m) return L.send(res, 401, { ok: false, error: 'bad_credentials' });

  const exp = Date.now() + L.SESSION_MS;
  res.setHeader('Set-Cookie', L.cookieHeader(L.sign({ c: m.code, e: exp }), Math.floor(L.SESSION_MS / 1000)));
  return L.send(res, 200, { ok: true, name: m.name });
};

function safeParse(s) { try { return JSON.parse(s); } catch (e) { return {}; } }
