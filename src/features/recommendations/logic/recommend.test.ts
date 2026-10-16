import { describe, expect, it } from "vitest";
import type { Species } from "@/features/catches/data/species";
import { recommendSpecies, toStrength } from "./recommend";

function sp(id: string, tags: Species["tags"]): Species {
  return { id, commonName: id, scientificName: id, waterType: "freshwater", habitat: "", tags } as Species;
}

const walleye = sp("walleye", { lowLightFeeder: true, windTolerant: true });
const bass = sp("bass", { structureOriented: true, warmWater: true, sightFishable: true });
const salmon = sp("salmon", { coldWater: true, fallRun: true, windTolerant: true });

describe("toStrength", () => {
  it("buckets scores into coarse bands", () => {
    expect(toStrength(6)).toBe("strong");
    expect(toStrength(5)).toBe("strong");
    expect(toStrength(3)).toBe("good");
    expect(toStrength(0)).toBe("fair");
    expect(toStrength(-2)).toBe("fair");
  });
});

describe("recommendSpecies", () => {
  it("ranks a low-light feeder first at dusk", () => {
    const [top] = recommendSpecies({ phase: "dusk", windMph: 5, airTempF: 60, month: 4 }, [bass, walleye]);
    expect(top.species.id).toBe("walleye");
    expect(top.reasons).toContain("In the dusk low-light feeding window");
  });

  it("puts salmon on top late in the autumn run", () => {
    const [top] = recommendSpecies({ phase: "day", windMph: 8, airTempF: 50, month: 10 }, [bass, walleye, salmon]);
    expect(top.species.id).toBe("salmon");
    expect(top.strength).toBe("strong");
  });

  it("penalises sight-fished species in heavy wind", () => {
    const calm = recommendSpecies({ phase: "day", windMph: 5, airTempF: 75, month: 6 }, [bass])[0];
    const windy = recommendSpecies({ phase: "day", windMph: 20, airTempF: 75, month: 6 }, [bass])[0];
    expect(windy.score).toBeLessThan(calm.score);
    expect(windy.reasons).toContain("Chop is killing sight-fishing visibility");
  });

  it("gives every score change a matching reason", () => {
    const results = recommendSpecies({ phase: "night", windMph: 18, airTempF: 80, month: 7 }, [bass, walleye, salmon]);
    for (const r of results) {
      if (r.score !== 0) expect(r.reasons.length).toBeGreaterThan(0);
    }
  });

  it("ignores missing weather data instead of guessing", () => {
    const [r] = recommendSpecies({ phase: "unknown", windMph: null, airTempF: null, month: 1 }, [bass]);
    expect(r.score).toBe(0);
    expect(r.reasons).toEqual([]);
  });
});
