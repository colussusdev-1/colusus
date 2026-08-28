import { useRef, useState } from "react";

import {
    HiOutlineArrowLeft,
    HiOutlineCheckCircle,
    HiOutlineChevronDown,
    HiOutlineDocumentText,
    HiOutlineExclamationCircle,
    HiOutlineUpload,
    HiOutlineX,
} from "react-icons/hi";

import documentService from "../../../../services/document.service";

import "./DocumentUpload.css";


/*
============================================================
DOCUMENT TYPES
============================================================
*/

const DOCUMENT_TYPES = [
    {
        value: "PASSPORT",
        label: "Passport",
    },
    {
        value: "IDENTIFICATION",
        label: "Identification Document",
    },
    {
        value: "ACADEMIC_CERTIFICATE",
        label: "Academic Certificate",
    },
    {
        value: "FINANCIAL_DOCUMENT",
        label: "Financial Document",
    },
    {
        value: "EMPLOYMENT_DOCUMENT",
        label: "Employment Document",
    },
    {
        value: "OTHER",
        label: "Other Document",
    },
];


/*
============================================================
FILE CONFIGURATION
============================================================
*/

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_FILE_TYPES = [
    "application/pdf",
    "image/jpeg",
    "image/png",
];


/*
============================================================
FORMAT APPLICATION TYPE
============================================================
*/

const formatApplicationType = (type) => {

    if (!type) {
        return "Migration Application";
    }

    return type
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(
            /\b\w/g,
            (letter) => letter.toUpperCase()
        );

};


/*
============================================================
FORMAT FILE SIZE
============================================================
*/

