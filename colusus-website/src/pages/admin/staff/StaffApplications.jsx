import React, {
    useEffect,
    useMemo,
    useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
    HiOutlineSearch,
    HiOutlineRefresh,
    HiOutlineClipboardList,
    HiOutlineDocument,
    HiOutlineClock,
    HiOutlineCog,
    HiOutlineCheckCircle,
    HiOutlineDotsVertical,
} from "react-icons/hi";

import staffService from "./services/staff.service";

import StaffApplicationCard from "./components/StaffApplicationCard";

import "./StaffApplications.css";


/*
|--------------------------------------------------------------------------
| COLOSSUS STAFF APPLICATION PIPELINE
|--------------------------------------------------------------------------
*/


const PIPELINE_COLUMNS = [

    {
        id: "new",

        title: "New Application",

        description:
            "Newly assigned applications",

        statuses: [
            "DRAFT",
            "IN_PROGRESS",
        ],

        targetStatus: "DRAFT",

        icon: HiOutlineClipboardList,

        tone: "blue",
    },

    {
        id: "documents",

        title: "Documents Requested",

        description:
            "Waiting for client documents",

        statuses: [
            "DOCUMENT_REQUEST",
        ],

        targetStatus:
            "DOCUMENT_REQUEST",

        icon: HiOutlineDocument,

        tone: "yellow",
    },

    {
        id: "review",

        title: "Under Review",

        description:
            "Applications currently being reviewed",

        statuses: [
            "UNDER_REVIEW",
        ],

        targetStatus:
            "UNDER_REVIEW",

        icon: HiOutlineClock,

        tone: "orange",
    },

    {
        id: "processing",

        title: "Processing",

        description:
            "Applications currently being processed",

        statuses: [
            "PROCESSING",
        ],

        targetStatus:
            "PROCESSING",

        icon: HiOutlineCog,

        tone: "green",
    },

    {
        id: "submitted",

        title: "Submitted",

        description:
            "Applications submitted",

        statuses: [
            "SUBMITTED",
        ],

        targetStatus:
            "SUBMITTED",

        icon: HiOutlineCheckCircle,

        tone: "purple",
    },

];


/*
|--------------------------------------------------------------------------
| RESPONSE HELPERS
|--------------------------------------------------------------------------
*/

const getResponseData = (
    response,
) => {

    return (
        response?.data?.data ??
        response?.data ??
        response
    );
};


const getApplicationsFromResponse = (
    response,
) => {

    const data =
        getResponseData(
            response,
        );


    if (
        Array.isArray(
            data,
        )
    ) {
        return data;
    }


    return (
        data?.applications ||
        data?.assignedApplications ||
        []
    );
};


/*
|--------------------------------------------------------------------------
| APPLICATION HELPERS
|--------------------------------------------------------------------------
*/

const getApplicationName = (
    application,
) => {

    const client =
        application?.user ||
        application?.client ||
        {};


    return (
        client?.fullName ||
        client?.name ||
        [
            client?.firstName,
            client?.lastName,
        ]
            .filter(Boolean)
            .join(" ") ||
        "Unknown Client"
    );
};


const getApplicationReference = (
    application,
) => {

    return (
        application?.applicationReference ||
        application?.reference ||
        application?.applicationNumber ||
        application?.number ||
        application?.ref ||
        application?._id ||
        "Application"
    );
};


const getDestination = (
    application,
) => {

    return (
        application?.destinationCountry ||
        application?.destination ||
        application?.country ||
        application
            ?.opportunitySnapshot
            ?.countryName ||
        application
            ?.opportunity
            ?.country ||
        application
            ?.opportunity
            ?.destination ||
        "—"
    );
};


const getApplicationType = (
    application,
) => {

    return (
        application?.applicationType ||
        application?.type ||
        application?.program ||
        application
            ?.opportunitySnapshot
            ?.title ||
        application
            ?.opportunitySnapshot
            ?.name ||
        application
            ?.opportunity
            ?.title ||
        application
            ?.opportunity
            ?.name ||
        "Migration Application"
    );
};


const normalizeSearchValue = (
    value,
) => {

    return String(
        value || "",
    )
        .trim()
        .toLowerCase();
};


