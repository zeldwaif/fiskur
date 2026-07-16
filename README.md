# Fiskur

Fishing intelligence, maps, and logs.
*by jacob shi and daniel zhang*

This is a modular React + TypeScript (Vite) application scaffold. The current look is an
intentional **black-and-white Times New Roman template** — a neutral, replaceable foundation.
All visual choices live in centralized design tokens so future work can restyle incrementally.

## Run it

```bash
npm install
cp .env.example .env.local   # optional: add VITE_GOOGLE_MAPS_API_KEY for real satellite imagery
npm run dev
```

Open the printed local URL. The app opens on the full-screen **Fiskur** landing page — click, tap,
or press Enter/Space to slide into the main satellite map screen.

Without a Google Maps key the map runs in a clearly-labelled demo mode; every control still works.

## Scripts
- `npm run dev` — start the dev server
- `npm run build` — typecheck + production build
- `npm run typecheck` — types only

## Where things live
See `docs/DEVELOPERS.md` for structure and how to add features, routes, nav items, map layers, and themes.
