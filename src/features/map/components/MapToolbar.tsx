import { IconButton } from "@/components/ui";
import { CurrentLocationControl } from "./CurrentLocationControl";
import "./map.css";

/** Composes map controls. Positioning is handled by the parent overlay, not here. */
export function MapToolbar({ onZoomIn, onZoomOut, onLocate, onLayers }: {
  onZoomIn?: () => void; onZoomOut?: () => void; onLocate?: () => void; onLayers?: () => void;
}) {
  return (
    <div className="fk-maptoolbar">
      <IconButton label="Zoom in" onClick={onZoomIn}>+</IconButton>
      <IconButton label="Zoom out" onClick={onZoomOut}>−</IconButton>
      <CurrentLocationControl onLocate={onLocate} />
      <IconButton label="Map layers" onClick={onLayers}>≣</IconButton>
    </div>
  );
}
