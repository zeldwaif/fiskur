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

export type SaveFailure = "quota" | "unavailable";
export type SaveResult = { ok: true } | { ok: false; reason: SaveFailure };

/** True for the various names browsers use for "you are out of localStorage". */
function isQuotaError(e: unknown): boolean {
  if (!(e instanceof DOMException)) return false;
  return (
    e.name === "QuotaExceededError" ||
    e.name === "NS_ERROR_DOM_QUOTA_REACHED" ||
    e.code === 22 ||
    e.code === 1014
  );
}

/**
 * JSON-stringifies and persists a value. Never throws — but unlike the previous version,
 * it no longer swallows failure silently either.
 *
 * This matters: photos are stored as base64 data URLs, localStorage is ~5MB, and a failed
 * write used to leave the app showing a catch in memory that would be gone on refresh.
 * Silently losing a user's catch log is the worst failure this app can have, so callers
 * get a result and can tell the user.
 */
export function savePersisted<T>(key: string, value: T): SaveResult {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return { ok: true };
  } catch (e) {
    return { ok: false, reason: isQuotaError(e) ? "quota" : "unavailable" };
  }
}

/** Namespaced storage keys. Keep every key the app writes in one place. */
export const storageKeys = {
  savedLocations: "fiskur.savedLocations",
  catches: "fiskur.catches",
  mapCamera: "fiskur.map.camera",
  profile: "fiskur.profile",
  friends: "fiskur.friends",
} as const;

/** Small helper for stable unique ids without pulling in a uuid dependency. */
export function makeId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
