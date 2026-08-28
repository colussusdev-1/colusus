import React from "react";

import {
  HiOutlineCalendar,
  HiOutlineRefresh,
} from "react-icons/hi";

import "./OverviewHeader.css";


const OverviewHeader = ({
  onRefresh,
  refreshing = false,
}) => {

  const today = new Date();

  const formattedDate =
    today.toLocaleDateString(
      "en-US",
      {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }
    );


  return (

    <header className="overviewHeader">

      <div className="overviewHeader__copy">

        <span className="overviewHeader__eyebrow">
          Migration Operations
        </span>

        <h1>
          Good morning, Super Admin.
        </h1>

        <p>
          Here's what's happening across
          your migration operations today.
        </p>

      </div>


      <div className="overviewHeader__meta">

        <div className="overviewHeader__date">

          <HiOutlineCalendar />

          <span>
            {formattedDate}
          </span>

        </div>


        <button
          type="button"
          className={`overviewHeader__refresh ${refreshing
              ? "is-refreshing"
              : ""
            }`}
          onClick={onRefresh}
          disabled={refreshing}
        >

          <HiOutlineRefresh />

          <span>
            {refreshing
              ? "Refreshing..."
              : "Refresh"
            }
          </span>

        </button>

      </div>

    </header>

  );

};


export default OverviewHeader;