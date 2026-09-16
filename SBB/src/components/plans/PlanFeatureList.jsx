export default function PlanFeatureList({ features }) {
  return (
    <ul className="plan-feature-list">
      {features.map((feature) => (
        <li key={feature}>{feature}</li>
      ))}
    </ul>
  );
}
