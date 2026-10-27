import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    Activity,
    AlertCircle,
    ArrowDownLeft,
    ArrowLeft,
    ArrowUpRight,
    CalendarDays,
    Check,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Clock3,
    Download,
    Eye,
    FileText,
    GraduationCap,
    LoaderCircle,
    Mail,
    MapPin,
    MessageSquare,
    Phone,
    RefreshCw,
    Search,
    ShieldCheck,
    SlidersHorizontal,
    UserRound,
    Users,
    X,
} from "lucide-react";

import "./AdminAssessment.css";

/*
|--------------------------------------------------------------------------
| API CONFIGURATION
|--------------------------------------------------------------------------
*/

const API_BASE_URL = (
    import.meta.env.VITE_API_URL || "/api/v1"
).replace(/\/$/, "");

/*
|--------------------------------------------------------------------------
| ASSESSMENT CONSTANTS
|--------------------------------------------------------------------------
*/

const ASSESSMENT_STATUSES = [
    "PENDING",
    "UNDER_REVIEW",
    "CONTACTED",
    "QUALIFIED",
    "NOT_QUALIFIED",
    "CONVERTED",
    "WITHDRAWN",
];

const STATUS_LABELS = {
    PENDING: "Pending review",
    UNDER_REVIEW: "Under review",
    CONTACTED: "Contacted",
    QUALIFIED: "Qualified",
    NOT_QUALIFIED: "Not qualified",
    CONVERTED: "Converted",
    WITHDRAWN: "Withdrawn",
};

const STATUS_DESCRIPTIONS = {
    PENDING: "This assessment is awaiting review.",
    UNDER_REVIEW: "This candidate is currently being evaluated.",
    CONTACTED: "The candidate has been contacted.",
    QUALIFIED: "The candidate has been marked as qualified.",
    NOT_QUALIFIED: "The candidate has been marked as not qualified.",
    CONVERTED: "This assessment has progressed to the application stage.",
    WITHDRAWN: "This assessment has been withdrawn.",
};

/*
|--------------------------------------------------------------------------
| AUTHENTICATION
|--------------------------------------------------------------------------
*/

function getAuthToken() {
    const possibleKeys = [
        "colossus_token",
        "token",
        "accessToken",
        "authToken",
        "access_token",
    ];

    for (const key of possibleKeys) {
        const value = localStorage.getItem(key);

        if (value) {
            return value;
        }
    }

    try {
        const user = JSON.parse(localStorage.getItem("user") || "null");

        if (user?.token) return user.token;
        if (user?.accessToken) return user.accessToken;
    } catch {
        // Ignore invalid cached user data.
    }

    return null;
}

/*
|--------------------------------------------------------------------------
| JSON API REQUEST
|--------------------------------------------------------------------------
*/

async function apiRequest(path, options = {}) {
    const token = getAuthToken();

    if (!token) {
        const error = new Error(
            "No access token was found. Please sign in again."
        );

        error.status = 401;

        throw error;
    }

    const headers = {
        Accept: "application/json",
        ...(options.body
            ? { "Content-Type": "application/json" }
            : {}),
        Authorization: `Bearer ${token}`,
        ...options.headers,
    };

    const requestUrl = `${API_BASE_URL}${path}`;

    const response = await fetch(requestUrl, {
        ...options,
        headers,
    });

    const rawResponse = await response.text();

    let result = {};

    try {
        result = rawResponse ? JSON.parse(rawResponse) : {};
    } catch {
        result = {
            message: rawResponse,
        };
    }

    if (!response.ok || result.success === false) {
        const error = new Error(
            result.message ||
            result.error ||
            `Request failed (${response.status}).`
        );

        error.status = response.status;
        error.response = result;

        console.error("Assessment API request failed:", {
            url: requestUrl,
            status: response.status,
            message: error.message,
        });

        throw error;
    }

    return result;
}

/*
|--------------------------------------------------------------------------
| DATE AND VALUE HELPERS
|--------------------------------------------------------------------------
*/

function formatDate(value) {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "—";

    return new Intl.DateTimeFormat("en-NG", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(date);
}

function formatDateTime(value) {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "—";

    return new Intl.DateTimeFormat("en-NG", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}

function formatMoney(value) {
    if (value === undefined || value === null || value === "") {
        return "Not specified";
    }

    const amount = Number(value);

    if (!Number.isFinite(amount)) {
        return String(value);
    }

    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 0,
    }).format(amount);
}

function getStatusClass(status) {
    return String(status || "PENDING")
        .toLowerCase()
        .replaceAll("_", "-");
}

function getCandidateName(assessment) {
    return (
        assessment?.personalDetails?.fullName ||
        assessment?.fullName ||
        "Unnamed candidate"
    );
}

function getCandidateEmail(assessment) {
    return (
        assessment?.personalDetails?.email ||
        assessment?.email ||
        ""
    );
}

function getCandidatePhone(assessment) {
    return (
        assessment?.personalDetails?.phone ||
        assessment?.phone ||
        ""
    );
}

function getProgramName(assessment) {
    return (
        assessment?.opportunity?.title ||
        assessment?.opportunityTitle ||
        assessment?.opportunity?.name ||
        "Trainee & Apprenticeship Program"
    );
}

function getCountryName(assessment) {
    return (
        assessment?.opportunity?.countryName ||
        assessment?.countryName ||
        ""
    );
}

function getDocuments(assessment) {
    return Array.isArray(assessment?.documents)
        ? assessment.documents
        : [];
}

function getAssessmentId(assessment) {
    return assessment?._id || assessment?.id;
}

function getAssessmentReference(assessment) {
    return assessment?.reference || "Reference unavailable";
}

function getErrorMessage(error) {
    if (error.status === 401) {
        return error.message || "Authentication failed. Please sign in again.";
    }

    if (error.status === 403) {
        return error.message || "You do not have permission to access this resource.";
    }

    return error.message || "Something went wrong. Please try again.";
}

