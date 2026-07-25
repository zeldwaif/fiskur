import { useEffect } from "react";
import { appConfig } from "@/app/config";
import { createMapProvider } from "../services/mapService";
import { useMapContext } from "../context/MapContext";
import { loadPersistedCamera } from "../services/mapPersistence";

export function useMap(containerRef: React.RefObject<HTMLElement>) {
  const { provider, status, error, setProvider, setStatus, setError } = useMapContext();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let cancelled = false;
    const mapProvider = createMapProvider();
    const persisted = loadPersistedCamera();

    setStatus("loading");
    mapProvider
      .initializeMap({
        container: el,
        center: persisted?.center ?? appConfig.map.defaultCenter,
        zoom: persisted?.zoom ?? appConfig.map.defaultZoom,
        mapType: appConfig.map.defaultMapType,
      })
      .then(() => {
        if (cancelled) { mapProvider.destroy(); return; }
        setProvider(mapProvider);
        setStatus("ready");
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e?.message ?? "Map failed to load");
        setStatus("error");
      });

    return () => {
      cancelled = true;
      mapProvider.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef]);

  return { provider, status, error };
}