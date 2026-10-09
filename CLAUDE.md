# CLAUDE.md

Website for Metall Technologie Höhne GmbH (sheet-metal fabrication, Halle (Saale)). Next.js 16 App Router, TypeScript strict, plain CSS.
Read `README.md` first for setup, deployment and the go-live checklist.

## Rules for changes

- **Texts live only in `src/lib/dictionaries/de.ts` and `en.ts`.** Never hard-code visible text in components. Every change needs both languages.
  `en.ts` is typed with the shape of `de.ts`, so `npm run typecheck` fails when they drift apart.
- Pages are `/de/...` and `/en/...` (`src/app/[lang]`). `params` is a Promise in this Next.js version. Use `await params`.
- No external requests from the browser: no Google Fonts CDN, no analytics, no embedded maps or third-party scripts (GDPR). Fonts come from npm (`@fontsource-variable/archivo`).
- Styling is one file: `src/app/globals.css` with CSS variables. Palette "Markenblau": `--plate` #0E2238, `--beam` (accent) #3AA9F0. Keep contrast accessible (WCAG AA) and keep `prefers-reduced-motion` working.
- Server components by default. Client components only where needed: `Header`, `Interactions`, `ProcessStory`, `ContactForm`.
- The process animation (`ProcessStory` + `StorySvg` + `src/lib/story-engine.ts`) manipulates the SVG DOM directly. React must not render children into these elements:
  `#stageTag`, `#s1part`, `#nest2`, `#nest3` (the engine fills them). SVG elements are animated through `data-fx` / `data-r` attributes (documented at the top of the engine).
- Contact form: `src/components/ContactForm.tsx` -> `src/app/api/contact/route.ts` (nodemailer, SMTP from env). Validation rules are shared in `src/lib/contact-rules.ts`.
  Keep the honeypot, the file whitelist and header-injection protection.
- Run `npm run typecheck` and `npm run build` before finishing a task.

## Open items (do not invent content)

- Impressum and Datenschutz are placeholders. The legal text must come from the company. Never write legal text on your own.
- Technical facts on the site come from the old website. Unverified: Trumatic 6000 "Stanz- und Laserteile", assignment of "bis 120 mm / ca. 6 m" to MultiTherm.
- Photos are low resolution (250 × 200). Six machines have animated icons instead of photos.
