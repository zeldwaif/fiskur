import { useState, type FormEvent } from "react";
import { Panel, SectionHeader, Button, TextInput, IconButton } from "@/components/ui";
import { EmptyState } from "@/components/feedback";
import { useAppStore } from "@/store/appStore";

/**
 * Friends list and the add-friend flow.
 *
 * Honesty note that must survive future edits: there is no server, so these are contacts
 * the user keeps locally, not real accounts that were looked up or notified. The panel
 * says so on screen. Faking a social graph — showing invented friends or a fake "request
 * sent" confirmation — would be the one thing in this app that actively lies to the user.
 */
export function FriendsPanel() {
  const { friends, addFriend, removeFriend } = useAppStore();
  const [adding, setAdding] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [handle, setHandle] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit(e: FormEvent) {
    e.preventDefault();
    const cleanHandle = handle.trim().replace(/^@/, "");
    if (!displayName.trim()) return setError("Enter their name.");
    if (!cleanHandle) return setError("Enter their handle.");
    if (friends.some((f) => f.handle.toLowerCase() === cleanHandle.toLowerCase())) {
      return setError("That handle is already in your list.");
    }
    addFriend({ displayName: displayName.trim(), handle: cleanHandle });
    setDisplayName("");
    setHandle("");
    setError(null);
    setAdding(false);
  }

  return (
    <Panel>
      <SectionHeader
        title={`Friends (${friends.length})`}
        action={
          <IconButton label={adding ? "Cancel" : "Add friend"} onClick={() => { setAdding((v) => !v); setError(null); }}>
            {adding ? "×" : "+"}
          </IconButton>
        }
      />
      <p className="fk-profile__note">
        Stored on this device only — Fiskur has no accounts yet, so nobody is notified and
        nothing is shared. This is the groundwork for real following once accounts land.
      </p>

      {adding && (
        <form className="fk-friendform" onSubmit={submit} noValidate>
          <TextInput label="Name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Daniel Zhang" />
          <TextInput label="Handle" value={handle} onChange={(e) => setHandle(e.target.value)} placeholder="danielz" />
          {error && <p className="fk-profilehead__error" role="alert">{error}</p>}
          <Button type="submit" fullWidth>Add to list</Button>
        </form>
      )}

      {friends.length === 0 && !adding ? (
        <EmptyState title="No friends yet" message="Add the people you fish with to keep them in one place." />
      ) : (
        <ul className="fk-friendlist">
          {friends.map((f) => (
            <li key={f.id} className="fk-friendrow">
              <span className="fk-avatar fk-avatar--sm" aria-hidden="true">
                <span className="fk-avatar__initial">{f.displayName.charAt(0).toUpperCase()}</span>
              </span>
              <span className="fk-friendrow__main">
                <span className="fk-friendrow__name">{f.displayName}</span>
                <span className="fk-friendrow__handle">@{f.handle}</span>
              </span>
              <IconButton label={`Remove ${f.displayName}`} onClick={() => removeFriend(f.id)}>×</IconButton>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
