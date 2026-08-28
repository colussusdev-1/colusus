import React from "react";

import {
  HiOutlineDocumentText,
} from "react-icons/hi";

import "./ApplicationsHeader.css";


const ApplicationsHeader = ({
  total = 0,
}) => {

  return (

    <header className="applicationsHeader">

      <div className="applicationsHeader__copy">

        <span className="applicationsHeader__eyebrow">
          MIGRATION OPERATIONS
        </span>

        <h1>
          Applications
        </h1>

        <p>
          Manage and review migration applications.
        </p>

      </div>


      <div className="applicationsHeader__count">

        <div className="applicationsHeader__countIcon">

          <HiOutlineDocumentText />

        </div>


        <div>

          <strong>
            {total}
          </strong>

          <span>
            Total applications
          </span>

        </div>

      </div>

    </header>

  );

};


export default ApplicationsHeader;