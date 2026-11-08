# Legal review: what to check before the course and funnel go live

I am not a lawyer. This lists gaps I can see in the current site text and wording that needs a professional's approval. Nothing here has been published.

## Current `terms.html` (updated June 2026)
Covers mortgages and the savings calculator only. Missing for the new offers:
1. **Paid digital product (the Masterclass):** what is sold, price including VAT, access by personal code, license for personal use only, no sharing of the code, no copying or resale of videos, tools and files.
2. **Cancellation and refund:** the sales page carries the wording below. It must be consistent with the terms page.
3. **Paid services:** the 45-minute strategy session (350 + VAT) and full guidance (price range stated on the meeting page): scope, no guaranteed outcome, how fees are agreed before work starts.
4. **Education vs advice:** the existing section 2 covers the calculator only. Extend it to the quiz, the course, the tools and all educational content.
5. **Business details:** name, contact and (if required) address, shown where the purchase happens.

### Cancellation wording to check (supplied by Chico)
> מכיוון שמדובר במוצר דיגיטלי הכולל הורדה מיידית של מחשבונים וקבצים ניתנים לשכפול, לא ניתן לבטל את העסקה או לקבל החזר כספי לאחר קבלת הגישה לתכנים (בהתאם לחוק הגנת הצרכן למוצרים דיגיטליים).

Questions for the lawyer:
- Is a no-cancellation clause valid for this product? The course is mainly **video access** (streaming) plus downloadable tools. The sentence speaks about downloads only, so check it matches what is actually delivered, and whether the remote-sale cancellation rules (and their exceptions) apply to streamed content and to the paid sessions.
- Must the clause be shown before payment with a ticked acknowledgement (I suggest a checkbox next to the pay button)?
- Does the cited statute reference need to be exact?

## Current `privacy.html` (updated June 2026)
Gaps for the new flows:
1. **New data:** payment details (handled by the card processor, not by us), email used for the access code, access code and sign-in activity, quiz answers (equity range, stage) once a form is submitted.
2. **Third parties that process data**, to be listed by name or category: Google (Sheets/Apps Script backup, Analytics), SmartNPV (CRM), Vercel (hosting and analytics), the card processor, Meta (comment and message automation), the email provider that will send access codes. The current text says data is not passed to third parties except to provide the service, so it needs updating.
3. **Marketing consent:** direct marketing messages need prior explicit consent (Israeli communications law, section 30A). The forms already have a consent checkbox; the wording should say marketing messages are included.
4. **Retention and deletion:** how long leads and members are kept, and how to ask for deletion.
5. **Database registration / privacy officer** obligations, if applicable at this volume.
6. **Cookies:** the course area uses an essential, HttpOnly sign-in cookie. Mention it.

## On the funnel pages themselves
- Every page already carries the educational-only, no-guarantee disclaimer (`assets/js/funnel-content.js`).
- The quiz result says "deal types this profile usually examines". Have the lawyer confirm that this is general information and not advice.
- "Maximize your financing capacity" in the course title versus the module warning against using all of it in one deal: see the open question in the summary; wording should be consistent.

## Pre-launch confirmation
- [ ] Lawyer approves cancellation clause and terms additions.
- [ ] Privacy policy updated and dated.
- [ ] Terms and privacy links shown next to the pay button and on the meeting form.
