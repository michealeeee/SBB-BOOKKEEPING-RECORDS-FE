import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { getPlan } from "../../data/plans";
import Sidebar from "./Sidebar";
import "../../styles/app.css";

const TITLES = {
  "/app": "Dashboard",
  "/app/transactions": "Transactions",
  "/app/invoices": "Invoices",
  "/app/reports": "Reports",
  "/app/expenses": "Expenses",
  "/app/vendors": "Vendors",
  "/app/customers": "Customers",
  "/app/taxes": "Taxes",
  "/app/subscription": "Subscription",
  "/app/subscribers": "Subscribers",
};

export default function AppLayout() {
  const { user, signOut } = useApp();
  const planName = getPlan(user?.plan)?.name;
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const page = TITLES[location.pathname] || "Books";

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
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      {mobileOpen ? (
        <button
          type="button"
          className="nav-overlay show"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <Sidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onSignOut={handleSignOut}
      />

      <div className="app-frame">
        <header className="app-topbar">
          <button
            type="button"
            className="menu-btn"
            aria-expanded={mobileOpen}
            aria-controls="app-sidebar"
            onClick={() => setMobileOpen((open) => !open)}
          >
            <span aria-hidden="true">{mobileOpen ? "✕" : "☰"}</span>
            <span className="sr-only">{mobileOpen ? "Close menu" : "Open menu"}</span>
          </button>
          <div>
            <p className="eyebrow">Books</p>
            <h1>{page}</h1>
          </div>
          <div className="topbar-meta">
            <span className="period">
              {planName ? `${planName} · demo books · GHS` : "No plan · demo books · GHS"}
            </span>
            <span className="top-user">{user?.name || user?.email || "Account"}</span>
            <button type="button" className="ghost-btn" onClick={handleSignOut}>
              Log out
            </button>
          </div>
        </header>

        <main id="main-content" className="app-main" tabIndex={-1}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
