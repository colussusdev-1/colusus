import React, {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import { Link } from "react-router-dom";

import {
    ClipboardCheck,
    Search,
    RefreshCw,
    FileText,
    Clock3,
    CheckCircle2,
    AlertCircle,
    ArrowUpRight,
    CalendarDays,
    MapPin,
    FolderOpen,
    ChevronRight,
    GraduationCap,
    X,
    MessageSquare,
    UserRound,
    Paperclip,
} from "lucide-react";

import "./MyAssessments.css";
import "./MyAssessmentsModal.css";

const API_BASE_URL = (
    import.meta.env.VITE_API_URL || "/api/v1"
).replace(/\/$/, "");

/* ============================================================
   AUTHENTICATION
============================================================ */

const getAuthToken = () => {
    const tokenKeys = [
        "colossus_token",
        "token",
        "accessToken",
        "authToken",
        "access_token",
    ];

    for (const key of tokenKeys) {
        const token = localStorage.getItem(key);

        if (token) return token;
    }

    try {
        const user = JSON.parse(
            localStorage.getItem("user") || "{}"
        );

        return (
            user.token ||
            user.accessToken ||
            user.access_token ||
            ""
        );
    } catch {
        return "";
    }
};

/* ============================================================
   RESPONSE HELPERS
============================================================ */

const getAssessmentArray = (response) => {
    if (Array.isArray(response)) return response;

    if (Array.isArray(response?.assessments)) {
        return response.assessments;
    }

    if (Array.isArray(response?.data?.assessments)) {
        return response.data.assessments;
    }

    if (Array.isArray(response?.data)) {
        return response.data;
    }

    if (Array.isArray(response?.results)) {
        return response.results;
    }

    return [];
};

const getAssessmentId = (assessment) =>
    assessment?._id ||
    assessment?.id ||
    assessment?.assessmentId ||
    "";

const getAssessmentReference = (assessment) =>
    assessment?.reference ||
    assessment?.referenceNumber ||
    assessment?.assessmentReference ||
    assessment?.applicationReference ||
    (
        getAssessmentId(assessment)
            ? getAssessmentId(assessment)
                .slice(-8)
                .toUpperCase()
            : "Pending reference"
    );

const getAssessmentTitle = (assessment) =>
    assessment?.opportunityTitle ||
    assessment?.programTitle ||
    assessment?.programmeTitle ||
    assessment?.opportunity?.title ||
    assessment?.opportunity?.name ||
    assessment?.program?.title ||
    assessment?.programme?.title ||
    assessment?.title ||
    "Trainee & Apprenticeship Programme";

const getCountry = (assessment) =>
    assessment?.country ||
    assessment?.destinationCountry ||
    assessment?.opportunity?.country ||
    assessment?.program?.country ||
    assessment?.programme?.country ||
    "Destination not specified";

const getStatus = (assessment) =>
    String(
        assessment?.status ||
        assessment?.assessmentStatus ||
        "SUBMITTED"
    )
        .trim()
        .toUpperCase()
        .replace(/[\s-]+/g, "_");

const STATUS_LABELS = {
    SUBMITTED: "Submitted",
    PENDING: "Pending review",
    UNDER_REVIEW: "Under review",
    IN_REVIEW: "Under review",
    PROCESSING: "Processing",
    DOCUMENT_REQUEST: "Documents requested",
    DOCUMENTS_REQUESTED: "Documents requested",
    APPROVED: "Approved",
    ACCEPTED: "Accepted",
    REJECTED: "Not approved",
    DECLINED: "Declined",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
    DRAFT: "Draft",
};

const getStatusLabel = (status) =>
    STATUS_LABELS[status] ||
    status
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/\b\w/g, (letter) =>
            letter.toUpperCase()
        );

