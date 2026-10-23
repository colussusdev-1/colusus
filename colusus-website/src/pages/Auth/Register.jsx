
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


/* ============================================================
   APPLICATION CONTEXT STORAGE
============================================================ */

const PENDING_APPLICATION_KEY =
    "colossus_pending_application";

const PENDING_APPLICATION_RETURN_KEY =
    "colossus_pending_application_return_to";

const APPLICATION_PATH =
    "/portal/applications/new";


/* ============================================================
   SAFE SESSION STORAGE HELPERS
============================================================ */

const getPendingApplication = () => {
    try {
        const storedApplication = sessionStorage.getItem(
            PENDING_APPLICATION_KEY
        );

        if (!storedApplication) {
            return null;
        }

        return JSON.parse(storedApplication);
    } catch (error) {
        console.error(
            "Unable to restore pending application:",
            error
        );

        return null;
    }
};


const getPendingReturnTo = () => {
    try {
        return sessionStorage.getItem(
            PENDING_APPLICATION_RETURN_KEY
        );
    } catch (error) {
        console.error(
            "Unable to restore application destination:",
            error
        );

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
        console.error(
            "Unable to preserve application context:",
            error
        );

        return false;
    }
};


const clearPendingApplication = () => {
    try {
        sessionStorage.removeItem(
            PENDING_APPLICATION_KEY
        );

        sessionStorage.removeItem(
            PENDING_APPLICATION_RETURN_KEY
        );
    } catch (error) {
        console.error(
            "Unable to clear application context:",
            error
        );
    }
};


/* ============================================================
   VALIDATE APPLICATION DESTINATION
============================================================ */

const isApplicationDestination = (destination) => {
    if (typeof destination !== "string") {
        return false;
    }

    if (
        !destination.startsWith("/") ||
        destination.startsWith("//")
    ) {
        return false;
    }

    const pathname = destination
        .split("?")[0]
        .split("#")[0];

    return pathname === APPLICATION_PATH;
};


/* ============================================================
   VALIDATE SELECTED MIGRATION PATHWAY
============================================================ */

const hasSelectedPathway = (application) => {
    if (
        !application ||
        typeof application !== "object"
    ) {
        return false;
    }

    const opportunity = application.opportunity;

    const opportunityId =
        application.opportunityId ||
        (
            typeof opportunity === "string"
                ? opportunity
                : null
        ) ||
        opportunity?._id ||
        opportunity?.id ||
        opportunity?.legacyId ||
        null;

    const opportunitySlug =
        application.opportunitySlug ||
        opportunity?.slug ||
        null;

    return Boolean(
        opportunityId ||
        opportunitySlug
    );
};


/* ============================================================
   REGISTER COMPONENT
============================================================ */

