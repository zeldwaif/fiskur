import { Panel, SectionHeader, DataRow, Badge } from "@/components/ui";
import { LoadingState, ErrorState, EmptyState } from "@/components/feedback";
import { useTide } from "../hooks/useTide";

const STATE_LABEL: Record<string, string> = {
  rising: "Rising",
  falling: "Falling",
  slack: "Near turn (slack)",
};

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

export function TidePanel({ lat, lng }: { lat: number; lng: number }) {
  const { data, status } = useTide(lat, lng);

  if (status === "loading") return <Panel><LoadingState /></Panel>;
  if (status === "error") return <Panel><ErrorState message="Tide data unavailable — check your connection and try again." /></Panel>;
  if (status === "unavailable" || !data) {
    return (
      <Panel>
        <SectionHeader title="Tide" />
        <EmptyState title="No tide station nearby" message="NOAA tide coverage is US-waters only; this location may be outside it." />
      </Panel>
    );
  }

  return (
    <Panel>
      <SectionHeader title="Tide" action={<Badge>{STATE_LABEL[data.state]}</Badge>} />
      {data.next && (
        <DataRow
          label={data.next.type === "H" ? "Next high" : "Next low"}
          value={`${formatTime(data.next.time)} · ${data.next.heightFt.toFixed(1)} ft`}
        />
      )}
      {data.last && (
        <DataRow
          label={data.last.type === "H" ? "Last high" : "Last low"}
          value={`${formatTime(data.last.time)} · ${data.last.heightFt.toFixed(1)} ft`}
        />
      )}
      <DataRow label="Station" value={data.stationName} />
    </Panel>
  );
}
