import ApplicationCard from "../ApplicationCard/ApplicationCard";

import "./ApplicationsList.css";


const ApplicationsList = ({
  applications = [],
}) => {

  if (!applications.length) {
    return null;
  }


  return (
    <section className="applications-list">

      <div className="applications-list-heading">

        <div>
          <span className="applications-list-eyebrow">
            APPLICATIONS
          </span>

          <h2>
            Your migration journeys
          </h2>
        </div>


        <span className="applications-list-count">
          {applications.length}{" "}
          {applications.length === 1
            ? "application"
            : "applications"}
        </span>

      </div>


      <div className="applications-list-grid">

        {applications.map((application) => (
          <ApplicationCard
            key={application._id}
            application={application}
          />
        ))}

      </div>

    </section>
  );
};


export default ApplicationsList;