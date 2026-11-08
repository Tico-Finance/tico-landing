// Course content. Video ids and tool links stay empty until the course is recorded.
// The public list (titles only) feeds the sales page; the full list is returned only to a signed-in member.
// video: YouTube id (unlisted). Note: unlisted links can be shared by whoever holds them; move to a protected host when volume grows.
const MODULES = [
  { id: 1, title: 'כמה אתם יכולים לממן באמת', summary: 'הון עצמי, יחס החזר ומה הבנק רואה כשהוא בוחן אתכם.', minutes: 10, video: '', tool: { title: 'גיליון חישוב: כמה אני יכול לממן', url: '' } },
  { id: 2, title: 'מבנה מימון לנכס להשקעה', summary: 'מסלולים, תמהיל וגמישות, ולמה הריבית לבדה לא מספרת את הסיפור.', minutes: 10, video: '', tool: { title: 'דוגמה ממולאת של תמהיל', url: '' } },
  { id: 3, title: 'סוגי השקעה: למי מתאים מה', summary: 'יד שנייה, פריסייל ופינוי בינוי: זמן, הון וסיכונים.', minutes: 10, video: '', tool: { title: 'טבלת השוואה בין סוגי השקעה', url: '' } },
  { id: 4, title: 'תשואה ברוטו מול נטו', summary: 'העלויות שלא מופיעות בהצעה, ואיך מחשבים לפני שמחליטים.', minutes: 10, video: '', tool: { title: 'מחשבון תשואה', url: '' } },
  { id: 5, title: 'טעויות מימון שסוגרות את העסקה הבאה', summary: 'איך מנצלים את כל יכולת המימון בעסקה אחת ונתקעים.', minutes: 8, video: '', tool: { title: 'צ\'קליסט: 5 טעויות מימון', url: '' } },
  { id: 6, title: 'לפני הבנק', summary: 'מסמכים, שאלות ומשא ומתן: איך מגיעים מוכנים.', minutes: 10, video: '', tool: { title: 'רשימת מסמכים ושאלות לבנק', url: '' } },
  { id: 7, title: 'תוכנית ל-12 חודשים והצעד הבא', summary: 'מסכמים ובונים מפת דרכים אישית.', minutes: 8, video: '', tool: { title: 'מפת דרכים אישית', url: '' } }
];

function publicModules() {
  return MODULES.map(({ id, title, summary, minutes }) => ({ id, title, summary, minutes }));
}

module.exports = { MODULES, publicModules };
