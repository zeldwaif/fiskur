import { PageContainer } from "@/components/layout";
import { Panel, SectionHeader, DataRow, Badge } from "@/components/ui";
import { themes } from "@/theme/themes";
import { featureFlags } from "@/app/featureFlags";
import { appConfig } from "@/app/config";

/** Real (non-placeholder) page: surfaces the theme registry and feature flags for developers. */
export function SettingsPage() {
  return (
    <PageContainer>
      <Panel>
        <SectionHeader title="Application" />
        <DataRow label="Name" value={appConfig.appName} />
        <DataRow label="Credit" value={appConfig.creatorCredit} />
        <DataRow label="Active theme" value={appConfig.theme.default} />
      </Panel>
      <div style={{ height: "var(--spacing-md)" }} />
      <Panel>
        <SectionHeader title="Themes" />
        {themes.map((t) => (
          <DataRow key={t.id} label={t.label} value={t.available ? <Badge variant="primary">Available</Badge> : <Badge>Planned</Badge>} />
        ))}
      </Panel>
      <div style={{ height: "var(--spacing-md)" }} />
      <Panel>
        <SectionHeader title="Feature Flags" />
        {Object.entries(featureFlags).map(([k, v]) => (
          <DataRow key={k} label={k} value={v ? <Badge variant="primary">On</Badge> : <Badge>Off</Badge>} />
        ))}
      </Panel>
    </PageContainer>
  );
}
