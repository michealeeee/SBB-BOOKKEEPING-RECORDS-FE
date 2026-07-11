import { useState } from "react";
import { useNavigate } from "react-router-dom";
import heroImage from "../assets/hero.jpg";

export default function LandingPage({ onLogin }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="landing">

      {/* NAVBAR */}
  
<nav className="navbar">

  <button
    className="hamburger"
    onClick={() => setMenuOpen(true)}
  >
    ☰
  </button>


  <div className="logo">
    Bookkeeply
  </div>


  <div className="desktop-links">

    <a href="#features">Features</a>
    <a href="#dashboard">Product</a>
    <a href="#pricing">Pricing</a>
    <a href="#testimonials">Reviews</a>

  </div>


  <div className="auth-buttons">

    <button
      className="signin-btn"
      onClick={() => navigate("/signin")}
    >
      Sign In
    </button>


    <button
      className="signup-btn"
      onClick={() => navigate("/signup")}
    >
      Start Free Trial
    </button>

  </div>

</nav>


      {/* OVERLAY */}
      <div
        className={`overlay ${menuOpen ? "show" : ""}`}
        onClick={() => setMenuOpen(false)}
      />

      {/* MOBILE DRAWER */}
      <div className={`mobile-drawer ${menuOpen ? "open" : ""}`}>

        <div className="drawer-header">
          <h3>Menu</h3>
          <button onClick={() => setMenuOpen(false)}>✕</button>
        </div>

        <a href="#features" onClick={() => setMenuOpen(false)}>Features</a>
        <a href="#dashboard" onClick={() => setMenuOpen(false)}>Product</a>
        <a href="#pricing" onClick={() => setMenuOpen(false)}>Pricing</a>
        <a href="#testimonials" onClick={() => setMenuOpen(false)}>Reviews</a>

       <div className="drawer-actions">

  <button
    className="drawer-signin"
    onClick={() => {
      setMenuOpen(false);
      navigate("/signin");
    }}
  >
    Sign In
  </button>


  <button
    className="drawer-signup"
    onClick={() => {
      setMenuOpen(false);
      navigate("/signup");
    }}
  >
    Start Free Trial
  </button>

</div>
      </div>

      {/* HERO */}
      <header className="hero">
        <div className="hero-left">
          <h1>Smart Bookkeeping for Small Business</h1>
          <p>
            Track income, expenses, invoices, and reports in one dashboard.
          </p>
        </div>

        <div className="hero-right">
          <img src={heroImage} alt="Dashboard Preview" />
        </div>
      </header>

      {/* TRUST STRIP */}
      <section className="trust">
        <p>Trusted by small businesses worldwide</p>
      </section>

      {/* FEATURES */}
      <section id="features" className="features">
        <div className="feature">
          <img src="https://images.unsplash.com/photo-1551288049-ec8c0d1f6f5d" />
          <h3>Real-time Analytics</h3>
        </div>

        <div className="feature">
          <img src="https://images.unsplash.com/photo-1554224154-26032ffc0d07" />
          <h3>Smart Invoicing</h3>
        </div>

        <div className="feature">
          <img src="https://images.unsplash.com/photo-1567427017947-545c5f8d16ad" />
          <h3>Expense Tracking</h3>
        </div>

        <div className="feature">
          <img src="https://images.unsplash.com/photo-1554224155-6726b3ff858f" />
          <h3>Financial Reports</h3>
        </div>
      </section>

      {/* DASHBOARD PREVIEW */}
      <section id="dashboard" className="dashboard-preview">
        <div className="preview-text">
          <h2>All your finances in one dashboard</h2>
          <p>
            Monitor cash flow, track invoices, and analyze profits with real-time insights.
          </p>
        </div>

        <div className="preview-image">
          <img
            src="https://images.unsplash.com/photo-1551288049-8a6b8b4b6c4b"
            alt="Dashboard UI"
          />
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="pricing">
        <h2>Monthly Subscription Plans</h2>

        <div className="pricing-grid">
          <div className="plan">
            <h3>Starter</h3>
            <p className="price">$9 / month</p>
            <ul>
              <li>Basic bookkeeping</li>
              <li>1 business</li>
              <li>Email support</li>
            </ul>
            <button>Subscribe</button>
          </div>

          <div className="plan featured">
            <h3>Professional</h3>
            <p className="price">$19 / month</p>
            <ul>
              <li>Full dashboard access</li>
              <li>Unlimited invoices</li>
              <li>Advanced analytics</li>
            </ul>
            <button>Subscribe</button>
          </div>

          <div className="plan">
            <h3>Enterprise</h3>
            <p className="price">$39 / month</p>
            <ul>
              <li>Multi-business system</li>
              <li>API access</li>
              <li>Priority support</li>
            </ul>
            <button>Subscribe</button>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="testimonials">
        <h2>What users say</h2>

        <div className="testimonial-grid">
          <div className="testimonial">
            <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e" />
            <p>"This app saved my business hours every week!"</p>
            <h4>John D.</h4>
          </div>

          <div className="testimonial">
            <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2" />
            <p>"Clean, simple, and powerful dashboard."</p>
            <h4>Ama K.</h4>
          </div>

          <div className="testimonial">
            <img src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1" />
            <p>"Best bookkeeping tool I’ve used so far."</p>
            <h4>Michael T.</h4>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p>© 2026 Bookkeeply. All rights reserved.</p>
      </footer>

    </div>
  );
}