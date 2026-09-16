import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import {
  BILLING_TERMS,
  PLANS,
  getPlan,
  planChange,
  termLabel,
  termPrice,
} from "../../data/plans";
import { formatDate, formatUsd } from "../../utils/format";
import PlanFeatureList from "../plans/PlanFeatureList";

function actionLabel(kind, plan) {
  if (kind === "current") return "Current plan";
  if (kind === "upgrade") return `Upgrade to ${plan.name}`;
  if (kind === "downgrade") return `Switch to ${plan.name}`;
  return `Subscribe to ${plan.name}`;
}

export default function Subscription() {
  const { user, setSubscription } = useApp();
  const navigate = useNavigate();
  const current = getPlan(user?.plan);
  const termMonths = Number(user?.termMonths) || 1;
  const [term, setTerm] = useState(termMonths);
  const [notice, setNotice] = useState("");

  const applyPlan = (planId) => {
    const next = getPlan(planId);
    const kind = planChange(current?.id, planId);
    const payload = { plan: planId };
    if (!current || term !== termMonths) payload.termMonths = term;
    setSubscription(payload);
    setNotice(
      kind === "upgrade"
        ? `Upgraded to ${next.name} for ${termLabel(term)}.`
        : kind === "downgrade"
          ? `Switched to ${next.name} for ${termLabel(term)}.`
          : `Demo ${next.name} plan saved for ${termLabel(term)}.`
    );
    if (!current) navigate("/app", { replace: true });
  };

  const applyTerm = (event) => {
    event.preventDefault();
    if (!current) {
      setNotice("Pick a plan, then set the billing time.");
      return;
    }
    setSubscription({ plan: current.id, termMonths: term });
    setNotice(`Billing time set to ${termLabel(term)}. Renewal moved to match.`);
  };

  return (
    <div className="app-page">
      <header className="page-header">
        <div>
          <h2>Your Bookkeeply subscription</h2>
          <p>
            {current
              ? `You are the owner of this account. Upgrade or switch plans, and set how long this term runs.`
              : "The books stay locked until you subscribe. Read the features, then pick a plan and a billing time."}
          </p>
        </div>
      </header>

      <section className="panel plan-status">
        <p className="eyebrow">Current plan</p>
        <p className="plan-status-name">{current ? current.name : "None"}</p>
        <p className="muted">
          {current
            ? `${formatUsd(termPrice(current, termMonths))} for ${termLabel(termMonths)}${
                user?.renew ? ` · renews ${formatDate(user.renew)}` : ""
              }`
            : "Choose a plan to unlock the dashboard, ledger, invoices, and reports."}
        </p>
        {notice ? (
          <p className="form-success" role="status">
            {notice}
          </p>
        ) : null}
      </section>

      <section className="panel">
        <h2>Billing time</h2>
        <p className="muted form-hint">
          12 months is billed at 10% off the monthly rate. Changing time starts a new term from today.
        </p>
        <form className="form-grid" onSubmit={applyTerm}>
          <div className="field">
            <label htmlFor="owner-term">Term</label>
            <select
              id="owner-term"
              value={term}
              onChange={(event) => setTerm(Number(event.target.value))}
            >
              {BILLING_TERMS.map((item) => (
                <option key={item.months} value={item.months}>
                  {item.label}
                  {current ? ` · ${formatUsd(termPrice(current, item.months))}` : ""}
                </option>
              ))}
            </select>
          </div>
          <button className="btn" type="submit">
            Save billing time
          </button>
        </form>
      </section>

      <div className="billing-plans">
        {PLANS.map((plan) => {
          const kind = planChange(current?.id, plan.id);
          return (
            <article
              key={plan.id}
              className={`billing-plan${plan.featured ? " featured" : ""}${kind === "current" ? " selected" : ""}`}
            >
              <h3>{plan.name}</h3>
              <p className="billing-price">{formatUsd(plan.price)} / month</p>
              <p className="muted">{plan.summary}</p>
              <p className="muted">
                {formatUsd(termPrice(plan, 12))} if you pay 12 months now
              </p>
              <PlanFeatureList features={plan.features} />
              <button
                type="button"
                className={kind === "current" ? "btn btn-secondary" : "btn"}
                onClick={() => applyPlan(plan.id)}
                disabled={kind === "current"}
              >
                {actionLabel(kind, plan)}
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}