const getStatusClass = (status) => {
    if (
        ["APPROVED", "ACCEPTED", "COMPLETED"].includes(status)
    ) {
        return "approved";
    }

    if (
        ["REJECTED", "DECLINED", "CANCELLED"].includes(status)
    ) {
        return "rejected";
    }

    if (
        [
            "UNDER_REVIEW",
            "IN_REVIEW",
            "PROCESSING",
            "DOCUMENT_REQUEST",
            "DOCUMENTS_REQUESTED",
        ].includes(status)
    ) {
        return "review";
    }

    if (status === "DRAFT") {
        return "draft";
    }

    return "pending";
};

const formatDate = (date) => {
    if (!date) return "Date unavailable";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "Date unavailable";
    }

    return new Intl.DateTimeFormat("en-NG", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(parsedDate);
};

const getSubmittedDate = (assessment) =>
    assessment?.submittedAt ||
    assessment?.createdAt ||
    assessment?.submissionDate ||
    assessment?.updatedAt;

const getDocuments = (assessment) => {
    const documents =
        assessment?.documents ||
        assessment?.uploadedDocuments ||
        assessment?.assessmentDocuments ||
        [];

    return Array.isArray(documents) ? documents : [];
};

const getDocumentCount = (assessment) =>
    getDocuments(assessment).length;

/* ============================================================
   MY ASSESSMENTS
============================================================ */

