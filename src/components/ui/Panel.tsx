import type { ReactNode } from "react";
import { cx } from "@/utils/cx";
import "./ui.css";

interface PanelProps {
  children: ReactNode;
  variant?: "surface" | "muted";
  className?: string;
  as?: "div" | "section" | "aside";
}

export function Panel({ children, variant = "surface", className, as: Tag = "div" }: PanelProps) {
  return <Tag className={cx("fk-panel", `fk-panel--${variant}`, className)}>{children}</Tag>;
}
