import {
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineDocumentText,
  HiOutlineInformationCircle,
  HiOutlineRefresh,
} from "react-icons/hi";

import "./ApplicationActivity.css";


/* =========================================================
   HELPERS
========================================================= */

const normalizeStatus = (value) => {
  return String(value || "")
    .trim()
    .toUpperCase();
};


const formatActivityDate = (date) => {
  if (!date) {
    return "Date unavailable";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return parsedDate.toLocaleDateString(
    "en-GB",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
};


const formatActivityTime = (date) => {
  if (!date) {
    return "";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate.toLocaleTimeString(
    "en-GB",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );
};


const getActivityIcon = (type) => {
  switch (
  normalizeStatus(type)
  ) {
    case "DOCUMENT":
    case "DOCUMENT_UPLOADED":
    case "DOCUMENT_REVIEW":
      return HiOutlineDocumentText;

    case "COMPLETED":
    case "APPROVED":
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


const getActivityClass = (type) => {
  switch (
  normalizeStatus(type)
  ) {
    case "DOCUMENT":
    case "DOCUMENT_UPLOADED":
    case "DOCUMENT_REVIEW":
      return "document";

    case "COMPLETED":
    case "APPROVED":
      return "completed";

    case "UPDATED":
    case "STATUS_CHANGED":
      return "updated";

    case "PENDING":
      return "pending";

    default:
      return "default";
  }
};


/* =========================================================
   BUILD FALLBACK ACTIVITY
========================================================= */

const buildFallbackActivity = (
  application
) => {

  if (!application) {
    return [];
  }


  const activities = [];


  /*
   * Application creation
   */

  if (application.createdAt) {
    activities.push({
      id: "application-created",

      type: "CREATED",

      title: "Application submitted",

      description:
        "Your application was successfully submitted to Colusus.",

      date: application.createdAt,
    });
  }


  /*
   * Current status.
   *
   * We only add this when updatedAt exists
   * and is different from createdAt.
   */

  if (
    application.updatedAt &&
    application.createdAt &&
    application.updatedAt !==
    application.createdAt
  ) {
    activities.push({
      id: "application-updated",

      type: "UPDATED",

      title: "Application updated",

      description:
        "Your application information or status was updated.",

      date: application.updatedAt,
    });
  }


  /*
   * Current terminal state.
   */

  const status =
    normalizeStatus(
      application.status
    );


  if (status === "APPROVED") {
    activities.push({
      id: "application-approved",

      type: "APPROVED",

      title: "Application approved",

      description:
        "Your application has been approved.",

      date:
        application.updatedAt ||
        application.createdAt,
    });
  }


  if (status === "REJECTED") {
    activities.push({
      id: "application-rejected",

      type: "UPDATED",

      title: "Application status updated",

      description:
        "Your application status has been updated. Please review the latest information.",

      date:
        application.updatedAt ||
        application.createdAt,
    });
  }


  return activities;
};


/* =========================================================
   COMPONENT
========================================================= */

const ApplicationActivity = ({
  application,
}) => {

  /*
   * Prefer real activity data if the backend
   * eventually provides it.
   *
   * Fallback activity keeps the component
   * useful with the current Application model.
   */

  const activities =
    Array.isArray(
      application?.activity
    )
      ? application.activity
      : Array.isArray(
        application?.activities
      )
        ? application.activities
        : buildFallbackActivity(
          application
        );


  const sortedActivities = [
    ...activities,
  ].sort(
    (a, b) =>
      new Date(b.date || b.createdAt) -
      new Date(a.date || a.createdAt)
  );


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


        <div className="application-activity-icon">
          <HiOutlineRefresh />
        </div>

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

              const Icon =
                getActivityIcon(
                  activity.type
                );


              const activityClass =
                getActivityClass(
                  activity.type
                );


              const date =
                activity.date ||
                activity.createdAt;


              const isLast =
                index ===
                sortedActivities.length - 1;


              return (
                <div
                  key={
                    activity.id ||
                    activity._id ||
                    `${activity.title}-${index}`
                  }
                  className={`application-activity-item ${activityClass}`}
                >

                  {/* =================================================
                      TIMELINE
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
                          date
                        )}

                        {formatActivityTime(
                          date
                        ) && (
                            <>
                              {" · "}
                              {formatActivityTime(
                                date
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

                  </div>

                </div>
              );
            }
          )}

        </div>
      )}

    </section>
  );
};


export default ApplicationActivity;