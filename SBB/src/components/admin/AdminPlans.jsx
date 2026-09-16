import { PLANS, termPrice } from "../../data/plans";
import { formatUsd } from "../../utils/format";
import PlanFeatureList from "../plans/PlanFeatureList";

export default function AdminPlans() {
  return (
    <div className="app-page">
      <header className="page-header">
        <p>
          These are the features customers see. Owners can upgrade and change
          billing time after they register. Prices are USD.
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
            <p className="muted">{plan.summary}</p>
            <p className="muted">{formatUsd(termPrice(plan, 12))} for 12 months</p>
            <PlanFeatureList features={plan.features} />
          </article>
        ))}
      </div>
    </div>
  );
}
