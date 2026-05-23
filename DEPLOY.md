# Deploy ExactEDI marketing site to Vercel

## Git commit author (Vercel / GitHub)

Commits should be authored as **Trent** `<trent.adams0201@gmail.com>`. Before committing:

```bash
source scripts/git-author-env.sh
git commit -m "Your message"
git push origin master
```

(Vercel deploys from the GitHub push; the email above should match your GitHub account for consistent attribution.)

## 1. Push this repo to GitHub

```bash
cd /home/ghostcipher/Documents/exactedi-web
git init
git add .
git commit -m "ExactEDI marketing site — Vercel, local blog, GTM"
git branch -M main
git remote add origin https://github.com/YOUR_ORG/exactedi-web.git
git push -u origin main
```

## 2. Import in Vercel

1. [vercel.com/new](https://vercel.com/new) → Import the GitHub repo.
2. Framework preset: **Vite** (auto-detected).
3. Build command: `npm run build`
4. Output directory: `out`

## 3. Environment variables (Vercel → Settings → Environment Variables)

| Variable | Value |
|----------|--------|
| `VITE_SITE_URL` | `https://exactedi.com` |
| `RESEND_API_KEY` | From [resend.com](https://resend.com) (free tier) |
| `LEADS_TO_EMAIL` | `contact@exactedi.com` |
| `RESEND_FROM_EMAIL` | `ExactEDI <notifications@exactedi.com>` after domain verify |

Optional: `LEADS_WEBHOOK_URL` — Slack/Discord webhook instead of email.

## 4. Custom domain

Vercel → Project → **Domains** → Add `exactedi.com` and `www.exactedi.com`.

Update DNS at your registrar (Vercel shows exact records):

- `A` / `CNAME` for apex and `www` as instructed.

Remove or repoint old Readdy DNS when ready.

## 5. Analytics

- **Recommended:** set `VITE_GA4_MEASUREMENT_ID` + `VITE_USE_GTM=false` — see **[ANALYTICS_SETUP.md](./ANALYTICS_SETUP.md) Option A** (no Tag Manager).
- **Optional:** GTM + GA4 tags in Tag Manager — Option B in the same doc.
- After deploy: GA4 **Realtime** report while browsing the site.

## 6. Google Search Console

1. Verify property (meta tag already in `index.html`).
2. Submit sitemap: `https://exactedi.com/sitemap.xml`

## 7. Blog content (local, in git)

Add posts as Markdown in `content/blog/*.md` with YAML frontmatter. See existing posts for the schema.

Product truth source: `../exactedi/WEBSITE_BRIEF.md` and `../exactedi/benchmarks/README.md` on this machine.

## 8. Test after deploy

- [ ] `/product` loads
- [ ] `/robots.txt` returns plain text (not the SPA HTML shell)
- [ ] `/sitemap.xml` returns XML with `/product` and dev-doc URLs
- [ ] `/use-cases/payers` loads
- [ ] `/blog` and both cornerstone posts load
- [ ] Beta form submits (check Resend inbox)
- [ ] GTM Preview shows tags on navigation
- [ ] `curl -I https://exactedi.com/sitemap.xml` → 200
