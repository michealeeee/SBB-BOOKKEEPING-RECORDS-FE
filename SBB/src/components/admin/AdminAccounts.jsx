import { useMemo, useState } from "react";
import { useApp } from "../../context/AppContext";
import { PLANS, getPlan } from "../../data/plans";
import { badgeClass, formatDate } from "../../utils/format";

const emptyForm = {
  name: "",
  email: "",
  plan: "Business",
  status: "Active",
  renew: "",
};

export default function AdminAccounts() {
  const { accounts, upsertAccount, updateAccountStatus, updateAccountPlan } = useApp();
  const [form, setForm] = useState(emptyForm);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const visible = useMemo(
    () =>
      accounts.filter((item) =>
        `${item.name} ${item.email} ${item.plan} ${item.status}`
          .toLowerCase()
          .includes(query.trim().toLowerCase())
      ),
    [accounts, query]
  );

  const submit = (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (!form.name.trim() || !form.email.trim() || !form.renew) {
      setError("Name, email, and renewal date are required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    upsertAccount({
      ...form,
      name: form.name.trim(),
      email: form.email.trim(),
      plan: getPlan(form.plan)?.name || form.plan,
    });
    setForm(emptyForm);
    setSuccess("Account saved in this browser. No live billing was changed.");
  };

  return (
    <div className="app-page">
      <header className="page-header">
        <p>
          Every customer who signs up is listed here. Suspend to lock their
          books. Activate to let them in again.
        </p>
      </header>

      <section className="panel">
        <h2>Add account</h2>
        {error ? <p className="auth-error" role="alert">{error}</p> : null}
        {success ? <p className="form-success" role="status">{success}</p> : null}
        <form className="form-grid" onSubmit={submit}>
          <div className="field">
            <label htmlFor="acct-name">Name</label>
            <input
              id="acct-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="acct-email">Email</label>
            <input
              id="acct-email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="acct-plan">Plan</label>
            <select
              id="acct-plan"
              value={form.plan}
              onChange={(e) => setForm({ ...form, plan: e.target.value })}
            >
              {PLANS.map((plan) => (
                <option key={plan.id}>{plan.name}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="acct-status">Status</label>
            <select
              id="acct-status"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option>Active</option>
              <option>Suspended</option>
              <option>Cancelled</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="acct-renew">Renewal date</label>
            <input
              id="acct-renew"
              type="date"
              value={form.renew}
              onChange={(e) => setForm({ ...form, renew: e.target.value })}
            />
          </div>
          <button className="btn" type="submit">
            Save
          </button>
        </form>
      </section>

      <section className="panel">
        <div className="toolbar">
          <div className="field">
            <label htmlFor="acct-search">Search</label>
            <input
              id="acct-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search accounts"
            />
          </div>
        </div>
        <div className="table-wrap">
          {visible.length === 0 ? (
            <p className="empty-state">No accounts to show.</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Plan</th>
                  <th>Status</th>
                  <th>Renewal</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.email}</td>
                    <td>
                      <select
                        aria-label={`Plan for ${item.name}`}
                        value={getPlan(item.plan)?.name || item.plan}
                        onChange={(e) => updateAccountPlan(item.id, e.target.value)}
                      >
                        {PLANS.map((plan) => (
                          <option key={plan.id}>{plan.name}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <span className={badgeClass(item.status)}>{item.status}</span>
                    </td>
                    <td>{formatDate(item.renew)}</td>
                    <td>
                      {item.status === "Active" ? (
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => updateAccountStatus(item.id, "Suspended")}
                        >
                          Suspend
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => updateAccountStatus(item.id, "Active")}
                        >
                          Activate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}
