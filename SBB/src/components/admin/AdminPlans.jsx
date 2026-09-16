import { PLANS } from "../../data/plans";
import { formatUsd } from "../../utils/format";

export default function AdminPlans() {
  return (
    <div className="app-page">
      <header className="page-header">
        <p>
          Customer-facing monthly plans. Prices are USD. Checkout is not connected.
        </p>
      </header>
      <div className="billing-plans">
        {PLANS.map((plan) => (
          <article
            key={plan.id}
            className={`billing-plan${plan.featured ? " featured" : ""}`}
          >
            <h3>{plan.name}</h3>
            <p className="billing-price">{formatUsd(plan.price)} / month</p>
            <ul>
              {plan.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}
