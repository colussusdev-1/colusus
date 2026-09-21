
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
    HiArrowLeft,
    HiChevronLeft,
    HiChevronRight,
    HiOutlineCollection,
    HiOutlineDocumentText,
    HiOutlineMail,
    HiOutlineRefresh,
    HiOutlineSearch,
    HiOutlineUser,
} from "react-icons/hi";

import api from "../../../services/api";
import "./StaffFormSubmissions.css";

const STATUS_OPTIONS = [
    { value: "", label: "All statuses" },
    { value: "NEW", label: "New" },
    { value: "REVIEWING", label: "Reviewing" },
    { value: "CONTACTED", label: "Contacted" },
    { value: "QUALIFIED", label: "Qualified" },
    { value: "CONVERTED", label: "Converted" },
    { value: "CLOSED", label: "Closed" },
];

const getStatusLabel = (status = "") => {
    return String(status || "NEW")
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (character) => character.toUpperCase());
};

const getSubmissionId = (submission) => {
    return submission?._id || submission?.id || null;
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

const getSubmissionFormName = (submission) => {
    return (
        submission?.formName ||
        submission?.formKey ||
        "Website Form"
    );
};

const getSubmissionInitial = (submission) => {
    const name = getSubmissionName(submission);

    return String(name || "S")
        .trim()
        .charAt(0)
        .toUpperCase();
};

const formatDate = (value) => {
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
    }).format(date);
};

