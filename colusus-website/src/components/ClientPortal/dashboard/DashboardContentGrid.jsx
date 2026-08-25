import JourneyPanel from "./JourneyPanel";
import NextStepPanel from "./NextStepPanel";
import InformationPanel from "./InformationPanel";

import {
  getDocumentProgress,
  getApplicationActivity,
  getNextAction,
  getCurrentJourneyStage,
} from "./dashboard.utils";


const DashboardContentGrid = ({
  application,
  journeyStages = [],
  status,
  summary,
  applicationCounts,
}) => {

  /* =========================================================
     DOCUMENT PROGRESS
  ========================================================= */

  const documentProgress =
    summary?.documents ||
    getDocumentProgress(
      application,
    );


  /* =========================================================
     CURRENT STAGE
  ========================================================= */

  const currentStage =
    summary?.currentStage ||
    getCurrentJourneyStage(
      application,
    );


  /* =========================================================
     NEXT ACTION
  ========================================================= */

  const nextAction =
    summary?.nextAction ||
    getNextAction(
      application,
    );


  /* =========================================================
     RECENT ACTIVITY
  ========================================================= */

  const activity =
    getApplicationActivity(
      application,
      5,
    );


  /* =========================================================
     RENDER
  ========================================================= */

  return (

    <section className="dashboard-content-grid">


      {/* =====================================================
          APPLICATION JOURNEY
      ===================================================== */}

      <JourneyPanel

        application={
          application
        }

        journeyStages={
          journeyStages
        }

        status={
          status
        }

        currentStage={
          currentStage
        }

        progress={
          summary?.progress
        }

      />


      {/* =====================================================
          NEXT ACTION
      ===================================================== */}

      <NextStepPanel

        application={
          application
        }

        status={
          status
        }

        nextAction={
          nextAction
        }

        documentProgress={
          documentProgress
        }

      />


      {/* =====================================================
          APPLICATION INFORMATION
      ===================================================== */}

      <InformationPanel

        application={
          application
        }

        documentProgress={
          documentProgress
        }

        applicationCounts={
          applicationCounts
        }

        activity={
          activity
        }

      />


    </section>
  );
};


export default DashboardContentGrid;