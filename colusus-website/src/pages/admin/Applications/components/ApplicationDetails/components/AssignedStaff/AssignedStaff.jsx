import React from "react";

import {
  HiOutlineUserGroup,
  HiOutlineUser,
} from "react-icons/hi";

import "./AssignedStaff.css";


const AssignedStaff = ({
  application,
}) => {

  const staff =
    application?.assignedTo ||
    null;


  const hasStaff =
    Boolean(staff);


  const staffName =
    staff?.name ||
    "Unassigned";


  const staffEmail =
    staff?.email ||
    "";


  const initials =
    hasStaff
      ? staffName
        .split(" ")
        .map(
          (part) =>
            part.charAt(0)
        )
        .join("")
        .slice(0, 2)
        .toUpperCase()
      : null;


  return (

    <section className="assignedStaff">

      <div className="assignedStaff__header">

        <span>
          ASSIGNED STAFF
        </span>

        <h2>
          Assigned Staff
        </h2>

      </div>


      <div className="assignedStaff__person">

        <div
          className={
            `assignedStaff__avatar ${!hasStaff
              ? "is-empty"
              : ""
            }`
          }
        >

          {hasStaff
            ? initials
            : <HiOutlineUserGroup />}

        </div>


        <div className="assignedStaff__identity">

          <strong>
            {staffName}
          </strong>


          <span>

            {hasStaff
              ? staffEmail
              : "No staff assigned"}

          </span>

        </div>


        {hasStaff && (

          <button
            type="button"
            className="assignedStaff__change"
          >
            Change
          </button>

        )}

      </div>

    </section>

  );

};


export default AssignedStaff;