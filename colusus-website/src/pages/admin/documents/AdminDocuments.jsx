
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
    HiOutlineCalendar,
    HiOutlineExternalLink,
    HiOutlineShieldCheck,
} from "react-icons/hi";

import documentsService from "./documents.service";
import "./AdminDocuments.css";

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

const formatLabel = (value) => {
    if (!value) return "—";

    return String(value)
        .replace(/[_-]+/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const formatDate = (value) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "—";

    return new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(date);
};

const formatDateTime = (value) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "—";

    return new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
};

const getDocumentName = (document) =>
    document?.originalFileName ||
    document?.name ||
    document?.documentName ||
    document?.type ||
    "Untitled document";

const getDocumentType = (document) =>
    document?.type ||
    document?.documentType ||
    "OTHER";

const getClientName = (document) =>
    document?.user?.name ||
    "Unknown client";

const getApplication = (document) => document?.application;

const getApplicationLabel = (document) => {
    const application = getApplication(document);

    if (!application) return "—";

    return (
        application?.applicationReference ||
        application?.reference ||
        application?.type ||
        application?.destinationCountry ||
        "Application"
    );
};

const getCountry = (document) =>
    getApplication(document)?.destinationCountry || "—";

const normalizeStatus = (value) =>
    String(value || "")
        .trim()
        .toUpperCase()
        .replace(/\s+/g, "_");

