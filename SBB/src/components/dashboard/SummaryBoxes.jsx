import { useApp } from "../../context/AppContext";
import { formatMoney } from "../../utils/format";
import { Link } from "react-router-dom";

export default function SummaryBoxes() {
  const { transactions, invoices } = useApp();
  const recent = transactions.slice(0, 4);
  const openInvoices = invoices.filter((item) => item.status !== "Paid").slice(0, 4);

  return (
    <div className="summaryGrid">
      <section className="panel">
        <h3>Recent Transactions</h3>
        {recent.length === 0 ? (
          <p className="empty-state">No transactions yet.</p>
        ) : (
          recent.map((item) => (
            <div className="summary-item" key={item.id}>
              <span>{item.description}</span>
              <span className={item.type === "income" ? "amount-pos" : "amount-neg"}>
                {item.type === "income" ? "+" : "−"}
                {formatMoney(item.amount)}
              </span>
            </div>
          ))
        )}
        <p>
          <Link to="/app/transactions">View all transactions</Link>
        </p>
      </section>

      <section className="panel">
        <h3>Outstanding Invoices</h3>
        {openInvoices.length === 0 ? (
          <p className="empty-state">No open invoices.</p>
        ) : (
          openInvoices.map((item) => (
            <div className="summary-item" key={item.id}>
              <span>
                {item.id} · {item.customer}
              </span>
              <span>{formatMoney(item.amount)}</span>
            </div>
          ))
        )}
        <p>
          <Link to="/app/invoices">Manage invoices</Link>
        </p>
      </section>
    </div>
  );
}
