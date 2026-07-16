import type { ReactNode } from "react";
import "./layout.css";
export function PageContainer({ children }: { children: ReactNode }) {
  return <div className="fk-page">{children}</div>;
}
