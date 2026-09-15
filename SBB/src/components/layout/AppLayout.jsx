import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import Sidebar from "./Sidebar";
import "../../styles/dashboard.css";
import "../../styles/app-pages.css";
import "../../styles/app.css";
import "./Sidebar.css";

const NAV_ITEMS = [
  { to: "/app", label: "Dashboard", end: true },
  { to: "/app/transactions", label: "Transactions" },
  { to: "/app/invoices", label: "Invoices" },
  { to: "/app/reports", label: "Reports" },
  { to: "/app/expenses", label: "Expenses" },
  { to: "/app/vendors", label: "Vendors" },
  { to: "/app/customers", label: "Customers" },
  { to: "/app/taxes", label: "Taxes" },
  { to: "/app/subscribers", label: "Subscribers" },
];

const TITLES = {
  "/app": "Dashboard",
  "/app/transactions": "Transactions",
  "/app/invoices": "Invoices",
  "/app/reports": "Reports",
  "/app/expenses": "Expenses",
  "/app/vendors": "Vendors",
  "/app/customers": "Customers",
  "/app/taxes": "Taxes",
  "/app/subscribers": "Subscribers",
};

export default function AppLayout() {
  const { user, signOut } = useApp();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const page = TITLES[location.pathname] || "App";

  useEffect(() => {
    document.title = `${page} · Bookkeeply`;
    return () => {
      document.title = "Bookkeeply";
    };
  }, [page]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleSignOut = () => {
    signOut();
    navigate("/", { replace: true });
  };

  return (
    <div className="dashboard-shell">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      <nav className="dashboard-navbar" aria-label="Application">
        <div className="dashboard-logo">Bookkeeply</div>

        <div className="dashboard-desktop-menu">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="dashboard-navbar-actions">
          <span className="dashboard-user">{user?.name || user?.email || "Account"}</span>
          <button type="button" className="dashboard-logout" onClick={handleSignOut}>
            Log out
          </button>
          <button
            type="button"
            className="dashboard-toggle"
            aria-expanded={mobileOpen}
            aria-controls="app-sidebar"
            onClick={() => setMobileOpen((open) => !open)}
          >
            <span aria-hidden="true">{mobileOpen ? "✕" : "☰"}</span>
            <span className="sr-only">{mobileOpen ? "Close menu" : "Open menu"}</span>
          </button>
        </div>
      </nav>

      {mobileOpen ? (
        <button
          type="button"
          className="sidebar-overlay show"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <Sidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onSignOut={handleSignOut}
      />

      <main id="main-content" className="dashboard-main-content" tabIndex={-1}>
        <Outlet />
      </main>
    </div>
  );
}
