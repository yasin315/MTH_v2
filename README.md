# MTH website (Metall Technologie Höhne GmbH)

Next.js 16 (App Router, TypeScript) website in **German and English** with a working inquiry form
(sends e-mail with drawing attachments). Design: "Markenblau" (navy + logo blue).

- `/de` and `/en` are separate pages (good for Google), `/` redirects by browser language.
- Fonts are self-hosted (`@fontsource-variable/archivo`). **No Google Fonts CDN, no analytics, no tracking cookies.**
- The scroll animation in "Ablauf / Process" is plain SVG driven by `src/lib/story-engine.ts` (no animation library).

## Run locally

```bash
npm install
cp .env.example .env.local      # then edit it
npm run dev                     # http://localhost:3000
```

To test the form without a mail server, put `MAIL_DRY_RUN=1` into `.env.local`. The e-mail is then printed in the terminal.

Checks before you deploy:

```bash
npm run typecheck
npm run build
```

## Deploy

Any Node 20+ host works (Railway, a VPS, Docker). Build command `npm run build`, start command `npm start`.
Set the variables from `.env.example` in the host's settings.

- **Do not use a host with a 4.5 MB request limit for the form** (for example Vercel serverless functions). Drawing attachments are
  allowed up to 10 MB in total (`src/lib/contact-rules.ts`). Railway or a VPS has no such limit.
- Set `NEXT_PUBLIC_SITE_URL` to the final domain (used for sitemap, canonical and hreflang links).
- Old links such as `/konzept.htm` are redirected to the new pages (`redirects()` in `next.config.mjs`).

### Contact form e-mail

1. Ask the company's IT or mail provider for an SMTP account (for example `website@mth-halle.de`).
2. Fill `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`, `MAIL_TO`.
3. Send a test inquiry, with and without a DXF attachment.

The form has a honeypot field, a simple rate limit (5 requests per IP per hour, in memory) and validates file types
(DXF, DWG, STEP, IGES, PDF, PNG, JPG, ZIP, max 5 files). For several server instances use a shared rate limit (for example Redis).

## Where to change things

| What | Where |
| --- | --- |
| All texts (German) | `src/lib/dictionaries/de.ts` |
| All texts (English) | `src/lib/dictionaries/en.ts` (TypeScript forces the same structure as German) |
| Company data (address, phone, e-mail) | `COMPANY` in `src/lib/i18n.ts` |
| Colours | CSS variables at the top of `src/app/globals.css` (`--plate`, `--beam`, ...) |
| Machine photos | `public/machines/*.jpg` and `src/components/Machines.tsx` |
| Logo | `public/logo-mth.png` (used in `Header.tsx`) |
| Animation | `src/components/StorySvg.tsx` (artwork) and `src/lib/story-engine.ts` (timing) |
| Old-URL redirects, security headers | `next.config.mjs` |
| Language redirect for `/` | `src/proxy.ts` |

Adding a language: add `xx.ts` next to `de.ts`, add it to `LOCALES` in `src/lib/locales.ts` and to `getDict` in `src/lib/i18n.ts`.

## Before going live (checklist)

- [ ] **Legal:** insert the real Impressum and Datenschutz text (`src/app/[lang]/impressum/page.tsx`, `datenschutz/page.tsx`). Both pages are `noindex`
      placeholders until then. The privacy policy must describe: hosting and server logs, the contact form and its attachments, the mail provider,
      that fonts are self-hosted and that no tracking is used. Have the text reviewed (lawyer or data-protection officer).
- [ ] **Texts:** let the company read the English texts and check the technical facts (Trumatic 6000 = punching and laser?, MultiTherm values).
- [ ] **Images:** replace the 250 × 200 px machine photos with larger ones (at least 1000 px wide), add photos for the six other machines,
      and use a vector or high-resolution logo.
- [ ] **EFRE notice:** copy `efre.pdf` from the old site into `public/` and link it in `Footer.tsx`, or remove the block if it is no longer required.
- [ ] **Mail:** SMTP variables set and a test inquiry received.
- [ ] **Domain:** `NEXT_PUBLIC_SITE_URL` set, old website switched over, `sitemap.xml` submitted in Google Search Console.
