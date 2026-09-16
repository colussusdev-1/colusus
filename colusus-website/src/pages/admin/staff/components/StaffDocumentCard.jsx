import React, { useEffect, useState } from "react";

import {
    HiOutlineDocument,
    HiOutlineExternalLink,
    HiOutlineCheck,
    HiOutlineX,
    HiOutlineRefresh,
    HiOutlineChevronDown,
    HiOutlineChevronUp,
    HiOutlineExclamationCircle,
    HiOutlineLockClosed,
    HiOutlineEye,
    HiOutlineXCircle,
} from "react-icons/hi";

import StaffStatusBadge from "./StaffStatusBadge";

import "./StaffDocumentCard.css";


/*
============================================================
COLOSSUS
STAFF DOCUMENT CARD
============================================================

Reusable document review card for the Staff application
workspace.

Responsibilities:
- Display document information
- Display review status
- Open uploaded document inside Colusus
- Provide a controlled document preview
- Provide review actions for reviewable documents
- Collect review notes
- Require notes for rejection / re-upload requests
- Lock final document decisions for Staff
- Report review action back to parent

DOCUMENT VIEW RULE
------------------------------------------------------------
Documents are viewed inside the Staff workspace.

The original storage URL is NEVER rendered as visible text.

The viewer supports browser-viewable formats such as:

- PDF
- JPG / JPEG
- PNG
- WEBP
- GIF
- SVG

The document is not opened in a new browser tab.

Future:
Additional server-side preview support can be added for
formats such as DOCX without exposing storage URLs.
============================================================
*/


const REVIEW_ACTIONS = {
    APPROVED: {
        label: "Approve",
        icon: HiOutlineCheck,
    },

    REJECTED: {
        label: "Reject",
        icon: HiOutlineX,
    },

    REUPLOAD_REQUIRED: {
        label: "Request Re-upload",
        icon: HiOutlineRefresh,
    },
};


const FINAL_STATUSES = [
    "APPROVED",
    "REJECTED",
    "REUPLOAD_REQUIRED",
];


const IMAGE_EXTENSIONS = [
    "jpg",
    "jpeg",
    "png",
    "webp",
    "gif",
    "svg",
];


const PDF_EXTENSIONS = [
    "pdf",
];


const formatDate = (date) => {

    if (!date) {
        return "—";
    }

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
        return "—";
    }

    return parsed.toLocaleDateString(
        "en-GB",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }
    );
};


const getDocumentName = (document) => {

    return (
        document?.name ||
        document?.fileName ||
        document?.originalName ||
        document?.filename ||
        "Untitled document"
    );

};


const getDocumentType = (document) => {

    return (
        document?.documentType ||
        document?.type ||
        document?.category ||
        "Document"
    );

};


const getDocumentUrl = (document) => {

    return (
        document?.url ||
        document?.fileUrl ||
        document?.secureUrl ||
        document?.documentUrl ||
        ""
    );

};


/*
============================================================
DOCUMENT VIEW TYPE
============================================================
*/

const getDocumentExtension = (
    document
) => {

    const fileName =
        getDocumentName(document);

    const url =
        getDocumentUrl(document);

    const source =
        fileName ||
        url;

    if (!source) {
        return "";
    }

    const cleanSource =
        source
            .split("?")[0]
            .split("#")[0];

    const parts =
        cleanSource
            .split(".");

    if (parts.length < 2) {
        return "";
    }

    return parts
        .pop()
        .toLowerCase()
        .trim();

};


const getDocumentViewType = (
    document
) => {

    const extension =
        getDocumentExtension(
            document
        );


    const contentType =
        String(
            document?.mimeType ||
            document?.contentType ||
            document?.fileType ||
            ""
        )
            .toLowerCase()
            .trim();


    if (
        contentType.includes("pdf") ||
        PDF_EXTENSIONS.includes(extension)
    ) {
        return "pdf";
    }


    if (
        contentType.startsWith("image/") ||
        IMAGE_EXTENSIONS.includes(extension)
    ) {
        return "image";
    }


    return "unsupported";

};


