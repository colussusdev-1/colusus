import React from "react";

import {
  HiOutlineFolderOpen,
} from "react-icons/hi";

import "./DocumentSummary.css";


const DocumentSummary = ({
  documents,
  onViewDocuments,
}) => {

  const items = [

    {
      label: "Total",
      value: documents.total || 0,
      tone: "total",
      status: "",
    },

    {
      label: "Pending",
      value: documents.pendingReview || 0,
      tone: "pending",
      status: "UNDER_REVIEW",
    },

    {
      label: "Approved",
      value: documents.approved || 0,
      tone: "approved",
      status: "APPROVED",
    },

    {
      label: "Rejected",
      value: documents.rejected || 0,
      tone: "rejected",
      status: "REJECTED",
    },

  ];


  return (

    <section className="adminOverviewPanel documentSummary">

      <div className="documentSummary__header">

        <div className="documentSummary__title">

          <div className="documentSummary__icon">
            <HiOutlineFolderOpen />
          </div>

          <div>

            <span>
              DOCUMENTS
            </span>

            <h2>
              Document summary
            </h2>

          </div>

        </div>

      </div>


      <div className="documentSummary__grid">

        {items.map((item) => (

          <button
            type="button"
            className="documentSummary__item"
            key={item.label}
            onClick={() =>
              onViewDocuments(
                item.status
              )
            }
          >

            <span>
              {item.label}
            </span>

            <strong
              className={`documentSummary__value documentSummary__value--${item.tone}`}
            >
              {item.value.toLocaleString()}
            </strong>

          </button>

        ))}

      </div>

    </section>

  );

};


export default DocumentSummary;