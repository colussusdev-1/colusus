import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
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
|
| Existing working document module.
|
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
| Structure:
|
|   Back
|
|   Application Header
|
|   Application Tabs
|
|   Overview
|       ├── Overall Progress
|       ├── Application Information
|       └── Assigned Staff
|
|   Documents
|       └── Application Documents
|
|   Timeline
|       └── Application Activity
|
|   Notes
|       └── Internal Application Notes
|
|--------------------------------------------------------------------------
*/

const AdminApplicationDetails = () => {

  const navigate = useNavigate();

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
  | LOAD APPLICATION
  |--------------------------------------------------------------------------
  |
  | Used for:
  |
  | - Initial page load
  | - Manual refresh
  | - Status updates
  | - Timeline refresh
  |
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
  |
  | After a status update we reload the complete application.
  |
  | This ensures:
  |
  | - status is fresh
  | - progress is fresh
  | - activity is fresh
  | - timeline is fresh
  |
  |--------------------------------------------------------------------------
  */

  const handleApplicationUpdated = async (
    updatedApplication,
  ) => {

    /*
    ------------------------------------------------------------
    | IMMEDIATE UI UPDATE
    ------------------------------------------------------------
    */

    if (updatedApplication) {

      setApplication(
        updatedApplication,
      );

    }


    /*
    ------------------------------------------------------------
    | REFRESH FROM BACKEND
    ------------------------------------------------------------
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
            onClick={handleBack}
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
          onClick={handleBack}
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
          onClick={handleRefresh}
          disabled={refreshing}
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
          setActiveTab
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