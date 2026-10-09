
import {
    useEffect,
    useState,
} from "react";

import {
    Link,
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    HiOutlineArrowLeft,
} from "react-icons/hi";

import applicationService
    from "../../services/application.service";

import documentService
    from "../../services/document.service";

import ApplicationDetailsHeader
    from "../../components/ClientPortal/applications/ApplicationDetails/ApplicationDetailsHeader/ApplicationDetailsHeader";

import ApplicationActionPanel
    from "../../components/ClientPortal/applications/ApplicationDetails/ApplicationActionPanel/ApplicationActionPanel";

import ApplicationAtAGlance
    from "../../components/ClientPortal/applications/ApplicationDetails/ApplicationAtAGlance/ApplicationAtAGlance";

import ApplicationInsight
    from "../../components/ClientPortal/applications/ApplicationDetails/ApplicationInsight/ApplicationInsight";

import ApplicationJourney
    from "../../components/ClientPortal/applications/ApplicationDetails/ApplicationJourney/ApplicationJourney";

import ApplicationStageCard
    from "../../components/ClientPortal/applications/ApplicationDetails/ApplicationStageCard/ApplicationStageCard";

import ApplicationPayment
    from "../../components/ClientPortal/applications/ApplicationDetails/ApplicationPayment/ApplicationPayment";

import ApplicationCompletion
    from "../../components/ClientPortal/applications/ApplicationDetails/ApplicationCompletion/ApplicationCompletion";

import ApplicationInformation
    from "../../components/ClientPortal/applications/ApplicationDetails/ApplicationInformation/ApplicationInformation";

import OpportunityOverview
    from "../../components/ClientPortal/applications/ApplicationDetails/OpportunityOverview/OpportunityOverview";

import ApplicationQuestions
    from "../../components/ClientPortal/applications/ApplicationDetails/ApplicationQuestions/ApplicationQuestions";

import ApplicationActivity
    from "../../components/ClientPortal/applications/ApplicationDetails/ApplicationActivity/ApplicationActivity";

import "./ApplicationDetails.css";


