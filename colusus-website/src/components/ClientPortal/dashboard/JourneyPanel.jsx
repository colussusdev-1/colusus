import { Link } from "react-router-dom";

import {
  HiOutlineArrowRight,
  HiOutlineCheckCircle,
} from "react-icons/hi";

import worldMapBg from "../../../assets/images/world-map-bg.png";

import { JourneyVisual } from "./dashboard.visuals";

import {
  calculateProgress,
  getCurrentJourneyStage,
} from "./dashboard.utils";


const JourneyPanel = ({
  application,
  journeyStages = [],
  status,
  currentStage,
  progress,
}) => {

  if (!application) {
    return null;
  }


  /* =========================================================
     CURRENT STAGE
  ========================================================= */

  const activeStage =
    currentStage ||
    getCurrentJourneyStage(
      application,
    );


  /* =========================================================
     PROGRESS
  ========================================================= */

  const journeyProgress =
    Number.isFinite(
      Number(progress),
    )
      ? Number(progress)
      : calculateProgress(
        application,
      );


  /* =========================================================
     DESTINATION
  ========================================================= */

  const destinationCountry =
    application?.destinationCountry ||
    application?.opportunitySnapshot?.countryName ||
    application?.opportunity?.countryName ||
    "Unknown";


  /* =========================================================
     CURRENT DESCRIPTION
  ========================================================= */

  const currentDescription =
    activeStage?.description ||
    status?.description ||
    "Your application journey is progressing through Colusus.";


  /* =========================================================
     RENDER
  ========================================================= */

  return (

    <section className="colusus-panel journey-panel">


      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="panel-heading">

        <div>

          <span>
            YOUR JOURNEY
          </span>

          <h3>
            Application Progress
          </h3>

        </div>


        <Link
          to={`/portal/applications/${application._id}`}
        >

          Details

          <HiOutlineArrowRight />

        </Link>

      </div>


      {/* =====================================================
          DESCRIPTION
      ===================================================== */}

      <p className="panel-description">

        Track your application's progress
        through the Colusus journey.

      </p>


      {/* =====================================================
          DESTINATION VISUAL
      ===================================================== */}

      <div
        className="journey-panel-map"
        style={{
          backgroundImage:
            `url(${worldMapBg})`,
        }}
      >

        <div className="journey-map-label">

          <span />

          ACTIVE JOURNEY

        </div>


        <div className="journey-map-caption">

          <span>
            Migration route
          </span>

          <strong>
            {destinationCountry}
          </strong>

        </div>


        <JourneyVisual />

      </div>


      {/* =====================================================
          PROGRESS HEADER
      ===================================================== */}

      <div className="journey-progress-header">

        <div>

          <span>
            Journey Progress
          </span>

          <small>
            {activeStage?.label ||
              status?.label ||
              "Application journey"}
          </small>

        </div>


        <strong>
          {journeyProgress}%
        </strong>

      </div>


      {/* =====================================================
          PROGRESS BAR
      ===================================================== */}

      <div className="journey-progress-track">

        <span
          style={{
            width:
              `${journeyProgress}%`,
          }}
        />

      </div>


      {/* =====================================================
          TIMELINE
      ===================================================== */}

      <div className="timeline">

        {journeyStages.map(
          (stage, index) => {

            const isCompleted =
              stage.isCompleted ||
              stage.state === "completed";


            const isCurrent =
              stage.isCurrent ||
              stage.state === "current";


            const isLast =
              index ===
              journeyStages.length - 1;


            return (

              <div
                key={
                  stage.key ||
                  `${stage.step}-${index}`
                }

                className={`
                  timeline-item
                  ${isCompleted ? "completed" : ""}
                  ${isCurrent ? "current" : ""}
                  ${!isCompleted && !isCurrent ? "upcoming" : ""}
                `}
              >


                {/* =================================================
                    CONNECTOR
                ================================================= */}

                {!isLast && (

                  <span
                    className="timeline-line"
                  />

                )}


                {/* =================================================
                    MARKER
                ================================================= */}

                <div className="timeline-marker">

                  {isCompleted ? (

                    <HiOutlineCheckCircle />

                  ) : isCurrent ? (

                    <span />

                  ) : (

                    <b>
                      {index + 1}
                    </b>

                  )}

                </div>


                {/* =================================================
                    CONTENT
                ================================================= */}

                <div className="timeline-content">

                  <div className="timeline-title">

                    <strong>
                      {stage.label}
                    </strong>


                    {isCurrent && (

                      <span>
                        Current
                      </span>

                    )}

                  </div>


                  <p>

                    {isCurrent
                      ? currentDescription
                      : stage.description}

                  </p>

                </div>

              </div>

            );

          },
        )}

      </div>

    </section>
  );
};


export default JourneyPanel;