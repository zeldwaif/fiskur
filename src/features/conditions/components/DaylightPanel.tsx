import { Panel, SectionHeader, DataRow, Badge } from "@/components/ui";
import { LoadingState, ErrorState } from "@/components/feedback";
import { useDaylight } from "../hooks/useDaylight";
import type { DaylightPhase } from "../types/daylight.types";

const PHASE_LABEL: Record<DaylightPhase, string> = {
  dawn: "Dawn window",
  day: "Full daylight",
  dusk: "Dusk window",
  night: "After dark",
};

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

function formatCountdown(minutes: number): string {
  if (minutes <= 0) return "now";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `in ${h}h ${m}m` : `in ${m}m`;
}

export function DaylightPanel({ lat, lng }: { lat: number; lng: number }) {
  const { data, status } = useDaylight(lat, lng);

  if (status === "loading") return <Panel><LoadingState /></Panel>;
  if (status === "error" || !data) {
    return <Panel><ErrorState message="Daylight data unavailable — check your connection and try again." /></Panel>;
  }

  return (
    <Panel>
      <SectionHeader title="Light" action={<Badge>{PHASE_LABEL[data.phase]}</Badge>} />
      <DataRow label="Sunrise" value={formatTime(data.sunrise)} />
      <DataRow label="Sunset" value={formatTime(data.sunset)} />
      {data.nextWindowLabel && data.minutesToNextWindow != null && (
        <DataRow label={data.nextWindowLabel} value={formatCountdown(data.minutesToNextWindow)} />
      )}
    </Panel>
  );
}
