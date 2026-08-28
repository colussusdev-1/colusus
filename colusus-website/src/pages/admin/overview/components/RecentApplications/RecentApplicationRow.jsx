import React from "react";

import {
  HiOutlineArrowRight,
} from "react-icons/hi";


const formatStatus = (status) => {

  if (!status) {
    return "Unknown";
  }

  return status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(
      /\b\w/g,
      (letter) => letter.toUpperCase()
    );

};


const getStatusClass = (status) => {

  switch (status) {

    case "APPROVED":
      return "approved";

    case "REJECTED":
      return "rejected";

    case "UNDER_REVIEW":
      return "review";

    case "SUBMITTED":
      return "submitted";

    case "DRAFT":
      return "draft";

    case "IN_PROGRESS":
      return "progress";

    default:
      return "default";

  }

};


const RecentApplicationRow = ({
  application,
  onClick,
}) => {

  const name =
    application?.user?.name ||
    "Unknown Client";

  const email =
    application?.user?.email ||
    "No email";

  const initial =
    name.charAt(0).toUpperCase();


  return (

    <button
      type="button"
      className="recentApplicationRow"
      onClick={onClick}
    >

      <div className="recentApplicationRow__client">

        <div className="recentApplicationRow__avatar">
          {initial}
        </div>


        <div className="recentApplicationRow__identity">

          <strong>
            {name}
          </strong>

          <span>
            {email}
          </span>

        </div>

      </div>


      <div className="recentApplicationRow__status">

        <span
          className={`recentApplicationRow__badge recentApplicationRow__badge--${getStatusClass(
            application?.status
          )}`}
        >
          {formatStatus(
            application?.status
          )}
        </span>

        <HiOutlineArrowRight />

      </div>

    </button>

  );

};


export default RecentApplicationRow;