import {
  HiOutlineCheck,
  HiOutlineClock,
} from "react-icons/hi";

import "./ApplicationJourney.css";


/* =========================================================
   WORKFLOW
========================================================= */

const getWorkflow = (application) => {
  return (
    application?.opportunity?.applicationConfig
      ?.workflow || []
  );
};


/* =========================================================
   NORMALIZE
========================================================= */

const normalizeStatus = (value) => {
  return String(value || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");
};


/* =========================================================
   FIND CURRENT STAGE
========================================================= */

const getCurrentWorkflowIndex = (
  workflow,
  applicationStatus
) => {
  if (!workflow.length) {
    return -1;
  }

  const normalizedStatus =
    normalizeStatus(applicationStatus);

  /*
   * Direct workflow key match.
   *
   * Example:
   *
   * APPLICATION_SUBMITTED
   * DOCUMENT_REVIEW
   * PROCESSING
   */

  const keyIndex = workflow.findIndex(
    (stage) =>
      normalizeStatus(stage.key) ===
      normalizedStatus
  );

  if (keyIndex !== -1) {
    return keyIndex;
  }


  /*
   * Label match.
   */

  const labelIndex = workflow.findIndex(
    (stage) =>
      normalizeStatus(stage.label) ===
      normalizedStatus
  );

  if (labelIndex !== -1) {
    return labelIndex;
  }


  /*
   * Submitted applications start
   * at the first workflow stage.
   */

  if (
    normalizedStatus === "SUBMITTED" ||
    normalizedStatus === "APPLICATION_SUBMITTED"
  ) {
    return 0;
  }


  /*
   * If the backend status doesn't correspond
   * to a workflow key, use the first stage
   * as the safe fallback.
   */

  return 0;
};


/* =========================================================
   STAGE STATE
========================================================= */

const getStageState = (
  index,
  currentIndex,
  applicationStatus
) => {

  const normalizedStatus =
    normalizeStatus(applicationStatus);


  /*
   * Rejected applications.
   */

  if (normalizedStatus === "REJECTED") {

    if (index === currentIndex) {
      return "current";
    }

    if (index < currentIndex) {
      return "completed";
    }

    return "upcoming";
  }


  /*
   * Completed applications.
   */

  if (
    normalizedStatus === "APPROVED" ||
    normalizedStatus === "COMPLETED"
  ) {
    return "completed";
  }


  /*
   * Normal journey.
   */

  if (index < currentIndex) {
    return "completed";
  }

  if (index === currentIndex) {
    return "current";
  }

  return "upcoming";
};


/* =========================================================
   STAGE DESCRIPTION
========================================================= */

const getStageDescription = (
  stage,
  state
) => {

  if (stage?.description) {
    return stage.description;
  }

  if (state === "completed") {
    return "This stage has been completed.";
  }

  if (state === "current") {
    return "This is the current stage of your application.";
  }

  return "This stage has not been reached yet.";
};


/* =========================================================
   PROGRESS
========================================================= */

const getJourneyProgress = (
  workflow,
  currentIndex,
  applicationStatus
) => {

  if (!workflow.length) {
    return 0;
  }

  const normalizedStatus =
    normalizeStatus(applicationStatus);


  if (
    normalizedStatus === "APPROVED" ||
    normalizedStatus === "COMPLETED"
  ) {
    return 100;
  }


  if (currentIndex < 0) {
    return 0;
  }


  /*
   * The first stage represents the application
   * having entered the journey.
   *
   * Therefore:
   *
   * 4 stages
   * stage 1 = 25%
   * stage 2 = 50%
   * stage 3 = 75%
   * stage 4 = 100%
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

const ApplicationJourney = ({
  application,
}) => {

  const workflow =
    getWorkflow(application);


  const currentIndex =
    getCurrentWorkflowIndex(
      workflow,
      application?.status
    );


  const progress =
    getJourneyProgress(
      workflow,
      currentIndex,
      application?.status
    );


  /* =====================================================
     EMPTY WORKFLOW
  ===================================================== */

  if (!workflow.length) {

    return (
      <section className="application-journey">

        <div className="application-journey-header">

          <div>

            <span>
              APPLICATION JOURNEY
            </span>

            <h2>
              Your application progress
            </h2>

          </div>

        </div>


        <div className="application-journey-empty">

          <div className="application-journey-empty-icon">
            <HiOutlineClock />
          </div>

          <div>

            <strong>
              Journey information unavailable
            </strong>

            <p>
              The workflow for this
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
    <section className="application-journey">

      {/* =================================================
                HEADER
            ================================================= */}

      <div className="application-journey-header">

        <div>

          <span>
            APPLICATION JOURNEY
          </span>

          <h2>
            Your application progress
          </h2>

        </div>


        <div className="application-journey-summary">

          <strong>
            {progress}%
          </strong>

          <span>
            {workflow.length} stages
          </span>

        </div>

      </div>


      {/* =================================================
                PROGRESS
            ================================================= */}

      <div className="application-journey-progress">

        <div className="application-journey-progress-track">

          <span
            style={{
              width: `${progress}%`,
            }}
          />

        </div>

      </div>


      {/* =================================================
                TIMELINE
            ================================================= */}

      <div className="application-journey-timeline">

        {workflow.map(
          (stage, index) => {

            const state =
              getStageState(
                index,
                currentIndex,
                application?.status
              );


            const description =
              getStageDescription(
                stage,
                state
              );


            const isLast =
              index ===
              workflow.length - 1;


            return (
              <div
                key={
                  stage?.key ||
                  `${stage?.label}-${index}`
                }
                className={
                  `application-journey-stage ${state}`
                }
              >

                {/* =================================================
                                    MARKER
                                ================================================= */}

                <div className="application-journey-marker">

                  <div className="application-journey-marker-icon">

                    {state === "completed" ? (

                      <HiOutlineCheck />

                    ) : state === "current" ? (

                      <span />

                    ) : (

                      <HiOutlineClock />

                    )}

                  </div>


                  {!isLast && (
                    <div className="application-journey-line" />
                  )}

                </div>


                {/* =================================================
                                    CONTENT
                                ================================================= */}

                <div className="application-journey-stage-content">

                  <div className="application-journey-stage-top">

                    <div>

                      <span className="application-journey-step">
                        STEP{" "}
                        {String(
                          index + 1
                        ).padStart(
                          2,
                          "0"
                        )}
                      </span>

                      <h3>
                        {stage?.label ||
                          stage?.key ||
                          "Application Stage"}
                      </h3>

                    </div>


                    <span className="application-journey-state">

                      {state === "completed" &&
                        "Completed"}

                      {state === "current" &&
                        "Current"}

                      {state === "upcoming" &&
                        "Upcoming"}

                    </span>

                  </div>


                  <p>
                    {description}
                  </p>


                  {state === "current" && (

                    <div className="application-journey-current">

                      <span />

                      <strong>
                        Current stage
                      </strong>

                    </div>

                  )}

                </div>

              </div>
            );
          }
        )}

      </div>

    </section>
  );
};


export default ApplicationJourney;