/**
 * Profile and social types.
 *
 * IMPORTANT — read before extending: there is no backend. Everything here lives in this
 * browser only. "Friends" are locally-stored entries the user typed in themselves; they
 * are not real accounts, nothing is sent anywhere, and no other person can see them. The
 * UI states this plainly rather than implying a social graph that does not exist.
 *
 * The shapes are modelled the way a real server would return them, so that when accounts
 * land (Tier 2) the swap is a data-source change rather than a rewrite.
 */

export interface Profile {
  displayName: string;
  /** Without the leading "@". */
  handle: string;
  bio?: string;
  /** Downscaled data URL, same pipeline as catch photos. */
  avatarDataUrl?: string;
  homeWater: string;
  /** ISO date the profile was first created. */
  joinedAt: string;
}

export interface Friend {
  id: string;
  displayName: string;
  handle: string;
  addedAt: string;
}

export interface NewFriend {
  displayName: string;
  handle: string;
}

export function isProfile(value: unknown): value is Profile {
  if (!value || typeof value !== "object") return false;
  const p = value as Profile;
  return typeof p.displayName === "string" && typeof p.handle === "string" && typeof p.joinedAt === "string";
}

export function isFriendArray(value: unknown): value is Friend[] {
  return (
    Array.isArray(value) &&
    value.every(
      (v) =>
        v &&
        typeof v === "object" &&
        typeof (v as Friend).id === "string" &&
        typeof (v as Friend).handle === "string",
    )
  );
}

export const defaultProfile: Profile = {
  displayName: "Angler",
  handle: "angler",
  homeWater: "Lake Ontario — Toronto",
  joinedAt: new Date().toISOString(),
};
