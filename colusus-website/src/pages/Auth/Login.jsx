import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import authService from "../../services/authService";

import "./Login.css";


// ------------------------------------------------------------
// COMPANY LOGO
// ------------------------------------------------------------
// Change this path if your actual Colusus logo lives elsewhere.
// If the logo is in /public, you can simply use:
// const LOGO = "/logo.png";
// ------------------------------------------------------------

const LOGO = "/logo.png";


const Login = () => {

  const navigate = useNavigate();


  const [form, setForm] = useState({
    email: "",
    password: "",
  });


  const [loading, setLoading] =
    useState(false);


  const [error, setError] =
    useState("");


  const handleChange = (event) => {

    const {
      name,
      value,
    } = event.target;


    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

  };


  const handleSubmit = async (event) => {

    event.preventDefault();

    setError("");


    if (
      !form.email ||
      !form.password
    ) {

      setError(
        "Please enter your email and password."
      );

      return;

    }


    try {

      setLoading(true);


      const result =
        await authService.login(
          form.email,
          form.password
        );


      if (
        result.user?.role !==
        "CLIENT"
      ) {

        authService.logout();

        setError(
          "This portal is for clients only."
        );

        return;

      }


      navigate("/portal");

    } catch (error) {

      setError(
        error.response?.data?.message ||
        "Unable to sign in. Please check your credentials."
      );

    } finally {

      setLoading(false);

    }

  };


  return (

    <main className="login-page">

      <div className="login-card">


        {/* =====================================================
            LEFT — WELCOME EXPERIENCE
        ===================================================== */}

        <section className="login-welcome">


          {/* BRAND */}
          <div className="login-brand">

            <div className="login-brand-logo">

              <img
                src={LOGO}
                alt="Colusus"
              />

            </div>

            <div className="login-brand-name">

              <strong>
                COLUSUS
              </strong>

              <span>
                Migration Platform
              </span>

            </div>

          </div>


          {/* WELCOME CONTENT */}
          <div className="login-welcome-content">

            <span className="login-eyebrow">
              CLIENT PORTAL
            </span>


            <h1>
              Your journey
              <br />
              starts here.
            </h1>


            <p>
              Welcome back to Colusus. Sign in to
              continue your migration journey, keep
              your documents organized and stay
              up to date with your application.
            </p>


            {/* JOURNEY POINTS */}
            <div className="login-journey-list">

              <div className="login-journey-item">

                <span className="login-journey-number">
                  01
                </span>

                <div>
                  <strong>
                    Manage your application
                  </strong>

                  <span>
                    Follow your progress from one place.
                  </span>
                </div>

              </div>


              <div className="login-journey-item">

                <span className="login-journey-number">
                  02
                </span>

                <div>
                  <strong>
                    Keep documents organized
                  </strong>

                  <span>
                    Upload and track everything securely.
                  </span>
                </div>

              </div>


              <div className="login-journey-item">

                <span className="login-journey-number">
                  03
                </span>

                <div>
                  <strong>
                    Stay informed
                  </strong>

                  <span>
                    Receive important application updates.
                  </span>

                </div>

              </div>

            </div>

          </div>


          {/* BOTTOM TRUST */}
          <div className="login-welcome-footer">

            <div className="login-security-icon">
              ✓
            </div>

            <div>

              <strong>
                Your journey, securely managed.
              </strong>

              <span>
                Your account and application information
                are protected within the Colusus platform.
              </span>

            </div>

          </div>


        </section>



        {/* =====================================================
            RIGHT — LOGIN FORM
        ===================================================== */}

        <section className="login-form-panel">


          {/* FORM HEADER */}
          <div className="login-form-header">

            <span>
              WELCOME BACK
            </span>

            <h2>
              Sign in to your account
            </h2>

            <p>
              Continue where you left off.
              Your migration journey is waiting for you.
            </p>

          </div>


          {/* FORM */}
          <form
            className="login-form"
            onSubmit={handleSubmit}
          >


            {/* ERROR */}
            {error && (

              <div
                className="login-error"
                role="alert"
              >

                <span className="login-error-icon">
                  !
                </span>

                <span>
                  {error}
                </span>

              </div>

            )}


            {/* EMAIL */}
            <div className="form-group">

              <label htmlFor="email">
                Email Address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                autoFocus
              />

            </div>


            {/* PASSWORD */}
            <div className="form-group">

              <div className="form-label-row">

                <label htmlFor="password">
                  Password
                </label>

              </div>


              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="current-password"
              />

            </div>


            {/* SUBMIT */}
            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >

              <span>
                {loading
                  ? "Signing in..."
                  : "Sign In"
                }
              </span>

              {!loading && (
                <span className="login-submit-arrow">
                  →
                </span>
              )}

            </button>


          </form>


          {/* REGISTER */}
          <div className="login-register">

            <span>
              New to Colusus?
            </span>

            <Link to="/register">
              Create an account
              <span>
                →
              </span>
            </Link>

          </div>


          {/* FORM FOOTER */}
          <div className="login-form-footer">

            <span>
              © {new Date().getFullYear()} Colusus
            </span>

            <span className="login-footer-dot" />

            <span>
              Migration Platform
            </span>

          </div>


        </section>


      </div>

    </main>

  );

};


export default Login;