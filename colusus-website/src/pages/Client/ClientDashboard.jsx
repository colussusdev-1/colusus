import { useEffect, useMemo, useState } from "react";

import applicationService from "../../services/application.service";

import "./ClientDashboard.css";

import {
  calculateProgress,
  getJourneyStages,
  getStatusConfig,
  getUser,
} from "../../components/ClientPortal/dashboard/dashboard.utils";

import {
  DashboardBackground,
} from "../../components/ClientPortal/dashboard/dashboard.visuals";

import DashboardIntro from "../../components/ClientPortal/dashboard/DashboardIntro";
import ActiveApplicationHero from "../../components/ClientPortal/dashboard/ActiveApplicationHero";
import DashboardMetrics from "../../components/ClientPortal/dashboard/DashboardMetrics";
import DashboardContentGrid from "../../components/ClientPortal/dashboard/DashboardContentGrid";
import ApplicationHistory from "../../components/ClientPortal/dashboard/ApplicationHistory";
import SecurityStrip from "../../components/ClientPortal/dashboard/SecurityStrip";

import {
  DashboardAlert,
  DashboardLoading,
  DashboardEmpty,
} from "../../components/ClientPortal/dashboard/DashboardStates";

const ClientDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = getUser();

  useEffect(() => {
    const loadApplications = async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await applicationService.getApplications();

        setApplications(
          Array.isArray(data) ? data : []
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

    return (
      applications.find(
        (application) =>
          !["APPROVED", "REJECTED"].includes(
            application.status
          )
      ) || applications[0]
    );
  }, [applications]);

  const status = getStatusConfig(
    activeApplication?.status
  );

  const progress = calculateProgress(
    activeApplication?.status
  );

  const journeyStages = getJourneyStages(
    activeApplication
  );

  const firstName =
    user?.name?.split(" ")[0] || "there";

  return (
    <main className="client-dashboard">
      <DashboardBackground />

      <DashboardIntro firstName={firstName} />

      {error && <DashboardAlert message={error} />}

      {loading ? (
        <DashboardLoading />
      ) : !activeApplication ? (
        <DashboardEmpty />
      ) : (
        <>
          <ActiveApplicationHero
            application={activeApplication}
            status={status}
            progress={progress}
          />

          <DashboardMetrics
            applicationsCount={applications.length}
            status={status}
            progress={progress}
            startedAt={activeApplication.createdAt}
          />

          <DashboardContentGrid
            application={activeApplication}
            journeyStages={journeyStages}
            status={status}
          />

          <ApplicationHistory
            applications={applications}
          />

          <SecurityStrip />
        </>
      )}
    </main>
  );
};

export default ClientDashboard;
