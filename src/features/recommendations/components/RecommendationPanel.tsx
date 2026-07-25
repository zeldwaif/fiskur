import { Panel, SectionHeader, Badge, Divider } from "@/components/ui";
import { LoadingState, ErrorState, EmptyState } from "@/components/feedback";
import { useRecommendations } from "../hooks/useRecommendations";
import { MATCH_LABEL } from "../logic/recommend";
import "./recommendations.css";

export function RecommendationPanel({ lat, lng }: { lat: number; lng: number }) {
  const { status, recommendations } = useRecommendations(lat, lng);

  if (status === "loading") return <Panel><LoadingState /></Panel>;
  if (status === "error") {
    return <Panel><ErrorState message="Can't build a recommendation right now — check your connection and try again." /></Panel>;
  }
  if (recommendations.length === 0) {
    return (
      <Panel>
        <SectionHeader title="What to target right now" />
        <EmptyState title="No strong match" message="Conditions don't clearly favor any species in the reference list right now." />
      </Panel>
    );
  }

  return (
    <Panel>
      <SectionHeader title="What to target right now" />
      <p className="fk-reclist__method">
        Ranked by a transparent rule set over today's light, wind, temperature and season —
        not a trained model. Every reason below is the rule that fired.
      </p>
      <ul className="fk-reclist">
        {recommendations.map((r, i) => (
          <li key={r.species.id} className="fk-recitem">
            <div className="fk-recitem__head">
              <span className="fk-recitem__rank">{i + 1}</span>
              <span className="fk-recitem__name">{r.species.commonName}</span>
              <Badge variant={r.strength === "strong" ? "primary" : "muted"}>{MATCH_LABEL[r.strength]}</Badge>
            </div>
            {r.reasons.length > 0 ? (
              <ul className="fk-recitem__reasons">
                {r.reasons.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
            ) : (
              <p className="fk-recitem__reasons fk-recitem__reasons--none">No standout condition match — a reasonable general option.</p>
            )}
            {i < recommendations.length - 1 && <Divider />}
          </li>
        ))}
      </ul>
    </Panel>
  );
}
