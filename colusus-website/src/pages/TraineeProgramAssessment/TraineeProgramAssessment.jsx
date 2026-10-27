
import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    ClipboardCheck,
    GraduationCap,
    ShieldCheck,
    UserRound,
    LockKeyhole,
    ArrowUpRight,
    Mail,
    Upload,
    FileText,
    X,
    Info,
} from "lucide-react";
import "./TraineeProgramAssessment.css";

const API_BASE_URL = (
    import.meta.env.VITE_API_URL || "/api/v1"
).replace(/\/$/, "");

const ASSESSMENT_ENDPOINT = `${API_BASE_URL}/assessments`;


const ASSESSMENT_DRAFT_DB = "colossus_assessment_drafts";
const ASSESSMENT_DRAFT_STORE = "drafts";
const ASSESSMENT_DRAFT_KEY = "pending-assessment-v1";

function getAuthToken() {
    const keys = ["colossus_token", "token", "accessToken", "authToken", "access_token"];
    for (const key of keys) {
        try {
            const value = localStorage.getItem(key);
            if (value) return value;
        } catch {
            // Storage may be unavailable in restricted browser contexts.
        }
    }

    try {
        const user = JSON.parse(localStorage.getItem("user") || "null");
        return user?.token || user?.accessToken || null;
    } catch {
        return null;
    }
}

function openAssessmentDraftDB() {
    return new Promise((resolve, reject) => {
        if (!("indexedDB" in window)) {
            reject(new Error("This browser cannot securely preserve your assessment draft. Please use a modern browser."));
            return;
        }

        const request = indexedDB.open(ASSESSMENT_DRAFT_DB, 1);
        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains(ASSESSMENT_DRAFT_STORE)) {
                db.createObjectStore(ASSESSMENT_DRAFT_STORE);
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error || new Error("Could not open assessment draft storage."));
    });
}

async function saveAssessmentDraft(draft) {
    const db = await openAssessmentDraftDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(ASSESSMENT_DRAFT_STORE, "readwrite");
        transaction.objectStore(ASSESSMENT_DRAFT_STORE).put(draft, ASSESSMENT_DRAFT_KEY);
        transaction.oncomplete = () => { db.close(); resolve(); };
        transaction.onerror = () => { db.close(); reject(transaction.error || new Error("Could not save your assessment draft.")); };
        transaction.onabort = () => { db.close(); reject(transaction.error || new Error("Could not save your assessment draft.")); };
    });
}

async function loadAssessmentDraft() {
    const db = await openAssessmentDraftDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(ASSESSMENT_DRAFT_STORE, "readonly");
        const request = transaction.objectStore(ASSESSMENT_DRAFT_STORE).get(ASSESSMENT_DRAFT_KEY);
        request.onsuccess = () => { db.close(); resolve(request.result || null); };
        request.onerror = () => { db.close(); reject(request.error || new Error("Could not restore your assessment draft.")); };
    });
}

async function clearAssessmentDraft() {
    try {
        const db = await openAssessmentDraftDB();
        await new Promise((resolve, reject) => {
            const transaction = db.transaction(ASSESSMENT_DRAFT_STORE, "readwrite");
            transaction.objectStore(ASSESSMENT_DRAFT_STORE).delete(ASSESSMENT_DRAFT_KEY);
            transaction.oncomplete = resolve;
            transaction.onerror = () => reject(transaction.error);
        });
        db.close();
    } catch (error) {
        console.warn("Could not clear assessment draft:", error);
    }
}

const initialForm = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    nationality: "Nigerian",
    currentCountry: "Nigeria",
    highestEducation: "",
    fieldOfStudy: "",
    yearsOfExperience: "",
    englishLevel: "",
    preferredTrainingArea: "",
    preferredIntake: "",
    passportStatus: "",
    budget: "",
    additionalInformation: "",
    consentToContact: false,
};

function getErrorMessage(error, body) {
    return (
        body?.message ||
        body?.error ||
        error?.message ||
        "We could not submit your assessment. Please check your connection and try again."
    );
}

function getCountryName(opportunity, opportunitySlug) {
    const explicitCountry =
        opportunity?.country?.name ||
        opportunity?.countryName ||
        opportunity?.destinationCountry;

    if (explicitCountry) return explicitCountry;

    const slug = String(opportunitySlug || "").toLowerCase();

    if (slug.includes("new-zealand") || slug.includes("newzealand")) {
        return "New Zealand";
    }

    if (slug.includes("australia")) {
        return "Australia";
    }

    return "your selected destination";
}

function calculateAge(dateOfBirth) {
    if (!dateOfBirth) return null;

    const birthDate = new Date(`${dateOfBirth}T00:00:00`);
    const today = new Date();

    if (Number.isNaN(birthDate.getTime()) || birthDate > today) {
        return null;
    }

    let age = today.getFullYear() - birthDate.getFullYear();

    const birthdayHasPassed =
        today.getMonth() > birthDate.getMonth() ||
        (
            today.getMonth() === birthDate.getMonth() &&
            today.getDate() >= birthDate.getDate()
        );

    if (!birthdayHasPassed) age--;

    return age;
}

const PASSPORT_STATUS_MAP = {
    VALID: "YES",
    EXPIRED: "YES",
    PROCESSING: "IN_PROGRESS",
    NONE: "NO",
};

const PASSPORT_LABELS = {
    VALID: "Valid international passport",
    EXPIRED: "Expired international passport",
    PROCESSING: "Passport application in progress",
    NONE: "No passport yet",
};

const EXPERIENCE_LABELS = {
    NONE: "No experience yet",
    UNDER_1: "Less than 1 year",
    "1_2": "1–2 years",
    "3_5": "3–5 years",
    "6_PLUS": "6+ years",
};

const EDUCATION_LABELS = {
    SECONDARY: "Secondary school",
    OND_NCE: "OND / NCE",
    HND: "HND",
    BACHELORS: "Bachelor's degree",
    MASTERS: "Master's degree",
    DOCTORATE: "Doctorate",
    OTHER: "Other",
};

const ENGLISH_LABELS = {
    BASIC: "Basic",
    INTERMEDIATE: "Intermediate",
    FLUENT: "Fluent",
    PROFESSIONAL: "Professional / advanced",
    TESTED: "Has an English test result",
};

