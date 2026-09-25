# Italy With Me

Website for Italy With Me – Your personal Florence Guide (Helen Appleyard).

See `PROJECT_CONTEXT.md` for the project brief.

## Website

The public website lives in `site/`. Only that folder is published: the
`Deploy site to GitHub Pages` workflow (`.github/workflows/pages.yml`) uploads
it to GitHub Pages whenever `site/` changes on `main`. It can also be run by
hand from the repo's **Actions** tab.

`site/index.html` is currently a temporary "coming soon" holding page marked
`noindex`. Replace it with the real landing page when that is ready.

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
