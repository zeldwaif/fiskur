import { useEffect, useRef } from "react";
import { useMapContext } from "../context/MapContext";
import type { LatLng } from "../types/map.types";

/**
 * Subscribes to taps on the shared map instance.
 *
 * The listener is held in a ref so that passing an inline arrow function doesn't tear down
 * and re-attach the map subscription on every render — only the provider changing does that.
 */
export function useMapClick(onClick: (position: LatLng) => void, enabled = true) {
  const { provider, status } = useMapContext();
  const handler = useRef(onClick);
  handler.current = onClick;

  useEffect(() => {
    if (!provider || status !== "ready" || !enabled) return;
    return provider.onMapClick((position) => handler.current(position));
  }, [provider, status, enabled]);
}
