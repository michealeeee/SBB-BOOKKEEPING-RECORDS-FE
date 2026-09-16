export const EVERY_PLAN = [
  "Ledger",
  "Invoices",
  "Contacts",
  "Reports",
  "Tax estimate",
  "Charts",
];

export const PLAN_OFFERS = [
  {
    id: "starter",
    name: "Starter",
    price: 9,
    audience: "For sole traders who want one clean set of books.",
    features: [
      "Income and expense ledger with categories, dates, and running totals",
      "Customer invoices you can mark paid as money comes in",
      "Customers and vendors kept beside the transactions they belong to",
      "Profit and loss plus a CSV export for your accountant",
    ],
  },
  {
    id: "business",
    name: "Business",
    price: 19,
    featured: true,
    audience: "For shops that live in their books every week.",
    features: [
      "The full ledger, invoices, customers, and vendor records in one place",
      "Dashboard charts that make income versus expenses obvious in seconds",
      "A tax estimate built from the same books, not a separate spreadsheet",
      "Weekly profit and loss, with CSV ready when you need a review",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    price: 39,
    audience: "For owners who want the complete toolkit named out.",
    features: [
      "Ledger, sales, purchases, and contacts under one Bookkeeply login",
      "Dashboard charts plus a tax estimate next to the live numbers",
      "Profit and loss, CSV export, and owner check-ins from the same reports",
      "The full books for tax season — same tools, billed as a professional plan",
    ],
  },
];
