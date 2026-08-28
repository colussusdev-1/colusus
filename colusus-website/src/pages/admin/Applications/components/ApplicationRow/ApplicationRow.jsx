import React from "react";

import {
  HiOutlineChevronRight,
} from "react-icons/hi";

import "./ApplicationRow.css";


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


/*
============================================================
RELATIVE TIME
============================================================
*/

const formatRelativeTime = (
  date
) => {

  if (!date) {
    return "—";
  }

  const timestamp =
    new Date(date).getTime();

  if (Number.isNaN(timestamp)) {
    return "—";
  }

  const difference =
    Date.now() - timestamp;

  const minutes =
    Math.floor(
      difference /
      (1000 * 60)
    );

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours =
    Math.floor(
      minutes / 60
    );

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days =
    Math.floor(
      hours / 24
    );

  if (days < 7) {
    return `${days}d ago`;
  }

  const weeks =
    Math.floor(
      days / 7
    );

  if (weeks < 5) {
    return `${weeks}w ago`;
  }

  return new Date(date)
    .toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
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

    case "IN_PROGRESS":
      return "progress";

    case "DRAFT":
      return "draft";

    default:
      return "default";

  }

};


/*
============================================================
COMPONENT
============================================================
*/

const ApplicationRow = ({
  application,
  onClick,
}) => {

  /*
  |--------------------------------------------------------------------------
  | CLIENT
  |--------------------------------------------------------------------------
  */

  const clientName =
    application?.user?.name ||
    "Unknown client";

  const clientEmail =
    application?.user?.email ||
    "";


  /*
  |--------------------------------------------------------------------------
  | APPLICATION
  |--------------------------------------------------------------------------
  */

  const country =
    application?.destinationCountry ||
    "—";

  const currentStep =
    application?.currentStep ||
    "";

  const status =
    application?.status ||
    "DRAFT";


  /*
  |--------------------------------------------------------------------------
  | OVERALL APPLICATION PROGRESS
  |--------------------------------------------------------------------------
  |
  | This comes directly from the backend API.
  |
  | It is NOT document progress.
  |
  */

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


  /*
  |--------------------------------------------------------------------------
  | APPLICATION REFERENCE
  |--------------------------------------------------------------------------
  */

  const applicationReference =
    application?.applicationReference ||
    "—";


  /*
  |--------------------------------------------------------------------------
  | ASSIGNED STAFF
  |--------------------------------------------------------------------------
  */

  const assignedTo =
    application
      ?.assignedTo
      ?.name ||
    "Unassigned";


  return (

    <tr
      className="applicationRow"
      onClick={onClick}
    >

      {/* ==================================================
          APPLICATION
      ================================================== */}

      <td>

        <div className="applicationRow__id">

          <span>
            {applicationReference}
          </span>

        </div>

      </td>


      {/* ==================================================
          CLIENT
      ================================================== */}

      <td>

        <div className="applicationRow__client">

          <div className="applicationRow__avatar">

            {clientName
              .charAt(0)
              .toUpperCase()}

          </div>


          <div className="applicationRow__identity">

            <strong>
              {clientName}
            </strong>


            {clientEmail && (

              <span>
                {clientEmail}
              </span>

            )}

          </div>

        </div>

      </td>


      {/* ==================================================
          COUNTRY
      ================================================== */}

      <td>

        <span className="applicationRow__country">

          {country}

        </span>

      </td>


      {/* ==================================================
          STAGE
      ================================================== */}

      <td>

        <div className="applicationRow__stage">

          <span
            className={
              `applicationRow__status applicationRow__status--${getStatusClass(
                status
              )}`
            }
          >

            {formatLabel(
              currentStep
            )}

          </span>


          <small>

            {formatLabel(
              status
            )}

          </small>

        </div>

      </td>


      {/* ==================================================
          OVERALL PROGRESS
      ================================================== */}

      <td>

        <div className="applicationRow__progress">

          <div
            className="applicationRow__progressTrack"
            aria-label={
              `Application journey progress: ${progress}%`
            }
          >

            <span
              style={{
                width: `${progress}%`,
              }}
            />

          </div>


          <strong>
            {progress}%
          </strong>

        </div>

      </td>


      {/* ==================================================
          UPDATED
      ================================================== */}

      <td>

        <span className="applicationRow__updated">

          {formatRelativeTime(
            application?.updatedAt
          )}

        </span>

      </td>


      {/* ==================================================
          ASSIGNED TO
      ================================================== */}

      <td>

        <div className="applicationRow__assigned">

          <span
            className={
              assignedTo === "Unassigned"
                ? "is-unassigned"
                : ""
            }
          >

            {assignedTo}

          </span>

        </div>

      </td>


      {/* ==================================================
          ACTION
      ================================================== */}

      <td>

        <button
          type="button"
          className="applicationRow__action"
          onClick={(event) => {

            event.stopPropagation();

            onClick();

          }}
          aria-label={
            `Open application for ${clientName}`
          }
        >

          <HiOutlineChevronRight />

        </button>

      </td>

    </tr>

  );

};


export default ApplicationRow;