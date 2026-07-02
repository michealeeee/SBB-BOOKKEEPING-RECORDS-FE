

export default function Sidebar({ setPage, mobileOpen, setMobileOpen }) {
  const changePage = (page) => {
    setPage(page);
    setMobileOpen(false); // Close menu on mobile after selecting a page
  };

  return (
    <>
      {mobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
        <h2 className="logo">Bookkeeping</h2>

        <button onClick={() => changePage("dashboard")}>Dashboard</button>
        <button onClick={() => changePage("transactions")}>
          Transactions
        </button>
        <button onClick={() => changePage("invoices")}>Invoices</button>
        <button onClick={() => changePage("reports")}>Reports</button>
        <button onClick={() => changePage("expenses")}>Expenses</button>
        <button onClick={() => changePage("vendors")}>Vendors</button>
        <button onClick={() => changePage("customers")}>Customers</button>
        <button onClick={() => changePage("taxes")}>Taxes</button>
        <button onClick={() => changePage("subscribers")}>Subscribers</button>
      </aside>
    </>
  );
}