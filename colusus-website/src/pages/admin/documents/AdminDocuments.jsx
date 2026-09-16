import React, {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    HiOutlineDocumentText,
    HiOutlineSearch,
    HiOutlineRefresh,
    HiOutlineUser,
    HiOutlineGlobeAlt,
} from "react-icons/hi";

import documentsService from "./documents.service";

import "./AdminDocuments.css";

/*
============================================================
STATUS CONFIG
============================================================
*/

const STATUS_OPTIONS = [
    "ALL",
    "PENDING",
    "APPROVED",
    "REJECTED",
    "REUPLOAD_REQUIRED",
];

/*
============================================================
FORMAT LABEL
============================================================
*/

const formatLabel = (value) => {
    if (!value) {
        return "—";
    }

    return String(value)
        .replace(/[_-]+/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

/*
============================================================
FORMAT DATE
============================================================
*/

const formatDate = (value) => {
    if (!value) {
        return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(date);
};

/*
============================================================
GET DOCUMENT NAME
============================================================
*/

const getDocumentName = (document) => {
    return (
        document?.name ||
        document?.originalFileName ||
        document?.documentName ||
        document?.type ||
        "Untitled document"
    );
};

/*
============================================================
GET DOCUMENT TYPE
============================================================
*/

const getDocumentType = (document) => {
    return (
        document?.type ||
        document?.documentType ||
        "OTHER"
    );
};

/*
============================================================
GET CLIENT NAME
============================================================
*/

const getClientName = (document) => {
    return (
        document?.user?.name ||
        "Unknown client"
    );
};

/*
============================================================
GET APPLICATION
============================================================
*/

const getApplication = (document) => {
    return document?.application;
};

/*
============================================================
GET APPLICATION LABEL
============================================================
*/

const getApplicationLabel = (document) => {
    const application = getApplication(document);

    if (!application) {
        return "—";
    }

    return (
        application?.applicationReference ||
        application?.type ||
        application?.destinationCountry ||
        "Application"
    );
};

/*
============================================================
GET COUNTRY
============================================================
*/

const getCountry = (document) => {
    const application = getApplication(document);

    return (
        application?.destinationCountry ||
        "—"
    );
};

/*
============================================================
STATUS NORMALIZATION
============================================================
*/

const normalizeStatus = (value) => {
    return String(value || "")
        .trim()
        .toUpperCase()
        .replace(/\s+/g, "_");
};

/*
============================================================
STATUS CLASS
============================================================
*/

const getStatusClass = (status) => {
    const normalized = normalizeStatus(status);

    switch (normalized) {
        case "APPROVED":
            return "approved";

        case "REJECTED":
            return "rejected";

        case "REUPLOAD_REQUIRED":
            return "reupload";

        case "PENDING":
        case "UNDER_REVIEW":
        case "PROCESSING":
            return "pending";

        default:
            return "default";
    }
};

/*
============================================================
COMPONENT
============================================================
*/

const AdminDocuments = () => {
    const [documents, setDocuments] = useState([]);

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] =
        useState("ALL");

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [refreshing, setRefreshing] =
        useState(false);

    /*
    ==========================================================
    LOAD DOCUMENTS
    ==========================================================
    */

    const loadDocuments = async (
        isRefresh = false,
    ) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            const result =
                await documentsService.getAllDocuments();

            setDocuments(
                Array.isArray(result)
                    ? result
                    : [],
            );
        } catch (requestError) {
            console.error(
                "FAILED TO LOAD DOCUMENTS:",
                requestError,
            );

            setError(
                requestError?.response?.data?.message ||
                "Unable to load documents.",
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    /*
    ==========================================================
    INITIAL LOAD
    ==========================================================
    */

    useEffect(() => {
        loadDocuments();
    }, []);

    /*
    ==========================================================
    FILTER DOCUMENTS
    ==========================================================
    */

    const filteredDocuments = useMemo(() => {
        const normalizedSearch =
            search.trim().toLowerCase();

        return documents.filter((document) => {
            const status =
                normalizeStatus(document?.status);

            const matchesStatus =
                statusFilter === "ALL" ||
                status === statusFilter;

            if (!matchesStatus) {
                return false;
            }

            if (!normalizedSearch) {
                return true;
            }

            const searchableText = [
                getDocumentName(document),

                getDocumentType(document),

                getClientName(document),

                document?.user?.email,

                getApplicationLabel(document),

                getCountry(document),
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return searchableText.includes(
                normalizedSearch,
            );
        });
    }, [
        documents,
        search,
        statusFilter,
    ]);

    /*
    ==========================================================
    SUMMARY COUNTS
    ==========================================================
    */

    const summary = useMemo(() => {
        return {
            total: documents.length,

            pending: documents.filter(
                (document) =>
                    ["PENDING", "UNDER_REVIEW"].includes(
                        normalizeStatus(document?.status),
                    ),
            ).length,

            approved: documents.filter(
                (document) =>
                    normalizeStatus(document?.status) ===
                    "APPROVED",
            ).length,

            rejected: documents.filter(
                (document) =>
                    ["REJECTED", "REUPLOAD_REQUIRED"].includes(
                        normalizeStatus(document?.status),
                    ),
            ).length,
        };
    }, [documents]);

    /*
    ==========================================================
    RENDER
    ==========================================================
    */

    return (
        <section className="adminDocuments">

            {/* ==================================================
                HEADER
            ================================================== */}

            <header className="adminDocuments__header">

                <div>

                    <span className="adminDocuments__eyebrow">
                        DOCUMENT MANAGEMENT
                    </span>

                    <h1>
                        Documents
                    </h1>

                    <p>
                        Manage documents submitted across
                        client applications.
                    </p>

                </div>

                <button
                    type="button"
                    className="adminDocuments__refresh"
                    onClick={() => loadDocuments(true)}
                    disabled={refreshing}
                >

                    <HiOutlineRefresh
                        className={
                            refreshing
                                ? "adminDocuments__refreshIcon is-spinning"
                                : "adminDocuments__refreshIcon"
                        }
                    />

                    <span>
                        Refresh
                    </span>

                </button>

            </header>


            {/* ==================================================
                SUMMARY
            ================================================== */}

            <div className="adminDocuments__summary">

                <div className="adminDocuments__summaryCard">

                    <span>
                        Total Documents
                    </span>

                    <strong>
                        {summary.total}
                    </strong>

                </div>


                <div className="adminDocuments__summaryCard">

                    <span>
                        Pending Review
                    </span>

                    <strong>
                        {summary.pending}
                    </strong>

                </div>


                <div className="adminDocuments__summaryCard">

                    <span>
                        Approved
                    </span>

                    <strong>
                        {summary.approved}
                    </strong>

                </div>


                <div className="adminDocuments__summaryCard">

                    <span>
                        Needs Attention
                    </span>

                    <strong>
                        {summary.rejected}
                    </strong>

                </div>

            </div>


            {/* ==================================================
                TOOLBAR
            ================================================== */}

            <div className="adminDocuments__toolbar">

                <div className="adminDocuments__search">

                    <HiOutlineSearch />

                    <input
                        type="text"
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                        placeholder="Search documents, clients or applications..."
                    />

                </div>


                <div className="adminDocuments__filter">

                    <select
                        value={statusFilter}
                        onChange={(event) =>
                            setStatusFilter(event.target.value)
                        }
                    >

                        {STATUS_OPTIONS.map((status) => (

                            <option
                                key={status}
                                value={status}
                            >

                                {status === "ALL"
                                    ? "All statuses"
                                    : formatLabel(status)}

                            </option>

                        ))}

                    </select>

                </div>

            </div>


            {/* ==================================================
                ERROR
            ================================================== */}

            {error && (

                <div className="adminDocuments__error">

                    <span>
                        {error}
                    </span>

                    <button
                        type="button"
                        onClick={() => loadDocuments()}
                    >
                        Try again
                    </button>

                </div>

            )}


            {/* ==================================================
                DOCUMENT TABLE
            ================================================== */}

            <div className="adminDocuments__panel">

                <div className="adminDocuments__panelHeader">

                    <div>

                        <h2>
                            All Documents
                        </h2>

                        <span>

                            {filteredDocuments.length}{" "}

                            {filteredDocuments.length === 1
                                ? "document"
                                : "documents"}

                        </span>

                    </div>

                </div>


                {/* ==================================================
                    LOADING
                ================================================== */}

                {loading ? (

                    <div className="adminDocuments__state">

                        <div className="adminDocuments__loader" />

                        <span>
                            Loading documents...
                        </span>

                    </div>

                ) : filteredDocuments.length === 0 ? (

                    /* ==================================================
                        EMPTY
                    ================================================== */

                    <div className="adminDocuments__state adminDocuments__state--empty">

                        <div className="adminDocuments__emptyIcon">

                            <HiOutlineDocumentText />

                        </div>

                        <h3>
                            No documents found
                        </h3>

                        <p>

                            {search ||
                                statusFilter !== "ALL"

                                ? "Try adjusting your search or filter."

                                : "Documents submitted by clients will appear here."}

                        </p>

                    </div>

                ) : (

                    /* ==================================================
                        TABLE
                    ================================================== */

                    <div className="adminDocuments__tableWrapper">

                        <table className="adminDocuments__table">

                            <thead>

                                <tr>

                                    <th>
                                        Document
                                    </th>

                                    <th>
                                        Client
                                    </th>

                                    <th>
                                        Application
                                    </th>

                                    <th>
                                        Country
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th>
                                        Uploaded
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {filteredDocuments.map(
                                    (document) => {

                                        const status =
                                            normalizeStatus(
                                                document?.status,
                                            );

                                        return (

                                            <tr
                                                key={
                                                    document?._id
                                                }
                                            >

                                                {/* DOCUMENT */}

                                                <td>

                                                    <div className="adminDocuments__documentCell">

                                                        <div className="adminDocuments__documentIcon">

                                                            <HiOutlineDocumentText />

                                                        </div>


                                                        <div>

                                                            <strong
                                                                title={getDocumentName(
                                                                    document,
                                                                )}
                                                            >

                                                                {getDocumentName(
                                                                    document,
                                                                )}

                                                            </strong>


                                                            <span>

                                                                {formatLabel(
                                                                    getDocumentType(
                                                                        document,
                                                                    ),
                                                                )}

                                                            </span>

                                                        </div>

                                                    </div>

                                                </td>


                                                {/* CLIENT */}

                                                <td>

                                                    <div className="adminDocuments__clientCell">

                                                        <HiOutlineUser />

                                                        <div>

                                                            <strong>

                                                                {getClientName(
                                                                    document,
                                                                )}

                                                            </strong>


                                                            <span>

                                                                {
                                                                    document
                                                                        ?.user
                                                                        ?.email
                                                                }

                                                            </span>

                                                        </div>

                                                    </div>

                                                </td>


                                                {/* APPLICATION */}

                                                <td>

                                                    <span className="adminDocuments__application">

                                                        {getApplicationLabel(
                                                            document,
                                                        )}

                                                    </span>

                                                </td>


                                                {/* COUNTRY */}

                                                <td>

                                                    <span className="adminDocuments__country">

                                                        <HiOutlineGlobeAlt />

                                                        {getCountry(
                                                            document,
                                                        )}

                                                    </span>

                                                </td>


                                                {/* STATUS */}

                                                <td>

                                                    <span
                                                        className={`adminDocuments__status adminDocuments__status--${getStatusClass(
                                                            status,
                                                        )}`}
                                                    >

                                                        <span />

                                                        {formatLabel(
                                                            status,
                                                        )}

                                                    </span>

                                                </td>


                                                {/* UPLOADED */}

                                                <td>

                                                    <span className="adminDocuments__date">

                                                        {formatDate(
                                                            document?.createdAt,
                                                        )}

                                                    </span>

                                                </td>

                                            </tr>

                                        );

                                    },
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </section>
    );
};

export default AdminDocuments;