function StaffFormSubmissions() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const [submissions, setSubmissions] = useState([]);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        pages: 1,
    });

    const [search, setSearch] = useState(
        searchParams.get("search") || "",
    );

    const [status, setStatus] = useState(
        searchParams.get("status") || "",
    );

    const [formKey, setFormKey] = useState(
        searchParams.get("formKey") || "",
    );

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    const currentPage = Number(searchParams.get("page")) || 1;

    const loadSubmissions = useCallback(
        async ({ showRefresh = false } = {}) => {
            try {
                if (showRefresh) {
                    setRefreshing(true);
                } else {
                    setLoading(true);
                }

                setError("");

                const params = {
                    page: currentPage,
                    limit: 10,
                };

                if (search.trim()) {
                    params.search = search.trim();
                }

                if (status) {
                    params.status = status;
                }

                if (formKey) {
                    params.formKey = formKey;
                }

                const response = await api.get(
                    "/staff/form-submissions",
                    { params },
                );

                const responseData = response?.data;

                const rows = Array.isArray(responseData)
                    ? responseData
                    : Array.isArray(responseData?.data)
                        ? responseData.data
                        : Array.isArray(responseData?.submissions)
                            ? responseData.submissions
                            : Array.isArray(responseData?.data?.submissions)
                                ? responseData.data.submissions
                                : [];

                const paginationData =
                    responseData?.pagination ||
                    responseData?.data?.pagination ||
                    {};

                setSubmissions(rows);

                setPagination({
                    page:
                        Number(paginationData.page) ||
                        currentPage,
                    limit:
                        Number(paginationData.limit) ||
                        10,
                    total:
                        Number(paginationData.total) ||
                        rows.length,
                    pages:
                        Number(paginationData.pages) ||
                        Number(paginationData.totalPages) ||
                        1,
                });
            } catch (requestError) {
                setError(
                    requestError?.response?.data?.message ||
                    requestError?.message ||
                    "Unable to load your form submissions.",
                );
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        [
            currentPage,
            formKey,
            search,
            status,
        ],
    );

    useEffect(() => {
        loadSubmissions();
    }, [loadSubmissions]);

    const formOptions = useMemo(() => {
        const values = new Map();

        submissions.forEach((submission) => {
            const key = submission?.formKey;

            if (!key) {
                return;
            }

            values.set(
                key,
                submission?.formName || key,
            );
        });

        return Array.from(values.entries());
    }, [submissions]);

    const updateFilters = ({
        nextSearch = search,
        nextStatus = status,
        nextFormKey = formKey,
        nextPage = 1,
    } = {}) => {
        const params = {};

        if (nextSearch.trim()) {
            params.search = nextSearch.trim();
        }

        if (nextStatus) {
            params.status = nextStatus;
        }

        if (nextFormKey) {
            params.formKey = nextFormKey;
        }

        if (nextPage > 1) {
            params.page = String(nextPage);
        }

        setSearchParams(params);
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();

        updateFilters({
            nextSearch: search,
            nextStatus: status,
            nextFormKey: formKey,
            nextPage: 1,
        });
    };

    const handleStatusChange = (event) => {
        const nextStatus = event.target.value;

        setStatus(nextStatus);

        updateFilters({
            nextSearch: search,
            nextStatus,
            nextFormKey: formKey,
            nextPage: 1,
        });
    };

    const handleFormChange = (event) => {
        const nextFormKey = event.target.value;

        setFormKey(nextFormKey);

        updateFilters({
            nextSearch: search,
            nextStatus: status,
            nextFormKey,
            nextPage: 1,
        });
    };

    const handlePageChange = (page) => {
        if (
            page < 1 ||
            page > pagination.pages ||
            page === pagination.page
        ) {
            return;
        }

        updateFilters({
            nextSearch: search,
            nextStatus: status,
            nextFormKey: formKey,
            nextPage: page,
        });
    };

    const handleSubmissionClick = (submission) => {
        const submissionId =
            getSubmissionId(submission);

        if (!submissionId) {
            return;
        }

        navigate(
            `/admin/staff/form-submissions/${submissionId}`,
        );
    };

    const handleBack = () => {
        navigate("/admin/staff");
    };

    const handleRefresh = () => {
        loadSubmissions({
            showRefresh: true,
        });
    };

    const showingFrom =
        pagination.total > 0
            ? (pagination.page - 1) * pagination.limit + 1
            : 0;

    const showingTo =
        pagination.total > 0
            ? Math.min(
                pagination.page * pagination.limit,
                pagination.total,
            )
            : 0;

    return (
        <div className="staffFormSubmissions">
            <header className="staffFormSubmissions__header">
                <div className="staffFormSubmissions__heading">
                    <button
                        type="button"
                        className="staffFormSubmissions__back"
                        onClick={handleBack}
                        aria-label="Back to staff dashboard"
                    >
                        <HiArrowLeft />
                    </button>

                    <div>
                        <div className="staffFormSubmissions__eyebrow">
                            Staff Workspace
                        </div>

                        <h1>
                            Website Enquiries
                        </h1>

                        <p>
                            Review and manage website form
                            submissions assigned to you.
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    className="staffFormSubmissions__refresh"
                    onClick={handleRefresh}
                    disabled={loading || refreshing}
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

            <section className="staffFormSubmissions__toolbar">
                <form
                    className="staffFormSubmissions__search"
                    onSubmit={handleSearchSubmit}
                >
                    <HiOutlineSearch />

                    <input
                        type="search"
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                        placeholder="Search submissions..."
                        aria-label="Search submissions"
                    />

                    {search && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearch("");

                                updateFilters({
                                    nextSearch: "",
                                    nextStatus: status,
                                    nextFormKey: formKey,
                                    nextPage: 1,
                                });
                            }}
                            aria-label="Clear search"
                        >
                            ×
                        </button>
                    )}
                </form>

                <select
                    value={status}
                    onChange={handleStatusChange}
                    className="staffFormSubmissions__select"
                    aria-label="Filter by status"
                >
                    {STATUS_OPTIONS.map((option) => (
                        <option
                            key={option.value || "all"}
                            value={option.value}
                        >
                            {option.label}
                        </option>
                    ))}
                </select>

                <select
                    value={formKey}
                    onChange={handleFormChange}
                    className="staffFormSubmissions__select"
                    aria-label="Filter by form"
                >
                    <option value="">
                        All forms
                    </option>

                    {formOptions.map(
                        ([key, label]) => (
                            <option
                                key={key}
                                value={key}
                            >
                                {label}
                            </option>
                        ),
                    )}
                </select>
            </section>

            {error && (
                <div
                    className="staffFormSubmissions__error"
                    role="alert"
                >
                    <span>{error}</span>

                    <button
                        type="button"
                        onClick={() =>
                            loadSubmissions()
                        }
                    >
                        Try again
                    </button>
                </div>
            )}

            <section className="staffFormSubmissions__content">
                <div className="staffFormSubmissions__contentHeader">
                    <div>
                        <h2>
                            Assigned submissions
                        </h2>

                        <span>
                            {pagination.total}{" "}
                            {pagination.total === 1
                                ? "submission"
                                : "submissions"}
                        </span>
                    </div>
                </div>

                {loading ? (
                    <div className="staffFormSubmissions__loading">
                        <div className="staffFormSubmissions__spinner" />
                        <p>
                            Loading submissions...
                        </p>
                    </div>
                ) : submissions.length === 0 ? (
                    <div className="staffFormSubmissions__empty">
                        <div className="staffFormSubmissions__emptyIcon">
                            <HiOutlineCollection />
                        </div>

                        <h3>
                            No form submissions found
                        </h3>

                        <p>
                            There are currently no
                            website enquiries matching
                            your filters.
                        </p>

                        {(search ||
                            status ||
                            formKey) && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearch("");
                                        setStatus("");
                                        setFormKey("");
                                        setSearchParams({});
                                    }}
                                >
                                    Clear filters
                                </button>
                            )}
                    </div>
                ) : (
                    <div className="staffFormSubmissions__tableWrap">
                        <div className="staffFormSubmissions__table">
                            <div className="staffFormSubmissions__tableHead">
                                <span>
                                    Submission
                                </span>

                                <span>
                                    Form
                                </span>

                                <span>
                                    Status
                                </span>

                                <span>
                                    Submitted
                                </span>

                                <span />
                            </div>

                            {submissions.map(
                                (submission) => {
                                    const submissionId =
                                        getSubmissionId(
                                            submission,
                                        );

                                    const name =
                                        getSubmissionName(
                                            submission,
                                        );

                                    const email =
                                        getSubmissionEmail(
                                            submission,
                                        );

                                    const formName =
                                        getSubmissionFormName(
                                            submission,
                                        );

                                    const submissionStatus =
                                        String(
                                            submission?.status ||
                                            "NEW",
                                        ).toLowerCase();

                                    return (
                                        <button
                                            type="button"
                                            key={
                                                submissionId ||
                                                `${name}-${submission?.createdAt}`
                                            }
                                            className="staffFormSubmissionRow"
                                            onClick={() =>
                                                handleSubmissionClick(
                                                    submission,
                                                )
                                            }
                                        >
                                            <div className="staffFormSubmissionRow__person">
                                                <div className="staffFormSubmissionRow__avatar">
                                                    {getSubmissionInitial(
                                                        submission,
                                                    )}
                                                </div>

                                                <div className="staffFormSubmissionRow__identity">
                                                    <strong>
                                                        {name}
                                                    </strong>

                                                    {email && (
                                                        <span>
                                                            <HiOutlineMail />
                                                            {
                                                                email
                                                            }
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="staffFormSubmissionRow__form">
                                                <HiOutlineDocumentText />

                                                <span>
                                                    {
                                                        formName
                                                    }
                                                </span>
                                            </div>

                                            <div>
                                                <span
                                                    className={`staffFormStatus staffFormStatus--${submissionStatus}`}
                                                >
                                                    {getStatusLabel(
                                                        submission?.status,
                                                    )}
                                                </span>
                                            </div>

                                            <div className="staffFormSubmissionRow__date">
                                                <span>
                                                    {formatDate(
                                                        submission?.createdAt,
                                                    )}
                                                </span>
                                            </div>

                                            <div className="staffFormSubmissionRow__arrow">
                                                <HiChevronRight />
                                            </div>
                                        </button>
                                    );
                                },
                            )}
                        </div>
                    </div>
                )}

                {!loading &&
                    submissions.length > 0 && (
                        <footer className="staffFormSubmissions__footer">
                            <span>
                                Showing {showingFrom}–{showingTo} of{" "}
                                {pagination.total}
                            </span>

                            <div className="staffFormSubmissions__pagination">
                                <button
                                    type="button"
                                    onClick={() =>
                                        handlePageChange(
                                            pagination.page -
                                            1,
                                        )
                                    }
                                    disabled={
                                        pagination.page <=
                                        1
                                    }
                                    aria-label="Previous page"
                                >
                                    <HiChevronLeft />
                                </button>

                                <span>
                                    Page{" "}
                                    {pagination.page}{" "}
                                    of{" "}
                                    {pagination.pages}
                                </span>

                                <button
                                    type="button"
                                    onClick={() =>
                                        handlePageChange(
                                            pagination.page +
                                            1,
                                        )
                                    }
                                    disabled={
                                        pagination.page >=
                                        pagination.pages
                                    }
                                    aria-label="Next page"
                                >
                                    <HiChevronRight />
                                </button>
                            </div>
                        </footer>
                    )}
            </section>
        </div>
    );
}

export default StaffFormSubmissions;

