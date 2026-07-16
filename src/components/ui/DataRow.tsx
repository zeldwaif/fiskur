import type { ReactNode } from "react";
import "./ui.css";

export function DataRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="fk-datarow">
      <span className="fk-datarow__label">{label}</span>
      <span className="fk-datarow__value">{value}</span>
    </div>
  );
}
