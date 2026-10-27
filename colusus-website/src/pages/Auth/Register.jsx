
import { useState } from "react";

import {
    Link,
    useLocation,
    useNavigate,
} from "react-router-dom";

import {
    HiOutlineArrowRight,
    HiOutlineCheckCircle,
    HiOutlineLockClosed,
    HiOutlineMail,
    HiOutlineShieldCheck,
    HiOutlineUser,
} from "react-icons/hi";

import authService from "../../services/authService";

import logo from "../../assets/logo.png";

import "./Register.css";

const PENDING_APPLICATION_KEY = "colossus_pending_application";
const PENDING_APPLICATION_RETURN_KEY =
    "colossus_pending_application_return_to";

const APPLICATION_PATH = "/portal/applications/new";
const ASSESSMENT_PATH = "/trainee-program-assessment";

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

const savePendingApplication = (application, destination) => {
    try {
        sessionStorage.setItem(
            PENDING_APPLICATION_KEY,
            JSON.stringify(application)
        );

        sessionStorage.setItem(
            PENDING_APPLICATION_RETURN_KEY,
            destination
        );

        return true;
    } catch (error) {
        console.error("Unable to preserve application context:", error);
        return false;
    }
};

const clearPendingApplication = () => {
    try {
        sessionStorage.removeItem(PENDING_APPLICATION_KEY);
        sessionStorage.removeItem(PENDING_APPLICATION_RETURN_KEY);
    } catch (error) {
        console.error("Unable to clear application context:", error);
    }
};

const isApplicationDestination = (destination) => {
    if (
        typeof destination !== "string" ||
        !destination.startsWith("/") ||
        destination.startsWith("//")
    ) {
        return false;
    }

    const pathname = destination.split("?")[0].split("#")[0];

    return pathname === APPLICATION_PATH;
};

const isAssessmentDestination = (destination) => {
    if (
        typeof destination !== "string" ||
        !destination.startsWith("/") ||
        destination.startsWith("//")
    ) {
        return false;
    }

    const pathname = destination.split("?")[0].split("#")[0];

    return pathname === ASSESSMENT_PATH;
};

const hasSelectedPathway = (application) => {
    if (!application || typeof application !== "object") {
        return false;
    }

    const opportunity = application.opportunity;

    const opportunityId =
        application.opportunityId ||
        (typeof opportunity === "string" ? opportunity : null) ||
        opportunity?._id ||
        opportunity?.id ||
        opportunity?.legacyId ||
        null;

    const opportunitySlug =
        application.opportunitySlug ||
        opportunity?.slug ||
        null;

    return Boolean(opportunityId || opportunitySlug);
};

