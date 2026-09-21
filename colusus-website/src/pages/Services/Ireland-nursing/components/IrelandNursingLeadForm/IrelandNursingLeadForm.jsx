
import { useMemo, useState } from "react";

import "./IrelandNursingLeadForm.css";

const API_URL = (
    import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1"
).replace(/\/$/, "");

const initialForm = {
    role: "",
    interested: "",
    name: "",
    phone: "",
    email: "",
    age: "",
    qualification: "",
    specialty: "",
    experience: "",
    location: "",
    cv: null,
    passport: null,
};

const steps = [
    "eligibility",
    "contact",
    "professional",
    "documents",
    "review",
];

const roleLabels = {
    "staff-nurse": "Staff Nurse",
    "senior-staff-nurse": "Senior Staff Nurse",
    cnm: "CNM",
};

function IrelandNursingLeadForm() {
    const [form, setForm] = useState(initialForm);
    const [currentStep, setCurrentStep] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const totalSteps = steps.length;
    const currentKey = steps[currentStep];

    const progress = useMemo(
        () => ((currentStep + 1) / totalSteps) * 100,
        [currentStep, totalSteps]
    );

    const updateField = (field, value) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));

        if (submitError) {
            setSubmitError("");
        }
    };

    const validateCurrentStep = () => {
        if (currentKey === "eligibility") {
            return Boolean(form.role && form.interested);
        }

        if (currentKey === "contact") {
            return Boolean(
                form.name &&
                form.phone &&
                form.email
            );
        }

        if (currentKey === "professional") {
            return Boolean(
                form.age &&
                form.qualification &&
                form.specialty &&
                form.experience
            );
        }

        if (currentKey === "documents") {
            return Boolean(
                form.location &&
                form.cv &&
                form.passport
            );
        }

        return true;
    };

    const handleContinue = () => {
        if (!validateCurrentStep()) return;

        if (currentStep < totalSteps - 1) {
            setCurrentStep((prev) => prev + 1);
        }
    };

    const handleBack = () => {
        if (submitting) return;

        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    const uploadDocument = async (file, type) => {
        const formData = new FormData();

        formData.append("file", file);
        formData.append("type", type);

        const response = await fetch(
            `${API_URL}/uploads`,
            {
                method: "POST",
                body: formData,
            }
        );

        const result = await response.json().catch(() => null);

        if (!response.ok) {
            throw new Error(
                result?.message ||
                `Could not upload ${type.toLowerCase()}.`
            );
        }

        if (!result?.data) {
            throw new Error(
                `The ${type.toLowerCase()} upload did not return file information.`
            );
        }

        return result.data;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (submitting) return;
        if (!validateCurrentStep()) return;

        setSubmitting(true);
        setSubmitError("");

        const submissionData = {
            role: roleLabels[form.role] || form.role,

            interested:
                form.interested === "yes"
                    ? "Yes"
                    : "Not right now",

            name: form.name.trim(),
            phone: form.phone.trim(),
            email: form.email.trim(),
            age: form.age,
            qualification: form.qualification.trim(),
            specialty: form.specialty.trim(),
            experience: form.experience,
            location: form.location.trim(),
        };

        try {
            /*
            |--------------------------------------------------------------------------
            | UPLOAD CV
            |--------------------------------------------------------------------------
            */

            const cvUpload = await uploadDocument(
                form.cv,
                "CV"
            );

            /*
            |--------------------------------------------------------------------------
            | UPLOAD PASSPORT
            |--------------------------------------------------------------------------
            */

            const passportUpload = await uploadDocument(
                form.passport,
                "PASSPORT"
            );

            /*
            |--------------------------------------------------------------------------
            | BUILD DOCUMENT LIST
            |--------------------------------------------------------------------------
            */

            const documents = [
                {
                    type: cvUpload.type,
                    name: cvUpload.originalName,
                    url: cvUpload.url,
                    publicId: cvUpload.publicId,
                    resourceType: cvUpload.resourceType,
                    format: cvUpload.format,
                },
                {
                    type: passportUpload.type,
                    name: passportUpload.originalName,
                    url: passportUpload.url,
                    publicId: passportUpload.publicId,
                    resourceType: passportUpload.resourceType,
                    format: passportUpload.format,
                },
            ];

            /*
            |--------------------------------------------------------------------------
            | SUBMIT FORM
            |--------------------------------------------------------------------------
            */

            const response = await fetch(
                `${API_URL}/form-submissions`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        formKey:
                            "ireland-nursing-healthcare",

                        formName:
                            "Ireland Nursing & Healthcare",

                        submissionData,

                        documents,

                        source: "WEBSITE",
                    }),
                }
            );

            const result = await response
                .json()
                .catch(() => null);

            if (!response.ok) {
                throw new Error(
                    result?.message ||
                    "We could not submit your assessment. Please try again."
                );
            }

            setSubmitted(true);
        } catch (error) {
            console.error(
                "Ireland nursing form submission failed:",
                error
            );

            setSubmitError(
                error.message ||
                "We could not submit your assessment. Please try again."
            );
        } finally {
            setSubmitting(false);
        }
    };

    const firstName =
        form.name?.trim().split(" ")[0] || "there";

    return (
        <section
            className="ireland-lead"
            id="ireland-interest"
        >
            <div className="ireland-lead-container">
                <div className="ireland-lead-card">
                    <div className="ireland-lead-copy">
                        <p className="ireland-lead-eyebrow">
                            Ireland Nursing Opportunity
                        </p>

                        <h2>
                            Interested in working as a nurse in Ireland?
                        </h2>

                        <p>
                            Register your interest and provide your details
                            for an initial assessment of your Ireland nursing
                            pathway.
                        </p>

                        <div className="ireland-lead-note">
                            <strong>
                                What you will provide
                            </strong>

                            <ul className="ireland-lead-checklist">
                                <li>
                                    Professional and contact details
                                </li>

                                <li>
                                    Nursing qualification and experience
                                </li>

                                <li>
                                    Current location and specialty
                                </li>

                                <li>
                                    CV and passport data page
                                </li>
                            </ul>
                        </div>

                        <div className="ireland-lead-brand">
                            Brought to you by Colossus Migration
                        </div>
                    </div>

                    <div className="ireland-lead-form-wrap">
                        {submitted ? (
                            <SuccessState
                                firstName={firstName}
                                form={form}
                            />
                        ) : (
                            <form
                                className="ireland-lead-form"
                                onSubmit={handleSubmit}
                            >
                                <div className="ireland-lead-form-header">
                                    <div className="ireland-lead-step-indicator">
                                        <span>
                                            Step {currentStep + 1} of{" "}
                                            {totalSteps}
                                        </span>

                                        <span>
                                            {currentStep ===
                                                totalSteps - 1
                                                ? "Almost done"
                                                : "Continue when ready"}
                                        </span>
                                    </div>

                                    <div className="ireland-lead-progress">
                                        <span
                                            style={{
                                                width: `${progress}%`,
                                            }}
                                        />
                                    </div>
                                </div>

                                {currentKey === "eligibility" && (
                                    <EligibilityStep
                                        form={form}
                                        updateField={updateField}
                                    />
                                )}

                                {currentKey === "contact" && (
                                    <ContactStep
                                        form={form}
                                        updateField={updateField}
                                    />
                                )}

                                {currentKey === "professional" && (
                                    <ProfessionalStep
                                        form={form}
                                        updateField={updateField}
                                    />
                                )}

                                {currentKey === "documents" && (
                                    <DocumentsStep
                                        form={form}
                                        updateField={updateField}
                                    />
                                )}

                                {currentKey === "review" && (
                                    <ReviewStep
                                        form={form}
                                    />
                                )}

                                {submitError && (
                                    <div
                                        className="ireland-lead-submit-error"
                                        role="alert"
                                    >
                                        {submitError}
                                    </div>
                                )}

                                <div className="ireland-lead-navigation">
                                    {currentStep > 0 ? (
                                        <button
                                            type="button"
                                            className="ireland-lead-btn ireland-lead-btn-secondary"
                                            onClick={handleBack}
                                            disabled={submitting}
                                        >
                                            Back
                                        </button>
                                    ) : (
                                        <span />
                                    )}

                                    {currentStep <
                                        totalSteps - 1 ? (
                                        <button
                                            type="button"
                                            className="ireland-lead-btn ireland-lead-btn-primary"
                                            onClick={handleContinue}
                                            disabled={submitting}
                                        >
                                            Continue
                                        </button>
                                    ) : (
                                        <button
                                            type="submit"
                                            className="ireland-lead-btn ireland-lead-btn-primary"
                                            disabled={submitting}
                                        >
                                            {submitting
                                                ? "Uploading & submitting..."
                                                : "Submit Assessment"}
                                        </button>
                                    )}
                                </div>

                                <p className="ireland-lead-disclaimer">
                                    Your information will be used by
                                    Colossus Migration &amp; Tours Ltd for
                                    assessment and follow-up regarding the
                                    Ireland nursing opportunity.
                                </p>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

function EligibilityStep({
    form,
    updateField,
}) {
    return (
        <div className="ireland-lead-step">
            <div className="ireland-lead-question">
                <h3>
                    Let&apos;s start with your eligibility.
                </h3>

                <p>
                    Tell us your current nursing role and whether you are
                    interested in the Ireland opportunity.
                </p>
            </div>

            <div className="ireland-lead-field">
                <label>
                    What is your current role?
                </label>

                <div className="ireland-lead-options ireland-lead-options-three">
                    {[
                        ["Staff Nurse", "staff-nurse"],
                        [
                            "Senior Staff Nurse",
                            "senior-staff-nurse",
                        ],
                        ["CNM", "cnm"],
                    ].map(([label, value]) => (
                        <button
                            key={value}
                            type="button"
                            className={`ireland-lead-option ${form.role === value
                                    ? "active"
                                    : ""
                                }`}
                            onClick={() =>
                                updateField(
                                    "role",
                                    value
                                )
                            }
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="ireland-lead-field">
                <label>
                    Would you like to work in Ireland?
                </label>

                <div className="ireland-lead-options">
                    <button
                        type="button"
                        className={`ireland-lead-option ${form.interested === "yes"
                                ? "active"
                                : ""
                            }`}
                        onClick={() =>
                            updateField(
                                "interested",
                                "yes"
                            )
                        }
                    >
                        <strong>
                            Yes, I&apos;m interested
                        </strong>

                        <span>
                            I would like to be considered for the
                            opportunity.
                        </span>
                    </button>

                    <button
                        type="button"
                        className={`ireland-lead-option ${form.interested === "no"
                                ? "active"
                                : ""
                            }`}
                        onClick={() =>
                            updateField(
                                "interested",
                                "no"
                            )
                        }
                    >
                        <strong>
                            Not right now
                        </strong>

                        <span>
                            I am not ready to proceed at this time.
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}

function ContactStep({
    form,
    updateField,
}) {
    return (
        <div className="ireland-lead-step">
            <div className="ireland-lead-question">
                <h3>
                    How can we reach you?
                </h3>

                <p>
                    Provide your basic contact details so our team can
                    follow up.
                </p>
            </div>

            <div className="ireland-lead-fields-grid">
                <InputField
                    label="Full Name"
                    value={form.name}
                    placeholder="Enter your full name"
                    onChange={(value) =>
                        updateField(
                            "name",
                            value
                        )
                    }
                />

                <InputField
                    label="Phone / WhatsApp Number"
                    value={form.phone}
                    placeholder="+234..."
                    type="tel"
                    onChange={(value) =>
                        updateField(
                            "phone",
                            value
                        )
                    }
                />

                <InputField
                    label="Email Address"
                    value={form.email}
                    placeholder="you@example.com"
                    type="email"
                    wide
                    onChange={(value) =>
                        updateField(
                            "email",
                            value
                        )
                    }
                />
            </div>
        </div>
    );
}

function ProfessionalStep({
    form,
    updateField,
}) {
    return (
        <div className="ireland-lead-step">
            <div className="ireland-lead-question">
                <h3>
                    Tell us about your nursing background.
                </h3>

                <p>
                    These details help us understand your professional
                    profile.
                </p>
            </div>

            <div className="ireland-lead-fields-grid">
                <InputField
                    label="Age"
                    value={form.age}
                    placeholder="e.g. 32"
                    type="number"
                    onChange={(value) =>
                        updateField(
                            "age",
                            value
                        )
                    }
                />

                <InputField
                    label="Years of Nursing Experience"
                    value={form.experience}
                    placeholder="e.g. 7"
                    type="number"
                    onChange={(value) =>
                        updateField(
                            "experience",
                            value
                        )
                    }
                />

                <InputField
                    label="Nursing Qualification"
                    value={form.qualification}
                    placeholder="e.g. B.NSc, RN"
                    onChange={(value) =>
                        updateField(
                            "qualification",
                            value
                        )
                    }
                />

                <InputField
                    label="Current Role / Specialty"
                    value={form.specialty}
                    placeholder="e.g. ICU, Theatre, Medical Ward"
                    onChange={(value) =>
                        updateField(
                            "specialty",
                            value
                        )
                    }
                />
            </div>
        </div>
    );
}

function DocumentsStep({
    form,
    updateField,
}) {
    return (
        <div className="ireland-lead-step">
            <div className="ireland-lead-question">
                <h3>
                    Where are you currently based?
                </h3>

                <p>
                    Then upload the two documents needed for your initial
                    assessment.
                </p>
            </div>

            <InputField
                label="Your Location"
                value={form.location}
                placeholder="City, Country"
                onChange={(value) =>
                    updateField(
                        "location",
                        value
                    )
                }
            />

            <div className="ireland-lead-upload-grid">
                <FileField
                    label="CV"
                    hint="PDF — maximum 10 MB"
                    accept=".pdf"
                    file={form.cv}
                    onChange={(file) =>
                        updateField(
                            "cv",
                            file
                        )
                    }
                />

                <FileField
                    label="Passport Data Page"
                    hint="PDF, JPG or PNG — maximum 10 MB"
                    accept=".pdf,.jpg,.jpeg,.png"
                    file={form.passport}
                    onChange={(file) =>
                        updateField(
                            "passport",
                            file
                        )
                    }
                />
            </div>
        </div>
    );
}

function ReviewStep({ form }) {
    return (
        <div className="ireland-lead-step ireland-lead-review-step">
            <div className="ireland-lead-question">
                <h3>
                    Review your information.
                </h3>

                <p>
                    Everything looks good? Submit your assessment and the
                    Colossus team can follow up with you.
                </p>
            </div>

            <div className="ireland-lead-review">
                <ReviewItem
                    label="Role"
                    value={
                        roleLabels[form.role] ||
                        form.role
                    }
                />

                <ReviewItem
                    label="Interested"
                    value={
                        form.interested === "yes"
                            ? "Yes"
                            : "Not right now"
                    }
                />

                <ReviewItem
                    label="Name"
                    value={form.name}
                />

                <ReviewItem
                    label="Phone / WhatsApp"
                    value={form.phone}
                />

                <ReviewItem
                    label="Email"
                    value={form.email}
                />

                <ReviewItem
                    label="Age"
                    value={form.age}
                />

                <ReviewItem
                    label="Qualification"
                    value={form.qualification}
                />

                <ReviewItem
                    label="Specialty"
                    value={form.specialty}
                />

                <ReviewItem
                    label="Experience"
                    value={
                        form.experience
                            ? `${form.experience} years`
                            : "—"
                    }
                />

                <ReviewItem
                    label="Location"
                    value={form.location}
                />

                <ReviewItem
                    label="CV"
                    value={
                        form.cv?.name ||
                        "Not uploaded"
                    }
                />

                <ReviewItem
                    label="Passport"
                    value={
                        form.passport?.name ||
                        "Not uploaded"
                    }
                />
            </div>
        </div>
    );
}

function InputField({
    label,
    value,
    placeholder,
    type = "text",
    wide = false,
    onChange,
}) {
    return (
        <div
            className={`ireland-lead-input-group ${wide
                    ? "ireland-lead-input-wide"
                    : ""
                }`}
        >
            <label>{label}</label>

            <input
                className="ireland-lead-input"
                type={type}
                value={value}
                placeholder={placeholder}
                min={
                    type === "number"
                        ? "0"
                        : undefined
                }
                onChange={(event) =>
                    onChange(
                        event.target.value
                    )
                }
            />
        </div>
    );
}

function FileField({
    label,
    hint,
    accept,
    file,
    onChange,
}) {
    return (
        <label className="ireland-file-upload">
            <input
                type="file"
                accept={accept}
                onChange={(event) =>
                    onChange(
                        event.target.files?.[0] ||
                        null
                    )
                }
            />

            <strong>
                {file
                    ? file.name
                    : `Upload ${label}`}
            </strong>

            <span>
                {file
                    ? "File selected"
                    : hint}
            </span>
        </label>
    );
}

function ReviewItem({
    label,
    value,
}) {
    return (
        <div className="ireland-lead-review-item">
            <small>{label}</small>

            <strong>
                {value || "—"}
            </strong>
        </div>
    );
}

function SuccessState({
    firstName,
    form,
}) {
    return (
        <div className="ireland-lead-success">
            <div className="ireland-lead-success-icon">
                ✓
            </div>

            <p className="ireland-lead-eyebrow">
                Registration received
            </p>

            <h3>
                Thank you, {firstName}.
            </h3>

            <p>
                Your interest in the Ireland Nursing Job Migration
                Opportunity has been received.
            </p>

            <div className="ireland-lead-success-summary">
                <div>
                    <small>Role</small>

                    <strong>
                        {roleLabels[form.role] ||
                            form.role ||
                            "—"}
                    </strong>
                </div>

                <div>
                    <small>Experience</small>

                    <strong>
                        {form.experience
                            ? `${form.experience} years`
                            : "—"}
                    </strong>
                </div>

                <div>
                    <small>Location</small>

                    <strong>
                        {form.location || "—"}
                    </strong>
                </div>
            </div>

            <p className="ireland-lead-success-followup">
                A member of the Colossus Migration team will review your
                information and contact you regarding the next stage of the
                assessment.
            </p>

            <div className="ireland-lead-success-brand">
                <strong>
                    Colossus Migration &amp; Tours Ltd
                </strong>

                <span>
                    www.colossusmigration.com
                </span>
            </div>
        </div>
    );
}

export default IrelandNursingLeadForm;
