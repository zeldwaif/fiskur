import { useEffect, useState } from "react";
import { fetchDaylight } from "../api/daylightService";
import type { DaylightSnapshot } from "../types/daylight.types";

type Status = "loading" | "success" | "error";

export function useDaylight(lat: number, lng: number) {
  const [data, setData] = useState<DaylightSnapshot | null>(null);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    fetchDaylight(lat, lng)
      .then((snapshot) => {
        if (cancelled) return;
        setData(snapshot);
        setStatus("success");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [lat, lng]);

  return { data, status };
}
