# Investor funnel and course: setup and review

Status: **built, not published.** Everything is on branch `claude/wizardly-goldberg-ec8zb1`. Nothing is merged to `main`, nothing is linked from the site, every new page is `noindex`, and every new page shows a "draft" banner and sends no data.

## The flow
1. Post or reel ends with the keyword (`משקיע`). Meta automation replies in the comments and sends a DM with the quiz link, ideally `/investor-type/?src=<post-name>` (one link per automation, so we learn which post works).
2. `/investor-type/`: seven quiz steps, result with "deal types this profile usually examines", then four "next step" questions (equity range, stage, what helps now, relation to the field).
3. Routing (`assets/js/funnel-route.js`, unit-tested):

| answers | page |
|---|---|
| works in the field | `/investor-type/pro/` |
| learn alone | `/investor-type/learn/` |
| short course | `/course/` |
| guided, stage not "just curious", equity 200K or more (or not stated) | `/investor-type/meeting/` |
| guided but not ready | `/course/?gf=1` (start with the course, or the paid 45-minute strategy session at `/investor-type/strategy/`) |

The quiz itself sends no personal data. Details are collected only on the meeting form (and by the card processor on payment). Anonymous analytics events: `quiz_complete`, `quiz_route`, `funnel_view`, `learn_topic`, `begin_checkout`, `generate_lead`.

## Course system
- `/course/` sales page, `/course/thanks/` (card processor return URL), `/course/members/` (sign-in + modules).
- Sign-in is server side: `api/course-login.js` checks code + password (scrypt hash, constant-time compare, rate limited) and sets a signed `HttpOnly; Secure; SameSite=Strict` cookie. `api/course-content.js` returns videos and tool links only to a valid session. `api/course-logout.js` clears it.
- Modules, video ids and tool links: `api/_course-data.js` (empty until recorded). The sales page lists are generated from the same file.
- Env vars in Vercel: `COURSE_SECRET` (long random string) and `COURSE_USERS` (JSON, see below). Without them the member area says "not open yet".

### Giving a buyer access
```bash
node tools/course-access.js "Buyer name" 2027-12-31   # expiry optional
```
It prints the code and password to send, and a JSON entry. Add the entry to `COURSE_USERS` in Vercel and redeploy. To revoke: delete the entry and redeploy (live sessions stop working too).

Limits to know: each new buyer needs an env update and redeploy (move to Edge Config or a database if volume grows); a code can be shared by its owner (expiry and monitoring help); unlisted YouTube links can be passed on (use a protected video host later if this matters).

### Payment
Create a hosted payment page at the card processor, set its return URL to `/course/thanks/`, and put the link in `assets/js/funnel-config.js` (`paymentUrl`). The button stays off until `paymentUrl` is set and `draft` is `false`.

## Tests
```bash
node tools/test-course-auth.js     # sign-in, tamper, revoke, expiry, rate limit, missing config
python3 tools/build_funnel.py      # regenerates the six new pages
```
The routing function is pure (`assets/js/funnel-route.js`) and was checked for all five routes.

## Publish checklist (do not skip)
- [ ] Course recorded, video ids and tool links filled in `api/_course-data.js`; final length confirmed before claiming "under an hour and a half".
- [ ] Every sentence on every new page reviewed (education only, no promises). Items marked "להחלטה" in the pages are open decisions: VAT wording, delivery time, refund and cancellation terms (check consumer-law rules for digital content), course name.
- [ ] Meeting page: confirm the stated price range and what the guidance includes.
- [x] Equity threshold for the meeting route: 200K (decided).
- [ ] Add a course section to `terms.html` and make sure `privacy.html` covers the new data.
- [ ] Set `COURSE_SECRET`, `COURSE_USERS`, `paymentUrl`; set `draft: false` in `assets/js/funnel-config.js`.
- [ ] Decide linking: Meta automation links, and whether to list the quiz on `/investors/`.
- [ ] Remove the `noindex` rules in `vercel.json` only for pages that should be found in search (the course members area and thanks page should stay noindex).
- [ ] Test end to end on the preview deployment with a real test purchase and a test code.
- [ ] Merge to `main` only after approval.
