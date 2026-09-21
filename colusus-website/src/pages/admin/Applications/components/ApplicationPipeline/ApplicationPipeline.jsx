
import React, {
    useState,
} from "react";

import {
    HiOutlineClipboardList,
    HiOutlineDocument,
    HiOutlineClock,
    HiOutlineCog,
    HiOutlineCheckCircle,
    HiOutlineChevronLeft,
    HiOutlineChevronRight,
} from "react-icons/hi";

import applicationsService
    from "../../applications.service";

import "./ApplicationPipeline.css";


const ITEMS_PER_PAGE = 4;


const PIPELINE_COLUMNS = [

    {
        id: "new",
        title: "New Application",
        description: "Newly assigned applications",
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
        description: "Documents required",
        statuses: [
            "DOCUMENT_REQUEST",
        ],
        targetStatus: "DOCUMENT_REQUEST",
        icon: HiOutlineDocument,
        tone: "yellow",
    },

    {
        id: "review",
        title: "Under Review",
        description: "Currently being reviewed",
        statuses: [
            "UNDER_REVIEW",
        ],
        targetStatus: "UNDER_REVIEW",
        icon: HiOutlineClock,
        tone: "orange",
    },

    {
        id: "processing",
        title: "Processing",
        description: "Application in processing",
        statuses: [
            "PROCESSING",
        ],
        targetStatus: "PROCESSING",
        icon: HiOutlineCog,
        tone: "green",
    },

    {
        id: "submitted",
        title: "Submitted",
        description: "Submitted applications",
        statuses: [
            "SUBMITTED",
        ],
        targetStatus: "SUBMITTED",
        icon: HiOutlineCheckCircle,
        tone: "purple",
    },

];


const getApplicationName = (
    application,
) => {

    return (
        application?.user?.name ||
        application?.user?.fullName ||
        application?.fullName ||
        "Unnamed applicant"
    );

};


const getApplicationEmail = (
    application,
) => {

    return (
        application?.user?.email ||
        application?.email ||
        ""
    );

};


const getDestination = (
    application,
) => {

    return (
        application?.destinationCountry ||
        application?.country ||
        "Destination not specified"
    );

};


const getReference = (
    application,
) => {

    return (
        application?.applicationNumber ||
        application?.applicationReference ||
        application?._id ||
        "Application"
    );

};


const getInitial = (
    application,
) => {

    const name =
        getApplicationName(
            application,
        );

    return name
        .trim()
        .charAt(0)
        .toUpperCase();

};


const formatStatus = (
    status,
) => {

    if (!status) {
        return "Unknown";
    }

    return status
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(
            /\b\w/g,
            (letter) =>
                letter.toUpperCase(),
        );

};


const formatDate = (
    value,
) => {

    if (!value) {
        return "—";
    }

    const date =
        new Date(value);

    if (
        Number.isNaN(
            date.getTime(),
        )
    ) {

        return "—";

    }

    return new Intl.DateTimeFormat(
        "en-GB",
        {
            day: "2-digit",
            month: "short",
        },
    ).format(date);

};


