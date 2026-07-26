import { useMemo, useRef, useState, type FormEvent } from "react";
import { Button, TextInput, Toggle } from "@/components/ui";
import { useCatchLog } from "../hooks/useCatchLog";
import { species, getSpecies, OTHER_SPECIES_ID } from "../data/species";
import { useSavedLocations } from "@/features/locations/hooks/useSavedLocations";
import { readAndDownscaleImage } from "../photo";
import { readExif, type ExifData } from "../exif";
import { verifyCatch, verificationReasons, VERIFICATION_LABEL } from "../verification";

/** Current local datetime as a value for <input type="datetime-local">. */
function nowLocal(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

interface CatchLogFormProps {
  onLogged?: () => void;
  /**
   * When set, the catch is pinned to this exact point (tapped on the map) instead of
   * being attached to a previously-saved spot. The saved-spot picker is hidden, because
   * an explicit coordinate is strictly better information than a named spot.
   */
  presetPosition?: { lat: number; lng: number } | null;
  presetLabel?: string;
}

export function CatchLogForm({ onLogged, presetPosition, presetLabel }: CatchLogFormProps) {
  const { addCatch } = useCatchLog();
  const { savedLocations } = useSavedLocations();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [speciesId, setSpeciesId] = useState(species[0]?.id ?? OTHER_SPECIES_ID);
  const [otherName, setOtherName] = useState("");
  const [length, setLength] = useState("");
  const [weight, setWeight] = useState("");
  const [caughtAt, setCaughtAt] = useState(nowLocal());
  const [locationId, setLocationId] = useState("");
  const [notes, setNotes] = useState("");
  const [released, setReleased] = useState(true);
  const [photoDataUrl, setPhotoDataUrl] = useState<string | undefined>(undefined);
  const [photoExif, setPhotoExif] = useState<ExifData | null>(null);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // The position this catch will actually be saved with — a dropped map pin wins over a
  // saved spot, and verification has to check against whichever one is in play.
  const resolvedPosition = useMemo(() => {
    if (presetPosition) return presetPosition;
    const loc = savedLocations.find((l) => l.id === locationId);
    return loc ? { lat: loc.lat, lng: loc.lng } : null;
  }, [presetPosition, savedLocations, locationId]);

  // Recomputed live so the user sees the verdict before saving, not after.
  const verification = useMemo(() => {
    if (!photoExif) return null;
    return verifyCatch({
      exif: photoExif,
      position: resolvedPosition,
      caughtAt: new Date(caughtAt).toISOString(),
    });
  }, [photoExif, resolvedPosition, caughtAt]);

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file later
    if (!file) return;
    if (!file.type.startsWith("image/")) return setError("Please choose an image file.");
    setPhotoBusy(true);
    setError(null);
    try {
      // EXIF must be read from the ORIGINAL file: the canvas downscale below discards it.
      const [exif, dataUrl] = await Promise.all([readExif(file), readAndDownscaleImage(file)]);
      setPhotoExif(exif);
      setPhotoDataUrl(dataUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't process that photo.");
    } finally {
      setPhotoBusy(false);
    }
  }

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
    const position = presetPosition ?? (loc ? { lat: loc.lat, lng: loc.lng } : null);

    addCatch({
      speciesId: isOther ? OTHER_SPECIES_ID : speciesId,
      speciesName,
      lengthCm: lengthNum,
      weightKg: weightNum,
      caughtAt: new Date(caughtAt).toISOString(),
      lat: position?.lat,
      lng: position?.lng,
      locationName: presetPosition ? presetLabel : loc?.name,
      notes: notes.trim() || undefined,
      released,
      photoDataUrl,
      verification: verification ?? undefined,
    });

    setLength("");
    setWeight("");
    setNotes("");
    setOtherName("");
    setPhotoDataUrl(undefined);
    setPhotoExif(null);
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

      {presetPosition ? (
        <div className="fk-field">
          <span className="fk-label">Location</span>
          <p className="fk-catchform__pinned">
            Pinned to {presetPosition.lat.toFixed(4)}, {presetPosition.lng.toFixed(4)}
          </p>
        </div>
      ) : (
        <div className="fk-field">
          <label className="fk-label" htmlFor="catch-loc">Location</label>
          <select id="catch-loc" className="fk-input" value={locationId} onChange={(e) => setLocationId(e.target.value)}>
            <option value="">No saved spot</option>
            {savedLocations.map((l) => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>
        </div>
      )}

      <TextInput label="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Bait, depth, conditions…" />

      <div className="fk-field">
        <span className="fk-label">Photo (optional)</span>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="fk-catchform__fileinput"
          onChange={handlePhotoChange}
        />
        {photoDataUrl ? (
          <div className="fk-catchform__photopreview">
            <img src={photoDataUrl} alt="Catch preview" />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => { setPhotoDataUrl(undefined); setPhotoExif(null); }}
            >
              Remove photo
            </Button>
          </div>
        ) : (
          <Button type="button" variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()} disabled={photoBusy}>
            {photoBusy ? "Processing…" : "Add a photo"}
          </Button>
        )}
      </div>

      {verification && (
        <div className={`fk-verify fk-verify--${verification.level}`}>
          <span className="fk-verify__label">{VERIFICATION_LABEL[verification.level]}</span>
          <ul className="fk-verify__reasons">
            {verificationReasons(verification).map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="fk-catchform__toggle">
        <span className="fk-label">{released ? "Released" : "Kept"}</span>
        <Toggle checked={released} onChange={setReleased} label="Released" />
      </div>

      {error && <p className="fk-catchform__error" role="alert">{error}</p>}
      <Button type="submit" fullWidth>Log catch</Button>
    </form>
  );
}
