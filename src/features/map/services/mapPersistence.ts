import type { LatLng } from "../types/map.types";

const STORAGE_KEY = "fiskur.map.camera";

interface PersistedCamera {
  center: LatLng;
  zoom: number;
}

/** Reads the last saved camera position/zoom, if any. Never throws. */
export function loadPersistedCamera(): PersistedCamera | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed.zoom === "number" &&
      typeof parsed.center?.lat === "number" &&
      typeof parsed.center?.lng === "number"
    ) {
      return parsed as PersistedCamera;
    }
    return null;
  } catch {
    return null;
  }
}

/** Saves the camera position/zoom so the map reopens where the user left it. */
export function savePersistedCamera(camera: PersistedCamera): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(camera));
  } catch {
    // Storage unavailable (private browsing, quota, etc.) — non-fatal, just skip persisting.
  }
}
