import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { limitLabel } from "../../data/plans";
import { formatDate, formatUsd, badgeClass } from "../../utils/format";
import PlanCards from "../PlanCards";

export default function Subscription() {
  const {
    business,
    subscription,
    plan,
    payments,
    customers,
    invoices,
    members,
    choosePlan,
  } = useApp();
  const [notice, setNotice] = useState("");

  const selectPlan = (planid) => {
    choosePlan(planid);
    setNotice("Plan updated for this business. Checkout is not connected, so the payment is marked pending.");
  };

  return (
    <div className="app-page">
      <header className="page-header">
        <p>
          The subscription belongs to {business?.name || "the business"}, not to one user.
          Team members use this plan according to their role.
        </p>
      </header>

      <div className="stats-grid">
        <article className="stat-card net">
          <span>Plan</span>
          <strong>{plan?.name || "None"}</strong>
        </article>
        <article className="stat-card open">
          <span>Status</span>
          <strong className="num">
            <span className={badgeClass(subscription?.status)}>{subscription?.status || "none"}</span>
          </strong>
        </article>
        <article className="stat-card income">
          <span>Price</span>
          <strong className="num">{formatUsd(plan?.price || 0)}</strong>
        </article>
        <article className="stat-card expense">
          <span>Renews</span>
          <strong className="num">{subscription?.end_date ? formatDate(subscription.end_date) : "—"}</strong>
        </article>
      </div>

      <section className="panel">
        <h2>Subscription</h2>
        <p className="muted">
          subscriptionid: {subscription?.subscriptionid || "—"} · planid: {subscription?.planid || plan?.planid || "—"} · businessid: {subscription?.businessid || business?.businessid || "—"}
        </p>
        <p className="muted">
          start_date: {formatDate(subscription?.start_date)} · end_date: {formatDate(subscription?.end_date)} · created_at: {formatDate(subscription?.created_at)} · updated_at: {formatDate(subscription?.updated_at)}
        </p>
      </section>

      <section className="panel">
        <h2>Plan limits</h2>
        <p className="muted">
          Billing cycle: {plan?.billing_cycle}. Usage is counted on this business.
        </p>
        <table className="data-table">
          <thead>
            <tr>
              <th>Limit</th>
              <th>Used</th>
              <th>Allowed</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Customers</td>
              <td>{customers.length}</td>
              <td>{limitLabel(plan?.max_customers)}</td>
            </tr>
            <tr>
              <td>Invoices</td>
              <td>{invoices.length}</td>
              <td>{limitLabel(plan?.max_invoices)}</td>
            </tr>
            <tr>
              <td>Users</td>
              <td>{members.length}</td>
              <td>{limitLabel(plan?.max_users)}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="panel in-app-plans">
        <h2>Change plan</h2>
        {notice ? <p className="form-success" role="status">{notice}</p> : null}
        <PlanCards onChoose={selectPlan} />
      </section>

      <section className="panel">
        <h2>Subscription payments</h2>
        <p className="muted">Payment records for this business subscription.</p>
        {payments.length === 0 ? (
          <p className="empty-state">No payments recorded.</p>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>paymentid</th>
                  <th>userid</th>
                  <th>subscriptionid</th>
                  <th>Date</th>
                  <th>Method</th>
                  <th>Reference</th>
                  <th>Status</th>
                  <th className="num">Amount</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((item) => (
                  <tr key={item.paymentid}>
                    <td>{item.paymentid}</td>
                    <td>{item.userid || "—"}</td>
                    <td>{item.subscriptionid || "—"}</td>
                    <td>{formatDate(item.created_at)}</td>
                    <td>{item.payment_method}</td>
                    <td>{item.transaction_reference}</td>
                    <td>
                      <span className={badgeClass(item.status)}>{item.status}</span>
                    </td>
                    <td className="num">{formatUsd(item.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
