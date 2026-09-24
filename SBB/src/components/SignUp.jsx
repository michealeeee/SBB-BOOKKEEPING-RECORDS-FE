import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { getPlan } from "../data/plans";
import { isSuperAdminEmail } from "../data/superAdmin";
import AuthShell from "./AuthShell";

function SignUp() {
  const navigate = useNavigate();
  const { registerBusiness, plans } = useApp();
  const [params] = useSearchParams();
  const planid = params.get("plan") || "basic";
  const selected = getPlan(planid, plans);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = "Create Account · Bookkeeply";
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (!firstName.trim() || !email.trim() || !password || !confirm || !businessName.trim()) {
      setError("First name, email, password, and business name are required.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }

    if (isSuperAdminEmail(email.trim())) {
      setError("That email is reserved for the Bookkeeply super admin. Sign in instead.");
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
    registerBusiness({
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email: email.trim(),
      business_name: businessName.trim(),
      business_email: businessEmail.trim(),
      phone: phone.trim(),
      address: address.trim(),
      planid: selected.planid,
    });
    navigate("/app", { replace: true });
  };

  return (
    <AuthShell>
      <div className="auth-card">
        <h1>Create Account</h1>
        <p className="auth-lead">
          Register as a user and create a business on the {selected.name} plan.
          The password stays on this form and is never stored in the books UI.
        </p>

        {error ? (
          <p className="auth-error" role="alert">
            {error}
          </p>
        ) : null}

        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="signup-first">First name</label>
          <input
            id="signup-first"
            type="text"
            autoComplete="given-name"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            placeholder="Alex"
          />

          <label htmlFor="signup-last">Last name</label>
          <input
            id="signup-last"
            type="text"
            autoComplete="family-name"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            placeholder="Mensah"
          />

          <label htmlFor="signup-email">Email</label>
          <input
            id="signup-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@business.com"
          />

          <label htmlFor="signup-business">Business name</label>
          <input
            id="signup-business"
            type="text"
            value={businessName}
            onChange={(event) => setBusinessName(event.target.value)}
            placeholder="Northwind Books"
          />

          <label htmlFor="signup-biz-email">Business email</label>
          <input
            id="signup-biz-email"
            type="email"
            value={businessEmail}
            onChange={(event) => setBusinessEmail(event.target.value)}
            placeholder="hello@business.com"
          />

          <label htmlFor="signup-phone">Business phone</label>
          <input
            id="signup-phone"
            type="text"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="Optional"
          />

          <label htmlFor="signup-address">Business address</label>
          <input
            id="signup-address"
            type="text"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            placeholder="Optional"
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
            {submitting ? "Creating account…" : "Create business"}
          </button>
        </form>

        <p className="auth-hint">
          Demo only. You become the business owner. Staff can be added later from Team.
        </p>

        <p className="auth-footer">
          Already have an account?
          <Link to="/signin"> Sign In</Link>
        </p>
        <p className="auth-footer">
          <Link to="/">← Back to home</Link>
        </p>
      </div>
    </AuthShell>
  );
}

export default SignUp;
