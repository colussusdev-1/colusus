import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { HiOutlineArrowLeft } from "react-icons/hi";

import applicationService from "../../services/application.service";

import ApplicationDetailsHeader from "../../components/ClientPortal/applications/ApplicationDetails/ApplicationDetailsHeader/ApplicationDetailsHeader";

import ApplicationJourney from "../../components/ClientPortal/applications/ApplicationDetails/ApplicationJourney/ApplicationJourney";

import ApplicationStageCard from "../../components/ClientPortal/applications/ApplicationDetails/ApplicationStageCard/ApplicationStageCard";

import ApplicationDocuments from "../../components/ClientPortal/applications/ApplicationDetails/ApplicationDocuments/ApplicationDocuments";

import ApplicationInformation from "../../components/ClientPortal/applications/ApplicationDetails/ApplicationInformation/ApplicationInformation";

import OpportunityOverview from "../../components/ClientPortal/applications/ApplicationDetails/OpportunityOverview/OpportunityOverview";

import ApplicationQuestions from "../../components/ClientPortal/applications/ApplicationDetails/ApplicationQuestions/ApplicationQuestions";

import ApplicationActivity from "../../components/ClientPortal/applications/ApplicationDetails/ApplicationActivity/ApplicationActivity";

import "./ApplicationDetails.css";


const ApplicationDetails = () => {
    const { id } = useParams();

    const [application, setApplication] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    /* =========================================================
       LOAD APPLICATION
    ========================================================= */

    const loadApplication = async () => {
        try {
            setLoading(true);

            setError("");

            const response =
                await applicationService.getApplication(id);

            /*
             * Supports:
             *
             * { success: true, data: application }
             *
             * and services that already return
             * the application directly.
             */

            const data =
                response?.data?.data ||
                response?.data ||
                response;

            setApplication(data);

        } catch (error) {

            console.error(
                "FAILED TO LOAD APPLICATION DETAILS:",
                error
            );

            setError(
                error?.response?.data?.message ||
                "Unable to load this application."
            );

        } finally {

            setLoading(false);

        }
    };


    /* =========================================================
       LOAD ON PAGE OPEN
    ========================================================= */

    useEffect(() => {

        if (!id) {

            setError(
                "No application was specified."
            );

            setLoading(false);

            return;
        }

        loadApplication();

    }, [id]);


    /* =========================================================
       LOADING STATE
    ========================================================= */

    if (loading) {

        return (
            <main className="application-details-page">

                <div className="application-details-container">

                    <div className="application-details-state">

                        <div className="application-details-spinner" />

                        <h2>
                            Loading application
                        </h2>

                        <p>
                            Preparing your application details...
                        </p>

                    </div>

                </div>

            </main>
        );
    }


    /* =========================================================
       ERROR STATE
    ========================================================= */

    if (error || !application) {

        return (
            <main className="application-details-page">

                <div className="application-details-container">

                    <div className="application-details-state application-details-state-error">

                        <div className="application-details-state-icon">
                            !
                        </div>

                        <h2>
                            Application unavailable
                        </h2>

                        <p>
                            {error ||
                                "We could not find this application."}
                        </p>

                        <Link
                            to="/portal/applications"
                            className="application-details-back-button"
                        >

                            <HiOutlineArrowLeft />

                            Back to applications

                        </Link>

                    </div>

                </div>

            </main>
        );
    }


    /* =========================================================
       PAGE
    ========================================================= */

    return (
        <main className="application-details-page">

            {/* =====================================================
                BACKGROUND
            ===================================================== */}

            <div className="application-details-background" />


            {/* =====================================================
                PAGE CONTAINER
            ===================================================== */}

            <div className="application-details-container">


                {/* =================================================
                    APPLICATION HEADER

                    Header now owns the back navigation.
                ================================================= */}

                <ApplicationDetailsHeader
                    application={application}
                />


                {/* =================================================
                    APPLICATION JOURNEY
                ================================================= */}

                <ApplicationJourney
                    application={application}
                />


                {/* =================================================
                    CURRENT STAGE
                ================================================= */}

                <ApplicationStageCard
                    application={application}
                />


                {/* =================================================
                    MAIN CONTENT
                ================================================= */}

                <div className="application-details-layout">


                    {/* =============================================
                        PRIMARY CONTENT
                    ============================================= */}

                    <div className="application-details-primary">

                        <ApplicationDocuments
                            application={application}
                        />

                        <ApplicationInformation
                            application={application}
                        />

                        <OpportunityOverview
                            application={application}
                        />

                        <ApplicationQuestions
                            application={application}
                        />

                    </div>


                    {/* =============================================
                        ACTIVITY
                    ============================================= */}

                    <aside className="application-details-sidebar">

                        <ApplicationActivity
                            application={application}
                        />

                    </aside>

                </div>


                {/* =================================================
                    FOOTER
                ================================================= */}

                <div className="application-details-footer">

                    <Link
                        to="/portal/applications"
                        className="application-details-footer-link"
                    >

                        <HiOutlineArrowLeft />

                        Back to all applications

                    </Link>

                </div>

            </div>

        </main>
    );
};


export default ApplicationDetails;