import { useMemo, useState } from "react";
import { useApp } from "../../context/AppContext";
import ConfirmDialog from "../ConfirmDialog";

const emptyForm = { name: "", contact: "", email: "" };

export default function Vendors() {
  const { vendors, addVendor, removeVendor } = useApp();
  const [form, setForm] = useState(emptyForm);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);

  const visible = useMemo(
    () =>
      vendors.filter((item) =>
        `${item.name} ${item.email}`.toLowerCase().includes(query.trim().toLowerCase())
      ),
    [vendors, query]
  );

  const submit = (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (!form.name.trim()) {
      setError("Vendor name is required.");
      return;
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Enter a valid email or leave it blank.");
      return;
    }
    addVendor({ ...form, name: form.name.trim() });
    setForm(emptyForm);
    setSuccess("Vendor added to this demo session.");
  };

  return (
    <div className="app-page">
      <header className="page-header">
        <p>Keep supplier contacts in one place.</p>
      </header>

      <section className="panel">
        <h2>Add vendor</h2>
        {error ? <p className="auth-error" role="alert">{error}</p> : null}
        {success ? <p className="form-success" role="status">{success}</p> : null}
        <form className="form-grid" onSubmit={submit}>
          <div className="field">
            <label htmlFor="ven-name">Name</label>
            <input
              id="ven-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="ven-contact">Contact</label>
            <input
              id="ven-contact"
              value={form.contact}
              onChange={(e) => setForm({ ...form, contact: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="ven-email">Email</label>
            <input
              id="ven-email"
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
            <label htmlFor="ven-search">Search</label>
            <input
              id="ven-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search vendors"
            />
          </div>
        </div>
        {visible.length === 0 ? (
          <p className="empty-state">No vendors to show.</p>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Email</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {visible.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.contact || "—"}</td>
                    <td>{item.email || "—"}</td>
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
        title="Remove vendor?"
        message={`Remove ${pendingDelete?.name} from the demo list?`}
        confirmLabel="Remove"
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          removeVendor(pendingDelete.id);
          setPendingDelete(null);
        }}
      />
    </div>
  );
}
