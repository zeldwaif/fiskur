import { useState, type FormEvent } from "react";
import { Button, TextInput, Toggle } from "@/components/ui";
import { useCatchLog } from "../hooks/useCatchLog";
import { species, getSpecies, OTHER_SPECIES_ID } from "../data/species";
import { useSavedLocations } from "@/features/locations/hooks/useSavedLocations";

/** Current local datetime as a value for <input type="datetime-local">. */
function nowLocal(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function CatchLogForm({ onLogged }: { onLogged?: () => void }) {
  const { addCatch } = useCatchLog();
  const { savedLocations } = useSavedLocations();

  const [speciesId, setSpeciesId] = useState(species[0]?.id ?? OTHER_SPECIES_ID);
  const [otherName, setOtherName] = useState("");
  const [length, setLength] = useState("");
  const [weight, setWeight] = useState("");
  const [caughtAt, setCaughtAt] = useState(nowLocal());
  const [locationId, setLocationId] = useState("");
  const [notes, setNotes] = useState("");
  const [released, setReleased] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const isOther = speciesId === OTHER_SPECIES_ID;
    const speciesName = isOther ? otherName.trim() : getSpecies(speciesId)?.commonName ?? "";
    if (!speciesName) return setError("Choose a species (or name it under Other).");
    if (!caughtAt) return setError("When did you catch it?");

    const lengthNum = length ? Number(length) : undefined;
    const weightNum = weight ? Number(weight) : undefined;
    if (length && (!Number.isFinite(lengthNum) || (lengthNum ?? 0) <= 0)) return setError("Length must be a positive number.");
    if (weight && (!Number.isFinite(weightNum) || (weightNum ?? 0) <= 0)) return setError("Weight must be a positive number.");

    const loc = savedLocations.find((l) => l.id === locationId);

    addCatch({
      speciesId: isOther ? OTHER_SPECIES_ID : speciesId,
      speciesName,
      lengthCm: lengthNum,
      weightKg: weightNum,
      caughtAt: new Date(caughtAt).toISOString(),
      lat: loc?.lat,
      lng: loc?.lng,
      locationName: loc?.name,
      notes: notes.trim() || undefined,
      released,
    });

    setLength("");
    setWeight("");
    setNotes("");
    setOtherName("");
    setError(null);
    onLogged?.();
  }

  return (
    <form className="fk-catchform" onSubmit={handleSubmit} noValidate>
      <div className="fk-field">
        <label className="fk-label" htmlFor="catch-species">Species</label>
        <select id="catch-species" className="fk-input" value={speciesId} onChange={(e) => setSpeciesId(e.target.value)}>
          {species.map((s) => (
            <option key={s.id} value={s.id}>{s.commonName}</option>
          ))}
          <option value={OTHER_SPECIES_ID}>Other…</option>
        </select>
      </div>

      {speciesId === OTHER_SPECIES_ID && (
        <TextInput label="Species name" value={otherName} onChange={(e) => setOtherName(e.target.value)} placeholder="What did you catch?" />
      )}

      <div className="fk-catchform__pair">
        <TextInput label="Length (cm)" value={length} onChange={(e) => setLength(e.target.value)} inputMode="decimal" placeholder="—" />
        <TextInput label="Weight (kg)" value={weight} onChange={(e) => setWeight(e.target.value)} inputMode="decimal" placeholder="—" />
      </div>

      <div className="fk-field">
        <label className="fk-label" htmlFor="catch-time">Date &amp; time</label>
        <input id="catch-time" type="datetime-local" className="fk-input" value={caughtAt} onChange={(e) => setCaughtAt(e.target.value)} />
      </div>

      <div className="fk-field">
        <label className="fk-label" htmlFor="catch-loc">Location</label>
        <select id="catch-loc" className="fk-input" value={locationId} onChange={(e) => setLocationId(e.target.value)}>
          <option value="">No saved spot</option>
          {savedLocations.map((l) => (
            <option key={l.id} value={l.id}>{l.name}</option>
          ))}
        </select>
      </div>

      <TextInput label="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Bait, tide, conditions…" />

      <div className="fk-catchform__toggle">
        <span className="fk-label">{released ? "Released" : "Kept"}</span>
        <Toggle checked={released} onChange={setReleased} label="Released" />
      </div>

      {error && <p className="fk-catchform__error" role="alert">{error}</p>}
      <Button type="submit" fullWidth>Log catch</Button>
    </form>
  );
}
