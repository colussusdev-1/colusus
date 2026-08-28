import React from "react";

import {
  HiOutlineSearch,
  HiOutlineX,
} from "react-icons/hi";

import "./ApplicationFilters.css";


const formatLabel = (value) => {

  if (!value || value === "ALL") {
    return "All";
  }


  return value
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase()
    );

};


const ApplicationFilters = ({
  search,
  onSearchChange,

  stage,
  stages,
  onStageChange,

  status,
  onStatusChange,

  onClear,

  hasActiveFilters,
}) => {

  const statuses = [

    "DRAFT",

    "IN_PROGRESS",

    "SUBMITTED",

    "UNDER_REVIEW",

    "DOCUMENT_REQUEST",

    "PROCESSING",

    "APPROVED",

    "REJECTED",

  ];


  return (

    <div className="applicationFilters">

      <div className="applicationFilters__search">

        <HiOutlineSearch />

        <input
          type="text"
          value={search}
          onChange={(event) =>
            onSearchChange(
              event.target.value
            )
          }
          placeholder="Search applications..."
          aria-label="Search applications"
        />

      </div>


      <select
        className="applicationFilters__select"
        value={stage}
        onChange={(event) =>
          onStageChange(
            event.target.value
          )
        }
        aria-label="Filter by stage"
      >

        <option value="ALL">
          All Stages
        </option>

        {stages.map(
          (item) => (

            <option
              value={item}
              key={item}
            >
              {formatLabel(item)}
            </option>

          )
        )}

      </select>


      <select
        className="applicationFilters__select"
        value={status}
        onChange={(event) =>
          onStatusChange(
            event.target.value
          )
        }
        aria-label="Filter by status"
      >

        <option value="ALL">
          All Status
        </option>

        {statuses.map(
          (item) => (

            <option
              value={item}
              key={item}
            >
              {formatLabel(item)}
            </option>

          )
        )}

      </select>


      {hasActiveFilters && (

        <button
          type="button"
          className="applicationFilters__clear"
          onClick={onClear}
        >

          <HiOutlineX />

          Clear

        </button>

      )}

    </div>

  );

};


export default ApplicationFilters;