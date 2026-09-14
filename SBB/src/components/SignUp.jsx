import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useApp } from "../context/AppContext";

function SignUp() {
  const navigate = useNavigate();
  const { signIn } = useApp();
  const [params] = useSearchParams();
  const plan = params.get("plan");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = "Create Account · Bookkeeply";
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password || !confirm) {
      setError("Fill in all fields to create an account.");
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

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    signIn({
      name: name.trim(),
      email: email.trim(),
      plan: plan === "premium" ? "Premium" : plan === "basic" ? "Basic" : undefined,
    });
    navigate("/app", { replace: true });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <Link className="auth-home" to="/">
          Bookkeeply
        </Link>
        <h1>Create Account</h1>
        <p className="auth-lead">
          {plan === "premium"
            ? "Register for the Premium plan"
            : plan === "basic"
              ? "Register for the Basic plan"
              : "Register to get started"}
        </p>

        {error ? (
          <p className="auth-error" role="alert">
            {error}
          </p>
        ) : null}

        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="signup-name">Full name</label>
          <input
            id="signup-name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Alex Mensah"
          />

          <label htmlFor="signup-email">Email address</label>
          <input
            id="signup-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@business.com"
          />

          <label htmlFor="signup-password">Password</label>
          <input
            id="signup-password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="At least 6 characters"
          />

          <label htmlFor="signup-confirm">Confirm password</label>
          <input
            id="signup-confirm"
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(event) => setConfirm(event.target.value)}
            placeholder="Re-enter password"
          />

          <button className="auth-submit" type="submit" disabled={submitting}>
            {submitting ? "Creating account…" : "Sign Up"}
          </button>
        </form>

        <p className="auth-hint">
          Demo only — no server is connected. Your session stays in this
          browser until you log out.
        </p>

        <p className="auth-footer">
          Already have an account?
          <Link to="/signin"> Sign In</Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
