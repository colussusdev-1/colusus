import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    HiOutlineArrowLeft,
    HiOutlineCheck,
    HiOutlinePlus,
    HiOutlineTrash,
    HiOutlineChevronDown,
    HiOutlineGlobeAlt,
    HiOutlineBriefcase,
    HiOutlineDocumentText,
    HiOutlineCurrencyDollar,
    HiOutlineClipboardDocumentList,
    HiOutlineQuestionMarkCircle,
    HiOutlineCog6Tooth,
    HiOutlineAcademicCap,
    HiOutlinePhoto,
} from "react-icons/hi2";

import opportunitiesService from "./opportunities.service";
import ImagePicker from "./components/ImagePicker";

import {
    OPPORTUNITY_TYPE_OPTIONS,
    DURATION_OPTIONS,
    LOCATION_OPTIONS,
} from "../../../data/opportunityOptions";

import "./opportunity-form.css";

/* -------------------------------------------------------------------------- */
/* CONSTANTS                                                                  */
/* -------------------------------------------------------------------------- */

const APPLICATION_FLOWS = [
    {
        value: "DIRECT_APPLICATION",
        label: "Direct application",
    },
    {
        value: "ASSESSMENT_FIRST",
        label: "Assessment first",
    },
];

const DOCUMENT_TYPES = [
    { value: "PASSPORT", label: "Passport" },
    { value: "IDENTIFICATION", label: "Identification" },
    { value: "ACADEMIC_CERTIFICATE", label: "Academic certificate" },
    { value: "FINANCIAL_DOCUMENT", label: "Financial document" },
    { value: "EMPLOYMENT_DOCUMENT", label: "Employment document" },
    { value: "OTHER", label: "Other" },
];

const QUESTION_TYPES = [
    { value: "TEXT", label: "Text answer" },
    { value: "SELECT", label: "Select option" },
];

const DEFAULT_FORM = {
    countryId: "",
    countryName: "",
    countrySlug: "",
    countryFlag: "",
    countryImage: "",
    countryCategories: [],
    countryVisa: "",
    countryDuration: "",
    countryProcessingTime: "",
    countryDescription: "",
    opportunityScore: "",
    successRate: "",

    title: "",
    slug: "",
    image: "",
    category: "",
    location: "",
    type: "",
    duration: "",
    icon: "",
    salary: "",
    demand: "",
    description: "",

    highlights: [],
    requirements: [],
    documents: [],
    benefits: [],
    steps: [],

    positions: [],

    workConditions: {
        trainingDuration: "",
        workingSchedule: "",
        trainingEnvironment: "",
        stipend: "",
        location: "",
        additionalInformation: "",
    },

    contract: "",

    faq: [],

    pricing: {
        total: "",
        minimum: "",
        maximum: "",
        amount: "",
        currency: "NGN",
        label: "",
        description: "",
        includes: [],
    },

    paymentPlan: [],
    terms: [],

    applicationFlow: "DIRECT_APPLICATION",

    programDetails: {
        programType: "",
        targetIntakes: [],
        courseCategories: [],
        stipend: {
            minimum: "",
            maximum: "",
            currency: "NZD",
            frequency: "",
            status: "",
        },
        estimatedBudget: {
            minimum: "",
            maximum: "",
            currency: "NGN",
        },
        visaRefusalRefund: {
            available: false,
            percentage: "",
            appliesTo: "",
            subjectToWrittenPolicy: true,
        },
    },

    applicationConfig: {
        steps: ["DOCUMENTS", "REVIEW"],
        questions: [],
        requiredDocuments: [],
        workflow: [],
    },

    active: true,
    featured: false,
};

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

