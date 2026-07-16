import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "@/utils/cx";
import "./ui.css";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "success";
export type ButtonSize = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  children: ReactNode;
}

/** Base button. Variants exist structurally even where they look alike in the B/W theme. */
export function Button({ variant = "primary", size = "md", fullWidth, className, children, ...rest }: ButtonProps) {
  return (
    <button
      className={cx("fk-btn", `fk-btn--${variant}`, `fk-btn--${size}`, fullWidth && "fk-btn--block", className)}
      {...rest}
    >
      {children}
    </button>
  );
}
