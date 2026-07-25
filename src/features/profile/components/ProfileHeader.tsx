import { useRef, useState } from "react";
import { Button, TextInput, Panel } from "@/components/ui";
import { useAppStore } from "@/store/appStore";
import { readAndDownscaleImage } from "@/features/catches/photo";

/** Avatar + identity, editable in place. Reuses the catch-photo downscaler for the avatar. */
export function ProfileHeader() {
  const { profile, updateProfile } = useAppStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [handle, setHandle] = useState(profile.handle);
  const [bio, setBio] = useState(profile.bio ?? "");
  const [homeWater, setHomeWater] = useState(profile.homeWater);
  const [error, setError] = useState<string | null>(null);

  async function handleAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) return setError("Please choose an image file.");
    try {
      updateProfile({ avatarDataUrl: await readAndDownscaleImage(file) });
      setError(null);
    } catch {
      setError("Couldn't process that image.");
    }
  }

  function save() {
    const cleanHandle = handle.trim().replace(/^@/, "");
    if (!displayName.trim()) return setError("Give yourself a display name.");
    if (!cleanHandle) return setError("Pick a handle.");
    updateProfile({
      displayName: displayName.trim(),
      handle: cleanHandle,
      bio: bio.trim() || undefined,
      homeWater: homeWater.trim(),
    });
    setError(null);
    setEditing(false);
  }

  const joined = new Date(profile.joinedAt).toLocaleDateString(undefined, { month: "long", year: "numeric" });

  return (
    <Panel className="fk-profilehead">
      <div className="fk-profilehead__top">
        <button
          type="button"
          className="fk-avatar"
          onClick={() => fileRef.current?.click()}
          aria-label="Change profile photo"
        >
          {profile.avatarDataUrl ? (
            <img src={profile.avatarDataUrl} alt="" className="fk-avatar__img" />
          ) : (
            <span className="fk-avatar__initial">{profile.displayName.charAt(0).toUpperCase()}</span>
          )}
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="fk-profilehead__file" onChange={handleAvatar} />

        <div className="fk-profilehead__id">
          <h2 className="fk-profilehead__name">{profile.displayName}</h2>
          <p className="fk-profilehead__handle">@{profile.handle}</p>
          <p className="fk-profilehead__meta">{profile.homeWater} · Joined {joined}</p>
          {profile.bio && <p className="fk-profilehead__bio">{profile.bio}</p>}
        </div>

        <Button variant="secondary" size="sm" onClick={() => setEditing((v) => !v)}>
          {editing ? "Cancel" : "Edit"}
        </Button>
      </div>

      {editing && (
        <div className="fk-profilehead__edit">
          <TextInput label="Display name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
          <TextInput label="Handle" value={handle} onChange={(e) => setHandle(e.target.value)} placeholder="angler" />
          <TextInput label="Home water" value={homeWater} onChange={(e) => setHomeWater(e.target.value)} />
          <TextInput label="Bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Mostly bass. Mostly released." />
          {error && <p className="fk-profilehead__error" role="alert">{error}</p>}
          <Button onClick={save} fullWidth>Save profile</Button>
        </div>
      )}
      {!editing && error && <p className="fk-profilehead__error" role="alert">{error}</p>}
    </Panel>
  );
}
