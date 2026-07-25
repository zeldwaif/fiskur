import { Panel, SectionHeader, Badge } from "@/components/ui";
import { EmptyState } from "@/components/feedback";
import { useAppStore } from "@/store/appStore";

function formatWhen(iso: string): string {
  return new Date(iso).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

/**
 * The user's own catches as a feed — the shape a social timeline would take, populated
 * with the only real data we have (your own log). When accounts land, this same component
 * renders friends' catches alongside your own.
 */
export function ActivityFeed() {
  const { catches, profile } = useAppStore();
  const recent = catches.slice(0, 8);

  return (
    <Panel>
      <SectionHeader title="Recent activity" />
      {recent.length === 0 ? (
        <EmptyState title="Nothing logged yet" message="Your catches will show up here as a feed." />
      ) : (
        <ul className="fk-feed">
          {recent.map((c) => (
            <li key={c.id} className="fk-feeditem">
              {c.photoDataUrl && <img className="fk-feeditem__photo" src={c.photoDataUrl} alt="" />}
              <div className="fk-feeditem__body">
                <p className="fk-feeditem__line">
                  <strong>@{profile.handle}</strong> landed a <strong>{c.speciesName}</strong>
                  {c.locationName ? ` at ${c.locationName}` : ""}
                </p>
                <p className="fk-feeditem__meta">
                  {formatWhen(c.caughtAt)}
                  {typeof c.lengthCm === "number" && ` · ${c.lengthCm} cm`}
                  {typeof c.weightKg === "number" && ` · ${c.weightKg} kg`}
                </p>
                {c.notes && <p className="fk-feeditem__notes">{c.notes}</p>}
              </div>
              <Badge>{c.released ? "Released" : "Kept"}</Badge>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
