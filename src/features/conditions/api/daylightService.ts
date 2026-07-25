import type { DaylightPhase, DaylightSnapshot } from "../types/daylight.types";

/**
 * Sunrise/sunset via Open-Meteo (https://open-meteo.com) — free, keyless, and global,
 * so this works for any region the app is pointed at, not just the demo one.
 *
 * The "feeding window" boundaries below are a modelling choice, not measured data:
 * anglers conventionally treat roughly the hour before to the hour-and-a-half after
 * sunrise (and the mirror image at sunset) as the low-light bite. They are stated
 * explicitly here so the assumption is auditable rather than buried.
 */
const DAWN_STARTS_BEFORE_SUNRISE_MIN = 60;
const DAWN_ENDS_AFTER_SUNRISE_MIN = 90;
const DUSK_STARTS_BEFORE_SUNSET_MIN = 90;
const DUSK_ENDS_AFTER_SUNSET_MIN = 60;

const MIN = 60 * 1000;

export function derivePhase(now: Date, sunrise: Date, sunset: Date): DaylightPhase {
  const t = now.getTime();
  const dawnStart = sunrise.getTime() - DAWN_STARTS_BEFORE_SUNRISE_MIN * MIN;
  const dawnEnd = sunrise.getTime() + DAWN_ENDS_AFTER_SUNRISE_MIN * MIN;
  const duskStart = sunset.getTime() - DUSK_STARTS_BEFORE_SUNSET_MIN * MIN;
  const duskEnd = sunset.getTime() + DUSK_ENDS_AFTER_SUNSET_MIN * MIN;

  if (t >= dawnStart && t < dawnEnd) return "dawn";
  if (t >= duskStart && t < duskEnd) return "dusk";
  if (t >= dawnEnd && t < duskStart) return "day";
  return "night";
}

export async function fetchDaylight(lat: number, lng: number): Promise<DaylightSnapshot> {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}` +
    `&daily=sunrise,sunset&timezone=auto&forecast_days=1`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Daylight request failed (${res.status})`);
  const data = (await res.json()) as { daily?: { sunrise?: string[]; sunset?: string[] } };
  const sunriseStr = data.daily?.sunrise?.[0];
  const sunsetStr = data.daily?.sunset?.[0];
  if (!sunriseStr || !sunsetStr) throw new Error("Daylight response missing sunrise/sunset");

  const now = new Date();
  const sunrise = new Date(sunriseStr);
  const sunset = new Date(sunsetStr);
  const phase = derivePhase(now, sunrise, sunset);

  let minutesToNextWindow: number | null = null;
  let nextWindowLabel: string | null = null;
  if (phase === "day") {
    minutesToNextWindow = Math.round((sunset.getTime() - DUSK_STARTS_BEFORE_SUNSET_MIN * MIN - now.getTime()) / MIN);
    nextWindowLabel = "Dusk window";
  } else if (phase === "night") {
    // Next dawn window; if today's has already passed, it opens tomorrow.
    let dawnStart = sunrise.getTime() - DAWN_STARTS_BEFORE_SUNRISE_MIN * MIN;
    if (dawnStart < now.getTime()) dawnStart += 24 * 60 * MIN;
    minutesToNextWindow = Math.round((dawnStart - now.getTime()) / MIN);
    nextWindowLabel = "Dawn window";
  }

  return {
    sunrise: sunriseStr,
    sunset: sunsetStr,
    phase,
    minutesToNextWindow,
    nextWindowLabel,
  };
}
