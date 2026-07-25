import { useEffect } from "react";
import { useMapContext } from "../context/MapContext";
import type { LatLng } from "../types/map.types";

const PENDING_MARKER_ID = "pending-catch";

/**
 * Draws the dropped pin for a catch that's being logged, and clears it when the panel
 * closes or the point moves.
 *
 * Without this the quick-log panel gives no feedback about *where* it's about to log —
 * the coordinate is printed as text, but the user is looking at the map, not the text.
 */
export function usePendingCatchMarker(position: LatLng | null) {
  const { provider, status } = useMapContext();

  useEffect(() => {
    if (!provider || status !== "ready") return;
    if (!position) {
      provider.removeMarker(PENDING_MARKER_ID);
      return;
    }
    provider.addMarker({
      id: PENDING_MARKER_ID,
      position,
      title: "Logging a catch here",
      variant: "pending",
    });
    return () => provider.removeMarker(PENDING_MARKER_ID);
  }, [provider, status, position]);
}
