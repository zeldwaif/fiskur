import { LoadingState } from "@/components/feedback";
export function MapLoadingState() {
  return (
    <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", background: "var(--color-map-overlay-scrim)" }}>
      <LoadingState message="Loading map…" />
    </div>
  );
}
