import { useEffect, useMemo, useState } from "react";
import {
    FiArrowLeft,
    FiChevronRight,
    FiRefreshCw,
    FiSearch,
} from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../../services/api";

import "./AdminFormSubmissions.css";

const PAGE_SIZE = 10;

const STATUS_OPTIONS = [
    {
        value: "",
        label: "All statuses",
    },
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

const statusLabels = {
    NEW: "New",
    REVIEWING: "Reviewing",
    CONTACTED: "Contacted",
    QUALIFIED: "Qualified",
    CONVERTED: "Converted",
    CLOSED: "Closed",
};

const getStatusClass = (status) => {
    return String(status || "NEW")
        .toLowerCase()
        .replace(/\s+/g, "-");
};

const getApplicantName = (submission) => {
    const data = submission?.submissionData || {};


    return (
        data.fullName ||
        data.name ||
        data.full_name ||
        [data.firstName, data.lastName].filter(Boolean).join(" ") ||
        [data.first_name, data.last_name].filter(Boolean).join(" ") ||
        "Unnamed applicant"
    );


};

const getEmail = (submission) => {
    const data = submission?.submissionData || {};


    return (
        data.email ||
        data.emailAddress ||
        data.email_address ||
        "—"
    );


};

const getPhone = (submission) => {
    const data = submission?.submissionData || {};


    return (
        data.phone ||
        data.phoneNumber ||
        data.phone_number ||
        data.mobile ||
        "—"
    );


};

const getRole = (submission) => {
    const data = submission?.submissionData || {};


    return (
        data.role ||
        data.profession ||
        data.professionalRole ||
        data.position ||
        data.interest ||
        "—"
    );


};

const formatDate = (value) => {
    if (!value) return "—";


    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return new Intl.DateTimeFormat("en-NG", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(date);


};

function AdminFormSubmissions() {
    const { formKey } = useParams();
    const navigate = useNavigate();


    const [formName, setFormName] = useState("");
    const [submissions, setSubmissions] = useState([]);

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");

    const [page, setPage] = useState(1);

    const [pagination, setPagination] = useState({
        page: 1,
        limit: PAGE_SIZE,
        total: 0,
        pages: 1,
    });

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    const loadFormSubmissions = async ({
        showRefresh = false,
        targetPage = page,
        targetStatus = status,
    } = {}) => {
        try {
            if (showRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            const response = await api.get(
                "/form-submissions",
                {
                    params: {
                        formKey,
                        page: targetPage,
                        limit: PAGE_SIZE,
                        status: targetStatus || undefined,
                    },
                },
            );

            const responseData = response?.data || {};

            /*
             * Backend response:
             *
             * {
             *     success: true,
             *     data: [...submissions],
             *     pagination: {...}
             * }
             */

            const submissionData = Array.isArray(
                responseData.data,
            )
                ? responseData.data
                : [];

            setSubmissions(submissionData);

            setPagination(
                responseData.pagination || {
                    page: targetPage,
                    limit: PAGE_SIZE,
                    total: 0,
                    pages: 1,
                },
            );

            if (submissionData.length > 0) {
                setFormName(
                    submissionData[0]?.formName || "",
                );
            }
        } catch (requestError) {
            console.error(
                "Failed to load form submissions:",
                requestError,
            );

            setError(
                requestError?.response?.data?.message ||
                "Unable to load form submissions.",
            );

            setSubmissions([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadFormSubmissions({
            targetPage: page,
            targetStatus: status,
        });
    }, [formKey, page, status]);

    const filteredSubmissions = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) {
            return submissions;
        }

        return submissions.filter((submission) => {
            const applicantName =
                getApplicantName(submission);

            const email = getEmail(submission);
            const phone = getPhone(submission);
            const role = getRole(submission);

            return [
                applicantName,
                email,
                phone,
                role,
                submission?.formKey,
                submission?.status,
            ]
                .filter(Boolean)
                .some((value) =>
                    String(value)
                        .toLowerCase()
                        .includes(query),
                );
        });
    }, [submissions, search]);

    const totalPages = Math.max(
        Number(pagination?.pages) || 1,
        1,
    );

    const handleStatusChange = (event) => {
        setStatus(event.target.value);
        setPage(1);
    };

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
    };

    const clearSearch = () => {
        setSearch("");
    };

    const handleRefresh = () => {
        loadFormSubmissions({
            showRefresh: true,
            targetPage: page,
            targetStatus: status,
        });
    };

    const handlePreviousPage = () => {
        if (page <= 1) return;

        setPage(
            (currentPage) => currentPage - 1,
        );
    };

    const handleNextPage = () => {
        if (page >= totalPages) return;

        setPage(
            (currentPage) => currentPage + 1,
        );
    };

    const handleSubmissionClick = (submission) => {
        if (!submission?._id) return;

        navigate(
            `/admin/forms/${encodeURIComponent(
                formKey,
            )}/${submission._id}`,
        );
    };

    return (
        <section className="admin-form-submissions">

            <div className="admin-form-submissions__topbar">

                <button
                    type="button"
                    className="admin-form-submissions__back"
                    onClick={() =>
                        navigate("/admin/forms")
                    }
                >
                    <FiArrowLeft />

                    <span>
                        Forms
                    </span>
                </button>

            </div>


            <header className="admin-form-submissions__hero">

                <div>

                    <p className="admin-form-submissions__eyebrow">
                        Form submissions
                    </p>

                    <h1>
                        {formName ||
                            "Form submissions"}
                    </h1>

                    <p className="admin-form-submissions__description">
                        Review and manage submissions
                        received through this website
                        form.
                    </p>

                </div>


                <button
                    type="button"
                    className="admin-form-submissions__refresh"
                    onClick={handleRefresh}
                    disabled={
                        loading ||
                        refreshing
                    }
                >
                    <FiRefreshCw
                        className={
                            refreshing
                                ? "is-spinning"
                                : ""
                        }
                    />

                    <span>
                        {refreshing
                            ? "Refreshing..."
                            : "Refresh"}
                    </span>
                </button>

            </header>


            <div className="admin-form-submissions__summary">

                <div>
                    <span>
                        Total submissions
                    </span>

                    <strong>
                        {pagination?.total ||
                            0}
                    </strong>
                </div>


                <div>
                    <span>
                        Showing
                    </span>

                    <strong>
                        {
                            filteredSubmissions.length
                        }
                    </strong>
                </div>


                <div>
                    <span>
                        Form
                    </span>

                    <strong>
                        {formName ||
                            formKey}
                    </strong>
                </div>

            </div>


            <div className="admin-form-submissions__toolbar">

                <div className="admin-form-submissions__search">

                    <FiSearch />

                    <input
                        type="search"
                        value={search}
                        onChange={
                            handleSearchChange
                        }
                        placeholder="Search submissions..."
                        aria-label="Search submissions"
                    />

                    {search && (
                        <button
                            type="button"
                            onClick={
                                clearSearch
                            }
                            aria-label="Clear search"
                        >
                            ×
                        </button>
                    )}

                </div>


                <div className="admin-form-submissions__status">

                    <label htmlFor="submission-status">
                        Status
                    </label>

                    <select
                        id="submission-status"
                        value={status}
                        onChange={
                            handleStatusChange
                        }
                    >
                        {STATUS_OPTIONS.map(
                            (option) => (
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

                </div>

            </div>


            {error && (
                <div className="admin-form-submissions__state admin-form-submissions__state--error">

                    <strong>
                        Unable to load
                        submissions
                    </strong>

                    <p>
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            loadFormSubmissions(
                                {
                                    showRefresh:
                                        true,
                                    targetPage:
                                        page,
                                    targetStatus:
                                        status,
                                },
                            )
                        }
                    >
                        Try again
                    </button>

                </div>
            )}


            {!error && loading && (
                <div className="admin-form-submissions__table-card">

                    <div className="admin-form-submissions__table">

                        <div className="admin-form-submissions__table-head">

                            <span>
                                Applicant
                            </span>

                            <span>
                                Contact
                            </span>

                            <span>
                                Role
                            </span>

                            <span>
                                Status
                            </span>

                            <span>
                                Submitted
                            </span>

                            <span />

                        </div>


                        {Array.from({
                            length: 6,
                        }).map(
                            (_, index) => (
                                <div
                                    className="admin-form-submissions__skeleton-row"
                                    key={index}
                                >
                                    <span />
                                    <span />
                                    <span />
                                    <span />
                                    <span />
                                    <span />
                                </div>
                            ),
                        )}

                    </div>

                </div>
            )}


            {!error &&
                !loading &&
                submissions.length === 0 && (
                    <div className="admin-form-submissions__state">

                        <div className="admin-form-submissions__state-icon">
                            <FiSearch />
                        </div>

                        <h2>
                            No submissions yet
                        </h2>

                        <p>
                            Submissions received
                            through this form
                            will appear here.
                        </p>

                    </div>
                )}


            {!error &&
                !loading &&
                submissions.length > 0 &&
                filteredSubmissions.length === 0 && (
                    <div className="admin-form-submissions__state">

                        <div className="admin-form-submissions__state-icon">
                            <FiSearch />
                        </div>

                        <h2>
                            No matching
                            submissions
                        </h2>

                        <p>
                            Try changing your
                            search or status
                            filter.
                        </p>

                        <button
                            type="button"
                            onClick={() => {
                                setSearch("");
                                setStatus("");
                                setPage(1);
                            }}
                        >
                            Clear filters
                        </button>

                    </div>
                )}


            {!error &&
                !loading &&
                filteredSubmissions.length > 0 && (
                    <>

                        <div className="admin-form-submissions__table-card">

                            <div className="admin-form-submissions__table">

                                <div className="admin-form-submissions__table-head">

                                    <span>
                                        Applicant
                                    </span>

                                    <span>
                                        Contact
                                    </span>

                                    <span>
                                        Role
                                    </span>

                                    <span>
                                        Status
                                    </span>

                                    <span>
                                        Submitted
                                    </span>

                                    <span />

                                </div>


                                {filteredSubmissions.map(
                                    (submission) => {
                                        const currentStatus =
                                            String(
                                                submission?.status ||
                                                "NEW",
                                            ).toUpperCase();

                                        return (
                                            <button
                                                type="button"
                                                className="admin-form-submissions__row"
                                                key={
                                                    submission._id
                                                }
                                                onClick={() =>
                                                    handleSubmissionClick(
                                                        submission,
                                                    )
                                                }
                                            >

                                                <div className="admin-form-submissions__applicant">

                                                    <strong>
                                                        {
                                                            getApplicantName(
                                                                submission,
                                                            )
                                                        }
                                                    </strong>

                                                    <span>
                                                        {
                                                            submission?.formKey ||
                                                            formKey
                                                        }
                                                    </span>

                                                </div>


                                                <div className="admin-form-submissions__contact">

                                                    <strong>
                                                        {
                                                            getEmail(
                                                                submission,
                                                            )
                                                        }
                                                    </strong>

                                                    <span>
                                                        {
                                                            getPhone(
                                                                submission,
                                                            )
                                                        }
                                                    </span>

                                                </div>


                                                <div className="admin-form-submissions__role">
                                                    {
                                                        getRole(
                                                            submission,
                                                        )
                                                    }
                                                </div>


                                                <div>

                                                    <span
                                                        className={`admin-form-submissions__status admin-form-submissions__status--${getStatusClass(
                                                            currentStatus,
                                                        )}`}
                                                    >
                                                        {
                                                            statusLabels[
                                                            currentStatus
                                                            ] ||
                                                            currentStatus
                                                        }
                                                    </span>

                                                </div>


                                                <div className="admin-form-submissions__date">
                                                    {
                                                        formatDate(
                                                            submission?.createdAt,
                                                        )
                                                    }
                                                </div>


                                                <div className="admin-form-submissions__action">
                                                    <FiChevronRight />
                                                </div>

                                            </button>
                                        );
                                    },
                                )}

                            </div>

                        </div>


                        <div className="admin-form-submissions__pagination">

                            <span>
                                Page{" "}
                                {page} of{" "}
                                {totalPages}
                            </span>


                            <div>

                                <button
                                    type="button"
                                    onClick={
                                        handlePreviousPage
                                    }
                                    disabled={
                                        page <= 1
                                    }
                                >
                                    Previous
                                </button>


                                <button
                                    type="button"
                                    onClick={
                                        handleNextPage
                                    }
                                    disabled={
                                        page >=
                                        totalPages
                                    }
                                >
                                    Next
                                </button>

                            </div>

                        </div>

                    </>
                )}

        </section>
    );


}

export default AdminFormSubmissions;
