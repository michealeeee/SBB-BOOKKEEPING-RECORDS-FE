import { Link } from "react-router-dom";

function SignUp() {

  return (
    <div className="auth-container">

      <div className="auth-card">

        <h2>Create Account</h2>
        <p>Register to get started</p>


        <form>

          <input
            type="text"
            placeholder="Full Name"
          />


          <input
            type="email"
            placeholder="Email Address"
          />


          <input
            type="password"
            placeholder="Password"
          />


          <input
            type="password"
            placeholder="Confirm Password"
          />


          <button>
            Sign Up
          </button>

        </form>


        <p>
          Already have an account?
          <Link to="/"> Sign In</Link>
        </p>


      </div>

    </div>
  );
}

export default SignUp;