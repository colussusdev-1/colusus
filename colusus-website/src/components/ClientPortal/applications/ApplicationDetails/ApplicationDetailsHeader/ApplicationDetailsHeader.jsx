import { Link } from "react-router-dom";

import {
  HiOutlineArrowLeft,
  HiOutlineCalendar,
  HiOutlineDocumentText,
} from "react-icons/hi";

import {
  formatApplicationType,
  formatApplicationStatus,
  formatApplicationDate,
  getApplicationProgress,
  getStatusClass,
} from "../../application.utils";

import { getCountryFlag } from "../../application.constants";

import "./ApplicationDetailsHeader.css";

const ApplicationDetailsHeader = ({ application }) => {
  const destinationCountry =
    application?.destinationCountry ||
    application?.opportunity?.countryName ||
    "Unknown";

  const countryCode = destinationCountry
    .slice(0, 2)
    .toUpperCase();

  const countryFlag = getCountryFlag(destinationCountry);

  const applicationType = formatApplicationType(
    application?.type
  );

  const status = application?.status || "SUBMITTED";

  const statusLabel = formatApplicationStatus(status);

  const statusClass = getStatusClass(status);

  const progress = getApplicationProgress(status);

  const startedDate = formatApplicationDate(
    application?.createdAt
  );

  return (
    <header className="application-details-header">

      {/* BACK */}

      <Link
        to="/portal/applications"
        className="application-details-back"
      >
        <HiOutlineArrowLeft />

        <span>Back to Applications</span>
      </Link>


      {/* APPLICATION IDENTITY */}

      <div className="application-details-header-main">

        <div className="application-details-identity">

          <div className="application-details-country">

            {countryFlag ? (
              <img
                src={countryFlag}
                alt={`${destinationCountry} flag`}
                className="application-details-country-flag"
              />
            ) : (
              <span className="application-details-country-code">
                {countryCode}
              </span>
            )}

          </div>


          <div className="application-details-heading">

            <span className="application-details-eyebrow">
              APPLICATION
            </span>

            <h1>
              {destinationCountry}
            </h1>

            <div className="application-details-meta">

              <span>
                <HiOutlineDocumentText />

                {applicationType}
              </span>

              <span className="application-details-meta-divider">
                •
              </span>

              <span>
                <HiOutlineCalendar />

                Started {startedDate}
              </span>

            </div>

          </div>

        </div>


        {/* STATUS */}

        <div className="application-details-status-area">

          <span
            className={`application-details-status ${statusClass}`}
          >
            <span className="application-details-status-dot" />

            {statusLabel}
          </span>

        </div>

      </div>


      {/* PROGRESS */}

      <div className="application-details-progress">

        <div className="application-details-progress-top">

          <div className="application-details-progress-title">

            <span>
              Journey Progress
            </span>

            <small>
              Your application journey
            </small>

          </div>

          <strong>
            {progress}%
          </strong>

        </div>


        <div className="application-details-progress-track">

          <span
            style={{
              width: `${progress}%`,
            }}
          />

        </div>

      </div>

    </header>
  );
};

export default ApplicationDetailsHeader;