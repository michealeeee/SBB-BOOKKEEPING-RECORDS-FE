import { useState } from "react";
import { useNavigate } from "react-router-dom";
import heroImage from "../assets/hero.jpg";

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="landing">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo">Bookkeeply</div>

        <div className="desktop-links">
          <a href="#features">Features</a>
          <a href="#dashboard">Product</a>
          <a href="#pricing">Pricing</a>
          <a href="#testimonials">Reviews</a>
        </div>

        <div className="auth-buttons">
          <button className="signin-btn" onClick={() => navigate("/signin")}>
            Sign In
          </button>

          <button className="signup-btn" onClick={() => navigate("/signup")}>
            Get Started
          </button>
        </div>

        <button className="hamburger" onClick={() => setMenuOpen(true)}>
          ☰
        </button>
      </nav>

      {/* OVERLAY */}
      <div
        className={`overlay ${menuOpen ? "show" : ""}`}
        onClick={() => setMenuOpen(false)}
      />

      {/* MOBILE DRAWER */}
      <div className={`mobile-drawer ${menuOpen ? "open" : ""}`}>
        <div className="drawer-header">
          <button onClick={() => setMenuOpen(false)}>✕</button>
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
            Get Started
          </button>
        </div>
      </div>

      {/* HERO */}
      <header className="hero">
        <div className="hero-left">
            <h1>
              Smart Bookkeeping for
              <br />
              <span>Growing Businesses</span>
            </h1>

          <p>
            Manage your finances, simplify bookkeeping, and make smarter decisions.
          </p>
        </div>

        <div className="hero-right">
          <img src="https://media.istockphoto.com/id/893311798/photo/bookkeeping-concept-binders-on-desk-in-the-office-business-background.jpg?s=612x612&w=0&k=20&c=tzMpOeohoIXfSWY1slD9pWqwo0Gh7OVaRiwsP3jrI3M=" alt="Bookkeeping dashboard preview" />
        </div>
      </header>

      {/* TRUST STRIP */}
      <section className="trust">
        <p>Trusted by businesses worldwide</p>
      </section>

      {/* FEATURES */}
      <section id="features" className="features">
        <div className="feature">
          <img
            src="https://images.openai.com/static-rsc-4/53_FV-dVKoC8uDq_e1NuF7X6QE0-2DhMRKOZpHq4ZcKTmGIkIbNFsvtF_NE3O_tuRVaflJLMr00wwRW1PomXQtY2kSMqdcT0qFlTt8LxcSv77CsqINbypAKoG3IJFa1k_SPqSzCL7UQg-GIpX95Y74Lw3c_eDS4qZv5NaGMJRitCwt6Slq8NEjs_oUJIY3Z1?purpose=inline"
            alt="Real-time analytics"
          />

          <h3>Real-time Analytics</h3>

          <p>
            Monitor your business performance with live financial insights and
            make faster decisions using accurate, up-to-date information.
          </p>
        </div>

        <div className="feature">
          <img
            src="https://images.unsplash.com/photo-1654263736203-a289f57c0d82?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8aW52b2ljZXxlbnwwfHwwfHx8MA%3D%3D"
            alt="Smart invoicing"
          />

          <h3>Smart Invoicing</h3>

          <p>
            Create professional invoices, track payments, and manage billing
            efficiently to improve your cash flow.
          </p>
        </div>

        <div className="feature">
          <img
            src="https://media.istockphoto.com/id/1433693761/photo/white-card-with-the-text-keep-track-of-your-expenses-on-wooden-desk-background-business.jpg?s=612x612&w=0&k=20&c=LDrYHRj0m1gBySNZn2GEQ82nMQTT8wYyPUfM0Ujvff8="
            alt="Expense tracking"
          />

          <h3>Expense Tracking</h3>

          <p>
            Record and organize expenses easily while identifying spending
            patterns and controlling business costs.
          </p>
        </div>

        <div className="feature">
          <img
            src="https://media.istockphoto.com/id/878863400/photo/businessman-analyzing-financial-report-data-company-operations-balance-sheet-fintech.jpg?s=612x612&w=0&k=20&c=JoDWSxnoM8rXGRUZ6Fkj0GTmDPr8TO4JzwBDdYWDE7s="
            alt="Financial reports"
          />
          
          <h3>Financial Reports</h3>

          <p>
            Generate clear financial reports that help you understand growth,
            measure performance, and plan better strategies.
          </p>
        </div>
      </section>

      {/* DASHBOARD PREVIEW */}
      <section id="dashboard" className="dashboard-preview">
        <div className="preview-text">
          <h2>Grow Your Business with Better Financial Decisions</h2>

          <p>
           Understand your finances, track growth, and make smarter decisions with accurate financial insights.
          </p>
        </div>

        <div className="preview-image">
          <img
            src="https://images.openai.com/static-rsc-4/06s_WzMzreckSm-KAyPV_52iJ0bPrGoS7bQPgDjxwdc2apB36xyM5jNsWN6MZcoACwcTkytFjEUvc3ngrWFs82nG3rkkhcLkGkW2Dg2cUJXk5U1vFmFkNXw8B8CV1zG1EFUfff5s-5FT0YHcfc1rSai6g7YrS7vnv7inRjtCEzkBv0Y37eSVT81wcTmtaUv4?purpose=fullsize"
            alt="Dashboard interface"
          />
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="pricing">
        <h2>Monthly Subscription Plans</h2>

        <div className="pricing-grid">
          <div className="plan">
            <h3>Basic</h3>

            <p className="price">$9 / month</p>

            <ul>
              <li>Basic bookkeeping</li>
              <li>1 business</li>
              <li>Email support</li>
            </ul>

            <button>Subscribe</button>
          </div>

          <div className="plan featured">
            <h3>Premium</h3>

            <p className="price">$19 / month</p>

            <ul>
              <li>Full dashboard access</li>
              <li>Unlimited invoices</li>
              <li>Advanced analytics</li>
            </ul>

            <button>Subscribe</button>
          </div>

        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="testimonials">
        <h2>What Users Say</h2>

        <div className="testimonial-grid">
          <div className="testimonial">
            <img
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e"
              alt="John"
            />

            <p>"This app saved my business hours every week!"</p>

            <h4>John D.</h4>
          </div>

          <div className="testimonial">
            <img
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2"
              alt="Ama"
            />

            <p>"Clean, simple, and powerful dashboard."</p>

            <h4>Ama K.</h4>
          </div>

          <div className="testimonial">
            <img
              src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1"
              alt="Michael"
            />

            <p>"Best bookkeeping tool I have used so far."</p>

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
