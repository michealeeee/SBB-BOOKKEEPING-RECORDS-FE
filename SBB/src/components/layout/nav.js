const NAV_GROUPS = [
  {
    label: "Books",
    requiresPlan: true,
    items: [
      { to: "/app", label: "Dashboard", end: true },
      { to: "/app/transactions", label: "Transactions" },
      { to: "/app/expenses", label: "Expenses" },
    ],
  },
  {
    label: "Sales",
    requiresPlan: true,
    items: [
      { to: "/app/invoices", label: "Invoices" },
      { to: "/app/customers", label: "Customers" },
    ],
  },
  {
    label: "Purchases",
    requiresPlan: true,
    items: [{ to: "/app/vendors", label: "Vendors" }],
  },
  {
    label: "Reports",
    requiresPlan: true,
    items: [
      { to: "/app/reports", label: "Reports" },
      { to: "/app/taxes", label: "Taxes" },
    ],
  },
  {
    label: "Account",
    items: [{ to: "/app/subscription", label: "Your plan" }],
  },
  {
    label: "Plans",
    requiresPlan: true,
    items: [{ to: "/app/subscriptions", label: "Subscriptions" }],
  },
];

export const ADMIN_NAV_GROUPS = [
  {
    label: "SaaS",
    items: [
      { to: "/admin", label: "Overview", end: true },
      { to: "/admin/accounts", label: "Accounts" },
      { to: "/admin/plans", label: "Plans" },
    ],
  },
];

export default NAV_GROUPS;
