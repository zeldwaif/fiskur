# Fiskur

A fishing map and catch log for the Toronto waterfront (Lake Ontario, Toronto Harbour, the
Islands and the Humber, Don and Rouge rivers). It suggests which species are worth targeting
from live conditions, and checks logged catches against the photo's own GPS and timestamp.

Built by Jacob Shi and Daniel Zhang with React, TypeScript, Vite and OpenLayers. Installable
as a PWA.

<!-- Add a screenshot or short GIF of the map and catch log here: ![Fiskur](docs/screenshot.png) -->

## Features

- **Map.** Satellite imagery and OpenStreetMap place search with no API key required, live
  location tracking, saved spots, and a camera position that is remembered between visits.
- **Catch logging.** Shift+click anywhere on the water to drop a pin and log a catch at that
  exact coordinate, with species, size, weight, notes and a photo.
- **Catch verification.** A small hand-written JPEG parser reads the photo's EXIF data and
  compares its GPS and capture time against the logged spot and time. Each catch comes out
  as verified, partly verified, unverified or "doesn't match", with a plain-language reason.
  A photo with no metadata is treated as neutral, never as evidence of cheating.
- **Species suggestions.** A rules-based engine scores each local species against today's
  sunrise and sunset, wind, temperature and season, using live data from Open-Meteo. Every
  point it adds or takes away comes with a reason, so a suggestion is never a black box.
- **Leaderboard.** Ranks verified catches only, across four categories: species diversity,
  release rate, consistency and biggest fish.
- **Offline-ready.** A service worker caches the app shell and recently viewed map tiles.

## Design decisions

- **Map provider interface.** Features talk to a `MapProvider` interface
  (`src/features/map/services/mapProvider.ts`) with OpenLayers, Google Maps and demo
  implementations behind it, so the map library can change without touching feature code.
- **Feature-based structure.** Each folder under `src/features/` owns its UI, hooks, API
  clients and pure logic. The logic modules (verification, recommendations, leaderboard,
  stats) have no React dependencies, which keeps them easy to unit test.
- **Local-first storage.** There is no backend yet. State lives in the browser, is validated
  when it loads (`src/store/`), and a failed save because storage is full is surfaced to the
  user instead of silently dropping a catch.
- **Honest output.** Suggestions show coarse bands such as "Strong match" instead of a
  numeric score, because the weights are heuristics rather than values fitted to catch data.

## Run locally

Requires Node 20 or newer.

```bash
npm install
npm run dev
```

The map works without any keys. To use Google Maps imagery instead, copy `.env.example` to
`.env.local` and set `VITE_GOOGLE_MAPS_API_KEY`.

| Command             | What it does                    |
| ------------------- | ------------------------------- |
| `npm run dev`       | Start the dev server            |
| `npm test`          | Run the unit tests (Vitest)     |
| `npm run typecheck` | Type-check the project          |
| `npm run build`     | Type-check and production build |

GitHub Actions runs type-checking, tests and a production build on every push and pull request.

## Project structure

```
src/
  app/               routes, navigation, config, feature flags
  components/        shared UI, layout and loading/error/empty states
  features/
    map/             map screen, provider interface, layers, live location
    catches/         catch log, EXIF reader, verification
    recommendations/ species scoring engine
    conditions/      sunrise and sunset, feeding windows
    weather/         Open-Meteo client
    leaderboard/     verified-only rankings
    locations/ species/ profile/ settings/
  store/             app state and local persistence
  theme/             design tokens and themes
```

[docs/DEVELOPERS.md](docs/DEVELOPERS.md) explains how to add features, routes and map
layers. Planned work is tracked in [docs/FEATURE_CHECKLIST.md](docs/FEATURE_CHECKLIST.md).

## Roadmap

- Offline catch logging that syncs once a backend exists
- Accounts and spots shared between friends
- Ontario fishing regulation lookup per species and waterbody