/*
============================================================
STATUS
============================================================
*/

const normalizeStatus = (status) => {

    return String(
        status || "UPLOADED"
    )
        .trim()
        .toUpperCase();

};


const getStatusMessage = (status) => {

    switch (status) {

        case "APPROVED":

            return {
                eyebrow: "Document approved",
                title:
                    "This document has been approved.",
                description:
                    "No further staff action is available for this document.",
            };


        case "REJECTED":

            return {
                eyebrow: "Document rejected",
                title:
                    "This document has been rejected.",
                description:
                    "The decision is locked. Any change will require an administrative review.",
            };


        case "REUPLOAD_REQUIRED":

            return {
                eyebrow: "Action required",
                title:
                    "A new version of this document is required.",
                description:
                    "The client needs to provide another copy of this document. The current decision is locked.",
            };


        case "UNDER_REVIEW":

            return {
                eyebrow: "Document review",
                title:
                    "This document is under review.",
                description:
                    "Review the uploaded file before making a decision.",
            };


        default:

            return {
                eyebrow: "Document review",
                title:
                    "Review this document",
                description:
                    "Check the uploaded file before making a decision.",
            };

    }

};


/*
============================================================
COMPONENT
============================================================
*/

const StaffDocumentCard = ({
    document,
    onReview,
    reviewing = false,
}) => {

    const [
        showReviewForm,
        setShowReviewForm,
    ] = useState(false);


    const [
        selectedAction,
        setSelectedAction,
    ] = useState("");


    const [
        reviewNote,
        setReviewNote,
    ] = useState("");


    const [
        submitting,
        setSubmitting,
    ] = useState(false);


    const [
        showViewer,
        setShowViewer,
    ] = useState(false);


    const [
        viewerLoading,
        setViewerLoading,
    ] = useState(true);


    /*
    ============================================================
    DOCUMENT GUARD
    ============================================================
    */

    if (!document) {
        return null;
    }


    /*
    ============================================================
    DOCUMENT STATE
    ============================================================
    */

    const documentStatus =
        normalizeStatus(
            document.status ||
            document.reviewStatus
        );


    const documentUrl =
        getDocumentUrl(
            document
        );


    const documentName =
        getDocumentName(
            document
        );


    const documentViewType =
        getDocumentViewType(
            document
        );


    const isFinalStatus =
        FINAL_STATUSES.includes(
            documentStatus
        );


    const isBusy =
        reviewing ||
        submitting;


    const requiresReviewNote =
        selectedAction === "REJECTED" ||
        selectedAction === "REUPLOAD_REQUIRED";


    const statusMessage =
        getStatusMessage(
            documentStatus
        );


    /*
    ============================================================
    OPEN DOCUMENT VIEWER
    ============================================================
    */

    const handleOpenViewer = () => {

        if (
            isBusy ||
            !documentUrl
        ) {
            return;
        }


        setViewerLoading(true);
        setShowViewer(true);

    };


    /*
    ============================================================
    CLOSE DOCUMENT VIEWER
    ============================================================
    */

    const handleCloseViewer = () => {

        if (isBusy) {
            return;
        }

        setShowViewer(false);
        setViewerLoading(true);

    };


    /*
    ============================================================
    ESCAPE KEY
    ============================================================
    */

    useEffect(() => {

        if (!showViewer) {
            return undefined;
        }


        const handleKeyDown = (
            event
        ) => {

            if (
                event.key === "Escape"
            ) {
                handleCloseViewer();
            }

        };


        window.addEventListener(
            "keydown",
            handleKeyDown
        );


        return () => {

            window.removeEventListener(
                "keydown",
                handleKeyDown
            );

        };

    }, [showViewer]);


    /*
    ============================================================
    REVIEW ACTION
    ============================================================
    */

    const handleActionClick = (
        action
    ) => {

        if (
            isBusy ||
            isFinalStatus
        ) {
            return;
        }


        setSelectedAction(
            action
        );

        setShowReviewForm(
            true
        );

    };


    /*
    ============================================================
    EXPAND / COLLAPSE
    ============================================================
    */

    const handleOpenReview = () => {

        if (isBusy) {
            return;
        }


        setShowReviewForm(
            (current) => !current
        );

    };


    /*
    ============================================================
    CANCEL REVIEW
    ============================================================
    */

    const handleCancelReview = () => {

        if (isBusy) {
            return;
        }


        setSelectedAction("");
        setReviewNote("");
        setShowReviewForm(false);

    };


    /*
    ============================================================
    SUBMIT REVIEW
    ============================================================
    */

    const handleSubmitReview = async () => {

        if (
            !selectedAction ||
            !onReview ||
            isBusy ||
            isFinalStatus
        ) {
            return;
        }


        const trimmedNote =
            reviewNote.trim();


        /*
        --------------------------------------------------------
        REJECT + REUPLOAD REQUIRE A REASON
        --------------------------------------------------------
        */

        if (
            requiresReviewNote &&
            !trimmedNote
        ) {
            return;
        }


        try {

            setSubmitting(true);


            await onReview(
                document,
                selectedAction,
                trimmedNote
            );


            setShowReviewForm(
                false
            );

            setSelectedAction(
                ""
            );

            setReviewNote(
                ""
            );

        } finally {

            setSubmitting(false);

        }

    };


    /*
    ============================================================
    RENDER
    ============================================================
    */

    return (
        <article
            className={`staffDocumentCard ${
                isBusy
                    ? "is-reviewing"
                    : ""
            } ${
                isFinalStatus
                    ? "is-final"
                    : ""
            } ${
                documentStatus === "APPROVED"
                    ? "is-approved"
                    : ""
            } ${
                documentStatus === "REJECTED"
                    ? "is-rejected"
                    : ""
            } ${
                documentStatus ===
                "REUPLOAD_REQUIRED"
                    ? "is-reupload-required"
                    : ""
            }`}
        >

            {/* ==================================================
                MAIN DOCUMENT ROW
            ================================================== */}

            <div className="staffDocumentCard__main">

                <div className="staffDocumentCard__icon">
                    <HiOutlineDocument />
                </div>


                <div className="staffDocumentCard__info">

                    <div className="staffDocumentCard__titleRow">

                        <h3>
                            {documentName}
                        </h3>

                    </div>


                    <div className="staffDocumentCard__meta">

                        <span>
                            {getDocumentType(
                                document
                            )}
                        </span>


                        {document.createdAt && (
                            <>
                                <i />

                                <span>
                                    Uploaded{" "}
                                    {formatDate(
                                        document.createdAt
                                    )}
                                </span>
                            </>
                        )}

                    </div>


                    {document.description && (

                        <p className="staffDocumentCard__description">
                            {document.description}
                        </p>

                    )}

                </div>


                <div className="staffDocumentCard__status">

                    <StaffStatusBadge
                        status={
                            documentStatus
                        }
                    />

                </div>


                <div className="staffDocumentCard__actions">

                    {documentUrl && (

                        <button
                            type="button"
                            className="staffDocumentCard__open"
                            onClick={
                                handleOpenViewer
                            }
                            disabled={
                                isBusy
                            }
                            title="View document"
                        >
                            <HiOutlineEye />

                            <span>
                                View
                            </span>
                        </button>

                    )}


                    <button
                        type="button"
                        className="staffDocumentCard__expand"
                        onClick={
                            handleOpenReview
                        }
                        disabled={
                            isBusy
                        }
                        aria-label={
                            showReviewForm
                                ? "Hide document details"
                                : "Show document details"
                        }
                    >

                        {showReviewForm ? (
                            <HiOutlineChevronUp />
                        ) : (
                            <HiOutlineChevronDown />
                        )}

                    </button>

                </div>

            </div>


            {/* ==================================================
                DOCUMENT VIEWER
            ================================================== */}

            {showViewer && documentUrl && (

                <div className="staffDocumentCard__viewer">

                    <div className="staffDocumentCard__viewerHeader">

                        <div className="staffDocumentCard__viewerIdentity">

                            <div className="staffDocumentCard__viewerIcon">
                                <HiOutlineDocument />
                            </div>


                            <div>

                                <span>
                                    Document preview
                                </span>

                                <strong>
                                    {documentName}
                                </strong>

                            </div>

                        </div>


                        <button
                            type="button"
                            className="staffDocumentCard__viewerClose"
                            onClick={
                                handleCloseViewer
                            }
                            disabled={
                                isBusy
                            }
                            aria-label="Close document preview"
                            title="Close preview"
                        >
                            <HiOutlineXCircle />
                        </button>

                    </div>


                    <div className="staffDocumentCard__viewerBody">

                        {viewerLoading && (
                            <div className="staffDocumentCard__viewerLoading">

                                <div className="staffDocumentCard__viewerSpinner" />

                                <span>
                                    Loading document...
                                </span>

                            </div>
                        )}


                        {documentViewType === "pdf" && (

                            <iframe
                                src={documentUrl}
                                title={`${documentName} preview`}
                                className={`staffDocumentCard__viewerFrame ${
                                    viewerLoading
                                        ? "is-loading"
                                        : ""
                                }`}
                                onLoad={() =>
                                    setViewerLoading(
                                        false
                                    )
                                }
                            />

                        )}


                        {documentViewType === "image" && (

                            <div
                                className={`staffDocumentCard__imageViewer ${
                                    viewerLoading
                                        ? "is-loading"
                                        : ""
                                }`}
                            >

                                <img
                                    src={documentUrl}
                                    alt={`${documentName} preview`}
                                    onLoad={() =>
                                        setViewerLoading(
                                            false
                                        )
                                    }
                                    onError={() =>
                                        setViewerLoading(
                                            false
                                        )
                                    }
                                />

                            </div>

                        )}


                        {documentViewType === "unsupported" && (

                            <div className="staffDocumentCard__unsupported">

                                <div className="staffDocumentCard__unsupportedIcon">
                                    <HiOutlineDocument />
                                </div>


                                <strong>
                                    Preview unavailable
                                </strong>


                                <p>
                                    This document format cannot
                                    be previewed directly in
                                    the workspace yet.
                                </p>


                                <span>
                                    A controlled preview for this
                                    file type can be added later.
                                </span>

                            </div>

                        )}

                    </div>

                </div>

            )}


            {/* ==================================================
                DOCUMENT REVIEW / STATUS AREA
            ================================================== */}

            {showReviewForm && (

                <div className="staffDocumentCard__review">

                    {/* ==================================================
                        CURRENT DOCUMENT STATUS
                    ================================================== */}

                    {!selectedAction && (

                        <div
                            className={`staffDocumentCard__statusMessage ${
                                isFinalStatus
                                    ? "is-locked"
                                    : ""
                            }`}
                        >

                            <div className="staffDocumentCard__reviewHeader">

                                <div>

                                    <span>
                                        {statusMessage.eyebrow}
                                    </span>

                                    <strong>
                                        {statusMessage.title}
                                    </strong>

                                </div>


                                {isFinalStatus ? (
                                    <HiOutlineLockClosed />
                                ) : (
                                    <HiOutlineExclamationCircle />
                                )}

                            </div>


                            <p>
                                {statusMessage.description}
                            </p>


                            {isFinalStatus && (

                                <div className="staffDocumentCard__lockedNotice">

                                    <HiOutlineLockClosed />

                                    <span>
                                        Final decision locked for Staff
                                    </span>

                                </div>

                            )}

                        </div>

                    )}


                    {/* ==================================================
                        REVIEW ACTIONS
                    ================================================== */}

                    {!isFinalStatus && (

                        <div className="staffDocumentCard__reviewActions">

                            {Object.entries(
                                REVIEW_ACTIONS
                            ).map(
                                ([
                                    value,
                                    action,
                                ]) => {

                                    const Icon =
                                        action.icon;


                                    const isSelected =
                                        selectedAction ===
                                        value;


                                    return (
                                        <button
                                            key={
                                                value
                                            }
                                            type="button"
                                            className={`staffDocumentCard__reviewButton ${
                                                isSelected
                                                    ? "is-selected"
                                                    : ""
                                            } ${
                                                value ===
                                                "REJECTED"
                                                    ? "is-danger"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                handleActionClick(
                                                    value
                                                )
                                            }
                                            disabled={
                                                isBusy
                                            }
                                        >

                                            <Icon />

                                            <span>
                                                {
                                                    action.label
                                                }
                                            </span>

                                        </button>
                                    );

                                }
                            )}

                        </div>

                    )}


                    {/* ==================================================
                        REVIEW FORM
                    ================================================== */}

                    {selectedAction &&
                        !isFinalStatus && (

                            <div className="staffDocumentCard__reviewForm">

                                <div className="staffDocumentCard__reviewFormHeading">

                                    <div>

                                        <span>
                                            {selectedAction ===
                                            "APPROVED"
                                                ? "Approve document"
                                                : selectedAction ===
                                                  "REJECTED"
                                                    ? "Reject document"
                                                    : "Request re-upload"}
                                        </span>


                                        <strong>
                                            {selectedAction ===
                                            "APPROVED"
                                                ? "Confirm this document is acceptable."
                                                : selectedAction ===
                                                  "REJECTED"
                                                    ? "Explain why this document cannot be accepted."
                                                    : "Tell the client what needs to be corrected."}
                                        </strong>

                                    </div>

                                </div>


                                <label
                                    htmlFor={`document-review-${document._id || document.id}`}
                                >

                                    Review note

                                    <span
                                        className={
                                            requiresReviewNote
                                                ? "is-required"
                                                : ""
                                        }
                                    >
                                        {requiresReviewNote
                                            ? "Required"
                                            : "Optional"}
                                    </span>

                                </label>


                                <textarea
                                    id={`document-review-${document._id || document.id}`}
                                    value={
                                        reviewNote
                                    }
                                    maxLength={500}
                                    rows={4}
                                    onChange={(
                                        event
                                    ) =>
                                        setReviewNote(
                                            event.target.value
                                        )
                                    }
                                    placeholder={
                                        selectedAction ===
                                        "APPROVED"
                                            ? "Add an optional approval note..."
                                            : selectedAction ===
                                              "REJECTED"
                                                ? "Explain why this document was rejected..."
                                                : "Explain what the client needs to re-upload..."
                                    }
                                    disabled={
                                        isBusy
                                    }
                                    aria-required={
                                        requiresReviewNote
                                    }
                                />


                                <div className="staffDocumentCard__reviewFooter">

                                    <div className="staffDocumentCard__reviewHint">

                                        <small>
                                            {reviewNote.length}
                                            /500
                                        </small>


                                        {requiresReviewNote &&
                                            !reviewNote.trim() && (

                                                <span>
                                                    A reason is required.
                                                </span>

                                            )}

                                    </div>


                                    <div className="staffDocumentCard__reviewFooterActions">

                                        <button
                                            type="button"
                                            className="staffDocumentCard__cancel"
                                            onClick={
                                                handleCancelReview
                                            }
                                            disabled={
                                                isBusy
                                            }
                                        >
                                            Cancel
                                        </button>


                                        <button
                                            type="button"
                                            className={`staffDocumentCard__confirm ${
                                                selectedAction ===
                                                "REJECTED"
                                                    ? "is-danger"
                                                    : ""
                                            }`}
                                            onClick={
                                                handleSubmitReview
                                            }
                                            disabled={
                                                isBusy ||
                                                (
                                                    requiresReviewNote &&
                                                    !reviewNote.trim()
                                                )
                                            }
                                        >

                                            {isBusy
                                                ? "Saving..."
                                                : selectedAction ===
                                                  "APPROVED"
                                                    ? "Confirm Approval"
                                                    : selectedAction ===
                                                      "REJECTED"
                                                        ? "Confirm Rejection"
                                                        : "Request Re-upload"}

                                        </button>

                                    </div>

                                </div>

                            </div>

                        )}

                </div>

            )}

        </article>
    );
};


export default StaffDocumentCard;