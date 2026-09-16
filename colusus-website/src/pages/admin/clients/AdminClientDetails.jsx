import React, {
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    HiOutlineArrowLeft,
    HiOutlineMail,
    HiOutlinePhone,
    HiOutlineLocationMarker,
    HiOutlineGlobeAlt,
    HiOutlineCalendar,
    HiOutlineDocumentText,
    HiOutlineFolderOpen,
    HiOutlineBell,
    HiOutlineIdentification,
} from "react-icons/hi";

import adminClientService from "./adminClient.service";

import "./AdminClientDetails.css";


/*
|--------------------------------------------------------------------------
| FORMAT DATE
|--------------------------------------------------------------------------
*/

const formatDate = (value) => {

    if (!value) {
        return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return new Intl.DateTimeFormat(
        "en-GB",
        {
            day: "numeric",
            month: "short",
            year: "numeric",
        },
    ).format(date);
};


/*
|--------------------------------------------------------------------------
| FORMAT LABEL
|--------------------------------------------------------------------------
*/

const formatLabel = (value) => {

    if (!value) {
        return "—";
    }

    return String(value)
        .replace(/[_-]+/g, " ")
        .toLowerCase()
        .replace(
            /\b\w/g,
            (letter) => letter.toUpperCase(),
        );
};


/*
|--------------------------------------------------------------------------
| GET STATUS CLASS
|--------------------------------------------------------------------------
*/

const getStatusClass = (isActive) => {

    return isActive
        ? "admin-client-details__status--active"
        : "admin-client-details__status--inactive";
};


/*
|--------------------------------------------------------------------------
| COMPONENT
|--------------------------------------------------------------------------
*/

const AdminClientDetails = () => {

    const {
        id,
    } = useParams();

    const navigate = useNavigate();


    /*
    |--------------------------------------------------------------------------
    | STATE
    |--------------------------------------------------------------------------
    */

    const [
        clientData,
        setClientData,
    ] = useState(null);

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        error,
        setError,
    ] = useState("");


    /*
    |--------------------------------------------------------------------------
    | LOAD CLIENT
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        const loadClient = async () => {

            try {

                setLoading(true);

                setError("");

                const result =
                    await adminClientService.getClientDetails(id);

                setClientData(result);

            } catch (requestError) {

                console.error(
                    "FAILED TO LOAD CLIENT DETAILS:",
                    requestError,
                );

                setError(
                    requestError?.response?.data?.message ||
                    "Unable to load client details.",
                );

            } finally {

                setLoading(false);

            }

        };


        if (id) {
            loadClient();
        }

    }, [id]);


    /*
    |--------------------------------------------------------------------------
    | LOADING
    |--------------------------------------------------------------------------
    */

    if (loading) {

        return (
            <section className="admin-client-details">

                <div className="admin-client-details__state">

                    <div className="admin-client-details__loader" />

                    <span>
                        Loading client...
                    </span>

                </div>

            </section>
        );

    }


    /*
    |--------------------------------------------------------------------------
    | ERROR
    |--------------------------------------------------------------------------
    */

    if (error || !clientData) {

        return (
            <section className="admin-client-details">

                <button
                    type="button"
                    className="admin-client-details__back"
                    onClick={() =>
                        navigate("/admin/clients")
                    }
                >
                    <HiOutlineArrowLeft />

                    <span>
                        Back to Clients
                    </span>
                </button>


                <div className="admin-client-details__error">

                    <h2>
                        Unable to load client
                    </h2>

                    <p>
                        {error || "Client not found."}
                    </p>

                </div>

            </section>
        );

    }


    /*
    |--------------------------------------------------------------------------
    | DATA
    |--------------------------------------------------------------------------
    */

    const client =
        clientData.client || {};

    const profile =
        clientData.profile || {};

    const applications =
        Array.isArray(clientData.applications)
            ? clientData.applications
            : [];

    const documents =
        Array.isArray(clientData.documents)
            ? clientData.documents
            : [];

    const notifications =
        Array.isArray(clientData.notifications)
            ? clientData.notifications
            : [];


    /*
    |--------------------------------------------------------------------------
    | RENDER
    |--------------------------------------------------------------------------
    */

    return (

        <section className="admin-client-details">

            {/* =========================================================
                BACK
            ========================================================= */}

            <button
                type="button"
                className="admin-client-details__back"
                onClick={() =>
                    navigate("/admin/clients")
                }
            >

                <HiOutlineArrowLeft />

                <span>
                    Back to Clients
                </span>

            </button>


            {/* =========================================================
                CLIENT HEADER
            ========================================================= */}

            <div className="admin-client-details__hero">

                <div className="admin-client-details__identity">

                    <div className="admin-client-details__avatar">

                        {(
                            client.name ||
                            "C"
                        )
                            .charAt(0)
                            .toUpperCase()}

                    </div>


                    <div className="admin-client-details__identity-text">

                        <div className="admin-client-details__name-row">

                            <h1>
                                {client.name || "Unnamed Client"}
                            </h1>

                            <span
                                className={
                                    `admin-client-details__status ${getStatusClass(
                                        client.isActive
                                    )}`
                                }
                            >
                                {client.isActive
                                    ? "Active"
                                    : "Inactive"}
                            </span>

                        </div>


                        <p>
                            {client.email || "—"}
                        </p>


                        <span className="admin-client-details__joined">

                            Client since{" "}

                            {formatDate(
                                client.createdAt
                            )}

                        </span>

                    </div>

                </div>


                <div className="admin-client-details__hero-stats">

                    <div>

                        <strong>
                            {applications.length}
                        </strong>

                        <span>
                            Applications
                        </span>

                    </div>


                    <div>

                        <strong>
                            {documents.length}
                        </strong>

                        <span>
                            Documents
                        </span>

                    </div>


                    <div>

                        <strong>
                            {notifications.length}
                        </strong>

                        <span>
                            Notifications
                        </span>

                    </div>

                </div>

            </div>


            {/* =========================================================
                MAIN GRID
            ========================================================= */}

            <div className="admin-client-details__grid">


                {/* =====================================================
                    PROFILE
                ===================================================== */}

                <section className="admin-client-details__card">

                    <div className="admin-client-details__card-header">

                        <div>

                            <span>
                                CLIENT PROFILE
                            </span>

                            <h2>
                                Personal Information
                            </h2>

                        </div>

                    </div>


                    <div className="admin-client-details__info-grid">

                        <div className="admin-client-details__info-item">

                            <HiOutlineMail />

                            <div>

                                <span>
                                    Email
                                </span>

                                <strong>
                                    {client.email || "—"}
                                </strong>

                            </div>

                        </div>


                        <div className="admin-client-details__info-item">

                            <HiOutlinePhone />

                            <div>

                                <span>
                                    Phone Number
                                </span>

                                <strong>
                                    {profile.phoneNumber || "—"}
                                </strong>

                            </div>

                        </div>


                        <div className="admin-client-details__info-item">

                            <HiOutlineCalendar />

                            <div>

                                <span>
                                    Date of Birth
                                </span>

                                <strong>
                                    {formatDate(
                                        profile.dateOfBirth
                                    )}
                                </strong>

                            </div>

                        </div>


                        <div className="admin-client-details__info-item">

                            <HiOutlineGlobeAlt />

                            <div>

                                <span>
                                    Nationality
                                </span>

                                <strong>
                                    {profile.nationality || "—"}
                                </strong>

                            </div>

                        </div>


                        <div className="admin-client-details__info-item">

                            <HiOutlineLocationMarker />

                            <div>

                                <span>
                                    Current Country
                                </span>

                                <strong>
                                    {profile.currentCountry || "—"}
                                </strong>

                            </div>

                        </div>


                        <div className="admin-client-details__info-item">

                            <HiOutlineIdentification />

                            <div>

                                <span>
                                    Passport Number
                                </span>

                                <strong>
                                    {profile.passportNumber || "—"}
                                </strong>

                            </div>

                        </div>


                        <div className="admin-client-details__info-item">

                            <HiOutlineGlobeAlt />

                            <div>

                                <span>
                                    Migration Goal
                                </span>

                                <strong>
                                    {formatLabel(
                                        profile.migrationGoal
                                    )}
                                </strong>

                            </div>

                        </div>


                       

                    </div>


                    <div className="admin-client-details__address">

                        <span>
                            Address
                        </span>

                        <p>
                            {profile.address || "No address provided."}
                        </p>

                    </div>

                </section>


                {/* =====================================================
                    APPLICATIONS
                ===================================================== */}

                <section className="admin-client-details__card">

                    <div className="admin-client-details__card-header">

                        <div>

                            <span>
                                MIGRATION
                            </span>

                            <h2>
                                Applications
                            </h2>

                        </div>

                    </div>


                    {applications.length === 0 ? (

                        <div className="admin-client-details__empty">

                            <HiOutlineDocumentText />

                            <span>
                                No applications yet.
                            </span>

                        </div>

                    ) : (

                        <div className="admin-client-details__list">

                            {applications.map(
                                (application) => {

                                    const opportunity =
                                        application?.opportunity ||
                                        {};

                                    return (

                                        <button
                                            type="button"
                                            className="admin-client-details__list-item"
                                            key={application._id}
                                            onClick={() =>
                                                navigate(
                                                    `/admin/applications/${application._id}`
                                                )
                                            }
                                        >

                                            <div className="admin-client-details__list-icon">

                                                <HiOutlineDocumentText />

                                            </div>


                                            <div className="admin-client-details__list-content">

                                                <strong>
                                                    {
                                                        application?.opportunitySnapshot?.title ||
                                                        opportunity?.title ||
                                                        formatLabel(
                                                            application.type
                                                        )
                                                    }
                                                </strong>

                                                <span>

                                                    {
                                                        application?.destinationCountry ||
                                                        application?.opportunitySnapshot?.countryName ||
                                                        "—"
                                                    }

                                                    {" · "}

                                                    {
                                                        formatLabel(
                                                            application.status
                                                        )
                                                    }

                                                </span>

                                            </div>


                                            <span className="admin-client-details__list-date">

                                                {formatDate(
                                                    application.createdAt
                                                )}

                                            </span>

                                        </button>

                                    );

                                }
                            )}

                        </div>

                    )}

                </section>


                {/* =====================================================
                    DOCUMENTS
                ===================================================== */}

                <section className="admin-client-details__card">

                    <div className="admin-client-details__card-header">

                        <div>

                            <span>
                                DOCUMENT MANAGEMENT
                            </span>

                            <h2>
                                Documents
                            </h2>

                        </div>

                    </div>


                    {documents.length === 0 ? (

                        <div className="admin-client-details__empty">

                            <HiOutlineFolderOpen />

                            <span>
                                No documents uploaded.
                            </span>

                        </div>

                    ) : (

                        <div className="admin-client-details__list">

                            {documents.map(
                                (document) => (

                                    <div
                                        className="admin-client-details__list-item"
                                        key={document._id}
                                    >

                                        <div className="admin-client-details__list-icon">

                                            <HiOutlineFolderOpen />

                                        </div>


                                        <div className="admin-client-details__list-content">

                                            <strong>
                                                {
                                                    document.name ||
                                                    document.originalFileName ||
                                                    document.documentType ||
                                                    document.type ||
                                                    "Document"
                                                }
                                            </strong>

                                            <span>
                                                {formatLabel(
                                                    document.status
                                                )}
                                            </span>

                                        </div>


                                        <span className="admin-client-details__list-date">

                                            {formatDate(
                                                document.createdAt
                                            )}

                                        </span>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </section>


                {/* =====================================================
                    NOTIFICATIONS
                ===================================================== */}

                <section className="admin-client-details__card admin-client-details__notifications">

                    <div className="admin-client-details__card-header">

                        <div>

                            <span>
                                COMMUNICATION
                            </span>

                            <h2>
                                Recent Notifications
                            </h2>

                        </div>

                    </div>


                    {notifications.length === 0 ? (

                        <div className="admin-client-details__empty">

                            <HiOutlineBell />

                            <span>
                                No recent notifications.
                            </span>

                        </div>

                    ) : (

                        <div className="admin-client-details__list">

                            {notifications.map(
                                (notification) => (

                                    <div
                                        className="admin-client-details__list-item"
                                        key={notification._id}
                                    >

                                        <div className="admin-client-details__list-icon">

                                            <HiOutlineBell />

                                        </div>


                                        <div className="admin-client-details__list-content">

                                            <strong>
                                                {
                                                    notification.title ||
                                                    "Notification"
                                                }
                                            </strong>

                                            <span>
                                                {
                                                    notification.message ||
                                                    "—"
                                                }
                                            </span>

                                        </div>


                                        <span className="admin-client-details__list-date">

                                            {formatDate(
                                                notification.createdAt
                                            )}

                                        </span>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </section>


            </div>

        </section>

    );
};


export default AdminClientDetails;