import {
  HiOutlineArrowRight,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineInformationCircle,
} from "react-icons/hi";

import "./ApplicationStageCard.css";


/* =========================================================
   HELPERS
========================================================= */

const normalizeStatus = (value) => {
  return String(value || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");
};


const getWorkflow = (application) => {
  return (
    application?.opportunity?.applicationConfig
      ?.workflow || []
  );
};


const getCurrentIndex = (
  workflow,
  applicationStatus
) => {

  if (!workflow.length) {
    return -1;
  }

  const normalizedStatus =
    normalizeStatus(applicationStatus);


  const keyIndex = workflow.findIndex(
    (stage) =>
      normalizeStatus(stage?.key) ===
      normalizedStatus
  );

  if (keyIndex !== -1) {
    return keyIndex;
  }


  const labelIndex = workflow.findIndex(
    (stage) =>
      normalizeStatus(stage?.label) ===
      normalizedStatus
  );

  if (labelIndex !== -1) {
    return labelIndex;
  }


  if (
    normalizedStatus === "SUBMITTED" ||
    normalizedStatus === "APPLICATION_SUBMITTED"
  ) {
    return 0;
  }


  return 0;
};


const getStageDescription = (
  stage,
  application
) => {

  if (stage?.description) {
    return stage.description;
  }


  const status =
    normalizeStatus(
      application?.status
    );


  if (
    status === "SUBMITTED" ||
    status === "APPLICATION_SUBMITTED"
  ) {
    return "Your application has been submitted and is awaiting the next stage of review.";
  }


  if (
    status === "APPROVED" ||
    status === "COMPLETED"
  ) {
    return "Your application journey has been successfully completed.";
  }


  if (status === "REJECTED") {
    return "This application requires attention from the Colusus team.";
  }


  return "Your application is currently being processed by the Colusus team.";
};


/* =========================================================
   COMPONENT
========================================================= */

const ApplicationStageCard = ({
  application,
}) => {

  const workflow =
    getWorkflow(application);


  const currentIndex =
    getCurrentIndex(
      workflow,
      application?.status
    );


  const currentStage =
    currentIndex >= 0
      ? workflow[currentIndex]
      : null;


  const nextStage =
    currentIndex >= 0 &&
      currentIndex < workflow.length - 1
      ? workflow[currentIndex + 1]
      : null;


  const status =
    normalizeStatus(
      application?.status
    );


  const isCompleted =
    status === "APPROVED" ||
    status === "COMPLETED";


  const isRejected =
    status === "REJECTED";


  /* =====================================================
     NO WORKFLOW
  ===================================================== */

  if (!currentStage) {

    return (
      <section className="application-stage-card">

        <div className="application-stage-header">

          <div>
            <span>
              CURRENT STAGE
            </span>

            <h2>
              Application journey
            </h2>
          </div>

          <div className="application-stage-header-icon">
            <HiOutlineInformationCircle />
          </div>

        </div>


        <div className="application-stage-empty">

          <div className="application-stage-empty-icon">
            <HiOutlineClock />
          </div>

          <div>

            <strong>
              Journey stage unavailable
            </strong>

            <p>
              The current stage for this
              application has not been
              configured yet.
            </p>

          </div>

        </div>

      </section>
    );
  }


  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <section
      className={[
        "application-stage-card",
        isCompleted
          ? "is-completed"
          : "",
        isRejected
          ? "is-rejected"
          : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >

      {/* =================================================
                HEADER
            ================================================= */}

      <div className="application-stage-header">

        <div>

          <span>
            CURRENT STAGE
          </span>

          <h2>
            {isCompleted
              ? "Application complete"
              : isRejected
                ? "Application requires attention"
                : "Your application is here"}
          </h2>

        </div>


        <div className="application-stage-header-icon">

          {isCompleted ? (
            <HiOutlineCheckCircle />
          ) : isRejected ? (
            <HiOutlineInformationCircle />
          ) : (
            <HiOutlineClock />
          )}

        </div>

      </div>


      {/* =================================================
                CURRENT STAGE
            ================================================= */}

      <div className="application-stage-main">

        <div className="application-stage-index">

          {isCompleted ? (
            <HiOutlineCheckCircle />
          ) : (
            String(
              currentIndex + 1
            ).padStart(2, "0")
          )}

        </div>


        <div className="application-stage-main-content">

          <div className="application-stage-label">
            CURRENT STEP
          </div>

          <h3>
            {currentStage?.label ||
              currentStage?.key ||
              "Application Stage"}
          </h3>

          <p>
            {getStageDescription(
              currentStage,
              application
            )}
          </p>

        </div>

      </div>


      {/* =================================================
                NEXT STEP
            ================================================= */}

      {nextStage &&
        !isCompleted &&
        !isRejected && (

          <div className="application-stage-next">

            <div className="application-stage-next-indicator" />

            <div className="application-stage-next-content">

              <span>
                NEXT STEP
              </span>

              <strong>
                {nextStage?.label ||
                  nextStage?.key ||
                  "Next stage"}
              </strong>

            </div>


            <HiOutlineArrowRight />

          </div>
        )}


      {/* =================================================
                COMPLETED
            ================================================= */}

      {isCompleted && (

        <div className="application-stage-message success">

          <HiOutlineCheckCircle />

          <span>
            Your application journey has been
            completed successfully.
          </span>

        </div>
      )}


      {/* =================================================
                REJECTED
            ================================================= */}

      {isRejected && (

        <div className="application-stage-message danger">

          <HiOutlineInformationCircle />

          <span>
            The Colusus team will provide
            further information regarding
            this application.
          </span>

        </div>
      )}

    </section>
  );
};


export default ApplicationStageCard;