export const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: 9,
    features: ["100 customers", "500 invoices", "Ledger and reports"],
  },
  {
    id: "business",
    name: "Business",
    price: 19,
    featured: true,
    features: ["Unlimited customers", "Unlimited invoices", "Reports and tax estimate"],
  },
  {
    id: "professional",
    name: "Professional",
    price: 39,
    features: ["Everything in Business", "Priority support", "Multi-account books"],
  },
];

const ALIASES = {
  starter: "starter",
  basic: "starter",
  business: "business",
  premium: "business",
  professional: "professional",
};

export function resolvePlanId(value) {
  if (!value) return undefined;
  const key = String(value).trim().toLowerCase();
  return ALIASES[key] ?? PLANS.find((plan) => plan.name.toLowerCase() === key)?.id;
}

export function getPlan(value) {
  const id = resolvePlanId(value);
  return PLANS.find((plan) => plan.id === id);
}

export function hasSubscription(userOrPlan) {
  if (userOrPlan && typeof userOrPlan === "object") {
    return Boolean(getPlan(userOrPlan.plan));
  }
  return Boolean(getPlan(userOrPlan));
}

export const DEFAULT_PLAN_ID = PLANS.find((plan) => plan.featured)?.id ?? PLANS[0].id;

export function signupPath(planId = DEFAULT_PLAN_ID) {
  const id = resolvePlanId(planId) || DEFAULT_PLAN_ID;
  return `/signup?plan=${id}`;
}
