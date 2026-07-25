import type { TideEvent, TideSnapshot } from "../types/tide.types";

/**
 * Tide data — NOAA CO-OPS (https://tidesandcurrents.noaa.gov), free and keyless.
 * Coverage is US waters only, which matches this app's current demo region.
 *
 * Rather than hard-coding a single station id (which would break for any other
 * coordinates and can't be verified without a live lookup), this looks up the
 * nearest real tide-prediction station to the given coordinates at runtime.
 */

interface NoaaStation {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

let stationCache: NoaaStation[] | null = null;

async function loadStations(): Promise<NoaaStation[]> {
  if (stationCache) return stationCache;
  const res = await fetch("https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations.json?type=tidepredictions");
  if (!res.ok) throw new Error(`NOAA station list request failed (${res.status})`);
  const data = (await res.json()) as { stations?: Array<{ id: string; name: string; lat: number; lng: number }> };
  stationCache = (data.stations ?? []).map((s) => ({ id: s.id, name: s.name, lat: s.lat, lng: s.lng }));
  return stationCache;
}

function haversineMiles(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const R = 3958.8;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(h));
}

async function nearestStation(lat: number, lng: number): Promise<NoaaStation | null> {
  const stations = await loadStations();
  if (stations.length === 0) return null;
  let best = stations[0];
  let bestDist = haversineMiles(lat, lng, best.lat, best.lng);
  for (const s of stations) {
    const d = haversineMiles(lat, lng, s.lat, s.lng);
    if (d < bestDist) {
      best = s;
      bestDist = d;
    }
  }
  return best;
}

function formatYYYYMMDD(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
}

export async function fetchTide(lat: number, lng: number): Promise<TideSnapshot | null> {
  const station = await nearestStation(lat, lng);
  if (!station) return null;

  const today = new Date();
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
  const url =
    `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?product=predictions&datum=MLLW` +
    `&station=${station.id}&time_zone=lst_ldt&units=english&interval=hilo&format=json` +
    `&application=fiskur&begin_date=${formatYYYYMMDD(today)}&end_date=${formatYYYYMMDD(tomorrow)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`NOAA predictions request failed (${res.status})`);
  const data = (await res.json()) as { predictions?: Array<{ t: string; type: "H" | "L"; v: string }> };
  const predictions = data.predictions ?? [];
  if (predictions.length === 0) return null;

  const events: TideEvent[] = predictions.map((p) => ({
    // NOAA returns "YYYY-MM-DD HH:mm" in local station time; make it parseable.
    time: p.t.replace(" ", "T"),
    type: p.type,
    heightFt: parseFloat(p.v),
  }));

  const now = Date.now();
  let last: TideEvent | null = null;
  let next: TideEvent | null = null;
  for (const e of events) {
    const t = new Date(e.time).getTime();
    if (t <= now) last = e;
    else if (!next) next = e;
  }

  let state: TideSnapshot["state"] = "slack";
  if (last && next) {
    const minutesToNext = (new Date(next.time).getTime() - now) / 60000;
    if (minutesToNext < 20) state = "slack";
    else state = last.type === "L" ? "rising" : "falling";
  }

  return { stationId: station.id, stationName: station.name, state, last, next };
}
