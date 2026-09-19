import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { COMPANY } from "../data/company";
import WhatsAppHelpLink from "./WhatsAppHelpLink";
import "../styles/landing.css";

const FEATURES = [
  {
    title: "Track Income & Expenses",
    tone: "green",
    description:
      "Record every cash flow in and out of your business, then see where your money comes from and where it goes.",
    icon: "wallet",
  },
  {
    title: "Create & Send Invoices",
    tone: "cyan",
    description:
      "Create professional invoices, send them to customers and track payments in real-time. Get paid faster.",
    icon: "file",
  },
  {
    title: "Manage Customers & Vendors",
    tone: "green",
    description:
      "Keep your customer and vendor information organized in one place for easy access and better relationships.",
    icon: "users",
  },
  {
    title: "Powerful Reports",
    tone: "amber",
    description:
      "Generate profit & loss, cash flow and other key reports instantly. Understand your business performance.",
    icon: "chart",
  },
  {
    title: "Smart Dashboard",
    tone: "green",
    description:
      "Get a real-time overview of your business health with beautiful charts and key financial metrics.",
    icon: "layout",
  },
  {
    title: "Secure & Reliable",
    tone: "green",
    description:
      "Your data is encrypted and backed up securely. Use workspace-level controls to protect your records.",
    icon: "shield",
  },
];

const PROBLEMS = [
  {
    title: "Scattered Records",
    text: "Business information lives across notebooks, spreadsheets, receipts and conversations.",
    icon: "layers",
  },
  {
    title: "Unclear Finances",
    text: "Without organized records, it becomes difficult to know what you're actually earning or spending.",
    icon: "help",
  },
  {
    title: "Difficult Decisions",
    text: "When your numbers aren't clear, business decisions become guesses.",
    icon: "alert",
  },
];

const STEPS = [
  {
    number: "01",
    title: "Create your account",
    text: "Start with a simple account and tell Bookkeeply about your business.",
  },
  {
    number: "02",
    title: "Create your workspace",
    text: "Set up your business workspace, currency and core record categories.",
  },
  {
    number: "03",
    title: "Record and understand",
    text: "Capture transactions, manage invoices and use your numbers to make better decisions.",
  },
];

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    description: "Perfect for getting started",
    monthly: "GH₵0",
    cta: "Get Started Free",
    features: [
      "Up to 100 transactions/month",
      "5 invoices per month",
      "Basic reports",
      "1 user",
      "Email support",
      "Mobile access",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    description: "Ideal for growing businesses",
    monthly: "GH₵7,500",
    cta: "Start Free Trial",
    popular: true,
    features: [
      "Everything in Starter, plus:",
      "Unlimited transactions",
      "Unlimited invoices",
      "Advanced reports",
      "Up to 5 users",
      "Priority support",
      "Custom categories",
      "Data export (Excel/PDF)",
      "Automated backup",
    ],
  },
  {
    id: "business",
    name: "Business",
    description: "For established businesses",
    monthly: "GH₵15,000",
    cta: "Start Free Trial",
    features: [
      "Everything in Professional, plus:",
      "Unlimited users",
      "Advanced analytics",
      "Custom dashboard",
      "Role-based permissions",
      "Multiple workspaces",
      "API access",
      "Custom integrations",
      "Dedicated support",
      "Advanced reporting",
    ],
  },
];

const STATS = [
  ["500+", "Active Businesses"],
  ["GH₵2.5B+", "Transactions Recorded"],
  ["99.9%", "Uptime & Reliability"],
  ["4.9/5", "User Satisfaction"],
];

const SECURITY = [
  ["Private by Design", "Business data is organized within its own workspace."],
  ["Controlled Access", "Businesses can manage team access and permissions."],
  ["Reliable Records", "Financial information remains organized and accessible."],
];

const FOOTER = [
  ["Product", [
    ["Features", "#features"],
    ["Pricing", "#pricing"],
    ["Security", "#security"],
    ["How it works", "#how-it-works"],
  ]],
  ["Company", [
    ["About", "#about"],
    ["Contact", "#contact"],
    ["WhatsApp help", "whatsapp"],
  ]],
  ["Help", [
    ["Chat super admin", "whatsapp"],
    ["Sign in", "/signin"],
    ["Create account", "/signup"],
  ]],
];

