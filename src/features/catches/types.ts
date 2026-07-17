/** A single logged catch. */
export interface CatchLog {
  id: string;
  /** Species id from the species reference list, or a free-text fallback. */
  speciesId: string;
  speciesName: string;
  /** Length in centimetres (store canonical metric; display can convert). */
  lengthCm?: number;
  /** Weight in kilograms. */
  weightKg?: number;
  /** ISO datetime the fish was caught. */
  caughtAt: string;
  /** Where it was caught. */
  lat?: number;
  lng?: number;
  locationName?: string;
  notes?: string;
  /** Whether the fish was released. */
  released: boolean;
  /** ISO timestamp of when the log was created. */
  createdAt: string;
}

export interface NewCatchLog {
  speciesId: string;
  speciesName: string;
  lengthCm?: number;
  weightKg?: number;
  caughtAt: string;
  lat?: number;
  lng?: number;
  locationName?: string;
  notes?: string;
  released: boolean;
}

export function isCatchLogArray(value: unknown): value is CatchLog[] {
  return (
    Array.isArray(value) &&
    value.every(
      (v) =>
        v &&
        typeof v === "object" &&
        typeof (v as CatchLog).id === "string" &&
        typeof (v as CatchLog).speciesName === "string" &&
        typeof (v as CatchLog).caughtAt === "string",
    )
  );
}
