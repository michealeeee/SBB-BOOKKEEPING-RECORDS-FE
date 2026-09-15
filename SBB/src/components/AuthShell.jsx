import { Link } from "react-router-dom";

export default function AuthShell({ children }) {
  return (
    <div className="auth-shell">
      <aside className="auth-brand-panel">
        <Link className="auth-kicker" to="/">
          Bookkeeply
        </Link>
        <h2>A quiet ledger for everyday books.</h2>
        <p>
          Record income and expenses, send invoices, and read a simple profit
          and loss — stored in this browser.
        </p>
        <ul>
          <li>Daily and weekly entries</li>
          <li>Invoices and open balances</li>
          <li>Local books, no server</li>
        </ul>
      </aside>
      <div className="auth-stage">{children}</div>
    </div>
  );
}
