const NAV_GROUPS = [
  {
    label: "Books",
    items: [
      { to: "/app", label: "Dashboard", end: true },
      { to: "/app/income", label: "Income" },
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
    label: "Business",
    items: [
      { to: "/app/subscription", label: "Subscription" },
      { to: "/app/team", label: "Team" },
      { to: "/app/business", label: "Business" },
      { to: "/app/records", label: "Records" },
    ],
  },
];

export default NAV_GROUPS;
