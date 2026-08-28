import React from "react";

import {
  HiOutlineLocationMarker,
} from "react-icons/hi";

import "./ApplicationDetailsHeader.css";


/*
============================================================
FORMAT LABEL
============================================================
*/

const formatLabel = (
  value
) => {

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
============================================================
STATUS CLASS
============================================================
*/

const getStatusClass = (
  status
) => {

  switch (status) {

    case "APPROVED":
      return "approved";

    case "REJECTED":
      return "rejected";

    case "UNDER_REVIEW":
      return "review";

    case "DOCUMENT_REQUEST":
      return "document";

    case "PROCESSING":
      return "processing";

    case "SUBMITTED":
      return "submitted";

    default:
      return "default";

  }

};


/*
============================================================
COMPONENT
============================================================
*/

const ApplicationDetailsHeader = ({
  application,
  actions,
}) => {

  /*
  |--------------------------------------------------------------------------
  | CLIENT
  |--------------------------------------------------------------------------
  */

  const clientName =
    application?.user?.name ||
    "Unknown Client";


  /*
  |--------------------------------------------------------------------------
  | COUNTRY
  |--------------------------------------------------------------------------
  */

  const country =
    application?.destinationCountry ||
    "—";


  /*
  |--------------------------------------------------------------------------
  | APPLICATION TYPE
  |--------------------------------------------------------------------------
  */

  const type =
    formatLabel(
      application?.type
    );


  /*
  |--------------------------------------------------------------------------
  | STATUS
  |--------------------------------------------------------------------------
  */

  const status =
    application?.status ||
    "SUBMITTED";


  /*
  |--------------------------------------------------------------------------
  | APPLICATION REFERENCE
  |--------------------------------------------------------------------------
  */

  const applicationReference =
    application?.applicationReference ||
    "Application";


  /*
  |--------------------------------------------------------------------------
  | STATUS CLASS
  |--------------------------------------------------------------------------
  */

  const statusClass =
    getStatusClass(
      status
    );


  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (

    <section
      className="
        applicationDetailsHeader
      "
    >

      {/* =========================================================
          APPLICATION INFORMATION
      ========================================================= */}

      <div
        className="
          applicationDetailsHeader__main
        "
      >

        {/* =====================================================
            EYEBROW
        ===================================================== */}

        <div
          className="
            applicationDetailsHeader__eyebrow
          "
        >

          <span>
            APPLICATION
          </span>


          <strong>
            {applicationReference}
          </strong>

        </div>


        {/* =====================================================
            CLIENT NAME
        ===================================================== */}

        <h1>
          {clientName}
        </h1>


        {/* =====================================================
            APPLICATION META
        ===================================================== */}

        <div
          className="
            applicationDetailsHeader__meta
          "
        >

          <span>

            <HiOutlineLocationMarker />

            {country}

          </span>


          <i />


          <span>
            {type}
          </span>

        </div>

      </div>


      {/* =========================================================
          ACTION AREA
      ========================================================= */}

      <div
        className="
          applicationDetailsHeader__actions
        "
      >

        {/* =====================================================
            CURRENT STATUS
        ===================================================== */}

        <span
          className={
            `
            applicationDetailsHeader__status
            applicationDetailsHeader__status--${statusClass}
            `
          }
        >

          <i />

          {formatLabel(
            status
          )}

        </span>


        {/* =====================================================
            APPLICATION ACTIONS
        ===================================================== */}

        {actions}

      </div>

    </section>

  );

};


export default ApplicationDetailsHeader;