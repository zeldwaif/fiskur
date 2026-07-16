import { appConfig } from "@/app/config";
import type { MapProvider } from "../types/map.types";
import { GoogleMapsProvider } from "./googleMapsProvider";
import { OpenLayersProvider } from "./openLayersProvider";
import { DemoMapProvider } from "./demoMapProvider";

/**
 * Returns the configured map provider. This is the ONLY place provider choice lives —
 * swap providers here and no feature code changes.
 *
 * Preference order:
 *   1. Explicit appConfig.map.provider ("google" | "openlayers" | "demo")
 *   2. "auto": Google if a key is present, otherwise OpenLayers (free satellite, no key)
 */
export function createMapProvider(): MapProvider {
  const pref = appConfig.map.provider;
  const key = appConfig.env.googleMapsApiKey?.trim();

  if (pref === "google") return new GoogleMapsProvider(key ?? "");
  if (pref === "openlayers") return new OpenLayersProvider();
  if (pref === "demo") return new DemoMapProvider();

  // auto
  if (key) return new GoogleMapsProvider(key);
  return new OpenLayersProvider();
}

export const isMapConfigured = () => true; // OpenLayers needs no key
