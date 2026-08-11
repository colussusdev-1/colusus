import { useState } from "react";
import { useNavigate } from "react-router-dom";

import authService from "../../../services/authService";

import "./AdminLogin.css";

const AdminLogin = () => {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    /*
    |--------------------------------------------------------------------------
    | Handle Input
    |--------------------------------------------------------------------------
    */

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

    /*
    |--------------------------------------------------------------------------
    | Submit
    |--------------------------------------------------------------------------
    */

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");

        if (!form.email || !form.password) {

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

            /*
            |--------------------------------------------------------------------------
            | Admin Role Check
            |--------------------------------------------------------------------------
            */

            if (result.user?.role !== "ADMIN") {

                authService.logout();

                setError(
                    "Access denied. This login is for administrators only."
                );

                return;
            }

            /*
            |--------------------------------------------------------------------------
            | Admin Login Successful
            |--------------------------------------------------------------------------
            */

            navigate("/admin/consultations");

        } catch (error) {

            setError(
                error?.response?.data?.message ||
                "Unable to sign in. Please check your credentials."
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <main className="adminLogin">

            <div className="adminLogin__card">

                <div className="adminLogin__header">

                    <span className="adminLogin__label">
                        COLUSUS ADMIN
                    </span>

                    <h1>
                        Welcome Back
                    </h1>

                    <p>
                        Sign in to access the Colusus
                        administration portal.
                    </p>

                </div>

                <form
                    className="adminLogin__form"
                    onSubmit={handleSubmit}
                >

                    {error && (

                        <div className="adminLogin__error">
                            {error}
                        </div>

                    )}

                    <div className="adminLogin__field">

                        <label htmlFor="admin-email">
                            Email Address
                        </label>

                        <input
                            id="admin-email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="admin@example.com"
                            autoComplete="email"
                        />

                    </div>

                    <div className="adminLogin__field">

                        <label htmlFor="admin-password">
                            Password
                        </label>

                        <input
                            id="admin-password"
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                        />

                    </div>

                    <button
                        type="submit"
                        className="adminLogin__submit"
                        disabled={loading}
                    >

                        {loading
                            ? "Signing in..."
                            : "Sign In"
                        }

                    </button>

                </form>

            </div>

        </main>

    );

};

export default AdminLogin;