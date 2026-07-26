import type { CatchLog } from "@/features/catches/types";
import type { Angler } from "../types";

/**
 * SAMPLE anglers so the leaderboard has something to rank against.
 *
 * Per the project's data-integrity rule (same rule as sampleLayerData): placeholder data
 * is never presented as if it were real. Every one of these carries `isSample: true`, and
 * the leaderboard tags each row visibly — not just in a footnote — so nobody can mistake
 * them for real people. There is no backend, so the only genuine competitor data that can
 * exist here is the user's own.
 *
 * Their catches are marked verified because that is what they are illustrating: what the
 * board looks like once catches carry EXIF corroboration.
 */

const VERIFIED: CatchLog["verification"] = {
  level: "verified",
  location: "match",
  time: "match",
  photoHasLocation: true,
  photoHasTime: true,
  distanceM: 40,
  minutesApart: 8,
};

/** Days back from now, so the sample never looks stale during a demo. */
function daysAgo(days: number, hour = 6): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

function sampleCatch(
  id: string,
  speciesId: string,
  speciesName: string,
  days: number,
  released: boolean,
  weightKg?: number,
): CatchLog {
  return {
    id,
    speciesId,
    speciesName,
    caughtAt: daysAgo(days),
    createdAt: daysAgo(days),
    released,
    weightKg,
    locationName: "Sample data",
    verification: VERIFIED,
  };
}

export const demoAnglers: Angler[] = [
  {
    id: "sample-priya",
    displayName: "Priya Raman (sample)",
    handle: "priyafishes",
    isSample: true,
    isSelf: false,
    catches: [
      sampleCatch("s-p1", "smallmouth-bass", "Smallmouth Bass", 2, true, 2.1),
      sampleCatch("s-p2", "northern-pike", "Northern Pike", 5, true, 4.4),
      sampleCatch("s-p3", "walleye", "Walleye", 9, true, 3.2),
      sampleCatch("s-p4", "yellow-perch", "Yellow Perch", 12, true, 0.4),
      sampleCatch("s-p5", "black-crappie", "Black Crappie", 18, true, 0.6),
    ],
  },
  {
    id: "sample-marcus",
    displayName: "Marcus Bell (sample)",
    handle: "bellsbaits",
    isSample: true,
    isSelf: false,
    catches: [
      sampleCatch("s-m1", "chinook-salmon", "Chinook Salmon", 3, false, 9.8),
      sampleCatch("s-m2", "chinook-salmon", "Chinook Salmon", 8, false, 7.1),
      sampleCatch("s-m3", "rainbow-trout", "Rainbow Trout (Steelhead)", 15, true, 3.9),
    ],
  },
  {
    id: "sample-ana",
    displayName: "Ana Kovac (sample)",
    handle: "anaonthewater",
    isSample: true,
    isSelf: false,
    catches: [
      sampleCatch("s-a1", "largemouth-bass", "Largemouth Bass", 1, true, 1.9),
      sampleCatch("s-a2", "common-carp", "Common Carp", 4, true, 6.3),
      sampleCatch("s-a3", "pumpkinseed", "Pumpkinseed", 6, true, 0.2),
      sampleCatch("s-a4", "smallmouth-bass", "Smallmouth Bass", 11, false, 2.6),
    ],
  },
  {
    id: "sample-theo",
    displayName: "Theo Nwosu (sample)",
    handle: "theonfish",
    isSample: true,
    isSelf: false,
    catches: [
      sampleCatch("s-t1", "muskellunge", "Muskellunge", 7, true, 11.4),
      sampleCatch("s-t2", "northern-pike", "Northern Pike", 20, true, 5.0),
    ],
  },
];
