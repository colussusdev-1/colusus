
import React, {
    useCallback,
    useEffect,
    useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
    HiOutlineRefresh,
    HiOutlineExclamation,
    HiOutlineArrowRight,
    HiOutlineDocumentText,
    HiOutlineClock,
    HiOutlineCheckCircle,
    HiOutlineExclamationCircle,
    HiOutlineClipboardList,
    HiOutlineCollection,
    HiOutlineUserGroup,
} from "react-icons/hi";

import staffService from "./services/staff.service";

import "./StaffDashboard.css";

/*
============================================================
colossus — STAFF DASHBOARD
============================================================

Staff operational workspace.

The dashboard only displays information returned by:

    GET /api/v1/staff/dashboard

The backend scopes this information to the authenticated
Staff member.

WORKLOADS:

1. Application workflow
2. Document workflow
3. Website FormSubmission workflow

The frontend never requests:

    all applications
    all documents
    all clients
    all form submissions

It only works with the Staff member's assigned workload.

Notifications are intentionally NOT handled here.
============================================================
*/

/*
============================================================
FORMAT FORM SUBMISSION STATUS
============================================================
*/

const formatStatus = (status = "") => {
    return String(status || "NEW")
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(
            /\b\w/g,
            (character) => character.toUpperCase(),
        );
};

/*
============================================================
GET FORM SUBMISSION ID
============================================================
*/

const getFormSubmissionId = (submission) => {
    return (
        submission?._id ||
        submission?.id ||
        null
    );
};

/*
============================================================
GET FORM SUBMISSION NAME
============================================================
*/

const getSubmissionName = (submission) => {
    const data = submission?.submissionData || {};

    return (
        data.name ||
        data.fullName ||
        data.full_name ||
        data.applicantName ||
        data.applicant_name ||
        "Website Submission"
    );
};

/*
============================================================
GET FORM SUBMISSION EMAIL
============================================================
*/

const getSubmissionEmail = (submission) => {
    const data = submission?.submissionData || {};

    return (
        data.email ||
        data.emailAddress ||
        data.email_address ||
        ""
    );
};

/*
============================================================
GET FORM SUBMISSION REFERENCE
============================================================
*/

const getSubmissionReference = (submission) => {
    return (
        submission?.reference ||
        submission?.submissionReference ||
        submission?._id ||
        "Submission"
    );
};

/*
============================================================
GET FORM SUBMISSION FORM NAME
============================================================
*/

const getSubmissionFormName = (submission) => {
    return (
        submission?.formName ||
        submission?.formKey ||
        "Website Form"
    );
};

/*
============================================================
GET FORM SUBMISSION INITIAL
============================================================
*/

const getSubmissionInitial = (submission) => {
    const name = getSubmissionName(submission);

    return String(name || "S")
        .trim()
        .charAt(0)
        .toUpperCase();
};

/*
============================================================
STAFF DASHBOARD
============================================================
*/

