# Hayat B2C website: design mockup

A single-page React app (Vite, Tailwind 4, react-router 8) showing the customer site for **الحياة للسفر والسياحة / Hayat Travel & Tourism**.

- Languages: Arabic, Kurdish Sorani (`ckb`), English. Arabic and Kurdish are right-to-left.
- Light theme only.
- All data is illustrative. Nothing calls a real API yet.

Live: https://hayattravel.github.io/hayat-landing/ (every push to `main` deploys).

## Run
```bash
pnpm install
pnpm dev
```

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
| `src/routes/<area>.jsx` | `export default [{ path, element }]`, picked up by `main.jsx` |
| `src/search/<area>.jsx` | Search tabs on the home page and product pages |
| `src/home/<area>.jsx` | Home-page sections (each product appears once) |
| `src/orders/<area>.js` | What checkout sells: `type → (query, i18n) => order` (contract in `src/lib/products.js`) |
| `src/i18n/<area>.strings.js` | `{ key: [ar, en, ku] }` strings, merged automatically |
| `src/data/catalog.js` | Mock catalogue (texts are `{ ar, en, ku }`, prices in USD) |
| `src/lib/i18n.jsx` | `useI18n()`: `t`, `L`, `money`, `date`, language and currency |
| `src/lib/store.js` | Mock session, trips, `openHelp()`, `openSignIn()` |

## Going to production
The real site should be built with Next.js so it has a server for customer sign-in (IAM), and products should come from the Booking Portal customer API (`/api/v1/customer/*` via JISR). The browser must never call the Products API directly. See `_docs/B2C-Website-Research.md` in the HAYAT workspace.
