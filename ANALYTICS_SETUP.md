# Google Analytics setup for ExactEDI

You have **two options**. If GTM confused you, use **Option A** (about 5 minutes, no Tag Manager).

---

## Option A — Direct GA4 (recommended, no GTM)

The site can send analytics **directly to Google Analytics** once you add one ID. No tags, triggers, or publishing in Tag Manager.

### Step 1 — Create a GA4 property (you must do this in Google)

1. Open [analytics.google.com](https://analytics.google.com/) and sign in.
2. Click **Admin** (gear, bottom left).
3. **Create** → **Property** → name it `ExactEDI` → follow the prompts.
4. Under the property, **Data collection** → **Data streams** → **Add stream** → **Web**.
5. Website URL: `https://www.exactedi.com` → Create stream.
6. Copy the **Measurement ID** — it looks like `G-XXXXXXXXXX`.

### Step 2 — Add the ID to your environment

**Local** (`.env` in this project):

```env
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_USE_GTM=false
```

Replace `G-XXXXXXXXXX` with your real ID.

**Production** (Vercel):

1. Project → **Settings** → **Environment Variables**
2. Add `VITE_GA4_MEASUREMENT_ID` = `G-XXXXXXXXXX`
3. Add `VITE_USE_GTM` = `false`
4. **Redeploy** the site (Deployments → … → Redeploy).

### Step 3 — Verify it works

1. Open [analytics.google.com](https://analytics.google.com/) → your property → **Reports** → **Realtime**.
2. In another tab, visit `https://www.exactedi.com/` and click a few pages.
3. Within ~30 seconds you should see yourself in Realtime.

That’s it. The codebase handles page views on every route change automatically.

---

## Option B — Google Tag Manager + GA4 (advanced)

Use this only if you already rely on GTM for other marketing tags.

1. Keep `VITE_USE_GTM` unset (or `true`) and `VITE_GTM_ID=GTM-522ZBZWZ` (or your container ID).
2. In [tagmanager.google.com](https://tagmanager.google.com/), add:
   - **Google Tag** with your `G-` Measurement ID → trigger **Initialization – All Pages**
   - **GA4 Event** `page_view` → trigger **Custom Event** `page_view`
3. Create Data Layer Variables: `page_location`, `page_path`, `page_title`.
4. **Publish** the container.

**Do not use Option A and Option B together** with the same `G-` ID — that can double-count visits. Pick one.

---

## Environment variables

| Variable | Purpose |
|----------|---------|
| `VITE_GA4_MEASUREMENT_ID` | **Option A:** your `G-XXXXXXXXXX` ID |
| `VITE_USE_GTM` | Set `false` to disable GTM snippet (recommended with Option A) |
| `VITE_GTM_ID` | **Option B only:** `GTM-XXXXXXX` from Tag Manager |
| `VITE_ENABLE_ANALYTICS` | Set `false` to disable all tracking locally |
| `VITE_SITE_URL` | Canonical site URL |

---

## Events tracked automatically

| Event | When |
|-------|------|
| `page_view` | Every page / route change |
| `view_pricing` | `/pricing` |
| `view_roadmap` | `/roadmap` |
| `view_product` | `/product` |
| `view_dev_docs` | `/dev-docs/*` |
| `view_request_access` | `/request-access` |
| `beta_form_submit` | Beta form success |
| `cta_click` | Use-case CTAs |

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Nothing in Realtime | Wrong `G-` ID, or Vercel not redeployed after env change |
| Still see GTM errors | Set `VITE_USE_GTM=false` and redeploy |
| Double counts | Use only Option A **or** Option B, not both with same property |
| Local dev noise | `VITE_ENABLE_ANALYTICS=false` in `.env.local` |

---

## What we cannot do for you

Google Analytics and Tag Manager require **your** Google login. Nobody else can create the property or see your data without access to your account.

If you paste your **Measurement ID** (`G-…`) here (not a secret — it’s visible in browser source), we can confirm your `.env` / Vercel entries are correct. **Do not** share Google passwords or service-account keys.
