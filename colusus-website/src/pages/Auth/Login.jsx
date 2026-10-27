
import { useState } from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import authService from "../../services/authService";

import "./Login.css";

const PENDING_APPLICATION_KEY = "colossus_pending_application";
const PENDING_APPLICATION_RETURN_KEY =
  "colossus_pending_application_return_to";

const getPendingApplication = () => {
  try {
    const stored = sessionStorage.getItem(PENDING_APPLICATION_KEY);

    if (!stored) return null;

    const parsed = JSON.parse(stored);

    return parsed && typeof parsed === "object" ? parsed : null;
  } catch (error) {
    console.error("Unable to restore pending application:", error);
    return null;
  }
};

const getPendingReturnTo = () => {
  try {
    return sessionStorage.getItem(PENDING_APPLICATION_RETURN_KEY);
  } catch (error) {
    console.error("Unable to restore application destination:", error);
    return null;
  }
};

const isApplicationDestination = (path) => {
  return (
    typeof path === "string" &&
    path.startsWith("/") &&
    !path.startsWith("//") &&
    path.split("?")[0].split("#")[0] ===
    "/portal/applications/new"
  );
};

const isAssessmentDestination = (path) => {
  return (
    typeof path === "string" &&
    path.startsWith("/") &&
    !path.startsWith("//") &&
    path.split("?")[0].split("#")[0] ===
    "/trainee-program-assessment"
  );
};

