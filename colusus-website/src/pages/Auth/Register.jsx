import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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


const Register = () => {

    const navigate = useNavigate();


    const [form, setForm] = useState({

        name: "",

        email: "",

        password: "",

        confirmPassword: "",

    });


    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");


    /* ============================================================
       HANDLE INPUT
    ============================================================ */

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


    /* ============================================================
       SUBMIT
    ============================================================ */

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");


        /* --------------------------------------------------------
           REQUIRED FIELDS
        -------------------------------------------------------- */

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


        /* --------------------------------------------------------
           PASSWORD LENGTH
        -------------------------------------------------------- */

        if (form.password.length < 6) {

            setError(
                "Password must be at least 6 characters."
            );

            return;

        }


        /* --------------------------------------------------------
           PASSWORD MATCH
        -------------------------------------------------------- */

        if (
            form.password !==
            form.confirmPassword
        ) {

            setError(
                "Passwords do not match."
            );

            return;

        }


        /* --------------------------------------------------------
           REGISTER
        -------------------------------------------------------- */

        try {

            setLoading(true);


            const result =
                await authService.register({

                    name:
                        form.name.trim(),

                    email:
                        form.email.trim(),

                    password:
                        form.password,

                });


            /* ----------------------------------------------------
               CLIENT ACCOUNT ONLY
            ---------------------------------------------------- */

            if (
                result.user?.role !==
                "CLIENT"
            ) {

                authService.logout();

                setError(
                    "Unable to create a client account."
                );

                return;

            }


            /* ----------------------------------------------------
               SUCCESS
            ---------------------------------------------------- */

            navigate("/portal");


        } catch (error) {

            setError(

                error.response?.data?.message ||

                "Unable to create your account. Please try again."

            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <main className="auth-page register-page">

            <div className="auth-shell">


                {/* =================================================
                    LEFT SHOWCASE
                ================================================= */}

                <section className="auth-showcase">

                    {/* BACKGROUND DECORATION */}

                    <div className="auth-showcase-background">

                        <span
                            className="auth-orbit auth-orbit-one"
                        />

                        <span
                            className="auth-orbit auth-orbit-two"
                        />

                        <span
                            className="auth-grid"
                        />

                    </div>


                    <div className="auth-showcase-content">


                        {/* =================================================
                            BRAND
                        ================================================= */}

                        <div className="auth-brand">

                            <img
                                src={logo}
                                alt="Colossus"
                                className="auth-brand-logo"
                            />

                        </div>


                        {/* =================================================
                            HERO
                        ================================================= */}

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


                        {/* =================================================
                            BENEFITS
                        ================================================= */}

                        <div className="auth-benefits">


                            {/* APPLICATIONS */}

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


                            {/* DOCUMENTS */}

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


                            {/* WORKSPACE */}

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


                        {/* =================================================
                            TRUST FOOTER
                        ================================================= */}

                        <div className="auth-showcase-footer">

                            <span className="auth-footer-line" />

                            <span>
                                Built for your migration journey
                            </span>

                        </div>

                    </div>

                </section>


                {/* =================================================
                    FORM PANEL
                ================================================= */}

                <section className="auth-form-panel">

                    <div className="auth-form-card">


                        {/* =================================================
                            MOBILE BRAND
                        ================================================= */}

                        <div className="auth-mobile-brand">

                            <img
                                src={logo}
                                alt="Colossus"
                                className="auth-brand-logo"
                            />

                        </div>


                        {/* =================================================
                            FORM HEADER
                        ================================================= */}

                        <header className="auth-form-header">

                            <span className="auth-form-eyebrow">

                                CLIENT REGISTRATION

                            </span>


                            <h1>
                                Create your account
                            </h1>


                            <p>

                                Set up your secure client account
                                and start your migration journey.

                            </p>

                        </header>


                        {/* =================================================
                            ERROR
                        ================================================= */}

                        {error && (

                            <div className="auth-error">

                                <span />

                                <p>
                                    {error}
                                </p>

                            </div>

                        )}


                        {/* =================================================
                            REGISTRATION FORM
                        ================================================= */}

                        <form
                            className="auth-form"
                            onSubmit={handleSubmit}
                        >


                            {/* =================================================
                                FULL NAME
                            ================================================= */}

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
                                    />

                                </div>

                            </div>


                            {/* =================================================
                                EMAIL
                            ================================================= */}

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
                                    />

                                </div>

                            </div>


                            {/* =================================================
                                PASSWORD
                            ================================================= */}

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
                                    />

                                </div>

                            </div>


                            {/* =================================================
                                CONFIRM PASSWORD
                            ================================================= */}

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
                                    />

                                </div>

                            </div>


                            {/* =================================================
                                SUBMIT
                            ================================================= */}

                            <button
                                type="submit"
                                className="auth-submit"
                                disabled={loading}
                            >

                                <span>

                                    {loading
                                        ? "Creating account..."
                                        : "Create Account"
                                    }

                                </span>


                                {!loading && (

                                    <HiOutlineArrowRight />

                                )}

                            </button>


                        </form>


                        {/* =================================================
                            LOGIN FOOTER
                        ================================================= */}

                        <div className="auth-form-footer">

                            <span>
                                Already have an account?
                            </span>


                            <Link to="/login">
                                Sign in
                            </Link>

                        </div>


                        {/* =================================================
                            SECURITY
                        ================================================= */}

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