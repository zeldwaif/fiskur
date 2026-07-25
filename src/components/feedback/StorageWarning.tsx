import { useAppStore } from "@/store/appStore";
import "./states.css";

const MESSAGES: Record<string, string> = {
  quota:
    "Device storage is full, so your most recent change was not saved. Photos take up the most room — delete a few older catch photos, then re-enter this one.",
  unavailable:
    "This browser is blocking local storage (private browsing can do this), so changes will be lost when you close the tab.",
};

/**
 * Global banner shown when a write to durable storage failed.
 *
 * This exists because the alternative — the previous behaviour — was to swallow the error
 * and leave a catch visible on screen that would silently vanish on refresh. For a logbook
 * app, quietly losing the log is the worst possible outcome, so a failed save has to be
 * loud even though it's rare.
 */
export function StorageWarning() {
  const { storageError, dismissStorageError } = useAppStore();
  if (!storageError) return null;

  return (
    <div className="fk-storagewarn" role="alert">
      <span className="fk-storagewarn__text">
        <strong>Not saved.</strong> {MESSAGES[storageError] ?? MESSAGES.unavailable}
      </span>
      <button type="button" className="fk-storagewarn__close" onClick={dismissStorageError} aria-label="Dismiss">
        ×
      </button>
    </div>
  );
}
