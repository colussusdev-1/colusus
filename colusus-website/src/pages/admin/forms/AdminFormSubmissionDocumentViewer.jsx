
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    HiArrowLeft,
    HiOutlineDownload,
    HiOutlineDocumentText,
    HiOutlineExclamationCircle,
} from "react-icons/hi";

import api from "../../../services/api";
import "./AdminFormSubmissionDocumentViewer.css";

const getFileType = (document) => {
    const format = String(
        document?.format || "",
    ).toLowerCase();

    const name = String(
        document?.name || "",
    ).toLowerCase();

    const isPdf =
        format === "pdf" ||
        name.endsWith(".pdf");

    if (isPdf) {
        return "pdf";
    }

    const imageFormats = [
        "jpg",
        "jpeg",
        "png",
        "webp",
        "gif",
    ];

    const isImage =
        document?.resourceType === "image" ||
        imageFormats.includes(format) ||
        imageFormats.some((extension) =>
            name.endsWith(`.${extension}`),
        );

    if (isImage) {
        return "image";
    }

    return "unsupported";
};

function AdminFormSubmissionDocumentViewer() {
    const {
        submissionId,
        documentId,
    } = useParams();

    const navigate = useNavigate();

    const [submission, setSubmission] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [fileLoading, setFileLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [fileError, setFileError] =
        useState("");

    const [fileUrl, setFileUrl] =
        useState("");

    /*
    |--------------------------------------------------------------------------
    | LOAD SUBMISSION
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (!submissionId) {
            return;
        }

        let cancelled = false;

        const loadSubmission = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get(
                    `/form-submissions/${submissionId}`,
                );

                const responseData =
                    response?.data || {};

                const submissionData =
                    responseData.data ||
                    responseData.submission ||
                    null;

                if (!cancelled) {
                    setSubmission(
                        submissionData,
                    );
                }
            } catch (requestError) {
                if (!cancelled) {
                    setError(
                        requestError?.response
                            ?.data?.message ||
                        "Unable to load this document.",
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        loadSubmission();

        return () => {
            cancelled = true;
        };
    }, [submissionId]);

    /*
    |--------------------------------------------------------------------------
    | SELECT DOCUMENT
    |--------------------------------------------------------------------------
    */

    const selectedDocument = useMemo(() => {
        if (
            !Array.isArray(
                submission?.documents,
            )
        ) {
            return null;
        }

        return submission.documents.find(
            (document) =>
                String(document?._id) ===
                String(documentId),
        );
    }, [
        submission,
        documentId,
    ]);

    /*
    |--------------------------------------------------------------------------
    | FILE TYPE
    |--------------------------------------------------------------------------
    */

    const fileType = useMemo(() => {
        return getFileType(
            selectedDocument,
        );
    }, [selectedDocument]);

    /*
    |--------------------------------------------------------------------------
    | LOAD DOCUMENT THROUGH BACKEND
    |--------------------------------------------------------------------------
    |
    | IMPORTANT:
    |
    | We do NOT request selectedDocument.url here.
    |
    | The browser requests our authenticated API.
    | The backend retrieves the restricted Cloudinary
    | file and returns it to us.
    |
    */

    useEffect(() => {
        if (
            !submissionId ||
            !documentId ||
            !selectedDocument ||
            fileType === "unsupported"
        ) {
            setFileUrl("");
            return undefined;
        }

        let cancelled = false;
        let objectUrl = null;

        const loadDocument = async () => {
            try {
                setFileLoading(true);
                setFileError("");
                setFileUrl("");

                const response =
                    await api.get(
                        `/form-submissions/${submissionId}/documents/${documentId}/view`,
                        {
                            responseType: "blob",
                        },
                    );

                if (cancelled) {
                    return;
                }

                const blob =
                    response?.data;

                if (
                    !blob ||
                    blob.size === 0
                ) {
                    throw new Error(
                        "The document returned an empty file.",
                    );
                }

                objectUrl =
                    URL.createObjectURL(
                        blob,
                    );

                setFileUrl(
                    objectUrl,
                );
            } catch (requestError) {
                if (!cancelled) {
                    let message =
                        "Unable to load the document.";

                    if (
                        requestError?.response
                            ?.status === 401
                    ) {
                        message =
                            "You are not authorised to view this document.";
                    } else if (
                        requestError?.response
                            ?.status === 403
                    ) {
                        message =
                            "You do not have permission to view this document.";
                    } else if (
                        requestError?.response
                            ?.status === 404
                    ) {
                        message =
                            "This document could not be found.";
                    } else if (
                        requestError?.response
                            ?.status === 502
                    ) {
                        message =
                            "The document storage service could not provide this file.";
                    } else if (
                        requestError?.message
                    ) {
                        message =
                            requestError.message;
                    }

                    setFileError(
                        message,
                    );
                }
            } finally {
                if (!cancelled) {
                    setFileLoading(false);
                }
            }
        };

        loadDocument();

        return () => {
            cancelled = true;

            if (objectUrl) {
                URL.revokeObjectURL(
                    objectUrl,
                );
            }
        };
    }, [
        submissionId,
        documentId,
        selectedDocument,
        fileType,
    ]);

    /*
    |--------------------------------------------------------------------------
    | DOWNLOAD
    |--------------------------------------------------------------------------
    |
    | Downloads through the same authenticated backend
    | endpoint instead of exposing Cloudinary.
    |
    */

    const handleDownload = async () => {
        if (
            !submissionId ||
            !documentId
        ) {
            return;
        }

        try {
            setFileError("");

            const response =
                await api.get(
                    `/form-submissions/${submissionId}/documents/${documentId}/view`,
                    {
                        responseType: "blob",
                    },
                );

            const blob =
                response?.data;

            if (
                !blob ||
                blob.size === 0
            ) {
                throw new Error(
                    "The document is empty.",
                );
            }

            const downloadUrl =
                URL.createObjectURL(
                    blob,
                );

            const link =
                window.document.createElement(
                    "a",
                );

            link.href =
                downloadUrl;

            link.download =
                selectedDocument?.name ||
                "document";

            window.document.body.appendChild(
                link,
            );

            link.click();

            link.remove();

            setTimeout(() => {
                URL.revokeObjectURL(
                    downloadUrl,
                );
            }, 1000);
        } catch (requestError) {
            setFileError(
                requestError?.response
                    ?.data?.message ||
                requestError?.message ||
                "Unable to download this document.",
            );
        }
    };

    /*
    |--------------------------------------------------------------------------
    | LOADING
    |--------------------------------------------------------------------------
    */

    if (loading) {
        return (
            <div className="admin-form-document-viewer">
                <div className="admin-form-document-viewer-loading">
                    <div className="admin-form-document-viewer-spinner" />

                    <span>
                        Loading document...
                    </span>
                </div>
            </div>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | SUBMISSION / DOCUMENT ERROR
    |--------------------------------------------------------------------------
    */

    if (
        error ||
        !submission ||
        !selectedDocument
    ) {
        return (
            <div className="admin-form-document-viewer">
                <div className="admin-form-document-viewer-error">
                    <div className="admin-form-document-viewer-error-icon">
                        <HiOutlineExclamationCircle />
                    </div>

                    <h1>
                        Document unavailable
                    </h1>

                    <p>
                        {error ||
                            "The requested document could not be found."}
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            navigate(-1)
                        }
                        className="admin-form-document-viewer-back"
                    >
                        <HiArrowLeft />
                        Back to submission
                    </button>
                </div>
            </div>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | VIEWER
    |--------------------------------------------------------------------------
    */

    return (
        <div className="admin-form-document-viewer">
            <header className="admin-form-document-viewer-header">
                <div className="admin-form-document-viewer-header-left">
                    <button
                        type="button"
                        className="admin-form-document-viewer-back-button"
                        onClick={() =>
                            navigate(-1)
                        }
                    >
                        <HiArrowLeft />
                        Back
                    </button>

                    <div className="admin-form-document-viewer-title">
                        <div className="admin-form-document-viewer-icon">
                            <HiOutlineDocumentText />
                        </div>

                        <div>
                            <span>
                                Submitted document
                            </span>

                            <h1>
                                {selectedDocument.name ||
                                    "Document"}
                            </h1>
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={
                        handleDownload
                    }
                    disabled={
                        fileLoading
                    }
                    className="admin-form-document-viewer-download"
                >
                    <HiOutlineDownload />

                    {fileLoading
                        ? "Loading..."
                        : "Download"}
                </button>
            </header>

            <main className="admin-form-document-viewer-content">
                {fileType === "pdf" && (
                    <div className="admin-form-document-pdf">
                        {fileLoading && (
                            <div className="admin-form-document-loading">
                                <div className="admin-form-document-viewer-spinner" />

                                <span>
                                    Loading PDF...
                                </span>
                            </div>
                        )}

                        {fileError && (
                            <div className="admin-form-document-viewer-error">
                                <div className="admin-form-document-viewer-error-icon">
                                    <HiOutlineExclamationCircle />
                                </div>

                                <h2>
                                    Unable to preview PDF
                                </h2>

                                <p>
                                    {fileError}
                                </p>

                                <button
                                    type="button"
                                    onClick={
                                        handleDownload
                                    }
                                    className="admin-form-document-viewer-download"
                                >
                                    <HiOutlineDownload />
                                    Download PDF
                                </button>
                            </div>
                        )}

                        {!fileLoading &&
                            !fileError &&
                            fileUrl && (
                                <iframe
                                    src={
                                        fileUrl
                                    }
                                    title={
                                        selectedDocument.name ||
                                        "Submitted document"
                                    }
                                />
                            )}
                    </div>
                )}

                {fileType === "image" && (
                    <div className="admin-form-document-image">
                        {fileLoading && (
                            <div className="admin-form-document-loading">
                                <div className="admin-form-document-viewer-spinner" />

                                <span>
                                    Loading document...
                                </span>
                            </div>
                        )}

                        {fileError && (
                            <div className="admin-form-document-viewer-error">
                                <div className="admin-form-document-viewer-error-icon">
                                    <HiOutlineExclamationCircle />
                                </div>

                                <h2>
                                    Unable to load image
                                </h2>

                                <p>
                                    {fileError}
                                </p>
                            </div>
                        )}

                        {!fileLoading &&
                            !fileError &&
                            fileUrl && (
                                <img
                                    src={
                                        fileUrl
                                    }
                                    alt={
                                        selectedDocument.name ||
                                        "Submitted document"
                                    }
                                />
                            )}
                    </div>
                )}

                {fileType ===
                    "unsupported" && (
                        <div className="admin-form-document-unsupported">
                            <div className="admin-form-document-unsupported-icon">
                                <HiOutlineDocumentText />
                            </div>

                            <h2>
                                Preview unavailable
                            </h2>

                            <p>
                                This file type cannot
                                be previewed inside the
                                admin interface.
                            </p>

                            <button
                                type="button"
                                onClick={
                                    handleDownload
                                }
                                className="admin-form-document-viewer-download"
                            >
                                <HiOutlineDownload />
                                Download document
                            </button>
                        </div>
                    )}
            </main>

            <footer className="admin-form-document-viewer-footer">
                <span>
                    {submission.formName ||
                        "Form submission"}
                </span>

                <span>•</span>

                <span>
                    {selectedDocument.type ||
                        "DOCUMENT"}
                </span>
            </footer>
        </div>
    );
}

export default AdminFormSubmissionDocumentViewer;

