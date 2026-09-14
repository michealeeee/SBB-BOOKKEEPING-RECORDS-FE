import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
          <button type="button" className="btn-fill" onClick={() => navigate("/signup")}>
            Start demo
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

      <button
        type="button"
        className={`lp-overlay ${menuOpen ? "show" : ""}`}
        onClick={() => setMenuOpen(false)}
        hidden={!menuOpen}
        aria-label="Close menu"
      />

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
        <button type="button" className="btn-fill" onClick={() => navigate("/signup")}>
          Start demo
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
            <button type="button" className="btn-fill" onClick={() => navigate("/signup")}>
              Open the demo books
            </button>
            <button type="button" className="btn-outline" onClick={goPricing}>
              View plans
            </button>
          </div>
        </div>
        <aside className="ledger-card" aria-hidden="true">
          <div className="ledger-head">
            <strong>September ledger</strong>
            <span>USD</span>
          </div>
          <div className="ledger-row">
            <span>Retainer — Northwind</span>
            <b className="pos">+$2,100.00</b>
          </div>
          <div className="ledger-row">
            <span>Office supplies</span>
            <b className="neg">−$96.00</b>
          </div>
          <div className="ledger-row">
            <span>Product sales</span>
            <b className="pos">+$3,120.00</b>
          </div>
          <div className="ledger-foot">
            <span>Net</span>
            <b>+$5,124.00</b>
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
          <div className="lp-plan">
            <h3>Basic</h3>
            <p className="lp-price">$9 / month</p>
            <ul>
              <li>100 customers</li>
              <li>500 invoices</li>
              <li>Ledger and reports</li>
            </ul>
            <button type="button" onClick={() => navigate("/signup?plan=basic")}>
              Start Basic
            </button>
          </div>
          <div className="lp-plan featured">
            <h3>Premium</h3>
            <p className="lp-price">$19 / month</p>
            <ul>
              <li>Unlimited customers</li>
              <li>Unlimited invoices</li>
              <li>Advanced reports</li>
            </ul>
            <button type="button" onClick={() => navigate("/signup?plan=premium")}>
              Start Premium
            </button>
          </div>
        </div>
        <p className="lp-note">Checkout is not connected. Plans open a local demo account.</p>
      </section>

      <footer className="lp-footer">
        <p>© 2026 Bookkeeply. All rights reserved.</p>
      </footer>
    </div>
  );
}
