/* "What kind of investor are you?" quiz. Seven questions, a scored result, then four "next step" questions that route to learn / course / meeting / professional pages. */
(function () {
  'use strict';
  var D = document, stage = D.getElementById('stage');
  if (!stage) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var stepTxt = D.getElementById('stepTxt'), barFill = D.getElementById('barFill'), backBtn = D.getElementById('backBtn');

  var TYPES = {
    flip: {
      name: 'פליפר', short: 'פליפ', tag: 'קונים, משפצים, מוכרים. ומהר.',
      what: 'אתם מחפשים רווח מהיר מההפרש בין קנייה למכירה, ומוכנים להשקיע זמן ומעורבות כדי לקבל אותו.',
      know: [
        'הרווח האמיתי נקבע אחרי כל העלויות: רכישה, שיפוץ, תיווך, מיסוי וחודשי החזקה.',
        'כל חודש שהנכס עומד עולה כסף, ולכן הזמן הוא חלק מהחישוב.',
        'חריגה בשיפוץ או מכירה שמתעכבת יכולות למחוק את כל הרווח.'
      ],
      mort: 'בדרך כלל זה לא מתאים למשכנתה ארוכה. הבסיס הוא הון עצמי ומימון לטווח קצר, ולכן בודקים מראש את עלות המימון ואת התנאים ליציאה מוקדמת.',
      risk: 'הפער בין התכנון לביצוע, והזמן שלוקח למכור.'
    },
    presale: {
      name: 'משקיע פריסייל', short: 'פריסייל', tag: 'מרוויחים מעליית ערך בזמן שהדירה נבנית.',
      what: 'אתם רוצים להתחיל בהון עצמי קטן ככל האפשר, ולהרוויח מעליית הערך בשנות הבנייה, בלי לנהל נכס בינתיים.',
      know: [
        'משלמים לפי התקדמות הבנייה, ולכן צריך לתכנן את לוח התשלומים מראש.',
        'עיכוב במסירה משפיע על התזרים ועל התוכניות שלכם, לא רק על הקבלן.',
        'ההון העצמי נעול כמה שנים, והמשכנתה נפתחת רק לקראת המסירה.'
      ],
      mort: 'המשכנתה נפתחת לקראת הסוף, ולכן צריך לדעת כבר היום אם היכולת שלכם תאפשר לקבל אותה בעוד שנים. בונים תוכנית לאורך כל תקופת הבנייה, ולא רק ליום החתימה.',
      risk: 'עיכובים, הצמדה למדד, ושינוי ביכולת ההחזר עד המסירה.'
    },
    mid: {
      name: 'מחזיק לטווח בינוני', short: 'טווח בינוני', tag: 'שנתיים עד חמש שנים, ויוצאים בזמן.',
      what: 'אתם רוצים גם הכנסה מהנכס וגם גמישות לצאת כשהשוק או החיים משתנים.',
      know: [
        'הרווח מגיע משכירות ומעליית ערך, ושניהם נבדקים אחרי מימון ומס.',
        'חשוב להבין מראש מה עולה לצאת מהנכס, כולל עמלת פירעון מוקדם.',
        'צריך תוכנית ליום שבו תחליטו למכור, ולא רק ליום שבו קניתם.'
      ],
      mort: 'משכנתה רגילה עם תמהיל גמיש, כך שאפשר לצאת בלי לשלם יותר מדי. בודקים את עמלות היציאה לפני שבוחרים מסלולים.',
      risk: 'הצורך למכור בזמן לא נוח.'
    },
    long: {
      name: 'משקיע לטווח ארוך', short: 'טווח ארוך', tag: 'תזרים שקט לשנים, בלי לרוץ אחרי השוק.',
      what: 'אתם מעדיפים יציבות. מחזיקים נכס חמש עד עשר שנים, ונותנים לזמן ולשכירות לעבוד בשבילכם.',
      know: [
        'התשואה האמיתית היא נטו, אחרי עלות המימון וההוצאות.',
        'תחזוקה, ועד בית ותקופות ריקות הם חלק קבוע מהחישוב.',
        'הנכס צריך לעמוד בעצמו גם כשהריבית משתנה.'
      ],
      mort: 'תמהיל יציב לתקופה ארוכה, 25 עד 30 שנה. היציבות חשובה כאן יותר מהריבית הנמוכה ביותר, ובודקים תרחיש של עליית ריבית.',
      risk: 'ריבית משתנה והוצאות לא צפויות לאורך השנים.'
    },
    portfolio: {
      name: 'בונה פורטפוליו', short: 'פורטפוליו', tag: 'חושבים על הנכס הבא לפני שקנו את הנוכחי.',
      what: 'אתם לא בונים עסקה אחת אלא מערכת. כל נכס צריך לקדם את הבא, ולא לחסום אותו.',
      know: [
        'סדר הרכישות, ועל שם מי רשום כל נכס, משפיעים על היכולת להמשיך.',
        'כל הלוואה קיימת נכנסת לחישוב של הבנק בבקשה הבאה.',
        'השאלה היא לא כמה העסקה עולה, אלא מה היא מאפשרת.'
      ],
      mort: 'בונים מבנה מימון לכל הנכסים יחד, עם תכנון של סדר הרכישות והמינוף, ובודקים מחזורים בהמשך כדי לפנות הון לנכס הבא.',
      risk: 'ריכוז סיכון ומינוף גבוה מדי כשכמה נכסים תלויים זה בזה.'
    }
  };
  var ORDER = ['flip', 'presale', 'mid', 'long', 'portfolio'];

  /* Seven steps in four mechanics (slider, scenario cards, point split, dial). Answer order is shuffled per visit so position never maps to a type. */
  var HORIZON = [
    ['עד חצי שנה', { flip: 3 }],
    ['שנה', { flip: 2, mid: 1 }],
    ['שנתיים עד שלוש', { presale: 2, mid: 2 }],
    ['שלוש עד ארבע שנים', { presale: 3, mid: 2 }],
    ['חמש שנים', { mid: 3, long: 1 }],
    ['שבע שנים', { long: 3, mid: 1 }],
    ['עשר שנים', { long: 3, portfolio: 1 }],
    ['אני לא מתכנן/ת למכור', { portfolio: 3, long: 2 }]
  ];
  var DIAL = [
    ['כמעט לא. שזה יעבוד לבד', { presale: 2, long: 2, portfolio: 1 }],
    ['מעט. מנהל נכס מטפל', { long: 3, portfolio: 1 }],
    ['בינוני. שוכר, תיקונים ותחזוקה', { mid: 3, long: 1 }],
    ['הרבה. אני מנהל/ת הכול בעצמי', { mid: 1, flip: 1, portfolio: 1 }],
    ['הכול. שיפוץ, קבלנים ומכירה', { flip: 3 }]
  ];
  var PRIOR = [
    ['רווח מהיר', 'flip'],
    ['עליית ערך בזמן שהדירה נבנית', 'presale'],
    ['גמישות לצאת מתי שרוצים', 'mid'],
    ['תזרים שקט לאורך שנים', 'long'],
    ['נכסים שיישארו לדורות', 'portfolio']
  ];
  var QUESTIONS = [
    { kind: 'slider', k: 'horizon', q: 'בעוד כמה זמן אתם רוצים שהכסף יחזור אליכם?', sub: 'זה הזמן שהכסף נעול בנכס', steps: HORIZON, start: 3, why: 'אופק של' },
    { kind: 'tiles', k: 'delay', q: 'הקבלן מודיע שהמסירה מתעכבת בשנה. מה הכי קרוב למה שהייתם אומרים?', why: 'כשיש עיכוב', o: [
      ['זה חלק מהעסקה. אני מחכה.', { presale: 3, long: 1 }],
      ['אני צריך/ה מועד ברור. זה לא מתאים לי.', { mid: 2, long: 2 }],
      ['בינתיים אני מחפש/ת את הנכס הבא.', { portfolio: 3 }],
      ['אני מוכר/ת את הזכויות ויוצא/ת.', { flip: 2, presale: 1 }]
    ] },
    { kind: 'alloc', k: 'alloc', q: 'חלקו 10 נקודות בין מה שהכי חשוב לכם', sub: 'אפשר לשים הכול במקום אחד, או לפזר', items: PRIOR, why: 'חשוב לכם' },
    { kind: 'tiles', k: 'cash', q: 'יש לכם 500 אלף שקל פנויים. מה הכי מושך אתכם?', why: 'עם 500 אלף', o: [
      ['הכול בנכס אחד, ומשכירים אותו לשנים.', { long: 3, mid: 1 }],
      ['מינימום עכשיו, והשאר לפי לוח תשלומים.', { presale: 3 }],
      ['מחלקים בין שני נכסים.', { portfolio: 3 }],
      ['שיפוץ ומכירה תוך שנה.', { flip: 3 }],
      ['נכס אחד, ומוכרים כשהמחיר טוב.', { mid: 3 }]
    ] },
    { kind: 'slider', k: 'dial', q: 'כמה אתם רוצים להתעסק עם הנכס?', sub: 'מ"אל תתקשרו אליי" ועד "אני עם כפפות עבודה"', steps: DIAL, start: 2, why: 'מעורבות' },
    { kind: 'tiles', k: 'vacancy', q: 'חודש בלי שוכר, וההחזר לבנק ממשיך. מה הכי קרוב להרגשה שלכם?', why: 'חודש בלי שוכר', o: [
      ['זה צפוי. יש לי רזרבה לזה.', { long: 2, portfolio: 2, mid: 1 }],
      ['זה מלחיץ. אני רוצה שהכסף יחזור מהר.', { flip: 3 }],
      ['אין לי החזר שוטף עד המסירה, אז זה לא קורה לי.', { presale: 3 }],
      ['אם זה חוזר, אשקול למכור ולצאת.', { mid: 3 }]
    ] },
    { kind: 'tiles', k: 'exp', q: 'איפה אתם עומדים היום?', why: 'הניסיון שלכם', o: [
      ['זה יהיה הנכס הראשון שלי.', { long: 2, mid: 1 }],
      ['יש לי דירה אחת, ואני שוקל/ת נכס נוסף.', { mid: 1, long: 1, presale: 1 }],
      ['יש לי כבר נכס להשקעה אחד.', { portfolio: 2, mid: 1 }],
      ['יש לי כמה נכסים.', { portfolio: 3 }]
    ] }
  ];

  var ARW = '<svg class="ar" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>';
  var CK = '<svg class="ck" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10"/></svg>';
  var CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg>';


  var NEXTQ = [
    { k: 'eq', q: 'מה ההון העצמי שיש לכם לעסקה?', o: [['lt100', 'עד 100 אלף'], ['100-300', '100 עד 300 אלף'], ['300-500', '300 עד 500 אלף'], ['gt500', 'מעל 500 אלף'], ['skip', 'מעדיפים לא לציין']] },
    { k: 'stage', q: 'איפה אתם בתהליך?', o: [['curious', 'רק מתעניינים בנדל"ן להשקעה'], ['direction', 'יש לי כיוון ואני בוחן/ת אותו'], ['bank', 'בדקתי כבר מימון מול בנק'], ['deal', 'אני בעסקה כרגע']] },
    { k: 'support', q: 'מה הכי יעזור לכם עכשיו?', o: [['alone', 'להמשיך ללמוד בעצמי'], ['course', 'ללמוד את השיטה בקורס קצר, עם כלים מעשיים'], ['guided', 'ליווי אישי מהחלום ועד המפתח']] },
    { k: 'field', q: 'מה הקשר שלכם לתחום?', o: [['investor', 'משקיע/ת פרטי/ת'], ['upgrader', 'משפר/ת דיור ששוקל/ת להשקיע'], ['planning', 'מתכנן/ת להשקיע'], ['pro', 'עובד/ת בתחום (יועץ, מתווך, בנקאי ועוד)'], ['other', 'אחר']] }
  ];

  function lookHtml(key) {
    var L = window.TICO_CONTENT && window.TICO_CONTENT.LOOK && window.TICO_CONTENT.LOOK[key];
    if (!L) return '';
    return '<div class="rbox"><h3 class="rh">סוגי עסקאות שפרופיל כזה בדרך כלל בוחן</h3><ul class="sum">' +
      L.look.map(function (x) { return '<li>' + CHECK + '<span>' + esc(x) + '</span></li>'; }).join('') + '</ul><p>' + esc(L.check) + '</p>' +
      '<p class="mini">זה מידע כללי ללמידה. הוא לא המלצה לקנות נכס מסוים ולא התאמה אישית למצבכם.</p></div>';
  }

  var idx = 0, answers = [], orders = [], result = null;
  var meter = null;

  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function shuffle(n) { var a = [], i, j, t; for (i = 0; i < n; i++) a.push(i); for (i = n - 1; i > 0; i--) { j = Math.floor(Math.random() * (i + 1)); t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function setProg(n) {
    stepTxt.textContent = 'שלב ' + n + ' מתוך ' + QUESTIONS.length;
    barFill.style.width = (n / QUESTIONS.length * 100) + '%';
    backBtn.hidden = (n === 1);
  }
  function focusHead() { var h = stage.querySelector('.q,h2'); if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); } }
  function nextBtn(label) {
    return '<div class="nrow"><button class="pbtn lg" id="next" type="button" disabled>' + label + ' <span class="chip">' + ARW.replace('class="ar"', 'class="a"') + ARW.replace('class="ar"', 'class="b"') + '</span></button><span class="nhint" id="nhint"></span></div>';
  }

  /* Weights of everything answered so far, for the live profile meter and the final score. */
  function totals(upTo) {
    var t = { flip: 0, presale: 0, mid: 0, long: 0, portfolio: 0 };
    for (var i = 0; i < (upTo == null ? answers.length : upTo); i++) {
      var a = answers[i]; if (!a) continue;
      for (var k in a.w) t[k] += a.w[k];
    }
    return t;
  }
  function renderMeter() {
    if (!meter) {
      meter = D.createElement('div'); meter.className = 'meter'; meter.setAttribute('aria-hidden', 'true');
      meter.innerHTML = '<span class="mlab">הפרופיל שלכם נבנה</span><div class="mbars">' + ORDER.map(function () { return '<i></i>'; }).join('') + '</div>';
      D.getElementById('prog').insertAdjacentElement('afterend', meter);
    }
    meter.hidden = false;
    var t = totals(), mx = Math.max.apply(null, ORDER.map(function (k) { return t[k]; }).concat([1]));
    var bars = meter.querySelectorAll('i'), shown = ORDER.slice().sort(function (a, b) { return a < b ? -1 : 1; });
    shown.forEach(function (k, n) { bars[n].style.height = Math.max(8, Math.round(t[k] / mx * 100)) + '%'; });
  }

  function renderQ() {
    var q = QUESTIONS[idx];
    D.getElementById('prog').hidden = false;
    setProg(idx + 1); renderMeter();
    if (q.kind === 'tiles') return renderTiles(q);
    if (q.kind === 'slider') return renderSlider(q);
    return renderAlloc(q);
  }

  function renderTiles(q) {
    if (!orders[idx]) orders[idx] = shuffle(q.o.length);
    stage.innerHTML = '<h3 class="q">' + esc(q.q) + '</h3><div class="opts one" role="radiogroup">' +
      orders[idx].map(function (j) {
        var sel = answers[idx] && answers[idx].i === j;
        return '<button type="button" role="radio" aria-checked="' + (sel ? 'true' : 'false') + '" class="tile opt pop" data-o="' + j + '"><span class="tt">' + esc(q.o[j][0]) + '</span><span class="go">' + CK + '</span></button>';
      }).join('') + '</div>';
    focusHead();
    Array.prototype.forEach.call(stage.querySelectorAll('.tile'), function (b, n) {
      b.style.animationDelay = (reduce ? 0 : n * 70) + 'ms';
      b.addEventListener('click', function () {
        var j = +b.getAttribute('data-o');
        answers[idx] = { i: j, w: q.o[j][1], label: q.o[j][0], why: q.why };
        Array.prototype.forEach.call(stage.querySelectorAll('.tile'), function (x) { x.setAttribute('aria-checked', x === b ? 'true' : 'false'); });
        renderMeter();
        setTimeout(advance, reduce ? 0 : 320);
      });
    });
  }

  function renderSlider(q) {
    var n = q.steps.length, cur = answers[idx] ? answers[idx].i : q.start, touched = !!answers[idx];
    stage.innerHTML = '<h3 class="q">' + esc(q.q) + '</h3><p class="qsub">' + esc(q.sub) + '</p>' +
      '<div class="rng"><div class="rval" id="rv" aria-live="polite"></div>' +
      '<input type="range" id="rg" min="0" max="' + (n - 1) + '" step="1" value="' + cur + '" aria-label="' + esc(q.q) + '">' +
      '<div class="rticks" aria-hidden="true">' + q.steps.map(function () { return '<i></i>'; }).join('') + '</div></div>' + nextBtn('המשך');
    var rg = D.getElementById('rg'), rv = D.getElementById('rv'), nx = D.getElementById('next'), hint = D.getElementById('nhint');
    function paint() {
      var v = +rg.value; rv.textContent = q.steps[v][0];
      rg.style.setProperty('--p', (v / (n - 1) * 100) + '%');
      Array.prototype.forEach.call(stage.querySelectorAll('.rticks i'), function (t, k) { t.className = k <= v ? 'on' : ''; });
    }
    function touch() { touched = true; nx.disabled = false; hint.textContent = ''; }
    nx.disabled = !touched; hint.textContent = touched ? '' : 'הזיזו את הסמן כדי להמשיך';
    paint(); focusHead();
    rg.addEventListener('input', function () { paint(); touch(); });
    nx.addEventListener('click', function () { var v = +rg.value; answers[idx] = { i: v, w: q.steps[v][1], label: q.steps[v][0], why: q.why }; renderMeter(); advance(); });
  }

  function renderAlloc(q) {
    var TOTAL = 10, vals = answers[idx] ? answers[idx].vals.slice() : q.items.map(function () { return 0; });
    if (!orders[idx]) orders[idx] = shuffle(q.items.length);
    stage.innerHTML = '<h3 class="q">' + esc(q.q) + '</h3><p class="qsub">' + esc(q.sub) + '</p>' +
      '<div class="alloc" id="alloc">' + orders[idx].map(function (j) {
        return '<div class="alrow" data-j="' + j + '"><span class="aln">' + esc(q.items[j][0]) + '</span><div class="seg" aria-hidden="true">' + new Array(TOTAL + 1).join('<i></i>') + '</div>' +
          '<div class="stp"><button type="button" class="rb" data-d="-1" aria-label="להפחית: ' + esc(q.items[j][0]) + '">−</button><b class="cnt">0</b><button type="button" class="rb" data-d="1" aria-label="להוסיף: ' + esc(q.items[j][0]) + '">+</button></div></div>';
      }).join('') + '</div><div class="left" id="left" aria-live="polite"></div>' + nextBtn('המשך');
    var nx = D.getElementById('next'), left = D.getElementById('left');
    function paint() {
      var used = vals.reduce(function (a, b) { return a + b; }, 0);
      Array.prototype.forEach.call(stage.querySelectorAll('.alrow'), function (r) {
        var j = +r.getAttribute('data-j'), v = vals[j];
        r.querySelector('.cnt').textContent = v;
        Array.prototype.forEach.call(r.querySelectorAll('.seg i'), function (s, k) { s.className = k < v ? 'on' : ''; });
        r.querySelector('[data-d="-1"]').disabled = v === 0;
        r.querySelector('[data-d="1"]').disabled = used >= TOTAL;
      });
      left.innerHTML = used >= TOTAL ? 'כל הנקודות חולקו' : 'נשארו <b>' + (TOTAL - used) + '</b> נקודות לחלוקה';
      nx.disabled = used < TOTAL;
    }
    paint(); focusHead();
    stage.querySelector('#alloc').addEventListener('click', function (e) {
      var b = e.target.closest('.rb'); if (!b) return;
      var j = +b.closest('.alrow').getAttribute('data-j'), d = +b.getAttribute('data-d');
      var used = vals.reduce(function (a, c) { return a + c; }, 0);
      if (d > 0 && used >= TOTAL) return; if (d < 0 && vals[j] === 0) return;
      vals[j] += d; paint();
    });
    nx.addEventListener('click', function () {
      var w = {}, top = 0, topJ = 0;
      vals.forEach(function (v, j) { if (v) w[q.items[j][1]] = v * 0.8; if (v > top) { top = v; topJ = j; } });
      answers[idx] = { vals: vals, w: w, label: q.items[topJ][0], why: q.why };
      renderMeter(); advance();
    });
  }

  function advance() { if (idx < QUESTIONS.length - 1) { idx++; renderQ(); } else { finish(); } }

  function compute() {
    var total = totals();
    var first = answers[0].w;
    var ranked = ORDER.slice().sort(function (a, b) { return (total[b] + (first[b] || 0) * 0.01) - (total[a] + (first[a] || 0) * 0.01); });
    return { total: total, ranked: ranked };
  }

  /* The three answers that pushed hardest toward the winning type, in the visitor's own words. */
  function reasons(key) {
    return answers.map(function (a, i) { return { why: a.why, label: a.label, v: (a.w[key] || 0) }; })
      .filter(function (r) { return r.v > 0; }).sort(function (a, b) { return b.v - a.v; }).slice(0, 3);
  }

  function finish() {
    var c = compute(); result = c;
    var key = c.ranked[0], t = TYPES[key];
    D.getElementById('prog').hidden = true; if (meter) meter.hidden = true;
    var max = Math.max.apply(null, ORDER.map(function (k) { return c.total[k]; }).concat([1]));
    var fit = c.ranked.map(function (k, n) {
      var pct = Math.round(c.total[k] / max * 100);
      return '<div class="fit' + (n === 0 ? ' top' : '') + '"><span>' + esc(TYPES[k].short) + '</span><div class="bar"><i data-w="' + pct + '" style="width:0"></i></div><b>' + pct + '%</b></div>';
    }).join('');
    var why = reasons(key).map(function (r) { return '<li>' + CHECK + '<span><b>' + esc(r.why) + ':</b> ' + esc(r.label) + '</span></li>'; }).join('');
    stage.innerHTML =
      '<div class="rhead reveal"><span class="rtag">התוצאה שלכם</span><h2 class="rname">' + esc(t.name) + '</h2><p class="rline">' + esc(t.tag) + '</p><p class="rwhat">' + esc(t.what) + '</p></div>' +
      '<h3 class="rh">למה יצא לכם את זה</h3><ul class="sum">' + why + '</ul>' +
      '<h3 class="rh">מה חשוב לדעת</h3><ul class="sum">' + t.know.map(function (k) { return '<li>' + CHECK + '<span>' + esc(k) + '</span></li>'; }).join('') + '</ul>' +
      '<div class="rbox"><h3 class="rh">איך המשכנתה בנויה בדרך כלל</h3><p>' + esc(t.mort) + '</p></div>' +
      '<div class="rbox warn"><h3 class="rh">הסיכון המרכזי</h3><p>' + esc(t.risk) + '</p></div>' +
      '<h3 class="rh">ההתאמה שלכם לכל הסוגים</h3><div class="fits">' + fit + '</div>' +
      lookHtml(key) +
      '<div class="rnext" id="rnext"><h3 class="q">מה הצעד הבא המתאים לכם?</h3><p class="rsub">ארבע שאלות קצרות, כדי שנכוון אתכם למקום שמתאים לשלב שלכם. אין כאן חובה להשאיר פרטים.</p>' +
      NEXTQ.map(function (q) {
        return '<fieldset class="nq" data-k="' + q.k + '"><legend>' + esc(q.q) + '</legend><div class="nopts" role="radiogroup">' +
          q.o.map(function (o) { return '<button type="button" role="radio" aria-checked="false" class="nopt" data-v="' + o[0] + '">' + esc(o[1]) + '</button>'; }).join('') + '</div></fieldset>';
      }).join('') +
      '<div class="nrow"><button class="pbtn lg" id="nextGo" type="button" disabled>הציגו לי את הצעד הבא <span class="chip">' + ARW.replace('class="ar"', 'class="a"') + ARW.replace('class="ar"', 'class="b"') + '</span></button><span class="nhint" id="nextHint">ענו על כל השאלות כדי להמשיך</span></div></div>' +
      '<div class="rfoot"><button class="sbtn" id="again" type="button">מילוי מחדש</button><button class="sbtn" id="copy" type="button">העתקת קישור לשיתוף</button><span id="copyNote" class="cnote" aria-live="polite"></span></div>' +
      '<p class="disclaimer">' + esc((window.TICO_CONTENT && window.TICO_CONTENT.DISCLAIMER) || 'השאלון כללי ולא מהווה ייעוץ השקעות או ייעוץ מס. לכל סוג השקעה יש סיכונים, והמימון תלוי בבנק, בהון העצמי ובאישור הסופי.') + '</p>';
    focusHead();
    setTimeout(function () { Array.prototype.forEach.call(stage.querySelectorAll('.fit .bar i'), function (b) { b.style.width = b.getAttribute('data-w') + '%'; }); }, reduce ? 0 : 250);
    if (typeof window.gtag === 'function') window.gtag('event', 'quiz_complete', { event_category: 'quiz', event_label: key });
    D.getElementById('again').addEventListener('click', restart);
    D.getElementById('copy').addEventListener('click', function () {
      var text = 'יצאתי ' + t.name + ' בשאלון של TICO FINANCE. ואתם? ' + location.href.split('#')[0];
      var note = D.getElementById('copyNote');
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { note.textContent = 'הועתק'; }, function () { note.textContent = text; });
      else note.textContent = text;
    });
    wireNext(key, t);
  }

  /* "Next step": four short questions decide which page comes next. Nothing is sent from here; the quiz stays anonymous
     until the visitor chooses to leave details on the course or meeting page. */
  function wireNext(key, t) {
    var box = D.getElementById('rnext'), go = D.getElementById('nextGo'), hint = D.getElementById('nextHint'), sel = {};
    Array.prototype.forEach.call(box.querySelectorAll('.nopt'), function (b) {
      b.addEventListener('click', function () {
        var fs = b.closest('.nq'), k = fs.getAttribute('data-k');
        Array.prototype.forEach.call(fs.querySelectorAll('.nopt'), function (x) { x.setAttribute('aria-checked', x === b ? 'true' : 'false'); x.classList.toggle('on', x === b); });
        sel[k] = b.getAttribute('data-v');
        var done = NEXTQ.every(function (q) { return sel[q.k]; });
        go.disabled = !done; hint.textContent = done ? '' : 'ענו על כל השאלות כדי להמשיך';
      });
    });
    go.addEventListener('click', function () {
      if (go.disabled) return;
      var r = window.TicoRoute.route(sel);
      var params = new URLSearchParams(location.search), src = params.get('src') || '';
      var ctx = { type: key, typeName: t.name, eq: sel.eq, stage: sel.stage, support: sel.support, field: sel.field, route: r.id, guidedFirst: r.guidedFirst, src: src, ts: Date.now() };
      try { sessionStorage.setItem('ticoFunnel', JSON.stringify(ctx)); } catch (e) {}
      if (typeof window.gtag === 'function') window.gtag('event', 'quiz_route', { event_category: 'quiz', event_label: r.id + ':' + key, route: r.id, quiz_type: key, src: src });
      var q = new URLSearchParams({ t: key }); if (src) q.set('src', src); if (r.guidedFirst) q.set('gf', '1');
      window.location.href = r.path + '?' + q.toString();
    });
  }

  function restart() { idx = 0; answers = []; orders = []; result = null; renderQ(); window.scrollTo({ top: D.getElementById('quiz').offsetTop - 100, behavior: reduce ? 'auto' : 'smooth' }); }
  backBtn.addEventListener('click', function () { if (idx > 0) { idx--; renderQ(); } });
  renderQ();
})();
