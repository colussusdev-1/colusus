import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  HiOutlineArrowLeft,
  HiOutlineArrowRight,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineDocumentText,
  HiOutlineExclamationCircle,
  HiOutlineUpload,
} from "react-icons/hi";

import documentService from "../../services/document.service";
import applicationService from "../../services/application.service";

import DocumentCard from "../../components/ClientPortal/Documents/DocumentCard";
import DocumentUpload from "../../components/ClientPortal/Documents/DocumentUpload";

import "./Documents.css";


/*
============================================================
DOCUMENTS
============================================================
*/

const Documents = () => {

  const navigate = useNavigate();


  /*
  ========================================================
  DOCUMENT STATE
  ========================================================
  */

  const [documents, setDocuments] = useState([]);

  const [applications, setApplications] = useState([]);


  /*
  ========================================================
  PAGE STATE
  ========================================================
  */

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  /*
  ========================================================
  UPLOAD STATE
  ========================================================
  */

  const [showUpload, setShowUpload] = useState(false);


  /*
  ========================================================
  LOAD DOCUMENTS
  ========================================================
  */

  const loadDocuments = async () => {

    try {

      const data =
        await documentService.getDocuments();

      setDocuments(
        Array.isArray(data)
          ? data
          : [],
      );

    } catch (error) {

      console.error(
        "FAILED TO LOAD DOCUMENTS:",
        error,
      );

      setError(
        error?.response?.data?.message ||
        "Unable to load your documents.",
      );

    }

  };


  /*
  ========================================================
  LOAD APPLICATIONS
  ========================================================
  */

  const loadApplications = async () => {

    try {

      const data =
        await applicationService.getApplications();

      setApplications(
        Array.isArray(data)
          ? data
          : [],
      );

    } catch (error) {

      console.error(
        "FAILED TO LOAD APPLICATIONS:",
        error,
      );

      /*
      Application loading should not
      break the document page.
      */

    }

  };


  /*
  ========================================================
  INITIAL LOAD
  ========================================================
  */

  useEffect(() => {

    const loadPage = async () => {

      try {

        setLoading(true);

        setError("");

        await Promise.all([
          loadDocuments(),
          loadApplications(),
        ]);

      } finally {

        setLoading(false);

      }

    };


    loadPage();

  }, []);


  /*
  ========================================================
  DOCUMENT STATISTICS
  ========================================================
  */

  const statistics = useMemo(() => {

    const total =
      documents.length;


    const approved =
      documents.filter(
        (document) =>
          document.status?.toUpperCase() ===
          "APPROVED",
      ).length;


    const underReview =
      documents.filter(
        (document) =>
          document.status?.toUpperCase() ===
          "UNDER_REVIEW",
      ).length;


    const reuploadRequired =
      documents.filter(
        (document) =>
          document.status?.toUpperCase() ===
          "REUPLOAD_REQUIRED",
      ).length;


    const rejected =
      documents.filter(
        (document) =>
          document.status?.toUpperCase() ===
          "REJECTED",
      ).length;


    const actionRequired =
      reuploadRequired +
      rejected;


    const percentage =
      total > 0
        ? Math.round(
          (approved / total) * 100,
        )
        : 0;


    return {
      total,
      approved,
      underReview,
      reuploadRequired,
      rejected,
      actionRequired,
      percentage,
    };

  }, [documents]);


  /*
  ========================================================
  OPEN DOCUMENT VIEWER
  ========================================================
  |
  | IMPORTANT:
  |
  | We NEVER navigate directly to document.fileUrl.
  |
  | The client stays inside the Colusus portal.
  |
  ========================================================
  */

  const handleViewDocument = (
    document,
  ) => {

    if (!document?._id) {
      return;
    }


    navigate(
      `/portal/documents/${document._id}/view`,
    );

  };


  /*
  ========================================================
  OPEN UPLOAD
  ========================================================
  */

  const openUpload = () => {

    setShowUpload(true);

  };


  /*
  ========================================================
  CLOSE UPLOAD
  ========================================================
  */

  const closeUpload = () => {

    setShowUpload(false);

  };


  /*
  ========================================================
  UPLOAD SUCCESS
  ========================================================
  */

  const handleUploadSuccess = async () => {

    setShowUpload(false);

    await loadDocuments();

  };


  /*
  ========================================================
  RENDER
  ========================================================
  */

  return (

    <div className="documents-page">


      {/* =================================================
          HEADER
      ================================================= */}

      <section className="documents-header">

        <div className="documents-header-copy">

          <Link
            to="/portal"
            className="documents-back"
          >

            <HiOutlineArrowLeft />

            <span>
              Dashboard
            </span>

          </Link>


          <span className="documents-eyebrow">
            Document Management
          </span>


          <h1>
            Your Documents
          </h1>


          <p>
            Upload and manage the documents
            required for your migration application.
          </p>

        </div>


        <Link
          to="/portal/applications"
          className="documents-application-link"
        >

          <HiOutlineDocumentText />

          <span>
            View Applications
          </span>

          <HiOutlineArrowRight />

        </Link>

      </section>


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (

        <div className="documents-alert error">
          {error}
        </div>

      )}


      {/* =================================================
          LOADING
      ================================================= */}

      {loading ? (

        <section className="documents-loading">

          <div className="documents-spinner" />

          <p>
            Loading your documents...
          </p>

        </section>

      ) : (

        <>


          {/* =================================================
              DOCUMENT OVERVIEW
          ================================================= */}

          <section className="documents-overview">


            {/* PROGRESS */}

            <div className="documents-progress">

              <div
                className="documents-progress-ring"
                style={{
                  "--progress":
                    `${statistics.percentage}%`,
                }}
              >

                <div className="documents-progress-inner">

                  <strong>
                    {statistics.percentage}%
                  </strong>

                  <span>
                    Complete
                  </span>

                </div>

              </div>


              <div className="documents-progress-copy">

                <span className="documents-card-label">
                  Documents Progress
                </span>


                <h2>
                  {statistics.approved} of{" "}
                  {statistics.total} approved
                </h2>


                <p>
                  Keep your documents updated
                  to avoid delays in your application.
                </p>

              </div>

            </div>


            {/* SUMMARY */}

            <div className="documents-summary">


              <div className="summary-item">

                <div className="summary-icon summary-icon-approved">

                  <HiOutlineCheckCircle />

                </div>


                <div>

                  <strong>
                    {statistics.approved}
                  </strong>

                  <span>
                    Approved
                  </span>

                </div>

              </div>


              <div className="summary-item">

                <div className="summary-icon summary-icon-review">

                  <HiOutlineClock />

                </div>


                <div>

                  <strong>
                    {statistics.underReview}
                  </strong>

                  <span>
                    Under Review
                  </span>

                </div>

              </div>


              <div className="summary-item">

                <div className="summary-icon summary-icon-required">

                  <HiOutlineExclamationCircle />

                </div>


                <div>

                  <strong>
                    {statistics.actionRequired}
                  </strong>

                  <span>
                    Action Required
                  </span>

                </div>

              </div>

            </div>

          </section>


          {/* =================================================
              ACTION REQUIRED
          ================================================= */}

          {statistics.actionRequired > 0 && (

            <section className="documents-action">

              <div className="documents-action-icon">

                <HiOutlineExclamationCircle />

              </div>


              <div className="documents-action-copy">

                <strong>
                  Action required
                </strong>


                <p>
                  {statistics.actionRequired === 1
                    ? "One document needs your attention."
                    : `${statistics.actionRequired} documents need your attention.`}
                </p>

              </div>


              <button
                type="button"
                className="documents-action-button"
                onClick={openUpload}
              >

                <HiOutlineUpload />

                Upload Document

              </button>

            </section>

          )}


          {/* =================================================
              DOCUMENT LIST
          ================================================= */}

          <section className="documents-list-section">


            <header className="documents-list-header">

              <div>

                <span className="documents-card-label">
                  Migration Documents
                </span>


                <h2>
                  Your Application Documents
                </h2>


                <p>
                  Documents submitted for your
                  migration applications.
                </p>

              </div>


              <button
                type="button"
                className="documents-upload-button"
                onClick={openUpload}
              >

                <HiOutlineUpload />

                Upload Document

              </button>

            </header>


            {documents.length === 0 ? (

              <div className="documents-empty">

                <div className="documents-empty-icon">

                  <HiOutlineDocumentText />

                </div>


                <h3>
                  No documents yet
                </h3>


                <p>
                  Upload the documents required
                  for your migration application.
                </p>


                {applications.length > 0 && (

                  <button
                    type="button"
                    className="documents-upload-button"
                    onClick={openUpload}
                  >

                    <HiOutlineUpload />

                    Upload Your First Document

                  </button>

                )}

              </div>

            ) : (

              <div className="documents-list">

                {documents.map(
                  (document) => (

                    <DocumentCard
                      key={document._id}
                      document={document}
                      onView={handleViewDocument}
                      onReupload={openUpload}
                    />

                  ),
                )}

              </div>

            )}

          </section>


          {/* =================================================
              SECURITY NOTE
          ================================================= */}

          <div className="documents-security">

            <HiOutlineCheckCircle />

            <div>

              <strong>
                Your documents are protected
              </strong>

              <p>
                Documents uploaded to Colusus are securely
                associated with your migration application
                and are only accessible to authorised members
                of the migration team.
              </p>

            </div>

          </div>


        </>

      )}


      {/* ============================================================
          DOCUMENT UPLOAD COMPONENT
      ============================================================ */}

      {showUpload && (

        <DocumentUpload
          applications={applications}
          onClose={closeUpload}
          onSuccess={handleUploadSuccess}
        />

      )}

    </div>

  );

};


export default Documents;