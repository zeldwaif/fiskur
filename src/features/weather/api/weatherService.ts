import type { WeatherSnapshot } from "../types/weather.types";

/**
 * Weather API client — Open-Meteo (https://open-meteo.com), free and keyless,
 * no signup required. Chosen specifically so this feature works with zero setup.
 */
const WEATHER_CODE_LABELS: Record<number, string> = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Rime fog",
  51: "Light drizzle",
  53: "Drizzle",
  55: "Dense drizzle",
  61: "Light rain",
  63: "Rain",
  65: "Heavy rain",
  71: "Light snow",
  73: "Snow",
  75: "Heavy snow",
  80: "Rain showers",
  81: "Rain showers",
  82: "Violent rain showers",
  95: "Thunderstorm",
  96: "Thunderstorm, hail",
  99: "Thunderstorm, hail",
};

const COMPASS = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];

function degreesToCompass(deg: number): string {
  return COMPASS[Math.round(deg / 22.5) % 16];
}

export async function fetchWeather(lat: number, lng: number): Promise<WeatherSnapshot> {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}` +
    `&current=temperature_2m,wind_speed_10m,wind_direction_10m,weather_code` +
    `&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Weather request failed (${res.status})`);
  const data = (await res.json()) as {
    current?: { time: string; temperature_2m: number; wind_speed_10m: number; wind_direction_10m: number; weather_code: number };
  };
  const current = data.current;
  if (!current) throw new Error("Weather response missing current conditions");
  return {
    temperatureF: Math.round(current.temperature_2m),
    windMph: Math.round(current.wind_speed_10m),
    windDirection: degreesToCompass(current.wind_direction_10m),
    weatherCode: current.weather_code,
    conditionLabel: WEATHER_CODE_LABELS[current.weather_code] ?? "Unknown",
    updatedAt: current.time,
  };
}
