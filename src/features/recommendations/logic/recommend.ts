import type { Species } from "@/features/catches/data/species";
import type { DaylightPhase } from "@/features/conditions/types/daylight.types";

export interface RecommendationInput {
  /** Derived from today's real sunrise/sunset for this location. */
  phase: DaylightPhase | "unknown";
  windMph: number | null;
  airTempF: number | null;
  /** 0–11, local. Used as a coarse season signal. */
  month: number;
}

export interface Recommendation {
  species: Species;
  score: number;
  reasons: string[];
}

/** Sep–Nov: the Lake Ontario tributary salmon run. */
function isFallRunSeason(month: number): boolean {
  return month >= 8 && month <= 10;
}

/** Nov–Apr in the northern hemisphere: cold-water species are shallow and catchable. */
function isColdSeason(month: number): boolean {
  return month >= 10 || month <= 3;
}

/** Jun–Sep: warm-water species at peak activity. */
function isWarmSeason(month: number): boolean {
  return month >= 5 && month <= 8;
}

/**
 * Simple, transparent rules-based scoring — not ML, and not a regulatory claim. It applies
 * widely-known general angling heuristics (low-light feeding windows, wind's effect on
 * sight-fishing, cold- vs warm-water seasonality, the autumn salmon run) to the species
 * reference list.
 *
 * Two deliberate design choices:
 *  - Every point is paired with a plain-language reason, so a recommendation is explainable
 *    rather than a black box.
 *  - Scores can go DOWN as well as up. A model that only ever adds points will rank every
 *    species as "good", which is the same as saying nothing.
 */
export function recommendSpecies(input: RecommendationInput, candidates: Species[]): Recommendation[] {
  const { phase, windMph, airTempF, month } = input;
  const lowLight = phase === "dawn" || phase === "dusk";

  const results: Recommendation[] = candidates.map((sp) => {
    const tags = sp.tags ?? {};
    let score = 0;
    const reasons: string[] = [];

    // --- Light ---
    if (lowLight && tags.lowLightFeeder) {
      score += 3;
      reasons.push(`In the ${phase} low-light feeding window`);
    }
    if (phase === "day" && tags.structureOriented) {
      score += 1;
      reasons.push("Bright daylight — structure holders keep feeding");
    }
    if (phase === "day" && tags.lowLightFeeder) {
      score -= 1;
      reasons.push("Midday light — this one feeds better at dawn/dusk");
    }
    if (phase === "night" && !tags.lowLightFeeder) {
      score -= 1;
      reasons.push("After dark — not a typical window for this species");
    }

    // --- Wind ---
    if (windMph != null) {
      if (windMph < 10 && tags.sightFishable) {
        score += 2;
        reasons.push("Calm water — good sight-fishing visibility");
      }
      if (windMph >= 15) {
        if (tags.windTolerant) {
          score += 1;
          reasons.push("Handles wind and chop well");
        }
        if (tags.sightFishable) {
          score -= 2;
          reasons.push("Chop is killing sight-fishing visibility");
        }
      }
    }

    // --- Season and temperature ---
    if (tags.fallRun && isFallRunSeason(month)) {
      score += 3;
      reasons.push("Autumn run — staging nearshore and entering tributaries");
    }
    if (tags.coldWater) {
      if (isColdSeason(month)) {
        score += 2;
        reasons.push("Cold season — cold-water species are shallow and active");
      }
      if (airTempF != null && airTempF > 75) {
        score -= 2;
        reasons.push("Warm spell — these fish push out to deep, cold water");
      }
    }
    if (tags.warmWater) {
      if (isWarmSeason(month)) {
        score += 2;
        reasons.push("Warm season — peak activity for this species");
      }
      if (airTempF != null && airTempF < 45) {
        score -= 2;
        reasons.push("Cold water — warm-water species are sluggish");
      }
    }

    return { species: sp, score, reasons };
  });

  return results.sort((a, b) => b.score - a.score);
}
