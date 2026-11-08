#!/usr/bin/env python3
"""Builds the investor funnel pages and the course pages (all noindex, not linked from the site).

Usage (from the repository root):  python3 tools/build_funnel.py

Pages:  /investor-type/learn/  /investor-type/meeting/  /investor-type/pro/
        /course/  /course/thanks/  /course/members/
Wording lives here and in assets/js/funnel-content.js. Settings (draft flag, payment link) live in assets/js/funnel-config.js.
Course modules come from api/_course-data.js, so the sales page and the member area never drift apart.
"""
import html as _html
import json
import os
import re
import subprocess
import sys

sys.path.insert(0, os.path.dirname(__file__))
import chrome as C  # noqa: E402
import build_pages as B  # noqa: E402

ROOT = B.ROOT


def esc(t):
    return _html.escape(t, quote=True)


def _disclaimer():
    js = open(os.path.join(ROOT, 'assets/js/funnel-content.js'), encoding='utf-8').read()
    return re.search(r"var DISCLAIMER = '(.*?)';", js, re.S).group(1)


def _modules():
    out = subprocess.check_output(['node', '-p', "JSON.stringify(require('./api/_course-data.js').publicModules())"], cwd=ROOT)
    return json.loads(out)


DISCLAIMER = _disclaimer()
ARROW = C.ARROW
CHIP = C.CHIP


def head(title, desc):
    return (f'<meta charset="utf-8"/>\n<meta name="viewport" content="width=device-width, initial-scale=1"/>\n'
            f'<meta name="color-scheme" content="only light"/>\n<meta name="theme-color" content="#ffffff"/>\n{C.ICONS}\n{C.GA}\n'
            f'<title>{esc(title)} | TICO FINANCE</title>\n<meta name="description" content="{esc(desc)}"/>\n'
            f'<meta name="robots" content="noindex, nofollow"/>\n{C.FONTS}\n{C.CSS_LINK}'
            f'<link rel="stylesheet" href="/assets/css/investor-quiz.css?v=1"><link rel="stylesheet" href="/assets/css/paths.css?v=1">')


def scripts(page, extra=''):
    return ('<script src="/assets/js/funnel-config.js"></script>\n<script src="/assets/js/funnel-content.js"></script>\n'
            f'<script src="/assets/js/funnel.js" defer></script>{extra}')


def page(path, title, desc, body, page_id, extra_scripts=''):
    doc = B.document('he', head(title, desc), f'<div class="quiz fp" data-page="{page_id}">{body}</div>', scripts(page_id, extra_scripts))
    B.write(path, doc)
    print('built', path)


FINE = f'<p class="fine" id="disc">{esc(DISCLAIMER)}</p>'


def phead(kicker, h1, lede):
    return f'<div class="phead"><div class="kicker">{esc(kicker)}</div><h1 class="hx h1page">{h1}</h1><p class="lede">{esc(lede)}</p></div>'


def build_learn():
    body = phead('תוכן ללימוד עצמי', 'התוכן שמתאים <em id="typeName">לכם</em>', 'בחרתם ללמוד בקצב שלכם, וזה בדיוק מה שנכון להתחלה. הנה הדרך שאני ממליץ להתחיל בה.') + '''
<div id="lookBox" hidden><div class="box gold"><h3>סוגי עסקאות שפרופיל כזה בדרך כלל בוחן</h3><ul class="plain" id="lookList"></ul><p class="note" id="lookCheck" style="margin-top:12px"></p></div></div>
<h2>נושאים ללמידה</h2>
<div class="grid2" id="topics"></div>
<div class="box"><h3>מה אנחנו כן ומה לא</h3>
<p>כאן תמצאו הסברים כלליים שעוזרים להבין איך עסקאות ומימון עובדים, כדי שתגיעו לכל החלטה מוכנים יותר.</p>
<p>אנחנו לא מבטיחים תשואה, חיסכון או אישור מימון, ואין כאן המלצה לקנות נכס מסוים. כל מצב שונה, והחלטות כספיות דורשות בדיקה אישית עם אנשי מקצוע.</p></div>
<h2>כשתרצו ללכת צעד קדימה</h2>
<p>קורס קצר שמלמד את השיטה עם כלים מעשיים, בעלות נמוכה ובלי התחייבות להמשך.</p>
<div class="btnrow"><a class="pbtn" id="toCourse" href="/course/">לקורס הקצר ''' + CHIP + '''</a><a class="sbtn" href="/investor-type/">מילוי מחדש של השאלון</a></div>
''' + FINE
    page('investor-type/learn/index.html', 'תוכן ללימוד עצמי למשקיעים', 'תוכן חינוכי כללי למשקיעי נדל"ן, לפי סוג ההשקעה שיצא לכם בשאלון.', body, 'learn')


