
import React, { useRef, useState } from "react";
import {
    HiArrowRight,
    HiArrowUpTray,
    HiCheckCircle,
    HiChevronDown,
    HiClock,
    HiDocumentText,
    HiEnvelope,
    HiExclamationCircle,
    HiGlobeAlt,
    HiIdentification,
    HiMapPin,
    HiPhone,
    HiShieldCheck,
    HiTrash,
    HiUser,
    HiAcademicCap,
    HiXMark,
} from "react-icons/hi2";

import "./AustraliaTraineeApprenticeship.css";
import australiaTrainingBg from "../../../assets/australia-training-bg.png";

/**
 * IMPORTANT
 *
 * The backend upload endpoint must be implemented before applications
 * can actually be submitted and emailed.
 *
 * Set VITE_API_URL in the frontend .env file to your backend base URL.
 *
 * Example:
 * VITE_API_URL=http://localhost:5000
 *
 * This component expects the backend endpoint:
 * POST /api/public/australia-trainee-applications
 *
 * The backend must accept multipart/form-data and send the application
 * details and uploaded documents to admin@colossusmigration.com.
 */

const API_BASE_URL = (
    import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

const APPLICATION_ENDPOINT =
    `${API_BASE_URL}/api/public/australia-trainee-applications`;

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_TOTAL_FILE_SIZE = 15 * 1024 * 1024;
const MAX_FILES = 5;

const ALLOWED_FILE_TYPES = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const ALLOWED_EXTENSIONS = [".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx"];

const PROGRAMMES = [
    {
        id: "automotive-technical",
        title: "Automotive & Technical",
        description:
            "Explore practical training pathways in automotive and technical fields.",
        icon: "⚙️",
    },
    {
        id: "business-management",
        title: "Business & Management",
        description:
            "Explore business operations, administration and management training.",
        icon: "📊",
    },
    {
        id: "construction-trades",
        title: "Construction & Trades",
        description:
            "Discover practical training options across construction and skilled trades.",
        icon: "🏗️",
    },
    {
        id: "aged-care-support",
        title: "Aged Care & Support",
        description:
            "Explore training pathways in care, community support and related fields.",
        icon: "🤝",
    },
    {
        id: "information-technology",
        title: "Information Technology",
        description:
            "Explore IT training options and technology-related career pathways.",
        icon: "💻",
    },
];

const APPLICATION_STEPS = [
    {
        number: "01",
        title: "Complete your application",
        description:
            "Provide your personal information, education background and preferred training programme.",
    },
    {
        number: "02",
        title: "Upload your documents",
        description:
            "Attach the available identification, educational and supporting documents requested.",
    },
    {
        number: "03",
        title: "Application review",
        description:
            "The Colossus team reviews the information submitted and assesses the appropriate next steps.",
    },
    {
        number: "04",
        title: "Receive further guidance",
        description:
            "Eligible applicants can receive guidance on programme requirements, providers and subsequent steps.",
    },
];

const FAQS = [
    {
        question: "Who can apply?",
        answer:
            "Applicants should have a genuine interest in vocational training or apprenticeship opportunities in Australia. Eligibility depends on the selected programme, training provider and applicable requirements.",
    },
    {
        question: "Which programmes are available?",
        answer:
            "The programmes highlighted on this page include Automotive & Technical, Business & Management, Construction & Trades, Aged Care & Support, and Information Technology. Availability depends on the provider and intake.",
    },
    {
        question: "What documents should I upload?",
        answer:
            "You can submit your available passport or identification document, CV, educational certificates, academic transcripts and other relevant supporting documents. Only upload documents you are comfortable sharing for this application.",
    },
    {
        question: "Does submitting an application guarantee admission?",
        answer:
            "No. Submitting an application does not guarantee eligibility, admission, placement, employment, a stipend or visa approval. Each outcome depends on the applicable requirements and decisions.",
    },
    {
        question: "Is a stipend guaranteed?",
        answer:
            "No. Any stipend is subject to the specific programme, provider, placement arrangement and applicable terms. Details must be confirmed before you make a commitment.",
    },
    {
        question: "What happens after I submit my documents?",
        answer:
            "Your application will be reviewed after successful submission. The team can then contact you about your information, programme suitability and any additional documents required.",
    },
];

const INITIAL_FORM = {
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    countryOfResidence: "",
    programme: "",
    education: "",
    workExperience: "",
    passportStatus: "",
    message: "",
    consent: false,
};

function formatFileSize(bytes) {
    if (bytes < 1024 * 1024) {
        return `${Math.ceil(bytes / 1024)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function validateFile(file) {
    const extension = `.${file.name.split(".").pop().toLowerCase()}`;

    if (!ALLOWED_EXTENSIONS.includes(extension)) {
        return "This file format is not supported. Upload PDF, JPG, PNG, DOC or DOCX files.";
    }

    if (file.size > MAX_FILE_SIZE) {
        return `This file exceeds the 5 MB limit: ${file.name}`;
    }

    if (file.size === 0) {
        return `This file is empty: ${file.name}`;
    }

    if (
        file.type &&
        !ALLOWED_FILE_TYPES.includes(file.type) &&
        ![".jpg", ".jpeg", ".png", ".doc", ".docx", ".pdf"].includes(extension)
    ) {
        return `Unsupported file type: ${file.name}`;
    }

    return null;
}

function EnquiryModal({ onClose }) {
    const [form, setForm] = useState(INITIAL_FORM);
    const [files, setFiles] = useState([]);
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState("idle");
    const [serverMessage, setServerMessage] = useState("");
    const [reference, setReference] = useState("");

    const fileInputRef = useRef(null);

    const selectedProgramme = PROGRAMMES.find(
        (programme) => programme.id === form.programme
    );

    const totalFileSize = files.reduce((total, file) => total + file.size, 0);

    function updateField(event) {
        const { name, value, type, checked } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: type === "checkbox" ? checked : value,
        }));

        setErrors((previous) => ({
            ...previous,
            [name]: "",
            submit: "",
        }));
    }

    function handleFileSelection(event) {
        const incomingFiles = Array.from(event.target.files || []);

        if (!incomingFiles.length) {
            return;
        }

        const nextFiles = [...files];
        const fileErrors = [];

        incomingFiles.forEach((file) => {
            const validationError = validateFile(file);

            if (validationError) {
                fileErrors.push(validationError);
                return;
            }

            const alreadySelected = nextFiles.some(
                (existingFile) =>
                    existingFile.name === file.name &&
                    existingFile.size === file.size &&
                    existingFile.lastModified === file.lastModified
            );

            if (alreadySelected) {
                return;
            }

            if (nextFiles.length >= MAX_FILES) {
                fileErrors.push(`You can upload a maximum of ${MAX_FILES} documents.`);
                return;
            }

            const proposedTotal = nextFiles.reduce(
                (total, existingFile) => total + existingFile.size,
                0
            );

            if (proposedTotal + file.size > MAX_TOTAL_FILE_SIZE) {
                fileErrors.push("Your documents cannot exceed 15 MB in total.");
                return;
            }

            nextFiles.push(file);
        });

        setFiles(nextFiles);

        setErrors((previous) => ({
            ...previous,
            files: fileErrors.join(" "),
            submit: "",
        }));

        // Clear the input so the same file can be selected again if removed.
        event.target.value = "";
    }

    function removeFile(indexToRemove) {
        setFiles((previous) =>
            previous.filter((_, index) => index !== indexToRemove)
        );

        setErrors((previous) => ({
            ...previous,
            files: "",
            submit: "",
        }));
    }

    function validateForm() {
        const nextErrors = {};

        if (!form.fullName.trim()) {
            nextErrors.fullName = "Enter your full name.";
        }

        if (!form.email.trim()) {
            nextErrors.email = "Enter your email address.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
            nextErrors.email = "Enter a valid email address.";
        }

        if (!form.phone.trim()) {
            nextErrors.phone = "Enter your phone number.";
        }

        if (!form.countryOfResidence.trim()) {
            nextErrors.countryOfResidence = "Enter your country of residence.";
        }

        if (!form.programme) {
            nextErrors.programme = "Select your preferred programme.";
        }

        if (!form.education) {
            nextErrors.education = "Select your highest education level.";
        }

        if (!files.length) {
            nextErrors.files =
                "Upload at least one supporting document before submitting.";
        }

        if (!form.consent) {
            nextErrors.consent =
                "Please confirm that the information you provided is accurate and that you consent to its use for application review.";
        }

        if (totalFileSize > MAX_TOTAL_FILE_SIZE) {
            nextErrors.files = "Your documents cannot exceed 15 MB in total.";
        }

        setErrors(nextErrors);

        return Object.keys(nextErrors).length === 0;
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (status === "submitting") {
            return;
        }

        if (!validateForm()) {
            setServerMessage("");
            return;
        }

        setStatus("submitting");
        setServerMessage("");
        setReference("");

        try {
            const payload = new FormData();

            Object.entries(form).forEach(([key, value]) => {
                if (key === "consent") {
                    payload.append(key, value ? "true" : "false");
                } else {
                    payload.append(key, String(value ?? "").trim());
                }
            });

            if (selectedProgramme) {
                payload.append("programmeTitle", selectedProgramme.title);
            }

            files.forEach((file) => {
                payload.append("documents", file);
            });

            const response = await fetch(APPLICATION_ENDPOINT, {
                method: "POST",
                body: payload,
            });

            let result = {};

            try {
                result = await response.json();
            } catch {
                result = {};
            }

            if (!response.ok || result.success === false) {
                throw new Error(
                    result.message ||
                    "Your application could not be submitted. Please try again."
                );
            }

            setReference(
                result.reference ||
                result.referenceNumber ||
                result.application?.reference ||
                ""
            );

            setServerMessage(
                result.message ||
                "Your application has been submitted successfully."
            );

            setStatus("success");
        } catch (error) {
            setStatus("error");

            setServerMessage(
                error.message ||
                "We could not submit your application. Please check your connection and try again."
            );
        }
    }

    return (
        <div
            className="auta-modal-backdrop"
            role="presentation"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget && status !== "submitting") {
                    onClose();
                }
            }}
        >
            <section
                className="auta-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="auta-application-title"
            >
                <button
                    type="button"
                    className="auta-modal-close"
                    onClick={onClose}
                    aria-label="Close application"
                    disabled={status === "submitting"}
                >
                    <HiXMark />
                </button>

                {status === "success" ? (
                    <div className="auta-success-state">
                        <div className="auta-success-icon">
                            <HiCheckCircle />
                        </div>

                        <span className="auta-eyebrow">APPLICATION RECEIVED</span>

                        <h2 id="auta-application-title">
                            Thank you for applying.
                        </h2>

                        <p>{serverMessage}</p>

                        {reference && (
                            <div className="auta-reference-box">
                                <span>Application reference</span>
                                <strong>{reference}</strong>
                            </div>
                        )}

                        <p className="auta-success-note">
                            Please keep your application reference if one was provided.
                            The team can contact you if further information is required.
                        </p>

                        <button
                            type="button"
                            className="auta-btn auta-btn-primary"
                            onClick={onClose}
                        >
                            Done <HiArrowRight />
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="auta-modal-header">
                            <span className="auta-eyebrow">AUSTRALIA TRAINING PROGRAMME</span>

                            <h2 id="auta-application-title">
                                Start your application
                            </h2>

                            <p>
                                Complete your details and upload your supporting documents
                                for review by the Colossus team.
                            </p>
                        </div>

                        {status === "error" && (
                            <div className="auta-form-alert auta-form-alert-error" role="alert">
                                <HiExclamationCircle />
                                <span>{serverMessage}</span>
                            </div>
                        )}

                        <form
                            className="auta-application-form"
                            onSubmit={handleSubmit}
                            noValidate
                        >
                            <div className="auta-form-section">
                                <div className="auta-form-section-heading">
                                    <HiUser />
                                    <div>
                                        <h3>Personal information</h3>
                                        <p>Tell us how to identify and contact you.</p>
                                    </div>
                                </div>

                                <div className="auta-form-grid">
                                    <div className="auta-form-field auta-form-field-full">
                                        <label htmlFor="auta-fullName">
                                            Full name <span>*</span>
                                        </label>

                                        <input
                                            id="auta-fullName"
                                            name="fullName"
                                            type="text"
                                            autoComplete="name"
                                            placeholder="Enter your full name"
                                            value={form.fullName}
                                            onChange={updateField}
                                            aria-invalid={Boolean(errors.fullName)}
                                        />

                                        {errors.fullName && (
                                            <small className="auta-field-error">
                                                {errors.fullName}
                                            </small>
                                        )}
                                    </div>

                                    <div className="auta-form-field">
                                        <label htmlFor="auta-email">
                                            Email address <span>*</span>
                                        </label>

                                        <input
                                            id="auta-email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            placeholder="you@example.com"
                                            value={form.email}
                                            onChange={updateField}
                                            aria-invalid={Boolean(errors.email)}
                                        />

                                        {errors.email && (
                                            <small className="auta-field-error">
                                                {errors.email}
                                            </small>
                                        )}
                                    </div>

                                    <div className="auta-form-field">
                                        <label htmlFor="auta-phone">
                                            Phone number <span>*</span>
                                        </label>

                                        <input
                                            id="auta-phone"
                                            name="phone"
                                            type="tel"
                                            autoComplete="tel"
                                            placeholder="+234..."
                                            value={form.phone}
                                            onChange={updateField}
                                            aria-invalid={Boolean(errors.phone)}
                                        />

                                        {errors.phone && (
                                            <small className="auta-field-error">
                                                {errors.phone}
                                            </small>
                                        )}
                                    </div>

                                    <div className="auta-form-field">
                                        <label htmlFor="auta-dateOfBirth">
                                            Date of birth
                                        </label>

                                        <input
                                            id="auta-dateOfBirth"
                                            name="dateOfBirth"
                                            type="date"
                                            autoComplete="bday"
                                            value={form.dateOfBirth}
                                            onChange={updateField}
                                        />
                                    </div>

                                    <div className="auta-form-field">
                                        <label htmlFor="auta-countryOfResidence">
                                            Country of residence <span>*</span>
                                        </label>

                                        <input
                                            id="auta-countryOfResidence"
                                            name="countryOfResidence"
                                            type="text"
                                            autoComplete="country-name"
                                            placeholder="e.g. Nigeria"
                                            value={form.countryOfResidence}
                                            onChange={updateField}
                                            aria-invalid={Boolean(errors.countryOfResidence)}
                                        />

                                        {errors.countryOfResidence && (
                                            <small className="auta-field-error">
                                                {errors.countryOfResidence}
                                            </small>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="auta-form-section">
                                <div className="auta-form-section-heading">
                                    <HiAcademicCap />
                                    <div>
                                        <h3>Education and programme</h3>
                                        <p>Help us understand your background and interests.</p>
                                    </div>
                                </div>

                                <div className="auta-form-grid">
                                    <div className="auta-form-field auta-form-field-full">
                                        <label htmlFor="auta-programme">
                                            Preferred training programme <span>*</span>
                                        </label>

                                        <div className="auta-select-wrap">
                                            <select
                                                id="auta-programme"
                                                name="programme"
                                                value={form.programme}
                                                onChange={updateField}
                                                aria-invalid={Boolean(errors.programme)}
                                            >
                                                <option value="">Choose a programme</option>

                                                {PROGRAMMES.map((programme) => (
                                                    <option key={programme.id} value={programme.id}>
                                                        {programme.title}
                                                    </option>
                                                ))}
                                            </select>

                                            <HiChevronDown />
                                        </div>

                                        {errors.programme && (
                                            <small className="auta-field-error">
                                                {errors.programme}
                                            </small>
                                        )}

                                        {selectedProgramme && (
                                            <div className="auta-selected-programme">
                                                <span>{selectedProgramme.icon}</span>
                                                <div>
                                                    <strong>{selectedProgramme.title}</strong>
                                                    <p>{selectedProgramme.description}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="auta-form-field">
                                        <label htmlFor="auta-education">
                                            Highest education level <span>*</span>
                                        </label>

                                        <div className="auta-select-wrap">
                                            <select
                                                id="auta-education"
                                                name="education"
                                                value={form.education}
                                                onChange={updateField}
                                                aria-invalid={Boolean(errors.education)}
                                            >
                                                <option value="">Select education level</option>
                                                <option value="secondary">Secondary school</option>
                                                <option value="certificate">Certificate</option>
                                                <option value="diploma">Diploma / ND / HND</option>
                                                <option value="bachelors">Bachelor's degree</option>
                                                <option value="postgraduate">
                                                    Postgraduate degree
                                                </option>
                                                <option value="other">Other</option>
                                            </select>

                                            <HiChevronDown />
                                        </div>

                                        {errors.education && (
                                            <small className="auta-field-error">
                                                {errors.education}
                                            </small>
                                        )}
                                    </div>

                                    <div className="auta-form-field">
                                        <label htmlFor="auta-workExperience">
                                            Work experience
                                        </label>

                                        <div className="auta-select-wrap">
                                            <select
                                                id="auta-workExperience"
                                                name="workExperience"
                                                value={form.workExperience}
                                                onChange={updateField}
                                            >
                                                <option value="">Select experience</option>
                                                <option value="none">No work experience</option>
                                                <option value="less-than-1">
                                                    Less than 1 year
                                                </option>
                                                <option value="1-3">1–3 years</option>
                                                <option value="3-5">3–5 years</option>
                                                <option value="5-plus">5+ years</option>
                                            </select>

                                            <HiChevronDown />
                                        </div>
                                    </div>

                                    <div className="auta-form-field auta-form-field-full">
                                        <label htmlFor="auta-passportStatus">
                                            International passport status
                                        </label>

                                        <div className="auta-select-wrap">
                                            <select
                                                id="auta-passportStatus"
                                                name="passportStatus"
                                                value={form.passportStatus}
                                                onChange={updateField}
                                            >
                                                <option value="">Select passport status</option>
                                                <option value="valid">I have a valid passport</option>
                                                <option value="expired">
                                                    I have an expired passport
                                                </option>
                                                <option value="processing">
                                                    My passport application is in progress
                                                </option>
                                                <option value="none">
                                                    I do not have a passport yet
                                                </option>
                                            </select>

                                            <HiChevronDown />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="auta-form-section">
                                <div className="auta-form-section-heading">
                                    <HiDocumentText />
                                    <div>
                                        <h3>Supporting documents</h3>
                                        <p>
                                            Upload up to {MAX_FILES} documents. Each file must be
                                            5 MB or smaller.
                                        </p>
                                    </div>
                                </div>

                                <div className="auta-upload-guidance">
                                    <HiIdentification />

                                    <div>
                                        <strong>Documents you may provide</strong>

                                        <p>
                                            Passport or identification, CV, educational certificates,
                                            academic transcripts and other relevant supporting
                                            documents.
                                        </p>
                                    </div>
                                </div>

                                <input
                                    ref={fileInputRef}
                                    className="auta-file-input"
                                    type="file"
                                    multiple
                                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                    onChange={handleFileSelection}
                                    aria-label="Choose supporting documents"
                                />

                                <button
                                    type="button"
                                    className="auta-upload-dropzone"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={status === "submitting" || files.length >= MAX_FILES}
                                >
                                    <span className="auta-upload-icon">
                                        <HiArrowUpTray />
                                    </span>

                                    <strong>
                                        {files.length >= MAX_FILES
                                            ? "Maximum number of files reached"
                                            : "Click to upload your documents"}
                                    </strong>

                                    <span>
                                        PDF, JPG, PNG, DOC or DOCX · Max 5 MB per file
                                    </span>

                                    <span className="auta-upload-button-text">
                                        Choose files
                                    </span>
                                </button>

                                {errors.files && (
                                    <small className="auta-field-error auta-file-error">
                                        {errors.files}
                                    </small>
                                )}

                                {files.length > 0 && (
                                    <div className="auta-uploaded-files">
                                        <div className="auta-uploaded-files-heading">
                                            <strong>Selected documents ({files.length})</strong>

                                            <span>
                                                {formatFileSize(totalFileSize)} / 15 MB
                                            </span>
                                        </div>

                                        {files.map((file, index) => (
                                            <div
                                                className="auta-uploaded-file"
                                                key={`${file.name}-${file.lastModified}-${index}`}
                                            >
                                                <span className="auta-uploaded-file-icon">
                                                    <HiDocumentText />
                                                </span>

                                                <div className="auta-uploaded-file-info">
                                                    <strong>{file.name}</strong>
                                                    <span>{formatFileSize(file.size)}</span>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => removeFile(index)}
                                                    aria-label={`Remove ${file.name}`}
                                                    disabled={status === "submitting"}
                                                >
                                                    <HiTrash />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="auta-upload-privacy">
                                    <HiShieldCheck />

                                    <p>
                                        Your documents contain personal information. Only submit
                                        files relevant to your application. The backend must
                                        securely process the files and restrict access to
                                        authorised personnel.
                                    </p>
                                </div>
                            </div>

                            <div className="auta-form-section">
                                <div className="auta-form-section-heading">
                                    <HiEnvelope />
                                    <div>
                                        <h3>Additional information</h3>
                                        <p>Tell us anything else we should know.</p>
                                    </div>
                                </div>

                                <div className="auta-form-field">
                                    <label htmlFor="auta-message">
                                        Additional information
                                    </label>

                                    <textarea
                                        id="auta-message"
                                        name="message"
                                        rows="4"
                                        placeholder="Tell us about your training interests, goals or questions..."
                                        value={form.message}
                                        onChange={updateField}
                                    />
                                </div>
                            </div>

                            <div className="auta-consent-field">
                                <label>
                                    <input
                                        type="checkbox"
                                        name="consent"
                                        checked={form.consent}
                                        onChange={updateField}
                                        aria-invalid={Boolean(errors.consent)}
                                    />

                                    <span>
                                        I confirm that the information I have provided is accurate
                                        and consent to Colossus Migration & Tours using my
                                        information and documents to review and respond to this
                                        application. <strong>*</strong>
                                    </span>
                                </label>

                                {errors.consent && (
                                    <small className="auta-field-error">
                                        {errors.consent}
                                    </small>
                                )}
                            </div>

                            {errors.submit && (
                                <div className="auta-form-alert auta-form-alert-error">
                                    <HiExclamationCircle />
                                    <span>{errors.submit}</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                className="auta-btn auta-btn-primary auta-submit-button"
                                disabled={status === "submitting"}
                            >
                                {status === "submitting" ? (
                                    <>
                                        <span className="auta-spinner" />
                                        Submitting application...
                                    </>
                                ) : (
                                    <>
                                        Submit application
                                        <HiArrowRight />
                                    </>
                                )}
                            </button>

                            <p className="auta-form-footnote">
                                Submission is subject to review. It does not guarantee
                                admission, placement, employment, a stipend or visa approval.
                            </p>
                        </form>
                    </>
                )}
            </section>
        </div>
    );
}

function PostEnquiryModal({ onClose }) {
    return (
        <div
            className="auta-modal-backdrop"
            role="presentation"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <section
                className="auta-modal auta-post-enquiry-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="auta-enquiry-success-title"
            >
                <button
                    type="button"
                    className="auta-modal-close"
                    onClick={onClose}
                    aria-label="Close"
                >
                    <HiXMark />
                </button>

                <div className="auta-success-state">
                    <div className="auta-success-icon">
                        <HiCheckCircle />
                    </div>

                    <span className="auta-eyebrow">APPLICATION INFORMATION</span>

                    <h2 id="auta-enquiry-success-title">
                        Your next step starts here.
                    </h2>

                    <p>
                        When you are ready, complete the application form and upload your
                        supporting documents so the team can review your information.
                    </p>

                    <button
                        type="button"
                        className="auta-btn auta-btn-primary"
                        onClick={onClose}
                    >
                        Continue <HiArrowRight />
                    </button>
                </div>
            </section>
        </div>
    );
}

export default function AustraliaTraineeApprenticeship() {
    const [showApplication, setShowApplication] = useState(false);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [openFaq, setOpenFaq] = useState(0);

    function openApplication() {
        setShowInfoModal(false);
        setShowApplication(true);
    }

    return (
        <main className="auta-page">
            {/* HERO */}
            <section
                className="auta-hero"
                style={{
                    backgroundImage: `linear-gradient(90deg, rgba(8, 19, 39, 0.94) 0%, rgba(8, 19, 39, 0.79) 48%, rgba(8, 19, 39, 0.35) 100%), url(${australiaTrainingBg})`,
                }}
            >
                <div className="auta-container auta-hero-content">
                    <div className="auta-hero-badge">
                        <HiGlobeAlt />
                        AUSTRALIA TRAINING OPPORTUNITIES
                    </div>

                    <h1>
                        Build practical skills.
                        <br />
                        <span>Explore your future in Australia.</span>
                    </h1>

                    <p>
                        Discover trainee and apprenticeship pathways, explore training
                        options and submit your information for an initial application
                        review with Colossus Migration & Tours.
                    </p>

                    <div className="auta-hero-actions">
                        <button
                            type="button"
                            className="auta-btn auta-btn-primary"
                            onClick={openApplication}
                        >
                            Start your application <HiArrowRight />
                        </button>

                        <a href="#auta-programmes" className="auta-btn auta-btn-outline">
                            Explore programmes
                        </a>
                    </div>

                    <div className="auta-hero-highlights">
                        <div>
                            <HiCheckCircle />
                            <span>Multiple training areas</span>
                        </div>

                        <div>
                            <HiCheckCircle />
                            <span>Application guidance</span>
                        </div>

                        <div>
                            <HiCheckCircle />
                            <span>Document submission</span>
                        </div>
                    </div>
                </div>

                <div className="auta-hero-bottom">
                    <div className="auta-container">
                        <span>TRAINING</span>
                        <span className="auta-hero-bottom-divider" />
                        <span>SKILLS DEVELOPMENT</span>
                        <span className="auta-hero-bottom-divider" />
                        <span>CAREER PATHWAYS</span>
                    </div>
                </div>
            </section>

            {/* INTRODUCTION */}
            <section className="auta-section auta-intro-section">
                <div className="auta-container auta-intro-grid">
                    <div className="auta-intro-copy">
                        <span className="auta-eyebrow">YOUR NEXT CHAPTER</span>

                        <h2>
                            Take the first step towards a
                            <span> practical training pathway.</span>
                        </h2>

                        <p>
                            Australia offers vocational education and training opportunities
                            across a range of industries. The right pathway depends on your
                            background, chosen course, training provider and eligibility.
                        </p>

                        <p>
                            Colossus Migration & Tours helps prospective applicants
                            understand the process and identify the next steps relevant to
                            their circumstances.
                        </p>

                        <button
                            type="button"
                            className="auta-text-link"
                            onClick={openApplication}
                        >
                            Begin your application <HiArrowRight />
                        </button>
                    </div>

                    <div className="auta-intro-card">
                        <div className="auta-intro-card-icon">
                            <HiAcademicCap />
                        </div>

                        <h3>Your application journey</h3>

                        <p>
                            Tell us about yourself, choose an area of interest and upload
                            relevant supporting documents for review.
                        </p>

                        <ul>
                            <li>
                                <HiCheckCircle />
                                Personal and education details
                            </li>

                            <li>
                                <HiCheckCircle />
                                Preferred training area
                            </li>

                            <li>
                                <HiCheckCircle />
                                Supporting documentation
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* PROGRAMMES */}
            <section
                className="auta-section auta-programmes-section"
                id="auta-programmes"
            >
                <div className="auta-container">
                    <div className="auta-section-heading">
                        <span className="auta-eyebrow">EXPLORE YOUR OPTIONS</span>

                        <h2>
                            Find a training area that
                            <span> fits your interests.</span>
                        </h2>

                        <p>
                            Explore the areas below and select your preferred programme
                            when completing the application form.
                        </p>
                    </div>

                    <div className="auta-programme-grid">
                        {PROGRAMMES.map((programme, index) => (
                            <article
                                className="auta-programme-card"
                                key={programme.id}
                            >
                                <div className="auta-programme-card-top">
                                    <span className="auta-programme-number">
                                        0{index + 1}
                                    </span>

                                    <span className="auta-programme-icon">
                                        {programme.icon}
                                    </span>
                                </div>

                                <h3>{programme.title}</h3>

                                <p>{programme.description}</p>

                                <button
                                    type="button"
                                    className="auta-text-link"
                                    onClick={openApplication}
                                >
                                    Apply in this area <HiArrowRight />
                                </button>
                            </article>
                        ))}
                    </div>

                    <div className="auta-programmes-note">
                        <HiExclamationCircle />

                        <p>
                            Programme availability, course duration, fees and entry
                            requirements vary by training provider. Your preferred programme
                            will need to be checked against current availability.
                        </p>
                    </div>
                </div>
            </section>

            {/* DURATION AND STIPEND */}
            <section className="auta-section auta-duration-section">
                <div className="auta-container auta-duration-grid">
                    <div>
                        <span className="auta-eyebrow">PLAN WITH CLARITY</span>

                        <h2>
                            Understand the
                            <span> programme requirements.</span>
                        </h2>

                        <p>
                            Course duration, fees, placement arrangements and any financial
                            benefits depend on the particular programme and provider.
                            Confirm these details before committing to a course.
                        </p>

                        <button
                            type="button"
                            className="auta-btn auta-btn-primary"
                            onClick={openApplication}
                        >
                            Discuss your options <HiArrowRight />
                        </button>
                    </div>

                    <div className="auta-duration-cards">
                        <article className="auta-duration-card">
                            <div className="auta-duration-icon">
                                <HiClock />
                            </div>

                            <h3>Course duration</h3>

                            <p>
                                Duration varies according to the qualification, training
                                provider and course structure.
                            </p>
                        </article>

                        <article className="auta-duration-card">
                            <div className="auta-duration-icon">
                                <HiAcademicCap />
                            </div>

                            <h3>Training arrangements</h3>

                            <p>
                                Confirm whether the programme involves classroom study,
                                practical training or a formal apprenticeship arrangement.
                            </p>
                        </article>

                        <article className="auta-duration-card">
                            <div className="auta-duration-icon">
                                <HiShieldCheck />
                            </div>

                            <h3>Stipend and benefits</h3>

                            <p>
                                Any stipend or other benefit is subject to the applicable
                                provider, placement and programme terms. It is not guaranteed.
                            </p>
                        </article>

                        <article className="auta-duration-card">
                            <div className="auta-duration-icon">
                                <HiDocumentText />
                            </div>

                            <h3>Course fees</h3>

                            <p>
                                Obtain written confirmation of tuition, additional costs,
                                payment conditions and any applicable refund policy.
                            </p>
                        </article>
                    </div>
                </div>
            </section>

            {/* ELIGIBILITY */}
            <section className="auta-section auta-eligibility-section">
                <div className="auta-container auta-eligibility-grid">
                    <div className="auta-eligibility-main">
                        <span className="auta-eyebrow">BE PREPARED</span>

                        <h2>
                            Is this pathway
                            <span> right for you?</span>
                        </h2>

                        <p>
                            Your suitability depends on the course requirements, your
                            qualifications, your circumstances and the applicable
                            immigration rules.
                        </p>

                        <button
                            type="button"
                            className="auta-btn auta-btn-primary"
                            onClick={openApplication}
                        >
                            Submit your details <HiArrowRight />
                        </button>
                    </div>

                    <div className="auta-eligibility-list">
                        <div>
                            <HiCheckCircle />
                            <span>
                                <strong>Educational background</strong>
                                Be ready to provide your qualifications and transcripts.
                            </span>
                        </div>

                        <div>
                            <HiCheckCircle />
                            <span>
                                <strong>Training interests</strong>
                                Identify the industry or programme you wish to explore.
                            </span>
                        </div>

                        <div>
                            <HiCheckCircle />
                            <span>
                                <strong>Supporting documents</strong>
                                Prepare identification and other relevant records.
                            </span>
                        </div>

                        <div>
                            <HiCheckCircle />
                            <span>
                                <strong>Readiness for assessment</strong>
                                Be prepared to discuss course requirements, fees and next steps.
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* APPLICATION PROCESS */}
            <section className="auta-section auta-process-section">
                <div className="auta-container">
                    <div className="auta-section-heading">
                        <span className="auta-eyebrow">HOW IT WORKS</span>

                        <h2>
                            From application to
                            <span> the next steps.</span>
                        </h2>

                        <p>
                            Start by providing your details and the documents available to
                            you. The team can then review your submission.
                        </p>
                    </div>

                    <div className="auta-process-grid">
                        {APPLICATION_STEPS.map((step) => (
                            <article className="auta-process-card" key={step.number}>
                                <span className="auta-process-number">
                                    {step.number}
                                </span>

                                <h3>{step.title}</h3>

                                <p>{step.description}</p>
                            </article>
                        ))}
                    </div>

                    <div className="auta-process-cta">
                        <div>
                            <h3>Ready to get started?</h3>

                            <p>
                                Complete the application form and provide your supporting
                                documents for review.
                            </p>
                        </div>

                        <button
                            type="button"
                            className="auta-btn auta-btn-primary"
                            onClick={openApplication}
                        >
                            Start application <HiArrowRight />
                        </button>
                    </div>
                </div>
            </section>

            {/* REFUND INFORMATION */}
            <section className="auta-section auta-refund-section">
                <div className="auta-container auta-refund-card">
                    <div className="auta-refund-icon">
                        <HiShieldCheck />
                    </div>

                    <div>
                        <span className="auta-eyebrow">UNDERSTAND THE TERMS</span>

                        <h2>Review refund conditions before paying.</h2>

                        <p>
                            Any visa-refusal refund arrangement depends on the written
                            policy of the participating provider and the specific fees
                            covered. Confirm the eligible amounts, exclusions, process and
                            timelines in writing before making a payment.
                        </p>

                        <p>
                            Do not assume that every payment, service fee or third-party
                            expense is refundable.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="auta-btn auta-btn-primary"
                        onClick={openApplication}
                    >
                        Make an enquiry <HiArrowRight />
                    </button>
                </div>
            </section>

            {/* FAQ */}
            <section className="auta-section auta-faq-section" id="auta-faq">
                <div className="auta-container auta-faq-grid">
                    <div className="auta-faq-intro">
                        <span className="auta-eyebrow">COMMON QUESTIONS</span>

                        <h2>
                            Questions before
                            <span> you apply?</span>
                        </h2>

                        <p>
                            Here are some important things to understand before submitting
                            your application.
                        </p>

                        <button
                            type="button"
                            className="auta-text-link"
                            onClick={openApplication}
                        >
                            Contact the team <HiArrowRight />
                        </button>
                    </div>

                    <div className="auta-faq-list">
                        {FAQS.map((faq, index) => {
                            const isOpen = openFaq === index;

                            return (
                                <article
                                    className={`auta-faq-item ${isOpen ? "is-open" : ""}`}
                                    key={faq.question}
                                >
                                    <button
                                        type="button"
                                        className="auta-faq-question"
                                        onClick={() => setOpenFaq(isOpen ? -1 : index)}
                                        aria-expanded={isOpen}
                                    >
                                        <span>{faq.question}</span>

                                        <HiChevronDown />
                                    </button>

                                    {isOpen && (
                                        <div className="auta-faq-answer">
                                            <p>{faq.answer}</p>
                                        </div>
                                    )}
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* FINAL CTA */}
            <section className="auta-section auta-final-cta">
                <div className="auta-container auta-final-cta-inner">
                    <span className="auta-eyebrow">YOUR JOURNEY STARTS HERE</span>

                    <h2>
                        Take the first step towards
                        <span> your training goals.</span>
                    </h2>

                    <p>
                        Tell us about your background, select your preferred training
                        area and upload your supporting documents for review.
                    </p>

                    <button
                        type="button"
                        className="auta-btn auta-btn-light"
                        onClick={openApplication}
                    >
                        Start your application <HiArrowRight />
                    </button>
                </div>
            </section>

            {/* CONTACT */}
            <section className="auta-section auta-contact-section">
                <div className="auta-container auta-contact-grid">
                    <div>
                        <span className="auta-eyebrow">COLossus MIGRATION & TOURS</span>

                        <h2>Need guidance before applying?</h2>

                        <p>
                            You can contact our team with questions about the application
                            process and the information you need to prepare.
                        </p>
                    </div>

                    <div className="auta-contact-details">
                        <a href="mailto:admin@colossusmigration.com">
                            <span>
                                <HiEnvelope />
                            </span>

                            <div>
                                <small>Email us</small>
                                <strong>admin@colossusmigration.com</strong>
                            </div>
                        </a>

                        <div className="auta-contact-detail-note">
                            <span>
                                <HiMapPin />
                            </span>

                            <div>
                                <small>Programme</small>
                                <strong>Australia trainee & apprenticeship pathways</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* DISCLAIMER */}
            <section className="auta-disclaimer-section">
                <div className="auta-container">
                    <HiShieldCheck />

                    <p>
                        <strong>Important information:</strong> Programme availability,
                        admission, course fees, stipends, employment opportunities and
                        immigration outcomes depend on the relevant provider, programme
                        conditions and applicable requirements. Submitting an application
                        does not guarantee admission, placement, employment, a stipend,
                        permanent residency or visa approval. Confirm all material terms
                        in writing before making financial commitments.
                    </p>
                </div>
            </section>

            {/* APPLICATION MODAL */}
            {showApplication && (
                <EnquiryModal onClose={() => setShowApplication(false)} />
            )}

            {showInfoModal && (
                <PostEnquiryModal onClose={() => setShowInfoModal(false)} />
            )}
        </main>
    );
}

