export const PLANS = [
  {
    planid: "basic",
    name: "Basic",
    price: 9,
    billing_cycle: "monthly",
    max_customers: 100,
    max_invoices: 500,
    max_users: 2,
    active: true,
  },
  {
    planid: "pro",
    name: "Pro",
    price: 19,
    billing_cycle: "monthly",
    max_customers: 0,
    max_invoices: 0,
    max_users: 10,
    active: true,
    featured: true,
  },
  {
    planid: "enterprise",
    name: "Enterprise",
    price: 39,
    billing_cycle: "monthly",
    max_customers: 0,
    max_invoices: 0,
    max_users: 0,
    active: true,
  },
];

const PLAN_ALIASES = {
  starter: "basic",
  business: "pro",
  professional: "enterprise",
};

export function getPlan(planid) {
  const id = PLAN_ALIASES[planid] || planid;
  return PLANS.find((plan) => plan.planid === id) || PLANS[0];
}

export function limitLabel(value) {
  return !value || value <= 0 ? "Unlimited" : String(value);
}
