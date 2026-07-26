import { Panel, SectionHeader } from "@/components/ui";
import { useAppStore } from "@/store/appStore";
import { computeStats, speciesCollection } from "../logic/stats";

function StatCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="fk-stat">
      <span className="fk-stat__value">{value}</span>
      <span className="fk-stat__label">{label}</span>
    </div>
  );
}

/** Real stats derived from the catch log — no invented numbers. */
export function ProfileStats() {
  const { catches, savedLocations } = useAppStore();
  const stats = computeStats(catches);
  const collection = speciesCollection(catches);

  return (
    <>
      <Panel>
        <SectionHeader title="Stats" />
        <div className="fk-statgrid">
          <StatCell label="Catches" value={String(stats.totalCatches)} />
          <StatCell label="Species" value={`${stats.speciesLogged}/${stats.speciesTotal}`} />
          <StatCell label="Spots saved" value={String(savedLocations.length)} />
          <StatCell label="Verified" value={String(stats.verifiedCatches)} />
          <StatCell
            label="Released"
            value={stats.releaseRate == null ? "—" : `${stats.releaseRate}%`}
          />
        </div>
        <p className="fk-profile__note">
          "Verified" means a catch photo's own GPS and timestamp independently corroborated
          where and when you said you caught it.
        </p>
        {stats.biggest && (
          <p className="fk-profile__note">
            Personal best: {stats.biggest.speciesName} · {stats.biggest.weightKg} kg
          </p>
        )}
      </Panel>

      <Panel>
        <SectionHeader title={`Species collection (${stats.speciesLogged}/${stats.speciesTotal})`} />
        <p className="fk-profile__note">
          Every species in the Lake Ontario reference list. Log one to fill it in.
        </p>
        <ul className="fk-collection">
          {collection.map(({ species, caught }) => (
            <li key={species.id} className={caught ? "fk-collection__item fk-collection__item--caught" : "fk-collection__item"}>
              <span className="fk-collection__tick" aria-hidden="true">{caught ? "●" : "○"}</span>
              <span>{species.commonName}</span>
            </li>
          ))}
        </ul>
      </Panel>
    </>
  );
}
