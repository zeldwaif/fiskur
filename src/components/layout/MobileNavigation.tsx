import { NavLink } from "react-router-dom";
import { navigationItems } from "@/app/navigation";
import { isFeatureEnabled } from "@/app/featureFlags";
import "./layout.css";

/** Mobile navigation — reads the SAME config as the desktop Sidebar. */
export function MobileNavigation() {
  const items = navigationItems
    .filter((item) => !item.feature || isFeatureEnabled(item.feature))
    .slice(0, 5);
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
