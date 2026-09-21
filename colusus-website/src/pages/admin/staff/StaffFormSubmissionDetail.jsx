
import React, {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    HiArrowLeft,
    HiChevronDown,
    HiDocumentText,
    HiOutlineDocumentText,
    HiOutlineMail,
    HiOutlinePhone,
    HiOutlineRefresh,
    HiOutlineUser,
    HiOutlineLocationMarker,
    HiOutlineClock,
    HiOutlinePencilAlt,
    HiOutlinePaperClip,
} from "react-icons/hi";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import api from "../../../services/api";

import "./StaffFormSubmissionDetail.css";

const STATUS_OPTIONS = [
    {
        value: "NEW",
        label: "New",
    },
    {
        value: "REVIEWING",
        label: "Reviewing",
    },
    {
        value: "CONTACTED",
        label: "Contacted",
    },
    {
        value: "QUALIFIED",
        label: "Qualified",
    },
    {
        value: "CONVERTED",
        label: "Converted",
    },
    {
        value: "CLOSED",
        label: "Closed",
    },
];

const getStatusLabel = (status = "") => {
    return String(status || "NEW")
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (character) =>
            character.toUpperCase(),
        );
};

const getStatusClass = (status = "NEW") => {
    return String(status || "NEW")
        .toLowerCase()
        .replace(/_/g, "-");
};

const getSubmissionData = (submission) => {
    return submission?.submissionData || {};
};

const getSubmissionName = (submission) => {
    const data = getSubmissionData(submission);

    return (
        data.name ||
        data.fullName ||
        data.full_name ||
        data.applicantName ||
        data.applicant_name ||
        "Website Submission"
    );
};

const getSubmissionEmail = (submission) => {
    const data = getSubmissionData(submission);

    return (
        data.email ||
        data.emailAddress ||
        data.email_address ||
        ""
    );
};

const getSubmissionPhone = (submission) => {
    const data = getSubmissionData(submission);

    return (
        data.phone ||
        data.phoneNumber ||
        data.phone_number ||
        data.mobile ||
        ""
    );
};

const getSubmissionLocation = (submission) => {
    const data = getSubmissionData(submission);

    return (
        data.location ||
        data.city ||
        data.address ||
        data.residence ||
        ""
    );
};

const formatDate = (value, includeTime = false) => {
    if (!value) {
        return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return new Intl.DateTimeFormat("en-NG", {
        day: "numeric",
        month: "short",
        year: "numeric",
        ...(includeTime
            ? {
                hour: "numeric",
                minute: "2-digit",
            }
            : {}),
    }).format(date);
};

const formatFieldLabel = (key = "") => {
    return String(key)
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/[_-]+/g, " ")
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
        try {
            return JSON.stringify(value);
        } catch {
            return "—";
        }
    }

    return String(value);
};

const isSystemField = (key) => {
    return [
        "_id",
        "id",
        "createdAt",
        "updatedAt",
    ].includes(key);
};

const getDocumentIcon = (document) => {
    const resourceType =
        String(
            document?.resourceType || "",
        ).toLowerCase();

    const format =
        String(
            document?.format || "",
        ).toLowerCase();

    if (
        resourceType === "raw" ||
        format === "pdf"
    ) {
        return <HiOutlineDocumentText />;
    }

    return <HiDocumentText />;
};

