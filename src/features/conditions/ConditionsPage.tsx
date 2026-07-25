import { PageContainer } from "@/components/layout";
import { SectionHeader } from "@/components/ui";
import { WeatherPanel } from "@/features/weather/components/WeatherPanel";
import { DaylightPanel } from "./components/DaylightPanel";
import { RecommendationPanel } from "@/features/recommendations/components/RecommendationPanel";
import { appConfig } from "@/app/config";
import "./conditions.css";

/**
 * Today's conditions hub: real weather and real sunrise/sunset (both Open-Meteo), and
 * the rules-based "what to target" recommendation that reads both.
 *
 * There is deliberately no tide panel. Lake Ontario's astronomical tide is a couple of
 * centimetres and is swamped by wind-driven seiche, so a tide readout here would be a
 * number with no fishing meaning. Light and season drive this fishery instead.
 */
export function ConditionsPage() {
  const { lat, lng } = appConfig.map.defaultCenter;
  return (
    <PageContainer>
      <div className="fk-conditions">
        <SectionHeader title="Conditions" />
        <p className="fk-conditions__note">Live conditions for the current demo region (Toronto, ON — Lake Ontario).</p>
        <div className="fk-conditions__grid">
          <WeatherPanel lat={lat} lng={lng} />
          <DaylightPanel lat={lat} lng={lng} />
          <RecommendationPanel lat={lat} lng={lng} />
        </div>
      </div>
    </PageContainer>
  );
}
