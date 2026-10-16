import { describe, expect, it } from "vitest";
import { distanceMeters, verificationReasons, verifyCatch } from "./verification";

// Toronto Harbour, roughly at the ferry docks.
const SPOT = { lat: 43.6405, lng: -79.3755 };
const CAUGHT_AT = "2026-07-04T19:30:00";

describe("distanceMeters", () => {
  it("is zero for the same point", () => {
    expect(distanceMeters(SPOT.lat, SPOT.lng, SPOT.lat, SPOT.lng)).toBe(0);
  });

  it("matches a known distance (one degree of latitude is about 111 km)", () => {
    const d = distanceMeters(43, -79, 44, -79);
    expect(d).toBeGreaterThan(110_500);
    expect(d).toBeLessThan(111_500);
  });
});

describe("verifyCatch", () => {
  it("is verified when photo GPS and timestamp both agree with the log", () => {
    const v = verifyCatch({
      exif: { lat: SPOT.lat + 0.0005, lng: SPOT.lng, takenAt: new Date("2026-07-04T19:10:00") },
      position: SPOT,
      caughtAt: CAUGHT_AT,
    });
    expect(v.level).toBe("verified");
    expect(v.location).toBe("match");
    expect(v.time).toBe("match");
    expect(v.distanceM).toBeLessThan(150);
    expect(v.minutesApart).toBe(20);
  });

  it("treats a photo with no metadata as unverified, not as a mismatch", () => {
    const v = verifyCatch({ exif: {}, position: SPOT, caughtAt: CAUGHT_AT });
    expect(v.level).toBe("unverified");
    expect(v.photoHasLocation).toBe(false);
    expect(v.photoHasTime).toBe(false);
    expect(verificationReasons(v)).toContain("Photo has no location data");
  });

  it("is partial when the photo is within a kilometre but outside the match radius", () => {
    const v = verifyCatch({
      exif: { lat: SPOT.lat + 0.004, lng: SPOT.lng },
      position: SPOT,
      caughtAt: CAUGHT_AT,
    });
    expect(v.location).toBe("nearby");
    expect(v.level).toBe("partial");
  });

  it("flags a mismatch when the photo was taken far away", () => {
    const v = verifyCatch({
      exif: { lat: 45.4215, lng: -75.6972, takenAt: new Date(CAUGHT_AT) }, // Ottawa
      position: SPOT,
      caughtAt: CAUGHT_AT,
    });
    expect(v.level).toBe("mismatch");
    expect(v.location).toBe("mismatch");
  });

  it("flags a mismatch when the photo was taken on a different day", () => {
    const v = verifyCatch({
      exif: { takenAt: new Date("2026-07-01T19:30:00") },
      position: SPOT,
      caughtAt: CAUGHT_AT,
    });
    expect(v.time).toBe("mismatch");
    expect(v.level).toBe("mismatch");
    expect(verificationReasons(v).some((r) => r.includes("camera clock"))).toBe(true);
  });

  it("cannot check location when the catch has no logged position", () => {
    const v = verifyCatch({ exif: { lat: SPOT.lat, lng: SPOT.lng }, position: null, caughtAt: CAUGHT_AT });
    expect(v.location).toBe("absent");
    expect(v.photoHasLocation).toBe(true);
  });
});
