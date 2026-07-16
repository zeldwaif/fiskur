import type { ReactNode } from "react";
import { cx } from "@/utils/cx";
import "./ui.css";

export function Badge({ children, variant = "muted" }: { children: ReactNode; variant?: "muted" | "primary" | "danger" | "success" }) {
  return <span className={cx("fk-badge", `fk-badge--${variant}`)}>{children}</span>;
}
