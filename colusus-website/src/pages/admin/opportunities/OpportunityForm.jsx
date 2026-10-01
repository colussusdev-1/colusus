import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    HiOutlineArrowLeft,
    HiOutlineCheck,
    HiOutlineChevronDown,
    HiOutlineGlobeAlt,
    HiOutlineLockClosed,
    HiOutlineMapPin,
    HiOutlineSparkles,
} from "react-icons/hi2";

import opportunitiesService from "./opportunities.service";
import ImagePicker from "./components/ImagePicker";

import {
    OPPORTUNITY_TYPE_OPTIONS,
    DURATION_OPTIONS,
    LOCATION_OPTIONS,
} from "../../../data/opportunityOptions";

import "./opportunity-form.css";

/*
|--------------------------------------------------------------------------
| DEFAULT FORM
|--------------------------------------------------------------------------
*/

const emptyForm = {
    countryName: "",
    countrySlug: "",
    countryId: "",
    countryFlag: "",
    countryImage: "",

    applicants: "",
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
    type: "",
    location: "",
    duration: "",
    salary: "",
    description: "",

    active: true,
    featured: false,
};

/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

const slugify = (value = "") =>
    String(value)
        .toLowerCase()
        .trim()
        .replace(/&/g, " and ")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .replace(/-{2,}/g, "-");

const getOptionValue = (option) =>
    typeof option === "string"
        ? option
        : option?.value || "";

const getOptionLabel = (option) =>
    typeof option === "string"
        ? option
        : option?.label || option?.value || "";

const getResponseItems = (response) => {
    if (Array.isArray(response)) {
        return response;
    }

    if (Array.isArray(response?.data)) {
        return response.data;
    }

    if (Array.isArray(response?.destinations)) {
        return response.destinations;
    }

    if (Array.isArray(response?.data?.destinations)) {
        return response.data.destinations;
    }

    return [];
};

const getOpportunityFromResponse = (response) => {
    if (!response) {
        return null;
    }

    if (response?.data && !Array.isArray(response.data)) {
        return response.data;
    }

    return response;
};

const normalizeDestination = (destination) => ({
    countryId: destination?.countryId ?? "",

    countryName:
        destination?.countryName ||
        destination?.name ||
        "",

    countrySlug:
        destination?.countrySlug ||
        destination?.slug ||
        slugify(
            destination?.countryName ||
            destination?.name ||
            "",
        ),

    countryFlag:
        destination?.countryFlag ||
        destination?.flag ||
        "",

    countryImage:
        destination?.countryImage ||
        destination?.image ||
        "",

    applicants: destination?.applicants || "",

    countryCategories: Array.isArray(
        destination?.countryCategories,
    )
        ? destination.countryCategories
        : [],

    countryVisa:
        destination?.countryVisa || "",

    countryDuration:
        destination?.countryDuration || "",

    countryProcessingTime:
        destination?.countryProcessingTime || "",

    countryDescription:
        destination?.countryDescription || "",

    opportunityScore:
        destination?.opportunityScore || "",

    successRate:
        destination?.successRate || "",

    offerCount: Number(
        destination?.offerCount || 0,
    ),

    activeOfferCount: Number(
        destination?.activeOfferCount || 0,
    ),

    inactiveOfferCount: Number(
        destination?.inactiveOfferCount || 0,
    ),

    featuredOfferCount: Number(
        destination?.featuredOfferCount || 0,
    ),
});

const normalizeFormData = (data) => {
    if (!data) {
        return { ...emptyForm };
    }

    return {
        countryName: data.countryName || "",
        countrySlug: data.countrySlug || "",
        countryId: data.countryId ?? "",
        countryFlag: data.countryFlag || "",
        countryImage: data.countryImage || "",

        applicants: data.applicants || "",

        countryCategories:
            Array.isArray(data.countryCategories)
                ? data.countryCategories
                : [],

        countryVisa:
            data.countryVisa || "",

        countryDuration:
            data.countryDuration || "",

        countryProcessingTime:
            data.countryProcessingTime || "",

        countryDescription:
            data.countryDescription || "",

        opportunityScore:
            data.opportunityScore || "",

        successRate:
            data.successRate || "",

        title: data.title || "",
        slug: data.slug || "",
        image: data.image || "",

        category: data.category || "",
        type: data.type || "",
        location: data.location || "",
        duration: data.duration || "",
        salary: data.salary || "",
        description: data.description || "",

        active: data.active !== false,
        featured: Boolean(data.featured),
    };
};

