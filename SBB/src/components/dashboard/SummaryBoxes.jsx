import { Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { customerLabel } from "../../utils/entities";
import { formatDate, formatMoney } from "../../utils/format";

export default function SummaryBoxes({ entries }) {
  const { transactions, invoices, findCustomer } = useApp();
  const recent = (entries ?? transactions).slice(0, 5);
  const openInvoices = invoices.filter((item) => item.status !== "paid").slice(0, 5);

  return (
    <div className="summary-grid">
      <section className="panel">
        <h3>Recent entries</h3>
        {recent.length === 0 ? (
          <p className="empty-state">No income or expenses in this period.</p>
        ) : (
          recent.map((item) => (
            <div className="summary-item" key={item.id}>
              <span>
                {item.description}
                <div className="muted">{formatDate(item.date)}</div>
              </span>
              <span className={`num ${item.type === "income" ? "amount-pos" : "amount-neg"}`}>
                {item.type === "income" ? "+" : "−"}
                {formatMoney(item.amount)}
              </span>
            </div>
          ))
        )}
        <Link className="panel-link" to="/app/income">
          Open income
        </Link>
      </section>

      <section className="panel">
        <h3>Unpaid invoices</h3>
        {openInvoices.length === 0 ? (
          <p className="empty-state">No open invoices.</p>
        ) : (
          openInvoices.map((item) => (
            <div className="summary-item" key={item.invoice_no}>
              <span>
                {item.invoice_no} · {customerLabel(findCustomer(item.customer_id))}
                <div className="muted">Due {item.due_date ? formatDate(item.due_date) : "—"}</div>
              </span>
              <span className="num">{formatMoney(item.amount)}</span>
            </div>
          ))
        )}
        <Link className="panel-link" to="/app/invoices">
          Manage invoices
        </Link>
      </section>
    </div>
  );
}
