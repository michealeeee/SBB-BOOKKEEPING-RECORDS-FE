export const PLANS = [
  {
    planid: "basic",
    name: "Basic",
    description: "Perfect for getting started",
    price: 9,
    billing_cycle: "monthly",
    max_customers: 100,
    max_invoices: 500,
    max_users: 2,
    active: true,
    featured: false,
    created_at: "2026-01-01",
  },
  {
    planid: "pro",
    name: "Pro",
    description: "Ideal for growing businesses",
    price: 19,
    billing_cycle: "monthly",
    max_customers: 0,
    max_invoices: 0,
    max_users: 10,
    active: true,
    featured: true,
    created_at: "2026-01-01",
  },
  {
    planid: "enterprise",
    name: "Enterprise",
    description: "For established businesses",
    price: 39,
    billing_cycle: "monthly",
    max_customers: 0,
    max_invoices: 0,
    max_users: 0,
    active: true,
    featured: false,
    created_at: "2026-01-01",
  },
];

const PLAN_ALIASES = {
  starter: "basic",
  professional: "pro",
  business: "enterprise",
};

export function resolvePlanId(planid) {
  return PLAN_ALIASES[planid] || planid;
}

export function getPlan(planid, catalog = PLANS) {
  const id = resolvePlanId(planid);
  return catalog.find((plan) => plan.planid === id) || catalog[0] || PLANS[0];
}

export function clonePlans(list = PLANS) {
  return list.map((plan) => ({ ...plan }));
}

export function limitLabel(value) {
  return !value || value <= 0 ? "Unlimited" : String(value);
}
