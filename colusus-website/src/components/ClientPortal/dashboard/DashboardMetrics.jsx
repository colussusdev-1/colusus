import { Link } from "react-router-dom";

import {
  HiOutlineCheckCircle,
  HiOutlineChevronRight,
  HiOutlineClock,
  HiOutlineDocumentText,
  HiOutlineFolder,
} from "react-icons/hi";

import {
  getDocumentProgress,
  getApplicationCounts,
} from "./dashboard.utils";

import "./DashboardMetrics.css";


const DashboardMetrics = ({
  applicationsCount = 0,
  activeApplicationsCount = 0,
  completedApplicationsCount = 0,
  application,
  documentSummary,
}) => {

  /* =========================================================
     APPLICATION COUNTS
  ========================================================= */

  const counts =
    getApplicationCounts(
      application?.applications ||
      [],
    );


  const totalApplications =
    Number.isFinite(
      Number(applicationsCount),
    )
      ? Number(applicationsCount)
      : counts.total;


  const activeApplications =
    Number.isFinite(
      Number(activeApplicationsCount),
    )
      ? Number(activeApplicationsCount)
      : counts.active;


  const completedApplications =
    Number.isFinite(
      Number(completedApplicationsCount),
    )
      ? Number(completedApplicationsCount)
      : counts.completed;


  /* =========================================================
     DOCUMENTS
  ========================================================= */

  const documents =
    documentSummary ||
    getDocumentProgress(
      application,
    );


  const documentValue =
    documents.required > 0
      ? `${documents.uploaded}/${documents.required}`
      : `${documents.uploaded}`;


  const documentDescription =
    documents.required > 0
      ? documents.complete
        ? "Required documents complete"
        : `${documents.required - documents.uploaded} remaining`
      : "Documents uploaded";


  /* =========================================================
     RENDER
  ========================================================= */

  return (

    <section className="dashboard-metrics">


      {/* =====================================================
          TOTAL APPLICATIONS
      ===================================================== */}

      <Link
        to="/portal/applications"
        className="dark-metric-card"
      >

        <div className="metric-symbol blue">
          <HiOutlineDocumentText />
        </div>


        <div className="metric-information">

          <span>
            Applications
          </span>

          <strong>
            {totalApplications}
          </strong>

          <small>
            Total applications
          </small>

        </div>


        <HiOutlineChevronRight
          className="metric-arrow"
        />

      </Link>


      {/* =====================================================
          ACTIVE APPLICATIONS
      ===================================================== */}

      <Link
        to="/portal/applications"
        className="dark-metric-card"
      >

        <div className="metric-symbol orange">
          <HiOutlineClock />
        </div>


        <div className="metric-information">

          <span>
            Active
          </span>

          <strong>
            {activeApplications}
          </strong>

          <small>
            Active journeys
          </small>

        </div>


        <HiOutlineChevronRight
          className="metric-arrow"
        />

      </Link>


      {/* =====================================================
          DOCUMENTS
      ===================================================== */}

      <Link
        to={
          application?._id
            ? `/portal/applications/${application._id}`
            : "/portal/applications"
        }
        className="dark-metric-card"
      >

        <div className="metric-symbol green">
          <HiOutlineFolder />
        </div>


        <div className="metric-information">

          <span>
            Documents
          </span>

          <strong>
            {documentValue}
          </strong>

          <small>
            {documentDescription}
          </small>

        </div>


        <HiOutlineChevronRight
          className="metric-arrow"
        />

      </Link>


      {/* =====================================================
          COMPLETED
      ===================================================== */}

      <Link
        to="/portal/applications"
        className="dark-metric-card"
      >

        <div className="metric-symbol purple">
          <HiOutlineCheckCircle />
        </div>


        <div className="metric-information">

          <span>
            Completed
          </span>

          <strong>
            {completedApplications}
          </strong>

          <small>
            Completed journeys
          </small>

        </div>


        <HiOutlineChevronRight
          className="metric-arrow"
        />

      </Link>


    </section>
  );
};


export default DashboardMetrics;