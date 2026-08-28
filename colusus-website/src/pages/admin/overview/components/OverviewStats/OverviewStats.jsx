import React from "react";

import {
  HiOutlineUsers,
  HiOutlineDocumentText,
  HiOutlineClock,
  HiOutlineFolderOpen,
} from "react-icons/hi";

import OverviewStatCard from "./OverviewStatCard";

import "./OverviewStats.css";


const OverviewStats = ({
  clients,
  applications,
  documents,
}) => {

  const stats = [

    {
      label: "Total Clients",
      value: clients.total || 0,
      meta: `+${clients.newThisMonth || 0} this month`,
      metaType: "positive",
      icon: HiOutlineUsers,
      tone: "blue",
    },

    {
      label: "Total Applications",
      value: applications.total || 0,
      meta: "Migration applications",
      icon: HiOutlineDocumentText,
      tone: "purple",
    },

    {
      label: "Under Review",
      value: applications.underReview || 0,
      meta: "Requires attention",
      metaType: "warning",
      icon: HiOutlineClock,
      tone: "orange",
    },

    {
      label: "Documents Pending",
      value: documents.pendingReview || 0,
      meta: "Awaiting review",
      metaType: "warning",
      icon: HiOutlineFolderOpen,
      tone: "green",
    },

  ];


  return (

    <div className="overviewStats">

      {stats.map((stat) => (

        <OverviewStatCard
          key={stat.label}
          {...stat}
        />

      ))}

    </div>

  );

};


export default OverviewStats;