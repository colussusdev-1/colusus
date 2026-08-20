import { Link } from "react-router-dom";
import { HiOutlineArrowRight } from "react-icons/hi";

const DashboardIntro = ({ firstName }) => (
  <section className="dashboard-intro">
    <div className="dashboard-intro-copy">
      <span className="dashboard-eyebrow">
        CLIENT PORTAL
      </span>

      <h1>
        Welcome back,
        <span> {firstName}.</span>
      </h1>

      <p>
        Here's what's happening with your migration journey.
      </p>
    </div>

    <Link
      to="/portal/applications"
      className="dashboard-primary-button"
    >
      <span>View Applications</span>
      <HiOutlineArrowRight />
    </Link>
  </section>
);

export default DashboardIntro;
