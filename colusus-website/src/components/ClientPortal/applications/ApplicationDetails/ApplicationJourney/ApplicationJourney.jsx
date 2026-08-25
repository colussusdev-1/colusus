import {
  HiOutlineCheck,
  HiOutlineClock,
} from "react-icons/hi";

import "./ApplicationJourney.css";


/* =========================================================
   HELPERS
========================================================= */

const normalizeValue = (value) => {
  return String(value || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");
};


/* =========================================================
   WORKFLOW
========================================================= */

const getWorkflow = (application) => {

  /*
   * Prefer the workflow snapshot stored directly
   * on the application.
   */

  if (
    Array.isArray(application?.workflow) &&
    application.workflow.length
  ) {
    return application.workflow;
  }


  /*
   * Fallback for older applications.
   */

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


/* =========================================================
   CURRENT WORKFLOW INDEX
========================================================= */

const getCurrentWorkflowIndex = (
  workflow,
  application
) => {

  if (!workflow.length) {
    return -1;
  }


  /*
   * currentStep is the primary source of truth.
   */

  const currentStep =
    normalizeValue(
      application?.currentStep
    );


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
   * currentStepIndex is the next fallback.
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
   * status against the workflow.
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


/* =========================================================
   STAGE STATE
========================================================= */

const getStageState = (
  index,
  currentIndex,
  applicationStatus
) => {

  const status =
    normalizeValue(
      applicationStatus
    );


  /*
   * Draft means the journey has not started.
   */

  if (status === "DRAFT") {
    return "upcoming";
  }


  /*
   * Approved / completed means the entire journey
   * has been completed.
   */

  if (
    status === "APPROVED" ||
    status === "COMPLETED"
  ) {
    return "completed";
  }


  /*
   * Rejected applications keep the current stage
   * visible while previous stages remain completed.
   */

  if (status === "REJECTED") {

    if (index === currentIndex) {
      return "current";
    }

    if (index < currentIndex) {
      return "completed";
    }

    return "upcoming";
  }


  /*
   * Normal application journey.
   */

  if (currentIndex < 0) {
    return "upcoming";
  }


  if (index < currentIndex) {
    return "completed";
  }


  if (index === currentIndex) {
    return "current";
  }


  return "upcoming";
};


/* =========================================================
   DESCRIPTION
========================================================= */

const getStageDescription = (
  stage,
  state,
  application
) => {

  if (stage?.description) {
    return stage.description;
  }


  const status =
    normalizeValue(
      application?.status
    );


  if (status === "DRAFT") {

    if (state === "current") {
      return "Start your application to begin this stage.";
    }

    return "This stage will become available when you start your application.";
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


  const status =
    normalizeValue(
      applicationStatus
    );


  /*
   * Draft = journey has not started.
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


  if (currentIndex < 0) {
    return 0;
  }


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
    getWorkflow(
      application
    );


  const currentIndex =
    getCurrentWorkflowIndex(
      workflow,
      application
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


  const isDraft =
    normalizeValue(
      application?.status
    ) === "DRAFT";


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
                state,
                application
              );


            const isLast =
              index ===
              workflow.length - 1;


            return (
              <div
                key={
                  stage?.key ||
                  stage?.label ||
                  `${index}`
                }
                className={`application-journey-stage ${state}`}
              >

                {/* =================================
                                    MARKER
                                ================================= */}

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


                {/* =================================
                                    CONTENT
                                ================================= */}

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
                        (isDraft
                          ? "Not started"
                          : "Upcoming")}

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