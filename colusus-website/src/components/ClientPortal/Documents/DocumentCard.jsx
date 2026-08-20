import {
    HiOutlineCheckCircle,
    HiOutlineClock,
    HiOutlineDocumentText,
    HiOutlineExclamationCircle,
    HiOutlineEye,
    HiOutlineLocationMarker,
    HiOutlineUpload,
} from "react-icons/hi";

import "./DocumentCard.css";


/*
============================================================
FORMAT DOCUMENT TYPE
============================================================
*/

const formatDocumentType = (type) => {

    if (!type) {
        return "Document";
    }

    return type
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(/\b\w/g, (letter) =>
            letter.toUpperCase()
        );

};


/*
============================================================
FORMAT DATE
============================================================
*/

const formatDate = (date) => {

    if (!date) {
        return "";
    }

    return new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(new Date(date));

};


/*
============================================================
FORMAT FILE SIZE
============================================================
*/

const formatFileSize = (bytes) => {

    if (!bytes) {
        return "";
    }

    if (bytes < 1024) {
        return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

};


/*
============================================================
STATUS CONFIGURATION
============================================================
*/

const statusConfig = {

    UPLOADED: {
        label: "Uploaded",
        className: "status-uploaded",
    },

    UNDER_REVIEW: {
        label: "Under Review",
        className: "status-review",
    },

    APPROVED: {
        label: "Approved",
        className: "status-approved",
    },

    REJECTED: {
        label: "Rejected",
        className: "status-rejected",
    },

    REUPLOAD_REQUIRED: {
        label: "Re-upload Required",
        className: "status-reupload",
    },

};


/*
============================================================
DOCUMENT STATUS ICON
============================================================
*/

const DocumentStatusIcon = ({ status }) => {

    if (status === "APPROVED") {

        return (
            <div
                className="document-status-icon document-status-approved"
                aria-hidden="true"
            >
                <HiOutlineCheckCircle />
            </div>
        );

    }


    if (status === "UNDER_REVIEW") {

        return (
            <div
                className="document-status-icon document-status-review"
                aria-hidden="true"
            >
                <HiOutlineClock />
            </div>
        );

    }


    if (
        status === "REJECTED" ||
        status === "REUPLOAD_REQUIRED"
    ) {

        return (
            <div
                className="document-status-icon document-status-required"
                aria-hidden="true"
            >
                <HiOutlineExclamationCircle />
            </div>
        );

    }


    return (
        <div
            className="document-status-icon document-status-uploaded"
            aria-hidden="true"
        >
            <HiOutlineDocumentText />
        </div>
    );

};


/*
============================================================
DOCUMENT CARD
============================================================
*/

const DocumentCard = ({
    document,
    onReupload,
}) => {

    const status =
        document?.status?.toUpperCase() ||
        "UPLOADED";


    const config =
        statusConfig[status] ||
        statusConfig.UPLOADED;


    return (

        <article
            className={`document-row ${config.className}`}
        >

            {/* =================================================
                DOCUMENT ICON
            ================================================= */}

            <DocumentStatusIcon
                status={status}
            />


            {/* =================================================
                DOCUMENT INFORMATION
            ================================================= */}

            <div className="document-row-content">

                <h3>
                    {document?.name || "Untitled Document"}
                </h3>


                <div className="document-row-meta">

                    <span>
                        {formatDocumentType(
                            document?.type
                        )}
                    </span>


                    {document?.application?.destinationCountry && (

                        <>

                            <span aria-hidden="true">
                                •
                            </span>


                            <span className="document-location">

                                <HiOutlineLocationMarker />

                                {
                                    document.application
                                        .destinationCountry
                                }

                            </span>

                        </>

                    )}


                    {document?.createdAt && (

                        <>

                            <span aria-hidden="true">
                                •
                            </span>


                            <span>
                                Uploaded{" "}
                                {formatDate(
                                    document.createdAt
                                )}
                            </span>

                        </>

                    )}


                    {document?.fileSize > 0 && (

                        <>

                            <span aria-hidden="true">
                                •
                            </span>


                            <span>
                                {formatFileSize(
                                    document.fileSize
                                )}
                            </span>

                        </>

                    )}

                </div>


                {/* =================================================
                    REVIEW NOTE
                ================================================= */}

                {document?.reviewNote && (

                    <div className="document-review-note">

                        {document.reviewNote}

                    </div>

                )}

            </div>


            {/* =================================================
                DOCUMENT ACTIONS
            ================================================= */}

            <div className="document-row-actions">


                {/* STATUS */}

                <span
                    className={`document-status-badge ${config.className}`}
                >

                    {config.label}

                </span>


                {/* VIEW */}

                {document?.fileUrl && (

                    <a
                        href={document.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="document-view-button"
                        aria-label={`View ${document.name || "document"}`}
                        title="View document"
                    >

                        <HiOutlineEye />

                    </a>

                )}


                {/* RE-UPLOAD */}

                {status === "REUPLOAD_REQUIRED" && (

                    <button
                        type="button"
                        className="document-upload-small"
                        onClick={() =>
                            onReupload?.(document)
                        }
                    >

                        <HiOutlineUpload />

                        <span>
                            Re-upload
                        </span>

                    </button>

                )}

            </div>

        </article>

    );

};


export default DocumentCard;