const Register = () => {
    const navigate = useNavigate();

    const location = useLocation();


    /* ========================================================
       RESTORE AND VALIDATE APPLICATION CONTEXT
    ======================================================== */

    const storedApplication = getPendingApplication();

    const storedReturnTo = getPendingReturnTo();

    const stateReturnTo =
        location.state?.returnTo || null;

    const stateReturnState =
        location.state?.returnState || null;


    /*
     * Prefer navigation state when it explicitly provides
     * an application destination. Otherwise, use the saved
     * session context.
     */

    const candidateReturnTo =
        stateReturnTo || storedReturnTo;

    const candidateReturnState =
        stateReturnState || storedApplication;


    /*
     * A pathway is considered pending only when:
     *
     * 1. The destination is the application creation page.
     * 2. A selected opportunity ID or slug exists.
     *
     * A destination alone is not sufficient.
     */

    const hasPendingApplication = Boolean(
        isApplicationDestination(candidateReturnTo) &&
        hasSelectedPathway(candidateReturnState)
    );


    const returnTo = hasPendingApplication
        ? candidateReturnTo
        : null;

    const returnState = hasPendingApplication
        ? candidateReturnState
        : null;


    /* ========================================================
       FORM STATE
    ======================================================== */

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");


    /* ========================================================
       INPUT HANDLER
    ======================================================== */

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


    /* ========================================================
       PRESERVE VALID APPLICATION CONTEXT
    ======================================================== */

    const preserveApplicationContext = () => {
        if (!hasPendingApplication) {
            return;
        }

        savePendingApplication(
            returnState,
            returnTo
        );
    };


    /* ========================================================
       POST-REGISTRATION REDIRECT
    ======================================================== */

    const handlePostRegistrationRedirect = () => {
        if (
            hasPendingApplication &&
            isApplicationDestination(returnTo) &&
            hasSelectedPathway(returnState)
        ) {
            /*
             * Keep the selected pathway available to the
             * application page after authentication.
             */

            preserveApplicationContext();

            navigate(returnTo, {
                state: returnState,
                replace: true,
            });

            return;
        }


        /*
         * Normal registration:
         * no selected pathway means the user goes to
         * the standard client portal.
         */

        clearPendingApplication();

        navigate("/portal", {
            replace: true,
        });
    };


    /* ========================================================
       SUBMIT REGISTRATION
    ======================================================== */

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");


        /* ----------------------------------------------------
           REQUIRED FIELDS
        ---------------------------------------------------- */

        if (
            !form.name.trim() ||
            !form.email.trim() ||
            !form.password ||
            !form.confirmPassword
        ) {
            setError(
                "Please complete all fields."
            );

            return;
        }


        /* ----------------------------------------------------
           PASSWORD LENGTH
        ---------------------------------------------------- */

        if (form.password.length < 6) {
            setError(
                "Password must be at least 6 characters."
            );

            return;
        }


        /* ----------------------------------------------------
           PASSWORD MATCH
        ---------------------------------------------------- */

        if (
            form.password !==
            form.confirmPassword
        ) {
            setError(
                "Passwords do not match."
            );

            return;
        }


        /* ----------------------------------------------------
           PRESERVE SELECTED PATHWAY
        ---------------------------------------------------- */

        preserveApplicationContext();


        /* ----------------------------------------------------
           CREATE ACCOUNT
        ---------------------------------------------------- */

        try {
            setLoading(true);

            const result = await authService.register({
                name: form.name.trim(),
                email: form.email.trim(),
                password: form.password,
            });


            /* ------------------------------------------------
               VALIDATE CLIENT ACCOUNT
            ------------------------------------------------ */

            if (
                result?.user?.role !== "CLIENT"
            ) {
                authService.logout();

                setError(
                    "Unable to create a client account."
                );

                return;
            }


            /* ------------------------------------------------
               REGISTRATION SUCCESS
            ------------------------------------------------ */

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


    /* ========================================================
       RENDER
    ======================================================== */

    return (
        <main className="auth-page register-page">
            <div className="auth-shell">

                {/* =============================================
                    LEFT SHOWCASE
                ============================================= */}

                <section className="auth-showcase">

                    <div className="auth-showcase-background">
                        <span className="auth-orbit auth-orbit-one" />

                        <span className="auth-orbit auth-orbit-two" />

                        <span className="auth-grid" />
                    </div>


                    <div className="auth-showcase-content">

                        {/* BRAND */}

                        <div className="auth-brand">
                            <img
                                src={logo}
                                alt="Colossus"
                                className="auth-brand-logo"
                            />
                        </div>


                        {/* HERO */}

                        <div className="auth-showcase-hero">

                            <span className="auth-kicker">
                                START YOUR JOURNEY
                            </span>

                            <h2>
                                One account.
                                <br />

                                <span>
                                    Your journey ahead.
                                </span>
                            </h2>

                            <p>
                                Create your Colossus client
                                account and keep your migration
                                journey organised from day one.
                            </p>

                        </div>


                        {/* BENEFITS */}

                        <div className="auth-benefits">

                            <div className="auth-benefit">

                                <div className="auth-benefit-icon">
                                    <HiOutlineCheckCircle />
                                </div>

                                <div>
                                    <strong>
                                        Track applications
                                    </strong>

                                    <span>
                                        See your migration progress
                                        and application status.
                                    </span>
                                </div>

                            </div>


                            <div className="auth-benefit">

                                <div className="auth-benefit-icon">
                                    <HiOutlineShieldCheck />
                                </div>

                                <div>
                                    <strong>
                                        Secure documents
                                    </strong>

                                    <span>
                                        Upload and manage your
                                        required documents securely.
                                    </span>
                                </div>

                            </div>


                            <div className="auth-benefit">

                                <div className="auth-benefit-icon">
                                    <HiOutlineUser />
                                </div>

                                <div>
                                    <strong>
                                        Your client workspace
                                    </strong>

                                    <span>
                                        Keep your migration information
                                        together in one place.
                                    </span>
                                </div>

                            </div>

                        </div>


                        {/* TRUST FOOTER */}

                        <div className="auth-showcase-footer">
                            <span className="auth-footer-line" />

                            <span>
                                Built for your migration journey
                            </span>
                        </div>

                    </div>

                </section>


                {/* =============================================
                    REGISTRATION FORM
                ============================================= */}

                <section className="auth-form-panel">

                    <div className="auth-form-card">

                        {/* MOBILE BRAND */}

                        <div className="auth-mobile-brand">
                            <img
                                src={logo}
                                alt="Colossus"
                                className="auth-brand-logo"
                            />
                        </div>


                        {/* FORM HEADER */}

                        <header className="auth-form-header">

                            <span className="auth-form-eyebrow">
                                CLIENT REGISTRATION
                            </span>

                            <h1>
                                Create your account
                            </h1>

                            <p>
                                {hasPendingApplication
                                    ? "Create your account to continue with your selected migration pathway."
                                    : "Set up your secure client account and start your migration journey."
                                }
                            </p>

                        </header>


                        {/* PATHWAY NOTICE */}

                        {hasPendingApplication && (
                            <div className="auth-pathway-notice">

                                <HiOutlineCheckCircle />

                                <div>
                                    <strong>
                                        Your pathway is saved
                                    </strong>

                                    <span>
                                        After creating your account,
                                        you'll continue directly to
                                        your application.
                                    </span>
                                </div>

                            </div>
                        )}


                        {/* ERROR */}

                        {error && (
                            <div
                                className="auth-error"
                                role="alert"
                            >
                                <span />

                                <p>
                                    {error}
                                </p>
                            </div>
                        )}


                        {/* FORM */}

                        <form
                            className="auth-form"
                            onSubmit={handleSubmit}
                        >

                            {/* FULL NAME */}

                            <div className="auth-field">

                                <label htmlFor="name">
                                    Full name
                                </label>

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


                            {/* EMAIL */}

                            <div className="auth-field">

                                <label htmlFor="email">
                                    Email address
                                </label>

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


                            {/* PASSWORD */}

                            <div className="auth-field">

                                <label htmlFor="password">
                                    Password
                                </label>

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


                            {/* CONFIRM PASSWORD */}

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


                            {/* SUBMIT */}

                            <button
                                type="submit"
                                className="auth-submit"
                                disabled={loading}
                            >
                                <span>
                                    {loading
                                        ? "Creating account..."
                                        : hasPendingApplication
                                            ? "Create Account & Continue"
                                            : "Create Account"
                                    }
                                </span>

                                {!loading && (
                                    <HiOutlineArrowRight />
                                )}
                            </button>

                        </form>


                        {/* LOGIN FOOTER */}

                        <div className="auth-form-footer">

                            <span>
                                Already have an account?
                            </span>

                            <Link
                                to="/login"
                                state={
                                    hasPendingApplication
                                        ? {
                                            returnTo,
                                            returnState,
                                        }
                                        : null
                                }
                                onClick={preserveApplicationContext}
                            >
                                Sign in
                            </Link>

                        </div>


                        {/* SECURITY */}

                        <div className="auth-security">

                            <HiOutlineShieldCheck />

                            <span>
                                Your account is protected
                            </span>

                        </div>

                    </div>

                </section>

            </div>
        </main>
    );
};


export default Register;