/*
|--------------------------------------------------------------------------
| APPLICATION CATEGORY
|--------------------------------------------------------------------------
|
| Determines which top-level workspace an application belongs to.
|
*/

const getApplicationCategory = (
    application,
) => {

    const values = [

        application?.applicationCategory,

        application?.category,

        application?.applicationType,

        application?.type,

        application?.program,

        application
            ?.opportunitySnapshot
            ?.category,

        application
            ?.opportunitySnapshot
            ?.type,

        application
            ?.opportunitySnapshot
            ?.title,

        application
            ?.opportunitySnapshot
            ?.name,

        application
            ?.opportunitySnapshot
            ?.slug,

        application
            ?.opportunity
            ?.category,

        application
            ?.opportunity
            ?.type,

        application
            ?.opportunity
            ?.title,

        application
            ?.opportunity
            ?.name,

        application
            ?.opportunity
            ?.slug,

    ];


    const searchableValue =
        values
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
            .replace(
                /[_-]+/g,
                " ",
            );


    /*
    |--------------------------------------------------------------------------
    | UK SKILLED WORKER
    |--------------------------------------------------------------------------
    */

    if (
        searchableValue.includes(
            "uk skilled worker",
        ) ||
        searchableValue.includes(
            "skilled worker",
        ) ||
        searchableValue.includes(
            "skilledworker",
        )
    ) {

        return "uk";
    }


    /*
    |--------------------------------------------------------------------------
    | ZERO DEPOSIT
    |--------------------------------------------------------------------------
    */

    if (
        searchableValue.includes(
            "zero deposit",
        ) ||
        searchableValue.includes(
            "zerodeposit",
        )
    ) {

        return "zero-deposit";
    }


    /*
    |--------------------------------------------------------------------------
    | GENERAL
    |--------------------------------------------------------------------------
    */

    return "general";
};


/*
|--------------------------------------------------------------------------
| COMPONENT
|--------------------------------------------------------------------------
*/

