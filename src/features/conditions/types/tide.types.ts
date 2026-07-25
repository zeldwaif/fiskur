export interface TideEvent {
  time: string;
  type: "H" | "L";
  heightFt: number;
}

export interface TideSnapshot {
  stationId: string;
  stationName: string;
  /** Whether the tide is currently coming in, going out, or near the turn. */
  state: "rising" | "falling" | "slack";
  last: TideEvent | null;
  next: TideEvent | null;
}
