import { useMemo, useState } from "react";
import { PageContainer } from "@/components/layout";
import { Panel, SectionHeader, Badge, SearchInput } from "@/components/ui";
import { species, type WaterType } from "@/features/catches/data/species";
import "./species.css";

const waterLabels: Record<WaterType, string> = {
  saltwater: "Saltwater",
  freshwater: "Freshwater",
  brackish: "Brackish",
};

export function SpeciesPage() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return species;
    return species.filter(
      (s) => s.commonName.toLowerCase().includes(q) || s.scientificName.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <PageContainer>
      <div className="fk-species">
        <SectionHeader title="Species" />
        <p className="fk-species__note">
          Reference list for the current demo region (Toronto — Lake Ontario). Habitat notes are
          general guidance — always check current Ontario size, season and sanctuary regulations
          before keeping a fish.
        </p>
        <SearchInput value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search species…" />
        <div className="fk-species__grid">
          {filtered.map((s) => (
            <Panel key={s.id} className="fk-species__card">
              <div className="fk-species__cardhead">
                <h3 className="fk-species__name">{s.commonName}</h3>
                <Badge>{waterLabels[s.waterType]}</Badge>
              </div>
              <p className="fk-species__sci">{s.scientificName}</p>
              <p className="fk-species__habitat">{s.habitat}</p>
            </Panel>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
