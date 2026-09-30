import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    HiOutlineArrowLeft,
    HiOutlineCheck,
    HiOutlineChevronDown,
    HiOutlineGlobeAlt,
    HiOutlineLockClosed,
} from "react-icons/hi2";

import opportunitiesService from "./opportunities.service";
import ImagePicker from "./components/ImagePicker";

import countries from "../../../data/countries";
import {
    OPPORTUNITY_TYPE_OPTIONS,
    DURATION_OPTIONS,
    LOCATION_OPTIONS,
} from "../../../data/opportunityOptions";

import "./opportunity-form.css";

const emptyForm = {
    countryName: "",
    countrySlug: "",
    countryId: "",
    countryFlag: "",
    countryImage: "",

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

const slugify = (value = "") =>
    String(value)
        .toLowerCase()
        .trim()
        .replace(/&/g, " and ")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .replace(/-{2,}/g, "-");

const getOptionValue = (option) =>
    typeof option === "string" ? option : option?.value || "";

const getOptionLabel = (option) =>
    typeof option === "string"
        ? option
        : option?.label || option?.value || "";

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

const OpportunityForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const isEditMode = Boolean(id);

    const [form, setForm] = useState({ ...emptyForm });
    const [loading, setLoading] = useState(isEditMode);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    /*
    |--------------------------------------------------------------------------
    | COUNTRY OPTIONS
    |--------------------------------------------------------------------------
    */

    const countryOptions = useMemo(() => {
        if (!Array.isArray(countries)) {
            return [];
        }

        return countries
            .map((country) => ({
                id: country.id,
                name:
                    country.name ||
                    country.countryName ||
                    "",
                slug:
                    country.slug ||
                    slugify(
                        country.name ||
                        country.countryName ||
                        "",
                    ),
                flag:
                    country.flag ||
                    country.countryFlag ||
                    "",
                image:
                    country.image ||
                    country.countryImage ||
                    "",
            }))
            .filter((country) => country.name);
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
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");

                const response =
                    await opportunitiesService.getOpportunityById(id);

                const opportunity =
                    response?.data ||
                    response;

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
    | CREATE MODE — COUNTRY CHANGE
    |--------------------------------------------------------------------------
    */

    const handleCountryChange = (event) => {
        const countryId = event.target.value;

        const selectedCountry = countryOptions.find(
            (country) =>
                String(country.id) ===
                String(countryId),
        );

        if (!selectedCountry) {
            setForm((current) => ({
                ...current,
                countryId: "",
                countryName: "",
                countrySlug: "",
                countryFlag: "",
            }));

            return;
        }

        setForm((current) => ({
            ...current,

            countryId: selectedCountry.id,
            countryName: selectedCountry.name,
            countrySlug: selectedCountry.slug,
            countryFlag: selectedCountry.flag,

            countryImage:
                current.countryImage ||
                selectedCountry.image ||
                "",
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
            slug: slugify(title),
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
        const requiredFields = [
            ["countryName", "Country"],
            ["title", "Opportunity title"],
            ["category", "Category"],
            ["type", "Type"],
            ["description", "Description"],
        ];

        const missingField = requiredFields.find(
            ([field]) =>
                !String(form[field] || "").trim(),
        );

        if (missingField) {
            setError(
                `${missingField[1]} is required.`,
            );

            return false;
        }

        if (!form.countrySlug) {
            setError(
                "A valid country slug could not be determined.",
            );

            return false;
        }

        if (!form.slug) {
            setError(
                "A valid opportunity slug could not be generated.",
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
        countryId:
            form.countryId !== ""
                ? Number(form.countryId)
                : undefined,

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

        /*
        |--------------------------------------------------------------------------
        | TEMP DEBUG
        |--------------------------------------------------------------------------
        */

        console.log("OPPORTUNITY FORM SUBMIT", {
            id,
            isEditMode,
            pathname: window.location.pathname,
        });

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

            const payload = buildPayload();

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
                    ? "Opportunity updated successfully."
                    : "Opportunity created successfully.",
            );

            setTimeout(() => {
                navigate("/admin/opportunities");
            }, 600);
        } catch (submitError) {
            setError(
                submitError?.response?.data?.message ||
                submitError?.message ||
                "Unable to save this opportunity.",
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

                    <span>
                        Loading opportunity...
                    </span>
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

                {/* ==========================================================
                    PAGE HEADER
                ========================================================== */}

                <header className="opportunity-form-header">

                    <div className="opportunity-form-header__top">

                        <Link
                            to="/admin/opportunities"
                            className="opportunity-form-back"
                        >
                            <HiOutlineArrowLeft />

                            <span>
                                Opportunities
                            </span>
                        </Link>

                        <span className="opportunity-form-mode">
                            {isEditMode
                                ? "Editing"
                                : "New opportunity"}
                        </span>

                    </div>

                    <div className="opportunity-form-heading">

                        <div>

                            <h1>
                                {isEditMode
                                    ? "Edit opportunity"
                                    : "Create opportunity"}
                            </h1>

                            <p>
                                {isEditMode
                                    ? "Update the information and media for this migration opportunity."
                                    : "Add the essential information and media for a new migration opportunity."}
                            </p>

                        </div>

                    </div>

                </header>

                {/* ==========================================================
                    ALERTS
                ========================================================== */}

                {error && (
                    <div className="opportunity-form-alert opportunity-form-alert--error">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="opportunity-form-alert opportunity-form-alert--success">

                        <HiOutlineCheck />

                        <span>
                            {success}
                        </span>

                    </div>
                )}

                {/* ==========================================================
                    FORM
                ========================================================== */}

                <form
                    className="opportunity-form"
                    onSubmit={handleSubmit}
                >

                    {/* ======================================================
                        COUNTRY
                    ====================================================== */}

                    <section className="form-card">

                        <div className="form-card__header">

                            <div className="form-card__index">
                                01
                            </div>

                            <div>

                                <h2>
                                    Country
                                </h2>

                                <p>
                                    The country this opportunity belongs to.
                                </p>

                            </div>

                        </div>

                        <div className="form-card__body">

                            {isEditMode ? (
                                <div className="existing-country">

                                    <div className="existing-country__icon">

                                        {form.countryFlag ? (
                                            <span>
                                                {form.countryFlag}
                                            </span>
                                        ) : (
                                            <HiOutlineGlobeAlt />
                                        )}

                                    </div>

                                    <div className="existing-country__content">

                                        <div className="existing-country__name">
                                            {form.countryName ||
                                                "Country"}
                                        </div>

                                        <div className="existing-country__slug">
                                            {form.countrySlug ||
                                                "country"}
                                        </div>

                                    </div>

                                    <div className="existing-country__locked">

                                        <HiOutlineLockClosed />

                                        <span>
                                            Existing
                                        </span>

                                    </div>

                                </div>
                            ) : (
                                <div className="field">

                                    <label
                                        htmlFor="country"
                                        className="field__label"
                                    >
                                        Country

                                        <span className="required">
                                            *
                                        </span>

                                    </label>

                                    <div className="select-wrapper">

                                        <select
                                            id="country"
                                            className="field__input"
                                            value={form.countryId}
                                            onChange={
                                                handleCountryChange
                                            }
                                            disabled={saving}
                                        >

                                            <option value="">
                                                Select a country
                                            </option>

                                            {countryOptions.map(
                                                (country) => (
                                                    <option
                                                        key={country.id}
                                                        value={country.id}
                                                    >
                                                        {country.name}
                                                    </option>
                                                ),
                                            )}

                                        </select>

                                        <HiOutlineChevronDown />

                                    </div>

                                </div>
                            )}

                            <div className="form-media-block">

                                <ImagePicker
                                    label="Country image"
                                    value={
                                        form.countryImage
                                    }
                                    onChange={(value) =>
                                        updateField(
                                            "countryImage",
                                            value,
                                        )
                                    }
                                    hint="Used on country cards and country-level displays."
                                    aspect="landscape"
                                />

                            </div>

                        </div>

                    </section>

                    {/* ======================================================
                        OPPORTUNITY
                    ====================================================== */}

                    <section className="form-card">

                        <div className="form-card__header">

                            <div className="form-card__index">
                                02
                            </div>

                            <div>

                                <h2>
                                    Opportunity
                                </h2>

                                <p>
                                    The core information visitors will see.
                                </p>

                            </div>

                        </div>

                        <div className="form-card__body">

                            <div className="form-grid">

                                <div className="field form-grid__full">

                                    <label
                                        htmlFor="title"
                                        className="field__label"
                                    >
                                        Opportunity title

                                        <span className="required">
                                            *
                                        </span>

                                    </label>

                                    <input
                                        id="title"
                                        type="text"
                                        className="field__input"
                                        value={form.title}
                                        onChange={
                                            handleTitleChange
                                        }
                                        placeholder="e.g. Ireland Nursing, CNA & Caregiver Opportunities"
                                        disabled={saving}
                                    />

                                    {form.slug && (
                                        <div className="field__meta">

                                            <span>
                                                URL
                                            </span>

                                            <code>
                                                /opportunities/
                                                {form.countrySlug}/
                                                {form.slug}
                                            </code>

                                        </div>
                                    )}

                                </div>

                                <div className="field">

                                    <label
                                        htmlFor="category"
                                        className="field__label"
                                    >
                                        Category

                                        <span className="required">
                                            *
                                        </span>

                                    </label>

                                    <input
                                        id="category"
                                        type="text"
                                        className="field__input"
                                        value={form.category}
                                        onChange={(event) =>
                                            updateField(
                                                "category",
                                                event.target.value,
                                            )
                                        }
                                        placeholder="e.g. Nursing"
                                        disabled={saving}
                                    />

                                </div>

                                <div className="field">

                                    <label
                                        htmlFor="type"
                                        className="field__label"
                                    >
                                        Type

                                        <span className="required">
                                            *
                                        </span>

                                    </label>

                                    <div className="select-wrapper">

                                        <select
                                            id="type"
                                            className="field__input"
                                            value={form.type}
                                            onChange={(event) =>
                                                updateField(
                                                    "type",
                                                    event.target.value,
                                                )
                                            }
                                            disabled={saving}
                                        >

                                            <option value="">
                                                Select type
                                            </option>

                                            {OPPORTUNITY_TYPE_OPTIONS.map(
                                                (option) => (
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

                                <div className="field">

                                    <label
                                        htmlFor="location"
                                        className="field__label"
                                    >
                                        Location
                                    </label>

                                    <div className="select-wrapper">

                                        <select
                                            id="location"
                                            className="field__input"
                                            value={form.location}
                                            onChange={(event) =>
                                                updateField(
                                                    "location",
                                                    event.target.value,
                                                )
                                            }
                                            disabled={saving}
                                        >

                                            <option value="">
                                                Select location
                                            </option>

                                            {LOCATION_OPTIONS.map(
                                                (option) => (
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

                                <div className="field">

                                    <label
                                        htmlFor="duration"
                                        className="field__label"
                                    >
                                        Duration
                                    </label>

                                    <div className="select-wrapper">

                                        <select
                                            id="duration"
                                            className="field__input"
                                            value={form.duration}
                                            onChange={(event) =>
                                                updateField(
                                                    "duration",
                                                    event.target.value,
                                                )
                                            }
                                            disabled={saving}
                                        >

                                            <option value="">
                                                Select duration
                                            </option>

                                            {DURATION_OPTIONS.map(
                                                (option) => (
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

                                <div className="field form-grid__full">

                                    <label
                                        htmlFor="salary"
                                        className="field__label"
                                    >
                                        Salary
                                    </label>

                                    <input
                                        id="salary"
                                        type="text"
                                        className="field__input"
                                        value={form.salary}
                                        onChange={(event) =>
                                            updateField(
                                                "salary",
                                                event.target.value,
                                            )
                                        }
                                        placeholder="e.g. €37,000 – €98,000 per year"
                                        disabled={saving}
                                    />

                                </div>

                                <div className="field form-grid__full">

                                    <label
                                        htmlFor="description"
                                        className="field__label"
                                    >
                                        Description

                                        <span className="required">
                                            *
                                        </span>

                                    </label>

                                    <textarea
                                        id="description"
                                        className="field__input field__textarea"
                                        value={
                                            form.description
                                        }
                                        onChange={(event) =>
                                            updateField(
                                                "description",
                                                event.target.value,
                                            )
                                        }
                                        placeholder="Describe this migration opportunity..."
                                        rows={7}
                                        disabled={saving}
                                    />

                                    <div className="field__counter">
                                        {form.description.length} characters
                                    </div>

                                </div>

                            </div>

                        </div>

                    </section>

                    {/* ======================================================
                        OPPORTUNITY IMAGE
                    ====================================================== */}

                    <section className="form-card">

                        <div className="form-card__header">

                            <div className="form-card__index">
                                03
                            </div>

                            <div>

                                <h2>
                                    Opportunity image
                                </h2>

                                <p>
                                    The primary visual for this migration opportunity.
                                </p>

                            </div>

                        </div>

                        <div className="form-card__body">

                            <ImagePicker
                                label="Opportunity image"
                                value={form.image}
                                onChange={(value) =>
                                    updateField(
                                        "image",
                                        value,
                                    )
                                }
                                hint="Used on opportunity cards and the opportunity details page."
                                aspect="landscape"
                            />

                        </div>

                    </section>

                    {/* ======================================================
                        PUBLISHING
                    ====================================================== */}

                    <section className="form-card">

                        <div className="form-card__header">

                            <div className="form-card__index">
                                04
                            </div>

                            <div>

                                <h2>
                                    Publishing
                                </h2>

                                <p>
                                    Control how this opportunity appears publicly.
                                </p>

                            </div>

                        </div>

                        <div className="form-card__body">

                            <div className="publishing-list">

                                <label className="publish-toggle">

                                    <input
                                        type="checkbox"
                                        checked={form.active}
                                        onChange={(event) =>
                                            updateField(
                                                "active",
                                                event.target.checked,
                                            )
                                        }
                                        disabled={saving}
                                    />

                                    <span className="publish-toggle__switch">
                                        <span />
                                    </span>

                                    <span className="publish-toggle__content">

                                        <strong>
                                            Active
                                        </strong>

                                        <small>
                                            Make this opportunity visible on the public website.
                                        </small>

                                    </span>

                                </label>

                                <label className="publish-toggle">

                                    <input
                                        type="checkbox"
                                        checked={form.featured}
                                        onChange={(event) =>
                                            updateField(
                                                "featured",
                                                event.target.checked,
                                            )
                                        }
                                        disabled={saving}
                                    />

                                    <span className="publish-toggle__switch">
                                        <span />
                                    </span>

                                    <span className="publish-toggle__content">

                                        <strong>
                                            Featured
                                        </strong>

                                        <small>
                                            Mark this opportunity as featured.
                                        </small>

                                    </span>

                                </label>

                            </div>

                        </div>

                    </section>

                    {/* ======================================================
                        ACTIONS
                    ====================================================== */}

                    <div className="form-actions">

                        <Link
                            to="/admin/opportunities"
                            className="form-actions__cancel"
                        >
                            Cancel
                        </Link>

                        <button
                            type="submit"
                            className="form-actions__submit"
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

                                    {isEditMode
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