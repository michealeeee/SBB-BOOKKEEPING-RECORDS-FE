import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { PLANS, getPlan } from "../../data/plans";
import { formatUsd } from "../../utils/format";

export default function Subscription() {
  const { user, setPlan } = useApp();
  const navigate = useNavigate();
  const current = getPlan(user?.plan);
  const [notice, setNotice] = useState("");

  const choose = (planId) => {
    setPlan(planId);
    const next = getPlan(planId);
    setNotice(
      `Demo ${next.name} plan saved. Opening the books.`
    );
    navigate("/app", { replace: true });
  };

  return (
    <div className="app-page">
      <header className="page-header">
        <div>
          <h2>Your Bookkeeply subscription</h2>
          <p>
            {current
              ? `This demo account is on the ${current.name} plan (${formatUsd(current.price)} / month).`
              : "The books stay locked until you subscribe. Pick Starter, Business, or Professional."}
          </p>
        </div>
      </header>

      <section className="panel plan-status">
        <p className="eyebrow">Current plan</p>
        <p className="plan-status-name">{current ? current.name : "None"}</p>
        <p className="muted">
          {current
            ? "Billing is demo-only and stays in this browser until you log out."
            : "Choose a plan to unlock the dashboard, ledger, invoices, and reports."}
        </p>
        {notice ? (
          <p className="form-success" role="status">
            {notice}
          </p>
        ) : null}
      </section>

      <div className="billing-plans">
        {PLANS.map((plan) => {
          const selected = current?.id === plan.id;
          return (
            <article
              key={plan.id}
              className={`billing-plan${plan.featured ? " featured" : ""}${selected ? " selected" : ""}`}
            >
              <h3>{plan.name}</h3>
              <p className="billing-price">{formatUsd(plan.price)} / month</p>
              <ul>
                {plan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <button
                type="button"
                className={selected ? "btn btn-secondary" : "btn"}
                onClick={() => choose(plan.id)}
                disabled={selected}
              >
                {selected ? "Current plan" : `Subscribe to ${plan.name}`}
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}
