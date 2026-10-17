# Monark Studio — website

Next.js 16 (App Router, Cache Components) · React 19 · GSAP 3.15 (ScrollTrigger, SplitText) · Lenis.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

- **All copy, projects and USD pricing** live in `src/content/site.ts`. Search for `TODO` to find the placeholders.
- **Design docs**: `../docs/01-architecture.md` (sitemap, user flow, page specs) and `../docs/02-design-system.md` (type, colour, grid, motion, asset list).
- **Animations** are opt-in per element through data attributes (`data-lines`, `data-fade`, `data-img`, `data-parallax`, `data-rule`, `data-count`). See `src/components/Motion.tsx`.
- **Booking** (`/contact`): visitors answer four questions, pick a 20-minute slot (Mon–Fri 10:00–19:00 IST, shown in their own timezone) and get an email with a calendar invite. Both studio inboxes (`studio.notify`) get the booking too. Hours and length live in `booking` in `src/content/site.ts`.
  - `GET /api/slots` returns open times; `POST /api/book` reserves one atomically and sends the emails.
  - Copy `.env.example` to `.env.local` and fill in SMTP + Upstash. Without SMTP, dev logs bookings to the console and production refuses bookings rather than losing them.
- **Work videos**: `public/work/video/<slug>-{desktop,mobile}.{mp4,jpg}` are web encodes. The 4K masters (3840×2160 desktop, 1170×2532 phone) are in `../media/masters/`, so they're kept out of the deploy.

## SEO

- Every page is prerendered to static HTML at build time, so crawlers get full content without running JavaScript.
- Per-page canonical, description, Open Graph and Twitter tags come from `pageMeta()` in `src/lib/seo.ts`.
- Structured data: `ProfessionalService` (site-wide), `BreadcrumbList` (inner pages), `FAQPage` (/engagements) and `CreativeWork` (case studies).
- `/sitemap.xml` and `/robots.txt` are generated. Only `/api/` is blocked from crawling. The 404 page is `noindex`.
- Old static-site URLs redirect permanently in a single hop (`next.config.ts`).
- Images are served as AVIF/WebP through `next/image`. Video posters go through the same optimiser.
- Low-power mode (`src/lib/perf.ts`): on ≤4 cores, ≤4 GB of RAM, Data Saver or a 2G connection, smooth scroll, parallax and clip reveals switch off and videos stay on their poster.

### After deploying: Google Search Console
1. search.google.com/search-console → **Add property** → **URL prefix** → enter the live URL.
2. Choose **HTML tag**, copy the `content` value into `GOOGLE_SITE_VERIFICATION` on the host, then redeploy and click **Verify**.
3. **Sitemaps** → submit `sitemap.xml`.
4. **URL inspection** → paste the home URL → **Request indexing**. Repeat for /work and /contact.
