import type { CatchLog } from "@/features/catches/types";
import type { Angler, Category, CategoryId, LeaderboardEntry } from "../types";

/**
 * Leaderboard scoring.
 *
 * Two deliberate positions, both of which are the whole point of this screen:
 *
 * 1. **Verified catches only.** A catch counts here only if its photo's own EXIF GPS and
 *    timestamp corroborated the logged place and time (see features/catches/verification).
 *    Unverified catches are excluded — not because we assume they're false, but because a
 *    ranking built on unverifiable claims is exactly why every other fishing app's
 *    leaderboard is meaningless. Excluding them is what makes this one mean anything.
 *
 * 2. **"Biggest fish" is one category out of four, and not the default.** Ranking purely
 *    on size rewards keeping and killing large, old, high-value breeding fish. Diversity,
 *    release rate and consistency reward skill and stewardship instead. This is a values
 *    choice encoded in software, and it's defensible out loud.
 */

export const CATEGORIES: Category[] = [
  {
    id: "diversity",
    label: "Species diversity",
    blurb: "Distinct species landed. Rewards range and skill rather than one lucky fish.",
    minCatches: 1,
  },
  {
    id: "release",
    label: "Release rate",
    blurb: "Share of catches returned to the water. Rewards stewardship, not body count.",
    minCatches: 3,
  },
  {
    id: "consistency",
    label: "Consistency",
    blurb: "Distinct days with a verified catch. Rewards showing up, not a single big day.",
    minCatches: 1,
  },
  {
    id: "biggest",
    label: "Biggest fish",
    blurb: "Heaviest single verified catch. Included because people want it — but it is not the headline.",
    minCatches: 1,
  },
];

/** The gate that gives this board its meaning. */
export function verifiedCatches(catches: CatchLog[]): CatchLog[] {
  return catches.filter((c) => c.verification?.level === "verified");
}

function localDayKey(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

interface Scored {
  value: number;
  display: string;
}

function scoreCategory(categoryId: CategoryId, verified: CatchLog[]): Scored {
  switch (categoryId) {
    case "diversity": {
      const n = new Set(verified.map((c) => c.speciesId)).size;
      return { value: n, display: `${n} ${n === 1 ? "species" : "species"}` };
    }
    case "release": {
      if (verified.length === 0) return { value: 0, display: "—" };
      const released = verified.filter((c) => c.released).length;
      const pct = Math.round((released / verified.length) * 100);
      return { value: pct, display: `${pct}%` };
    }
    case "consistency": {
      const n = new Set(verified.map((c) => localDayKey(c.caughtAt))).size;
      return { value: n, display: `${n} ${n === 1 ? "day" : "days"}` };
    }
    case "biggest": {
      const weights = verified.map((c) => c.weightKg).filter((w): w is number => typeof w === "number");
      if (weights.length === 0) return { value: 0, display: "—" };
      const max = Math.max(...weights);
      return { value: max, display: `${max} kg` };
    }
  }
}

/**
 * Ranks anglers for one category. Non-qualifying anglers are still returned (so the user
 * can see *why* they're absent rather than silently vanishing) but sort to the bottom.
 */
export function buildLeaderboard(categoryId: CategoryId, anglers: Angler[]): LeaderboardEntry[] {
  const category = CATEGORIES.find((c) => c.id === categoryId)!;

  const entries: LeaderboardEntry[] = anglers.map((angler) => {
    const verified = verifiedCatches(angler.catches);
    const { value, display } = scoreCategory(categoryId, verified);

    let qualified = verified.length >= category.minCatches;
    let note: string | undefined;
    if (!qualified) {
      const unverified = angler.catches.length - verified.length;
      note =
        angler.catches.length === 0
          ? "No catches logged yet"
          : `Needs ${category.minCatches} verified ${category.minCatches === 1 ? "catch" : "catches"} — ${unverified} logged ${unverified === 1 ? "catch is" : "catches are"} unverified`;
    }
    // "Biggest fish" additionally needs a recorded weight to be rankable at all.
    if (qualified && categoryId === "biggest" && value === 0) {
      qualified = false;
      note = "No weight recorded on any verified catch";
    }

    return { angler, value, display, verifiedCount: verified.length, qualified, note };
  });

  return entries.sort((a, b) => {
    if (a.qualified !== b.qualified) return a.qualified ? -1 : 1;
    if (b.value !== a.value) return b.value - a.value;
    return a.angler.displayName.localeCompare(b.angler.displayName);
  });
}