const StaffDashboard = () => {
    const navigate = useNavigate();

    const [dashboard, setDashboard] = useState(null);

    const [loading, setLoading] = useState(true);

    const [refreshing, setRefreshing] = useState(false);

    const [error, setError] = useState("");

    /*
    ============================================================
    LOAD DASHBOARD
    ============================================================
    */

    const loadDashboard = useCallback(
        async ({ silent = false } = {}) => {
            try {
                if (silent) {
                    setRefreshing(true);
                } else {
                    setLoading(true);
                }

                setError("");

                const response =
                    await staffService.getDashboard();

                setDashboard(
                    response?.data || null,
                );
            } catch (error) {
                console.error(
                    "FAILED TO LOAD STAFF DASHBOARD:",
                    error,
                );

                setError(
                    error?.response?.data?.message ||
                    "Unable to load your Staff dashboard.",
                );
            } finally {
                setLoading(false);

                setRefreshing(false);
            }
        },
        [],
    );

    /*
    ============================================================
    INITIAL LOAD
    ============================================================
    */

    useEffect(() => {
        loadDashboard();
    }, [loadDashboard]);

    /*
    ============================================================
    REFRESH
    ============================================================
    */

    const handleRefresh = () => {
        loadDashboard({
            silent: true,
        });
    };

    /*
    ============================================================
    OPEN APPLICATION
    ============================================================
    */

    const handleApplicationClick = (
        applicationId,
    ) => {
        if (!applicationId) {
            return;
        }

        navigate(
            `/admin/staff/applications/${applicationId}`,
        );
    };

    /*
    ============================================================
    VIEW APPLICATIONS
    ============================================================
    */

    const handleViewApplications = (
        status = "",
    ) => {
        if (status) {
            navigate(
                `/admin/staff/applications?status=${status}`,
            );

            return;
        }

        navigate(
            "/admin/staff/applications",
        );
    };

    /*
    ============================================================
    OPEN FORM SUBMISSION
    ============================================================
    */

    const handleFormSubmissionClick = (
        submission,
    ) => {
        const submissionId =
            getFormSubmissionId(submission);

        if (!submissionId) {
            return;
        }

        navigate(
            `/admin/staff/form-submissions/${submissionId}`,
        );
    };

    /*
    ============================================================
    VIEW FORM SUBMISSIONS
    ============================================================
    */

    const handleViewFormSubmissions = (
        status = "",
    ) => {
        if (status) {
            navigate(
                `/admin/staff/form-submissions?status=${status}`,
            );

            return;
        }

        navigate(
            "/admin/staff/form-submissions",
        );
    };

    /*
    ============================================================
    LOADING STATE
    ============================================================
    */

    if (loading) {
        return (
            <section className="staffDashboardState">
                <div className="staffDashboardState__spinner" />

                <span>
                    Loading your Staff workspace...
                </span>
            </section>
        );
    }

    /*
    ============================================================
    ERROR STATE
    ============================================================
    */

    if (error) {
        return (
            <section className="staffDashboardState staffDashboardState--error">
                <div className="staffDashboardState__icon">
                    <HiOutlineExclamation />
                </div>

                <div>
                    <h3>
                        Unable to load Staff dashboard
                    </h3>

                    <p>{error}</p>

                    <button
                        type="button"
                        onClick={() =>
                            loadDashboard()
                        }
                    >
                        Try again
                    </button>
                </div>
            </section>
        );
    }

    /*
    ============================================================
    DASHBOARD DATA
    ============================================================
    */

    const applications =
        dashboard?.applications || {};

    const documents =
        dashboard?.documents || {};

    const formSubmissions =
        dashboard?.formSubmissions || {};

    const recentApplications =
        dashboard?.recentApplications || [];

    const recentFormSubmissions =
        formSubmissions?.recent || [];

    /*
    ============================================================
    RENDER
    ============================================================
    */

    return (
        <section className="staffDashboard">

            {/* ======================================================
                HEADER
            ====================================================== */}

            <header className="staffDashboard__header">

                <div>
                    <span className="staffDashboard__eyebrow">
                        Staff Workspace
                    </span>

                    <h1>
                        My Operations
                    </h1>

                    <p>
                        Manage the applications, documents
                        and website enquiries currently
                        assigned to you.
                    </p>
                </div>

                <button
                    type="button"
                    className="staffDashboard__refresh"
                    onClick={handleRefresh}
                    disabled={refreshing}
                >
                    <HiOutlineRefresh
                        className={
                            refreshing
                                ? "staffDashboard__refreshIcon staffDashboard__refreshIcon--spinning"
                                : "staffDashboard__refreshIcon"
                        }
                    />

                    <span>
                        {refreshing
                            ? "Refreshing..."
                            : "Refresh"}
                    </span>
                </button>

            </header>


            {/* ======================================================
                APPLICATION STATISTICS
            ====================================================== */}

            <section className="staffDashboardSection">

                <div className="staffDashboardSection__header">

                    <div>
                        <span>
                            Application Workflow
                        </span>

                        <h2>
                            Application workload
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            handleViewApplications()
                        }
                    >
                        View all

                        <HiOutlineArrowRight />
                    </button>

                </div>


                <div className="staffDashboard__stats">

                    <button
                        type="button"
                        className="staffDashboardStat"
                        onClick={() =>
                            handleViewApplications()
                        }
                    >
                        <div className="staffDashboardStat__icon">
                            <HiOutlineClipboardList />
                        </div>

                        <div className="staffDashboardStat__content">
                            <span>
                                Assigned Applications
                            </span>

                            <strong>
                                {applications.total || 0}
                            </strong>

                            <small>
                                Your current workload
                            </small>
                        </div>
                    </button>


                    <button
                        type="button"
                        className="staffDashboardStat"
                        onClick={() =>
                            handleViewApplications(
                                "SUBMITTED",
                            )
                        }
                    >
                        <div className="staffDashboardStat__icon">
                            <HiOutlineDocumentText />
                        </div>

                        <div className="staffDashboardStat__content">
                            <span>
                                Submitted
                            </span>

                            <strong>
                                {applications.submitted || 0}
                            </strong>

                            <small>
                                Awaiting processing
                            </small>
                        </div>
                    </button>


                    <button
                        type="button"
                        className="staffDashboardStat"
                        onClick={() =>
                            handleViewApplications(
                                "UNDER_REVIEW",
                            )
                        }
                    >
                        <div className="staffDashboardStat__icon">
                            <HiOutlineClock />
                        </div>

                        <div className="staffDashboardStat__content">
                            <span>
                                Under Review
                            </span>

                            <strong>
                                {applications.underReview || 0}
                            </strong>

                            <small>
                                Applications being reviewed
                            </small>
                        </div>
                    </button>


                    <button
                        type="button"
                        className="staffDashboardStat"
                        onClick={() =>
                            handleViewApplications(
                                "DOCUMENT_REQUEST",
                            )
                        }
                    >
                        <div className="staffDashboardStat__icon">
                            <HiOutlineExclamationCircle />
                        </div>

                        <div className="staffDashboardStat__content">
                            <span>
                                Document Requests
                            </span>

                            <strong>
                                {applications.documentRequest ||
                                    0}
                            </strong>

                            <small>
                                Waiting for client documents
                            </small>
                        </div>
                    </button>


                    <button
                        type="button"
                        className="staffDashboardStat"
                        onClick={() =>
                            handleViewApplications(
                                "PROCESSING",
                            )
                        }
                    >
                        <div className="staffDashboardStat__icon">
                            <HiOutlineRefresh />
                        </div>

                        <div className="staffDashboardStat__content">
                            <span>
                                Processing
                            </span>

                            <strong>
                                {applications.processing || 0}
                            </strong>

                            <small>
                                Currently processing
                            </small>
                        </div>
                    </button>


                    <button
                        type="button"
                        className="staffDashboardStat"
                        onClick={() =>
                            handleViewApplications(
                                "APPROVED",
                            )
                        }
                    >
                        <div className="staffDashboardStat__icon">
                            <HiOutlineCheckCircle />
                        </div>

                        <div className="staffDashboardStat__content">
                            <span>
                                Approved
                            </span>

                            <strong>
                                {applications.approved || 0}
                            </strong>

                            <small>
                                Successfully completed
                            </small>
                        </div>
                    </button>

                </div>

            </section>


            {/* ======================================================
                FORM SUBMISSION STATISTICS
            ====================================================== */}

            <section className="staffDashboardSection staffDashboardSection--forms">

                <div className="staffDashboardSection__header">

                    <div>
                        <span>
                            Website Enquiries
                        </span>

                        <h2>
                            Form submissions
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            handleViewFormSubmissions()
                        }
                    >
                        View all

                        <HiOutlineArrowRight />
                    </button>

                </div>


                <div className="staffDashboard__formStats">

                    <button
                        type="button"
                        className="staffDashboardFormStat"
                        onClick={() =>
                            handleViewFormSubmissions()
                        }
                    >
                        <div className="staffDashboardFormStat__icon">
                            <HiOutlineCollection />
                        </div>

                        <div>
                            <span>
                                Assigned
                            </span>

                            <strong>
                                {formSubmissions.total ||
                                    0}
                            </strong>
                        </div>
                    </button>


                    <button
                        type="button"
                        className="staffDashboardFormStat"
                        onClick={() =>
                            handleViewFormSubmissions(
                                "NEW",
                            )
                        }
                    >
                        <div className="staffDashboardFormStat__icon">
                            <HiOutlineExclamationCircle />
                        </div>

                        <div>
                            <span>
                                New
                            </span>

                            <strong>
                                {formSubmissions.new ||
                                    0}
                            </strong>
                        </div>
                    </button>


                    <button
                        type="button"
                        className="staffDashboardFormStat"
                        onClick={() =>
                            handleViewFormSubmissions(
                                "REVIEWING",
                            )
                        }
                    >
                        <div className="staffDashboardFormStat__icon">
                            <HiOutlineClock />
                        </div>

                        <div>
                            <span>
                                Reviewing
                            </span>

                            <strong>
                                {formSubmissions.reviewing ||
                                    0}
                            </strong>
                        </div>
                    </button>


                    <button
                        type="button"
                        className="staffDashboardFormStat"
                        onClick={() =>
                            handleViewFormSubmissions(
                                "CONTACTED",
                            )
                        }
                    >
                        <div className="staffDashboardFormStat__icon">
                            <HiOutlineUserGroup />
                        </div>

                        <div>
                            <span>
                                Contacted
                            </span>

                            <strong>
                                {formSubmissions.contacted ||
                                    0}
                            </strong>
                        </div>
                    </button>


                    <button
                        type="button"
                        className="staffDashboardFormStat"
                        onClick={() =>
                            handleViewFormSubmissions(
                                "QUALIFIED",
                            )
                        }
                    >
                        <div className="staffDashboardFormStat__icon">
                            <HiOutlineCheckCircle />
                        </div>

                        <div>
                            <span>
                                Qualified
                            </span>

                            <strong>
                                {formSubmissions.qualified ||
                                    0}
                            </strong>
                        </div>
                    </button>


                    <button
                        type="button"
                        className="staffDashboardFormStat"
                        onClick={() =>
                            handleViewFormSubmissions(
                                "CONVERTED",
                            )
                        }
                    >
                        <div className="staffDashboardFormStat__icon">
                            <HiOutlineCheckCircle />
                        </div>

                        <div>
                            <span>
                                Converted
                            </span>

                            <strong>
                                {formSubmissions.converted ||
                                    0}
                            </strong>
                        </div>
                    </button>

                </div>

            </section>


            {/* ======================================================
                MAIN GRID
            ====================================================== */}

            <div className="staffDashboard__grid">

                {/* ====================================================
                    RECENT APPLICATIONS
                ==================================================== */}

                <section className="staffDashboardPanel">

                    <div className="staffDashboardPanel__header">

                        <div>
                            <span>
                                Work Queue
                            </span>

                            <h2>
                                Recent Applications
                            </h2>
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                handleViewApplications()
                            }
                        >
                            View all

                            <HiOutlineArrowRight />
                        </button>

                    </div>


                    <div className="staffDashboardApplications">

                        {recentApplications.length === 0 ? (
                            <div className="staffDashboardEmpty">
                                <HiOutlineClipboardList />

                                <h3>
                                    No applications assigned
                                </h3>

                                <p>
                                    Applications assigned to you
                                    will appear here.
                                </p>
                            </div>
                        ) : (
                            recentApplications.map(
                                (application) => {

                                    const applicationId =
                                        application?._id;

                                    const client =
                                        application?.user;

                                    const status =
                                        formatStatus(
                                            application?.status ||
                                            "DRAFT",
                                        );

                                    return (
                                        <button
                                            type="button"
                                            key={applicationId}
                                            className="staffApplicationRow"
                                            onClick={() =>
                                                handleApplicationClick(
                                                    applicationId,
                                                )
                                            }
                                        >

                                            <div className="staffApplicationRow__avatar">
                                                {(
                                                    client?.name ||
                                                    "C"
                                                )
                                                    .trim()
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </div>

                                            <div className="staffApplicationRow__main">

                                                <strong>
                                                    {client?.name ||
                                                        "Unknown Client"}
                                                </strong>

                                                <span>
                                                    {application?.applicationReference ||
                                                        "Application"}
                                                </span>

                                            </div>

                                            <div className="staffApplicationRow__destination">

                                                <span>
                                                    Destination
                                                </span>

                                                <strong>
                                                    {application?.destinationCountry ||
                                                        application
                                                            ?.opportunitySnapshot
                                                            ?.countryName ||
                                                        "—"}
                                                </strong>

                                            </div>

                                            <div className="staffApplicationRow__status">

                                                <span
                                                    className={`staffStatus staffStatus--${String(
                                                        application?.status ||
                                                        "DRAFT",
                                                    ).toLowerCase()}`}
                                                >
                                                    {status}
                                                </span>

                                            </div>

                                            <HiOutlineArrowRight className="staffApplicationRow__arrow" />

                                        </button>
                                    );
                                },
                            )
                        )}

                    </div>

                </section>


                {/* ====================================================
                    RECENT FORM SUBMISSIONS
                ==================================================== */}

                <section className="staffDashboardPanel staffDashboardPanel--forms">

                    <div className="staffDashboardPanel__header">

                        <div>
                            <span>
                                Website Enquiries
                            </span>

                            <h2>
                                Recent Form Submissions
                            </h2>
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                handleViewFormSubmissions()
                            }
                        >
                            View all

                            <HiOutlineArrowRight />
                        </button>

                    </div>


                    <div className="staffDashboardFormSubmissions">

                        {recentFormSubmissions.length === 0 ? (
                            <div className="staffDashboardEmpty">
                                <HiOutlineCollection />

                                <h3>
                                    No form submissions assigned
                                </h3>

                                <p>
                                    Website enquiries assigned to
                                    you will appear here.
                                </p>
                            </div>
                        ) : (
                            recentFormSubmissions.map(
                                (submission) => {

                                    const submissionId =
                                        getFormSubmissionId(
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
                                            key={submissionId}
                                            className="staffFormSubmissionRow"
                                            onClick={() =>
                                                handleFormSubmissionClick(
                                                    submission,
                                                )
                                            }
                                        >

                                            <div className="staffFormSubmissionRow__avatar">
                                                {getSubmissionInitial(
                                                    submission,
                                                )}
                                            </div>

                                            <div className="staffFormSubmissionRow__main">

                                                <strong>
                                                    {getSubmissionName(
                                                        submission,
                                                    )}
                                                </strong>

                                                <span>
                                                    {getSubmissionFormName(
                                                        submission,
                                                    )}
                                                </span>

                                                {getSubmissionEmail(
                                                    submission,
                                                ) && (
                                                        <small>
                                                            {getSubmissionEmail(
                                                                submission,
                                                            )}
                                                        </small>
                                                    )}

                                            </div>

                                            <div className="staffFormSubmissionRow__status">

                                                <span
                                                    className={`staffFormStatus staffFormStatus--${submissionStatus}`}
                                                >
                                                    {formatStatus(
                                                        submission?.status ||
                                                        "NEW",
                                                    )}
                                                </span>

                                            </div>

                                            <HiOutlineArrowRight className="staffFormSubmissionRow__arrow" />

                                        </button>
                                    );
                                },
                            )
                        )}

                    </div>

                </section>


                {/* ====================================================
                    ATTENTION PANEL
                ==================================================== */}

                <section className="staffDashboardPanel staffDashboardPanel--attention">

                    <div className="staffDashboardPanel__header">

                        <div>
                            <span>
                                Attention
                            </span>

                            <h2>
                                Work Requiring Action
                            </h2>
                        </div>

                    </div>


                    <div className="staffAttentionList">

                        <button
                            type="button"
                            className="staffAttentionItem"
                            onClick={() =>
                                handleViewApplications(
                                    "UNDER_REVIEW",
                                )
                            }
                        >
                            <div className="staffAttentionItem__icon">
                                <HiOutlineClock />
                            </div>

                            <div>
                                <strong>
                                    Applications under review
                                </strong>

                                <span>
                                    {applications.underReview ||
                                        0}{" "}
                                    assigned application
                                    {applications.underReview ===
                                        1
                                        ? ""
                                        : "s"}
                                </span>
                            </div>

                            <HiOutlineArrowRight />
                        </button>


                        <button
                            type="button"
                            className="staffAttentionItem"
                            onClick={() =>
                                handleViewApplications(
                                    "DOCUMENT_REQUEST",
                                )
                            }
                        >
                            <div className="staffAttentionItem__icon">
                                <HiOutlineExclamationCircle />
                            </div>

                            <div>
                                <strong>
                                    Document requests
                                </strong>

                                <span>
                                    {applications.documentRequest ||
                                        0}{" "}
                                    application
                                    {applications.documentRequest ===
                                        1
                                        ? ""
                                        : "s"} waiting
                                </span>
                            </div>

                            <HiOutlineArrowRight />
                        </button>


                        <button
                            type="button"
                            className="staffAttentionItem"
                            onClick={() =>
                                handleViewApplications(
                                    "SUBMITTED",
                                )
                            }
                        >
                            <div className="staffAttentionItem__icon">
                                <HiOutlineDocumentText />
                            </div>

                            <div>
                                <strong>
                                    New application submissions
                                </strong>

                                <span>
                                    {applications.submitted ||
                                        0}{" "}
                                    submitted application
                                    {applications.submitted === 1
                                        ? ""
                                        : "s"}
                                </span>
                            </div>

                            <HiOutlineArrowRight />
                        </button>


                        <button
                            type="button"
                            className="staffAttentionItem"
                            onClick={() =>
                                handleViewApplications()
                            }
                        >
                            <div className="staffAttentionItem__icon">
                                <HiOutlineDocumentText />
                            </div>

                            <div>
                                <strong>
                                    Documents pending review
                                </strong>

                                <span>
                                    {documents.pendingReview ||
                                        0}{" "}
                                    document
                                    {documents.pendingReview === 1
                                        ? ""
                                        : "s"}
                                </span>
                            </div>

                            <HiOutlineArrowRight />
                        </button>


                        <button
                            type="button"
                            className="staffAttentionItem"
                            onClick={() =>
                                handleViewFormSubmissions(
                                    "NEW",
                                )
                            }
                        >
                            <div className="staffAttentionItem__icon">
                                <HiOutlineCollection />
                            </div>

                            <div>
                                <strong>
                                    New website enquiries
                                </strong>

                                <span>
                                    {formSubmissions.new ||
                                        0}{" "}
                                    new form submission
                                    {formSubmissions.new === 1
                                        ? ""
                                        : "s"}
                                </span>
                            </div>

                            <HiOutlineArrowRight />
                        </button>


                        <button
                            type="button"
                            className="staffAttentionItem"
                            onClick={() =>
                                handleViewFormSubmissions(
                                    "REVIEWING",
                                )
                            }
                        >
                            <div className="staffAttentionItem__icon">
                                <HiOutlineClock />
                            </div>

                            <div>
                                <strong>
                                    Form submissions under review
                                </strong>

                                <span>
                                    {formSubmissions.reviewing ||
                                        0}{" "}
                                    submission
                                    {formSubmissions.reviewing ===
                                        1
                                        ? ""
                                        : "s"} being reviewed
                                </span>
                            </div>

                            <HiOutlineArrowRight />
                        </button>

                    </div>

                </section>

            </div>

        </section>
    );
};

export default StaffDashboard;
