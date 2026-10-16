import { describe, expect, it } from "vitest";
import type { CatchLog } from "@/features/catches/types";
import { computeStats } from "./stats";

function c(over: Partial<CatchLog>): CatchLog {
  return {
    id: Math.random().toString(36),
    speciesId: "walleye",
    speciesName: "Walleye",
    caughtAt: "2026-07-04T19:30:00",
    createdAt: "2026-07-04T20:00:00",
    released: false,
    ...over,
  };
}

describe("computeStats", () => {
  it("reports no release rate rather than 0% when nothing is logged", () => {
    const s = computeStats([]);
    expect(s.totalCatches).toBe(0);
    expect(s.releaseRate).toBeNull();
    expect(s.biggest).toBeNull();
    expect(s.lastCatchAt).toBeNull();
  });

  it("derives totals, release rate, heaviest catch and most recent catch", () => {
    const s = computeStats([
      c({ weightKg: 1.2, released: true, caughtAt: "2026-07-01T10:00:00" }),
      c({ speciesName: "Northern Pike", weightKg: 3.4, caughtAt: "2026-07-06T10:00:00" }),
      c({ speciesName: "walleye", released: true, caughtAt: "2026-07-03T10:00:00" }),
    ]);
    expect(s.totalCatches).toBe(3);
    expect(s.speciesLogged).toBe(2);
    expect(s.releaseRate).toBe(67);
    expect(s.biggest?.weightKg).toBe(3.4);
    expect(s.lastCatchAt).toBe("2026-07-06T10:00:00");
  });
});
