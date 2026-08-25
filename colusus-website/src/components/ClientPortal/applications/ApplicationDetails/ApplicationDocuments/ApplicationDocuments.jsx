import {
    useRef,
} from "react";

import {
    HiOutlineCheckCircle,
    HiOutlineCloudUpload,
    HiOutlineDocumentText,
    HiOutlineEye,
    HiOutlineUpload,
} from "react-icons/hi";

import "./ApplicationDocuments.css";


/* =========================================================
   HELPERS
========================================================= */

const normalizeName = (value) => {

    return String(value || "")
        .trim()
        .toLowerCase()
        .replace(/[_-]+/g, " ")
        .replace(/\s+/g, " ");

};


const getDocumentName = (document) => {

    if (typeof document === "string") {

        return document;

    }

    return (
        document?.name ||
        document?.title ||
        document?.label ||
        document?.documentName ||
        document?.type ||
        "Required document"
    );

};


const getUploadedDocumentName = (document) => {

    return (
        document?.name ||
        document?.originalFileName ||
        document?.originalName ||
        document?.filename ||
        document?.documentName ||
        document?.type ||
        ""
    );

};


const getDocumentType = (document) => {

    if (
        typeof document === "string"
    ) {

        return "OTHER";

    }

    return (
        document?.type ||
        document?.documentType ||
        "OTHER"
    );

};


const getRequiredDocuments = (
    application,
) => {

    return (
        application
            ?.opportunity
            ?.applicationConfig
            ?.requiredDocuments ||

        application
            ?.opportunity
            ?.documents ||

        []
    );

};


/* =========================================================
   MATCH UPLOADED DOCUMENT
========================================================= */

const findUploadedDocument = (
    requiredDocument,
    uploadedDocuments,
) => {

    const requiredType =
        getDocumentType(
            requiredDocument,
        );


    if (
        requiredType &&
        requiredType !== "OTHER"
    ) {

        const typeMatch =
            uploadedDocuments.find(
                (uploadedDocument) =>
                    uploadedDocument?.type ===
                    requiredType,
            );


        if (typeMatch) {

            return typeMatch;

        }

    }


    const requiredName =
        normalizeName(
            getDocumentName(
                requiredDocument,
            ),
        );


    if (!requiredName) {

        return null;

    }


    return (
        uploadedDocuments.find(
            (uploadedDocument) => {

                const uploadedName =
                    normalizeName(
                        getUploadedDocumentName(
                            uploadedDocument,
                        ),
                    );


                if (!uploadedName) {

                    return false;

                }


                return (
                    uploadedName === requiredName ||
                    uploadedName.includes(
                        requiredName,
                    ) ||
                    requiredName.includes(
                        uploadedName,
                    )
                );

            },
        ) || null
    );

};


/* =========================================================
   COMPONENT
========================================================= */

