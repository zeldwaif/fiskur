import { useMemo } from "react";
import { useWeather } from "@/features/weather/hooks/useWeather";
import { useDaylight } from "@/features/conditions/hooks/useDaylight";
import { species } from "@/features/catches/data/species";
import { recommendSpecies, type Recommendation } from "../logic/recommend";

type Status = "loading" | "success" | "error";

interface Result {
  status: Status;
  recommendations: Recommendation[];
}

/** Combines live weather + real daylight phase into the rules-based species recommendation. */
export function useRecommendations(lat: number, lng: number): Result {
  const weather = useWeather(lat, lng);
  const daylight = useDaylight(lat, lng);

  const status: Status =
    weather.status === "loading" || daylight.status === "loading"
      ? "loading"
      : weather.status === "error"
        ? "error"
        : "success";

  const recommendations = useMemo(() => {
    if (status !== "success") return [];
    const now = new Date();
    return recommendSpecies(
      {
        phase: daylight.status === "success" && daylight.data ? daylight.data.phase : "unknown",
        windMph: weather.data?.windMph ?? null,
        airTempF: weather.data?.temperatureF ?? null,
        month: now.getMonth(),
      },
      species,
    )
      // Only surface species the conditions actually argue FOR. Listing a negative-scoring
      // fish under "what to target right now" would be recommending against itself.
      .filter((r) => r.score > 0)
      .slice(0, 4);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, daylight.status, daylight.data, weather.data]);

  return { status, recommendations };
}
