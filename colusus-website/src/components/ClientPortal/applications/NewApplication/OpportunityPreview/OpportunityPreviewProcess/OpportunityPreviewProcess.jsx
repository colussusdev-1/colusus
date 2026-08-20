import {
    HiOutlineArrowRight,
    HiOutlineCheckCircle,
    HiOutlineDocumentText,
    HiOutlineUpload,
    HiOutlineShieldCheck,
} from "react-icons/hi";

import "./OpportunityPreviewProcess.css";


const OpportunityPreviewProcess = ({
    opportunity,
}) => {

    if (!opportunity) {
        return null;
    }


    const {
        process = [],
        applicationProcess = [],
    } = opportunity;


    /*
     * Support either:
     *
     * process: []
     *
     * or
     *
     * applicationProcess: []
     *
     * This keeps the component flexible with the
     * opportunity data already coming from the backend.
     */

    const processItems =
        Array.isArray(process) && process.length > 0
            ? process
            : Array.isArray(applicationProcess)
                ? applicationProcess
                : [];


    /*
     * Backend may eventually return either:
     *
     * "Submit your documents"
     *
     * or
     *
     * { title, description }
     *
     * Support both without changing the UI.
     */

    const normalizeStep = (step, index) => {

        if (typeof step === "string") {

            return {
                number: index + 1,
                title: step,
                description: "",
            };

        }


        if (step && typeof step === "object") {

            return {
                number:
                    step.number ||
                    step.step ||
                    index + 1,

                title:
                    step.title ||
                    step.name ||
                    step.label ||
                    `Application step ${index + 1}`,

                description:
                    step.description ||
                    step.details ||
                    "",
            };

        }


        return {
            number: index + 1,
            title: `Application step ${index + 1}`,
            description: "",
        };

    };


    const steps =
        processItems.map(normalizeStep);


    /*
     * Sensible fallback while the backend does not
     * provide a custom process.
     */

    const fallbackSteps = [

        {
            number: 1,
            title: "Start your application",
            description:
                "Create your application and provide your initial migration information.",
        },

        {
            number: 2,
            title: "Complete your profile",
            description:
                "Provide the personal, professional and pathway information required for your application.",
        },

        {
            number: 3,
            title: "Upload your documents",
            description:
                "Submit the documents required for your selected migration pathway.",
        },

        {
            number: 4,
            title: "Review and submit",
            description:
                "Review your application carefully before submitting it for processing.",
        },

    ];


    const displaySteps =
        steps.length > 0
            ? steps
            : fallbackSteps;


    return (

        <section
            className="opportunity-preview-process"
            aria-label="Application process"
        >


            {/* ======================================================
                HEADER
            ====================================================== */}

            <div className="opportunity-preview-process-header">

                <div className="opportunity-preview-process-icon">

                    <HiOutlineArrowRight />

                </div>


                <div>

                    <span>
                        APPLICATION PROCESS
                    </span>

                    <h3>
                        How your application works
                    </h3>

                    <p>
                        Follow the pathway from your first step
                        through application submission.
                    </p>

                </div>

            </div>


            {/* ======================================================
                PROCESS STEPS
            ====================================================== */}

            <div className="opportunity-preview-process-list">

                {displaySteps.map(
                    (step, index) => (

                        <div
                            key={`process-step-${index}`}
                            className="opportunity-preview-process-step"
                        >


                            {/* ==================================================
                                STEP INDICATOR
                            ================================================== */}

                            <div className="opportunity-preview-process-step-side">

                                <div className="opportunity-preview-process-step-number">

                                    {String(
                                        step.number
                                    ).padStart(2, "0")}

                                </div>


                                {index <
                                    displaySteps.length - 1 && (

                                        <div className="opportunity-preview-process-line" />

                                    )}

                            </div>


                            {/* ==================================================
                                STEP CONTENT
                            ================================================== */}

                            <div className="opportunity-preview-process-step-content">

                                <span>
                                    STEP{" "}
                                    {String(
                                        index + 1
                                    ).padStart(2, "0")}
                                </span>


                                <strong>
                                    {step.title}
                                </strong>


                                {step.description && (

                                    <p>
                                        {step.description}
                                    </p>

                                )}

                            </div>

                        </div>

                    )
                )}

            </div>


            {/* ======================================================
                DOCUMENT NOTE
            ====================================================== */}

            <div className="opportunity-preview-process-note">

                <div className="opportunity-preview-process-note-icon">

                    <HiOutlineDocumentText />

                </div>


                <div>

                    <strong>
                        Your documents stay organised
                    </strong>

                    <p>
                        Colusus will guide you through the required
                        documents and keep your application information
                        organised as you progress.
                    </p>

                </div>

            </div>


            {/* ======================================================
                READY STATE
            ====================================================== */}

            <div className="opportunity-preview-process-ready">

                <div className="opportunity-preview-process-ready-icon">

                    <HiOutlineShieldCheck />

                </div>


                <div>

                    <strong>
                        Everything starts with your application
                    </strong>

                    <p>
                        Once you begin, you'll be guided through
                        each stage of the pathway.
                    </p>

                </div>

            </div>

        </section>

    );
};


export default OpportunityPreviewProcess;