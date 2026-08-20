import {
  HiOutlineBriefcase,
  HiOutlineCalendar,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineGlobeAlt,
  HiOutlineLocationMarker,
  HiOutlineTrendingUp,
} from "react-icons/hi";

import "./OpportunityOverview.css";


/* =========================================================
   HELPERS
========================================================= */

const hasValue = (value) => {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return false;
  }

  if (
    Array.isArray(value) &&
    value.length === 0
  ) {
    return false;
  }

  return true;
};


const formatValue = (value) => {
  if (Array.isArray(value)) {
    return value.join(", ");
  }

  return String(value);
};


/* =========================================================
   COMPONENT
========================================================= */

const OpportunityOverview = ({
  application,
}) => {

  const opportunity =
    application?.opportunity;


  /*
   * The application may exist without a
   * populated opportunity.
   */

  if (!opportunity) {
    return (
      <section className="opportunity-overview">

        <div className="opportunity-overview-header">

          <div>
            <span>
              OPPORTUNITY
            </span>

            <h2>
              Opportunity details
            </h2>
          </div>

        </div>


        <div className="opportunity-overview-empty">

          <HiOutlineGlobeAlt />

          <div>

            <strong>
              Opportunity information unavailable
            </strong>

            <p>
              The opportunity connected to this
              application could not be loaded.
            </p>

          </div>

        </div>

      </section>
    );
  }


  const countryName =
    opportunity.countryName ||
    application.destinationCountry;


  const title =
    opportunity.title ||
    opportunity.name ||
    `${countryName || "Migration"} Opportunity`;


  const description =
    opportunity.description;


  /*
   * Only render metadata that the specific
   * opportunity actually provides.
   */

  const metadata = [
    {
      key: "country",
      label: "Country",
      value: countryName,
      icon: HiOutlineGlobeAlt,
    },

    {
      key: "location",
      label: "Location",
      value: opportunity.location,
      icon: HiOutlineLocationMarker,
    },

    {
      key: "type",
      label: "Type",
      value: opportunity.type,
      icon: HiOutlineBriefcase,
    },

    {
      key: "duration",
      label: "Duration",
      value: opportunity.duration,
      icon: HiOutlineCalendar,
    },

    {
      key: "processing",
      label: "Processing Time",
      value: opportunity.countryProcessingTime,
      icon: HiOutlineClock,
    },

    {
      key: "demand",
      label: "Demand",
      value: opportunity.demand,
      icon: HiOutlineTrendingUp,
    },
  ].filter(
    (item) => hasValue(item.value)
  );


  const benefits =
    Array.isArray(opportunity.benefits)
      ? opportunity.benefits.filter(
        (benefit) =>
          hasValue(benefit)
      )
      : [];


  return (
    <section className="opportunity-overview">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="opportunity-overview-header">

        <div>

          <span>
            OPPORTUNITY OVERVIEW
          </span>

          <h2>
            {title}
          </h2>

          {countryName && (
            <p>
              {countryName}
            </p>
          )}

        </div>


        {opportunity.featured && (
          <span className="opportunity-featured">
            Featured
          </span>
        )}

      </div>


      {/* =====================================================
          DESCRIPTION
      ===================================================== */}

      {hasValue(description) && (
        <div className="opportunity-overview-description">

          <p>
            {description}
          </p>

        </div>
      )}


      {/* =====================================================
          METADATA
      ===================================================== */}

      {metadata.length > 0 && (
        <div className="opportunity-overview-grid">

          {metadata.map(
            ({
              key,
              label,
              value,
              icon: Icon,
            }) => (

              <div
                key={key}
                className="opportunity-overview-item"
              >

                <div className="opportunity-overview-item-icon">
                  <Icon />
                </div>


                <div>

                  <span>
                    {label}
                  </span>

                  <strong>
                    {formatValue(value)}
                  </strong>

                </div>

              </div>

            )
          )}

        </div>
      )}


      {/* =====================================================
          COUNTRY METRICS
      ===================================================== */}

      {(hasValue(
        opportunity.countryDuration
      ) ||
        hasValue(
          opportunity.successRate
        ) ||
        hasValue(
          opportunity.opportunityScore
        )) && (

          <div className="opportunity-overview-metrics">

            {hasValue(
              opportunity.countryDuration
            ) && (
                <div>

                  <span>
                    PROGRAM DURATION
                  </span>

                  <strong>
                    {opportunity.countryDuration}
                  </strong>

                </div>
              )}


            {hasValue(
              opportunity.successRate
            ) && (
                <div>

                  <span>
                    SUCCESS RATE
                  </span>

                  <strong>
                    {opportunity.successRate}
                  </strong>

                </div>
              )}


            {hasValue(
              opportunity.opportunityScore
            ) && (
                <div>

                  <span>
                    OPPORTUNITY SCORE
                  </span>

                  <strong>
                    {opportunity.opportunityScore}
                  </strong>

                </div>
              )}

          </div>
        )}


      {/* =====================================================
          SALARY
      ===================================================== */}

      {hasValue(
        opportunity.salary
      ) && (
          <div className="opportunity-overview-highlight">

            <div className="opportunity-overview-highlight-icon">
              <HiOutlineBriefcase />
            </div>

            <div>

              <span>
                COMPENSATION
              </span>

              <strong>
                {formatValue(
                  opportunity.salary
                )}
              </strong>

            </div>

          </div>
        )}


      {/* =====================================================
          BENEFITS
      ===================================================== */}

      {benefits.length > 0 && (
        <div className="opportunity-benefits">

          <div className="opportunity-benefits-heading">

            <span>
              WHAT'S INCLUDED
            </span>

            <strong>
              Benefits
            </strong>

          </div>


          <div className="opportunity-benefits-list">

            {benefits.map(
              (benefit, index) => (

                <div
                  key={`${benefit}-${index}`}
                  className="opportunity-benefit"
                >

                  <HiOutlineCheckCircle />

                  <span>
                    {typeof benefit === "object"
                      ? benefit.label ||
                      benefit.name ||
                      benefit.title ||
                      "Included benefit"
                      : benefit}
                  </span>

                </div>

              )
            )}

          </div>

        </div>
      )}

    </section>
  );
};


export default OpportunityOverview;