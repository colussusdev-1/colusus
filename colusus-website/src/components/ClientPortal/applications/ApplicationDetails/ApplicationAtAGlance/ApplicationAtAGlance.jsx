import {
    HiOutlineArrowRight,
    HiOutlineCheckCircle,
    HiOutlineDocumentText,
    HiOutlineFlag,
    HiOutlineRefresh,
} from "react-icons/hi";

import "./ApplicationAtAGlance.css";


const normalizeStatus = (value) => {
    return String(value || "")
        .trim()
        .toUpperCase()
        .replace(/\s+/g, "_");
};


const formatStatus = (status) => {
    const normalized =
        normalizeStatus(status);

    const labels = {
        DRAFT: "Draft",
        IN_PROGRESS: "In Progress",
        SUBMITTED: "Submitted",
        UNDER_REVIEW: "Under Review",
        DOCUMENT_REQUEST: "Documents Required",
        PROCESSING: "Processing",
        APPROVED: "Approved",
        REJECTED: "Rejected",
    };

    return (
        labels[normalized] ||
        "In Progress"
    );
};


const formatStep = (value) => {
    if (!value) {
        return "Not started";
    }

    return String(value)
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(
            /\b\w/g,
            (character) =>
                character.toUpperCase(),
        );
};


const getNextStep = (
    application,
) => {
    const config =
        application
            ?.opportunitySnapshot
            ?.applicationConfig ||
        application
            ?.opportunity
            ?.applicationConfig ||
        {};

    const steps =
        Array.isArray(config?.steps)
            ? config.steps
            : ["DOCUMENTS", "REVIEW"];

    const currentIndex =
        Number.isInteger(
            application?.currentStepIndex,
        )
            ? application.currentStepIndex
            : 0;

    const next =
        steps[currentIndex + 1];

    if (!next) {
        return "Application review";
    }

    return formatStep(next);
};


const ApplicationAtAGlance = ({
    application,
    documents = [],
}) => {
    if (!application) {
        return null;
    }


    const status =
        normalizeStatus(
            application.status,
        );


    const documentProgress =
        application?.documentProgress;


    const required =
        Number(
            documentProgress?.required,
        ) || 0;


    const uploaded =
        Number(
            documentProgress?.uploaded,
        ) || 0;


    const documentLabel =
        required > 0
            ? `${uploaded} / ${required}`
            : Array.isArray(documents)
                ? `${documents.length}`
                : "0";


    const currentStep =
        application?.currentStep ||
        "DOCUMENTS";


    const currentStepLabel =
        formatStep(
            currentStep,
        );


    const nextStep =
        getNextStep(
            application,
        );


    return (
        <section className="application-glance">

            <div className="application-glance-header">

                <div>
                    <span>
                        AT A GLANCE
                    </span>

                    <h2>
                        Your application overview
                    </h2>
                </div>

            </div>


            <div className="application-glance-grid">

                <div className="application-glance-card">

                    <div className="application-glance-card-icon">
                        <HiOutlineRefresh />
                    </div>

                    <div>
                        <span>
                            APPLICATION STATUS
                        </span>

                        <strong>
                            {formatStatus(status)}
                        </strong>
                    </div>

                </div>


                <div className="application-glance-card">

                    <div className="application-glance-card-icon">
                        <HiOutlineDocumentText />
                    </div>

                    <div>
                        <span>
                            DOCUMENTS
                        </span>

                        <strong>
                            {documentLabel}
                        </strong>
                    </div>

                </div>


                <div className="application-glance-card">

                    <div className="application-glance-card-icon">
                        <HiOutlineFlag />
                    </div>

                    <div>
                        <span>
                            CURRENT STAGE
                        </span>

                        <strong>
                            {currentStepLabel}
                        </strong>
                    </div>

                </div>


                <div className="application-glance-card application-glance-card-next">

                    <div className="application-glance-card-icon">
                        <HiOutlineArrowRight />
                    </div>

                    <div>
                        <span>
                            NEXT STEP
                        </span>

                        <strong>
                            {nextStep}
                        </strong>
                    </div>

                </div>

            </div>

        </section>
    );
};


export default ApplicationAtAGlance;