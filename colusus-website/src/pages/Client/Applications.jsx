import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
    HiOutlineArrowRight,
    HiOutlineCalendar,
    HiOutlineDocumentText,
    HiOutlineLocationMarker,
    HiOutlinePlus,
} from "react-icons/hi";

import applicationService from "../../services/application.service";

import "./Applications.css";


/*
============================================================
FORMAT APPLICATION TYPE
============================================================
*/

const formatType = (type) => {

    if (!type) {
        return "Migration Application";
    }

    return type
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(/\b\w/g, (letter) =>
            letter.toUpperCase()
        );

};


/*
============================================================
FORMAT APPLICATION STATUS
============================================================
*/

const formatStatus = (status) => {

    if (!status) {
        return "Unknown";
    }

    return status
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(/\b\w/g, (letter) =>
            letter.toUpperCase()
        );

};


/*
============================================================
FORMAT DATE
============================================================
*/

const formatDate = (date) => {

    if (!date) {
        return "—";
    }

    return new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(new Date(date));

};


/*
============================================================
APPLICATION CENTER
============================================================
*/

const Applications = () => {

    const [applications, setApplications] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    /*
    ========================================================
    LOAD APPLICATIONS
    ========================================================
    */

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


    useEffect(() => {

        loadApplications();

    }, []);


    return (

        <div className="applications-page">


            {/* =================================================
                HEADER
            ================================================= */}

            <section className="applications-header">

                <div>

                    <span className="applications-eyebrow">
                        MIGRATION APPLICATIONS
                    </span>

                    <h1>
                        Your Applications
                    </h1>

                    <p>
                        Start and manage your migration
                        applications from one place.
                    </p>

                </div>


                <Link
                    to="/portal/applications/new"
                    className="applications-primary-button"
                >

                    <HiOutlinePlus />

                    Start Application

                </Link>

            </section>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div className="applications-alert error">

                    {error}

                </div>

            )}


            {/* =================================================
                LOADING
            ================================================= */}

            {loading ? (

                <div className="applications-loading">

                    <div className="applications-spinner" />

                    <p>
                        Loading your applications...
                    </p>

                </div>

            ) : applications.length === 0 ? (

                /* =================================================
                   EMPTY STATE
                ================================================= */

                <section className="applications-empty">

                    <div className="applications-empty-icon">

                        <HiOutlineDocumentText />

                    </div>


                    <h2>
                        No applications yet
                    </h2>


                    <p>
                        Start your migration journey by
                        choosing an application from the
                        opportunities available to you.
                    </p>


                    <Link
                        to="/portal/applications/new"
                        className="applications-primary-button"
                    >

                        <HiOutlinePlus />

                        Start Your First Application

                    </Link>

                </section>

            ) : (

                /* =================================================
                   APPLICATION LIST
                ================================================= */

                <section className="applications-list">

                    {applications.map(
                        (application) => (

                            <article
                                key={application._id}
                                className="application-card"
                            >


                                {/* =================================
                                    APPLICATION INFORMATION
                                ================================= */}

                                <div className="application-card-main">

                                    <div className="application-card-icon">

                                        <HiOutlineDocumentText />

                                    </div>


                                    <div>

                                        <span className="application-card-type">

                                            {formatType(
                                                application.type
                                            )}

                                        </span>


                                        <h2>
                                            {application.destinationCountry}
                                        </h2>


                                        <div className="application-card-meta">

                                            <span>

                                                <HiOutlineLocationMarker />

                                                {
                                                    application.destinationCountry
                                                }

                                            </span>


                                            <span>

                                                <HiOutlineCalendar />

                                                {formatDate(
                                                    application.createdAt
                                                )}

                                            </span>

                                        </div>

                                    </div>

                                </div>


                                {/* =================================
                                    STATUS / DETAILS
                                ================================= */}

                                <div className="application-card-side">

                                    <span
                                        className={`application-card-status status-${application.status?.toLowerCase()}`}
                                    >

                                        {formatStatus(
                                            application.status
                                        )}

                                    </span>


                                    <Link
                                        to={`/portal/applications/${application._id}`}
                                        className="application-view-link"
                                    >

                                        View Details

                                        <HiOutlineArrowRight />

                                    </Link>

                                </div>

                            </article>

                        )
                    )}

                </section>

            )}

        </div>

    );

};


export default Applications;