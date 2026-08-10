import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import authService from "../../services/authService";

import "./Register.css";


const Register = () => {

    const navigate = useNavigate();


    const [form, setForm] = useState({

        name: "",

        email: "",

        password: "",

        confirmPassword: "",

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


        /*
        ========================================================
        VALIDATION
        ========================================================
        */

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


        if (form.password.length < 6) {

            setError(
                "Password must be at least 6 characters."
            );

            return;

        }


        if (
            form.password !==
            form.confirmPassword
        ) {

            setError(
                "Passwords do not match."
            );

            return;

        }


        /*
        ========================================================
        REGISTER
        ========================================================
        */

        try {

            setLoading(true);


            const result =
                await authService.register({

                    name: form.name.trim(),

                    email: form.email.trim(),

                    password: form.password,

                });


            /*
            ----------------------------------------------------
            Ensure only CLIENT accounts enter the portal
            ----------------------------------------------------
            */

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


            /*
            ----------------------------------------------------
            Registration successful
            ----------------------------------------------------
            */

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

        <main className="register-page">

            <div className="register-card">


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="register-header">

                    <span className="register-label">
                        COLUSUS CLIENT PORTAL
                    </span>


                    <h1>
                        Create Your Account
                    </h1>


                    <p>
                        Create your account to manage
                        your migration journey with Colusus.
                    </p>

                </div>


                {/* =================================================
                    FORM
                ================================================= */}

                <form
                    className="register-form"
                    onSubmit={handleSubmit}
                >


                    {/* ERROR */}

                    {error && (

                        <div className="register-error">

                            {error}

                        </div>

                    )}


                    {/* NAME */}

                    <div className="register-form-group">

                        <label htmlFor="name">
                            Full Name
                        </label>


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


                    {/* EMAIL */}

                    <div className="register-form-group">

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
                        />

                    </div>


                    {/* PASSWORD */}

                    <div className="register-form-group">

                        <label htmlFor="password">
                            Password
                        </label>


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


                    {/* CONFIRM PASSWORD */}

                    <div className="register-form-group">

                        <label htmlFor="confirmPassword">
                            Confirm Password
                        </label>


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


                    {/* SUBMIT */}

                    <button
                        type="submit"
                        className="register-submit"
                        disabled={loading}
                    >

                        {loading
                            ? "Creating Account..."
                            : "Create Account"
                        }

                    </button>


                </form>


                {/* =================================================
                    LOGIN LINK
                ================================================= */}

                <div className="register-footer">

                    <span>
                        Already have an account?
                    </span>


                    <Link to="/login">
                        Sign In
                    </Link>

                </div>


            </div>

        </main>

    );

};


export default Register;