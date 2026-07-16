import { useEffect, useState } from "react";
import { fetchWeather } from "../api/weatherService";
import type { WeatherSnapshot } from "../types/weather.types";

type Status = "loading" | "success" | "error";

export function useWeather(lat: number, lng: number) {
  const [data, setData] = useState<WeatherSnapshot | null>(null);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    let alive = true;
    setStatus("loading");
    fetchWeather(lat, lng)
      .then((d) => { if (alive) { setData(d); setStatus("success"); } })
      .catch(() => { if (alive) setStatus("error"); });
    return () => { alive = false; };
  }, [lat, lng]);

  return { data, status };
}
