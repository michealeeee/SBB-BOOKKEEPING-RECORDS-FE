import { useMemo, useState } from "react";
import { useApp } from "../../context/AppContext";
import { getPlan, limitLabel } from "../../data/plans";
import { badgeClass, formatDate, formatUsd } from "../../utils/format";

export function SuperAdminOverview() {
  const { tenants, platformStats, plans } = useApp();
  const recent = tenants.slice(0, 5);

  return (
    <div className="app-page">
      <header className="page-header">
        <p>
          Super admin is a platform operator. This login is not a business owner, admin, or staff
          member. It can see every tenant on Bookkeeply.
        </p>
      </header>

      <div className="stats-grid">
        <article className="stat-card income">
          <span>Businesses</span>
          <strong className="num">{platformStats.businesses}</strong>
        </article>
        <article className="stat-card open">
          <span>Members</span>
          <strong className="num">{platformStats.members}</strong>
        </article>
        <article className="stat-card net">
          <span>Active plans</span>
          <strong className="num">{platformStats.active}</strong>
        </article>
        <article className="stat-card expense">
          <span>Monthly revenue</span>
          <strong className="num">{formatUsd(platformStats.mrr)}</strong>
        </article>
      </div>

      <section className="panel">
        <h2>Recent businesses</h2>
        <TenantTable rows={recent} compact />
      </section>

      <section className="panel">
        <h2>Published plans</h2>
        <p className="muted">These limits apply to every tenant on that plan.</p>
        <PlanTable plans={plans} />
      </section>
    </div>
  );
}

export function SuperAdminBusinesses() {
  const { tenants, updateTenantStatus, updateTenantPlan } = useApp();
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");

  const visible = useMemo(
    () =>
      tenants.filter((item) =>
        `${item.name} ${item.email} ${item.owner_email} ${item.businessid}`
          .toLowerCase()
          .includes(query.trim().toLowerCase())
      ),
    [tenants, query]
  );

  return (
    <div className="app-page">
      <header className="page-header">
        <p>Suspend a tenant to block access, or move them to another plan.</p>
      </header>
      {notice ? <p className="form-success" role="status">{notice}</p> : null}
      <section className="panel">
        <div className="toolbar">
          <div className="field">
            <label htmlFor="admin-search">Search</label>
            <input
              id="admin-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Business, owner, or id"
            />
          </div>
        </div>
        <TenantTable
          rows={visible}
          onStatus={(businessid, status) => {
            updateTenantStatus(businessid, status);
            setNotice(status === "suspended" ? "Business suspended." : "Business activated.");
          }}
          onPlan={(businessid, planid) => {
            updateTenantPlan(businessid, planid);
            setNotice("Plan updated for that business.");
          }}
        />
      </section>
    </div>
  );
}

