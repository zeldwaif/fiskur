import type { CatchLog } from "@/features/catches/types";

/**
 * An angler who can appear on the board.
 *
 * `isSample` exists so the UI can label demo anglers on every single row rather than only
 * in a footnote. There is no backend, so the only real competitor data that exists is the
 * user's own — everyone else is illustrative, and the board says so in place.
 */
export interface Angler {
  id: string;
  displayName: string;
  handle: string;
  catches: CatchLog[];
  isSample: boolean;
  isSelf: boolean;
}

export type CategoryId = "diversity" | "release" | "consistency" | "biggest";

export interface Category {
  id: CategoryId;
  label: string;
  /** One line explaining what the category rewards and why it was chosen. */
  blurb: string;
  /** Minimum qualifying verified catches. */
  minCatches: number;
}

export interface LeaderboardEntry {
  angler: Angler;
  /** Numeric value used for ranking. */
  value: number;
  /** Preformatted value for display. */
  display: string;
  verifiedCount: number;
  qualified: boolean;
  /** Why an angler didn't qualify, shown instead of a rank. */
  note?: string;
}
