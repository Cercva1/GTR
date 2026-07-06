# GRT — Railway Telecom Website

Corporate website for **რკინიგზის ტელეკომი (Railway Telecom / GRT)**, a backbone/trunk network operator in Georgia providing internet service and fiber channel lease along the Georgian Railway infrastructure, with transit routes toward Armenia, Azerbaijan, and Turkey.

The site combines a static marketing front-end (company overview, services, pricing, infrastructure, contact) with a lightweight, database-backed news system — company announcements go live instantly, with no page rebuild or redeploy required.

## Live structure

```
index.html            → homepage (intro, hero/map, services, pricing, about, contact, recent news preview)
news.html              → full news archive, all published posts
admin.html             → hidden admin login + post publishing dashboard (not linked in nav)
style.css              → all styling (theme variables, layout, animations)
script.js              → homepage interactivity (i18n, nav, scroll effects)
news.js                → fetches and renders all posts on news.html
recent-news.js         → fetches and renders the latest 3 posts on the homepage
admin.js               → admin login, publish, and delete logic
assets/
  ├── logo.webp                  → company logo (nav, favicon, footer)
  ├── hero-bg.webp               → intro splash background photo
  ├── channel-lease-offer.pdf    → downloadable service offer document
  └── supabase-config.js         → Supabase project URL + public key
```

No build step, no framework, no bundler — every page is opened directly or served as static files. Deploys as-is to GitHub Pages, Vercel, or Netlify.

## Features

**Design & UX**
- Full-screen intro splash with a custom-tinted background photo, scroll-triggered shrink/fade/zoom exit animation, and a fixed nav that transitions from transparent to solid as you scroll
- Bilingual toggle (KA / EN) — every piece of static copy switches instantly via a lightweight in-house i18n system, no page reload
- Single bright theme built entirely on CSS custom properties, easy to retint globally
- An accurate regional map (built from real GeoJSON border data) showing Georgia and its actual neighboring countries, with animated fiber-route connection lines
- Three original animated SVG illustrations for the infrastructure showcase — no stock photography, so no licensing concerns
- Fully responsive, with a collapsing mobile nav

**Content & data**
- Embedded, keyless Google Map pinned to the exact company address
- Direct PDF link for the Channel Lease service offer document
- **News system**, backed by Supabase (Postgres + Auth + Storage):
  - Public visitors can read all published posts — no login required
  - Homepage shows a live preview of the 3 latest posts, linking through to the full archive
  - `news.html` lists every post: title, body, optional image, optional PDF attachment, publish date
  - `admin.html` is a hidden, unlinked page where authorized accounts log in and publish new posts (title, text, optional image upload, optional PDF upload) or delete existing ones
  - **No public registration** — admin accounts are created manually inside Supabase, one per person who needs posting access; anyone can be added the same way without any code changes
  - Access is enforced with Postgres Row Level Security: anonymous visitors can only *read*, only authenticated admin accounts can *write*

## Tech stack

- **HTML5 / CSS3 / vanilla JavaScript (ES6+)** — no frameworks, no build tools
- **Google Fonts** — Space Mono + Manrope
- **Google Maps Embed** — keyless iframe
- **Supabase** — Postgres database, authentication, and file storage for the news system, accessed directly from the browser via `@supabase/supabase-js` (loaded from CDN)

## Deployment

Fully static — deploys as-is to GitHub Pages, Vercel, or Netlify. Push to `main` and it's live; no environment variables or build commands needed, since the Supabase connection details are already in `assets/supabase-config.js`.

**Moving to a real domain later requires no changes on the Supabase side.** The same project URL, public key, and database work identically regardless of what domain is calling them — nothing to rebuild or reconfigure when the client's own domain goes live.

## Managing news content

To add or remove admins, or manage posts directly:
1. Log into the [Supabase dashboard](https://supabase.com) for this project
2. **Authentication → Users** — add a new admin account (set "Auto Confirm User" on, since there's no public signup flow)
3. That person can now log into `yourdomain.com/admin.html` with their own email/password and publish independently — sessions are per-browser, so multiple admins never interfere with each other
4. Posts, images, and PDFs can also be reviewed or removed directly from **Table Editor** and **Storage** in the Supabase dashboard if needed
