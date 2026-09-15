import { NavLink } from "react-router-dom";
import { useApp } from "../../context/AppContext";

const menuItems = [
  { to: "/app", label: "Dashboard", icon: "▦", end: true },
  { to: "/app/transactions", label: "Transactions", icon: "↔" },
  { to: "/app/invoices", label: "Invoices", icon: "▤" },
  { to: "/app/reports", label: "Reports", icon: "▥" },
  { to: "/app/expenses", label: "Expenses", icon: "−" },
  { to: "/app/vendors", label: "Vendors", icon: "♙" },
  { to: "/app/customers", label: "Customers", icon: "♟" },
  { to: "/app/taxes", label: "Taxes", icon: "%" },
  { to: "/app/subscribers", label: "Subscribers", icon: "★" },
];

export default function Sidebar({ mobileOpen, onClose, onSignOut }) {
  const { signOut } = useApp();

  return (
    <aside
      id="app-sidebar"
      className={mobileOpen ? "dashboard-sidebar mobile-open" : "dashboard-sidebar"}
      aria-label="Sidebar"
    >
      <div className="dashboard-sidebar-brand">Bookkeeply</div>

      <nav className="dashboard-sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              isActive ? "dashboard-sidebar-link active" : "dashboard-sidebar-link"
            }
            onClick={onClose}
          >
            <span className="dashboard-sidebar-icon" aria-hidden="true">
              {item.icon}
            </span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="dashboard-sidebar-footer">
        <button
          type="button"
          className="dashboard-sidebar-logout"
          onClick={onSignOut || signOut}
        >
          Log Out
        </button>
      </div>
    </aside>
  );
}
