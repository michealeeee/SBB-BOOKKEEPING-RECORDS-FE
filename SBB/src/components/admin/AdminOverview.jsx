import { useMemo } from "react";
import { useApp } from "../../context/AppContext";
import { PLANS, getPlan } from "../../data/plans";
import { formatUsd } from "../../utils/format";

export default function AdminOverview() {
  const { accounts } = useApp();

  const stats = useMemo(() => {
    const active = accounts.filter((item) => item.status === "Active");
    const suspended = accounts.filter((item) => item.status === "Suspended");
    const mrr = active.reduce((sum, item) => sum + Number(getPlan(item.plan)?.price || 0), 0);
    const byPlan = PLANS.map((plan) => ({
      ...plan,
      count: accounts.filter((item) => getPlan(item.plan)?.id === plan.id).length,
    }));
    return {
      total: accounts.length,
      active: active.length,
      suspended: suspended.length,
      mrr,
      byPlan,
    };
  }, [accounts]);

  return (
    <div className="app-page">
      <header className="page-header">
        <p>
          Super admin console for Bookkeeply. Tenant books stay in each customer
          session. This view is the SaaS operator list.
        </p>
      </header>

      <div className="stats-grid">
        <article className="stat-card">
          <span>Accounts</span>
          <strong className="num">{stats.total}</strong>
        </article>
        <article className="stat-card income">
          <span>Active</span>
          <strong className="num">{stats.active}</strong>
        </article>
        <article className="stat-card expense">
          <span>Suspended</span>
          <strong className="num">{stats.suspended}</strong>
        </article>
        <article className="stat-card net">
          <span>Demo MRR</span>
          <strong className="num">{formatUsd(stats.mrr)}</strong>
        </article>
      </div>

      <section className="panel">
        <h2>Plans</h2>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Plan</th>
                <th>Price</th>
                <th>Accounts</th>
              </tr>
            </thead>
            <tbody>
              {stats.byPlan.map((plan) => (
                <tr key={plan.id}>
                  <td>{plan.name}</td>
                  <td>{formatUsd(plan.price)} / month</td>
                  <td>{plan.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
