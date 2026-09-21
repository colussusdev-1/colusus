
import React from "react";

import {
  HiOutlineDocumentText,
  HiOutlineViewBoards,
  HiOutlineViewList,
} from "react-icons/hi";

import "./ApplicationsHeader.css";


const ApplicationsHeader = ({
  total = 0,
  view = "table",
  onViewChange,
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


      <div className="applicationsHeader__actions">

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


        <div
          className="applicationsHeader__viewToggle"
          role="group"
          aria-label="Application view"
        >

          <button
            type="button"
            className={
              view === "pipeline"
                ? "is-active"
                : ""
            }
            onClick={() =>
              onViewChange("pipeline")
            }
            aria-pressed={
              view === "pipeline"
            }
          >

            <HiOutlineViewBoards />

            <span>
              Pipeline
            </span>

          </button>


          <button
            type="button"
            className={
              view === "table"
                ? "is-active"
                : ""
            }
            onClick={() =>
              onViewChange("table")
            }
            aria-pressed={
              view === "table"
            }
          >

            <HiOutlineViewList />

            <span>
              Table
            </span>

          </button>

        </div>

      </div>

    </header>

  );

};


export default ApplicationsHeader;

