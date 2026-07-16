import { useRef } from "react";
import { useMap } from "../hooks/useMap";
import { MapLoadingState } from "./MapLoadingState";
import { MapErrorState } from "./MapErrorState";
import "./map.css";

/** Thin wrapper that mounts the provider-agnostic map into the DOM. */
export function FishingMap() {
  const ref = useRef<HTMLDivElement>(null);
  const { status, error } = useMap(ref);
  return (
    <div className="fk-fishingmap">
      <div className="fk-fishingmap__canvas" ref={ref} role="application" aria-label="Fishing map" />
      {status === "loading" && <MapLoadingState />}
      {status === "error" && <MapErrorState message={error ?? undefined} />}
    </div>
  );
}
