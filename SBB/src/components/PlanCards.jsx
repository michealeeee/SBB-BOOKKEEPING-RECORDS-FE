import { PLAN_OFFERS } from "../data/planOffers";
import { formatUsd } from "../utils/format";
import "../styles/landing.css";

const SAME_FEATURES = [
  "Income and expense ledger with categories, dates, and running totals",
  "Invoices you can mark paid, plus customer and vendor records",
  "Dashboard charts and a tax estimate from the same numbers",
  "Profit and loss with a CSV export for your accountant",
];

export default function PlanCards({ onChoose }) {
  return (
    <div className="lp-plans">
      {PLAN_OFFERS.map((plan) => (
        <article key={plan.id} className="lp-plan">
          {plan.featured ? <p className="lp-plan-tag">Most popular</p> : null}
          <h3>{plan.name}</h3>
          <p className="lp-plan-for">{plan.audience}</p>
          <p className="lp-price">
            {formatUsd(plan.price)} <span className="lp-price-term">/ month</span>
          </p>
          <ul>
            {SAME_FEATURES.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
          {onChoose ? (
            <button type="button" onClick={() => onChoose(plan.id)}>
              Choose {plan.name}
            </button>
          ) : null}
        </article>
      ))}
    </div>
  );
}
