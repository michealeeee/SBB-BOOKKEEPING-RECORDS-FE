import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useApp } from "../context/AppContext";
import {
  SUPER_ADMIN,
  isAdminPassword,
  isSuperAdminEmail,
} from "../data/admin";
import { signupPath } from "../data/plans";
import AuthShell from "./AuthShell";

function SignIn() {
  const navigate = useNavigate();
  const { signIn } = useApp();
  const [params] = useSearchParams();
  const [email, setEmail] = useState(() =>
    params.get("admin") === "1" ? SUPER_ADMIN.email : ""
  );
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = "Sign In · Bookkeeply";
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Enter your email and password to continue.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (isSuperAdminEmail(email)) {
      if (!isAdminPassword(password)) {
        setError("That super admin password is not correct.");
        return;
      }
      setSubmitting(true);
      signIn({
        name: SUPER_ADMIN.name,
        email: SUPER_ADMIN.email,
        role: "super_admin",
      });
      navigate("/admin", { replace: true });
      return;
    }

    setSubmitting(true);
    const localName = email.split("@")[0];
    const name = localName.charAt(0).toUpperCase() + localName.slice(1);
    signIn({ name, email: email.trim(), role: "customer" });
    navigate("/app", { replace: true });
  };

  return (
    <AuthShell>
      <div className="auth-card">
        <Link className="auth-home" to="/">
          Bookkeeply
        </Link>
        <h1>Welcome Back</h1>
        <p className="auth-lead">
          {params.get("admin") === "1"
            ? "Super admin sign in"
            : "Sign in. The books open only after you have a plan."}
        </p>

        {error ? (
          <p className="auth-error" role="alert">
            {error}
          </p>
        ) : null}

        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="signin-email">Email address</label>
          <input
            id="signin-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@business.com"
          />

          <label htmlFor="signin-password">Password</label>
          <input
            id="signin-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter password"
          />

          <button className="auth-submit" type="submit" disabled={submitting}>
            {submitting ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="auth-hint">
          Super admin demo: {SUPER_ADMIN.email} / {SUPER_ADMIN.password}. Customer
          accounts still use any other valid email.
        </p>

        <p className="auth-footer">
          Don&apos;t have an account?
          <Link to={signupPath()}> Sign up</Link>
        </p>
        <p className="auth-footer">
          <Link to="/signin?admin=1"> Super admin</Link>
        </p>
      </div>
    </AuthShell>
  );
}

export default SignIn;
