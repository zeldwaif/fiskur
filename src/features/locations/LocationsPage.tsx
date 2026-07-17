import { useRef } from "react";
import { PageContainer } from "@/components/layout";
import { Panel, SectionHeader } from "@/components/ui";
import { SavedLocationForm } from "./components/SavedLocationForm";
import { SavedLocationList } from "./components/SavedLocationList";
import { useSavedLocations } from "./hooks/useSavedLocations";
import "./locations.css";

export function LocationsPage() {
  const { savedLocations } = useSavedLocations();
  const formRef = useRef<HTMLDivElement>(null);

  return (
    <PageContainer>
      <div className="fk-locations">
        <SectionHeader title={`Saved Locations${savedLocations.length ? ` (${savedLocations.length})` : ""}`} />
        <div className="fk-locations__grid">
          <Panel className="fk-locations__form" >
            <div ref={formRef}>
              <h3 className="fk-locations__subhead">Add a spot</h3>
              <SavedLocationForm />
            </div>
          </Panel>
          <div className="fk-locations__list">
            <SavedLocationList onAddFirst={() => formRef.current?.scrollIntoView({ behavior: "smooth" })} />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
