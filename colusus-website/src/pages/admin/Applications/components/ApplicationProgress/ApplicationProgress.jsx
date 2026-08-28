import React from "react";

import {
  HiOutlineInformationCircle,
} from "react-icons/hi";

import "./ApplicationProgress.css";


/*
|--------------------------------------------------------------------------
| STAGE LABEL
|--------------------------------------------------------------------------
*/

const formatLabel = (value) => {

  if (!value) {
    return "—";
  }

  return value
    .toString()
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(
      /\b\w/g,
      (letter) => letter.toUpperCase()
    );

};


/*
|--------------------------------------------------------------------------
| STAGE ORDER
|--------------------------------------------------------------------------
|
| This is ONLY presentation.
|
| The backend remains responsible for the actual
| application status/progress.
|
*/

const stages = [
  "SUBMITTED",
  "UNDER_REVIEW",
  "DOCUMENT_REQUEST",
  "PROCESSING",
  "DECISION",
  "COMPLETED",
];


/*
|--------------------------------------------------------------------------
| COMPONENT
|--------------------------------------------------------------------------
*/

const ApplicationProgress = ({
  application,
}) => {

  const progress =
    Number(
      application?.progress
    ) || 0;


  const currentStep =
    application?.currentStep ||
    application?.status ||
    "SUBMITTED";


  const currentIndex =
    stages.indexOf(
      currentStep
    );


  const activeIndex =
    currentIndex >= 0
      ? currentIndex
      : 0;


  return (

    <section className="applicationProgress">

      <div className="applicationProgress__header">

        <div>

          <span className="applicationProgress__eyebrow">
            APPLICATION PROGRESS
          </span>

          <h2>
            Application Progress
          </h2>

        </div>

      </div>


      {/* ==================================================
          PIPELINE
      ================================================== */}

      <div className="applicationProgress__pipeline">

        {stages.map(
          (stage, index) => {

            const isCompleted =
              index < activeIndex;

            const isActive =
              index === activeIndex;


            return (

              <React.Fragment
                key={stage}
              >

                <div
                  className={
                    `applicationProgress__stage ${isCompleted
                      ? "is-completed"
                      : ""
                    } ${isActive
                      ? "is-active"
                      : ""
                    }`
                  }
                >

                  <span className="applicationProgress__dot">

                    {isCompleted && "✓"}

                    {!isCompleted &&
                      index + 1}

                  </span>


                  <span className="applicationProgress__label">

                    {formatLabel(stage)}

                  </span>

                </div>


                {index <
                  stages.length - 1 && (

                    <div
                      className={
                        `applicationProgress__line ${index < activeIndex
                          ? "is-completed"
                          : ""
                        }`
                      }
                    />

                  )}

              </React.Fragment>

            );

          }
        )}

      </div>


      {/* ==================================================
          DESCRIPTION
      ================================================== */}

      <div className="applicationProgress__message">

        <HiOutlineInformationCircle />

        <p>

          {application?.progressDescription ||
            "Application progress represents the overall migration journey, not document completion."}

        </p>

      </div>

    </section>

  );

};


export default ApplicationProgress;