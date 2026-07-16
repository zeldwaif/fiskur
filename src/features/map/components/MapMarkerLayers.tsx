import { useEffect, useRef } from "react";
import { useMapContext } from "../context/MapContext";
import { useAppStore } from "@/store/appStore";
import { sampleLayerMarkers } from "../layers/sampleLayerData";

/**
 * Renders nothing visually — syncs the global activeMapLayers list to real markers
 * on the shared map instance. Toggling a layer in LayerSelector calls through here.
 */
export function MapMarkerLayers() {
  const { provider, status } = useMapContext();
  const { activeMapLayers } = useAppStore();
  const drawn = useRef(new Set<string>());

  useEffect(() => {
    if (!provider || status !== "ready") return;

    for (const layerId of Object.keys(sampleLayerMarkers)) {
      const shouldShow = activeMapLayers.includes(layerId);
      const isDrawn = drawn.current.has(layerId);

      if (shouldShow && !isDrawn) {
        sampleLayerMarkers[layerId].forEach((marker) => provider.addMarker(marker));
        drawn.current.add(layerId);
      } else if (!shouldShow && isDrawn) {
        provider.clearLayer(layerId);
        drawn.current.delete(layerId);
      }
    }
  }, [provider, status, activeMapLayers]);

  return null;
}
