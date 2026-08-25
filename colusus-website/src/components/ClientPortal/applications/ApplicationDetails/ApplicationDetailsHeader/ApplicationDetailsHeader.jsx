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
  getStatusClass,
} from "../../application.utils";

import { getCountryFlag } from "../../application.constants";

import "./ApplicationDetailsHeader.css";


/* =========================================================
   HELPERS
========================================================= */

const normalizeValue = (value) => {
  return String(value || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");
};


/*
 * Use the application workflow snapshot first.
 *
 * This is important because the application should continue
 * using the workflow that existed when the application was
 * created.
 *
 * Fall back to the current opportunity configuration for
 * older application records.
 */

const getWorkflow = (application) => {
  if (
    Array.isArray(application?.workflow) &&
    application.workflow.length
  ) {
    return application.workflow;
  }

  if (
    Array.isArray(
      application?.opportunity?.applicationConfig?.workflow
    )
  ) {
    return application.opportunity.applicationConfig.workflow;
  }

  if (
    Array.isArray(
      application?.opportunitySnapshot?.applicationConfig?.workflow
    )
  ) {
    return application.opportunitySnapshot.applicationConfig.workflow;
  }

  return [];
};


/*
 * Find the current workflow position.
 *
 * Priority:
 *
 * 1. currentStep
 * 2. currentStepIndex
 * 3. application status
 */

const getCurrentWorkflowIndex = (
  workflow,
  application
) => {
  if (!workflow.length) {
    return -1;
  }


  const currentStep =
    normalizeValue(
      application?.currentStep
    );


  /*
   * currentStep is the most reliable value.
   */

  if (currentStep) {

    const stepIndex =
      workflow.findIndex(
        (stage) =>
          normalizeValue(stage?.key) ===
          currentStep ||
          normalizeValue(stage?.label) ===
          currentStep
      );


    if (stepIndex !== -1) {
      return stepIndex;
    }
  }


  /*
   * currentStepIndex is the second source
   * of truth.
   */

  if (
    Number.isInteger(
      application?.currentStepIndex
    ) &&
    application.currentStepIndex >= 0 &&
    application.currentStepIndex < workflow.length
  ) {
    return application.currentStepIndex;
  }


  /*
   * Finally attempt to match the application
   * status to a workflow stage.
   */

  const status =
    normalizeValue(
      application?.status
    );


  const statusIndex =
    workflow.findIndex(
      (stage) =>
        normalizeValue(stage?.key) === status ||
        normalizeValue(stage?.label) === status
    );


  if (statusIndex !== -1) {
    return statusIndex;
  }


  return -1;
};


/*
 * Calculate the journey percentage.
 */

const getJourneyProgress = (
  workflow,
  application
) => {

  if (!workflow.length) {
    return 0;
  }


  const status =
    normalizeValue(
      application?.status
    );


  /*
   * A draft has not entered the application
   * journey yet.
   */

  if (status === "DRAFT") {
    return 0;
  }


  /*
   * Terminal success.
   */

  if (
    status === "APPROVED" ||
    status === "COMPLETED"
  ) {
    return 100;
  }


  const currentIndex =
    getCurrentWorkflowIndex(
      workflow,
      application
    );


  if (currentIndex < 0) {
    return 0;
  }


  /*
   * Four stages:
   *
   * stage 1 → 25%
   * stage 2 → 50%
   * stage 3 → 75%
   * stage 4 → 100%
   */

  return Math.round(
    ((currentIndex + 1) /
      workflow.length) *
    100
  );
};


/* =========================================================
   COMPONENT
========================================================= */

const ApplicationDetailsHeader = ({
  application,
}) => {

  const destinationCountry =
    application?.destinationCountry ||
    application?.opportunity?.countryName ||
    application?.opportunitySnapshot?.countryName ||
    "Unknown";


  const countryCode =
    destinationCountry
      .slice(0, 2)
      .toUpperCase();


  const countryFlag =
    getCountryFlag(
      destinationCountry
    );


  const applicationType =
    formatApplicationType(
      application?.type
    );


  const status =
    application?.status ||
    "DRAFT";


  const statusLabel =
    formatApplicationStatus(
      status
    );


  const statusClass =
    getStatusClass(
      status
    );


  const workflow =
    getWorkflow(
      application
    );


  const progress =
    getJourneyProgress(
      workflow,
      application
    );


  const startedDate =
    formatApplicationDate(
      application?.createdAt
    );


  return (
    <header className="application-details-header">

      {/* =================================================
                BACK
            ================================================= */}

      <Link
        to="/portal/applications"
        className="application-details-back"
      >

        <HiOutlineArrowLeft />

        <span>
          Back to Applications
        </span>

      </Link>


      {/* =================================================
                APPLICATION IDENTITY
            ================================================= */}

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


        {/* =================================================
                    STATUS
                ================================================= */}

        <div className="application-details-status-area">

          <span
            className={`application-details-status ${statusClass}`}
          >

            <span className="application-details-status-dot" />

            {statusLabel}

          </span>

        </div>

      </div>


      {/* =================================================
                JOURNEY PROGRESS
            ================================================= */}

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