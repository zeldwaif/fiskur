import "./states.css";
export function LoadingState({ message = "Loading…" }: { message?: string }) {
  return (
    <div className="fk-state" role="status" aria-live="polite">
      <div className="fk-spinner" aria-hidden />
      <p className="fk-state__msg">{message}</p>
    </div>
  );
}
