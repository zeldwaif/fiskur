import { useState } from "react";
import { IconButton } from "@/components/ui";
import { useMapContext } from "../context/MapContext";
import { CurrentLocationControl } from "./CurrentLocationControl";
import type { LiveLocationStatus } from "../hooks/useLiveLocation";
import "./map.css";

const LIVE_MESSAGES: Partial<Record<LiveLocationStatus, string>> = {
  denied: "Location permission denied. Enable it in your browser settings to use live tracking.",
  unsupported: "Live location isn't available on this device or connection.",
  locating: "Getting your location…",
};

interface MapToolbarProps {
  onLayers?: () => void;
  liveEnabled: boolean;
  onToggleLive: () => void;
  liveStatus: LiveLocationStatus;
}

/**
 * Map controls: zoom, centre-on-me, live-tracking toggle, and the layer-panel toggle.
 * Zoom and locate act directly on the shared map instance via context; the rest are props
 * because they toggle screen-level state rather than the map itself.
 */
export function MapToolbar({ onLayers, liveEnabled, onToggleLive, liveStatus }: MapToolbarProps) {
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

  const liveMessage = liveEnabled ? LIVE_MESSAGES[liveStatus] : undefined;

  return (
    <div className="fk-maptoolbar">
      <IconButton label="Zoom in" onClick={() => provider?.zoomBy(1)}>+</IconButton>
      <IconButton label="Zoom out" onClick={() => provider?.zoomBy(-1)}>−</IconButton>
      <CurrentLocationControl onLocate={handleLocate} locating={locating} />
      <IconButton
        label={liveEnabled ? "Turn off live location" : "Show my live location"}
        onClick={onToggleLive}
        aria-pressed={liveEnabled}
        className={liveEnabled ? "fk-iconbtn--active" : undefined}
      >
        ⦿
      </IconButton>
      <IconButton label="Map layers" onClick={onLayers}>≣</IconButton>
      {(message || liveMessage) && <p className="fk-toolbar__msg">{message ?? liveMessage}</p>}
    </div>
  );
}
