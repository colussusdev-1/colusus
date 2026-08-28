import React from "react";

import {
  HiOutlineCheckCircle,
  HiOutlineClock,
} from "react-icons/hi";

import "./ApplicationJourney.css";


const formatLabel = (
  value
) => {

  if (!value) {
    return "—";
  }


  return value
    .toLowerCase()
    .replace(
      /_/g,
      " "
    )
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase()
    );

};


const ApplicationJourney = ({
  application,
}) => {

  const progress =
    Math.min(
      Math.max(
        Number(
          application?.progress
        ) || 0,
        0
      ),
      100
    );


  const status =
    application?.status ||
    "DRAFT";


  const currentStep =
    application?.currentStep ||
    "—";


  return (

    <section className="applicationJourney">

      <div className="applicationJourney__header">

        <div className="applicationJourney__title">

          <div className="applicationJourney__icon">

            <HiOutlineCheckCircle />

          </div>


          <div>

            <span>
              MIGRATION JOURNEY
            </span>

            <h2>
              Overall Progress
            </h2>

          </div>

        </div>


        <strong className="applicationJourney__percentage">

          {progress}%

        </strong>

      </div>


      <div className="applicationJourney__track">

        <span
          style={{
            width: `${progress}%`,
          }}
        />

      </div>


      <div className="applicationJourney__meta">

        <div>

          <span>
            Current stage
          </span>

          <strong>
            {formatLabel(
              currentStep
            )}
          </strong>

        </div>


        <div>

          <span>
            Application status
          </span>

          <strong>
            {formatLabel(
              status
            )}
          </strong>

        </div>

      </div>


      <div className="applicationJourney__notice">

        <HiOutlineClock />

        <p>
          Progress represents the overall
          migration journey, not document
          completion.
        </p>

      </div>

    </section>

  );

};


export default ApplicationJourney;