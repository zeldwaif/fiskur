import { useEffect, useRef } from "react";
import { useMapContext } from "../context/MapContext";
import { savePersistedCamera } from "../services/mapPersistence";

/**
 * Saves the map's camera position/zoom as the user pans/zooms, debounced so it
 * doesn't write on every animation frame. Restored on load by useMap (see mapPersistence.ts).
 */
export function useMapCameraPersistence() {
  const { provider, status } = useMapContext();
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!provider || status !== "ready") return;
    const unsubscribe = provider.onCameraChange((camera) => {
      if (timeout.current) clearTimeout(timeout.current);
      timeout.current = setTimeout(() => {
        if (camera.zoom != null) savePersistedCamera({ center: camera.center, zoom: camera.zoom });
      }, 400);
    });
    return () => {
      unsubscribe();
      if (timeout.current) clearTimeout(timeout.current);
    };
  }, [provider, status]);
}