const hasSelectedPathway = (application) => {
  if (!application || typeof application !== "object") {
    return false;
  }

  const opportunity = application.opportunity;

  return Boolean(
    application.opportunityId ||
    application.opportunitySlug ||
    (
      opportunity &&
      typeof opportunity === "object" &&
      (
        opportunity._id ||
        opportunity.id ||
        opportunity.slug
      )
    )
  );
};

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const storedApplication = getPendingApplication();
  const storedReturnTo = getPendingReturnTo();

  const stateReturnTo = location.state?.returnTo;
  const stateReturnState = location.state?.returnState;

  const isAssessmentFlow =
    location.state?.source === "trainee-program-assessment";

  const assessmentReturnTo = location.state?.returnTo;
  const assessmentReturnState = location.state?.returnState || null;

  const hasPendingAssessment = Boolean(
    isAssessmentFlow &&
    isAssessmentDestination(assessmentReturnTo)
  );

  const candidateReturnTo = stateReturnTo || storedReturnTo || null;

  const candidateReturnState =
    stateReturnState || storedApplication || null;

  const hasPendingApplication = Boolean(
    isApplicationDestination(candidateReturnTo) &&
    hasSelectedPathway(candidateReturnState)
  );

  const returnTo = hasPendingApplication ? candidateReturnTo : null;
  const returnState = hasPendingApplication
    ? candidateReturnState
    : null;

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const preserveApplicationContext = () => {
    if (!hasPendingApplication) return;

    try {
      sessionStorage.setItem(
        PENDING_APPLICATION_KEY,
        JSON.stringify(returnState)
      );

      sessionStorage.setItem(
        PENDING_APPLICATION_RETURN_KEY,
        returnTo
      );
    } catch (storageError) {
      console.error(
        "Unable to preserve application context:",
        storageError
      );
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handlePostLoginRedirect = () => {
    if (hasPendingAssessment) {
      navigate(assessmentReturnTo, {
        replace: true,
        state: {
          ...(assessmentReturnState || {}),
          source: "trainee-program-assessment",
          assessmentAuthSuccess: true,
          authenticatedEmail: form.email.trim().toLowerCase(),
        },
      });

      return;
    }

    if (hasPendingApplication) {
      preserveApplicationContext();

      navigate(returnTo, {
        state: returnState,
        replace: true,
      });

      return;
    }

    navigate("/portal", {
      replace: true,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.email.trim() || !form.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      preserveApplicationContext();

      const result = await authService.login(
        form.email.trim().toLowerCase(),
        form.password
      );

      if (result?.user?.role !== "CLIENT") {
        authService.logout();

        setError("This portal is for clients only.");
        return;
      }

      handlePostLoginRedirect();
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Unable to sign in. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  const registrationState = hasPendingAssessment
    ? {
      source: "trainee-program-assessment",
      returnTo: assessmentReturnTo,
      returnState: assessmentReturnState,
    }
    : hasPendingApplication
      ? { returnTo, returnState }
      : null;

  return (
    <main className="login-page">
      <div className="login-card">
        <section className="login-welcome">
          <div className="login-brand">
            <div className="login-brand-logo">
              <img src="/logo.png" alt="Colossus" />
            </div>

            <div className="login-brand-name">
              <strong>colossus</strong>
              <span>Migration Platform</span>
            </div>
          </div>

          <div className="login-welcome-content">
            <span className="login-eyebrow">CLIENT PORTAL</span>

            <h1>
              Your journey
              <br />
              starts here.
            </h1>

            <p>
              Welcome back to Colossus. Sign in to continue your
              migration journey, keep your documents organized and
              stay up to date with your application.
            </p>

            <div className="login-journey-list">
              <div className="login-journey-item">
                <span className="login-journey-number">01</span>
                <div>
                  <strong>Manage your application</strong>
                  <span>Follow your progress from one place.</span>
                </div>
              </div>

              <div className="login-journey-item">
                <span className="login-journey-number">02</span>
                <div>
                  <strong>Keep documents organized</strong>
                  <span>Upload and track everything securely.</span>
                </div>
              </div>

              <div className="login-journey-item">
                <span className="login-journey-number">03</span>
                <div>
                  <strong>Stay informed</strong>
                  <span>Receive important application updates.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="login-welcome-footer">
            <div className="login-security-icon">✓</div>
            <div>
              <strong>Your journey, securely managed.</strong>
              <span>
                Your account and application information are protected
                within the Colossus platform.
              </span>
            </div>
          </div>
        </section>

        <section className="login-form-panel">
          <div className="login-form-header">
            <span>
              {hasPendingAssessment
                ? "CONTINUE YOUR ASSESSMENT"
                : hasPendingApplication
                  ? "CONTINUE YOUR JOURNEY"
                  : "WELCOME BACK"}
            </span>

            <h2>
              {hasPendingAssessment
                ? "Continue your assessment"
                : hasPendingApplication
                  ? "Continue your application"
                  : "Sign in to your account"}
            </h2>

            <p>
              {hasPendingAssessment
                ? "Sign in to return to your saved assessment and submit it when you're ready."
                : hasPendingApplication
                  ? "Sign in to continue with the migration pathway you selected."
                  : "Sign in to access your client portal, manage your documents and track your migration journey."}
            </p>
          </div>

          {(hasPendingApplication || hasPendingAssessment) && (
            <div className="login-pathway-notice">
              <span aria-hidden="true">✓</span>

              <div>
                <strong>
                  {hasPendingAssessment
                    ? "Your assessment is saved"
                    : "Your pathway is saved"}
                </strong>

                <p>
                  {hasPendingAssessment
                    ? "After signing in, you will return to your assessment."
                    : "After signing in, you'll return to the application for your selected migration pathway."}
                </p>
              </div>
            </div>
          )}

          <form className="login-form" onSubmit={handleSubmit}>
            {error && (
              <div className="login-error" role="alert">
                <span className="login-error-icon">!</span>
                <span>{error}</span>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email Address</label>

              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                autoFocus
                required
              />
            </div>

            <div className="form-group">
              <div className="form-label-row">
                <label htmlFor="password">Password</label>
              </div>

              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
            </div>

            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >
              <span>
                {loading
                  ? "Signing in..."
                  : hasPendingAssessment
                    ? "Return to assessment"
                    : hasPendingApplication
                      ? "Continue to application"
                      : "Sign In"}
              </span>

              {!loading && (
                <span className="login-submit-arrow">→</span>
              )}
            </button>
          </form>

          <div className="login-register">
            <span>New to Colossus?</span>

            <Link
              to="/register"
              state={registrationState}
              onClick={preserveApplicationContext}
            >
              Create an account
              <span>→</span>
            </Link>
          </div>

          <div className="login-form-footer">
            <span>© {new Date().getFullYear()} Colossus</span>
            <span className="login-footer-dot" />
            <span>Migration Platform</span>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Login;

