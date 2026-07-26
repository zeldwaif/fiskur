import { NavLink } from "react-router-dom";
import { navigationItems } from "@/app/navigation";
import { isFeatureEnabled } from "@/app/featureFlags";
import "./layout.css";

/** Mobile navigation — reads the SAME config as the desktop Sidebar. */
export function MobileNavigation() {
  const enabled = navigationItems.filter((item) => !item.feature || isFeatureEnabled(item.feature));
  // Prefer the explicitly-flagged primary items; fall back to the first few if none are set.
  const primary = enabled.filter((item) => item.mobilePrimary);
  const items = (primary.length > 0 ? primary : enabled).slice(0, 5);
  return (
    <nav className="fk-mobilenav" aria-label="Primary">
      {items.map((item) => (
        <NavLink key={item.id} to={item.route} className="fk-mobilenav__item">
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
