import {
    useEffect,
    useState,
} from "react";

import {
    createPortal,
} from "react-dom";

import {
    HiOutlineArrowLeft,
    HiOutlineDocumentText,
    HiOutlineDownload,
    HiOutlineExclamationCircle,
    HiOutlineCheck,
    HiOutlineX,
} from "react-icons/hi";

import adminDocumentService
    from "../../admin.document.service";

import "./AdminDocumentViewer.css";


/*
============================================================
FORMAT FILE SIZE
============================================================
*/

const formatFileSize = (
    bytes,
) => {

    if (
        !bytes ||
        bytes <= 0
    ) {
        return "";
    }


    if (
        bytes < 1024
    ) {
        return `${bytes} B`;
    }


    if (
        bytes <
        1024 * 1024
    ) {
        return `${(
            bytes / 1024
        ).toFixed(1)} KB`;
    }


    return `${(
        bytes /
        (1024 * 1024)
    ).toFixed(1)} MB`;

};


/*
============================================================
FORMAT LABEL
============================================================
*/

const formatLabel = (
    value,
) => {

    if (!value) {
        return "—";
    }


    return value
        .toString()
        .replaceAll(
            "_",
            " ",
        )
        .toLowerCase()
        .replace(
            /\b\w/g,
            (letter) =>
                letter.toUpperCase(),
        );

};


/*
============================================================
STATUS CLASS
============================================================
*/

const getStatusClass = (
    status,
) => {

    switch (status) {

        case "APPROVED":
            return "approved";

        case "REJECTED":
            return "rejected";

        case "UNDER_REVIEW":
            return "review";

        case "REUPLOAD_REQUIRED":
            return "reupload";

        case "UPLOADED":
            return "uploaded";

        default:
            return "default";

    }

};


/*
============================================================
FORMAT DATE
============================================================
*/

const formatDate = (
    date,
) => {

    if (!date) {
        return "—";
    }


    const parsedDate =
        new Date(date);


    if (
        Number.isNaN(
            parsedDate.getTime(),
        )
    ) {
        return "—";
    }


    return new Intl.DateTimeFormat(
        "en-GB",
        {
            day: "numeric",
            month: "short",
            year: "numeric",
        },
    ).format(
        parsedDate,
    );

};


/*
============================================================
ADMIN DOCUMENT VIEWER
============================================================
|
| Full-screen admin document review overlay.
|
| IMPORTANT:
|
| The incoming prop is called "document".
|
| We rename it to "documentData" so the browser's global
| document object remains available for:
|
| - document.body
| - document.addEventListener()
| - document.removeEventListener()
|
============================================================
*/

