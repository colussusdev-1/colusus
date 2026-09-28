import React, {
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import {
    HiOutlineDocumentText,
    HiOutlineSearch,
    HiOutlineRefresh,
    HiOutlineUser,
    HiOutlineGlobeAlt,
    HiOutlineEye,
    HiOutlineDownload,
    HiOutlineX,
    HiOutlineCheck,
    HiOutlineExclamation,
} from "react-icons/hi";

import documentsService from "./documents.service";

import "./AdminDocuments.css";

/*
============================================================
STATUS CONFIG
============================================================
*/

const STATUS_OPTIONS = [
    "ALL",
    "PENDING",
    "APPROVED",
    "REJECTED",
    "REUPLOAD_REQUIRED",
];

const REVIEW_STATUS_OPTIONS = [
    "APPROVED",
    "REJECTED",
    "REUPLOAD_REQUIRED",
];

/*
============================================================
FORMAT LABEL
============================================================
*/

const formatLabel = (value) => {
    if (!value) {
        return "—";
    }

    return String(value)
        .replace(/[_-]+/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

/*
============================================================
FORMAT DATE
============================================================
*/

const formatDate = (value) => {
    if (!value) {
        return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(date);
};

/*
============================================================
FORMAT DATE + TIME
============================================================
*/

const formatDateTime = (value) => {
    if (!value) {
        return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
};

/*
============================================================
GET DOCUMENT NAME
============================================================
*/

const getDocumentName = (document) => {
    return (
        document?.originalFileName ||
        document?.name ||
        document?.documentName ||
        document?.type ||
        "Untitled document"
    );
};

/*
============================================================
GET DOCUMENT TYPE
============================================================
*/

const getDocumentType = (document) => {
    return (
        document?.type ||
        document?.documentType ||
        "OTHER"
    );
};

/*
============================================================
GET CLIENT NAME
============================================================
*/

const getClientName = (document) => {
    return (
        document?.user?.name ||
        "Unknown client"
    );
};

/*
============================================================
GET APPLICATION
============================================================
*/

const getApplication = (document) => {
    return document?.application;
};

/*
============================================================
GET APPLICATION LABEL
============================================================
*/

const getApplicationLabel = (document) => {
    const application = getApplication(document);

    if (!application) {
        return "—";
    }

    return (
        application?.applicationReference ||
        application?.reference ||
        application?.type ||
        application?.destinationCountry ||
        "Application"
    );
};

/*
============================================================
GET COUNTRY
============================================================
*/

const getCountry = (document) => {
    const application = getApplication(document);

    return (
        application?.destinationCountry ||
        "—"
    );
};

/*
============================================================
STATUS NORMALIZATION
============================================================
*/

const normalizeStatus = (value) => {
    return String(value || "")
        .trim()
        .toUpperCase()
        .replace(/\s+/g, "_");
};

/*
============================================================
STATUS CLASS
============================================================
*/

const getStatusClass = (status) => {
    const normalized = normalizeStatus(status);

    switch (normalized) {
        case "APPROVED":
            return "approved";

        case "REJECTED":
            return "rejected";

        case "REUPLOAD_REQUIRED":
            return "reupload";

        case "PENDING":
        case "UNDER_REVIEW":
        case "PROCESSING":
            return "pending";

        default:
            return "default";
    }
};

/*
============================================================
FILE TYPE HELPERS
============================================================
*/

const getFileExtension = (document) => {
    const fileName =
        document?.originalFileName ||
        document?.name ||
        document?.documentName ||
        document?.fileName ||
        "";

    const normalizedFileName =
        String(fileName)
            .toLowerCase()
            .split("?")[0]
            .split("#")[0];

    if (!normalizedFileName.includes(".")) {
        return "";
    }

    return normalizedFileName
        .split(".")
        .pop();
};

/*
============================================================
GET PREVIEW MIME TYPE
============================================================

We do not blindly trust Cloudinary's content-type.

For raw uploads, Cloudinary can sometimes return:

application/octet-stream

even when the actual file is a PDF/image.

The document filename is therefore used as the primary
source of truth.
============================================================
*/

const getPreviewMimeType = (document, blob) => {
    const extension = getFileExtension(document);

    const mimeMap = {
        pdf: "application/pdf",

        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        png: "image/png",
        webp: "image/webp",
        gif: "image/gif",
    };

    if (mimeMap[extension]) {
        return mimeMap[extension];
    }

    if (blob?.type) {
        return blob.type;
    }

    return "application/octet-stream";
};

/*
============================================================
PDF DETECTION
============================================================
*/

const isPdfDocument = (document) => {
    const extension = getFileExtension(document);

    const mimeType = String(
        document?.mimeType ||
        document?.fileType ||
        document?.contentType ||
        "",
    ).toLowerCase();

    return (
        extension === "pdf" ||
        mimeType.includes("pdf")
    );
};

/*
============================================================
IMAGE DETECTION
============================================================
*/

const isImageDocument = (document) => {
    const extension = getFileExtension(document);

    const mimeType = String(
        document?.mimeType ||
        document?.fileType ||
        document?.contentType ||
        "",
    ).toLowerCase();

    return (
        [
            "jpg",
            "jpeg",
            "png",
            "webp",
            "gif",
        ].includes(extension) ||
        mimeType.startsWith("image/")
    );
};

/*
============================================================
COMPONENT
============================================================
*/

const AdminDocuments = () => {
    const [documents, setDocuments] = useState([]);

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] =
        useState("ALL");

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [refreshing, setRefreshing] =
        useState(false);

    /*
    ========================================================
    DOCUMENT VIEWER
    ========================================================
    */

    const [selectedDocument, setSelectedDocument] =
        useState(null);

    const [previewUrl, setPreviewUrl] =
        useState("");

    const [previewLoading, setPreviewLoading] =
        useState(false);

    const [previewError, setPreviewError] =
        useState("");

    /*
    ========================================================
    REVIEW
    ========================================================
    */

    const [reviewStatus, setReviewStatus] =
        useState("APPROVED");

    const [reviewNote, setReviewNote] =
        useState("");

    const [reviewing, setReviewing] =
        useState(false);

    const [reviewError, setReviewError] =
        useState("");

    /*
    ========================================================
    PREVIEW REQUEST TRACKER
    ========================================================

    Prevents an older preview request from replacing the
    preview belonging to a newer document.
    ========================================================
    */

    const previewRequestRef = useRef(0);

    /*
    ========================================================
    PREVIEW URL REF
    ========================================================
    */

    const previewUrlRef = useRef("");

    /*
    ========================================================
    STORE PREVIEW URL
    ========================================================
    */

    const replacePreviewUrl = (nextUrl) => {
        if (previewUrlRef.current) {
            URL.revokeObjectURL(
                previewUrlRef.current,
            );
        }

        previewUrlRef.current =
            nextUrl || "";

        setPreviewUrl(
            nextUrl || "",
        );
    };

    /*
    ========================================================
    LOAD DOCUMENTS
    ========================================================
    */

    const loadDocuments = async (
        isRefresh = false,
    ) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            const result =
                await documentsService.getAllDocuments();

            setDocuments(
                Array.isArray(result)
                    ? result
                    : [],
            );
        } catch (requestError) {
            console.error(
                "FAILED TO LOAD DOCUMENTS:",
                requestError,
            );

            setError(
                requestError?.response?.data
                    ?.message ||
                "Unable to load documents.",
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    /*
    ========================================================
    INITIAL LOAD
    ========================================================
    */

    useEffect(() => {
        loadDocuments();
    }, []);

    /*
    ========================================================
    FILTER DOCUMENTS
    ========================================================
    */

    const filteredDocuments = useMemo(() => {
        const normalizedSearch =
            search.trim().toLowerCase();

        return documents.filter((document) => {
            const status =
                normalizeStatus(
                    document?.status,
                );

            const matchesStatus =
                statusFilter === "ALL" ||
                status === statusFilter;

            if (!matchesStatus) {
                return false;
            }

            if (!normalizedSearch) {
                return true;
            }

            const searchableText = [
                getDocumentName(document),
                getDocumentType(document),
                getClientName(document),
                document?.user?.email,
                getApplicationLabel(document),
                getCountry(document),
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return searchableText.includes(
                normalizedSearch,
            );
        });
    }, [
        documents,
        search,
        statusFilter,
    ]);

    /*
    ========================================================
    SUMMARY COUNTS
    ========================================================
    */

    const summary = useMemo(() => {
        return {
            total: documents.length,

            pending: documents.filter(
                (document) =>
                    [
                        "PENDING",
                        "UNDER_REVIEW",
                    ].includes(
                        normalizeStatus(
                            document?.status,
                        ),
                    ),
            ).length,

            approved: documents.filter(
                (document) =>
                    normalizeStatus(
                        document?.status,
                    ) === "APPROVED",
            ).length,

            rejected: documents.filter(
                (document) =>
                    [
                        "REJECTED",
                        "REUPLOAD_REQUIRED",
                    ].includes(
                        normalizeStatus(
                            document?.status,
                        ),
                    ),
            ).length,
        };
    }, [documents]);

    /*
    ========================================================
    OPEN DOCUMENT
    ========================================================
    */

    const openDocument = async (document) => {
        if (!document?._id) {
            return;
        }

        /*
        ----------------------------------------------------
        NEW REQUEST ID
        ----------------------------------------------------
        */

        const requestId =
            ++previewRequestRef.current;

        /*
        ----------------------------------------------------
        CLEAR PREVIOUS PREVIEW
        ----------------------------------------------------
        */

        replacePreviewUrl("");

        setSelectedDocument(document);

        setPreviewError("");

        setReviewError("");

        setReviewNote(
            document?.reviewNote ||
            document?.reviewNotes ||
            "",
        );

        const currentStatus =
            normalizeStatus(
                document?.status,
            );

        setReviewStatus(
            currentStatus === "REJECTED"
                ? "REJECTED"
                : currentStatus ===
                    "REUPLOAD_REQUIRED"
                    ? "REUPLOAD_REQUIRED"
                    : "APPROVED",
        );

        setPreviewLoading(true);

        try {
            /*
            ------------------------------------------------
            REQUEST AUTHENTICATED BLOB
            ------------------------------------------------
            */

            const blob =
                await documentsService.getDocumentPreview(
                    document._id,
                );

            /*
            ------------------------------------------------
            MAKE SURE THIS REQUEST IS STILL CURRENT
            ------------------------------------------------
            */

            if (
                requestId !==
                previewRequestRef.current
            ) {
                return;
            }

            if (!(blob instanceof Blob)) {
                throw new Error(
                    "The document preview response is not a valid file.",
                );
            }

            if (blob.size === 0) {
                throw new Error(
                    "The document preview is empty.",
                );
            }

            /*
            ------------------------------------------------
            DETERMINE CORRECT MIME TYPE
            ------------------------------------------------
            */

            const mimeType =
                getPreviewMimeType(
                    document,
                    blob,
                );

            /*
            ------------------------------------------------
            NORMALIZE BLOB
            ------------------------------------------------

            This is particularly important for PDFs because
            Cloudinary raw resources can sometimes return
            application/octet-stream.
            ------------------------------------------------
            */

            const previewBlob =
                blob.type === mimeType
                    ? blob
                    : new Blob(
                        [blob],
                        {
                            type: mimeType,
                        },
                    );

            /*
            ------------------------------------------------
            CREATE BLOB URL
            ------------------------------------------------
            */

            const objectUrl =
                URL.createObjectURL(
                    previewBlob,
                );

            /*
            ------------------------------------------------
            CHECK AGAIN BEFORE COMMITTING
            ------------------------------------------------
            */

            if (
                requestId !==
                previewRequestRef.current
            ) {
                URL.revokeObjectURL(
                    objectUrl,
                );

                return;
            }

            replacePreviewUrl(
                objectUrl,
            );
        } catch (requestError) {
            if (
                requestId !==
                previewRequestRef.current
            ) {
                return;
            }

            console.error(
                "FAILED TO LOAD DOCUMENT PREVIEW:",
                requestError,
            );

            setPreviewError(
                requestError?.response?.data
                    ?.message ||
                requestError?.message ||
                "Unable to load document preview.",
            );
        } finally {
            if (
                requestId ===
                previewRequestRef.current
            ) {
                setPreviewLoading(false);
            }
        }
    };

    /*
    ========================================================
    CLOSE DOCUMENT
    ========================================================
    */

    const closeDocument = () => {
        /*
        Invalidate any request currently in flight.
        */

        ++previewRequestRef.current;

        replacePreviewUrl("");

        setSelectedDocument(null);

        setPreviewError("");

        setPreviewLoading(false);

        setReviewError("");

        setReviewNote("");

        setReviewStatus("APPROVED");
    };

    /*
    ========================================================
    CLEAN OBJECT URL ON UNMOUNT
    ========================================================
    */

    useEffect(() => {
        return () => {
            if (previewUrlRef.current) {
                URL.revokeObjectURL(
                    previewUrlRef.current,
                );

                previewUrlRef.current = "";
            }
        };
    }, []);

    /*
    ========================================================
    ESC KEY
    ========================================================
    */

    useEffect(() => {
        if (!selectedDocument) {
            return undefined;
        }

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                closeDocument();
            }
        };

        window.addEventListener(
            "keydown",
            handleKeyDown,
        );

        return () => {
            window.removeEventListener(
                "keydown",
                handleKeyDown,
            );
        };
    }, [selectedDocument]);

    /*
    ========================================================
    DOWNLOAD DOCUMENT
    ========================================================
    */

    const downloadDocument = () => {
        if (
            !previewUrl ||
            !selectedDocument
        ) {
            return;
        }

        const anchor =
            window.document.createElement(
                "a",
            );

        anchor.href = previewUrl;

        anchor.download =
            selectedDocument?.originalFileName ||
            selectedDocument?.name ||
            selectedDocument?.documentName ||
            "document";

        anchor.style.display = "none";

        window.document.body.appendChild(
            anchor,
        );

        anchor.click();

        window.document.body.removeChild(
            anchor,
        );
    };

    /*
    ========================================================
    UPDATE DOCUMENT STATUS
    ========================================================
    */

    const handleReviewSubmit = async () => {
        if (!selectedDocument?._id) {
            return;
        }

        setReviewing(true);

        setReviewError("");

        try {
            const updatedDocument =
                await documentsService.updateDocumentStatus(
                    selectedDocument._id,
                    reviewStatus,
                    reviewNote.trim(),
                );

            if (updatedDocument) {
                setSelectedDocument(
                    updatedDocument,
                );

                setDocuments(
                    (currentDocuments) =>
                        currentDocuments.map(
                            (document) =>
                                document._id ===
                                    updatedDocument._id
                                    ? updatedDocument
                                    : document,
                        ),
                );
            } else {
                const localUpdate = {
                    status: reviewStatus,
                    reviewNote:
                        reviewNote.trim(),
                };

                setDocuments(
                    (currentDocuments) =>
                        currentDocuments.map(
                            (document) =>
                                document._id ===
                                    selectedDocument._id
                                    ? {
                                        ...document,
                                        ...localUpdate,
                                    }
                                    : document,
                        ),
                );

                setSelectedDocument(
                    (currentDocument) => ({
                        ...currentDocument,
                        ...localUpdate,
                    }),
                );
            }
        } catch (requestError) {
            console.error(
                "FAILED TO UPDATE DOCUMENT STATUS:",
                requestError,
            );

            setReviewError(
                requestError?.response?.data
                    ?.message ||
                "Unable to update document status.",
            );
        } finally {
            setReviewing(false);
        }
    };

    /*
    ========================================================
    RENDER
    ========================================================
    */

    return (
        <section className="adminDocuments">

            {/* ==================================================
                HEADER
            ================================================== */}

            <header className="adminDocuments__header">

                <div>

                    <span className="adminDocuments__eyebrow">
                        DOCUMENT MANAGEMENT
                    </span>

                    <h1>
                        Documents
                    </h1>

                    <p>
                        Manage documents submitted across
                        client applications.
                    </p>

                </div>

                <button
                    type="button"
                    className="adminDocuments__refresh"
                    onClick={() =>
                        loadDocuments(true)
                    }
                    disabled={refreshing}
                >

                    <HiOutlineRefresh
                        className={
                            refreshing
                                ? "adminDocuments__refreshIcon is-spinning"
                                : "adminDocuments__refreshIcon"
                        }
                    />

                    <span>
                        Refresh
                    </span>

                </button>

            </header>

            {/* ==================================================
                SUMMARY
            ================================================== */}

            <div className="adminDocuments__summary">

                <div className="adminDocuments__summaryCard">

                    <span>
                        Total Documents
                    </span>

                    <strong>
                        {summary.total}
                    </strong>

                </div>

                <div className="adminDocuments__summaryCard">

                    <span>
                        Pending Review
                    </span>

                    <strong>
                        {summary.pending}
                    </strong>

                </div>

                <div className="adminDocuments__summaryCard">

                    <span>
                        Approved
                    </span>

                    <strong>
                        {summary.approved}
                    </strong>

                </div>

                <div className="adminDocuments__summaryCard">

                    <span>
                        Needs Attention
                    </span>

                    <strong>
                        {summary.rejected}
                    </strong>

                </div>

            </div>

            {/* ==================================================
                TOOLBAR
            ================================================== */}

            <div className="adminDocuments__toolbar">

                <div className="adminDocuments__search">

                    <HiOutlineSearch />

                    <input
                        type="text"
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target.value,
                            )
                        }
                        placeholder="Search documents, clients or applications..."
                    />

                </div>

                <div className="adminDocuments__filter">

                    <select
                        value={statusFilter}
                        onChange={(event) =>
                            setStatusFilter(
                                event.target.value,
                            )
                        }
                    >

                        {STATUS_OPTIONS.map(
                            (status) => (

                                <option
                                    key={status}
                                    value={status}
                                >

                                    {status ===
                                        "ALL"
                                        ? "All statuses"
                                        : formatLabel(
                                            status,
                                        )}

                                </option>

                            ),
                        )}

                    </select>

                </div>

            </div>

            {/* ==================================================
                ERROR
            ================================================== */}

            {error && (

                <div className="adminDocuments__error">

                    <span>
                        {error}
                    </span>

                    <button
                        type="button"
                        onClick={() =>
                            loadDocuments()
                        }
                    >
                        Try again
                    </button>

                </div>

            )}

            {/* ==================================================
                DOCUMENT TABLE
            ================================================== */}

            <div className="adminDocuments__panel">

                <div className="adminDocuments__panelHeader">

                    <div>

                        <h2>
                            All Documents
                        </h2>

                        <span>
                            {filteredDocuments.length}{" "}
                            {filteredDocuments.length ===
                                1
                                ? "document"
                                : "documents"}
                        </span>

                    </div>

                </div>

                {loading ? (

                    <div className="adminDocuments__state">

                        <div className="adminDocuments__loader" />

                        <span>
                            Loading documents...
                        </span>

                    </div>

                ) : filteredDocuments.length ===
                    0 ? (

                    <div className="adminDocuments__state adminDocuments__state--empty">

                        <div className="adminDocuments__emptyIcon">

                            <HiOutlineDocumentText />

                        </div>

                        <h3>
                            No documents found
                        </h3>

                        <p>

                            {search ||
                                statusFilter !==
                                "ALL"
                                ? "Try adjusting your search or filter."
                                : "Documents submitted by clients will appear here."}

                        </p>

                    </div>

                ) : (

                    <div className="adminDocuments__tableWrapper">

                        <table className="adminDocuments__table">

                            <thead>

                                <tr>

                                    <th>
                                        Document
                                    </th>

                                    <th>
                                        Client
                                    </th>

                                    <th>
                                        Application
                                    </th>

                                    <th>
                                        Country
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th>
                                        Uploaded
                                    </th>

                                    <th>
                                        Actions
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {filteredDocuments.map(
                                    (
                                        document,
                                    ) => {

                                        const status =
                                            normalizeStatus(
                                                document?.status,
                                            );

                                        return (

                                            <tr
                                                key={
                                                    document?._id
                                                }
                                            >

                                                <td>

                                                    <div className="adminDocuments__documentCell">

                                                        <div className="adminDocuments__documentIcon">

                                                            <HiOutlineDocumentText />

                                                        </div>

                                                        <div>

                                                            <strong
                                                                title={getDocumentName(
                                                                    document,
                                                                )}
                                                            >
                                                                {getDocumentName(
                                                                    document,
                                                                )}
                                                            </strong>

                                                            <span>
                                                                {formatLabel(
                                                                    getDocumentType(
                                                                        document,
                                                                    ),
                                                                )}
                                                            </span>

                                                        </div>

                                                    </div>

                                                </td>

                                                <td>

                                                    <div className="adminDocuments__clientCell">

                                                        <HiOutlineUser />

                                                        <div>

                                                            <strong>
                                                                {getClientName(
                                                                    document,
                                                                )}
                                                            </strong>

                                                            <span>
                                                                {
                                                                    document
                                                                        ?.user
                                                                        ?.email
                                                                }
                                                            </span>

                                                        </div>

                                                    </div>

                                                </td>

                                                <td>

                                                    <span className="adminDocuments__application">
                                                        {getApplicationLabel(
                                                            document,
                                                        )}
                                                    </span>

                                                </td>

                                                <td>

                                                    <span className="adminDocuments__country">

                                                        <HiOutlineGlobeAlt />

                                                        {getCountry(
                                                            document,
                                                        )}

                                                    </span>

                                                </td>

                                                <td>

                                                    <span
                                                        className={`adminDocuments__status adminDocuments__status--${getStatusClass(
                                                            status,
                                                        )}`}
                                                    >

                                                        <span />

                                                        {formatLabel(
                                                            status,
                                                        )}

                                                    </span>

                                                </td>

                                                <td>

                                                    <span className="adminDocuments__date">
                                                        {formatDate(
                                                            document?.createdAt,
                                                        )}
                                                    </span>

                                                </td>

                                                <td>

                                                    <div className="adminDocuments__actions">

                                                        <button
                                                            type="button"
                                                            className="adminDocuments__action"
                                                            onClick={() =>
                                                                openDocument(
                                                                    document,
                                                                )
                                                            }
                                                            title="View document"
                                                            aria-label="View document"
                                                        >

                                                            <HiOutlineEye />

                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        );
                                    },
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

            {/* ==================================================
                DOCUMENT REVIEW MODAL
            ================================================== */}

            {selectedDocument && (

                <div
                    className="adminDocuments__modalOverlay"
                    onMouseDown={(event) => {

                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            closeDocument();
                        }

                    }}
                >

                    <div className="adminDocuments__modal">

                        {/* ==================================================
                            MODAL HEADER
                        ================================================== */}

                        <div className="adminDocuments__modalHeader">

                            <div>

                                <span className="adminDocuments__modalEyebrow">
                                    DOCUMENT REVIEW
                                </span>

                                <h2>
                                    {getDocumentName(
                                        selectedDocument,
                                    )}
                                </h2>

                                <p>
                                    {getClientName(
                                        selectedDocument,
                                    )}
                                    {" · "}
                                    {formatLabel(
                                        getDocumentType(
                                            selectedDocument,
                                        ),
                                    )}
                                </p>

                            </div>

                            <button
                                type="button"
                                className="adminDocuments__modalClose"
                                onClick={
                                    closeDocument
                                }
                                aria-label="Close document review"
                            >

                                <HiOutlineX />

                            </button>

                        </div>

                        {/* ==================================================
                            MODAL BODY
                        ================================================== */}

                        <div className="adminDocuments__modalBody">

                            {/* ==================================================
                                DOCUMENT PREVIEW
                            ================================================== */}

                            <div className="adminDocuments__preview">

                                {previewLoading ? (

                                    <div className="adminDocuments__previewState">

                                        <div className="adminDocuments__loader" />

                                        <span>
                                            Loading document...
                                        </span>

                                    </div>

                                ) : previewError ? (

                                    <div className="adminDocuments__previewState adminDocuments__previewState--error">

                                        <div className="adminDocuments__previewErrorIcon">

                                            <HiOutlineExclamation />

                                        </div>

                                        <h3>
                                            Preview unavailable
                                        </h3>

                                        <p>
                                            {previewError}
                                        </p>

                                    </div>

                                ) : previewUrl &&
                                    isImageDocument(
                                        selectedDocument,
                                    ) ? (

                                    <div className="adminDocuments__imagePreview">

                                        <img
                                            src={
                                                previewUrl
                                            }
                                            alt={getDocumentName(
                                                selectedDocument,
                                            )}
                                        />

                                    </div>

                                ) : previewUrl &&
                                    isPdfDocument(
                                        selectedDocument,
                                    ) ? (

                                    <iframe
                                        src={
                                            previewUrl
                                        }
                                        title={getDocumentName(
                                            selectedDocument,
                                        )}
                                        className="adminDocuments__pdfPreview"
                                    />

                                ) : previewUrl ? (

                                    <div className="adminDocuments__previewState">

                                        <div className="adminDocuments__emptyIcon">

                                            <HiOutlineDocumentText />

                                        </div>

                                        <h3>
                                            Preview loaded
                                        </h3>

                                        <p>
                                            This file type
                                            cannot be rendered
                                            directly in the
                                            preview panel.
                                        </p>

                                    </div>

                                ) : (

                                    <div className="adminDocuments__previewState">

                                        <div className="adminDocuments__emptyIcon">

                                            <HiOutlineDocumentText />

                                        </div>

                                        <h3>
                                            No preview available
                                        </h3>

                                    </div>

                                )}

                            </div>

                            {/* ==================================================
                                REVIEW PANEL
                            ================================================== */}

                            <aside className="adminDocuments__reviewPanel">

                                <div className="adminDocuments__reviewSection">

                                    <span className="adminDocuments__reviewLabel">
                                        DOCUMENT STATUS
                                    </span>

                                    <span
                                        className={`adminDocuments__status adminDocuments__status--${getStatusClass(
                                            selectedDocument?.status,
                                        )}`}
                                    >

                                        <span />

                                        {formatLabel(
                                            selectedDocument?.status,
                                        )}

                                    </span>

                                </div>

                                <div className="adminDocuments__reviewSection">

                                    <span className="adminDocuments__reviewLabel">
                                        DOCUMENT DETAILS
                                    </span>

                                    <div className="adminDocuments__detailList">

                                        <div>

                                            <span>
                                                Client
                                            </span>

                                            <strong>
                                                {getClientName(
                                                    selectedDocument,
                                                )}
                                            </strong>

                                        </div>

                                        <div>

                                            <span>
                                                Email
                                            </span>

                                            <strong>
                                                {
                                                    selectedDocument
                                                        ?.user
                                                        ?.email ||
                                                    "—"
                                                }
                                            </strong>

                                        </div>

                                        <div>

                                            <span>
                                                Application
                                            </span>

                                            <strong>
                                                {getApplicationLabel(
                                                    selectedDocument,
                                                )}
                                            </strong>

                                        </div>

                                        <div>

                                            <span>
                                                Country
                                            </span>

                                            <strong>
                                                {getCountry(
                                                    selectedDocument,
                                                )}
                                            </strong>

                                        </div>

                                        <div>

                                            <span>
                                                Uploaded
                                            </span>

                                            <strong>
                                                {formatDateTime(
                                                    selectedDocument?.createdAt,
                                                )}
                                            </strong>

                                        </div>

                                    </div>

                                </div>

                                {selectedDocument?.reviewedBy && (

                                    <div className="adminDocuments__reviewSection">

                                        <span className="adminDocuments__reviewLabel">
                                            LAST REVIEW
                                        </span>

                                        <div className="adminDocuments__reviewer">

                                            <div className="adminDocuments__reviewerIcon">

                                                <HiOutlineUser />

                                            </div>

                                            <div>

                                                <strong>
                                                    {
                                                        selectedDocument
                                                            ?.reviewedBy
                                                            ?.name ||
                                                        selectedDocument
                                                            ?.reviewedBy
                                                            ?.email ||
                                                        "Staff"
                                                    }
                                                </strong>

                                                <span>
                                                    {formatDateTime(
                                                        selectedDocument?.reviewedAt,
                                                    )}
                                                </span>

                                            </div>

                                        </div>

                                    </div>

                                )}

                                <div className="adminDocuments__reviewSection">

                                    <span className="adminDocuments__reviewLabel">
                                        REVIEW DECISION
                                    </span>

                                    <div className="adminDocuments__decisionGrid">

                                        {REVIEW_STATUS_OPTIONS.map(
                                            (
                                                status,
                                            ) => (

                                                <button
                                                    key={
                                                        status
                                                    }
                                                    type="button"
                                                    className={
                                                        reviewStatus ===
                                                            status
                                                            ? `adminDocuments__decision adminDocuments__decision--active adminDocuments__decision--${getStatusClass(
                                                                status,
                                                            )}`
                                                            : "adminDocuments__decision"
                                                    }
                                                    onClick={() =>
                                                        setReviewStatus(
                                                            status,
                                                        )
                                                    }
                                                >

                                                    {status ===
                                                        "APPROVED" ? (
                                                        <HiOutlineCheck />
                                                    ) : (
                                                        <HiOutlineExclamation />
                                                    )}

                                                    <span>
                                                        {formatLabel(
                                                            status,
                                                        )}
                                                    </span>

                                                </button>

                                            ),
                                        )}

                                    </div>

                                </div>

                                <div className="adminDocuments__reviewSection">

                                    <label
                                        className="adminDocuments__reviewLabel"
                                        htmlFor="document-review-note"
                                    >
                                        REVIEW NOTE
                                    </label>

                                    <textarea
                                        id="document-review-note"
                                        value={
                                            reviewNote
                                        }
                                        onChange={(event) =>
                                            setReviewNote(
                                                event
                                                    .target
                                                    .value,
                                            )
                                        }
                                        placeholder="Add a note for the client or internal review record..."
                                        rows={5}
                                    />

                                </div>

                                {reviewError && (

                                    <div className="adminDocuments__reviewError">

                                        <HiOutlineExclamation />

                                        <span>
                                            {reviewError}
                                        </span>

                                    </div>

                                )}

                                <div className="adminDocuments__reviewActions">

                                    <button
                                        type="button"
                                        className="adminDocuments__download"
                                        onClick={
                                            downloadDocument
                                        }
                                        disabled={
                                            !previewUrl
                                        }
                                    >

                                        <HiOutlineDownload />

                                        <span>
                                            Download
                                        </span>

                                    </button>

                                    <button
                                        type="button"
                                        className="adminDocuments__submitReview"
                                        onClick={
                                            handleReviewSubmit
                                        }
                                        disabled={
                                            reviewing
                                        }
                                    >

                                        {reviewing ? (
                                            <>
                                                <span className="adminDocuments__buttonSpinner" />

                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <HiOutlineCheck />

                                                Save Review
                                            </>
                                        )}

                                    </button>

                                </div>

                            </aside>

                        </div>

                    </div>

                </div>

            )}

        </section>
    );
};

export default AdminDocuments;