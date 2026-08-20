import { useEffect, useMemo, useState } from "react";
import { HiOutlineRefresh } from "react-icons/hi";

import applicationService from "../../services/application.service";

import ApplicationsHeader from "../../components/ClientPortal/applications/ApplicationsHeader/ApplicationsHeader";
import ApplicationsMetrics from "../../components/ClientPortal/applications/ApplicationsMetrics/ApplicationsMetrics";
import ApplicationsToolbar from "../../components/ClientPortal/applications/ApplicationsToolbar/ApplicationsToolbar";
import ApplicationsList from "../../components/ClientPortal/applications/ApplicationsList/ApplicationsList";
import ApplicationsEmpty from "../../components/ClientPortal/applications/ApplicationsEmpty/ApplicationsEmpty";

import "./Applications.css";


/* ============================================================
   FILTER CONFIGURATION
============================================================ */

const FILTER_KEYS = {
    ALL: "ALL",
    ACTIVE: "ACTIVE",
    SUBMITTED: "SUBMITTED",
    COMPLETED: "COMPLETED",
};


/* ============================================================
   APPLICATIONS PAGE
============================================================ */

const Applications = () => {
    const [applications, setApplications] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [activeFilter, setActiveFilter] =
        useState(FILTER_KEYS.ALL);

    const [searchQuery, setSearchQuery] =
        useState("");


    /* ==========================================================
       LOAD APPLICATIONS
    ========================================================== */

    useEffect(() => {
        const loadApplications = async () => {
            try {
                setLoading(true);

                setError("");

                const data =
                    await applicationService.getApplications();

                setApplications(
                    Array.isArray(data)
                        ? data
                        : []
                );

            } catch (error) {
                console.error(
                    "FAILED TO LOAD APPLICATIONS:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Unable to load your applications."
                );

            } finally {
                setLoading(false);
            }
        };


        loadApplications();
    }, []);


    /* ==========================================================
       APPLICATION COUNTS
    ========================================================== */

    const applicationCounts = useMemo(() => {

        const total =
            applications.length;


        const completed =
            applications.filter(
                (application) =>
                    [
                        "APPROVED",
                        "COMPLETED",
                    ].includes(
                        application.status
                    )
            ).length;


        const submitted =
            applications.filter(
                (application) =>
                    application.status ===
                    "SUBMITTED"
            ).length;


        const active =
            applications.filter(
                (application) =>
                    ![
                        "APPROVED",
                        "COMPLETED",
                        "REJECTED",
                    ].includes(
                        application.status
                    )
            ).length;


        return {
            total,
            active,
            completed,
            submitted,
        };

    }, [applications]);


    /* ==========================================================
       FILTER TABS
    ========================================================== */

    const filters = useMemo(() => {

        return [
            {
                key: FILTER_KEYS.ALL,
                label: "All",
                count: applicationCounts.total,
            },

            {
                key: FILTER_KEYS.ACTIVE,
                label: "In Progress",
                count: applicationCounts.active,
            },

            {
                key: FILTER_KEYS.SUBMITTED,
                label: "Submitted",
                count: applicationCounts.submitted,
            },

            {
                key: FILTER_KEYS.COMPLETED,
                label: "Completed",
                count: applicationCounts.completed,
            },
        ];

    }, [applicationCounts]);


    /* ==========================================================
       FILTER + SEARCH
    ========================================================== */

    const filteredApplications = useMemo(() => {

        const normalizedSearch =
            searchQuery
                .trim()
                .toLowerCase();


        return applications.filter(
            (application) => {

                /* ------------------------------------------------------
                   STATUS FILTER
                ------------------------------------------------------ */

                const status =
                    application.status;


                let matchesFilter = true;


                if (
                    activeFilter ===
                    FILTER_KEYS.ACTIVE
                ) {
                    matchesFilter =
                        ![
                            "APPROVED",
                            "COMPLETED",
                            "REJECTED",
                        ].includes(status);
                }


                if (
                    activeFilter ===
                    FILTER_KEYS.SUBMITTED
                ) {
                    matchesFilter =
                        status === "SUBMITTED";
                }


                if (
                    activeFilter ===
                    FILTER_KEYS.COMPLETED
                ) {
                    matchesFilter =
                        [
                            "APPROVED",
                            "COMPLETED",
                        ].includes(status);
                }


                if (!matchesFilter) {
                    return false;
                }


                /* ------------------------------------------------------
                   SEARCH
                ------------------------------------------------------ */

                if (!normalizedSearch) {
                    return true;
                }


                const country =
                    application.destinationCountry ||
                    application.opportunity?.countryName ||
                    "";


                const type =
                    application.type ||
                    "";


                const statusText =
                    application.status ||
                    "";


                const searchableText = [
                    country,
                    type,
                    statusText,
                ]
                    .join(" ")
                    .toLowerCase();


                return searchableText.includes(
                    normalizedSearch
                );
            }
        );

    }, [
        applications,
        activeFilter,
        searchQuery,
    ]);


    /* ==========================================================
       LOADING STATE
    ========================================================== */

    if (loading) {
        return (
            <main className="client-applications-page">

                <div className="applications-page-loading">

                    <div className="applications-loading-spinner">
                        <HiOutlineRefresh />
                    </div>

                    <span>
                        Loading your applications...
                    </span>

                </div>

            </main>
        );
    }


    /* ==========================================================
       ERROR STATE
    ========================================================== */

    if (
        error &&
        !applications.length
    ) {
        return (
            <main className="client-applications-page">

                <div className="applications-page-error">

                    <span>
                        Something went wrong
                    </span>

                    <p>
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            window.location.reload()
                        }
                    >
                        Try Again
                    </button>

                </div>

            </main>
        );
    }


    /* ==========================================================
       EMPTY STATE
    ========================================================== */

    if (
        !applications.length
    ) {
        return (
            <main className="client-applications-page">

                <ApplicationsHeader
                    applicationsCount={0}
                />

                <ApplicationsEmpty />

            </main>
        );
    }


    /* ==========================================================
       PAGE
    ========================================================== */

    return (
        <main className="client-applications-page">

            {/* ======================================================
          HEADER
      ====================================================== */}

            <ApplicationsHeader
                applicationsCount={
                    applications.length
                }
            />


            {/* ======================================================
          ERROR NOTICE
      ====================================================== */}

            {error && (
                <div className="applications-inline-error">
                    {error}
                </div>
            )}


            {/* ======================================================
          METRICS
      ====================================================== */}

            <ApplicationsMetrics
                totalApplications={
                    applicationCounts.total
                }
                activeApplications={
                    applicationCounts.active
                }
                completedApplications={
                    applicationCounts.completed
                }
                submittedApplications={
                    applicationCounts.submitted
                }
            />


            {/* ======================================================
          TOOLBAR
      ====================================================== */}

            <ApplicationsToolbar
                filters={filters}
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
            />


            {/* ======================================================
          RESULTS
      ====================================================== */}

            {filteredApplications.length > 0 ? (

                <ApplicationsList
                    applications={
                        filteredApplications
                    }
                />

            ) : (

                <div className="applications-no-results">

                    <div className="applications-no-results-icon">
                        <HiOutlineRefresh />
                    </div>

                    <h2>
                        No matching applications
                    </h2>

                    <p>
                        Try changing your search or
                        selecting a different status.
                    </p>

                    <button
                        type="button"
                        onClick={() => {
                            setSearchQuery("");
                            setActiveFilter(
                                FILTER_KEYS.ALL
                            );
                        }}
                    >
                        Clear Filters
                    </button>

                </div>

            )}

        </main>
    );
};


export default Applications;