/** A user-saved fishing spot. */
export interface SavedLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  /** Optional free-text note ("good on outgoing tide", etc.). */
  notes?: string;
  /** ISO timestamp of when it was saved. */
  createdAt: string;
}

/** Shape used when creating a new saved location (id/createdAt are assigned by the store). */
export interface NewSavedLocation {
  name: string;
  lat: number;
  lng: number;
  notes?: string;
}

export function isSavedLocationArray(value: unknown): value is SavedLocation[] {
  return (
    Array.isArray(value) &&
    value.every(
      (v) =>
        v &&
        typeof v === "object" &&
        typeof (v as SavedLocation).id === "string" &&
        typeof (v as SavedLocation).name === "string" &&
        typeof (v as SavedLocation).lat === "number" &&
        typeof (v as SavedLocation).lng === "number",
    )
  );
}
