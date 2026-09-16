import React, {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    HiOutlineArrowLeft,
    HiOutlineRefresh,
    HiOutlineUser,
    HiOutlineLocationMarker,
    HiOutlineDocumentText,
    HiOutlineCalendar,
    HiOutlineClock,
    HiOutlineCheckCircle,
    HiOutlineExclamationCircle,
    HiOutlineFolder,
    HiOutlineClipboardList,
    HiOutlineChatAlt2,
} from "react-icons/hi";

import staffService from "./services/staff.service";

import StaffStatusBadge from "./components/StaffStatusBadge";
import StaffDocumentCard from "./components/StaffDocumentCard";

import "./StaffApplicationDetail.css";


/*
============================================================
COLOSSUS
STAFF APPLICATION DETAIL
============================================================

Operational application workspace.

Responsibilities:
- Load application data
- Load application documents
- Load internal notes
- Manage application status
- Coordinate document reviews
- Manage internal notes
- Control workspace tabs

UI-specific document presentation lives inside
StaffDocumentCard.
============================================================
*/


/*
============================================================
STATUS OPTIONS
============================================================
*/

const STATUS_OPTIONS = [
    {
        value: "SUBMITTED",
        label: "Submitted",
    },
    {
        value: "UNDER_REVIEW",
        label: "Under Review",
    },
    {
        value: "DOCUMENT_REQUEST",
        label: "Document Request",
    },
    {
        value: "PROCESSING",
        label: "Processing",
    },
    {
        value: "APPROVED",
        label: "Approved",
    },
    {
        value: "REJECTED",
        label: "Rejected",
    },
];


/*
============================================================
DETAIL TABS
============================================================
*/

const DETAIL_TABS = [
    {
        id: "overview",
        label: "Overview",
        icon: HiOutlineClipboardList,
    },
    {
        id: "documents",
        label: "Documents",
        icon: HiOutlineFolder,
    },
    {
        id: "notes",
        label: "Notes",
        icon: HiOutlineChatAlt2,
    },
];


/*
============================================================
HELPERS
============================================================
*/

const getInitials = (name = "") => {
    const parts = name
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    if (!parts.length) {
        return "CL";
    }

    return parts
        .slice(0, 2)
        .map((part) =>
            part.charAt(0).toUpperCase()
        )
        .join("");
};


const formatDate = (date) => {
    if (!date) {
        return "—";
    }

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
        return "—";
    }

    return parsed.toLocaleDateString(
        "en-GB",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }
    );
};


const formatDateTime = (date) => {
    if (!date) {
        return "—";
    }

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
        return "—";
    }

    return parsed.toLocaleString(
        "en-GB",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }
    );
};


const resolveResponseData = (response) => {
    return (
        response?.data?.data ??
        response?.data ??
        response
    );
};


const resolveApplication = (response) => {
    const data =
        resolveResponseData(response);

    return (
        data?.application ??
        data?.assignedApplication ??
        data
    );
};


const resolveArray = (
    response,
    key
) => {
    const data =
        resolveResponseData(response);

    const value =
        data?.[key] ??
        data;

    return Array.isArray(value)
        ? value
        : [];
};


const getApplicationReference = (
    application
) => {
    return (
        application?.reference ||
        application?.applicationNumber ||
        application?.applicationReference ||
        application?.ref ||
        application?.number ||
        "Application"
    );
};


const getClientFromApplication = (
    application
) => {
    return (
        application?.user ||
        application?.client ||
        application?.clientProfile ||
        {}
    );
};


