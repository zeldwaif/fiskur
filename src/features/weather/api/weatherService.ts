import type { WeatherSnapshot } from "../types/weather.types";
import { appConfig } from "@/app/config";

/**
 * Weather API client. Currently returns clearly-marked SAMPLE data until a provider is wired.
 * Real implementation would call a weather API using appConfig.env.weatherApiKey.
 */
export async function fetchWeather(_lat: number, _lng: number): Promise<WeatherSnapshot> {
  if (!appConfig.env.weatherApiKey) {
    // Sample data — explicitly not live. Replace with a real request when configured.
    return { temperatureF: 81, windMph: 8, windDirection: "SE", updatedAt: "sample" };
  }
  throw new Error("Weather provider not implemented yet.");
}
