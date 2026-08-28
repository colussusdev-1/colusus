import React from "react";

import {
  HiOutlineCalendar,
  HiOutlineGlobeAlt,
  HiOutlineMail,
  HiOutlineUser,
} from "react-icons/hi";

import "./ApplicationOverview.css";


const formatLabel = (
  value
) => {

  if (!value) {
    return "—";
  }


  return value
    .toLowerCase()
    .replace(
      /_/g,
      " "
    )
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase()
    );

};


const formatDate = (
  value
) => {

  if (!value) {
    return "—";
  }


  const date =
    new Date(value);


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "—";
  }


  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  ).format(date);

};


const ApplicationOverview = ({
  application,
}) => {

  const client =
    application?.user;


  const items = [

    {
      label: "Client",

      value:
        client?.name ||
        "Unknown client",

      icon:
        HiOutlineUser,
    },

    {
      label: "Email",

      value:
        client?.email ||
        "—",

      icon:
        HiOutlineMail,
    },

    {
      label: "Application Type",

      value:
        formatLabel(
          application?.type
        ),

      icon:
        HiOutlineGlobeAlt,
    },

    {
      label: "Destination",

      value:
        application
          ?.destinationCountry ||
        "—",

      icon:
        HiOutlineGlobeAlt,
    },

    {
      label: "Started",

      value:
        formatDate(
          application?.createdAt
        ),

      icon:
        HiOutlineCalendar,
    },

    {
      label: "Last Updated",

      value:
        formatDate(
          application?.updatedAt
        ),

      icon:
        HiOutlineCalendar,
    },

  ];


  return (

    <section className="applicationOverview">

      <div className="applicationOverview__header">

        <div>

          <span>
            APPLICATION
          </span>

          <h2>
            Overview
          </h2>

        </div>

      </div>


      <div className="applicationOverview__grid">

        {items.map(
          ({
            label,
            value,
            icon: Icon,
          }) => (

            <div
              className="applicationOverview__item"
              key={label}
            >

              <div className="applicationOverview__icon">

                <Icon />

              </div>


              <div className="applicationOverview__value">

                <span>
                  {label}
                </span>

                <strong>
                  {value}
                </strong>

              </div>

            </div>

          )
        )}

      </div>

    </section>

  );

};


export default ApplicationOverview;