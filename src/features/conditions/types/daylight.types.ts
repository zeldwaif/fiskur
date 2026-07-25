/**
 * Daylight phase, derived from the real sunrise/sunset times for the location and date.
 *
 * This replaces the tide model used by the previous (saltwater) demo region. Lake Ontario
 * is effectively non-tidal — its astronomical tide is on the order of a couple of
 * centimetres and is completely masked by wind-driven seiche — so a tide panel here would
 * be presenting a number that means nothing. Dawn/dusk light is the dominant, genuinely
 * predictable feeding-window driver in this fishery, so that is what we model instead.
 */
export type DaylightPhase = "dawn" | "day" | "dusk" | "night";

export interface DaylightSnapshot {
  /** ISO local time of today's sunrise/sunset. */
  sunrise: string;
  sunset: string;
  phase: DaylightPhase;
  /** Minutes until the next dawn or dusk window opens; null once it is already open. */
  minutesToNextWindow: number | null;
  /** Human-readable label for the next window, e.g. "Dusk window". */
  nextWindowLabel: string | null;
}
