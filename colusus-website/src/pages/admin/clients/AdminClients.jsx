import React, {
    useEffect,
    useState,
} from "react";

import {
    HiOutlineSearch,
    HiOutlineUsers,
    HiOutlineDocumentText,
    HiOutlineFolderOpen,
    HiOutlineChevronRight,
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
        "—"
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
COMPONENT
============================================================
*/

const AdminClients = () => {

    /*
    |--------------------------------------------------------------------------
    | STATE
    |--------------------------------------------------------------------------
    */

    const [clients, setClients] = useState([]);

    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    /*
    |--------------------------------------------------------------------------
    | LOAD CLIENTS
    |--------------------------------------------------------------------------
    */

    const loadClients = async () => {
        try {

            setLoading(true);

            setError("");

            const result =
                await adminClientService.getAllClients(
                    search
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

        } finally {

            setLoading(false);

        }
    };


    /*
    |--------------------------------------------------------------------------
    | INITIAL LOAD
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        loadClients();

    }, []);


    /*
    |--------------------------------------------------------------------------
    | SEARCH
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        const timeout = setTimeout(() => {

            loadClients();

        }, 350);

        return () => {

            clearTimeout(timeout);

        };

    }, [search]);


    /*
    |--------------------------------------------------------------------------
    | RENDER
    |--------------------------------------------------------------------------
    */

    return (

        <section className="admin-clients">


            {/* =========================================================
                PAGE HEADER
            ========================================================= */}

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


            {/* =========================================================
                TOOLBAR
            ========================================================= */}

            <div className="admin-clients__toolbar">


                {/* =====================================================
                    SEARCH
                ===================================================== */}

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


                {/* =====================================================
                    CLIENT COUNT
                ===================================================== */}

                <div className="admin-clients__count">

                    <HiOutlineUsers />

                    <span>

                        {clients.length}{" "}

                        {clients.length === 1
                            ? "client"
                            : "clients"}

                    </span>

                </div>

            </div>


            {/* =========================================================
                ERROR
            ========================================================= */}

            {error && (

                <div className="admin-clients__error">

                    {error}

                </div>

            )}


            {/* =========================================================
                LOADING
            ========================================================= */}

            {loading ? (

                <div className="admin-clients__state">

                    <div className="admin-clients__loader" />

                    <span>
                        Loading clients...
                    </span>

                </div>

            ) : clients.length === 0 ? (


                /* =====================================================
                    EMPTY STATE
                ===================================================== */

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


                /* =====================================================
                    CLIENT TABLE
                ===================================================== */

                <div className="admin-clients__table-wrapper">

                    <table className="admin-clients__table">


                        {/* =================================================
                            TABLE HEADER
                        ================================================= */}

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


                        {/* =================================================
                            TABLE BODY
                        ================================================= */}

                        <tbody>

                            {clients.map((client) => {

                                const user =
                                    client?.user ||
                                    client;

                                return (

                                    <tr
                                        key={
                                            user?._id
                                        }

                                        className="admin-clients__row"

                                        onClick={() => {

                                            window.location.href =
                                                `/admin/clients/${user?._id}`;

                                        }}

                                    >


                                        {/* =================================
                                            CLIENT
                                        ================================= */}

                                        <td>

                                            <div className="admin-clients__client">


                                                <div className="admin-clients__avatar">

                                                    {getClientName(
                                                        client
                                                    )
                                                        .charAt(0)
                                                        .toUpperCase()}

                                                </div>


                                                <div>

                                                    <strong>

                                                        {getClientName(
                                                            client
                                                        )}

                                                    </strong>

                                                    <span>

                                                        {getClientEmail(
                                                            client
                                                        )}

                                                    </span>

                                                </div>

                                            </div>

                                        </td>


                                        {/* =================================
                                            LOCATION
                                        ================================= */}

                                        <td>

                                            <span className="admin-clients__text">

                                                {getClientLocation(
                                                    client
                                                )}

                                            </span>

                                        </td>


                                        {/* =================================
                                            APPLICATIONS
                                        ================================= */}

                                        <td>

                                            <div className="admin-clients__metric">

                                                <HiOutlineDocumentText />

                                                <strong>

                                                    {client?.applications ?? 0}

                                                </strong>

                                            </div>

                                        </td>


                                        {/* =================================
                                            DOCUMENTS
                                        ================================= */}

                                        <td>

                                            <div className="admin-clients__metric">

                                                <HiOutlineFolderOpen />

                                                <strong>

                                                    {client?.documents ?? 0}

                                                </strong>

                                            </div>

                                        </td>


                                        {/* =================================
                                            STATUS
                                        ================================= */}

                                        <td>

                                            <span
                                                className={
                                                    `admin-clients__status ${user?.isActive
                                                        ? "admin-clients__status--active"
                                                        : "admin-clients__status--inactive"
                                                    }`
                                                }
                                            >

                                                {getClientStatus(
                                                    client
                                                )}

                                            </span>

                                        </td>


                                        {/* =================================
                                            JOINED
                                        ================================= */}

                                        <td>

                                            <span className="admin-clients__date">

                                                {formatDate(
                                                    user?.createdAt
                                                )}

                                            </span>

                                        </td>


                                        {/* =================================
                                            ACTION
                                        ================================= */}

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