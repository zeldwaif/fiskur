import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "@/utils/cx";
import "./ui.css";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Required — icon-only controls must be labelled for screen readers. */
  label: string;
  children: ReactNode;
}

export function IconButton({ label, className, children, ...rest }: IconButtonProps) {
  return (
    <button className={cx("fk-iconbtn", className)} aria-label={label} title={label} {...rest}>
      {children}
    </button>
  );
}
