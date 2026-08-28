import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import applicationsService
  from "./applications.service";

import ApplicationsHeader
  from "./components/ApplicationsHeader/ApplicationsHeader";

import ApplicationFilters
  from "./components/ApplicationFilters/ApplicationFilters";

import ApplicationTable
  from "./components/ApplicationTable/ApplicationTable";

import ApplicationPagination
  from "./components/ApplicationPagination/ApplicationPagination";

import "./AdminApplications.css";


const ITEMS_PER_PAGE = 7;


/*
|--------------------------------------------------------------------------
| APPLICATION REFERENCE
|--------------------------------------------------------------------------
|
| The backend may eventually provide:
|
|   applicationNumber
|
| Until then we create a stable readable reference from
| the application's position in the complete backend result.
|
| Example:
|
|   Application 1
|   Application 2
|   Application 3
|
| IMPORTANT:
|
| We do this BEFORE filtering/pagination so the reference
| does not change when the admin searches or filters.
|
|--------------------------------------------------------------------------
*/

const createApplicationReference = (
  application,
  index,
) => {

  /*
  |--------------------------------------------------------------------------
  | FUTURE BACKEND APPLICATION NUMBER
  |--------------------------------------------------------------------------
  */

  if (
    application?.applicationNumber
  ) {

    return application.applicationNumber;

  }


  /*
  |--------------------------------------------------------------------------
  | TEMPORARY FRONTEND REFERENCE
  |--------------------------------------------------------------------------
  */

  return `Application ${index + 1}`;

};


/*
|--------------------------------------------------------------------------
| ADMIN APPLICATIONS
|--------------------------------------------------------------------------
*/

