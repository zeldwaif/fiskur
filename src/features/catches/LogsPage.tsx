import { useRef } from "react";
import { PageContainer } from "@/components/layout";
import { Panel, SectionHeader } from "@/components/ui";
import { CatchLogForm } from "./components/CatchLogForm";
import { CatchList } from "./components/CatchList";
import { useCatchLog } from "./hooks/useCatchLog";
import "./catches.css";

export function LogsPage() {
  const { catches } = useCatchLog();
  const formRef = useRef<HTMLDivElement>(null);

  return (
    <PageContainer>
      <div className="fk-catches">
        <SectionHeader title={`Fishing Logs${catches.length ? ` (${catches.length})` : ""}`} />
        <div className="fk-catches__grid">
          <Panel>
            <div ref={formRef}>
              <h3 className="fk-catches__subhead">Log a catch</h3>
              <CatchLogForm />
            </div>
          </Panel>
          <div className="fk-catches__list">
            <CatchList />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
