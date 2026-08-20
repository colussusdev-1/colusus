import { Link } from "react-router-dom";

import {
  HiOutlineArrowRight,
  HiOutlineCalendar,
  HiOutlineDocumentText,
} from "react-icons/hi";

import {
  formatApplicationType,
  formatDate,
} from "./dashboard.utils";

import { getCountryFlag } from "./countries";


const ActiveApplicationHero = ({
  application,
  status,
  progress,
}) => {

  const destinationCountry =
    application?.destinationCountry?.trim() ||
    "Unknown";

  const countryCode =
    destinationCountry
      .slice(0, 2)
      .toUpperCase();

  const countryFlag =
    getCountryFlag(destinationCountry);


  /* =========================================
     FLAG DEBUG LOGS
  ========================================= */

  console.log(
    "[COLUSUS FLAG DEBUG] --------------------"
  );

  console.log(
    "[COLUSUS FLAG DEBUG] Application:",
    application
  );

  console.log(
    "[COLUSUS FLAG DEBUG] destinationCountry:",
    destinationCountry
  );

  console.log(
    "[COLUSUS FLAG DEBUG] countryCode:",
    countryCode
  );

  console.log(
    "[COLUSUS FLAG DEBUG] countryFlag:",
    countryFlag
  );

  console.log(
    "[COLUSUS FLAG DEBUG] Flag branch:",
    countryFlag
      ? "IMAGE"
      : "FALLBACK CODE"
  );

  console.log(
    "[COLUSUS FLAG DEBUG] --------------------"
  );


  return (
    <section className="colusus-application-hero">

      {/* =========================================
          HERO BACKGROUND
      ========================================= */}

      <div className="hero-map-light" />

      <div className="hero-orbit orbit-one" />

      <div className="hero-orbit orbit-two" />


      {/* =========================================
          MAIN APPLICATION CONTENT
      ========================================= */}

      <div className="application-main-content">

        <div className="application-heading-row">

          <div>

            <span className="application-eyebrow">
              ACTIVE APPLICATION
            </span>


            {/* COUNTRY */}
            <div className="country-title">

              <div className="country-flag">

                {countryFlag ? (

                  <img
                    src={countryFlag}
                    alt={`${destinationCountry} flag`}
                    className="country-flag-image"

                    onLoad={() => {
                      console.log(
                        "[COLUSUS FLAG DEBUG] IMAGE LOADED:",
                        countryFlag
                      );
                    }}

                    onError={(event) => {
                      console.error(
                        "[COLUSUS FLAG DEBUG] IMAGE FAILED TO LOAD:",
                        countryFlag
                      );

                      console.error(
                        "[COLUSUS FLAG DEBUG] Image element:",
                        event.currentTarget
                      );
                    }}
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


          {/* =====================================
              APPLICATION STATUS
          ===================================== */}

          <span
            className={`application-status ${status?.className || ""
              }`}
          >

            <span />

            {status?.label || "Pending"}

          </span>

        </div>


        {/* =========================================
            APPLICATION DETAILS
        ========================================= */}

        <div className="application-details">

          <span>

            <HiOutlineDocumentText />

            {formatApplicationType(
              application?.type
            )}

          </span>


          <span>

            <HiOutlineCalendar />

            Started{" "}

            {formatDate(
              application?.createdAt
            )}

          </span>

        </div>


        {/* =========================================
            APPLICATION DESCRIPTION
        ========================================= */}

        <p className="application-description">

          {status?.description ||
            "Your application is currently being processed."}

        </p>


        {/* =========================================
            APPLICATION LINK
        ========================================= */}

        <Link
          to={`/portal/applications/${application?._id}`}
          className="application-link"
        >

          View Application

          <HiOutlineArrowRight />

        </Link>

      </div>


      {/* =========================================
          JOURNEY PROGRESS
      ========================================= */}

      <div className="journey-progress-card">

        <div className="progress-heading">

          <div>

            <span>
              Journey Progress
            </span>

            <small>
              Current stage
            </small>

          </div>


          <strong>
            {progress}%
          </strong>

        </div>


        {/* PROGRESS BAR */}
        <div className="progress-bar">

          <span
            style={{
              width: `${progress}%`,
            }}
          />

        </div>


        {/* CURRENT STAGE */}
        <div className="current-stage">

          <span />

          <strong>
            {status?.label || "Pending"}
          </strong>

        </div>


        {/* FULL JOURNEY */}
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