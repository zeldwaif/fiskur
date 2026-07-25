import { useState } from "react";
import { MapLayout, FloatingPanel } from "@/components/layout";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { MapContextProvider } from "./context/MapContext";
import { FishingMap } from "./components/FishingMap";
import { MapToolbar } from "./components/MapToolbar";
import { LocationSearch } from "./components/LocationSearch";
import { LayerSelector } from "./components/LayerSelector";
import { QuickCatchPanel } from "./components/QuickCatchPanel";
import { useMapClick } from "./hooks/useMapClick";
import { usePendingCatchMarker } from "./hooks/usePendingCatchMarker";
import { useLiveLocation } from "./hooks/useLiveLocation";
import type { LatLng } from "./types/map.types";

/**
 * Inner component so it can sit *inside* MapContextProvider and subscribe to map taps.
 * MapScreen itself is the provider boundary, so it cannot consume the context directly.
 */
function MapScreenContent() {
  const [showLayers, setShowLayers] = useState(false);
  const [pendingCatch, setPendingCatch] = useState<LatLng | null>(null);
  const [liveEnabled, setLiveEnabled] = useState(false);
  const isMobile = useIsMobile();

  // Shift+click, not plain click: panning and inspecting the map has to stay the default
  // gesture, so the destructive-feeling action is the one behind a modifier.
  useMapClick((position) => setPendingCatch(position), { requireShift: true });
  usePendingCatchMarker(pendingCatch);
  const live = useLiveLocation(liveEnabled);

  return (
    <MapLayout
      map={<FishingMap />}
      overlay={
        <>
          <FloatingPanel anchor="top-left" className="fk-floating--bare"><LocationSearch /></FloatingPanel>
          <FloatingPanel anchor="top-right" className="fk-floating--bare">
            <MapToolbar
              onLayers={() => setShowLayers((v) => !v)}
              liveEnabled={liveEnabled}
              onToggleLive={() => setLiveEnabled((v) => !v)}
              liveStatus={live.status}
            />
          </FloatingPanel>
          {showLayers && !pendingCatch && (
            <FloatingPanel anchor={isMobile ? "bottom-left" : "bottom-right"} className="fk-floating--bare">
              <LayerSelector />
            </FloatingPanel>
          )}
          {pendingCatch ? (
            <FloatingPanel anchor="bottom-left" className="fk-floating--bare">
              <QuickCatchPanel position={pendingCatch} onClose={() => setPendingCatch(null)} />
            </FloatingPanel>
          ) : (
            <div className="fk-maphint">
              <kbd className="fk-maphint__key">Shift</kbd> + click the map to log a catch there
            </div>
          )}
        </>
      }
    />
  );
}

/**
 * The main map screen. Composes modular pieces; each piece owns its own logic.
 * MapContextProvider gives every piece here access to the same live map instance.
 */
export function MapScreen() {
  return (
    <MapContextProvider>
      <MapScreenContent />
    </MapContextProvider>
  );
}
