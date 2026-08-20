import {
    HiOutlineCheck,
    HiOutlineLockClosed,
} from "react-icons/hi";

import "./ApplicationProgress.css";


const ApplicationProgress = ({
    steps = [],
    currentStep = 0,
    onStepChange,
}) => {


    /* ============================================================
       SAFETY
    ============================================================ */

    const normalizedSteps =
        Array.isArray(steps)
            ? steps
            : [];


    /* ============================================================
       STEP LABELS
    ============================================================ */

    const getStepLabel = (step) => {

        const labels = {

            PERSONAL_INFORMATION:
                "Personal Information",

            QUESTIONS:
                "Application Questions",

            APPLICATION_QUESTIONS:
                "Application Questions",

            DOCUMENTS:
                "Documents",

            REVIEW:
                "Review",

            SUBMIT:
                "Submit",

        };


        if (labels[step]) {
            return labels[step];
        }


        return String(step || "Step")
            .replaceAll("_", " ")
            .toLowerCase()
            .replace(
                /\b\w/g,
                (character) =>
                    character.toUpperCase(),
            );

    };


    /* ============================================================
       STEP DESCRIPTION
    ============================================================ */

    const getStepDescription = (
        step,
        index,
    ) => {

        const descriptions = {

            PERSONAL_INFORMATION:
                "Tell us about yourself",

            QUESTIONS:
                "Pathway-specific questions",

            APPLICATION_QUESTIONS:
                "Pathway-specific questions",

            DOCUMENTS:
                "Upload required documents",

            REVIEW:
                "Check your application",

            SUBMIT:
                "Send your application",

        };


        return (
            descriptions[step] ||
            `Complete step ${index + 1}`
        );

    };


    /* ============================================================
       STEP CLICK
    ============================================================ */

    const handleStepClick = (index) => {

        /*
         * Only completed/current steps can be revisited.
         *
         * Future steps remain locked until the user
         * completes the current step.
         */

        if (index > currentStep) {
            return;
        }


        if (
            typeof onStepChange ===
            "function"
        ) {

            onStepChange(index);

        }

    };


    /* ============================================================
       RENDER
    ============================================================ */

    return (

        <nav
            className="application-progress"
            aria-label="Application progress"
        >


            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="application-progress-header">

                <div>

                    <span className="application-progress-eyebrow">
                        APPLICATION
                    </span>

                    <h2>
                        Your progress
                    </h2>

                </div>


                <span className="application-progress-count">

                    {Math.min(
                        currentStep + 1,
                        normalizedSteps.length || 1,
                    )}

                    <span>
                        /
                    </span>

                    {normalizedSteps.length || 1}

                </span>

            </div>


            {/* ==================================================
                PROGRESS BAR
            ================================================== */}

            <div className="application-progress-bar">

                <span
                    style={{
                        width:
                            normalizedSteps.length > 1
                                ? `${Math.min(
                                    (
                                        currentStep /
                                        (normalizedSteps.length - 1)
                                    ) * 100,
                                    100,
                                )}%`
                                : "100%",
                    }}
                />

            </div>


            {/* ==================================================
                STEP LIST
            ================================================== */}

            <ol className="application-progress-list">

                {normalizedSteps.map(
                    (step, index) => {

                        const completed =
                            index < currentStep;

                        const active =
                            index === currentStep;

                        const locked =
                            index > currentStep;


                        return (

                            <li
                                key={`${step}-${index}`}
                                className={[
                                    "application-progress-item",

                                    completed
                                        ? "completed"
                                        : "",

                                    active
                                        ? "active"
                                        : "",

                                    locked
                                        ? "locked"
                                        : "",

                                ]
                                    .filter(Boolean)
                                    .join(" ")}
                            >

                                {/* =================================================
                                    CONNECTOR
                                ================================================= */}

                                {index <
                                    normalizedSteps.length - 1 && (

                                        <span
                                            className="application-progress-connector"
                                            aria-hidden="true"
                                        />

                                    )}


                                {/* =================================================
                                    STEP BUTTON
                                ================================================= */}

                                <button
                                    type="button"
                                    className="application-progress-step"
                                    onClick={() =>
                                        handleStepClick(
                                            index,
                                        )
                                    }
                                    disabled={locked}
                                    aria-current={
                                        active
                                            ? "step"
                                            : undefined
                                    }
                                >


                                    {/* =========================================
                                        NUMBER / CHECK / LOCK
                                    ========================================= */}

                                    <span className="application-progress-marker">

                                        {completed ? (

                                            <HiOutlineCheck />

                                        ) : locked ? (

                                            <HiOutlineLockClosed />

                                        ) : (

                                            <span>
                                                {index + 1}
                                            </span>

                                        )}

                                    </span>


                                    {/* =========================================
                                        CONTENT
                                    ========================================= */}

                                    <span className="application-progress-content">

                                        <span className="application-progress-step-label">
                                            {getStepLabel(
                                                step,
                                            )}
                                        </span>

                                        <span className="application-progress-step-description">
                                            {getStepDescription(
                                                step,
                                                index,
                                            )}
                                        </span>

                                    </span>

                                </button>

                            </li>

                        );

                    },
                )}

            </ol>


            {/* ==================================================
                FOOTER
            ================================================== */}

            <div className="application-progress-footer">

                <span className="application-progress-footer-dot" />

                <span>
                    Your progress is saved as you continue.
                </span>

            </div>

        </nav>

    );

};


export default ApplicationProgress;