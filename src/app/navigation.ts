import type { FeatureKey } from "./featureFlags";

export interface NavItem {
  id: string;
  label: string;
  route: string;
  /** Gates visibility on a feature flag. */
  feature?: FeatureKey;
  /** Shown but marked as a placeholder / coming soon. */
  placeholder?: boolean;
}

/** Ordered navigation. Desktop Sidebar and MobileNavigation both render from this. */
export const navigationItems: NavItem[] = [
  { id: "map", label: "Map", route: "/map", feature: "map" },
  { id: "locations", label: "Locations", route: "/locations", feature: "savedLocations", placeholder: true },
  { id: "logs", label: "Fishing Logs", route: "/logs", feature: "fishingLogs", placeholder: true },
  { id: "species", label: "Species", route: "/species", feature: "speciesData", placeholder: true },
  { id: "conditions", label: "Conditions", route: "/conditions", feature: "waterConditions", placeholder: true },
  { id: "commercial", label: "Commercial", route: "/commercial", feature: "commercialMarketplace", placeholder: true },
  { id: "profile", label: "Profile", route: "/profile", feature: "profile", placeholder: true },
  { id: "settings", label: "Settings", route: "/settings", feature: "settings", placeholder: true },
];
