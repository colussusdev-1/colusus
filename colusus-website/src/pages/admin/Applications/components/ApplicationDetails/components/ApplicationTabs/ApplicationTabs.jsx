import React from "react";

import "./ApplicationTabs.css";


/*
|--------------------------------------------------------------------------
| APPLICATION TABS
|--------------------------------------------------------------------------
|
| Timeline is the application's chronological activity history.
|
| We do not need a separate "Activity" tab because the backend activity
| records are displayed inside the Timeline.
|
|--------------------------------------------------------------------------
*/

const tabs = [
  {
    id: "overview",
    label: "Overview",
  },

  {
    id: "documents",
    label: "Documents",
  },

  {
    id: "timeline",
    label: "Timeline",
  },

  {
    id: "notes",
    label: "Notes",
  },
];


/*
|--------------------------------------------------------------------------
| COMPONENT
|--------------------------------------------------------------------------
*/

const ApplicationTabs = ({
  activeTab,
  onChange,
}) => {

  return (
    <nav className="applicationTabs">

      {tabs.map((tab) => (

        <button
          key={tab.id}
          type="button"
          className={
            `applicationTabs__item ${activeTab === tab.id
              ? "is-active"
              : ""
            }`
          }
          onClick={() =>
            onChange(tab.id)
          }
        >

          {tab.label}

        </button>

      ))}

    </nav>
  );
};


export default ApplicationTabs;