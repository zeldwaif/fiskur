import { useEffect, useRef, useState } from "react";
import { appConfig } from "@/app/config";
import { createMapProvider } from "../services/mapService";
import type { MapProvider } from "../types/map.types";

type Status = "loading" | "ready" | "error";

/** Initializes a map provider into a container ref. Keeps provider lifecycle out of components. */
export function useMap(containerRef: React.RefObject<HTMLElement>) {
  const providerRef = useRef<MapProvider | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const provider = createMapProvider();
    providerRef.current = provider;
    provider
      .initializeMap({
        container: el,
        center: appConfig.map.defaultCenter,
        zoom: appConfig.map.defaultZoom,
        mapType: appConfig.map.defaultMapType,
      })
      .then(() => setStatus("ready"))
      .catch((e) => { setError(e?.message ?? "Map failed to load"); setStatus("error"); });

    return () => { provider.destroy(); providerRef.current = null; };
  }, [containerRef]);

  return { provider: providerRef, status, error };
}
