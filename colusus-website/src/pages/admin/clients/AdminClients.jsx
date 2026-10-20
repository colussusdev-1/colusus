import React, {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    HiOutlineSearch,
    HiOutlineUsers,
    HiOutlineDocumentText,
    HiOutlineFolderOpen,
    HiOutlineChevronRight,
    HiOutlineDownload,
} from "react-icons/hi";

import adminClientService from "./adminClient.service";

import "./AdminClients.css";


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
GET CLIENT NAME
============================================================
*/

const getClientName = (client) => {
    return (
        client?.user?.name ||
        client?.name ||
        "Unnamed Client"
    );
};


/*
============================================================
GET CLIENT EMAIL
============================================================
*/

const getClientEmail = (client) => {
    return (
        client?.user?.email ||
        client?.email ||
        ""
    );
};


/*
============================================================
GET CLIENT PROFILE
============================================================
*/

const getProfile = (client) => {
    return client?.profile || null;
};


/*
============================================================
GET CLIENT PHONE
============================================================
*/

const getClientPhone = (client) => {
    const profile = getProfile(client);
    const user = client?.user || client;

    return (
        profile?.phoneNumber ||
        profile?.phone ||
        profile?.mobileNumber ||
        profile?.mobile ||
        user?.phoneNumber ||
        user?.phone ||
        user?.mobileNumber ||
        user?.mobile ||
        ""
    );
};


/*
============================================================
GET CLIENT LOCATION
============================================================
|
| Location is client-level information.
|
| We deliberately do NOT use:
|
| - preferredDestination
| - migrationGoal
|
| Those belong to individual applications/pathways.
|
============================================================
*/

const getClientLocation = (client) => {
    const profile = getProfile(client);

    return (
        profile?.currentCountry ||
        profile?.nationality ||
        "—"
    );
};


/*
============================================================
GET CLIENT STATUS
============================================================
*/

const getClientStatus = (client) => {
    const user = client?.user || client;

    return user?.isActive
        ? "Active"
        : "Inactive";
};


/*
============================================================
CSV VALUE ESCAPING
============================================================
|
| Escapes values containing commas, quotes or newlines.
|
| Also protects spreadsheet users against common CSV
| formula injection when opening exported files.
|
============================================================
*/

const escapeCSV = (value) => {
    let text = String(value ?? "");

    if (/^[\s\u0000-\u001f]*[=+\-@]/.test(text)) {
        text = `'${text}`;
    }

    return `"${text.replace(/"/g, '""')}"`;
};


/*
============================================================
EXPORT CLIENTS TO CSV
============================================================
*/

