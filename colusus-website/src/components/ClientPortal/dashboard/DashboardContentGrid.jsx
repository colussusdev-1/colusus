import JourneyPanel from "./JourneyPanel";
import NextStepPanel from "./NextStepPanel";
import InformationPanel from "./InformationPanel";

const DashboardContentGrid = ({
  application,
  journeyStages,
  status,
}) => (
  <section className="dashboard-content-grid">
    <JourneyPanel
      application={application}
      journeyStages={journeyStages}
      status={status}
    />

    <NextStepPanel
      application={application}
      status={status}
    />

    <InformationPanel
      application={application}
    />
  </section>
);

export default DashboardContentGrid;
