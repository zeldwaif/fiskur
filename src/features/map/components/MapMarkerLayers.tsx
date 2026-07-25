import { useEffect, useRef } from "react";
import { useMapContext } from "../context/MapContext";
import { useAppStore } from "@/store/appStore";
import { sampleLayerMarkers } from "../layers/sampleLayerData";
import type { MarkerOptions } from "../types/map.types";

/**
 * Renders nothing visually — syncs the global activeMapLayers list to real markers
 * on the shared map instance. Toggling a layer in LayerSelector calls through here.
 *
 * The "saved-locations" layer now draws the user's REAL saved locations from the store.
 * Other layers still fall back to clearly-labelled sample data until their real data
 * sources are wired (per-layer, tier by tier).
 */
export function MapMarkerLayers() {
  const { provider, status } = useMapContext();
  const { activeMapLayers, savedLocations, catches } = useAppStore();
  // Track the exact marker id set drawn per layer, so we redraw when the data changes.
  const drawn = useRef<Map<string, string[]>>(new Map());

  useEffect(() => {
    if (!provider || status !== "ready") return;

    const realLayers: Record<string, MarkerOptions[]> = {
      "saved-locations": savedLocations.map((loc) => ({
        id: `saved-${loc.id}`,
        layerId: "saved-locations",
        position: { lat: loc.lat, lng: loc.lng },
        title: loc.name,
      })),
      // Real logged catches that carry a coordinate. Catches attached to a saved spot
      // inherit its position; catches dropped on the map carry their own exact point.
      "my-catches": catches
        .filter((entry): entry is typeof entry & { lat: number; lng: number } =>
          typeof entry.lat === "number" && typeof entry.lng === "number")
        .map((entry) => ({
          id: `catch-${entry.id}`,
          layerId: "my-catches",
          position: { lat: entry.lat, lng: entry.lng },
          title: entry.speciesName,
        })),
    };

    const layerData: Record<string, MarkerOptions[]> = { ...sampleLayerMarkers, ...realLayers };

    for (const layerId of Object.keys(layerData)) {
      const shouldShow = activeMapLayers.includes(layerId);
      const markers = layerData[layerId];
      const nextIds = markers.map((m) => m.id);
      const prevIds = drawn.current.get(layerId);
      const changed = !prevIds || prevIds.length !== nextIds.length || prevIds.some((id, i) => id !== nextIds[i]);

      if (shouldShow) {
        if (changed) {
          if (prevIds) provider.clearLayer(layerId);
          markers.forEach((m) => provider.addMarker(m));
          drawn.current.set(layerId, nextIds);
        }
      } else if (prevIds) {
        provider.clearLayer(layerId);
        drawn.current.delete(layerId);
      }
    }
  }, [provider, status, activeMapLayers, savedLocations, catches]);

  return null;
}
