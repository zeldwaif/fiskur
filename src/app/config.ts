/**
 * Central application configuration. Change values here — not scattered across components.
 */
export const appConfig = {
  appName: "Fiskur",
  creatorCredit: "by jacob shi and daniel zhang",
  appDescription: "Fishing intelligence, maps, and logs.",
  defaultPageTitle: "Fiskur",

  theme: {
    default: "base",
  },

  map: {
    /** Default camera — Fort Lauderdale, FL. */
    defaultCenter: { lat: 26.1224, lng: -80.1373 },
    defaultZoom: 12,
    /** "satellite" | "hybrid" | "roadmap" | "terrain" */
    defaultMapType: "satellite" as const,
    /** "auto" picks Google when a key exists, else OpenLayers (free, no key). */
    provider: "auto" as "auto" | "google" | "openlayers" | "demo",
  },

  env: {
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined,
    weatherApiKey: import.meta.env.VITE_WEATHER_API_KEY as string | undefined,
  },
} as const;

export type AppConfig = typeof appConfig;