def build_meeting():
    body = phead('פגישת התאמה', 'פגישת התאמה <em>לליווי מלא</em>', 'בפגישה נבדוק יחד אם הליווי מתאים לכם ולעסקה שאתם בוחנים. אין התחייבות, ואם הוא לא מתאים, נגיד לכם את זה.') + '''
<div class="box gold"><h3>שקיפות מלאה לפני שקובעים</h3>
<p><b>הליווי המלא הוא שירות בתשלום.</b> <span id="meetPrice">בדרך כלל בין 8,000 ל-10,000 ש"ח + מע"מ, בהתאם להיקף העבודה. המחיר הסופי נקבע בפגישה, לפני שמתחילים.</span></p>
<p>הפגישה עצמה היא לבדיקת התאמה. היא אינה ייעוץ אישי מלא ואינה התחייבות לעבוד יחד.</p></div>
<h2>מה הליווי כולל</h2>
<ul class="plain" id="meetIncl">
<li>בניית מתווה מימון לפי ההון, היעדים והעסקה שלכם.</li>
<li>הכנה מסודרת למפגשים מול הבנקים, כולל מסמכים ושאלות.</li>
<li>ליווי לאורך התהליך, עד לחתימה.</li></ul>
<h2>מה אנחנו לא מבטיחים</h2>
<ul class="plain"><li>אישור מימון: ההחלטה בידי הבנק ותלויה בהון העצמי וביכולת ההחזר שלכם.</li>
<li>תשואה, רווח או חיסכון מסוימים: אלה משתנים בין עסקאות ובין אנשים.</li>
<li>שהעסקה שאתם בוחנים כדאית: נבדוק אותה יחד, והמסקנה יכולה להיות שלא כדאי.</li></ul>
<h2>בקשה לפגישה</h2>
<p class="note" id="bookNote">השאירו פרטים ואחזור אליכם לקבוע מועד.</p>
<form class="form" id="meetForm" novalidate>
<div class="fld"><label for="mn">שם מלא</label><input id="mn" autocomplete="name"><div class="err" id="mnE"></div></div>
<div class="fld"><label for="mp">טלפון</label><input id="mp" type="tel" inputmode="tel" autocomplete="tel" dir="ltr" placeholder="050-0000000"><div class="err" id="mpE"></div></div>
<div class="fld"><label for="md">איזו עסקה אתם בוחנים?</label><select id="md"><option value="">בחרו</option><option>יד שנייה</option><option>פריסייל</option><option>פינוי בינוי</option><option>עוד לא החלטתי</option></select></div>
<div class="fld"><label for="mt">מתי אתם מתכננים לפעול?</label><select id="mt"><option value="">בחרו</option><option>עד 3 חודשים</option><option>3 עד 12 חודשים</option><option>יותר משנה</option></select></div>
<div class="fld full hp" aria-hidden="true"><label for="website">אל תמלאו</label><input id="website" tabindex="-1" autocomplete="off"></div>
<label class="consent" style="grid-column:1/-1"><input type="checkbox" id="mc"><span>אני מאשר/ת קבלת מידע מ-TICO FINANCE בהתאם ל<a href="/privacy.html">מדיניות הפרטיות</a></span></label>
<div class="err" id="mErr" style="grid-column:1/-1"></div>
<button class="sbm" id="msub" data-s="idle" type="submit"><span class="l">שלחו בקשה לפגישה</span><span class="ld"><svg class="spin" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"><circle cx="12" cy="12" r="9" opacity=".3"/><path d="M12 3a9 9 0 0 1 9 9"/></svg></span><span class="ok">נשלח</span></button>
</form>
<div class="okbox" id="mOk"></div>
<div class="btnrow" id="bookRow" hidden><a class="pbtn lg" id="bookBtn" href="#" target="_blank" rel="noopener">לקביעת פגישה ''' + CHIP + '''</a></div>
''' + FINE
    page('investor-type/meeting/index.html', 'פגישת התאמה לליווי', 'פגישת התאמה לליווי מלא בנדל"ן להשקעה: מה כלול, כמה זה עולה, ומה אנחנו לא מבטיחים.', body, 'meeting')


