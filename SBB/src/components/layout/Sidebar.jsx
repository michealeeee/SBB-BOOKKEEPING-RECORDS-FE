export default function Sidebar({ setPage }) {
  return (
    <div className="sidebar">
      <h2 className="logo">Bookkeeply</h2>

      <button onClick={() => setPage("dashboard")}>Dashboard</button>
      <button onClick={() => setPage("transactions")}>Transactions</button>
      <button onClick={() => setPage("invoices")}>Invoices</button>
      <button onClick={() => setPage("reports")}>Reports</button>
      <button onClick={() => setPage("expenses")}>Expenses</button>
      <button onClick={() => setPage("vendors")}>Vendors</button>
      <button onClick={() => setPage("customers")}>Taxes</button>
      <button onClick={() => setPage("subscribers")}>Subscribers</button>
    </div>
  );
}