import { IconButton } from "@/components/ui";

export function CurrentLocationControl({ onLocate, locating }: { onLocate?: () => void; locating?: boolean }) {
  return (
    <IconButton label={locating ? "Locating…" : "Center on my location"} onClick={onLocate} disabled={locating} aria-busy={locating}>
      ◎
    </IconButton>
  );
}
