# Stedi EDI Platform

## 1. Project Description
Rebuild of the Stedi EDI Platform landing page — a modern healthcare technology website that showcases an API-first platform for exchanging X12 HIPAA EDI transactions. Target users are health tech companies, RCM platforms, and healthcare developers who need to integrate EDI workflows.

## 2. Page Structure
- `/` — EDI Platform Landing Page (single-page experience with anchor sections)
- `/roadmap` — SNIP Validation Roadmap
- `/request-access` — Beta Access Request
- `/pricing` — Pricing Tiers
- `/security` — Security & Compliance
- `/dev-docs` — Developer Documentation
- `/blog` — Blog Listing (X12 EDI, HIPAA, Healthcare Data Articles)
- `/blog/:slug` — Individual Blog Article

## 3. Core Features
- [x] Transparent-to-white sticky navbar with dropdown menus
- [x] Dark hero section with headline and dashboard product screenshot
- [x] Animated customer logo ticker
- [x] 4 feature highlight cards
- [x] "Any transaction, any partner" section with transaction diagram
- [x] "Deliver EDI with one API call" with syntax-highlighted code block
- [x] Auto-scrolling feature ticker
- [x] "Secure & reliable" bento-style security cards
- [x] "Setup in minutes" onboarding section
- [x] Customer testimonial blockquote
- [x] CTA section
- [x] Comprehensive footer with newsletter signup, compliance badges, and link columns
- [x] Blog section with SEO-optimized articles on X12 EDI, HIPAA compliance, and healthcare data processing
- [x] Blog listing page with category filtering and search
- [x] Individual blog article pages with Schema.org Article markup

## 4. Data Model Design

### Table: blog_posts
| Field | Type | Description |
|-------|------|-------------|
| id | BIGSERIAL | Primary key |
| slug | TEXT | URL-friendly unique identifier |
| title | TEXT | Article title |
| meta_description | TEXT | SEO meta description |
| excerpt | TEXT | Short preview text |
| content | TEXT | Full article HTML content |
| author_name | TEXT | Article author |
| author_role | TEXT | Author role/position |
| cover_image | TEXT | Optional hero image URL |
| category | TEXT | Article category |
| tags | TEXT[] | Array of SEO tags |
| published_at | TIMESTAMPTZ | Publication date |
| read_time_minutes | INT | Estimated reading time |
| featured | BOOLEAN | Featured article flag |
| status | TEXT | published/draft |
| created_at | TIMESTAMPTZ | Record creation |
| updated_at | TIMESTAMPTZ | Last update |

## 5. Backend / Third-party Integration Plan
- Supabase: Connected. Used for blog_posts table storage and retrieval.
- No third-party integrations required for initial landing page
- Future: May add contact form backend

## 6. Development Phase Plan

### Phase 1: Core Landing Page — Upper Sections
- Goal: Build navbar, hero, logo ticker, feature cards, transaction section, and API code section
- Deliverable: Fully styled and responsive upper half of the page

### Phase 2: Lower Sections, Footer & Polish
- Goal: Build feature ticker, security section, setup section, testimonial, CTA, footer, and add scroll animations
- Deliverable: Complete landing page with all sections and interactions

### Phase 3: Blog Section
- Goal: Create blog infrastructure with Supabase table, listing page, article detail pages, and SEO optimization
- Deliverable: Full blog with 8 seed articles covering X12 EDI, HIPAA compliance, and healthcare data processing