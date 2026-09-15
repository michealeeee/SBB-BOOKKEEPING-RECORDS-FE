import { useMemo, useState } from "react";
import { useApp } from "../../context/AppContext";
import { formatMoney } from "../../utils/format";
import ConfirmDialog from "../ConfirmDialog";

const emptyForm = { name: "", bank: "", last4: "", balance: "" };

export default function Bank() {
  const { banks = [], addBank, removeBank, totals } = useApp();
  const [form, setForm] = useState(emptyForm);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);

  const visible = useMemo(
    () =>
      banks.filter((item) =>
        `${item.name} ${item.bank}`.toLowerCase().includes(query.trim().toLowerCase())
      ),
    [banks, query]
  );

  const submit = (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (!form.name.trim() || !form.bank.trim()) {
      setError("Account name and bank are required.");
      return;
    }
    if (form.last4 && !/^\d{4}$/.test(form.last4.trim())) {
      setError("Last 4 digits must be four numbers, or leave blank.");
      return;
    }
    addBank({
      name: form.name.trim(),
      bank: form.bank.trim(),
      last4: form.last4.trim(),
      balance: Number(form.balance) || 0,
    });
    setForm(emptyForm);
    setSuccess("Bank account added to this demo session.");
  };

  return (
    <div className="app-page">
      <header className="page-header">
        <p>Track cash accounts used with these demo books.</p>
      </header>

      <div className="stat-pills">
        <div className="stat-pill">Cash on hand {formatMoney(totals.cash)}</div>
        <div className="stat-pill">{banks.length} accounts</div>
      </div>

      <section className="panel">
        <h2>Add account</h2>
        {error ? <p className="auth-error" role="alert">{error}</p> : null}
        {success ? <p className="form-success" role="status">{success}</p> : null}
        <form className="form-grid" onSubmit={submit}>
          <div className="field">
            <label htmlFor="bank-name">Account name</label>
            <input
              id="bank-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="bank-bank">Bank</label>
            <input
              id="bank-bank"
              value={form.bank}
              onChange={(e) => setForm({ ...form, bank: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="bank-last4">Last 4</label>
            <input
              id="bank-last4"
              value={form.last4}
              onChange={(e) => setForm({ ...form, last4: e.target.value })}
              maxLength={4}
            />
          </div>
          <div className="field">
            <label htmlFor="bank-balance">Balance</label>
            <input
              id="bank-balance"
              type="number"
              min="0"
              step="0.01"
              value={form.balance}
              onChange={(e) => setForm({ ...form, balance: e.target.value })}
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
            <label htmlFor="bank-search">Search</label>
            <input
              id="bank-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search accounts"
            />
          </div>
        </div>
        {visible.length === 0 ? (
          <p className="empty-state">No bank accounts to show.</p>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Account</th>
                  <th>Bank</th>
                  <th>Last 4</th>
                  <th className="num">Balance</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {visible.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.bank || "—"}</td>
                    <td>{item.last4 ? `•••• ${item.last4}` : "—"}</td>
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
          </div>
        )}
      </section>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Remove account?"
        message={`Remove ${pendingDelete?.name} from the demo list?`}
        confirmLabel="Remove"
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          removeBank(pendingDelete.id);
          setPendingDelete(null);
        }}
      />
    </div>
  );
}
