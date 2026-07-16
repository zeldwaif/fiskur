import type { CSSProperties, ReactNode } from "react";
import { cx } from "@/utils/cx";
import "./layout.css";

type Anchor = "top-left" | "top-right" | "bottom-left" | "bottom-right";
const anchors: Record<Anchor, CSSProperties> = {
  "top-left": { top: "var(--spacing-md)", left: "var(--spacing-md)" },
  "top-right": { top: "var(--spacing-md)", right: "var(--spacing-md)" },
  "bottom-left": { bottom: "var(--spacing-md)", left: "var(--spacing-md)" },
  "bottom-right": { bottom: "var(--spacing-md)", right: "var(--spacing-md)" },
};

export function FloatingPanel({ anchor = "top-left", children, className }: { anchor?: Anchor; children: ReactNode; className?: string }) {
  return <div className={cx("fk-floating", className)} style={anchors[anchor]}>{children}</div>;
}
