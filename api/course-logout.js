// POST -> clears the session cookie.
const L = require('./_course-lib');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return L.send(res, 405, { ok: false, error: 'method' });
  if (!L.allowedOrigin(req)) return L.send(res, 403, { ok: false, error: 'origin' });
  res.setHeader('Set-Cookie', L.cookieHeader('', 0));
  return L.send(res, 200, { ok: true });
};
