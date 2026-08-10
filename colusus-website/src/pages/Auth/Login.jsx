import { useState } from "react";
import { useNavigate } from "react-router-dom";

import authService from "../../services/authService";

import "./Login.css";


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

        <div className="login-header">

          <span className="login-label">
            COLUSUS CLIENT PORTAL
          </span>

          <h1>
            Welcome Back
          </h1>

          <p>
            Sign in to manage your application,
            documents and migration journey.
          </p>

        </div>


        <form
          className="login-form"
          onSubmit={handleSubmit}
        >

          {error && (

            <div className="login-error">

              {error}

            </div>

          )}


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
            />

          </div>


          <div className="form-group">

            <label htmlFor="password">
              Password
            </label>

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


          <button
            type="submit"
            className="login-submit"
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


export default Login;