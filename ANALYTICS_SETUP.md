# Google Analytics (GA4) via Google Tag Manager

ExactEDI loads **Google Tag Manager** from `index.html` and pushes SPA `page_view` and conversion events from the React app. **GA4 is configured inside GTM**, not in this repository.

If GTM shows **“Tag stopped sending data”**, the container snippet is usually fine — the **GA4 tag is missing, unpublished, or uses the wrong Measurement ID**. Follow the steps below.

---

## 1. Confirm the GTM container ID

1. Open [Google Tag Manager](https://tagmanager.google.com/) → container **www.exactedi.com**.
2. **Admin** → **Install Google Tag Manager** → copy the ID (`GTM-XXXXXXX`).
3. It must match what the site loads:
   - Default in repo: `GTM-522ZBZWZ`
   - Override in Vercel: **`VITE_GTM_ID`** = your `GTM-XXXXXXX` (then redeploy).

**Verify on the live site**

1. Visit `https://www.exactedi.com/`
2. Open DevTools → **Network** → filter `gtm.js` — request should be `.../gtm.js?id=GTM-XXXXXXX`.
3. Or install [Tag Assistant](https://tagassistant.google.com/) and confirm the container is **Connected**.

---

## 2. Create a GA4 property (if you do not have one)

1. [Google Analytics](https://analytics.google.com/) → **Admin** → **Create property**.
2. Name: `ExactEDI` (or your preference).
3. Set **Reporting time zone** and **Currency**.
4. Create a **Web** data stream for `https://www.exactedi.com` (add `https://exactedi.com` as well if you use the apex domain).
5. Copy the **Measurement ID** (`G-XXXXXXXXXX`).

---

## 3. Add GA4 tags in GTM

### Tag A — GA4 Configuration (base tag)

| Field | Value |
|--------|--------|
| Tag type | **Google Tag** (or *Google Analytics: GA4 Configuration*) |
| Tag ID / Measurement ID | Your `G-XXXXXXXXXX` |
| Trigger | **Initialization – All Pages** (or *All Pages*) |

This loads GA4 on every page load.

### Tag B — SPA page views (required for React Router)

The app pushes a custom `page_view` event on every route change (`AnalyticsListener`).

| Field | Value |
|--------|--------|
| Tag type | **Google Analytics: GA4 Event** |
| Configuration tag | Tag A (above) |
| Event name | `page_view` |
| Event parameters | See table below |
| Trigger | **Custom Event** → Event name = `page_view` |

**Event parameters** (create Data Layer Variables first, section 4):

| Parameter name | Data Layer Variable |
|----------------|---------------------|
| `page_location` | `DLV - page_location` |
| `page_path` | `DLV - page_path` |
| `page_title` | `DLV - page_title` |

### Tag C — Conversion events (optional)

Create **GA4 Event** tags + **Custom Event** triggers for funnel reporting:

| Site event | When it fires |
|------------|----------------|
| `view_pricing` | `/pricing` |
| `view_roadmap` | `/roadmap` |
| `view_dev_docs` | Any `/dev-docs/*` page |
| `view_request_access` | `/request-access` |
| `view_product` | `/product` |
| `beta_form_submit` | Beta access form success |
| `cta_click` | Use-case CTAs (`cta_id` in dataLayer) |

Use the event name as the GA4 event name, or map to recommended events in the tag (e.g. `generate_lead` for `beta_form_submit`).

---

## 4. Data Layer Variables (for Tag B)

In GTM → **Variables** → **User-Defined Variables** → **New**:

| Name | Type | Data Layer Variable Name |
|------|------|---------------------------|
| DLV - page_location | Data Layer Variable | `page_location` |
| DLV - page_path | Data Layer Variable | `page_path` |
| DLV - page_title | Data Layer Variable | `page_title` |

---

## 5. Publish and test

1. **Submit** → **Publish** the container version.
2. Open [Tag Assistant](https://tagassistant.google.com/) → connect to `www.exactedi.com`.
3. Navigate to `/pricing`, `/product`, `/dev-docs` — you should see:
   - Container loaded
   - GA4 Configuration fired
   - `page_view` events with `page_path` changing
4. In GA4 → **Reports** → **Realtime** — confirm active users within a few minutes.

---

## 6. Environment variables (Vercel)

| Variable | Purpose |
|----------|---------|
| `VITE_GTM_ID` | GTM container ID (if not `GTM-522ZBZWZ`) |
| `VITE_SITE_URL` | Canonical origin (`https://exactedi.com`) |
| `VITE_ENABLE_ANALYTICS` | Set to `false` on preview deployments to disable dataLayer pushes |

Redeploy after changing `VITE_GTM_ID`.

---

## 7. Troubleshooting

| Symptom | Likely cause |
|---------|----------------|
| GTM urgent: tag not detected 48h | GA4 tag not published, or wrong `G-` ID |
| GTM loads but no GA4 hits | Missing Tag B (SPA `page_view`) |
| Hits on first page only | Same — route changes need Tag B |
| Wrong container | Set `VITE_GTM_ID` to match GTM install snippet |
| `www` vs apex split | Add both URLs in GA4 data stream |
| Local dev noise | `VITE_ENABLE_ANALYTICS=false` in `.env.local` |

---

## Code reference

- GTM snippet: `index.html` (placeholder `__GTM_ID__` replaced at build)
- SPA tracking: `src/components/AnalyticsListener.tsx`
- Events API: `src/lib/analytics.ts`
