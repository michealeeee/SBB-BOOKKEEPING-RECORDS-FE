import { useMemo, useState } from "react";
import { useApp } from "../../context/AppContext";
import { PLANS, getPlan, limitLabel } from "../../data/plans";
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
  const { tenants } = useApp();
  const usage = PLANS.map((plan) => ({
    ...plan,
    used: tenants.filter((item) => item.planid === plan.planid).length,
  }));

  return (
    <div className="app-page">
      <header className="page-header">
        <p>Plans are system-wide. Tenants subscribe; the super admin is not billed.</p>
      </header>
      <section className="panel">
        <h2>Plan catalog</h2>
        <PlanTable plans={usage} showUsage />
      </section>
    </div>
  );
}

function PlanTable({ plans, showUsage = false }) {
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
            {showUsage ? <th className="num">Tenants</th> : null}
          </tr>
        </thead>
        <tbody>
          {plans.map((plan) => (
            <tr key={plan.planid}>
              <td>{plan.name}</td>
              <td>{plan.billing_cycle}</td>
              <td className="num">{formatUsd(plan.price)}</td>
              <td>{limitLabel(plan.max_customers)}</td>
              <td>{limitLabel(plan.max_invoices)}</td>
              <td>{limitLabel(plan.max_users)}</td>
              {showUsage ? <td className="num">{plan.used}</td> : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TenantTable({ rows, compact = false, onStatus, onPlan }) {
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
              <td>{getPlan(item.planid).name}</td>
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
                      {PLANS.map((plan) => (
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