const ApplicationPipeline = ({
    applications,
    onApplicationClick,
    onApplicationsChange,
}) => {

    const [
        draggingId,
        setDraggingId,
    ] = useState(null);

    const [
        savingId,
        setSavingId,
    ] = useState(null);

    const [
        activeDropColumn,
        setActiveDropColumn,
    ] = useState(null);

    const [
        columnPages,
        setColumnPages,
    ] = useState({});


    const getColumnApplications =
        (column) => {

            return applications.filter(
                (application) =>
                    column.statuses.includes(
                        application?.status,
                    ),
            );

        };


    const getColumnPage =
        (columnId) => {

            return columnPages[columnId] || 1;

        };


    const getPaginatedApplications =
        (
            columnId,
            columnApplications,
        ) => {

            const currentPage =
                getColumnPage(
                    columnId,
                );

            const startIndex =
                (currentPage - 1) *
                ITEMS_PER_PAGE;

            return columnApplications.slice(
                startIndex,
                startIndex +
                ITEMS_PER_PAGE,
            );

        };


    const getTotalPages =
        (
            columnApplications,
        ) => {

            return Math.max(
                1,
                Math.ceil(
                    columnApplications.length /
                    ITEMS_PER_PAGE,
                ),
            );

        };


    const handleColumnPageChange =
        (
            columnId,
            page,
            totalPages,
        ) => {

            const nextPage =
                Math.min(
                    Math.max(
                        page,
                        1,
                    ),
                    totalPages,
                );

            setColumnPages(
                (current) => ({
                    ...current,
                    [columnId]:
                        nextPage,
                }),
            );

        };


    const handleDragStart = (
        event,
        application,
    ) => {

        if (
            savingId ===
            application?._id
        ) {

            event.preventDefault();
            return;

        }

        setDraggingId(
            application._id,
        );

        event.dataTransfer.effectAllowed =
            "move";

        event.dataTransfer.setData(
            "text/plain",
            application._id,
        );

    };


    const handleDragEnd = () => {

        setDraggingId(null);
        setActiveDropColumn(null);

    };


    const handleDragOver = (
        event,
        column,
    ) => {

        event.preventDefault();

        event.dataTransfer.dropEffect =
            "move";

        setActiveDropColumn(
            column.id,
        );

    };


    const handleDragLeave = (
        event,
    ) => {

        if (
            event.currentTarget.contains(
                event.relatedTarget,
            )
        ) {

            return;

        }

        setActiveDropColumn(null);

    };


    const handleDrop = async (
        event,
        column,
    ) => {

        event.preventDefault();

        const applicationId =
            event.dataTransfer.getData(
                "text/plain",
            );

        setActiveDropColumn(null);
        setDraggingId(null);

        if (!applicationId) {
            return;
        }

        const application =
            applications.find(
                (item) =>
                    item?._id ===
                    applicationId,
            );

        if (!application) {
            return;
        }

        const nextStatus =
            column.targetStatus;

        if (
            application.status ===
            nextStatus
        ) {

            return;

        }

        const previousStatus =
            application.status;


        /*
        ----------------------------------------------------------
        OPTIMISTIC UPDATE
        ----------------------------------------------------------
        */

        onApplicationsChange(
            (current) =>
                current.map(
                    (item) =>
                        item._id ===
                            applicationId
                            ? {
                                ...item,
                                status: nextStatus,
                            }
                            : item,
                ),
        );


        setSavingId(
            applicationId,
        );


        try {

            await applicationsService
                .updateApplicationStatus(
                    applicationId,
                    nextStatus,
                );

        } catch (error) {

            console.error(
                "Failed to update application status:",
                error,
            );


            /*
            --------------------------------------------------------
            ROLLBACK
            --------------------------------------------------------
            */

            onApplicationsChange(
                (current) =>
                    current.map(
                        (item) =>
                            item._id ===
                                applicationId
                                ? {
                                    ...item,
                                    status:
                                        previousStatus,
                                }
                                : item,
                    ),
            );

        } finally {

            setSavingId(null);

        }

    };


    return (

        <section className="applicationPipeline">

            <div className="applicationPipeline__header">

                <div>

                    <span className="applicationPipeline__eyebrow">
                        APPLICATION WORKFLOW
                    </span>

                    <h2>
                        Pipeline
                    </h2>

                    <p>
                        Drag applications between stages
                        to update their workflow status.
                    </p>

                </div>


                <div className="applicationPipeline__summary">

                    <strong>
                        {applications.length}
                    </strong>

                    <span>
                        Matching applications
                    </span>

                </div>

            </div>


            <div className="applicationPipeline__toolbar">

                <span className="applicationPipeline__live">

                    <span />

                    Live workflow

                </span>


                {savingId && (

                    <span className="applicationPipeline__saving">
                        Saving status change...
                    </span>

                )}

            </div>


            <div className="applicationPipeline__board">

                {PIPELINE_COLUMNS.map(
                    (column) => {

                        const Icon =
                            column.icon;

                        const columnApplications =
                            getColumnApplications(
                                column,
                            );

                        const totalPages =
                            getTotalPages(
                                columnApplications,
                            );

                        const currentPage =
                            Math.min(
                                getColumnPage(
                                    column.id,
                                ),
                                totalPages,
                            );

                        const visibleApplications =
                            getPaginatedApplications(
                                column.id,
                                columnApplications,
                            );


                        return (

                            <div
                                className={[
                                    "applicationPipeline__column",
                                    `applicationPipeline__column--${column.tone}`,
                                    activeDropColumn === column.id
                                        ? "applicationPipeline__column--dropActive"
                                        : "",
                                ].join(" ")}
                                key={column.id}
                                onDragOver={(event) =>
                                    handleDragOver(
                                        event,
                                        column,
                                    )
                                }
                                onDragLeave={
                                    handleDragLeave
                                }
                                onDrop={(event) =>
                                    handleDrop(
                                        event,
                                        column,
                                    )
                                }
                            >

                                <div className="applicationPipeline__columnHeader">

                                    <div className="applicationPipeline__columnTitle">

                                        <div className="applicationPipeline__columnIcon">

                                            <Icon />

                                        </div>

                                        <div>

                                            <h3>
                                                {column.title}
                                            </h3>

                                            <p>
                                                {column.description}
                                            </p>

                                        </div>

                                    </div>


                                    <span className="applicationPipeline__count">

                                        {columnApplications.length}

                                    </span>

                                </div>


                                <div className="applicationPipeline__cards">

                                    {visibleApplications.length ? (

                                        visibleApplications.map(
                                            (application) => {

                                                const applicationId =
                                                    application?._id;

                                                const isDragging =
                                                    draggingId ===
                                                    applicationId;

                                                const isSaving =
                                                    savingId ===
                                                    applicationId;


                                                return (

                                                    <article
                                                        key={
                                                            applicationId
                                                        }
                                                        className={[
                                                            "applicationPipeline__card",
                                                            isDragging
                                                                ? "applicationPipeline__card--dragging"
                                                                : "",
                                                            isSaving
                                                                ? "applicationPipeline__card--saving"
                                                                : "",
                                                        ].join(" ")}
                                                        draggable={
                                                            !isSaving
                                                        }
                                                        onDragStart={(event) =>
                                                            handleDragStart(
                                                                event,
                                                                application,
                                                            )
                                                        }
                                                        onDragEnd={
                                                            handleDragEnd
                                                        }
                                                        onClick={() =>
                                                            onApplicationClick(
                                                                applicationId,
                                                            )
                                                        }
                                                    >

                                                        <div className="applicationPipeline__cardTop">

                                                            <span className="applicationPipeline__reference">

                                                                {getReference(
                                                                    application,
                                                                )}

                                                            </span>


                                                            <span className="applicationPipeline__status">

                                                                {formatStatus(
                                                                    application?.status,
                                                                )}

                                                            </span>

                                                        </div>


                                                        <div className="applicationPipeline__identity">

                                                            <div className="applicationPipeline__avatar">

                                                                {getInitial(
                                                                    application,
                                                                )}

                                                            </div>


                                                            <div className="applicationPipeline__identityCopy">

                                                                <h4>
                                                                    {getApplicationName(
                                                                        application,
                                                                    )}
                                                                </h4>

                                                                <p>
                                                                    {getApplicationEmail(
                                                                        application,
                                                                    )}
                                                                </p>

                                                            </div>

                                                        </div>


                                                        <div className="applicationPipeline__meta">

                                                            <div>

                                                                <span>
                                                                    Destination
                                                                </span>

                                                                <strong>
                                                                    {getDestination(
                                                                        application,
                                                                    )}
                                                                </strong>

                                                            </div>


                                                            <div>

                                                                <span>
                                                                    Updated
                                                                </span>

                                                                <strong>
                                                                    {formatDate(
                                                                        application?.updatedAt ||
                                                                        application?.createdAt,
                                                                    )}
                                                                </strong>

                                                            </div>

                                                        </div>


                                                        {application?.currentStep && (

                                                            <div className="applicationPipeline__stage">

                                                                <span>
                                                                    Current stage
                                                                </span>

                                                                <strong>
                                                                    {formatStatus(
                                                                        application.currentStep,
                                                                    )}
                                                                </strong>

                                                            </div>

                                                        )}


                                                        {isSaving && (

                                                            <div className="applicationPipeline__savingOverlay">

                                                                Updating...

                                                            </div>

                                                        )}

                                                    </article>

                                                );

                                            },
                                        )

                                    ) : (

                                        <div className="applicationPipeline__emptyColumn">

                                            <span>
                                                No applications
                                            </span>

                                        </div>

                                    )}

                                </div>


                                {totalPages > 1 && (

                                    <div className="applicationPipeline__pagination">

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleColumnPageChange(
                                                    column.id,
                                                    currentPage - 1,
                                                    totalPages,
                                                )
                                            }
                                            disabled={
                                                currentPage === 1
                                            }
                                            aria-label={`Previous ${column.title} page`}
                                        >
                                            <HiOutlineChevronLeft />
                                        </button>


                                        <span>
                                            {currentPage} / {totalPages}
                                        </span>


                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleColumnPageChange(
                                                    column.id,
                                                    currentPage + 1,
                                                    totalPages,
                                                )
                                            }
                                            disabled={
                                                currentPage ===
                                                totalPages
                                            }
                                            aria-label={`Next ${column.title} page`}
                                        >
                                            <HiOutlineChevronRight />
                                        </button>

                                    </div>

                                )}


                                <div className="applicationPipeline__columnFooter">

                                    {columnApplications.length === 1
                                        ? "1 application"
                                        : `${columnApplications.length} applications`}

                                </div>

                            </div>

                        );

                    },
                )}

            </div>

        </section>

    );

};


export default ApplicationPipeline;
