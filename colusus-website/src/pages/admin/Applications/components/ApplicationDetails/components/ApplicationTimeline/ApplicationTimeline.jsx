import React from "react";

import {
  HiOutlineCheck,
  HiOutlineDocumentText,
  HiOutlinePencil,
  HiOutlineRefresh,
  HiOutlineClock,
  HiOutlineInformationCircle,
  HiOutlineExclamationCircle,
} from "react-icons/hi";

import "./ApplicationTimeline.css";


/*
|--------------------------------------------------------------------------
| FORMAT LABEL
|--------------------------------------------------------------------------
*/

const formatLabel = (value) => {
  if (!value) {
    return "Activity";
  }

  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (character) =>
      character.toUpperCase(),
    );
};


/*
|--------------------------------------------------------------------------
| NORMALIZE ACTIVITY TYPE
|--------------------------------------------------------------------------
*/

const normalizeType = (type) => {
  return String(type || "")
    .trim()
    .toUpperCase();
};


/*
|--------------------------------------------------------------------------
| GET ACTIVITY ICON
|--------------------------------------------------------------------------
*/

const getActivityIcon = (type) => {
  const normalizedType =
    normalizeType(type);

  switch (normalizedType) {

    case "CREATED":
      return <HiOutlineDocumentText />;

    case "STARTED":
      return <HiOutlineCheck />;

    case "DOCUMENT_UPLOADED":
      return <HiOutlineDocumentText />;

    case "DOCUMENT_REVIEW":
      return <HiOutlineRefresh />;

    case "DOCUMENT_APPROVED":
      return <HiOutlineCheck />;

    case "DOCUMENT_REJECTED":
      return <HiOutlineExclamationCircle />;

    case "DOCUMENT_REUPLOAD_REQUIRED":
      return <HiOutlineExclamationCircle />;

    case "DOCUMENTS_COMPLETED":
      return <HiOutlineCheck />;

    case "STATUS_CHANGED":
      return <HiOutlineRefresh />;

    case "SUBMITTED":
      return <HiOutlineCheck />;

    case "APPROVED":
      return <HiOutlineCheck />;

    case "REJECTED":
      return <HiOutlineExclamationCircle />;

    case "UPDATED":
      return <HiOutlinePencil />;

    default:
      return <HiOutlineInformationCircle />;
  }
};


/*
|--------------------------------------------------------------------------
| GET ACTIVITY CLASS
|--------------------------------------------------------------------------
*/

const getActivityClass = (type) => {
  const normalizedType =
    normalizeType(type);

  switch (normalizedType) {

    case "CREATED":
      return "created";

    case "STARTED":
      return "started";

    case "DOCUMENT_UPLOADED":
      return "document";

    case "DOCUMENT_REVIEW":
      return "review";

    case "DOCUMENT_APPROVED":
      return "completed";

    case "DOCUMENT_REJECTED":
      return "rejected";

    case "DOCUMENT_REUPLOAD_REQUIRED":
      return "rejected";

    case "DOCUMENTS_COMPLETED":
      return "completed";

    case "STATUS_CHANGED":
      return "status";

    case "SUBMITTED":
      return "submitted";

    case "APPROVED":
      return "approved";

    case "REJECTED":
      return "rejected";

    case "UPDATED":
      return "updated";

    default:
      return "default";
  }
};


/*
|--------------------------------------------------------------------------
| FORMAT DATE
|--------------------------------------------------------------------------
*/

const formatDate = (value) => {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  );
};


/*
|--------------------------------------------------------------------------
| FORMAT TIME
|--------------------------------------------------------------------------
*/

const formatTime = (value) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleTimeString(
    "en-GB",
    {
      hour: "2-digit",
      minute: "2-digit",
    },
  );
};


/*
|--------------------------------------------------------------------------
| GET ACTIVITY DESCRIPTION
|--------------------------------------------------------------------------
|
| Backend descriptions are preferred.
|
| These fallback descriptions are only used when the backend
| activity record does not contain a description.
|
|--------------------------------------------------------------------------
*/

