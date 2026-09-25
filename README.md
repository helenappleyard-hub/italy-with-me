# Italy With Me

Website for Italy With Me – Your personal Florence Guide (Helen Appleyard).

See `PROJECT_CONTEXT.md` for the project brief.

## Website

The public website lives in `site/`. Only that folder is published: the
`Deploy site to GitHub Pages` workflow (`.github/workflows/pages.yml`) uploads
it to GitHub Pages whenever `site/` changes on `main`. It can also be run by
hand from the repo's **Actions** tab.

`site/index.html` is the register-interest landing page, built from the
Claude Design file "Register Interest v4" and its Italy With Me design system
(`site/ds/`: fonts, colour/type/spacing tokens and component styles).
Page-specific layout is in `site/css/page.css`; the form logic is in
`site/js/signup.js`. Copy rule from the design project: no em dashes in copy.

### Connecting sign-ups to a Google Sheet (done once, by Helen)

**Status (25 Sep 2026): done.** The live Sheet is **Italy With Me – Bookings**
(sign-ups go to its "Sign-ups" tab). Only people Helen has shared them with
can open these links:

- Sheet: https://docs.google.com/spreadsheets/d/1bcByb_Yr_XEcg9611dfM7jGlbDAldhArNark5-ThVg8/edit
- Apps Script project: https://script.google.com/u/0/home/projects/1FyO7YPKUfSj8sjZAJUypRujrPFt2d8dK9kfAhLOeeJICGyzqhCvoNLkj/edit

The script is deployed as a web app
(version 1) and its URL is set in `site/js/signup.js`. If `SIGNUP_ENDPOINT`
is ever emptied, the form checks the email address and then asks visitors
to email Helen directly; nothing is saved.

To update the script later, paste the new `Code.gs` into the Sheet's Apps
Script project and use **Deploy → Manage deployments → Edit → New version**,
so the URL stays the same. A new deployment gives a new URL.

Original setup steps, for reference:

1. In Google Drive, create a new Google Sheet (the live one is **Italy With Me – Bookings**).
2. In the Sheet: **Extensions → Apps Script**. Delete what is there and paste
   in the whole of `apps-script/Code.gs`. Click **Save**.
3. Click **Deploy → New deployment**. Click the cog next to "Select type" and
   choose **Web app**. Set **Execute as: Me** and **Who has access: Anyone**.
   Click **Deploy**, then **Authorize access** and allow it (Google may warn
   the app is unverified: choose Advanced → Go to project).
4. Copy the **Web app URL** (it ends in `/exec`) and send it to whoever
   maintains the site. It goes in `SIGNUP_ENDPOINT` at the top of
   `site/js/signup.js`.

Each sign-up then adds a row (date, first name, email, and the optional
when / who / which walk answers) and emails helenappleyard@live.com.au.
The URL is not secret, but only lets people add sign-ups. A hidden
"honeypot" field drops simple spam bots.

### One-time GitHub Pages setup (done by Helen in GitHub)

1. Repo **Settings → Pages → Build and deployment → Source**: choose **GitHub Actions**.
2. Merge the site files into `main` (or run the workflow from the **Actions** tab); the first deploy happens then.
3. Back in **Settings → Pages → Custom domain**: enter `italywithme.com.au` and save.
4. Once the DNS check passes (below), tick **Enforce HTTPS**. The certificate can take up to an hour to be issued.

### GoDaddy DNS records for the website

In GoDaddy: **My Products → italywithme.com.au → DNS**.

1. Delete the existing `A` record for `@` (GoDaddy's "Parked" record) and any
   GoDaddy website-forwarding. If `www` is a `CNAME` pointing to `@`, edit it
   as below rather than adding a second one.
2. Add or edit:

| Type  | Name | Value                   | TTL     |
| ----- | ---- | ----------------------- | ------- |
| A     | @    | 185.199.108.153         | 1 hour  |
| A     | @    | 185.199.109.153         | 1 hour  |
| A     | @    | 185.199.110.153         | 1 hour  |
| A     | @    | 185.199.111.153         | 1 hour  |
| AAAA  | @    | 2606:50c0:8000::153     | 1 hour  |
| AAAA  | @    | 2606:50c0:8001::153     | 1 hour  |
| AAAA  | @    | 2606:50c0:8002::153     | 1 hour  |
| AAAA  | @    | 2606:50c0:8003::153     | 1 hour  |
| CNAME | www  | helenappleyard-hub.github.io | 1 hour |

3. **Keep** the `TXT` record `_github-pages-challenge-helenappleyard-hub` (domain
   verification). Leave any other TXT/MX/email records alone.

`italywithme.com.au` is the main address; GitHub automatically redirects
`www.italywithme.com.au` to it. DNS changes usually apply within an hour
but can take up to 48 hours.

## Credits

- Fleur-de-lys ornament: [Lorc](https://lorcblog.blogspot.com/), from [game-icons.net](https://game-icons.net/), licensed [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/).
- Icons: [Lucide](https://lucide.dev/) (ISC licence).
- Fonts: Cormorant Garamond, Cinzel, Source Serif 4 and Caveat (SIL Open Font License), self-hosted in `site/ds/fonts/`.