const getStatusClass = (status) => {
    switch (normalizeStatus(status)) {
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

const getFileExtension = (document) => {
    const fileName =
        document?.originalFileName ||
        document?.name ||
        document?.documentName ||
        document?.fileName ||
        "";

    const normalizedFileName = String(fileName)
        .toLowerCase()
        .split("?")[0]
        .split("#")[0];

    if (!normalizedFileName.includes(".")) return "";

    return normalizedFileName.split(".").pop();
};

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

    if (mimeMap[extension]) return mimeMap[extension];

    if (blob?.type) return blob.type;

    return "application/octet-stream";
};

const isPdfDocument = (document) => {
    const extension = getFileExtension(document);

    const mimeType = String(
        document?.mimeType ||
        document?.fileType ||
        document?.contentType ||
        "",
    ).toLowerCase();

    return extension === "pdf" || mimeType.includes("pdf");
};

const isImageDocument = (document) => {
    const extension = getFileExtension(document);

    const mimeType = String(
        document?.mimeType ||
        document?.fileType ||
        document?.contentType ||
        "",
    ).toLowerCase();

    return (
        ["jpg", "jpeg", "png", "webp", "gif"].includes(extension) ||
        mimeType.startsWith("image/")
    );
};

const AdminDocuments = () => {
    const [documents, setDocuments] = useState([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [refreshing, setRefreshing] = useState(false);

    // Document viewer
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [previewLoading, setPreviewLoading] = useState(false);
    const [previewError, setPreviewError] = useState("");

    // Document review
    const [reviewStatus, setReviewStatus] = useState("APPROVED");
    const [reviewNote, setReviewNote] = useState("");
    const [reviewing, setReviewing] = useState(false);
    const [reviewError, setReviewError] = useState("");
    const [reviewSuccess, setReviewSuccess] = useState(false);

    const previewRequestRef = useRef(0);
    const previewUrlRef = useRef("");
    const modalRef = useRef(null);
    const previouslyFocusedElementRef = useRef(null);

    const replacePreviewUrl = (nextUrl) => {
        if (previewUrlRef.current) {
            URL.revokeObjectURL(previewUrlRef.current);
        }

        previewUrlRef.current = nextUrl || "";
        setPreviewUrl(nextUrl || "");
    };

    const loadDocuments = async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            const result =
                await documentsService.getAllDocuments();

            setDocuments(Array.isArray(result) ? result : []);
        } catch (requestError) {
            console.error(
                "FAILED TO LOAD DOCUMENTS:",
                requestError,
            );

            setError(
                requestError?.response?.data?.message ||
                "Unable to load documents.",
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadDocuments();

        // This component loads documents when mounted.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const filteredDocuments = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase();

        return documents.filter((document) => {
            const status = normalizeStatus(document?.status);

            const matchesStatus =
                statusFilter === "ALL" ||
                status === statusFilter;

            if (!matchesStatus) return false;

            if (!normalizedSearch) return true;

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

            return searchableText.includes(normalizedSearch);
        });
    }, [documents, search, statusFilter]);

    const summary = useMemo(
        () => ({
            total: documents.length,

            pending: documents.filter((document) =>
                ["PENDING", "UNDER_REVIEW"].includes(
                    normalizeStatus(document?.status),
                ),
            ).length,

            approved: documents.filter(
                (document) =>
                    normalizeStatus(document?.status) === "APPROVED",
            ).length,

            rejected: documents.filter((document) =>
                ["REJECTED", "REUPLOAD_REQUIRED"].includes(
                    normalizeStatus(document?.status),
                ),
            ).length,
        }),
        [documents],
    );

    const openDocument = async (document) => {
        if (!document?._id) return;

        previouslyFocusedElementRef.current =
            window.document.activeElement;

        const requestId = ++previewRequestRef.current;

        replacePreviewUrl("");

        setSelectedDocument(document);
        setPreviewError("");
        setReviewError("");
        setReviewSuccess(false);

        setReviewNote(
            document?.reviewNote ||
            document?.reviewNotes ||
            "",
        );

        const currentStatus = normalizeStatus(document?.status);

        setReviewStatus(
            currentStatus === "REJECTED"
                ? "REJECTED"
                : currentStatus === "REUPLOAD_REQUIRED"
                    ? "REUPLOAD_REQUIRED"
                    : "APPROVED",
        );

        setPreviewLoading(true);

        try {
            const blob =
                await documentsService.getDocumentPreview(
                    document._id,
                );

            if (requestId !== previewRequestRef.current) return;

            if (!(blob instanceof Blob)) {
                throw new Error(
                    "The document preview response is not a valid file.",
                );
            }

            if (blob.size === 0) {
                throw new Error("The document preview is empty.");
            }

            const mimeType = getPreviewMimeType(document, blob);

            const previewBlob =
                blob.type === mimeType
                    ? blob
                    : new Blob([blob], { type: mimeType });

            const objectUrl = URL.createObjectURL(previewBlob);

            if (requestId !== previewRequestRef.current) {
                URL.revokeObjectURL(objectUrl);
                return;
            }

            replacePreviewUrl(objectUrl);
        } catch (requestError) {
            if (requestId !== previewRequestRef.current) return;

            console.error(
                "FAILED TO LOAD DOCUMENT PREVIEW:",
                requestError,
            );

            setPreviewError(
                requestError?.response?.data?.message ||
                requestError?.message ||
                "Unable to load document preview.",
            );
        } finally {
            if (requestId === previewRequestRef.current) {
                setPreviewLoading(false);
            }
        }
    };

    const closeDocument = () => {
        ++previewRequestRef.current;

        replacePreviewUrl("");

        setSelectedDocument(null);
        setPreviewError("");
        setPreviewLoading(false);
        setReviewError("");
        setReviewSuccess(false);
        setReviewNote("");
        setReviewStatus("APPROVED");

        window.requestAnimationFrame(() => {
            previouslyFocusedElementRef.current?.focus?.();
        });
    };

    // Release the preview URL if the component is unmounted.
    useEffect(
        () => () => {
            if (previewUrlRef.current) {
                URL.revokeObjectURL(previewUrlRef.current);
                previewUrlRef.current = "";
            }
        },
        [],
    );

    // Modal keyboard behaviour and background scroll locking.
    useEffect(() => {
        if (!selectedDocument) return undefined;

        const previousOverflow = window.document.body.style.overflow;

        window.document.body.style.overflow = "hidden";

        const handleKeyDown = (event) => {
            if (event.key === "Escape" && !reviewing) {
                closeDocument();
            }

            if (event.key === "Tab" && modalRef.current) {
                const focusableElements = modalRef.current.querySelectorAll(
                    'button:not(:disabled), textarea:not(:disabled), input:not(:disabled), select:not(:disabled), a[href], iframe, [tabindex]:not([tabindex="-1"])',
                );

                const focusable = Array.from(focusableElements).filter(
                    (element) => element.offsetParent !== null,
                );

                if (!focusable.length) return;

                const first = focusable[0];
                const last = focusable[focusable.length - 1];

                if (
                    event.shiftKey &&
                    window.document.activeElement === first
                ) {
                    event.preventDefault();
                    last.focus();
                } else if (
                    !event.shiftKey &&
                    window.document.activeElement === last
                ) {
                    event.preventDefault();
                    first.focus();
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        const focusTimer = window.setTimeout(() => {
            modalRef.current
                ?.querySelector(".adminDocuments__modalClose")
                ?.focus();
        }, 0);

        return () => {
            window.document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleKeyDown);
            window.clearTimeout(focusTimer);
        };

        // closeDocument is intentionally defined inside this component.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDocument, reviewing]);

    const downloadDocument = () => {
        if (!previewUrl || !selectedDocument) return;

        const anchor = window.document.createElement("a");

        anchor.href = previewUrl;
        anchor.download =
            getDocumentName(selectedDocument) || "document";
        anchor.style.display = "none";

        window.document.body.appendChild(anchor);
        anchor.click();
        window.document.body.removeChild(anchor);
    };

    const handleReviewSubmit = async (event) => {
        event.preventDefault();

        if (!selectedDocument?._id || reviewing) return;

        setReviewing(true);
        setReviewError("");
        setReviewSuccess(false);

        try {
            const updatedDocument =
                await documentsService.updateDocumentStatus(
                    selectedDocument._id,
                    reviewStatus,
                    reviewNote.trim(),
                );

            const localUpdate = updatedDocument || {
                ...selectedDocument,
                status: reviewStatus,
                reviewNote: reviewNote.trim(),
            };

            setSelectedDocument((currentDocument) => ({
                ...currentDocument,
                ...localUpdate,
            }));

            setDocuments((currentDocuments) =>
                currentDocuments.map((document) =>
                    document._id === selectedDocument._id
                        ? { ...document, ...localUpdate }
                        : document,
                ),
            );

            setReviewSuccess(true);
        } catch (requestError) {
            console.error(
                "FAILED TO UPDATE DOCUMENT STATUS:",
                requestError,
            );

            setReviewError(
                requestError?.response?.data?.message ||
                "Unable to update document status.",
            );
        } finally {
            setReviewing(false);
        }
    };

    return (
        <section className="adminDocuments">
            {/* Page header */}
            <header className="adminDocuments__header">
                <div className="adminDocuments__heading">
                    <span className="adminDocuments__eyebrow">
                        DOCUMENT MANAGEMENT
                    </span>

                    <h1>Documents</h1>

                    <p>
                        Review, verify and manage documents submitted
                        across client applications.
                    </p>
                </div>

                <button
                    type="button"
                    className="adminDocuments__refresh"
                    onClick={() => loadDocuments(true)}
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
                        {refreshing ? "Refreshing..." : "Refresh"}
                    </span>
                </button>
            </header>

            {/* Summary cards */}
            <div className="adminDocuments__summary">
                <div className="adminDocuments__summaryCard">
                    <span>Total Documents</span>
                    <strong>{summary.total}</strong>
                    <small>All submitted files</small>
                </div>

                <div className="adminDocuments__summaryCard">
                    <span>Pending Review</span>
                    <strong>{summary.pending}</strong>
                    <small>Awaiting a decision</small>
                </div>

                <div className="adminDocuments__summaryCard">
                    <span>Approved</span>
                    <strong>{summary.approved}</strong>
                    <small>Successfully reviewed</small>
                </div>

                <div className="adminDocuments__summaryCard">
                    <span>Needs Attention</span>
                    <strong>{summary.rejected}</strong>
                    <small>Rejected or needs reupload</small>
                </div>
            </div>

            {/* Search and filters */}
            <div className="adminDocuments__toolbar">
                <label className="adminDocuments__search">
                    <HiOutlineSearch />

                    <input
                        type="search"
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                        placeholder="Search documents, clients or applications..."
                        aria-label="Search documents"
                    />

                    {search && (
                        <button
                            type="button"
                            className="adminDocuments__clearSearch"
                            onClick={() => setSearch("")}
                            aria-label="Clear search"
                        >
                            <HiOutlineX />
                        </button>
                    )}
                </label>

                <div className="adminDocuments__filter">
                    <select
                        value={statusFilter}
                        onChange={(event) =>
                            setStatusFilter(event.target.value)
                        }
                        aria-label="Filter by document status"
                    >
                        {STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>
                                {status === "ALL"
                                    ? "All statuses"
                                    : formatLabel(status)}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Load error */}
            {error && (
                <div className="adminDocuments__error" role="alert">
                    <HiOutlineExclamation />

                    <span>{error}</span>

                    <button
                        type="button"
                        onClick={() => loadDocuments()}
                    >
                        Try again
                    </button>
                </div>
            )}

            {/* Documents table */}
            <div className="adminDocuments__panel">
                <div className="adminDocuments__panelHeader">
                    <div>
                        <h2>All Documents</h2>

                        <span>
                            Showing {filteredDocuments.length} of{" "}
                            {documents.length} documents
                        </span>
                    </div>
                </div>

                {loading ? (
                    <div className="adminDocuments__state">
                        <div className="adminDocuments__loader" />
                        <span>Loading documents...</span>
                    </div>
                ) : filteredDocuments.length === 0 ? (
                    <div className="adminDocuments__state adminDocuments__state--empty">
                        <div className="adminDocuments__emptyIcon">
                            <HiOutlineDocumentText />
                        </div>

                        <h3>No documents found</h3>

                        <p>
                            {search || statusFilter !== "ALL"
                                ? "Try adjusting your search or filter."
                                : "Documents submitted by clients will appear here."}
                        </p>

                        {(search || statusFilter !== "ALL") && (
                            <button
                                type="button"
                                className="adminDocuments__resetFilters"
                                onClick={() => {
                                    setSearch("");
                                    setStatusFilter("ALL");
                                }}
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="adminDocuments__tableWrapper">
                        <table className="adminDocuments__table">
                            <thead>
                                <tr>
                                    <th>Document</th>
                                    <th>Client</th>
                                    <th>Application</th>
                                    <th>Country</th>
                                    <th>Status</th>
                                    <th>Uploaded</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredDocuments.map((document) => {
                                    const status = normalizeStatus(
                                        document?.status,
                                    );

                                    return (
                                        <tr key={document?._id}>
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
                                                            {document?.user
                                                                ?.email ||
                                                                "No email"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            <td>
                                                <span
                                                    className="adminDocuments__application"
                                                    title={getApplicationLabel(
                                                        document,
                                                    )}
                                                >
                                                    {getApplicationLabel(
                                                        document,
                                                    )}
                                                </span>
                                            </td>

                                            <td>
                                                <span className="adminDocuments__country">
                                                    <HiOutlineGlobeAlt />
                                                    {getCountry(document)}
                                                </span>
                                            </td>

                                            <td>
                                                <span
                                                    className={`adminDocuments__status adminDocuments__status--${getStatusClass(
                                                        status,
                                                    )}`}
                                                >
                                                    <span />
                                                    {formatLabel(status)}
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
                                                        title="View and review document"
                                                        aria-label={`View ${getDocumentName(
                                                            document,
                                                        )}`}
                                                    >
                                                        <HiOutlineEye />
                                                        <span>Review</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Document review modal */}
            {selectedDocument && (
                <div
                    className="adminDocuments__modalOverlay"
                    onMouseDown={(event) => {
                        if (
                            event.target === event.currentTarget &&
                            !reviewing
                        ) {
                            closeDocument();
                        }
                    }}
                >
                    <section
                        ref={modalRef}
                        className="adminDocuments__modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="adminDocuments-modal-title"
                    >
                        {/* Modal header */}
                        <header className="adminDocuments__modalHeader">
                            <div className="adminDocuments__modalTitleGroup">
                                <div className="adminDocuments__modalFileIcon">
                                    <HiOutlineDocumentText />
                                </div>

                                <div className="adminDocuments__modalTitleText">
                                    <span className="adminDocuments__modalEyebrow">
                                        DOCUMENT REVIEW
                                    </span>

                                    <h2 id="adminDocuments-modal-title">
                                        {getDocumentName(
                                            selectedDocument,
                                        )}
                                    </h2>

                                    <p>
                                        {getClientName(selectedDocument)}
                                        <span>·</span>
                                        {formatLabel(
                                            getDocumentType(
                                                selectedDocument,
                                            ),
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div className="adminDocuments__modalHeaderActions">
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

                                <button
                                    type="button"
                                    className="adminDocuments__modalClose"
                                    onClick={closeDocument}
                                    disabled={reviewing}
                                    aria-label="Close document review"
                                    title="Close"
                                >
                                    <HiOutlineX />
                                </button>
                            </div>
                        </header>

                        {/* Modal body */}
                        <div className="adminDocuments__modalBody">
                            {/* File preview */}
                            <main className="adminDocuments__previewColumn">
                                <div className="adminDocuments__previewToolbar">
                                    <div>
                                        <span className="adminDocuments__previewToolbarDot" />
                                        <span>Document preview</span>
                                    </div>

                                    <span className="adminDocuments__fileType">
                                        {getFileExtension(
                                            selectedDocument,
                                        ).toUpperCase() || "FILE"}
                                    </span>
                                </div>

                                <div className="adminDocuments__preview">
                                    {previewLoading ? (
                                        <div className="adminDocuments__previewState">
                                            <div className="adminDocuments__loader" />

                                            <h3>Preparing document</h3>

                                            <p>
                                                Please wait while the
                                                document is loaded.
                                            </p>
                                        </div>
                                    ) : previewError ? (
                                        <div className="adminDocuments__previewState adminDocuments__previewState--error">
                                            <div className="adminDocuments__previewErrorIcon">
                                                <HiOutlineExclamation />
                                            </div>

                                            <h3>Preview unavailable</h3>

                                            <p>{previewError}</p>
                                        </div>
                                    ) : previewUrl &&
                                        isImageDocument(
                                            selectedDocument,
                                        ) ? (
                                        <div className="adminDocuments__imagePreview">
                                            <img
                                                src={previewUrl}
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
                                            src={previewUrl}
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

                                            <h3>File loaded successfully</h3>

                                            <p>
                                                This file type cannot be
                                                displayed in the preview.
                                                Download it to inspect the
                                                contents.
                                            </p>

                                            <button
                                                type="button"
                                                className="adminDocuments__download"
                                                onClick={downloadDocument}
                                            >
                                                <HiOutlineDownload />
                                                Download file
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="adminDocuments__previewState">
                                            <div className="adminDocuments__emptyIcon">
                                                <HiOutlineDocumentText />
                                            </div>

                                            <h3>No preview available</h3>

                                            <p>
                                                There is no preview to
                                                display for this document.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="adminDocuments__previewFooter">
                                    <div className="adminDocuments__previewFooterIcon">
                                        <HiOutlineShieldCheck />
                                    </div>

                                    <p>
                                        Review the uploaded file carefully
                                        before making a decision.
                                    </p>

                                    <button
                                        type="button"
                                        className="adminDocuments__download"
                                        onClick={downloadDocument}
                                        disabled={!previewUrl}
                                    >
                                        <HiOutlineDownload />
                                        Download
                                    </button>
                                </div>
                            </main>

                            {/* Document details and review form */}
                            <aside className="adminDocuments__reviewPanel">
                                <div className="adminDocuments__reviewPanelHeading">
                                    <div>
                                        <span className="adminDocuments__modalEyebrow">
                                            REVIEW WORKSPACE
                                        </span>

                                        <h3>Document details</h3>
                                    </div>
                                </div>

                                <div className="adminDocuments__detailList">
                                    <div className="adminDocuments__detailItem">
                                        <span>Client name</span>
                                        <strong>
                                            {getClientName(
                                                selectedDocument,
                                            )}
                                        </strong>
                                    </div>

                                    <div className="adminDocuments__detailItem">
                                        <span>Email address</span>
                                        <strong>
                                            {selectedDocument?.user
                                                ?.email || "—"}
                                        </strong>
                                    </div>

                                    <div className="adminDocuments__detailItem">
                                        <span>Document type</span>
                                        <strong>
                                            {formatLabel(
                                                getDocumentType(
                                                    selectedDocument,
                                                ),
                                            )}
                                        </strong>
                                    </div>

                                    <div className="adminDocuments__detailItem">
                                        <span>Application</span>
                                        <strong>
                                            {getApplicationLabel(
                                                selectedDocument,
                                            )}
                                        </strong>
                                    </div>

                                    <div className="adminDocuments__detailItem">
                                        <span>Destination</span>
                                        <strong>
                                            {getCountry(selectedDocument)}
                                        </strong>
                                    </div>

                                    <div className="adminDocuments__detailItem">
                                        <span>
                                            <HiOutlineCalendar />
                                            Uploaded on
                                        </span>

                                        <strong>
                                            {formatDateTime(
                                                selectedDocument?.createdAt,
                                            )}
                                        </strong>
                                    </div>
                                </div>

                                {selectedDocument?.reviewedBy && (
                                    <div className="adminDocuments__lastReview">
                                        <span className="adminDocuments__reviewLabel">
                                            LAST REVIEW
                                        </span>

                                        <div className="adminDocuments__reviewer">
                                            <div className="adminDocuments__reviewerIcon">
                                                <HiOutlineUser />
                                            </div>

                                            <div>
                                                <strong>
                                                    {selectedDocument
                                                        ?.reviewedBy?.name ||
                                                        selectedDocument
                                                            ?.reviewedBy
                                                            ?.email ||
                                                        "Staff"}
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

                                <form
                                    className="adminDocuments__reviewForm"
                                    onSubmit={handleReviewSubmit}
                                >
                                    <div className="adminDocuments__formHeading">
                                        <h3>Review decision</h3>

                                        <p>
                                            Choose an outcome for this
                                            document.
                                        </p>
                                    </div>

                                    <div className="adminDocuments__decisionGrid">
                                        {REVIEW_STATUS_OPTIONS.map(
                                            (status) => {
                                                const active =
                                                    reviewStatus === status;

                                                const statusClass =
                                                    getStatusClass(status);

                                                return (
                                                    <button
                                                        key={status}
                                                        type="button"
                                                        className={[
                                                            "adminDocuments__decision",
                                                            active
                                                                ? "adminDocuments__decision--active"
                                                                : "",
                                                            `adminDocuments__decision--${statusClass}`,
                                                        ]
                                                            .filter(Boolean)
                                                            .join(" ")}
                                                        onClick={() => {
                                                            setReviewStatus(
                                                                status,
                                                            );
                                                            setReviewError(
                                                                "",
                                                            );
                                                            setReviewSuccess(
                                                                false,
                                                            );
                                                        }}
                                                        aria-pressed={active}
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
                                                );
                                            },
                                        )}
                                    </div>

                                    <label
                                        className="adminDocuments__reviewLabel"
                                        htmlFor="document-review-note"
                                    >
                                        REVIEW NOTE
                                        <span>Optional</span>
                                    </label>

                                    <textarea
                                        id="document-review-note"
                                        value={reviewNote}
                                        onChange={(event) => {
                                            setReviewNote(
                                                event.target.value,
                                            );
                                            setReviewSuccess(false);
                                        }}
                                        placeholder="Explain your decision or tell the client what needs to be corrected..."
                                        rows={4}
                                    />

                                    {reviewError && (
                                        <div
                                            className="adminDocuments__reviewError"
                                            role="alert"
                                        >
                                            <HiOutlineExclamation />
                                            <span>{reviewError}</span>
                                        </div>
                                    )}

                                    {reviewSuccess && (
                                        <div
                                            className="adminDocuments__reviewSuccess"
                                            role="status"
                                        >
                                            <HiOutlineCheck />
                                            <span>
                                                Document review saved
                                                successfully.
                                            </span>
                                        </div>
                                    )}

                                    <div className="adminDocuments__reviewActions">
                                        <button
                                            type="button"
                                            className="adminDocuments__cancelReview"
                                            onClick={closeDocument}
                                            disabled={reviewing}
                                        >
                                            Close
                                        </button>

                                        <button
                                            type="submit"
                                            className="adminDocuments__submitReview"
                                            disabled={reviewing}
                                        >
                                            {reviewing ? (
                                                <>
                                                    <span className="adminDocuments__buttonSpinner" />
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <HiOutlineCheck />
                                                    Save review
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </aside>
                        </div>
                    </section>
                </div>
            )}
        </section>
    );
};

export default AdminDocuments;