const Register = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const storedApplication = getPendingApplication();
    const storedReturnTo = getPendingReturnTo();

    const stateReturnTo = location.state?.returnTo || null;
    const stateReturnState = location.state?.returnState || null;

    const isAssessmentFlow =
        location.state?.source === "trainee-program-assessment";

    const assessmentReturnTo = location.state?.returnTo || null;
    const assessmentReturnState = location.state?.returnState || null;

    const hasPendingAssessment = Boolean(
        isAssessmentFlow &&
        isAssessmentDestination(assessmentReturnTo)
    );

    const candidateReturnTo = stateReturnTo || storedReturnTo;
    const candidateReturnState = stateReturnState || storedApplication;

    const hasPendingApplication = Boolean(
        isApplicationDestination(candidateReturnTo) &&
        hasSelectedPathway(candidateReturnState)
    );

    const returnTo = hasPendingApplication ? candidateReturnTo : null;
    const returnState = hasPendingApplication
        ? candidateReturnState
        : null;

    const [form, setForm] = useState({
        name: "",
        email: location.state?.email || "",
        password: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const preserveApplicationContext = () => {
        if (!hasPendingApplication) return;

        savePendingApplication(returnState, returnTo);
    };

    const handlePostRegistrationRedirect = () => {
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

        if (
            hasPendingApplication &&
            isApplicationDestination(returnTo) &&
            hasSelectedPathway(returnState)
        ) {
            preserveApplicationContext();

            navigate(returnTo, {
                state: returnState,
                replace: true,
            });

            return;
        }

        clearPendingApplication();

        navigate("/portal", {
            replace: true,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        if (
            !form.name.trim() ||
            !form.email.trim() ||
            !form.password ||
            !form.confirmPassword
        ) {
            setError("Please complete all fields.");
            return;
        }

        if (form.password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        preserveApplicationContext();

        try {
            setLoading(true);

            const result = await authService.register({
                name: form.name.trim(),
                email: form.email.trim().toLowerCase(),
                password: form.password,
            });

            if (result?.user?.role !== "CLIENT") {
                authService.logout();

                setError("Unable to create a client account.");
                return;
            }

            handlePostRegistrationRedirect();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to create your account. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const loginState = hasPendingAssessment
        ? {
            source: "trainee-program-assessment",
            returnTo: assessmentReturnTo,
            returnState: assessmentReturnState,
            email: form.email,
        }
        : hasPendingApplication
            ? { returnTo, returnState }
            : null;

    return (
        <main className="auth-page register-page">
            <div className="auth-shell">
                <section className="auth-showcase">
                    <div className="auth-showcase-background">
                        <span className="auth-orbit auth-orbit-one" />
                        <span className="auth-orbit auth-orbit-two" />
                        <span className="auth-grid" />
                    </div>

                    <div className="auth-showcase-content">
                        <div className="auth-brand">
                            <img
                                src={logo}
                                alt="Colossus"
                                className="auth-brand-logo"
                            />
                        </div>

                        <div className="auth-showcase-hero">
                            <span className="auth-kicker">
                                START YOUR JOURNEY
                            </span>

                            <h2>
                                One account.
                                <br />
                                <span>Your journey ahead.</span>
                            </h2>

                            <p>
                                Create your Colossus client account and keep
                                your migration journey organised from day one.
                            </p>
                        </div>

                        <div className="auth-benefits">
                            <div className="auth-benefit">
                                <div className="auth-benefit-icon">
                                    <HiOutlineCheckCircle />
                                </div>
                                <div>
                                    <strong>Track applications</strong>
                                    <span>
                                        See your migration progress and
                                        application status.
                                    </span>
                                </div>
                            </div>

                            <div className="auth-benefit">
                                <div className="auth-benefit-icon">
                                    <HiOutlineShieldCheck />
                                </div>
                                <div>
                                    <strong>Secure documents</strong>
                                    <span>
                                        Upload and manage your required
                                        documents securely.
                                    </span>
                                </div>
                            </div>

                            <div className="auth-benefit">
                                <div className="auth-benefit-icon">
                                    <HiOutlineUser />
                                </div>
                                <div>
                                    <strong>Your client workspace</strong>
                                    <span>
                                        Keep your migration information
                                        together in one place.
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="auth-showcase-footer">
                            <span className="auth-footer-line" />
                            <span>Built for your migration journey</span>
                        </div>
                    </div>
                </section>

                <section className="auth-form-panel">
                    <div className="auth-form-card">
                        <div className="auth-mobile-brand">
                            <img
                                src={logo}
                                alt="Colossus"
                                className="auth-brand-logo"
                            />
                        </div>

                        <header className="auth-form-header">
                            <span className="auth-form-eyebrow">
                                CLIENT REGISTRATION
                            </span>

                            <h1>Create your account</h1>

                            <p>
                                {hasPendingAssessment
                                    ? "Create your account to return to your saved assessment and complete submission."
                                    : hasPendingApplication
                                        ? "Create your account to continue with your selected migration pathway."
                                        : "Set up your secure client account and start your migration journey."}
                            </p>
                        </header>

                        {(hasPendingApplication || hasPendingAssessment) && (
                            <div className="auth-pathway-notice">
                                <HiOutlineCheckCircle />

                                <div>
                                    <strong>
                                        {hasPendingAssessment
                                            ? "Your assessment is saved"
                                            : "Your pathway is saved"}
                                    </strong>

                                    <span>
                                        {hasPendingAssessment
                                            ? "After registration, you will return to your assessment to review and submit it."
                                            : "After creating your account, you'll continue directly to your application."}
                                    </span>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="auth-error" role="alert">
                                <span />
                                <p>{error}</p>
                            </div>
                        )}

                        <form className="auth-form" onSubmit={handleSubmit}>
                            <div className="auth-field">
                                <label htmlFor="name">Full name</label>

                                <div className="auth-input-wrapper">
                                    <HiOutlineUser />

                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="Enter your full name"
                                        autoComplete="name"
                                        autoFocus
                                        required
                                    />
                                </div>
                            </div>

                            <div className="auth-field">
                                <label htmlFor="email">Email address</label>

                                <div className="auth-input-wrapper">
                                    <HiOutlineMail />

                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="you@example.com"
                                        autoComplete="email"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="auth-field">
                                <label htmlFor="password">Password</label>

                                <div className="auth-input-wrapper">
                                    <HiOutlineLockClosed />

                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        placeholder="Create a password"
                                        autoComplete="new-password"
                                        minLength={6}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="auth-field">
                                <label htmlFor="confirmPassword">
                                    Confirm password
                                </label>

                                <div className="auth-input-wrapper">
                                    <HiOutlineLockClosed />

                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        value={form.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Confirm your password"
                                        autoComplete="new-password"
                                        minLength={6}
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="auth-submit"
                                disabled={loading}
                            >
                                <span>
                                    {loading
                                        ? "Creating account..."
                                        : hasPendingAssessment
                                            ? "Create Account & Return to Assessment"
                                            : hasPendingApplication
                                                ? "Create Account & Continue"
                                                : "Create Account"}
                                </span>

                                {!loading && <HiOutlineArrowRight />}
                            </button>
                        </form>

                        <div className="auth-form-footer">
                            <span>Already have an account?</span>

                            <Link
                                to="/login"
                                state={loginState}
                                onClick={preserveApplicationContext}
                            >
                                Sign in
                            </Link>
                        </div>

                        <div className="auth-security">
                            <HiOutlineShieldCheck />
                            <span>Your account is protected</span>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
};

export default Register;

