import {
    useRef,
} from "react";

import {
    HiOutlineArrowLeft,
    HiOutlineArrowRight,
    HiOutlineCheckCircle,
    HiOutlineCloudUpload,
    HiOutlineDocumentText,
    HiOutlineEye,
    HiOutlineInformationCircle,
    HiOutlineQuestionMarkCircle,
    HiOutlineUpload,
    HiOutlineUser,
} from "react-icons/hi";

import PersonalInformationForm
    from "./PersonalInformationForm/PersonalInformationForm";

import "./ApplicationCompletion.css";


/* ============================================================
   DEFAULT JOURNEY
============================================================ */

const DEFAULT_STEPS = [
    "DOCUMENTS",
    "REVIEW",
];


/* ============================================================
   STEP META
============================================================ */

const STEP_META = {
    PERSONAL_INFORMATION: {
        label: "Personal Information",
        description: "Review your personal information",
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
        description: "Review your application before submission",
        icon: HiOutlineCheckCircle,
    },

    SUBMIT: {
        label: "Submit",
        description: "Submit your application",
        icon: HiOutlineCheckCircle,
    },
};


/* ============================================================
   STATUS META
============================================================ */

const STATUS_META = {
    DRAFT: {
        label: "Draft",
        className: "status-draft",
    },

    IN_PROGRESS: {
        label: "In Progress",
        className: "status-progress",
    },

    SUBMITTED: {
        label: "Submitted",
        className: "status-submitted",
    },

    UNDER_REVIEW: {
        label: "Under Review",
        className: "status-review",
    },

    DOCUMENT_REQUEST: {
        label: "Documents Required",
        className: "status-document-request",
    },

    PROCESSING: {
        label: "Processing",
        className: "status-processing",
    },

    APPROVED: {
        label: "Approved",
        className: "status-approved",
    },

    REJECTED: {
        label: "Rejected",
        className: "status-rejected",
    },
};


/* ============================================================
   NORMALIZERS
============================================================ */

const normalizeStatus = (value) => {
    return String(value || "")
        .trim()
        .toUpperCase()
        .replace(/\s+/g, "_");
};


const normalizeStep = (value) => {
    return String(value || "")
        .trim()
        .toUpperCase()
        .replace(/\s+/g, "_");
};


/* ============================================================
   META HELPERS
============================================================ */

const getStatusMeta = (status) => {
    const normalizedStatus =
        normalizeStatus(status);

    return (
        STATUS_META[normalizedStatus] ||
        STATUS_META.DRAFT
    );
};


