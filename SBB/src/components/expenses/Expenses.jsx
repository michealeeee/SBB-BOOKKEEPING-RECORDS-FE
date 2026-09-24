import { useMemo, useState } from "react";
import { useApp } from "../../context/AppContext";
import { formatDate, formatMoney } from "../../utils/format";
import ConfirmDialog from "../ConfirmDialog";

const emptyForm = {
  category: "",
  amount: "",
  description: "",
  expense_date: new Date().toISOString().slice(0, 10),
};

export default function Expenses() {
  const { expenses, addExpense, removeExpense } = useApp();
  const [form, setForm] = useState(emptyForm);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);

  const visible = useMemo(
    () =>
      expenses.filter((item) =>
        `${item.category} ${item.description}`.toLowerCase().includes(query.trim().toLowerCase())
      ),
    [expenses, query]
  );

  const submit = (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (!form.category.trim() || !form.amount || !form.expense_date) {
      setError("Category, amount, and expense date are required.");
      return;
    }
    if (Number(form.amount) <= 0) {
      setError("Amount must be greater than zero.");
      return;
    }
    addExpense({
      category: form.category.trim(),
      amount: Number(form.amount),
      description: form.description.trim(),
      expense_date: form.expense_date,
    });
    setForm({ ...emptyForm, expense_date: form.expense_date });
    setSuccess("Expense recorded for this business.");
  };

  return (
    <div className="app-page">
      <header className="page-header">
        <p>Business costs such as rent, salary, transport, and utilities. Owned by the business, not a user.</p>
      </header>

      <section className="panel">
        <h2>Record expense</h2>
        {error ? <p className="auth-error" role="alert">{error}</p> : null}
        {success ? <p className="form-success" role="status">{success}</p> : null}
        <form className="form-grid" onSubmit={submit}>
          <div className="field">
            <label htmlFor="exp-cat">Category</label>
            <input
              id="exp-cat"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="Rent, salary, electricity"
            />
          </div>
          <div className="field">
            <label htmlFor="exp-amount">Amount</label>
            <input
              id="exp-amount"
              type="number"
              min="0"
              step="0.01"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="exp-date">Expense date</label>
            <input
              id="exp-date"
              type="date"
              value={form.expense_date}
              onChange={(e) => setForm({ ...form, expense_date: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="exp-desc">Description</label>
            <input
              id="exp-desc"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <button className="btn" type="submit">
            Record expense
          </button>
        </form>
      </section>

      <section className="panel">
        <div className="toolbar">
          <div className="field">
            <label htmlFor="exp-search">Search</label>
            <input
              id="exp-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search category or description"
            />
          </div>
        </div>
        <div className="table-wrap">
          {visible.length === 0 ? (
            <p className="empty-state">No expenses recorded for this business.</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>expenseid</th>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>created_at</th>
                  <th>updated_at</th>
                  <th className="num">Amount</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {visible.map((item) => (
                  <tr key={item.expenseid}>
                    <td>{item.expenseid}</td>
                    <td>{formatDate(item.expense_date)}</td>
                    <td>{item.category || "—"}</td>
                    <td>{item.description || "—"}</td>
                    <td>{formatDate(item.created_at)}</td>
                    <td>{formatDate(item.updated_at)}</td>
                    <td className="num amount-neg">{formatMoney(item.amount)}</td>
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
        title="Remove expense?"
        message="This only updates demo data in this browser."
        confirmLabel="Remove"
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          removeExpense(pendingDelete.expenseid);
          setPendingDelete(null);
        }}
      />
    </div>
  );
}
