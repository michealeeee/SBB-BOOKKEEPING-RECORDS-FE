import { NavLink } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { userLabel } from "../../utils/entities";
import NAV_GROUPS from "./nav";

export default function Sidebar({ mobileOpen, onClose, onSignOut }) {
  const { user, business, membership } = useApp();
  const displayName = userLabel(user);
  const initials =
    displayName
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "BK";

  return (
    <aside
      id="app-sidebar"
      className={mobileOpen ? "app-sidebar open" : "app-sidebar"}
      aria-label="Books navigation"
    >
      <div className="app-brand">
        <span className="app-mark" aria-hidden="true">
          Bk
        </span>
        <div>
          <strong>Bookkeeply</strong>
          <span>{business?.name || "Business books"}</span>
        </div>
      </div>

      <nav className="app-side-nav">
        {NAV_GROUPS.map((group) => (
          <div className="nav-group" key={group.label}>
            <p className="nav-group-label">{group.label}</p>
            {group.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  isActive ? "side-link active" : "side-link"
                }
                onClick={onClose}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="app-side-footer">
        <div className="side-user">
          <span className="avatar" aria-hidden="true">
            {initials}
          </span>
          <div>
            <strong>{displayName}</strong>
            <span>{membership?.role || "member"} · {user?.email || ""}</span>
          </div>
        </div>
        <button type="button" className="side-logout" onClick={onSignOut}>
          Log out
        </button>
      </div>
    </aside>
  );
}
