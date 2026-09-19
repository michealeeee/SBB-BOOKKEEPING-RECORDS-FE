import { useState } from "react";
import { useApp } from "../../context/AppContext";

export default function Business() {
  const { business, membership, updateBusiness } = useApp();
  const [form, setForm] = useState({
    name: business?.name || "",
    email: business?.email || "",
    phone: business?.phone || "",
    address: business?.address || "",
  });
  const [success, setSuccess] = useState("");
  const canEdit = membership?.role === "owner" || membership?.role === "admin";

  const submit = (event) => {
    event.preventDefault();
    setSuccess("");
    if (!canEdit) return;
    updateBusiness({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
    });
    setSuccess("Business profile updated. Bookkeeping records stay attached to this businessid.");
  };

  return (
    <div className="app-page">
      <header className="page-header">
        <p>
          The business owns customers, invoices, income, expenses, vendors, and the subscription.
          Users reach it through BusinessMember.
        </p>
      </header>

      <section className="panel">
        <h2>Business profile</h2>
        <p className="muted">Business ID: {business?.businessid}</p>
        {success ? <p className="form-success" role="status">{success}</p> : null}
        <form className="form-grid" onSubmit={submit}>
          <div className="field">
            <label htmlFor="biz-name">Business name</label>
            <input
              id="biz-name"
              value={form.name}
              disabled={!canEdit}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="biz-email">Email</label>
            <input
              id="biz-email"
              type="email"
              value={form.email}
              disabled={!canEdit}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="biz-phone">Phone</label>
            <input
              id="biz-phone"
              value={form.phone}
              disabled={!canEdit}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="biz-address">Address</label>
            <input
              id="biz-address"
              value={form.address}
              disabled={!canEdit}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>
          {canEdit ? (
            <button className="btn" type="submit">
              Save business
            </button>
          ) : (
            <p className="muted">Staff can view the business but cannot edit it.</p>
          )}
        </form>
      </section>
    </div>
  );
}
