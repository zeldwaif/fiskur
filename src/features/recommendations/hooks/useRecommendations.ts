import { useMemo } from "react";
import { useWeather } from "@/features/weather/hooks/useWeather";
import { useTide } from "@/features/conditions/hooks/useTide";
import { species } from "@/features/catches/data/species";
import { recommendSpecies, type Recommendation, type TideState } from "../logic/recommend";

type Status = "loading" | "success" | "error";

interface Result {
  status: Status;
  recommendations: Recommendation[];
}

/** Combines live weather + tide into the rules-based species recommendation. */
export function useRecommendations(lat: number, lng: number): Result {
  const weather = useWeather(lat, lng);
  const tide = useTide(lat, lng);

  const status: Status =
    weather.status === "loading" || tide.status === "loading"
      ? "loading"
      : weather.status === "error"
        ? "error"
        : "success";

  const recommendations = useMemo(() => {
    if (status !== "success") return [];
    const tideState: TideState = tide.status === "success" && tide.data ? tide.data.state : "unknown";
    return recommendSpecies(
      { hour: new Date().getHours(), tideState, windMph: weather.data?.windMph ?? null },
      species,
    ).slice(0, 4);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, tide.status, tide.data, weather.data]);

  return { status, recommendations };
}
