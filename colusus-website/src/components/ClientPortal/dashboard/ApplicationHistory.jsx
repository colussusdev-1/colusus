import { Link } from "react-router-dom";

import {
  HiOutlineArrowRight,
  HiOutlineChevronRight,
} from "react-icons/hi";

import {
  formatApplicationType,
  formatDate,
} from "./dashboard.utils";

import { STATUS_CONFIG } from "./dashboard.constants";


const ApplicationHistory = ({
  applications = [],
}) => {

  if (applications.length <= 1) {
    return null;
  }


  return (
    <section className="colusus-panel applications-panel">

      {/* PANEL HEADER */}
      <div className="panel-heading">

        <div>

          <span>
            YOUR APPLICATIONS
          </span>

          <h3>
            Application Overview
          </h3>

        </div>


        <Link to="/portal/applications">

          View All

          <HiOutlineArrowRight />

        </Link>

      </div>


      {/* APPLICATION HISTORY */}
      <div className="application-history">

        {applications.map((application) => {

          const config =
            STATUS_CONFIG[
            application.status
            ] ||
            STATUS_CONFIG.SUBMITTED;


          const country =
            application.destinationCountry ||
            "Unknown";


          const countryCode =
            country
              .slice(0, 2)
              .toUpperCase();


          return (
            <Link
              key={application._id}
              to={`/portal/applications/${application._id}`}
              className="history-row"
            >

              {/* COUNTRY */}
              <div className="history-country">

                <div>
                  {countryCode}
                </div>


                <section>

                  <strong>
                    {country}
                  </strong>

                  <span>
                    {formatApplicationType(
                      application.type
                    )}
                  </span>

                </section>

              </div>


              {/* START DATE */}
              <div className="history-date">

                <small>
                  Started
                </small>

                <strong>
                  {formatDate(
                    application.createdAt
                  )}
                </strong>

              </div>


              {/* STATUS */}
              <span
                className={`history-status ${config.className || ""
                  }`}
              >

                <span />

                {config.label}

              </span>


              {/* ACTION */}
              <HiOutlineChevronRight />

            </Link>
          );

        })}

      </div>

    </section>
  );
};


export default ApplicationHistory;