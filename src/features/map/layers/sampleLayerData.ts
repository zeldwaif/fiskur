import type { MarkerOptions } from "../types/map.types";

/**
 * SAMPLE marker data for layers that don't have real data sources wired up yet.
 * Clearly labelled "(sample)" in every title per the project's data-integrity rule:
 * never present placeholder data as if it were live/real.
 *
 * Only layers with genuine point-marker semantics are seeded here. Layers like
 * weather/water-temperature/currents need heatmap-style overlays, not markers -
 * that's a larger feature and intentionally left for a later build pass; their
 * toggle in LayerSelector currently updates state only, with no renderer yet.
 */
export const sampleLayerMarkers: Record<string, MarkerOptions[]> = {
  "saved-locations": [
    { id: "sample-loc-1", layerId: "saved-locations", position: { lat: 26.1224, lng: -80.1373 }, title: "Fort Lauderdale pier (sample)" },
    { id: "sample-loc-2", layerId: "saved-locations", position: { lat: 26.1420, lng: -80.1123 }, title: "Lake Ridge canal (sample)" },
  ],
  "catch-reports": [
    { id: "sample-catch-1", layerId: "catch-reports", position: { lat: 26.1180, lng: -80.1450 }, title: "Snook reported (sample)" },
    { id: "sample-catch-2", layerId: "catch-reports", position: { lat: 26.1310, lng: -80.1290 }, title: "Redfish reported (sample)" },
  ],
};
