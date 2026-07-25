import type { Species } from "@/features/catches/data/species";

export type TideState = "rising" | "falling" | "slack" | "unknown";

export interface RecommendationInput {
  /** Local hour, 0–23. */
  hour: number;
  tideState: TideState;
  windMph: number | null;
}

export interface Recommendation {
  species: Species;
  score: number;
  reasons: string[];
}

/**
 * Simple, transparent rules-based scoring — not ML, not a regulatory claim, just
 * widely-known general angling heuristics (low-light feeding windows, tide-driven
 * activity, wind's effect on sight-fishing) applied to the species reference list.
 * Every point added is paired with a plain-language reason so the recommendation
 * is explainable rather than a black box.
 */
export function recommendSpecies(input: RecommendationInput, candidates: Species[]): Recommendation[] {
  const { hour, tideState, windMph } = input;
  const isLowLight = (hour >= 5 && hour < 8) || (hour >= 17 && hour < 20);
  const isBrightMidday = hour >= 10 && hour < 15;

  const results: Recommendation[] = candidates.map((sp) => {
    const tags = sp.tags ?? {};
    let score = 0;
    const reasons: string[] = [];

    if (isLowLight && tags.lowLightFeeder) {
      score += 2;
      reasons.push("Low-light feeding window (dawn/dusk)");
    }
    if (isBrightMidday && tags.structureOriented) {
      score += 1;
      reasons.push("Bright midday — structure-oriented feeders stay active");
    }

    if (tideState === "rising" || tideState === "falling") {
      if (tags.tideDependent) {
        score += 2;
        reasons.push(`Moving (${tideState}) tide — active feeding window`);
      }
    } else if (tideState === "slack" && tags.structureOriented) {
      score += 1;
      reasons.push("Slack tide — structure feeders less affected by current");
    }

    if (windMph != null) {
      if (windMph < 10 && tags.sightFishable) {
        score += 2;
        reasons.push("Calm wind — good sight-fishing visibility");
      } else if (windMph >= 15 && tags.windTolerant) {
        score += 1;
        reasons.push("Handles wind/chop well");
      }
    }

    return { species: sp, score, reasons };
  });

  return results.sort((a, b) => b.score - a.score);
}
