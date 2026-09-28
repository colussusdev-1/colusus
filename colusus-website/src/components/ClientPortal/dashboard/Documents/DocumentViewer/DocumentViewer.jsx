import {
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    HiOutlineArrowLeft,
    HiOutlineDocumentText,
    HiOutlineDownload,
    HiOutlineExclamationCircle,
} from "react-icons/hi";

import documentService from "../../../../../services/document.service";

import "./DocumentViewer.css";


const DocumentViewer = () => {

    const {
        documentId,
    } = useParams();

    const navigate =
        useNavigate();


    /* =========================================================
       STATE
    ========================================================= */

    const [document, setDocument] =
        useState(null);

    const [previewUrl, setPreviewUrl] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    /* =========================================================
       LOAD DOCUMENT + PREVIEW
    ========================================================= */

    useEffect(() => {

        let objectUrl = null;

        const loadDocument = async () => {

            try {

                setLoading(true);

                setError("");

                setDocument(null);

                setPreviewUrl("");


                /* -------------------------------------------------
                   LOAD DOCUMENT METADATA
                ------------------------------------------------- */

                const data =
                    await documentService.getDocument(
                        documentId,
                    );


                setDocument(data);


                /* -------------------------------------------------
                   LOAD DOCUMENT PREVIEW
                -------------------------------------------------
                   
                   The preview request goes through the authenticated
                   backend endpoint:

                   GET /documents/:id/view

                   Axios returns the Cloudinary PDF as a Blob.
                ------------------------------------------------- */

                const blob =
                    await documentService.getDocumentPreview(
                        documentId,
                    );


                if (!blob) {
                    throw new Error(
                        "The document preview is empty.",
                    );
                }


                /* -------------------------------------------------
                   CREATE TEMPORARY BROWSER URL
                ------------------------------------------------- */

                objectUrl =
                    URL.createObjectURL(blob);

                setPreviewUrl(objectUrl);

            } catch (error) {

                console.error(
                    "FAILED TO LOAD DOCUMENT:",
                    error,
                );


                setError(
                    error?.response?.data?.message ||
                    error?.message ||
                    "Unable to load this document.",
                );

            } finally {

                setLoading(false);

            }

        };


        if (documentId) {

            loadDocument();

        } else {

            setError(
                "No document was specified.",
            );

            setLoading(false);

        }


        /* =========================================================
           CLEANUP
        ========================================================= */

        return () => {

            if (objectUrl) {

                URL.revokeObjectURL(
                    objectUrl,
                );

            }

        };

    }, [documentId]);


    /* =========================================================
       LOADING
    ========================================================= */

    if (loading) {

        return (

            <main className="document-viewer-page">

                <div className="document-viewer-container">

                    <div className="document-viewer-state">

                        <div className="document-viewer-spinner" />

                        <h2>
                            Loading document
                        </h2>

                        <p>
                            Preparing your document...
                        </p>

                    </div>

                </div>

            </main>

        );

    }


    /* =========================================================
       ERROR
    ========================================================= */

    if (error || !document) {

        return (

            <main className="document-viewer-page">

                <div className="document-viewer-container">

                    <div className="document-viewer-state">

                        <div className="document-viewer-error-icon">

                            <HiOutlineExclamationCircle />

                        </div>


                        <h2>
                            Document unavailable
                        </h2>


                        <p>
                            {error ||
                                "This document could not be loaded."
                            }
                        </p>


                        <button
                            type="button"
                            className="document-viewer-back"
                            onClick={() =>
                                navigate(-1)
                            }
                        >

                            <HiOutlineArrowLeft />

                            Back

                        </button>

                    </div>

                </div>

            </main>

        );

    }


    /* =========================================================
       DOCUMENT INFORMATION
    ========================================================= */

    const fileName =
        document.originalFileName ||
        document.name ||
        "Document";


    const mimeType =
        document.mimeType ||
        "";


    const isPdf =
        mimeType === "application/pdf";


    const isImage =
        mimeType.startsWith("image/");


    /* =========================================================
       RENDER
    ========================================================= */

    return (

        <main className="document-viewer-page">


            {/* =====================================================
                HEADER
            ===================================================== */}

            <header className="document-viewer-header">

                <div className="document-viewer-header-inner">


                    <button
                        type="button"
                        className="document-viewer-back"
                        onClick={() =>
                            navigate(-1)
                        }
                    >

                        <HiOutlineArrowLeft />

                        <span>
                            Back
                        </span>

                    </button>


                    <div className="document-viewer-title">

                        <div className="document-viewer-title-icon">

                            <HiOutlineDocumentText />

                        </div>


                        <div>

                            <strong>
                                {fileName}
                            </strong>

                            <span>
                                {document.name ||
                                    "Application document"
                                }
                            </span>

                        </div>

                    </div>


                    {document.fileUrl && (

                        <a
                            href={document.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="document-viewer-download"
                            download
                        >

                            <HiOutlineDownload />

                            <span>
                                Download
                            </span>

                        </a>

                    )}

                </div>

            </header>


            {/* =====================================================
                VIEWER
            ===================================================== */}

            <section className="document-viewer-content">

                <div className="document-viewer-frame">


                    {/* =================================================
                        PDF
                    ================================================= */}

                    {isPdf && previewUrl && (

                        <iframe
                            src={previewUrl}
                            title={fileName}
                            className="document-viewer-pdf"
                        />

                    )}


                    {/* =================================================
                        IMAGE
                    ================================================= */}

                    {isImage && document.fileUrl && (

                        <div className="document-viewer-image-wrapper">

                            <img
                                src={document.fileUrl}
                                alt={fileName}
                                className="document-viewer-image"
                            />

                        </div>

                    )}


                    {/* =================================================
                        PREVIEW UNAVAILABLE
                    ================================================= */}

                    {!isPdf &&
                        !isImage && (

                            <div className="document-viewer-unsupported">

                                <HiOutlineDocumentText />

                                <h2>
                                    Preview unavailable
                                </h2>

                                <p>
                                    This document type cannot be
                                    previewed directly.
                                </p>


                                {document.fileUrl && (

                                    <a
                                        href={document.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="document-viewer-download"
                                    >

                                        <HiOutlineDownload />

                                        Download document

                                    </a>

                                )}

                            </div>

                        )}


                    {/* =================================================
                        PDF PREVIEW FAILED
                    ================================================= */}

                    {isPdf && !previewUrl && (

                        <div className="document-viewer-unsupported">

                            <HiOutlineDocumentText />

                            <h2>
                                Preview unavailable
                            </h2>

                            <p>
                                The document could not be rendered.
                                Please download it instead.
                            </p>


                            {document.fileUrl && (

                                <a
                                    href={document.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="document-viewer-download"
                                >

                                    <HiOutlineDownload />

                                    <HiOutlineDownload />

                                    Download document

                                </a>

                            )}

                        </div>

                    )}

                </div>

            </section>

        </main>

    );

};


export default DocumentViewer;