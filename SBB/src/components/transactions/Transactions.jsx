import { useMemo, useState } from "react";
import { useApp } from "../../context/AppContext";
import { formatDate, formatMoney } from "../../utils/format";
import ConfirmDialog from "../ConfirmDialog";

const emptyForm = {
  date: new Date().toISOString().slice(0, 10),
  description: "",
  category: "Sales",
  type: "income",
  amount: "",
};

export default function Transactions() {
  const { transactions, addTransaction, removeTransaction } = useApp();
  const [form, setForm] = useState(emptyForm);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);

  const visible = useMemo(() => {
    return transactions.filter((item) => {
      const matchesType = typeFilter === "all" || item.type === typeFilter;
      const haystack = `${item.description} ${item.category}`.toLowerCase();
      return matchesType && haystack.includes(query.trim().toLowerCase());
    });
  }, [transactions, query, typeFilter]);

  const submit = (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (!form.description.trim() || !form.amount) {
      setError("Add a description and amount.");
      return;
    }
    if (Number(form.amount) <= 0) {
      setError("Amount must be greater than zero.");
      return;
    }
    addTransaction({
      ...form,
      amount: Number(form.amount),
      description: form.description.trim(),
    });
    setForm(emptyForm);
    setSuccess("Transaction added to this demo session.");
  };

  return (
    <div className="app-page">
      <header className="page-header">
        <p>Record income and expenses. Your ledger is saved in this browser.</p>
      </header>

      <section className="panel">
        <h2>Add transaction</h2>
        {error ? <p className="auth-error" role="alert">{error}</p> : null}
        {success ? <p className="form-success" role="status">{success}</p> : null}
        <form className="form-grid" onSubmit={submit}>
          <div className="field">
            <label htmlFor="txn-date">Date</label>
            <input
              id="txn-date"
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="txn-desc">Description</label>
            <input
              id="txn-desc"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Client payment"
            />
          </div>
          <div className="field">
            <label htmlFor="txn-cat">Category</label>
            <input
              id="txn-cat"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="txn-type">Type</label>
            <select
              id="txn-type"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="txn-amt">Amount</label>
            <input
              id="txn-amt"
              type="number"
              min="0"
              step="0.01"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
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
            <label htmlFor="txn-search">Search</label>
            <input
              id="txn-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search description or category"
            />
          </div>
          <div className="field">
            <label htmlFor="txn-filter">Filter</label>
            <select
              id="txn-filter"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
        </div>

        <div className="table-wrap">
          {visible.length === 0 ? (
            <p className="empty-state">No transactions match this search.</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th className="num">Amount</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {visible.map((item) => (
                  <tr key={item.id}>
                    <td>{formatDate(item.date)}</td>
                    <td>{item.description}</td>
                    <td>{item.category}</td>
                    <td>
                      <span className={`badge badge-${item.type}`}>{item.type}</span>
                    </td>
                    <td className={`num ${item.type === "income" ? "amount-pos" : "amount-neg"}`}>
                      {formatMoney(item.amount)}
                    </td>
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
        title="Remove transaction?"
        message="This only removes it from the demo data in this browser."
        confirmLabel="Remove"
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          removeTransaction(pendingDelete.id);
          setPendingDelete(null);
        }}
      />
    </div>
  );
}
