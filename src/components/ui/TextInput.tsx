import { useId, type InputHTMLAttributes } from "react";
import { cx } from "@/utils/cx";
import "./ui.css";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  /** Hide the visible label but keep it for screen readers. */
  hideLabel?: boolean;
}

export function TextInput({ label, hideLabel, id, className, ...rest }: TextInputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <div className={cx("fk-field", className)}>
      <label htmlFor={inputId} className={cx("fk-label", hideLabel && "sr-only")}>{label}</label>
      <input id={inputId} className="fk-input" {...rest} />
    </div>
  );
}
