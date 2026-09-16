import React from "react";

import {
  HiOutlineCalendar,
  HiOutlineGlobeAlt,
  HiOutlineLocationMarker,
  HiOutlineDocumentText,
  HiOutlineClock,
} from "react-icons/hi";

import "./ApplicationOverview.css";


/*
============================================================
FORMAT LABEL
============================================================
*/

const formatLabel = (value) => {

  if (!value) {
    return "—";
  }

  return value
    .toString()
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(
      /\b\w/g,
      (letter) => letter.toUpperCase()
    );

};


/*
============================================================
FORMAT DATE
============================================================
*/

const formatDate = (value) => {

  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime()
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
  ).format(date);

};


/*
============================================================
GET APPLICATION ID
============================================================
*/

const getApplicationId = (
  application
) => {

  return (
    application?.applicationReference ||
    application?._id ||
    "—"
  );

};


/*
============================================================
GET PROGRAM
============================================================
|
| Program should come from the selected opportunity snapshot.
|
| Fallbacks are included because older applications may not
| have a complete opportunitySnapshot.
|
============================================================
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

    application
      ?.program ||

    formatLabel(
      application?.type
    )
  );

};


/*
============================================================
GET NOC
============================================================
|
| NOC may be stored in different application data sections
| depending on how the application was completed.
|
============================================================
*/

const getNoc = (
  application
) => {

  return (
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

    application
      ?.noc ||

    "—"
  );

};


/*
============================================================
GET CURRENT STAGE
============================================================
*/

const getCurrentStage = (
  application
) => {

  return (
    application?.currentStep
      ? formatLabel(
        application.currentStep
      )
      : "—"
  );

};


/*
============================================================
COMPONENT
============================================================
*/

const ApplicationOverview = ({
  application,
}) => {

  /*
  |--------------------------------------------------------------------------
  | RESOLVED APPLICATION DATA
  |--------------------------------------------------------------------------
  */

  const applicationId =
    getApplicationId(
      application
    );


  const program =
    getProgram(
      application
    );


  const noc =
    getNoc(
      application
    );


  const destinationCountry =
    application
      ?.destinationCountry ||
    application
      ?.opportunitySnapshot
      ?.countryName ||
    "—";


  const currentStage =
    getCurrentStage(
      application
    );


  const lastUpdated =
    formatDate(
      application?.updatedAt
    );


  /*
  |--------------------------------------------------------------------------
  | INFORMATION ITEMS
  |--------------------------------------------------------------------------
  */

  const items = [

    {
      label: "Application ID",

      value:
        applicationId,

      icon:
        HiOutlineDocumentText,
    },

    {
      label: "Program",

      value:
        program,

      icon:
        HiOutlineDocumentText,
    },

    {
      label: "NOC",

      value:
        noc,

      icon:
        HiOutlineGlobeAlt,
    },

    {
      label: "Destination Country",

      value:
        destinationCountry,

      icon:
        HiOutlineLocationMarker,
    },

    {
      label: "Current Stage",

      value:
        currentStage,

      icon:
        HiOutlineDocumentText,
    },

    {
      label: "Last Updated",

      value:
        lastUpdated,

      icon:
        HiOutlineClock,
    },

  ];


  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (

    <section
      className="applicationOverview"
    >

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div
        className="
          applicationOverview__header
        "
      >

        <div>

          <span>
            APPLICATION
          </span>

          <h2>
            Application Information
          </h2>

        </div>

      </div>


      {/* =====================================================
          INFORMATION GRID
      ===================================================== */}

      <div
        className="
          applicationOverview__grid
        "
      >

        {items.map(
          ({
            label,
            value,
            icon: Icon,
          }) => (

            <div
              className="
                applicationOverview__item
              "
              key={label}
            >

              {/* =================================================
                  ICON
              ================================================= */}

              <div
                className="
                  applicationOverview__icon
                "
              >

                <Icon />

              </div>


              {/* =================================================
                  VALUE
              ================================================= */}

              <div
                className="
                  applicationOverview__value
                "
              >

                <span>
                  {label}
                </span>

                <strong
                  title={
                    value !== "—"
                      ? value
                      : undefined
                  }
                >
                  {value}
                </strong>

              </div>

            </div>

          )
        )}

      </div>

    </section>

  );

};


export default ApplicationOverview;