const StaffApplications = () => {

    const navigate =
        useNavigate();


    /*
    |--------------------------------------------------------------------------
    | APPLICATION STATE
    |--------------------------------------------------------------------------
    */

    const [
        applications,
        setApplications,
    ] = useState([]);


    const [
        loading,
        setLoading,
    ] = useState(true);


    const [
        refreshing,
        setRefreshing,
    ] = useState(false);


    const [
        error,
        setError,
    ] = useState("");


    const [
        search,
        setSearch,
    ] = useState("");


    /*
    |--------------------------------------------------------------------------
    | ACTIVE TOP-LEVEL TAB
    |--------------------------------------------------------------------------
    */

    const [
        activeType,
        setActiveType,
    ] = useState(
        "general",
    );


    /*
    |--------------------------------------------------------------------------
    | DRAG STATE
    |--------------------------------------------------------------------------
    */

    const [
        draggedApplication,
        setDraggedApplication,
    ] = useState(null);


    const [
        dragOverColumn,
        setDragOverColumn,
    ] = useState(null);


    const [
        movingApplicationId,
        setMovingApplicationId,
    ] = useState(null);


    /*
    |--------------------------------------------------------------------------
    | LOAD APPLICATIONS
    |--------------------------------------------------------------------------
    */

    const loadApplications = async ({
        showLoader = true,
    } = {}) => {

        try {

            if (
                showLoader
            ) {

                setLoading(
                    true,
                );

            } else {

                setRefreshing(
                    true,
                );

            }


            setError("");


            const response =
                await staffService.getAssignedApplications({
                    page: 1,
                    limit: 100,
                });


            const data =
                getApplicationsFromResponse(
                    response,
                );


            setApplications(
                Array.isArray(data)
                    ? data
                    : [],
            );

        } catch (err) {

            console.error(
                "Failed to load staff applications:",
                err,
            );


            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Unable to load your applications.",
            );

        } finally {

            setLoading(
                false,
            );

            setRefreshing(
                false,
            );
        }
    };


    /*
    |--------------------------------------------------------------------------
    | INITIAL LOAD
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        loadApplications();

    }, []);


    /*
    |--------------------------------------------------------------------------
    | TOP-LEVEL TAB COUNTS
    |--------------------------------------------------------------------------
    */

    const applicationTypeTabs =
        useMemo(() => {

            const counts = {

                general: 0,

                uk: 0,

                "zero-deposit": 0,

            };


            applications.forEach(
                (
                    application,
                ) => {

                    const category =
                        getApplicationCategory(
                            application,
                        );


                    if (
                        counts[
                            category
                        ] !== undefined
                    ) {

                        counts[
                            category
                        ] += 1;

                    }

                },
            );


            return [

                {
                    id: "general",

                    label:
                        "General Applications",

                    count:
                        counts.general,
                },

                {
                    id: "uk",

                    label:
                        "UK Skilled Worker",

                    count:
                        counts.uk,
                },

                {
                    id: "zero-deposit",

                    label:
                        "Zero Deposit Applications",

                    count:
                        counts[
                            "zero-deposit"
                        ],
                },

            ];

        }, [
            applications,
        ]);


    /*
    |--------------------------------------------------------------------------
    | FILTER APPLICATIONS
    |--------------------------------------------------------------------------
    |
    | This is the important part.
    |
    | The selected tab now actually controls what enters
    | the Kanban pipeline.
    |
    */

    const filteredApplications =
        useMemo(() => {

            const query =
                normalizeSearchValue(
                    search,
                );


            return applications.filter(
                (
                    application,
                ) => {

                    /*
                    ----------------------------------------------------------
                    | TAB FILTER
                    ----------------------------------------------------------
                    */

                    const category =
                        getApplicationCategory(
                            application,
                        );


                    if (
                        category !==
                        activeType
                    ) {

                        return false;

                    }


                    /*
                    ----------------------------------------------------------
                    | SEARCH FILTER
                    ----------------------------------------------------------
                    */

                    if (!query) {

                        return true;

                    }


                    const values = [

                        getApplicationName(
                            application,
                        ),

                        getApplicationReference(
                            application,
                        ),

                        getDestination(
                            application,
                        ),

                        getApplicationType(
                            application,
                        ),

                        application?.status,

                    ];


                    return values.some(
                        (
                            value,
                        ) =>
                            normalizeSearchValue(
                                value,
                            ).includes(
                                query,
                            ),
                    );

                },
            );

        }, [
            applications,
            search,
            activeType,
        ]);


    /*
    |--------------------------------------------------------------------------
    | COLUMN APPLICATIONS
    |--------------------------------------------------------------------------
    */

    const getColumnApplications = (
        column,
    ) => {

        return filteredApplications.filter(
            (
                application,
            ) => {

                const status =
                    String(
                        application?.status ||
                        "",
                    ).toUpperCase();


                return column.statuses.includes(
                    status,
                );
            },
        );
    };


    /*
    |--------------------------------------------------------------------------
    | OPEN APPLICATION
    |--------------------------------------------------------------------------
    */

    const handleApplicationClick = (
        application,
    ) => {

        const applicationId =
            application?._id ||
            application?.id;


        if (!applicationId) {
            return;
        }


        navigate(
            `/admin/staff/applications/${applicationId}`,
        );
    };


    /*
    |--------------------------------------------------------------------------
    | REFRESH
    |--------------------------------------------------------------------------
    */

    const handleRefresh = async () => {

        await loadApplications({
            showLoader: false,
        });
    };


    /*
    |--------------------------------------------------------------------------
    | DRAG START
    |--------------------------------------------------------------------------
    */

    const handleDragStart = (
        application,
    ) => {

        setDraggedApplication(
            application,
        );

        setError("");
    };


    /*
    |--------------------------------------------------------------------------
    | DRAG END
    |--------------------------------------------------------------------------
    */

    const handleDragEnd = () => {

        setDraggedApplication(
            null,
        );

        setDragOverColumn(
            null,
        );
    };


    /*
    |--------------------------------------------------------------------------
    | DRAG OVER
    |--------------------------------------------------------------------------
    */

    const handleDragOver = (
        event,
        columnId,
    ) => {

        event.preventDefault();

        event.dataTransfer.dropEffect =
            "move";


        setDragOverColumn(
            columnId,
        );
    };


    /*
    |--------------------------------------------------------------------------
    | DRAG LEAVE
    |--------------------------------------------------------------------------
    */

    const handleDragLeave = (
        event,
        columnId,
    ) => {

        const currentTarget =
            event.currentTarget;


        const relatedTarget =
            event.relatedTarget;


        if (
            relatedTarget &&
            currentTarget.contains(
                relatedTarget,
            )
        ) {

            return;

        }


        setDragOverColumn(
            (
                current,
            ) =>
                current ===
                columnId
                    ? null
                    : current,
        );
    };


    /*
    |--------------------------------------------------------------------------
    | DROP
    |--------------------------------------------------------------------------
    */

    const handleDrop = async (
        event,
        column,
    ) => {

        event.preventDefault();


        setDragOverColumn(
            null,
        );


        if (
            !draggedApplication
        ) {

            return;

        }


        const applicationId =
            draggedApplication?._id ||
            draggedApplication?.id;


        if (!applicationId) {

            setDraggedApplication(
                null,
            );

            return;

        }


        const currentStatus =
            String(
                draggedApplication?.status ||
                "",
            ).toUpperCase();


        const newStatus =
            column.targetStatus;


        /*
        |--------------------------------------------------------------------------
        | SAME STATUS
        |--------------------------------------------------------------------------
        */

        if (
            !newStatus ||
            newStatus ===
                currentStatus
        ) {

            setDraggedApplication(
                null,
            );

            return;

        }


        /*
        |--------------------------------------------------------------------------
        | PREVIOUS STATE
        |--------------------------------------------------------------------------
        */

        const previousApplications =
            [...applications];


        /*
        |--------------------------------------------------------------------------
        | MOVING
        |--------------------------------------------------------------------------
        */

        setMovingApplicationId(
            applicationId,
        );


        setError("");


        /*
        |--------------------------------------------------------------------------
        | OPTIMISTIC UPDATE
        |--------------------------------------------------------------------------
        */

        setApplications(
            (
                currentApplications,
            ) =>
                currentApplications.map(
                    (
                        application,
                    ) => {

                        const id =
                            application?._id ||
                            application?.id;


                        if (
                            id !==
                            applicationId
                        ) {

                            return application;

                        }


                        return {

                            ...application,

                            status:
                                newStatus,

                        };

                    },
                ),
        );


        try {

            await staffService.updateApplicationStatus(
                applicationId,
                newStatus,
            );


            /*
            |--------------------------------------------------------------------------
            | RELOAD FROM SERVER
            |--------------------------------------------------------------------------
            */

            await loadApplications({
                showLoader: false,
            });

        } catch (err) {

            console.error(
                "Failed to update application status:",
                err,
            );


            /*
            |--------------------------------------------------------------------------
            | ROLLBACK
            |--------------------------------------------------------------------------
            */

            setApplications(
                previousApplications,
            );


            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Unable to update application status.",
            );

        } finally {

            setMovingApplicationId(
                null,
            );

            setDraggedApplication(
                null,
            );

            setDragOverColumn(
                null,
            );
        }
    };


    /*
    |--------------------------------------------------------------------------
    | PIPELINE TOTAL
    |--------------------------------------------------------------------------
    */

    const totalApplications =
        filteredApplications.length;


    const activePipelineApplications =
        PIPELINE_COLUMNS.reduce(
            (
                total,
                column,
            ) =>
                total +
                getColumnApplications(
                    column,
                ).length,
            0,
        );


    /*
    |--------------------------------------------------------------------------
    | LOADING
    |--------------------------------------------------------------------------
    */

    if (loading) {

        return (

            <div className="staffApplications">

                <div className="staffApplications__loading">

                    <div className="staffApplications__spinner" />

                    <strong>
                        Loading application pipeline
                    </strong>

                    <span>
                        Preparing your work queue...
                    </span>

                </div>

            </div>

        );
    }


    /*
    |--------------------------------------------------------------------------
    | RENDER
    |--------------------------------------------------------------------------
    */

    return (

        <div className="staffApplications">


            {/* =====================================================
                HEADER
            ===================================================== */}

            <header className="staffApplications__header">

                <div className="staffApplications__heading">

                    <span className="staffApplications__eyebrow">
                        Staff Workspace
                    </span>

                    <h1>
                        Application Pipeline
                    </h1>

                    <p>
                        Manage and move assigned applications through the migration workflow.
                    </p>

                </div>


                <div className="staffApplications__headerActions">


                    {/* SEARCH */}

                    <div className="staffApplications__search">

                        <HiOutlineSearch />

                        <input
                            type="search"
                            value={
                                search
                            }
                            onChange={(
                                event,
                            ) =>
                                setSearch(
                                    event.target.value,
                                )
                            }
                            placeholder="Search applications..."
                            aria-label="Search applications"
                        />

                    </div>


                    {/* REFRESH */}

                    <button
                        type="button"
                        className="staffApplications__refresh"
                        onClick={
                            handleRefresh
                        }
                        disabled={
                            refreshing
                        }
                    >

                        <HiOutlineRefresh
                            className={
                                refreshing
                                    ? "is-spinning"
                                    : ""
                            }
                        />

                        <span>
                            {
                                refreshing
                                    ? "Refreshing"
                                    : "Refresh"
                            }
                        </span>

                    </button>

                </div>

            </header>


            {/* =====================================================
                ERROR
            ===================================================== */}

            {error && (

                <div className="staffApplications__error">

                    <strong>
                        Something went wrong
                    </strong>

                    <span>
                        {error}
                    </span>

                    <button
                        type="button"
                        onClick={
                            handleRefresh
                        }
                    >
                        Try again
                    </button>

                </div>

            )}


            {/* =====================================================
                WORKSPACE TABS
            ===================================================== */}

            <div className="staffApplications__tabs">

                {applicationTypeTabs.map(
                    (
                        tab,
                    ) => (

                        <button
                            key={
                                tab.id
                            }
                            type="button"
                            className={
                                activeType ===
                                tab.id
                                    ? "is-active"
                                    : ""
                            }
                            onClick={() => {

                                setActiveType(
                                    tab.id,
                                );

                                setSearch("");

                            }}
                        >

                            <span>
                                {
                                    tab.label
                                }
                            </span>


                            <span className="staffApplications__tabCount">

                                {
                                    tab.count
                                }

                            </span>

                        </button>

                    ),
                )}

            </div>


            {/* =====================================================
                PIPELINE
            ===================================================== */}

            <section className="staffPipeline">


                {/* =================================================
                    PIPELINE HEADER
                ================================================= */}

                <div className="staffPipeline__header">

                    <div>

                        <span className="staffPipeline__eyebrow">
                            Work Queue
                        </span>

                        <h2>
                            Application Workflow
                        </h2>

                        <p>
                            Drag an application to another stage to update its status.
                        </p>

                    </div>


                    <div className="staffPipeline__summary">

                        <strong>
                            {
                                totalApplications
                            }
                        </strong>

                        <span>
                            Applications
                        </span>

                    </div>

                </div>


                {/* =================================================
                    TOOLBAR
                ================================================= */}

                <div className="staffPipeline__toolbar">

                    <div className="staffPipeline__toolbarInfo">

                        <span className="staffPipeline__liveDot" />

                        <span>
                            Live workflow
                        </span>

                    </div>


                    <div className="staffPipeline__toolbarStats">

                        <span>
                            {
                                activePipelineApplications
                            }
                            {" "}
                            active
                        </span>


                        {movingApplicationId && (

                            <span className="staffPipeline__saving">
                                Saving change...
                            </span>

                        )}

                    </div>

                </div>


                {/* =================================================
                    BOARD
                ================================================= */}

                <div className="staffPipeline__viewport">

                    <div className="staffPipeline__board">

                        {PIPELINE_COLUMNS.map(
                            (
                                column,
                            ) => {

                                const columnApplications =
                                    getColumnApplications(
                                        column,
                                    );


                                const ColumnIcon =
                                    column.icon;


                                const isDropTarget =
                                    dragOverColumn ===
                                    column.id;


                                return (

                                    <div
                                        key={
                                            column.id
                                        }
                                        className={`
                                            staffPipeline__column
                                            staffPipeline__column--${column.tone}
                                            ${
                                                isDropTarget
                                                    ? "is-drag-over"
                                                    : ""
                                            }
                                            ${
                                                movingApplicationId
                                                    ? "has-moving-application"
                                                    : ""
                                            }
                                        `}
                                        onDragOver={(
                                            event,
                                        ) =>
                                            handleDragOver(
                                                event,
                                                column.id,
                                            )
                                        }
                                        onDragLeave={(
                                            event,
                                        ) =>
                                            handleDragLeave(
                                                event,
                                                column.id,
                                            )
                                        }
                                        onDrop={(
                                            event,
                                        ) =>
                                            handleDrop(
                                                event,
                                                column,
                                            )
                                        }
                                    >


                                        {/* COLUMN HEADER */}

                                        <div className="staffPipeline__columnHeader">

                                            <div className="staffPipeline__columnName">

                                                <span className="staffPipeline__columnIcon">

                                                    <ColumnIcon />

                                                </span>


                                                <span className="staffPipeline__columnLabel">

                                                    {
                                                        column.title
                                                    }

                                                </span>

                                            </div>


                                            <div className="staffPipeline__columnActions">

                                                <span className="staffPipeline__count">

                                                    {
                                                        columnApplications.length
                                                    }

                                                </span>


                                                <button
                                                    type="button"
                                                    className="staffPipeline__columnMenu"
                                                    aria-label={`${column.title} options`}
                                                >

                                                    <HiOutlineDotsVertical />

                                                </button>

                                            </div>

                                        </div>


                                        {/* DROP INDICATOR */}

                                        {isDropTarget && (

                                            <div className="staffPipeline__dropIndicator">

                                                <span>
                                                    Drop here to move application
                                                </span>

                                            </div>

                                        )}


                                        {/* CARDS */}

                                        <div className="staffPipeline__columnBody">

                                            {columnApplications.length >
                                            0 ? (

                                                columnApplications.map(
                                                    (
                                                        application,
                                                    ) => {

                                                        const id =
                                                            application?._id ||
                                                            application?.id;


                                                        return (

                                                            <div
                                                                key={
                                                                    id
                                                                }
                                                                className={
                                                                    movingApplicationId ===
                                                                    id
                                                                        ? "staffPipeline__cardWrapper is-moving"
                                                                        : "staffPipeline__cardWrapper"
                                                                }
                                                            >

                                                                <StaffApplicationCard
                                                                    application={
                                                                        application
                                                                    }
                                                                    onClick={
                                                                        handleApplicationClick
                                                                    }
                                                                    onDragStart={
                                                                        handleDragStart
                                                                    }
                                                                    onDragEnd={
                                                                        handleDragEnd
                                                                    }
                                                                    isMoving={
                                                                        movingApplicationId ===
                                                                        id
                                                                    }
                                                                />

                                                            </div>

                                                        );

                                                    },
                                                )

                                            ) : (

                                                <div className="staffPipeline__empty">

                                                    <div className="staffPipeline__emptyIcon">

                                                        <ColumnIcon />

                                                    </div>


                                                    <strong>
                                                        No applications
                                                    </strong>


                                                    <span>
                                                        {
                                                            column.description
                                                        }
                                                    </span>

                                                </div>

                                            )}

                                        </div>

                                    </div>

                                );

                            },
                        )}

                    </div>

                </div>


                {/* =================================================
                    FOOTER
                ================================================= */}

                <div className="staffPipeline__footer">

                    <div className="staffPipeline__footerSummary">

                        <strong>
                            {
                                totalApplications
                            }
                        </strong>

                        <span>
                            applications in pipeline
                        </span>

                    </div>


                    <div className="staffPipeline__progress">

                        <div className="staffPipeline__progressTrack">

                            <div
                                className="staffPipeline__progressBar"
                                style={{
                                    width:
                                        totalApplications >
                                        0
                                            ? `${
                                                  Math.min(
                                                      100,
                                                      Math.max(
                                                          5,
                                                          (
                                                              activePipelineApplications /
                                                              totalApplications
                                                          ) *
                                                              100,
                                                      ),
                                                  )
                                              }%`
                                            : "0%",
                                }}
                            />

                        </div>

                    </div>


                    <span className="staffPipeline__footerHint">
                        Drag cards between stages
                    </span>

                </div>

            </section>

        </div>

    );
};


export default StaffApplications;