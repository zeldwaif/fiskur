import { cx } from "@/utils/cx";
import "./ui.css";

interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  id?: string;
}

export function Toggle({ checked, onChange, label, id }: ToggleProps) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={cx("fk-toggle", checked && "fk-toggle--on")}
      onClick={() => onChange(!checked)}
    >
      <span className="fk-toggle__knob" />
    </button>
  );
}
