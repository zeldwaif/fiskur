import type { ReactNode } from "react";
import "./layout.css";

/** Positions a full-bleed map with a non-blocking overlay layer for controls/panels. */
export function MapLayout({ map, overlay }: { map: ReactNode; overlay?: ReactNode }) {
  return (
    <div className="fk-maplayout">
      <div className="fk-maplayout__map">{map}</div>
      {overlay && <div className="fk-maplayout__overlay">{overlay}</div>}
    </div>
  );
}
