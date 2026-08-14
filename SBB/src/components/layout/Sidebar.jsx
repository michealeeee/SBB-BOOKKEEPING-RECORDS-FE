export default function Sidebar({
  setPage,
  page,
  mobileOpen,
  setMobileOpen,
}) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "▦" },
    { id: "transactions", label: "Transactions", icon: "↔" },
    { id: "invoices", label: "Invoices", icon: "▤" },
    { id: "reports", label: "Reports", icon: "▥" },
    { id: "expenses", label: "Expenses", icon: "−" },
    { id: "vendors", label: "Vendors", icon: "♙" },
    { id: "customers", label: "Customers", icon: "♟" },
    { id: "taxes", label: "Taxes", icon: "%" },
    { id: "subscribers", label: "Subscribers", icon: "★" },
  ];

  const handlePageChange = (selectedPage) => {
    setPage(selectedPage);
    setMobileOpen(false);
  };

  return (
    <aside
      className={
        mobileOpen
          ? "dashboard-sidebar mobile-open"
          : "dashboard-sidebar"
      }
    >
      <div className="dashboard-sidebar-brand">
        Bookkeeply
      </div>

      <nav className="dashboard-sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={
              page === item.id
                ? "dashboard-sidebar-link active"
                : "dashboard-sidebar-link"
            }
            onClick={() => handlePageChange(item.id)}
          >
            <span className="dashboard-sidebar-icon">
              {item.icon}
            </span>

            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="dashboard-sidebar-footer">
        <button
          type="button"
          className="dashboard-sidebar-logout"
        >
          Log Out
        </button>
      </div>
    </aside>
  );
}