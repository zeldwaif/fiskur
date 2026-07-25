import { useState } from "react";
import { Badge, IconButton } from "@/components/ui";
import { EmptyState } from "@/components/feedback";
import { useCatchLog } from "../hooks/useCatchLog";
import { PhotoLightbox } from "./PhotoLightbox";
import type { CatchLog } from "../types";

function formatWhen(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

function measures(c: CatchLog): string {
  const parts: string[] = [];
  if (typeof c.lengthCm === "number") parts.push(`${c.lengthCm} cm`);
  if (typeof c.weightKg === "number") parts.push(`${c.weightKg} kg`);
  return parts.join(" · ");
}

function CatchRow({ entry, onOpenPhoto }: { entry: CatchLog; onOpenPhoto: (entry: CatchLog) => void }) {
  const { removeCatch } = useCatchLog();
  const m = measures(entry);
  return (
    <li className="fk-catchrow">
      {entry.photoDataUrl && (
        <button
          type="button"
          className="fk-catchrow__thumbbtn"
          onClick={() => onOpenPhoto(entry)}
          aria-label={`View ${entry.speciesName} photo full size`}
        >
          <img className="fk-catchrow__thumb" src={entry.photoDataUrl} alt="" />
        </button>
      )}
      <div className="fk-catchrow__main">
        <div className="fk-catchrow__top">
          <span className="fk-catchrow__species">{entry.speciesName}</span>
          <Badge>{entry.released ? "Released" : "Kept"}</Badge>
        </div>
        <span className="fk-catchrow__meta">
          {formatWhen(entry.caughtAt)}
          {m && ` · ${m}`}
          {entry.locationName && ` · ${entry.locationName}`}
        </span>
        {entry.notes && <span className="fk-catchrow__notes">{entry.notes}</span>}
      </div>
      <IconButton label="Delete catch" onClick={() => removeCatch(entry.id)}>×</IconButton>
    </li>
  );
}

export function CatchList() {
  const { catches } = useCatchLog();
  const [viewing, setViewing] = useState<CatchLog | null>(null);

  if (catches.length === 0) {
    return <EmptyState title="No catches logged yet" message="Log your first catch and it will appear here, newest first." />;
  }
  return (
    <>
      <ul className="fk-catchlist">
        {catches.map((c) => (
          <CatchRow key={c.id} entry={c} onOpenPhoto={setViewing} />
        ))}
      </ul>
      {viewing?.photoDataUrl && (
        <PhotoLightbox
          src={viewing.photoDataUrl}
          alt={`${viewing.speciesName} catch photo`}
          onClose={() => setViewing(null)}
        />
      )}
    </>
  );
}
