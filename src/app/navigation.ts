import type { FeatureKey } from "./featureFlags";

export interface NavItem {
  id: string;
  label: string;
  route: string;
  /** Gates visibility on a feature flag. */
  feature?: FeatureKey;
  /** Shown but marked as a placeholder / coming soon. */
  placeholder?: boolean;
  /**
   * Include in the mobile bottom bar, which only has room for about five items.
   * Marking these explicitly beats slicing the first five and silently dropping whatever
   * happens to sort last.
   */
  mobilePrimary?: boolean;
}

/** Ordered navigation. Desktop Sidebar and MobileNavigation both render from this. */
export const navigationItems: NavItem[] = [
  { id: "map", label: "Map", route: "/map", feature: "map", mobilePrimary: true },
  { id: "locations", label: "Locations", route: "/locations", feature: "savedLocations" },
  { id: "logs", label: "Fishing Logs", route: "/logs", feature: "fishingLogs", mobilePrimary: true },
  { id: "species", label: "Species", route: "/species", feature: "speciesData" },
  { id: "conditions", label: "Conditions", route: "/conditions", feature: "waterConditions", mobilePrimary: true },
  { id: "commercial", label: "Commercial", route: "/commercial", feature: "commercialMarketplace", placeholder: true },
  { id: "leaderboard", label: "Leaderboard", route: "/leaderboard", feature: "socialFeatures", mobilePrimary: true },
  { id: "profile", label: "Profile", route: "/profile", feature: "profile", mobilePrimary: true },
  { id: "settings", label: "Settings", route: "/settings", feature: "settings", placeholder: true },
];