export default function TraineeProgramAssessment() {
    const location = useLocation();
    const navigate = useNavigate();

    const routeState = location.state || {};
    const opportunity = routeState.opportunity || null;

    const opportunityId =
        routeState.opportunityId ||
        opportunity?._id ||
        opportunity?.id ||
        null;

    const opportunitySlug =
        routeState.opportunitySlug ||
        opportunity?.slug ||
        "";

    const countrySlug =
        routeState.countrySlug ||
        opportunity?.countrySlug ||
        "";

    const programTitle =
        opportunity?.title ||
        routeState.programTitle ||
        "Trainee & Apprenticeship Program";

    const countryName = getCountryName(opportunity, opportunitySlug);
    const isAustralia = countryName.toLowerCase().includes("australia");
    const isNewZealand = countryName.toLowerCase().includes("new zealand");

    const countryLabel = isAustralia
        ? "Australia"
        : isNewZealand
            ? "New Zealand"
            : countryName;

    const programFocus = isAustralia
        ? "Tell us about the trade, workplace, or apprenticeship area you want to pursue in Australia."
        : isNewZealand
            ? "Tell us about the practical training or apprenticeship pathway you want to pursue in New Zealand."
            : "Tell us about your preferred training or apprenticeship pathway.";

    const documentGuidance = isAustralia
        ? "For your initial Australia pathway assessment, upload the documents you already have. You can provide missing documents later."
        : isNewZealand
            ? "For your initial New Zealand pathway assessment, upload the documents you already have. You can provide missing documents later."
            : "Upload the supporting documents you already have. You can provide missing documents later.";

    const documentDefinitions = [
        {
            key: "passport",
            label: "International passport bio-data page",
            shortLabel: "Passport",
            description:
                "A clear image or PDF of the page showing your photo and personal details.",
            required: false,
            accept: ".pdf,.jpg,.jpeg,.png",
        },
        {
            key: "cv",
            label: "CV or résumé",
            shortLabel: "CV / résumé",
            description:
                "Your current CV, including education, skills, and work experience if any.",
            required: true,
            accept: ".pdf,.doc,.docx",
        },
        {
            key: "education",
            label: "Education certificate or transcript",
            shortLabel: "Education",
            description:
                "Your highest qualification certificate, transcript, or school result available.",
            required: true,
            accept: ".pdf,.jpg,.jpeg,.png,.doc,.docx",
        },
        {
            key: "englishTest",
            label: "English test result (if available)",
            shortLabel: "English test",
            description:
                "Upload IELTS, PTE, or another English test result only if you already have one.",
            required: false,
            accept: ".pdf,.jpg,.jpeg,.png",
        },
        {
            key: "experience",
            label: isAustralia
                ? "Trade / work experience evidence (if available)"
                : "Training / work experience evidence (if available)",
            shortLabel: "Experience evidence",
            description: isAustralia
                ? "Examples include trade certificates, employer references, or evidence of practical experience."
                : "Examples include training certificates, employer references, or evidence of practical experience.",
            required: false,
            accept: ".pdf,.jpg,.jpeg,.png,.doc,.docx",
        },
    ];

    const trainingCategories = Array.isArray(
        opportunity?.programDetails?.trainingCategories
    )
        ? opportunity.programDetails.trainingCategories
        : [];

    const trainingOptions = useMemo(() => {
        const names = trainingCategories
            .map((item) =>
                typeof item === "string" ? item : item?.name
            )
            .filter(Boolean);

        return [...new Set(names)];
    }, [trainingCategories]);

    const [form, setForm] = useState(() => ({
        ...initialForm,
        preferredTrainingArea: trainingOptions[0] || "",
    }));

    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [success, setSuccess] = useState(null);

    const [documents, setDocuments] = useState({
        passport: null,
        cv: null,
        education: null,
        englishTest: null,
        experience: null,
        additional: [],
    });

    const [documentErrors, setDocumentErrors] = useState({});

    const [draftRestored, setDraftRestored] = useState(false);
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [authModalMode, setAuthModalMode] = useState("choose");
    const [emailCheckLoading, setEmailCheckLoading] = useState(false);
    const [authenticated, setAuthenticated] = useState(Boolean(getAuthToken()));
    const [returningFromAuth, setReturningFromAuth] = useState(false);
    const submitButtonRef = React.useRef(null);
    const confirmedSubmitRef = React.useRef(false);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const draft = await loadAssessmentDraft();
                if (cancelled || !draft) return;

                if (draft.form) {
                    setForm((current) => ({ ...current, ...draft.form }));
                }
                if (draft.documents) {
                    setDocuments((current) => ({ ...current, ...draft.documents }));
                }
            } catch (error) {
                console.warn("Assessment draft could not be restored:", error);
            } finally {
                if (!cancelled) setDraftRestored(true);
            }
        })();

        return () => { cancelled = true; };
    }, []);

    useEffect(() => {
        const hasToken = Boolean(getAuthToken());
        setAuthenticated(hasToken);

        const cameFromAuth =
            location.state?.source === "trainee-program-assessment" ||
            location.state?.assessmentAuthSuccess === true;

        if (hasToken && cameFromAuth) {
            setReturningFromAuth(true);
            setAuthModalMode("confirm");
            setAuthModalOpen(true);

            window.setTimeout(() => {
                submitButtonRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });
            }, 250);
        }
    }, [location.key, location.state]);

    useEffect(() => {
        if (location.state?.email) {
            setForm((current) => ({
                ...current,
                email: current.email || location.state.email,
            }));
        }
    }, [location.state?.email]);

    const setField = (event) => {
        const { name, value, type, checked } = event.target;

        setForm((current) => ({
            ...current,
            [name]: type === "checkbox" ? checked : value,
        }));

        setErrors((current) => ({
            ...current,
            [name]: "",
        }));

        setSubmitError("");
    };

    const validate = () => {
        const next = {};

        if (!form.firstName.trim()) {
            next.firstName = "Enter your first name.";
        }

        if (!form.lastName.trim()) {
            next.lastName = "Enter your last name.";
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
            next.email = "Enter a valid email address.";
        }

        if (!form.phone.trim()) {
            next.phone = "Enter your phone number.";
        }

        if (!form.dateOfBirth) {
            next.dateOfBirth = "Select your date of birth.";
        } else {
            const age = calculateAge(form.dateOfBirth);

            if (age === null) {
                next.dateOfBirth = "Enter a valid date of birth.";
            } else if (age < 18) {
                next.dateOfBirth =
                    "You must be at least 18 years old to submit this assessment.";
            }
        }

        if (!form.currentCountry.trim()) {
            next.currentCountry = "Enter your country of residence.";
        }

        if (!form.highestEducation) {
            next.highestEducation =
                "Select your highest level of education.";
        }

        if (!form.preferredTrainingArea.trim()) {
            next.preferredTrainingArea =
                "Enter or select your preferred training area.";
        }

        if (!form.preferredIntake.trim()) {
            next.preferredIntake =
                "Enter your preferred intake, or enter 'Flexible'.";
        }

        if (!form.budget.trim()) {
            next.budget =
                "Select your estimated budget or choose 'Not sure yet'.";
        }

        if (!form.passportStatus) {
            next.passportStatus = "Select your passport status.";
        }

        if (!form.consentToContact) {
            next.consentToContact =
                "Consent is required to process this assessment.";
        }

        setErrors(next);

        return Object.keys(next).length === 0;
    };

    const handleDocumentChange = (key, fileList) => {
        const files = Array.from(fileList || []);
        const maxBytes = 10 * 1024 * 1024;
        const allowedExtensions = /\.(pdf|jpe?g|png|docx?)$/i;
        const nextErrors = { ...documentErrors };

        if (key === "additional") {
            const validFiles = [];

            for (const file of files) {
                if (file.size > maxBytes) {
                    nextErrors.additional =
                        "Each file must be 10 MB or smaller.";
                    continue;
                }

                if (!allowedExtensions.test(file.name)) {
                    nextErrors.additional =
                        "Use PDF, JPG, PNG, DOC, or DOCX files.";
                    continue;
                }

                validFiles.push(file);
            }

            setDocuments((current) => ({
                ...current,
                additional: validFiles,
            }));
        } else {
            const file = files[0] || null;

            if (file && file.size > maxBytes) {
                nextErrors[key] = "This file is larger than 10 MB.";

                setDocuments((current) => ({
                    ...current,
                    [key]: null,
                }));
            } else if (file && !allowedExtensions.test(file.name)) {
                nextErrors[key] =
                    "Use PDF, JPG, PNG, DOC, or DOCX files.";

                setDocuments((current) => ({
                    ...current,
                    [key]: null,
                }));
            } else {
                delete nextErrors[key];

                setDocuments((current) => ({
                    ...current,
                    [key]: file,
                }));
            }
        }

        setDocumentErrors(nextErrors);
        setSubmitError("");
    };

    const removeDocument = (key, index = 0) => {
        setDocuments((current) => ({
            ...current,
            [key]:
                key === "additional"
                    ? current.additional.filter(
                        (_, fileIndex) => fileIndex !== index
                    )
                    : null,
        }));

        setDocumentErrors((current) => ({
            ...current,
            [key]: "",
        }));
    };

    const validateDocuments = () => {
        const next = {};

        if (!documents.cv) {
            next.cv = "Please upload your CV or résumé.";
        }

        if (!documents.education) {
            next.education =
                "Please upload an education certificate, transcript, or school result.";
        }

        setDocumentErrors((current) => ({
            ...current,
            ...next,
        }));

        return Object.keys(next).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formIsValid = validate();
        const documentsAreValid = validateDocuments();

        if (!formIsValid || !documentsAreValid) {
            document
                .querySelector(
                    ".assessment-field-error, .assessment-document-error"
                )
                ?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });

            return;
        }

        if (!opportunityId) {
            setSubmitError(
                "We could not identify the selected program. Please return to the program page and try again."
            );
            return;
        }

        const age = calculateAge(form.dateOfBirth);

        if (age === null || age < 18) {
            setSubmitError(
                "Please check your date of birth. Applicants must be at least 18 years old."
            );
            return;
        }

        setSubmitError("");

        const token = getAuthToken();
        setAuthenticated(Boolean(token));

        if (!token) {
            try {
                await saveAssessmentDraft({
                    form,
                    documents,
                    savedAt: new Date().toISOString(),
                    routeState,
                    pathname: location.pathname,
                });
            } catch (draftError) {
                setSubmitError(
                    `${draftError.message || "We could not preserve your draft."} Please keep this page open and try again.`
                );
                return;
            }

            setAuthModalOpen(true);
            setAuthModalMode("choose");
            await checkAccountEmail();
            return;
        }

        // First click after authentication opens a final confirmation modal.
        if (!confirmedSubmitRef.current) {
            setAuthModalMode("confirm");
            setAuthModalOpen(true);
            window.setTimeout(() => {
                submitButtonRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });
            }, 100);
            return;
        }

        setSubmitting(true);

        const fullName = [
            form.firstName.trim(),
            form.lastName.trim(),
        ]
            .filter(Boolean)
            .join(" ");

        const additionalInformation = [
            form.nationality
                ? `Nationality: ${form.nationality}`
                : "",
            form.dateOfBirth
                ? `Date of birth: ${form.dateOfBirth}`
                : "",
            form.englishLevel
                ? `English proficiency: ${ENGLISH_LABELS[form.englishLevel] ||
                form.englishLevel
                }`
                : "",
            form.passportStatus
                ? `Passport status: ${PASSPORT_LABELS[form.passportStatus] ||
                form.passportStatus
                }`
                : "",
            form.additionalInformation.trim(),
        ]
            .filter(Boolean)
            .join("\n\n");

        /*
         * Match the backend Assessment schema:
         * personalDetails, background, preferences and consent.
         */
        const payload = {
            opportunityId,
            opportunitySlug,
            opportunityTitle: programTitle,
            countryName,

            personalDetails: {
                fullName,
                email: form.email.trim().toLowerCase(),
                phone: form.phone.trim(),
                age,
                countryOfResidence: form.currentCountry.trim(),
            },

            background: {
                education: EDUCATION_LABELS[form.highestEducation]
                    ? form.highestEducation
                    : form.highestEducation,
                fieldOfStudy: form.fieldOfStudy.trim(),
                workExperience:
                    EXPERIENCE_LABELS[form.yearsOfExperience] ||
                    form.yearsOfExperience ||
                    "",
                yearsOfExperience: form.yearsOfExperience,
            },

            preferences: {
                trainingCategory: form.preferredTrainingArea.trim(),
                preferredCourse: form.preferredTrainingArea.trim(),
                preferredIntake: form.preferredIntake.trim(),
                budget: form.budget.trim(),
                hasPassport:
                    PASSPORT_STATUS_MAP[form.passportStatus] || "NO",
            },

            additionalInformation,

            consent: {
                privacyAccepted: form.consentToContact,
            },

            source: "trainee-program-assessment",
            assessmentType: "TRAINEE_APPRENTICESHIP",
        };

        try {
            const requestBody = new FormData();

            requestBody.append(
                "assessment",
                JSON.stringify(payload)
            );

            Object.entries(documents).forEach(([key, value]) => {
                if (key === "additional") {
                    value.forEach((file) => {
                        requestBody.append("documents", file);
                    });
                } else if (value) {
                    requestBody.append("documents", value);
                }
            });

            /*
             * Preserve the purpose of each upload from the form field.
             * The backend should persist documentLabel and documentType
             * from this metadata rather than infer them from the filename.
             */
            const documentMetadata = {
                passport: documents.passport
                    ? {
                        fieldKey: "passport",
                        documentLabel: "International passport bio-data page",
                        documentType: "PASSPORT",
                        originalName: documents.passport.name,
                    }
                    : null,
                cv: documents.cv
                    ? {
                        fieldKey: "cv",
                        documentLabel: "CV or résumé",
                        documentType: "CV",
                        originalName: documents.cv.name,
                    }
                    : null,
                education: documents.education
                    ? {
                        fieldKey: "education",
                        documentLabel: "Education certificate or transcript",
                        documentType: "EDUCATIONAL_CERTIFICATE",
                        originalName: documents.education.name,
                    }
                    : null,
                englishTest: documents.englishTest
                    ? {
                        fieldKey: "englishTest",
                        documentLabel: "English test result (if available)",
                        documentType: "OTHER",
                        originalName: documents.englishTest.name,
                    }
                    : null,
                experience: documents.experience
                    ? {
                        fieldKey: "experience",
                        documentLabel: isAustralia
                            ? "Trade / work experience evidence (if available)"
                            : "Training / work experience evidence (if available)",
                        documentType: "OTHER",
                        originalName: documents.experience.name,
                    }
                    : null,
                additional: documents.additional.map((file) => ({
                    fieldKey: "additional",
                    documentLabel: "Other supporting document",
                    documentType: "OTHER",
                    originalName: file.name,
                })),
            };

            requestBody.append(
                "documentMetadata",
                JSON.stringify(documentMetadata)
            );

            const response = await fetch(ASSESSMENT_ENDPOINT, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
                body: requestBody,
            });

            const body = await response.json().catch(() => ({}));

            if (!response.ok || body?.success === false) {
                throw new Error(getErrorMessage(null, body));
            }

            const assessment =
                body?.data?.assessment ||
                body?.assessment ||
                body?.data ||
                body;

            const reference =
                assessment?.reference ||
                assessment?.referenceNumber ||
                assessment?.assessmentReference ||
                assessment?._id ||
                assessment?.id ||
                body?.reference ||
                "";

            const savedAssessment = {
                ...assessment,
                reference,
                opportunityId,
                opportunitySlug,
                countrySlug,
                programTitle,
                countryName,
                email: payload.personalDetails.email,
            };

            await clearAssessmentDraft();
            try {
                sessionStorage.removeItem("colossus_pending_assessment_return_to");
            } catch {
                // Ignore storage cleanup failures.
            }

            navigate("/portal", {
                replace: true,
                state: {
                    assessmentSubmitted: true,
                    assessmentReference: reference,
                    assessmentId: savedAssessment?._id || savedAssessment?.id || null,
                },
            });
        } catch (error) {
            setSubmitError(getErrorMessage(error));
        } finally {
            setSubmitting(false);
            confirmedSubmitRef.current = false;
        }
    };

    const checkAccountEmail = async () => {
        const email = form.email.trim().toLowerCase();
        if (!email) {
            setAuthModalMode("choose");
            return;
        }

        setEmailCheckLoading(true);
        try {
            // This endpoint should return { exists: true|false }.
            // If it is not deployed yet, keep both safe options available.
            const response = await fetch(`${API_BASE_URL}/auth/check-email`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const body = await response.json().catch(() => ({}));
            if (response.ok && typeof body?.exists === "boolean") {
                setAuthModalMode(body.exists ? "login" : "register");
            } else {
                setAuthModalMode("choose");
            }
        } catch {
            setAuthModalMode("choose");
        } finally {
            setEmailCheckLoading(false);
        }
    };

    const preserveDraftAndNavigate = async (destination) => {
        try {
            await saveAssessmentDraft({
                form,
                documents,
                savedAt: new Date().toISOString(),
                routeState,
                pathname: location.pathname,
            });
            sessionStorage.setItem(
                "colossus_pending_assessment_return_to",
                location.pathname
            );
        } catch (error) {
            setSubmitError(
                error.message || "Could not preserve your assessment. Please try again."
            );
            return;
        }

        setAuthModalOpen(false);
        navigate(destination, {
            state: {
                source: "trainee-program-assessment",
                assessmentAuthSuccess: false,
                returnTo: location.pathname,
                returnState: routeState,
                email: form.email.trim().toLowerCase(),
            },
        });
    };

    const handleCreateAccount = () => {
        preserveDraftAndNavigate("/register");
    };

    const handleSignIn = () => {
        preserveDraftAndNavigate("/login");
    };

    const closeAuthModal = () => {
        setAuthModalOpen(false);
    };

    const submitAuthenticatedAssessment = () => {
        if (!getAuthToken()) {
            setAuthenticated(false);
            setAuthModalMode("choose");
            return;
        }
        confirmedSubmitRef.current = true;
        setAuthModalOpen(false);
        const formElement = document.querySelector(".assessment-form-card");
        if (formElement) {
            formElement.requestSubmit();
        }
    };

    /* Legacy post-submission handlers are retained for compatibility. */
    const handleCreateAccountLegacy = () => {
        navigate("/register", {
            state: {
                source: "trainee-program-assessment",
                assessment: success,
                assessmentReference: success?.reference,
                email: form.email.trim().toLowerCase(),
            },
        });
    };

    const handleSignInLegacy = () => {
        navigate("/login", {
            state: {
                source: "trainee-program-assessment",
                assessment: success,
                assessmentReference: success?.reference,
                email: form.email.trim().toLowerCase(),
            },
        });
    };

    if (success) {
        return (
            <main className="free-assessment-page assessment-complete-page">
                <div className="assessment-complete-wrap">
                    <div className="assessment-complete-topline">
                        <span className="assessment-complete-brand-mark">
                            C
                        </span>
                        <span>COLOSSUS MIGRATION &amp; TOURS</span>
                    </div>

                    <section className="assessment-complete-card">
                        <div className="assessment-complete-status">
                            <span className="assessment-complete-check">
                                <CheckCircle2 size={28} />
                            </span>

                            <span className="assessment-complete-status-text">
                                <strong>Assessment submitted</strong>
                                <small>
                                    Your details have been received
                                </small>
                            </span>

                            <span className="assessment-complete-status-badge">
                                STEP 1 OF 2
                            </span>
                        </div>

                        <div className="assessment-complete-hero">
                            <div className="assessment-complete-icon">
                                <ClipboardCheck size={30} />
                            </div>

                            <p className="assessment-eyebrow">
                                YOU’RE ONE STEP CLOSER
                            </p>

                            <h1>Great start, {form.firstName}.</h1>

                            <p className="assessment-success-copy">
                                Your initial assessment details for{" "}
                                <strong>{programTitle}</strong> in{" "}
                                <strong>{countryName}</strong> have been
                                submitted. To continue your journey and keep
                                track of your assessment, you’ll need to create
                                your Colossus account.
                            </p>
                        </div>

                        <div className="assessment-complete-summary">
                            <div className="assessment-complete-summary-icon">
                                <GraduationCap size={21} />
                            </div>

                            <div className="assessment-complete-summary-content">
                                <span>SELECTED PROGRAM</span>
                                <strong>{programTitle}</strong>
                                <small>
                                    {countryName} · Trainee &amp;
                                    Apprenticeship
                                </small>
                            </div>

                            {success.reference && (
                                <div className="assessment-complete-reference">
                                    <span>ASSESSMENT REFERENCE</span>
                                    <strong>{success.reference}</strong>
                                </div>
                            )}
                        </div>

                        <div className="assessment-complete-next">
                            <div className="assessment-complete-next-heading">
                                <span className="assessment-complete-step">
                                    02
                                </span>

                                <div>
                                    <p className="assessment-eyebrow">
                                        NEXT REQUIRED STEP
                                    </p>
                                    <h2>Create your account to continue</h2>
                                </div>
                            </div>

                            <p className="assessment-complete-next-copy">
                                Your assessment is the starting point. Sign up
                                with the same email address so you can continue
                                your application journey after registration.
                            </p>

                            <div className="assessment-complete-email">
                                <Mail size={18} />
                                <div>
                                    <span>Use this email address</span>
                                    <strong>{form.email}</strong>
                                </div>
                            </div>

                            <button
                                className="assessment-button assessment-button--primary assessment-create-account"
                                type="button"
                                onClick={handleCreateAccount}
                            >
                                Create my account <ArrowUpRight size={18} />
                            </button>

                            <p className="assessment-complete-existing">
                                Already have an account?{" "}
                                <button
                                    type="button"
                                    onClick={handleSignIn}
                                >
                                    Sign in to continue{" "}
                                    <ArrowRight size={15} />
                                </button>
                            </p>
                        </div>

                        <div className="assessment-complete-security">
                            <LockKeyhole size={16} />
                            <span>
                                Keep your assessment reference for your
                                records. Your account must be linked securely
                                during registration.
                            </span>
                        </div>

                        <p className="assessment-disclaimer">
                            Submission is not a guarantee of eligibility,
                            employment, admission, visa approval, or migration
                            approval.
                        </p>
                    </section>
                </div>
            </main>
        );
    }

    return (
        <main className="free-assessment-page tpa-page">
            <style>{`
                .assessment-auth-modal-backdrop {
                    position: fixed; inset: 0; z-index: 9999;
                    display: flex; align-items: center; justify-content: center;
                    padding: 20px; background: rgba(3, 12, 28, .72);
                    backdrop-filter: blur(7px);
                }
                .assessment-auth-modal {
                    position: relative; width: min(100%, 480px); padding: 34px;
                    border-radius: 22px; background: #fff; color: #0b1c33;
                    box-shadow: 0 24px 90px rgba(0,0,0,.28);
                    animation: assessmentModalIn .18s ease-out;
                }
                .assessment-auth-modal-close {
                    position: absolute; top: 14px; right: 14px; border: 0;
                    background: #f1f5f9; color: #334155; width: 36px; height: 36px;
                    border-radius: 50%; display: grid; place-items: center; cursor: pointer;
                }
                .assessment-auth-modal-icon {
                    width: 54px; height: 54px; display: grid; place-items: center;
                    border-radius: 16px; background: #eaf4ff; color: #1264c0; margin-bottom: 20px;
                }
                .assessment-auth-modal h2 { font-size: clamp(1.45rem, 4vw, 1.9rem); margin: 7px 0 12px; line-height: 1.2; }
                .assessment-auth-modal-copy { color: #526174; line-height: 1.65; margin: 0 0 18px; }
                .assessment-auth-email {
                    display: flex; align-items: center; gap: 9px; padding: 12px 14px;
                    border: 1px solid #e2e8f0; border-radius: 12px; color: #334155;
                    overflow-wrap: anywhere; margin-bottom: 18px; font-size: .92rem;
                }
                .assessment-auth-email small { margin-left: auto; color: #64748b; }
                .assessment-auth-primary { width: 100%; justify-content: center; margin-top: 8px; }
                .assessment-auth-secondary {
                    display: block; margin: 12px auto 0; padding: 9px 12px;
                    border: 0; background: transparent; color: #526174; cursor: pointer;
                    font-weight: 600;
                }
                @keyframes assessmentModalIn {
                    from { opacity: 0; transform: translateY(8px) scale(.985); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                @media (max-width: 520px) {
                    .assessment-auth-modal { padding: 27px 21px; border-radius: 18px; }
                }
            `}</style>
            <div className="assessment-page-wrap tpa-page-wrap">
                <section className="assessment-intro--premium">
                    <div className="assessment-hero-topline">
                        <Link
                            to={
                                countrySlug
                                    ? `/opportunities/${countrySlug}`
                                    : "/opportunities"
                            }
                            className="assessment-back-link assessment-back-link--hero"
                        >
                            <ArrowLeft size={16} />
                            Back to program
                        </Link>

                        <span className="assessment-free-badge">
                            <span className="assessment-live-dot" />
                            FREE INITIAL ASSESSMENT
                        </span>
                    </div>

                    <div className="assessment-hero-content">
                        <div className="assessment-hero-copy">
                            <p className="assessment-eyebrow">
                                YOUR NEXT CHAPTER STARTS HERE
                            </p>

                            <h1>
                                Let’s find the right pathway{" "}
                                <span>for you.</span>
                            </h1>

                            <p className="assessment-hero-description">
                                Tell us about your background and upload the
                                documents you have. Our team will review your
                                details for the selected trainee or
                                apprenticeship pathway.
                            </p>

                            <div className="assessment-hero-benefits">
                                <span>
                                    <ShieldCheck size={16} /> Private and
                                    secure
                                </span>
                                <span>
                                    <ClipboardCheck size={16} /> About 5–8
                                    minutes
                                </span>
                                <span>
                                    <UserRound size={16} /> Secure client account required
                                </span>
                            </div>
                        </div>

                        <aside className="assessment-program-card">
                            <div className="assessment-program-card-top">
                                <span className="assessment-program-card-icon">
                                    <GraduationCap size={22} />
                                </span>

                                <span className="assessment-program-card-label">
                                    YOUR SELECTED PROGRAM
                                </span>
                            </div>

                            <h2>{programTitle}</h2>

                            <div className="assessment-program-country">
                                <span className="assessment-country-dot" />
                                <span>{countryName}</span>
                            </div>

                            <div className="assessment-program-card-footer">
                                <ShieldCheck size={15} />
                                <span>
                                    Initial assessment · No payment required
                                </span>
                            </div>
                        </aside>
                    </div>

                    <div
                        className="assessment-journey-progress"
                        aria-label="Assessment steps"
                    >
                        <div className="assessment-journey-step is-active">
                            <span>01</span>
                            <div>
                                <strong>Your details</strong>
                                <small>Tell us about yourself</small>
                            </div>
                        </div>

                        <div className="assessment-journey-line" />

                        <div className="assessment-journey-step">
                            <span>02</span>
                            <div>
                                <strong>Your documents</strong>
                                <small>Upload what you have</small>
                            </div>
                        </div>

                        <div className="assessment-journey-line" />

                        <div className="assessment-journey-step">
                            <span>03</span>
                            <div>
                                <strong>Submit securely</strong>
                                <small>Track progress in your portal</small>
                            </div>
                        </div>
                    </div>
                </section>

                <form
                    className="assessment-form-card"
                    onSubmit={handleSubmit}
                    noValidate
                >
                    <div className="assessment-form-heading">
                        <span className="assessment-step-number">01</span>
                        <div>
                            <h2>Let’s start with you</h2>
                            <p>
                                Add your contact details and background. Fields
                                marked * are required.
                            </p>
                        </div>
                    </div>

                    {!draftRestored && (
                        <div className="assessment-alert" role="status">
                            Restoring any saved assessment draft…
                        </div>
                    )}

                    {submitError && (
                        <div className="assessment-alert" role="alert">
                            {submitError}
                        </div>
                    )}

                    <div className="assessment-program-guidance">
                        <div className="assessment-program-guidance-icon">
                            <Info size={18} />
                        </div>
                        <div>
                            <strong>{countryLabel} pathway assessment</strong>
                            <p>{programFocus}</p>
                        </div>
                    </div>

                    <div className="assessment-form-grid">
                        <Field
                            label="First name"
                            name="firstName"
                            value={form.firstName}
                            onChange={setField}
                            error={errors.firstName}
                            required
                            autoComplete="given-name"
                        />

                        <Field
                            label="Last name"
                            name="lastName"
                            value={form.lastName}
                            onChange={setField}
                            error={errors.lastName}
                            required
                            autoComplete="family-name"
                        />

                        <Field
                            label="Email address"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={setField}
                            error={errors.email}
                            required
                            autoComplete="email"
                        />

                        <Field
                            label="Phone / WhatsApp number"
                            name="phone"
                            type="tel"
                            value={form.phone}
                            onChange={setField}
                            error={errors.phone}
                            required
                            autoComplete="tel"
                        />

                        <Field
                            label="Date of birth"
                            name="dateOfBirth"
                            type="date"
                            value={form.dateOfBirth}
                            onChange={setField}
                            error={errors.dateOfBirth}
                            required
                        />

                        <Field
                            label="Nationality"
                            name="nationality"
                            value={form.nationality}
                            onChange={setField}
                            required
                        />

                        <Field
                            label="Current country of residence"
                            name="currentCountry"
                            value={form.currentCountry}
                            onChange={setField}
                            error={errors.currentCountry}
                            required
                        />

                        <SelectField
                            label="Highest level of education"
                            name="highestEducation"
                            value={form.highestEducation}
                            onChange={setField}
                            error={errors.highestEducation}
                            required
                            options={[
                                ["", "Select your education"],
                                ["SECONDARY", "Secondary school"],
                                ["OND_NCE", "OND / NCE"],
                                ["HND", "HND"],
                                ["BACHELORS", "Bachelor’s degree"],
                                ["MASTERS", "Master’s degree"],
                                ["DOCTORATE", "Doctorate"],
                                ["OTHER", "Other"],
                            ]}
                        />

                        <Field
                            label="Field of study / qualification"
                            name="fieldOfStudy"
                            value={form.fieldOfStudy}
                            onChange={setField}
                            placeholder="e.g. Mechanical engineering"
                        />

                        <SelectField
                            label="Relevant work experience"
                            name="yearsOfExperience"
                            value={form.yearsOfExperience}
                            onChange={setField}
                            options={[
                                ["", "Select experience"],
                                ["NONE", "No experience yet"],
                                ["UNDER_1", "Less than 1 year"],
                                ["1_2", "1–2 years"],
                                ["3_5", "3–5 years"],
                                ["6_PLUS", "6+ years"],
                            ]}
                        />

                        <SelectField
                            label="English proficiency"
                            name="englishLevel"
                            value={form.englishLevel}
                            onChange={setField}
                            error={errors.englishLevel}
                            required
                            options={[
                                ["", "Select your level"],
                                ["BASIC", "Basic"],
                                ["INTERMEDIATE", "Intermediate"],
                                ["FLUENT", "Fluent"],
                                ["PROFESSIONAL", "Professional / advanced"],
                                ["TESTED", "I have an English test result"],
                            ]}
                        />

                        {trainingOptions.length > 0 ? (
                            <SelectField
                                label="Preferred training area"
                                name="preferredTrainingArea"
                                value={form.preferredTrainingArea}
                                onChange={setField}
                                error={errors.preferredTrainingArea}
                                required
                                options={[
                                    ["", "Choose an area"],
                                    ...trainingOptions.map((name) => [
                                        name,
                                        name,
                                    ]),
                                ]}
                            />
                        ) : (
                            <Field
                                label="Preferred training area"
                                name="preferredTrainingArea"
                                value={form.preferredTrainingArea}
                                onChange={setField}
                                error={errors.preferredTrainingArea}
                                placeholder="What area interests you?"
                                required
                            />
                        )}

                        <Field
                            label="Preferred intake"
                            name="preferredIntake"
                            value={form.preferredIntake}
                            onChange={setField}
                            error={errors.preferredIntake}
                            placeholder="e.g. 2027 intake or Flexible"
                            required
                        />

                        <SelectField
                            label="Estimated budget"
                            name="budget"
                            value={form.budget}
                            onChange={setField}
                            error={errors.budget}
                            required
                            options={[
                                ["", "Select your estimated budget"],
                                ["UNDER_500000", "Below ₦500,000"],
                                ["500000_1000000", "₦500,000 – ₦1,000,000"],
                                ["1000000_3000000", "₦1,000,000 – ₦3,000,000"],
                                ["3000000_PLUS", "Above ₦3,000,000"],
                                ["NOT_SURE", "Not sure yet"],
                            ]}
                        />

                        <SelectField
                            label="Passport status"
                            name="passportStatus"
                            value={form.passportStatus}
                            onChange={setField}
                            error={errors.passportStatus}
                            required
                            options={[
                                ["", "Select passport status"],
                                [
                                    "VALID",
                                    "I have a valid international passport",
                                ],
                                ["EXPIRED", "I have an expired passport"],
                                [
                                    "PROCESSING",
                                    "Passport application in progress",
                                ],
                                ["NONE", "I do not have a passport yet"],
                            ]}
                        />
                    </div>

                    <div className="assessment-form-section">
                        <label
                            className="assessment-label"
                            htmlFor="additionalInformation"
                        >
                            Anything else we should know? <span>Optional</span>
                        </label>

                        <textarea
                            id="additionalInformation"
                            name="additionalInformation"
                            rows="4"
                            value={form.additionalInformation}
                            onChange={setField}
                            placeholder="Share relevant details about your goals, training interests, or questions."
                        />
                    </div>

                    <section className="assessment-documents-section">
                        <div className="assessment-documents-heading">
                            <span className="assessment-step-number">02</span>
                            <div>
                                <p className="assessment-eyebrow">
                                    SUPPORTING DOCUMENTS
                                </p>
                                <h2>Bring your profile to life</h2>
                                <p>{documentGuidance}</p>
                            </div>
                        </div>

                        <div className="assessment-document-note">
                            <ShieldCheck size={17} />
                            <span>
                                PDF, JPG, PNG, DOC, and DOCX files are accepted.
                                Maximum 10 MB per file. Your documents are for
                                initial assessment and do not guarantee
                                eligibility.
                            </span>
                        </div>

                        <div className="assessment-document-grid">
                            {documentDefinitions.map((documentItem) => {
                                const selectedFile =
                                    documents[documentItem.key];

                                const fileError =
                                    documentErrors[documentItem.key];

                                return (
                                    <div
                                        className={`assessment-document-card ${fileError
                                            ? "assessment-document-error"
                                            : ""
                                            }`}
                                        key={documentItem.key}
                                    >
                                        <div className="assessment-document-card-top">
                                            <span className="assessment-document-icon">
                                                <FileText size={20} />
                                            </span>

                                            <span
                                                className={`assessment-document-tag ${documentItem.required
                                                    ? "is-required"
                                                    : ""
                                                    }`}
                                            >
                                                {documentItem.required
                                                    ? "Required"
                                                    : "Optional"}
                                            </span>
                                        </div>

                                        <label
                                            className="assessment-document-title"
                                            htmlFor={`document-${documentItem.key}`}
                                        >
                                            {documentItem.label}
                                        </label>

                                        <p>{documentItem.description}</p>

                                        {selectedFile ? (
                                            <div className="assessment-selected-file">
                                                <FileText size={16} />
                                                <span title={selectedFile.name}>
                                                    {selectedFile.name}
                                                </span>
                                                <button
                                                    type="button"
                                                    aria-label={`Remove ${selectedFile.name}`}
                                                    onClick={() =>
                                                        removeDocument(
                                                            documentItem.key
                                                        )
                                                    }
                                                >
                                                    <X size={15} />
                                                </button>
                                            </div>
                                        ) : (
                                            <label
                                                className="assessment-upload-button"
                                                htmlFor={`document-${documentItem.key}`}
                                            >
                                                <Upload size={16} />
                                                Choose file
                                            </label>
                                        )}

                                        <input
                                            className="assessment-file-input"
                                            id={`document-${documentItem.key}`}
                                            type="file"
                                            accept={documentItem.accept}
                                            onChange={(event) =>
                                                handleDocumentChange(
                                                    documentItem.key,
                                                    event.target.files
                                                )
                                            }
                                        />

                                        {fileError && <small>{fileError}</small>}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="assessment-additional-documents">
                            <div>
                                <strong>Other supporting documents</strong>
                                <p>
                                    Upload any additional certificates or
                                    documents relevant to your background.
                                    Optional.
                                </p>
                            </div>

                            <label
                                className="assessment-upload-button assessment-upload-button--secondary"
                                htmlFor="document-additional"
                            >
                                <Upload size={16} />
                                Add files
                            </label>

                            <input
                                className="assessment-file-input"
                                id="document-additional"
                                type="file"
                                multiple
                                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                onChange={(event) =>
                                    handleDocumentChange(
                                        "additional",
                                        event.target.files
                                    )
                                }
                            />

                            {documents.additional.length > 0 && (
                                <div className="assessment-additional-file-list">
                                    {documents.additional.map((file, index) => (
                                        <div
                                            className="assessment-selected-file"
                                            key={`${file.name}-${file.size}-${index}`}
                                        >
                                            <FileText size={16} />
                                            <span title={file.name}>
                                                {file.name}
                                            </span>
                                            <button
                                                type="button"
                                                aria-label={`Remove ${file.name}`}
                                                onClick={() =>
                                                    removeDocument(
                                                        "additional",
                                                        index
                                                    )
                                                }
                                            >
                                                <X size={15} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {documentErrors.additional && (
                                <small>{documentErrors.additional}</small>
                            )}
                        </div>
                    </section>

                    <label
                        className={`assessment-consent ${errors.consentToContact
                            ? "assessment-field-error"
                            : ""
                            }`}
                    >
                        <input
                            type="checkbox"
                            name="consentToContact"
                            checked={form.consentToContact}
                            onChange={setField}
                        />

                        <span>
                            I agree that Colossus Migration &amp; Tours may
                            contact me about this assessment and process the
                            information I have provided.
                            <strong> Required</strong>

                            {errors.consentToContact && (
                                <small>{errors.consentToContact}</small>
                            )}
                        </span>
                    </label>

                    <div className="assessment-submit-row">
                        <p>
                            <ShieldCheck size={16} />
                            Sign in or create an account before submitting. Your assessment will be linked to your account.
                        </p>

                        <button
                            ref={submitButtonRef}
                            className="assessment-button assessment-button--primary"
                            type="submit"
                            disabled={submitting || !draftRestored}
                        >
                            {submitting
                                ? "Submitting your assessment…"
                                : authenticated
                                    ? "Submit Assessment"
                                    : "Continue to Submit Assessment"}

                            {!submitting && <ArrowRight size={17} />}
                        </button>
                    </div>

                    {authModalOpen && (
                        <div
                            className="assessment-auth-modal-backdrop"
                            role="presentation"
                            onMouseDown={(event) => {
                                if (event.target === event.currentTarget) closeAuthModal();
                            }}
                        >
                            <section
                                className="assessment-auth-modal"
                                role="dialog"
                                aria-modal="true"
                                aria-labelledby="assessment-auth-modal-title"
                            >
                                <button
                                    type="button"
                                    className="assessment-auth-modal-close"
                                    onClick={closeAuthModal}
                                    aria-label="Close dialog"
                                >
                                    <X size={20} />
                                </button>

                                <div className="assessment-auth-modal-icon">
                                    {authModalMode === "confirm" ? (
                                        <CheckCircle2 size={27} />
                                    ) : (
                                        <LockKeyhole size={26} />
                                    )}
                                </div>

                                <p className="assessment-eyebrow">
                                    COLOSSUS CLIENT ACCOUNT
                                </p>

                                <h2 id="assessment-auth-modal-title">
                                    {authModalMode === "confirm"
                                        ? "You're authenticated"
                                        : authModalMode === "login"
                                            ? "Sign in to continue"
                                            : authModalMode === "register"
                                                ? "Create an account to continue"
                                                : "Sign up to continue"}
                                </h2>

                                <p className="assessment-auth-modal-copy">
                                    {authModalMode === "confirm"
                                        ? `You're ready to submit your assessment for ${programTitle}. Your assessment will be linked to your account.`
                                        : authModalMode === "login"
                                            ? "An account may already exist for this email. Sign in to submit your assessment and track your programme."
                                            : authModalMode === "register"
                                                ? "Create your Colossus account to submit this assessment and track your programme."
                                                : "Create a Colossus account or sign in to submit your assessment. Your answers and selected documents are saved."}
                                </p>

                                <div className="assessment-auth-email">
                                    <Mail size={17} />
                                    <span>{form.email.trim() || "Enter your email in the form"}</span>
                                    {emailCheckLoading && <small>Checking…</small>}
                                </div>

                                {authModalMode === "confirm" ? (
                                    <>
                                        <button
                                            type="button"
                                            className="assessment-button assessment-button--primary assessment-auth-primary"
                                            onClick={submitAuthenticatedAssessment}
                                            disabled={submitting}
                                        >
                                            {submitting ? "Submitting…" : "Submit Assessment"}
                                            {!submitting && <ArrowRight size={17} />}
                                        </button>
                                        <button
                                            type="button"
                                            className="assessment-auth-secondary"
                                            onClick={closeAuthModal}
                                        >
                                            Continue editing
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        {(authModalMode === "register" || authModalMode === "choose") && (
                                            <button
                                                type="button"
                                                className="assessment-button assessment-button--primary assessment-auth-primary"
                                                onClick={handleCreateAccount}
                                            >
                                                Create Account &amp; Continue
                                                <ArrowRight size={17} />
                                            </button>
                                        )}

                                        {(authModalMode === "login" || authModalMode === "choose") && (
                                            <button
                                                type="button"
                                                className="assessment-button assessment-button--primary assessment-auth-primary"
                                                onClick={handleSignIn}
                                            >
                                                Sign In &amp; Continue
                                                <ArrowRight size={17} />
                                            </button>
                                        )}

                                        <button
                                            type="button"
                                            className="assessment-auth-secondary"
                                            onClick={closeAuthModal}
                                        >
                                            Return to assessment
                                        </button>
                                    </>
                                )}
                            </section>
                        </div>
                    )}

                    <p className="assessment-disclaimer">
                        This form is for an initial review only. Eligibility
                        and outcomes depend on the full details of your case
                        and the applicable program requirements.
                    </p>
                </form>
            </div>
        </main>
    );
}

function Field({
    label,
    name,
    value,
    onChange,
    error,
    type = "text",
    required = false,
    ...props
}) {
    return (
        <div
            className={`assessment-field ${error ? "assessment-field-error" : ""
                }`}
        >
            <label className="assessment-label" htmlFor={name}>
                {label}{" "}
                {required && (
                    <span className="assessment-required">*</span>
                )}
            </label>

            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                required={required}
                {...props}
            />

            {error && <small>{error}</small>}
        </div>
    );
}

function SelectField({
    label,
    name,
    value,
    onChange,
    error,
    options,
    required = false,
}) {
    return (
        <div
            className={`assessment-field ${error ? "assessment-field-error" : ""
                }`}
        >
            <label className="assessment-label" htmlFor={name}>
                {label}{" "}
                {required && (
                    <span className="assessment-required">*</span>
                )}
            </label>

            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
            >
                {options.map(([optionValue, optionLabel]) => (
                    <option
                        key={`${name}-${optionValue || "empty"}`}
                        value={optionValue}
                    >
                        {optionLabel}
                    </option>
                ))}
            </select>

            {error && <small>{error}</small>}
        </div>
    );
}

