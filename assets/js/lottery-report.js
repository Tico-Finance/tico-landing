/* Lottery calculator: "send me the PDF report" form.
   Sends the entered numbers + contact details to the Tico app, which builds the PDF on the server,
   saves the lead, issues the numbered coupon and emails both. Nothing is downloaded in the browser. */
(function () {
  'use strict';
  var D = document, form = D.getElementById('repForm');
  if (!form) return;

  var API = 'https://app.ticofinance.co.il/api/lottery-report';
  var SIZES = [
    { id: 1, label: '3 חדרים' }, { id: 2, label: '4 חדרים' },
    { id: 3, label: '5 חדרים' }, { id: 4, label: '6 חדרים' }
  ];
  var sb = D.getElementById('repSub'), box = D.getElementById('repErr'), done = D.getElementById('repDone');

  function num(id) {
    var v = parseFloat(D.getElementById(id).value);
    return isFinite(v) && v > 0 ? v : 0;
  }
  function grant() {
    var c = D.querySelector('input[name="grant"]:checked');
    var v = c ? parseFloat(c.value) : 0;
    return isFinite(v) ? v : 0;
  }
  function calcInput() {
    return {
      pricePerSqm: num('pricePerSqm'),
      discountPercent: num('discountPercent'),
      discountCap: num('discountCap'),
      referencePrice: num('referencePrice'),
      balconySqm: num('balconySqm'),
      storageSqm: num('storageSqm'),
      parkingCount: Math.round(num('parkingCount')),
      grant: grant(),
      sizes: SIZES.map(function (s) { return { id: s.id, label: s.label, mainSqm: num('mainSqm' + s.id) }; })
    };
  }
  function setErr(id, msg) { D.getElementById(id).textContent = msg || ''; return !msg; }
  function showBox(msg) { box.textContent = msg; box.style.display = msg ? 'block' : 'none'; }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    showBox('');
    var name = D.getElementById('repName').value.trim();
    var phone = D.getElementById('repPhone').value.trim();
    var email = D.getElementById('repEmail').value.trim();
    var digits = phone.replace(/[^\d]/g, '');
    var ok = true;
    ok = setErr('repNmE', name.length < 2 ? 'כתבו שם מלא' : '') && ok;
    ok = setErr('repPhE', (/^0\d{8,9}$/.test(digits) || /^972\d{8,9}$/.test(digits)) ? '' : 'כתבו מספר טלפון תקין, למשל 050-0000000') && ok;
    ok = setErr('repEmE', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? '' : 'כתבו כתובת אימייל תקינה') && ok;
    if (!ok) return;
    if (!D.getElementById('repConsent').checked) { showBox('סמנו את אישור קבלת התכנים כדי לקבל את הדוח'); return; }
    var input = calcInput();
    if (input.pricePerSqm <= 0) { showBox('הזינו קודם מחיר מוצג למ״ר, כדי שנוכל להפיק את הדוח'); return; }

    sb.dataset.s = 'loading';
    fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name, phone: phone, email: email, consent: true,
        website: D.getElementById('repWebsite').value, input: input
      })
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (data) { return { ok: r.ok, data: data }; });
    }).then(function (res) {
      if (!res.ok) {
        sb.dataset.s = 'idle';
        showBox((res.data && res.data.error) || 'לא הצלחנו לשלוח כרגע. נסו שוב או כתבו לי בוואטסאפ.');
        return;
      }
      sb.dataset.s = 'ok';
      if (typeof window.gtag === 'function') window.gtag('event', 'generate_lead', { event_category: 'form', event_label: 'lottery-report' });
      // Same CRM path as the other forms on the site (best effort, never blocks the user).
      try {
        fetch('/api/smart-lead', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, keepalive: true,
          body: JSON.stringify({ full_name: name, phone_number: phone, page_source: 'lottery-report' })
        }).catch(function () {});
      } catch (err) { /* ignore */ }
      form.hidden = true;
      done.textContent = 'הדוח נשלח אל ' + email + '. כדאי לבדוק גם בתיקיית הספאם / קידומי מכירות.';
      done.hidden = false;
    }).catch(function () {
      sb.dataset.s = 'idle';
      showBox('אין חיבור לשרת, נסו שוב בעוד רגע.');
    });
  });
})();