const getActivityDescription = (
  activity,
) => {

  if (activity?.description) {
    return activity.description;
  }

  const type =
    normalizeType(
      activity?.type,
    );

  switch (type) {

    case "CREATED":
      return "The application was created successfully.";

    case "STARTED":
      return "The client started completing the application.";

    case "DOCUMENT_UPLOADED":
      return "A document was uploaded to the application.";

    case "DOCUMENT_REVIEW":
      return "A document was reviewed by the Colusus team.";

    case "DOCUMENT_APPROVED":
      return "A document was approved by the Colusus team.";

    case "DOCUMENT_REJECTED":
      return "A document was rejected during review.";

    case "DOCUMENT_REUPLOAD_REQUIRED":
      return "A document requires a new upload.";

    case "DOCUMENTS_COMPLETED":
      return "All required documents have been completed.";

    case "STATUS_CHANGED":
      return "The application status was updated.";

    case "SUBMITTED":
      return "The application was submitted for review.";

    case "APPROVED":
      return "The application was approved.";

    case "REJECTED":
      return "The application was rejected.";

    case "UPDATED":
      return "Application information was updated.";

    default:
      return "Application activity was recorded.";
  }
};


/*
|--------------------------------------------------------------------------
| GET DOCUMENT NAME
|--------------------------------------------------------------------------
*/

const getDocumentName = (
  activity,
) => {

  return (
    activity?.metadata?.documentName ||
    activity?.metadata?.name ||
    ""
  );
};


/*
|--------------------------------------------------------------------------
| ACTIVITY ITEM
|--------------------------------------------------------------------------
*/

const ActivityItem = ({
  activity,
  isLast,
}) => {

  const type =
    normalizeType(
      activity?.type,
    );


  const activityClass =
    getActivityClass(type);


  const createdAt =
    activity?.createdAt ||
    activity?.updatedAt;


  const documentName =
    getDocumentName(
      activity,
    );


  return (

    <article
      className={
        `applicationTimeline__item applicationTimeline__item--${activityClass}`
      }
    >

      {/* =====================================================
          TIMELINE RAIL
      ===================================================== */}

      <div
        className="
          applicationTimeline__rail
        "
      >

        <div
          className="
            applicationTimeline__icon
          "
        >

          {getActivityIcon(type)}

        </div>


        {!isLast && (

          <div
            className="
              applicationTimeline__line
            "
          />

        )}

      </div>


      {/* =====================================================
          ACTIVITY CONTENT
      ===================================================== */}

      <div
        className="
          applicationTimeline__content
        "
      >

        {/* ===================================================
            DATE
        =================================================== */}

        <div
          className="
            applicationTimeline__date
          "
        >

          <span>
            {formatDate(createdAt)}
          </span>


          {formatTime(createdAt) && (
            <>

              <i />

              <span>
                {formatTime(createdAt)}
              </span>

            </>
          )}

        </div>


        {/* ===================================================
            TITLE
        =================================================== */}

        <h3>
          {activity?.title ||
            formatLabel(type)}
        </h3>


        {/* ===================================================
            DESCRIPTION
        =================================================== */}

        <p>
          {getActivityDescription(
            activity,
          )}
        </p>


        {/* ===================================================
            DOCUMENT NAME
        =================================================== */}

        {documentName && (

          <div
            className="
              applicationTimeline__documentName
            "
          >

            <HiOutlineDocumentText />

            <span>
              {documentName}
            </span>

          </div>

        )}


        {/* ===================================================
            STATUS CHANGE
        =================================================== */}

        {type === "STATUS_CHANGED" &&
          activity?.metadata && (

            <div
              className="
                applicationTimeline__statusChange
              "
            >

              {activity.metadata.fromStatus && (

                <span>
                  {formatLabel(
                    activity.metadata.fromStatus,
                  )}
                </span>

              )}


              <span
                className="
                  applicationTimeline__statusArrow
                "
              >
                →
              </span>


              {activity.metadata.toStatus && (

                <strong>
                  {formatLabel(
                    activity.metadata.toStatus,
                  )}
                </strong>

              )}

            </div>

          )}


        {/* ===================================================
            DOCUMENT PROGRESS
        =================================================== */}

        {type === "DOCUMENTS_COMPLETED" &&
          activity?.metadata && (

            <div
              className="
                applicationTimeline__documentMeta
              "
            >

              {activity.metadata.required !==
                undefined && (

                  <span>
                    {activity.metadata.required} required
                  </span>

                )}


              {activity.metadata.uploaded !==
                undefined && (

                  <span>
                    {activity.metadata.uploaded} uploaded
                  </span>

                )}


              {activity.metadata.percentage !==
                undefined && (

                  <strong>
                    {activity.metadata.percentage}%
                  </strong>

                )}

            </div>

          )}


        {/* ===================================================
            REVIEW NOTE
        =================================================== */}

        {activity?.metadata?.reviewNote && (

          <div
            className="
              applicationTimeline__reviewNote
            "
          >

            <span>
              Review note
            </span>

            <p>
              {activity.metadata.reviewNote}
            </p>

          </div>

        )}

      </div>

    </article>

  );
};


