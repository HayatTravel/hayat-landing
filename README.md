# Hayat B2C website: design mockup

A server-rendered React site (react-router 8 framework mode, Vite, Tailwind 4) for **الحياة للسفر والسياحة / Hayat Travel & Tourism**.

- Languages: Arabic, Kurdish Sorani (`ckb`), English. Arabic and Kurdish are right-to-left.
- Light theme only.
- All data is illustrative. Nothing calls a real API yet.

Design preview: https://hayattravel.github.io/hayat-landing/ (frozen at the last SPA build, `f9d2881`; the site now needs its Node server, so `main` no longer deploys there).

## Run
```bash
pnpm install
pnpm dev                 # http://localhost:5173, server rendering with HMR
pnpm build && pnpm start # production server on $PORT (default 3000)
pnpm smoke [base-url]    # checks the server HTML of every main page in ar, ckb and en
```

Language, currency and audience come from `?lang=` / `?cur=` / `?mode=` or the `hayat-lang`, `hayat-cur`, `hayat-mode` cookies,
so the server renders the right language and direction (`rtl` for ar, ckb, fa) on first paint.

## Container
`Dockerfile` builds the site and runs `react-router-serve` on Node 24 (port 3000, `GET /health` → `ok`).
```bash
docker build -t hayat-landing .
docker run --rm -p 3000:3000 hayat-landing
```
**Lab run target:** HAYAT-ENV does not have one yet (follow-up to JW-0). Until it does, run the image on the lab host as above
and check it with `pnpm smoke http://<lab-host>:3000`.

## What's in it
- **Products:**
  - Flights, with Hayat charter programmes inside the flight results
  - Hotels
  - Holidays (packages)
  - Car rental
  - Visa
  - eSIM
  - Events
  - Airport transfers
- **Booking in 2 steps:**
  1. Choose: results, then details.
  2. One page for travellers, extras, documents, contact and payment (`/checkout`), then the confirmation and receipt (`/done/:ref`).
- **Payment methods:** Qi Card, ZainCash, Visa/Mastercard, pay at an office.
- **Customer area:** My trips (with changes and cancellations sent as requests), account, saved travellers, help.
- **One help entry:** a "Need help?" chat that continues on WhatsApp.

## How the code is organised
Each product area plugs in by adding files; no shared file needs editing:

| Folder | Purpose |
|---|---|
| `src/routes/<area>.js` | `export default [route(path, 'pages/X.jsx')]`, picked up by `src/routes.js` |
| `src/search/<area>.jsx` | Search tabs on the home page and product pages |
| `src/home/<area>.jsx` | Home-page sections (each product appears once) |
| `src/orders/<area>.js` | What checkout sells: `type → (query, i18n) => order` (contract in `src/lib/products.js`) |
| `src/i18n/<area>.strings.js` | `{ key: [ar, en, ku] }` strings, merged automatically |
| `src/data/catalog.js` | Mock catalogue (texts are `{ ar, en, ku }`, prices in USD) |
| `src/lib/catalog.server.js` | The server-side catalogue that route loaders read (mock today; one product at a time moves to booking's customer API) |
| `src/lib/i18n.jsx` | `useI18n()`: `t`, `L`, `money`, `date`, language and currency |
| `src/lib/store.js` | Mock session, trips, `openHelp()`, `openSignIn()` (browser storage, read only after hydration) |
| `src/root.jsx` | The document: `<html lang dir>`, providers, root loader for language and preferences |

## Going to production
The server is the place for customer sign-in (IAM confidential client, httpOnly session) and every call to the
Booking Portal customer API (`/api/v1/customer/*` via JISR); the browser never sees a token or calls JISR.
See §6.7 (JW) of `PRICING-AI-V2-JOINT-IMPLEMENTATION.md` in the HAYAT workspace.
