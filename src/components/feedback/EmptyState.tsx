import type { ReactNode } from "react";
import "./states.css";
export function EmptyState({ title = "Nothing here yet", message, action }: { title?: string; message?: string; action?: ReactNode }) {
  return (
    <div className="fk-state">
      <h3 className="fk-state__title">{title}</h3>
      {message && <p className="fk-state__msg">{message}</p>}
      {action}
    </div>
  );
}
