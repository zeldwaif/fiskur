import { ErrorState } from "@/components/feedback";
export function MapErrorState({ message }: { message?: string }) {
  return (
    <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", background: "var(--color-map-overlay-scrim)" }}>
      <ErrorState title="Map unavailable" message={message ?? "The map could not be loaded."} />
    </div>
  );
}
