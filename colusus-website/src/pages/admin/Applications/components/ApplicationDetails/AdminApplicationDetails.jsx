import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  HiOutlineArrowLeft,
  HiOutlineRefresh,
} from "react-icons/hi";

import adminApplicationsService
  from "../../applications.service";


/*
|--------------------------------------------------------------------------
| APPLICATION HEADER
|--------------------------------------------------------------------------
*/

import ApplicationDetailsHeader
  from "./components/ApplicationDetailsHeader/ApplicationDetailsHeader";


/*
|--------------------------------------------------------------------------
| APPLICATION TABS
|--------------------------------------------------------------------------
*/

import ApplicationTabs
  from "./components/ApplicationTabs/ApplicationTabs";


/*
|--------------------------------------------------------------------------
| OVERALL PROGRESS
|--------------------------------------------------------------------------
*/

import ApplicationProgress
  from "./components/OverallProgress/OverallProgress";


/*
|--------------------------------------------------------------------------
| APPLICATION INFORMATION
|--------------------------------------------------------------------------
*/

import ApplicationInformation
  from "./components/ApplicationInformation/ApplicationInformation";


/*
|--------------------------------------------------------------------------
| ASSIGNED STAFF
|--------------------------------------------------------------------------
*/

import AssignedStaff
  from "./components/AssignedStaff/AssignedStaff";


/*
|--------------------------------------------------------------------------
| APPLICATION ACTIONS
|--------------------------------------------------------------------------
*/

import ApplicationActions
  from "./components/ApplicationActions/ApplicationActions";


/*
|--------------------------------------------------------------------------
| APPLICATION DOCUMENTS
|--------------------------------------------------------------------------
*/

import ApplicationDocuments
  from "../ApplicationDocuments/ApplicationDocuments";


/*
|--------------------------------------------------------------------------
| APPLICATION TIMELINE
|--------------------------------------------------------------------------
*/

import ApplicationTimeline
  from "./components/ApplicationTimeline/ApplicationTimeline";


/*
|--------------------------------------------------------------------------
| APPLICATION NOTES
|--------------------------------------------------------------------------
*/

import ApplicationNotes
  from "./components/ApplicationNotes/ApplicationNotes";


/*
|--------------------------------------------------------------------------
| STYLES
|--------------------------------------------------------------------------
*/

import "./AdminApplicationDetails.css";


/*
|--------------------------------------------------------------------------
| ADMIN APPLICATION DETAILS
|--------------------------------------------------------------------------
|
| Main operational page for a single application.
|
| Supports notification-driven navigation.
|
| Example:
|
| Notification
|     ↓
| Application Details
|     ↓
| Documents tab
|     ↓
| Specific document
|     ↓
| Existing document previewer
|
|--------------------------------------------------------------------------
*/

