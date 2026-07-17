import { useState } from "react";
import { Button, IconButton } from "@/components/ui";
import { EmptyState } from "@/components/feedback";
import { useSavedLocations } from "../hooks/useSavedLocations";
import type { SavedLocation } from "../types";

function LocationRow({ location }: { location: SavedLocation }) {
  const { renameSavedLocation, removeSavedLocation } = useSavedLocations();
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(location.name);

  function commit() {
    const next = draftName.trim();
    if (next && next !== location.name) renameSavedLocation(location.id, next);
    setEditing(false);
  }

  return (
    <li className="fk-locrow">
      <div className="fk-locrow__main">
        {editing ? (
          <input
            className="fk-input"
            value={draftName}
            autoFocus
            onChange={(e) => setDraftName(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === "Enter") commit();
              if (e.key === "Escape") { setDraftName(location.name); setEditing(false); }
            }}
          />
        ) : (
          <button className="fk-locrow__name" onClick={() => setEditing(true)} title="Rename">
            {location.name}
          </button>
        )}
        <span className="fk-locrow__coords">
          {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
        </span>
        {location.notes && <span className="fk-locrow__notes">{location.notes}</span>}
      </div>
      <div className="fk-locrow__actions">
        <IconButton label="Delete location" onClick={() => removeSavedLocation(location.id)}>×</IconButton>
      </div>
    </li>
  );
}

export function SavedLocationList({ onAddFirst }: { onAddFirst?: () => void }) {
  const { savedLocations } = useSavedLocations();

  if (savedLocations.length === 0) {
    return (
      <EmptyState
        title="No saved spots yet"
        message="Save your first fishing location to see it here and on the map."
        action={onAddFirst ? <Button onClick={onAddFirst}>Add a spot</Button> : undefined}
      />
    );
  }

  return (
    <ul className="fk-loclist">
      {savedLocations.map((loc) => (
        <LocationRow key={loc.id} location={loc} />
      ))}
    </ul>
  );
}