const formatFileSize = (bytes) => {

    if (!bytes || bytes <= 0) {
        return "0 KB";
    }

    if (bytes < 1024) {
        return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

};


/*
============================================================
APPLICATION LABEL
============================================================
*/

const getApplicationLabel = (application) => {

    if (!application) {
        return "";
    }

    const country =
        application.destinationCountry ||
        "Unknown Destination";

    const type =
        formatApplicationType(
            application.type
        );

    return `${country} · ${type}`;

};


/*
============================================================
DOCUMENT UPLOAD
============================================================
*/

const DocumentUpload = ({
    applications = [],
    onClose,
    onSuccess,
    defaultApplicationId = "",
}) => {

    const fileInputRef = useRef(null);


    /*
    ========================================================
    STATE
    ========================================================
    */

    const [applicationId, setApplicationId] =
        useState(
            defaultApplicationId ||
            (
                applications.length === 1
                    ? applications[0]._id
                    : ""
            )
        );

    const [documentName, setDocumentName] =
        useState("");

    const [documentType, setDocumentType] =
        useState("");

    const [selectedFile, setSelectedFile] =
        useState(null);

    const [uploading, setUploading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    /*
    ========================================================
    FILE SELECTION
    ========================================================
    */

    const handleFileChange = (event) => {

        const file =
            event.target.files?.[0];

        setError("");

        setSuccess("");


        if (!file) {

            setSelectedFile(null);

            return;

        }


        /*
        ----------------------------------------------------
        FILE TYPE
        ----------------------------------------------------
        */

        if (
            !ALLOWED_FILE_TYPES.includes(
                file.type
            )
        ) {

            setError(
                "Please select a PDF, JPG or PNG file."
            );

            event.target.value = "";

            setSelectedFile(null);

            return;

        }


        /*
        ----------------------------------------------------
        FILE SIZE
        ----------------------------------------------------
        */

        if (
            file.size > MAX_FILE_SIZE
        ) {

            setError(
                "The selected file is larger than 10 MB."
            );

            event.target.value = "";

            setSelectedFile(null);

            return;

        }


        setSelectedFile(file);

    };


    /*
    ========================================================
    OPEN FILE PICKER
    ========================================================
    */

    const openFilePicker = () => {

        if (uploading) {
            return;
        }

        fileInputRef.current?.click();

    };


    /*
    ========================================================
    REMOVE FILE
    ========================================================
    */

    const removeSelectedFile = () => {

        if (uploading) {
            return;
        }

        setSelectedFile(null);

        setError("");

        setSuccess("");


        if (fileInputRef.current) {

            fileInputRef.current.value = "";

        }

    };


    /*
    ========================================================
    VALIDATE FORM
    ========================================================
    */

    const validateForm = () => {

        if (!applicationId) {

            return "Please select an application.";

        }


        if (!documentName.trim()) {

            return "Please enter a document name.";

        }


        if (!documentType) {

            return "Please select a document type.";

        }


        if (!selectedFile) {

            return "Please select a document file.";

        }


        return "";

    };


    /*
    ========================================================
    SUBMIT DOCUMENT
    ========================================================
    */

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");

        setSuccess("");


        /*
        ----------------------------------------------------
        VALIDATION
        ----------------------------------------------------
        */

        const validationError =
            validateForm();


        if (validationError) {

            setError(
                validationError
            );

            return;

        }


        try {

            setUploading(true);


            /*
            ==================================================
            MULTIPART FORM DATA
            ==================================================
            */

            const formData =
                new FormData();


            formData.append(
                "application",
                applicationId
            );


            formData.append(
                "name",
                documentName.trim()
            );


            formData.append(
                "type",
                documentType
            );


            formData.append(
                "file",
                selectedFile
            );


            /*
            ==================================================
            UPLOAD
            ==================================================

            Frontend
                ↓
            documentService
                ↓
            Backend
                ↓
            Multer
                ↓
            Cloudinary
                ↓
            MongoDB
            ==================================================
            */

            const document =
                await documentService.createDocument(
                    formData
                );


            /*
            --------------------------------------------------
            SUCCESS
            --------------------------------------------------
            */

            setSuccess(
                "Document uploaded successfully."
            );


            /*
            --------------------------------------------------
            REFRESH PARENT DOCUMENT LIST
            --------------------------------------------------
            */

            if (onSuccess) {

                await onSuccess(
                    document
                );

            }


            /*
            --------------------------------------------------
            CLOSE AFTER SUCCESS
            --------------------------------------------------
            */

            setTimeout(() => {

                if (onClose) {

                    onClose();

                }

            }, 500);


        } catch (error) {

            console.error(
                "FAILED TO UPLOAD DOCUMENT:",
                error
            );


            setError(
                error.response?.data?.message ||
                "Unable to upload this document. Please try again."
            );

        } finally {

            setUploading(false);

        }

    };


    /*
    ========================================================
    CANCEL
    ========================================================
    */

    const handleCancel = () => {

        if (uploading) {
            return;
        }

        if (onClose) {

            onClose();

        }

    };


    /*
    ========================================================
    SELECTED APPLICATION
    ========================================================
    */

    const selectedApplication =
        applications.find(
            (application) =>
                application._id === applicationId
        );


    /*
    ========================================================
    RENDER
    ========================================================
    */

    return (

        <div
            className="document-upload-overlay"
            onMouseDown={(event) => {

                if (
                    event.target ===
                    event.currentTarget
                ) {

                    handleCancel();

                }

            }}
        >

            <section
                className="document-upload-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="document-upload-title"
            >


                {/* =================================================
                    MODAL HEADER
                ================================================= */}

                <header className="document-upload-modal-header">

                    <div>

                        <button
                            type="button"
                            className="document-upload-back"
                            onClick={handleCancel}
                            disabled={uploading}
                        >

                            <HiOutlineArrowLeft />

                            <span>
                                Documents
                            </span>

                        </button>


                        <span className="document-upload-eyebrow">
                            SECURE DOCUMENT UPLOAD
                        </span>


                        <h2 id="document-upload-title">
                            Upload a Document
                        </h2>


                        <p>
                            Submit a document for your migration application.
                        </p>

                    </div>


                    <button
                        type="button"
                        className="document-upload-close"
                        onClick={handleCancel}
                        disabled={uploading}
                        aria-label="Close upload"
                    >

                        <HiOutlineX />

                    </button>

                </header>


                {/* =================================================
                    SECURITY
                ================================================= */}

                <div className="document-upload-security">

                    <div className="document-upload-security-icon">

                        <HiOutlineCheckCircle />

                    </div>


                    <div>

                        <strong>
                            Your documents are protected
                        </strong>

                        <p>
                            Documents uploaded to Colusus are securely
                            associated with your migration application.
                        </p>

                    </div>

                </div>


                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (

                    <div className="document-upload-message error">

                        <HiOutlineExclamationCircle />

                        <span>
                            {error}
                        </span>

                    </div>

                )}


                {/* =================================================
                    SUCCESS
                ================================================= */}

                {success && (

                    <div className="document-upload-message success">

                        <HiOutlineCheckCircle />

                        <span>
                            {success}
                        </span>

                    </div>

                )}


                {/* =================================================
                    FORM
                ================================================= */}

                <form
                    className="document-upload-form"
                    onSubmit={handleSubmit}
                >


                    {/* =================================================
                        APPLICATION
                    ================================================= */}

                    <div className="document-upload-field">

                        <label htmlFor="document-application">
                            Application
                        </label>


                        <div className="document-upload-select">

                            <select
                                id="document-application"
                                value={applicationId}
                                onChange={(event) =>
                                    setApplicationId(
                                        event.target.value
                                    )
                                }
                                disabled={uploading}
                            >

                                <option value="">
                                    Select an application
                                </option>


                                {applications.map(
                                    (application) => (

                                        <option
                                            key={application._id}
                                            value={application._id}
                                        >

                                            {getApplicationLabel(
                                                application
                                            )}

                                        </option>

                                    )
                                )}

                            </select>


                            <HiOutlineChevronDown />

                        </div>


                        {selectedApplication && (

                            <span className="document-upload-field-hint">

                                {selectedApplication.destinationCountry}

                                {" · "}

                                {formatApplicationType(
                                    selectedApplication.type
                                )}

                            </span>

                        )}

                    </div>


                    {/* =================================================
                        DOCUMENT NAME
                    ================================================= */}

                    <div className="document-upload-field">

                        <label htmlFor="document-name">
                            Document Name
                        </label>


                        <input
                            id="document-name"
                            type="text"
                            value={documentName}
                            onChange={(event) =>
                                setDocumentName(
                                    event.target.value
                                )
                            }
                            placeholder="e.g. International Passport"
                            disabled={uploading}
                            autoComplete="off"
                        />

                    </div>


                    {/* =================================================
                        DOCUMENT TYPE
                    ================================================= */}

                    <div className="document-upload-field">

                        <label htmlFor="document-type">
                            Document Type
                        </label>


                        <div className="document-upload-select">

                            <select
                                id="document-type"
                                value={documentType}
                                onChange={(event) =>
                                    setDocumentType(
                                        event.target.value
                                    )
                                }
                                disabled={uploading}
                            >

                                <option value="">
                                    Select document type
                                </option>


                                {DOCUMENT_TYPES.map(
                                    (type) => (

                                        <option
                                            key={type.value}
                                            value={type.value}
                                        >

                                            {type.label}

                                        </option>

                                    )
                                )}

                            </select>


                            <HiOutlineChevronDown />

                        </div>

                    </div>


                    {/* =================================================
                        DOCUMENT FILE
                    ================================================= */}

                    <div className="document-upload-field">

                        <label>
                            Document File
                        </label>


                        <input
                            ref={fileInputRef}
                            type="file"
                            className="document-upload-hidden-input"
                            accept="
                                .pdf,
                                .jpg,
                                .jpeg,
                                .png,
                                application/pdf,
                                image/jpeg,
                                image/png
                            "
                            onChange={handleFileChange}
                            disabled={uploading}
                        />


                        {!selectedFile ? (

                            <button
                                type="button"
                                className="document-dropzone"
                                onClick={openFilePicker}
                                disabled={uploading}
                            >

                                <span className="document-dropzone-icon">

                                    <HiOutlineUpload />

                                </span>


                                <span className="document-dropzone-content">

                                    <strong>
                                        Choose a document
                                    </strong>

                                    <span>
                                        PDF, JPG or PNG · Maximum 10 MB
                                    </span>

                                </span>


                                <span className="document-dropzone-action">
                                    Browse
                                </span>

                            </button>

                        ) : (

                            <div className="document-selected-file">

                                <div className="document-selected-file-icon">

                                    <HiOutlineDocumentText />

                                </div>


                                <div className="document-selected-file-info">

                                    <strong>
                                        {selectedFile.name}
                                    </strong>


                                    <span>
                                        {formatFileSize(
                                            selectedFile.size
                                        )}
                                    </span>

                                </div>


                                <button
                                    type="button"
                                    className="document-remove-file"
                                    onClick={removeSelectedFile}
                                    disabled={uploading}
                                    aria-label="Remove selected file"
                                >

                                    <HiOutlineX />

                                </button>

                            </div>

                        )}

                    </div>


                    {/* =================================================
                        ACTIONS
                    ================================================= */}

                    <div className="document-upload-actions">

                        <button
                            type="button"
                            className="document-upload-cancel"
                            onClick={handleCancel}
                            disabled={uploading}
                        >

                            Cancel

                        </button>


                        <button
                            type="submit"
                            className="document-upload-submit"
                            disabled={uploading}
                        >

                            {uploading ? (

                                <>
                                    <span className="document-upload-spinner" />

                                    Uploading...
                                </>

                            ) : (

                                <>
                                    <HiOutlineUpload />

                                    Upload Document
                                </>

                            )}

                        </button>

                    </div>

                </form>

            </section>

        </div>

    );

};


export default DocumentUpload;