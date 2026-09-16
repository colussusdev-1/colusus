import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    HiOutlineArrowRight,
    HiOutlineEye,
    HiOutlineEyeOff,
    HiOutlineLockClosed,
    HiOutlineShieldCheck,
} from "react-icons/hi";

import authService from "../../../services/authService";

import "./AdminLogin.css";


/*
|--------------------------------------------------------------------------
| OPERATIONS ROLES
|--------------------------------------------------------------------------
|
| Both ADMIN and STAFF use the same Operations Portal login.
|
| ADMIN
| → /admin
|
| STAFF
| → /admin/staff
|
|--------------------------------------------------------------------------
*/

const OPERATIONS_ROLES = [
    "ADMIN",
    "STAFF",
];


const AdminLogin = () => {

    const navigate = useNavigate();


    /*
    |--------------------------------------------------------------------------
    | FORM
    |--------------------------------------------------------------------------
    */

    const [form, setForm] = useState({
        email: "",
        password: "",
    });


    /*
    |--------------------------------------------------------------------------
    | UI STATE
    |--------------------------------------------------------------------------
    */

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const [focusedField, setFocusedField] = useState("");

    const [time, setTime] = useState("");


    /*
    |--------------------------------------------------------------------------
    | LIVE TIME
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        const updateTime = () => {

            const now = new Date();

            setTime(
                now.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                })
            );

        };


        updateTime();


        const interval = setInterval(
            updateTime,
            1000
        );


        return () => clearInterval(interval);

    }, []);


    /*
    |--------------------------------------------------------------------------
    | HANDLE INPUT
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


        if (error) {
            setError("");
        }

    };


    /*
    |--------------------------------------------------------------------------
    | SUBMIT
    |--------------------------------------------------------------------------
    */

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");


        /*
        |--------------------------------------------------------------------------
        | BASIC VALIDATION
        |--------------------------------------------------------------------------
        */

        const email = form.email.trim();

        const password = form.password;


        if (!email || !password) {

            setError(
                "Please enter your email and password."
            );

            return;
        }


        try {

            setLoading(true);


            /*
            |--------------------------------------------------------------------------
            | AUTHENTICATE
            |--------------------------------------------------------------------------
            */

            const result =
                await authService.login(
                    email,
                    password
                );


            /*
            |--------------------------------------------------------------------------
            | AUTHENTICATED USER
            |--------------------------------------------------------------------------
            */

            const user = result?.user;


            const role = String(
                user?.role || ""
            )
                .trim()
                .toUpperCase();


            /*
            |--------------------------------------------------------------------------
            | OPERATIONS ROLE CHECK
            |--------------------------------------------------------------------------
            |
            | Only ADMIN and STAFF can enter the Operations Portal.
            |
            |--------------------------------------------------------------------------
            */

            if (!OPERATIONS_ROLES.includes(role)) {

                authService.logout();

                setError(
                    "Access denied. This portal is for authorized operations personnel only."
                );

                return;
            }


            /*
            |--------------------------------------------------------------------------
            | STAFF REDIRECT
            |--------------------------------------------------------------------------
            |
            | Staff does NOT get a separate portal.
            |
            | Staff enters through the same AdminLayout and shared sidebar.
            |
            | Route:
            |
            |     /admin/staff
            |
            |--------------------------------------------------------------------------
            */

            if (role === "STAFF") {

                navigate(
                    "/admin/staff",
                    {
                        replace: true,
                    }
                );

                return;
            }


            /*
            |--------------------------------------------------------------------------
            | ADMIN REDIRECT
            |--------------------------------------------------------------------------
            */

            navigate(
                "/admin",
                {
                    replace: true,
                }
            );

        } catch (error) {

            console.error(
                "OPERATIONS LOGIN FAILED:",
                error
            );


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


            {/* ============================================================
                BACKGROUND DECORATION
            ============================================================ */}

            <div className="adminLogin__background">

                <div
                    className="
                        adminLogin__orb
                        adminLogin__orb--one
                    "
                />

                <div
                    className="
                        adminLogin__orb
                        adminLogin__orb--two
                    "
                />

                <div className="adminLogin__grid" />

            </div>


            {/* ============================================================
                MAIN SHELL
            ============================================================ */}

            <section className="adminLogin__shell">


                {/* ========================================================
                    LEFT BRAND PANEL
                ======================================================== */}

                <div className="adminLogin__brandPanel">

                    <div className="adminLogin__brandGlow" />


                    <div className="adminLogin__brandContent">


                        {/* ==================================================
                            BRAND
                        ================================================== */}

                        <div className="adminLogin__brand">

                            <div className="adminLogin__brandMark">
                                C
                            </div>

                            <div>

                                <strong>
                                    Colossus
                                </strong>

                                <span>
                                    Digital Operations
                                </span>

                            </div>

                        </div>


                        {/* ==================================================
                            BRAND MESSAGE
                        ================================================== */}

                        <div className="adminLogin__brandMessage">

                            <span className="adminLogin__eyebrow">
                                OPERATIONS PORTAL
                            </span>

                            <h1>

                                Manage every

                                <span>
                                    migration journey.
                                </span>

                            </h1>

                            <p>
                                A centralized workspace for
                                managing clients, applications,
                                documents and migration operations.
                            </p>

                        </div>


                        {/* ==================================================
                            SYSTEM CARD
                        ================================================== */}

                        <div className="adminLogin__systemCard">

                            <div className="adminLogin__systemIcon">

                                <HiOutlineShieldCheck />

                            </div>


                            <div className="adminLogin__systemCopy">

                                <strong>
                                    Secure operations environment
                                </strong>

                                <span>
                                    Authorized personnel only
                                </span>

                            </div>


                            <div className="adminLogin__status">

                                <span />

                                Secure

                            </div>

                        </div>

                    </div>


                    {/* ==================================================
                        BRAND FOOTER
                    ================================================== */}

                    <div className="adminLogin__brandFooter">

                        <span>
                            COLOSSUS DIGITAL OPERATIONS
                        </span>

                        <span>
                            {time}
                        </span>

                    </div>

                </div>


                {/* ========================================================
                    LOGIN PANEL
                ======================================================== */}

                <div className="adminLogin__formPanel">

                    <div className="adminLogin__formInner">


                        {/* ==================================================
                            MOBILE BRAND
                        ================================================== */}

                        <div className="adminLogin__mobileBrand">

                            <div className="adminLogin__brandMark">
                                C
                            </div>

                            <div>

                                <strong>
                                    Colossus
                                </strong>

                                <span>
                                    Operations Portal
                                </span>

                            </div>

                        </div>


                        {/* ==================================================
                            FORM HEADER
                        ================================================== */}

                        <div className="adminLogin__header">

                            <span className="adminLogin__headerLabel">
                                OPERATIONS ACCESS
                            </span>

                            <h2>
                                Welcome back
                            </h2>

                            <p>
                                Sign in to continue to your
                                operations workspace.
                            </p>

                        </div>


                        {/* ==================================================
                            ERROR
                        ================================================== */}

                        {error && (

                            <div
                                className="adminLogin__error"
                                role="alert"
                            >

                                <div className="adminLogin__errorIcon">
                                    !
                                </div>

                                <span>
                                    {error}
                                </span>

                            </div>

                        )}


                        {/* ==================================================
                            FORM
                        ================================================== */}

                        <form
                            className="adminLogin__form"
                            onSubmit={handleSubmit}
                        >


                            {/* ==================================================
                                EMAIL
                            ================================================== */}

                            <div
                                className={`
                                    adminLogin__field
                                    ${focusedField === "email"
                                        ? "is-focused"
                                        : ""
                                    }
                                    ${form.email
                                        ? "has-value"
                                        : ""
                                    }
                                `}
                            >

                                <label htmlFor="admin-email">
                                    Email address
                                </label>

                                <div className="adminLogin__inputWrapper">

                                    <span className="adminLogin__inputIcon">
                                        @
                                    </span>

                                    <input
                                        id="admin-email"
                                        name="email"
                                        type="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        onFocus={() =>
                                            setFocusedField(
                                                "email"
                                            )
                                        }
                                        onBlur={() =>
                                            setFocusedField(
                                                ""
                                            )
                                        }
                                        placeholder="admin@colossus.com"
                                        autoComplete="email"
                                    />

                                </div>

                            </div>


                            {/* ==================================================
                                PASSWORD
                            ================================================== */}

                            <div
                                className={`
                                    adminLogin__field
                                    ${focusedField === "password"
                                        ? "is-focused"
                                        : ""
                                    }
                                    ${form.password
                                        ? "has-value"
                                        : ""
                                    }
                                `}
                            >

                                <label htmlFor="admin-password">
                                    Password
                                </label>

                                <div className="adminLogin__inputWrapper">

                                    <span className="adminLogin__inputIcon">

                                        <HiOutlineLockClosed />

                                    </span>

                                    <input
                                        id="admin-password"
                                        name="password"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={form.password}
                                        onChange={handleChange}
                                        onFocus={() =>
                                            setFocusedField(
                                                "password"
                                            )
                                        }
                                        onBlur={() =>
                                            setFocusedField(
                                                ""
                                            )
                                        }
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                    />


                                    <button
                                        type="button"
                                        className="
                                            adminLogin__passwordToggle
                                        "
                                        onClick={() =>
                                            setShowPassword(
                                                (previous) =>
                                                    !previous
                                            )
                                        }
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >

                                        {showPassword ? (

                                            <HiOutlineEyeOff />

                                        ) : (

                                            <HiOutlineEye />

                                        )}

                                    </button>

                                </div>

                            </div>


                            {/* ==================================================
                                FORM META
                            ================================================== */}

                            <div className="adminLogin__formMeta">

                                <div className="adminLogin__secureLabel">

                                    <HiOutlineLockClosed />

                                    <span>
                                        Secure operations access
                                    </span>

                                </div>

                            </div>


                            {/* ==================================================
                                SUBMIT
                            ================================================== */}

                            <button
                                type="submit"
                                className={`
                                    adminLogin__submit
                                    ${loading
                                        ? "is-loading"
                                        : ""
                                    }
                                `}
                                disabled={loading}
                            >

                                {loading ? (

                                    <>

                                        <span className="adminLogin__spinner" />

                                        <span>
                                            Authenticating...
                                        </span>

                                    </>

                                ) : (

                                    <>

                                        <span>
                                            Sign in to Operations
                                        </span>

                                        <HiOutlineArrowRight />

                                    </>

                                )}

                            </button>


                        </form>


                        {/* ==================================================
                            FOOTER
                        ================================================== */}

                        <div className="adminLogin__footer">

                            <div className="adminLogin__footerLine" />

                            <span>
                                Colossus Digital Operations Platform
                            </span>

                            <div className="adminLogin__footerLine" />

                        </div>


                    </div>

                </div>

            </section>

        </main>

    );

};


export default AdminLogin;