const makeId = () =>
    `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const slugify = (value = "") =>
    value
        .toString()
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

const toArray = (value) => {
    if (Array.isArray(value)) return value;
    return [];
};

const stringValue = (value) => {
    if (value === null || value === undefined) return "";
    return String(value);
};

const numberValue = (value) => {
    if (value === "" || value === null || value === undefined) {
        return undefined;
    }

    const number = Number(value);

    return Number.isFinite(number) ? number : undefined;
};

const getResponseItems = (response) => {
    if (Array.isArray(response)) return response;

    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.data?.items)) return response.data.items;
    if (Array.isArray(response?.data?.destinations)) {
        return response.data.destinations;
    }

    if (Array.isArray(response?.items)) return response.items;
    if (Array.isArray(response?.destinations)) {
        return response.destinations;
    }

    return [];
};

const getOpportunityFromResponse = (response) => {
    return (
        response?.data?.opportunity ||
        response?.data?.item ||
        response?.data ||
        response?.opportunity ||
        response?.item ||
        response
    );
};

const normalizeDestination = (destination = {}) => ({
    countryId: destination.countryId ?? "",
    countryName: destination.countryName || "",
    countrySlug:
        destination.countrySlug ||
        slugify(destination.countryName || ""),
    countryFlag: destination.countryFlag || "",
    countryImage: destination.countryImage || "",
    countryCategories: toArray(destination.countryCategories),
    countryVisa: destination.countryVisa || "",
    countryDuration: destination.countryDuration || "",
    countryProcessingTime: destination.countryProcessingTime || "",
    countryDescription: destination.countryDescription || "",
    opportunityScore: destination.opportunityScore ?? "",
    successRate: destination.successRate ?? "",
});

const normalizeOpportunity = (opportunity = {}) => {
    const destination = normalizeDestination(opportunity);

    return {
        ...DEFAULT_FORM,
        ...destination,

        title: opportunity.title || "",
        slug: opportunity.slug || "",
        image: opportunity.image || "",
        category: opportunity.category || "",
        location: opportunity.location || "",
        type: opportunity.type || "",
        duration: opportunity.duration || "",
        icon: opportunity.icon || "",
        salary: opportunity.salary || "",
        demand: opportunity.demand || "",
        description: opportunity.description || "",

        highlights: toArray(opportunity.highlights),
        requirements: toArray(opportunity.requirements),
        documents: toArray(opportunity.documents),
        benefits: toArray(opportunity.benefits),

        steps: toArray(opportunity.steps).map((step) =>
            typeof step === "string"
                ? {
                    title: step,
                    description: "",
                    duration: "",
                }
                : { ...step }
        ),

        positions: toArray(opportunity.positions).map((position) => ({
            ...position,
            title: position?.title || "",
            sector: position?.sector || "",
            image: position?.image || "",
            roles: toArray(position?.roles),
            courses: toArray(position?.courses),
            requirements: toArray(position?.requirements),
            benefits: toArray(position?.benefits),
        })),

        workConditions: {
            ...DEFAULT_FORM.workConditions,
            ...(opportunity.workConditions || {}),
        },

        contract: opportunity.contract || "",

        faq: toArray(opportunity.faq).map((item) => ({
            ...item,
            question: item?.question || "",
            answer: item?.answer || "",
        })),

        pricing: {
            ...DEFAULT_FORM.pricing,
            ...(opportunity.pricing || {}),
            includes: toArray(opportunity.pricing?.includes),
        },

        paymentPlan: toArray(opportunity.paymentPlan).map((item) => ({
            ...item,
        })),

        terms: toArray(opportunity.terms),

        applicationFlow:
            opportunity.applicationFlow || "DIRECT_APPLICATION",

        programDetails: {
            ...DEFAULT_FORM.programDetails,
            ...(opportunity.programDetails || {}),
            targetIntakes: toArray(
                opportunity.programDetails?.targetIntakes
            ),
            courseCategories: toArray(
                opportunity.programDetails?.courseCategories
            ),
            stipend: {
                ...DEFAULT_FORM.programDetails.stipend,
                ...(opportunity.programDetails?.stipend || {}),
            },
            estimatedBudget: {
                ...DEFAULT_FORM.programDetails.estimatedBudget,
                ...(opportunity.programDetails?.estimatedBudget || {}),
            },
            visaRefusalRefund: {
                ...DEFAULT_FORM.programDetails.visaRefusalRefund,
                ...(opportunity.programDetails?.visaRefusalRefund || {}),
            },
        },

        applicationConfig: {
            ...DEFAULT_FORM.applicationConfig,
            ...(opportunity.applicationConfig || {}),
            steps: toArray(
                opportunity.applicationConfig?.steps
            ),
            questions: toArray(
                opportunity.applicationConfig?.questions
            ).map((question) => ({ ...question })),
            requiredDocuments: toArray(
                opportunity.applicationConfig?.requiredDocuments
            ).map((document) => ({ ...document })),
            workflow: toArray(
                opportunity.applicationConfig?.workflow
            ).map((item) => ({ ...item })),
        },

        active: opportunity.active !== false,
        featured: opportunity.featured === true,
    };
};

const cleanObject = (object) => {
    return Object.fromEntries(
        Object.entries(object).filter(([, value]) => value !== undefined)
    );
};

const buildPayload = (form) => {
    const payload = {
        ...form,

        countryId: numberValue(form.countryId),
        countryName: form.countryName.trim(),
        countrySlug: form.countrySlug.trim(),
        opportunityScore: numberValue(form.opportunityScore),
        successRate: numberValue(form.successRate),

        title: form.title.trim(),
        slug: form.slug.trim(),
        category: form.category.trim(),
        type: form.type,
        description: form.description.trim(),

        highlights: form.highlights.filter(Boolean),
        requirements: form.requirements.filter(Boolean),
        documents: form.documents.filter(Boolean),
        benefits: form.benefits.filter(Boolean),
        terms: form.terms.filter(Boolean),

        steps: form.steps.map((step) => ({
            ...step,
            title: stringValue(step.title).trim(),
            description: stringValue(step.description).trim(),
            duration: stringValue(step.duration).trim(),
        })),

        positions: form.positions.map((position) => ({
            ...position,
            title: stringValue(position.title).trim(),
            sector: stringValue(position.sector).trim(),
            roles: toArray(position.roles).filter(Boolean),
            courses: toArray(position.courses).filter(Boolean),
            requirements: toArray(position.requirements).filter(Boolean),
            benefits: toArray(position.benefits).filter(Boolean),
        })),

        workConditions: cleanObject({
            ...form.workConditions,
        }),

        faq: form.faq.map((item) => ({
            ...item,
            question: stringValue(item.question).trim(),
            answer: stringValue(item.answer).trim(),
        })),

        pricing: cleanObject({
            ...form.pricing,
            amount: numberValue(form.pricing.amount),
            minimum: numberValue(form.pricing.minimum),
            maximum: numberValue(form.pricing.maximum),
            includes: toArray(form.pricing.includes).filter(Boolean),
        }),

        paymentPlan: form.paymentPlan.map((item) =>
            cleanObject({
                ...item,
                percentage: numberValue(item.percentage),
            })
        ),

        programDetails: {
            ...form.programDetails,

            stipend: cleanObject({
                ...form.programDetails.stipend,
                minimum: numberValue(
                    form.programDetails.stipend.minimum
                ),
                maximum: numberValue(
                    form.programDetails.stipend.maximum
                ),
            }),

            estimatedBudget: cleanObject({
                ...form.programDetails.estimatedBudget,
                minimum: numberValue(
                    form.programDetails.estimatedBudget.minimum
                ),
                maximum: numberValue(
                    form.programDetails.estimatedBudget.maximum
                ),
            }),

            visaRefusalRefund: cleanObject({
                ...form.programDetails.visaRefusalRefund,
                percentage: numberValue(
                    form.programDetails.visaRefusalRefund.percentage
                ),
            }),
        },

        applicationConfig: {
            ...form.applicationConfig,

            questions: form.applicationConfig.questions.map(
                (question) => ({
                    ...question,
                    options: toArray(question.options).filter(Boolean),
                })
            ),

            requiredDocuments:
                form.applicationConfig.requiredDocuments.map(
                    (document) => ({
                        ...document,
                        name: stringValue(document.name).trim(),
                        type: document.type || "OTHER",
                        description: stringValue(
                            document.description
                        ).trim(),
                        required: document.required !== false,
                    })
                ),
        },
    };

    delete payload.legacyId;
    delete payload.applicants;

    return payload;
};

/* -------------------------------------------------------------------------- */
/* SMALL FORM COMPONENTS                                                      */
/* -------------------------------------------------------------------------- */

const Field = ({
    label,
    value,
    onChange,
    placeholder,
    type = "text",
    hint,
    required = false,
    min,
    max,
    step,
    disabled = false,
}) => (
    <div className="field">
        <label className="field__label">
            {label}
            {required && <span className="required-mark"> *</span>}
        </label>

        <input
            className="field__input"
            type={type}
            value={value ?? ""}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder || ""}
            required={required}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
        />

        {hint && <p className="field__hint">{hint}</p>}
    </div>
);

const SelectField = ({
    label,
    value,
    onChange,
    options = [],
    placeholder = "Select an option",
    required = false,
    hint,
}) => (
    <div className="field">
        <label className="field__label">
            {label}
            {required && <span className="required-mark"> *</span>}
        </label>

        <div className="select-wrap">
            <select
                className="field__input field__select"
                value={value ?? ""}
                onChange={(event) => onChange(event.target.value)}
                required={required}
            >
                <option value="">{placeholder}</option>

                {options.map((option) => {
                    const item =
                        typeof option === "string"
                            ? { value: option, label: option }
                            : option;

                    return (
                        <option
                            key={item.value}
                            value={item.value}
                        >
                            {item.label}
                        </option>
                    );
                })}
            </select>

            <HiOutlineChevronDown />
        </div>

        {hint && <p className="field__hint">{hint}</p>}
    </div>
);

const TextareaField = ({
    label,
    value,
    onChange,
    placeholder,
    rows = 4,
    hint,
}) => (
    <div className="field field--full">
        <label className="field__label">{label}</label>

        <textarea
            className="field__input field__textarea"
            value={value ?? ""}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder || ""}
            rows={rows}
        />

        {hint && <p className="field__hint">{hint}</p>}
    </div>
);

const Section = ({
    icon: Icon,
    title,
    description,
    children,
    optional = false,
}) => (
    <section className="form-card">
        <div className="form-card__header">
            <div className="form-card__title-wrap">
                <span className="form-card__icon">
                    <Icon />
                </span>

                <div>
                    <h2>{title}</h2>
                    {description && <p>{description}</p>}
                </div>
            </div>

            {optional && (
                <span className="section-optional">Optional</span>
            )}
        </div>

        <div className="form-card__body">
            {children}
        </div>
    </section>
);

const StringListEditor = ({
    label,
    description,
    items = [],
    onChange,
    placeholder = "Enter an item",
}) => {
    const addItem = () => onChange([...items, ""]);

    const updateItem = (index, value) => {
        onChange(
            items.map((item, itemIndex) =>
                itemIndex === index ? value : item
            )
        );
    };

    const removeItem = (index) => {
        onChange(items.filter((_, itemIndex) => itemIndex !== index));
    };

    return (
        <div className="list-editor">
            <div className="list-editor__header">
                <div>
                    <strong>{label}</strong>
                    {description && <p>{description}</p>}
                </div>

                <button
                    type="button"
                    className="button button--light button--small"
                    onClick={addItem}
                >
                    <HiOutlinePlus />
                    Add
                </button>
            </div>

            <div className="list-editor__items">
                {items.length === 0 && (
                    <div className="empty-list">
                        No items added yet.
                    </div>
                )}

                {items.map((item, index) => (
                    <div
                        className="list-editor__row"
                        key={`list-${index}`}
                    >
                        <input
                            className="field__input"
                            value={item ?? ""}
                            onChange={(event) =>
                                updateItem(index, event.target.value)
                            }
                            placeholder={placeholder}
                        />

                        <button
                            type="button"
                            className="icon-button icon-button--danger"
                            onClick={() => removeItem(index)}
                            aria-label="Remove item"
                        >
                            <HiOutlineTrash />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

/* -------------------------------------------------------------------------- */
/* MAIN FORM                                                                  */
/* -------------------------------------------------------------------------- */

const OpportunityForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const isEditing = Boolean(id);

    const [form, setForm] = useState(DEFAULT_FORM);
    const [destinations, setDestinations] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [destinationMode, setDestinationMode] = useState("existing");

    const selectedDestination = useMemo(
        () =>
            destinations.find(
                (destination) =>
                    destination.countrySlug === form.countrySlug
            ),
        [destinations, form.countrySlug]
    );

    /* ---------------------------------------------------------------------- */
    /* STATE HELPERS                                                          */
    /* ---------------------------------------------------------------------- */

    const updateField = (field, value) => {
        setForm((previous) => ({
            ...previous,
            [field]: value,
        }));
    };

    const updateNested = (parent, field, value) => {
        setForm((previous) => ({
            ...previous,
            [parent]: {
                ...previous[parent],
                [field]: value,
            },
        }));
    };

    const updateDeepNested = (
        parent,
        child,
        field,
        value
    ) => {
        setForm((previous) => ({
            ...previous,
            [parent]: {
                ...previous[parent],
                [child]: {
                    ...previous[parent][child],
                    [field]: value,
                },
            },
        }));
    };

    const updateArrayItem = (
        field,
        index,
        property,
        value
    ) => {
        setForm((previous) => ({
            ...previous,
            [field]: previous[field].map((item, itemIndex) =>
                itemIndex === index
                    ? { ...item, [property]: value }
                    : item
            ),
        }));
    };

    /* ---------------------------------------------------------------------- */
    /* LOAD DATA                                                              */
    /* ---------------------------------------------------------------------- */

    useEffect(() => {
        let mounted = true;

        const loadForm = async () => {
            setLoading(true);
            setError("");

            try {
                const destinationResponse =
                    await opportunitiesService.getDestinations();

                const destinationItems =
                    getResponseItems(destinationResponse).map(
                        normalizeDestination
                    );

                if (!mounted) return;

                setDestinations(destinationItems);

                if (isEditing) {
                    const response =
                        await opportunitiesService.getOpportunityById(id);

                    const opportunity =
                        getOpportunityFromResponse(response);

                    if (!mounted) return;

                    const normalized =
                        normalizeOpportunity(opportunity);

                    setForm(normalized);

                    setDestinationMode(
                        destinationItems.some(
                            (destination) =>
                                destination.countrySlug ===
                                normalized.countrySlug
                        )
                            ? "existing"
                            : "new"
                    );
                }
            } catch (loadError) {
                if (!mounted) return;

                setError(
                    loadError?.response?.data?.message ||
                    loadError?.message ||
                    "Unable to load the opportunity form."
                );
            } finally {
                if (mounted) setLoading(false);
            }
        };

        loadForm();

        return () => {
            mounted = false;
        };
    }, [id, isEditing]);

    /* ---------------------------------------------------------------------- */
    /* DESTINATION                                                            */
    /* ---------------------------------------------------------------------- */

    const handleDestinationChange = (countrySlug) => {
        const destination = destinations.find(
            (item) => item.countrySlug === countrySlug
        );

        if (!destination) return;

        setForm((previous) => ({
            ...previous,
            ...destination,
        }));

        setDestinationMode("existing");
    };

    const handleNewDestination = () => {
        setDestinationMode("new");

        setForm((previous) => ({
            ...previous,
            countryId: "",
            countryName: "",
            countrySlug: "",
            countryFlag: "",
            countryImage: "",
            countryCategories: [],
            countryVisa: "",
            countryDuration: "",
            countryProcessingTime: "",
            countryDescription: "",
            opportunityScore: "",
            successRate: "",
        }));
    };

    const handleCountryNameChange = (value) => {
        setForm((previous) => ({
            ...previous,
            countryName: value,
            countrySlug: slugify(value),
        }));
    };

    const handleTitleChange = (value) => {
        setForm((previous) => ({
            ...previous,
            title: value,
            slug: isEditing
                ? previous.slug
                : slugify(value),
        }));
    };

    /* ---------------------------------------------------------------------- */
    /* REPEATING OBJECTS                                                      */
    /* ---------------------------------------------------------------------- */

    const addStep = () => {
        updateField("steps", [
            ...form.steps,
            {
                title: "",
                description: "",
                duration: "",
            },
        ]);
    };

    const removeStep = (index) => {
        updateField(
            "steps",
            form.steps.filter((_, itemIndex) => itemIndex !== index)
        );
    };

    const addPosition = () => {
        updateField("positions", [
            ...form.positions,
            {
                title: "",
                category: "",
                sector: "",
                description: "",
                image: "",
                salary: "",
                demand: "",
                roles: [],
                courses: [],
                requirements: [],
                benefits: [],
            },
        ]);
    };

    const removePosition = (index) => {
        updateField(
            "positions",
            form.positions.filter((_, itemIndex) => itemIndex !== index)
        );
    };

    const addFaq = () => {
        updateField("faq", [
            ...form.faq,
            {
                question: "",
                answer: "",
            },
        ]);
    };

    const addPaymentStage = () => {
        updateField("paymentPlan", [
            ...form.paymentPlan,
            {
                stage: "",
                title: "",
                description: "",
                amount: "",
                percentage: "",
                currency: "NGN",
            },
        ]);
    };

    const addQuestion = () => {
        updateNested("applicationConfig", "questions", [
            ...form.applicationConfig.questions,
            {
                question: "",
                type: "TEXT",
                required: false,
                options: [],
            },
        ]);
    };

    const addRequiredDocument = () => {
        updateNested(
            "applicationConfig",
            "requiredDocuments",
            [
                ...form.applicationConfig.requiredDocuments,
                {
                    name: "",
                    type: "OTHER",
                    description: "",
                    required: true,
                },
            ]
        );
    };

    /* ---------------------------------------------------------------------- */
    /* VALIDATION                                                             */
    /* ---------------------------------------------------------------------- */

    const validateForm = () => {
        if (!form.countryName.trim()) {
            return "Select or enter a destination country.";
        }

        if (!form.countrySlug.trim()) {
            return "Destination slug is required.";
        }

        if (!form.title.trim()) {
            return "Opportunity title is required.";
        }

        if (!form.category.trim()) {
            return "Opportunity category is required.";
        }

        if (!form.type) {
            return "Opportunity type is required.";
        }

        if (!form.description.trim()) {
            return "Opportunity description is required.";
        }

        if (!form.slug.trim()) {
            return "Opportunity slug is required.";
        }

        if (
            !APPLICATION_FLOWS.some(
                (item) => item.value === form.applicationFlow
            )
        ) {
            return "Select a valid application flow.";
        }

        const invalidPosition = form.positions.some(
            (position) => !position.title.trim()
        );

        if (invalidPosition) {
            return "Every position must have a title.";
        }

        const invalidDocument =
            form.applicationConfig.requiredDocuments.some(
                (document) => !document.name.trim()
            );

        if (invalidDocument) {
            return "Every required document must have a name.";
        }

        return "";
    };

    /* ---------------------------------------------------------------------- */
    /* SUBMIT                                                                 */
    /* ---------------------------------------------------------------------- */

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        const validationError = validateForm();

        if (validationError) {
            setError(validationError);
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        setSaving(true);

        try {
            const payload = buildPayload(form);

            /*
             * Destination metadata is shared between every opportunity
             * belonging to the same country.
             *
             * Existing destinations are updated separately.
             */
            if (destinationMode === "existing") {
                await opportunitiesService.updateDestination(
                    payload.countrySlug,
                    {
                        countryImage: payload.countryImage,
                        countryFlag: payload.countryFlag,
                        countryCategories: payload.countryCategories,
                        countryVisa: payload.countryVisa,
                        countryDuration: payload.countryDuration,
                        countryProcessingTime:
                            payload.countryProcessingTime,
                        countryDescription:
                            payload.countryDescription,
                        opportunityScore: payload.opportunityScore,
                        successRate: payload.successRate,
                    }
                );
            }

            if (isEditing) {
                await opportunitiesService.updateOpportunity(
                    id,
                    payload
                );
            } else {
                await opportunitiesService.createOpportunity(payload);
            }

            setSuccess(
                isEditing
                    ? "Opportunity updated successfully."
                    : "Opportunity created successfully."
            );

            navigate("/admin/opportunities", {
                replace: true,
                state: {
                    successMessage: isEditing
                        ? "Opportunity updated successfully."
                        : "Opportunity created successfully.",
                },
            });
        } catch (submitError) {
            setError(
                submitError?.response?.data?.message ||
                submitError?.message ||
                "Unable to save this opportunity."
            );

            window.scrollTo({ top: 0, behavior: "smooth" });
        } finally {
            setSaving(false);
        }
    };

    /* ---------------------------------------------------------------------- */
    /* RENDER                                                                 */
    /* ---------------------------------------------------------------------- */

    if (loading) {
        return (
            <div className="opportunity-form-page">
                <div className="form-loading">
                    <span className="form-spinner" />
                    <p>Preparing opportunity form...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="opportunity-form-page">
            <div className="opportunity-form-container">

                {/* HEADER */}
                <header className="opportunity-form-header">
                    <Link
                        to="/admin/opportunities"
                        className="opportunity-form-back"
                    >
                        <HiOutlineArrowLeft />
                        Back to opportunities
                    </Link>

                    <div className="opportunity-form-heading">
                        <div>
                            <span className="opportunity-form-eyebrow">
                                OPPORTUNITY MANAGEMENT
                            </span>

                            <h1>
                                {isEditing
                                    ? "Edit opportunity"
                                    : "Create opportunity"}
                            </h1>

                            <p>
                                Configure the destination, programme,
                                pricing and application experience.
                            </p>
                        </div>

                        <span className="opportunity-form-status-dot">
                            {isEditing ? "Editing" : "New opportunity"}
                        </span>
                    </div>
                </header>

                {error && (
                    <div className="form-alert form-alert--error">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="form-alert form-alert--success">
                        {success}
                    </div>
                )}

                <form
                    className="opportunity-form"
                    onSubmit={handleSubmit}
                >

                    {/* DESTINATION */}
                    <Section
                        icon={HiOutlineGlobeAlt}
                        title="Destination"
                        description="Choose the country this opportunity belongs to."
                    >
                        <div className="destination-mode">
                            <button
                                type="button"
                                className={
                                    destinationMode === "existing"
                                        ? "destination-mode__button is-active"
                                        : "destination-mode__button"
                                }
                                onClick={() => {
                                    setDestinationMode("existing");
                                }}
                            >
                                Existing destination
                            </button>

                            <button
                                type="button"
                                className={
                                    destinationMode === "new"
                                        ? "destination-mode__button is-active"
                                        : "destination-mode__button"
                                }
                                onClick={handleNewDestination}
                            >
                                New destination
                            </button>
                        </div>

                        {destinationMode === "existing" ? (
                            <div className="form-grid">
                                <SelectField
                                    label="Destination country"
                                    value={form.countrySlug}
                                    onChange={handleDestinationChange}
                                    required
                                    options={destinations.map(
                                        (destination) => ({
                                            value: destination.countrySlug,
                                            label: destination.countryName,
                                        })
                                    )}
                                    placeholder="Choose a destination"
                                />

                                {selectedDestination && (
                                    <div className="destination-selected">
                                        <span>
                                            {selectedDestination.countryFlag}
                                        </span>
                                        <div>
                                            <strong>
                                                {selectedDestination.countryName}
                                            </strong>
                                            <small>
                                                Existing destination profile
                                            </small>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="form-grid">
                                <Field
                                    label="Country name"
                                    value={form.countryName}
                                    onChange={handleCountryNameChange}
                                    placeholder="e.g. New Zealand"
                                    required
                                />

                                <Field
                                    label="Country slug"
                                    value={form.countrySlug}
                                    onChange={(value) =>
                                        updateField("countrySlug", slugify(value))
                                    }
                                    placeholder="new-zealand"
                                    required
                                />

                                <Field
                                    label="Country flag"
                                    value={form.countryFlag}
                                    onChange={(value) =>
                                        updateField("countryFlag", value)
                                    }
                                    placeholder="🇳🇿"
                                    hint="You can use a flag emoji."
                                />
                            </div>
                        )}

                        <div className="form-divider" />

                        <div className="destination-profile">
                            <div className="destination-profile__heading">
                                <div>
                                    <h3>Shared destination profile</h3>
                                    <p>
                                        These details belong to the country,
                                        not to an individual opportunity.
                                    </p>
                                </div>
                            </div>

                            <ImagePicker
                                label="Destination image"
                                value={form.countryImage}
                                onChange={(value) =>
                                    updateField("countryImage", value)
                                }
                                aspect="landscape"
                            />

                            <div className="form-grid">
                                <Field
                                    label="Visa information"
                                    value={form.countryVisa}
                                    onChange={(value) =>
                                        updateField("countryVisa", value)
                                    }
                                    placeholder="e.g. Work visa"
                                />

                                <Field
                                    label="Country duration"
                                    value={form.countryDuration}
                                    onChange={(value) =>
                                        updateField("countryDuration", value)
                                    }
                                    placeholder="e.g. 2–3 years"
                                />

                                <Field
                                    label="Processing time"
                                    value={form.countryProcessingTime}
                                    onChange={(value) =>
                                        updateField(
                                            "countryProcessingTime",
                                            value
                                        )
                                    }
                                    placeholder="e.g. 8–12 weeks"
                                />

                                <Field
                                    label="Opportunity score"
                                    type="number"
                                    value={form.opportunityScore}
                                    onChange={(value) =>
                                        updateField("opportunityScore", value)
                                    }
                                    min="0"
                                />

                                <Field
                                    label="Success rate"
                                    type="number"
                                    value={form.successRate}
                                    onChange={(value) =>
                                        updateField("successRate", value)
                                    }
                                    min="0"
                                    max="100"
                                />
                            </div>

                            <StringListEditor
                                label="Country categories"
                                items={form.countryCategories}
                                onChange={(value) =>
                                    updateField("countryCategories", value)
                                }
                                placeholder="e.g. Skilled Migration"
                            />

                            <TextareaField
                                label="Country description"
                                value={form.countryDescription}
                                onChange={(value) =>
                                    updateField("countryDescription", value)
                                }
                                placeholder="Describe the destination..."
                            />
                        </div>
                    </Section>

                    {/* BASIC INFORMATION */}
                    <Section
                        icon={HiOutlineBriefcase}
                        title="Opportunity information"
                        description="The main details displayed on the public opportunity page."
                    >
                        <div className="form-grid">
                            <Field
                                label="Opportunity title"
                                value={form.title}
                                onChange={handleTitleChange}
                                placeholder="e.g. New Zealand Trainee Programme"
                                required
                            />

                            <Field
                                label="Opportunity slug"
                                value={form.slug}
                                onChange={(value) =>
                                    updateField("slug", slugify(value))
                                }
                                placeholder="new-zealand-trainee-programme"
                                required
                                hint="Used in the public opportunity URL."
                            />

                            <Field
                                label="Category"
                                value={form.category}
                                onChange={(value) =>
                                    updateField("category", value)
                                }
                                placeholder="e.g. Trainee Programme"
                                required
                            />

                            <SelectField
                                label="Opportunity type"
                                value={form.type}
                                onChange={(value) =>
                                    updateField("type", value)
                                }
                                options={OPPORTUNITY_TYPE_OPTIONS}
                                placeholder="Select opportunity type"
                                required
                            />

                            <SelectField
                                label="Location"
                                value={form.location}
                                onChange={(value) =>
                                    updateField("location", value)
                                }
                                options={LOCATION_OPTIONS}
                                placeholder="Select location"
                            />

                            <SelectField
                                label="Duration"
                                value={form.duration}
                                onChange={(value) =>
                                    updateField("duration", value)
                                }
                                options={DURATION_OPTIONS}
                                placeholder="Select duration"
                            />

                            <Field
                                label="Salary"
                                value={form.salary}
                                onChange={(value) =>
                                    updateField("salary", value)
                                }
                                placeholder="e.g. NZD 25 per hour"
                            />

                            <Field
                                label="Demand"
                                value={form.demand}
                                onChange={(value) =>
                                    updateField("demand", value)
                                }
                                placeholder="e.g. High demand"
                            />

                            <Field
                                label="Icon"
                                value={form.icon}
                                onChange={(value) =>
                                    updateField("icon", value)
                                }
                                placeholder="Optional icon identifier"
                            />

                            <div className="field field--full">
                                <ImagePicker
                                    label="Opportunity image"
                                    value={form.image}
                                    onChange={(value) =>
                                        updateField("image", value)
                                    }
                                    aspect="landscape"
                                />
                            </div>

                            <TextareaField
                                label="Opportunity description"
                                value={form.description}
                                onChange={(value) =>
                                    updateField("description", value)
                                }
                                placeholder="Explain the opportunity, who it is for and what applicants can expect..."
                                rows={6}
                                hint="This is the main public-facing description."
                            />
                        </div>
                    </Section>

                    {/* CONTENT */}
                    <Section
                        icon={HiOutlineDocumentText}
                        title="Opportunity content"
                        description="Highlights, requirements, documents and benefits shown to applicants."
                    >
                        <div className="form-grid">
                            <StringListEditor
                                label="Highlights"
                                items={form.highlights}
                                onChange={(value) =>
                                    updateField("highlights", value)
                                }
                                placeholder="Enter an opportunity highlight"
                            />

                            <StringListEditor
                                label="Requirements"
                                items={form.requirements}
                                onChange={(value) =>
                                    updateField("requirements", value)
                                }
                                placeholder="Enter an applicant requirement"
                            />

                            <StringListEditor
                                label="Public document list"
                                items={form.documents}
                                onChange={(value) =>
                                    updateField("documents", value)
                                }
                                placeholder="e.g. International passport"
                            />

                            <StringListEditor
                                label="Benefits"
                                items={form.benefits}
                                onChange={(value) =>
                                    updateField("benefits", value)
                                }
                                placeholder="Enter a programme benefit"
                            />
                        </div>
                    </Section>

                    {/* JOURNEY */}
                    <Section
                        icon={HiOutlineClipboardDocumentList}
                        title="Application journey"
                        description="Define the stages applicants will go through."
                        optional
                    >
                        <div className="repeat-list">
                            {form.steps.map((step, index) => (
                                <div
                                    className="repeat-card"
                                    key={`step-${index}`}
                                >
                                    <div className="repeat-card__header">
                                        <strong>
                                            Step {index + 1}
                                        </strong>

                                        <button
                                            type="button"
                                            className="icon-button icon-button--danger"
                                            onClick={() => removeStep(index)}
                                        >
                                            <HiOutlineTrash />
                                        </button>
                                    </div>

                                    <div className="form-grid">
                                        <Field
                                            label="Step title"
                                            value={step.title}
                                            onChange={(value) =>
                                                updateArrayItem(
                                                    "steps",
                                                    index,
                                                    "title",
                                                    value
                                                )
                                            }
                                            placeholder="e.g. Document submission"
                                        />

                                        <Field
                                            label="Duration"
                                            value={step.duration}
                                            onChange={(value) =>
                                                updateArrayItem(
                                                    "steps",
                                                    index,
                                                    "duration",
                                                    value
                                                )
                                            }
                                            placeholder="e.g. 1–2 weeks"
                                        />

                                        <TextareaField
                                            label="Description"
                                            value={step.description}
                                            onChange={(value) =>
                                                updateArrayItem(
                                                    "steps",
                                                    index,
                                                    "description",
                                                    value
                                                )
                                            }
                                            placeholder="Explain this stage..."
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            type="button"
                            className="button button--light"
                            onClick={addStep}
                        >
                            <HiOutlinePlus />
                            Add journey step
                        </button>
                    </Section>

                    {/* POSITIONS */}
                    <Section
                        icon={HiOutlineAcademicCap}
                        title="Positions and roles"
                        description="Add available roles, sectors or programme positions."
                        optional
                    >
                        <div className="repeat-list">
                            {form.positions.map((position, index) => (
                                <div
                                    className="repeat-card"
                                    key={`position-${index}`}
                                >
                                    <div className="repeat-card__header">
                                        <strong>
                                            Position {index + 1}
                                        </strong>

                                        <button
                                            type="button"
                                            className="icon-button icon-button--danger"
                                            onClick={() =>
                                                removePosition(index)
                                            }
                                        >
                                            <HiOutlineTrash />
                                        </button>
                                    </div>

                                    <div className="form-grid">
                                        <Field
                                            label="Position title"
                                            value={position.title}
                                            onChange={(value) =>
                                                updateArrayItem(
                                                    "positions",
                                                    index,
                                                    "title",
                                                    value
                                                )
                                            }
                                            placeholder="e.g. Warehouse Positions"
                                            required
                                        />

                                        <Field
                                            label="Sector"
                                            value={position.sector}
                                            onChange={(value) =>
                                                updateArrayItem(
                                                    "positions",
                                                    index,
                                                    "sector",
                                                    value
                                                )
                                            }
                                            placeholder="e.g. Warehouses"
                                        />

                                        <Field
                                            label="Category"
                                            value={position.category}
                                            onChange={(value) =>
                                                updateArrayItem(
                                                    "positions",
                                                    index,
                                                    "category",
                                                    value
                                                )
                                            }
                                            placeholder="e.g. Agriculture"
                                        />

                                        <Field
                                            label="Salary"
                                            value={position.salary}
                                            onChange={(value) =>
                                                updateArrayItem(
                                                    "positions",
                                                    index,
                                                    "salary",
                                                    value
                                                )
                                            }
                                            placeholder="e.g. NZD 25/hour"
                                        />

                                        <Field
                                            label="Demand"
                                            value={position.demand}
                                            onChange={(value) =>
                                                updateArrayItem(
                                                    "positions",
                                                    index,
                                                    "demand",
                                                    value
                                                )
                                            }
                                            placeholder="e.g. High"
                                        />

                                        <div className="field field--full">
                                            <ImagePicker
                                                label="Position image"
                                                value={position.image || ""}
                                                onChange={(value) =>
                                                    updateArrayItem(
                                                        "positions",
                                                        index,
                                                        "image",
                                                        value
                                                    )
                                                }
                                            />
                                        </div>

                                        <TextareaField
                                            label="Description"
                                            value={position.description}
                                            onChange={(value) =>
                                                updateArrayItem(
                                                    "positions",
                                                    index,
                                                    "description",
                                                    value
                                                )
                                            }
                                            placeholder="Describe this position..."
                                        />

                                        <StringListEditor
                                            label="Roles"
                                            items={position.roles || []}
                                            onChange={(value) =>
                                                updateArrayItem(
                                                    "positions",
                                                    index,
                                                    "roles",
                                                    value
                                                )
                                            }
                                            placeholder="e.g. Product Packer"
                                        />

                                        <StringListEditor
                                            label="Courses"
                                            items={position.courses || []}
                                            onChange={(value) =>
                                                updateArrayItem(
                                                    "positions",
                                                    index,
                                                    "courses",
                                                    value
                                                )
                                            }
                                            placeholder="Enter a course"
                                        />

                                        <StringListEditor
                                            label="Position requirements"
                                            items={position.requirements || []}
                                            onChange={(value) =>
                                                updateArrayItem(
                                                    "positions",
                                                    index,
                                                    "requirements",
                                                    value
                                                )
                                            }
                                        />

                                        <StringListEditor
                                            label="Position benefits"
                                            items={position.benefits || []}
                                            onChange={(value) =>
                                                updateArrayItem(
                                                    "positions",
                                                    index,
                                                    "benefits",
                                                    value
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            type="button"
                            className="button button--light"
                            onClick={addPosition}
                        >
                            <HiOutlinePlus />
                            Add position
                        </button>
                    </Section>

                    {/* WORK CONDITIONS */}
                    <Section
                        icon={HiOutlineBriefcase}
                        title="Work conditions"
                        description="Optional training and working arrangement information."
                        optional
                    >
                        <div className="form-grid">
                            <Field
                                label="Training duration"
                                value={form.workConditions.trainingDuration}
                                onChange={(value) =>
                                    updateNested(
                                        "workConditions",
                                        "trainingDuration",
                                        value
                                    )
                                }
                                placeholder="e.g. 12 months"
                            />

                            <Field
                                label="Working schedule"
                                value={form.workConditions.workingSchedule}
                                onChange={(value) =>
                                    updateNested(
                                        "workConditions",
                                        "workingSchedule",
                                        value
                                    )
                                }
                                placeholder="e.g. Monday – Friday"
                            />

                            <Field
                                label="Training environment"
                                value={form.workConditions.trainingEnvironment}
                                onChange={(value) =>
                                    updateNested(
                                        "workConditions",
                                        "trainingEnvironment",
                                        value
                                    )
                                }
                                placeholder="e.g. On-site"
                            />

                            <Field
                                label="Stipend"
                                value={form.workConditions.stipend}
                                onChange={(value) =>
                                    updateNested(
                                        "workConditions",
                                        "stipend",
                                        value
                                    )
                                }
                                placeholder="e.g. NZD 2,000 monthly"
                            />

                            <Field
                                label="Location"
                                value={form.workConditions.location}
                                onChange={(value) =>
                                    updateNested(
                                        "workConditions",
                                        "location",
                                        value
                                    )
                                }
                                placeholder="Programme location"
                            />

                            <TextareaField
                                label="Additional information"
                                value={
                                    form.workConditions.additionalInformation
                                }
                                onChange={(value) =>
                                    updateNested(
                                        "workConditions",
                                        "additionalInformation",
                                        value
                                    )
                                }
                                placeholder="Additional working conditions..."
                            />
                        </div>
                    </Section>

                    {/* CONTRACT */}
                    <Section
                        icon={HiOutlineDocumentText}
                        title="Contract information"
                        description="Describe the contract or agreement associated with the opportunity."
                        optional
                    >
                        <TextareaField
                            label="Contract"
                            value={form.contract}
                            onChange={(value) =>
                                updateField("contract", value)
                            }
                            placeholder="Enter contract information..."
                            rows={5}
                        />
                    </Section>

                    {/* PRICING */}
                    <Section
                        icon={HiOutlineCurrencyDollar}
                        title="Pricing"
                        description="Configure the programme fee or estimated cost."
                        optional
                    >
                        <div className="form-grid">
                            <Field
                                label="Total price"
                                value={form.pricing.total}
                                onChange={(value) =>
                                    updateNested("pricing", "total", value)
                                }
                                placeholder="e.g. ₦8,000,000"
                            />

                            <Field
                                label="Minimum price"
                                type="number"
                                value={form.pricing.minimum}
                                onChange={(value) =>
                                    updateNested("pricing", "minimum", value)
                                }
                                min="0"
                            />

                            <Field
                                label="Maximum price"
                                type="number"
                                value={form.pricing.maximum}
                                onChange={(value) =>
                                    updateNested("pricing", "maximum", value)
                                }
                                min="0"
                            />

                            <Field
                                label="Amount"
                                type="number"
                                value={form.pricing.amount}
                                onChange={(value) =>
                                    updateNested("pricing", "amount", value)
                                }
                                min="0"
                            />

                            <Field
                                label="Currency"
                                value={form.pricing.currency}
                                onChange={(value) =>
                                    updateNested("pricing", "currency", value)
                                }
                                placeholder="NGN"
                            />

                            <Field
                                label="Pricing label"
                                value={form.pricing.label}
                                onChange={(value) =>
                                    updateNested("pricing", "label", value)
                                }
                                placeholder="e.g. Programme fee"
                            />

                            <TextareaField
                                label="Pricing description"
                                value={form.pricing.description}
                                onChange={(value) =>
                                    updateNested(
                                        "pricing",
                                        "description",
                                        value
                                    )
                                }
                                placeholder="Explain what the price covers..."
                            />

                            <StringListEditor
                                label="What's included"
                                items={form.pricing.includes}
                                onChange={(value) =>
                                    updateNested("pricing", "includes", value)
                                }
                                placeholder="e.g. Job placement"
                            />
                        </div>
                    </Section>

                    {/* PAYMENT PLAN */}
                    <Section
                        icon={HiOutlineCurrencyDollar}
                        title="Payment plan"
                        description="Define the stages of payment for this opportunity."
                        optional
                    >
                        <div className="repeat-list">
                            {form.paymentPlan.map((payment, index) => (
                                <div
                                    className="repeat-card"
                                    key={`payment-${index}`}
                                >
                                    <div className="repeat-card__header">
                                        <strong>
                                            Payment stage {index + 1}
                                        </strong>

                                        <button
                                            type="button"
                                            className="icon-button icon-button--danger"
                                            onClick={() =>
                                                updateField(
                                                    "paymentPlan",
                                                    form.paymentPlan.filter(
                                                        (_, itemIndex) =>
                                                            itemIndex !== index
                                                    )
                                                )
                                            }
                                        >
                                            <HiOutlineTrash />
                                        </button>
                                    </div>

                                    <div className="form-grid">
                                        <Field
                                            label="Stage"
                                            value={payment.stage}
                                            onChange={(value) =>
                                                updateArrayItem(
                                                    "paymentPlan",
                                                    index,
                                                    "stage",
                                                    value
                                                )
                                            }
                                            placeholder="e.g. Agreement signing"
                                        />

                                        <Field
                                            label="Title"
                                            value={payment.title}
                                            onChange={(value) =>
                                                updateArrayItem(
                                                    "paymentPlan",
                                                    index,
                                                    "title",
                                                    value
                                                )
                                            }
                                            placeholder="Payment title"
                                        />

                                        <Field
                                            label="Amount"
                                            value={payment.amount}
                                            onChange={(value) =>
                                                updateArrayItem(
                                                    "paymentPlan",
                                                    index,
                                                    "amount",
                                                    value
                                                )
                                            }
                                            placeholder="e.g. ₦2,000,000"
                                        />

                                        <Field
                                            label="Percentage"
                                            type="number"
                                            value={payment.percentage}
                                            onChange={(value) =>
                                                updateArrayItem(
                                                    "paymentPlan",
                                                    index,
                                                    "percentage",
                                                    value
                                                )
                                            }
                                            min="0"
                                            max="100"
                                        />

                                        <Field
                                            label="Currency"
                                            value={payment.currency}
                                            onChange={(value) =>
                                                updateArrayItem(
                                                    "paymentPlan",
                                                    index,
                                                    "currency",
                                                    value
                                                )
                                            }
                                            placeholder="NGN"
                                        />

                                        <TextareaField
                                            label="Description"
                                            value={payment.description}
                                            onChange={(value) =>
                                                updateArrayItem(
                                                    "paymentPlan",
                                                    index,
                                                    "description",
                                                    value
                                                )
                                            }
                                            placeholder="Explain this payment stage..."
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            type="button"
                            className="button button--light"
                            onClick={addPaymentStage}
                        >
                            <HiOutlinePlus />
                            Add payment stage
                        </button>
                    </Section>

                    {/* PROGRAMME DETAILS */}
                    <Section
                        icon={HiOutlineAcademicCap}
                        title="Programme details"
                        description="Additional structured information for specialist programmes."
                        optional
                    >
                        <div className="form-grid">
                            <Field
                                label="Programme type"
                                value={form.programDetails.programType}
                                onChange={(value) =>
                                    updateNested(
                                        "programDetails",
                                        "programType",
                                        value
                                    )
                                }
                                placeholder="e.g. TRAINEE_APPRENTICESHIP"
                            />

                            <StringListEditor
                                label="Target intakes"
                                items={form.programDetails.targetIntakes}
                                onChange={(value) =>
                                    updateNested(
                                        "programDetails",
                                        "targetIntakes",
                                        value
                                    )
                                }
                                placeholder="e.g. January 2027"
                            />

                            <StringListEditor
                                label="Course categories"
                                items={form.programDetails.courseCategories}
                                onChange={(value) =>
                                    updateNested(
                                        "programDetails",
                                        "courseCategories",
                                        value
                                    )
                                }
                                placeholder="e.g. Hospitality"
                            />
                        </div>

                        <div className="form-subsection">
                            <h3>Stipend</h3>

                            <div className="form-grid">
                                <Field
                                    label="Minimum"
                                    type="number"
                                    value={
                                        form.programDetails.stipend.minimum
                                    }
                                    onChange={(value) =>
                                        updateDeepNested(
                                            "programDetails",
                                            "stipend",
                                            "minimum",
                                            value
                                        )
                                    }
                                    min="0"
                                />

                                <Field
                                    label="Maximum"
                                    type="number"
                                    value={
                                        form.programDetails.stipend.maximum
                                    }
                                    onChange={(value) =>
                                        updateDeepNested(
                                            "programDetails",
                                            "stipend",
                                            "maximum",
                                            value
                                        )
                                    }
                                    min="0"
                                />

                                <Field
                                    label="Currency"
                                    value={
                                        form.programDetails.stipend.currency
                                    }
                                    onChange={(value) =>
                                        updateDeepNested(
                                            "programDetails",
                                            "stipend",
                                            "currency",
                                            value
                                        )
                                    }
                                    placeholder="NZD"
                                />

                                <Field
                                    label="Frequency"
                                    value={
                                        form.programDetails.stipend.frequency
                                    }
                                    onChange={(value) =>
                                        updateDeepNested(
                                            "programDetails",
                                            "stipend",
                                            "frequency",
                                            value
                                        )
                                    }
                                    placeholder="e.g. MONTHLY"
                                />

                                <Field
                                    label="Status"
                                    value={
                                        form.programDetails.stipend.status
                                    }
                                    onChange={(value) =>
                                        updateDeepNested(
                                            "programDetails",
                                            "stipend",
                                            "status",
                                            value
                                        )
                                    }
                                    placeholder="e.g. SUBJECT_TO_PROVIDER_CONFIRMATION"
                                />
                            </div>
                        </div>

                        <div className="form-subsection">
                            <h3>Estimated budget</h3>

                            <div className="form-grid">
                                <Field
                                    label="Minimum"
                                    type="number"
                                    value={
                                        form.programDetails.estimatedBudget.minimum
                                    }
                                    onChange={(value) =>
                                        updateDeepNested(
                                            "programDetails",
                                            "estimatedBudget",
                                            "minimum",
                                            value
                                        )
                                    }
                                    min="0"
                                />

                                <Field
                                    label="Maximum"
                                    type="number"
                                    value={
                                        form.programDetails.estimatedBudget.maximum
                                    }
                                    onChange={(value) =>
                                        updateDeepNested(
                                            "programDetails",
                                            "estimatedBudget",
                                            "maximum",
                                            value
                                        )
                                    }
                                    min="0"
                                />

                                <Field
                                    label="Currency"
                                    value={
                                        form.programDetails.estimatedBudget.currency
                                    }
                                    onChange={(value) =>
                                        updateDeepNested(
                                            "programDetails",
                                            "estimatedBudget",
                                            "currency",
                                            value
                                        )
                                    }
                                    placeholder="NGN"
                                />
                            </div>
                        </div>

                        <div className="form-subsection">
                            <h3>Visa refusal refund</h3>

                            <div className="form-grid">
                                <div className="field">
                                    <label className="field__label">
                                        Refund available
                                    </label>

                                    <label className="toggle-field">
                                        <input
                                            type="checkbox"
                                            checked={
                                                form.programDetails
                                                    .visaRefusalRefund.available
                                            }
                                            onChange={(event) =>
                                                updateDeepNested(
                                                    "programDetails",
                                                    "visaRefusalRefund",
                                                    "available",
                                                    event.target.checked
                                                )
                                            }
                                        />
                                        <span>
                                            {form.programDetails
                                                .visaRefusalRefund.available
                                                ? "Available"
                                                : "Not available"}
                                        </span>
                                    </label>
                                </div>

                                <Field
                                    label="Refund percentage"
                                    type="number"
                                    value={
                                        form.programDetails
                                            .visaRefusalRefund.percentage
                                    }
                                    onChange={(value) =>
                                        updateDeepNested(
                                            "programDetails",
                                            "visaRefusalRefund",
                                            "percentage",
                                            value
                                        )
                                    }
                                    min="0"
                                    max="100"
                                />

                                <Field
                                    label="Applies to"
                                    value={
                                        form.programDetails
                                            .visaRefusalRefund.appliesTo
                                    }
                                    onChange={(value) =>
                                        updateDeepNested(
                                            "programDetails",
                                            "visaRefusalRefund",
                                            "appliesTo",
                                            value
                                        )
                                    }
                                    placeholder="e.g. COVERED_TRAINING_FEE_DEPOSIT"
                                />

                                <div className="field">
                                    <label className="field__label">
                                        Written policy required
                                    </label>

                                    <label className="toggle-field">
                                        <input
                                            type="checkbox"
                                            checked={
                                                form.programDetails
                                                    .visaRefusalRefund
                                                    .subjectToWrittenPolicy
                                            }
                                            onChange={(event) =>
                                                updateDeepNested(
                                                    "programDetails",
                                                    "visaRefusalRefund",
                                                    "subjectToWrittenPolicy",
                                                    event.target.checked
                                                )
                                            }
                                        />
                                        <span>
                                            {form.programDetails
                                                .visaRefusalRefund
                                                .subjectToWrittenPolicy
                                                ? "Yes"
                                                : "No"}
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </Section>

                    {/* FAQ */}
                    <Section
                        icon={HiOutlineQuestionMarkCircle}
                        title="Frequently asked questions"
                        description="Answer common questions about this opportunity."
                        optional
                    >
                        <div className="repeat-list">
                            {form.faq.map((item, index) => (
                                <div
                                    className="repeat-card"
                                    key={`faq-${index}`}
                                >
                                    <div className="repeat-card__header">
                                        <strong>Question {index + 1}</strong>

                                        <button
                                            type="button"
                                            className="icon-button icon-button--danger"
                                            onClick={() =>
                                                updateField(
                                                    "faq",
                                                    form.faq.filter(
                                                        (_, itemIndex) =>
                                                            itemIndex !== index
                                                    )
                                                )
                                            }
                                        >
                                            <HiOutlineTrash />
                                        </button>
                                    </div>

                                    <div className="form-grid">
                                        <Field
                                            label="Question"
                                            value={item.question}
                                            onChange={(value) =>
                                                updateArrayItem(
                                                    "faq",
                                                    index,
                                                    "question",
                                                    value
                                                )
                                            }
                                            placeholder="Enter a question"
                                        />

                                        <TextareaField
                                            label="Answer"
                                            value={item.answer}
                                            onChange={(value) =>
                                                updateArrayItem(
                                                    "faq",
                                                    index,
                                                    "answer",
                                                    value
                                                )
                                            }
                                            placeholder="Enter the answer..."
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            type="button"
                            className="button button--light"
                            onClick={addFaq}
                        >
                            <HiOutlinePlus />
                            Add FAQ
                        </button>
                    </Section>

                    {/* APPLICATION CONFIGURATION */}
                    <Section
                        icon={HiOutlineCog6Tooth}
                        title="Application configuration"
                        description="Control the application flow, questions and required documents."
                    >
                        <div className="form-grid">
                            <SelectField
                                label="Application flow"
                                value={form.applicationFlow}
                                onChange={(value) =>
                                    updateField("applicationFlow", value)
                                }
                                options={APPLICATION_FLOWS}
                                required
                                hint="Choose whether applicants apply directly or complete an assessment first."
                            />
                        </div>

                        <div className="form-subsection">
                            <StringListEditor
                                label="Application steps"
                                description="The steps displayed in the application process."
                                items={form.applicationConfig.steps}
                                onChange={(value) =>
                                    updateNested(
                                        "applicationConfig",
                                        "steps",
                                        value
                                    )
                                }
                                placeholder="e.g. DOCUMENTS"
                            />
                        </div>

                        <div className="form-subsection">
                            <div className="repeat-section-heading">
                                <div>
                                    <h3>Application questions</h3>
                                    <p>
                                        Questions applicants must answer.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    className="button button--light button--small"
                                    onClick={addQuestion}
                                >
                                    <HiOutlinePlus />
                                    Add question
                                </button>
                            </div>

                            <div className="repeat-list">
                                {form.applicationConfig.questions.map(
                                    (question, index) => (
                                        <div
                                            className="repeat-card"
                                            key={`question-${index}`}
                                        >
                                            <div className="repeat-card__header">
                                                <strong>
                                                    Question {index + 1}
                                                </strong>

                                                <button
                                                    type="button"
                                                    className="icon-button icon-button--danger"
                                                    onClick={() =>
                                                        updateNested(
                                                            "applicationConfig",
                                                            "questions",
                                                            form.applicationConfig.questions.filter(
                                                                (_, itemIndex) =>
                                                                    itemIndex !== index
                                                            )
                                                        )
                                                    }
                                                >
                                                    <HiOutlineTrash />
                                                </button>
                                            </div>

                                            <div className="form-grid">
                                                <Field
                                                    label="Question"
                                                    value={question.question}
                                                    onChange={(value) =>
                                                        updateArrayItem(
                                                            "applicationConfig.questions",
                                                            index,
                                                            "question",
                                                            value
                                                        )
                                                    }
                                                    placeholder="Enter application question"
                                                />

                                                <SelectField
                                                    label="Question type"
                                                    value={question.type || "TEXT"}
                                                    onChange={(value) => {
                                                        updateNested(
                                                            "applicationConfig",
                                                            "questions",
                                                            form.applicationConfig.questions.map(
                                                                (item, itemIndex) =>
                                                                    itemIndex === index
                                                                        ? {
                                                                            ...item,
                                                                            type: value,
                                                                        }
                                                                        : item
                                                            )
                                                        );
                                                    }}
                                                    options={QUESTION_TYPES}
                                                />

                                                <div className="field">
                                                    <label className="field__label">
                                                        Required question
                                                    </label>

                                                    <label className="toggle-field">
                                                        <input
                                                            type="checkbox"
                                                            checked={
                                                                question.required === true
                                                            }
                                                            onChange={(event) =>
                                                                updateNested(
                                                                    "applicationConfig",
                                                                    "questions",
                                                                    form.applicationConfig.questions.map(
                                                                        (item, itemIndex) =>
                                                                            itemIndex === index
                                                                                ? {
                                                                                    ...item,
                                                                                    required: event.target.checked,
                                                                                }
                                                                                : item
                                                                    )
                                                                )
                                                            }
                                                        />
                                                        <span>
                                                            {question.required
                                                                ? "Required"
                                                                : "Optional"}
                                                        </span>
                                                    </label>
                                                </div>

                                                {question.type === "SELECT" && (
                                                    <div className="field field--full">
                                                        <StringListEditor
                                                            label="Answer options"
                                                            items={question.options || []}
                                                            onChange={(value) =>
                                                                updateNested(
                                                                    "applicationConfig",
                                                                    "questions",
                                                                    form.applicationConfig.questions.map(
                                                                        (item, itemIndex) =>
                                                                            itemIndex === index
                                                                                ? {
                                                                                    ...item,
                                                                                    options: value,
                                                                                }
                                                                                : item
                                                                    )
                                                                )
                                                            }
                                                            placeholder="Enter an answer option"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>

                        <div className="form-subsection">
                            <div className="repeat-section-heading">
                                <div>
                                    <h3>Required documents</h3>
                                    <p>
                                        Documents applicants must submit.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    className="button button--light button--small"
                                    onClick={addRequiredDocument}
                                >
                                    <HiOutlinePlus />
                                    Add document
                                </button>
                            </div>

                            <div className="repeat-list">
                                {form.applicationConfig.requiredDocuments.map(
                                    (document, index) => (
                                        <div
                                            className="repeat-card"
                                            key={`document-${index}`}
                                        >
                                            <div className="repeat-card__header">
                                                <strong>
                                                    Document {index + 1}
                                                </strong>

                                                <button
                                                    type="button"
                                                    className="icon-button icon-button--danger"
                                                    onClick={() =>
                                                        updateNested(
                                                            "applicationConfig",
                                                            "requiredDocuments",
                                                            form.applicationConfig.requiredDocuments.filter(
                                                                (_, itemIndex) =>
                                                                    itemIndex !== index
                                                            )
                                                        )
                                                    }
                                                >
                                                    <HiOutlineTrash />
                                                </button>
                                            </div>

                                            <div className="form-grid">
                                                <Field
                                                    label="Document name"
                                                    value={document.name}
                                                    onChange={(value) =>
                                                        updateNested(
                                                            "applicationConfig",
                                                            "requiredDocuments",
                                                            form.applicationConfig.requiredDocuments.map(
                                                                (item, itemIndex) =>
                                                                    itemIndex === index
                                                                        ? {
                                                                            ...item,
                                                                            name: value,
                                                                        }
                                                                        : item
                                                            )
                                                        )
                                                    }
                                                    placeholder="e.g. International passport"
                                                    required
                                                />

                                                <SelectField
                                                    label="Document type"
                                                    value={document.type || "OTHER"}
                                                    onChange={(value) =>
                                                        updateNested(
                                                            "applicationConfig",
                                                            "requiredDocuments",
                                                            form.applicationConfig.requiredDocuments.map(
                                                                (item, itemIndex) =>
                                                                    itemIndex === index
                                                                        ? {
                                                                            ...item,
                                                                            type: value,
                                                                        }
                                                                        : item
                                                            )
                                                        )
                                                    }
                                                    options={DOCUMENT_TYPES}
                                                />

                                                <TextareaField
                                                    label="Description"
                                                    value={document.description}
                                                    onChange={(value) =>
                                                        updateNested(
                                                            "applicationConfig",
                                                            "requiredDocuments",
                                                            form.applicationConfig.requiredDocuments.map(
                                                                (item, itemIndex) =>
                                                                    itemIndex === index
                                                                        ? {
                                                                            ...item,
                                                                            description: value,
                                                                        }
                                                                        : item
                                                            )
                                                        )
                                                    }
                                                    placeholder="Explain what is required..."
                                                />

                                                <div className="field">
                                                    <label className="field__label">
                                                        Required document
                                                    </label>

                                                    <label className="toggle-field">
                                                        <input
                                                            type="checkbox"
                                                            checked={
                                                                document.required !== false
                                                            }
                                                            onChange={(event) =>
                                                                updateNested(
                                                                    "applicationConfig",
                                                                    "requiredDocuments",
                                                                    form.applicationConfig.requiredDocuments.map(
                                                                        (item, itemIndex) =>
                                                                            itemIndex === index
                                                                                ? {
                                                                                    ...item,
                                                                                    required: event.target.checked,
                                                                                }
                                                                                : item
                                                                    )
                                                                )
                                                            }
                                                        />
                                                        <span>
                                                            {document.required !== false
                                                                ? "Required"
                                                                : "Optional"}
                                                        </span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    </Section>

                    {/* TERMS */}
                    <Section
                        icon={HiOutlineDocumentText}
                        title="Terms and conditions"
                        description="Add the terms applicants must understand before applying."
                        optional
                    >
                        <StringListEditor
                            label="Terms"
                            items={form.terms}
                            onChange={(value) =>
                                updateField("terms", value)
                            }
                            placeholder="Enter a term or condition"
                        />
                    </Section>

                    {/* VISIBILITY */}
                    <Section
                        icon={HiOutlineCheck}
                        title="Publication settings"
                        description="Control whether this opportunity is visible and featured."
                    >
                        <div className="visibility-panel">
                            <label className="visibility-option">
                                <div>
                                    <strong>Publish opportunity</strong>
                                    <p>
                                        Make this opportunity available
                                        to applicants.
                                    </p>
                                </div>

                                <input
                                    type="checkbox"
                                    checked={form.active}
                                    onChange={(event) =>
                                        updateField(
                                            "active",
                                            event.target.checked
                                        )
                                    }
                                />
                            </label>

                            <label className="visibility-option">
                                <div>
                                    <strong>Featured opportunity</strong>
                                    <p>
                                        Highlight this opportunity in
                                        featured listings.
                                    </p>
                                </div>

                                <input
                                    type="checkbox"
                                    checked={form.featured}
                                    onChange={(event) =>
                                        updateField(
                                            "featured",
                                            event.target.checked
                                        )
                                    }
                                />
                            </label>
                        </div>
                    </Section>

                    {/* ACTIONS */}
                    <div className="form-actions">
                        <Link
                            to="/admin/opportunities"
                            className="button button--cancel"
                        >
                            Cancel
                        </Link>

                        <button
                            type="submit"
                            className="button button--primary"
                            disabled={saving}
                        >
                            {saving ? (
                                <>
                                    <span className="button-spinner" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <HiOutlineCheck />
                                    {isEditing
                                        ? "Save changes"
                                        : "Create opportunity"}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OpportunityForm;