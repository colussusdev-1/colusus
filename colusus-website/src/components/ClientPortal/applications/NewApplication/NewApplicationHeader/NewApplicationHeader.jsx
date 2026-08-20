import {
    HiOutlineArrowLeft,
    HiOutlineSparkles,
    HiOutlineBadgeCheck,
    HiOutlineClock,
} from "react-icons/hi";

import { useNavigate } from "react-router-dom";

import "./NewApplicationHeader.css";


const NewApplicationHeader = ({
    opportunitiesCount = 0,
    averageSuccessRate = null,
    averageProcessingTime = "",
}) => {

    const navigate = useNavigate();

    const opportunityLabel =
        opportunitiesCount === 1
            ? "pathway available"
            : "pathways available";


    return (
        <header className="new-application-header">

            {/* =====================================================
                BACK
            ===================================================== */}

            <button
                type="button"
                className="new-application-header-back"
                onClick={() => navigate("/portal/applications")}
                aria-label="Back to applications"
            >

                <span className="new-application-header-back-icon">
                    <HiOutlineArrowLeft />
                </span>

                <span>
                    Back to Applications
                </span>

            </button>


            {/* =====================================================
                MAIN HEADER
            ===================================================== */}

            <div className="new-application-header-main">

                <div className="new-application-header-copy">

                    {/* EYEBROW */}

                    <div className="new-application-header-eyebrow">

                        <span />

                        <span>
                            START YOUR JOURNEY
                        </span>

                    </div>


                    {/* TITLE */}

                    <h1 className="new-application-header-title">
                        Find the right migration pathway.
                    </h1>


                    {/* DESCRIPTION */}

                    <p className="new-application-header-description">
                        Explore pathways based on your goals, skills
                        and destination. Choose one and we'll guide
                        you through the application step by step.
                    </p>

                </div>


                {/* =================================================
                    QUICK INTELLIGENCE
                ================================================= */}

                <div className="new-application-header-insight">

                    <div className="new-application-header-insight-icon">
                        <HiOutlineSparkles />
                    </div>

                    <div className="new-application-header-insight-copy">

                        <strong>
                            {opportunitiesCount}{" "}
                            {opportunityLabel}
                        </strong>

                        <span>
                            Compare pathways before you apply
                        </span>

                    </div>

                </div>

            </div>


            {/* =====================================================
                METRICS
            ===================================================== */}

            <div className="new-application-header-metrics">

                {/* PATHWAYS */}

                <div className="new-application-header-metric">

                    <span className="new-application-header-metric-dot blue" />

                    <div>

                        <strong>
                            {opportunitiesCount}
                        </strong>

                        <span>
                            Pathways available
                        </span>

                    </div>

                </div>


                {/* SUCCESS RATE */}

                <div className="new-application-header-metric">

                    <span className="new-application-header-metric-dot green">
                        <HiOutlineBadgeCheck />
                    </span>

                    <div>

                        <strong>
                            {averageSuccessRate !== null
                                ? `${averageSuccessRate}%`
                                : "—"}
                        </strong>

                        <span>
                            Average success rate
                        </span>

                    </div>

                </div>


                {/* PROCESSING TIME */}

                <div className="new-application-header-metric">

                    <span className="new-application-header-metric-dot purple">
                        <HiOutlineClock />
                    </span>

                    <div>

                        <strong>
                            {averageProcessingTime || "—"}
                        </strong>

                        <span>
                            Average processing time
                        </span>

                    </div>

                </div>


                {/* STATUS */}

                <div className="new-application-header-updated">

                    <span />

                    Pathways updated regularly

                </div>

            </div>

        </header>
    );
};


export default NewApplicationHeader;