export function SuperAdminPlans() {
  const { plans, tenants, updatePlan } = useApp();
  const [drafts, setDrafts] = useState(() => Object.fromEntries(plans.map((plan) => [plan.planid, { ...plan }])));
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(plans[0]?.planid || "basic");

  const usage = plans.map((plan) => ({
    ...plan,
    used: tenants.filter((item) => item.planid === plan.planid).length,
  }));

  const draft = drafts[editing] || plans.find((item) => item.planid === editing) || plans[0];

  const setDraft = (fields) => {
    setDrafts((current) => ({
      ...current,
      [editing]: { ...(current[editing] || draft), ...fields },
    }));
  };

  const save = (event) => {
    event.preventDefault();
    setError("");
    setNotice("");
    const result = updatePlan(editing, draft);
    if (result?.error) {
      setError(result.error);
      return;
    }
    setNotice(`${draft.name} was updated. Tenants and the pricing page use this catalog.`);
  };

  return (
    <div className="app-page">
      <header className="page-header">
        <p>
          Review every published plan, then change price, billing cycle, and limits. Tenant businesses
          pick from this catalog.
        </p>
      </header>
      {error ? <p className="auth-error" role="alert">{error}</p> : null}
      {notice ? <p className="form-success" role="status">{notice}</p> : null}

      <section className="panel">
        <h2>Plan catalog</h2>
        <PlanTable
          plans={usage}
          showUsage
          selected={editing}
          onSelect={(planid) => {
            setEditing(planid);
            setError("");
            setNotice("");
          }}
        />
      </section>

      {draft ? (
        <section className="panel">
          <h2>Update {draft.name}</h2>
          <p className="muted">planid: {draft.planid}. 0 in a limit means unlimited.</p>
          <form className="form-grid" onSubmit={save}>
            <div className="field">
              <label htmlFor="plan-name">Name</label>
              <input
                id="plan-name"
                value={draft.name || ""}
                onChange={(event) => setDraft({ name: event.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor="plan-desc">Description</label>
              <input
                id="plan-desc"
                value={draft.description || ""}
                onChange={(event) => setDraft({ description: event.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor="plan-price">Price</label>
              <input
                id="plan-price"
                type="number"
                min="0"
                step="0.01"
                value={draft.price}
                onChange={(event) => setDraft({ price: event.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor="plan-cycle">Billing cycle</label>
              <select
                id="plan-cycle"
                value={draft.billing_cycle || "monthly"}
                onChange={(event) => setDraft({ billing_cycle: event.target.value })}
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="plan-customers">Max customers</label>
              <input
                id="plan-customers"
                type="number"
                min="0"
                value={draft.max_customers}
                onChange={(event) => setDraft({ max_customers: event.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor="plan-invoices">Max invoices</label>
              <input
                id="plan-invoices"
                type="number"
                min="0"
                value={draft.max_invoices}
                onChange={(event) => setDraft({ max_invoices: event.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor="plan-users">Max users</label>
              <input
                id="plan-users"
                type="number"
                min="0"
                value={draft.max_users}
                onChange={(event) => setDraft({ max_users: event.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor="plan-active">Available</label>
              <select
                id="plan-active"
                value={draft.active === false ? "false" : "true"}
                onChange={(event) => setDraft({ active: event.target.value === "true" })}
              >
                <option value="true">Active</option>
                <option value="false">Hidden</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="plan-featured">Featured</label>
              <select
                id="plan-featured"
                value={draft.featured ? "true" : "false"}
                onChange={(event) => setDraft({ featured: event.target.value === "true" })}
              >
                <option value="false">No</option>
                <option value="true">Most popular</option>
              </select>
            </div>
            <button className="btn" type="submit">
              Save plan
            </button>
          </form>
        </section>
      ) : null}
    </div>
  );
}

function PlanTable({ plans, showUsage = false, selected, onSelect }) {
  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>Plan</th>
            <th>Billing</th>
            <th className="num">Price</th>
            <th>Customers</th>
            <th>Invoices</th>
            <th>Users</th>
            <th>Status</th>
            {showUsage ? <th className="num">Tenants</th> : null}
            {onSelect ? <th></th> : null}
          </tr>
        </thead>
        <tbody>
          {plans.map((plan) => (
            <tr key={plan.planid} className={selected === plan.planid ? "is-selected" : undefined}>
              <td>
                <strong>{plan.name}</strong>
                {plan.description ? <div className="muted">{plan.description}</div> : null}
              </td>
              <td>{plan.billing_cycle}</td>
              <td className="num">{formatUsd(plan.price)}</td>
              <td>{limitLabel(plan.max_customers)}</td>
              <td>{limitLabel(plan.max_invoices)}</td>
              <td>{limitLabel(plan.max_users)}</td>
              <td>
                <span className={badgeClass(plan.active === false ? "suspended" : "active")}>
                  {plan.active === false ? "hidden" : "active"}
                </span>
              </td>
              {showUsage ? <td className="num">{plan.used}</td> : null}
              {onSelect ? (
                <td>
                  <button type="button" className="btn btn-secondary" onClick={() => onSelect(plan.planid)}>
                    {selected === plan.planid ? "Editing" : "Edit"}
                  </button>
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TenantTable({ rows, compact = false, onStatus, onPlan }) {
  const { plans } = useApp();
  if (rows.length === 0) {
    return <p className="empty-state">No businesses to show.</p>;
  }

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>Business</th>
            <th>Owner</th>
            <th>Plan</th>
            <th>Status</th>
            <th className="num">Members</th>
            <th>Created</th>
            {!compact ? <th></th> : null}
          </tr>
        </thead>
        <tbody>
          {rows.map((item) => (
            <tr key={item.businessid}>
              <td>
                <strong>{item.name}</strong>
                <div className="muted">{item.businessid}</div>
              </td>
              <td>{item.owner_email || "—"}</td>
              <td>{getPlan(item.planid, plans).name}</td>
              <td>
                <span className={badgeClass(item.status)}>{item.status}</span>
              </td>
              <td className="num">{item.members}</td>
              <td>{formatDate(item.created_at)}</td>
              {!compact ? (
                <td>
                  <div className="tenant-actions">
                    <select
                      aria-label={`Plan for ${item.name}`}
                      value={item.planid}
                      onChange={(event) => onPlan?.(item.businessid, event.target.value)}
                    >
                      {plans.map((plan) => (
                        <option key={plan.planid} value={plan.planid}>
                          {plan.name}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() =>
                        onStatus?.(item.businessid, item.status === "suspended" ? "active" : "suspended")
                      }
                    >
                      {item.status === "suspended" ? "Activate" : "Suspend"}
                    </button>
                  </div>
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
