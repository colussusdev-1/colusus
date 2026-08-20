import { Link } from "react-router-dom";
import {
  HiOutlineCalendar,
  HiOutlineCheckCircle,
  HiOutlineChevronRight,
  HiOutlineClock,
  HiOutlineDocumentText,
} from "react-icons/hi";

import { formatDate } from "./dashboard.utils";

const DashboardMetrics = ({
  applicationsCount,
  status,
  progress,
  startedAt,
}) => (
  <section className="dashboard-metrics">
    <Link
      to="/portal/applications"
      className="dark-metric-card"
    >
      <div className="metric-symbol blue">
        <HiOutlineDocumentText />
      </div>

      <div className="metric-information">
        <span>Applications</span>
        <strong>{applicationsCount}</strong>
        <small>Applications on file</small>
      </div>

      <HiOutlineChevronRight className="metric-arrow" />
    </Link>

    <div className="dark-metric-card">
      <div className="metric-symbol orange">
        <HiOutlineClock />
      </div>

      <div className="metric-information">
        <span>Current Stage</span>
        <strong>{status.label}</strong>
        <small>Your application status</small>
      </div>
    </div>

    <div className="dark-metric-card">
      <div className="metric-symbol green">
        <HiOutlineCheckCircle />
      </div>

      <div className="metric-information">
        <span>Progress</span>
        <strong>{progress}%</strong>
        <small>Journey completion</small>
      </div>
    </div>

    <div className="dark-metric-card">
      <div className="metric-symbol purple">
        <HiOutlineCalendar />
      </div>

      <div className="metric-information">
        <span>Started</span>
        <strong>{formatDate(startedAt)}</strong>
        <small>Application date</small>
      </div>
    </div>
  </section>
);

export default DashboardMetrics;
