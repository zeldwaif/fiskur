import { useState } from "react";
import { MapLayout, FloatingPanel } from "@/components/layout";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { FishingMap } from "./components/FishingMap";
import { MapToolbar } from "./components/MapToolbar";
import { LocationSearch } from "./components/LocationSearch";
import { LayerSelector } from "./components/LayerSelector";

/** The main map screen. Composes modular pieces; each piece owns its own logic. */
export function MapScreen() {
  const [showLayers, setShowLayers] = useState(false);
  const isMobile = useIsMobile();
  return (
    <MapLayout
      map={<FishingMap />}
      overlay={
        <>
          <FloatingPanel anchor="top-left"><LocationSearch /></FloatingPanel>
          <FloatingPanel anchor="top-right"><MapToolbar onLayers={() => setShowLayers((v) => !v)} /></FloatingPanel>
          {showLayers && (
            <FloatingPanel anchor={isMobile ? "bottom-left" : "bottom-right"}>
              <LayerSelector />
            </FloatingPanel>
          )}
        </>
      }
    />
  );
}
