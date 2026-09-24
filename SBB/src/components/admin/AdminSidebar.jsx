import { Link, NavLink } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { userLabel } from "../../utils/entities";
import ADMIN_NAV from "./adminNav";

export default function AdminSidebar({ mobileOpen, onClose, onSignOut }) {
  const { user } = useApp();
  const displayName = userLabel(user);

  return (
    <aside
      id="app-sidebar"
      className={mobileOpen ? "app-sidebar open" : "app-sidebar"}
      aria-label="Super admin navigation"
    >
      <Link className="app-brand" to="/admin" onClick={onClose}>
        <span className="app-mark" aria-hidden="true">
          SA
        </span>
        <div>
          <strong>Bookkeeply</strong>
          <span>Super admin</span>
        </div>
      </Link>

      <nav className="app-side-nav">
        <div className="nav-group">
          <p className="nav-group-label">Platform</p>
          {ADMIN_NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => (isActive ? "side-link active" : "side-link")}
              onClick={onClose}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="app-side-footer">
        <div className="side-user">
          <span className="avatar" aria-hidden="true">
            SA
          </span>
          <div>
            <strong>{displayName}</strong>
            <span>super admin · {user?.email || ""}</span>
          </div>
        </div>
        <Link className="side-home" to="/" onClick={onClose}>
          ← Back to home
        </Link>
        <button type="button" className="side-logout" onClick={onSignOut}>
          Log out
        </button>
      </div>
    </aside>
  );
}
