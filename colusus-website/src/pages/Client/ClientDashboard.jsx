import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineArrowRight,
  HiOutlineCalendar,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineDocumentText,
  HiOutlineLocationMarker,
} from "react-icons/hi";

import applicationService from "../../services/application.service";

import "./ClientDashboard.css";


const STATUS_CONFIG = {
  SUBMITTED: {
    label: "Submitted",
    className: "submitted",
    description: "Your application has been submitted and is awaiting review.",
  },

  UNDER_REVIEW: {
    label: "Under Review",
    className: "review",
    description: "Our team is currently reviewing your application.",
  },

  DOCUMENT_REQUEST: {
    label: "Documents Required",
    className: "documents",
    description: "Additional documents are required for your application.",
  },

  PROCESSING: {
    label: "Processing",
    className: "processing",
    description: "Your application is currently being processed.",
  },

  APPROVED: {
    label: "Approved",
    className: "approved",
    description: "Your application has been approved.",
  },

  REJECTED: {
    label: "Rejected",
    className: "rejected",
    description: "Your application requires attention.",
  },
};


const formatApplicationType = (type) => {

  if (!type) {
    return "Migration Application";
  }

  return type
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
};


const formatDate = (date) => {

  if (!date) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));

};


const calculateProgress = (status) => {

  const progress = {
    SUBMITTED: 15,
    UNDER_REVIEW: 30,
    DOCUMENT_REQUEST: 45,
    PROCESSING: 70,
    APPROVED: 100,
    REJECTED: 0,
  };

  return progress[status] ?? 0;

};


const getUser = () => {

  try {

    const storedUser =
      localStorage.getItem("colusus_user");

    return storedUser
      ? JSON.parse(storedUser)
      : null;

  } catch {

    return null;

  }

};


