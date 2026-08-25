import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  HiOutlineArrowRight,
  HiOutlinePlus,
  HiOutlineRefresh,
} from "react-icons/hi";

import applicationService from "../../services/application.service";

import "./ClientDashboard.css";

import {
  calculateProgress,
  getDocumentProgress,
  getStatusConfig,
  getUser,
} from "../../components/ClientPortal/dashboard/dashboard.utils";

import {
  getCountryFlag,
} from "../../components/ClientPortal/dashboard/countries";

import ApplicationHistory from "../../components/ClientPortal/dashboard/ApplicationHistory";

import {
  DashboardAlert,
  DashboardLoading,
  DashboardEmpty,
} from "../../components/ClientPortal/dashboard/DashboardStates";


const ClientDashboard = () => {

  /* =========================================================
     STATE
  ========================================================= */

  const [applications, setApplications] = useState([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");


  /* =========================================================
     USER
  ========================================================= */

  const user = getUser();


  /* =========================================================
     LOAD APPLICATIONS
  ========================================================= */

  const loadApplications = useCallback(
    async (isRefresh = false) => {

      /*
      ---------------------------------------------------------
      PREVENT DUPLICATE REFRESH REQUESTS
      ---------------------------------------------------------
      */

      if (isRefresh && refreshing) {
        return;
      }


      const refreshStartedAt = Date.now();


      try {

        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }


        setError("");


        /*
        -------------------------------------------------------
        FETCH FRESH APPLICATION DATA
        -------------------------------------------------------
        */

        const data =
          await applicationService.getApplications();


        /*
        -------------------------------------------------------
        NORMALIZE RESPONSE
        -------------------------------------------------------
        */

        setApplications(
          Array.isArray(data)
            ? data
            : [],
        );


      } catch (error) {

        console.error(
          "FAILED TO LOAD APPLICATIONS:",
          error,
        );


        setError(
          error?.response?.data?.message ||
          "Unable to load your applications.",
        );


      } finally {

        /*
        -------------------------------------------------------
        REFRESH ANIMATION
        -------------------------------------------------------

        Keep the spinner visible long enough for the user
        to actually see that the dashboard refreshed.

        -------------------------------------------------------
        */

        if (isRefresh) {

          const elapsed =
            Date.now() - refreshStartedAt;

          const minimumRefreshTime = 650;

          const remainingTime =
            Math.max(
              0,
              minimumRefreshTime - elapsed,
            );


          setTimeout(() => {

            setRefreshing(false);

          }, remainingTime);

        } else {

          setLoading(false);

        }

      }

    },
    [refreshing],
  );


  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {

    loadApplications(false);

  }, [loadApplications]);


  /* =========================================================
     APPLICATION SUMMARY
  ========================================================= */

  const summary = useMemo(() => {

    const active =
      applications.filter(
        (application) =>
          ![
            "APPROVED",
            "REJECTED",
          ].includes(
            String(
              application?.status || "",
            ).toUpperCase(),
          ),
      );


    const completed =
      applications.filter(
        (application) =>
          String(
            application?.status || "",
          ).toUpperCase() === "APPROVED",
      );


    let documentsUploaded = 0;

    let documentsRequired = 0;


    applications.forEach(
      (application) => {

        const progress =
          getDocumentProgress(
            application,
          );


        documentsUploaded +=
          Number(
            progress?.uploaded || 0,
          );


        documentsRequired +=
          Number(
            progress?.required || 0,
          );

      },
    );


    return {

      total:
        applications.length,

      active:
        active.length,

      completed:
        completed.length,

      documentsUploaded,

      documentsRequired,

    };

  }, [applications]);


  /* =========================================================
     FEATURED APPLICATION
  ========================================================= */

  const activeApplication =
    useMemo(() => {

      if (!applications.length) {
        return null;
      }


      return (
        applications.find(
          (application) =>
            ![
              "APPROVED",
              "REJECTED",
            ].includes(
              String(
                application?.status || "",
              ).toUpperCase(),
            ),
        ) ||
        applications[0]
      );

    }, [applications]);


  /* =========================================================
     FEATURED APPLICATION DATA
  ========================================================= */

  const activeStatus =
    getStatusConfig(
      activeApplication?.status,
    );


  const activeProgress =
    calculateProgress(
      activeApplication,
    );


  const documentProgress =
    getDocumentProgress(
      activeApplication,
    );


  const destinationCountry =
    activeApplication?.destinationCountry ||
    activeApplication?.opportunity?.countryName ||
    "Unknown";


  const countryFlag =
    getCountryFlag(
      destinationCountry,
    );


  /* =========================================================
     USER NAME
  ========================================================= */

  const firstName =
    user?.name
      ?.trim()
      ?.split(/\s+/)[0] ||
    "there";


  /* =========================================================
     RENDER
  ========================================================= */

  return (

    <main className="client-dashboard">


      {/* =====================================================
          TOP HEADER
      ===================================================== */}

      <header className="dashboard-header">


        <div className="dashboard-header-copy">

          <span className="dashboard-eyebrow">
            CLIENT PORTAL
          </span>


          <h1>
            Good morning, {firstName}
          </h1>


          <p>
            Here's an overview of your migration
            applications and what needs your attention.
          </p>

        </div>


        {/* ===================================================
            HEADER ACTIONS
        =================================================== */}

        <div className="dashboard-header-actions">


          {/* =================================================
              REFRESH
          ================================================= */}

          <button
            type="button"
            className={`dashboard-icon-button ${refreshing
              ? "is-refreshing"
              : ""
              }`}
            onClick={() =>
              loadApplications(true)
            }
            disabled={refreshing}
            aria-label="Refresh dashboard"
            title={
              refreshing
                ? "Refreshing dashboard..."
                : "Refresh dashboard"
            }
          >

            <HiOutlineRefresh
              className={
                refreshing
                  ? "dashboard-refresh-icon is-spinning"
                  : "dashboard-refresh-icon"
              }
            />

          </button>


          {/* =================================================
              START APPLICATION
          ================================================= */}

          <Link
            to="/portal/applications/new"
            className="dashboard-start-button"
          >

            <HiOutlinePlus />

            <span>
              Start Application
            </span>

          </Link>


        </div>

      </header>


      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <DashboardAlert
          message={error}
        />
      )}


      {/* =====================================================
          LOADING
      ===================================================== */}

      {loading ? (

        <DashboardLoading />

      ) : !applications.length ? (

        <DashboardEmpty />

      ) : (

        <>


          {/* =================================================
              SUMMARY
          ================================================= */}

          <section className="dashboard-summary">


            <div className="summary-card">

              <span>
                APPLICATIONS
              </span>

              <strong>
                {summary.total}
              </strong>

              <small>
                Applications on file
              </small>

            </div>


            <div className="summary-card">

              <span>
                ACTIVE
              </span>

              <strong>
                {summary.active}
              </strong>

              <small>
                Journeys in progress
              </small>

            </div>


            <div className="summary-card">

              <span>
                DOCUMENTS
              </span>

              <strong>

                {summary.documentsRequired
                  ? `${summary.documentsUploaded}/${summary.documentsRequired}`
                  : summary.documentsUploaded}

              </strong>

              <small>
                Documents submitted
              </small>

            </div>


            <div className="summary-card">

              <span>
                COMPLETED
              </span>

              <strong>
                {summary.completed}
              </strong>

              <small>
                Successful applications
              </small>

            </div>


          </section>


          {/* =================================================
              MAIN DASHBOARD GRID
          ================================================= */}

          {activeApplication && (

            <section className="dashboard-main-grid">


              {/* =============================================
                  FEATURED APPLICATION
              ============================================= */}

              <article className="featured-application">


                <div className="featured-top">

                  <div>

                    <span className="section-eyebrow">
                      ACTIVE APPLICATION
                    </span>


                    <h2>
                      {destinationCountry}
                    </h2>


                    <p>

                      {activeApplication.type
                        ?.replace(
                          /_/g,
                          " ",
                        )
                        ?.replace(
                          /\b\w/g,
                          (char) =>
                            char.toUpperCase(),
                        ) ||
                        "Migration Application"}

                    </p>

                  </div>


                  <span
                    className={`featured-status ${activeStatus?.className || ""
                      }`}
                  >

                    <i />

                    {activeStatus?.label ||
                      "Pending"}

                  </span>

                </div>


                {/* META */}

                <div className="featured-meta">

                  <span>

                    {countryFlag && (

                      <img
                        src={countryFlag}
                        alt=""
                      />

                    )}

                    {destinationCountry}

                  </span>


                  <span>

                    Started{" "}

                    {new Date(
                      activeApplication.createdAt,
                    ).toLocaleDateString(
                      "en-GB",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      },
                    )}

                  </span>

                </div>


                {/* PROGRESS */}

                <div className="featured-progress">

                  <div className="featured-progress-heading">

                    <div>

                      <span>
                        Journey progress
                      </span>

                      <small>
                        {activeStatus?.description}
                      </small>

                    </div>


                    <strong>
                      {activeProgress}%
                    </strong>

                  </div>


                  <div className="featured-progress-track">

                    <span
                      style={{
                        width:
                          `${activeProgress}%`,
                      }}
                    />

                  </div>

                </div>


                {/* DOCUMENT STATUS */}

                <div className="featured-document-row">


                  <div>

                    <span>
                      Documents
                    </span>

                    <strong>

                      {documentProgress.required
                        ? `${documentProgress.uploaded} of ${documentProgress.required}`
                        : documentProgress.uploaded}

                    </strong>

                  </div>


                  <div>

                    <span>
                      Current stage
                    </span>

                    <strong>
                      {activeStatus?.label ||
                        "Pending"}
                    </strong>

                  </div>


                </div>


                {/* FOOTER */}

                <div className="featured-footer">


                  <Link
                    to={`/portal/applications/${activeApplication._id}`}
                    className="featured-primary-button"
                  >

                    Continue application

                    <HiOutlineArrowRight />

                  </Link>


                  <Link
                    to="/portal/applications"
                    className="featured-secondary-button"
                  >

                    View all applications

                  </Link>


                </div>


              </article>


              {/* =============================================
                  NEXT ACTION
              ============================================= */}

              <aside className="dashboard-action-card">


                <span className="section-eyebrow">
                  NEXT ACTION
                </span>


                <h3>

                  {documentProgress.complete
                    ? "Your documents are complete"
                    : "Complete your documents"}

                </h3>


                <p>

                  {documentProgress.complete
                    ? "Your submitted documents are currently being processed."
                    : "Upload the remaining required documents to keep your application moving."}

                </p>


                <div className="action-progress">


                  <div>

                    <span>
                      Document progress
                    </span>


                    <strong>

                      {documentProgress.required
                        ? `${documentProgress.uploaded}/${documentProgress.required}`
                        : documentProgress.uploaded}

                    </strong>

                  </div>


                  <div className="action-progress-track">

                    <span
                      style={{
                        width:
                          `${documentProgress.required
                            ? Math.min(
                              100,
                              Math.round(
                                (
                                  documentProgress.uploaded /
                                  documentProgress.required
                                ) *
                                100,
                              ),
                            )
                            : 0
                          }%`,
                      }}
                    />

                  </div>


                </div>


                <Link
                  to={`/portal/applications/${activeApplication._id}`}
                  className="action-link"
                >

                  Open application

                  <HiOutlineArrowRight />

                </Link>


              </aside>


            </section>

          )}


          {/* =================================================
              APPLICATION HISTORY
          ================================================= */}

          <ApplicationHistory
            applications={applications}
          />


          {/* =================================================
              SECURITY
          ================================================= */}

          <section className="dashboard-security">

            <div>

              <strong>
                Your information is protected
              </strong>

              <span>
                Colusus keeps your application data
                secure and accessible only to you and
                your authorised team.
              </span>

            </div>


            <span>
              Secure client portal
            </span>

          </section>


        </>

      )}

    </main>
  );
};


export default ClientDashboard;