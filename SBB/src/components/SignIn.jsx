import { Link } from "react-router-dom";

function SignIn() {
  return (
    <div className="auth-container">
      <div className="auth-card">

        <h2>Welcome Back</h2>
        <p>Sign in to your account</p>

        <form>

          <input
            type="email"
            placeholder="Email Address"
          />

          <input
            type="password"
            placeholder="Password"
          />

          <button>
            Sign In
          </button>

        </form>

        <p>
          Don't have an account?
          <Link to="/signup"> Create Account</Link>
        </p>

      </div>
    </div>
  );
}

export default SignIn;