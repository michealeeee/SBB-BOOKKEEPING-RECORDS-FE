import { useMemo, useState } from "react";
import { useApp } from "../../context/AppContext";
import { badgeClass, formatDate, formatUsd } from "../../utils/format";

const emptyForm = {
  name: "",
  plan: "Starter",
  status: "Active",
  renew: "",
};

const PLANS = [
  { name: "Starter", price: 9, detail: "Ledger and reports" },
  { name: "Business", price: 19, detail: "Unlimited invoices and tax estimate" },
  { name: "Professional", price: 39, detail: "Priority support and multi-account books" },
];

export default function Subscribers() {
  const { subscribers, addSubscriber, updateSubscriberStatus } = useApp();
  const [form, setForm] = useState(emptyForm);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const visible = useMemo(
    () =>
      subscribers.filter((item) =>
        `${item.name} ${item.plan}`.toLowerCase().includes(query.trim().toLowerCase())
      ),
    [subscribers, query]
  );

  const submit = (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (!form.name.trim() || !form.renew) {
      setError("Name and renewal date are required.");
      return;
    }
    addSubscriber({ ...form, name: form.name.trim() });
    setForm(emptyForm);
    setSuccess("Subscriber added locally. No billing account was created.");
  };

  return (
    <div className="app-page">
      <header className="page-header">
        <p>Open this page anytime from Subscriptions in the left menu or the header. Plans are billed in USD.</p>
      </header>

      <section className="panel">
        <h2>USD plans</h2>
        <div className="plan-strip">
          {PLANS.map((plan) => (
            <article className="plan-card" key={plan.name}>
              <h3>{plan.name}</h3>
              <p className="plan-price">{formatUsd(plan.price)} / month</p>
              <p className="muted">{plan.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <h2>Add subscriber</h2>
        {error ? <p className="auth-error" role="alert">{error}</p> : null}
        {success ? <p className="form-success" role="status">{success}</p> : null}
        <form className="form-grid" onSubmit={submit}>
          <div className="field">
            <label htmlFor="sub-name">Name</label>
            <input
              id="sub-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="sub-plan">Plan</label>
            <select
              id="sub-plan"
              value={form.plan}
              onChange={(e) => setForm({ ...form, plan: e.target.value })}
            >
              <option>Starter</option>
              <option>Business</option>
              <option>Professional</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="sub-status">Status</label>
            <select
              id="sub-status"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option>Active</option>
              <option>Suspended</option>
              <option>Cancelled</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="sub-renew">Renewal date</label>
            <input
              id="sub-renew"
              type="date"
              value={form.renew}
              onChange={(e) => setForm({ ...form, renew: e.target.value })}
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
            <label htmlFor="sub-search">Search</label>
            <input
              id="sub-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search subscribers"
            />
          </div>
        </div>
        <div className="table-wrap">
          {visible.length === 0 ? (
            <p className="empty-state">No subscribers to show.</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
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
                    <td>{item.plan}</td>
                    <td>
                      <span className={badgeClass(item.status)}>{item.status}</span>
                    </td>
                    <td>{formatDate(item.renew)}</td>
                    <td>
                      {item.status === "Active" ? (
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => updateSubscriberStatus(item.id, "Suspended")}
                        >
                          Suspend
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => updateSubscriberStatus(item.id, "Active")}
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
