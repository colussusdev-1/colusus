import {
    HiOutlineArrowLeft,
    HiOutlineArrowRight,
    HiOutlineCheckCircle,
    HiOutlineDocumentText,
    HiOutlineQuestionMarkCircle,
    HiOutlineUser,
} from "react-icons/hi";

import PersonalInformationForm
    from "./PersonalInformationForm/PersonalInformationForm";

import "./ApplicationCompletion.css";


/* ============================================================
   DEFAULT STEPS
============================================================ */

const DEFAULT_STEPS = [
    "PERSONAL_INFORMATION",
    "QUESTIONS",
    "DOCUMENTS",
    "REVIEW",
];


/* ============================================================
   STEP META
============================================================ */

const STEP_META = {

    PERSONAL_INFORMATION: {
        label: "Personal Information",
        description: "Tell us about yourself",
        icon: HiOutlineUser,
    },

    QUESTIONS: {
        label: "Application Questions",
        description: "Pathway-specific questions",
        icon: HiOutlineQuestionMarkCircle,
    },

    APPLICATION_QUESTIONS: {
        label: "Application Questions",
        description: "Pathway-specific questions",
        icon: HiOutlineQuestionMarkCircle,
    },

    DOCUMENTS: {
        label: "Documents",
        description: "Upload your required documents",
        icon: HiOutlineDocumentText,
    },

    REVIEW: {
        label: "Review",
        description: "Review your application",
        icon: HiOutlineCheckCircle,
    },

    SUBMIT: {
        label: "Submit",
        description: "Submit your application",
        icon: HiOutlineCheckCircle,
    },

};


/* ============================================================
   HELPERS
============================================================ */

const normalizeStep = (step) => {

    return String(step || "")
        .trim()
        .toUpperCase()
        .replace(/\s+/g, "_");

};


const getStepMeta = (step) => {

    const normalized =
        normalizeStep(step);


    if (STEP_META[normalized]) {
        return STEP_META[normalized];
    }


    return {

        label: String(
            step || "Application Step",
        )
            .replaceAll("_", " ")
            .toLowerCase()
            .replace(
                /\b\w/g,
                (character) =>
                    character.toUpperCase(),
            ),

        description:
            "Complete this part of your application.",

        icon: HiOutlineDocumentText,

    };

};


/* ============================================================
   COMPONENT
============================================================ */

