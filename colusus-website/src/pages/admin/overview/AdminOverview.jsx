import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  HiOutlineExclamation,
} from "react-icons/hi";

import overviewService from "./overview.service";

import OverviewHeader
  from "./components/OverviewHeader/OverviewHeader";

import OverviewStats
  from "./components/OverviewStats/OverviewStats";

import ApplicationPipeline
  from "./components/ApplicationPipeline/ApplicationPipeline";

import RecentApplications
  from "./components/RecentApplications/RecentApplications";

import NeedsAttention
  from "./components/NeedsAttention/NeedsAttention";

import DocumentSummary
  from "./components/DocumentSummary/DocumentSummary";

import "./AdminOverview.css";


const AdminOverview = () => {

  const navigate = useNavigate();


  const [dashboard, setDashboard] = useState(null);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");


  /*
  |--------------------------------------------------------------------------
  | LOAD DASHBOARD
  |--------------------------------------------------------------------------
  */

  const loadDashboard = useCallback(
    async ({ silent = false } = {}) => {

      try {

        if (silent) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");


        const response =
          await overviewService.getDashboardStats();


        setDashboard(response.data);

      } catch (error) {

        console.error(
          "FAILED TO LOAD ADMIN DASHBOARD:",
          error
        );


        setError(
          error?.response?.data?.message ||
          "Unable to load dashboard data."
        );

      } finally {

        setLoading(false);

        setRefreshing(false);

      }

    },
    []
  );


  /*
  |--------------------------------------------------------------------------
  | INITIAL LOAD
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    loadDashboard();

  }, [loadDashboard]);


  /*
  |--------------------------------------------------------------------------
  | REFRESH
  |--------------------------------------------------------------------------
  */

  const handleRefresh = () => {

    loadDashboard({
      silent: true,
    });

  };


  /*
  |--------------------------------------------------------------------------
  | OPEN APPLICATION
  |--------------------------------------------------------------------------
  */

  const handleApplicationClick = (
    applicationId
  ) => {

    if (!applicationId) {
      return;
    }

    navigate(
      `/admin/applications/${applicationId}`
    );

  };


  /*
  |--------------------------------------------------------------------------
  | APPLICATIONS
  |--------------------------------------------------------------------------
  */

  const handleViewApplications = (
    status = ""
  ) => {

    if (status) {

      navigate(
        `/admin/applications?status=${status}`
      );

      return;
    }

    navigate("/admin/applications");

  };


  /*
  |--------------------------------------------------------------------------
  | DOCUMENTS
  |--------------------------------------------------------------------------
  */

  const handleViewDocuments = (
    status = ""
  ) => {

    if (status) {

      navigate(
        `/admin/documents?status=${status}`
      );

      return;
    }

    navigate("/admin/documents");

  };


  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  */

  if (loading) {

    return (

      <section className="adminOverviewState">

        <div className="adminOverviewState__spinner" />

        <span>
          Loading your operations overview...
        </span>

      </section>

    );

  }


  /*
  |--------------------------------------------------------------------------
  | ERROR
  |--------------------------------------------------------------------------
  */

  if (error) {

    return (

      <section className="adminOverviewState adminOverviewState--error">

        <div className="adminOverviewState__icon">
          <HiOutlineExclamation />
        </div>

        <div>

          <h3>
            Unable to load overview
          </h3>

          <p>
            {error}
          </p>

          <button
            type="button"
            onClick={() => loadDashboard()}
          >
            Try again
          </button>

        </div>

      </section>

    );

  }


  /*
  |--------------------------------------------------------------------------
  | DASHBOARD DATA
  |--------------------------------------------------------------------------
  */

  const clients =
    dashboard?.clients || {};

  const applications =
    dashboard?.applications || {};

  const documents =
    dashboard?.documents || {};

  const recentApplications =
    dashboard?.recentApplications || [];


  return (

    <section className="adminOverview">

      <OverviewHeader
        onRefresh={handleRefresh}
        refreshing={refreshing}
      />


      <OverviewStats
        clients={clients}
        applications={applications}
        documents={documents}
      />


      <div className="adminOverview__primaryGrid">

        <ApplicationPipeline
          applications={applications}
          onViewApplications={
            handleViewApplications
          }
        />


        <RecentApplications
          applications={
            recentApplications
          }
          onApplicationClick={
            handleApplicationClick
          }
          onViewAll={() =>
            handleViewApplications()
          }
        />

      </div>


      <div className="adminOverview__secondaryGrid">

        <NeedsAttention
          applications={applications}
          documents={documents}
          onViewApplications={
            handleViewApplications
          }
          onViewDocuments={
            handleViewDocuments
          }
        />


        <DocumentSummary
          documents={documents}
          onViewDocuments={
            handleViewDocuments
          }
        />

      </div>

    </section>

  );

};


export default AdminOverview;