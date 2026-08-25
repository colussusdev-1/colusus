import { useEffect, useMemo, useState } from "react";

import applicationService from "../../services/application.service";

import "./ClientDashboard.css";

import {
  getActiveApplication,
  getApplicationCounts,
  getApplicationSummary,
  getUser,
} from "../../components/client/dashboard/dashboard.utils";

import {
  DashboardBackground,
} from "../../components/client/dashboard/dashboard.visuals";

import DashboardIntro from "../../components/client/dashboard/DashboardIntro";

import ActiveApplicationHero from "../../components/client/dashboard/ActiveApplicationHero";

import DashboardMetrics from "../../components/client/dashboard/DashboardMetrics";

import DashboardContentGrid from "../../components/client/dashboard/DashboardContentGrid";

import ApplicationHistory from "../../components/client/dashboard/ApplicationHistory";

import SecurityStrip from "../../components/client/dashboard/SecurityStrip";

import {
  DashboardAlert,
  DashboardLoading,
  DashboardEmpty,
} from "../../components/client/dashboard/DashboardStates";


const ClientDashboard = () => {

  /* =========================================================
     STATE
  ========================================================= */

  const [applications, setApplications] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  /* =========================================================
     USER
  ========================================================= */

  const user = getUser();


  /* =========================================================
     LOAD APPLICATIONS
  ========================================================= */

  useEffect(() => {

    let mounted = true;


    const loadApplications = async () => {

      try {

        setLoading(true);

        setError("");


        const data =
          await applicationService.getApplications();


        if (!mounted) {
          return;
        }


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


        if (!mounted) {
          return;
        }


        setError(
          error.response?.data?.message ||
          "Unable to load your applications.",
        );

      } finally {

        if (mounted) {
          setLoading(false);
        }

      }

    };


    loadApplications();


    return () => {
      mounted = false;
    };

  }, []);


  /* =========================================================
     APPLICATION COUNTS
  =========================================================
  
  Used by the overview dashboard.

  This gives us:

  - total
  - active
  - draft
  - in progress
  - submitted
  - under review
  - processing
  - completed
  - approved
  - rejected

  ========================================================= */

  const applicationCounts = useMemo(
    () =>
      getApplicationCounts(
        applications,
      ),
    [applications],
  );


  /* =========================================================
     ACTIVE APPLICATION
  =========================================================
  
  IMPORTANT:

  The dashboard should NOT simply use the first application.

  getActiveApplication() determines which application deserves
  attention based on its current state.

  ========================================================= */

  const activeApplication = useMemo(
    () =>
      getActiveApplication(
        applications,
      ),
    [applications],
  );


  /* =========================================================
     ACTIVE APPLICATION SUMMARY
  =========================================================
  
  This centralizes:

  - status
  - progress
  - documents
  - next action
  - current stage
  - journey stages

  ========================================================= */

  const activeSummary = useMemo(
    () =>
      getApplicationSummary(
        activeApplication,
      ),
    [activeApplication],
  );


  /* =========================================================
     DASHBOARD VALUES
  ========================================================= */

  const status =
    activeSummary.statusConfig;


  const progress =
    activeSummary.progress;


  const journeyStages =
    activeSummary.journeyStages;


  /* =========================================================
     FIRST NAME
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
          BACKGROUND
      ===================================================== */}

      <DashboardBackground />


      {/* =====================================================
          INTRO
      ===================================================== */}

      <DashboardIntro
        firstName={firstName}
      />


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

        /* ===================================================
           NO APPLICATIONS
        =================================================== */

        <DashboardEmpty />

      ) : (

        /* ===================================================
           DASHBOARD
        =================================================== */

        <>


          {/* =================================================
              ACTIVE APPLICATION
          ================================================= */}

          {activeApplication && (

            <ActiveApplicationHero
              application={
                activeApplication
              }

              status={
                status
              }

              progress={
                progress
              }

              summary={
                activeSummary
              }

              applicationCounts={
                applicationCounts
              }
            />

          )}


          {/* =================================================
              DASHBOARD METRICS
          ================================================= */}

          <DashboardMetrics

            applicationsCount={
              applicationCounts.total
            }

            activeApplicationsCount={
              applicationCounts.active
            }

            completedApplicationsCount={
              applicationCounts.completed
            }

            documentSummary={
              activeSummary.documents
            }

            application={
              activeApplication
            }

            status={
              status
            }

            progress={
              progress
            }

            startedAt={
              activeApplication?.createdAt
            }

          />


          {/* =================================================
              DASHBOARD CONTENT
          ================================================= */}

          {activeApplication && (

            <DashboardContentGrid

              application={
                activeApplication
              }

              journeyStages={
                journeyStages
              }

              status={
                status
              }

              summary={
                activeSummary
              }

              applicationCounts={
                applicationCounts
              }

            />

          )}


          {/* =================================================
              APPLICATION HISTORY
          ================================================= */}

          <ApplicationHistory

            applications={
              applications
            }

          />


          {/* =================================================
              SECURITY
          ================================================= */}

          <SecurityStrip />


        </>

      )}

    </main>
  );
};


export default ClientDashboard;