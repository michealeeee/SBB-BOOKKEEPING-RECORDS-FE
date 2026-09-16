import { PLAN_OFFERS } from "../data/planOffers";
import { formatUsd } from "../utils/format";
import "../styles/landing.css";

export default function PlanCards({ onChoose }) {
  return (
    <div className="lp-plans">
      {PLAN_OFFERS.map((plan) => (
        <article
          key={plan.id}
          className={`lp-plan ${plan.featured ? "featured" : ""}`}
        >
          {plan.featured ? <p className="lp-plan-badge">Most popular</p> : null}
          <h3>{plan.name}</h3>
          <p className="lp-plan-for">{plan.audience}</p>
          <p className="lp-price">
            {formatUsd(plan.price)} <span className="lp-price-term">/ month</span>
          </p>
          <ul>
            {plan.features.map((feature) => (
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
