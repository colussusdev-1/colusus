import React from "react";

import {
  HiOutlineDocumentText,
} from "react-icons/hi";

import ApplicationRow
  from "../ApplicationRow/ApplicationRow";

import "./ApplicationTable.css";


const ApplicationTable = ({
  applications,
  onApplicationClick,
}) => {

  if (!applications.length) {

    return (

      <div className="applicationTable__empty">

        <div className="applicationTable__emptyIcon">

          <HiOutlineDocumentText />

        </div>

        <h3>
          No applications found
        </h3>

        <p>
          Try adjusting your search or filters.
        </p>

      </div>

    );

  }


  return (

    <div className="applicationTable">

      <div className="applicationTable__scroll">

        <table>

          <thead>

            <tr>

              <th>
                Application
              </th>

              <th>
                Client
              </th>

              <th>
                Country
              </th>

              <th>
                Stage
              </th>

              <th>
                Progress
              </th>

              <th>
                Updated
              </th>

              <th>
                Assigned To
              </th>

              <th>
              </th>

            </tr>

          </thead>


          <tbody>

            {applications.map(
              (application) => (

                <ApplicationRow
                  key={
                    application._id
                  }
                  application={
                    application
                  }
                  onClick={() =>
                    onApplicationClick(
                      application._id
                    )
                  }
                />

              )
            )}

          </tbody>

        </table>

      </div>

    </div>

  );

};


export default ApplicationTable;