const ApplicationDocuments = ({
    application,
    documents = [],
    loading = false,
    error = "",
    uploadingDocumentId = null,
    onUpload,
    onView,
}) => {

    const fileInputRefs =
        useRef({});


    const requiredDocuments =
        getRequiredDocuments(
            application,
        );


    /* =====================================================
       EMPTY STATE
    ===================================================== */

    if (!requiredDocuments.length) {

        return (

            <section className="application-documents">

                <div className="application-documents-header">

                    <div>

                        <span>
                            DOCUMENTS
                        </span>

                        <h2>
                            Required documents
                        </h2>

                        <p>
                            Documents required for this
                            application.
                        </p>

                    </div>

                </div>


                <div className="application-documents-empty">

                    <div className="application-documents-empty-icon">

                        <HiOutlineDocumentText />

                    </div>


                    <div>

                        <strong>
                            No document requirements yet
                        </strong>

                        <p>
                            Document requirements for this
                            application have not been configured.
                        </p>

                    </div>

                </div>

            </section>

        );

    }


    /* =====================================================
       BUILD DOCUMENT ITEMS
    ===================================================== */

    const documentItems =
        requiredDocuments.map(
            (
                requiredDocument,
                index,
            ) => {

                const uploadedDocument =
                    findUploadedDocument(
                        requiredDocument,
                        documents,
                    );


                const uploaded =
                    Boolean(
                        uploadedDocument,
                    );


                const name =
                    getDocumentName(
                        requiredDocument,
                    );


                const description =
                    typeof requiredDocument === "object"
                        ? (
                            requiredDocument?.description ||
                            requiredDocument?.note ||
                            ""
                        )
                        : "";


                const type =
                    getDocumentType(
                        requiredDocument,
                    );


                const id =
                    requiredDocument?.key ||
                    requiredDocument?.id ||
                    requiredDocument?._id ||
                    `${type}-${name}-${index}`;


                return {

                    id,

                    name,

                    description,

                    type,

                    uploaded,

                    uploadedDocument,

                    requiredDocument,

                };

            },
        );


    /* =====================================================
       COUNTS
    ===================================================== */

    const completedCount =
        documentItems.filter(
            (document) =>
                document.uploaded,
        ).length;


    const totalCount =
        documentItems.length;


    const remainingCount =
        totalCount -
        completedCount;


    const progress =
        totalCount
            ? Math.round(
                (
                    completedCount /
                    totalCount
                ) * 100,
            )
            : 0;


    /* =====================================================
       FILE SELECT
    ===================================================== */

    const handleFileSelected = (
        document,
        event,
    ) => {

        const file =
            event.target.files?.[0];


        event.target.value = "";


        if (!file) {

            return;

        }


        if (
            typeof onUpload ===
            "function"
        ) {

            onUpload(
                {
                    ...document.requiredDocument,

                    id:
                        document.id,

                    type:
                        document.type,

                    name:
                        document.name,
                },

                file,
            );

        }

    };


    /* =====================================================
       VIEW DOCUMENT
    =====================================================
    |
    | IMPORTANT:
    |
    | This component NEVER opens document.fileUrl.
    |
    | The parent page receives the document object and is
    | responsible for navigating to the internal viewer.
    |
    ===================================================== */

    const handleView = (
        uploadedDocument,
    ) => {

        if (
            !uploadedDocument?._id
        ) {

            return;

        }


        if (
            typeof onView ===
            "function"
        ) {

            onView(
                uploadedDocument,
            );

        }

    };


    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <section className="application-documents">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="application-documents-header">

                <div>

                    <span>
                        DOCUMENTS
                    </span>

                    <h2>
                        Required documents
                    </h2>

                    <p>
                        Keep your application documents
                        complete and up to date.
                    </p>

                </div>


                <div className="application-documents-summary">

                    <strong>

                        {completedCount}

                        <span>
                            /{totalCount}
                        </span>

                    </strong>


                    <small>
                        COMPLETE
                    </small>

                </div>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div className="application-documents-error">

                    {error}

                </div>

            )}


            {/* =================================================
                PROGRESS
            ================================================= */}

            <div className="application-documents-progress">

                <div className="application-documents-progress-top">

                    <span>
                        Document readiness
                    </span>


                    <strong>
                        {progress}%
                    </strong>

                </div>


                <div className="application-documents-progress-track">

                    <span
                        style={{
                            width: `${progress}%`,
                        }}
                    />

                </div>


                <p>

                    {remainingCount === 0
                        ? "All required documents are complete."
                        : `${remainingCount} document${remainingCount === 1
                            ? ""
                            : "s"
                        } remaining.`}

                </p>

            </div>


            {/* =================================================
                LOADING
            ================================================= */}

            {loading ? (

                <div className="application-documents-loading">

                    <div />

                    <p>
                        Loading your documents...
                    </p>

                </div>

            ) : (

                <div className="application-documents-list">

                    {documentItems.map(
                        (document) => {

                            const isUploading =
                                uploadingDocumentId ===
                                document.id;


                            return (

                                <div
                                    key={document.id}
                                    className={[
                                        "application-document-row",

                                        document.uploaded
                                            ? "is-uploaded"
                                            : "is-missing",

                                    ].join(" ")}
                                >


                                    {/* =================================
                                        ICON
                                    ================================= */}

                                    <div className="application-document-icon">

                                        {document.uploaded ? (

                                            <HiOutlineCheckCircle />

                                        ) : (

                                            <HiOutlineDocumentText />

                                        )}

                                    </div>


                                    {/* =================================
                                        INFO
                                    ================================= */}

                                    <div className="application-document-info">

                                        <div className="application-document-name-row">

                                            <strong>
                                                {document.name}
                                            </strong>


                                            <span className="application-document-status">

                                                {document.uploaded
                                                    ? "Uploaded"
                                                    : "Required"}

                                            </span>

                                        </div>


                                        {document.description && (

                                            <p>
                                                {document.description}
                                            </p>

                                        )}


                                        <small>

                                            {document.uploaded
                                                ? "Ready for review"
                                                : "Required to continue your application"}

                                        </small>

                                    </div>


                                    {/* =================================
                                        ACTION
                                    ================================= */}

                                    <div className="application-document-action">

                                        {document.uploaded ? (

                                            <button
                                                type="button"
                                                className="application-document-view"
                                                onClick={() =>
                                                    handleView(
                                                        document.uploadedDocument,
                                                    )
                                                }
                                                aria-label={`View ${document.name}`}
                                            >

                                                <HiOutlineEye />

                                                <span>
                                                    View
                                                </span>

                                            </button>

                                        ) : (

                                            <>

                                                <input
                                                    ref={(element) => {

                                                        fileInputRefs.current[
                                                            document.id
                                                        ] = element;

                                                    }}
                                                    type="file"
                                                    accept="
                                                        .pdf,
                                                        .jpg,
                                                        .jpeg,
                                                        .png,
                                                        application/pdf,
                                                        image/jpeg,
                                                        image/png
                                                    "
                                                    style={{
                                                        display: "none",
                                                    }}
                                                    disabled={
                                                        uploadingDocumentId !==
                                                        null
                                                    }
                                                    onChange={(event) =>
                                                        handleFileSelected(
                                                            document,
                                                            event,
                                                        )
                                                    }
                                                />


                                                <button
                                                    type="button"
                                                    className="application-document-upload"
                                                    disabled={
                                                        uploadingDocumentId !==
                                                        null
                                                    }
                                                    onClick={() =>
                                                        fileInputRefs.current[
                                                            document.id
                                                        ]?.click()
                                                    }
                                                >

                                                    <HiOutlineUpload />

                                                    <span>

                                                        {isUploading
                                                            ? "Uploading..."
                                                            : "Upload"}

                                                    </span>

                                                </button>

                                            </>

                                        )}

                                    </div>

                                </div>

                            );

                        },
                    )}

                </div>

            )}


            {/* =================================================
                NOTICE
            ================================================= */}

            {remainingCount > 0 && (

                <div className="application-documents-notice">

                    <div className="application-documents-notice-icon">

                        <HiOutlineCloudUpload />

                    </div>


                    <div>

                        <strong>

                            Your application needs

                            {remainingCount === 1
                                ? " 1 document"
                                : ` ${remainingCount} documents`}

                        </strong>


                        <p>
                            Upload the remaining required
                            documents to keep your application
                            moving.
                        </p>

                    </div>

                </div>

            )}


            {/* =================================================
                COMPLETE NOTICE
            ================================================= */}

            {remainingCount === 0 && (

                <div className="application-documents-complete">

                    <HiOutlineCheckCircle />


                    <div>

                        <strong>
                            All required documents uploaded
                        </strong>


                        <p>
                            Your document checklist is complete.
                        </p>

                    </div>

                </div>

            )}

        </section>

    );

};


export default ApplicationDocuments;