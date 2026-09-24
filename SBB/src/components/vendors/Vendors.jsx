import { useMemo, useState } from "react";
import { useApp } from "../../context/AppContext";
import { vendorLabel } from "../../utils/entities";
import { formatDate } from "../../utils/format";
import ConfirmDialog from "../ConfirmDialog";

const emptyForm = {
  business_name: "",
  contact_person: "",
  email: "",
  phone: "",
  address: "",
};

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
        `${item.business_name} ${item.contact_person} ${item.email}`
          .toLowerCase()
          .includes(query.trim().toLowerCase())
      ),
    [vendors, query]
  );

  const submit = (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (!form.business_name.trim()) {
      setError("Vendor business name is required.");
      return;
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Enter a valid email or leave it blank.");
      return;
    }
    addVendor({
      business_name: form.business_name.trim(),
      contact_person: form.contact_person.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
    });
    setForm(emptyForm);
    setSuccess("Vendor added to this business.");
  };

  return (
    <div className="app-page">
      <header className="page-header">
        <p>Vendors supply goods or services to the business.</p>
      </header>

      <section className="panel">
        <h2>Add vendor</h2>
        {error ? <p className="auth-error" role="alert">{error}</p> : null}
        {success ? <p className="form-success" role="status">{success}</p> : null}
        <form className="form-grid" onSubmit={submit}>
          <div className="field">
            <label htmlFor="ven-name">Business name</label>
            <input
              id="ven-name"
              value={form.business_name}
              onChange={(e) => setForm({ ...form, business_name: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="ven-contact">Contact person</label>
            <input
              id="ven-contact"
              value={form.contact_person}
              onChange={(e) => setForm({ ...form, contact_person: e.target.value })}
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
          <div className="field">
            <label htmlFor="ven-phone">Phone</label>
            <input
              id="ven-phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="ven-address">Address</label>
            <input
              id="ven-address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
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
                  <th>vendorid</th>
                  <th>Business name</th>
                  <th>Contact person</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>created_at</th>
                  <th>updated_at</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {visible.map((item) => (
                  <tr key={item.vendorid}>
                    <td>{item.vendorid}</td>
                    <td>{item.business_name}</td>
                    <td>{item.contact_person || "—"}</td>
                    <td>{item.email || "—"}</td>
                    <td>{item.phone || "—"}</td>
                    <td>{item.address || "—"}</td>
                    <td>{formatDate(item.created_at)}</td>
                    <td>{formatDate(item.updated_at)}</td>
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
        message={`Remove ${vendorLabel(pendingDelete)} from this business?`}
        confirmLabel="Remove"
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          removeVendor(pendingDelete.vendorid);
          setPendingDelete(null);
        }}
      />
    </div>
  );
}
