import type { ReactNode } from "react";
import { appConfig } from "@/app/config";
import "./layout.css";

export function AppHeader({ actions }: { actions?: ReactNode }) {
  return (
    <header className="fk-header">
      <span className="fk-header__brand">{appConfig.appName}</span>
      <span className="fk-header__spacer" />
      {actions}
    </header>
  );
}