const AdminApplicationDetails = () => {

  const navigate = useNavigate();

  const location = useLocation();

  const {
    id,
  } = useParams();


  /*
  |--------------------------------------------------------------------------
  | APPLICATION
  |--------------------------------------------------------------------------
  */

  const [
    application,
    setApplication,
  ] = useState(null);


  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  */

  const [
    loading,
    setLoading,
  ] = useState(true);


  /*
  |--------------------------------------------------------------------------
  | REFRESHING
  |--------------------------------------------------------------------------
  */

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);


  /*
  |--------------------------------------------------------------------------
  | ERROR
  |--------------------------------------------------------------------------
  */

  const [
    error,
    setError,
  ] = useState("");


  /*
  |--------------------------------------------------------------------------
  | ACTIVE TAB
  |--------------------------------------------------------------------------
  */

  const [
    activeTab,
    setActiveTab,
  ] = useState("overview");


  /*
  |--------------------------------------------------------------------------
  | NOTIFICATION DOCUMENT TARGET
  |--------------------------------------------------------------------------
  |
  | When this page is opened from a document notification:
  |
  | {
  |   openDocuments: true,
  |   documentId: "..."
  | }
  |
  | We pass the document ID into ApplicationDocuments.
  |
  |--------------------------------------------------------------------------
  */

  const [
    notificationDocumentId,
    setNotificationDocumentId,
  ] = useState(null);


  /*
  |--------------------------------------------------------------------------
  | NOTIFICATION NAVIGATION STATE
  |--------------------------------------------------------------------------
  */

  const [
    openedFromNotification,
    setOpenedFromNotification,
  ] = useState(false);


  /*
  |--------------------------------------------------------------------------
  | READ ROUTER STATE
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    const navigationState =
      location?.state || {};


    /*
    ------------------------------------------------------------------------
    | DOCUMENT NOTIFICATION
    ------------------------------------------------------------------------
    */

    if (
      navigationState.openDocuments
    ) {

      setActiveTab(
        "documents",
      );

      setOpenedFromNotification(
        true,
      );

    } else {

      setOpenedFromNotification(
        false,
      );

    }


    /*
    ------------------------------------------------------------------------
    | DOCUMENT ID
    ------------------------------------------------------------------------
    */

    if (
      navigationState.documentId
    ) {

      setNotificationDocumentId(
        navigationState.documentId,
      );

    } else {

      setNotificationDocumentId(
        null,
      );

    }

  }, [
    location?.state,
  ]);


  /*
  |--------------------------------------------------------------------------
  | LOAD APPLICATION
  |--------------------------------------------------------------------------
  */

  const loadApplication = useCallback(
    async ({
      showLoader = false,
    } = {}) => {

      if (!id) {

        setError(
          "Application ID is missing.",
        );

        setLoading(false);

        return;
      }


      try {

        if (showLoader) {

          setLoading(true);

        } else {

          setRefreshing(true);

        }


        setError("");


        /*
        ------------------------------------------------------------
        | GET APPLICATION
        ------------------------------------------------------------
        */

        const response =
          await adminApplicationsService
            .getApplicationById(id);


        /*
        ------------------------------------------------------------
        | NORMALIZE RESPONSE
        ------------------------------------------------------------
        |
        | Supports:
        |
        | {
        |   success: true,
        |   data: application
        | }
        |
        | and direct application responses.
        |
        ------------------------------------------------------------
        */

        const applicationData =
          response?.data ||
          response;


        if (!applicationData) {

          throw new Error(
            "Application data was not returned.",
          );

        }


        /*
        ------------------------------------------------------------
        | STORE APPLICATION
        ------------------------------------------------------------
        */

        setApplication(
          applicationData,
        );

      } catch (requestError) {

        console.error(
          "FAILED TO LOAD APPLICATION:",
          requestError,
        );


        setError(
          requestError
            ?.response
            ?.data
            ?.message ||
          requestError?.message ||
          "Unable to load application.",
        );

      } finally {

        setLoading(false);

        setRefreshing(false);

      }

    },
    [id],
  );


  /*
  |--------------------------------------------------------------------------
  | INITIAL LOAD
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    loadApplication({
      showLoader: true,
    });

  }, [
    loadApplication,
  ]);


  /*
  |--------------------------------------------------------------------------
  | APPLICATION UPDATED
  |--------------------------------------------------------------------------
  */

  const handleApplicationUpdated = async (
    updatedApplication,
  ) => {

    /*
    ------------------------------------------------------------------------
    | IMMEDIATE UI UPDATE
    ------------------------------------------------------------------------
    */

    if (updatedApplication) {

      setApplication(
        updatedApplication,
      );

    }


    /*
    ------------------------------------------------------------------------
    | REFRESH FROM BACKEND
    ------------------------------------------------------------------------
    */

    await loadApplication();

  };


  /*
  |--------------------------------------------------------------------------
  | BACK
  |--------------------------------------------------------------------------
  */

  const handleBack = () => {

    navigate(
      "/admin/applications",
    );

  };


  /*
  |--------------------------------------------------------------------------
  | MANUAL REFRESH
  |--------------------------------------------------------------------------
  */

  const handleRefresh = async () => {

    await loadApplication();

  };


  /*
  |--------------------------------------------------------------------------
  | TAB CHANGE
  |--------------------------------------------------------------------------
  */

  const handleTabChange = (
    tab,
  ) => {

    setActiveTab(
      tab,
    );


    /*
    ------------------------------------------------------------------------
    | If the admin manually switches away from Documents, we no longer
    | want a stale notification target hanging around.
    |
    ------------------------------------------------------------------------
    */

    if (
      tab !== "documents"
    ) {

      setNotificationDocumentId(
        null,
      );

      setOpenedFromNotification(
        false,
      );

    }

  };


  /*
  |--------------------------------------------------------------------------
  | LOADING STATE
  |--------------------------------------------------------------------------
  */

  if (loading) {

    return (

      <main
        className="
          adminApplicationDetailsState
        "
      >

        <div
          className="
            adminApplicationDetailsState__spinner
          "
        />


        <p>
          Loading application...
        </p>

      </main>

    );

  }


  /*
  |--------------------------------------------------------------------------
  | ERROR STATE
  |--------------------------------------------------------------------------
  */

  if (
    error ||
    !application
  ) {

    return (

      <main
        className="
          adminApplicationDetailsState
        "
      >

        <div
          className="
            adminApplicationDetailsState__error
          "
        >

          <span>
            APPLICATION
          </span>


          <h2>
            Unable to load application
          </h2>


          <p>
            {error ||
              "The requested application could not be found."}
          </p>


          <button
            type="button"
            onClick={
              handleBack
            }
          >

            <HiOutlineArrowLeft />

            Back to Applications

          </button>

        </div>

      </main>

    );

  }


  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (

    <main
      className="
        adminApplicationDetails
      "
    >


      {/* =========================================================
          TOP BAR
      ========================================================= */}

      <div
        className="
          adminApplicationDetails__topBar
        "
      >

        <button
          type="button"
          className="
            adminApplicationDetails__back
          "
          onClick={
            handleBack
          }
        >

          <HiOutlineArrowLeft />

          <span>
            Back to Applications
          </span>

        </button>


        {/* =======================================================
            REFRESH
        ======================================================= */}

        <button
          type="button"
          className="
            adminApplicationDetails__refresh
          "
          onClick={
            handleRefresh
          }
          disabled={
            refreshing
          }
          aria-label="Refresh application"
          title="Refresh application"
        >

          <HiOutlineRefresh
            className={
              refreshing
                ? "is-spinning"
                : ""
            }
          />

        </button>

      </div>


      {/* =========================================================
          APPLICATION HEADER
      ========================================================= */}

      <ApplicationDetailsHeader

        application={
          application
        }

        actions={

          <ApplicationActions

            application={
              application
            }

            onUpdated={
              handleApplicationUpdated
            }

          />

        }

      />


      {/* =========================================================
          APPLICATION TABS
      ========================================================= */}

      <ApplicationTabs

        activeTab={
          activeTab
        }

        onChange={
          handleTabChange
        }

      />


      {/* =========================================================
          OVERVIEW
      ========================================================= */}

      {activeTab === "overview" && (

        <div
          className="
            adminApplicationDetails__grid
          "
        >

          {/* =====================================================
              MAIN COLUMN
          ===================================================== */}

          <div
            className="
              adminApplicationDetails__main
            "
          >

            <ApplicationProgress

              application={
                application
              }

            />


            <ApplicationInformation

              application={
                application
              }

            />

          </div>


          {/* =====================================================
              SIDEBAR
          ===================================================== */}

          <aside
            className="
              adminApplicationDetails__sidebar
            "
          >

            <AssignedStaff

              application={
                application
              }

            />

          </aside>

        </div>

      )}


      {/* =========================================================
          DOCUMENTS
      ========================================================= */}

      {activeTab === "documents" && (

        <ApplicationDocuments

          application={
            application
          }

          /*
          --------------------------------------------------------
          | Notification target
          --------------------------------------------------------
          */

          initialDocumentId={
            notificationDocumentId
          }


          /*
          --------------------------------------------------------
          | Automatically open the document when this application
          | was reached from a document notification.
          --------------------------------------------------------
          */

          autoOpenDocument={
            openedFromNotification &&
            Boolean(
              notificationDocumentId,
            )
          }

        />

      )}


      {/* =========================================================
          TIMELINE
      ========================================================= */}

      {activeTab === "timeline" && (

        <ApplicationTimeline

          application={
            application
          }

        />

      )}


      {/* =========================================================
          NOTES
      ========================================================= */}

      {activeTab === "notes" && (

        <ApplicationNotes

          application={
            application
          }

        />

      )}

    </main>

  );

};


export default AdminApplicationDetails;