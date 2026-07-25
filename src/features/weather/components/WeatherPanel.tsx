import { Panel, SectionHeader, DataRow } from "@/components/ui";
import { LoadingState, ErrorState } from "@/components/feedback";
import { useWeather } from "../hooks/useWeather";

export function WeatherPanel({ lat, lng }: { lat: number; lng: number }) {
  const { data, status } = useWeather(lat, lng);
  if (status === "loading") return <Panel><LoadingState /></Panel>;
  if (status === "error" || !data) {
    return <Panel><ErrorState message="Weather unavailable — check your connection and try again." /></Panel>;
  }
  return (
    <Panel>
      <SectionHeader title="Weather" />
      <DataRow label="Conditions" value={data.conditionLabel} />
      <DataRow label="Air temperature" value={`${data.temperatureF}°F`} />
      <DataRow label="Wind" value={`${data.windMph} mph ${data.windDirection}`} />
    </Panel>
  );
}
