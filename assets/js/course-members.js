/* Course member area: code + password sign-in (server side, signed HttpOnly cookie), then the modules. */
(function () {
  'use strict';
  var D = document;
  function $(id) { return D.getElementById(id); }
  var loginBox = $('memLogin'), closed = $('memClosed'), area = $('memArea');
  if (!area) return;
  var modules = [], cur = 0, done = {};
  try { done = JSON.parse(localStorage.getItem('ticoCourseDone') || '{}') || {}; } catch (e) { done = {}; }
  function saveDone() { try { localStorage.setItem('ticoCourseDone', JSON.stringify(done)); } catch (e) {} }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function show(which) { loginBox.hidden = which !== 'login'; closed.hidden = which !== 'closed'; area.hidden = which !== 'area'; }

  function load() {
    return fetch('/api/course-content', { credentials: 'same-origin', cache: 'no-store' }).then(function (r) {
      if (r.status === 503) { show('closed'); return; }
      if (r.status !== 200) { show('login'); return; }
      return r.json().then(function (d) {
        modules = d.modules || []; $('memHello').textContent = d.name ? 'שלום ' + d.name : 'הקורס שלכם';
        show('area'); renderNav(); open(firstOpen());
      });
    }).catch(function () { show('login'); });
  }
  function firstOpen() { for (var i = 0; i < modules.length; i++) if (!done[modules[i].id]) return i; return 0; }

  function renderNav() {
    $('memNav').innerHTML = modules.map(function (m, i) {
      return '<button type="button" class="mi' + (i === cur ? ' on' : '') + (done[m.id] ? ' done' : '') + '" data-i="' + i + '"><span class="n">' + (done[m.id] ? '✓' : m.id) + '</span><span>' + esc(m.title) + '</span></button>';
    }).join('');
  }
  function open(i) {
    cur = i; var m = modules[i]; if (!m) return; renderNav();
    var vid = /^[A-Za-z0-9_-]{6,20}$/.test(m.video || '')
      ? '<iframe src="https://www.youtube-nocookie.com/embed/' + m.video + '?rel=0" title="' + esc(m.title) + '" allow="accelerometer; encrypted-media; picture-in-picture" allowfullscreen></iframe>'
      : '<p>הפרק הזה יעלה בקרוב.</p>';
    var tool = m.tool && m.tool.title ? '<div class="tools"><a href="' + (m.tool.url ? esc(m.tool.url) : '#') + '"' + (m.tool.url ? ' target="_blank" rel="noopener"' : ' class="off"') + '>📎 ' + esc(m.tool.title) + (m.tool.url ? '' : ' (יתווסף בקרוב)') + '</a></div>' : '';
    $('memStage').innerHTML = '<div class="kicker">פרק ' + m.id + ' מתוך ' + modules.length + '</div><h2 style="margin:0 0 6px;font:900 1.6rem var(--f-display)">' + esc(m.title) + '</h2><p style="margin:0;color:var(--muted)">' + esc(m.summary) + '</p>' +
      '<div class="vid">' + vid + '</div>' + tool +
      '<div class="btnrow"><button class="pbtn" id="markDone" type="button">' + (done[m.id] ? 'בטל סימון' : 'סימנתי כהושלם') + '</button>' +
      (i < modules.length - 1 ? '<button class="sbtn" id="nextMod" type="button">הפרק הבא</button>' : '') + '</div>';
    $('markDone').addEventListener('click', function () { if (done[m.id]) delete done[m.id]; else done[m.id] = 1; saveDone(); open(cur); });
    var nx = $('nextMod'); if (nx) nx.addEventListener('click', function () { open(cur + 1); window.scrollTo({ top: area.offsetTop - 80, behavior: 'smooth' }); });
  }
  $('memNav').addEventListener('click', function (e) { var b = e.target.closest('.mi'); if (b) open(+b.getAttribute('data-i')); });

  $('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var code = $('lc').value.trim(), pw = $('lp').value, err = $('lErr'), sb = $('lsub'); err.textContent = '';
    if (!code || !pw) { err.textContent = 'הזינו קוד וסיסמה'; return; }
    sb.dataset.s = 'loading';
    fetch('/api/course-login', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code: code, password: pw }) })
      .then(function (r) {
        if (r.status === 200) { sb.dataset.s = 'ok'; $('lp').value = ''; return load(); }
        sb.dataset.s = 'idle';
        if (r.status === 503) { show('closed'); return; }
        err.textContent = r.status === 429 ? 'יותר מדי ניסיונות. נסו שוב בעוד כמה דקות.' : 'הקוד או הסיסמה שגויים. בדקו שהעתקתם אותם במלואם.';
      }).catch(function () { sb.dataset.s = 'idle'; err.textContent = 'לא הצלחנו להתחבר. נסו שוב.'; });
  });
  $('logoutBtn').addEventListener('click', function () {
    fetch('/api/course-logout', { method: 'POST', credentials: 'same-origin' }).finally(function () { location.reload(); });
  });
  load();
})();
