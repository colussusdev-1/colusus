import { Link } from "react-router-dom";

import {
  HiOutlineArrowRight,
  HiOutlinePlus,
} from "react-icons/hi";

import "./ApplicationsHeader.css";


const ApplicationsHeader = ({
  applicationsCount = 0,
}) => {

  return (

    <section className="applications-header">

      {/* =====================================================
          HEADER CONTENT
      ===================================================== */}

      <div className="applications-header-content">

        <div className="applications-header-eyebrow">

          <span className="applications-header-eyebrow-line" />

          <span>
            MIGRATION APPLICATIONS
          </span>

        </div>


        <h1 className="applications-header-title">
          Your Applications
        </h1>


        <p className="applications-header-description">
          Keep track of your migration journeys,
          application progress and next steps
          from one place.
        </p>

      </div>


      {/* =====================================================
          HEADER ACTIONS
      ===================================================== */}

      <div className="applications-header-actions">

        {/* APPLICATION COUNT */}

        <div className="applications-header-count">

          <strong>
            {applicationsCount}
          </strong>

          <span>
            {applicationsCount === 1
              ? "application"
              : "applications"}
          </span>

        </div>


        {/* START APPLICATION */}

        <Link
          to="/portal/applications/new"
          className="applications-header-button"
        >

          <span className="applications-header-button-icon">
            <HiOutlinePlus />
          </span>

          <span>
            Start Application
          </span>

          <HiOutlineArrowRight
            className="applications-header-button-arrow"
          />

        </Link>

      </div>

    </section>

  );

};


export default ApplicationsHeader;