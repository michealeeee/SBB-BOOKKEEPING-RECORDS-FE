import { useMemo, useState } from "react";
import { useApp } from "../../context/AppContext";
import { customerLabel } from "../../utils/entities";
import { formatDate, formatMoney } from "../../utils/format";
import ConfirmDialog from "../ConfirmDialog";

const emptyForm = {
  first_name: "",
  last_name: "",
  business_name: "",
  email: "",
  phone_number: "",
  address: "",
};

export default function Customers() {
  const { customers, invoices, addCustomer, removeCustomer } = useApp();
  const [form, setForm] = useState(emptyForm);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);

  const visible = useMemo(
    () =>
      customers.filter((item) =>
        `${item.customerid} ${item.first_name} ${item.last_name} ${item.business_name} ${item.email} ${item.phone_number} ${item.address}`
          .toLowerCase()
          .includes(query.trim().toLowerCase())
      ),
    [customers, query]
  );

  const openBalance = (customerid) =>
    invoices
      .filter((invoice) => invoice.customer_id === customerid && invoice.status !== "paid")
      .reduce((sum, invoice) => sum + Number(invoice.amount || 0), 0);

  const submit = (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (!form.first_name.trim() && !form.business_name.trim()) {
      setError("Add a person name or a customer business name.");
      return;
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Enter a valid email or leave it blank.");
      return;
    }
    const result = addCustomer({
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      business_name: form.business_name.trim(),
      email: form.email.trim(),
      phone_number: form.phone_number.trim(),
      address: form.address.trim(),
    });
    if (result?.error) {
      setError(result.error);
      return;
    }
    setForm(emptyForm);
    setSuccess("Customer added to this business. The backend would attach businessid from your membership.");
  };

  return (
    <div className="app-page">
      <header className="page-header">
        <p>Customers belong to the logged-in business. You do not pick a business when adding one.</p>
      </header>

      <section className="panel">
        <h2>Add customer</h2>
        {error ? <p className="auth-error" role="alert">{error}</p> : null}
        {success ? <p className="form-success" role="status">{success}</p> : null}
        <form className="form-grid" onSubmit={submit}>
          <div className="field">
            <label htmlFor="cus-first">First name</label>
            <input
              id="cus-first"
              value={form.first_name}
              onChange={(e) => setForm({ ...form, first_name: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="cus-last">Last name</label>
            <input
              id="cus-last"
              value={form.last_name}
              onChange={(e) => setForm({ ...form, last_name: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="cus-biz">Business name</label>
            <input
              id="cus-biz"
              value={form.business_name}
              onChange={(e) => setForm({ ...form, business_name: e.target.value })}
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
          <div className="field">
            <label htmlFor="cus-phone">Phone number</label>
            <input
              id="cus-phone"
              value={form.phone_number}
              onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="cus-address">Address</label>
            <input
              id="cus-address"
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
                  <th>customerid</th>
                  <th>First name</th>
                  <th>Last name</th>
                  <th>Business name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>created_at</th>
                  <th>updated_at</th>
                  <th className="num">Open invoices</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {visible.map((item) => (
                  <tr key={item.customerid}>
                    <td>{item.customerid}</td>
                    <td>{item.first_name || "—"}</td>
                    <td>{item.last_name || "—"}</td>
                    <td>{item.business_name || "—"}</td>
                    <td>{item.email || "—"}</td>
                    <td>{item.phone_number || "—"}</td>
                    <td>{item.address || "—"}</td>
                    <td>{formatDate(item.created_at)}</td>
                    <td>{formatDate(item.updated_at)}</td>
                    <td className="num">{formatMoney(openBalance(item.customerid))}</td>
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
        message={`Remove ${customerLabel(pendingDelete)} from this business?`}
        confirmLabel="Remove"
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          removeCustomer(pendingDelete.customerid);
          setPendingDelete(null);
        }}
      />
    </div>
  );
}
