import { createContext, useContext, useState, type ReactNode } from "react";
import type { MapProvider } from "../types/map.types";

type Status = "loading" | "ready" | "error";

interface MapContextValue {
  provider: MapProvider | null;
  status: Status;
  error: string | null;
  setProvider: (p: MapProvider | null) => void;
  setStatus: (s: Status) => void;
  setError: (e: string | null) => void;
}

const MapContext = createContext<MapContextValue | null>(null);

/**
 * Publishes the single live MapProvider instance to every descendant.
 * FishingMap creates and initializes the provider; LocationSearch, MapToolbar,
 * and LayerSelector consume it via useMapContext() to drive the same map.
 */
export function MapContextProvider({ children }: { children: ReactNode }) {
  const [provider, setProvider] = useState<MapProvider | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<string | null>(null);
  return (
    <MapContext.Provider value={{ provider, status, error, setProvider, setStatus, setError }}>
      {children}
    </MapContext.Provider>
  );
}

export function useMapContext(): MapContextValue {
  const ctx = useContext(MapContext);
  if (!ctx) throw new Error("useMapContext must be used within MapContextProvider");
  return ctx;
}
