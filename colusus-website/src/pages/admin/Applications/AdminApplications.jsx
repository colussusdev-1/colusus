
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

import ApplicationPipeline
  from "./components/ApplicationPipeline/ApplicationPipeline";

import "./AdminApplications.css";


const ITEMS_PER_PAGE = 7;


const createApplicationReference = (
  application,
  index,
) => {

  if (application?.applicationNumber) {
    return application.applicationNumber;
  }

  return `Application ${index + 1}`;
};


const AdminApplications = () => {

  const navigate = useNavigate();

  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();


  /*
  ============================================================
  VIEW
  ============================================================
  */

  const [
    view,
    setView,
  ] = useState("table");


  /*
  ============================================================
  DATA
  ============================================================
  */

  const [
    applications,
    setApplications,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");


  /*
  ============================================================
  FILTERS
  ============================================================
  */

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    stage,
    setStage,
  ] = useState("ALL");

  const [
    status,
    setStatus,
  ] = useState(
    searchParams.get("status") || "ALL",
  );


  /*
  ============================================================
  PAGINATION
  ============================================================
  */

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);


  /*
  ============================================================
  LOAD APPLICATIONS
  ============================================================
  */

  const loadApplications = useCallback(
    async () => {

      try {

        setLoading(true);
        setError("");

        const response =
          await applicationsService
            .getAllApplications();


        const rawApplications =
          Array.isArray(response)
            ? response
            : Array.isArray(response?.data)
              ? response.data
              : Array.isArray(response?.applications)
                ? response.applications
                : Array.isArray(response?.data?.applications)
                  ? response.data.applications
                  : [];


        const normalizedApplications =
          rawApplications.map(
            (application, index) => ({
              ...application,

              applicationReference:
                createApplicationReference(
                  application,
                  index,
                ),
            }),
          );


        setApplications(
          normalizedApplications,
        );

      } catch (requestError) {

        console.error(
          "Failed to load admin applications:",
          requestError,
        );

        setError(
          requestError?.response?.data?.message ||
          requestError?.message ||
          "Unable to load applications.",
        );

      } finally {

        setLoading(false);

      }

    },
    [],
  );


  useEffect(() => {

    loadApplications();

  }, [loadApplications]);


  /*
  ============================================================
  URL STATUS SYNC
  ============================================================
  */

  useEffect(() => {

    const urlStatus =
      searchParams.get("status") || "ALL";

    if (urlStatus !== status) {

      setStatus(urlStatus);

    }

  }, [
    searchParams,
    status,
  ]);


  /*
  ============================================================
  STAGE OPTIONS
  ============================================================
  */

  const stages = useMemo(
    () => {

      const uniqueStages =
        new Set();

      applications.forEach(
        (application) => {

          if (
            application?.currentStep
          ) {

            uniqueStages.add(
              application.currentStep,
            );

          }

        },
      );


      return Array.from(
        uniqueStages,
      ).sort();

    },
    [applications],
  );


  /*
  ============================================================
  FILTERED APPLICATIONS
  ============================================================
  */

  const filteredApplications =
    useMemo(
      () => {

        const normalizedSearch =
          search
            .trim()
            .toLowerCase();


        return applications.filter(
          (application) => {

            /*
            --------------------------------------------------
            SEARCH
            --------------------------------------------------
            */

            const searchableValues = [

              application?.user?.name,

              application?.user?.email,

              application?.destinationCountry,

              application?._id,

              application?.applicationReference,

              application?.applicationNumber,

            ];


            const matchesSearch =
              !normalizedSearch ||
              searchableValues.some(
                (value) =>
                  String(value || "")
                    .toLowerCase()
                    .includes(
                      normalizedSearch,
                    ),
              );


            /*
            --------------------------------------------------
            STAGE
            --------------------------------------------------
            */

            const matchesStage =
              stage === "ALL" ||
              application?.currentStep ===
              stage;


            /*
            --------------------------------------------------
            STATUS
            --------------------------------------------------
            */

            const matchesStatus =
              status === "ALL" ||
              application?.status ===
              status;


            return (
              matchesSearch &&
              matchesStage &&
              matchesStatus
            );

          },
        );

      },
      [
        applications,
        search,
        stage,
        status,
      ],
    );


  /*
  ============================================================
  TABLE PAGINATION
  ============================================================
  */

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredApplications.length /
        ITEMS_PER_PAGE,
      ),
    );


  const paginatedApplications =
    useMemo(
      () => {

        const start =
          (currentPage - 1) *
          ITEMS_PER_PAGE;

        const end =
          start +
          ITEMS_PER_PAGE;

        return filteredApplications.slice(
          start,
          end,
        );

      },
      [
        filteredApplications,
        currentPage,
      ],
    );


  /*
  ============================================================
  RESET PAGE WHEN FILTERS CHANGE
  ============================================================
  */

  useEffect(() => {

    setCurrentPage(1);

  }, [
    search,
    stage,
    status,
  ]);


  /*
  ============================================================
  STATUS FILTER
  ============================================================
  */

  const handleStatusChange =
    useCallback(
      (nextStatus) => {

        setStatus(nextStatus);

        setCurrentPage(1);


        if (nextStatus === "ALL") {

          const nextParams =
            new URLSearchParams(
              searchParams,
            );

          nextParams.delete("status");

          setSearchParams(
            nextParams,
          );

          return;
        }


        setSearchParams(
          {
            status: nextStatus,
          },
        );

      },
      [
        searchParams,
        setSearchParams,
      ],
    );


  /*
  ============================================================
  APPLICATION CLICK
  ============================================================
  */

  const handleApplicationClick =
    useCallback(
      (applicationId) => {

        if (!applicationId) {
          return;
        }

        navigate(
          `/admin/applications/${applicationId}`,
        );

      },
      [navigate],
    );


  /*
  ============================================================
  CLEAR FILTERS
  ============================================================
  */

  const handleClearFilters =
    useCallback(
      () => {

        setSearch("");
        setStage("");
        setStage("ALL");
        setStatus("ALL");
        setCurrentPage(1);

        setSearchParams({});

      },
      [setSearchParams],
    );


  const hasActiveFilters =
    Boolean(
      search.trim() ||
      stage !== "ALL" ||
      status !== "ALL",
    );


  /*
  ============================================================
  RETRY
  ============================================================
  */

  const handleRetry =
    useCallback(
      () => {

        loadApplications();

      },
      [loadApplications],
    );


  /*
  ============================================================
  RENDER
  ============================================================
  */

  return (

    <div className="adminApplications">

      <ApplicationsHeader
        total={applications.length}
        view={view}
        onViewChange={setView}
      />


      <ApplicationFilters
        search={search}
        onSearchChange={setSearch}

        stage={stage}
        stages={stages}
        onStageChange={setStage}

        status={status}
        onStatusChange={
          handleStatusChange
        }

        onClear={
          handleClearFilters
        }

        hasActiveFilters={
          hasActiveFilters
        }
      />


      {loading ? (

        <div className="adminApplications__state">

          <div className="adminApplications__spinner" />

          <p>
            Loading applications...
          </p>

        </div>

      ) : error ? (

        <div className="adminApplications__state adminApplications__state--error">

          <h3>
            Unable to load applications
          </h3>

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

      ) : view === "pipeline" ? (

        <ApplicationPipeline
          applications={
            filteredApplications
          }
          onApplicationClick={
            handleApplicationClick
          }
          onApplicationsChange={
            setApplications
          }
        />

      ) : (

        <>

          <section className="adminApplications__tableSection">

            <ApplicationTable
              applications={
                paginatedApplications
              }
              onApplicationClick={
                handleApplicationClick
              }
            />

          </section>


          <ApplicationPagination
            currentPage={
              currentPage
            }
            totalPages={
              totalPages
            }
            onPageChange={
              setCurrentPage
            }
          />

        </>

      )}

    </div>

  );

};


export default AdminApplications;