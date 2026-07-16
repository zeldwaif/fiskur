/**
 * Feature registry. Single source of truth for which features exist / are enabled.
 * Navigation, map layers, and panels read from this — never scatter `if (feature)` checks.
 */
export const featureFlags = {
  map: true,
  savedLocations: true,
  fishingLogs: true,
  speciesData: true,
  waterConditions: true,
  weather: true,
  commercialMarketplace: false,
  socialFeatures: false,
  settings: true,
  profile: true,
} as const;

export type FeatureKey = keyof typeof featureFlags;

export function isFeatureEnabled(key: FeatureKey): boolean {
  return featureFlags[key];
}
