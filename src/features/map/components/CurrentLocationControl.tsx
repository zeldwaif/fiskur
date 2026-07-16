import { IconButton } from "@/components/ui";
export function CurrentLocationControl({ onLocate }: { onLocate?: () => void }) {
  return <IconButton label="Center on my location" onClick={onLocate}>◎</IconButton>;
}