const AdminDocumentViewer = ({
    document: documentData,
    onClose,
    onUpdated,
}) => {


    /*
    ============================================================
    LOCAL DOCUMENT
    ============================================================
    */

    const [
        currentDocument,
        setCurrentDocument,
    ] = useState(
        documentData || null,
    );


    /*
    ============================================================
    REVIEW NOTE
    ============================================================
    */

    const [
        reviewNote,
        setReviewNote,
    ] = useState(
        documentData?.reviewNote || "",
    );


    /*
    ============================================================
    SAVING
    ============================================================
    */

    const [
        saving,
        setSaving,
    ] = useState(false);


    /*
    ============================================================
    ERROR
    ============================================================
    */

    const [
        error,
        setError,
    ] = useState("");


    /*
    ============================================================
    SYNC DOCUMENT
    ============================================================
    */

    useEffect(() => {

        setCurrentDocument(
            documentData || null,
        );


        setReviewNote(
            documentData?.reviewNote || "",
        );


        setError("");

    }, [
        documentData,
    ]);


    /*
    ============================================================
    ESCAPE KEY
    ============================================================
    */

    useEffect(() => {

        const handleKeyDown = (
            event,
        ) => {

            if (
                event.key === "Escape"
            ) {

                onClose?.();

            }

        };


        document.addEventListener(
            "keydown",
            handleKeyDown,
        );


        return () => {

            document.removeEventListener(
                "keydown",
                handleKeyDown,
            );

        };

    }, [
        onClose,
    ]);


    /*
    ============================================================
    LOCK BODY SCROLL
    ============================================================
    */

    useEffect(() => {

        const previousOverflow =
            document.body.style.overflow;


        document.body.style.overflow =
            "hidden";


        return () => {

            document.body.style.overflow =
                previousOverflow;

        };

    }, []);


    /*
    ============================================================
    NO DOCUMENT
    ============================================================
    */

    if (!currentDocument) {

        return createPortal(

            <div
                className="adminDocumentViewer__overlay"
                onMouseDown={(event) => {

                    if (
                        event.target ===
                        event.currentTarget
                    ) {

                        onClose?.();

                    }

                }}
            >

                <div className="adminDocumentViewer__state">

                    <div className="adminDocumentViewer__errorIcon">

                        <HiOutlineExclamationCircle />

                    </div>


                    <span className="adminDocumentViewer__eyebrow">
                        DOCUMENT
                    </span>


                    <h2>
                        Document unavailable
                    </h2>


                    <p>
                        No document was selected for review.
                    </p>


                    <button
                        type="button"
                        className="adminDocumentViewer__back"
                        onClick={
                            onClose
                        }
                    >

                        <HiOutlineArrowLeft />

                        <span>
                            Back
                        </span>

                    </button>

                </div>

            </div>,

            document.body,
        );

    }


    /*
    ============================================================
    DOCUMENT INFORMATION
    ============================================================
    */

    const fileName =
        currentDocument?.originalFileName ||
        currentDocument?.name ||
        "Document";


    const documentName =
        currentDocument?.name ||
        "Application document";


    const mimeType =
        currentDocument?.mimeType ||
        "";


    const isPdf =
        mimeType ===
        "application/pdf";


    const isImage =
        mimeType.startsWith(
            "image/",
        );


    const fileSize =
        formatFileSize(
            currentDocument?.fileSize,
        );


    const status =
        currentDocument?.status ||
        "UPLOADED";


    /*
    ============================================================
    UPDATE DOCUMENT STATUS
    ============================================================
    |
    | Uses the ADMIN DOCUMENT SERVICE.
    |
    | NOT the application service.
    |
    ============================================================
    */

    const handleStatusUpdate = async (
        nextStatus,
    ) => {

        if (
            !currentDocument?._id
        ) {

            setError(
                "Document ID is missing.",
            );

            return;

        }


        /*
        --------------------------------------------------------
        DO NOTHING IF STATUS IS ALREADY THE SAME
        --------------------------------------------------------
        */

        if (
            nextStatus ===
            currentDocument?.status
        ) {

            return;

        }


        try {

            setSaving(true);

            setError("");


            /*
            ----------------------------------------------------
            UPDATE THROUGH ADMIN DOCUMENT SERVICE
            ----------------------------------------------------
            */

            const response =
                await adminDocumentService
                    .updateDocumentStatus(
                        currentDocument._id,
                        nextStatus,
                        reviewNote,
                    );


            /*
            ----------------------------------------------------
            NORMALIZE RESPONSE
            ----------------------------------------------------
            |
            | Backend:
            |
            | {
            |   success: true,
            |   message: "...",
            |   data: document
            | | }
            |
            ----------------------------------------------------
            */

            const updatedDocument =
                response?.data ||
                response;


            /*
            ----------------------------------------------------
            SAFETY CHECK
            ----------------------------------------------------
            */

            if (
                !updatedDocument ||
                typeof updatedDocument !== "object"
            ) {

                throw new Error(
                    "The server returned an invalid document response.",
                );

            }


            /*
            ----------------------------------------------------
            UPDATE VIEWER
            ----------------------------------------------------
            */

            setCurrentDocument(
                updatedDocument,
            );


            /*
            ----------------------------------------------------
            UPDATE REVIEW NOTE
            ----------------------------------------------------
            */

            setReviewNote(
                updatedDocument?.reviewNote ||
                reviewNote ||
                "",
            );


            /*
            ----------------------------------------------------
            UPDATE PARENT TABLE
            ----------------------------------------------------
            */

            if (
                onUpdated
            ) {

                onUpdated(
                    updatedDocument,
                );

            }

        } catch (
        requestError
        ) {

            console.error(
                "FAILED TO UPDATE DOCUMENT STATUS:",
                requestError,
            );


            setError(
                requestError
                    ?.response
                    ?.data
                    ?.message ||
                requestError?.message ||
                "Unable to update document status.",
            );

        } finally {

            setSaving(false);

        }

    };


    /*
    ============================================================
    CLOSE WHEN CLICKING BACKDROP
    ============================================================
    */

    const handleBackdropClick = (
        event,
    ) => {

        if (
            event.target ===
            event.currentTarget
        ) {

            onClose?.();

        }

    };


    /*
    ============================================================
    VIEWER
    ============================================================
    */

    const viewer = (

        <div
            className="adminDocumentViewer__overlay"
            onMouseDown={
                handleBackdropClick
            }
        >

            <div className="adminDocumentViewer">


                {/* ==================================================
                    HEADER
                ================================================== */}

                <header className="adminDocumentViewer__header">

                    <div className="adminDocumentViewer__headerInner">


                        {/* ==========================================
                            CLOSE
                        ========================================== */}

                        <button
                            type="button"
                            className="adminDocumentViewer__close"
                            onClick={
                                onClose
                            }
                            aria-label="Close document viewer"
                        >

                            <HiOutlineX />

                        </button>


                        {/* ==========================================
                            DOCUMENT TITLE
                        ========================================== */}

                        <div className="adminDocumentViewer__title">

                            <div className="adminDocumentViewer__titleIcon">

                                <HiOutlineDocumentText />

                            </div>


                            <div>

                                <strong>
                                    {fileName}
                                </strong>


                                <span>

                                    {documentName}

                                    {fileSize &&
                                        ` • ${fileSize}`}

                                </span>

                            </div>

                        </div>


                        {/* ==========================================
                            DOWNLOAD
                        ========================================== */}

                        {currentDocument?.fileUrl && (

                            <a
                                href={
                                    currentDocument.fileUrl
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="adminDocumentViewer__download"
                                download
                            >

                                <HiOutlineDownload />

                                <span>
                                    Download
                                </span>

                            </a>

                        )}

                    </div>

                </header>


                {/* ==================================================
                    MAIN BODY
                ================================================== */}

                <div className="adminDocumentViewer__body">


                    {/* ==================================================
                        DOCUMENT AREA
                    ================================================== */}

                    <section className="adminDocumentViewer__documentArea">

                        <div className="adminDocumentViewer__frame">


                            {/* ==========================================
                                PDF
                            ========================================== */}

                            {isPdf &&
                                currentDocument?.fileUrl && (

                                    <iframe
                                        src={
                                            currentDocument.fileUrl
                                        }
                                        title={
                                            fileName
                                        }
                                        className="adminDocumentViewer__pdf"
                                    />

                                )}


                            {/* ==========================================
                                IMAGE
                            ========================================== */}

                            {isImage &&
                                currentDocument?.fileUrl && (

                                    <div className="adminDocumentViewer__imageWrapper">

                                        <img
                                            src={
                                                currentDocument.fileUrl
                                            }
                                            alt={
                                                fileName
                                            }
                                            className="adminDocumentViewer__image"
                                        />

                                    </div>

                                )}


                            {/* ==========================================
                                UNSUPPORTED FILE
                            ========================================== */}

                            {!isPdf &&
                                !isImage && (

                                    <div className="adminDocumentViewer__unsupported">

                                        <HiOutlineDocumentText />


                                        <h2>
                                            Preview unavailable
                                        </h2>


                                        <p>
                                            This document type cannot
                                            be previewed directly.
                                        </p>


                                        {currentDocument?.fileUrl && (

                                            <a
                                                href={
                                                    currentDocument.fileUrl
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="adminDocumentViewer__download"
                                            >

                                                <HiOutlineDownload />

                                                Download document

                                            </a>

                                        )}

                                    </div>

                                )}

                        </div>

                    </section>


                    {/* ==================================================
                        REVIEW PANEL
                    ================================================== */}

                    <aside className="adminDocumentViewer__review">


                        {/* ==========================================
                            REVIEW HEADER
                        ========================================== */}

                        <div className="adminDocumentViewer__reviewHeader">

                            <div>

                                <span className="adminDocumentViewer__reviewEyebrow">
                                    DOCUMENT REVIEW
                                </span>


                                <h2>
                                    Review this document
                                </h2>

                            </div>


                            <span
                                className={
                                    `adminDocumentViewer__status adminDocumentViewer__status--${getStatusClass(
                                        status,
                                    )}`
                                }
                            >

                                <i />

                                {formatLabel(
                                    status,
                                )}

                            </span>

                        </div>


                        {/* ==========================================
                            DOCUMENT DETAILS
                        ========================================== */}

                        <div className="adminDocumentViewer__details">

                            <div className="adminDocumentViewer__detail">

                                <span>
                                    Document
                                </span>

                                <strong>
                                    {documentName}
                                </strong>

                            </div>


                            <div className="adminDocumentViewer__detail">

                                <span>
                                    File
                                </span>

                                <strong>
                                    {fileName}
                                </strong>

                            </div>


                            <div className="adminDocumentViewer__detail">

                                <span>
                                    Type
                                </span>

                                <strong>
                                    {formatLabel(
                                        currentDocument?.type,
                                    )}
                                </strong>

                            </div>


                            <div className="adminDocumentViewer__detail">

                                <span>
                                    Uploaded
                                </span>

                                <strong>
                                    {formatDate(
                                        currentDocument?.createdAt,
                                    )}
                                </strong>

                            </div>

                        </div>


                        {/* ==========================================
                            REVIEW NOTE
                        ========================================== */}

                        <div className="adminDocumentViewer__field">

                            <label
                                htmlFor="document-review-note"
                            >
                                Review Note
                            </label>


                            <textarea
                                id="document-review-note"
                                value={
                                    reviewNote
                                }
                                onChange={(event) =>
                                    setReviewNote(
                                        event.target.value,
                                    )
                                }
                                placeholder="Add a note about this document..."
                                rows={4}
                                disabled={
                                    saving
                                }
                            />

                        </div>


                        {/* ==========================================
                            ERROR
                        ========================================== */}

                        {error && (

                            <div className="adminDocumentViewer__error">

                                <HiOutlineExclamationCircle />

                                <span>
                                    {error}
                                </span>

                            </div>

                        )}


                        {/* ==========================================
                            REVIEW ACTIONS
                        ========================================== */}

                        <div className="adminDocumentViewer__actions">


                            {/* ======================================
                                REJECT
                            ====================================== */}

                            <button
                                type="button"
                                className="adminDocumentViewer__action adminDocumentViewer__action--reject"
                                onClick={() =>
                                    handleStatusUpdate(
                                        "REJECTED",
                                    )
                                }
                                disabled={
                                    saving
                                }
                            >

                                <HiOutlineX />

                                <span>
                                    Reject
                                </span>

                            </button>


                            {/* ======================================
                                UNDER REVIEW
                            ====================================== */}

                            <button
                                type="button"
                                className="adminDocumentViewer__action adminDocumentViewer__action--review"
                                onClick={() =>
                                    handleStatusUpdate(
                                        "UNDER_REVIEW",
                                    )
                                }
                                disabled={
                                    saving
                                }
                            >

                                <HiOutlineDocumentText />

                                <span>
                                    Under Review
                                </span>

                            </button>


                            {/* ======================================
                                APPROVE
                            ====================================== */}

                            <button
                                type="button"
                                className="adminDocumentViewer__action adminDocumentViewer__action--approve"
                                onClick={() =>
                                    handleStatusUpdate(
                                        "APPROVED",
                                    )
                                }
                                disabled={
                                    saving
                                }
                            >

                                <HiOutlineCheck />

                                <span>
                                    {saving
                                        ? "Updating..."
                                        : "Approve"}
                                </span>

                            </button>

                        </div>

                    </aside>

                </div>

            </div>

        </div>

    );


    /*
    ============================================================
    RENDER THROUGH PORTAL
    ============================================================
    */

    return createPortal(
        viewer,
        document.body,
    );

};


export default AdminDocumentViewer;