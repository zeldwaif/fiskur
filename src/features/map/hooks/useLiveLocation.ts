import { useEffect, useState } from "react";
import { useMapContext } from "../context/MapContext";
import type { LatLng } from "../types/map.types";

const LIVE_MARKER_ID = "live-location";

export type LiveLocationStatus = "off" | "locating" | "tracking" | "denied" | "unsupported";

/**
 * Watches the device's position and keeps a marker on the map in sync with it.
 *
 * Deliberately opt-in rather than on by default: continuous geolocation is a privacy cost
 * and a battery cost, so the user turns it on from the toolbar. `watchPosition` is used
 * instead of repeated `getCurrentPosition` calls so the dot actually follows you as the
 * boat moves, which is the entire point on the water.
 */
export function useLiveLocation(enabled: boolean) {
  const { provider, status: mapStatus } = useMapContext();
  const [status, setStatus] = useState<LiveLocationStatus>("off");
  const [position, setPosition] = useState<LatLng | null>(null);

  useEffect(() => {
    if (!enabled) {
      setStatus("off");
      setPosition(null);
      return;
    }
    if (!("geolocation" in navigator)) {
      setStatus("unsupported");
      return;
    }

    setStatus("locating");
    const watchId = navigator.geolocation.watchPosition(
      (p) => {
        setPosition({ lat: p.coords.latitude, lng: p.coords.longitude });
        setStatus("tracking");
      },
      (err) => {
        setStatus(err.code === err.PERMISSION_DENIED ? "denied" : "unsupported");
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 },
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, [enabled]);

  // Sync the marker separately from the watch, so a re-created map doesn't drop the dot.
  useEffect(() => {
    if (!provider || mapStatus !== "ready") return;
    if (!position) {
      provider.removeMarker(LIVE_MARKER_ID);
      return;
    }
    provider.addMarker({
      id: LIVE_MARKER_ID,
      position,
      title: "Your location",
      variant: "live",
    });
    return () => provider.removeMarker(LIVE_MARKER_ID);
  }, [provider, mapStatus, position]);

  return { status, position };
}
