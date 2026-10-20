import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import opportunitiesService from "./opportunities.service";

import DestinationSection from "./components/form/DestinationSection";
import OfferDetailsSection from "./components/form/OfferDetailsSection";
import CommercialSection from "./components/form/CommercialSection";
import ApplicationConfigSection from "./components/form/ApplicationConfigSection";
import PublicationSection from "./components/form/PublicationSection";

import "./opportunity-form.css";

/* -------------------------------------------------------------------------- */
/* DEFAULTS                                                                   */
/* -------------------------------------------------------------------------- */

const DEFAULT_APPLICATION_CONFIG = {
  steps: ["DOCUMENTS", "REVIEW"],
  questions: [],
  requiredDocuments: [],
  workflow: [],
};

const createEmptyForm = () => ({
  /* Destination */
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

  /* Offer details */
  legacyId: "",
  title: "",
  slug: "",
  image: "",
  category: "",
  type: "",
  location: "",
  duration: "",
  icon: "",
  salary: "",
  demand: "",
  description: "",

  /* Offer content */
  highlights: [],
  requirements: [],
  documents: [],
  benefits: [],
  steps: [],
  positions: [],
  workConditions: null,
  contract: "",
  faq: [],

  /* Commercial */
  pricing: {
    amount: "",
    currency: "NGN",
    label: "",
    description: "",
  },

  paymentPlan: [],
  terms: [],

  /* Application configuration */
  applicationConfig: {
    ...DEFAULT_APPLICATION_CONFIG,
    steps: [...DEFAULT_APPLICATION_CONFIG.steps],
    questions: [],
    requiredDocuments: [],
    workflow: [],
  },

  /* Publication */
  active: true,
  featured: false,
});

/* -------------------------------------------------------------------------- */
/* RESPONSE HELPERS                                                           */
/* -------------------------------------------------------------------------- */

const getItems = (response) => {
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

  if (Array.isArray(response?.data?.items)) {
    return response.data.items;
  }

  if (Array.isArray(response?.items)) {
    return response.items;
  }

  return [];
};

const getOpportunity = (response) => {
  if (
    response?.data &&
    typeof response.data === "object" &&
    !Array.isArray(response.data)
  ) {
    return response.data;
  }

  return response;
};

const getErrorMessage = (error, fallback) => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
};

/* -------------------------------------------------------------------------- */
/* DESTINATION NORMALIZATION                                                  */
/* -------------------------------------------------------------------------- */

const normalizeDestination = (item = {}) => ({
  countryId: item.countryId ?? "",
  countryName: item.countryName || item.name || "",
  countrySlug: item.countrySlug || item.slug || "",
  countryFlag: item.countryFlag || item.flag || "",
  countryImage: item.countryImage || item.image || "",

  applicants: item.applicants || "",

  countryCategories: Array.isArray(item.countryCategories)
    ? item.countryCategories
    : Array.isArray(item.categories)
      ? item.categories
      : [],

  countryVisa: item.countryVisa || item.visa || "",
  countryDuration: item.countryDuration || item.duration || "",
  countryProcessingTime:
    item.countryProcessingTime || item.processingTime || "",

  countryDescription:
    item.countryDescription || item.description || "",

  opportunityScore: item.opportunityScore ?? "",
  successRate: item.successRate ?? "",
});

/* -------------------------------------------------------------------------- */
/* APPLICATION CONFIGURATION NORMALIZATION                                    */
/* -------------------------------------------------------------------------- */

const normalizeRequiredDocuments = (documents) => {
  if (!Array.isArray(documents)) {
    return [];
  }

  return documents.map((document) => {
    if (typeof document === "string") {
      return {
        name: document,
        type: "OTHER",
        description: "",
        required: true,
      };
    }

    return {
      name: document?.name || "",
      type: document?.type || "OTHER",
      description: document?.description || "",
      required: document?.required !== false,
    };
  });
};

