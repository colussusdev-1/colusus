import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  HiOutlineDocumentText,
  HiOutlineEye,
  HiOutlineRefresh,
} from "react-icons/hi";

import adminApplicationsService
  from "../../applications.service";

import AdminDocumentViewer
  from "../AdminDocumentViewer/AdminDocumentViewer";

import "./ApplicationDocuments.css";


/*
============================================================
FORMAT LABEL
============================================================
*/

const formatLabel = (
  value,
) => {

  if (!value) {
    return "—";
  }

  return value
    .toString()
    .replaceAll(
      "_",
      " ",
    )
    .toLowerCase()
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase(),
    );

};


/*
============================================================
FORMAT DATE
============================================================
*/

const formatDate = (
  date,
) => {

  if (!date) {
    return "—";
  }

  const parsedDate =
    new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime(),
    )
  ) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  ).format(parsedDate);

};


/*
============================================================
STATUS CLASS
============================================================
*/

const getStatusClass = (
  status,
) => {

  switch (status) {

    case "APPROVED":
      return "approved";

    case "REJECTED":
      return "rejected";

    case "UNDER_REVIEW":
      return "review";

    case "REUPLOAD_REQUIRED":
      return "reupload";

    case "UPLOADED":
      return "uploaded";

    default:
      return "default";

  }

};


/*
============================================================
COMPONENT
============================================================
*/

