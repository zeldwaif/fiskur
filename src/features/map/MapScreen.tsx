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
import type { LatLng } from "./types/map.types";

/**
 * Inner component so it can sit *inside* MapContextProvider and subscribe to map taps.
 * MapScreen itself is the provider boundary, so it cannot consume the context directly.
 */
function MapScreenContent() {
  const [showLayers, setShowLayers] = useState(false);
  const [pendingCatch, setPendingCatch] = useState<LatLng | null>(null);
  const isMobile = useIsMobile();

  // Tapping the water is the primary way to log a catch — see QuickCatchPanel.
  useMapClick((position) => setPendingCatch(position));

  return (
    <MapLayout
      map={<FishingMap />}
      overlay={
        <>
          <FloatingPanel anchor="top-left" className="fk-floating--bare"><LocationSearch /></FloatingPanel>
          <FloatingPanel anchor="top-right" className="fk-floating--bare">
            <MapToolbar onLayers={() => setShowLayers((v) => !v)} />
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
            <div className="fk-maphint">Tap the map to log a catch there</div>
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
