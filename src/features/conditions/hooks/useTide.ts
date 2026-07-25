import { useEffect, useState } from "react";
import { fetchTide } from "../api/tideService";
import type { TideSnapshot } from "../types/tide.types";

type Status = "loading" | "success" | "error" | "unavailable";

export function useTide(lat: number, lng: number) {
  const [data, setData] = useState<TideSnapshot | null>(null);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    let alive = true;
    setStatus("loading");
    fetchTide(lat, lng)
      .then((snapshot) => {
        if (!alive) return;
        if (!snapshot) {
          setStatus("unavailable");
          return;
        }
        setData(snapshot);
        setStatus("success");
      })
      .catch(() => {
        if (alive) setStatus("error");
      });
    return () => {
      alive = false;
    };
  }, [lat, lng]);

  return { data, status };
}