const ApplicationDocuments = ({
  application,
}) => {

  /*
  ============================================================
  APPLICATION ID
  ============================================================
  */

  const applicationId =
    application?._id;


  /*
  ============================================================
  DOCUMENT STATE
  ============================================================
  */

  const [
    documents,
    setDocuments,
  ] = useState([]);


  /*
  ============================================================
  LOADING STATE
  ============================================================
  */

  const [
    loading,
    setLoading,
  ] = useState(true);


  /*
  ============================================================
  ERROR STATE
  ============================================================
  */

  const [
    error,
    setError,
  ] = useState("");


  /*
  ============================================================
  SELECTED DOCUMENT
  ============================================================
  |
  | This is the ONLY state needed to open the viewer.
  |
  | AdminDocumentViewer handles the actual overlay.
  |
  ============================================================
  */

  const [
    selectedDocument,
    setSelectedDocument,
  ] = useState(null);


  /*
  ============================================================
  LOAD APPLICATION DOCUMENTS
  ============================================================
  */

  const loadDocuments =
    useCallback(
      async () => {

        if (!applicationId) {

          setDocuments([]);

          setLoading(false);

          return;

        }


        try {

          setLoading(true);

          setError("");


          const response =
            await adminApplicationsService
              .getApplicationDocuments(
                applicationId,
              );


          /*
          ------------------------------------------------------
          NORMALIZE API RESPONSE
          ------------------------------------------------------
          */

          const documentData =
            response?.data ||
            response;


          setDocuments(
            Array.isArray(
              documentData,
            )
              ? documentData
              : [],
          );

        } catch (
        requestError
        ) {

          console.error(
            "FAILED TO LOAD APPLICATION DOCUMENTS:",
            requestError,
          );


          setError(
            requestError
              ?.response
              ?.data
              ?.message ||
            "Unable to load application documents.",
          );

        } finally {

          setLoading(false);

        }

      },
      [
        applicationId,
      ],
    );


  /*
  ============================================================
  INITIAL LOAD
  ============================================================
  */

  useEffect(() => {

    loadDocuments();

  }, [
    loadDocuments,
  ]);


  /*
  ============================================================
  CLOSE DOCUMENT VIEWER
  ============================================================
  */

  const closeDocumentViewer =
    useCallback(() => {

      setSelectedDocument(
        null,
      );

    }, []);


  /*
  ============================================================
  OPEN DOCUMENT VIEWER
  ============================================================
  */

  const handleOpenDocument = (
    document,
  ) => {

    if (!document?._id) {

      console.warn(
        "Cannot open document without an ID.",
      );

      return;

    }


    setSelectedDocument(
      document,
    );

  };


  /*
  ============================================================
  DOCUMENT COUNTS
  ============================================================
  */

  const totalDocuments =
    documents.length;


  const approvedDocuments =
    documents.filter(
      (document) =>
        document?.status ===
        "APPROVED",
    ).length;


  const pendingDocuments =
    documents.filter(
      (document) =>
        [
          "UPLOADED",
          "UNDER_REVIEW",
        ].includes(
          document?.status,
        ),
    ).length;


  const rejectedDocuments =
    documents.filter(
      (document) =>
        [
          "REJECTED",
          "REUPLOAD_REQUIRED",
        ].includes(
          document?.status,
        ),
    ).length;


  /*
  ============================================================
  HANDLE DOCUMENT UPDATE
  ============================================================
  |
  | When admin approves/rejects/marks under review:
  |
  | 1. Update the table
  | 2. Update the viewer
  |
  ============================================================
  */

  const handleDocumentUpdated = (
    updatedDocument,
  ) => {

    if (!updatedDocument) {

      return;

    }


    /*
    ----------------------------------------------------------
    UPDATE DOCUMENT IN TABLE
    ----------------------------------------------------------
    */

    setDocuments(
      (previousDocuments) =>
        previousDocuments.map(
          (document) =>
            document?._id ===
              updatedDocument?._id
              ? {
                ...document,
                ...updatedDocument,
              }
              : document,
        ),
    );


    /*
    ----------------------------------------------------------
    UPDATE CURRENT VIEWER
    ----------------------------------------------------------
    */

    setSelectedDocument(
      (previousDocument) =>
        previousDocument?._id ===
          updatedDocument?._id
          ? {
            ...previousDocument,
            ...updatedDocument,
          }
          : previousDocument,
    );

  };


  /*
  ============================================================
  RENDER
  ============================================================
  */

  return (

    <section className="applicationDocuments">


      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="applicationDocuments__header">

        <div>

          <span className="applicationDocuments__eyebrow">
            DOCUMENT MANAGEMENT
          </span>


          <h2>
            Application Documents
          </h2>


          <p>
            Review and manage documents submitted
            for this application.
          </p>

        </div>


        <button
          type="button"
          className="applicationDocuments__refresh"
          onClick={
            loadDocuments
          }
          disabled={
            loading
          }
        >

          <HiOutlineRefresh
            className={
              loading
                ? "is-spinning"
                : ""
            }
          />


          <span>
            Refresh
          </span>

        </button>

      </div>


      {/* ======================================================
          SUMMARY
      ====================================================== */}

      {!loading &&
        !error &&
        documents.length > 0 && (

          <div className="applicationDocuments__summary">

            <div>

              <span>
                Total
              </span>

              <strong>
                {totalDocuments}
              </strong>

            </div>


            <div>

              <span>
                Approved
              </span>

              <strong className="is-approved">
                {approvedDocuments}
              </strong>

            </div>


            <div>

              <span>
                Pending Review
              </span>

              <strong className="is-pending">
                {pendingDocuments}
              </strong>

            </div>


            <div>

              <span>
                Needs Attention
              </span>

              <strong className="is-rejected">
                {rejectedDocuments}
              </strong>

            </div>

          </div>

        )}


      {/* ======================================================
          LOADING
      ====================================================== */}

      {loading && (

        <div className="applicationDocuments__state">

          <div className="applicationDocuments__spinner" />

          <p>
            Loading documents...
          </p>

        </div>

      )}


      {/* ======================================================
          ERROR
      ====================================================== */}

      {!loading &&
        error && (

          <div
            className="
              applicationDocuments__state
              applicationDocuments__state--error
            "
          >

            <HiOutlineDocumentText />

            <h3>
              Unable to load documents
            </h3>

            <p>
              {error}
            </p>

            <button
              type="button"
              onClick={
                loadDocuments
              }
            >
              Try Again
            </button>

          </div>

        )}


      {/* ======================================================
          EMPTY
      ====================================================== */}

      {!loading &&
        !error &&
        documents.length === 0 && (

          <div
            className="
              applicationDocuments__state
              applicationDocuments__state--empty
            "
          >

            <div className="applicationDocuments__emptyIcon">

              <HiOutlineDocumentText />

            </div>


            <h3>
              No documents submitted
            </h3>


            <p>
              This application does not have any
              documents yet.
            </p>

          </div>

        )}


      {/* ======================================================
          DOCUMENT TABLE
      ====================================================== */}

      {!loading &&
        !error &&
        documents.length > 0 && (

          <div className="applicationDocuments__tableWrapper">

            <table className="applicationDocuments__table">

              <thead>

                <tr>

                  <th>
                    DOCUMENT
                  </th>

                  <th>
                    TYPE
                  </th>

                  <th>
                    STATUS
                  </th>

                  <th>
                    SUBMITTED
                  </th>

                  <th>
                    REVIEWED BY
                  </th>

                  <th>
                    ACTION
                  </th>

                </tr>

              </thead>


              <tbody>

                {documents.map(
                  (
                    document,
                  ) => {

                    const status =
                      document?.status ||
                      "UPLOADED";


                    const reviewer =
                      document
                        ?.reviewedBy
                        ?.name ||
                      "Not reviewed";


                    return (

                      <tr
                        key={
                          document?._id
                        }
                      >

                        {/* ======================================
                            DOCUMENT
                        ====================================== */}

                        <td>

                          <div className="applicationDocuments__document">

                            <div className="applicationDocuments__documentIcon">

                              <HiOutlineDocumentText />

                            </div>


                            <div>

                              <strong>

                                {
                                  document?.name ||
                                  document?.originalFileName ||
                                  "Untitled document"
                                }

                              </strong>


                              <span>

                                {
                                  document?.originalFileName ||
                                  "Document file"
                                }

                              </span>

                            </div>

                          </div>

                        </td>


                        {/* ======================================
                            TYPE
                        ====================================== */}

                        <td>

                          <span className="applicationDocuments__type">

                            {formatLabel(
                              document?.type,
                            )}

                          </span>

                        </td>


                        {/* ======================================
                            STATUS
                        ====================================== */}

                        <td>

                          <span
                            className={
                              `applicationDocuments__status applicationDocuments__status--${getStatusClass(
                                status,
                              )}`
                            }
                          >

                            <i />

                            {formatLabel(
                              status,
                            )}

                          </span>

                        </td>


                        {/* ======================================
                            SUBMITTED
                        ====================================== */}

                        <td>

                          <span className="applicationDocuments__date">

                            {formatDate(
                              document?.createdAt,
                            )}

                          </span>

                        </td>


                        {/* ======================================
                            REVIEWED BY
                        ====================================== */}

                        <td>

                          <span
                            className={
                              reviewer ===
                                "Not reviewed"
                                ? "applicationDocuments__reviewer applicationDocuments__reviewer--empty"
                                : "applicationDocuments__reviewer"
                            }
                          >

                            {reviewer}

                          </span>

                        </td>


                        {/* ======================================
                            ACTION
                        ====================================== */}

                        <td>

                          <button
                            type="button"
                            className="applicationDocuments__view"
                            onClick={() =>
                              handleOpenDocument(
                                document,
                              )
                            }
                            title="View document"
                          >

                            <HiOutlineEye />

                            <span>
                              View
                            </span>

                          </button>

                        </td>

                      </tr>

                    );

                  },
                )}

              </tbody>

            </table>

          </div>

        )}


      {/* ======================================================
          ADMIN DOCUMENT VIEWER
      ======================================================

          IMPORTANT:

          DO NOT WRAP THIS COMPONENT.

          AdminDocumentViewer already creates its own
          full-screen overlay using React Portal.

          It renders directly into document.body.

      ====================================================== */}

      {selectedDocument && (

        <AdminDocumentViewer
          document={
            selectedDocument
          }

          onClose={
            closeDocumentViewer
          }

          onUpdated={
            handleDocumentUpdated
          }

        />

      )}

    </section>

  );

};


export default ApplicationDocuments;