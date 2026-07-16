import { useEffect, useRef } from "react";
import { appConfig } from "@/app/config";
import { createMapProvider } from "../services/mapService";
import { useMapContext } from "../context/MapContext";
import { loadPersistedCamera } from "../services/mapPersistence";

/**
 * Initializes a map provider into a container ref and publishes it to MapContext
 * so sibling components (search, toolbar, layers) can drive the same live map.
 * Restores the last camera position/zoom if one was saved.
 */
export function useMap(containerRef: React.RefObject<HTMLElement>) {
  const { provider, status, error, setProvider, setStatus, setError } = useMapContext();
  const initialized = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || initialized.current) return;
    initialized.current = true;

    const mapProvider = createMapProvider();
    const persisted = loadPersistedCamera();

    mapProvider
      .initializeMap({
        container: el,
        center: persisted?.center ?? appConfig.map.defaultCenter,
        zoom: persisted?.zoom ?? appConfig.map.defaultZoom,
        mapType: appConfig.map.defaultMapType,
      })
      .then(() => {
        setProvider(mapProvider);
        setStatus("ready");
      })
      .catch((e) => {
        setError(e?.message ?? "Map failed to load");
        setStatus("error");
      });

    return () => {
      mapProvider.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef]);

  return { provider, status, error };
}
