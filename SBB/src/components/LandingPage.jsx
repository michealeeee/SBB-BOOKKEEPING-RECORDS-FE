import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PlanCards from "./PlanCards";
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
          <a href="#pricing">Pricing</a>
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
        <a href="#pricing" onClick={() => setMenuOpen(false)}>Pricing</a>
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
            Bookkeeply is a simple books app for small businesses. Sign in as a
            user, work inside a business, and keep customers, invoices, income,
            and expenses on that business.
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
          <h2>Business</h2>
          <p>A user joins through a membership. The business owns the books.</p>
        </article>
        <article>
          <h2>Income &amp; expenses</h2>
          <p>Record money in and money out. Income can link to an invoice.</p>
        </article>
        <article>
          <h2>Invoices</h2>
          <p>Create invoices as paid, unpaid, or partial, optionally for a customer.</p>
        </article>
        <article>
          <h2>Plans</h2>
          <p>One subscription per business, with customer, invoice, and user limits.</p>
        </article>
      </section>

      <section id="product" className="lp-product">
        <div>
          <h2>When you need to know how the shop is doing, open the books.</h2>
          <p>
            Customers, invoices, income, expenses, and vendors sit on the
            business. Team members share that one set of books, and the
            subscription is billed to the business.
          </p>
        </div>
      </section>

      <section id="pricing" className="lp-pricing">
        <div className="lp-pricing-inner">
          <p className="lp-kicker lp-pricing-kicker">Business plans</p>
          <h2>Limits for the whole business</h2>
          <p className="lp-pricing-lead">
            Basic, Pro, and Enterprise set max customers, invoices, and users.
            Everyone in the business uses the same subscription.
          </p>
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
