import { useEffect, useRef } from "react";
import { useMapContext } from "../context/MapContext";
import type { ClickModifiers, LatLng } from "../types/map.types";

interface Options {
  /**
   * Only fire when Shift is held. A plain click has to stay a plain click — panning and
   * inspecting the map is the common action, and logging a catch is the rare, deliberate
   * one, so the rare action is the one that gets the modifier.
   */
  requireShift?: boolean;
  enabled?: boolean;
}

/**
 * Subscribes to taps on the shared map instance.
 *
 * The listener is held in a ref so passing an inline arrow function doesn't tear down and
 * re-attach the map subscription on every render — only the provider changing does that.
 */
export function useMapClick(
  onClick: (position: LatLng, modifiers: ClickModifiers) => void,
  { requireShift = false, enabled = true }: Options = {},
) {
  const { provider, status } = useMapContext();
  const handler = useRef(onClick);
  handler.current = onClick;

  useEffect(() => {
    if (!provider || status !== "ready" || !enabled) return;
    return provider.onMapClick((position, modifiers) => {
      if (requireShift && !modifiers.shift) return;
      handler.current(position, modifiers);
    });
  }, [provider, status, enabled, requireShift]);
}
