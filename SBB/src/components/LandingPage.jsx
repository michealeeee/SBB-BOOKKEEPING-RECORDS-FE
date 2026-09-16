import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PLANS, signupPath } from "../data/plans";
import { formatMoney, formatUsd } from "../utils/format";
import "../styles/landing.css";

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Bookkeeply — Simple books for small businesses";
  }, []);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.body.style.overflow = menuOpen ? "hidden" : "";
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const goPricing = () => {
    document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="landing">
      <a className="skip-link" href="#features">
        Skip to content
      </a>

      <nav className="lp-nav" aria-label="Marketing">
        <div className="lp-logo">Bookkeeply</div>
        <div className="lp-links">
          <a href="#features">Features</a>
          <a href="#product">Product</a>
          <a href="#pricing">Pricing</a>
        </div>
        <div className="lp-actions">
          <button type="button" className="btn-outline" onClick={() => navigate("/signin")}>
            Sign in
          </button>
          <button type="button" className="btn-fill" onClick={() => navigate(signupPath())}>
            Sign up
          </button>
        </div>
        <button
          type="button"
          className="lp-menu"
          aria-expanded={menuOpen}
          aria-controls="landing-drawer"
          onClick={() => setMenuOpen(true)}
        >
          <span aria-hidden="true">☰</span>
          <span className="sr-only">Open menu</span>
        </button>
      </nav>

      {menuOpen ? (
        <button
          type="button"
          className="lp-overlay show"
          onClick={() => setMenuOpen(false)}
          aria-label="Close menu"
        />
      ) : null}

      <div
        id="landing-drawer"
        className={`lp-drawer ${menuOpen ? "open" : ""}`}
        role="dialog"
        aria-modal={menuOpen}
        aria-label="Mobile menu"
      >
        <button type="button" onClick={() => setMenuOpen(false)} aria-label="Close menu">
          Close
        </button>
        <a href="#features" onClick={() => setMenuOpen(false)}>Features</a>
        <a href="#product" onClick={() => setMenuOpen(false)}>Product</a>
        <a href="#pricing" onClick={() => setMenuOpen(false)}>Pricing</a>
        <button type="button" className="btn-outline" onClick={() => navigate("/signin")}>
          Sign in
        </button>
        <button type="button" className="btn-fill" onClick={() => navigate(signupPath())}>
          Sign up
        </button>
      </div>

      <header className="lp-hero">
        <div>
          <p className="lp-kicker">Bookkeeping software</p>
          <h1>Keep income, expenses, and invoices in one ledger.</h1>
          <p>
            Bookkeeply is a simple books app for small businesses. Record
            transactions, send invoice records, and see profit at a glance.
          </p>
          <div className="lp-hero-actions">
            <button type="button" className="btn-fill" onClick={() => navigate(signupPath())}>
              Sign up
            </button>
            <button type="button" className="btn-outline" onClick={goPricing}>
              View plans
            </button>
          </div>
        </div>
        <aside className="ledger-card" aria-hidden="true">
          <div className="ledger-head">
            <strong>September ledger</strong>
            <span>GHS</span>
          </div>
          <div className="ledger-row">
            <span>Retainer — Northwind</span>
            <b className="pos">+{formatMoney(2100)}</b>
          </div>
          <div className="ledger-row">
            <span>Office supplies</span>
            <b className="neg">−{formatMoney(96)}</b>
          </div>
          <div className="ledger-row">
            <span>Product sales</span>
            <b className="pos">+{formatMoney(3120)}</b>
          </div>
          <div className="ledger-foot">
            <span>Net</span>
            <b>+{formatMoney(5124)}</b>
          </div>
        </aside>
      </header>

      <section id="features" className="lp-features">
        <article>
          <h2>Ledger</h2>
          <p>Log income and expenses with categories, dates, and running totals.</p>
        </article>
        <article>
          <h2>Invoices</h2>
          <p>Create customer invoices and mark them paid as money comes in.</p>
        </article>
        <article>
          <h2>Reports</h2>
          <p>See a simple profit and loss view and export a CSV of your books.</p>
        </article>
        <article>
          <h2>Contacts</h2>
          <p>Keep customers and vendors next to the transactions they belong to.</p>
        </article>
      </section>

      <section id="product" className="lp-product">
        <div>
          <h2>Built like a set of books, not a dashboard toy.</h2>
          <p>
            Numbers sit in tables. Statuses are plain. The sidebar follows how
            bookkeepers actually work: books, sales, purchases, and reports.
          </p>
        </div>
      </section>

      <section id="pricing" className="lp-pricing">
        <h2>Monthly plans</h2>
        <div className="lp-plans">
          {PLANS.map((plan) => (
            <div className={`lp-plan${plan.featured ? " featured" : ""}`} key={plan.id}>
              <h3>{plan.name}</h3>
              <p className="lp-price">{formatUsd(plan.price)} / month</p>
              <ul>
                {plan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <button type="button" onClick={() => navigate(signupPath(plan.id))}>
                Sign up
              </button>
            </div>
          ))}
        </div>
        <p className="lp-note">
          Sign up starts that plan immediately. Prices are in USD. Checkout is not connected.
        </p>
      </section>

      <footer className="lp-footer">
        <p>© 2026 Bookkeeply. All rights reserved.</p>
      </footer>
    </div>
  );
}
