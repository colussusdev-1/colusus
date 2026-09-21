import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    HiArrowLeft,
    HiCheck,
    HiChevronRight,
    HiOutlineCalendar,
    HiOutlineDocumentText,
    HiOutlineExternalLink,
    HiOutlineMail,
    HiOutlinePhone,
    HiOutlineUser,
} from "react-icons/hi";

import api from "../../../services/api";
import "./AdminFormSubmissionDetails.css";

const statusOptions = [
    "NEW",
    "REVIEWING",
    "CONTACTED",
    "QUALIFIED",
    "CONVERTED",
    "CLOSED",
];

const formatDate = (value) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return date.toLocaleString("en-NG", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
};

const formatShortDate = (value) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return date.toLocaleDateString("en-NG", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

const formatFieldLabel = (key) => {
    return String(key)
        .replace(/([A-Z])/g, " $1")
        .replace(/[_-]/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/\b\w/g, (character) =>
            character.toUpperCase(),
        );
};

const formatFieldValue = (value) => {
    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return "—";
    }

    if (typeof value === "boolean") {
        return value ? "Yes" : "No";
    }

    if (Array.isArray(value)) {
        return value.length
            ? value.join(", ")
            : "—";
    }

    if (typeof value === "object") {
        return JSON.stringify(value);
    }

    return String(value);
};

const statusClass = (status) => {
    return `submission-status submission-status-${String(
        status || "NEW",
    ).toLowerCase()}`;
};

const getStaffName = (staffMember) => {
    if (!staffMember) {
        return "Unassigned";
    }

    const fullName =
        `${staffMember.firstName || ""} ${staffMember.lastName || ""}`.trim();

    return (
        fullName ||
        staffMember.email ||
        "Staff member"
    );
};

const getInitials = (name) => {
    if (!name || name === "—") {
        return "—";
    }

    const parts = String(name)
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    if (!parts.length) {
        return "—";
    }

    return parts
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join("");
};

