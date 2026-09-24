import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { COMPANY } from "../../data/company";
import WhatsAppHelpLink from "../WhatsAppHelpLink";
import { userLabel } from "../../utils/entities";
import AdminSidebar from "./AdminSidebar";
import "../../styles/app.css";

const TITLES = {
  "/admin": "Platform overview",
  "/admin/businesses": "Businesses",
  "/admin/plans": "Plans",
};

export default function SuperAdminLayout() {
  const { user, signOut } = useApp();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const page = TITLES[location.pathname] || "Super admin";

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

      <AdminSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} onSignOut={handleSignOut} />

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
            <p className="eyebrow">SaaS platform</p>
            <h1>{page}</h1>
          </div>
          <div className="topbar-meta">
            <span className="period">Super admin</span>
            <span className="top-user">{userLabel(user)}</span>
            <button type="button" className="ghost-btn" onClick={() => navigate("/")}>
              Home
            </button>
            <button type="button" className="ghost-btn" onClick={handleSignOut}>
              Log out
            </button>
          </div>
        </header>

        <main id="main-content" className="app-main" tabIndex={-1}>
          <Outlet />
        </main>
        <footer className="app-footer">
          <div>
            <strong>{COMPANY.name} super admin</strong>
            <p>Operate tenant businesses, plans, and subscriptions.</p>
          </div>
          <div className="app-footer-actions">
            <button type="button" className="ghost-btn" onClick={() => navigate("/")}>
              Back to home
            </button>
            <span className="app-contact-label">Contact us</span>
            <WhatsAppHelpLink context="the Bookkeeply super admin console" />
          </div>
        </footer>
      </div>
    </div>
  );
}
