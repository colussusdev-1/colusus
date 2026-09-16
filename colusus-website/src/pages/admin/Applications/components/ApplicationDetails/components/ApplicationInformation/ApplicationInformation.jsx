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
| FORMAT LABEL
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
      (letter) =>
        letter.toUpperCase()
    );

};


/*
|--------------------------------------------------------------------------
| FORMAT DATE
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
| GET PERMANENT APPLICATION REFERENCE
|--------------------------------------------------------------------------
|
| Every newly-created application receives:
|
| applicationReference
|
| Example:
|
| COL-68B3A91F4D2C8E7A1B5C9032
|
| This is the permanent human-facing application ID.
|
| _id is kept only as a fallback for legacy applications that
| were created before applicationReference existed.
|
|--------------------------------------------------------------------------
*/

const getApplicationReference = (
  application
) => {

  return (
    application?.applicationReference ||

    application?._id ||

    "—"
  );

};


/*
|--------------------------------------------------------------------------
| GET PROGRAM
|--------------------------------------------------------------------------
|
| Prefer the opportunity snapshot because it represents the
| opportunity selected when the application was created.
|
|--------------------------------------------------------------------------
*/

const getProgram = (
  application
) => {

  return (
    application
      ?.opportunitySnapshot
      ?.title ||

    application
      ?.opportunitySnapshot
      ?.program ||

    formatLabel(
      application?.type
    )
  );

};


/*
|--------------------------------------------------------------------------
| GET DESTINATION COUNTRY
|--------------------------------------------------------------------------
*/

const getDestinationCountry = (
  application
) => {

  return (
    application
      ?.destinationCountry ||

    application
      ?.opportunitySnapshot
      ?.countryName ||

    "—"
  );

};


/*
|--------------------------------------------------------------------------
| GET CURRENT STAGE
|--------------------------------------------------------------------------
*/

const getCurrentStage = (
  application
) => {

  return (
    application?.currentStep ||

    application?.status ||

    "—"
  );

};


/*
|--------------------------------------------------------------------------
| GET NOC
|--------------------------------------------------------------------------
|
| NOC can exist in different application data sections
| depending on how the application was completed.
|
|--------------------------------------------------------------------------
*/

const getNoc = (
  application
) => {

  return (
    application?.noc ||

    application?.occupation ||

    application
      ?.answers
      ?.noc ||

    application
      ?.answers
      ?.NOC ||

    application
      ?.personalInformation
      ?.noc ||

    application
      ?.personalInformation
      ?.NOC ||

    "—"
  );

};


/*
|--------------------------------------------------------------------------
| COMPONENT
|--------------------------------------------------------------------------
*/

const ApplicationInformation = ({
  application,
}) => {

  /*
  |--------------------------------------------------------------------------
  | RESOLVED APPLICATION DATA
  |--------------------------------------------------------------------------
  */

  const applicationReference =
    getApplicationReference(
      application
    );


  const program =
    getProgram(
      application
    );


  const country =
    getDestinationCountry(
      application
    );


  const currentStage =
    getCurrentStage(
      application
    );


  const updated =
    formatDate(
      application?.updatedAt ||
      application?.createdAt
    );


  const noc =
    getNoc(
      application
    );


  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (

    <section
      className="applicationInformation"
    >

      {/* =========================================================
          HEADER
      ========================================================= */}

      <div
        className="
          applicationInformation__header
        "
      >

        <span>
          APPLICATION
        </span>

        <h2>
          Application Information
        </h2>

      </div>


      {/* =========================================================
          INFORMATION GRID
      ========================================================= */}

      <div
        className="
          applicationInformation__grid
        "
      >

        {/* =======================================================
            APPLICATION ID
        ======================================================= */}

        <div
          className="
            applicationInformation__item
          "
        >

          <div
            className="
              applicationInformation__icon
            "
          >

            <HiOutlineDocumentText />

          </div>


          <div>

            <span>
              Application ID
            </span>

            <strong
              title={
                applicationReference !== "—"
                  ? applicationReference
                  : undefined
              }
            >
              {applicationReference}
            </strong>

          </div>

        </div>


        {/* =======================================================
            PROGRAM
        ======================================================= */}

        <div
          className="
            applicationInformation__item
          "
        >

          <div
            className="
              applicationInformation__icon
            "
          >

            <HiOutlineDocumentText />

          </div>


          <div>

            <span>
              Program
            </span>

            <strong
              title={
                program !== "—"
                  ? program
                  : undefined
              }
            >
              {program}
            </strong>

          </div>

        </div>


        {/* =======================================================
            NOC
        ======================================================= */}

        <div
          className="
            applicationInformation__item
          "
        >

          <div
            className="
              applicationInformation__icon
            "
          >

            <HiOutlineGlobeAlt />

          </div>


          <div>

            <span>
              NOC
            </span>

            <strong
              title={
                noc !== "—"
                  ? noc
                  : undefined
              }
            >
              {noc}
            </strong>

          </div>

        </div>


        {/* =======================================================
            DESTINATION COUNTRY
        ======================================================= */}

        <div
          className="
            applicationInformation__item
          "
        >

          <div
            className="
              applicationInformation__icon
            "
          >

            <HiOutlineLocationMarker />

          </div>


          <div>

            <span>
              Destination Country
            </span>

            <strong
              title={
                country !== "—"
                  ? country
                  : undefined
              }
            >
              {country}
            </strong>

          </div>

        </div>


        {/* =======================================================
            CURRENT STAGE
        ======================================================= */}

        <div
          className="
            applicationInformation__item
          "
        >

          <div
            className="
              applicationInformation__icon
            "
          >

            <HiOutlineDocumentText />

          </div>


          <div>

            <span>
              Current Stage
            </span>

            <strong
              title={
                currentStage !== "—"
                  ? formatLabel(currentStage)
                  : undefined
              }
            >
              {formatLabel(
                currentStage
              )}
            </strong>

          </div>

        </div>


        {/* =======================================================
            LAST UPDATED
        ======================================================= */}

        <div
          className="
            applicationInformation__item
          "
        >

          <div
            className="
              applicationInformation__icon
            "
          >

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