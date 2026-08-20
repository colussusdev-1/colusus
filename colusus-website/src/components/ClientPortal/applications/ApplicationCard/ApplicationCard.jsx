import { Link } from "react-router-dom";

import {
  HiOutlineArrowRight,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineDotsHorizontal,
  HiOutlineDocumentText,
} from "react-icons/hi";

import {
  formatApplicationType,
  formatApplicationStatus,
  formatApplicationDate,
  getApplicationProgress,
  getStatusClass,
  getStatusDescription,
} from "../application.utils";

import {
  getCountryImage,
  getCountryFlag,
  getCountryCode,
} from "../application.constants";

import "./ApplicationCard.css";


const ApplicationCard = ({
  application,
}) => {

  /* =========================================================
     APPLICATION DATA
  ========================================================= */

  const destinationCountry =
    application?.destinationCountry ||
    application?.opportunity?.countryName ||
    "Unknown";


  /* =========================================================
     COUNTRY DATA
  ========================================================= */

  const countryCode =
    getCountryCode(
      destinationCountry
    );


  const countryImage =
    getCountryImage(
      destinationCountry
    );


  const countryFlag =
    getCountryFlag(
      destinationCountry
    );


  /* =========================================================
     APPLICATION TYPE
  ========================================================= */

  const applicationType =
    formatApplicationType(
      application?.type
    );


  /* =========================================================
     STATUS
  ========================================================= */

  const status =
    application?.status ||
    "SUBMITTED";


  const statusLabel =
    formatApplicationStatus(
      status
    );


  const statusClass =
    getStatusClass(
      status
    );


  /* =========================================================
     PROGRESS
  ========================================================= */

  const progress =
    getApplicationProgress(
      status
    );


  /* =========================================================
     DESCRIPTION
  ========================================================= */

  const description =
    getStatusDescription(
      status
    );


  /* =========================================================
     DATES
  ========================================================= */

  const createdDate =
    formatApplicationDate(
      application?.createdAt
    );


  const updatedDate =
    formatApplicationDate(
      application?.updatedAt ||
      application?.createdAt
    );


  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <article className="application-card">

      {/* =====================================================
          COUNTRY VISUAL
      ===================================================== */}

      <div className="application-card-visual">

        {countryImage ? (

          <img
            src={countryImage}
            alt={`${destinationCountry} destination`}
            className="application-card-image"
          />

        ) : (

          <div className="application-card-image-fallback">

            <span>
              {countryCode}
            </span>

          </div>

        )}


        {/* VISUAL OVERLAY */}

        <div className="application-card-visual-overlay" />


        {/* =================================================
            STATUS
        ================================================= */}

        <span
          className={`application-card-status ${statusClass}`}
        >

          <span className="application-card-status-dot" />

          {statusLabel}

        </span>


        {/* =================================================
            COUNTRY
        ================================================= */}

        <div className="application-card-country">

          {/* COUNTRY FLAG */}

          {countryFlag ? (

            <span className="application-card-country-flag">

              <img
                src={countryFlag}
                alt={`${destinationCountry} flag`}
              />

            </span>

          ) : (

            <span className="application-card-country-code">
              {countryCode}
            </span>

          )}


          {/* COUNTRY NAME */}

          <strong className="application-card-country-name">

            {destinationCountry}

          </strong>

        </div>

      </div>


      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="application-card-content">


        {/* ===================================================
            TOP
        =================================================== */}

        <div className="application-card-top">

          <div>

            <span className="application-card-type">
              APPLICATION
            </span>

            <h3 className="application-card-title">
              {applicationType}
            </h3>

          </div>


          <button
            type="button"
            className="application-card-menu"
            aria-label="Application options"
          >

            <HiOutlineDotsHorizontal />

          </button>

        </div>


        {/* ===================================================
            META
        =================================================== */}

        <div className="application-card-meta">

          <span className="application-card-meta-item">

            <HiOutlineCalendar />

            Started {createdDate}

          </span>


          <span className="application-card-meta-divider" />


          <span className="application-card-meta-item">

            <HiOutlineClock />

            Updated {updatedDate}

          </span>

        </div>


        {/* ===================================================
            DESCRIPTION
        =================================================== */}

        <p className="application-card-description">

          {description}

        </p>


        {/* ===================================================
            PROGRESS
        =================================================== */}

        <div className="application-card-progress">

          <div className="application-card-progress-header">

            <span className="application-card-progress-label">
              Journey Progress
            </span>


            <strong className="application-card-progress-value">
              {progress}%
            </strong>

          </div>


          <div className="application-card-progress-track">

            <span
              className="application-card-progress-fill"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

        </div>


        {/* ===================================================
            FOOTER
        =================================================== */}

        <div className="application-card-bottom">


          <div className="application-card-visa-type">

            <HiOutlineDocumentText />

            <span>
              {applicationType}
            </span>

          </div>


          <Link
            to={`/portal/applications/${application?._id}`}
            className="application-card-details-link"
          >

            <span>
              View Details
            </span>

            <HiOutlineArrowRight />

          </Link>

        </div>

      </div>

    </article>
  );
};


export default ApplicationCard;