import { describe, expect, it } from "vitest";
import type { CatchLog } from "@/features/catches/types";
import type { Angler } from "../types";
import { buildLeaderboard, verifiedCatches } from "./leaderboard";

let n = 0;
function catchLog(over: Partial<CatchLog> & { verified?: boolean }): CatchLog {
  const { verified = true, ...rest } = over;
  return {
    id: `c${n++}`,
    speciesId: "walleye",
    speciesName: "Walleye",
    caughtAt: "2026-07-04T19:30:00",
    createdAt: "2026-07-04T20:00:00",
    released: false,
    verification: verified
      ? { level: "verified", location: "match", time: "match", photoHasLocation: true, photoHasTime: true }
      : undefined,
    ...rest,
  };
}

function angler(displayName: string, catches: CatchLog[]): Angler {
  return { id: displayName, displayName, handle: displayName, catches, isSample: true, isSelf: false };
}

describe("verifiedCatches", () => {
  it("keeps only catches whose photo corroborated the log", () => {
    const list = [catchLog({}), catchLog({ verified: false })];
    expect(verifiedCatches(list)).toHaveLength(1);
  });
});

describe("buildLeaderboard", () => {
  it("ranks by distinct verified species and ignores unverified ones", () => {
    const a = angler("Ada", [catchLog({ speciesId: "walleye" }), catchLog({ speciesId: "pike" })]);
    const b = angler("Ben", [
      catchLog({ speciesId: "walleye" }),
      catchLog({ speciesId: "pike", verified: false }),
      catchLog({ speciesId: "perch", verified: false }),
    ]);
    const board = buildLeaderboard("diversity", [b, a]);
    expect(board.map((e) => e.angler.displayName)).toEqual(["Ada", "Ben"]);
    expect(board[0].value).toBe(2);
    expect(board[1].value).toBe(1);
  });

  it("sorts non-qualifying anglers last and explains why", () => {
    const a = angler("Ada", [catchLog({ released: true }), catchLog({ released: true }), catchLog({})]);
    const b = angler("Ben", [catchLog({ released: true }), catchLog({ verified: false })]);
    const board = buildLeaderboard("release", [b, a]);
    expect(board[0].angler.displayName).toBe("Ada");
    expect(board[0].display).toBe("67%");
    expect(board[1].qualified).toBe(false);
    expect(board[1].note).toMatch(/Needs 3 verified catches/);
  });

  it("does not rank biggest fish without a recorded weight", () => {
    const board = buildLeaderboard("biggest", [angler("Ada", [catchLog({})])]);
    expect(board[0].qualified).toBe(false);
    expect(board[0].note).toBe("No weight recorded on any verified catch");
  });

  it("counts consistency as distinct days, not catches", () => {
    const a = angler("Ada", [
      catchLog({ caughtAt: "2026-07-04T08:00:00" }),
      catchLog({ caughtAt: "2026-07-04T18:00:00" }),
      catchLog({ caughtAt: "2026-07-05T08:00:00" }),
    ]);
    expect(buildLeaderboard("consistency", [a])[0].display).toBe("2 days");
  });
});
