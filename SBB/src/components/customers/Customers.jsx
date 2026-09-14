import { useMemo, useState } from "react";
import { useApp } from "../../context/AppContext";
import { formatMoney } from "../../utils/format";
import ConfirmDialog from "../ConfirmDialog";

const emptyForm = { name: "", email: "" };

export default function Customers() {
  const { customers, addCustomer, removeCustomer } = useApp();
  const [form, setForm] = useState(emptyForm);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);

  const visible = useMemo(
    () =>
      customers.filter((item) =>
        `${item.name} ${item.email}`.toLowerCase().includes(query.trim().toLowerCase())
      ),
    [customers, query]
  );

  const submit = (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (!form.name.trim()) {
      setError("Customer name is required.");
      return;
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Enter a valid email or leave it blank.");
      return;
    }
    addCustomer({ name: form.name.trim(), email: form.email.trim() });
    setForm(emptyForm);
    setSuccess("Customer added to this demo session.");
  };

  return (
    <div className="app-page">
      <header className="page-header">
        <p>Customer list with demo balances. These are not live accounts receivable.</p>
      </header>

      <section className="panel">
        <h2>Add customer</h2>
        {error ? <p className="auth-error" role="alert">{error}</p> : null}
        {success ? <p className="form-success" role="status">{success}</p> : null}
        <form className="form-grid" onSubmit={submit}>
          <div className="field">
            <label htmlFor="cus-name">Name</label>
            <input
              id="cus-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="cus-email">Email</label>
            <input
              id="cus-email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
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
            <label htmlFor="cus-search">Search</label>
            <input
              id="cus-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search customers"
            />
          </div>
        </div>
        <div className="table-wrap">
          {visible.length === 0 ? (
            <p className="empty-state">No customers to show.</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th className="num">Balance</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {visible.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.email || "—"}</td>
                    <td className="num">{formatMoney(item.balance)}</td>
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
        title="Remove customer?"
        message={`Remove ${pendingDelete?.name} from the demo list?`}
        confirmLabel="Remove"
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          removeCustomer(pendingDelete.id);
          setPendingDelete(null);
        }}
      />
    </div>
  );
}
