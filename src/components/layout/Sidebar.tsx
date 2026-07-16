import { NavLink } from "react-router-dom";
import { navigationItems } from "@/app/navigation";
import { isFeatureEnabled } from "@/app/featureFlags";
import { cx } from "@/utils/cx";
import "./layout.css";

/** Desktop navigation, generated from the shared navigation config. */
export function Sidebar() {
  return (
    <nav className="fk-sidebar" aria-label="Primary">
      {navigationItems
        .filter((item) => !item.feature || isFeatureEnabled(item.feature))
        .map((item) => (
          <NavLink
            key={item.id}
            to={item.route}
            className={({ isActive }) => cx("fk-navitem", item.placeholder && "fk-navitem--placeholder", isActive && "is-active")}
          >
            {item.label}
          </NavLink>
        ))}
    </nav>
  );
}
