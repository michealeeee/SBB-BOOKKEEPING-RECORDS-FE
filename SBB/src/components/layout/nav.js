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
    items: [{ to: "/app/subscription", label: "Subscription" }],
  },
  {
    label: "Customer plans",
    requiresPlan: true,
    items: [{ to: "/app/subscribers", label: "Subscribers" }],
  },
];

export default NAV_GROUPS;