const AdminApplications = () => {

  const navigate = useNavigate();


  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();


  /*
  |--------------------------------------------------------------------------
  | APPLICATION DATA
  |--------------------------------------------------------------------------
  */

  const [
    applications,
    setApplications,
  ] = useState([]);


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
  | ERROR
  |--------------------------------------------------------------------------
  */

  const [
    error,
    setError,
  ] = useState("");


  /*
  |--------------------------------------------------------------------------
  | SEARCH
  |--------------------------------------------------------------------------
  */

  const [
    search,
    setSearch,
  ] = useState("");


  /*
  |--------------------------------------------------------------------------
  | STAGE FILTER
  |--------------------------------------------------------------------------
  */

  const [
    stage,
    setStage,
  ] = useState("ALL");


  /*
  |--------------------------------------------------------------------------
  | STATUS FILTER
  |--------------------------------------------------------------------------
  */

  const [
    status,
    setStatus,
  ] = useState(
    searchParams.get("status") ||
    "ALL",
  );


  /*
  |--------------------------------------------------------------------------
  | PAGINATION
  |--------------------------------------------------------------------------
  */

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);


  /*
  |--------------------------------------------------------------------------
  | LOAD APPLICATIONS
  |--------------------------------------------------------------------------
  */

  const loadApplications = useCallback(
    async () => {

      try {

        setLoading(true);

        setError("");


        /*
        --------------------------------------------------------------
        | REQUEST
        --------------------------------------------------------------
        */

        const response =
          await applicationsService
            .getAllApplications();


        /*
        --------------------------------------------------------------
        | NORMALIZE RESPONSE
        --------------------------------------------------------------
        |
        | Expected:
        |
        | {
        |   success: true,
        |   data: [...]
        | }
        |
        --------------------------------------------------------------
        */

        const fetchedApplications =
          Array.isArray(
            response?.data,
          )
            ? response.data
            : [];


        /*
        --------------------------------------------------------------
        | ADD READABLE APPLICATION REFERENCE
        --------------------------------------------------------------
        |
        | This is temporary until the backend exposes
        | applicationNumber.
        |
        --------------------------------------------------------------
        */

        const normalizedApplications =
          fetchedApplications.map(
            (
              application,
              index,
            ) => {

              return {

                ...application,

                applicationReference:
                  createApplicationReference(
                    application,
                    index,
                  ),

              };

            },
          );


        /*
        --------------------------------------------------------------
        | SAVE
        --------------------------------------------------------------
        */

        setApplications(
          normalizedApplications,
        );

      } catch (
      requestError
      ) {

        console.error(
          "FAILED TO LOAD APPLICATIONS:",
          requestError,
        );


        setError(
          requestError
            ?.response
            ?.data
            ?.message ||
          "Unable to load applications.",
        );

      } finally {

        setLoading(false);

      }

    },
    [],
  );


  /*
  |--------------------------------------------------------------------------
  | INITIAL LOAD
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    loadApplications();

  }, [
    loadApplications,
  ]);


  /*
  |--------------------------------------------------------------------------
  | SYNC STATUS WITH URL
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    const urlStatus =
      searchParams.get("status");


    setStatus(
      urlStatus ||
      "ALL",
    );


    setCurrentPage(1);

  }, [
    searchParams,
  ]);


  /*
  |--------------------------------------------------------------------------
  | BUILD AVAILABLE STAGES
  |--------------------------------------------------------------------------
  */

  const stages = useMemo(() => {

    const values =
      applications
        .map(
          (application) =>
            application?.currentStep,
        )
        .filter(Boolean);


    return [
      ...new Set(values),
    ];

  }, [
    applications,
  ]);


  /*
  |--------------------------------------------------------------------------
  | FILTER APPLICATIONS
  |--------------------------------------------------------------------------
  */

  const filteredApplications =
    useMemo(() => {

      const normalizedSearch =
        search
          .trim()
          .toLowerCase();


      return applications.filter(
        (application) => {

          /*
          ------------------------------------------------------------
          | CLIENT
          ------------------------------------------------------------
          */

          const clientName =
            application?.user?.name ||
            "";


          const clientEmail =
            application?.user?.email ||
            "";


          /*
          ------------------------------------------------------------
          | COUNTRY
          ------------------------------------------------------------
          */

          const country =
            application?.destinationCountry ||
            "";


          /*
          ------------------------------------------------------------
          | INTERNAL ID
          ------------------------------------------------------------
          */

          const applicationId =
            application?._id ||
            "";


          /*
          ------------------------------------------------------------
          | READABLE REFERENCE
          ------------------------------------------------------------
          */

          const applicationReference =
            application
              ?.applicationReference ||
            "";


          /*
          ------------------------------------------------------------
          | SEARCH MATCH
          ------------------------------------------------------------
          */

          const matchesSearch =
            !normalizedSearch ||

            clientName
              .toLowerCase()
              .includes(
                normalizedSearch,
              ) ||

            clientEmail
              .toLowerCase()
              .includes(
                normalizedSearch,
              ) ||

            country
              .toLowerCase()
              .includes(
                normalizedSearch,
              ) ||

            applicationId
              .toLowerCase()
              .includes(
                normalizedSearch,
              ) ||

            applicationReference
              .toLowerCase()
              .includes(
                normalizedSearch,
              );


          /*
          ------------------------------------------------------------
          | STAGE MATCH
          ------------------------------------------------------------
          */

          const matchesStage =
            stage === "ALL" ||
            application?.currentStep ===
            stage;


          /*
          ------------------------------------------------------------
          | STATUS MATCH
          ------------------------------------------------------------
          */

          const matchesStatus =
            status === "ALL" ||
            application?.status ===
            status;


          /*
          ------------------------------------------------------------
          | FINAL MATCH
          ------------------------------------------------------------
          */

          return (
            matchesSearch &&
            matchesStage &&
            matchesStatus
          );

        },
      );

    }, [
      applications,
      search,
      stage,
      status,
    ]);


  /*
  |--------------------------------------------------------------------------
  | TOTAL PAGES
  |--------------------------------------------------------------------------
  */

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredApplications.length /
        ITEMS_PER_PAGE,
      ),
    );


  /*
  |--------------------------------------------------------------------------
  | PAGINATED APPLICATIONS
  |--------------------------------------------------------------------------
  */

  const paginatedApplications =
    useMemo(() => {

      const start =
        (
          currentPage - 1
        ) *
        ITEMS_PER_PAGE;


      return filteredApplications.slice(
        start,
        start +
        ITEMS_PER_PAGE,
      );

    }, [
      filteredApplications,
      currentPage,
    ]);


  /*
  |--------------------------------------------------------------------------
  | RESET PAGE WHEN FILTERS CHANGE
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    setCurrentPage(1);

  }, [
    search,
    stage,
    status,
  ]);


  /*
  |--------------------------------------------------------------------------
  | STATUS CHANGE
  |--------------------------------------------------------------------------
  */

  const handleStatusChange = (
    value,
  ) => {

    setStatus(value);

    setCurrentPage(1);


    /*
    --------------------------------------------------------------
    | CLEAR URL STATUS
    --------------------------------------------------------------
    */

    if (
      value === "ALL"
    ) {

      setSearchParams({});

      return;

    }


    /*
    --------------------------------------------------------------
    | STORE STATUS IN URL
    --------------------------------------------------------------
    */

    setSearchParams({
      status: value,
    });

  };


  /*
  |--------------------------------------------------------------------------
  | OPEN APPLICATION
  |--------------------------------------------------------------------------
  */

  const handleApplicationClick = (
    applicationId,
  ) => {

    if (!applicationId) {
      return;
    }


    navigate(
      `/admin/applications/${applicationId}`,
    );

  };


  /*
  |--------------------------------------------------------------------------
  | PAGE CHANGE
  |--------------------------------------------------------------------------
  */

  const handlePageChange = (
    page,
  ) => {

    if (
      page < 1 ||
      page > totalPages
    ) {

      return;

    }


    setCurrentPage(page);


    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };


  /*
  |--------------------------------------------------------------------------
  | CLEAR FILTERS
  |--------------------------------------------------------------------------
  */

  const handleClearFilters = () => {

    setSearch("");

    setStage("ALL");

    setStatus("ALL");

    setCurrentPage(1);

    setSearchParams({});

  };


  /*
  |--------------------------------------------------------------------------
  | RETRY
  |--------------------------------------------------------------------------
  */

  const handleRetry = () => {

    loadApplications();

  };


  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  */

  if (loading) {

    return (

      <main
        className="
          adminApplicationsState
        "
      >

        <div
          className="
            adminApplicationsState__spinner
          "
        />

        <p>
          Loading applications...
        </p>

      </main>

    );

  }


  /*
  |--------------------------------------------------------------------------
  | ERROR
  |--------------------------------------------------------------------------
  */

  if (error) {

    return (

      <main
        className="
          adminApplicationsState
          adminApplicationsState--error
        "
      >

        <div
          className="
            adminApplicationsState__content
          "
        >

          <span>
            APPLICATIONS
          </span>


          <h2>
            Unable to load applications
          </h2>


          <p>
            {error}
          </p>


          <button
            type="button"
            onClick={handleRetry}
          >
            Try again
          </button>

        </div>

      </main>

    );

  }


  /*
  |--------------------------------------------------------------------------
  | RESULT INFORMATION
  |--------------------------------------------------------------------------
  */

  const totalResults =
    filteredApplications.length;


  const startResult =
    totalResults === 0
      ? 0
      : (
        (
          currentPage - 1
        ) *
        ITEMS_PER_PAGE
      ) + 1;


  const endResult =
    Math.min(
      currentPage *
      ITEMS_PER_PAGE,
      totalResults,
    );


  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (

    <main
      className="
        adminApplications
      "
    >


      {/* =========================================================
          HEADER
      ========================================================= */}

      <ApplicationsHeader
        total={
          applications.length
        }
      />


      {/* =========================================================
          FILTERS
      ========================================================= */}

      <ApplicationFilters

        search={
          search
        }

        onSearchChange={
          setSearch
        }


        stage={
          stage
        }

        stages={
          stages
        }

        onStageChange={
          setStage
        }


        status={
          status
        }

        onStatusChange={
          handleStatusChange
        }


        onClear={
          handleClearFilters
        }


        hasActiveFilters={
          Boolean(
            search ||
            stage !== "ALL" ||
            status !== "ALL",
          )
        }

      />


      {/* =========================================================
          APPLICATION TABLE
      ========================================================= */}

      <section
        className="
          adminApplications__tablePanel
        "
      >

        <ApplicationTable

          applications={
            paginatedApplications
          }

          onApplicationClick={
            handleApplicationClick
          }

        />


        {/* =======================================================
            PAGINATION
        ======================================================= */}

        <ApplicationPagination

          currentPage={
            currentPage
          }

          totalPages={
            totalPages
          }

          totalResults={
            totalResults
          }

          startResult={
            startResult
          }

          endResult={
            endResult
          }

          onPageChange={
            handlePageChange
          }

        />

      </section>

    </main>

  );

};


export default AdminApplications;