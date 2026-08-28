import React from "react";

import {
  HiOutlineFolderOpen,
  HiOutlineClock,
} from "react-icons/hi";

import AttentionItem from "./AttentionItem";

import "./NeedsAttention.css";


const NeedsAttention = ({
  applications,
  documents,
  onViewApplications,
  onViewDocuments,
}) => {

  const pendingDocuments =
    documents.pendingReview || 0;

  const underReviewApplications =
    applications.underReview || 0;


  return (

    <section className="adminOverviewPanel needsAttention">

      <div className="needsAttention__header">

        <div>

          <span className="needsAttention__label">
            ACTION REQUIRED
          </span>

          <h2>
            Needs attention
          </h2>

          <p>
            Operational items currently requiring review.
          </p>

        </div>

      </div>


      <div className="needsAttention__list">

        <AttentionItem
          icon={HiOutlineFolderOpen}
          tone="orange"
          title="Documents awaiting review"
          description={`${pendingDocuments} document${pendingDocuments === 1
              ? ""
              : "s"
            } need${pendingDocuments === 1
              ? "s"
              : ""
            } attention`}
          onClick={() =>
            onViewDocuments(
              "UNDER_REVIEW"
            )
          }
        />


        <AttentionItem
          icon={HiOutlineClock}
          tone="purple"
          title="Applications under review"
          description={`${underReviewApplications} application${underReviewApplications === 1
              ? ""
              : "s"
            } currently under review`}
          onClick={() =>
            onViewApplications(
              "UNDER_REVIEW"
            )
          }
        />

      </div>

    </section>

  );

};


export default NeedsAttention;