const ApplicationCompletion = ({
    application,
    onApplicationUpdate,
}) => {

    if (!application) {
        return null;
    }


    /* ============================================================
       APPLICATION CONFIGURATION

       IMPORTANT:
       We use the opportunity snapshot because this represents
       the configuration that existed when the application was
       created.
    ============================================================ */

    const applicationConfig =
        application
            ?.opportunitySnapshot
            ?.applicationConfig || {};


    const configuredSteps =
        Array.isArray(
            applicationConfig.steps,
        ) &&
            applicationConfig.steps.length > 0

            ? applicationConfig.steps

            : DEFAULT_STEPS;


    const steps =
        configuredSteps.map(
            normalizeStep,
        );


    /* ============================================================
       CURRENT STEP
    ============================================================ */

    const backendStepIndex =
        Number.isInteger(
            application?.currentStepIndex,
        )
            ? application.currentStepIndex
            : 0;


    const currentStepIndex =
        Math.min(
            Math.max(
                backendStepIndex,
                0,
            ),
            Math.max(
                steps.length - 1,
                0,
            ),
        );


    const currentStep =
        steps[currentStepIndex] ||
        steps[0] ||
        "PERSONAL_INFORMATION";


    const currentMeta =
        getStepMeta(currentStep);


    const CurrentIcon =
        currentMeta.icon;


    /* ============================================================
       PROGRESS
    ============================================================ */

    const progress =
        steps.length > 1
            ? Math.round(
                (
                    currentStepIndex /
                    (steps.length - 1)
                ) * 100,
            )
            : 100;


    /* ============================================================
       STEP NAVIGATION
    ============================================================ */

    const handleStepClick = (
        index,
    ) => {

        /*
         * Completed steps can be revisited.
         * Future steps remain locked.
         */

        if (
            index >
            currentStepIndex
        ) {
            return;
        }


        if (
            typeof onApplicationUpdate !==
            "function"
        ) {
            return;
        }


        onApplicationUpdate({

            currentStepIndex:
                index,

            currentStep:
                steps[index],

        });

    };


    /* ============================================================
       PREVIOUS
    ============================================================ */

    const handlePrevious = () => {

        if (
            currentStepIndex <= 0
        ) {
            return;
        }


        const previousIndex =
            currentStepIndex - 1;


        if (
            typeof onApplicationUpdate !==
            "function"
        ) {
            return;
        }


        onApplicationUpdate({

            currentStepIndex:
                previousIndex,

            currentStep:
                steps[previousIndex],

        });

    };


    /* ============================================================
       CONTINUE
    ============================================================ */

    const handleContinue = () => {

        if (
            currentStepIndex >=
            steps.length - 1
        ) {
            return;
        }


        const nextIndex =
            currentStepIndex + 1;


        if (
            typeof onApplicationUpdate !==
            "function"
        ) {
            return;
        }


        onApplicationUpdate({

            currentStepIndex:
                nextIndex,

            currentStep:
                steps[nextIndex],

        });

    };


    /* ============================================================
       PERSONAL INFORMATION SAVE
    ============================================================ */

    const handlePersonalInformationSave = async (
        personalInformation,
    ) => {

        if (
            typeof onApplicationUpdate !==
            "function"
        ) {
            return;
        }


        onApplicationUpdate({

            personalInformation,

        });

    };


    /* ============================================================
       CURRENT STEP CONTENT
    ============================================================ */

    const renderCurrentStep = () => {

        switch (currentStep) {


            /* ====================================================
               PERSONAL INFORMATION
            ==================================================== */

            case "PERSONAL_INFORMATION":

                return (

                    <PersonalInformationForm
                        application={application}
                        onSave={
                            handlePersonalInformationSave
                        }
                    />

                );


            /* ====================================================
               QUESTIONS
            ==================================================== */

            case "QUESTIONS":

            case "APPLICATION_QUESTIONS":

                return (

                    <div className="application-completion-step-content">

                        <div className="application-completion-section-heading">

                            <span>
                                STEP {String(
                                    currentStepIndex + 1,
                                ).padStart(2, "0")}
                            </span>

                            <h3>
                                Application Questions
                            </h3>

                            <p>
                                Answer the questions specific
                                to your selected pathway.
                            </p>

                        </div>


                        <div className="application-completion-coming-soon">

                            <div className="application-completion-coming-soon-icon">

                                <HiOutlineQuestionMarkCircle />

                            </div>


                            <div>

                                <strong>
                                    Pathway questions
                                </strong>

                                <p>
                                    Your pathway-specific
                                    questions will appear here.
                                </p>

                            </div>

                        </div>

                    </div>

                );


            /* ====================================================
               DOCUMENTS
            ==================================================== */

            case "DOCUMENTS":

                return (

                    <div className="application-completion-step-content">

                        <div className="application-completion-section-heading">

                            <span>
                                STEP {String(
                                    currentStepIndex + 1,
                                ).padStart(2, "0")}
                            </span>

                            <h3>
                                Required Documents
                            </h3>

                            <p>
                                Upload the documents required
                                for this migration pathway.
                            </p>

                        </div>


                        <div className="application-completion-coming-soon">

                            <div className="application-completion-coming-soon-icon">

                                <HiOutlineDocumentText />

                            </div>


                            <div>

                                <strong>
                                    Document submission
                                </strong>

                                <p>
                                    Required document upload
                                    will be connected to the
                                    document module next.
                                </p>

                            </div>

                        </div>

                    </div>

                );


            /* ====================================================
               REVIEW
            ==================================================== */

            case "REVIEW":

                return (

                    <div className="application-completion-step-content">

                        <div className="application-completion-section-heading">

                            <span>
                                STEP {String(
                                    currentStepIndex + 1,
                                ).padStart(2, "0")}
                            </span>

                            <h3>
                                Review Your Application
                            </h3>

                            <p>
                                Review the information you have
                                provided before submitting.
                            </p>

                        </div>


                        <div className="application-completion-coming-soon">

                            <div className="application-completion-coming-soon-icon">

                                <HiOutlineCheckCircle />

                            </div>


                            <div>

                                <strong>
                                    Final review
                                </strong>

                                <p>
                                    Your application summary
                                    will appear here before
                                    submission.
                                </p>

                            </div>

                        </div>

                    </div>

                );


            /* ====================================================
               SUBMIT
            ==================================================== */

            case "SUBMIT":

                return (

                    <div className="application-completion-step-content">

                        <div className="application-completion-section-heading">

                            <span>
                                STEP {String(
                                    currentStepIndex + 1,
                                ).padStart(2, "0")}
                            </span>

                            <h3>
                                Submit Application
                            </h3>

                            <p>
                                Your application is ready to
                                be submitted for processing.
                            </p>

                        </div>


                        <div className="application-completion-coming-soon">

                            <div className="application-completion-coming-soon-icon">

                                <HiOutlineCheckCircle />

                            </div>


                            <div>

                                <strong>
                                    Ready for submission
                                </strong>

                                <p>
                                    Submission controls will be
                                    connected after the review
                                    step is complete.
                                </p>

                            </div>

                        </div>

                    </div>

                );


            /* ====================================================
               FALLBACK
            ==================================================== */

            default:

                return (

                    <div className="application-completion-step-content">

                        <div className="application-completion-section-heading">

                            <span>
                                STEP {String(
                                    currentStepIndex + 1,
                                ).padStart(2, "0")}
                            </span>

                            <h3>
                                {currentMeta.label}
                            </h3>

                            <p>
                                {currentMeta.description}
                            </p>

                        </div>

                    </div>

                );

        }

    };


    /* ============================================================
       RENDER
    ============================================================ */

    return (

        <section
            className="application-completion"
            aria-label="Complete application"
        >


            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="application-completion-header">

                <div className="application-completion-header-copy">

                    <span className="application-completion-eyebrow">
                        COMPLETE YOUR APPLICATION
                    </span>


                    <h2>
                        Complete your application
                    </h2>


                    <p>
                        Work through each step below.
                        Your pathway requirements determine
                        what information we need from you.
                    </p>

                </div>


                <div className="application-completion-progress-summary">

                    <strong>
                        {Math.min(
                            currentStepIndex + 1,
                            steps.length,
                        )}
                    </strong>


                    <span>
                        of {steps.length}
                    </span>


                    <small>
                        steps
                    </small>

                </div>

            </div>


            {/* ==================================================
                PROGRESS
            ================================================== */}

            <div className="application-completion-progress">

                <div className="application-completion-progress-track">

                    <span
                        style={{
                            width: `${progress}%`,
                        }}
                    />

                </div>

            </div>


            {/* ==================================================
                BODY
            ================================================== */}

            <div className="application-completion-body">


                {/* =================================================
                    STEP NAVIGATION
                ================================================= */}

                <aside className="application-completion-navigation">

                    <div className="application-completion-navigation-title">

                        <span>
                            APPLICATION STEPS
                        </span>


                        <strong>
                            {currentMeta.label}
                        </strong>

                    </div>


                    <ol className="application-completion-step-list">

                        {steps.map(
                            (step, index) => {

                                const meta =
                                    getStepMeta(step);


                                const StepIcon =
                                    meta.icon;


                                const completed =
                                    index <
                                    currentStepIndex;


                                const active =
                                    index ===
                                    currentStepIndex;


                                const locked =
                                    index >
                                    currentStepIndex;


                                return (

                                    <li
                                        key={`${step}-${index}`}
                                        className={[
                                            "application-completion-step-item",

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

                                        <button
                                            type="button"
                                            disabled={locked}
                                            onClick={() =>
                                                handleStepClick(
                                                    index,
                                                )
                                            }
                                            className="application-completion-step-button"
                                        >

                                            <span className="application-completion-step-marker">

                                                {completed ? (

                                                    <HiOutlineCheckCircle />

                                                ) : (

                                                    <StepIcon />

                                                )}

                                            </span>


                                            <span className="application-completion-step-copy">

                                                <strong>
                                                    {meta.label}
                                                </strong>


                                                <small>
                                                    {meta.description}
                                                </small>

                                            </span>

                                        </button>

                                    </li>

                                );

                            },
                        )}

                    </ol>

                </aside>


                {/* =================================================
                    CURRENT STEP
                ================================================= */}

                <div className="application-completion-main">


                    <div className="application-completion-main-header">

                        <div className="application-completion-main-icon">

                            <CurrentIcon />

                        </div>


                        <div>

                            <span>
                                STEP {String(
                                    currentStepIndex + 1,
                                ).padStart(2, "0")}
                            </span>


                            <h3>
                                {currentMeta.label}
                            </h3>

                        </div>

                    </div>


                    <div className="application-completion-content">

                        {renderCurrentStep()}

                    </div>


                    {/* =================================================
                        NAVIGATION ACTIONS
                    ================================================= */}

                    <div className="application-completion-actions">


                        <button
                            type="button"
                            className="application-completion-back"
                            disabled={
                                currentStepIndex === 0
                            }
                            onClick={
                                handlePrevious
                            }
                        >

                            <HiOutlineArrowLeft />

                            <span>
                                Back
                            </span>

                        </button>


                        <button
                            type="button"
                            className="application-completion-continue"
                            disabled={
                                currentStepIndex >=
                                steps.length - 1
                            }
                            onClick={
                                handleContinue
                            }
                        >

                            <span>
                                {currentStepIndex >=
                                    steps.length - 1
                                    ? "Complete"
                                    : "Continue"}
                            </span>


                            <HiOutlineArrowRight />

                        </button>

                    </div>

                </div>

            </div>

        </section>

    );

};


export default ApplicationCompletion;