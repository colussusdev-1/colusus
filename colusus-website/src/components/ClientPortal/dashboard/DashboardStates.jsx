import { Link } from "react-router-dom";

import {
  HiOutlineArrowRight,
  HiOutlineClock,
  HiOutlineDocumentText,
  HiOutlineUser,
  HiOutlineFolderOpen,
  HiOutlineCheckCircle,
} from "react-icons/hi";

import "./DashboardStates.css";


/*
============================================================
COLUSUS CLIENT DASHBOARD
DASHBOARD ALERT
============================================================
*/

export const DashboardAlert = ({ message }) => (
  <div className="dashboard-alert">

    <HiOutlineClock aria-hidden="true" />

    <span>
      {message}
    </span>

  </div>
);


/*
============================================================
COLUSUS CLIENT DASHBOARD
LOADING STATE
============================================================
*/

export const DashboardLoading = () => (
  <section
    className="dashboard-loading"
    aria-live="polite"
  >

    <div className="dashboard-loader" />

    <p>
      Loading your migration journey...
    </p>

  </section>
);


/*
============================================================
COLUSUS CLIENT DASHBOARD
EMPTY / GET STARTED STATE
============================================================
*/

export const DashboardEmpty = () => (
  <section className="dashboard-empty">

    {/* ======================================================
        VISUAL HEADER
    ====================================================== */}

    <div className="dashboard-empty__visual">

      <div className="dashboard-empty__visual-glow" />

      <div className="dashboard-empty__document">

        <div className="dashboard-empty__document-top">

          <span className="dashboard-empty__document-dot" />

          <span className="dashboard-empty__document-dot" />

          <span className="dashboard-empty__document-dot" />

        </div>


        <div className="dashboard-empty__document-line dashboard-empty__document-line--large" />

        <div className="dashboard-empty__document-line" />

        <div className="dashboard-empty__document-line dashboard-empty__document-line--short" />


        <div className="dashboard-empty__document-check">

          <HiOutlineCheckCircle aria-hidden="true" />

        </div>

      </div>


      <div className="dashboard-empty__floating-card dashboard-empty__floating-card--profile">

        <div className="dashboard-empty__floating-icon">

          <HiOutlineUser aria-hidden="true" />

        </div>

        <div>

          <strong>
            Profile
          </strong>

          <span>
            Your information
          </span>

        </div>

      </div>


      <div className="dashboard-empty__floating-card dashboard-empty__floating-card--documents">

        <div className="dashboard-empty__floating-icon">

          <HiOutlineFolderOpen aria-hidden="true" />

        </div>

        <div>

          <strong>
            Documents
          </strong>

          <span>
            Securely managed
          </span>

        </div>

      </div>

    </div>


    {/* ======================================================
        CONTENT
    ====================================================== */}

    <div className="dashboard-empty__content">

      <span className="dashboard-empty__eyebrow">
        GET STARTED
      </span>


      <h2>
        Your migration journey
        <span>
          starts here.
        </span>
      </h2>


      <p className="dashboard-empty__description">

        Start your application and we'll give you a clear,
        organized place to manage your migration journey,
        documents, progress and important updates.

      </p>


      {/* ====================================================
          JOURNEY STEPS
      ==================================================== */}

      <div className="dashboard-empty__steps">

        <div className="dashboard-empty__step">

          <div className="dashboard-empty__step-number">
            01
          </div>

          <div className="dashboard-empty__step-content">

            <strong>
              Start your application
            </strong>

            <span>
              Choose the migration opportunity that's right for you.
            </span>

          </div>

        </div>


        <div className="dashboard-empty__step">

          <div className="dashboard-empty__step-number">
            02
          </div>

          <div className="dashboard-empty__step-content">

            <strong>
              Complete your profile
            </strong>

            <span>
              Provide the information needed for your application.
            </span>

          </div>

        </div>


        <div className="dashboard-empty__step">

          <div className="dashboard-empty__step-number">
            03
          </div>

          <div className="dashboard-empty__step-content">

            <strong>
              Upload your documents
            </strong>

            <span>
              Keep your required migration documents organized in one place.
            </span>

          </div>

        </div>

      </div>


      {/* ====================================================
          ACTION
      ==================================================== */}

      <Link
        to="/portal/applications"
        className="dashboard-primary-button"
      >

        <span>
          Start an Application
        </span>

        <HiOutlineArrowRight aria-hidden="true" />

      </Link>


      <p className="dashboard-empty__support">

        You can save your progress and continue whenever you're ready.

      </p>

    </div>

  </section>
);