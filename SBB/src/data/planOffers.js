export const EVERY_PLAN = [
  "Ledger",
  "Invoices",
  "Contacts",
  "Reports",
  "Tax estimate",
  "Charts",
];

const PLAN_FEATURES = [
  "Income and expense ledger with categories, dates, and running totals",
  "Invoices you can mark paid, plus customer and vendor records",
  "Dashboard charts and a tax estimate from the same numbers",
  "Profit and loss with a CSV export for your accountant",
];

export const PLAN_OFFERS = [
  {
    id: "starter",
    name: "Starter",
    price: 9,
    audience: "The same full books, billed for a sole trader.",
    features: PLAN_FEATURES,
  },
  {
    id: "business",
    name: "Business",
    price: 19,
    featured: true,
    audience: "The same full books, billed for a shop that uses them weekly.",
    features: PLAN_FEATURES,
  },
  {
    id: "professional",
    name: "Professional",
    price: 39,
    audience: "The same full books, billed as a professional plan.",
    features: PLAN_FEATURES,
  },
];