def build_pro():
    body = phead('תודה על המענה', 'התוכן הציבורי שלנו <em>פתוח לכולם</em>', 'הליווי והקבוצה שלנו מיועדים למשקיעים פרטיים. אתם מוזמנים להמשיך לעקוב אחרי התוכן שאנחנו מפרסמים.') + f'''
<div class="grid2">
<a class="tcard" href="{C.IG_URL}" target="_blank" rel="noopener"><b>אינסטגרם</b><span>תוכן קצר ושוטף על נדל"ן ומימון.</span></a>
<a class="tcard" href="{C.YOUTUBE_URL}" target="_blank" rel="noopener"><b>יוטיוב</b><span>הסברים מלאים יותר.</span></a>
<a class="tcard" href="{C.SPOTIFY_URL}" target="_blank" rel="noopener"><b>הפודקאסט: תשואה משולשת</b><span>שיחות על השקעות ומימון.</span></a>
<a class="tcard" href="/blog/"><b>הבלוג</b><span>מאמרים על משכנתאות ונדל"ן.</span></a></div>
''' + FINE
    page('investor-type/pro/index.html', 'תוכן ציבורי', 'התוכן הציבורי של TICO FINANCE פתוח לכולם.', body, 'pro')


def build_course():
    mods = _modules()
    items = ''.join(f'<li><div><b>{esc(m["title"])}</b><small>{esc(m["summary"])} (כ-{m["minutes"]} דקות)</small></div></li>' for m in mods)
    body = phead('קורס קצר למשקיעים', '<span id="cName">שם הקורס</span>', 'בפחות משעה וחצי תדעו כמה נכסים אתם יכולים לממן, איך בונים מימון לנכס הבא, ומה לבדוק לפני שחותמים.') + f'''
<div class="box gold" id="gfBox" hidden><h3>מומלץ להתחיל כאן</h3><p>לפי התשובות שלכם, כדאי להתחיל בקורס, ולאחריו נשמח להיפגש ולבדוק את הצעד הבא.</p></div>
<h2>למי זה מתאים</h2>
<ul class="plain"><li>למי שמתכנן/ת נכס ראשון להשקעה או נוסף, ורוצה להבין את צד המימון לפני שמתחילים.</li>
<li>למי שמעדיף/ה ללמוד שיטה מסודרת בקצב שלו/ה, בלי ליווי אישי.</li></ul>
<h2>מה בפנים</h2>
<ol class="mods">{items}</ol>
<div class="box"><h3>כלים מעשיים שמקבלים</h3><ul class="plain"><li>גיליון חישוב: כמה אפשר לממן.</li><li>מחשבון תשואה.</li><li>צ'קליסטים ורשימת שאלות לבנק, ומפת דרכים אישית.</li></ul></div>
<h2>מה הקורס לא</h2>
<ul class="plain"><li>הוא לא ייעוץ אישי ולא מתאים את עצמו למצב הספציפי שלכם.</li>
<li>הוא לא מבטיח אישור מימון, תשואה או חיסכון.</li>
<li>הוא לא תחליף לעורך דין, יועץ מס או בדיקה אישית מול הבנק.</li></ul>
<h2>מחיר ותנאים</h2>
<div class="price"><b>₪<span id="cPrice">297</span></b><span id="cVat">תשלום חד-פעמי. [כולל / לא כולל מע"מ: להחלטה]</span></div>
<ul class="plain"><li>מיד אחרי התשלום תקבלו קוד כניסה וסיסמה לאזור הקורס. <span id="cDelivery">[זמן המסירה: להחלטה]</span></li>
<li id="cRefund">תנאי ביטול והחזר: [להחלטה, לבדיקה משפטית, ויפורסמו כאן לפני הפתיחה].</li></ul>
<div class="btnrow"><a class="pbtn lg" id="payBtn" href="#" aria-disabled="true" target="_blank" rel="noopener"><span id="payLabel">התשלום יפתח בקרוב</span> {CHIP}</a><a class="sbtn" href="/course/members/">כבר רכשתם? כניסה לאזור הקורס</a></div>
<p class="note">בלחיצה על התשלום תעברו לעמוד תשלום מאובטח של חברת האשראי.</p>
''' + FINE
    page('course/index.html', 'קורס קצר למשקיעים', 'קורס קצר שמלמד איך בונים מימון לנכס להשקעה, עם כלים מעשיים. מידע חינוכי בלבד.', body, 'course')


