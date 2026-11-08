/* Behaviour for the funnel pages: learn, meeting, pro, course, thanks. Reads the quiz context from sessionStorage / the URL.
   While TICO_FUNNEL.draft is true: a banner shows and nothing is sent anywhere. */
(function () {
  'use strict';
  var D = document, F = window.TICO_FUNNEL || {}, Cn = window.TICO_CONTENT || {};
  var root = D.querySelector('[data-page]'); if (!root) return;
  var page = root.getAttribute('data-page');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var LEAD_SHEET = 'https://script.google.com/macros/s/AKfycbxPxMs-PTgr2iFpx7M-izBzzm5-UBwpmryeHsSl8LvdRNOVksgrV63PPUyYTRwp76aTZg/exec';

  function $(id) { return D.getElementById(id); }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function ctx() {
    var c = {}; try { c = JSON.parse(sessionStorage.getItem('ticoFunnel') || '{}') || {}; } catch (e) {}
    var q = new URLSearchParams(location.search);
    if (q.get('t')) c.type = q.get('t');
    if (q.get('src')) c.src = q.get('src');
    if (q.get('gf')) c.guidedFirst = true;
    return c;
  }
  function track(name, params) { if (typeof window.gtag === 'function') window.gtag('event', name, params || {}); }
  var C = ctx();

  if (F.draft !== false) {
    var bar = D.createElement('div'); bar.className = 'draftbar'; bar.setAttribute('role', 'note');
    bar.textContent = 'גרסת טיוטה לבדיקה. הדף לא פורסם, והטפסים בו לא שולחים נתונים.';
    D.body.insertBefore(bar, D.body.firstChild);
  }

  /* ---------- learn ---------- */
  if (page === 'learn') {
    var L = Cn.LOOK && Cn.LOOK[C.type];
    var NAMES = { flip: 'פליפר', presale: 'משקיע פריסייל', mid: 'מחזיק לטווח בינוני', long: 'משקיע לטווח ארוך', portfolio: 'בונה פורטפוליו' };
    if (NAMES[C.type]) $('typeName').textContent = 'לפרופיל: ' + NAMES[C.type];
    if (L) {
      $('lookList').innerHTML = L.look.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('');
      $('lookCheck').textContent = L.check; $('lookBox').hidden = false;
    }
    var topics = Cn.TOPICS || [], pl = F.playlists || {};
    $('topics').innerHTML = topics.map(function (t) {
      var href = pl[t.k] || F.youtube || '#';
      return '<a class="tcard" href="' + href + '" target="_blank" rel="noopener" data-topic="' + t.k + '"><b>' + t.t + '</b><span>' + t.d + '</span></a>';
    }).join('');
    $('topics').addEventListener('click', function (e) { var a = e.target.closest('[data-topic]'); if (a) track('learn_topic', { topic: a.getAttribute('data-topic'), quiz_type: C.type || '' }); });
    track('funnel_view', { page: 'learn', quiz_type: C.type || '', src: C.src || '' });
  }

  /* ---------- course sales page ---------- */
  if (page === 'course') {
    $('cName').textContent = F.courseName || 'הקורס';
    $('cPrice').textContent = F.coursePrice || '297';
    if (C.guidedFirst) $('gfBox').hidden = false;
    var pay = $('payBtn'), lab = $('payLabel');
    if (F.paymentUrl && F.draft === false) {
      pay.href = F.paymentUrl; pay.removeAttribute('aria-disabled'); lab.textContent = 'לתשלום ולכניסה לקורס';
      pay.addEventListener('click', function () { track('begin_checkout', { event_category: 'course', value: Number(F.coursePrice) || 0, currency: 'ILS', src: C.src || '' }); });
    } else {
      pay.addEventListener('click', function (e) { e.preventDefault(); });
    }
    track('funnel_view', { page: 'course', quiz_type: C.type || '', src: C.src || '' });
  }

  /* ---------- meeting ---------- */
  if (page === 'meeting') {
    if (F.bookingUrl && F.draft === false) {
      $('bookRow').hidden = false; $('bookBtn').href = F.bookingUrl; $('meetForm').hidden = true; $('bookNote').textContent = 'בחרו מועד שנוח לכם.';
      $('bookBtn').addEventListener('click', function () { track('generate_lead', { event_category: 'booking', event_label: 'investor-meeting-booking' }); });
    }
    var form = $('meetForm'), sb = $('msub'), err = $('mErr'), ok = $('mOk');
    form.addEventListener('submit', function (e) {
      e.preventDefault(); err.textContent = '';
      var nm = $('mn').value.trim(), raw = $('mp').value.trim(), dg = raw.replace(/[^\d]/g, ''), good = true;
      $('mnE').textContent = nm.length < 2 ? 'כתבו שם מלא' : ''; if (nm.length < 2) good = false;
      var phOk = /^0\d{8,9}$/.test(dg) || /^972\d{8,9}$/.test(dg);
      $('mpE').textContent = phOk ? '' : 'כתבו מספר טלפון תקין, למשל 050-0000000'; if (!phOk) good = false;
      if (good && !$('mc').checked) { good = false; err.textContent = 'סמנו את אישור הפרטיות כדי להמשיך'; }
      if (!good) return;
      if ($('website').value) { sb.dataset.s = 'ok'; return; } // honeypot
      if (F.draft !== false) {
        ok.textContent = 'מצב טיוטה: הטופס תקין, אבל לא נשלח דבר. בגרסה שתפורסם הפרטים יישלחו אליי.';
        ok.classList.add('show'); return;
      }
      sb.dataset.s = 'loading';
      var answers = [C.typeName || C.type || '', 'הון: ' + (C.eq || ''), 'שלב: ' + (C.stage || ''), 'מבוקש: ' + ($('md').value || ''), 'מועד: ' + ($('mt').value || ''), 'מקור: ' + (C.src || '')].join(' | ');
      var payload = JSON.stringify({ full_name: nm, phone_number: raw, page_source: 'investor-meeting', process: 'בקשת פגישת התאמה', answers: answers });
      var toSheet = fetch(LEAD_SHEET, { method: 'POST', mode: 'no-cors', body: payload });
      var toSmart = fetch('/api/smart-lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: payload, keepalive: true }).catch(function () {});
      Promise.all([toSheet, toSmart]).then(function () {
        track('generate_lead', { event_category: 'form', event_label: 'investor-meeting', src: C.src || '' });
        sb.dataset.s = 'ok';
        setTimeout(function () { window.location.href = '/thank-you.html'; }, reduce ? 0 : 900);
      }, function () { sb.dataset.s = 'idle'; err.textContent = 'לא הצלחנו לשלוח כרגע. נסו שוב או כתבו לי בוואטסאפ.'; });
    });
    track('funnel_view', { page: 'meeting', quiz_type: C.type || '', src: C.src || '' });
  }

  if (page === 'pro') track('funnel_view', { page: 'pro', src: C.src || '' });
})();
