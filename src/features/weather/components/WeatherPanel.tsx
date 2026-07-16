import { Panel, SectionHeader, DataRow, Badge } from "@/components/ui";
import { LoadingState, ErrorState } from "@/components/feedback";
import { useWeather } from "../hooks/useWeather";
import { appConfig } from "@/app/config";

export function WeatherPanel() {
  const { lat, lng } = appConfig.map.defaultCenter;
  const { data, status } = useWeather(lat, lng);
  if (status === "loading") return <Panel><LoadingState /></Panel>;
  if (status === "error" || !data) return <Panel><ErrorState message="Weather unavailable." /></Panel>;
  return (
    <Panel>
      <SectionHeader title="Weather" action={data.updatedAt === "sample" ? <Badge>Sample data</Badge> : null} />
      <DataRow label="Air temperature" value={`${data.temperatureF} °F`} />
      <DataRow label="Wind" value={`${data.windMph} mph ${data.windDirection}`} />
    </Panel>
  );
}
