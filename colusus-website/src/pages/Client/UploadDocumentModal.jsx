import { useEffect, useRef, useState } from "react";

import {
    HiOutlineX,
    HiOutlineUpload,
    HiOutlineDocumentText,
    HiOutlineExclamationCircle,
} from "react-icons/hi";

import "./UploadDocumentModal.css";


const UploadDocumentModal = ({
    isOpen,
    onClose,
    onUpload,
}) => {

    const fileInputRef = useRef(null);


    const [documentType, setDocumentType] = useState("");

    const [selectedFile, setSelectedFile] = useState(null);

    const [dragActive, setDragActive] = useState(false);

    const [error, setError] = useState("");



    /*
    ============================================================
    RESET
    ============================================================
    */

    const resetForm = () => {

        setDocumentType("");

        setSelectedFile(null);

        setDragActive(false);

        setError("");

        if (fileInputRef.current) {

            fileInputRef.current.value = "";

        }

    };



    /*
    ============================================================
    CLOSE
    ============================================================
    */

    const handleClose = () => {

        resetForm();

        onClose();

    };



    /*
    ============================================================
    ESCAPE
    ============================================================
    */

    useEffect(() => {

        if (!isOpen) return;


        const handleEscape = (event) => {

            if (event.key === "Escape") {

                handleClose();

            }

        };


        document.addEventListener(
            "keydown",
            handleEscape
        );


        return () => {

            document.removeEventListener(
                "keydown",
                handleEscape
            );

        };

    }, [isOpen]);



    /*
    ============================================================
    BODY SCROLL
    ============================================================
    */

    useEffect(() => {

        if (!isOpen) return;


        const previousOverflow =
            document.body.style.overflow;


        document.body.style.overflow = "hidden";


        return () => {

            document.body.style.overflow =
                previousOverflow;

        };

    }, [isOpen]);



    /*
    ============================================================
    FILE VALIDATION
    ============================================================
    */

    const validateFile = (file) => {

        if (!file) return false;


        const allowedTypes = [

            "application/pdf",

            "image/jpeg",

            "image/png",

            "image/webp",

        ];


        const maxSize =
            10 * 1024 * 1024;


        if (!allowedTypes.includes(file.type)) {

            setError(
                "Please upload a PDF, JPG, PNG, or WEBP file."
            );

            return false;

        }


        if (file.size > maxSize) {

            setError(
                "File size must not exceed 10MB."
            );

            return false;

        }


        setError("");

        return true;

    };



    /*
    ============================================================
    SELECT FILE
    ============================================================
    */

    const handleFile = (file) => {

        if (!validateFile(file)) {

            setSelectedFile(null);

            return;

        }


        setSelectedFile(file);

    };



    /*
    ============================================================
    FILE INPUT
    ============================================================
    */

    const handleFileChange = (event) => {

        const file =
            event.target.files?.[0];


        handleFile(file);

    };



    /*
    ============================================================
    DRAG EVENTS
    ============================================================
    */

    const handleDragOver = (event) => {

        event.preventDefault();

        event.stopPropagation();

        setDragActive(true);

    };


    const handleDragLeave = (event) => {

        event.preventDefault();

        event.stopPropagation();

        setDragActive(false);

    };


    const handleDrop = (event) => {

        event.preventDefault();

        event.stopPropagation();

        setDragActive(false);


        const file =
            event.dataTransfer.files?.[0];


        handleFile(file);

    };



    /*
    ============================================================
    REMOVE FILE
    ============================================================
    */

    const handleRemoveFile = () => {

        setSelectedFile(null);

        setError("");


        if (fileInputRef.current) {

            fileInputRef.current.value = "";

        }

    };



    /*
    ============================================================
    SUBMIT
    ============================================================
    */

    const handleSubmit = async (event) => {

        event.preventDefault();


        if (!documentType) {

            setError(
                "Please select a document type."
            );

            return;

        }


        if (!selectedFile) {

            setError(
                "Please select a document to upload."
            );

            return;

        }


        /*
        --------------------------------------------------------
        TEMPORARY FRONTEND HANDLER

        Later this will call:

        POST /api/v1/documents
        --------------------------------------------------------
        */

        if (onUpload) {

            await onUpload({

                documentType,

                file: selectedFile,

            });

        }


        handleClose();

    };



    if (!isOpen) {

        return null;

    }



    return (

        <div
            className="upload-modal-overlay"
            onMouseDown={(event) => {

                if (
                    event.target ===
                    event.currentTarget
                ) {

                    handleClose();

                }

            }}
        >


            <div
                className="upload-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="upload-document-title"
            >


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="upload-modal-header">

                    <div>

                        <span className="upload-modal-eyebrow">
                            DOCUMENT MANAGEMENT
                        </span>

                        <h2 id="upload-document-title">
                            Upload Document
                        </h2>

                        <p>
                            Add a document to your migration
                            application.
                        </p>

                    </div>


                    <button
                        type="button"
                        className="upload-modal-close"
                        onClick={handleClose}
                        aria-label="Close upload modal"
                    >

                        <HiOutlineX />

                    </button>

                </div>



                {/* =================================================
                    FORM
                ================================================= */}

                <form
                    className="upload-modal-form"
                    onSubmit={handleSubmit}
                >


                    {/* DOCUMENT TYPE */}

                    <div className="upload-field">

                        <label htmlFor="documentType">

                            Document Type

                            <span>
                                *
                            </span>

                        </label>


                        <select
                            id="documentType"
                            value={documentType}
                            onChange={(event) => {

                                setDocumentType(
                                    event.target.value
                                );

                                setError("");

                            }}
                        >

                            <option value="">
                                Select document type
                            </option>

                            <option value="passport">
                                International Passport
                            </option>

                            <option value="education">
                                Degree / Certificate
                            </option>

                            <option value="transcript">
                                Academic Transcript
                            </option>

                            <option value="cv">
                                Curriculum Vitae
                            </option>

                            <option value="employment">
                                Employment Reference
                            </option>

                            <option value="proof_of_funds">
                                Proof of Funds
                            </option>

                            <option value="police_clearance">
                                Police Clearance Certificate
                            </option>

                            <option value="passport_photo">
                                Passport Photograph
                            </option>

                            <option value="marriage_certificate">
                                Marriage Certificate
                            </option>

                            <option value="other">
                                Other Document
                            </option>

                        </select>

                    </div>



                    {/* FILE UPLOAD */}

                    <div className="upload-field">

                        <label>

                            Document File

                            <span>
                                *
                            </span>

                        </label>


                        <div
                            className={`upload-dropzone ${dragActive
                                    ? "drag-active"
                                    : ""
                                } ${selectedFile
                                    ? "has-file"
                                    : ""
                                }`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => {

                                if (!selectedFile) {

                                    fileInputRef.current?.click();

                                }

                            }}
                        >


                            {!selectedFile && (

                                <>

                                    <div className="upload-drop-icon">

                                        <HiOutlineUpload />

                                    </div>


                                    <strong>
                                        Drop your document here
                                    </strong>


                                    <p>
                                        or click to browse your device
                                    </p>


                                    <span className="upload-file-help">

                                        PDF, JPG, PNG or WEBP ·
                                        Maximum 10MB

                                    </span>

                                </>

                            )}


                            {selectedFile && (

                                <div className="selected-file">

                                    <div className="selected-file-icon">

                                        <HiOutlineDocumentText />

                                    </div>


                                    <div className="selected-file-info">

                                        <strong>
                                            {selectedFile.name}
                                        </strong>

                                        <span>
                                            {(
                                                selectedFile.size /
                                                (1024 * 1024)
                                            ).toFixed(2)}{" "}
                                            MB
                                        </span>

                                    </div>


                                    <button
                                        type="button"
                                        className="remove-file"
                                        onClick={(event) => {

                                            event.stopPropagation();

                                            handleRemoveFile();

                                        }}
                                    >

                                        <HiOutlineX />

                                    </button>

                                </div>

                            )}


                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png,.webp"
                                onChange={handleFileChange}
                            />

                        </div>

                    </div>



                    {/* ERROR */}

                    {error && (

                        <div className="upload-error">

                            <HiOutlineExclamationCircle />

                            <span>
                                {error}
                            </span>

                        </div>

                    )}



                    {/* ACTIONS */}

                    <div className="upload-modal-actions">

                        <button
                            type="button"
                            className="upload-cancel"
                            onClick={handleClose}
                        >

                            Cancel

                        </button>


                        <button
                            type="submit"
                            className="upload-submit"
                        >

                            <HiOutlineUpload />

                            Upload Document

                        </button>

                    </div>


                </form>


            </div>

        </div>

    );

};


export default UploadDocumentModal;