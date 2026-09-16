import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PlanCards from "./PlanCards";
import { EVERY_PLAN } from "../data/planOffers";
import { formatMoney } from "../utils/format";
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
    setMenuOpen(false);
    const section = document.getElementById("pricing");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      window.history.replaceState(null, "", "#pricing");
    }
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
        </div>
        <div className="lp-actions">
          <button type="button" className="btn-outline" onClick={() => navigate("/signin")}>
            Sign in
          </button>
          <button type="button" className="btn-fill" onClick={goPricing}>
            Get started
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
        <button type="button" className="btn-outline" onClick={() => navigate("/signin")}>
          Sign in
        </button>
        <button type="button" className="btn-fill" onClick={goPricing}>
          Get started
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
            <button type="button" className="btn-fill" onClick={goPricing}>
              Get started
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
          <h2>Need a read on the shop? Open the books.</h2>
          <p>
            One ledger holds income, expenses, and invoices. Customers and
            vendors stay with those records. Profit, charts, and a tax estimate
            are right there on the same numbers.
          </p>
        </div>
      </section>

      <section id="pricing" className="lp-pricing">
        <div className="lp-pricing-inner">
          <p className="lp-kicker lp-pricing-kicker">Same tools</p>
          <h2>Same books on every plan</h2>
          <p className="lp-pricing-lead">
            Starter, Business, and Professional all include the same Bookkeeply
            books: ledger, invoices, contacts, reports, tax estimate, and charts.
            The plans differ by price, not by features.
          </p>
          <ul className="lp-every">
            {EVERY_PLAN.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <PlanCards onChoose={(plan) => navigate(`/signup?plan=${plan}`)} />
          <p className="lp-note">
            Subscriptions are priced in USD. Checkout is not connected. Plans open a local demo account.
          </p>
        </div>
      </section>

      <footer className="lp-footer">
        <p>© 2026 Bookkeeply. All rights reserved.</p>
      </footer>
    </div>
  );
}
