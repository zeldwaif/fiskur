import { useState } from "react";
import { IconButton } from "@/components/ui";
import { useMapContext } from "../context/MapContext";
import { CurrentLocationControl } from "./CurrentLocationControl";
import "./map.css";

/**
 * Map controls: zoom, locate-me, and the layer-panel toggle.
 * Zoom and locate act directly on the shared map instance via context;
 * `onLayers` stays a prop since that toggles screen-level panel visibility, not the map itself.
 */
export function MapToolbar({ onLayers }: { onLayers?: () => void }) {
  const { provider } = useMapContext();
  const [locating, setLocating] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleLocate() {
    if (!provider) return;
    setLocating(true);
    setMessage(null);
    try {
      const position = await provider.getCurrentLocation();
      provider.moveCamera({ center: position, zoom: 14, animate: true });
    } catch {
      setMessage("Location permission denied. Enable it in your browser settings to use this.");
    } finally {
      setLocating(false);
    }
  }

  return (
    <div className="fk-maptoolbar">
      <IconButton label="Zoom in" onClick={() => provider?.zoomBy(1)}>+</IconButton>
      <IconButton label="Zoom out" onClick={() => provider?.zoomBy(-1)}>−</IconButton>
      <CurrentLocationControl onLocate={handleLocate} locating={locating} />
      <IconButton label="Map layers" onClick={onLayers}>≣</IconButton>
      {message && <p className="fk-toolbar__msg">{message}</p>}
    </div>
  );
}
