// GET -> the course modules (video ids and tool links) for a signed-in member only.
const L = require('./_course-lib');
const { MODULES } = require('./_course-data');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return L.send(res, 405, { ok: false, error: 'method' });
  if (!L.configured()) return L.send(res, 503, { ok: false, error: 'not_configured' });
  const s = L.session(req);
  if (!s) return L.send(res, 401, { ok: false, error: 'auth' });
  return L.send(res, 200, { ok: true, name: s.name, modules: MODULES });
};
