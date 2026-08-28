import React from "react";

import {
  HiOutlineArrowRight,
  HiOutlineDocumentText,
} from "react-icons/hi";

import "./ApplicationPipeline.css";


const ApplicationPipeline = ({
  applications,
  onViewApplications,
}) => {

  const total =
    applications.total || 0;


  const statuses = [

    {
      label: "Submitted",
      value: applications.submitted || 0,
      tone: "submitted",
    },

    {
      label: "Under Review",
      value: applications.underReview || 0,
      tone: "review",
    },

    {
      label: "Approved",
      value: applications.approved || 0,
      tone: "approved",
    },

    {
      label: "Rejected",
      value: applications.rejected || 0,
      tone: "rejected",
    },

  ];


  return (

    <section className="adminOverviewPanel applicationPipeline">

      <div className="applicationPipeline__header">

        <div>

          <span className="applicationPipeline__label">
            APPLICATIONS
          </span>

          <h2>
            Application pipeline
          </h2>

          <p>
            Current status across migration applications.
          </p>

        </div>


        <div className="applicationPipeline__total">

          <HiOutlineDocumentText />

          <div>

            <strong>
              {total}
            </strong>

            <span>
              Total
            </span>

          </div>

        </div>

      </div>


      <div className="applicationPipeline__list">

        {statuses.map((status) => {

          const percentage =
            total > 0
              ? Math.round(
                (status.value / total) * 100
              )
              : 0;


          return (

            <div
              className="applicationPipeline__item"
              key={status.label}
            >

              <div className="applicationPipeline__row">

                <div className="applicationPipeline__name">

                  <span
                    className={`applicationPipeline__dot applicationPipeline__dot--${status.tone}`}
                  />

                  <span>
                    {status.label}
                  </span>

                </div>


                <div className="applicationPipeline__numbers">

                  <strong>
                    {status.value}
                  </strong>

                  <span>
                    {percentage}%
                  </span>

                </div>

              </div>


              <div className="applicationPipeline__track">

                <span
                  className={`applicationPipeline__bar applicationPipeline__bar--${status.tone}`}
                  style={{
                    width: `${percentage}%`,
                  }}
                />

              </div>

            </div>

          );

        })}

      </div>


      <button
        type="button"
        className="applicationPipeline__footer"
        onClick={() =>
          onViewApplications()
        }
      >

        <span>
          Review application pipeline
        </span>

        <HiOutlineArrowRight />

      </button>

    </section>

  );

};


export default ApplicationPipeline;