/*
|--------------------------------------------------------------------------
| COMPONENT
|--------------------------------------------------------------------------
*/

const OpportunityForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const isEditMode = Boolean(id);

    const [form, setForm] = useState({
        ...emptyForm,
    });

    const [destinations, setDestinations] = useState([]);

    const [destinationsLoading, setDestinationsLoading] =
        useState(true);

    const [loading, setLoading] =
        useState(isEditMode);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    /*
    |--------------------------------------------------------------------------
    | LOAD DESTINATIONS
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        let mounted = true;

        const loadDestinations = async () => {
            try {
                setDestinationsLoading(true);

                const response =
                    await opportunitiesService.getDestinations();

                const items = getResponseItems(response)
                    .map(normalizeDestination)
                    .filter(
                        (destination) =>
                            destination.countryName,
                    );

                if (mounted) {
                    setDestinations(items);
                }
            } catch (loadError) {
                if (mounted) {
                    setError(
                        loadError?.response?.data?.message ||
                        loadError?.message ||
                        "Unable to load destinations.",
                    );
                }
            } finally {
                if (mounted) {
                    setDestinationsLoading(false);
                }
            }
        };

        loadDestinations();

        return () => {
            mounted = false;
        };
    }, []);

    /*
    |--------------------------------------------------------------------------
    | LOAD EXISTING OPPORTUNITY
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        let mounted = true;

        const loadOpportunity = async () => {
            if (!id) {
                setForm({ ...emptyForm });
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");
                setSuccess("");

                const response =
                    await opportunitiesService.getOpportunityById(
                        id,
                    );

                const opportunity =
                    getOpportunityFromResponse(response);

                if (!mounted) {
                    return;
                }

                setForm(
                    normalizeFormData(opportunity),
                );
            } catch (loadError) {
                if (!mounted) {
                    return;
                }

                setError(
                    loadError?.response?.data?.message ||
                    loadError?.message ||
                    "Unable to load this opportunity.",
                );
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        loadOpportunity();

        return () => {
            mounted = false;
        };
    }, [id]);

    /*
    |--------------------------------------------------------------------------
    | SELECTED DESTINATION
    |--------------------------------------------------------------------------
    */

    const selectedDestination = useMemo(() => {
        if (!form.countryId && !form.countrySlug) {
            return null;
        }

        return (
            destinations.find(
                (destination) =>
                    String(destination.countryId) ===
                    String(form.countryId) ||
                    destination.countrySlug ===
                    form.countrySlug,
            ) || null
        );
    }, [
        destinations,
        form.countryId,
        form.countrySlug,
    ]);

    /*
    |--------------------------------------------------------------------------
    | FIELD UPDATE
    |--------------------------------------------------------------------------
    */

    const updateField = (field, value) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));

        setError("");
        setSuccess("");
    };

    /*
    |--------------------------------------------------------------------------
    | DESTINATION CHANGE
    |--------------------------------------------------------------------------
    */

    const handleDestinationChange = (event) => {
        const value = event.target.value;

        const destination = destinations.find(
            (item) =>
                String(item.countryId) ===
                String(value),
        );

        if (!destination) {
            setForm((current) => ({
                ...current,

                countryId: "",
                countryName: "",
                countrySlug: "",
                countryFlag: "",
                countryImage: "",

                applicants: "",
                countryCategories: [],
                countryVisa: "",
                countryDuration: "",
                countryProcessingTime: "",
                countryDescription: "",
                opportunityScore: "",
                successRate: "",
            }));

            setError("");
            setSuccess("");

            return;
        }

        setForm((current) => ({
            ...current,

            countryId: destination.countryId,
            countryName: destination.countryName,
            countrySlug: destination.countrySlug,
            countryFlag: destination.countryFlag,
            countryImage: destination.countryImage,

            applicants: destination.applicants,

            countryCategories:
                destination.countryCategories,

            countryVisa:
                destination.countryVisa,

            countryDuration:
                destination.countryDuration,

            countryProcessingTime:
                destination.countryProcessingTime,

            countryDescription:
                destination.countryDescription,

            opportunityScore:
                destination.opportunityScore,

            successRate:
                destination.successRate,
        }));

        setError("");
        setSuccess("");
    };

    /*
    |--------------------------------------------------------------------------
    | TITLE
    |--------------------------------------------------------------------------
    */

    const handleTitleChange = (event) => {
        const title = event.target.value;

        setForm((current) => ({
            ...current,

            title,

            ...(isEditMode
                ? {}
                : {
                    slug: slugify(title),
                }),
        }));

        setError("");
        setSuccess("");
    };

    /*
    |--------------------------------------------------------------------------
    | VALIDATION
    |--------------------------------------------------------------------------
    */

    const validateForm = () => {
        if (!form.countryId) {
            setError(
                "Select a destination before creating the offer.",
            );

            return false;
        }

        if (!form.countrySlug) {
            setError(
                "The selected destination does not have a valid slug.",
            );

            return false;
        }

        const requiredFields = [
            ["title", "Offer title"],
            ["category", "Category"],
            ["type", "Type"],
            ["description", "Description"],
        ];

        const missingField =
            requiredFields.find(
                ([field]) =>
                    !String(
                        form[field] || "",
                    ).trim(),
            );

        if (missingField) {
            setError(
                `${missingField[1]} is required.`,
            );

            return false;
        }

        if (!form.slug) {
            setError(
                "A valid offer URL could not be generated.",
            );

            return false;
        }

        return true;
    };

    /*
    |--------------------------------------------------------------------------
    | PAYLOAD
    |--------------------------------------------------------------------------
    */

    const buildPayload = () => ({
        countryId: Number(form.countryId),

        countryName:
            form.countryName.trim(),

        countrySlug:
            form.countrySlug.trim(),

        countryFlag:
            form.countryFlag || "",

        countryImage:
            form.countryImage || "",

        title:
            form.title.trim(),

        slug:
            form.slug.trim(),

        image:
            form.image || "",

        category:
            form.category.trim(),

        type:
            form.type.trim(),

        location:
            form.location.trim(),

        duration:
            form.duration.trim(),

        salary:
            form.salary.trim(),

        description:
            form.description.trim(),

        active:
            Boolean(form.active),

        featured:
            Boolean(form.featured),
    });

    /*
    |--------------------------------------------------------------------------
    | SUBMIT
    |--------------------------------------------------------------------------
    */

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (saving) {
            return;
        }

        setError("");
        setSuccess("");

        if (!validateForm()) {
            return;
        }

        try {
            setSaving(true);

            const payload =
                buildPayload();

            if (isEditMode) {
                await opportunitiesService.updateOpportunity(
                    id,
                    payload,
                );
            } else {
                await opportunitiesService.createOpportunity(
                    payload,
                );
            }

            setSuccess(
                isEditMode
                    ? "Offer updated successfully."
                    : "Offer created successfully.",
            );

            setTimeout(() => {
                navigate(
                    "/admin/opportunities",
                );
            }, 700);
        } catch (submitError) {
            setError(
                submitError?.response?.data?.message ||
                submitError?.message ||
                "Unable to save this offer.",
            );
        } finally {
            setSaving(false);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | LOADING
    |--------------------------------------------------------------------------
    */

    if (loading) {
        return (
            <div className="opportunity-form-page">
                <div className="opportunity-form-loading">
                    <div className="opportunity-form-loading__spinner" />

                    <div>
                        <strong>
                            Loading offer
                        </strong>

                        <span>
                            Preparing the offer builder...
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | PAGE
    |--------------------------------------------------------------------------
    */

    return (
        <div className="opportunity-form-page">
            <div className="opportunity-form-container">

                {/* ========================================================
                    TOP NAVIGATION
                ======================================================== */}

                <header className="opportunity-form-header">

                    <div className="opportunity-form-header__top">

                        <Link
                            to="/admin/opportunities"
                            className="opportunity-form-back"
                        >
                            <HiOutlineArrowLeft />

                            <span>
                                Back to offers
                            </span>
                        </Link>

                        <div className="opportunity-form-header__status">

                            <span
                                className={`opportunity-form-status-dot ${form.active
                                        ? "is-active"
                                        : "is-inactive"
                                    }`}
                            />

                            <span>
                                {form.active
                                    ? "Published"
                                    : "Draft"}
                            </span>

                        </div>

                    </div>

                    {/* ====================================================
                        HERO
                    ==================================================== */}

                    <div className="opportunity-form-heading">

                        <div className="opportunity-form-heading__main">

                            <div className="opportunity-form-eyebrow">
                                <HiOutlineSparkles />

                                <span>
                                    OFFER BUILDER
                                </span>
                            </div>

                            <h1>
                                {isEditMode
                                    ? "Edit offer"
                                    : "Create a new offer"}
                            </h1>

                            <p>
                                {isEditMode
                                    ? "Manage the destination, offer details, media and visibility of this opportunity."
                                    : "Create a structured migration opportunity from one of your existing destinations."}
                            </p>

                        </div>

                        {selectedDestination && (
                            <div className="opportunity-form-heading__destination">

                                <span>
                                    DESTINATION
                                </span>

                                <div>
                                    <strong>
                                        {selectedDestination.countryFlag && (
                                            <span>
                                                {
                                                    selectedDestination.countryFlag
                                                }
                                            </span>
                                        )}

                                        {
                                            selectedDestination.countryName
                                        }
                                    </strong>

                                    <small>
                                        /
                                        {
                                            selectedDestination.countrySlug
                                        }
                                    </small>
                                </div>

                            </div>
                        )}

                    </div>

                </header>

                {/* ========================================================
                    ALERTS
                ======================================================== */}

                {error && (
                    <div className="opportunity-form-alert opportunity-form-alert--error">

                        <span className="opportunity-form-alert__mark">
                            !
                        </span>

                        <div>
                            <strong>
                                Something needs attention
                            </strong>

                            <span>
                                {error}
                            </span>
                        </div>

                    </div>
                )}

                {success && (
                    <div className="opportunity-form-alert opportunity-form-alert--success">

                        <span className="opportunity-form-alert__mark">
                            <HiOutlineCheck />
                        </span>

                        <div>
                            <strong>
                                Saved successfully
                            </strong>

                            <span>
                                {success}
                            </span>
                        </div>

                    </div>
                )}

                {/* ========================================================
                    FORM
                ======================================================== */}

                <form
                    className="opportunity-form"
                    onSubmit={handleSubmit}
                >

                    {/* ====================================================
                        01 — DESTINATION
                    ==================================================== */}

                    <section className="form-card form-card--destination">

                        <div className="form-card__header">

                            <div className="form-card__number">
                                <span>
                                    01
                                </span>
                            </div>

                            <div className="form-card__heading">

                                <div className="form-card__eyebrow">
                                    DESTINATION
                                </div>

                                <h2>
                                    Where is this offer?
                                </h2>

                                <p>
                                    Start with an existing destination.
                                    Its country profile will be inherited
                                    by this offer.
                                </p>

                            </div>

                        </div>

                        <div className="form-card__body">

                            <div className="destination-builder">

                                <div className="destination-builder__select">

                                    <div className="field">

                                        <div className="field__top">

                                            <label
                                                htmlFor="destination"
                                                className="field__label"
                                            >
                                                Destination
                                            </label>

                                            <span className="field__required">
                                                Required
                                            </span>

                                        </div>

                                        <div className="select-wrapper">

                                            <select
                                                id="destination"
                                                className="field__input"
                                                value={
                                                    form.countryId
                                                }
                                                onChange={
                                                    handleDestinationChange
                                                }
                                                disabled={
                                                    saving ||
                                                    destinationsLoading ||
                                                    isEditMode
                                                }
                                            >

                                                <option value="">
                                                    {destinationsLoading
                                                        ? "Loading destinations..."
                                                        : "Select a destination"}
                                                </option>

                                                {destinations.map(
                                                    (
                                                        destination,
                                                    ) => (
                                                        <option
                                                            key={`${destination.countrySlug}-${destination.countryId}`}
                                                            value={
                                                                destination.countryId
                                                            }
                                                        >
                                                            {destination.countryFlag
                                                                ? `${destination.countryFlag} `
                                                                : ""}
                                                            {
                                                                destination.countryName
                                                            }
                                                        </option>
                                                    ),
                                                )}

                                            </select>

                                            <HiOutlineChevronDown />

                                        </div>

                                        {isEditMode && (
                                            <div className="field__locked">

                                                <HiOutlineLockClosed />

                                                <span>
                                                    Destination is locked
                                                    after an offer has been
                                                    created.
                                                </span>

                                            </div>
                                        )}

                                    </div>

                                </div>

                                {selectedDestination ? (
                                    <div className="destination-profile">

                                        <div className="destination-profile__top">

                                            <div className="destination-profile__identity">

                                                <div className="destination-profile__flag">

                                                    {selectedDestination.countryFlag ? (
                                                        selectedDestination.countryFlag
                                                    ) : (
                                                        <HiOutlineGlobeAlt />
                                                    )}

                                                </div>

                                                <div>

                                                    <span>
                                                        SELECTED DESTINATION
                                                    </span>

                                                    <strong>
                                                        {
                                                            selectedDestination.countryName
                                                        }
                                                    </strong>

                                                    <small>
                                                        /
                                                        {
                                                            selectedDestination.countrySlug
                                                        }
                                                    </small>

                                                </div>

                                            </div>

                                            <div className="destination-profile__count">

                                                <strong>
                                                    {
                                                        selectedDestination.offerCount
                                                    }
                                                </strong>

                                                <span>
                                                    Existing offers
                                                </span>

                                            </div>

                                        </div>

                                        <div className="destination-profile__stats">

                                            <div className="destination-stat">

                                                <span>
                                                    Published
                                                </span>

                                                <strong>
                                                    {
                                                        selectedDestination.activeOfferCount
                                                    }
                                                </strong>

                                            </div>

                                            <div className="destination-stat">

                                                <span>
                                                    Inactive
                                                </span>

                                                <strong>
                                                    {
                                                        selectedDestination.inactiveOfferCount
                                                    }
                                                </strong>

                                            </div>

                                            <div className="destination-stat">

                                                <span>
                                                    Featured
                                                </span>

                                                <strong>
                                                    {
                                                        selectedDestination.featuredOfferCount
                                                    }
                                                </strong>

                                            </div>

                                            <div className="destination-stat">

                                                <span>
                                                    Processing
                                                </span>

                                                <strong>
                                                    {
                                                        selectedDestination.countryProcessingTime ||
                                                        "—"
                                                    }
                                                </strong>

                                            </div>

                                        </div>

                                        <div className="destination-profile__details">

                                            <div>

                                                <span>
                                                    Visa
                                                </span>

                                                <strong>
                                                    {
                                                        selectedDestination.countryVisa ||
                                                        "Not specified"
                                                    }
                                                </strong>

                                            </div>

                                            <div>

                                                <span>
                                                    Typical duration
                                                </span>

                                                <strong>
                                                    {
                                                        selectedDestination.countryDuration ||
                                                        "Not specified"
                                                    }
                                                </strong>

                                            </div>

                                            <div>

                                                <span>
                                                    Applicants
                                                </span>

                                                <strong>
                                                    {
                                                        selectedDestination.applicants ||
                                                        "Not specified"
                                                    }
                                                </strong>

                                            </div>

                                        </div>

                                    </div>
                                ) : (
                                    <div className="destination-placeholder">

                                        <div className="destination-placeholder__icon">
                                            <HiOutlineMapPin />
                                        </div>

                                        <div>

                                            <strong>
                                                Choose a destination
                                            </strong>

                                            <span>
                                                Your existing destination
                                                profiles will appear here.
                                            </span>

                                        </div>

                                    </div>
                                )}

                                {selectedDestination && (
                                    <div className="destination-media">

                                        <div className="destination-media__heading">

                                            <div>
                                                <span>
                                                    DESTINATION MEDIA
                                                </span>

                                                <strong>
                                                    Country profile image
                                                </strong>
                                            </div>

                                            <small>
                                                Shared at destination level
                                            </small>

                                        </div>

                                        <ImagePicker
                                            label="Destination image"
                                            value={
                                                form.countryImage
                                            }
                                            onChange={(value) =>
                                                updateField(
                                                    "countryImage",
                                                    value,
                                                )
                                            }
                                            hint="This image represents the destination in country-level catalogue areas."
                                            aspect="landscape"
                                        />

                                    </div>
                                )}

                            </div>

                        </div>

                    </section>

                    {/* ====================================================
                        02 — OFFER DETAILS
                    ==================================================== */}

                    <section className="form-card">

                        <div className="form-card__header">

                            <div className="form-card__number">
                                <span>
                                    02
                                </span>
                            </div>

                            <div className="form-card__heading">

                                <div className="form-card__eyebrow">
                                    OFFER DETAILS
                                </div>

                                <h2>
                                    Define the opportunity
                                </h2>

                                <p>
                                    These are the details applicants will
                                    actually see when they open this offer.
                                </p>

                            </div>

                        </div>

                        <div className="form-card__body">

                            <div className="form-grid">

                                {/* TITLE */}

                                <div className="field form-grid__full">

                                    <div className="field__top">

                                        <label
                                            htmlFor="title"
                                            className="field__label"
                                        >
                                            Offer title
                                        </label>

                                        <span className="field__required">
                                            Required
                                        </span>

                                    </div>

                                    <input
                                        id="title"
                                        type="text"
                                        className="field__input field__input--large"
                                        value={form.title}
                                        onChange={
                                            handleTitleChange
                                        }
                                        placeholder="e.g. Ireland Nursing, CNA & Caregiver Opportunities"
                                        disabled={saving}
                                    />

                                    {form.slug && (
                                        <div className="public-url">

                                            <div className="public-url__label">
                                                PUBLIC URL
                                            </div>

                                            <div className="public-url__value">

                                                <span>
                                                    /opportunities/
                                                    {
                                                        form.countrySlug
                                                    }
                                                    /
                                                </span>

                                                <strong>
                                                    {
                                                        form.slug
                                                    }
                                                </strong>

                                            </div>

                                        </div>
                                    )}

                                </div>

                                {/* CATEGORY */}

                                <div className="field">

                                    <div className="field__top">

                                        <label
                                            htmlFor="category"
                                            className="field__label"
                                        >
                                            Category
                                        </label>

                                        <span className="field__required">
                                            Required
                                        </span>

                                    </div>

                                    <input
                                        id="category"
                                        type="text"
                                        className="field__input"
                                        value={
                                            form.category
                                        }
                                        onChange={(
                                            event,
                                        ) =>
                                            updateField(
                                                "category",
                                                event
                                                    .target
                                                    .value,
                                            )
                                        }
                                        placeholder="e.g. Nursing"
                                        disabled={saving}
                                    />

                                </div>

                                {/* TYPE */}

                                <div className="field">

                                    <div className="field__top">

                                        <label
                                            htmlFor="type"
                                            className="field__label"
                                        >
                                            Opportunity type
                                        </label>

                                        <span className="field__required">
                                            Required
                                        </span>

                                    </div>

                                    <div className="select-wrapper">

                                        <select
                                            id="type"
                                            className="field__input"
                                            value={
                                                form.type
                                            }
                                            onChange={(
                                                event,
                                            ) =>
                                                updateField(
                                                    "type",
                                                    event
                                                        .target
                                                        .value,
                                                )
                                            }
                                            disabled={saving}
                                        >

                                            <option value="">
                                                Select type
                                            </option>

                                            {OPPORTUNITY_TYPE_OPTIONS.map(
                                                (
                                                    option,
                                                ) => (
                                                    <option
                                                        key={getOptionValue(
                                                            option,
                                                        )}
                                                        value={getOptionValue(
                                                            option,
                                                        )}
                                                    >
                                                        {getOptionLabel(
                                                            option,
                                                        )}
                                                    </option>
                                                ),
                                            )}

                                        </select>

                                        <HiOutlineChevronDown />

                                    </div>

                                </div>

                                {/* LOCATION */}

                                <div className="field">

                                    <div className="field__top">

                                        <label
                                            htmlFor="location"
                                            className="field__label"
                                        >
                                            Location
                                        </label>

                                    </div>

                                    <div className="select-wrapper">

                                        <select
                                            id="location"
                                            className="field__input"
                                            value={
                                                form.location
                                            }
                                            onChange={(
                                                event,
                                            ) =>
                                                updateField(
                                                    "location",
                                                    event
                                                        .target
                                                        .value,
                                                )
                                            }
                                            disabled={saving}
                                        >

                                            <option value="">
                                                Select location
                                            </option>

                                            {LOCATION_OPTIONS.map(
                                                (
                                                    option,
                                                ) => (
                                                    <option
                                                        key={getOptionValue(
                                                            option,
                                                        )}
                                                        value={getOptionValue(
                                                            option,
                                                        )}
                                                    >
                                                        {getOptionLabel(
                                                            option,
                                                        )}
                                                    </option>
                                                ),
                                            )}

                                        </select>

                                        <HiOutlineChevronDown />

                                    </div>

                                </div>

                                {/* DURATION */}

                                <div className="field">

                                    <div className="field__top">

                                        <label
                                            htmlFor="duration"
                                            className="field__label"
                                        >
                                            Duration
                                        </label>

                                    </div>

                                    <div className="select-wrapper">

                                        <select
                                            id="duration"
                                            className="field__input"
                                            value={
                                                form.duration
                                            }
                                            onChange={(
                                                event,
                                            ) =>
                                                updateField(
                                                    "duration",
                                                    event
                                                        .target
                                                        .value,
                                                )
                                            }
                                            disabled={saving}
                                        >

                                            <option value="">
                                                Select duration
                                            </option>

                                            {DURATION_OPTIONS.map(
                                                (
                                                    option,
                                                ) => (
                                                    <option
                                                        key={getOptionValue(
                                                            option,
                                                        )}
                                                        value={getOptionValue(
                                                            option,
                                                        )}
                                                    >
                                                        {getOptionLabel(
                                                            option,
                                                        )}
                                                    </option>
                                                ),
                                            )}

                                        </select>

                                        <HiOutlineChevronDown />

                                    </div>

                                </div>

                                {/* SALARY */}

                                <div className="field form-grid__full">

                                    <div className="field__top">

                                        <label
                                            htmlFor="salary"
                                            className="field__label"
                                        >
                                            Salary / compensation
                                        </label>

                                    </div>

                                    <input
                                        id="salary"
                                        type="text"
                                        className="field__input"
                                        value={
                                            form.salary
                                        }
                                        onChange={(
                                            event,
                                        ) =>
                                            updateField(
                                                "salary",
                                                event
                                                    .target
                                                    .value,
                                            )
                                        }
                                        placeholder="e.g. €37,000 – €98,000 per year"
                                        disabled={saving}
                                    />

                                </div>

                                {/* DESCRIPTION */}

                                <div className="field form-grid__full">

                                    <div className="field__top">

                                        <label
                                            htmlFor="description"
                                            className="field__label"
                                        >
                                            Opportunity description
                                        </label>

                                        <span className="field__required">
                                            Required
                                        </span>

                                    </div>

                                    <textarea
                                        id="description"
                                        className="field__input field__textarea"
                                        value={
                                            form.description
                                        }
                                        onChange={(
                                            event,
                                        ) =>
                                            updateField(
                                                "description",
                                                event
                                                    .target
                                                    .value,
                                            )
                                        }
                                        placeholder="Explain the opportunity clearly. Include what the applicant is being offered, who it is for, and what they can expect."
                                        rows={8}
                                        disabled={saving}
                                    />

                                    <div className="field__footer">

                                        <span>
                                            Keep this practical,
                                            specific and applicant-focused.
                                        </span>

                                        <strong>
                                            {
                                                form
                                                    .description
                                                    .length
                                            }{" "}
                                            characters
                                        </strong>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </section>

                    {/* ====================================================
                        03 — MEDIA
                    ==================================================== */}

                    <section className="form-card">

                        <div className="form-card__header">

                            <div className="form-card__number">
                                <span>
                                    03
                                </span>
                            </div>

                            <div className="form-card__heading">

                                <div className="form-card__eyebrow">
                                    MEDIA
                                </div>

                                <h2>
                                    Give the offer a visual identity
                                </h2>

                                <p>
                                    This image represents the specific
                                    opportunity, not the destination.
                                </p>

                            </div>

                        </div>

                        <div className="form-card__body">

                            <div className="offer-media-intro">

                                <div className="offer-media-intro__icon">
                                    <HiOutlineGlobeAlt />
                                </div>

                                <div>

                                    <strong>
                                        Offer artwork
                                    </strong>

                                    <span>
                                        Used across offer cards and
                                        the public opportunity page.
                                    </span>

                                </div>

                            </div>

                            <ImagePicker
                                label="Offer image"
                                value={form.image}
                                onChange={(value) =>
                                    updateField(
                                        "image",
                                        value,
                                    )
                                }
                                hint="Use a strong, relevant image that represents this specific migration opportunity."
                                aspect="landscape"
                            />

                        </div>

                    </section>

                    {/* ====================================================
                        04 — VISIBILITY
                    ==================================================== */}

                    <section className="form-card">

                        <div className="form-card__header">

                            <div className="form-card__number">
                                <span>
                                    04
                                </span>
                            </div>

                            <div className="form-card__heading">

                                <div className="form-card__eyebrow">
                                    VISIBILITY
                                </div>

                                <h2>
                                    Decide how this offer appears
                                </h2>

                                <p>
                                    Publishing controls can be changed
                                    without changing the offer itself.
                                </p>

                            </div>

                        </div>

                        <div className="form-card__body">

                            <div className="visibility-panel">

                                <label className="visibility-option">

                                    <input
                                        type="checkbox"
                                        checked={
                                            form.active
                                        }
                                        onChange={(
                                            event,
                                        ) =>
                                            updateField(
                                                "active",
                                                event
                                                    .target
                                                    .checked,
                                            )
                                        }
                                        disabled={
                                            saving
                                        }
                                    />

                                    <span className="visibility-option__indicator">
                                        <span />
                                    </span>

                                    <span className="visibility-option__content">

                                        <span className="visibility-option__title">

                                            <strong>
                                                Published
                                            </strong>

                                            <em
                                                className={
                                                    form.active
                                                        ? "is-on"
                                                        : ""
                                                }
                                            >
                                                {form.active
                                                    ? "LIVE"
                                                    : "HIDDEN"}
                                            </em>

                                        </span>

                                        <small>
                                            Make this offer visible
                                            on the public website.
                                        </small>

                                    </span>

                                </label>

                                <label className="visibility-option">

                                    <input
                                        type="checkbox"
                                        checked={
                                            form.featured
                                        }
                                        onChange={(
                                            event,
                                        ) =>
                                            updateField(
                                                "featured",
                                                event
                                                    .target
                                                    .checked,
                                            )
                                        }
                                        disabled={
                                            saving
                                        }
                                    />

                                    <span className="visibility-option__indicator">
                                        <span />
                                    </span>

                                    <span className="visibility-option__content">

                                        <span className="visibility-option__title">

                                            <strong>
                                                Featured offer
                                            </strong>

                                            <em
                                                className={
                                                    form.featured
                                                        ? "is-on"
                                                        : ""
                                                }
                                            >
                                                {form.featured
                                                    ? "FEATURED"
                                                    : "STANDARD"}
                                            </em>

                                        </span>

                                        <small>
                                            Allow this offer to
                                            appear in featured
                                            catalogue placements.
                                        </small>

                                    </span>

                                </label>

                            </div>

                        </div>

                    </section>

                    {/* ====================================================
                        ACTION BAR
                    ==================================================== */}

                    <div className="form-actions">

                        <div className="form-actions__context">

                            <span>
                                {isEditMode
                                    ? "Editing existing offer"
                                    : "Creating a new offer"}
                            </span>

                            {selectedDestination && (
                                <strong>
                                    {selectedDestination.countryFlag}{" "}
                                    {
                                        selectedDestination.countryName
                                    }
                                </strong>
                            )}

                        </div>

                        <div className="form-actions__buttons">

                            <Link
                                to="/admin/opportunities"
                                className="form-actions__cancel"
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                className="form-actions__submit"
                                disabled={
                                    saving ||
                                    destinationsLoading
                                }
                            >

                                {saving ? (
                                    <>
                                        <span className="button-spinner" />

                                        <span>
                                            Saving changes...
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <HiOutlineCheck />

                                        <span>
                                            {isEditMode
                                                ? "Save changes"
                                                : "Create offer"}
                                        </span>
                                    </>
                                )}

                            </button>

                        </div>

                    </div>

                </form>

            </div>
        </div>
    );
};

export default OpportunityForm;