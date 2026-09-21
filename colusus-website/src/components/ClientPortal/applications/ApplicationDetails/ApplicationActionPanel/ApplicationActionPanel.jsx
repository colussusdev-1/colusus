import {
    HiOutlineArrowRight,
    HiOutlineCheckCircle,
    HiOutlineCloudUpload,
    HiOutlineInformationCircle,
    HiOutlineRefresh,
} from "react-icons/hi";

import "./ApplicationActionPanel.css";


/* ============================================================
   HELPERS
============================================================ */

const normalizeStatus = (value) => {
    return String(value || "")
        .trim()
        .toUpperCase()
        .replace(/\s+/g, "_");
};


const getDocumentProgress = (application) => {
    const progress =
        application?.documentProgress;

    if (
        !progress ||
        typeof progress !== "object"
    ) {
        return {
            required: 0,
            uploaded: 0,
            missing: [],
            complete: false,
        };
    }

    return {
        required:
            Number(progress.required) || 0,

        uploaded:
            Number(progress.uploaded) || 0,

        missing:
            Array.isArray(progress.missing)
                ? progress.missing
                : [],

        complete:
            Boolean(progress.complete),
    };
};


const getRequiredDocumentNames = (application) => {
    const config =
        application
            ?.opportunitySnapshot
            ?.applicationConfig ||
        application
            ?.opportunity
            ?.applicationConfig ||
        {};

    const requiredDocuments =
        Array.isArray(config?.requiredDocuments)
            ? config.requiredDocuments
            : Array.isArray(config?.documents)
                ? config.documents
                : [];

    return requiredDocuments
        .map((document) => {
            if (typeof document === "string") {
                return document;
            }

            return (
                document?.name ||
                document?.title ||
                document?.label ||
                document?.documentName ||
                document?.type ||
                ""
            );
        })
        .filter(Boolean);
};


const getMissingDocumentNames = (
    application,
    documents,
) => {
    const progress =
        getDocumentProgress(application);

    if (progress.missing.length) {
        return progress.missing
            .map((item) => {
                if (typeof item === "string") {
                    return item;
                }

                return (
                    item?.name ||
                    item?.title ||
                    item?.label ||
                    item?.documentName ||
                    item?.type ||
                    ""
                );
            })
            .filter(Boolean);
    }

    const required =
        getRequiredDocumentNames(
            application,
        );

    const uploaded =
        Array.isArray(documents)
            ? documents
            : [];

    const uploadedNames =
        uploaded
            .map((document) =>
                String(
                    document?.name ||
                    document?.originalFileName ||
                    document?.originalName ||
                    document?.filename ||
                    document?.documentName ||
                    document?.type ||
                    "",
                )
                    .trim()
                    .toLowerCase(),
            )
            .filter(Boolean);

    return required.filter(
        (name) => {
            const normalized =
                String(name)
                    .trim()
                    .toLowerCase();

            return !uploadedNames.some(
                (uploadedName) =>
                    uploadedName.includes(
                        normalized,
                    ) ||
                    normalized.includes(
                        uploadedName,
                    ),
            );
        },
    );
};


/* ============================================================
   COMPONENT
============================================================ */

