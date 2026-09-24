import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import AuthShell from "./AuthShell";

function SignIn() {
  const navigate = useNavigate();
  const { signIn } = useApp();
  const [email, setEmail] = useState("");
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

    setSubmitting(true);
    const localName = email.split("@")[0];
    const name = localName.charAt(0).toUpperCase() + localName.slice(1);
    signIn({ first_name: name, last_name: "", email: email.trim() });
    navigate("/app", { replace: true });
  };

  return (
    <AuthShell>
      <div className="auth-card">
        <h1>Welcome Back</h1>
        <p className="auth-lead">Sign in to your account</p>

        {error ? (
          <p className="auth-error" role="alert">
            {error}
          </p>
        ) : null}

        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="signin-email">
            Email address
            <abbr className="req" title="Required">
              *
            </abbr>
          </label>
          <input
            id="signin-email"
            type="email"
            autoComplete="email"
            value={email}
            required
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@business.com"
          />

          <label htmlFor="signin-password">
            Password
            <abbr className="req" title="Required">
              *
            </abbr>
          </label>
          <input
            id="signin-password"
            type="password"
            autoComplete="current-password"
            value={password}
            required
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter password"
          />

          <button className="auth-submit" type="submit" disabled={submitting}>
            {submitting ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="auth-hint">
          Demo only — no server is connected. The password is checked locally and
          is never stored with the user record in this UI.
        </p>

        <p className="auth-footer">
          Don&apos;t have an account?
          <Link to="/signup"> Create Account</Link>
        </p>
        <p className="auth-footer">
          <Link to="/">← Back to home</Link>
        </p>
      </div>
    </AuthShell>
  );
}

export default SignIn;