/*
|--------------------------------------------------------------------------
| MAIN COMPONENT
|--------------------------------------------------------------------------
*/

const ApplicationTimeline = ({
  application,
}) => {

  /*
  |--------------------------------------------------------------------------
  | ACTIVITY
  |--------------------------------------------------------------------------
  */

  const activities =
    Array.isArray(
      application?.activity,
    )
      ? [...application.activity]
      : [];


  /*
  |--------------------------------------------------------------------------
  | SORT NEWEST FIRST
  |--------------------------------------------------------------------------
  */

  activities.sort(
    (a, b) =>
      new Date(
        b?.createdAt || 0,
      ) -
      new Date(
        a?.createdAt || 0,
      ),
  );


  /*
  |--------------------------------------------------------------------------
  | EMPTY STATE
  |--------------------------------------------------------------------------
  */

  if (activities.length === 0) {

    return (

      <section
        className="
          applicationTimeline
        "
      >

        <div
          className="
            applicationTimeline__header
          "
        >

          <div>

            <span
              className="
                applicationTimeline__eyebrow
              "
            >
              APPLICATION HISTORY
            </span>


            <h2>
              Application Timeline
            </h2>


            <p>
              A record of important events
              throughout this application journey.
            </p>

          </div>

        </div>


        <div
          className="
            applicationTimeline__empty
          "
        >

          <div
            className="
              applicationTimeline__emptyIcon
            "
          >

            <HiOutlineClock />

          </div>


          <h3>
            No activity yet
          </h3>


          <p>
            Application activity will appear
            here as the application progresses.
          </p>

        </div>

      </section>

    );
  }


  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (

    <section
      className="
        applicationTimeline
      "
    >

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div
        className="
          applicationTimeline__header
        "
      >

        <div>

          <span
            className="
              applicationTimeline__eyebrow
            "
          >
            APPLICATION HISTORY
          </span>


          <h2>
            Application Timeline
          </h2>


          <p>
            A record of important events
            throughout this application journey.
          </p>

        </div>


        {/* ===================================================
            EVENT COUNT
        =================================================== */}

        <div
          className="
            applicationTimeline__count
          "
        >

          <strong>
            {activities.length}
          </strong>


          <span>
            {activities.length === 1
              ? "Event"
              : "Events"}
          </span>

        </div>

      </div>


      {/* =====================================================
          TIMELINE
      ===================================================== */}

      <div
        className="
          applicationTimeline__list
        "
      >

        {activities.map(
          (
            activity,
            index,
          ) => (

            <ActivityItem

              key={
                activity?._id ||
                `${activity?.type}-${activity?.createdAt}-${index}`
              }

              activity={
                activity
              }

              isLast={
                index ===
                activities.length - 1
              }

            />

          ),
        )}

      </div>

    </section>

  );
};


export default ApplicationTimeline;