def build_thanks():
    body = phead('תודה על הרכישה', 'התשלום <em>התקבל</em>', 'קוד הכניסה והסיסמה לאזור הקורס יישלחו אליכם. כדאי לשמור אותם במקום בטוח.') + '''
<div class="box"><h3>מה קורה עכשיו</h3><ul class="plain"><li>תקבלו קוד כניסה וסיסמה <span id="tDelivery">[זמן המסירה: להחלטה]</span>.</li>
<li>עם הפרטים תיכנסו לאזור הקורס ותוכלו לצפות בפרקים בקצב שלכם.</li>
<li>לא קיבלתם? כתבו לי בוואטסאפ ונסדר.</li></ul></div>
<div class="btnrow"><a class="pbtn" href="/course/members/">לאזור הקורס ''' + CHIP + f'''</a><a class="wbtn" href="{C.wa('היי צ\'יקו, רכשתי את הקורס ועדיין לא קיבלתי קוד כניסה.')}" target="_blank" rel="noopener"><span class="g">{C.WA_GLYPH}</span><span>וואטסאפ<small>ישר אליי</small></span></a></div>
''' + FINE
    page('course/thanks/index.html', 'תודה על הרכישה', 'אישור רכישה והמשך לאזור הקורס.', body, 'thanks')


def build_members():
    body = '''<div class="mem">
<div id="memLogin" class="login"><div class="phead"><div class="kicker">אזור הקורס</div><h1 class="hx h1page">כניסה <em>לקורס</em></h1><p class="lede">הזינו את קוד הכניסה והסיסמה שקיבלתם אחרי הרכישה.</p></div>
<form class="form" id="loginForm" novalidate>
<div class="fld"><label for="lc">קוד כניסה</label><input id="lc" autocomplete="username" dir="ltr" placeholder="TICO-XXXX-XXXX"></div>
<div class="fld"><label for="lp">סיסמה</label><input id="lp" type="password" autocomplete="current-password" dir="ltr"></div>
<div class="err" id="lErr"></div>
<button class="sbm" id="lsub" data-s="idle" type="submit"><span class="l">כניסה</span><span class="ld"><svg class="spin" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"><circle cx="12" cy="12" r="9" opacity=".3"/><path d="M12 3a9 9 0 0 1 9 9"/></svg></span><span class="ok">נכנסתם</span></button></form>
<p class="note" style="margin-top:14px">עוד לא רכשתם? <a href="/course/">לעמוד הקורס</a>. בעיה בכניסה? כתבו לי בוואטסאפ.</p></div>
<div id="memClosed" hidden><div class="phead"><div class="kicker">אזור הקורס</div><h1 class="hx h1page">האזור עדיין <em>לא נפתח</em></h1><p class="lede">הקורס בהכנה. נעדכן כשהוא יהיה זמין.</p></div></div>
<div id="memArea" hidden>
<div class="bar2"><div><div class="kicker">אזור הקורס</div><h1 class="hx h1page" style="margin:0" id="memHello">הקורס שלכם</h1></div><button class="sbtn" id="logoutBtn" type="button">יציאה</button></div>
<div class="layout"><nav class="side" id="memNav" aria-label="פרקי הקורס"></nav><section class="stage" id="memStage" aria-live="polite"></section></div>
<p class="fine" id="disc">''' + esc(DISCLAIMER) + '''</p></div></div>'''
    page('course/members/index.html', 'אזור הקורס', 'כניסה לאזור הקורס עם קוד וסיסמה.', body, 'members', '<script src="/assets/js/course-members.js" defer></script>')


if __name__ == '__main__':
    for fn in (build_learn, build_meeting, build_pro, build_course, build_thanks, build_members):
        fn()
