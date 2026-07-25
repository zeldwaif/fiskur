import type { CatchLog } from "@/features/catches/types";
import { species as allSpecies } from "@/features/catches/data/species";

export interface AnglerStats {
  totalCatches: number;
  speciesLogged: number;
  speciesTotal: number;
  releaseRate: number | null;
  biggest: CatchLog | null;
  lastCatchAt: string | null;
}

/**
 * Derives profile stats from the real catch log. Nothing here is stored — it's computed
 * from `catches` so it can never drift out of sync with the underlying data.
 *
 * `releaseRate` is null rather than 0 when there are no catches, because "0% released"
 * and "no data yet" are very different claims to put on someone's profile.
 */
export function computeStats(catches: CatchLog[]): AnglerStats {
  const speciesLogged = new Set(catches.map((c) => c.speciesName.toLowerCase())).size;

  const withWeight = catches.filter((c) => typeof c.weightKg === "number");
  const biggest = withWeight.length
    ? withWeight.reduce((a, b) => ((b.weightKg ?? 0) > (a.weightKg ?? 0) ? b : a))
    : null;

  const released = catches.filter((c) => c.released).length;

  const sorted = [...catches].sort(
    (a, b) => new Date(b.caughtAt).getTime() - new Date(a.caughtAt).getTime(),
  );

  return {
    totalCatches: catches.length,
    speciesLogged,
    speciesTotal: allSpecies.length,
    releaseRate: catches.length ? Math.round((released / catches.length) * 100) : null,
    biggest,
    lastCatchAt: sorted[0]?.caughtAt ?? null,
  };
}

/** Which reference species the angler has logged at least once — the "collection" view. */
export function speciesCollection(catches: CatchLog[]) {
  const caught = new Set(catches.map((c) => c.speciesId));
  return allSpecies.map((s) => ({ species: s, caught: caught.has(s.id) }));
}