const ICONS = {
  wallet:
    "M3 7h18M3 11h3.75a2 2 0 0 1 1.6.8l.45.6a4 4 0 0 0 6.4 0l.45-.6a2 2 0 0 1 1.6-.8H21M5 21h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2z",
  file: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M8 13h8M8 17h8",
  users:
    "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  chart: "M3 3v18h18M7 14v4M12 10v8M17 6v12",
  layout: "M3 3h7v9H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  layers: "M12 2 2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  help: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM9.1 9a3 3 0 1 1 5.8 1c0 2-3 2-3 4M12 17h.01",
  alert: "M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h16.9a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0zM12 9v4M12 17h.01",
  lock: "M7 11V7a5 5 0 0 1 10 0v4M5 11h14v10H5z",
  check: "M20 6 9 17l-5-5",
  arrow: "M5 12h14M13 6l6 6-6 6",
  spark: "M12 3v4M12 17v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M3 12h4M17 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8",
  building: "M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18M6 12h12M10 6h4M10 22v-4h4v4",
};

function Icon({ name, size = 18 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={ICONS[name]} />
    </svg>
  );
}

function LogoMark() {
  return <span className="lp-mark" aria-hidden="true"><Icon name="spark" size={12} /></span>;
}

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useApp();

  useEffect(() => {
    document.title = "Bookkeeply — Smart Bookkeeping";
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const start = (plan) => {
    setMenuOpen(false);
    if (isAuthenticated) {
      navigate("/app");
      return;
    }
    if (!plan) {
      goPricing();
      return;
    }
    navigate(`/signup?plan=${plan}`);
  };

  const goSignIn = () => {
    setMenuOpen(false);
    navigate(isAuthenticated ? "/app" : "/signin");
  };

  return (
    <div className="landing">
      <a className="skip-link" href="#features">Skip to content</a>

      <header className={`lp-nav ${scrolled ? "is-scrolled" : ""}`}>
        <div className="lp-nav-inner">
          <a className="lp-brand" href="#">
            <LogoMark />
            Bookkeeply
          </a>
          <nav className="lp-links" aria-label="Marketing">
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#about">About</a>
          </nav>
          <div className="lp-actions">
            <button type="button" className="lp-ghost" onClick={goSignIn}>
              {isAuthenticated ? "Open dashboard" : "Sign in"}
            </button>
            <button type="button" className="lp-primary" onClick={() => start()}>
              {isAuthenticated ? "Back to books" : "Get Started Free"}
            </button>
          </div>
          <button
            type="button"
            className="lp-menu"
            aria-expanded={menuOpen}
            aria-controls="landing-drawer"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="sr-only">{menuOpen ? "Close navigation" : "Open navigation"}</span>
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </header>

      {menuOpen ? (
        <button type="button" className="lp-overlay" onClick={() => setMenuOpen(false)} aria-label="Close menu" />
      ) : null}

      <div id="landing-drawer" className={`lp-drawer ${menuOpen ? "open" : ""}`} role="dialog" aria-modal={menuOpen} aria-label="Mobile menu">
        <a href="#features" onClick={() => setMenuOpen(false)}>Features</a>
        <a href="#pricing" onClick={() => setMenuOpen(false)}>Pricing</a>
        <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
        <button type="button" className="lp-ghost" onClick={goSignIn}>
          {isAuthenticated ? "Open dashboard" : "Sign in"}
        </button>
        <button type="button" className="lp-primary" onClick={() => start()}>
          {isAuthenticated ? "Back to books" : "Get Started Free"}
        </button>
      </div>

      <section className="lp-hero">
        <div className="lp-hero-copy">
          <p className="lp-chip">✦ Smart Bookkeeping for Smart Businesses</p>
          <h1>
            <span>Know Your Numbers.</span>
            <span className="text-gradient">Grow Your Business.</span>
          </h1>
          <p className="lp-lead">
            Bookkeeply helps small businesses track income, manage expenses, send invoices and understand their financial performance — all in one secure workspace.
          </p>
          <div className="lp-hero-actions">
            <button type="button" className="lp-primary lg" onClick={() => start()}>
              Start Your Free Trial <Icon name="arrow" size={15} />
            </button>
            <a className="lp-secondary" href="#how-it-works">See How It Works</a>
          </div>
          <div className="lp-assurances">
            <span><Icon name="check" size={11} /> No credit card required</span>
            <span><Icon name="check" size={11} /> Setup in minutes</span>
            <span><Icon name="check" size={11} /> Cancel anytime</span>
          </div>
        </div>

        <aside className="lp-dash" aria-hidden="true">
          <div className="lp-dash-shell">
            <div className="lp-dash-side">
              <LogoMark />
              <i /><i /><i /><i /><i />
            </div>
            <div className="lp-dash-main">
              <div className="lp-dash-top">
                <div>
                  <strong>Good morning, Benedict ✨</strong>
                  <p>Here&apos;s what&apos;s happening with Ben&apos;s Electronics today.</p>
                </div>
                <span className="lp-live">Live</span>
              </div>
              <div className="lp-kpis">
                <article>
                  <span>Total Revenue</span>
                  <b>GH₵1,245,000</b>
                  <small className="up">+21.2% from last month</small>
                </article>
                <article>
                  <span>Total Expenses</span>
                  <b>GH₵684,500</b>
                  <small className="down">-2.7% from last month</small>
                </article>
                <article>
                  <span>Net Profit</span>
                  <b>GH₵560,500</b>
                  <small className="up">+18.7% from last month</small>
                </article>
                <article>
                  <span>Outstanding</span>
                  <b>GH₵120,000</b>
                  <small>3 invoices due</small>
                </article>
              </div>
              <div className="lp-dash-split">
                <div>
                  <h4>Income vs Expenses</h4>
                  <div className="lp-legend">
                    <span><i className="dot-in" />Income</span>
                    <span><i className="dot-out" />Expenses</span>
                  </div>
                  <div className="lp-bars">
                    {[42, 58, 48, 70, 88].map((height) => (
                      <span key={height}><i style={{ height: `${height * 0.55}%` }} /><i style={{ height: `${height}%` }} /></span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4>Expense Breakdown</h4>
                  <div className="lp-donut-wrap">
                    <div className="lp-donut" />
                    <p className="lp-break-total">GH₵684,500</p>
                  </div>
                  <ul>
                    <li><span>Inventory</span><b>45%</b></li>
                    <li><span>Operations</span><b>25%</b></li>
                    <li><span>Marketing</span><b>15%</b></li>
                    <li><span>Utilities</span><b>10%</b></li>
                    <li><span>Others</span><b>5%</b></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <p className="lp-dash-caption"><Icon name="spark" size={11} /> Real-time insights. Better decisions.</p>
        </aside>
      </section>

      <section className="lp-stats" aria-label="Social proof">
        {STATS.map(([value, label]) => (
          <article key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </article>
        ))}
      </section>

      <section className="lp-section">
        <div className="lp-head">
          <p className="lp-kicker">✦ Why it matters</p>
          <h2>Your business shouldn&apos;t run on <span className="text-gradient">memory.</span></h2>
          <p className="lp-copy">
            Receipts get lost. Expenses are forgotten. Customer debts become difficult to track. Important financial information gets scattered across notebooks, spreadsheets and conversations.
          </p>
        </div>
        <div className="lp-problems">
          {PROBLEMS.map((item) => (
            <article key={item.title}>
              <div className="lp-icon-box"><Icon name={item.icon} size={20} /></div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="features" className="lp-section lp-alt">
        <div className="lp-head">
          <p className="lp-kicker">✦ Everything you need</p>
          <h2>Run Your Business <span className="text-gradient">Better.</span></h2>
          <p className="lp-copy">Powerful features designed to help you record, organize and understand your finances.</p>
        </div>
        <div className="lp-features">
          {FEATURES.map((item) => (
            <article key={item.title}>
              <div className={`lp-icon-box tone-${item.tone}`}><Icon name={item.icon} size={19} /></div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <a href="#pricing">Learn more <Icon name="arrow" size={12} /></a>
            </article>
          ))}
        </div>
      </section>

      <section className="lp-section lp-workspace">
        <div>
          <p className="lp-kicker cyan">Built around workspaces</p>
          <h2>Your business. <span className="text-gradient">Your workspace.</span></h2>
          <p className="lp-copy">
            Bookkeeply is designed around business workspaces. Your customers, transactions, invoices, expenses and reports stay organized within the business you manage.
          </p>
        </div>
        <div className="lp-workspace-flow">
          <div className="lp-ws-card sm">
            <span>Account</span>
            <strong>Ben&apos;s Account</strong>
          </div>
          <div className="lp-connector" />
          <div className="lp-ws-card accent">
            <div className="lp-ws-row">
              <div className="lp-icon-box tone-green"><Icon name="building" size={19} /></div>
              <div>
                <span>Business workspace</span>
                <strong>Ben&apos;s Electronics</strong>
              </div>
            </div>
            <div className="lp-currency">
              <span>Currency</span>
              <b>GH₵ Ghana Cedi</b>
            </div>
          </div>
          <div className="lp-connector" />
          <ul>
            <li>Transactions</li>
            <li>Invoices</li>
            <li>Expenses</li>
            <li>Reports</li>
          </ul>
        </div>
      </section>

      <section id="how-it-works" className="lp-section lp-alt">
        <div className="lp-how-head">
          <div>
            <p className="lp-kicker">Simple by design</p>
            <h2>From scattered records to <span className="text-gradient">clear decisions.</span></h2>
          </div>
          <p className="lp-copy">
            The product flow is deliberately simple: create an account, establish a business workspace, then turn everyday financial activity into useful information.
          </p>
        </div>
        <div className="lp-steps">
          {STEPS.map((item) => (
            <article key={item.number}>
              <span>{item.number}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="pricing" className="lp-section">
        <div className="lp-head">
          <p className="lp-kicker">✦ Simple, transparent pricing</p>
          <h2>Choose the Plan That <span className="text-gradient">Grows With You.</span></h2>
          <p className="lp-copy">
            Start free and upgrade as your business grows. Every plan includes the core tools you need to maintain better business records.
          </p>
        </div>
        <div className="lp-plans">
          {PLANS.map((plan) => (
            <article key={plan.id} className={plan.popular ? "popular" : ""}>
              {plan.popular ? <p className="lp-popular">MOST POPULAR</p> : null}
              <h3>{plan.name}</h3>
              <p className="lp-plan-desc">{plan.description}</p>
              <p className="lp-price">
                {plan.monthly}
                <span>/month</span>
              </p>
              <button type="button" className={plan.popular ? "lp-primary" : "lp-outline"} onClick={() => start(plan.id)}>
                {plan.cta}
              </button>
              <p className="lp-includes">Includes:</p>
              <ul>
                {plan.features.map((feature) => (
                  <li key={feature}><Icon name="check" size={12} /> {feature}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section id="security" className="lp-section lp-security">
        <div>
          <p className="lp-kicker">Security first</p>
          <h2>Your records are <span className="text-gradient">business-critical.</span></h2>
          <ul>
            {SECURITY.map(([title, text]) => (
              <li key={title}>
                <div className="lp-icon-box tone-green"><Icon name="shield" size={17} /></div>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="lp-orb" aria-hidden="true">
          <span />
          <div className="lp-icon-box tone-green lg"><Icon name="lock" size={42} /></div>
        </div>
      </section>

      <section id="about" className="lp-section lp-about">
        <div className="lp-icon-box tone-green"><Icon name="spark" size={20} /></div>
        <h2>There&apos;s a reason <span className="text-gradient">Bookkeeply exists.</span></h2>
        <p className="lp-copy">{COMPANY.story}</p>
        <p className="lp-copy">
          Small businesses deserve simple tools that help them understand their finances without forcing them into unnecessarily complicated accounting software.
        </p>
        <a className="lp-text-link" href="#contact">Contact us on WhatsApp <Icon name="arrow" size={15} /></a>
      </section>

      <section id="final-cta" className="lp-final">
        <div>
          <h2>Ready to take control of your business finances?</h2>
          <p>Join businesses using better records to understand their money and make better decisions.</p>
        </div>
        <div className="lp-final-actions">
          <button type="button" className="lp-primary lg" onClick={() => start()}>
            Start Your Free Trial <Icon name="arrow" size={15} />
          </button>
          <div className="lp-assurances">
            <span><Icon name="check" size={11} /> 14-day free trial</span>
            <span><Icon name="check" size={11} /> No credit card required</span>
          </div>
        </div>
      </section>

      <footer id="contact" className="lp-footer">
        <div className="lp-footer-top">
          <div className="lp-footer-about">
            <a className="lp-brand" href="#">
              <LogoMark />
              {COMPANY.name}
            </a>
            <p>{COMPANY.story}</p>
            <p className="lp-address">
              <strong>Online business</strong>
              {COMPANY.location}
            </p>
            <WhatsAppHelpLink />
            <p className="lp-whatsapp-note">Help and assistance on WhatsApp</p>
          </div>
          {FOOTER.map(([title, links]) => (
            <div key={title}>
              <h3>{title}</h3>
              <ul>
                {links.map(([label, href]) => (
                  <li key={label}>
                    {href === "whatsapp" ? (
                      <WhatsAppHelpLink />
                    ) : href.startsWith("/") ? (
                      <button type="button" className="lp-footer-link" onClick={() => navigate(href)}>{label}</button>
                    ) : (
                      <a href={href}>{label}</a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="lp-copy-note">© 2026 {COMPANY.name}. All rights reserved. {COMPANY.location}</p>
      </footer>
    </div>
  );
}
