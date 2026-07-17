import type { MarkerOptions } from "../types/map.types";

/**
 * SAMPLE marker data for layers that don't have real data sources wired up yet.
 * Clearly labelled "(sample)" in every title per the project's data-integrity rule:
 * never present placeholder data as if it were live/real.
 *
 * NOTE: "saved-locations" is intentionally NOT here anymore — that layer now renders
 * the user's real saved locations from the store (see MapMarkerLayers). Remaining
 * entries are sample-only until their real sources land in later tiers.
 */
export const sampleLayerMarkers: Record<string, MarkerOptions[]> = {
  "catch-reports": [
    { id: "sample-catch-1", layerId: "catch-reports", position: { lat: 26.1180, lng: -80.1450 }, title: "Snook reported (sample)" },
    { id: "sample-catch-2", layerId: "catch-reports", position: { lat: 26.1310, lng: -80.1290 }, title: "Redfish reported (sample)" },
  ],
};
