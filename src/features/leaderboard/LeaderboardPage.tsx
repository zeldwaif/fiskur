import { useState } from "react";
import { PageContainer } from "@/components/layout";
import { SectionHeader, Panel, Badge } from "@/components/ui";
import { useLeaderboard } from "./hooks/useLeaderboard";
import { CATEGORIES } from "./logic/leaderboard";
import type { CategoryId } from "./types";
import "./leaderboard.css";

export function LeaderboardPage() {
  const [categoryId, setCategoryId] = useState<CategoryId>("diversity");
  const { entries, selfStats } = useLeaderboard(categoryId);
  const category = CATEGORIES.find((c) => c.id === categoryId)!;

  let rank = 0;

  return (
    <PageContainer>
      <div className="fk-leaderboard">
        <SectionHeader title="Leaderboard" />
        <p className="fk-leaderboard__intro">
          <strong>Verified catches only.</strong> A catch counts here when the photo's own GPS
          and timestamp back up where and when you said you caught it. Unverified catches
          aren't assumed false — they're just not evidence, and a ranking built on
          unverifiable claims is worth nothing.
        </p>

        <div className="fk-leaderboard__tabs" role="tablist">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              role="tab"
              type="button"
              aria-selected={c.id === categoryId}
              className={c.id === categoryId ? "fk-lbtab fk-lbtab--active" : "fk-lbtab"}
              onClick={() => setCategoryId(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>

        <Panel>
          <p className="fk-leaderboard__blurb">{category.blurb}</p>

          <ol className="fk-lblist">
            {entries.map((e) => {
              if (e.qualified) rank += 1;
              return (
                <li
                  key={e.angler.id}
                  className={`fk-lbrow${e.angler.isSelf ? " fk-lbrow--self" : ""}${e.qualified ? "" : " fk-lbrow--unqualified"}`}
                >
                  <span className="fk-lbrow__rank">{e.qualified ? rank : "—"}</span>
                  <span className="fk-lbrow__who">
                    <span className="fk-lbrow__name">
                      {e.angler.displayName}
                      {e.angler.isSelf && <Badge variant="primary">You</Badge>}
                      {e.angler.isSample && <span className="fk-lbrow__sample">sample data</span>}
                    </span>
                    <span className="fk-lbrow__meta">
                      @{e.angler.handle} · {e.verifiedCount} verified
                      {e.note ? ` · ${e.note}` : ""}
                    </span>
                  </span>
                  <span className="fk-lbrow__value">{e.qualified ? e.display : "—"}</span>
                </li>
              );
            })}
          </ol>
        </Panel>

        <Panel>
          <SectionHeader title="Why isn't my catch here?" />
          <p className="fk-leaderboard__blurb">
            You've logged {selfStats.total} {selfStats.total === 1 ? "catch" : "catches"};{" "}
            {selfStats.verified} verified and {selfStats.excluded} not counted.
            {selfStats.excluded > 0 && " A catch is verified when you attach a photo that still carries its EXIF GPS and timestamp — many phones and messaging apps strip that out, which is normal and not a mark against you."}
          </p>
          <p className="fk-leaderboard__blurb">
            Everyone except you is sample data, labelled on every row. There's no backend
            yet, so real competitors would be dishonest to show.
          </p>
        </Panel>
      </div>
    </PageContainer>
  );
}
