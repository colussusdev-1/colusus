import {
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineDocumentText,
  HiOutlineExclamationCircle,
  HiOutlineInformationCircle,
  HiOutlineRefresh,
  HiOutlineUpload,
} from "react-icons/hi";

import "./ApplicationActivity.css";

/*
============================================================
NORMALIZE ACTIVITY TYPE
============================================================
*/

const normalizeActivityType = (value) => {
  return String(value || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");
};

/*
============================================================
FORMAT DATE
============================================================
*/

const formatActivityDate = (date) => {
  if (!date) {
    return "Date unavailable";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return parsedDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

/*
============================================================
FORMAT TIME
============================================================
*/

const formatActivityTime = (date) => {
  if (!date) {
    return "";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

/*
============================================================
GET ACTIVITY ICON
============================================================
*/

const getActivityIcon = (type) => {
  switch (normalizeActivityType(type)) {
    case "DOCUMENT_UPLOADED":
      return HiOutlineUpload;

    case "DOCUMENT_REVIEW":
      return HiOutlineClock;

    case "DOCUMENT_APPROVED":
      return HiOutlineCheckCircle;

    case "DOCUMENT_REJECTED":
    case "DOCUMENT_REUPLOAD_REQUIRED":
    case "REJECTED":
      return HiOutlineExclamationCircle;

    case "DOCUMENTS_COMPLETED":
      return HiOutlineDocumentText;

    case "CREATED":
    case "STARTED":
    case "SUBMITTED":
    case "APPROVED":
    case "COMPLETED":
      return HiOutlineCheckCircle;

    case "UPDATED":
    case "STATUS_CHANGED":
      return HiOutlineRefresh;

    case "PENDING":
      return HiOutlineClock;

    default:
      return HiOutlineInformationCircle;
  }
};

/*
============================================================
GET ACTIVITY CLASS
============================================================
*/

const getActivityClass = (type) => {
  switch (normalizeActivityType(type)) {
    case "DOCUMENT_UPLOADED":
    case "DOCUMENT_REVIEW":
    case "DOCUMENTS_COMPLETED":
      return "document";

    case "DOCUMENT_APPROVED":
    case "APPROVED":
    case "COMPLETED":
    case "SUBMITTED":
      return "completed";

    case "DOCUMENT_REJECTED":
    case "DOCUMENT_REUPLOAD_REQUIRED":
    case "REJECTED":
      return "attention";

    case "CREATED":
    case "STARTED":
    case "UPDATED":
    case "STATUS_CHANGED":
      return "updated";

    case "PENDING":
      return "pending";

    default:
      return "default";
  }
};

/*
============================================================
GET ACTIVITY DATE
============================================================
*/

const getActivityDate = (activity) => {
  return (
    activity?.createdAt ||
    activity?.date ||
    activity?.updatedAt ||
    null
  );
};

/*
============================================================
GET ACTIVITY KEY
============================================================
*/

const getActivityKey = (activity, index) => {
  return (
    activity?._id ||
    activity?.id ||
    `${activity?.type || "activity"}-${getActivityDate(activity) || "unknown"
    }-${index}`
  );
};

/*
============================================================
LEGACY FALLBACK
============================================================
|
| Only used for old applications that do not yet have
| the activity array.
|
============================================================
*/

const buildFallbackActivity = (application) => {
  if (!application) {
    return [];
  }

  const activities = [];

  /*
  ----------------------------------------------------------
  CREATED
  ----------------------------------------------------------
  */

  if (application.createdAt) {
    activities.push({
      id: "legacy-application-created",

      type: "CREATED",

      title: "Application created",

      description:
        "Your application was created successfully.",

      createdAt: application.createdAt,
    });
  }

  /*
  ----------------------------------------------------------
  CURRENT STATUS
  ----------------------------------------------------------
  */

  const status = normalizeActivityType(
    application.status,
  );

  /*
  ----------------------------------------------------------
  IN PROGRESS
  ----------------------------------------------------------
  */

  if (status === "IN_PROGRESS") {
    activities.push({
      id: "legacy-application-started",

      type: "STARTED",

      title: "Application started",

      description:
        "You have started completing your application.",

      createdAt:
        application.updatedAt ||
        application.createdAt,
    });
  }

  /*
  ----------------------------------------------------------
  SUBMITTED
  ----------------------------------------------------------
  */

  if (status === "SUBMITTED") {
    activities.push({
      id: "legacy-application-submitted",

      type: "SUBMITTED",

      title: "Application submitted",

      description:
        "Your application has been submitted to Colusus.",

      createdAt:
        application.updatedAt ||
        application.createdAt,
    });
  }

  /*
  ----------------------------------------------------------
  UNDER REVIEW
  ----------------------------------------------------------
  */

  if (status === "UNDER_REVIEW") {
    activities.push({
      id: "legacy-application-review",

      type: "STATUS_CHANGED",

      title: "Application under review",

      description:
        "Your application is currently being reviewed by the Colusus team.",

      createdAt:
        application.updatedAt ||
        application.createdAt,
    });
  }

  /*
  ----------------------------------------------------------
  DOCUMENT REQUEST
  ----------------------------------------------------------
  */

  if (status === "DOCUMENT_REQUEST") {
    activities.push({
      id: "legacy-document-request",

      type: "STATUS_CHANGED",

      title: "Additional documents requested",

      description:
        "Colusus has requested additional documents for your application.",

      createdAt:
        application.updatedAt ||
        application.createdAt,
    });
  }

  /*
  ----------------------------------------------------------
  PROCESSING
  ----------------------------------------------------------
  */

  if (status === "PROCESSING") {
    activities.push({
      id: "legacy-application-processing",

      type: "STATUS_CHANGED",

      title: "Application processing",

      description:
        "Your application is currently being processed by the Colusus team.",

      createdAt:
        application.updatedAt ||
        application.createdAt,
    });
  }

  /*
  ----------------------------------------------------------
  APPROVED
  ----------------------------------------------------------
  */

  if (status === "APPROVED") {
    activities.push({
      id: "legacy-application-approved",

      type: "APPROVED",

      title: "Application approved",

      description:
        "Your application has been approved.",

      createdAt:
        application.updatedAt ||
        application.createdAt,
    });
  }

  /*
  ----------------------------------------------------------
  REJECTED
  ----------------------------------------------------------
  */

  if (status === "REJECTED") {
    activities.push({
      id: "legacy-application-rejected",

      type: "REJECTED",

      title: "Application requires attention",

      description:
        "Your application requires attention. Please review the latest information from Colusus.",

      createdAt:
        application.updatedAt ||
        application.createdAt,
    });
  }

  return activities;
};

/*
============================================================
GET APPLICATION ACTIVITIES
============================================================
*/

const getApplicationActivities = (application) => {
  /*
  ----------------------------------------------------------
  REAL BACKEND ACTIVITY
  ----------------------------------------------------------
  */

  if (Array.isArray(application?.activity)) {
    return application.activity;
  }

  /*
  ----------------------------------------------------------
  LEGACY FALLBACK
  ----------------------------------------------------------
  */

  return buildFallbackActivity(application);
};

/*
============================================================
COMPONENT
============================================================
*/

const ApplicationActivity = ({
  application,
  onRefresh,
  refreshing = false,
}) => {
  /*
  ----------------------------------------------------------
  ACTIVITIES
  ----------------------------------------------------------
  */

  const activities =
    getApplicationActivities(application);

  /*
  ----------------------------------------------------------
  SORT NEWEST FIRST
  ----------------------------------------------------------
  */

  const sortedActivities = [...activities]
    .filter(
      (activity) =>
        activity &&
        typeof activity === "object",
    )
    .sort((a, b) => {
      const dateA = new Date(
        getActivityDate(a) || 0,
      ).getTime();

      const dateB = new Date(
        getActivityDate(b) || 0,
      ).getTime();

      return dateB - dateA;
    });

  /*
  ----------------------------------------------------------
  REFRESH HANDLER
  ----------------------------------------------------------
  */

  const handleRefresh = async () => {
    if (
      refreshing ||
      typeof onRefresh !== "function"
    ) {
      return;
    }

    try {
      await onRefresh();
    } catch (error) {
      console.error(
        "FAILED TO REFRESH APPLICATION:",
        error,
      );
    }
  };

  return (
    <section className="application-activity">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="application-activity-header">

        <div>
          <span>
            APPLICATION ACTIVITY
          </span>

          <h2>
            Recent activity
          </h2>

          <p>
            Important updates and events from
            your application journey.
          </p>
        </div>

        {/* =================================================
            REFRESH
        ================================================= */}

        <button
          type="button"
          className={`application-activity-icon ${refreshing
              ? "is-refreshing"
              : ""
            }`}
          onClick={handleRefresh}
          disabled={
            refreshing ||
            typeof onRefresh !==
            "function"
          }
          aria-label="Refresh application activity"
          title="Refresh activity"
        >
          <HiOutlineRefresh />
        </button>

      </div>

      {/* =====================================================
          EMPTY STATE
      ===================================================== */}

      {!sortedActivities.length ? (

        <div className="application-activity-empty">

          <div className="application-activity-empty-icon">
            <HiOutlineClock />
          </div>

          <div>
            <strong>
              No activity yet
            </strong>

            <p>
              Activity will appear here as your
              application progresses.
            </p>
          </div>

        </div>

      ) : (

        /* =====================================================
           TIMELINE
        ===================================================== */

        <div className="application-activity-list">

          {sortedActivities.map(
            (activity, index) => {

              const type =
                normalizeActivityType(
                  activity.type,
                );

              const Icon =
                getActivityIcon(type);

              const activityClass =
                getActivityClass(type);

              const date =
                getActivityDate(
                  activity,
                );

              const isLast =
                index ===
                sortedActivities.length -
                1;

              return (
                <div
                  key={getActivityKey(
                    activity,
                    index,
                  )}
                  className={`application-activity-item ${activityClass}`}
                >

                  {/* =================================================
                      MARKER
                  ================================================= */}

                  <div className="application-activity-marker">

                    <div className="application-activity-marker-icon">
                      <Icon />
                    </div>

                    {!isLast && (
                      <span className="application-activity-line" />
                    )}

                  </div>

                  {/* =================================================
                      CONTENT
                  ================================================= */}

                  <div className="application-activity-content">

                    <div className="application-activity-top">

                      <h3>
                        {activity.title ||
                          "Application update"}
                      </h3>

                      <time>
                        {formatActivityDate(
                          date,
                        )}

                        {formatActivityTime(
                          date,
                        ) && (
                            <>
                              {" · "}
                              {formatActivityTime(
                                date,
                              )}
                            </>
                          )}
                      </time>

                    </div>

                    <p>
                      {activity.description ||
                        activity.message ||
                        "Your application has been updated."}
                    </p>

                    {/* =================================================
                        REVIEW NOTE
                    ================================================= */}

                    {activity?.metadata
                      ?.reviewNote && (
                        <div className="application-activity-note">

                          <HiOutlineInformationCircle />

                          <span>
                            {
                              activity.metadata
                                .reviewNote
                            }
                          </span>

                        </div>
                      )}

                  </div>

                </div>
              );
            },
          )}

        </div>
      )}

    </section>
  );
};

export default ApplicationActivity;