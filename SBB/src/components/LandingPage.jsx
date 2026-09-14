import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/landing.css";

const ANALYTICS_IMG =
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80";
const INVOICE_IMG =
  "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80";
const EXPENSE_IMG =
  "https://images.unsplash.com/photo-1554224154-22dec7ec8818?auto=format&fit=crop&w=800&q=80";
const REPORT_IMG =
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80";
const PREVIEW_IMG =
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80";

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Bookkeeply — Smart bookkeeping";
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

  const scrollToPricing = () => {
    const target = document.getElementById("pricing");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="landing">
      <a className="skip-link" href="#features">
        Skip to content
      </a>

      <nav className="navbar" aria-label="Marketing">
        <div className="logo">Bookkeeply</div>

        <div className="desktop-links">
          <a href="#features">Features</a>
          <a href="#dashboard">Product</a>
          <a href="#pricing">Pricing</a>
          <a href="#testimonials">Reviews</a>
        </div>

        <div className="auth-buttons">
          <button type="button" className="signin-btn" onClick={() => navigate("/signin")}>
            Sign In
          </button>
          <button type="button" className="signup-btn" onClick={scrollToPricing}>
            Get Started
          </button>
        </div>

        <button
          type="button"
          className="hamburger"
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
        className={`overlay ${menuOpen ? "show" : ""}`}
        onClick={() => setMenuOpen(false)}
        hidden={!menuOpen}
        aria-label="Close menu"
      />

      <div
        id="landing-drawer"
        className={`mobile-drawer ${menuOpen ? "open" : ""}`}
        role="dialog"
        aria-modal={menuOpen}
        aria-label="Mobile menu"
      >
        <div className="drawer-header">
          <button type="button" onClick={() => setMenuOpen(false)} aria-label="Close menu">
            ✕
          </button>
        </div>

        <a href="#features" onClick={() => setMenuOpen(false)}>
          Features
        </a>
        <a href="#dashboard" onClick={() => setMenuOpen(false)}>
          Product
        </a>
        <a href="#pricing" onClick={() => setMenuOpen(false)}>
          Pricing
        </a>
        <a href="#testimonials" onClick={() => setMenuOpen(false)}>
          Reviews
        </a>

        <div className="drawer-actions">
          <button
            type="button"
            className="drawer-signin"
            onClick={() => {
              setMenuOpen(false);
              navigate("/signin");
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            className="drawer-signup"
            onClick={() => {
              setMenuOpen(false);
              navigate("/signup");
            }}
          >
            Get Started
          </button>
        </div>
      </div>

      <header className="hero">
        <div className="hero-left">
          <h1>
            Smart Bookkeeping for
            <br />
            <span>Growing Businesses</span>
          </h1>
          <p>
            Manage your finances, simplify bookkeeping, and make smarter
            decisions.
          </p>
          <div className="hero-actions">
            <button type="button" className="signup-btn" onClick={() => navigate("/signup")}>
              Start free demo
            </button>
            <button type="button" className="signin-btn" onClick={scrollToPricing}>
              View plans
            </button>
          </div>
        </div>
      </header>

      <section className="trust">
        <p>Trusted by businesses worldwide</p>
      </section>

      <section id="features" className="features">
        <article className="feature">
          <img src={ANALYTICS_IMG} alt="" />
          <h3>Real-time Analytics</h3>
          <p>
            Monitor your business performance with live financial insights and
            make faster decisions using accurate, up-to-date information.
          </p>
        </article>
        <article className="feature">
          <img src={INVOICE_IMG} alt="" />
          <h3>Smart Invoicing</h3>
          <p>
            Create professional invoices, track payments, and manage billing
            efficiently to improve your cash flow.
          </p>
        </article>
        <article className="feature">
          <img src={EXPENSE_IMG} alt="" />
          <h3>Expense Tracking</h3>
          <p>
            Record and organize expenses easily while identifying spending
            patterns and controlling business costs.
          </p>
        </article>
        <article className="feature">
          <img src={REPORT_IMG} alt="" />
          <h3>Financial Reports</h3>
          <p>
            Generate clear financial reports that help you understand growth,
            measure performance, and plan better strategies.
          </p>
        </article>
      </section>

      <section id="dashboard" className="dashboard-preview">
        <div className="preview-text">
          <h2>Grow Your Business with Better Financial Decisions</h2>
          <p>
            Understand your finances, track growth, and make smarter decisions
            with accurate financial insights.
          </p>
        </div>
        <div className="preview-image">
          <img src={PREVIEW_IMG} alt="Charts and financial metrics on a laptop" />
        </div>
      </section>

      <section id="pricing" className="pricing">
        <h2>Monthly Subscription Plans</h2>
        <div className="pricing-grid">
          <div className="plan basic-plan">
            <h3>Basic</h3>
            <p className="price">$9 / month</p>
            <ul>
              <li>100 Customers</li>
              <li>500 Invoices</li>
            </ul>
            <button type="button" onClick={() => navigate("/signup?plan=basic")}>
              Subscribe
            </button>
          </div>
          <div className="plan featured">
            <h3>Premium</h3>
            <p className="price">$19 / month</p>
            <ul>
              <li>Unlimited customers</li>
              <li>Unlimited invoices</li>
              <li>Advanced analytics</li>
            </ul>
            <button type="button" onClick={() => navigate("/signup?plan=premium")}>
              Subscribe
            </button>
          </div>
        </div>
        <p className="pricing-note">
          Checkout is not connected yet. Subscribe opens a local demo account.
        </p>
      </section>

      <section id="testimonials" className="testimonials">
        <h2>What Users Say</h2>
        <div className="testimonial-grid">
          <figure className="testimonial">
            <img
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
              alt=""
            />
            <blockquote>
              <p>&ldquo;This app saved my business hours every week!&rdquo;</p>
            </blockquote>
            <figcaption>John D.</figcaption>
          </figure>
          <figure className="testimonial">
            <img
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80"
              alt=""
            />
            <blockquote>
              <p>&ldquo;Clean, simple, and powerful dashboard.&rdquo;</p>
            </blockquote>
            <figcaption>Ama K.</figcaption>
          </figure>
          <figure className="testimonial">
            <img
              src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80"
              alt=""
            />
            <blockquote>
              <p>&ldquo;Best bookkeeping tool I have used so far.&rdquo;</p>
            </blockquote>
            <figcaption>Michael T.</figcaption>
          </figure>
        </div>
      </section>

      <footer className="footer">
        <p>© 2026 Bookkeeply. All rights reserved.</p>
      </footer>
    </div>
  );
}
