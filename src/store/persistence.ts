/**
 * Generic, dependency-free localStorage persistence.
 *
 * The whole app currently stores domain data (saved locations, catch logs) in the
 * client via these helpers. Tier 2 will swap the *backing* store for a real backend
 * or account-scoped store — but because features only ever touch the store through
 * hooks (never localStorage directly), that swap won't reach into feature code.
 *
 * Every function is wrapped so storage being unavailable (private mode, quota,
 * SSR) is non-fatal: reads return the fallback, writes silently no-op.
 */

/** Reads and JSON-parses a persisted value, validating it with the provided guard. */
export function loadPersisted<T>(key: string, isValid: (value: unknown) => value is T, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed: unknown = JSON.parse(raw);
    return isValid(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

/** JSON-stringifies and persists a value. Never throws. */
export function savePersisted<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage unavailable — non-fatal, just skip persisting.
  }
}

/** Namespaced storage keys. Keep every key the app writes in one place. */
export const storageKeys = {
  savedLocations: "fiskur.savedLocations",
  catches: "fiskur.catches",
  mapCamera: "fiskur.map.camera",
} as const;

/** Small helper for stable unique ids without pulling in a uuid dependency. */
export function makeId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
