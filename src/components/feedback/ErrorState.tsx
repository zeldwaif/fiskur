import type { ReactNode } from "react";
import "./states.css";
export function ErrorState({ title = "Something went wrong", message, action }: { title?: string; message?: string; action?: ReactNode }) {
  return (
    <div className="fk-state" role="alert">
      <h3 className="fk-state__title">{title}</h3>
      {message && <p className="fk-state__msg">{message}</p>}
      {action}
    </div>
  );
}