function AdminFormSubmissionDetails() {
    const { formKey, submissionId } = useParams();
    const navigate = useNavigate();

    const [submission, setSubmission] =
        useState(null);

    const [staff, setStaff] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [staffLoading, setStaffLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [staffError, setStaffError] =
        useState("");

    const [selectedStatus, setSelectedStatus] =
        useState("NEW");

    const [selectedStaff, setSelectedStaff] =
        useState("");

    const [note, setNote] =
        useState("");

    const [savingWorkflow, setSavingWorkflow] =
        useState(false);

    const [addingNote, setAddingNote] =
        useState(false);

    const [workflowMessage, setWorkflowMessage] =
        useState("");

    const [noteMessage, setNoteMessage] =
        useState("");

    const loadSubmission = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                `/form-submissions/${submissionId}`,
            );

            const responseData =
                response?.data || {};

            const data =
                responseData.data ||
                responseData.submission ||
                null;

            setSubmission(data);

            if (data) {
                setSelectedStatus(
                    data.status || "NEW",
                );

                setSelectedStaff(
                    data.assignedTo?._id || "",
                );
            }
        } catch (requestError) {
            setError(
                requestError?.response?.data
                    ?.message ||
                "Unable to load this submission.",
            );
        } finally {
            setLoading(false);
        }
    };

    const loadStaff = async () => {
        try {
            setStaffLoading(true);
            setStaffError("");

            const response =
                await api.get("/admin/staff");

            const responseData =
                response?.data || {};

            const staffData =
                Array.isArray(responseData)
                    ? responseData
                    : Array.isArray(responseData.data)
                        ? responseData.data
                        : Array.isArray(responseData.staff)
                            ? responseData.staff
                            : Array.isArray(responseData.users)
                                ? responseData.users
                                : Array.isArray(
                                    responseData.data?.staff,
                                )
                                    ? responseData.data.staff
                                    : Array.isArray(
                                        responseData.data?.users,
                                    )
                                        ? responseData.data.users
                                        : [];

            setStaff(staffData);
        } catch (requestError) {
            setStaffError(
                requestError?.response?.data
                    ?.message ||
                "Unable to load staff members.",
            );
        } finally {
            setStaffLoading(false);
        }
    };

    useEffect(() => {
        if (!submissionId) {
            return;
        }

        loadSubmission();
        loadStaff();
    }, [submissionId]);

    const submissionFields = useMemo(() => {
        if (!submission?.submissionData) {
            return [];
        }

        return Object.entries(
            submission.submissionData,
        );
    }, [submission]);

    const applicantName =
        submission?.submissionData?.name ||
        "Unnamed applicant";

    const applicantEmail =
        submission?.submissionData?.email || "";

    const applicantPhone =
        submission?.submissionData?.phone || "";

    const documents = Array.isArray(
        submission?.documents,
    )
        ? submission.documents
        : [];

    const internalNotes = Array.isArray(
        submission?.internalNotes,
    )
        ? submission.internalNotes
        : [];

    const handleWorkflowSave = async () => {
        try {
            setSavingWorkflow(true);
            setWorkflowMessage("");

            await api.patch(
                `/form-submissions/${submissionId}`,
                {
                    status: selectedStatus,
                    assignedTo:
                        selectedStaff || null,
                },
            );

            setWorkflowMessage(
                "Workflow saved.",
            );

            await loadSubmission();
        } catch (requestError) {
            setWorkflowMessage(
                requestError?.response?.data
                    ?.message ||
                "Unable to update the workflow.",
            );
        } finally {
            setSavingWorkflow(false);
        }
    };

    const handleAddNote = async () => {
        const trimmedNote = note.trim();

        if (!trimmedNote) {
            setNoteMessage(
                "Enter a note before adding it.",
            );
            return;
        }

        try {
            setAddingNote(true);
            setNoteMessage("");

            await api.patch(
                `/form-submissions/${submissionId}`,
                {
                    note: trimmedNote,
                },
            );

            setNote("");

            setNoteMessage("Note added.");

            await loadSubmission();
        } catch (requestError) {
            setNoteMessage(
                requestError?.response?.data
                    ?.message ||
                "Unable to add the note.",
            );
        } finally {
            setAddingNote(false);
        }
    };

    if (loading) {
        return (
            <div className="admin-form-submission-details">
                <div className="submission-details-loading">
                    <div className="submission-loading-line submission-loading-title" />
                    <div className="submission-loading-line" />
                    <div className="submission-loading-grid">
                        <div />
                        <div />
                        <div />
                        <div />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !submission) {
        return (
            <div className="admin-form-submission-details">
                <div className="submission-details-error">
                    <div className="submission-error-icon">
                        <HiOutlineDocumentText />
                    </div>

                    <h2>
                        Submission unavailable
                    </h2>

                    <p>
                        {error ||
                            "This form submission could not be found."}
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            navigate(-1)
                        }
                        className="submission-details-back-button"
                    >
                        <HiArrowLeft />
                        Back to submissions
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-form-submission-details">
            {/* HEADER */}

            <header className="submission-page-header">
                <div className="submission-header-main">
                    <button
                        type="button"
                        className="submission-back-button"
                        onClick={() =>
                            navigate(-1)
                        }
                        aria-label="Back to submissions"
                    >
                        <HiArrowLeft />
                    </button>

                    <div className="submission-applicant-avatar">
                        {getInitials(
                            applicantName,
                        )}
                    </div>

                    <div className="submission-header-copy">
                        <div className="submission-header-topline">
                            <span>
                                {submission.formName ||
                                    "Form submission"}
                            </span>

                            <span className="submission-header-dot">
                                •
                            </span>

                            <span>
                                {formatShortDate(
                                    submission.createdAt,
                                )}
                            </span>
                        </div>

                        <h1>{applicantName}</h1>

                        <div className="submission-header-contact">
                            {applicantEmail && (
                                <a
                                    href={`mailto:${applicantEmail}`}
                                >
                                    <HiOutlineMail />
                                    {applicantEmail}
                                </a>
                            )}

                            {applicantPhone && (
                                <a
                                    href={`tel:${applicantPhone}`}
                                >
                                    <HiOutlinePhone />
                                    {applicantPhone}
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                <div className="submission-header-side">
                    <span
                        className={statusClass(
                            submission.status,
                        )}
                    >
                        {submission.status ||
                            "NEW"}
                    </span>

                    <span className="submission-reference">
                        #{String(
                            submission._id || "",
                        ).slice(-8)}
                    </span>
                </div>
            </header>

            {/* META STRIP */}

            <div className="submission-meta-strip">
                <div className="submission-meta-item">
                    <span>Form</span>
                    <strong>
                        {submission.formName ||
                            "—"}
                    </strong>
                </div>

                <div className="submission-meta-item">
                    <span>Source</span>
                    <strong>
                        {submission.source ||
                            "—"}
                    </strong>
                </div>

                <div className="submission-meta-item">
                    <span>Submitted</span>
                    <strong>
                        {formatDate(
                            submission.createdAt,
                        )}
                    </strong>
                </div>

                <div className="submission-meta-item">
                    <span>Documents</span>
                    <strong>
                        {documents.length}
                    </strong>
                </div>
            </div>

            {/* TOP WORKSPACE */}

            <div className="submission-workspace">
                {/* APPLICANT */}

                <section className="submission-section submission-applicant-section">
                    <div className="submission-section-heading">
                        <div>
                            <span className="submission-section-kicker">
                                CONTACT
                            </span>

                            <h2>Applicant</h2>
                        </div>
                    </div>

                    <div className="submission-contact-grid">
                        <div className="submission-contact-block submission-contact-primary">
                            <div className="submission-contact-icon">
                                <HiOutlineUser />
                            </div>

                            <div>
                                <span>Name</span>
                                <strong>
                                    {applicantName}
                                </strong>
                            </div>
                        </div>

                        <div className="submission-contact-block">
                            <div className="submission-contact-icon">
                                <HiOutlineMail />
                            </div>

                            <div>
                                <span>Email</span>

                                {applicantEmail ? (
                                    <a
                                        href={`mailto:${applicantEmail}`}
                                    >
                                        {
                                            applicantEmail
                                        }
                                    </a>
                                ) : (
                                    <strong>
                                        —
                                    </strong>
                                )}
                            </div>
                        </div>

                        <div className="submission-contact-block">
                            <div className="submission-contact-icon">
                                <HiOutlinePhone />
                            </div>

                            <div>
                                <span>Phone</span>

                                {applicantPhone ? (
                                    <a
                                        href={`tel:${applicantPhone}`}
                                    >
                                        {
                                            applicantPhone
                                        }
                                    </a>
                                ) : (
                                    <strong>
                                        —
                                    </strong>
                                )}
                            </div>
                        </div>

                        <div className="submission-contact-block">
                            <div className="submission-contact-icon">
                                <HiOutlineCalendar />
                            </div>

                            <div>
                                <span>Received</span>

                                <strong>
                                    {formatShortDate(
                                        submission.createdAt,
                                    )}
                                </strong>
                            </div>
                        </div>
                    </div>
                </section>

                {/* WORKFLOW */}

                <section className="submission-section submission-workflow-section">
                    <div className="submission-section-heading">
                        <div>
                            <span className="submission-section-kicker">
                                WORKFLOW
                            </span>

                            <h2>Handling</h2>
                        </div>

                        {workflowMessage && (
                            <span className="submission-inline-message">
                                <HiCheck />
                                {
                                    workflowMessage
                                }
                            </span>
                        )}
                    </div>

                    <div className="submission-workflow-row">
                        <div className="submission-control">
                            <label htmlFor="submission-status">
                                Status
                            </label>

                            <select
                                id="submission-status"
                                value={
                                    selectedStatus
                                }
                                onChange={(
                                    event,
                                ) =>
                                    setSelectedStatus(
                                        event.target
                                            .value,
                                    )
                                }
                            >
                                {statusOptions.map(
                                    (
                                        status,
                                    ) => (
                                        <option
                                            key={
                                                status
                                            }
                                            value={
                                                status
                                            }
                                        >
                                            {
                                                status
                                            }
                                        </option>
                                    ),
                                )}
                            </select>
                        </div>

                        <div className="submission-control">
                            <label htmlFor="submission-staff">
                                Assigned to
                            </label>

                            <select
                                id="submission-staff"
                                value={
                                    selectedStaff
                                }
                                onChange={(
                                    event,
                                ) =>
                                    setSelectedStaff(
                                        event.target
                                            .value,
                                    )
                                }
                                disabled={
                                    staffLoading
                                }
                            >
                                <option value="">
                                    Unassigned
                                </option>

                                {staff.map(
                                    (
                                        member,
                                    ) => (
                                        <option
                                            key={
                                                member._id
                                            }
                                            value={
                                                member._id
                                            }
                                        >
                                            {getStaffName(
                                                member,
                                            )}
                                        </option>
                                    ),
                                )}
                            </select>

                            {staffError && (
                                <small className="submission-control-error">
                                    {
                                        staffError
                                    }
                                </small>
                            )}
                        </div>

                        <button
                            type="button"
                            className="submission-primary-button"
                            onClick={
                                handleWorkflowSave
                            }
                            disabled={
                                savingWorkflow
                            }
                        >
                            {savingWorkflow
                                ? "Saving..."
                                : "Save changes"}
                        </button>
                    </div>
                </section>
            </div>

            {/* SUBMITTED INFORMATION */}

            <section className="submission-section submission-information-section">
                <div className="submission-section-heading submission-section-heading-wide">
                    <div>
                        <span className="submission-section-kicker">
                            FORM DATA
                        </span>

                        <h2>
                            Submitted information
                        </h2>
                    </div>

                    <span className="submission-section-count">
                        {submissionFields.length}{" "}
                        fields
                    </span>
                </div>

                {submissionFields.length ? (
                    <div className="submission-fields-grid">
                        {submissionFields.map(
                            ([key, value]) => (
                                <div
                                    className="submission-field"
                                    key={key}
                                >
                                    <span>
                                        {formatFieldLabel(
                                            key,
                                        )}
                                    </span>

                                    <strong
                                        title={formatFieldValue(
                                            value,
                                        )}
                                    >
                                        {formatFieldValue(
                                            value,
                                        )}
                                    </strong>
                                </div>
                            ),
                        )}
                    </div>
                ) : (
                    <div className="submission-empty-state">
                        No submitted information
                        available.
                    </div>
                )}
            </section>

            {/* DOCUMENTS + NOTES */}

            <div className="submission-lower-grid">
                {/* DOCUMENTS */}

                <section className="submission-section submission-documents-section">
                    <div className="submission-section-heading">
                        <div>
                            <span className="submission-section-kicker">
                                FILES
                            </span>

                            <h2>Documents</h2>
                        </div>

                        <span className="submission-section-count">
                            {documents.length}
                        </span>
                    </div>

                    {documents.length ? (
                        <div className="submission-documents-list">
                            {documents.map(
                                (document) => (
                                    <div
                                        className="submission-document"
                                        key={
                                            document._id ||
                                            document.publicId ||
                                            document.name
                                        }
                                    >
                                        <div className="submission-document-icon">
                                            <HiOutlineDocumentText />
                                        </div>

                                        <div className="submission-document-info">
                                            <strong>
                                                {document.name ||
                                                    "Document"}
                                            </strong>

                                            <span>
                                                {document.type ||
                                                    "DOCUMENT"}
                                                {document.format
                                                    ? ` · ${String(
                                                        document.format,
                                                    ).toUpperCase()}`
                                                    : ""}
                                            </span>
                                        </div>

                                        {document._id &&
                                            document.url ? (
                                            <button
                                                type="button"
                                                className="submission-document-open"
                                                onClick={() =>
                                                    navigate(
                                                        `/admin/forms/${submission.formKey}/${submission._id}/documents/${document._id}`,
                                                    )
                                                }
                                            >
                                                Open
                                                <HiChevronRight />
                                            </button>
                                        ) : (
                                            <span className="submission-document-unavailable">
                                                Unavailable
                                            </span>
                                        )}
                                    </div>
                                ),
                            )}
                        </div>
                    ) : (
                        <div className="submission-empty-state">
                            No documents were
                            submitted.
                        </div>
                    )}
                </section>

                {/* NOTES */}

                <section className="submission-section submission-notes-section">
                    <div className="submission-section-heading">
                        <div>
                            <span className="submission-section-kicker">
                                INTERNAL
                            </span>

                            <h2>Notes</h2>
                        </div>

                        <span className="submission-section-count">
                            {internalNotes.length}
                        </span>
                    </div>

                    <div className="submission-note-composer">
                        <textarea
                            value={note}
                            onChange={(event) =>
                                setNote(
                                    event.target
                                        .value,
                                )
                            }
                            placeholder="Add an internal note..."
                            rows={3}
                        />

                        <div className="submission-note-composer-footer">
                            <span>
                                Internal team only
                            </span>

                            <button
                                type="button"
                                className="submission-primary-button"
                                onClick={
                                    handleAddNote
                                }
                                disabled={
                                    addingNote
                                }
                            >
                                {addingNote
                                    ? "Adding..."
                                    : "Add note"}
                            </button>
                        </div>

                        {noteMessage && (
                            <div className="submission-note-message">
                                {noteMessage}
                            </div>
                        )}
                    </div>

                    {internalNotes.length ? (
                        <div className="submission-notes-list">
                            {internalNotes.map(
                                (
                                    currentNote,
                                    index,
                                ) => (
                                    <article
                                        className="submission-note"
                                        key={
                                            currentNote._id ||
                                            `${currentNote.createdAt}-${index}`
                                        }
                                    >
                                        <div className="submission-note-marker">
                                            {getInitials(
                                                currentNote
                                                    .addedBy
                                                    ? getStaffName(
                                                        currentNote.addedBy,
                                                    )
                                                    : "System",
                                            )}
                                        </div>

                                        <div className="submission-note-body">
                                            <p>
                                                {
                                                    currentNote.message
                                                }
                                            </p>

                                            <div className="submission-note-meta">
                                                <strong>
                                                    {currentNote
                                                        .addedBy
                                                        ? getStaffName(
                                                            currentNote.addedBy,
                                                        )
                                                        : "System"}
                                                </strong>

                                                <span>
                                                    {formatDate(
                                                        currentNote.createdAt,
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </article>
                                ),
                            )}
                        </div>
                    ) : (
                        <div className="submission-empty-state submission-empty-notes">
                            No internal notes
                            yet.
                        </div>
                    )}
                </section>
            </div>

            {/* FOOTER */}

            <footer className="submission-details-footer">
                <Link
                    to={`/admin/forms/${submission.formKey ||
                        formKey
                        }`}
                    className="submission-details-footer-link"
                >
                    <HiArrowLeft />
                    All submissions
                </Link>
            </footer>
        </div>
    );
}

export default AdminFormSubmissionDetails;