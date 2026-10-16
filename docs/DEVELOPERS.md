# Fiskur developer guide

Fiskur is a feature-based React and TypeScript app. All colours, spacing and type come from
design tokens in `src/theme/tokens.css`, so the visual style can change in one place.

## Project structure

```
src/
  app/          App.tsx, config.ts, routes.tsx, providers.tsx, featureFlags.ts, navigation.ts
  theme/        tokens.css (all design tokens), themes.ts (registry), motion.ts, ThemeProvider.tsx
  styles/       global.css
  store/        appStore.tsx (global state via context+reducer)
  components/
    ui/         Button, IconButton, TextInput, SearchInput, Toggle, Panel, Badge, Divider, DataRow, SectionHeader
    layout/     AppShell, AppHeader, Sidebar, MobileNavigation, MapLayout, FloatingPanel, BottomSheet, PageContainer
    feedback/   LoadingState, ErrorState, EmptyState, ComingSoonState
  features/
    map/        MapScreen + components/, services/ (provider abstraction), layers/, hooks/, types/
    weather/    api/, hooks/, components/, types/  (sample of the data/service/UI split)
    locations, catches, species, conditions, commercial, profile, settings/  (pages)
  hooks/        useMediaQuery, useReducedMotion
  utils/        cx
  types/
```

**Golden rule:** feature code never hard-codes colours/spacing/type, never imports Google Maps
directly, and never controls the app shell. Layout owns structure; features own content.

## Common tasks

### Update design tokens (colours, type, spacing, motion)
Edit `src/theme/tokens.css`. Components reference `var(--token)` only, so changes propagate everywhere.

### Add a theme
1. Add an entry to `themes.ts`.
2. Add a `[data-theme="your-id"] { … }` block overriding tokens (in `tokens.css` or a co-located file).
3. Set it via `useTheme().setThemeId("your-id")` or `appConfig.theme.default`.

### Add a route / page
1. Create the page component under its feature folder.
2. Register it in `src/app/routes.tsx`.
3. Add a navigation entry in `src/app/navigation.ts` (desktop + mobile both read this).

### Add a navigation item
Edit `src/app/navigation.ts`. Gate it with `feature` and/or mark `placeholder: true`.

### Enable / disable a feature
Flip it in `src/app/featureFlags.ts`. Navigation, layers, and panels respect it automatically.

### Add a map layer
Add an entry to `src/features/map/layers/layerRegistry.ts`. The `LayerSelector` renders it and
global state tracks its active/inactive status. Wire its rendering in the map layer module later.

### Change the map provider
Implement the `MapProvider` interface (`features/map/types/map.types.ts`) and return it from
`features/map/services/mapService.ts`. No feature code changes.

### Add a data-backed feature
Follow the weather pattern: `api/` (service) → `hooks/` (state) → `components/` (UI) → `types/`.
Keep data fetching out of components.

## Configuration & environment
- App-wide values: `src/app/config.ts` (name, credit, default map position/zoom/type, theme).
- Secrets: `.env.local` (copy from `.env.example`). Never commit keys.
  - `VITE_GOOGLE_MAPS_API_KEY` — enables real satellite imagery; without it the map runs in a
    clearly-labelled demo mode (no crash).

## Reuse checklist
Buttons, inputs, panels, loading/error/empty states, nav items, and map controls already exist as
shared components. Don't duplicate them per page — compose the existing ones.