const getClientName = (
    client
) => {
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


const getDestination = (
    application
) => {
    return (
        application?.destination ||
        application?.country ||
        application?.destinationCountry ||
        application?.opportunity?.country ||
        application?.opportunity?.destination ||
        "—"
    );
};


const getApplicationType = (
    application
) => {
    return (
        application?.opportunity?.title ||
        application?.opportunity?.name ||
        application?.program ||
        application?.applicationType ||
        application?.type ||
        "Migration Application"
    );
};


/*
============================================================
COMPONENT
============================================================
*/

const StaffApplicationDetail = () => {

    /*
    ============================================================
    ROUTER
    ============================================================
    */

    const { id } = useParams();

    const navigate = useNavigate();


    /*
    ============================================================
    STATE
    ============================================================
    */

    const [application, setApplication] =
        useState(null);

    const [documents, setDocuments] =
        useState([]);

    const [notes, setNotes] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [error, setError] =
        useState("");

    const [selectedStatus, setSelectedStatus] =
        useState("");

    const [statusNotes, setStatusNotes] =
        useState("");

    const [updatingStatus, setUpdatingStatus] =
        useState(false);

    const [newNote, setNewNote] =
        useState("");

    const [addingNote, setAddingNote] =
        useState(false);

    const [activeTab, setActiveTab] =
        useState("overview");


    /*
    ============================================================
    LOAD APPLICATION
    ============================================================
    */

    const loadApplication = async ({
        showLoader = true,
    } = {}) => {

        if (!id) {
            return;
        }

        try {

            if (showLoader) {
                setLoading(true);
            } else {
                setRefreshing(true);
            }

            setError("");

            const [
                applicationResponse,
                documentsResponse,
                notesResponse,
            ] = await Promise.all([
                staffService.getAssignedApplicationById(
                    id
                ),

                staffService.getApplicationDocuments(
                    id
                ),

                staffService.getApplicationNotes(
                    id
                ),
            ]);

            const applicationData =
                resolveApplication(
                    applicationResponse
                );

            const documentsData =
                resolveArray(
                    documentsResponse,
                    "documents"
                );

            const notesData =
                resolveArray(
                    notesResponse,
                    "notes"
                );

            setApplication(
                applicationData || null
            );

            setDocuments(
                documentsData
            );

            setNotes(
                notesData
            );

            setSelectedStatus(
                applicationData?.status || ""
            );

        } catch (err) {

            console.error(
                "Failed to load staff application:",
                err
            );

            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Unable to load this application."
            );

        } finally {

            setLoading(false);
            setRefreshing(false);

        }
    };


    /*
    ============================================================
    INITIAL LOAD
    ============================================================
    */

    useEffect(() => {
        loadApplication();
    }, [id]);


    /*
    ============================================================
    DERIVED DATA
    ============================================================
    */

    const client = useMemo(
        () =>
            getClientFromApplication(
                application
            ),
        [application]
    );


    const clientName = useMemo(
        () =>
            getClientName(client),
        [client]
    );


    const applicationReference =
        getApplicationReference(
            application
        );


    const destination =
        getDestination(
            application
        );


    const applicationType =
        getApplicationType(
            application
        );


    /*
    ============================================================
    REFRESH
    ============================================================
    */

    const handleRefresh = async () => {
        await loadApplication({
            showLoader: false,
        });
    };


    /*
    ============================================================
    STATUS UPDATE
    ============================================================
    */

    const handleStatusUpdate = async () => {

        if (
            !selectedStatus ||
            !id
        ) {
            return;
        }

        if (
            selectedStatus ===
                application?.status &&
            !statusNotes.trim()
        ) {
            return;
        }

        try {

            setUpdatingStatus(true);
            setError("");

            await staffService.updateApplicationStatus(
                id,
                selectedStatus,
                statusNotes.trim()
            );

            setStatusNotes("");

            await loadApplication({
                showLoader: false,
            });

        } catch (err) {

            console.error(
                "Failed to update application status:",
                err
            );

            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Unable to update application status."
            );

        } finally {

            setUpdatingStatus(false);

        }
    };


    /*
    ============================================================
    DOCUMENT REVIEW
    ============================================================
    */

    const handleDocumentReview = async (
        document,
        status,
        reviewNote = ""
    ) => {

        const documentId =
            document?._id ||
            document?.id;

        if (!documentId) {

            setError(
                "Unable to identify this document."
            );

            return;

        }

        try {

            setError("");

            await staffService.reviewDocument(
                documentId,
                status,
                reviewNote
            );

            const response =
                await staffService.getApplicationDocuments(
                    id
                );

            setDocuments(
                resolveArray(
                    response,
                    "documents"
                )
            );

        } catch (err) {

            console.error(
                "Failed to review document:",
                err
            );

            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Unable to update document review status."
            );

            throw err;
        }
    };


    /*
    ============================================================
    ADD NOTE
    ============================================================
    */

    const handleAddNote = async () => {

        const message =
            newNote.trim();

        if (
            !message ||
            !id
        ) {
            return;
        }

        try {

            setAddingNote(true);
            setError("");

            await staffService.addApplicationNote(
                id,
                message
            );

            setNewNote("");

            const response =
                await staffService.getApplicationNotes(
                    id
                );

            setNotes(
                resolveArray(
                    response,
                    "notes"
                )
            );

        } catch (err) {

            console.error(
                "Failed to add note:",
                err
            );

            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Unable to add note."
            );

        } finally {

            setAddingNote(false);

        }
    };


    /*
    ============================================================
    TAB CHANGE
    ============================================================
    */

    const handleTabChange = (
        tabId
    ) => {

        setActiveTab(tabId);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };


    /*
    ============================================================
    LOADING STATE
    ============================================================
    */

    if (loading) {

        return (
            <div className="staffApplicationDetail">

                <div className="staffApplicationDetail__loading">

                    <div className="staffApplicationDetail__spinner" />

                    <strong>
                        Loading application
                    </strong>

                    <span>
                        Preparing workspace...
                    </span>

                </div>

            </div>
        );
    }


    /*
    ============================================================
    EMPTY / ERROR STATE
    ============================================================
    */

    if (!application) {

        return (
            <div className="staffApplicationDetail">

                <div className="staffApplicationDetail__errorState">

                    <div className="staffApplicationDetail__errorIcon">
                        <HiOutlineExclamationCircle />
                    </div>

                    <h2>
                        Application unavailable
                    </h2>

                    <p>
                        {error ||
                            "This application could not be found or is no longer assigned to you."}
                    </p>

                    <button
                        type="button"
                        className="staffApplicationDetail__primaryButton"
                        onClick={() =>
                            navigate(
                                "/admin/staff/applications"
                            )
                        }
                    >
                        <HiOutlineArrowLeft />

                        Back to Applications
                    </button>

                </div>

            </div>
        );
    }


    /*
    ============================================================
    MAIN RENDER
    ============================================================
    */

    return (
        <div className="staffApplicationDetail">

            {/* ==================================================
                TOP BAR
            ================================================== */}

            <div className="staffApplicationDetail__topBar">

                <button
                    type="button"
                    className="staffApplicationDetail__back"
                    onClick={() =>
                        navigate(
                            "/admin/staff/applications"
                        )
                    }
                >
                    <HiOutlineArrowLeft />

                    <span>
                        Applications
                    </span>
                </button>


                <button
                    type="button"
                    className="staffApplicationDetail__secondaryButton"
                    onClick={handleRefresh}
                    disabled={refreshing}
                >
                    <HiOutlineRefresh
                        className={
                            refreshing
                                ? "is-spinning"
                                : ""
                        }
                    />

                    {refreshing
                        ? "Refreshing"
                        : "Refresh"}
                </button>

            </div>


            {/* ==================================================
                APPLICATION IDENTITY
            ================================================== */}

            <header className="staffApplicationDetail__hero">

                <div className="staffApplicationDetail__heroMain">

                    <div className="staffApplicationDetail__heroIdentity">

                        <div className="staffApplicationDetail__clientAvatar">
                            {getInitials(
                                clientName
                            )}
                        </div>


                        <div className="staffApplicationDetail__heroText">

                            <div className="staffApplicationDetail__eyebrow">
                                Application
                            </div>


                            <div className="staffApplicationDetail__titleRow">

                                <h1>
                                    {applicationReference}
                                </h1>

                                <StaffStatusBadge
                                    status={
                                        application.status
                                    }
                                />

                            </div>


                            <p>
                                {clientName}

                                <span>
                                    •
                                </span>

                                {applicationType}
                            </p>

                        </div>

                    </div>

                </div>


                <div className="staffApplicationDetail__heroMeta">

                    <div>

                        <HiOutlineLocationMarker />

                        <span>

                            <small>
                                Destination
                            </small>

                            <strong>
                                {destination}
                            </strong>

                        </span>

                    </div>


                    <div>

                        <HiOutlineClock />

                        <span>

                            <small>
                                Updated
                            </small>

                            <strong>
                                {formatDate(
                                    application.updatedAt
                                )}
                            </strong>

                        </span>

                    </div>

                </div>

            </header>


            {/* ==================================================
                ALERT
            ================================================== */}

            {error && (

                <div className="staffApplicationDetail__alert">

                    <HiOutlineExclamationCircle />

                    <span>
                        {error}
                    </span>

                </div>

            )}


            {/* ==================================================
                QUICK CONTEXT
            ================================================== */}

            <section className="staffApplicationDetail__context">

                <div className="staffApplicationDetail__contextItem">

                    <HiOutlineUser />

                    <span>
                        Client
                    </span>

                    <strong>
                        {clientName}
                    </strong>

                </div>


                <div className="staffApplicationDetail__contextItem">

                    <HiOutlineLocationMarker />

                    <span>
                        Destination
                    </span>

                    <strong>
                        {destination}
                    </strong>

                </div>


                <div className="staffApplicationDetail__contextItem">

                    <HiOutlineDocumentText />

                    <span>
                        Type
                    </span>

                    <strong>
                        {applicationType}
                    </strong>

                </div>


                <div className="staffApplicationDetail__contextItem">

                    <HiOutlineFolder />

                    <span>
                        Documents
                    </span>

                    <strong>
                        {documents.length}
                    </strong>

                </div>


                <div className="staffApplicationDetail__contextItem">

                    <HiOutlineCalendar />

                    <span>
                        Created
                    </span>

                    <strong>
                        {formatDate(
                            application.createdAt
                        )}
                    </strong>

                </div>

            </section>


            {/* ==================================================
                WORKSPACE TABS
            ================================================== */}

            <nav
                className="staffApplicationDetail__tabs"
                aria-label="Application sections"
            >

                {DETAIL_TABS.map(
                    (tab) => {

                        const Icon =
                            tab.icon;

                        const count =
                            tab.id === "documents"
                                ? documents.length
                                : tab.id === "notes"
                                    ? notes.length
                                    : null;

                        return (
                            <button
                                key={tab.id}
                                type="button"
                                className={
                                    activeTab ===
                                    tab.id
                                        ? "is-active"
                                        : ""
                                }
                                onClick={() =>
                                    handleTabChange(
                                        tab.id
                                    )
                                }
                            >

                                <Icon />

                                <span>
                                    {tab.label}
                                </span>

                                {count !== null && (
                                    <b>
                                        {count}
                                    </b>
                                )}

                            </button>
                        );
                    }
                )}

            </nav>


            {/* ==================================================
                WORKSPACE
            ================================================== */}

            <div className="staffApplicationDetail__workspace">

                {/* =================================================
                    OVERVIEW TAB
                ================================================= */}

                {activeTab === "overview" && (

                    <div className="staffApplicationDetail__tabContent">

                        {/* APPLICATION OVERVIEW */}

                        <section className="staffDetailPanel">

                            <div className="staffDetailPanel__heading">

                                <div className="staffDetailPanel__headingIcon">
                                    <HiOutlineClipboardList />
                                </div>


                                <div>

                                    <span>
                                        Application
                                    </span>

                                    <h2>
                                        Overview
                                    </h2>

                                    <p>
                                        Core information and workflow control.
                                    </p>

                                </div>

                            </div>


                            <div className="staffApplicationDetail__infoGrid">

                                <div>

                                    <span>
                                        Reference
                                    </span>

                                    <strong>
                                        {applicationReference}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Destination
                                    </span>

                                    <strong>
                                        {destination}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Application Type
                                    </span>

                                    <strong>
                                        {applicationType}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Created
                                    </span>

                                    <strong>
                                        {formatDateTime(
                                            application.createdAt
                                        )}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Last Updated
                                    </span>

                                    <strong>
                                        {formatDateTime(
                                            application.updatedAt
                                        )}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Current Status
                                    </span>

                                    <StaffStatusBadge
                                        status={
                                            application.status
                                        }
                                    />

                                </div>

                            </div>

                        </section>


                        {/* STATUS WORKFLOW */}

                        <section className="staffDetailPanel">

                            <div className="staffDetailPanel__heading">

                                <div className="staffDetailPanel__headingIcon">
                                    <HiOutlineRefresh />
                                </div>


                                <div>

                                    <span>
                                        Workflow
                                    </span>

                                    <h2>
                                        Application Status
                                    </h2>

                                    <p>
                                        Move this application through its operational workflow.
                                    </p>

                                </div>

                            </div>


                            <div className="staffApplicationDetail__statusForm">

                                <div className="staffApplicationDetail__field">

                                    <label htmlFor="application-status">
                                        Status
                                    </label>


                                    <select
                                        id="application-status"
                                        value={
                                            selectedStatus
                                        }
                                        onChange={(event) =>
                                            setSelectedStatus(
                                                event.target.value
                                            )
                                        }
                                    >

                                        <option value="">
                                            Select status
                                        </option>


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

                                            )
                                        )}

                                    </select>

                                </div>


                                <div className="staffApplicationDetail__field">

                                    <label htmlFor="status-note">

                                        Internal note

                                        <span>
                                            Optional
                                        </span>

                                    </label>


                                    <textarea
                                        id="status-note"
                                        value={
                                            statusNotes
                                        }
                                        maxLength={500}
                                        onChange={(event) =>
                                            setStatusNotes(
                                                event.target.value
                                            )
                                        }
                                        placeholder="Add context for this status change..."
                                        rows={3}
                                    />


                                    <small>
                                        {statusNotes.length}
                                        /500
                                    </small>

                                </div>

                            </div>


                            <div className="staffDetailPanel__footer">

                                <div className="staffApplicationDetail__currentStatus">

                                    <span>
                                        Current
                                    </span>

                                    <StaffStatusBadge
                                        status={
                                            application.status
                                        }
                                    />

                                </div>


                                <button
                                    type="button"
                                    className="staffApplicationDetail__primaryButton"
                                    onClick={
                                        handleStatusUpdate
                                    }
                                    disabled={
                                        updatingStatus ||
                                        !selectedStatus
                                    }
                                >
                                    {updatingStatus
                                        ? "Updating..."
                                        : "Save Status"}
                                </button>

                            </div>

                        </section>


                        {/* CLIENT + ASSIGNMENT */}

                        <div className="staffApplicationDetail__secondaryGrid">

                            {/* CLIENT */}

                            <section className="staffDetailPanel">

                                <div className="staffDetailPanel__sidebarHeading">

                                    <div>

                                        <span>
                                            Client
                                        </span>

                                        <h2>
                                            Contact
                                        </h2>

                                    </div>


                                    <HiOutlineUser />

                                </div>


                                <div className="staffApplicationDetail__clientDetails">

                                    <div>

                                        <span>
                                            Full Name
                                        </span>

                                        <strong>
                                            {clientName}
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Email
                                        </span>

                                        <strong>
                                            {client?.email ||
                                                "—"}
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Phone
                                        </span>

                                        <strong>
                                            {client?.phone ||
                                                client?.phoneNumber ||
                                                "—"}
                                        </strong>

                                    </div>

                                </div>

                            </section>


                            {/* ASSIGNED STAFF */}

                            <section className="staffDetailPanel">

                                <div className="staffDetailPanel__sidebarHeading">

                                    <div>

                                        <span>
                                            Assignment
                                        </span>

                                        <h2>
                                            Assigned Staff
                                        </h2>

                                    </div>


                                    <HiOutlineCheckCircle />

                                </div>


                                <div className="staffApplicationDetail__assignedStaff">

                                    <div className="staffApplicationDetail__assignedAvatar">

                                        {getInitials(
                                            application?.assignedTo?.name ||
                                            application?.assignedTo?.fullName ||
                                            "Staff"
                                        )}

                                    </div>


                                    <div>

                                        <strong>
                                            {
                                                application?.assignedTo?.name ||
                                                application?.assignedTo?.fullName ||
                                                "Colusus Staff"
                                            }
                                        </strong>


                                        <span>
                                            {
                                                application?.assignedTo?.email ||
                                                "Staff member"
                                            }
                                        </span>

                                    </div>


                                    <span className="staffApplicationDetail__assignedBadge">
                                        Assigned
                                    </span>

                                </div>

                            </section>

                        </div>

                    </div>
                )}


                {/* =================================================
                    DOCUMENTS TAB
                ================================================= */}

                {activeTab === "documents" && (

                    <div className="staffApplicationDetail__tabContent">

                        <section className="staffDetailPanel">

                            <div className="staffDetailPanel__heading">

                                <div className="staffDetailPanel__headingIcon">
                                    <HiOutlineFolder />
                                </div>


                                <div>

                                    <span>
                                        Files
                                    </span>

                                    <h2>
                                        Application Documents
                                    </h2>

                                    <p>
                                        Review the documents submitted for this application.
                                    </p>

                                </div>


                                <div className="staffDetailPanel__count">
                                    {documents.length}
                                </div>

                            </div>


                            {documents.length === 0 ? (

                                <div className="staffApplicationDetail__empty">

                                    <div className="staffApplicationDetail__emptyIcon">
                                        <HiOutlineFolder />
                                    </div>


                                    <h3>
                                        No documents yet
                                    </h3>


                                    <p>
                                        No documents have been uploaded for this application.
                                    </p>

                                </div>

                            ) : (

                                <div className="staffApplicationDetail__documents">

                                    {documents.map(
                                        (document) => (

                                            <StaffDocumentCard
                                                key={
                                                    document._id ||
                                                    document.id
                                                }
                                                document={
                                                    document
                                                }
                                                onReview={
                                                    handleDocumentReview
                                                }
                                            />

                                        )
                                    )}

                                </div>

                            )}

                        </section>

                    </div>
                )}


                {/* =================================================
                    NOTES TAB
                ================================================= */}

                {activeTab === "notes" && (

                    <div className="staffApplicationDetail__tabContent">

                        <section className="staffDetailPanel">

                            <div className="staffDetailPanel__heading">

                                <div className="staffDetailPanel__headingIcon">
                                    <HiOutlineChatAlt2 />
                                </div>


                                <div>

                                    <span>
                                        Internal
                                    </span>

                                    <h2>
                                        Staff Notes
                                    </h2>

                                    <p>
                                        Private operational notes for the Colusus team.
                                    </p>

                                </div>

                            </div>


                            {/* NOTE COMPOSER */}

                            <div className="staffApplicationDetail__noteComposer">

                                <textarea
                                    value={newNote}
                                    maxLength={1000}
                                    onChange={(event) =>
                                        setNewNote(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Write an internal note..."
                                    rows={3}
                                />


                                <div className="staffApplicationDetail__noteComposerFooter">

                                    <span>
                                        Visible to staff only
                                    </span>


                                    <div>

                                        <small>
                                            {newNote.length}
                                            /1000
                                        </small>


                                        <button
                                            type="button"
                                            className="staffApplicationDetail__primaryButton"
                                            onClick={
                                                handleAddNote
                                            }
                                            disabled={
                                                addingNote ||
                                                !newNote.trim()
                                            }
                                        >
                                            {addingNote
                                                ? "Adding..."
                                                : "Add Note"}
                                        </button>

                                    </div>

                                </div>

                            </div>


                            {/* NOTES */}

                            {notes.length === 0 ? (

                                <div className="staffApplicationDetail__notesEmpty">

                                    <HiOutlineChatAlt2 />

                                    <span>
                                        No internal notes yet.
                                    </span>

                                </div>

                            ) : (

                                <div className="staffApplicationDetail__notes">

                                    {notes.map(
                                        (note) => (

                                            <article
                                                key={
                                                    note._id ||
                                                    note.id
                                                }
                                                className="staffApplicationDetail__note"
                                            >

                                                <div className="staffApplicationDetail__noteAvatar">
                                                    <HiOutlineUser />
                                                </div>


                                                <div className="staffApplicationDetail__noteContent">

                                                    <div className="staffApplicationDetail__noteHeader">

                                                        <strong>
                                                            {
                                                                note.createdBy?.name ||
                                                                note.createdBy?.fullName ||
                                                                note.author?.name ||
                                                                "Staff"
                                                            }
                                                        </strong>


                                                        <span>
                                                            {formatDateTime(
                                                                note.createdAt
                                                            )}
                                                        </span>

                                                    </div>


                                                    <p>
                                                        {
                                                            note.message ||
                                                            note.content ||
                                                            note.text ||
                                                            ""
                                                        }
                                                    </p>

                                                </div>

                                            </article>

                                        )
                                    )}

                                </div>

                            )}

                        </section>

                    </div>
                )}

            </div>

        </div>
    );
};


export default StaffApplicationDetail;