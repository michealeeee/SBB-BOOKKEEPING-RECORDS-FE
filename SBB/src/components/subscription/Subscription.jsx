import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { PLANS, getPlan } from "../../data/plans";
import { formatUsd } from "../../utils/format";

export default function Subscription() {
  const { user, setPlan } = useApp();
  const current = getPlan(user?.plan);
  const [notice, setNotice] = useState("");

  const choose = (planId) => {
    setPlan(planId);
    const next = getPlan(planId);
    setNotice(
      `Demo ${next.name} plan saved for this browser session. Checkout is not connected.`
    );
  };

  return (
    <div className="app-page">
      <header className="page-header">
        <div>
          <h2>Your Bookkeeply subscription</h2>
          <p>
            {current
              ? `This demo account is on the ${current.name} plan (${formatUsd(current.price)} / month). Sign up already subscribed you to this plan.`
              : "Pick Starter, Business, or Professional to finish subscribing."}
          </p>
        </div>
      </header>

      <section className="panel plan-status">
        <p className="eyebrow">Current plan</p>
        <p className="plan-status-name">{current ? current.name : "None"}</p>
        <p className="muted">
          Billing is demo-only and stays in this browser until you log out.
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
                {selected ? "Current plan" : `Choose ${plan.name}`}
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}
