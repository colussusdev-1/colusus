
import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Link,
} from "react-router-dom";

import {
    HiOutlineArrowRight,
    HiOutlinePlus,
    HiOutlineRefresh,
    HiOutlineDocumentText,
    HiOutlineFolderOpen,
    HiOutlineClock,
    HiOutlineCheckCircle,
    HiOutlineSupport,
    HiOutlineGlobeAlt,
} from "react-icons/hi";

import applicationService
    from "../../services/application.service";

import "./ClientDashboard.css";

import {
    calculateProgress,
    getDocumentProgress,
    getStatusConfig,
    getUser,
    getActiveApplication,
    getNextAction,
} from "../../components/ClientPortal/dashboard/dashboard.utils";

import {
    getCountryFlag,
} from "../../components/ClientPortal/dashboard/countries";

import ApplicationHistory
    from "../../components/ClientPortal/dashboard/ApplicationHistory";

import {
    DashboardAlert,
    DashboardLoading,
} from "../../components/ClientPortal/dashboard/DashboardStates";

import ClientOnboarding
    from "./ClientOnboarding";

import RecommendedOpportunities
    from "../../components/ClientPortal/dashboard/RecommendedOpportunities/RecommendedOpportunities";


const ClientDashboard = () => {

    /* =========================================================
       STATE
    ========================================================= */

    const [applications, setApplications] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [error, setError] =
        useState("");


    /* =========================================================
       USER
    ========================================================= */

    const user =
        getUser();


    /* =========================================================
       LOAD APPLICATIONS
    ========================================================= */

    const loadApplications =
        useCallback(
            async (isRefresh = false) => {

                if (
                    isRefresh &&
                    refreshing
                ) {
                    return;
                }


                const refreshStartedAt =
                    Date.now();


                try {

                    if (isRefresh) {

                        setRefreshing(true);

                    } else {

                        setLoading(true);

                    }


                    setError("");


                    const data =
                        await applicationService
                            .getApplications();


                    setApplications(
                        Array.isArray(data)
                            ? data
                            : [],
                    );


                } catch (error) {

                    console.error(
                        "FAILED TO LOAD APPLICATIONS:",
                        error,
                    );


                    setError(
                        error?.response?.data?.message ||
                        "Unable to load your applications.",
                    );


                } finally {

                    if (isRefresh) {

                        const elapsed =
                            Date.now() -
                            refreshStartedAt;

                        const minimumRefreshTime =
                            650;

                        const remainingTime =
                            Math.max(
                                0,
                                minimumRefreshTime -
                                elapsed,
                            );


                        setTimeout(() => {

                            setRefreshing(
                                false,
                            );

                        }, remainingTime);

                    } else {

                        setLoading(false);

                    }

                }

            },
            [refreshing],
        );


    /* =========================================================
       INITIAL LOAD
    ========================================================= */

    useEffect(() => {

        loadApplications(false);

    }, [
        loadApplications,
    ]);


    /* =========================================================
       APPLICATION SUMMARY
    ========================================================= */

    const summary =
        useMemo(() => {

            let documentsUploaded = 0;

            let documentsRequired = 0;


            applications.forEach(
                (application) => {

                    const progress =
                        getDocumentProgress(
                            application,
                        );


                    documentsUploaded +=
                        Number(
                            progress?.uploaded ||
                            0,
                        );


                    documentsRequired +=
                        Number(
                            progress?.required ||
                            0,
                        );

                },
            );


            const active =
                applications.filter(
                    (application) => {

                        const status =
                            String(
                                application?.status ||
                                "",
                            ).toUpperCase();


                        return ![
                            "APPROVED",
                            "REJECTED",
                        ].includes(status);

                    },
                );


            const completed =
                applications.filter(
                    (application) =>
                        String(
                            application?.status ||
                            "",
                        ).toUpperCase() ===
                        "APPROVED",
                );


            return {

                total:
                    applications.length,

                active:
                    active.length,

                completed:
                    completed.length,

                documentsUploaded,

                documentsRequired,

            };

        }, [
            applications,
        ]);


    /* =========================================================
       ACTIVE APPLICATION
    ========================================================= */

    const activeApplication =
        useMemo(
            () =>
                getActiveApplication(
                    applications,
                ),
            [applications],
        );


    /* =========================================================
       ACTIVE APPLICATION DATA
    ========================================================= */

    const activeStatus =
        getStatusConfig(
            activeApplication?.status,
        );


    const activeProgress =
        calculateProgress(
            activeApplication,
        );


    const documentProgress =
        getDocumentProgress(
            activeApplication,
        );


    const nextAction =
        getNextAction(
            activeApplication,
        );


    const destinationCountry =
        activeApplication?.destinationCountry ||
        activeApplication?.opportunity?.countryName ||
        "Your destination";


    const countryFlag =
        getCountryFlag(
            destinationCountry,
        );


    const applicationType =
        activeApplication?.type
            ?.replace(
                /_/g,
                " ",
            )
            ?.replace(
                /\b\w/g,
                (char) =>
                    char.toUpperCase(),
            ) ||
        "Migration Application";


    const activeApplicationId =
        activeApplication?._id ||
        activeApplication?.id;


    /* =========================================================
       USER NAME
    ========================================================= */

    const firstName =
        user?.name
            ?.trim()
            ?.split(/\s+/)[0] ||
        "there";


    /* =========================================================
       DOCUMENT PERCENTAGE
    ========================================================= */

    const documentPercentage =
        documentProgress?.required
            ? Math.min(
                100,
                Math.round(
                    (
                        Number(
                            documentProgress.uploaded ||
                            0,
                        ) /
                        Number(
                            documentProgress.required ||
                            1,
                        )
                    ) *
                    100,
                ),
            )
            : documentProgress?.complete
                ? 100
                : 0;


    /* =========================================================
       APPLICATION DATE
    ========================================================= */

    const formatDate = (date) => {

        if (!date) {
            return "Recently";
        }


        const parsedDate =
            new Date(date);


        if (
            Number.isNaN(
                parsedDate.getTime(),
            )
        ) {

            return "Recently";

        }


        return parsedDate.toLocaleDateString(
            "en-GB",
            {
                day: "numeric",
                month: "short",
                year: "numeric",
            },
        );

    };


    /* =========================================================
       APPLICATIONS PREVIEW
    ========================================================= */

    const applicationPreview =
        useMemo(
            () =>
                [...applications]
                    .sort(
                        (a, b) => {

                            const aDate =
                                new Date(
                                    a?.updatedAt ||
                                    a?.createdAt ||
                                    0,
                                ).getTime();


                            const bDate =
                                new Date(
                                    b?.updatedAt ||
                                    b?.createdAt ||
                                    0,
                                ).getTime();


                            return bDate - aDate;

                        },
                    )
                    .slice(
                        0,
                        4,
                    ),
            [applications],
        );


    /* =========================================================
       RECENT ACTIVITY
    ========================================================= */

    const recentActivity =
        useMemo(() => {

            return applications
                .filter(Boolean)
                .sort(
                    (a, b) => {

                        const aDate =
                            new Date(
                                a?.updatedAt ||
                                a?.createdAt ||
                                0,
                            ).getTime();


                        const bDate =
                            new Date(
                                b?.updatedAt ||
                                b?.createdAt ||
                                0,
                            ).getTime();


                        return bDate - aDate;

                    },
                )
                .slice(
                    0,
                    3,
                );

        }, [
            applications,
        ]);


    /* =========================================================
       RENDER
    ========================================================= */

    return (

        <main className="client-dashboard">


            {/* =====================================================
                WELCOME HEADER
            ===================================================== */}

            <header className="dashboard-header">

                <div className="dashboard-header-copy">

                    <span className="dashboard-eyebrow">
                        YOUR MIGRATION JOURNEY
                    </span>


                    <h1>
                        Good morning, {firstName}
                    </h1>


                    <p>
                        Here's what's happening with your
                        migration journey.
                    </p>

                </div>


                <div className="dashboard-header-actions">

                    <button
                        type="button"
                        className={`dashboard-icon-button ${
                            refreshing
                                ? "is-refreshing"
                                : ""
                        }`}
                        onClick={() =>
                            loadApplications(true)
                        }
                        disabled={refreshing}
                        aria-label="Refresh dashboard"
                        title={
                            refreshing
                                ? "Refreshing dashboard..."
                                : "Refresh dashboard"
                        }
                    >

                        <HiOutlineRefresh
                            className={
                                refreshing
                                    ? "dashboard-refresh-icon is-spinning"
                                    : "dashboard-refresh-icon"
                            }
                        />

                    </button>


                    <Link
                        to="/portal/applications/new"
                        className="dashboard-start-button"
                    >

                        <HiOutlinePlus />

                        <span>
                            Start Application
                        </span>

                    </Link>

                </div>

            </header>


            {/* =====================================================
                ERROR
            ===================================================== */}

            {error && (

                <DashboardAlert
                    message={error}
                />

            )}


            {/* =====================================================
                LOADING / NEW CLIENT / EXISTING CLIENT
            ===================================================== */}

            {loading ? (

                <DashboardLoading />

            ) : !applications.length ? (

                /*
                ====================================================
                NEW CLIENT ONBOARDING
                ====================================================

                Clients without an application do not see the
                active-client dashboard.

                They immediately enter the migration discovery
                experience where opportunities are visible.
                */

                <ClientOnboarding />

            ) : (

                <>


                    {/* =================================================
                        SMALL OVERVIEW
                    ================================================= */}

                    <section
                        className="dashboard-overview"
                        aria-label="Migration overview"
                    >

                        <div className="dashboard-overview-item">

                            <div className="dashboard-overview-icon">

                                <HiOutlineDocumentText />

                            </div>

                            <div>

                                <strong>
                                    {summary.total}
                                </strong>

                                <span>
                                    {summary.total === 1
                                        ? "Application"
                                        : "Applications"}
                                </span>

                            </div>

                        </div>


                        <div className="dashboard-overview-item">

                            <div className="dashboard-overview-icon">

                                <HiOutlineClock />

                            </div>

                            <div>

                                <strong>
                                    {summary.active}
                                </strong>

                                <span>
                                    {summary.active === 1
                                        ? "Active journey"
                                        : "Active journeys"}
                                </span>

                            </div>

                        </div>


                        <div className="dashboard-overview-item">

                            <div className="dashboard-overview-icon">

                                <HiOutlineFolderOpen />

                            </div>

                            <div>

                                <strong>

                                    {summary.documentsRequired
                                        ? `${summary.documentsUploaded}/${summary.documentsRequired}`
                                        : summary.documentsUploaded}

                                </strong>

                                <span>
                                    Documents submitted
                                </span>

                            </div>

                        </div>


                        <div className="dashboard-overview-item">

                            <div className="dashboard-overview-icon">

                                <HiOutlineCheckCircle />

                            </div>

                            <div>

                                <strong>
                                    {summary.completed}
                                </strong>

                                <span>
                                    Completed
                                </span>

                            </div>

                        </div>

                    </section>


                    {/* =================================================
                        ACTIVE MIGRATION JOURNEY
                    ================================================= */}

                    {activeApplication && (

                        <section className="migration-journey-section">

                            <div className="dashboard-section-heading">

                                <div>

                                    <span className="section-eyebrow">
                                        ACTIVE JOURNEY
                                    </span>

                                    <h2>
                                        Your migration application
                                    </h2>

                                </div>


                                <Link
                                    to="/portal/applications"
                                    className="dashboard-section-link"
                                >

                                    View all applications

                                    <HiOutlineArrowRight />

                                </Link>

                            </div>


                            <article className="migration-journey-card">


                                {/* =========================================
                                    JOURNEY INTRO
                                ========================================= */}

                                <div className="journey-card-main">

                                    <div className="journey-destination">

                                        <div className="journey-country-icon">

                                            {countryFlag ? (

                                                <img
                                                    src={countryFlag}
                                                    alt=""
                                                />

                                            ) : (

                                                <HiOutlineGlobeAlt />

                                            )}

                                        </div>


                                        <div>

                                            <span>
                                                DESTINATION
                                            </span>

                                            <h3>
                                                {destinationCountry}
                                            </h3>

                                            <p>
                                                {applicationType}
                                            </p>

                                        </div>

                                    </div>


                                    <span
                                        className={`journey-status ${
                                            activeStatus?.className || ""
                                        }`}
                                    >

                                        <i />

                                        {activeStatus?.label ||
                                            "Pending"}

                                    </span>

                                </div>


                                {/* =========================================
                                    PROGRESS
                                ========================================= */}

                                <div className="journey-progress">

                                    <div className="journey-progress-header">

                                        <div>

                                            <span>
                                                Migration progress
                                            </span>

                                            <small>
                                                {activeStatus?.description ||
                                                    "Your application is being prepared."}
                                            </small>

                                        </div>


                                        <strong>
                                            {activeProgress}%
                                        </strong>

                                    </div>


                                    <div className="journey-progress-track">

                                        <span
                                            style={{
                                                width:
                                                    `${activeProgress}%`,
                                            }}
                                        />

                                    </div>

                                </div>


                                {/* =========================================
                                    JOURNEY STAGES
                                ========================================= */}

                                <div className="journey-stages">

                                    <div
                                        className={
                                            activeProgress >= 10
                                                ? "is-complete"
                                                : "is-current"
                                        }
                                    >

                                        <span>
                                            1
                                        </span>

                                        <small>
                                            Documents
                                        </small>

                                    </div>


                                    <div
                                        className={
                                            activeProgress >= 50
                                                ? "is-complete"
                                                : activeProgress > 10
                                                    ? "is-current"
                                                    : ""
                                        }
                                    >

                                        <span>
                                            2
                                        </span>

                                        <small>
                                            Review
                                        </small>

                                    </div>


                                    <div
                                        className={
                                            activeProgress >= 55
                                                ? "is-complete"
                                                : activeProgress >= 50
                                                    ? "is-current"
                                                    : ""
                                        }
                                    >

                                        <span>
                                            3
                                        </span>

                                        <small>
                                            Submission
                                        </small>

                                    </div>


                                    <div
                                        className={
                                            activeProgress >= 85
                                                ? "is-complete"
                                                : activeProgress >= 55
                                                    ? "is-current"
                                                    : ""
                                        }
                                    >

                                        <span>
                                            4
                                        </span>

                                        <small>
                                            Processing
                                        </small>

                                    </div>


                                    <div
                                        className={
                                            activeProgress >= 100
                                                ? "is-complete"
                                                : ""
                                        }
                                    >

                                        <span>
                                            5
                                        </span>

                                        <small>
                                            Decision
                                        </small>

                                    </div>

                                </div>


                                {/* =========================================
                                    JOURNEY FOOTER
                                ========================================= */}

                                <div className="journey-footer">

                                    <div className="journey-document-summary">

                                        <HiOutlineFolderOpen />

                                        <div>

                                            <span>
                                                Documents
                                            </span>

                                            <strong>

                                                {documentProgress.required
                                                    ? `${documentProgress.uploaded} of ${documentProgress.required}`
                                                    : documentProgress.uploaded}

                                            </strong>

                                        </div>

                                    </div>


                                    <div className="journey-stage-summary">

                                        <span>
                                            Current stage
                                        </span>

                                        <strong>
                                            {activeStatus?.label ||
                                                "Pending"}
                                        </strong>

                                    </div>


                                    {activeApplicationId && (

                                        <Link
                                            to={`/portal/applications/${activeApplicationId}`}
                                            className="journey-primary-button"
                                        >

                                            Continue application

                                            <HiOutlineArrowRight />

                                        </Link>

                                    )}

                                </div>

                            </article>

                        </section>

                    )}


                    {/* =================================================
                        THINGS YOU NEED TO DO
                    ================================================= */}

                    {activeApplication && (

                        <section className="dashboard-action-section">

                            <div className="dashboard-section-heading">

                                <div>

                                    <span className="section-eyebrow">
                                        YOUR NEXT STEP
                                    </span>

                                    <h2>
                                        Things you need to do
                                    </h2>

                                </div>

                            </div>


                            <div className="dashboard-action-grid">


                                {/* =========================================
                                    NEXT ACTION
                                ========================================= */}

                                <article
                                    className={`dashboard-action-card ${
                                        nextAction?.urgent
                                            ? "is-urgent"
                                            : ""
                                    }`}
                                >

                                    <div className="action-card-icon">

                                        <HiOutlineDocumentText />

                                    </div>


                                    <div className="action-card-content">

                                        <span className="action-card-label">
                                            APPLICATION ACTION
                                        </span>


                                        <h3>

                                            {nextAction?.title ||
                                                (
                                                    documentProgress.complete
                                                        ? "Your documents are complete"
                                                        : "Complete your documents"
                                                )}

                                        </h3>


                                        <p>

                                            {nextAction?.description ||
                                                (
                                                    documentProgress.complete
                                                        ? "Your submitted documents are currently being processed."
                                                        : "Upload the remaining required documents to keep your application moving."
                                                )}

                                        </p>


                                        <div className="action-card-progress">

                                            <div>

                                                <span>
                                                    Document progress
                                                </span>

                                                <strong>
                                                    {documentPercentage}%
                                                </strong>

                                            </div>


                                            <div className="action-card-progress-track">

                                                <span
                                                    style={{
                                                        width:
                                                            `${documentPercentage}%`,
                                                    }}
                                                />

                                            </div>

                                        </div>


                                        {activeApplicationId && (

                                            <Link
                                                to={`/portal/applications/${activeApplicationId}`}
                                                className="action-card-link"
                                            >

                                                Open application

                                                <HiOutlineArrowRight />

                                            </Link>

                                        )}

                                    </div>

                                </article>


                                {/* =========================================
                                    DOCUMENT SHORTCUT
                                ========================================= */}

                                <Link
                                    to="/portal/documents"
                                    className="dashboard-quick-card"
                                >

                                    <div className="quick-card-icon">

                                        <HiOutlineFolderOpen />

                                    </div>


                                    <div>

                                        <span>
                                            DOCUMENTS
                                        </span>

                                        <h3>

                                            {documentProgress.complete
                                                ? "Documents are up to date"
                                                : "Review your documents"}

                                        </h3>

                                        <p>

                                            {documentProgress.required
                                                ? `${documentProgress.uploaded} of ${documentProgress.required} required documents submitted.`
                                                : "View and manage the documents connected to your applications."}

                                        </p>

                                    </div>


                                    <HiOutlineArrowRight
                                        className="quick-card-arrow"
                                    />

                                </Link>

                            </div>

                        </section>

                    )}


                    {/* =================================================
                        MY APPLICATIONS
                    ================================================= */}

                    <section className="dashboard-applications-section">

                        <div className="dashboard-section-heading">

                            <div>

                                <span className="section-eyebrow">
                                    APPLICATIONS
                                </span>

                                <h2>
                                    My applications
                                </h2>

                            </div>


                            <Link
                                to="/portal/applications"
                                className="dashboard-section-link"
                            >

                                View all

                                <HiOutlineArrowRight />

                            </Link>

                        </div>


                        <div className="dashboard-applications-list">

                            {applicationPreview.map(
                                (application) => {

                                    const applicationId =
                                        application?._id ||
                                        application?.id;


                                    const status =
                                        getStatusConfig(
                                            application?.status,
                                        );


                                    const country =
                                        application?.destinationCountry ||
                                        application?.opportunity?.countryName ||
                                        "Destination";


                                    const flag =
                                        getCountryFlag(
                                            country,
                                        );


                                    const type =
                                        application?.type
                                            ?.replace(
                                                /_/g,
                                                " ",
                                            )
                                            ?.replace(
                                                /\b\w/g,
                                                (char) =>
                                                    char.toUpperCase(),
                                            ) ||
                                        "Migration Application";


                                    return (

                                        <Link
                                            key={
                                                applicationId ||
                                                `${country}-${application?.createdAt}`
                                            }
                                            to={
                                                applicationId
                                                    ? `/portal/applications/${applicationId}`
                                                    : "/portal/applications"
                                            }
                                            className="dashboard-application-row"
                                        >

                                            <div className="application-row-country">

                                                <div className="application-row-flag">

                                                    {flag ? (

                                                        <img
                                                            src={flag}
                                                            alt=""
                                                        />

                                                    ) : (

                                                        <HiOutlineGlobeAlt />

                                                    )}

                                                </div>


                                                <div>

                                                    <strong>
                                                        {country}
                                                    </strong>

                                                    <span>
                                                        {type}
                                                    </span>

                                                </div>

                                            </div>


                                            <div className="application-row-date">

                                                <span>
                                                    Started
                                                </span>

                                                <strong>
                                                    {formatDate(
                                                        application?.createdAt,
                                                    )}
                                                </strong>

                                            </div>


                                            <span
                                                className={`application-row-status ${
                                                    status?.className || ""
                                                }`}
                                            >

                                                <i />

                                                {status?.label ||
                                                    "Pending"}

                                            </span>


                                            <HiOutlineArrowRight
                                                className="application-row-arrow"
                                            />

                                        </Link>

                                    );

                                },
                            )}

                        </div>

                    </section>


                    {/* =================================================
                        RECOMMENDED MIGRATION OPPORTUNITIES
                    ================================================= */}

                    <RecommendedOpportunities
                        activeApplication={activeApplication}
                    />


                    {/* =================================================
                        RECENT ACTIVITY
                    ================================================= */}

                    <section className="dashboard-activity-section">

                        <div className="dashboard-section-heading">

                            <div>

                                <span className="section-eyebrow">
                                    RECENT ACTIVITY
                                </span>

                                <h2>
                                    Latest application activity
                                </h2>

                            </div>


                            <Link
                                to="/portal/updates"
                                className="dashboard-section-link"
                            >

                                View updates

                                <HiOutlineArrowRight />

                            </Link>

                        </div>


                        <div className="dashboard-activity-list">

                            {recentActivity.map(
                                (application) => {

                                    const country =
                                        application?.destinationCountry ||
                                        application?.opportunity?.countryName ||
                                        "Your application";


                                    const status =
                                        getStatusConfig(
                                            application?.status,
                                        );


                                    const activityDate =
                                        application?.updatedAt ||
                                        application?.createdAt;


                                    const applicationId =
                                        application?._id ||
                                        application?.id;


                                    return (

                                        <Link
                                            key={
                                                applicationId ||
                                                `${country}-${activityDate}`
                                            }
                                            to={
                                                applicationId
                                                    ? `/portal/applications/${applicationId}`
                                                    : "/portal/applications"
                                            }
                                            className="dashboard-activity-row"
                                        >

                                            <div className="activity-icon">

                                                <HiOutlineClock />

                                            </div>


                                            <div className="activity-content">

                                                <strong>
                                                    {country} application
                                                </strong>

                                                <span>
                                                    Current status:{" "}
                                                    {status?.label ||
                                                        "Pending"}
                                                </span>

                                            </div>


                                            <time>
                                                {formatDate(
                                                    activityDate,
                                                )}
                                            </time>


                                            <HiOutlineArrowRight
                                                className="activity-arrow"
                                            />

                                        </Link>

                                    );

                                },
                            )}

                        </div>

                    </section>


                    {/* =================================================
                        SUPPORT
                    ================================================= */}

                    <section className="dashboard-support">

                        <div className="dashboard-support-icon">

                            <HiOutlineSupport />

                        </div>


                        <div className="dashboard-support-content">

                            <span>
                                NEED HELP?
                            </span>

                            <h2>
                                We're here to support your journey.
                            </h2>

                            <p>
                                If you have questions about your
                                application or need assistance,
                                our team is here to help.
                            </p>

                        </div>


                        <Link
                            to="/portal/help"
                            className="dashboard-support-button"
                        >

                            Contact support

                            <HiOutlineArrowRight />

                        </Link>

                    </section>


                    {/* =================================================
                        SECURITY
                    ================================================= */}

                    <footer className="dashboard-security">

                        <div>

                            <strong>
                                Your information is protected
                            </strong>

                            <span>
                                Colusus keeps your application data
                                secure and accessible only to you
                                and your authorised team.
                            </span>

                        </div>


                        <span>
                            Secure client portal
                        </span>

                    </footer>


                    {/* =================================================
                        KEEP APPLICATION HISTORY AVAILABLE
                    ================================================= */}

                    <div className="dashboard-history-fallback">

                        <ApplicationHistory
                            applications={
                                applications
                            }
                        />

                    </div>


                </>

            )}

        </main>

    );

};


export default ClientDashboard;