const getStepMeta = (step) => {
    const normalizedStep =
        normalizeStep(step);

    if (STEP_META[normalizedStep]) {
        return STEP_META[normalizedStep];
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
   APPLICATION CONFIG
============================================================ */

const getApplicationConfig = (application) => {
    return (
        application
            ?.opportunitySnapshot
            ?.applicationConfig ||

        application
            ?.opportunity
            ?.applicationConfig ||

        {}
    );
};


/* ============================================================
   APPLICATION STEPS
============================================================ */

const getApplicationSteps = (application) => {
    const config =
        getApplicationConfig(application);

    const configuredSteps =
        Array.isArray(config?.steps)
            ? config.steps
            : [];

    if (!configuredSteps.length) {
        return DEFAULT_STEPS;
    }

    const normalizedSteps =
        configuredSteps
            .map(normalizeStep)
            .filter(Boolean);

    return normalizedSteps.length
        ? normalizedSteps
        : DEFAULT_STEPS;
};


/* ============================================================
   REQUIRED DOCUMENTS
============================================================ */

const getRequiredDocuments = (application) => {
    const config =
        getApplicationConfig(application);

    return (
        config?.requiredDocuments ||

        config?.documents ||

        application
            ?.opportunity
            ?.requiredDocuments ||

        application
            ?.opportunity
            ?.documents ||

        []
    );
};


/* ============================================================
   DOCUMENT HELPERS
============================================================ */

const normalizeDocumentName = (value) => {
    return String(value || "")
        .trim()
        .toLowerCase()
        .replace(/[_-]+/g, " ")
        .replace(/\s+/g, " ");
};


const getRequiredDocumentName = (document) => {
    if (typeof document === "string") {
        return document;
    }

    return (
        document?.name ||
        document?.title ||
        document?.label ||
        document?.documentName ||
        document?.type ||
        "Required document"
    );
};


const getRequiredDocumentType = (document) => {
    if (typeof document === "string") {
        return "OTHER";
    }

    return (
        document?.type ||
        document?.documentType ||
        "OTHER"
    );
};


const getUploadedDocumentName = (document) => {
    return (
        document?.name ||
        document?.originalFileName ||
        document?.originalName ||
        document?.filename ||
        document?.documentName ||
        document?.type ||
        ""
    );
};


/* ============================================================
   FIND UPLOADED DOCUMENT
============================================================ */

const findUploadedDocument = (
    requiredDocument,
    uploadedDocuments,
    usedDocuments,
) => {
    const requiredType =
        String(
            getRequiredDocumentType(
                requiredDocument,
            ) || "",
        )
            .trim()
            .toUpperCase();


    /* ---------------------------------------------------------
       TYPE MATCH
    --------------------------------------------------------- */

    if (
        requiredType &&
        requiredType !== "OTHER"
    ) {
        const typeMatch =
            uploadedDocuments.find(
                (uploadedDocument) => {
                    const uploadedId =
                        uploadedDocument?._id ||
                        uploadedDocument?.id;

                    if (
                        uploadedId &&
                        usedDocuments.has(
                            String(uploadedId),
                        )
                    ) {
                        return false;
                    }

                    const uploadedType =
                        String(
                            uploadedDocument?.type ||
                            uploadedDocument?.documentType ||
                            "",
                        )
                            .trim()
                            .toUpperCase();

                    return (
                        uploadedType ===
                        requiredType
                    );
                },
            );

        if (typeMatch) {
            const uploadedId =
                typeMatch?._id ||
                typeMatch?.id;

            if (uploadedId) {
                usedDocuments.add(
                    String(uploadedId),
                );
            }

            return typeMatch;
        }
    }


    /* ---------------------------------------------------------
       NAME MATCH
    --------------------------------------------------------- */

    const requiredName =
        normalizeDocumentName(
            getRequiredDocumentName(
                requiredDocument,
            ),
        );

    if (!requiredName) {
        return null;
    }


    const nameMatch =
        uploadedDocuments.find(
            (uploadedDocument) => {
                const uploadedId =
                    uploadedDocument?._id ||
                    uploadedDocument?.id;

                if (
                    uploadedId &&
                    usedDocuments.has(
                        String(uploadedId),
                    )
                ) {
                    return false;
                }

                const uploadedName =
                    normalizeDocumentName(
                        getUploadedDocumentName(
                            uploadedDocument,
                        ),
                    );

                if (!uploadedName) {
                    return false;
                }

                return (
                    uploadedName === requiredName ||
                    uploadedName.includes(requiredName) ||
                    requiredName.includes(uploadedName)
                );
            },
        );


    if (nameMatch) {
        const uploadedId =
            nameMatch?._id ||
            nameMatch?.id;

        if (uploadedId) {
            usedDocuments.add(
                String(uploadedId),
            );
        }
    }

    return nameMatch || null;
};


/* ============================================================
   BUILD DOCUMENT CHECKLIST
============================================================ */

const buildDocumentChecklist = (
    application,
    documents,
) => {
    const requiredDocuments =
        getRequiredDocuments(
            application,
        );

    const uploadedDocuments =
        Array.isArray(documents)
            ? documents
            : [];

    const usedDocuments =
        new Set();


    return requiredDocuments.map(
        (
            requiredDocument,
            index,
        ) => {
            const uploadedDocument =
                findUploadedDocument(
                    requiredDocument,
                    uploadedDocuments,
                    usedDocuments,
                );

            const name =
                getRequiredDocumentName(
                    requiredDocument,
                );

            const type =
                getRequiredDocumentType(
                    requiredDocument,
                );

            const id =
                requiredDocument?.key ||
                requiredDocument?.id ||
                requiredDocument?._id ||
                `${type}-${name}-${index}`;

            const description =
                typeof requiredDocument === "object"
                    ? (
                        requiredDocument?.description ||
                        requiredDocument?.note ||
                        ""
                    )
                    : "";

            return {
                id,
                name,
                type,
                description,
                requiredDocument,
                uploadedDocument,
                uploaded:
                    Boolean(uploadedDocument),
            };
        },
    );
};


/* ============================================================
   BACKEND DOCUMENT PROGRESS
============================================================ */

const getBackendDocumentProgress = (
    application,
) => {
    const progress =
        application?.documentProgress;

    if (
        !progress ||
        typeof progress !== "object"
    ) {
        return null;
    }

    return {
        required:
            Number(progress.required) || 0,

        uploaded:
            Number(progress.uploaded) || 0,

        approved:
            Number(progress.approved) || 0,

        pending:
            Number(progress.pending) || 0,

        rejected:
            Number(progress.rejected) || 0,

        missing:
            Array.isArray(progress.missing)
                ? progress.missing
                : [],

        percentage:
            Number(progress.percentage) || 0,

        complete:
            Boolean(progress.complete),
    };
};


/* ============================================================
   COMPONENT
============================================================ */

const ApplicationCompletion = ({
    application,
    onApplicationUpdate,
    documents = [],
    documentsLoading = false,
    documentError = "",
    uploadingDocumentId = null,
    onUpload,
    onView,
}) => {
    const fileInputRefs =
        useRef({});


    if (!application) {
        return null;
    }


    /* ============================================================
       APPLICATION STEPS
    ============================================================ */

    const finalSteps =
        getApplicationSteps(
            application,
        );


    /* ============================================================
       STATUS
    ============================================================ */

    const applicationStatus =
        normalizeStatus(
            application.status,
        );

    const statusMeta =
        getStatusMeta(
            applicationStatus,
        );


    /* ============================================================
       STATUS FLAGS
    ============================================================ */

    const isDraft =
        applicationStatus === "DRAFT";

    const isInProgress =
        applicationStatus === "IN_PROGRESS";

    const isSubmitted =
        applicationStatus === "SUBMITTED";

    const isUnderReview =
        applicationStatus === "UNDER_REVIEW";

    const isDocumentRequest =
        applicationStatus === "DOCUMENT_REQUEST";

    const isProcessing =
        applicationStatus === "PROCESSING";

    const isApproved =
        applicationStatus === "APPROVED";

    const isRejected =
        applicationStatus === "REJECTED";


    /* ============================================================
       WORKFLOW LOCK
    ============================================================ */

    const workflowLocked =
        isSubmitted ||
        isUnderReview ||
        isDocumentRequest ||
        isProcessing ||
        isApproved ||
        isRejected;


    /* ============================================================
       DOCUMENT PROGRESS
    ============================================================ */

    const backendProgress =
        getBackendDocumentProgress(
            application,
        );

    const documentChecklist =
        buildDocumentChecklist(
            application,
            documents,
        );


    const localRequired =
        documentChecklist.length;

    const localUploaded =
        documentChecklist.filter(
            (document) =>
                document.uploaded,
        ).length;


    const totalRequiredDocuments =
        backendProgress
            ? backendProgress.required
            : localRequired;


    const uploadedRequiredDocuments =
        backendProgress
            ? backendProgress.uploaded
            : localUploaded;


    const missingRequiredDocuments =
        backendProgress
            ? backendProgress.missing.length
            : Math.max(
                totalRequiredDocuments -
                uploadedRequiredDocuments,
                0,
            );


    const documentsComplete =
        backendProgress
            ? backendProgress.complete
            : (
                totalRequiredDocuments === 0 ||
                missingRequiredDocuments === 0
            );


    const documentProgress =
        backendProgress
            ? backendProgress.percentage
            : (
                totalRequiredDocuments > 0
                    ? Math.round(
                        (
                            uploadedRequiredDocuments /
                            totalRequiredDocuments
                        ) * 100,
                    )
                    : 100
            );


    /* ============================================================
       CURRENT STEP
    ============================================================ */

    const rawStepIndex =
        Number.isInteger(
            application.currentStepIndex,
        )
            ? application.currentStepIndex
            : 0;


    const currentStepIndex =
        Math.min(
            Math.max(
                rawStepIndex,
                0,
            ),
            Math.max(
                finalSteps.length - 1,
                0,
            ),
        );


    const currentStep =
        normalizeStep(
            application.currentStep,
        ) ||
        finalSteps[currentStepIndex] ||
        "DOCUMENTS";


    const currentMeta =
        getStepMeta(
            currentStep,
        );

    const CurrentIcon =
        currentMeta.icon;


    /* ============================================================
       JOURNEY PROGRESS
    ============================================================ */

    const journeyProgress =
        isDraft
            ? 0
            : finalSteps.length <= 1
                ? 100
                : Math.round(
                    (
                        currentStepIndex /
                        (finalSteps.length - 1)
                    ) * 100,
                );


    /* ============================================================
       CONTINUE STATE
    ============================================================ */

    const canContinue =
        currentStep !== "DOCUMENTS" ||
        documentsComplete;


    /* ============================================================
       PERSIST UPDATE
    ============================================================ */

    const persistApplicationUpdate = (
        update,
    ) => {
        if (
            typeof onApplicationUpdate !==
            "function"
        ) {
            return;
        }

        onApplicationUpdate(update);
    };


    /* ============================================================
       STEP CLICK
    ============================================================ */

    const handleStepClick = (
        index,
    ) => {
        if (workflowLocked) {
            return;
        }

        if (
            index >
            currentStepIndex
        ) {
            return;
        }

        persistApplicationUpdate({
            currentStepIndex:
                index,

            currentStep:
                finalSteps[index],
        });
    };


    /* ============================================================
       PREVIOUS
    ============================================================ */

    const handlePrevious = () => {
        if (
            workflowLocked ||
            currentStepIndex <= 0
        ) {
            return;
        }

        const previousIndex =
            currentStepIndex - 1;

        persistApplicationUpdate({
            currentStepIndex:
                previousIndex,

            currentStep:
                finalSteps[
                previousIndex
                ],
        });
    };


    /* ============================================================
       CONTINUE
    ============================================================ */

    const handleContinue = () => {
        if (workflowLocked) {
            return;
        }

        if (
            currentStepIndex >=
            finalSteps.length - 1
        ) {
            return;
        }

        if (
            currentStep === "DOCUMENTS" &&
            !documentsComplete
        ) {
            return;
        }

        const nextIndex =
            currentStepIndex + 1;

        persistApplicationUpdate({
            status: "IN_PROGRESS",

            currentStepIndex:
                nextIndex,

            currentStep:
                finalSteps[nextIndex],
        });
    };


    /* ============================================================
       PERSONAL INFORMATION
    ============================================================ */

    const handlePersonalInformationSave =
        (personalInformation) => {
            persistApplicationUpdate({
                personalInformation,
            });
        };


    /* ============================================================
       FILE SELECTION
    ============================================================ */

    const handleFileSelected = (
        document,
        event,
    ) => {
        const file =
            event.target.files?.[0];

        event.target.value = "";

        if (!file) {
            return;
        }

        if (
            typeof onUpload !==
            "function"
        ) {
            return;
        }

        onUpload(
            document.requiredDocument,
            file,
        );
    };


    /* ============================================================
       REVIEW DATA
    ============================================================ */

    const destinationCountry =
        application?.destinationCountry ||
        application?.opportunity?.countryName ||
        application?.opportunitySnapshot?.countryName ||
        "Not provided";


    const applicationType =
        application?.type ||
        "Not provided";


    const opportunityTitle =
        application?.opportunity?.title ||
        application?.opportunity?.name ||
        application?.opportunitySnapshot?.title ||
        "Migration opportunity";


    const applicantName =
        application?.client?.name ||
        application?.user?.name ||
        application?.clientName ||
        application?.personalInformation?.fullName ||
        "Applicant";


    /* ============================================================
       DOCUMENT STEP
    ============================================================ */

    const renderDocumentsStep = () => (
        <div className="application-completion-step-content">

            <div className="application-completion-section-heading">

                <span>
                    STEP{" "}
                    {String(
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


            <div className="application-completion-document-workflow">

                <div className="application-completion-document-header">

                    <div>

                        <span>
                            DOCUMENTS
                        </span>

                        <h4>
                            Required documents
                        </h4>

                        <p>
                            Keep your application documents
                            complete and up to date.
                        </p>

                    </div>


                    <div className="application-completion-document-summary">

                        <strong>
                            {uploadedRequiredDocuments}

                            <span>
                                /{totalRequiredDocuments}
                            </span>
                        </strong>

                        <small>
                            COMPLETE
                        </small>

                    </div>

                </div>


                <div className="application-completion-document-readiness">

                    <div className="application-completion-document-readiness-header">

                        <span>
                            Document readiness
                        </span>

                        <strong>
                            {documentProgress}%
                        </strong>

                    </div>


                    <div className="application-completion-document-progress">

                        <span
                            style={{
                                width:
                                    `${documentProgress}%`,
                            }}
                        />

                    </div>


                    <small>

                        {documentsLoading
                            ? "Loading your documents..."
                            : missingRequiredDocuments > 0
                                ? `${missingRequiredDocuments} document${missingRequiredDocuments === 1
                                    ? ""
                                    : "s"
                                } remaining.`
                                : "All required documents are complete."
                        }

                    </small>

                </div>


                {documentError && (
                    <div className="application-completion-document-error">

                        <HiOutlineInformationCircle />

                        <span>
                            {documentError}
                        </span>

                    </div>
                )}


                {documentsLoading ? (
                    <div className="application-completion-document-loading">

                        <div className="application-completion-document-spinner" />

                        <div>

                            <strong>
                                Loading documents
                            </strong>

                            <p>
                                Checking your application
                                document requirements.
                            </p>

                        </div>

                    </div>
                ) : totalRequiredDocuments === 0 ? (
                    <div className="application-completion-document-empty">

                        <div className="application-completion-document-empty-icon">

                            <HiOutlineDocumentText />

                        </div>

                        <div>

                            <strong>
                                No document requirements
                            </strong>

                            <p>
                                Document requirements for this
                                application have not been configured.
                            </p>

                        </div>

                    </div>
                ) : (
                    <div className="application-completion-document-list">

                        {documentChecklist.map(
                            (document) => {
                                const documentId =
                                    document.id;

                                const uploading =
                                    uploadingDocumentId !== null &&
                                    String(
                                        uploadingDocumentId,
                                    ) ===
                                    String(documentId);

                                return (
                                    <div
                                        key={documentId}
                                        className={[
                                            "application-completion-document-row",

                                            document.uploaded
                                                ? "is-uploaded"
                                                : "is-required",

                                            uploading
                                                ? "is-uploading"
                                                : "",
                                        ]
                                            .filter(Boolean)
                                            .join(" ")}
                                    >

                                        <div className="application-completion-document-icon">

                                            {document.uploaded ? (
                                                <HiOutlineCheckCircle />
                                            ) : (
                                                <HiOutlineDocumentText />
                                            )}

                                        </div>


                                        <div className="application-completion-document-info">

                                            <div className="application-completion-document-title">

                                                <strong>
                                                    {document.name}
                                                </strong>

                                                <span
                                                    className={[
                                                        "application-completion-document-status",

                                                        document.uploaded
                                                            ? "uploaded"
                                                            : "required",
                                                    ]
                                                        .filter(Boolean)
                                                        .join(" ")}
                                                >
                                                    {document.uploaded
                                                        ? "UPLOADED"
                                                        : "REQUIRED"}
                                                </span>

                                            </div>


                                            <p>
                                                {document.description ||
                                                    (
                                                        document.uploaded
                                                            ? "Ready for review"
                                                            : "Required to continue your application"
                                                    )}
                                            </p>

                                        </div>


                                        <div className="application-completion-document-action">

                                            {document.uploaded ? (
                                                <button
                                                    type="button"
                                                    className="application-completion-document-view"
                                                    onClick={() =>
                                                        onView?.(
                                                            document.uploadedDocument,
                                                        )
                                                    }
                                                >
                                                    <HiOutlineEye />

                                                    <span>
                                                        View
                                                    </span>
                                                </button>
                                            ) : (
                                                <>
                                                    <input
                                                        ref={(element) => {
                                                            fileInputRefs.current[
                                                                documentId
                                                            ] = element;
                                                        }}
                                                        type="file"
                                                        accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                                                        style={{
                                                            display:
                                                                "none",
                                                        }}
                                                        onChange={(
                                                            event,
                                                        ) =>
                                                            handleFileSelected(
                                                                document,
                                                                event,
                                                            )
                                                        }
                                                    />

                                                    <button
                                                        type="button"
                                                        className="application-completion-document-upload"
                                                        disabled={
                                                            uploading
                                                        }
                                                        onClick={() =>
                                                            fileInputRefs.current[
                                                                documentId
                                                            ]?.click()
                                                        }
                                                    >
                                                        {uploading ? (
                                                            <>
                                                                <span className="application-completion-document-button-spinner" />

                                                                <span>
                                                                    Uploading...
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <HiOutlineUpload />

                                                                <span>
                                                                    Upload
                                                                </span>
                                                            </>
                                                        )}
                                                    </button>
                                                </>
                                            )}

                                        </div>

                                    </div>
                                );
                            },
                        )}

                    </div>
                )}


                {!documentsLoading &&
                    missingRequiredDocuments > 0 && (
                        <div className="application-completion-document-notice">

                            <div className="application-completion-document-notice-icon">

                                <HiOutlineCloudUpload />

                            </div>

                            <div>

                                <strong>
                                    Your application needs{" "}
                                    {missingRequiredDocuments}{" "}
                                    document
                                    {missingRequiredDocuments === 1
                                        ? ""
                                        : "s"}
                                </strong>

                                <p>
                                    Upload the remaining required
                                    documents to keep your application
                                    moving.
                                </p>

                            </div>

                        </div>
                    )}


                {!documentsLoading &&
                    totalRequiredDocuments > 0 &&
                    documentsComplete && (
                        <div className="application-completion-document-complete">

                            <div className="application-completion-document-complete-icon">

                                <HiOutlineCheckCircle />

                            </div>

                            <div>

                                <strong>
                                    Document checklist complete
                                </strong>

                                <p>
                                    All required documents have been
                                    uploaded. Your application can now
                                    move into review.
                                </p>

                            </div>

                        </div>
                    )}

            </div>

        </div>
    );


    /* ============================================================
       REVIEW STEP
    ============================================================ */

    const renderReviewStep = () => (
        <div className="application-completion-step-content">

            <div className="application-completion-section-heading">

                <span>
                    STEP{" "}
                    {String(
                        currentStepIndex + 1,
                    ).padStart(2, "0")}
                </span>

                <h3>
                    Review Your Application
                </h3>

                <p>
                    Review the information below
                    before your application moves
                    forward.
                </p>

            </div>


            <div className="application-completion-review">

                <div className="application-completion-review-card">

                    <div className="application-completion-review-card-icon">
                        <HiOutlineUser />
                    </div>

                    <div>

                        <span>
                            APPLICANT
                        </span>

                        <strong>
                            {applicantName}
                        </strong>

                    </div>

                </div>


                <div className="application-completion-review-card">

                    <div className="application-completion-review-card-icon">
                        <HiOutlineDocumentText />
                    </div>

                    <div>

                        <span>
                            DESTINATION
                        </span>

                        <strong>
                            {destinationCountry}
                        </strong>

                    </div>

                </div>


                <div className="application-completion-review-card">

                    <div className="application-completion-review-card-icon">
                        <HiOutlineDocumentText />
                    </div>

                    <div>

                        <span>
                            APPLICATION TYPE
                        </span>

                        <strong>
                            {applicationType}
                        </strong>

                    </div>

                </div>


                <div className="application-completion-review-card">

                    <div className="application-completion-review-card-icon">
                        <HiOutlineCheckCircle />
                    </div>

                    <div>

                        <span>
                            OPPORTUNITY
                        </span>

                        <strong>
                            {opportunityTitle}
                        </strong>

                    </div>

                </div>

            </div>


            <div className="application-completion-review-documents">

                <div className="application-completion-review-documents-header">

                    <div>

                        <span>
                            DOCUMENT CHECKLIST
                        </span>

                        <h4>
                            Required documents
                        </h4>

                    </div>

                    <strong>
                        {uploadedRequiredDocuments}
                        /
                        {totalRequiredDocuments}
                    </strong>

                </div>


                <div className="application-completion-review-document-list">

                    {documentChecklist.length === 0 ? (
                        <div className="application-completion-review-empty">

                            <HiOutlineInformationCircle />

                            <span>
                                No document requirements
                                are configured for this
                                application.
                            </span>

                        </div>
                    ) : (
                        documentChecklist.map(
                            (document) => (
                                <div
                                    key={document.id}
                                    className={[
                                        "application-completion-review-document",

                                        document.uploaded
                                            ? "uploaded"
                                            : "missing",
                                    ]
                                        .filter(Boolean)
                                        .join(" ")}
                                >

                                    <div>

                                        {document.uploaded ? (
                                            <HiOutlineCheckCircle />
                                        ) : (
                                            <HiOutlineDocumentText />
                                        )}

                                    </div>

                                    <span>
                                        {document.name}
                                    </span>

                                    <strong>
                                        {document.uploaded
                                            ? "Uploaded"
                                            : "Missing"}
                                    </strong>

                                </div>
                            ),
                        )
                    )}

                </div>

            </div>


            <div className="application-completion-review-notice">

                <HiOutlineInformationCircle />

                <div>

                    <strong>
                        {documentsComplete
                            ? "Ready for review"
                            : "Documents still required"}
                    </strong>

                    <p>
                        {documentsComplete
                            ? "All required documents have been supplied. Your application can proceed through the review workflow."
                            : "Complete the missing documents before the application can move into review."}
                    </p>

                </div>

            </div>

        </div>
    );


    /* ============================================================
       CURRENT STEP
    ============================================================ */

    const renderCurrentStep = () => {
        switch (currentStep) {

            case "PERSONAL_INFORMATION":
                return (
                    <PersonalInformationForm
                        application={
                            application
                        }
                        onSave={
                            handlePersonalInformationSave
                        }
                    />
                );


            case "QUESTIONS":

            case "APPLICATION_QUESTIONS":
                return (
                    <div className="application-completion-step-content">

                        <div className="application-completion-section-heading">

                            <span>
                                STEP{" "}
                                {String(
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
                                    questions are configured
                                    for this application.
                                </p>

                            </div>

                        </div>

                    </div>
                );


            case "DOCUMENTS":
                return renderDocumentsStep();


            case "REVIEW":
                return renderReviewStep();


            case "SUBMIT":
                return (
                    <div className="application-completion-step-content">

                        <div className="application-completion-section-heading">

                            <span>
                                STEP{" "}
                                {String(
                                    currentStepIndex + 1,
                                ).padStart(2, "0")}
                            </span>

                            <h3>
                                Submit Application
                            </h3>

                            <p>
                                Your application is ready
                                to be submitted for processing.
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
                                    workflow is complete.
                                </p>

                            </div>

                        </div>

                    </div>
                );


            default:
                return (
                    <div className="application-completion-step-content">

                        <div className="application-completion-section-heading">

                            <span>
                                STEP{" "}
                                {String(
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
            className={[
                "application-completion",

                `application-status-${statusMeta.className}`,

                workflowLocked
                    ? "workflow-locked"
                    : "",

                isDraft
                    ? "is-draft"
                    : "",

                isInProgress
                    ? "is-in-progress"
                    : "",

                isApproved
                    ? "is-approved"
                    : "",

                isRejected
                    ? "is-rejected"
                    : "",
            ]
                .filter(Boolean)
                .join(" ")}

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
                            finalSteps.length,
                        )}
                    </strong>

                    <span>
                        of {finalSteps.length}
                    </span>

                    <small>
                        STEPS
                    </small>

                </div>

            </div>


            {/* ==================================================
                JOURNEY PROGRESS
            ================================================== */}

            <div className="application-completion-progress">

                <div className="application-completion-progress-track">

                    <span
                        style={{
                            width:
                                `${journeyProgress}%`,
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

                        {finalSteps.map(
                            (
                                step,
                                index,
                            ) => {
                                const meta =
                                    getStepMeta(
                                        step,
                                    );

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
                                    currentStepIndex ||
                                    workflowLocked;


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
                                            disabled={
                                                locked
                                            }
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
                                STEP{" "}
                                {String(
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

                    {!workflowLocked && (
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
                                    finalSteps.length - 1 ||
                                    !canContinue
                                }
                                onClick={
                                    handleContinue
                                }
                            >

                                <span>

                                    {currentStepIndex >=
                                        finalSteps.length - 1
                                        ? "Complete"

                                        : currentStep ===
                                            "DOCUMENTS" &&
                                            !documentsComplete
                                            ? "Complete documents first"

                                            : "Continue"}

                                </span>

                                <HiOutlineArrowRight />

                            </button>

                        </div>
                    )}

                </div>

            </div>

        </section>
    );
};


export default ApplicationCompletion;