function StaffFormSubmissionDetail() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [submission, setSubmission] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [error, setError] =
        useState("");

    const [savingStatus, setSavingStatus] =
        useState(false);

    const [selectedStatus, setSelectedStatus] =
        useState("");

    const [note, setNote] =
        useState("");

    const [savingNote, setSavingNote] =
        useState(false);

    const [actionMessage, setActionMessage] =
        useState("");

    const loadSubmission = useCallback(
        async ({
            showRefresh = false,
        } = {}) => {
            if (!id) {
                setError(
                    "No submission was specified.",
                );
                setLoading(false);
                return;
            }

            try {
                if (showRefresh) {
                    setRefreshing(true);
                } else {
                    setLoading(true);
                }

                setError("");
                setActionMessage("");

                const response = await api.get(
                    `/staff/form-submissions/${id}`,
                );

                const responseData =
                    response?.data;

                const result =
                    responseData?.data ||
                    responseData?.submission ||
                    responseData;

                setSubmission(result);

                setSelectedStatus(
                    result?.status || "NEW",
                );
            } catch (requestError) {
                setError(
                    requestError?.response?.data
                        ?.message ||
                    requestError?.message ||
                    "Unable to load this submission.",
                );
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        [id],
    );

    useEffect(() => {
        loadSubmission();
    }, [loadSubmission]);

    const data = useMemo(
        () => getSubmissionData(submission),
        [submission],
    );

    const name = useMemo(
        () => getSubmissionName(submission),
        [submission],
    );

    const email = useMemo(
        () => getSubmissionEmail(submission),
        [submission],
    );

    const phone = useMemo(
        () => getSubmissionPhone(submission),
        [submission],
    );

    const location = useMemo(
        () =>
            getSubmissionLocation(
                submission,
            ),
        [submission],
    );

    const documents =
        Array.isArray(
            submission?.documents,
        )
            ? submission.documents
            : [];

    const notes =
        Array.isArray(
            submission?.internalNotes,
        )
            ? submission.internalNotes
            : [];

    const submittedFields = useMemo(() => {
        return Object.entries(data).filter(
            ([key, value]) =>
                !isSystemField(key) &&
                value !== null &&
                value !== undefined &&
                value !== "",
        );
    }, [data]);

    const handleBack = () => {
        navigate(
            "/admin/staff/form-submissions",
        );
    };

    const handleStatusSave = async () => {
        if (
            !submission?._id ||
            !selectedStatus ||
            selectedStatus ===
            submission.status
        ) {
            return;
        }

        try {
            setSavingStatus(true);
            setActionMessage("");
            setError("");

            const response = await api.patch(
                `/staff/form-submissions/${submission._id}`,
                {
                    status: selectedStatus,
                },
            );

            const responseData =
                response?.data;

            const updated =
                responseData?.data ||
                responseData?.submission ||
                responseData;

            setSubmission((current) => ({
                ...current,
                ...(updated || {}),
                status:
                    updated?.status ||
                    selectedStatus,
            }));

            setActionMessage(
                "Submission status updated.",
            );
        } catch (requestError) {
            setError(
                requestError?.response?.data
                    ?.message ||
                requestError?.message ||
                "Unable to update the submission status.",
            );
        } finally {
            setSavingStatus(false);
        }
    };

    const handleNoteSubmit = async (
        event,
    ) => {
        event.preventDefault();

        const trimmedNote =
            note.trim();

        if (
            !trimmedNote ||
            !submission?._id
        ) {
            return;
        }

        try {
            setSavingNote(true);
            setActionMessage("");
            setError("");

            const response = await api.post(
                `/staff/form-submissions/${submission._id}/notes`,
                {
                    message: trimmedNote,
                },
            );

            const responseData =
                response?.data;

            const updated =
                responseData?.data ||
                responseData?.submission ||
                null;

            if (updated) {
                setSubmission(updated);
            } else {
                await loadSubmission();
            }

            setNote("");

            setActionMessage(
                "Internal note added.",
            );
        } catch (requestError) {
            setError(
                requestError?.response?.data
                    ?.message ||
                requestError?.message ||
                "Unable to add the internal note.",
            );
        } finally {
            setSavingNote(false);
        }
    };

    const handleDocumentView = (
        document,
    ) => {
        if (
            !submission?._id ||
            !document?._id
        ) {
            return;
        }

        navigate(
            `/admin/staff/form-submissions/${submission._id}/documents/${document._id}`,
        );
    };

    if (loading) {
        return (
            <div className="staffFormSubmissionDetailState">
                <div className="staffFormSubmissionDetailState__spinner" />

                <p>
                    Loading submission...
                </p>
            </div>
        );
    }

    if (error && !submission) {
        return (
            <div className="staffFormSubmissionDetailState staffFormSubmissionDetailState--error">
                <div className="staffFormSubmissionDetailState__icon">
                    !
                </div>

                <div>
                    <h2>
                        Unable to load submission
                    </h2>

                    <p>{error}</p>

                    <div className="staffFormSubmissionDetailState__actions">
                        <button
                            type="button"
                            onClick={() =>
                                loadSubmission()
                            }
                        >
                            Try again
                        </button>

                        <button
                            type="button"
                            onClick={handleBack}
                        >
                            Back to submissions
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!submission) {
        return null;
    }

    return (
        <div className="staffFormSubmissionDetail">
            <header className="staffFormSubmissionDetail__header">
                <div className="staffFormSubmissionDetail__headerLeft">
                    <button
                        type="button"
                        className="staffFormSubmissionDetail__back"
                        onClick={handleBack}
                        aria-label="Back to website enquiries"
                    >
                        <HiArrowLeft />
                    </button>

                    <div>
                        <div className="staffFormSubmissionDetail__eyebrow">
                            Staff Workspace
                        </div>

                        <h1>
                            Submission details
                        </h1>

                        <p>
                            Review the enquiry and
                            manage its workflow.
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    className="staffFormSubmissionDetail__refresh"
                    onClick={() =>
                        loadSubmission({
                            showRefresh: true,
                        })
                    }
                    disabled={
                        refreshing ||
                        savingStatus ||
                        savingNote
                    }
                >
                    <HiOutlineRefresh
                        className={
                            refreshing
                                ? "is-spinning"
                                : ""
                        }
                    />

                    {refreshing
                        ? "Refreshing..."
                        : "Refresh"}
                </button>
            </header>

            {error && (
                <div
                    className="staffFormSubmissionDetail__error"
                    role="alert"
                >
                    {error}
                </div>
            )}

            {actionMessage && (
                <div className="staffFormSubmissionDetail__success">
                    {actionMessage}
                </div>
            )}

            <section className="staffFormSubmissionDetail__identity">
                <div className="staffFormSubmissionDetail__identityMain">
                    <div className="staffFormSubmissionDetail__avatar">
                        {String(name)
                            .trim()
                            .charAt(0)
                            .toUpperCase()}
                    </div>

                    <div className="staffFormSubmissionDetail__identityText">
                        <div className="staffFormSubmissionDetail__formLabel">
                            {submission.formName ||
                                submission.formKey ||
                                "Website Form"}
                        </div>

                        <h2>{name}</h2>

                        <div className="staffFormSubmissionDetail__contactLine">
                            {email && (
                                <span>
                                    <HiOutlineMail />
                                    {email}
                                </span>
                            )}

                            {phone && (
                                <span>
                                    <HiOutlinePhone />
                                    {phone}
                                </span>
                            )}

                            {location && (
                                <span>
                                    <HiOutlineLocationMarker />
                                    {location}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="staffFormSubmissionDetail__identityMeta">
                    <span
                        className={`staffFormStatus staffFormStatus--${getStatusClass(
                            submission.status,
                        )}`}
                    >
                        {getStatusLabel(
                            submission.status,
                        )}
                    </span>

                    <span className="staffFormSubmissionDetail__submitted">
                        <HiOutlineClock />
                        Submitted{" "}
                        {formatDate(
                            submission.createdAt,
                            true,
                        )}
                    </span>
                </div>
            </section>

            <div className="staffFormSubmissionDetail__layout">
                <main className="staffFormSubmissionDetail__main">
                    <section className="staffDetailPanel">
                        <div className="staffDetailPanel__header">
                            <div>
                                <span>
                                    Submission
                                </span>

                                <h2>
                                    Submitted information
                                </h2>
                            </div>
                        </div>

                        {submittedFields.length > 0 ? (
                            <div className="staffSubmissionFields">
                                {submittedFields.map(
                                    ([
                                        key,
                                        value,
                                    ]) => (
                                        <div
                                            className="staffSubmissionField"
                                            key={key}
                                        >
                                            <span>
                                                {formatFieldLabel(
                                                    key,
                                                )}
                                            </span>

                                            <strong>
                                                {formatFieldValue(
                                                    value,
                                                )}
                                            </strong>
                                        </div>
                                    ),
                                )}
                            </div>
                        ) : (
                            <div className="staffDetailEmpty">
                                No additional submission
                                information is available.
                            </div>
                        )}
                    </section>

                    <section className="staffDetailPanel">
                        <div className="staffDetailPanel__header">
                            <div>
                                <span>
                                    Documents
                                </span>

                                <h2>
                                    Submitted documents
                                </h2>
                            </div>

                            <strong>
                                {documents.length}
                            </strong>
                        </div>

                        {documents.length > 0 ? (
                            <div className="staffSubmissionDocuments">
                                {documents.map(
                                    (
                                        document,
                                        index,
                                    ) => (
                                        <button
                                            type="button"
                                            className="staffSubmissionDocument"
                                            key={
                                                document._id ||
                                                document.publicId ||
                                                `${document.name}-${index}`
                                            }
                                            onClick={() =>
                                                handleDocumentView(
                                                    document,
                                                )
                                            }
                                        >
                                            <div className="staffSubmissionDocument__icon">
                                                {getDocumentIcon(
                                                    document,
                                                )}
                                            </div>

                                            <div className="staffSubmissionDocument__main">
                                                <strong>
                                                    {document.name ||
                                                        document.type ||
                                                        "Document"}
                                                </strong>

                                                <span>
                                                    {document.type ||
                                                        document.format ||
                                                        "Uploaded document"}
                                                </span>
                                            </div>

                                            <HiChevronDown className="staffSubmissionDocument__arrow" />
                                        </button>
                                    ),
                                )}
                            </div>
                        ) : (
                            <div className="staffDetailEmpty">
                                <HiOutlinePaperClip />

                                <span>
                                    No documents were
                                    submitted with this
                                    enquiry.
                                </span>
                            </div>
                        )}
                    </section>

                    <section className="staffDetailPanel">
                        <div className="staffDetailPanel__header">
                            <div>
                                <span>
                                    Activity
                                </span>

                                <h2>
                                    Internal notes
                                </h2>
                            </div>

                            <strong>
                                {notes.length}
                            </strong>
                        </div>

                        <div className="staffNotes">
                            {notes.length > 0 ? (
                                notes.map(
                                    (
                                        item,
                                        index,
                                    ) => (
                                        <div
                                            className="staffNote"
                                            key={
                                                item._id ||
                                                `${item.createdAt}-${index}`
                                            }
                                        >
                                            <div className="staffNote__marker">
                                                <HiOutlinePencilAlt />
                                            </div>

                                            <div className="staffNote__content">
                                                <div className="staffNote__meta">
                                                    <strong>
                                                        {item.addedBy?.name ||
                                                            item.addedBy?.fullName ||
                                                            "Staff"}
                                                    </strong>

                                                    <span>
                                                        {formatDate(
                                                            item.createdAt,
                                                            true,
                                                        )}
                                                    </span>
                                                </div>

                                                <p>
                                                    {item.message ||
                                                        item.note ||
                                                        ""}
                                                </p>
                                            </div>
                                        </div>
                                    ),
                                )
                            ) : (
                                <div className="staffDetailEmpty">
                                    No internal notes have
                                    been added yet.
                                </div>
                            )}
                        </div>

                        <form
                            className="staffNoteForm"
                            onSubmit={
                                handleNoteSubmit
                            }
                        >
                            <textarea
                                value={note}
                                onChange={(
                                    event,
                                ) =>
                                    setNote(
                                        event.target
                                            .value,
                                    )
                                }
                                placeholder="Add an internal note..."
                                rows={3}
                                disabled={
                                    savingNote
                                }
                            />

                            <div className="staffNoteForm__footer">
                                <span>
                                    Internal notes are
                                    visible to staff only.
                                </span>

                                <button
                                    type="submit"
                                    disabled={
                                        savingNote ||
                                        !note.trim()
                                    }
                                >
                                    {savingNote
                                        ? "Adding..."
                                        : "Add note"}
                                </button>
                            </div>
                        </form>
                    </section>
                </main>

                <aside className="staffFormSubmissionDetail__side">
                    <section className="staffDetailPanel staffDetailPanel--workflow">
                        <div className="staffDetailPanel__header">
                            <div>
                                <span>
                                    Workflow
                                </span>

                                <h2>
                                    Submission status
                                </h2>
                            </div>
                        </div>

                        <div className="staffWorkflow">
                            <label htmlFor="submission-status">
                                Current status
                            </label>

                            <div className="staffWorkflow__select">
                                <select
                                    id="submission-status"
                                    value={
                                        selectedStatus
                                    }
                                    onChange={(
                                        event,
                                    ) =>
                                        setSelectedStatus(
                                            event
                                                .target
                                                .value,
                                        )
                                    }
                                    disabled={
                                        savingStatus
                                    }
                                >
                                    {STATUS_OPTIONS.map(
                                        (
                                            option,
                                        ) => (
                                            <option
                                                key={
                                                    option.value
                                                }
                                                value={
                                                    option.value
                                                }
                                            >
                                                {
                                                    option.label
                                                }
                                            </option>
                                        ),
                                    )}
                                </select>

                                <HiChevronDown />
                            </div>

                            <button
                                type="button"
                                className="staffWorkflow__save"
                                onClick={
                                    handleStatusSave
                                }
                                disabled={
                                    savingStatus ||
                                    selectedStatus ===
                                    submission.status
                                }
                            >
                                {savingStatus
                                    ? "Saving..."
                                    : "Update status"}
                            </button>
                        </div>
                    </section>

                    <section className="staffDetailPanel">
                        <div className="staffDetailPanel__header">
                            <div>
                                <span>
                                    Contact
                                </span>

                                <h2>
                                    Applicant details
                                </h2>
                            </div>
                        </div>

                        <div className="staffContactDetails">
                            {email && (
                                <a
                                    href={`mailto:${email}`}
                                    className="staffContactDetail"
                                >
                                    <span className="staffContactDetail__icon">
                                        <HiOutlineMail />
                                    </span>

                                    <span>
                                        <small>
                                            Email
                                        </small>

                                        <strong>
                                            {email}
                                        </strong>
                                    </span>
                                </a>
                            )}

                            {phone && (
                                <a
                                    href={`tel:${phone}`}
                                    className="staffContactDetail"
                                >
                                    <span className="staffContactDetail__icon">
                                        <HiOutlinePhone />
                                    </span>

                                    <span>
                                        <small>
                                            Phone
                                        </small>

                                        <strong>
                                            {phone}
                                        </strong>
                                    </span>
                                </a>
                            )}

                            {location && (
                                <div className="staffContactDetail">
                                    <span className="staffContactDetail__icon">
                                        <HiOutlineLocationMarker />
                                    </span>

                                    <span>
                                        <small>
                                            Location
                                        </small>

                                        <strong>
                                            {location}
                                        </strong>
                                    </span>
                                </div>
                            )}

                            {!email &&
                                !phone &&
                                !location && (
                                    <div className="staffDetailEmpty">
                                        <HiOutlineUser />

                                        <span>
                                            No contact
                                            information
                                            was provided.
                                        </span>
                                    </div>
                                )}
                        </div>
                    </section>

                    <section className="staffDetailPanel">
                        <div className="staffDetailPanel__header">
                            <div>
                                <span>
                                    Record
                                </span>

                                <h2>
                                    Submission metadata
                                </h2>
                            </div>
                        </div>

                        <div className="staffMetadata">
                            <div>
                                <span>
                                    Form
                                </span>

                                <strong>
                                    {submission.formName ||
                                        submission.formKey ||
                                        "Website Form"}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Source
                                </span>

                                <strong>
                                    {submission.source ||
                                        "WEBSITE"}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Submitted
                                </span>

                                <strong>
                                    {formatDate(
                                        submission.createdAt,
                                        true,
                                    )}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Last updated
                                </span>

                                <strong>
                                    {formatDate(
                                        submission.updatedAt,
                                        true,
                                    )}
                                </strong>
                            </div>
                        </div>
                    </section>
                </aside>
            </div>
        </div>
    );
}

export default StaffFormSubmissionDetail;