/*
|--------------------------------------------------------------------------
| STATUS BADGE
|--------------------------------------------------------------------------
*/

function StatusBadge({ status }) {
    const value = status || "PENDING";

    return (
        <span
            className={`assessment-status assessment-status--${getStatusClass(value)}`}
        >
            <span className="assessment-status__dot" />

            {STATUS_LABELS[value] || value.replaceAll("_", " ")}
        </span>
    );
}

/*
|--------------------------------------------------------------------------
| METRIC CARD
|--------------------------------------------------------------------------
*/

function MetricCard({
    label,
    value,
    description,
    icon: Icon,
    tone = "blue",
    onClick,
    active = false,
}) {
    return (
        <button
            type="button"
            className={[
                "assessment-metric",
                `assessment-metric--${tone}`,
                active ? "assessment-metric--active" : "",
            ].join(" ")}
            onClick={onClick}
        >
            <div className="assessment-metric__top">
                <span className="assessment-metric__label">
                    {label}
                </span>

                <span className="assessment-metric__icon">
                    <Icon size={19} />
                </span>
            </div>

            <div className="assessment-metric__value">
                {value}
            </div>

            <div className="assessment-metric__description">
                {description}
            </div>
        </button>
    );
}

/*
|--------------------------------------------------------------------------
| EMPTY STATE
|--------------------------------------------------------------------------
*/

function EmptyState({ search, onReset }) {
    return (
        <div className="assessment-empty">
            <div className="assessment-empty__icon">
                <Users size={27} />
            </div>

            <h3>No assessments found</h3>

            <p>
                {search
                    ? "Try another search term or clear your filters."
                    : "Submitted trainee assessments will appear here."}
            </p>

            {search && (
                <button
                    type="button"
                    className="assessment-button assessment-button--secondary"
                    onClick={onReset}
                >
                    Clear filters
                </button>
            )}
        </div>
    );
}

/*
|--------------------------------------------------------------------------
| DOCUMENT LIST
|--------------------------------------------------------------------------
|
| View and Download use the authenticated backend endpoint.
| Cloudinary URLs are not exposed to the frontend.
|
*/

