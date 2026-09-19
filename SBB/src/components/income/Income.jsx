import { useMemo, useState } from "react";
import { useApp } from "../../context/AppContext";
import { formatDate, formatMoney } from "../../utils/format";
import ConfirmDialog from "../ConfirmDialog";

const emptyForm = {
  source: "",
  amount: "",
  description: "",
  transaction_date: new Date().toISOString().slice(0, 10),
  invoiceid: "",
};

export default function Income() {
  const { income, invoices, addIncome, removeIncome } = useApp();
  const [form, setForm] = useState(emptyForm);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);

  const visible = useMemo(
    () =>
      income.filter((item) =>
        `${item.source} ${item.description} ${item.invoiceid || ""}`
          .toLowerCase()
          .includes(query.trim().toLowerCase())
      ),
    [income, query]
  );

  const submit = (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (!form.source.trim() || !form.amount || !form.transaction_date) {
      setError("Source, amount, and transaction date are required.");
      return;
    }
    if (Number(form.amount) <= 0) {
      setError("Amount must be greater than zero.");
      return;
    }
    addIncome({
      source: form.source.trim(),
      amount: Number(form.amount),
      description: form.description.trim(),
      transaction_date: form.transaction_date,
      invoiceid: form.invoiceid || null,
    });
    setForm({ ...emptyForm, transaction_date: form.transaction_date });
    setSuccess("Income recorded for this business. It is not tied to a user account.");
  };

  return (
    <div className="app-page">
      <header className="page-header">
        <p>
          Income belongs to the business. Optionally link a payment to an invoice.
        </p>
      </header>

      <section className="panel">
        <h2>Record income</h2>
        {error ? <p className="auth-error" role="alert">{error}</p> : null}
        {success ? <p className="form-success" role="status">{success}</p> : null}
        <form className="form-grid" onSubmit={submit}>
          <div className="field">
            <label htmlFor="inc-source">Source</label>
            <input
              id="inc-source"
              value={form.source}
              onChange={(e) => setForm({ ...form, source: e.target.value })}
              placeholder="Sales, consulting, retainer"
            />
          </div>
          <div className="field">
            <label htmlFor="inc-amount">Amount</label>
            <input
              id="inc-amount"
              type="number"
              min="0"
              step="0.01"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="inc-date">Transaction date</label>
            <input
              id="inc-date"
              type="date"
              value={form.transaction_date}
              onChange={(e) => setForm({ ...form, transaction_date: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="inc-invoice">Invoice (optional)</label>
            <select
              id="inc-invoice"
              value={form.invoiceid}
              onChange={(e) => setForm({ ...form, invoiceid: e.target.value })}
            >
              <option value="">None</option>
              {invoices.map((invoice) => (
                <option key={invoice.invoice_no} value={invoice.invoice_no}>
                  {invoice.invoice_no} · {invoice.status}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="inc-desc">Description</label>
            <input
              id="inc-desc"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <button className="btn" type="submit">
            Record income
          </button>
        </form>
      </section>

      <section className="panel">
        <div className="toolbar">
          <div className="field">
            <label htmlFor="inc-search">Search</label>
            <input
              id="inc-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search source, invoice, or description"
            />
          </div>
        </div>
        <div className="table-wrap">
          {visible.length === 0 ? (
            <p className="empty-state">No income recorded for this business.</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>incomeid</th>
                  <th>Date</th>
                  <th>Source</th>
                  <th>Invoice</th>
                  <th>Description</th>
                  <th>created_at</th>
                  <th>updated_at</th>
                  <th className="num">Amount</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {visible.map((item) => (
                  <tr key={item.incomeid}>
                    <td>{item.incomeid}</td>
                    <td>{formatDate(item.transaction_date)}</td>
                    <td>{item.source || "—"}</td>
                    <td>{item.invoiceid || "—"}</td>
                    <td>{item.description || "—"}</td>
                    <td>{formatDate(item.created_at)}</td>
                    <td>{formatDate(item.updated_at)}</td>
                    <td className="num amount-pos">{formatMoney(item.amount)}</td>
                    <td>
                      <button
                        type="button"
                        className="btn-ghost"
                        onClick={() => setPendingDelete(item)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Remove income?"
        message="This only removes the record from this browser demo."
        confirmLabel="Remove"
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          removeIncome(pendingDelete.incomeid);
          setPendingDelete(null);
        }}
      />
    </div>
  );
}
