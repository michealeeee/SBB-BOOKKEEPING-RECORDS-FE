export default function Suspended() {
  return (
    <div className="app-page">
      <header className="page-header">
        <div>
          <h2>Account suspended</h2>
          <p>
            A Bookkeeply super admin locked this account. The books stay closed
            until the account is activated again.
          </p>
        </div>
      </header>
      <section className="panel">
        <p className="muted">
          Demo only — status is stored in this browser. Log out, then sign in as
          the super admin to activate the account.
        </p>
      </section>
    </div>
  );
}
