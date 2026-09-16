export const BILLING_TERMS = [
  { months: 1, label: "1 month" },
  { months: 3, label: "3 months" },
  { months: 12, label: "12 months" },
];

export const PLANS = [
  {
    id: "starter",
    name: "Starter",
    rank: 1,
    price: 9,
    featured: false,
    summary: "A single ledger for a small shop just getting the books in order.",
    features: [
      "Daily and weekly income and expense entries in one ledger",
      "Keep up to 100 customer records with open balances",
      "Create and track up to 500 invoices (draft, sent, paid, overdue)",
      "Simple profit-and-loss view from the same books",
      "Export a CSV of transactions for your accountant",
      "One business profile stored in this browser",
      "Standard email-style help notes in the app (demo, no live inbox)",
    ],
  },
  {
    id: "business",
    name: "Business",
    rank: 2,
    price: 19,
    featured: true,
    summary: "Unlimited sales records plus tax estimate and purchase contacts.",
    features: [
      "Everything in Starter",
      "Unlimited customer records",
      "Unlimited invoices with status tracking",
      "Vendor list tied to purchase expenses",
      "Tax estimate calculated from the ledger",
      "Dashboard charts for income versus expenses",
      "Daily, weekly, and all-period recording",
      "Standard support notes in the demo app",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    rank: 3,
    price: 39,
    featured: false,
    summary: "Business plus priority help and room for more than one set of books.",
    features: [
      "Everything in Business",
      "Priority support queue (demo flag on the account)",
      "Named account handling for the business owner",
      "Multi-account books: more than one ledger under the same login (demo)",
      "Full report set including category mix and tax estimate",
      "Plan and billing-time changes from Account → Subscription",
      "Fastest path to an operator when something in the books looks wrong",
    ],
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

export function termLabel(months) {
  const match = BILLING_TERMS.find((term) => term.months === Number(months));
  return match?.label || `${months} months`;
}

export function termPrice(plan, months = 1) {
  const count = Number(months) || 1;
  const base = Number(plan?.price || 0) * count;
  if (count >= 12) return Math.round(base * 0.9);
  return base;
}

export function planChange(currentPlan, nextPlan) {
  const currentRank = getPlan(currentPlan)?.rank || 0;
  const nextRank = getPlan(nextPlan)?.rank || 0;
  if (!currentRank) return "subscribe";
  if (nextRank > currentRank) return "upgrade";
  if (nextRank < currentRank) return "downgrade";
  return "current";
}