function DocumentList({
    documents,
    assessmentId,
    onViewDocument,
    onDownloadDocument,
    busyDocumentId,
}) {
    if (!documents.length) {
        return (
            <div className="assessment-document-empty">
                <FileText size={23} />

                <span>No supporting documents were uploaded.</span>
            </div>
        );
    }

    return (
        <div className="assessment-documents">
            {documents.map((file, index) => {
                const documentId = file._id || file.id;

                const isBusy =
                    String(busyDocumentId) === String(documentId);

                return (
                    <div
                        className="assessment-document"
                        key={
                            documentId ||
                            `${file.originalName}-${index}`
                        }
                    >
                        <div className="assessment-document__icon">
                            <FileText size={21} />
                        </div>

                        <div className="assessment-document__info">
                            <strong>
                                {file.documentLabel ||
                                    (file.documentType || "OTHER").replaceAll("_", " ")}
                            </strong>

                            <span className="assessment-document__filename">
                                {file.originalName || `Document ${index + 1}`}
                            </span>

                            <span>
                                {(file.documentType || "OTHER")
                                    .replaceAll("_", " ")}

                                {" · "}

                                {file.size
                                    ? `${(file.size / 1024).toFixed(0)} KB`
                                    : "Size unavailable"}
                            </span>
                        </div>

                        <div
                            style={{
                                display: "flex",
                                gap: 8,
                                alignItems: "center",
                            }}
                        >
                            <button
                                type="button"
                                className="assessment-document__action"
                                title="View document"
                                aria-label={`View ${file.originalName || "document"}`}
                                disabled={isBusy || !documentId}
                                onClick={() =>
                                    onViewDocument(
                                        assessmentId,
                                        file,
                                        documentId
                                    )
                                }
                            >
                                {isBusy ? (
                                    <LoaderCircle
                                        size={17}
                                        className="assessment-spin"
                                    />
                                ) : (
                                    <Eye size={17} />
                                )}
                            </button>

                            <button
                                type="button"
                                className="assessment-document__action"
                                title="Download document"
                                aria-label={`Download ${file.originalName || "document"}`}
                                disabled={isBusy || !documentId}
                                onClick={() =>
                                    onDownloadDocument(
                                        assessmentId,
                                        file,
                                        documentId
                                    )
                                }
                            >
                                <Download size={17} />
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

/*
|--------------------------------------------------------------------------
| CANDIDATE DETAILS DRAWER
|--------------------------------------------------------------------------
*/

function AssessmentDetails({
    assessment,
    loading,
    onClose,
    onStatusChange,
    onSaveNotes,
    savingStatus,
    savingNotes,
    error,
    onViewDocument,
    onDownloadDocument,
    busyDocumentId,
}) {
    const [notes, setNotes] = useState("");

    useEffect(() => {
        setNotes(assessment?.internalNotes || "");
    }, [
        assessment?._id,
        assessment?.id,
        assessment?.internalNotes,
    ]);

    if (!assessment) return null;

    const personal = assessment.personalDetails || {};
    const background = assessment.background || {};
    const preferences = assessment.preferences || {};

    const documents = getDocuments(assessment);
    const id = getAssessmentId(assessment);

    return (
        <div
            className="assessment-drawer-backdrop"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <aside
                className="assessment-drawer"
                role="dialog"
                aria-modal="true"
                aria-labelledby="assessment-detail-title"
            >
                <div className="assessment-drawer__header">
                    <div>
                        <span className="assessment-eyebrow">
                            ASSESSMENT DETAILS
                        </span>

                        <h2 id="assessment-detail-title">
                            Candidate profile
                        </h2>

                        <p>
                            {getAssessmentReference(assessment)}
                        </p>
                    </div>

                    <button
                        type="button"
                        className="assessment-icon-button"
                        onClick={onClose}
                        aria-label="Close candidate details"
                    >
                        <X size={20} />
                    </button>
                </div>

                {loading ? (
                    <div className="assessment-loading assessment-loading--drawer">
                        <LoaderCircle
                            className="assessment-spin"
                            size={26}
                        />

                        <span>
                            Loading complete assessment...
                        </span>
                    </div>
                ) : (
                    <div className="assessment-drawer__body">
                        {error && (
                            <div className="assessment-alert assessment-alert--error">
                                <AlertCircle size={18} />

                                {error}
                            </div>
                        )}

                        <section className="assessment-profile">
                            <div className="assessment-profile__avatar">
                                {getCandidateName(assessment)
                                    .split(/\s+/)
                                    .filter(Boolean)
                                    .slice(0, 2)
                                    .map((part) =>
                                        part[0]?.toUpperCase()
                                    )
                                    .join("") || "C"}
                            </div>

                            <div className="assessment-profile__info">
                                <h3>
                                    {getCandidateName(assessment)}
                                </h3>

                                <p>
                                    {getCandidateEmail(assessment)}
                                </p>

                                <StatusBadge
                                    status={assessment.status}
                                />
                            </div>
                        </section>

                        <section className="assessment-detail-section">
                            <div className="assessment-section-heading">
                                <span className="assessment-section-heading__icon">
                                    <UserRound size={18} />
                                </span>

                                <h3>Personal information</h3>
                            </div>

                            <div className="assessment-detail-grid">
                                <DetailField
                                    label="Full name"
                                    value={
                                        personal.fullName ||
                                        assessment.fullName
                                    }
                                />

                                <DetailField
                                    label="Email address"
                                    value={
                                        personal.email ||
                                        assessment.email
                                    }
                                    icon={Mail}
                                />

                                <DetailField
                                    label="Phone number"
                                    value={
                                        personal.phone ||
                                        assessment.phone
                                    }
                                    icon={Phone}
                                />

                                <DetailField
                                    label="Age"
                                    value={
                                        personal.age ??
                                        assessment.age
                                    }
                                />

                                <DetailField
                                    label="Country of residence"
                                    value={personal.countryOfResidence}
                                    icon={MapPin}
                                />

                                <DetailField
                                    label="Account linked"
                                    value={
                                        assessment.client
                                            ? "Yes"
                                            : "Not linked"
                                    }
                                />
                            </div>
                        </section>

                        <section className="assessment-detail-section">
                            <div className="assessment-section-heading">
                                <span className="assessment-section-heading__icon">
                                    <GraduationCap size={18} />
                                </span>

                                <h3>Education & experience</h3>
                            </div>

                            <div className="assessment-detail-grid">
                                <DetailField
                                    label="Highest education"
                                    value={background.education}
                                />

                                <DetailField
                                    label="Field of study"
                                    value={background.fieldOfStudy}
                                />

                                <DetailField
                                    label="Years of experience"
                                    value={
                                        background.yearsOfExperience ??
                                        "Not specified"
                                    }
                                />
                            </div>

                            <DetailField
                                label="Work experience"
                                value={background.workExperience}
                                multiline
                            />
                        </section>

                        <section className="assessment-detail-section">
                            <div className="assessment-section-heading">
                                <span className="assessment-section-heading__icon">
                                    <ArrowUpRight size={18} />
                                </span>

                                <h3>Program preferences</h3>
                            </div>

                            <div className="assessment-program-box">
                                <span className="assessment-program-box__label">
                                    SELECTED PROGRAM
                                </span>

                                <h4>
                                    {getProgramName(assessment)}
                                </h4>

                                <p>
                                    {getCountryName(assessment) ||
                                        "Country not specified"}
                                </p>
                            </div>

                            <div className="assessment-detail-grid">
                                <DetailField
                                    label="Training category"
                                    value={preferences.trainingCategory}
                                />

                                <DetailField
                                    label="Preferred course"
                                    value={preferences.preferredCourse}
                                />

                                <DetailField
                                    label="Preferred intake"
                                    value={preferences.preferredIntake}
                                />

                                <DetailField
                                    label="Budget"
                                    value={preferences.budget}
                                />

                                <DetailField
                                    label="Passport status"
                                    value={preferences.hasPassport}
                                />
                            </div>
                        </section>

                        <section className="assessment-detail-section">
                            <div className="assessment-section-heading">
                                <span className="assessment-section-heading__icon">
                                    <FileText size={18} />
                                </span>

                                <h3>Supporting documents</h3>

                                <span className="assessment-section-heading__count">
                                    {documents.length}
                                </span>
                            </div>

                            <DocumentList
                                documents={documents}
                                assessmentId={id}
                                onViewDocument={onViewDocument}
                                onDownloadDocument={onDownloadDocument}
                                busyDocumentId={busyDocumentId}
                            />
                        </section>

                        <section className="assessment-detail-section">
                            <div className="assessment-section-heading">
                                <span className="assessment-section-heading__icon">
                                    <MessageSquare size={18} />
                                </span>

                                <h3>Additional information</h3>
                            </div>

                            <div className="assessment-long-text">
                                {assessment.additionalInformation ||
                                    "The candidate did not provide additional information."}
                            </div>
                        </section>

                        <section className="assessment-detail-section">
                            <div className="assessment-section-heading">
                                <span className="assessment-section-heading__icon">
                                    <CalendarDays size={18} />
                                </span>

                                <h3>Submission information</h3>
                            </div>

                            <div className="assessment-detail-grid">
                                <DetailField
                                    label="Reference"
                                    value={getAssessmentReference(assessment)}
                                />

                                <DetailField
                                    label="Submitted"
                                    value={formatDateTime(
                                        assessment.submittedAt
                                    )}
                                />

                                <DetailField
                                    label="Privacy consent"
                                    value={
                                        assessment.consent?.privacyAccepted
                                            ? "Accepted"
                                            : "Not recorded"
                                    }
                                />

                                <DetailField
                                    label="Consent date"
                                    value={formatDateTime(
                                        assessment.consent?.acceptedAt
                                    )}
                                />
                            </div>
                        </section>

                        <section className="assessment-detail-section assessment-review-section">
                            <div className="assessment-section-heading">
                                <span className="assessment-section-heading__icon">
                                    <ShieldCheck size={18} />
                                </span>

                                <h3>Admin review</h3>
                            </div>

                            <label className="assessment-field-label">
                                Assessment status

                                <select
                                    value={assessment.status || "PENDING"}
                                    onChange={(event) =>
                                        onStatusChange(
                                            id,
                                            event.target.value
                                        )
                                    }
                                    disabled={savingStatus}
                                >
                                    {ASSESSMENT_STATUSES.map((status) => (
                                        <option
                                            key={status}
                                            value={status}
                                        >
                                            {STATUS_LABELS[status]}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <p className="assessment-review-hint">
                                {STATUS_DESCRIPTIONS[assessment.status] || ""}
                            </p>

                            <label className="assessment-field-label">
                                Internal review notes

                                <textarea
                                    rows={5}
                                    value={notes}
                                    onChange={(event) =>
                                        setNotes(event.target.value)
                                    }
                                    placeholder="Record internal observations and next steps..."
                                />
                            </label>

                            <button
                                type="button"
                                className="assessment-button assessment-button--primary assessment-notes-button"
                                onClick={() =>
                                    onSaveNotes(id, notes)
                                }
                                disabled={savingNotes}
                            >
                                {savingNotes ? (
                                    <LoaderCircle
                                        size={17}
                                        className="assessment-spin"
                                    />
                                ) : (
                                    <Check size={17} />
                                )}

                                {savingNotes
                                    ? "Saving notes..."
                                    : "Save review notes"}
                            </button>
                        </section>
                    </div>
                )}
            </aside>
        </div>
    );
}

/*
|--------------------------------------------------------------------------
| DETAIL FIELD
|--------------------------------------------------------------------------
*/

function DetailField({
    label,
    value,
    icon: Icon,
    multiline = false,
}) {
    const displayValue =
        value === undefined || value === null || value === ""
            ? "Not provided"
            : String(value);

    return (
        <div
            className={[
                "assessment-detail-field",
                multiline ? "assessment-detail-field--wide" : "",
            ].join(" ")}
        >
            <span>{label}</span>

            <strong>
                {Icon && <Icon size={15} />}

                {displayValue}
            </strong>
        </div>
    );
}

/*
|--------------------------------------------------------------------------
| MAIN ADMIN ASSESSMENTS PAGE
|--------------------------------------------------------------------------
*/

export default function AdminAssessments() {
    const [assessments, setAssessments] = useState([]);
    const [selectedAssessment, setSelectedAssessment] = useState(null);

    const [loading, setLoading] = useState(true);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const [error, setError] = useState("");
    const [detailsError, setDetailsError] = useState("");
    const [actionMessage, setActionMessage] = useState("");

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [programFilter, setProgramFilter] = useState("ALL");

    const [page, setPage] = useState(1);

    const [pagination, setPagination] = useState({
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 1,
    });

    const [savingStatus, setSavingStatus] = useState(false);
    const [savingNotes, setSavingNotes] = useState(false);

    /*
    |--------------------------------------------------------------------------
    | DOCUMENT PREVIEW STATE
    |--------------------------------------------------------------------------
    */

    const [busyDocumentId, setBusyDocumentId] = useState(null);
    const [documentPreview, setDocumentPreview] = useState(null);
    const [documentError, setDocumentError] = useState("");

    const [debouncedSearch, setDebouncedSearch] = useState("");

    /*
    |--------------------------------------------------------------------------
    | DEBOUNCE SEARCH
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search.trim());
            setPage(1);
        }, 350);

        return () => clearTimeout(timer);
    }, [search]);

    /*
    |--------------------------------------------------------------------------
    | FETCH ASSESSMENTS
    |--------------------------------------------------------------------------
    */

    const fetchAssessments = useCallback(
        async ({ silent = false } = {}) => {
            if (silent) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            try {
                const params = new URLSearchParams({
                    page: String(page),
                    limit: "20",
                });

                if (debouncedSearch) {
                    params.set("search", debouncedSearch);
                }

                if (statusFilter !== "ALL") {
                    params.set("status", statusFilter);
                }

                if (programFilter !== "ALL") {
                    params.set("opportunityId", programFilter);
                }

                const requestPath =
                    `/assessments/admin?${params.toString()}`;

                const result = await apiRequest(requestPath);

                const records = Array.isArray(result.data)
                    ? result.data
                    : Array.isArray(result.data?.assessments)
                        ? result.data.assessments
                        : [];

                setAssessments(records);

                setPagination(
                    result.pagination || {
                        page,
                        limit: 20,
                        total: records.length,
                        totalPages: 1,
                    }
                );
            } catch (requestError) {
                setError(getErrorMessage(requestError));
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        [
            page,
            debouncedSearch,
            statusFilter,
            programFilter,
        ]
    );

    useEffect(() => {
        fetchAssessments();
    }, [fetchAssessments]);

    /*
    |--------------------------------------------------------------------------
    | OPEN ASSESSMENT DETAILS
    |--------------------------------------------------------------------------
    */

    const openAssessment = async (assessment) => {
        setSelectedAssessment(assessment);
        setDetailsError("");
        setDetailsLoading(true);

        const id = getAssessmentId(assessment);

        if (!id) {
            setDetailsLoading(false);
            return;
        }

        try {
            const result = await apiRequest(
                `/assessments/admin/${encodeURIComponent(id)}`
            );

            setSelectedAssessment(result.data || assessment);
        } catch (requestError) {
            setDetailsError(getErrorMessage(requestError));
        } finally {
            setDetailsLoading(false);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | SUMMARY METRICS
    |--------------------------------------------------------------------------
    */

    const summary = useMemo(() => {
        const total = Number(
            pagination.total || assessments.length
        );

        return {
            total,

            pending: assessments.filter(
                (item) => item.status === "PENDING"
            ).length,

            reviewing: assessments.filter(
                (item) => item.status === "UNDER_REVIEW"
            ).length,

            qualified: assessments.filter(
                (item) => item.status === "QUALIFIED"
            ).length,

            contacted: assessments.filter(
                (item) => item.status === "CONTACTED"
            ).length,
        };
    }, [assessments, pagination.total]);

    /*
    |--------------------------------------------------------------------------
    | PROGRAM FILTER OPTIONS
    |--------------------------------------------------------------------------
    */

    const programOptions = useMemo(() => {
        const programs = new Map();

        assessments.forEach((assessment) => {
            const id =
                assessment.opportunity?._id ||
                assessment.opportunity?.id ||
                assessment.opportunity ||
                assessment.opportunityId;

            if (id) {
                programs.set(
                    String(id),
                    getProgramName(assessment)
                );
            }
        });

        return Array.from(programs.entries());
    }, [assessments]);

    /*
    |--------------------------------------------------------------------------
    | UPDATE ASSESSMENT STATUS
    |--------------------------------------------------------------------------
    */

    const handleStatusChange = async (id, status) => {
        if (!id || !ASSESSMENT_STATUSES.includes(status)) {
            return;
        }

        const previous = selectedAssessment;

        setSavingStatus(true);
        setDetailsError("");
        setActionMessage("");

        setSelectedAssessment((current) =>
            current
                ? {
                    ...current,
                    status,
                }
                : current
        );

        try {
            const result = await apiRequest(
                `/assessments/admin/${encodeURIComponent(id)}/status`,
                {
                    method: "PATCH",
                    body: JSON.stringify({ status }),
                }
            );

            if (result.data) {
                setSelectedAssessment((current) => ({
                    ...current,
                    ...result.data,
                }));
            }

            setActionMessage("Assessment status updated.");

            await fetchAssessments({ silent: true });
        } catch (requestError) {
            setSelectedAssessment(previous);

            setDetailsError(
                `Status update failed: ${getErrorMessage(requestError)}`
            );
        } finally {
            setSavingStatus(false);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | SAVE INTERNAL NOTES
    |--------------------------------------------------------------------------
    */

    const handleSaveNotes = async (id, notes) => {
        if (!id) return;

        setSavingNotes(true);
        setDetailsError("");
        setActionMessage("");

        try {
            const result = await apiRequest(
                `/assessments/admin/${encodeURIComponent(id)}/notes`,
                {
                    method: "PATCH",
                    body: JSON.stringify({
                        internalNotes: notes,
                    }),
                }
            );

            setSelectedAssessment((current) =>
                current
                    ? {
                        ...current,
                        internalNotes:
                            result.data?.internalNotes ?? notes,
                    }
                    : current
            );

            setActionMessage("Review notes saved.");
        } catch (requestError) {
            setDetailsError(
                `Could not save review notes: ${getErrorMessage(requestError)}`
            );
        } finally {
            setSavingNotes(false);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | DOCUMENT ENDPOINT
    |--------------------------------------------------------------------------
    */

    const getDocumentEndpoint = (
        assessmentId,
        documentId,
        download = false
    ) => {
        const basePath =
            `/assessments/admin/${encodeURIComponent(assessmentId)}` +
            `/documents/${encodeURIComponent(documentId)}`;

        return (
            `${API_BASE_URL}${basePath}` +
            (download ? "?download=1" : "")
        );
    };

    /*
    |--------------------------------------------------------------------------
    | FETCH PRIVATE DOCUMENT AS A BLOB
    |--------------------------------------------------------------------------
    |
    | This request sends the admin JWT directly to the protected backend.
    | It does not use or expose a Cloudinary URL.
    |
    */

    const fetchDocumentBlob = async (
        assessmentId,
        documentId,
        download = false
    ) => {
        const token = getAuthToken();

        if (!token) {
            const authError = new Error(
                "Your session has expired. Please sign in again."
            );

            authError.status = 401;

            throw authError;
        }

        const response = await fetch(
            getDocumentEndpoint(
                assessmentId,
                documentId,
                download
            ),
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "*/*",
                },
            }
        );

        if (!response.ok) {
            let message =
                `Unable to access document (${response.status}).`;

            try {
                const contentType =
                    response.headers.get("content-type") || "";

                if (contentType.includes("application/json")) {
                    const body = await response.json();

                    message =
                        body.message ||
                        body.error ||
                        message;
                } else {
                    const body = await response.text();

                    if (body) {
                        message = body.slice(0, 300);
                    }
                }
            } catch {
                // Keep the HTTP status message.
            }

            const error = new Error(message);

            error.status = response.status;

            throw error;
        }

        return response.blob();
    };

    /*
    |--------------------------------------------------------------------------
    | VIEW DOCUMENT INLINE
    |--------------------------------------------------------------------------
    */

    const handleViewDocument = async (
        assessmentId,
        file,
        documentId
    ) => {
        if (!assessmentId || !documentId) {
            setDocumentError(
                "This document is missing its assessment or document ID."
            );

            return;
        }

        setBusyDocumentId(documentId);
        setDocumentError("");

        try {
            const blob = await fetchDocumentBlob(
                assessmentId,
                documentId,
                false
            );

            const objectUrl = URL.createObjectURL(blob);

            setDocumentPreview((current) => {
                if (current?.url) {
                    URL.revokeObjectURL(current.url);
                }

                return {
                    url: objectUrl,
                    name: file.originalName || "Assessment document",
                    mimeType:
                        file.mimeType ||
                        blob.type ||
                        "application/octet-stream",
                };
            });
        } catch (requestError) {
            setDocumentError(
                getErrorMessage(requestError)
            );
        } finally {
            setBusyDocumentId(null);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | DOWNLOAD DOCUMENT
    |--------------------------------------------------------------------------
    */

    const handleDownloadDocument = async (
        assessmentId,
        fileDocument,
        documentId
    ) => {
        if (!assessmentId || !documentId) {
            setDocumentError(
                "This document is missing its assessment or document ID."
            );

            return;
        }

        setBusyDocumentId(documentId);
        setDocumentError("");

        try {
            const blob = await fetchDocumentBlob(
                assessmentId,
                documentId,
                true
            );

            const objectUrl = URL.createObjectURL(blob);

            const anchor = window.document.createElement("a");

            anchor.href = objectUrl;

            anchor.download =
                fileDocument.originalName ||
                "assessment-document";

            window.document.body.appendChild(anchor);

            anchor.click();

            anchor.remove();

            window.setTimeout(() => {
                URL.revokeObjectURL(objectUrl);
            }, 1000);
        } catch (requestError) {
            setDocumentError(
                getErrorMessage(requestError)
            );
        } finally {
            setBusyDocumentId(null);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | CLOSE DOCUMENT PREVIEW
    |--------------------------------------------------------------------------
    */

    const closeDocumentPreview = () => {
        setDocumentPreview((current) => {
            if (current?.url) {
                URL.revokeObjectURL(current.url);
            }

            return null;
        });
    };

    /*
    |--------------------------------------------------------------------------
    | CLEAN UP PREVIEW URL ON UNMOUNT
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        return () => {
            if (documentPreview?.url) {
                URL.revokeObjectURL(documentPreview.url);
            }
        };
    }, [documentPreview?.url]);

    /*
    |--------------------------------------------------------------------------
    | RESET FILTERS
    |--------------------------------------------------------------------------
    */

    const resetFilters = () => {
        setSearch("");
        setStatusFilter("ALL");
        setProgramFilter("ALL");
        setPage(1);
    };

    const activeFilters =
        search.trim() !== "" ||
        statusFilter !== "ALL" ||
        programFilter !== "ALL";

    /*
    |--------------------------------------------------------------------------
    | RENDER
    |--------------------------------------------------------------------------
    */

    return (
        <main className="assessments-page">
            <header className="assessments-header">
                <div className="assessments-header__main">
                    <div className="assessments-breadcrumb">
                        <span>Admin</span>

                        <ChevronRight size={14} />

                        <strong>Assessments</strong>
                    </div>

                    <div className="assessments-title-row">
                        <div className="assessments-title-icon">
                            <GraduationCap size={27} />
                        </div>

                        <div>
                            <h1>Program Assessments</h1>

                            <p>
                                Review candidate submissions for Australia
                                and New Zealand trainee programs.
                            </p>
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    className="assessment-button assessment-button--secondary"
                    onClick={() =>
                        fetchAssessments({ silent: true })
                    }
                    disabled={refreshing || loading}
                >
                    {refreshing ? (
                        <LoaderCircle
                            size={17}
                            className="assessment-spin"
                        />
                    ) : (
                        <RefreshCw size={17} />
                    )}

                    Refresh
                </button>
            </header>

            {actionMessage && (
                <div className="assessment-alert assessment-alert--success">
                    <CheckCircle2 size={18} />

                    {actionMessage}

                    <button
                        type="button"
                        onClick={() => setActionMessage("")}
                        aria-label="Dismiss notification"
                    >
                        <X size={16} />
                    </button>
                </div>
            )}

            {error && (
                <div className="assessment-alert assessment-alert--error">
                    <AlertCircle size={18} />

                    <div>
                        <strong>Unable to load assessments</strong>

                        <p>{error}</p>
                    </div>

                    <button
                        type="button"
                        onClick={() => fetchAssessments()}
                    >
                        Retry
                    </button>
                </div>
            )}

            <section className="assessment-metrics">
                <MetricCard
                    label="Total assessments"
                    value={loading ? "—" : summary.total}
                    description="All submitted records"
                    icon={Users}
                    tone="blue"
                    onClick={() => {
                        setStatusFilter("ALL");
                        setPage(1);
                    }}
                    active={statusFilter === "ALL"}
                />

                <MetricCard
                    label="Pending review"
                    value={loading ? "—" : summary.pending}
                    description="Awaiting initial review"
                    icon={Clock3}
                    tone="orange"
                    onClick={() => {
                        setStatusFilter("PENDING");
                        setPage(1);
                    }}
                    active={statusFilter === "PENDING"}
                />

                <MetricCard
                    label="Under review"
                    value={loading ? "—" : summary.reviewing}
                    description="Currently being assessed"
                    icon={Activity}
                    tone="purple"
                    onClick={() => {
                        setStatusFilter("UNDER_REVIEW");
                        setPage(1);
                    }}
                    active={statusFilter === "UNDER_REVIEW"}
                />

                <MetricCard
                    label="Qualified"
                    value={loading ? "—" : summary.qualified}
                    description="Marked as qualified"
                    icon={CheckCircle2}
                    tone="green"
                    onClick={() => {
                        setStatusFilter("QUALIFIED");
                        setPage(1);
                    }}
                    active={statusFilter === "QUALIFIED"}
                />

                <MetricCard
                    label="Contacted"
                    value={loading ? "—" : summary.contacted}
                    description="Candidates contacted"
                    icon={MessageSquare}
                    tone="cyan"
                    onClick={() => {
                        setStatusFilter("CONTACTED");
                        setPage(1);
                    }}
                    active={statusFilter === "CONTACTED"}
                />
            </section>

            <section className="assessment-table-card">
                <div className="assessment-table-card__header">
                    <div>
                        <h2>Assessment submissions</h2>

                        <p>
                            Review candidate information and track assessment progress.
                        </p>
                    </div>

                    <span className="assessment-record-count">
                        {pagination.total || 0} records
                    </span>
                </div>

                <div className="assessment-toolbar">
                    <label className="assessment-search">
                        <Search size={18} />

                        <input
                            type="search"
                            placeholder="Search name, email, phone or reference..."
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                        />

                        {search && (
                            <button
                                type="button"
                                onClick={() => setSearch("")}
                                aria-label="Clear search"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </label>

                    <label className="assessment-filter">
                        <SlidersHorizontal size={16} />

                        <select
                            value={statusFilter}
                            onChange={(event) => {
                                setStatusFilter(event.target.value);
                                setPage(1);
                            }}
                            aria-label="Filter by status"
                        >
                            <option value="ALL">
                                All statuses
                            </option>

                            {ASSESSMENT_STATUSES.map((status) => (
                                <option
                                    key={status}
                                    value={status}
                                >
                                    {STATUS_LABELS[status]}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="assessment-filter">
                        <GraduationCap size={17} />

                        <select
                            value={programFilter}
                            onChange={(event) => {
                                setProgramFilter(event.target.value);
                                setPage(1);
                            }}
                            aria-label="Filter by program"
                        >
                            <option value="ALL">
                                All programs
                            </option>

                            {programOptions.map(([id, name]) => (
                                <option
                                    key={id}
                                    value={id}
                                >
                                    {name}
                                </option>
                            ))}
                        </select>
                    </label>

                    {activeFilters && (
                        <button
                            type="button"
                            className="assessment-clear-filters"
                            onClick={resetFilters}
                        >
                            Clear filters
                        </button>
                    )}
                </div>

                <div className="assessment-table-scroll">
                    <table className="assessment-table">
                        <thead>
                            <tr>
                                <th>Candidate</th>
                                <th>Program</th>
                                <th>Education</th>
                                <th>Passport</th>
                                <th>Submitted</th>
                                <th>Status</th>
                                <th aria-label="Actions" />
                            </tr>
                        </thead>

                        <tbody>
                            {!loading &&
                                assessments.map((assessment) => {
                                    const id = getAssessmentId(assessment);

                                    const personal =
                                        assessment.personalDetails || {};

                                    const background =
                                        assessment.background || {};

                                    const preferences =
                                        assessment.preferences || {};

                                    return (
                                        <tr
                                            key={
                                                id ||
                                                assessment.reference
                                            }
                                        >
                                            <td>
                                                <button
                                                    type="button"
                                                    className="assessment-candidate-cell"
                                                    onClick={() =>
                                                        openAssessment(assessment)
                                                    }
                                                >
                                                    <span className="assessment-candidate-avatar">
                                                        {getCandidateName(assessment)
                                                            .split(/\s+/)
                                                            .filter(Boolean)
                                                            .slice(0, 2)
                                                            .map((part) =>
                                                                part[0]?.toUpperCase()
                                                            )
                                                            .join("") || "C"}
                                                    </span>

                                                    <span className="assessment-candidate-info">
                                                        <strong>
                                                            {getCandidateName(assessment)}
                                                        </strong>

                                                        <span>
                                                            {getCandidateEmail(assessment)}
                                                        </span>

                                                        <small>
                                                            {getAssessmentReference(assessment)}
                                                        </small>
                                                    </span>
                                                </button>
                                            </td>

                                            <td>
                                                <div className="assessment-program-cell">
                                                    <strong>
                                                        {getProgramName(assessment)}
                                                    </strong>

                                                    <span>
                                                        {getCountryName(assessment)}
                                                    </span>
                                                </div>
                                            </td>

                                            <td>
                                                <span className="assessment-table-primary">
                                                    {background.education ||
                                                        personal.education ||
                                                        "—"}
                                                </span>

                                                {background.fieldOfStudy && (
                                                    <span className="assessment-table-secondary">
                                                        {background.fieldOfStudy}
                                                    </span>
                                                )}
                                            </td>

                                            <td>
                                                <span
                                                    className={[
                                                        "assessment-passport",
                                                        String(
                                                            preferences.hasPassport || ""
                                                        )
                                                            .toLowerCase()
                                                            .replaceAll("_", "-"),
                                                    ].join(" ")}
                                                >
                                                    {preferences.hasPassport === "YES" ? (
                                                        <CheckCircle2 size={14} />
                                                    ) : (
                                                        <AlertCircle size={14} />
                                                    )}

                                                    {preferences.hasPassport
                                                        ? preferences.hasPassport.replaceAll(
                                                            "_",
                                                            " "
                                                        )
                                                        : "—"}
                                                </span>
                                            </td>

                                            <td>
                                                <span className="assessment-date-cell">
                                                    {formatDate(
                                                        assessment.submittedAt
                                                    )}
                                                </span>
                                            </td>

                                            <td>
                                                <StatusBadge
                                                    status={assessment.status}
                                                />
                                            </td>

                                            <td>
                                                <button
                                                    type="button"
                                                    className="assessment-view-button"
                                                    onClick={() =>
                                                        openAssessment(assessment)
                                                    }
                                                >
                                                    View

                                                    <ArrowUpRight size={15} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>

                    {loading && (
                        <div className="assessment-loading">
                            <LoaderCircle
                                size={27}
                                className="assessment-spin"
                            />

                            <span>
                                Loading submitted assessments...
                            </span>
                        </div>
                    )}

                    {!loading && assessments.length === 0 && (
                        <EmptyState
                            search={activeFilters}
                            onReset={resetFilters}
                        />
                    )}
                </div>

                <div className="assessment-pagination">
                    <span>
                        Showing{" "}
                        {pagination.total === 0
                            ? 0
                            : (page - 1) * pagination.limit + 1}
                        {" – "}
                        {Math.min(
                            page * pagination.limit,
                            pagination.total || 0
                        )}
                        {" of "}
                        {pagination.total || 0}
                    </span>

                    <div className="assessment-pagination__actions">
                        <button
                            type="button"
                            disabled={page <= 1 || loading}
                            onClick={() =>
                                setPage((current) =>
                                    Math.max(1, current - 1)
                                )
                            }
                            aria-label="Previous page"
                        >
                            <ChevronLeft size={18} />
                        </button>

                        <span>
                            Page {page} of{" "}
                            {Math.max(
                                1,
                                pagination.totalPages || 1
                            )}
                        </span>

                        <button
                            type="button"
                            disabled={
                                loading ||
                                page >= Math.max(
                                    1,
                                    pagination.totalPages || 1
                                )
                            }
                            onClick={() =>
                                setPage((current) =>
                                    Math.min(
                                        Math.max(
                                            1,
                                            pagination.totalPages || 1
                                        ),
                                        current + 1
                                    )
                                )
                            }
                            aria-label="Next page"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </section>

            <AssessmentDetails
                assessment={selectedAssessment}
                loading={detailsLoading}
                error={detailsError}
                onClose={() => {
                    setSelectedAssessment(null);
                    setDetailsError("");
                }}
                onStatusChange={handleStatusChange}
                onSaveNotes={handleSaveNotes}
                savingStatus={savingStatus}
                savingNotes={savingNotes}
                onViewDocument={handleViewDocument}
                onDownloadDocument={handleDownloadDocument}
                busyDocumentId={busyDocumentId}
            />

            {/* DOCUMENT ACCESS ERROR */}
            {documentError && (
                <div
                    role="alert"
                    className="assessment-alert assessment-alert--error"
                    style={{
                        position: "fixed",
                        right: 24,
                        bottom: 24,
                        zIndex: 1400,
                        maxWidth: 480,
                        boxShadow: "0 10px 35px rgba(0,0,0,.15)",
                    }}
                >
                    <AlertCircle size={18} />

                    <span>{documentError}</span>

                    <button
                        type="button"
                        onClick={() => setDocumentError("")}
                        aria-label="Dismiss document error"
                    >
                        <X size={16} />
                    </button>
                </div>
            )}

            {/* INLINE DOCUMENT PREVIEW MODAL */}
            {documentPreview && (
                <div
                    role="presentation"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            closeDocumentPreview();
                        }
                    }}
                    onKeyDown={(event) => {
                        if (event.key === "Escape") {
                            closeDocumentPreview();
                        }
                    }}
                    style={{
                        position: "fixed",
                        inset: 0,
                        zIndex: 1500,
                        background: "rgba(5, 15, 30, 0.78)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 20,
                    }}
                >
                    <section
                        role="dialog"
                        aria-modal="true"
                        aria-label={`Preview ${documentPreview.name}`}
                        style={{
                            width: "min(1100px, 100%)",
                            height: "min(850px, 94vh)",
                            background: "#fff",
                            borderRadius: 16,
                            overflow: "hidden",
                            display: "flex",
                            flexDirection: "column",
                            boxShadow: "0 24px 80px rgba(0,0,0,.35)",
                        }}
                    >
                        <header
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: 16,
                                padding: "14px 18px",
                                borderBottom: "1px solid #e5e7eb",
                                flexShrink: 0,
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 10,
                                    minWidth: 0,
                                }}
                            >
                                <FileText
                                    size={21}
                                    style={{ flexShrink: 0 }}
                                />

                                <strong
                                    style={{
                                        overflowWrap: "anywhere",
                                    }}
                                >
                                    {documentPreview.name}
                                </strong>
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    gap: 8,
                                    alignItems: "center",
                                    flexShrink: 0,
                                }}
                            >
                                <a
                                    href={documentPreview.url}
                                    download={documentPreview.name}
                                    className="assessment-button assessment-button--secondary"
                                    style={{
                                        textDecoration: "none",
                                    }}
                                >
                                    <Download size={16} />

                                    Download
                                </a>

                                <button
                                    type="button"
                                    className="assessment-icon-button"
                                    onClick={closeDocumentPreview}
                                    aria-label="Close document preview"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </header>

                        <div
                            style={{
                                flex: 1,
                                minHeight: 0,
                                background: "#f3f4f6",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                overflow: "auto",
                            }}
                        >
                            {documentPreview.mimeType.startsWith("image/") ? (
                                <img
                                    src={documentPreview.url}
                                    alt={documentPreview.name}
                                    style={{
                                        display: "block",
                                        maxWidth: "100%",
                                        maxHeight: "100%",
                                        objectFit: "contain",
                                    }}
                                />
                            ) : (
                                documentPreview.mimeType === "application/pdf" ||
                                    documentPreview.mimeType.startsWith("text/") ? (
                                    <iframe
                                        title={documentPreview.name}
                                        src={documentPreview.url}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            border: 0,
                                            background: "#fff",
                                        }}
                                    />
                                ) : (
                                    <div
                                        style={{
                                            textAlign: "center",
                                            padding: 32,
                                        }}
                                    >
                                        <FileText size={42} />

                                        <h3>Preview unavailable</h3>

                                        <p>
                                            This file type cannot be previewed
                                            in the browser. Download it to open it.
                                        </p>

                                        <a
                                            href={documentPreview.url}
                                            download={documentPreview.name}
                                            className="assessment-button assessment-button--primary"
                                            style={{
                                                textDecoration: "none",
                                            }}
                                        >
                                            <Download size={17} />

                                            Download document
                                        </a>
                                    </div>
                                )
                            )}
                        </div>
                    </section>
                </div>
            )}
        </main>
    );
}