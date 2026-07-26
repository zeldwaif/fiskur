# Fiskur — Feature Checklist

A prioritized, tiered list of everything planned for Fiskur, ordered so the app is genuinely usable
at the end of each tier before the next one starts. Each item notes where it lives in the codebase
(`src/features/...`) so it's actionable straight from this list. Check items off as they're built.

How to use this: work top to bottom. Don't start Tier 2 features before Tier 1 is solid — the whole
point of the modular architecture is that each tier can ship and be used on its own.

---

## Tier 0 — Core map foundation (finish what's scaffolded)
*The map is the spine of the app. Nothing else matters if this isn't solid.*

- [x] Wire `LocationSearch` input to `provider.searchLocation()` and move the camera to the result (`features/map/components/LocationSearch.tsx`, `hooks/useMap.ts`)
- [x] Wire `CurrentLocationControl` to `provider.getCurrentLocation()` + camera move, with a permission-denied fallback state
- [x] Wire zoom +/- buttons in `MapToolbar` to real `provider.moveCamera()` calls
- [ ] Confirm satellite/hybrid map type switching actually works (`setMapType`)
- [x] Add a real `MapLayerRenderer` that draws markers per active layer from `layerRegistry.ts` (currently the registry + toggle UI exist, but layers don't render data yet)
- [x] Persist the user's last map position/zoom between sessions
- [ ] Confirm mobile vs. desktop layouts both work (bottom sheet vs. sidebar panel positioning)

## Tier 1 — Recreational core loop (MVP)
*The smallest version of the app someone would actually use on a real fishing trip.*

- [x] **Saved locations** — add/name/delete a pin, list view (`features/locations`)
- [x] **Catch logging** — manual entry: species, length, weight, date/time, location, notes (`features/catches`)
- [x] Photo attach to a catch log entry
- [ ] Offline logging with later sync (log a catch with no signal, sync when back online)
- [x] **Species reference data** — basic species list with name, habitat, a photo (`features/species`)
- [x] **Water/weather conditions panel** — real API wired in place of sample data (`features/weather`, `features/conditions`)
- [x] Daylight/feeding-window data integration (replaced tide: Lake Ontario is non-tidal)
- [x] Basic "what should I fish for" recommendation — even a simple rules-based version (species + condition match, no ML needed yet)
- [ ] Regulation lookup placeholder → real data source for size/season limits by species + region

## Tier 2 — Accounts & real data persistence
*Right now everything lives in memory and resets on refresh — this tier makes it durable.*

- [ ] User accounts (sign up / log in)
- [ ] Real data storage (replace in-memory `appStore` with a backend or persistent local store)
- [x] **Profile page** — real content: catch history, personal stats, saved locations (`features/profile`)
- [ ] **Settings page** — real content: units (metric/imperial), theme selection, notification preferences (`features/settings`)
- [ ] Data export (download your own catch log/data)
- [ ] Account deletion / data deletion flow

## Tier 3 — Social & gamification
*What turns a utility into something people come back to.*

- [~] Friends / following — local-only list built; real following needs accounts (Tier 2)
- [ ] Share a catch (with location privacy controls — exact vs. fuzzed vs. hidden)
- [ ] Location reviews (fishing spots, ramps, marinas)
- [ ] Gear/charter reviews
- [x] Species collection / achievement system ("FishDex"-style), tied to verified logs
- [x] Leaderboards — explicitly NOT just biggest/most fish (release rate, diversity, consistency), verified catches only (`features/leaderboard`)
- [x] **Catch verification** — cross-check photo EXIF GPS/timestamp against the logged catch (`features/catches/verification.ts`)
- [ ] Clubs / groups
- [ ] Basic event/trip planning between friends

## Tier 4 — Sustainability & safety
*Builds trust and differentiates the app; some of this should arrive earlier if safety is a priority for you.*

- [ ] Safety alerts (marine/weather warnings) — always-free, never gated
- [ ] Float plan / trip check-in with overdue alert to a contact
- [ ] Protected/endangered species warnings at the moment of logging
- [ ] Invasive species identification + region-specific legal harvesting info
- [ ] Invasive species reporting to relevant authorities
- [ ] Catch-and-release handling guidance per species
- [ ] Sensitive-location protection (auto-fuzz spawning areas, private spots)

## Tier 5 — Commercial marketplace
*The B2B side — bigger scope, build after the recreational side has real usage.*

- [ ] Commercial fisher profile (vessel, licence, species supplied, region)
- [ ] Buyer profile (restaurant/processor/wholesaler — desired species, volume, standards)
- [ ] Listing + matching system
- [ ] Messaging / request-for-quote workflow
- [ ] Digital agreements / invoicing
- [ ] Payments or escrow
- [ ] Traceability / chain-of-custody records
- [ ] Ratings & dispute resolution

## Tier 6 — Advanced / platform maturity
*Nice-to-have polish and scale — only after everything above is real and used.*

- [ ] AI species identification from a catch photo (replace manual species selection)
- [ ] Natural-language fishing assistant ("what should I fish for tonight?")
- [ ] Learned/personalized recommendations (replace the rules-based Tier-1 version)
- [ ] Multi-region support beyond the current demo region
- [ ] Localization (languages, units, currencies)
- [ ] Installable app / native mobile wrapper
- [ ] Admin & moderation tools (fraud detection, content reports)
- [ ] Additional visual themes (dark marine, high-contrast, field-mode) using the existing theme registry

---

## Notes
- The feature *registry* for all of this already exists at `src/app/featureFlags.ts` — as each item ships, flip its flag on there so navigation/layers pick it up automatically.
- Placeholder pages already exist for every Tier 1–5 feature area (`ComingSoonState`) — replace them in place rather than building new pages.
- This file lives in the repo (`docs/FEATURE_CHECKLIST.md`) so it can be committed and updated as priorities shift.
