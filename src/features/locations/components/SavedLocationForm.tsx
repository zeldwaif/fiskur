import { useState, type FormEvent } from "react";
import { Button, TextInput } from "@/components/ui";
import { useSavedLocations } from "../hooks/useSavedLocations";

/** Add a saved location by name + coordinates. Coordinates validate to real lat/lng ranges. */
export function SavedLocationForm({ onAdded }: { onAdded?: () => void }) {
  const { addSavedLocation } = useSavedLocations();
  const [name, setName] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const latNum = Number(lat);
    const lngNum = Number(lng);
    if (!name.trim()) return setError("Give the spot a name.");
    if (!Number.isFinite(latNum) || latNum < -90 || latNum > 90) return setError("Latitude must be between -90 and 90.");
    if (!Number.isFinite(lngNum) || lngNum < -180 || lngNum > 180) return setError("Longitude must be between -180 and 180.");

    addSavedLocation({ name: name.trim(), lat: latNum, lng: lngNum, notes: notes.trim() || undefined });
    setName("");
    setLat("");
    setLng("");
    setNotes("");
    setError(null);
    onAdded?.();
  }

  return (
    <form className="fk-locform" onSubmit={handleSubmit} noValidate>
      <TextInput label="Spot name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Humber Bay pier" />
      <div className="fk-locform__coords">
        <TextInput label="Latitude" value={lat} onChange={(e) => setLat(e.target.value)} inputMode="decimal" placeholder="43.6350" />
        <TextInput label="Longitude" value={lng} onChange={(e) => setLng(e.target.value)} inputMode="decimal" placeholder="-79.3750" />
      </div>
      <TextInput label="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Best at first light" />
      {error && <p className="fk-locform__error" role="alert">{error}</p>}
      <Button type="submit" fullWidth>Save location</Button>
    </form>
  );
}
