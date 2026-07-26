import type { ExifData } from "./exif";

/**
 * Catch verification.
 *
 * The problem this exists to solve: in every social fishing app, catch reports are
 * unverifiable, so leaderboards are meaningless and shared "hot spots" are polluted by
 * people who misreport where and when they caught something.
 *
 * When a photo carries EXIF, it independently records where and when it was taken. Cross-
 * checking that against what the user typed turns a claim into evidence.
 *
 * Two design rules that must not be relaxed:
 *  1. A missing signal is NEVER evidence of dishonesty. Most photos have no GPS — phones
 *     strip it, messaging apps strip it, permissions block it. Those catches are
 *     "unverified", which is a neutral state, not an accusation.
 *  2. Only a *contradiction* (photo says somewhere far away, or a wildly different day)
 *     is flagged, and even then it's surfaced as "doesn't match", not "fake". There are
 *     innocent explanations — a wrong camera clock is extremely common.
 */

export type SignalStatus = "match" | "nearby" | "mismatch" | "absent";
export type VerificationLevel = "verified" | "partial" | "unverified" | "mismatch";

export interface CatchVerification {
  level: VerificationLevel;
  location: SignalStatus;
  time: SignalStatus;
  /** Whether the signal was missing from the PHOTO, as opposed to missing on our side. */
  photoHasLocation: boolean;
  photoHasTime: boolean;
  /** Metres between the photo's GPS and the logged position, when both exist. */
  distanceM?: number;
  /** Minutes between the photo's timestamp and the logged catch time. */
  minutesApart?: number;
}

/**
 * Consumer GPS is good to roughly 5–20 m in the open, but worse near structure and on
 * water. 150 m is deliberately generous: the cost of a false "doesn't match" is much
 * higher than the cost of accepting a slightly loose match.
 */
const MATCH_RADIUS_M = 150;
const NEARBY_RADIUS_M = 1000;
/** A photo taken within this window of the logged time is treated as the same session. */
const MATCH_WINDOW_MIN = 360;

export function distanceMeters(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(h));
}

interface VerifyInput {
  exif: ExifData;
  position: { lat: number; lng: number } | null;
  caughtAt: string;
}

export function verifyCatch({ exif, position, caughtAt }: VerifyInput): CatchVerification {
  const photoHasLocation = exif.lat != null && exif.lng != null;
  const photoHasTime = exif.takenAt != null;

  let location: SignalStatus = "absent";
  let distanceM: number | undefined;
  if (exif.lat != null && exif.lng != null && position) {
    distanceM = Math.round(distanceMeters(exif.lat, exif.lng, position.lat, position.lng));
    location = distanceM <= MATCH_RADIUS_M ? "match" : distanceM <= NEARBY_RADIUS_M ? "nearby" : "mismatch";
  }

  let time: SignalStatus = "absent";
  let minutesApart: number | undefined;
  const logged = new Date(caughtAt).getTime();
  if (exif.takenAt && Number.isFinite(logged)) {
    minutesApart = Math.round(Math.abs(exif.takenAt.getTime() - logged) / 60000);
    time = minutesApart <= MATCH_WINDOW_MIN ? "match" : "mismatch";
  }

  let level: VerificationLevel;
  if (location === "mismatch" || time === "mismatch") level = "mismatch";
  else if (location === "match" && time === "match") level = "verified";
  else if (location === "match" || location === "nearby" || time === "match") level = "partial";
  else level = "unverified";

  return { level, location, time, photoHasLocation, photoHasTime, distanceM, minutesApart };
}

export const VERIFICATION_LABEL: Record<VerificationLevel, string> = {
  verified: "Verified",
  partial: "Partly verified",
  unverified: "Unverified",
  mismatch: "Doesn't match",
};

function formatDistance(m: number): string {
  return m < 1000 ? `${m} m` : `${(m / 1000).toFixed(1)} km`;
}

function formatMinutes(min: number): string {
  if (min < 60) return `${min} min`;
  const h = Math.round(min / 60);
  return h < 48 ? `${h} h` : `${Math.round(h / 24)} days`;
}

/** Plain-language reasons, in the same explain-your-working style as the recommender. */
export function verificationReasons(v: CatchVerification): string[] {
  const out: string[] = [];

  if (v.location === "match" && v.distanceM != null) {
    out.push(`Photo GPS matches this spot (within ${formatDistance(v.distanceM)})`);
  } else if (v.location === "nearby" && v.distanceM != null) {
    out.push(`Photo GPS is ${formatDistance(v.distanceM)} from the logged spot`);
  } else if (v.location === "mismatch" && v.distanceM != null) {
    out.push(`Photo GPS is ${formatDistance(v.distanceM)} away from the logged spot`);
  } else if (v.photoHasLocation) {
    // The photo knows where it was; we just have nothing to compare it against yet.
    out.push("Pick a spot to check this against the photo's GPS");
  } else {
    out.push("Photo has no location data");
  }

  if (v.time === "match" && v.minutesApart != null) {
    out.push(`Taken within ${formatMinutes(v.minutesApart)} of the logged time`);
  } else if (v.time === "mismatch" && v.minutesApart != null) {
    out.push(`Taken ${formatMinutes(v.minutesApart)} from the logged time`);
  } else {
    out.push("Photo has no timestamp");
  }

  if (v.level === "unverified") {
    out.push("Not a problem — most phone photos have this stripped out");
  }
  if (v.time === "mismatch") {
    out.push("Worth a second look — a wrong camera clock is a common innocent cause");
  } else if (v.location === "mismatch") {
    out.push("Worth a second look — the photo may be from a different trip");
  }

  return out;
}
