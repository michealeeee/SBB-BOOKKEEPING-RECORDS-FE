import { PLANS, limitLabel } from "../data/plans";
import { formatUsd } from "../utils/format";
import { useApp } from "../context/AppContext";

export default function PlanCards({ onChoose }) {
  const { plans = PLANS } = useApp();
  const visible = plans.filter((plan) => plan.active);

  return (
    <div className="in-app-plan-grid">
      {visible.map((plan) => (
        <article key={plan.planid} className={`lp-plan ${plan.featured ? "featured" : ""}`}>
          {plan.featured ? <p className="lp-plan-tag">Most popular</p> : null}
          <h3>{plan.name}</h3>
          <p className="lp-plan-for">
            planid: {plan.planid} · {plan.billing_cycle} billing · {plan.active ? "active" : "inactive"}
          </p>
          <p className="lp-price">
            {formatUsd(plan.price)}{" "}
            <span className="lp-price-term">/ {plan.billing_cycle === "yearly" ? "year" : "month"}</span>
          </p>
          <ul>
            <li>{limitLabel(plan.max_customers)} customers</li>
            <li>{limitLabel(plan.max_invoices)} invoices</li>
            <li>{limitLabel(plan.max_users)} users</li>
            <li>created_at {plan.created_at || "—"}</li>
          </ul>
          {onChoose ? (
            <button type="button" onClick={() => onChoose(plan.planid)}>
              Choose {plan.name}
            </button>
          ) : null}
        </article>
      ))}
    </div>
  );
}
