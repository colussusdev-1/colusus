import React from "react";

import {
  HiOutlineDocumentText,
  HiOutlineGlobeAlt,
  HiOutlineLocationMarker,
  HiOutlineClock,
} from "react-icons/hi";

import "./ApplicationInformation.css";


/*
|--------------------------------------------------------------------------
| FORMAT
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
| DATE
|--------------------------------------------------------------------------
*/

const formatDate = (date) => {

  if (!date) {
    return "—";
  }

  const parsed =
    new Date(date);


  if (
    Number.isNaN(
      parsed.getTime()
    )
  ) {
    return "—";
  }


  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  ).format(parsed);

};


/*
|--------------------------------------------------------------------------
| COMPONENT
|--------------------------------------------------------------------------
*/

const ApplicationInformation = ({
  application,
}) => {

  const applicationReference =
    application?.applicationReference ||
    "—";


  const type =
    formatLabel(
      application?.type
    );


  const country =
    application?.destinationCountry ||
    "—";


  const currentStage =
    application?.currentStep ||
    application?.status ||
    "—";


  const updated =
    formatDate(
      application?.updatedAt ||
      application?.createdAt
    );


  const noc =
    application?.noc ||
    application?.occupation ||
    "—";


  return (

    <section className="applicationInformation">

      <div className="applicationInformation__header">

        <span>
          APPLICATION
        </span>

        <h2>
          Application Information
        </h2>

      </div>


      <div className="applicationInformation__grid">

        {/* ==================================================
            APPLICATION ID
        ================================================== */}

        <div className="applicationInformation__item">

          <div className="applicationInformation__icon">

            <HiOutlineDocumentText />

          </div>

          <div>

            <span>
              Application ID
            </span>

            <strong>
              {applicationReference}
            </strong>

          </div>

        </div>


        {/* ==================================================
            PROGRAM
        ================================================== */}

        <div className="applicationInformation__item">

          <div className="applicationInformation__icon">

            <HiOutlineDocumentText />

          </div>

          <div>

            <span>
              Program
            </span>

            <strong>
              {type}
            </strong>

          </div>

        </div>


        {/* ==================================================
            NOC
        ================================================== */}

        <div className="applicationInformation__item">

          <div className="applicationInformation__icon">

            <HiOutlineGlobeAlt />

          </div>

          <div>

            <span>
              NOC
            </span>

            <strong>
              {noc}
            </strong>

          </div>

        </div>


        {/* ==================================================
            COUNTRY
        ================================================== */}

        <div className="applicationInformation__item">

          <div className="applicationInformation__icon">

            <HiOutlineLocationMarker />

          </div>

          <div>

            <span>
              Destination Country
            </span>

            <strong>
              {country}
            </strong>

          </div>

        </div>


        {/* ==================================================
            CURRENT STAGE
        ================================================== */}

        <div className="applicationInformation__item">

          <div className="applicationInformation__icon">

            <HiOutlineDocumentText />

          </div>

          <div>

            <span>
              Current Stage
            </span>

            <strong>
              {formatLabel(currentStage)}
            </strong>

          </div>

        </div>


        {/* ==================================================
            UPDATED
        ================================================== */}

        <div className="applicationInformation__item">

          <div className="applicationInformation__icon">

            <HiOutlineClock />

          </div>

          <div>

            <span>
              Last Updated
            </span>

            <strong>
              {updated}
            </strong>

          </div>

        </div>

      </div>

    </section>

  );

};


export default ApplicationInformation;