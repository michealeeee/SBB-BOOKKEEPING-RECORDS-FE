import { Link } from "react-router-dom";

export default function AuthShell({ children }) {
  return (
    <div className="auth-shell">
      <aside className="auth-brand-panel">
        <Link className="auth-kicker" to="/">
          Bookkeeply
        </Link>
        <h2>A quiet ledger for the business, not just one login.</h2>
        <p>
          You sign in as a user, join a business as a member, and keep customers,
          invoices, income, expenses, and vendors on that business.
        </p>
        <ul>
          <li>User, membership, and business</li>
          <li>Income linked to invoices</li>
          <li>One subscription for the whole team</li>
        </ul>
      </aside>
      <div className="auth-stage">{children}</div>
    </div>
  );
}
