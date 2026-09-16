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

The backend already scopes this information to the
authenticated Staff member.

Therefore this page never requests:

    all applications
    all documents
    all clients

It only works with the Staff member's assigned workload.

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

                const response = await staffService.getDashboard();

                setDashboard(response?.data || null);
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

    const handleApplicationClick = (applicationId) => {
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

    const handleViewApplications = (status = "") => {
        if (status) {
            navigate(
                `/admin/staff/applications?status=${status}`,
            );

            return;
        }

        navigate("/admin/staff/applications");
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
                        onClick={() => loadDashboard()}
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

    const recentApplications =
        dashboard?.recentApplications || [];

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
                        Manage the applications and documents
                        currently assigned to you.
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
          STATISTICS
      ====================================================== */}

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
                        handleViewApplications("SUBMITTED")
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
                            {applications.documentRequest || 0}
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
                        handleViewApplications("PROCESSING")
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
                        handleViewApplications("APPROVED")
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
                                        String(
                                            application?.status ||
                                            "DRAFT",
                                        )
                                            .replace(/_/g, " ")
                                            .toLowerCase()
                                            .replace(
                                                /\b\w/g,
                                                (character) =>
                                                    character.toUpperCase(),
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
                                    New submissions
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

                    </div>

                </section>

            </div>

        </section>
    );
};

export default StaffDashboard;