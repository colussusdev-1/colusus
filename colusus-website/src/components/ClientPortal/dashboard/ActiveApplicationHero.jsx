import { Link } from "react-router-dom";

import {
  HiOutlineArrowRight,
  HiOutlineCalendar,
  HiOutlineDocumentText,
} from "react-icons/hi";

import {
  formatApplicationType,
  formatDate,
  getCurrentJourneyStage,
} from "./dashboard.utils";

import { getCountryFlag } from "./countries";


const ActiveApplicationHero = ({
  application,
  status,
  progress,
}) => {

  /* =========================================================
     COUNTRY
  ========================================================= */

  const destinationCountry =
    application?.destinationCountry?.trim() ||
    application?.opportunitySnapshot?.countryName?.trim() ||
    application?.opportunity?.countryName?.trim() ||
    "Unknown";


  const countryCode =
    destinationCountry
      .slice(0, 2)
      .toUpperCase();


  const countryFlag =
    getCountryFlag(
      destinationCountry,
    );


  /* =========================================================
     CURRENT JOURNEY STAGE
  ========================================================= */

  const currentStage =
    getCurrentJourneyStage(
      application,
    );


  /* =========================================================
     APPLICATION TYPE
  ========================================================= */

  const applicationType =
    formatApplicationType(
      application?.type ||
      application?.opportunitySnapshot?.type,
    );


  /* =========================================================
     STATUS
  ========================================================= */

  const statusLabel =
    status?.label ||
    "Pending";


  const statusDescription =
    status?.description ||
    "Your application is currently being processed.";


  /* =========================================================
     CURRENT STAGE LABEL
  ========================================================= */

  const currentStageLabel =
    currentStage?.label ||
    application?.currentStep ||
    statusLabel;


  /* =========================================================
     RENDER
  ========================================================= */

  return (

    <section className="colusus-application-hero">


      {/* =====================================================
          HERO BACKGROUND
      ===================================================== */}

      <div className="hero-map-light" />

      <div className="hero-orbit orbit-one" />

      <div className="hero-orbit orbit-two" />


      {/* =====================================================
          MAIN APPLICATION CONTENT
      ===================================================== */}

      <div className="application-main-content">


        {/* ===================================================
            HEADING
        =================================================== */}

        <div className="application-heading-row">


          <div>

            <span className="application-eyebrow">
              ACTIVE APPLICATION
            </span>


            {/* ===============================================
                COUNTRY
            =============================================== */}

            <div className="country-title">


              <div className="country-flag">

                {countryFlag ? (

                  <img
                    src={countryFlag}
                    alt={`${destinationCountry} flag`}
                    className="country-flag-image"
                  />

                ) : (

                  <span className="country-code">
                    {countryCode}
                  </span>

                )}

              </div>


              <h2>
                {destinationCountry}
              </h2>

            </div>

          </div>


          {/* =================================================
              APPLICATION STATUS
          ================================================= */}

          <span
            className={`application-status ${status?.className || ""
              }`}
          >

            <span />

            {statusLabel}

          </span>

        </div>


        {/* ===================================================
            APPLICATION DETAILS
        =================================================== */}

        <div className="application-details">


          <span>

            <HiOutlineDocumentText />

            {applicationType}

          </span>


          <span>

            <HiOutlineCalendar />

            Started{" "}

            {formatDate(
              application?.createdAt,
            )}

          </span>

        </div>


        {/* ===================================================
            APPLICATION DESCRIPTION
        =================================================== */}

        <p className="application-description">

          {statusDescription}

        </p>


        {/* ===================================================
            APPLICATION LINK
        =================================================== */}

        <Link
          to={`/portal/applications/${application?._id}`}
          className="application-link"
        >

          View Application

          <HiOutlineArrowRight />

        </Link>

      </div>


      {/* =====================================================
          JOURNEY PROGRESS
      ===================================================== */}

      <div className="journey-progress-card">


        {/* ===================================================
            PROGRESS HEADER
        =================================================== */}

        <div className="progress-heading">


          <div>

            <span>
              Journey Progress
            </span>

            <small>
              {currentStage
                ? "Current stage"
                : "Application journey"}
            </small>

          </div>


          <strong>
            {progress}%
          </strong>

        </div>


        {/* ===================================================
            PROGRESS BAR
        =================================================== */}

        <div className="progress-bar">

          <span
            style={{
              width: `${progress}%`,
            }}
          />

        </div>


        {/* ===================================================
            CURRENT STAGE
        =================================================== */}

        <div className="current-stage">

          <span />

          <strong>
            {currentStageLabel}
          </strong>

        </div>


        {/* ===================================================
            FULL JOURNEY
        =================================================== */}

        <Link
          to={`/portal/applications/${application?._id}`}
          className="progress-link"
        >

          View full journey

          <HiOutlineArrowRight />

        </Link>

      </div>

    </section>
  );
};


export default ActiveApplicationHero;