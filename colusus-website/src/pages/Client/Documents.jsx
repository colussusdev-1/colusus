import {
  HiOutlineArrowLeft,
  HiOutlineDocumentText,
  HiOutlineUpload,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineExclamationCircle,
  HiOutlineEye,
} from "react-icons/hi";

import { Link } from "react-router-dom";
import { useState } from "react";

import UploadDocumentModal from "./UploadDocumentModal";

import "./Documents.css";


const Documents = () => {

  /*
  ============================================================
  UPLOAD MODAL
  ============================================================
  */

  const [uploadModalOpen, setUploadModalOpen] = useState(false);


  /*
  ============================================================
  TEMPORARY V1 DOCUMENT DATA

  Later this will come from:

  GET /api/v1/documents

  ============================================================
  */

  const documents = [

    {
      id: 1,
      name: "International Passport",
      type: "Identity Document",
      status: "verified",
      uploadedAt: "August 2, 2026",
      size: "2.4 MB",
      required: true,
    },

    {
      id: 2,
      name: "Bachelor Degree Certificate",
      type: "Education",
      status: "verified",
      uploadedAt: "August 2, 2026",
      size: "1.8 MB",
      required: true,
    },

    {
      id: 3,
      name: "Academic Transcript",
      type: "Education",
      status: "verified",
      uploadedAt: "August 3, 2026",
      size: "3.1 MB",
      required: true,
    },

    {
      id: 4,
      name: "Curriculum Vitae",
      type: "Employment",
      status: "verified",
      uploadedAt: "August 3, 2026",
      size: "940 KB",
      required: true,
    },

    {
      id: 5,
      name: "Employment Reference Letter",
      type: "Employment",
      status: "reviewing",
      uploadedAt: "August 4, 2026",
      size: "1.2 MB",
      required: true,
    },

    {
      id: 6,
      name: "Proof of Funds",
      type: "Financial",
      status: "missing",
      uploadedAt: null,
      size: null,
      required: true,
    },

    {
      id: 7,
      name: "Police Clearance Certificate",
      type: "Background Check",
      status: "missing",
      uploadedAt: null,
      size: null,
      required: true,
    },

    {
      id: 8,
      name: "Passport Photograph",
      type: "Identity Document",
      status: "verified",
      uploadedAt: "August 2, 2026",
      size: "620 KB",
      required: true,
    },

    {
      id: 9,
      name: "Marriage Certificate",
      type: "Personal Document",
      status: "not_required",
      uploadedAt: null,
      size: null,
      required: false,
    },

  ];


  /*
  ============================================================
  COUNTS
  ============================================================
  */

  const requiredDocuments = documents.filter(
    (document) => document.required
  );

  const verifiedDocuments = requiredDocuments.filter(
    (document) => document.status === "verified"
  );

  const reviewingDocuments = requiredDocuments.filter(
    (document) => document.status === "reviewing"
  );

  const missingDocuments = requiredDocuments.filter(
    (document) => document.status === "missing"
  );


  const documentProgress = Math.round(
    (verifiedDocuments.length /
      requiredDocuments.length) *
    100
  );


  /*
  ============================================================
  OPEN UPLOAD MODAL
  ============================================================
  */

  const openUploadModal = () => {

    setUploadModalOpen(true);

  };


  /*
  ============================================================
  CLOSE UPLOAD MODAL
  ============================================================
  */

  const closeUploadModal = () => {

    setUploadModalOpen(false);

  };


  /*
  ============================================================
  TEMPORARY UPLOAD HANDLER

  This does NOT upload to the backend yet.

  It simply confirms that the modal has collected
  the correct document information.

  We will replace this with the real API call
  when we connect the existing Documents backend.
  ============================================================
  */

  const handleDocumentUpload = async ({
    documentType,
    file,
  }) => {

    console.log(
      "================================="
    );

    console.log(
      "DOCUMENT READY FOR UPLOAD"
    );

    console.log(
      "================================="
    );

    console.log({
      documentType,
      file,
      fileName: file?.name,
      fileSize: file?.size,
      fileType: file?.type,
    });


    /*
    ========================================================
    NEXT BACKEND STEP

    const formData = new FormData();

    formData.append(
        "documentType",
        documentType
    );

    formData.append(
        "file",
        file
    );

    await documentService.uploadDocument(
        formData
    );

    ========================================================
    */

  };


  /*
  ============================================================
  STATUS CONFIG
  ============================================================
  */

  const getStatus = (status) => {

    switch (status) {

      case "verified":

        return {
          label: "Verified",
          className: "verified",
          icon: <HiOutlineCheckCircle />,
        };


      case "reviewing":

        return {
          label: "Under Review",
          className: "reviewing",
          icon: <HiOutlineClock />,
        };


      case "missing":

        return {
          label: "Required",
          className: "missing",
          icon: <HiOutlineExclamationCircle />,
        };


      default:

        return {
          label: "Not Required",
          className: "not-required",
          icon: null,
        };

    }

  };


  return (

    <div className="documents-page">


      {/* =================================================
                HEADER
            ================================================= */}

      <header className="documents-header">

        <div>

          <Link
            to="/portal"
            className="documents-back"
          >

            <HiOutlineArrowLeft />

            Dashboard

          </Link>


          <span className="documents-eyebrow">
            DOCUMENT MANAGEMENT
          </span>


          <h2>
            Your Documents
          </h2>


          <p>
            Upload and manage the documents required
            for your migration application.
          </p>

        </div>


        <Link
          to="/portal/applications"
          className="documents-application-link"
        >

          View Application

        </Link>

      </header>



      {/* =================================================
                DOCUMENT SUMMARY
            ================================================= */}

      <section className="documents-summary">


        <div className="documents-summary-main">

          <div className="documents-summary-icon">

            <HiOutlineDocumentText />

          </div>


          <div>

            <span>
              DOCUMENT REQUIREMENTS
            </span>

            <h3>
              {verifiedDocuments.length} of{" "}
              {requiredDocuments.length} verified
            </h3>

            <p>
              Keep your documents updated to avoid
              delays in your application.
            </p>

          </div>

        </div>


        <div className="documents-summary-progress">

          <strong>
            {documentProgress}%
          </strong>

          <span>
            Complete
          </span>

          <div className="documents-progress-track">

            <div
              className="documents-progress-fill"
              style={{
                width:
                  `${documentProgress}%`,
              }}
            />

          </div>

        </div>

      </section>



      {/* =================================================
                STATUS CARDS
            ================================================= */}

      <section className="documents-stat-grid">


        <div className="document-stat">

          <div className="document-stat-icon verified">

            <HiOutlineCheckCircle />

          </div>

          <div>

            <span>
              Verified
            </span>

            <strong>
              {verifiedDocuments.length}
            </strong>

          </div>

        </div>


        <div className="document-stat">

          <div className="document-stat-icon reviewing">

            <HiOutlineClock />

          </div>

          <div>

            <span>
              Under Review
            </span>

            <strong>
              {reviewingDocuments.length}
            </strong>

          </div>

        </div>


        <div className="document-stat">

          <div className="document-stat-icon missing">

            <HiOutlineExclamationCircle />

          </div>

          <div>

            <span>
              Required
            </span>

            <strong>
              {missingDocuments.length}
            </strong>

          </div>

        </div>


      </section>



      {/* =================================================
                REQUIRED DOCUMENTS NOTICE
            ================================================= */}

      {missingDocuments.length > 0 && (

        <div className="documents-notice">

          <div className="documents-notice-icon">

            <HiOutlineExclamationCircle />

          </div>


          <div>

            <strong>
              Action required
            </strong>

            <p>
              You still need to provide{" "}
              {missingDocuments.length} document
              {missingDocuments.length > 1
                ? "s"
                : ""}{" "}
              before your application can move
              to the next stage.
            </p>

          </div>


          <button
            type="button"
            className="notice-action"
            onClick={openUploadModal}
          >

            Upload Documents

            <HiOutlineUpload />

          </button>

        </div>

      )}



      {/* =================================================
                DOCUMENT LIST
            ================================================= */}

      <section className="documents-panel">


        <div className="documents-panel-header">

          <div>

            <span>
              REQUIRED DOCUMENTS
            </span>

            <h3>
              Application Documents
            </h3>

          </div>


          <button
            type="button"
            className="upload-document-button"
            onClick={openUploadModal}
          >

            <HiOutlineUpload />

            Upload Document

          </button>

        </div>



        <div className="documents-list">

          {documents.map((document) => {

            const status = getStatus(
              document.status
            );


            return (

              <div
                key={document.id}
                className={
                  `document-row ${document.status}`
                }
              >


                {/* DOCUMENT ICON */}

                <div className="document-file-icon">

                  <HiOutlineDocumentText />

                </div>


                {/* INFORMATION */}

                <div className="document-information">

                  <h4>
                    {document.name}
                  </h4>

                  <div className="document-meta">

                    <span>
                      {document.type}
                    </span>


                    {document.uploadedAt && (
                      <>
                        <span className="meta-dot">
                          •
                        </span>

                        <span>
                          Uploaded{" "}
                          {document.uploadedAt}
                        </span>
                      </>
                    )}


                    {document.size && (
                      <>
                        <span className="meta-dot">
                          •
                        </span>

                        <span>
                          {document.size}
                        </span>
                      </>
                    )}

                  </div>

                </div>


                {/* STATUS */}

                <div
                  className={
                    `document-status ${status.className}`
                  }
                >

                  {status.icon}

                  <span>
                    {status.label}
                  </span>

                </div>


                {/* ACTION */}

                <div className="document-action">


                  {document.status === "verified" && (

                    <button
                      type="button"
                      title="View document"
                    >

                      <HiOutlineEye />

                    </button>

                  )}


                  {document.status === "reviewing" && (

                    <button
                      type="button"
                      title="View document"
                    >

                      <HiOutlineEye />

                    </button>

                  )}


                  {document.status === "missing" && (

                    <button
                      type="button"
                      className="upload-row-button"
                      onClick={openUploadModal}
                    >

                      <HiOutlineUpload />

                      Upload

                    </button>

                  )}


                  {document.status === "not_required" && (

                    <button
                      type="button"
                      title="Upload document"
                      onClick={openUploadModal}
                    >

                      <HiOutlineUpload />

                    </button>

                  )}

                </div>


              </div>

            );

          })}

        </div>

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
            and are only accessible to authorised
            members of the migration team.
          </p>

        </div>

      </div>



      {/* =================================================
                UPLOAD DOCUMENT MODAL
            ================================================= */}

      <UploadDocumentModal
        isOpen={uploadModalOpen}
        onClose={closeUploadModal}
        onUpload={handleDocumentUpload}
      />


    </div>

  );

};


export default Documents;