import type { ReactNode } from "react";
import "./ui.css";

export function SectionHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="fk-sectionheader">
      <h2 className="fk-sectionheader__title">{title}</h2>
      {action}
    </div>
  );
}
