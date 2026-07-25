import { PageContainer } from "@/components/layout";
import { SectionHeader } from "@/components/ui";
import { WeatherPanel } from "@/features/weather/components/WeatherPanel";
import { TidePanel } from "./components/TidePanel";
import { RecommendationPanel } from "@/features/recommendations/components/RecommendationPanel";
import { appConfig } from "@/app/config";
import "./conditions.css";

/**
 * Today's conditions hub: real weather (Open-Meteo), real tide (NOAA CO-OPS), and
 * the rules-based "what to target" recommendation that reads both.
 */
export function ConditionsPage() {
  const { lat, lng } = appConfig.map.defaultCenter;
  return (
    <PageContainer>
      <div className="fk-conditions">
        <SectionHeader title="Conditions" />
        <p className="fk-conditions__note">Live conditions for the current demo region (Fort Lauderdale, FL).</p>
        <div className="fk-conditions__grid">
          <WeatherPanel lat={lat} lng={lng} />
          <TidePanel lat={lat} lng={lng} />
          <RecommendationPanel lat={lat} lng={lng} />
        </div>
      </div>
    </PageContainer>
  );
}