export default function MyAssessments() {
    const [assessments, setAssessments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const [selectedAssessment, setSelectedAssessment] =
        useState(null);

    const [modalRefreshing, setModalRefreshing] =
        useState(false);

    /* ========================================================
       LOAD ASSESSMENTS
    ======================================================== */

    const loadAssessments = useCallback(
        async (isRefresh = false) => {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            try {
                const token = getAuthToken();

                if (!token) {
                    setAssessments([]);

                    setError(
                        "Your session could not be found. Please sign in again."
                    );

                    return;
                }

                const response = await fetch(
                    `${API_BASE_URL}/assessments/my`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            Accept: "application/json",
                        },
                    }
                );

                const result = await response
                    .json()
                    .catch(() => ({}));

                if (
                    response.status === 401 ||
                    response.status === 403
                ) {
                    throw new Error(
                        "Your session has expired. Please sign in again."
                    );
                }

                if (!response.ok) {
                    throw new Error(
                        result?.message ||
                        result?.error ||
                        "Unable to load your assessments."
                    );
                }

                setAssessments(getAssessmentArray(result));
            } catch (err) {
                setError(
                    err.message ||
                    "Something went wrong while loading assessments."
                );
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        []
    );

    useEffect(() => {
        loadAssessments();
    }, [loadAssessments]);

    /* ========================================================
       MODAL CONTROLS
    ======================================================== */

    const closeAssessmentModal = useCallback(() => {
        setSelectedAssessment(null);
    }, []);

    const openAssessmentModal = (assessment) => {
        setSelectedAssessment(assessment);
    };

    useEffect(() => {
        if (!selectedAssessment) return undefined;

        const previousOverflow =
            document.body.style.overflow;

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                closeAssessmentModal();
            }
        };

        document.body.style.overflow = "hidden";

        window.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => {
            document.body.style.overflow =
                previousOverflow;

            window.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };
    }, [
        selectedAssessment,
        closeAssessmentModal,
    ]);

    const refreshSelectedAssessment = async () => {
        if (!selectedAssessment || modalRefreshing) {
            return;
        }

        setModalRefreshing(true);

        try {
            await loadAssessments(true);
        } finally {
            setModalRefreshing(false);
        }
    };

    /* ========================================================
       SUMMARY CARDS
    ======================================================== */

    const summary = useMemo(() => {
        const activeStatuses = [
            "SUBMITTED",
            "PENDING",
            "UNDER_REVIEW",
            "IN_REVIEW",
            "PROCESSING",
            "DOCUMENT_REQUEST",
            "DOCUMENTS_REQUESTED",
        ];

        const approvedStatuses = [
            "APPROVED",
            "ACCEPTED",
            "COMPLETED",
        ];

        return {
            total: assessments.length,

            active: assessments.filter((item) =>
                activeStatuses.includes(getStatus(item))
            ).length,

            approved: assessments.filter((item) =>
                approvedStatuses.includes(getStatus(item))
            ).length,

            documents: assessments.reduce(
                (total, item) =>
                    total + getDocumentCount(item),
                0
            ),
        };
    }, [assessments]);

    /* ========================================================
       SEARCH AND FILTER
    ======================================================== */

    const filteredAssessments = useMemo(() => {
        const query = search.trim().toLowerCase();

        return assessments.filter((assessment) => {
            const status = getStatus(assessment);

            const matchesStatus =
                statusFilter === "ALL" ||
                status === statusFilter;

            const searchableText = [
                getAssessmentTitle(assessment),
                getAssessmentReference(assessment),
                getCountry(assessment),
                status,
            ]
                .join(" ")
                .toLowerCase();

            return (
                matchesStatus &&
                (!query || searchableText.includes(query))
            );
        });
    }, [
        assessments,
        search,
        statusFilter,
    ]);

    /* ========================================================
       SELECTED ASSESSMENT DATA
    ======================================================== */

    const currentAssessment = selectedAssessment
        ? assessments.find(
            (item) =>
                getAssessmentId(item) ===
                getAssessmentId(selectedAssessment)
        ) || selectedAssessment
        : null;

    const currentStatus = currentAssessment
        ? getStatus(currentAssessment)
        : "";

    const selectedDocuments = currentAssessment
        ? getDocuments(currentAssessment)
        : [];

    const updatesSource = currentAssessment
        ? (
            currentAssessment.adminUpdates ||
            currentAssessment.updates ||
            currentAssessment.statusHistory ||
            currentAssessment.activity ||
            currentAssessment.timeline ||
            []
        )
        : [];

    const adminUpdates = Array.isArray(updatesSource)
        ? updatesSource
        : [];

    const latestAdminNote = currentAssessment
        ? (
            currentAssessment.adminNote ||
            currentAssessment.reviewNotes ||
            currentAssessment.adminFeedback ||
            currentAssessment.reviewComment ||
            currentAssessment.staffNote ||
            ""
        )
        : "";

    /* ========================================================
       RENDER
    ======================================================== */

    return (
        <main className="my-assessments">

            {/* HERO */}

            <section className="ma-hero">
                <div className="ma-hero-content">
                    <div className="ma-eyebrow">
                        <span className="ma-eyebrow-icon">
                            <ClipboardCheck size={16} />
                        </span>

                        APPLICATION CENTRE
                    </div>

                    <h1>My Assessments</h1>

                    <p>
                        Track your trainee and apprenticeship
                        assessments, monitor their progress,
                        and keep your application information
                        in one place.
                    </p>
                </div>

                <div
                    className="ma-hero-art"
                    aria-hidden="true"
                >
                    <div className="ma-art-circle ma-art-circle-one" />
                    <div className="ma-art-circle ma-art-circle-two" />

                    <div className="ma-art-card">
                        <div className="ma-art-card-top">
                            <span className="ma-art-check">
                                <CheckCircle2 size={22} />
                            </span>

                            <span className="ma-art-card-label">
                                APPLICATION STATUS
                            </span>
                        </div>

                        <div className="ma-art-progress">
                            <span />
                        </div>

                        <div className="ma-art-card-bottom">
                            <span>Application submitted</span>
                            <CheckCircle2 size={16} />
                        </div>
                    </div>
                </div>
            </section>

            {/* SUMMARY */}

            <section className="ma-summary-grid">
                <article className="ma-summary-card">
                    <div className="ma-summary-icon ma-icon-blue">
                        <ClipboardCheck size={21} />
                    </div>

                    <div>
                        <span className="ma-summary-label">
                            Total assessments
                        </span>

                        <strong>
                            {loading ? "—" : summary.total}
                        </strong>

                        <small>All your applications</small>
                    </div>
                </article>

                <article className="ma-summary-card">
                    <div className="ma-summary-icon ma-icon-orange">
                        <Clock3 size={21} />
                    </div>

                    <div>
                        <span className="ma-summary-label">
                            In progress
                        </span>

                        <strong>
                            {loading ? "—" : summary.active}
                        </strong>

                        <small>
                            Awaiting or undergoing review
                        </small>
                    </div>
                </article>

                <article className="ma-summary-card">
                    <div className="ma-summary-icon ma-icon-green">
                        <CheckCircle2 size={21} />
                    </div>

                    <div>
                        <span className="ma-summary-label">
                            Approved
                        </span>

                        <strong>
                            {loading ? "—" : summary.approved}
                        </strong>

                        <small>Approved or completed</small>
                    </div>
                </article>

                <article className="ma-summary-card">
                    <div className="ma-summary-icon ma-icon-purple">
                        <FolderOpen size={21} />
                    </div>

                    <div>
                        <span className="ma-summary-label">
                            Documents
                        </span>

                        <strong>
                            {loading ? "—" : summary.documents}
                        </strong>

                        <small>Uploaded application files</small>
                    </div>
                </article>
            </section>

            {/* ASSESSMENT LIST */}

            <section className="ma-list-section">
                <div className="ma-section-heading">
                    <div>
                        <span className="ma-section-kicker">
                            YOUR APPLICATIONS
                        </span>

                        <h2>Assessment history</h2>

                        <p>
                            View the current status of each
                            application you have submitted.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="ma-refresh-button"
                        onClick={() => loadAssessments(true)}
                        disabled={loading || refreshing}
                    >
                        <RefreshCw
                            size={16}
                            className={
                                refreshing ? "ma-spinning" : ""
                            }
                        />

                        {refreshing
                            ? "Refreshing"
                            : "Refresh"}
                    </button>
                </div>

                {/* SEARCH */}

                <div className="ma-toolbar">
                    <label className="ma-search">
                        <Search size={18} />

                        <input
                            type="search"
                            placeholder="Search by programme, country or reference..."
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                        />
                    </label>

                    <select
                        className="ma-status-filter"
                        value={statusFilter}
                        onChange={(event) =>
                            setStatusFilter(event.target.value)
                        }
                        aria-label="Filter assessments by status"
                    >
                        <option value="ALL">
                            All statuses
                        </option>

                        <option value="SUBMITTED">
                            Submitted
                        </option>

                        <option value="PENDING">
                            Pending
                        </option>

                        <option value="UNDER_REVIEW">
                            Under review
                        </option>

                        <option value="APPROVED">
                            Approved
                        </option>

                        <option value="REJECTED">
                            Not approved
                        </option>

                        <option value="COMPLETED">
                            Completed
                        </option>
                    </select>
                </div>

                {/* ERRORS */}

                {error && (
                    <div className="ma-error">
                        <AlertCircle size={20} />

                        <div>
                            <strong>
                                We couldn't load your assessments
                            </strong>

                            <p>{error}</p>
                        </div>

                        <button
                            type="button"
                            onClick={() => loadAssessments()}
                        >
                            Try again
                        </button>
                    </div>
                )}

                {/* LOADING */}

                {loading ? (
                    <div className="ma-loading-grid">
                        {[1, 2, 3].map((item) => (
                            <div
                                className="ma-skeleton-card"
                                key={item}
                            >
                                <div className="ma-skeleton ma-skeleton-title" />
                                <div className="ma-skeleton ma-skeleton-line" />
                                <div className="ma-skeleton ma-skeleton-line short" />
                                <div className="ma-skeleton ma-skeleton-button" />
                            </div>
                        ))}
                    </div>
                ) : !error &&
                    filteredAssessments.length === 0 ? (

                    /* EMPTY STATE */

                    <div className="ma-empty-state">
                        <div className="ma-empty-icon">
                            {assessments.length === 0 ? (
                                <GraduationCap size={30} />
                            ) : (
                                <Search size={28} />
                            )}
                        </div>

                        <h3>
                            {assessments.length === 0
                                ? "Your journey starts here"
                                : "No matching assessments"}
                        </h3>

                        <p>
                            {assessments.length === 0
                                ? "You haven't submitted an assessment yet. Explore available programmes and take your next step."
                                : "Try a different search term or change the status filter."}
                        </p>

                        {assessments.length === 0 ? (
                            <Link
                                to="/opportunities"
                                className="ma-primary-button"
                            >
                                Explore programmes
                                <ArrowUpRight size={17} />
                            </Link>
                        ) : (
                            <button
                                type="button"
                                className="ma-secondary-button"
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

                    /* ASSESSMENT CARDS */

                    <div className="ma-assessment-list">
                        {filteredAssessments.map(
                            (assessment, index) => {
                                const id = getAssessmentId(assessment);
                                const status = getStatus(assessment);
                                const documentCount =
                                    getDocumentCount(assessment);

                                return (
                                    <article
                                        className="ma-assessment-card"
                                        key={id || `assessment-${index}`}
                                    >
                                        <div className="ma-card-main">
                                            <div className="ma-card-icon">
                                                <GraduationCap size={24} />
                                            </div>

                                            <div className="ma-card-content">
                                                <div className="ma-card-title-row">
                                                    <h3>
                                                        {getAssessmentTitle(
                                                            assessment
                                                        )}
                                                    </h3>

                                                    <span
                                                        className={`ma-status-badge ma-status-${getStatusClass(
                                                            status
                                                        )}`}
                                                    >
                                                        <span className="ma-status-dot" />

                                                        {getStatusLabel(status)}
                                                    </span>
                                                </div>

                                                <p className="ma-reference">
                                                    Reference:{" "}
                                                    <strong>
                                                        {getAssessmentReference(
                                                            assessment
                                                        )}
                                                    </strong>
                                                </p>

                                                <div className="ma-card-meta">
                                                    <span>
                                                        <MapPin size={15} />
                                                        {getCountry(assessment)}
                                                    </span>

                                                    <span>
                                                        <CalendarDays size={15} />
                                                        Submitted{" "}
                                                        {formatDate(
                                                            getSubmittedDate(
                                                                assessment
                                                            )
                                                        )}
                                                    </span>

                                                    <span>
                                                        <FileText size={15} />

                                                        {documentCount}{" "}
                                                        {documentCount === 1
                                                            ? "document"
                                                            : "documents"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="ma-card-footer">
                                            <span className="ma-card-footer-note">
                                                {status === "APPROVED" ||
                                                    status === "ACCEPTED"
                                                    ? "Your application has been approved."
                                                    : status === "REJECTED" ||
                                                        status === "DECLINED"
                                                        ? "Review your application status for further information."
                                                        : status === "DOCUMENT_REQUEST" ||
                                                            status === "DOCUMENTS_REQUESTED"
                                                            ? "Additional documents may be required."
                                                            : "Check your application for the latest updates."}
                                            </span>

                                            {id ? (
                                                <button
                                                    type="button"
                                                    className="ma-view-button"
                                                    onClick={() =>
                                                        openAssessmentModal(
                                                            assessment
                                                        )
                                                    }
                                                >
                                                    View assessment
                                                    <ChevronRight size={17} />
                                                </button>
                                            ) : (
                                                <span className="ma-unavailable-link">
                                                    Reference unavailable
                                                </span>
                                            )}
                                        </div>
                                    </article>
                                );
                            }
                        )}
                    </div>
                )}

                {!loading &&
                    !error &&
                    filteredAssessments.length > 0 && (
                        <div className="ma-results-footer">
                            Showing{" "}
                            <strong>
                                {filteredAssessments.length}
                            </strong>{" "}
                            of{" "}
                            <strong>
                                {assessments.length}
                            </strong>{" "}
                            assessments
                        </div>
                    )}
            </section>

            {/* SUPPORT */}

            <section className="ma-help-banner">
                <div className="ma-help-icon">
                    <AlertCircle size={22} />
                </div>

                <div>
                    <h3>
                        Need help with your application?
                    </h3>

                    <p>
                        If you have questions about your assessment
                        or its status, contact the Colossus support
                        team for assistance.
                    </p>
                </div>

                <Link
                    to="/contact"
                    className="ma-help-link"
                >
                    Contact support
                    <ArrowUpRight size={17} />
                </Link>
            </section>

            {/* ====================================================
                ASSESSMENT DETAILS MODAL
            ==================================================== */}

            {currentAssessment && (
                <div
                    className="ma-modal-backdrop"
                    onMouseDown={(event) => {
                        if (
                            event.target === event.currentTarget
                        ) {
                            closeAssessmentModal();
                        }
                    }}
                >
                    <section
                        className="ma-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="ma-modal-title"
                    >
                        {/* MODAL HEADER */}

                        <header className="ma-modal-header">
                            <div className="ma-modal-heading-icon">
                                <GraduationCap size={24} />
                            </div>

                            <div className="ma-modal-heading-copy">
                                <span className="ma-modal-eyebrow">
                                    ASSESSMENT DETAILS
                                </span>

                                <h2 id="ma-modal-title">
                                    {getAssessmentTitle(
                                        currentAssessment
                                    )}
                                </h2>

                                <p>
                                    Reference:{" "}
                                    <strong>
                                        {getAssessmentReference(
                                            currentAssessment
                                        )}
                                    </strong>
                                </p>
                            </div>

                            <button
                                type="button"
                                className="ma-modal-close"
                                onClick={closeAssessmentModal}
                                aria-label="Close assessment details"
                            >
                                <X size={21} />
                            </button>
                        </header>

                        {/* MODAL BODY */}

                        <div className="ma-modal-body">

                            {/* STATUS AND REFRESH */}

                            <div className="ma-modal-status-row">
                                <span
                                    className={`ma-status-badge ma-status-${getStatusClass(
                                        currentStatus
                                    )}`}
                                >
                                    <span className="ma-status-dot" />

                                    {getStatusLabel(currentStatus)}
                                </span>

                                <button
                                    type="button"
                                    className="ma-modal-refresh"
                                    onClick={refreshSelectedAssessment}
                                    disabled={modalRefreshing}
                                >
                                    <RefreshCw
                                        size={15}
                                        className={
                                            modalRefreshing
                                                ? "ma-spinning"
                                                : ""
                                        }
                                    />

                                    {modalRefreshing
                                        ? "Checking updates..."
                                        : "Check for updates"}
                                </button>
                            </div>

                            {/* ASSESSMENT INFORMATION */}

                            <div className="ma-modal-details-grid">
                                <div className="ma-modal-detail">
                                    <MapPin size={17} />

                                    <div>
                                        <span>Destination</span>

                                        <strong>
                                            {getCountry(
                                                currentAssessment
                                            )}
                                        </strong>
                                    </div>
                                </div>

                                <div className="ma-modal-detail">
                                    <CalendarDays size={17} />

                                    <div>
                                        <span>Date submitted</span>

                                        <strong>
                                            {formatDate(
                                                getSubmittedDate(
                                                    currentAssessment
                                                )
                                            )}
                                        </strong>
                                    </div>
                                </div>

                                <div className="ma-modal-detail">
                                    <FileText size={17} />

                                    <div>
                                        <span>Documents submitted</span>

                                        <strong>
                                            {selectedDocuments.length}
                                        </strong>
                                    </div>
                                </div>

                                <div className="ma-modal-detail">
                                    <Clock3 size={17} />

                                    <div>
                                        <span>Last updated</span>

                                        <strong>
                                            {formatDate(
                                                currentAssessment.updatedAt ||
                                                currentAssessment.lastUpdatedAt
                                            )}
                                        </strong>
                                    </div>
                                </div>
                            </div>

                            {/* ADMIN UPDATES */}

                            <section className="ma-modal-section">
                                <div className="ma-modal-section-title">
                                    <MessageSquare size={18} />

                                    <h3>
                                        Updates from Colossus
                                    </h3>
                                </div>

                                {latestAdminNote && (
                                    <article className="ma-admin-note">
                                        <div className="ma-admin-note-heading">
                                            <UserRound size={16} />

                                            <strong>
                                                Message from the review team
                                            </strong>
                                        </div>

                                        <p>
                                            {String(latestAdminNote)}
                                        </p>

                                        {currentAssessment.adminNoteUpdatedAt && (
                                            <small>
                                                {formatDate(
                                                    currentAssessment.adminNoteUpdatedAt
                                                )}
                                            </small>
                                        )}
                                    </article>
                                )}

                                {adminUpdates.length > 0 && (
                                    <div className="ma-update-timeline">
                                        {adminUpdates.map(
                                            (update, updateIndex) => {
                                                const updateMessage =
                                                    update?.message ||
                                                    update?.note ||
                                                    update?.comment ||
                                                    update?.description ||
                                                    update?.details ||
                                                    update?.text ||
                                                    "Your assessment has been updated.";

                                                const updateDate =
                                                    update?.createdAt ||
                                                    update?.updatedAt ||
                                                    update?.date ||
                                                    update?.timestamp;

                                                return (
                                                    <article
                                                        className="ma-update-item"
                                                        key={
                                                            update?._id ||
                                                            update?.id ||
                                                            `${updateDate || "update"}-${updateIndex}`
                                                        }
                                                    >
                                                        <span className="ma-update-marker" />

                                                        <div className="ma-update-content">
                                                            <div className="ma-update-title-row">
                                                                <strong>
                                                                    {update?.title ||
                                                                        update?.statusLabel ||
                                                                        update?.status ||
                                                                        "Assessment update"}
                                                                </strong>

                                                                {updateDate && (
                                                                    <time>
                                                                        {formatDate(
                                                                            updateDate
                                                                        )}
                                                                    </time>
                                                                )}
                                                            </div>

                                                            <p>
                                                                {String(
                                                                    updateMessage
                                                                )}
                                                            </p>

                                                            {(update?.createdByName ||
                                                                update?.authorName ||
                                                                update?.updatedByName) && (
                                                                    <small>
                                                                        By{" "}
                                                                        {update.createdByName ||
                                                                            update.authorName ||
                                                                            update.updatedByName}
                                                                    </small>
                                                                )}
                                                        </div>
                                                    </article>
                                                );
                                            }
                                        )}
                                    </div>
                                )}

                                {!latestAdminNote &&
                                    adminUpdates.length === 0 && (
                                        <div className="ma-no-updates">
                                            <MessageSquare size={21} />

                                            <div>
                                                <strong>
                                                    No team updates yet
                                                </strong>

                                                <p>
                                                    When the Colossus team
                                                    adds a note or changes
                                                    your assessment status,
                                                    it will appear here.
                                                    Use “Check for updates”
                                                    to reload the latest
                                                    information.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                            </section>

                            {/* DOCUMENTS */}

                            <section className="ma-modal-section">
                                <div className="ma-modal-section-title">
                                    <Paperclip size={18} />

                                    <h3>
                                        Submitted documents
                                    </h3>
                                </div>

                                {selectedDocuments.length > 0 ? (
                                    <div className="ma-modal-documents">
                                        {selectedDocuments.map(
                                            (document, index) => (
                                                <div
                                                    className="ma-modal-document"
                                                    key={
                                                        document?._id ||
                                                        document?.id ||
                                                        index
                                                    }
                                                >
                                                    <FileText size={17} />

                                                    <span>
                                                        {document?.originalName ||
                                                            document?.fileName ||
                                                            document?.name ||
                                                            document?.filename ||
                                                            `Document ${index + 1}`}
                                                    </span>
                                                </div>
                                            )
                                        )}
                                    </div>
                                ) : (
                                    <p className="ma-modal-muted">
                                        No document details were returned
                                        for this assessment.
                                    </p>
                                )}
                            </section>

                            <p className="ma-modal-security-note">
                                Your assessment details are visible only
                                in your signed-in client portal.
                            </p>
                        </div>

                        {/* MODAL FOOTER */}

                        <footer className="ma-modal-footer">
                            <button
                                type="button"
                                className="ma-secondary-button"
                                onClick={closeAssessmentModal}
                            >
                                Close
                            </button>
                        </footer>
                    </section>
                </div>
            )}
        </main>
    );
}