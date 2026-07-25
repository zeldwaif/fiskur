import { featureFlags } from "@/app/featureFlags";

export interface MapLayerDef {
  id: string;
  label: string;
  /** Default visibility. */
  enabled: boolean;
  /** Gate the layer on a feature flag. */
  feature?: keyof typeof featureFlags;
}

/**
 * Registry of map layers. Add new layers here — the LayerSelector and map render from it.
 * Layers are enabled/disabled/styled independently; none are hard-wired into the base map.
 */
export const mapLayers: MapLayerDef[] = [
  { id: "saved-locations", label: "Saved Locations", enabled: true, feature: "savedLocations" },
  { id: "catch-reports", label: "Catch Reports", enabled: false, feature: "fishingLogs" },
  { id: "species", label: "Species Observations", enabled: false, feature: "speciesData" },
  { id: "weather", label: "Weather", enabled: false, feature: "weather" },
  { id: "water-temperature", label: "Water Temperature", enabled: false, feature: "waterConditions" },
  { id: "currents", label: "Currents", enabled: false, feature: "waterConditions" },
  { id: "depth", label: "Depth / Bathymetry", enabled: false, feature: "waterConditions" },
  { id: "my-catches", label: "My catches", enabled: true, feature: "fishingLogs" },
  { id: "daylight", label: "Light windows", enabled: false, feature: "waterConditions" },
  { id: "restricted", label: "Restricted Areas", enabled: false },
  { id: "commercial", label: "Commercial Zones", enabled: false, feature: "commercialMarketplace" },
  { id: "invasive", label: "Invasive Species", enabled: false, feature: "speciesData" },
];

export function availableLayers(): MapLayerDef[] {
  return mapLayers.filter((l) => !l.feature || featureFlags[l.feature]);
}