const ClientDashboard = () => {

  const [applications, setApplications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  const user = getUser();


  useEffect(() => {

    const loadApplications = async () => {

      try {

        setLoading(true);

        setError("");

        const data =
          await applicationService.getApplications();

        setApplications(
          Array.isArray(data)
            ? data
            : []
        );

      } catch (error) {

        console.error(
          "FAILED TO LOAD APPLICATIONS:",
          error
        );

        setError(
          error.response?.data?.message ||
          "Unable to load your applications."
        );

      } finally {

        setLoading(false);

      }

    };


    loadApplications();

  }, []);


  const activeApplication = useMemo(() => {

    if (!applications.length) {
      return null;
    }

    return applications.find(
      (application) =>
        ![
          "APPROVED",
          "REJECTED",
        ].includes(application.status)
    ) || applications[0];

  }, [applications]);


  const status =
    STATUS_CONFIG[
    activeApplication?.status
    ] || STATUS_CONFIG.SUBMITTED;


  const progress =
    calculateProgress(
      activeApplication?.status
    );


  const firstName =
    user?.name?.split(" ")[0] ||
    "there";


  return (

    <div className="client-dashboard">


      {/* =================================================
                HEADER
            ================================================= */}

      <section className="dashboard-header">

        <div>

          <span className="dashboard-eyebrow">
            CLIENT PORTAL
          </span>

          <h1>
            Welcome back, {firstName}.
          </h1>

          <p>
            Here's an overview of your
            migration journey.
          </p>

        </div>


        <Link
          to="/portal/applications"
          className="dashboard-header-link"
        >

          View Applications

          <HiOutlineArrowRight />

        </Link>

      </section>


      {/* =================================================
                ERROR
            ================================================= */}

      {error && (

        <div className="dashboard-alert error">

          {error}

        </div>

      )}


      {/* =================================================
                LOADING
            ================================================= */}

      {loading ? (

        <div className="dashboard-loading">

          <div className="dashboard-spinner" />

          <p>
            Loading your migration journey...
          </p>

        </div>

      ) : !activeApplication ? (

        /* =================================================
           NO APPLICATION
        ================================================= */

        <section className="empty-application">

          <div className="empty-application-icon">
            <HiOutlineDocumentText />
          </div>

          <h2>
            No migration application yet
          </h2>

          <p>
            Your client portal will display your
            application progress, documents and
            updates once an application has been created.
          </p>

          <Link
            to="/portal/applications"
            className="primary-action"
          >
            View Applications
            <HiOutlineArrowRight />
          </Link>

        </section>

      ) : (

        /* =================================================
           APPLICATION DASHBOARD
        ================================================= */

        <>

          {/* =============================================
                        APPLICATION SUMMARY
                    ============================================= */}

          <section className="application-hero">

            <div className="application-hero-main">

              <div className="application-title-row">

                <div>

                  <span className="application-label">
                    CURRENT APPLICATION
                  </span>

                  <h2>
                    {activeApplication.destinationCountry}
                  </h2>

                </div>


                <span
                  className={`application-status ${status.className}`}
                >
                  {status.label}
                </span>

              </div>


              <div className="application-meta">

                <span>
                  <HiOutlineLocationMarker />

                  {formatApplicationType(
                    activeApplication.type
                  )}
                </span>


                <span>
                  <HiOutlineCalendar />

                  Started{" "}
                  {formatDate(
                    activeApplication.createdAt
                  )}
                </span>

              </div>


              <p className="application-description">
                {status.description}
              </p>

            </div>


            <div className="application-progress">

              <div className="progress-heading">

                <span>
                  Journey Progress
                </span>

                <strong>
                  {progress}%
                </strong>

              </div>


              <div className="progress-track">

                <div
                  className="progress-fill"
                  style={{
                    width: `${progress}%`,
                  }}
                />

              </div>


              <span className="progress-caption">
                Based on your current application stage
              </span>

            </div>

          </section>


          {/* =============================================
                        QUICK STATS
                    ============================================= */}

          <section className="dashboard-stats">

            <div className="dashboard-stat-card">

              <div className="stat-icon blue">
                <HiOutlineDocumentText />
              </div>

              <div>

                <span>
                  Applications
                </span>

                <strong>
                  {applications.length}
                </strong>

              </div>

            </div>


            <div className="dashboard-stat-card">

              <div className="stat-icon orange">
                <HiOutlineClock />
              </div>

              <div>

                <span>
                  Current Status
                </span>

                <strong className="stat-status">
                  {status.label}
                </strong>

              </div>

            </div>


            <div className="dashboard-stat-card">

              <div className="stat-icon green">
                <HiOutlineCheckCircle />
              </div>

              <div>

                <span>
                  Priority
                </span>

                <strong>
                  {activeApplication.priority
                    ? activeApplication.priority
                      .charAt(0)
                      .toUpperCase() +
                    activeApplication.priority
                      .slice(1)
                      .toLowerCase()
                    : "Medium"}
                </strong>

              </div>

            </div>

          </section>


          {/* =============================================
                        CURRENT JOURNEY
                    ============================================= */}

          <section className="dashboard-content-grid">

            <div className="dashboard-panel">

              <div className="panel-header">

                <div>

                  <span className="panel-eyebrow">
                    YOUR JOURNEY
                  </span>

                  <h3>
                    Application Progress
                  </h3>

                </div>


                <Link
                  to="/portal/applications"
                  className="panel-link"
                >
                  Details
                  <HiOutlineArrowRight />
                </Link>

              </div>


              <div className="journey-list">

                {[
                  {
                    label: "Application Submitted",
                    active: true,
                  },
                  {
                    label: "Application Review",
                    active: [
                      "UNDER_REVIEW",
                      "DOCUMENT_REQUEST",
                      "PROCESSING",
                      "APPROVED",
                    ].includes(
                      activeApplication.status
                    ),
                  },
                  {
                    label: "Processing",
                    active: [
                      "PROCESSING",
                      "APPROVED",
                    ].includes(
                      activeApplication.status
                    ),
                  },
                  {
                    label: "Decision",
                    active:
                      activeApplication.status ===
                      "APPROVED",
                  },
                ].map((stage, index) => (

                  <div
                    className={`journey-item ${stage.active
                        ? "active"
                        : ""
                      }`}
                    key={stage.label}
                  >

                    <div className="journey-marker">

                      {stage.active ? (
                        <HiOutlineCheckCircle />
                      ) : (
                        <span>
                          {index + 1}
                        </span>
                      )}

                    </div>


                    <div className="journey-stage">

                      <strong>
                        {stage.label}
                      </strong>

                      <span>
                        {stage.active
                          ? "Completed or in progress"
                          : "Upcoming"}
                      </span>

                    </div>

                  </div>

                ))}

              </div>

            </div>


            {/* =========================================
                            NOTES
                        ========================================= */}

            <div className="dashboard-panel notes-panel">

              <div className="panel-header">

                <div>

                  <span className="panel-eyebrow">
                    LATEST INFORMATION
                  </span>

                  <h3>
                    From Your Team
                  </h3>

                </div>

              </div>


              {activeApplication.notes ? (

                <div className="dashboard-note">

                  <div className="note-icon">
                    <HiOutlineDocumentText />
                  </div>

                  <p>
                    {activeApplication.notes}
                  </p>

                </div>

              ) : (

                <div className="no-note">

                  <HiOutlineClock />

                  <p>
                    No new client notes have
                    been added to your application.
                  </p>

                </div>

              )}

            </div>

          </section>


          {/* =============================================
                        ALL APPLICATIONS
                    ============================================= */}

          {applications.length > 1 && (

            <section className="all-applications">

              <div className="panel-header">

                <div>

                  <span className="panel-eyebrow">
                    APPLICATION HISTORY
                  </span>

                  <h3>
                    Your Applications
                  </h3>

                </div>


                <Link
                  to="/portal/applications"
                  className="panel-link"
                >
                  View All
                  <HiOutlineArrowRight />
                </Link>

              </div>


              <div className="application-history">

                {applications.map(
                  (application) => {

                    const config =
                      STATUS_CONFIG[
                      application.status
                      ] ||
                      STATUS_CONFIG.SUBMITTED;


                    return (

                      <Link
                        key={application._id}
                        to="/portal/applications"
                        className="history-item"
                      >

                        <div>

                          <strong>
                            {application.destinationCountry}
                          </strong>

                          <span>
                            {formatApplicationType(
                              application.type
                            )}
                          </span>

                        </div>


                        <span
                          className={`application-status ${config.className}`}
                        >
                          {config.label}
                        </span>


                        <HiOutlineArrowRight />

                      </Link>

                    );

                  }
                )}

              </div>

            </section>

          )}

        </>

      )}

    </div>

  );

};


export default ClientDashboard;