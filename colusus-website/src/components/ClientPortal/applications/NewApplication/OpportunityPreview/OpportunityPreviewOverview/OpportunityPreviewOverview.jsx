import {
    HiOutlineClock,
    HiOutlineInformationCircle,
    HiOutlineCheckCircle,
} from "react-icons/hi";

import "./OpportunityPreviewOverview.css";


const OpportunityPreviewOverview = ({
    opportunity,
}) => {

    if (!opportunity) {
        return null;
    }


    /* ============================================================
       DATA
    ============================================================ */

    const {
        title = "Migration Pathway",
        category = "",
        type = "",
        description = "",
        duration = "",
        processingTime = "",
        requirements = [],
        highlights = [],
    } = opportunity;


    /* ============================================================
       DISPLAY VALUES
    ============================================================ */

    const displayCategory =
        category ||
        type ||
        "Migration pathway";


    const displayDescription =
        description ||
        "Explore this migration pathway and review the requirements, benefits and next steps before starting your application.";


    /*
     * Prefer explicit highlights.
     * Fall back to requirements when highlights
     * haven't been provided by the API.
     */
    const pathwayHighlights =
        Array.isArray(highlights) && highlights.length
            ? highlights
            : Array.isArray(requirements)
                ? requirements
                : [];


    /* ============================================================
       RENDER
    ============================================================ */

    return (
        <section
            className="opportunity-preview-overview"
            aria-label="Pathway overview"
        >

            {/* ======================================================
          PATHWAY INTRO
      ====================================================== */}

            <div className="opportunity-preview-overview-intro">

                <span className="opportunity-preview-overview-category">
                    {displayCategory}
                </span>


                <h2 className="opportunity-preview-overview-title">
                    {title}
                </h2>


                <p className="opportunity-preview-overview-description">
                    {displayDescription}
                </p>

            </div>


            {/* ======================================================
          QUICK DETAILS
      ====================================================== */}

            {(duration || processingTime) && (

                <div className="opportunity-preview-overview-details">

                    {duration && (
                        <div className="opportunity-preview-overview-detail">

                            <div className="opportunity-preview-overview-detail-icon">
                                <HiOutlineClock />
                            </div>

                            <div className="opportunity-preview-overview-detail-content">

                                <span>
                                    Duration
                                </span>

                                <strong>
                                    {duration}
                                </strong>

                            </div>

                        </div>
                    )}


                    {processingTime && (
                        <div className="opportunity-preview-overview-detail">

                            <div className="opportunity-preview-overview-detail-icon">
                                <HiOutlineClock />
                            </div>

                            <div className="opportunity-preview-overview-detail-content">

                                <span>
                                    Processing time
                                </span>

                                <strong>
                                    {processingTime}
                                </strong>

                            </div>

                        </div>
                    )}

                </div>

            )}


            {/* ======================================================
          ABOUT PATHWAY
      ====================================================== */}

            <div className="opportunity-preview-overview-about">

                <div className="opportunity-preview-overview-section-heading">

                    <span className="opportunity-preview-overview-section-icon">
                        <HiOutlineInformationCircle />
                    </span>

                    <h3>
                        About this pathway
                    </h3>

                </div>


                {pathwayHighlights.length > 0 && (

                    <div className="opportunity-preview-overview-highlights">

                        {pathwayHighlights.map((highlight, index) => (

                            <div
                                key={`${highlight}-${index}`}
                                className="opportunity-preview-overview-highlight"
                            >

                                <span className="opportunity-preview-overview-highlight-icon">
                                    <HiOutlineCheckCircle />
                                </span>

                                <span className="opportunity-preview-overview-highlight-text">
                                    {highlight}
                                </span>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </section>
    );
};


export default OpportunityPreviewOverview;