const ApplicationActionPanel = ({
    application,
    documents = [],
    onAction,
}) => {
    if (!application) {
        return null;
    }


    const status =
        normalizeStatus(
            application.status,
        );


    const progress =
        getDocumentProgress(
            application,
        );


    const missingDocuments =
        getMissingDocumentNames(
            application,
            documents,
        );


    const missingCount =
        progress.required > 0
            ? Math.max(
                progress.required -
                progress.uploaded,
                0,
            )
            : missingDocuments.length;


    /* ============================================================
       ACTION STATE
    ============================================================ */

    let panelType = "info";

    let eyebrow = "APPLICATION UPDATE";

    let title = "Your application is on track.";

    let description =
        "There are currently no actions required from you.";

    let actionLabel = "";

    let actionType = "none";

    let icon =
        HiOutlineInformationCircle;


    /* ============================================================
       DOCUMENTS REQUIRED
    ============================================================ */

    if (
        (
            status === "DRAFT" ||
            status === "IN_PROGRESS"
        ) &&
        missingCount > 0
    ) {
        panelType = "action";

        eyebrow = "ACTION REQUIRED";

        title =
            `Upload your required document${missingCount === 1
                ? ""
                : "s"}`;

        description =
            `${missingCount} document${missingCount === 1
                ? ""
                : "s"} ${missingCount === 1
                    ? "is"
                    : "are"} still required before your application can move to document review.`;

        actionLabel =
            "Upload documents";

        actionType =
            "documents";

        icon =
            HiOutlineCloudUpload;
    }


    /* ============================================================
       DOCUMENTS COMPLETE
    ============================================================ */

    else if (
        (
            status === "DRAFT" ||
            status === "IN_PROGRESS"
        ) &&
        progress.required > 0 &&
        progress.complete
    ) {
        panelType = "success";

        eyebrow = "NEXT STEP";

        title =
            "Your documents are ready for review.";

        description =
            "You've supplied the required documents. The next stage is for the Colusus team to review your application.";

        actionLabel =
            "View application";

        actionType =
            "application";

        icon =
            HiOutlineCheckCircle;
    }


    /* ============================================================
       DOCUMENT REQUEST
    ============================================================ */

    else if (
        status === "DOCUMENT_REQUEST"
    ) {
        panelType = "action";

        eyebrow = "ACTION REQUIRED";

        title =
            "Your application needs updated documents.";

        description =
            "The application team has requested additional document attention. Review your application documents for the latest requirement.";

        actionLabel =
            "Review documents";

        actionType =
            "documents";

        icon =
            HiOutlineCloudUpload;
    }


    /* ============================================================
       UNDER REVIEW
    ============================================================ */

    else if (
        status === "UNDER_REVIEW"
    ) {
        panelType = "waiting";

        eyebrow = "NO ACTION REQUIRED";

        title =
            "Your application is being reviewed.";

        description =
            "The Colusus team is currently reviewing your application. We'll notify you if anything requires your attention.";

        icon =
            HiOutlineRefresh;
    }


    /* ============================================================
       SUBMITTED
    ============================================================ */

    else if (
        status === "SUBMITTED"
    ) {
        panelType = "waiting";

        eyebrow = "APPLICATION SUBMITTED";

        title =
            "Your application has been submitted.";

        description =
            "Your application is now with the Colusus team. We'll keep you informed as it moves through the next stage.";

        icon =
            HiOutlineCheckCircle;
    }


    /* ============================================================
       PROCESSING
    ============================================================ */

    else if (
        status === "PROCESSING"
    ) {
        panelType = "waiting";

        eyebrow = "APPLICATION IN PROGRESS";

        title =
            "Your application is being processed.";

        description =
            "No action is currently required from you. We'll notify you when the next stage becomes available.";

        icon =
            HiOutlineRefresh;
    }


    /* ============================================================
       APPROVED
    ============================================================ */

    else if (
        status === "APPROVED"
    ) {
        panelType = "success";

        eyebrow = "APPLICATION APPROVED";

        title =
            "Your application has reached an approved outcome.";

        description =
            "Review your application information for the latest outcome and any next steps.";

        actionLabel =
            "View application";

        actionType =
            "application";

        icon =
            HiOutlineCheckCircle;
    }


    /* ============================================================
       REJECTED
    ============================================================ */

    else if (
        status === "REJECTED"
    ) {
        panelType = "action";

        eyebrow = "APPLICATION UPDATE";

        title =
            "Your application requires attention.";

        description =
            "There is an important update regarding your application. Review the application details and latest activity.";

        actionLabel =
            "Review application";

        actionType =
            "activity";

        icon =
            HiOutlineInformationCircle;
    }


    const ActionIcon = icon;


    const handleAction = () => {
        if (
            typeof onAction ===
            "function"
        ) {
            onAction(
                actionType,
            );
        }
    };


    return (
        <section
            className={[
                "application-action-panel",

                `application-action-panel-${panelType}`,
            ]
                .filter(Boolean)
                .join(" ")}
        >

            <div className="application-action-panel-icon">
                <ActionIcon />
            </div>


            <div className="application-action-panel-content">

                <span className="application-action-panel-eyebrow">
                    {eyebrow}
                </span>

                <h2>
                    {title}
                </h2>

                <p>
                    {description}
                </p>


                {missingDocuments.length > 0 && (
                    <div className="application-action-panel-documents">

                        {missingDocuments
                            .slice(0, 5)
                            .map(
                                (
                                    document,
                                    index,
                                ) => (
                                    <span
                                        key={`${document}-${index}`}
                                    >
                                        {document}
                                    </span>
                                ),
                            )}

                        {missingDocuments.length > 5 && (
                            <span>
                                +
                                {missingDocuments.length - 5}
                                {" "}
                                more
                            </span>
                        )}

                    </div>
                )}

            </div>


            {actionLabel && (
                <button
                    type="button"
                    className="application-action-panel-button"
                    onClick={
                        handleAction
                    }
                >

                    <span>
                        {actionLabel}
                    </span>

                    <HiOutlineArrowRight />

                </button>
            )}

        </section>
    );
};


export default ApplicationActionPanel;