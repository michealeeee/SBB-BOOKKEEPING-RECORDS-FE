import { useMemo, useState } from "react";
import { useApp } from "../../context/AppContext";
import { formatMoney } from "../../utils/format";
import ConfirmDialog from "../ConfirmDialog";

const emptyForm = {
  name: "",
  amount: "",
  category: "",
  date: new Date().toISOString().slice(0, 10),
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
        `${item.name} ${item.category}`.toLowerCase().includes(query.trim().toLowerCase())
      ),
    [expenses, query]
  );

  const submit = (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (!form.name.trim() || !form.amount) {
      setError("Expense name and amount are required.");
      return;
    }
    if (Number(form.amount) <= 0) {
      setError("Amount must be greater than zero.");
      return;
    }
    addExpense({
      ...form,
      name: form.name.trim(),
      amount: Number(form.amount),
    });
    setForm(emptyForm);
    setSuccess("Expense added to this demo session.");
  };

  return (
    <div className="app-page">
      <header className="page-header">
        <div>
          <h1>Expenses</h1>
          <p>Track operating costs. These records are not synced to accounting software.</p>
        </div>
      </header>

      <section className="panel">
        <h2>Add expense</h2>
        {error ? <p className="auth-error" role="alert">{error}</p> : null}
        {success ? <p className="form-success" role="status">{success}</p> : null}
        <form className="form-grid" onSubmit={submit}>
          <div className="field">
            <label htmlFor="exp-name">Name</label>
            <input
              id="exp-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
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
            <label htmlFor="exp-cat">Category</label>
            <input
              id="exp-cat"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="exp-date">Date</label>
            <input
              id="exp-date"
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </div>
          <button className="btn" type="submit">
            Add
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
              placeholder="Search expenses"
            />
          </div>
        </div>
        <div className="table-wrap">
          {visible.length === 0 ? (
            <p className="empty-state">No expenses to show.</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.category || "—"}</td>
                    <td>{item.date || "—"}</td>
                    <td>{formatMoney(item.amount)}</td>
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
          removeExpense(pendingDelete.id);
          setPendingDelete(null);
        }}
      />
    </div>
  );
}
