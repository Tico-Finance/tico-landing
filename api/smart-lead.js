// Server-side bridge: website lead form -> SmartNPV (POST /api/v2/clients/create, lead=1).
// The API key lives only in Vercel env vars and is never sent to the browser.
//
// Env vars (Vercel -> Settings -> Environment Variables):
//   SMART_API_KEY          required
//   SMART_STATUS_ID        optional, id from the "statuses" table (classification "leads")
//   SMART_CAMPAIGN_ID      optional default campaign id
//   SMART_CAMPAIGN_MAP     optional JSON, e.g. {"investors":"12","upgraders":"13"} (by data-source)

const ALLOWED_HOSTS = ['ticofinance.co.il', 'www.ticofinance.co.il'];

function allowedOrigin(req) {
  const o = req.headers.origin || '';
  if (!o) return true; // same-origin requests may omit Origin
  try {
    const h = new URL(o).hostname;
    return ALLOWED_HOSTS.includes(h) || h.endsWith('.vercel.app') || h === 'localhost';
  } catch (e) { return false; }
}

function normalizePhone(raw) {
  let d = String(raw || '').replace(/[^\d]/g, '');
  if (d.startsWith('972')) d = '0' + d.slice(3);
  return /^0\d{8,9}$/.test(d) ? d : null;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'method' });
  if (!allowedOrigin(req)) return res.status(403).json({ ok: false, error: 'origin' });

  const key = process.env.SMART_API_KEY;
  if (!key) return res.status(500).json({ ok: false, error: 'not_configured' });

  const body = typeof req.body === 'string' ? safeParse(req.body) : (req.body || {});
  const name = String(body.full_name || '').trim().slice(0, 100);
  const phone = normalizePhone(body.phone_number);
  const source = String(body.page_source || '').trim().slice(0, 60);
  if (name.length < 2 || !phone) return res.status(400).json({ ok: false, error: 'invalid' });

  const parts = name.split(/\s+/);
  const first = parts.shift();
  const last = parts.join(' ');

  let campaign = process.env.SMART_CAMPAIGN_ID || '';
  try {
    const map = JSON.parse(process.env.SMART_CAMPAIGN_MAP || '{}');
    if (map[source]) campaign = String(map[source]);
  } catch (e) { /* ignore bad map */ }

  const form = new URLSearchParams();
  form.set('api_key', key);
  form.set('params[lead]', '1');
  form.set('params[firstname_1]', first);
  if (last) form.set('params[lastname_1]', last);
  form.set('params[phone_1]', phone);
  if (process.env.SMART_STATUS_ID) form.set('params[status]', process.env.SMART_STATUS_ID);
  if (campaign) form.set('params[campaign]', campaign);
  form.set('params[note_details]', 'ליד מהאתר' + (source ? ' (' + source + ')' : ''));

  try {
    const r = await fetch('https://www.snpv.co.il/api/v2/clients/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form,
      signal: AbortSignal.timeout(8000),
    });
    const text = await r.text();
    // SmartNPV can answer HTTP 200 with a failure in the body, so check both.
    const data = safeParse(text);
    if (!r.ok || data.response === false || data.status === false) {
      console.error('SmartNPV error', r.status, text.slice(0, 300));
      return res.status(502).json({ ok: false, error: 'upstream' });
    }
    console.log('SmartNPV lead created', source, text.slice(0, 200));
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('SmartNPV request failed', e && e.message);
    return res.status(502).json({ ok: false, error: 'upstream' });
  }
};

function safeParse(s) { try { return JSON.parse(s); } catch (e) { return {}; } }
