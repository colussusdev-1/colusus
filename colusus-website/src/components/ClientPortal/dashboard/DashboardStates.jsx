import { Link } from "react-router-dom";
import {
  HiOutlineArrowRight,
  HiOutlineClock,
  HiOutlineDocumentText,
} from "react-icons/hi";

export const DashboardAlert = ({ message }) => (
  <div className="dashboard-alert">
    <HiOutlineClock />
    <span>{message}</span>
  </div>
);

export const DashboardLoading = () => (
  <section className="dashboard-loading">
    <div className="dashboard-loader" />
    <p>Loading your migration journey...</p>
  </section>
);

export const DashboardEmpty = () => (
  <section className="dashboard-empty">
    <div className="empty-icon">
      <HiOutlineDocumentText />
    </div>

    <span>GET STARTED</span>

    <h2>Your migration journey starts here.</h2>

    <p>
      Once you start an application, your progress,
      documents and updates will appear here.
    </p>

    <Link
      to="/portal/applications"
      className="dashboard-primary-button"
    >
      Start an Application
      <HiOutlineArrowRight />
    </Link>
  </section>
);