const normalizeApplicationConfig = (config = {}) => ({
  ...DEFAULT_APPLICATION_CONFIG,
  ...config,

  steps:
    Array.isArray(config.steps) && config.steps.length > 0
      ? config.steps
      : [...DEFAULT_APPLICATION_CONFIG.steps],

  questions: Array.isArray(config.questions)
    ? config.questions
    : [],

  requiredDocuments: normalizeRequiredDocuments(
    config.requiredDocuments
  ),

  workflow: Array.isArray(config.workflow)
    ? config.workflow
    : [],
});

/* -------------------------------------------------------------------------- */
/* FORM NORMALIZATION                                                         */
/* -------------------------------------------------------------------------- */

const normalizeForm = (data = {}) => {
  const defaults = createEmptyForm();

  return {
    ...defaults,
    ...data,

    countryId: data.countryId ?? "",
    countryName: data.countryName || "",
    countrySlug: data.countrySlug || "",

    highlights: Array.isArray(data.highlights)
      ? data.highlights
      : [],

    requirements: Array.isArray(data.requirements)
      ? data.requirements
      : [],

    documents: Array.isArray(data.documents)
      ? data.documents
      : [],

    benefits: Array.isArray(data.benefits)
      ? data.benefits
      : [],

    steps: Array.isArray(data.steps)
      ? data.steps
      : [],

    positions: Array.isArray(data.positions)
      ? data.positions
      : [],

    faq: Array.isArray(data.faq)
      ? data.faq
      : [],

    terms: Array.isArray(data.terms)
      ? data.terms
      : [],

    pricing: {
      ...defaults.pricing,
      ...(data.pricing || {}),
    },

    paymentPlan: Array.isArray(data.paymentPlan)
      ? data.paymentPlan
      : [],

    applicationConfig: normalizeApplicationConfig(
      data.applicationConfig || {}
    ),

    active: data.active !== false,
    featured: Boolean(data.featured),
  };
};

/* -------------------------------------------------------------------------- */
/* PAYLOAD NORMALIZATION                                                      */
/* -------------------------------------------------------------------------- */

const buildPayload = (form) => {
  const applicationConfig = normalizeApplicationConfig(
    form.applicationConfig
  );

  const pricingAmount = form.pricing?.amount;

  const normalizedPricing = {
    ...form.pricing,
    amount:
      pricingAmount === "" ||
        pricingAmount === null ||
        pricingAmount === undefined
        ? undefined
        : Number(pricingAmount),
  };

  return {
    ...form,

    countryId: Number(form.countryId),
    countryName: String(form.countryName || "").trim(),
    countrySlug: String(form.countrySlug || "").trim(),

    title: String(form.title || "").trim(),
    slug: String(form.slug || "").trim(),
    category: String(form.category || "").trim(),
    type: String(form.type || "").trim(),
    description: String(form.description || "").trim(),

    pricing: normalizedPricing,

    applicationConfig: {
      ...applicationConfig,

      steps: applicationConfig.steps.map((step) =>
        String(step).trim()
      ),

      requiredDocuments:
        applicationConfig.requiredDocuments.map((document) => ({
          name: String(document.name || "").trim(),
          type: document.type || "OTHER",
          description: String(document.description || "").trim(),
          required: document.required !== false,
        })),
    },

    paymentPlan: Array.isArray(form.paymentPlan)
      ? form.paymentPlan
      : [],
  };
};

/* -------------------------------------------------------------------------- */
/* COMPONENT                                                                  */
/* -------------------------------------------------------------------------- */

const OpportunityForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  /* ------------------------------------------------------------------------ */
  /* STATE                                                                    */
  /* ------------------------------------------------------------------------ */

  const [form, setForm] = useState(createEmptyForm);

  const [destinations, setDestinations] = useState([]);

  const [loading, setLoading] = useState(isEditMode);
  const [destinationsLoading, setDestinationsLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /*
   * ApplicationConfigSection will report its validation errors here.
   * We will connect this callback in the next step.
   */
  const [applicationConfigErrors, setApplicationConfigErrors] = useState(
    []
  );

  /* ------------------------------------------------------------------------ */
  /* LOAD DESTINATIONS                                                        */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    let mounted = true;

    const loadDestinations = async () => {
      try {
        setDestinationsLoading(true);

        const response =
          await opportunitiesService.getDestinations();

        if (!mounted) {
          return;
        }

        const normalizedDestinations = getItems(response)
          .map(normalizeDestination)
          .filter(
            (destination) =>
              destination.countrySlug &&
              destination.countryName
          );

        setDestinations(normalizedDestinations);
      } catch (err) {
        if (mounted) {
          setError(
            getErrorMessage(
              err,
              "Could not load destinations."
            )
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

  /* ------------------------------------------------------------------------ */
  /* LOAD EXISTING OFFER                                                      */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    let mounted = true;

    const loadOpportunity = async () => {
      if (!id) {
        setForm(createEmptyForm());
        setApplicationConfigErrors([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        setSuccess("");

        const response =
          await opportunitiesService.getOpportunityById(id);

        if (!mounted) {
          return;
        }

        const opportunity = getOpportunity(response);

        setForm(normalizeForm(opportunity));
        setApplicationConfigErrors([]);
      } catch (err) {
        if (mounted) {
          setError(
            getErrorMessage(
              err,
              "Could not load this offer."
            )
          );
        }
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

  /* ------------------------------------------------------------------------ */
  /* SELECTED DESTINATION                                                     */
  /* ------------------------------------------------------------------------ */

  const selectedDestination = useMemo(
    () =>
      destinations.find(
        (destination) =>
          destination.countrySlug === form.countrySlug
      ) || null,
    [destinations, form.countrySlug]
  );

  /* ------------------------------------------------------------------------ */
  /* GENERIC FIELD UPDATER                                                    */
  /* ------------------------------------------------------------------------ */

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setError("");
    setSuccess("");
  };

  /* ------------------------------------------------------------------------ */
  /* DESTINATION CHANGE                                                       */
  /* ------------------------------------------------------------------------ */

  const handleDestinationChange = (countrySlug) => {
    const destination = destinations.find(
      (item) => item.countrySlug === countrySlug
    );

    if (!destination) {
      setError("Select a valid destination.");
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
      countryCategories: destination.countryCategories,
      countryVisa: destination.countryVisa,
      countryDuration: destination.countryDuration,
      countryProcessingTime: destination.countryProcessingTime,
      countryDescription: destination.countryDescription,
      opportunityScore: destination.opportunityScore,
      successRate: destination.successRate,
    }));

    setError("");
    setSuccess("");
  };

  /* ------------------------------------------------------------------------ */
  /* FORM VALIDATION                                                          */
  /* ------------------------------------------------------------------------ */

  const validate = () => {
    /* Destination */

    if (
      !form.countrySlug ||
      !String(form.countryName || "").trim() ||
      form.countryId === "" ||
      form.countryId === null ||
      !Number.isFinite(Number(form.countryId))
    ) {
      setError("Select a valid destination.");
      return false;
    }

    /* Required offer fields */

    const requiredFields = [
      ["title", "Offer title"],
      ["slug", "URL slug"],
      ["category", "Category"],
      ["type", "Opportunity type"],
      ["description", "Description"],
    ];

    for (const [key, label] of requiredFields) {
      if (!String(form[key] ?? "").trim()) {
        setError(`${label} is required.`);
        return false;
      }
    }

    /* Application configuration */

    const applicationConfig = form.applicationConfig || {};

    if (
      !Array.isArray(applicationConfig.steps) ||
      applicationConfig.steps.length === 0
    ) {
      setError("Add at least one application step.");
      return false;
    }

    if (
      !Array.isArray(applicationConfig.requiredDocuments)
    ) {
      setError("Required documents must be a valid list.");
      return false;
    }

    const invalidDocument =
      applicationConfig.requiredDocuments.find(
        (document) =>
          !document ||
          !String(
            typeof document === "string"
              ? document
              : document.name || ""
          ).trim()
      );

    if (invalidDocument) {
      setError(
        "Every required-document entry must have a name, or be removed."
      );
      return false;
    }

    /*
     * This becomes effective once ApplicationConfigSection reports
     * JSON editor errors through onValidationChange.
     */
    if (applicationConfigErrors.length > 0) {
      setError(
        `Fix the application configuration errors before saving: ${applicationConfigErrors.join(
          "; "
        )}`
      );

      return false;
    }

    /* Pricing */

    const pricingAmount = form.pricing?.amount;

    if (
      pricingAmount !== "" &&
      pricingAmount !== null &&
      pricingAmount !== undefined &&
      (
        !Number.isFinite(Number(pricingAmount)) ||
        Number(pricingAmount) < 0
      )
    ) {
      setError(
        "Pricing amount must be a valid non-negative number."
      );

      return false;
    }

    return true;
  };

  /* ------------------------------------------------------------------------ */
  /* FORM SUBMISSION                                                          */
  /* ------------------------------------------------------------------------ */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (saving) {
      return;
    }

    if (!validate()) {
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = buildPayload(form);

      if (isEditMode) {
        await opportunitiesService.updateOpportunity(id, payload);
      } else {
        await opportunitiesService.createOpportunity(payload);
      }

      setSuccess(
        isEditMode
          ? "Offer updated successfully."
          : "Offer created successfully."
      );

      window.setTimeout(() => {
        navigate("/admin/opportunities");
      }, 700);
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Unable to save the offer."
        )
      );
    } finally {
      setSaving(false);
    }
  };

  /* ------------------------------------------------------------------------ */
  /* LOADING STATE                                                            */
  /* ------------------------------------------------------------------------ */

  if (loading) {
    return (
      <div className="opportunity-form-page">
        <div className="opportunity-form-container">
          <p>Loading offer…</p>
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------------------ */
  /* RENDER                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <div className="opportunity-form-page">
      <div className="opportunity-form-container">
        {/* Header */}

        <header className="opportunity-form-header">
          <Link
            to="/admin/opportunities"
            className="opportunity-form-back"
          >
            ← Back to offers
          </Link>

          <div className="opportunity-form-heading">
            <div>
              <span className="opportunity-form-eyebrow">
                COLOSSUS · OFFER BUILDER
              </span>

              <h1>
                {isEditMode
                  ? "Edit migration offer"
                  : "Create migration offer"}
              </h1>

              <p>
                Configure the destination, public offer, commercial
                terms and applicant workflow in one place.
              </p>
            </div>

            {selectedDestination && (
              <div className="opportunity-form-heading__destination">
                <strong>
                  {selectedDestination.countryFlag}{" "}
                  {selectedDestination.countryName}
                </strong>

                <small>
                  /{selectedDestination.countrySlug}
                </small>
              </div>
            )}
          </div>
        </header>

        {/* Feedback */}

        {error && (
          <div
            className="opportunity-form-alert opportunity-form-alert--error"
            role="alert"
          >
            {error}
          </div>
        )}

        {success && (
          <div
            className="opportunity-form-alert opportunity-form-alert--success"
            role="status"
          >
            {success}
          </div>
        )}

        {/* Main Form */}

        <form
          className="opportunity-form"
          onSubmit={handleSubmit}
          noValidate
        >
          {/* 01 — Destination */}

          <DestinationSection
            form={form}
            destinations={destinations}
            onDestinationChange={handleDestinationChange}
            disabled={saving || destinationsLoading}
          />

          {/* 02 — Offer Details */}

          <OfferDetailsSection
            form={form}
            updateField={updateField}
            saving={saving}
          />

          {/* 03 — Commercial */}

          <CommercialSection
            form={form}
            updateField={updateField}
            saving={saving}
          />

          {/* 04 — Application Configuration */}

          <ApplicationConfigSection
            form={form}
            updateField={updateField}
            saving={saving}
            onValidationChange={setApplicationConfigErrors}
          />

          {/* 05 — Publication */}

          <PublicationSection
            form={form}
            updateField={updateField}
            saving={saving}
          />

          {/* Actions */}

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
                  {selectedDestination.countryName}
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
                disabled={saving || destinationsLoading}
              >
                {saving
                  ? "Saving…"
                  : isEditMode
                    ? "Save changes"
                    : "Create offer"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OpportunityForm;