const exportClientsToCSV = (clients) => {
    if (!Array.isArray(clients) || clients.length === 0) {
        return false;
    }

    /*
    --------------------------------------------------------
    CSV HEADERS
    --------------------------------------------------------
    */

    const headers = [
        "Client Name",
        "Email",
        "Phone",
        "Nationality",
        "Current Country",
        "Account Status",
        "Applications",
        "Documents",
        "Date Joined",
    ];


    /*
    --------------------------------------------------------
    CLIENT DATA
    --------------------------------------------------------
    */

    const rows = clients.map((client) => {
        const user = client?.user || client;
        const profile = getProfile(client);

        const joinedDate = user?.createdAt
            ? new Date(user.createdAt)
            : null;

        const validJoinedDate =
            joinedDate &&
                !Number.isNaN(joinedDate.getTime())
                ? joinedDate.toISOString().slice(0, 10)
                : "";

        return [
            getClientName(client),
            getClientEmail(client),
            getClientPhone(client),
            profile?.nationality || "",
            profile?.currentCountry || "",
            getClientStatus(client),
            client?.applications ?? 0,
            client?.documents ?? 0,
            validJoinedDate,
        ];
    });


    /*
    --------------------------------------------------------
    BUILD CSV CONTENT
    --------------------------------------------------------
    */

    const csvContent = [
        headers,
        ...rows,
    ]
        .map((row) => row.map(escapeCSV).join(","))
        .join("\r\n");


    /*
    --------------------------------------------------------
    CREATE DOWNLOAD
    --------------------------------------------------------
    */

    const blob = new Blob(
        [
            "\uFEFF",
            csvContent,
        ],
        {
            type: "text/csv;charset=utf-8;",
        }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    const date = new Date()
        .toISOString()
        .slice(0, 10);

    link.href = url;

    link.download = `colossus-clients-${date}.csv`;

    document.body.appendChild(link);

    link.click();

    link.remove();

    URL.revokeObjectURL(url);

    return true;
};


/*
============================================================
COMPONENT
============================================================
*/

const AdminClients = () => {

    /*
    |--------------------------------------------------------
    | STATE
    |--------------------------------------------------------
    */

    const [clients, setClients] = useState([]);

    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [exporting, setExporting] = useState(false);


    /*
    |--------------------------------------------------------
    | LOAD CLIENTS
    |--------------------------------------------------------
    */

    const loadClients = useCallback(async (searchTerm = "") => {
        try {
            setLoading(true);

            setError("");

            const result =
                await adminClientService.getAllClients(
                    searchTerm
                );

            setClients(
                Array.isArray(result)
                    ? result
                    : []
            );

        } catch (requestError) {
            console.error(
                "FAILED TO LOAD CLIENTS:",
                requestError
            );

            setError(
                requestError?.response?.data?.message ||
                "Unable to load clients."
            );

            setClients([]);

        } finally {
            setLoading(false);
        }
    }, []);


    /*
    |--------------------------------------------------------
    | INITIAL LOAD AND SEARCH
    |--------------------------------------------------------
    |
    | One effect handles both initial loading and searching.
    | This avoids making two requests on the initial render.
    |
    */

    useEffect(() => {
        const timeout = setTimeout(() => {
            loadClients(search.trim());
        }, search ? 350 : 0);

        return () => {
            clearTimeout(timeout);
        };
    }, [search, loadClients]);


    /*
    |--------------------------------------------------------
    | EXPORT CLIENTS
    |--------------------------------------------------------
    */

    const handleExportClients = () => {
        if (loading || exporting) {
            return;
        }

        if (!clients.length) {
            setError("There are no clients to export.");

            return;
        }

        try {
            setExporting(true);

            setError("");

            const exported = exportClientsToCSV(clients);

            if (!exported) {
                setError("Unable to export clients.");
            }

        } catch (exportError) {
            console.error(
                "FAILED TO EXPORT CLIENTS:",
                exportError
            );

            setError(
                "An error occurred while exporting clients."
            );

        } finally {
            setExporting(false);
        }
    };


    /*
    |--------------------------------------------------------
    | OPEN CLIENT
    |--------------------------------------------------------
    */

    const handleOpenClient = (client) => {
        const user = client?.user || client;

        if (!user?._id) {
            return;
        }

        window.location.href =
            `/admin/clients/${user._id}`;
    };


    /*
    |--------------------------------------------------------
    | RENDER
    |--------------------------------------------------------
    */

    return (

        <section className="admin-clients">

            {/* =====================================================
                PAGE HEADER
            ===================================================== */}

            <div className="admin-clients__header">

                <div>

                    <span className="admin-clients__eyebrow">
                        CLIENT MANAGEMENT
                    </span>

                    <h1>
                        Clients
                    </h1>

                    <p>
                        Manage client accounts, migration profiles,
                        applications and documents.
                    </p>

                </div>

            </div>


            {/* =====================================================
                TOOLBAR
            ===================================================== */}

            <div className="admin-clients__toolbar">

                {/* =============================================
                    SEARCH
                ============================================= */}

                <div className="admin-clients__search">

                    <HiOutlineSearch />

                    <input
                        type="search"
                        placeholder="Search clients by name or email..."
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                    />

                </div>


                {/* =============================================
                    CLIENT COUNT
                ============================================= */}

                <div className="admin-clients__count">

                    <HiOutlineUsers />

                    <span>

                        {clients.length}{" "}

                        {clients.length === 1
                            ? "client"
                            : "clients"}

                    </span>

                </div>


                {/* =============================================
                    EXPORT CLIENTS
                ============================================= */}

                <button
                    type="button"
                    className="admin-clients__export"
                    onClick={handleExportClients}
                    disabled={
                        loading ||
                        exporting ||
                        clients.length === 0
                    }
                    title="Export the currently loaded clients to CSV"
                >

                    <HiOutlineDownload />

                    <span>
                        {exporting
                            ? "Preparing export..."
                            : "Export Clients"}
                    </span>

                </button>

            </div>


            {/* =====================================================
                ERROR
            ===================================================== */}

            {error && (

                <div
                    className="admin-clients__error"
                    role="alert"
                >

                    {error}

                </div>

            )}


            {/* =====================================================
                LOADING
            ===================================================== */}

            {loading ? (

                <div className="admin-clients__state">

                    <div className="admin-clients__loader" />

                    <span>
                        Loading clients...
                    </span>

                </div>

            ) : clients.length === 0 ? (

                /* =================================================
                    EMPTY STATE
                ================================================= */

                <div className="admin-clients__empty">

                    <div className="admin-clients__empty-icon">

                        <HiOutlineUsers />

                    </div>

                    <h3>
                        No clients found
                    </h3>

                    <p>
                        {search
                            ? "Try a different search."
                            : "There are no client accounts yet."}
                    </p>

                </div>

            ) : (

                /* =================================================
                    CLIENT TABLE
                ================================================= */

                <div className="admin-clients__table-wrapper">

                    <table className="admin-clients__table">

                        {/* =====================================
                            TABLE HEADER
                        ===================================== */}

                        <thead>

                            <tr>

                                <th>
                                    Client
                                </th>

                                <th>
                                    Location
                                </th>

                                <th>
                                    Applications
                                </th>

                                <th>
                                    Documents
                                </th>

                                <th>
                                    Status
                                </th>

                                <th>
                                    Joined
                                </th>

                                <th />

                            </tr>

                        </thead>


                        {/* =====================================
                            TABLE BODY
                        ===================================== */}

                        <tbody>

                            {clients.map((client) => {

                                const user =
                                    client?.user ||
                                    client;

                                return (

                                    <tr
                                        key={user?._id}

                                        className="admin-clients__row"

                                        onClick={() =>
                                            handleOpenClient(client)
                                        }

                                    >

                                        {/* =====================
                                            CLIENT
                                        ===================== */}

                                        <td>

                                            <div className="admin-clients__client">

                                                <div className="admin-clients__avatar">

                                                    {getClientName(client)
                                                        .charAt(0)
                                                        .toUpperCase()}

                                                </div>

                                                <div>

                                                    <strong>

                                                        {getClientName(client)}

                                                    </strong>

                                                    <span>

                                                        {getClientEmail(client) ||
                                                            "No email available"}

                                                    </span>

                                                </div>

                                            </div>

                                        </td>


                                        {/* =====================
                                            LOCATION
                                        ===================== */}

                                        <td>

                                            <span className="admin-clients__text">

                                                {getClientLocation(client)}

                                            </span>

                                        </td>


                                        {/* =====================
                                            APPLICATIONS
                                        ===================== */}

                                        <td>

                                            <div className="admin-clients__metric">

                                                <HiOutlineDocumentText />

                                                <strong>

                                                    {client?.applications ?? 0}

                                                </strong>

                                            </div>

                                        </td>


                                        {/* =====================
                                            DOCUMENTS
                                        ===================== */}

                                        <td>

                                            <div className="admin-clients__metric">

                                                <HiOutlineFolderOpen />

                                                <strong>

                                                    {client?.documents ?? 0}

                                                </strong>

                                            </div>

                                        </td>


                                        {/* =====================
                                            STATUS
                                        ===================== */}

                                        <td>

                                            <span
                                                className={
                                                    `admin-clients__status ${user?.isActive
                                                        ? "admin-clients__status--active"
                                                        : "admin-clients__status--inactive"
                                                    }`
                                                }
                                            >

                                                {getClientStatus(client)}

                                            </span>

                                        </td>


                                        {/* =====================
                                            JOINED
                                        ===================== */}

                                        <td>

                                            <span className="admin-clients__date">

                                                {formatDate(user?.createdAt)}

                                            </span>

                                        </td>


                                        {/* =====================
                                            ACTION
                                        ===================== */}

                                        <td>

                                            <HiOutlineChevronRight
                                                className="admin-clients__arrow"
                                            />

                                        </td>

                                    </tr>

                                );

                            })}

                        </tbody>

                    </table>

                </div>

            )}

        </section>

    );
};


export default AdminClients;