const NAV_GROUPS = [
  {
    label: "Books",
    items: [
      { to: "/app", label: "Dashboard", end: true },
      { to: "/app/transactions", label: "Transactions" },
      { to: "/app/expenses", label: "Expenses" },
    ],
  },
  {
    label: "Sales",
    items: [
      { to: "/app/invoices", label: "Invoices" },
      { to: "/app/customers", label: "Customers" },
    ],
  },
  {
    label: "Purchases",
    items: [{ to: "/app/vendors", label: "Vendors" }],
  },
  {
    label: "Reports",
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
    items: [{ to: "/app/subscribers", label: "Subscribers" }],
  },
];

export default NAV_GROUPS;
