import { useState, type ReactNode } from "react";
import "./layout.css";

/** Mobile bottom sheet with a simple two-state (peek / expanded) model. */
export function BottomSheet({ children, expandedByDefault = false }: { children: ReactNode; expandedByDefault?: boolean }) {
  const [expanded, setExpanded] = useState(expandedByDefault);
  return (
    <section className="fk-sheet" style={{ ["--sheet-y" as string]: expanded ? "8%" : undefined }} aria-label="Details">
      <button className="fk-sheet__grab" aria-label={expanded ? "Collapse panel" : "Expand panel"} onClick={() => setExpanded((v) => !v)} />
      <div className="fk-sheet__body">{children}</div>
    </section>
  );
}