const ApplicationDetails = () => {

    const {
        id,
    } = useParams();


    const navigate =
        useNavigate();


    /* =========================================================
       APPLICATION STATE
    ========================================================= */

    const [application, setApplication] =
        useState(null);


    /* =========================================================
       APPLICATION DOCUMENT STATE
    ========================================================= */

    const [documents, setDocuments] =
        useState([]);


    const [documentsLoading, setDocumentsLoading] =
        useState(false);


    const [documentError, setDocumentError] =
        useState("");


    /*
     * Stores the ID/key of the document currently
     * being uploaded.
     */

    const [uploadingDocumentId, setUploadingDocumentId] =
        useState(null);


    /* =========================================================
       PAGE STATE
    ========================================================= */

    const [loading, setLoading] =
        useState(true);


    const [error, setError] =
        useState("");


    /* =========================================================
       ACTIVITY REFRESH STATE
    ========================================================= */

    const [refreshingActivity, setRefreshingActivity] =
        useState(false);


    /* =========================================================
       LOAD APPLICATION
    ========================================================= */

    const loadApplication = async () => {

        try {

            const response =
                await applicationService.getApplication(
                    id,
                );


            /*
             * applicationService normally returns
             * data.data.
             *
             * These fallbacks keep this page compatible
             * with wrapped responses.
             */

            const data =
                response?.data?.data ||
                response?.data ||
                response;


            setApplication(data);


            /*
             * PAYMENT DEBUG
             *
             * This confirms whether the application returned
             * by the backend actually contains the payment
             * information required by ApplicationPayment.
             */

            console.log(
                "APPLICATION PAYMENT DATA:",
                {
                    applicationId: data?._id,
                    paymentStatus: data?.paymentStatus,
                    currentPaymentStage:
                        data?.currentPaymentStage,
                    paymentPlan:
                        data?.paymentPlan,
                },
            );


            return data;

        } catch (error) {

            console.error(
                "FAILED TO LOAD APPLICATION DETAILS:",
                error,
            );

            throw error;

        }

    };


    /* =========================================================
       LOAD APPLICATION DOCUMENTS
    ========================================================= */

    const loadDocuments = async () => {

        try {

            setDocumentsLoading(true);

            setDocumentError("");


            /*
             * Load documents belonging ONLY to
             * this application.
             */

            const data =
                await documentService.getApplicationDocuments(
                    id,
                );


            setDocuments(
                Array.isArray(data)
                    ? data
                    : [],
            );

        } catch (error) {

            console.error(
                "FAILED TO LOAD APPLICATION DOCUMENTS:",
                error,
            );


            setDocumentError(
                error?.response?.data?.message ||
                "Unable to load application documents.",
            );


            setDocuments([]);

        } finally {

            setDocumentsLoading(false);

        }

    };


    /* =========================================================
       REFRESH APPLICATION
    ========================================================= */

    const refreshApplication = async () => {

        if (!id) {
            return;
        }


        try {

            setRefreshingActivity(true);


            /*
             * Refresh application and documents together.
             */

            await Promise.all([
                loadApplication(),
                loadDocuments(),
            ]);

        } catch (error) {

            console.error(
                "FAILED TO REFRESH APPLICATION:",
                error,
            );

        } finally {

            setRefreshingActivity(false);

        }

    };


    /* =========================================================
       INITIAL LOAD
    ========================================================= */

    useEffect(() => {

        if (!id) {

            setError(
                "No application was specified.",
            );

            setLoading(false);

            return;

        }


        const initializePage = async () => {

            try {

                setLoading(true);

                setError("");


                /*
                 * Load application first.
                 */

                await loadApplication();


                /*
                 * Then load application-specific documents.
                 */

                await loadDocuments();

            } catch (error) {

                console.error(
                    "FAILED TO INITIALIZE APPLICATION:",
                    error,
                );


                setError(
                    error?.response?.data?.message ||
                    "Unable to load this application.",
                );

            } finally {

                setLoading(false);

            }

        };


        initializePage();

    }, [id]);


    /* =========================================================
       APPLICATION UPDATE
    ========================================================= */

    const handleApplicationUpdate = (
        updates,
    ) => {

        setApplication((current) => {

            if (!current) {

                return current;

            }


            return {
                ...current,
                ...updates,
            };

        });

    };


    /* =========================================================
       APPLICATION PAYMENT STARTED
    ========================================================= */

    const handleApplicationPaymentStarted = (
        paymentResult,
    ) => {

        console.log(
            "APPLICATION PAYMENT STARTED:",
            paymentResult,
        );

    };


    /* =========================================================
       APPLICATION ACTION
    ========================================================= */

    const handleApplicationAction = (
        action,
    ) => {

        /* -----------------------------------------------------
           DOCUMENT ACTION
        ----------------------------------------------------- */

        if (action === "documents") {

            const completionElement =
                document.getElementById(
                    "application-completion",
                );


            if (completionElement) {

                completionElement.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });

            }

            return;

        }


        /* -----------------------------------------------------
           APPLICATION ACTION
        ----------------------------------------------------- */

        if (action === "application") {

            const completionElement =
                document.getElementById(
                    "application-completion",
                );


            if (completionElement) {

                completionElement.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });

            }

            return;

        }


        /* -----------------------------------------------------
           ACTIVITY ACTION
        ----------------------------------------------------- */

        if (action === "activity") {

            const activityElement =
                document.querySelector(
                    ".application-activity",
                );


            if (activityElement) {

                activityElement.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });

            }

            return;

        }

    };


    /* =========================================================
       UPLOAD APPLICATION DOCUMENT
    ========================================================= */

    const handleDocumentUpload = async (
        requiredDocument,
        file,
    ) => {

        if (!file || !id) {

            return;

        }


        /*
         * Every required document receives an internal
         * identifier from ApplicationCompletion.
         */

        const documentId =
            requiredDocument?.id ||
            requiredDocument?._id ||
            requiredDocument?.key ||
            requiredDocument?.name;


        if (!documentId) {

            setDocumentError(
                "Unable to identify this document requirement.",
            );

            return;

        }


        try {

            setUploadingDocumentId(
                documentId,
            );

            setDocumentError("");


            const documentName =
                requiredDocument?.name ||
                requiredDocument?.title ||
                requiredDocument?.label ||
                requiredDocument?.documentName ||
                "Required document";


            const documentType =
                requiredDocument?.type ||
                requiredDocument?.documentType ||
                "OTHER";


            /* =================================================
               BUILD MULTIPART REQUEST
            ================================================= */

            const formData =
                new FormData();


            formData.append(
                "file",
                file,
            );


            formData.append(
                "application",
                id,
            );


            formData.append(
                "name",
                documentName,
            );


            formData.append(
                "type",
                documentType,
            );


            console.log(
                "UPLOADING APPLICATION DOCUMENT:",
                {
                    applicationId: id,
                    documentId,
                    name: documentName,
                    type: documentType,
                    fileName: file.name,
                    fileType: file.type,
                    fileSize: file.size,
                },
            );


            /* =================================================
               UPLOAD
            ================================================= */

            await documentService.createDocument(
                formData,
            );


            /*
             * Refresh documents immediately after upload.
             */

            await loadDocuments();


            /*
             * Refresh application activity/state.
             */

            await loadApplication();

        } catch (error) {

            console.error(
                "FAILED TO UPLOAD DOCUMENT:",
                error,
            );


            setDocumentError(
                error?.response?.data?.message ||
                "Unable to upload this document. Please try again.",
            );

        } finally {

            setUploadingDocumentId(
                null,
            );

        }

    };


    /* =========================================================
       VIEW DOCUMENT
    ========================================================= */

    const handleDocumentView = (
        document,
    ) => {

        if (!document?._id) {

            setDocumentError(
                "Unable to open this document.",
            );

            return;

        }


        navigate(
            `/portal/documents/${document._id}/view`,
        );

    };


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

                    <div
                        className="
                            application-details-state
                            application-details-state-error
                        "
                    >

                        <div className="application-details-state-icon">
                            !
                        </div>


                        <h2>
                            Application unavailable
                        </h2>


                        <p>
                            {error ||
                                "We could not find this application."
                            }
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

            <div className="application-details-background" />

            <div className="application-details-container">


                {/* =================================================
                    APPLICATION HEADER
                ================================================= */}

                <ApplicationDetailsHeader
                    application={
                        application
                    }
                />


                {/* =================================================
                    IMMEDIATE ACTION
                ================================================= */}

                <ApplicationActionPanel
                    application={
                        application
                    }

                    documents={
                        documents
                    }

                    onAction={
                        handleApplicationAction
                    }
                />


                {/* =================================================
                    APPLICATION AT A GLANCE
                ================================================= */}

                <ApplicationAtAGlance
                    application={
                        application
                    }

                    documents={
                        documents
                    }
                />


                {/* =================================================
                    CLIENT INSIGHT
                ================================================= */}

                <ApplicationInsight
                    application={
                        application
                    }
                />


                {/* =================================================
                    APPLICATION JOURNEY
                ================================================= */}

                <ApplicationJourney
                    application={
                        application
                    }
                />


                {/* =================================================
                    CURRENT STAGE
                ================================================= */}

                <ApplicationStageCard
                    application={
                        application
                    }
                />


                {/* =================================================
                    APPLICATION PAYMENT
                ================================================= */}

                <ApplicationPayment
                    application={
                        application
                    }

                    onPaymentStarted={
                        handleApplicationPaymentStarted
                    }
                />


                {/* =================================================
                    APPLICATION COMPLETION
                ================================================= */}

                <ApplicationCompletion

                    id="application-completion"

                    application={
                        application
                    }

                    onApplicationUpdate={
                        handleApplicationUpdate
                    }

                    documents={
                        documents
                    }

                    documentsLoading={
                        documentsLoading
                    }

                    documentError={
                        documentError
                    }

                    uploadingDocumentId={
                        uploadingDocumentId
                    }

                    onUpload={
                        handleDocumentUpload
                    }

                    onView={
                        handleDocumentView
                    }

                />


                {/* =================================================
                    MAIN CONTENT
                ================================================= */}

                <div className="application-details-layout">

                    <div className="application-details-primary">

                        <ApplicationInformation
                            application={
                                application
                            }
                        />


                        <OpportunityOverview
                            application={
                                application
                            }
                        />


                        <ApplicationQuestions
                            application={
                                application
                            }
                        />

                    </div>


                    <aside className="application-details-sidebar">

                        <ApplicationActivity

                            application={
                                application
                            }

                            onRefresh={
                                refreshApplication
                            }

                            refreshing={
                                refreshingActivity
                            }

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