import mongoose from "mongoose";
import Opportunity from "../opportunities/opportunity.model.js";

/* -------------------------------------------------------------------------- */
/* CONSTANTS                                                                  */
/* -------------------------------------------------------------------------- */

const DEFAULT_APPLICATION_STEPS = ["DOCUMENTS", "REVIEW"];

const DOCUMENT_TYPES = new Set([
  "PASSPORT",
  "IDENTIFICATION",
  "ACADEMIC_CERTIFICATE",
  "FINANCIAL_DOCUMENT",
  "EMPLOYMENT_DOCUMENT",
  "OTHER",
]);

const DESTINATION_FIELDS = [
  "countryFlag",
  "countryImage",
  "applicants",
  "countryCategories",
  "countryVisa",
  "countryDuration",
  "countryProcessingTime",
  "countryDescription",
  "opportunityScore",
  "successRate",
];

const OFFER_FIELDS = [
  "image",
  "category",
  "location",
  "type",
  "duration",
  "icon",
  "salary",
  "demand",
  "description",
  "highlights",
  "requirements",
  "documents",
  "benefits",
  "steps",
  "positions",
  "workConditions",
  "contract",
  "faq",
  "pricing",
  "paymentPlan",
  "terms",
  "applicationConfig",
];

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

const fail = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const own = (obj, key) => Object.prototype.hasOwnProperty.call(obj || {}, key);

const isObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const str = (value, fallback = "") =>
  value == null ? fallback : String(value).trim();

const nullable = (value) => str(value);

const bool = (value, fallback = false) => {
  if (typeof value === "boolean") return value;

  if (typeof value === "number" && (value === 0 || value === 1)) {
    return value === 1;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();

    if (["true", "1", "yes", "on"].includes(normalized)) {
      return true;
    }

    if (["false", "0", "no", "off"].includes(normalized)) {
      return false;
    }
  }

  return fallback;
};

const arr = (value) =>
  Array.isArray(value)
    ? value
        .map((item) => (typeof item === "string" ? item.trim() : item))
        .filter((item) =>
          typeof item === "string" ? item.length > 0 : item != null,
        )
    : [];

const slugify = (value) =>
  str(value)
    .toLowerCase()
    .replace(/&/g, " and ")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

const escapeRegex = (value) =>
  String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const positiveInt = (value, label) => {
  if (value == null || value === "") {
    return null;
  }

  const number = Number(value);

  if (!Number.isSafeInteger(number) || number <= 0) {
    throw fail(`${label} must be a positive integer.`);
  }

  return number;
};

const sameName = (first, second) =>
  str(first).toLowerCase().replace(/\s+/g, " ") ===
  str(second).toLowerCase().replace(/\s+/g, " ");

const validId = (id) => mongoose.Types.ObjectId.isValid(id);

const mapDbError = (error) => {
  if (error?.code === 11000) {
    return fail(
      "An offer with this destination and slug already exists. Change the offer slug and try again.",
      409,
    );
  }

  return error;
};

/* -------------------------------------------------------------------------- */
/* DESTINATION PROFILE                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Destination information currently lives on Opportunity documents.
 *
 * This helper selects a representative record for a destination.
 * Destination metadata updates must be propagated to all records sharing
 * the same countrySlug.
 */
const getCountryProfile = async ({
  countryId,
  countrySlug,
  countryName,
  excludeId,
} = {}) => {
  const id = positiveInt(countryId, "Country ID");
  const normalizedSlug = slugify(countrySlug);
  const normalizedName = str(countryName);

  let query;

  if (normalizedSlug) {
    query = {
      countrySlug: normalizedSlug,
    };
  } else if (normalizedName) {
    query = {
      countryName: {
        $regex: `^${escapeRegex(normalizedName)}$`,
        $options: "i",
      },
    };
  } else if (id) {
    query = {
      countryId: id,
    };
  } else {
    return null;
  }

  if (excludeId) {
    query._id = {
      $ne: excludeId,
    };
  }

  const records = await Opportunity.find(query)
    .select(
      [
        "countryId",
        "countryName",
        "countrySlug",
        ...DESTINATION_FIELDS,
        "active",
        "createdAt",
      ].join(" "),
    )
    .sort({
      active: -1,
      createdAt: -1,
    })
    .lean();

  const matches = records.filter(
    (record) =>
      (!normalizedSlug || slugify(record.countrySlug) === normalizedSlug) &&
      (!normalizedName || sameName(record.countryName, normalizedName)),
  );

  if (matches.length > 0) {
    const identities = new Set(
      matches.map(
        (record) =>
          `${str(record.countryName).toLowerCase()}::${slugify(
            record.countrySlug,
          )}`,
      ),
    );

    if (identities.size > 1) {
      throw fail(
        "The selected destination has conflicting names or slugs. Resolve the records first.",
        409,
      );
    }

    const counts = new Map();

    for (const record of matches) {
      const country = positiveInt(record.countryId, "Country ID");

      if (country) {
        counts.set(country, (counts.get(country) || 0) + 1);
      }
    }

    const canonicalId = [...counts.entries()].sort(
      (a, b) => b[1] - a[1] || a[0] - b[0],
    )[0]?.[0];

    if (!canonicalId) {
      throw fail(
        "The destination has no valid country ID. Resolve its records first.",
        409,
      );
    }

    if (id && id !== canonicalId && !counts.has(id)) {
      throw fail(
        "The supplied country ID does not belong to this destination.",
        409,
      );
    }

    // Prefer a record with a populated shared countryImage.
    // Never substitute an opportunity-specific image here.
    const chosen =
      matches.find(
        (record) =>
          Number(record.countryId) === canonicalId &&
          Boolean(str(record.countryImage)),
      ) ||
      matches.find((record) => Number(record.countryId) === canonicalId) ||
      matches[0];

    return {
      ...chosen,
      countryId: canonicalId,
      countryName: str(chosen.countryName),
      countrySlug: slugify(chosen.countrySlug),
    };
  }

  if (id) {
    const owner = await Opportunity.findOne({
      countryId: id,
    })
      .select("countryId countryName countrySlug")
      .lean();

    if (
      owner &&
      ((normalizedName && !sameName(owner.countryName, normalizedName)) ||
        (normalizedSlug && slugify(owner.countrySlug) !== normalizedSlug))
    ) {
      throw fail(
        "This country ID is already assigned to another destination.",
        409,
      );
    }
  }

  return null;
};

/* -------------------------------------------------------------------------- */
/* COUNTRY ID                                                                 */
/* -------------------------------------------------------------------------- */

const getCountryId = async (name, providedId, countrySlug) => {
  const id = positiveInt(providedId, "Country ID");

  const existing = await getCountryProfile({
    countryName: name,
    countrySlug,
  });

  if (existing) {
    if (id && id !== Number(existing.countryId)) {
      throw fail(
        "The supplied country ID does not match the selected destination.",
        409,
      );
    }

    return Number(existing.countryId);
  }

  if (id) {
    if (
      await Opportunity.exists({
        countryId: id,
      })
    ) {
      throw fail(
        "This country ID is already assigned to another destination.",
        409,
      );
    }

    return id;
  }

  const latest = await Opportunity.findOne({
    countryId: {
      $type: "number",
    },
  })
    .sort({
      countryId: -1,
    })
    .select("countryId")
    .lean();

  return Number(latest?.countryId || 0) + 1;
};

/* -------------------------------------------------------------------------- */
/* APPLY COUNTRY PROFILE                                                      */
/* -------------------------------------------------------------------------- */

const applyCountryProfile = (target, profile, fallback = {}) => {
  if (!profile) {
    return target;
  }

  target.countryId = Number(profile.countryId);
  target.countryName = str(profile.countryName);
  target.countrySlug = slugify(profile.countrySlug);

  for (const field of DESTINATION_FIELDS) {
    const value = profile[field] ?? fallback[field];

    target[field] =
      field === "countryCategories" ? arr(value) : nullable(value);
  }

  return target;
};

/* -------------------------------------------------------------------------- */
/* NORMALIZE MIGRATION JOURNEY STEPS                                          */
/* -------------------------------------------------------------------------- */

const normalizeSteps = (value) =>
  arr(value)
    .map((step) => {
      if (typeof step === "string") {
        const title = step.trim();

        return title
          ? {
              title,
              description: "",
              duration: "",
            }
          : null;
      }

      if (!isObject(step)) {
        return null;
      }

      const title = str(step.title);

      if (!title) {
        return null;
      }

      return {
        title,
        description: nullable(step.description),
        duration: nullable(step.duration),
      };
    })
    .filter(Boolean);

/* -------------------------------------------------------------------------- */
/* NORMALIZE POSITIONS                                                        */
/* -------------------------------------------------------------------------- */

const normalizePositions = (value) =>
  arr(value)
    .map((position) => {
      if (typeof position === "string") {
        return position.trim()
          ? {
              title: position.trim(),
            }
          : null;
      }

      if (!isObject(position) || !str(position.title)) {
        return null;
      }

      return {
        ...position,
        title: str(position.title),
        description: nullable(position.description),
        salary: nullable(position.salary),
        demand: nullable(position.demand),
        requirements: arr(position.requirements),
        benefits: arr(position.benefits),
      };
    })
    .filter(Boolean);

/* -------------------------------------------------------------------------- */
/* NORMALIZE PAYMENT PLAN                                                     */
/* -------------------------------------------------------------------------- */

const normalizePaymentPlan = (value) =>
  arr(value)
    .map((item) => {
      if (typeof item === "string") {
        return item.trim()
          ? {
              description: item.trim(),
            }
          : null;
      }

      if (!isObject(item)) {
        return null;
      }

      const result = {
        ...item,
        title: nullable(item.title),
        description: nullable(item.description),
        amount: nullable(item.amount),
      };

      if (
        item.percentage !== undefined &&
        item.percentage !== null &&
        item.percentage !== ""
      ) {
        const percentage = Number(item.percentage);

        if (
          !Number.isFinite(percentage) ||
          percentage < 0 ||
          percentage > 100
        ) {
          throw fail("Payment plan percentage must be between 0 and 100.");
        }

        result.percentage = percentage;
      } else {
        delete result.percentage;
      }

      return result;
    })
    .filter(Boolean);

/* -------------------------------------------------------------------------- */
/* NORMALIZE PRICING                                                          */
/* -------------------------------------------------------------------------- */

const normalizePricing = (value) => {
  if (value == null || !isObject(value)) {
    return null;
  }

  const result = {
    ...value,
  };

  if (
    value.amount !== undefined &&
    value.amount !== null &&
    value.amount !== ""
  ) {
    const amount = Number(value.amount);

    if (!Number.isFinite(amount) || amount < 0) {
      throw fail("Pricing amount must be a valid non-negative number.");
    }

    result.amount = amount;
  } else {
    delete result.amount;
  }

  for (const field of ["currency", "label", "description"]) {
    if (value[field] !== undefined) {
      result[field] = nullable(value[field]);
    }
  }

  return result;
};

/* -------------------------------------------------------------------------- */
/* NORMALIZE REQUIRED DOCUMENTS                                               */
/* -------------------------------------------------------------------------- */

const normalizeRequiredDocuments = (value) =>
  arr(value)
    .map((document) => {
      if (typeof document === "string") {
        const name = document.trim();

        return name
          ? {
              name,
              type: "OTHER",
              description: "",
              required: true,
            }
          : null;
      }

      if (!isObject(document) || !str(document.name)) {
        return null;
      }

      return {
        name: str(document.name),
        type: DOCUMENT_TYPES.has(document.type) ? document.type : "OTHER",
        description: nullable(document.description),
        required: bool(document.required, true),
      };
    })
    .filter(Boolean);

/* -------------------------------------------------------------------------- */
/* NORMALIZE APPLICATION CONFIGURATION                                       */
/* -------------------------------------------------------------------------- */

const normalizeApplicationConfig = (config) => {
  if (config == null) {
    return {
      steps: [...DEFAULT_APPLICATION_STEPS],
      questions: [],
      requiredDocuments: [],
      workflow: [],
    };
  }

  if (!isObject(config)) {
    throw fail("applicationConfig must be an object.");
  }

  return {
    steps:
      Array.isArray(config.steps) && config.steps.length > 0
        ? arr(config.steps).map((step) => str(step).toUpperCase())
        : [...DEFAULT_APPLICATION_STEPS],

    questions: Array.isArray(config.questions) ? config.questions : [],

    requiredDocuments: normalizeRequiredDocuments(config.requiredDocuments),

    workflow: Array.isArray(config.workflow) ? config.workflow : [],
  };
};

/* -------------------------------------------------------------------------- */
/* VALIDATION                                                                 */
/* -------------------------------------------------------------------------- */

const validateRequired = (payload) => {
  const missing = [
    "countryName",
    "title",
    "category",
    "type",
    "description",
  ].filter((field) => !str(payload[field]));

  if (missing.length > 0) {
    throw fail(`Missing required offer fields: ${missing.join(", ")}.`);
  }
};

const normalizeLegacyId = (value) => {
  if (value == null || value === "") {
    return null;
  }

  return positiveInt(value, "Legacy ID");
};

const getNextLegacyId = async () => {
  const latest = await Opportunity.findOne({
    legacyId: {
      $type: "number",
    },
  })
    .sort({
      legacyId: -1,
    })
    .select("legacyId")
    .lean();

  return Number(latest?.legacyId || 0) + 1;
};

/* -------------------------------------------------------------------------- */
/* UNIQUE SLUG                                                                */
/* -------------------------------------------------------------------------- */

const makeUniqueSlug = async (value, countrySlug, excludeId = null) => {
  const base = slugify(value);

  if (!base) {
    throw fail("A valid offer slug is required.");
  }

  let candidate = base;
  let counter = 2;

  while (true) {
    const query = {
      countrySlug,
      slug: candidate,
    };

    if (excludeId) {
      query._id = {
        $ne: excludeId,
      };
    }

    if (!(await Opportunity.exists(query))) {
      return candidate;
    }

    candidate = `${base}-${counter++}`;
  }
};

/* -------------------------------------------------------------------------- */
/* DUPLICATE TITLE PROTECTION                                                 */
/* -------------------------------------------------------------------------- */

const assertNoDuplicateTitle = async ({
  countrySlug,
  title,
  excludeId = null,
}) => {
  const query = {
    countrySlug,
    title: {
      $regex: `^${escapeRegex(title)}$`,
      $options: "i",
    },
  };

  if (excludeId) {
    query._id = {
      $ne: excludeId,
    };
  }

  if (await Opportunity.exists(query)) {
    throw fail(
      `An offer named "${title}" already exists for this destination. Edit the existing offer instead of creating a duplicate.`,
      409,
    );
  }
};

/* -------------------------------------------------------------------------- */
/* BUILD CREATE DATA                                                          */
/* -------------------------------------------------------------------------- */

const buildCreateData = async (payload = {}) => {
  if (!isObject(payload)) {
    throw fail("Offer payload must be an object.");
  }

  const requestedName = str(payload.countryName);
  const requestedCountrySlug = slugify(payload.countrySlug || requestedName);

  if (!requestedName || !requestedCountrySlug) {
    throw fail("A valid destination country name and slug are required.");
  }

  validateRequired({
    ...payload,
    countryName: requestedName,
  });

  const profile = await getCountryProfile({
    countryId: payload.countryId,
    countrySlug: requestedCountrySlug,
    countryName: requestedName,
  });

  const countryName = str(profile?.countryName || requestedName);
  const countrySlug = slugify(profile?.countrySlug || requestedCountrySlug);

  const countryId = profile
    ? Number(profile.countryId)
    : await getCountryId(countryName, payload.countryId, countrySlug);

  const title = str(payload.title);

  await assertNoDuplicateTitle({
    countrySlug,
    title,
  });

  const data = {
    countryId,
    countryName,
    countrySlug,

    legacyId: normalizeLegacyId(payload.legacyId) ?? (await getNextLegacyId()),

    title,

    slug: await makeUniqueSlug(payload.slug || title, countrySlug),

    image: nullable(payload.image),
    category: str(payload.category),
    location: nullable(payload.location),
    type: str(payload.type),
    duration: nullable(payload.duration),
    icon: nullable(payload.icon),

    salary: nullable(payload.salary),
    demand: nullable(payload.demand),
    description: str(payload.description),

    highlights: arr(payload.highlights),
    requirements: arr(payload.requirements),
    documents: arr(payload.documents),
    benefits: arr(payload.benefits),

    steps: normalizeSteps(payload.steps),
    positions: normalizePositions(payload.positions),

    workConditions: payload.workConditions ?? null,
    contract: nullable(payload.contract),

    faq: Array.isArray(payload.faq) ? payload.faq : [],

    pricing: normalizePricing(payload.pricing),
    paymentPlan: normalizePaymentPlan(payload.paymentPlan),
    terms: arr(payload.terms),

    applicationConfig: normalizeApplicationConfig(payload.applicationConfig),

    active: bool(payload.active, true),
    featured: bool(payload.featured, false),
  };

  if (profile) {
    applyCountryProfile(data, profile, payload);
  } else {
    for (const field of DESTINATION_FIELDS) {
      data[field] =
        field === "countryCategories"
          ? arr(payload[field])
          : nullable(payload[field]);
    }
  }

  // Destination identity remains authoritative.
  data.countryId = countryId;
  data.countryName = countryName;
  data.countrySlug = countrySlug;

  return data;
};

/* -------------------------------------------------------------------------- */
/* BUILD UPDATE DATA                                                          */
/* -------------------------------------------------------------------------- */

const buildUpdateData = async (payload = {}, existing) => {
  if (!isObject(payload)) {
    throw fail("Offer payload must be an object.");
  }

  validateRequired({
    countryName: payload.countryName ?? existing.countryName,
    title: payload.title ?? existing.title,
    category: payload.category ?? existing.category,
    type: payload.type ?? existing.type,
    description: payload.description ?? existing.description,
  });

  const data = {};

  const identitySubmitted = ["countryId", "countryName", "countrySlug"].some(
    (field) => own(payload, field),
  );

  const nextName = own(payload, "countryName")
    ? str(payload.countryName)
    : str(existing.countryName);

  const nextSlug = own(payload, "countrySlug")
    ? slugify(payload.countrySlug)
    : own(payload, "countryName")
      ? slugify(payload.countryName)
      : slugify(existing.countrySlug);

  const nextId = own(payload, "countryId")
    ? positiveInt(payload.countryId, "Country ID")
    : Number(existing.countryId);

  const changed =
    nextName !== str(existing.countryName) ||
    nextSlug !== slugify(existing.countrySlug) ||
    nextId !== Number(existing.countryId);

  if (identitySubmitted && changed) {
    if (!nextName || !nextSlug) {
      throw fail(
        "A destination change requires a valid country name and slug.",
      );
    }

    const profile = await getCountryProfile({
      countryId: nextId,
      countryName: nextName,
      countrySlug: nextSlug,
      excludeId: existing._id,
    });

    const countryId = profile
      ? Number(profile.countryId)
      : await getCountryId(nextName, nextId, nextSlug);

    data.countryId = countryId;
    data.countryName = profile?.countryName || nextName;
    data.countrySlug = slugify(profile?.countrySlug || nextSlug);

    if (profile) {
      applyCountryProfile(data, profile, payload);
    } else {
      for (const field of DESTINATION_FIELDS) {
        if (!own(payload, field)) {
          continue;
        }

        data[field] =
          field === "countryCategories"
            ? arr(payload[field])
            : nullable(payload[field]);
      }
    }
  } else if (identitySubmitted) {
    if (own(payload, "countryId") && nextId !== Number(existing.countryId)) {
      throw fail("Country ID does not match the current destination.");
    }

    if (
      own(payload, "countryName") &&
      !sameName(payload.countryName, existing.countryName)
    ) {
      throw fail("Country name does not match the current destination.");
    }

    if (
      own(payload, "countrySlug") &&
      nextSlug !== slugify(existing.countrySlug)
    ) {
      throw fail("Country slug does not match the current destination.");
    }
  }

  if (own(payload, "title")) {
    data.title = str(payload.title);
  }

  const effectiveCountrySlug =
    data.countrySlug || slugify(existing.countrySlug);

  if (own(payload, "slug")) {
    if (!slugify(payload.slug)) {
      throw fail("Offer slug cannot be empty.");
    }

    data.slug = await makeUniqueSlug(
      payload.slug,
      effectiveCountrySlug,
      existing._id,
    );
  }

  for (const field of OFFER_FIELDS) {
    if (!own(payload, field)) {
      continue;
    }

    switch (field) {
      case "highlights":
      case "requirements":
      case "documents":
      case "benefits":
      case "terms":
        data[field] = arr(payload[field]);
        break;

      case "steps":
        data.steps = normalizeSteps(payload.steps);
        break;

      case "positions":
        data.positions = normalizePositions(payload.positions);
        break;

      case "workConditions":
        data.workConditions = payload.workConditions ?? null;
        break;

      case "faq":
        data.faq = Array.isArray(payload.faq) ? payload.faq : [];
        break;

      case "pricing":
        data.pricing = normalizePricing(payload.pricing);
        break;

      case "paymentPlan":
        data.paymentPlan = normalizePaymentPlan(payload.paymentPlan);
        break;

      case "applicationConfig":
        data.applicationConfig = normalizeApplicationConfig(
          payload.applicationConfig,
        );
        break;

      default:
        data[field] = nullable(payload[field]);
        break;
    }
  }

  if (own(payload, "active")) {
    data.active = bool(payload.active, existing.active);
  }

  if (own(payload, "featured")) {
    data.featured = bool(payload.featured, existing.featured);
  }

  if (own(payload, "legacyId")) {
    data.legacyId = positiveInt(payload.legacyId, "Legacy ID");
  }

  if (data.title) {
    await assertNoDuplicateTitle({
      countrySlug: effectiveCountrySlug,
      title: data.title,
      excludeId: existing._id,
    });
  }

  return data;
};

/* -------------------------------------------------------------------------- */
/* GET ALL OPPORTUNITIES                                                      */
/* -------------------------------------------------------------------------- */

const getAllOpportunities = async () =>
  Opportunity.find({})
    .sort({
      active: -1,
      featured: -1,
      countryName: 1,
      title: 1,
    })
    .lean();

/* -------------------------------------------------------------------------- */
/* GET OPPORTUNITY BY ID                                                      */
/* -------------------------------------------------------------------------- */

const getOpportunityById = async (id) =>
  validId(id) ? Opportunity.findById(id).lean() : null;

/* -------------------------------------------------------------------------- */
/* GET DESTINATIONS                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Groups offers by destination.
 *
 * The destination image comes from countryImage only.
 * Opportunity-specific image values are deliberately not used as a fallback.
 */
const getDestinations = async () => {
  const offers = await getAllOpportunities();
  const grouped = new Map();

  for (const offer of offers) {
    const key = slugify(offer.countrySlug);

    if (!key) {
      continue;
    }

    if (!grouped.has(key)) {
      grouped.set(key, {
        countryId: offer.countryId,
        countryName: offer.countryName,
        countrySlug: key,

        ...Object.fromEntries(
          DESTINATION_FIELDS.map((field) => [
            field,
            offer[field] ?? (field === "countryCategories" ? [] : ""),
          ]),
        ),

        offerCount: 0,
        activeOfferCount: 0,
        inactiveOfferCount: 0,
        featuredOfferCount: 0,
      });
    }

    const country = grouped.get(key);

    // If the first record has an empty countryImage, accept a populated
    // countryImage from another offer belonging to the same destination.
    if (!country.countryImage && str(offer.countryImage)) {
      country.countryImage = str(offer.countryImage);
    }

    country.offerCount++;

    if (offer.active === false) {
      country.inactiveOfferCount++;
    } else {
      country.activeOfferCount++;
    }

    if (offer.featured === true) {
      country.featuredOfferCount++;
    }
  }

  return [...grouped.values()].sort((a, b) =>
    str(a.countryName).localeCompare(str(b.countryName)),
  );
};

/* -------------------------------------------------------------------------- */
/* GET DESTINATION BY SLUG                                                    */
/* -------------------------------------------------------------------------- */

const getDestinationBySlug = async (countrySlug) => {
  const normalizedSlug = slugify(countrySlug);

  if (!normalizedSlug) {
    return null;
  }

  const offers = await Opportunity.find({
    countrySlug: normalizedSlug,
  })
    .sort({
      active: -1,
      featured: -1,
      createdAt: -1,
    })
    .lean();

  if (!offers.length) {
    return null;
  }

  const first = offers[0];

  const identities = new Set(
    offers.map(
      (offer) =>
        `${Number(offer.countryId)}::${str(
          offer.countryName,
        ).toLowerCase()}::${slugify(offer.countrySlug)}`,
    ),
  );

  // Use the first non-empty countryImage across matching records.
  // Never substitute offer.image for the destination image.
  const sharedCountryImage =
    offers.find((offer) => str(offer.countryImage))?.countryImage || "";

  return {
    countryId: first.countryId ?? null,
    countryName: first.countryName || "",
    countrySlug: normalizedSlug,

    ...Object.fromEntries(
      DESTINATION_FIELDS.map((field) => [
        field,
        field === "countryImage"
          ? sharedCountryImage
          : (first[field] ?? (field === "countryCategories" ? [] : "")),
      ]),
    ),

    countryImage: sharedCountryImage,

    offerCount: offers.length,

    activeOfferCount: offers.filter((offer) => offer.active !== false).length,

    inactiveOfferCount: offers.filter((offer) => offer.active === false).length,

    featuredOfferCount: offers.filter((offer) => offer.featured === true)
      .length,

    hasIdentityConflicts: identities.size > 1,

    identityConflicts:
      identities.size > 1
        ? offers.map((offer) => ({
            offerId: String(offer._id),
            title: offer.title,
            countryId: offer.countryId ?? null,
            countryName: offer.countryName || "",
            countrySlug: offer.countrySlug || "",
          }))
        : [],

    offers,
  };
};

/* -------------------------------------------------------------------------- */
/* CREATE OPPORTUNITY                                                         */
/* -------------------------------------------------------------------------- */

const createOpportunity = async (payload) => {
  try {
    const data = await buildCreateData(payload);
    const opportunity = await Opportunity.create(data);

    return opportunity.toObject();
  } catch (error) {
    throw mapDbError(error);
  }
};

/* -------------------------------------------------------------------------- */
/* UPDATE OPPORTUNITY                                                         */
/* -------------------------------------------------------------------------- */

const updateOpportunity = async (id, payload) => {
  if (!validId(id)) {
    return null;
  }

  const existing = await Opportunity.findById(id);

  if (!existing) {
    return null;
  }

  try {
    const data = await buildUpdateData(payload, existing);

    if (!Object.keys(data).length) {
      return existing.toObject();
    }

    return await Opportunity.findByIdAndUpdate(
      id,
      {
        $set: data,
      },
      {
        new: true,
        runValidators: true,
        context: "query",
      },
    );
  } catch (error) {
    throw mapDbError(error);
  }
};

/* -------------------------------------------------------------------------- */
/* SET ACTIVE / INACTIVE                                                      */
/* -------------------------------------------------------------------------- */

const setOpportunityActive = async (id, active) => {
  if (!validId(id)) {
    return null;
  }

  if (active === undefined || active === null) {
    throw fail("An active value is required.");
  }

  return Opportunity.findByIdAndUpdate(
    id,
    {
      $set: {
        active: bool(active, false),
      },
    },
    {
      new: true,
      runValidators: true,
    },
  );
};

/* -------------------------------------------------------------------------- */
/* SET FEATURED                                                               */
/* -------------------------------------------------------------------------- */

const setOpportunityFeatured = async (id, featured) => {
  if (!validId(id)) {
    return null;
  }

  if (featured === undefined || featured === null) {
    throw fail("A featured value is required.");
  }

  return Opportunity.findByIdAndUpdate(
    id,
    {
      $set: {
        featured: bool(featured, false),
      },
    },
    {
      new: true,
      runValidators: true,
    },
  );
};

/* -------------------------------------------------------------------------- */
/* DEACTIVATE OPPORTUNITY                                                     */
/* -------------------------------------------------------------------------- */

const deactivateOpportunity = async (id) => {
  if (!validId(id)) {
    return null;
  }

  return Opportunity.findByIdAndUpdate(
    id,
    {
      $set: {
        active: false,
        featured: false,
      },
    },
    {
      new: true,
      runValidators: true,
    },
  );
};

/* -------------------------------------------------------------------------- */
/* UPDATE DESTINATION METADATA                                                */
/* -------------------------------------------------------------------------- */

/**
 * Updates shared metadata across every opportunity belonging to a destination.
 *
 * This includes countryImage, which means an uploaded destination image is
 * shared across all matching opportunities after this method succeeds.
 */
const updateDestination = async (countrySlug, payload = {}) => {
  const normalizedSlug = slugify(countrySlug);

  if (!normalizedSlug) {
    throw fail("A valid destination slug is required.");
  }

  if (
    ["countryId", "countryName", "countrySlug"].some((field) =>
      own(payload, field),
    )
  ) {
    throw fail(
      "Destination identity cannot be edited in the metadata editor. Use a dedicated integrity-repair operation.",
      409,
    );
  }

  const updates = {};

  for (const field of DESTINATION_FIELDS) {
    if (!own(payload, field)) {
      continue;
    }

    if (field === "countryCategories") {
      if (!Array.isArray(payload[field])) {
        throw fail("countryCategories must be an array.");
      }

      updates[field] = arr(payload[field]);
    } else {
      updates[field] = nullable(payload[field]);
    }
  }

  if (!Object.keys(updates).length) {
    throw fail("No editable destination metadata was provided.");
  }

  const result = await Opportunity.updateMany(
    {
      countrySlug: normalizedSlug,
    },
    {
      $set: updates,
    },
    {
      runValidators: true,
    },
  );

  return result.matchedCount ? getDestinationBySlug(normalizedSlug) : null;
};

/* -------------------------------------------------------------------------- */
/* READ-ONLY DATA INTEGRITY REPORT                                             */
/* -------------------------------------------------------------------------- */

const getIntegrityReport = async () => {
  const offers = await Opportunity.find({})
    .select(
      "_id legacyId title slug countryId countryName countrySlug active featured createdAt updatedAt",
    )
    .sort({
      createdAt: -1,
    })
    .lean();

  const issues = [];

  const countryIds = new Map();
  const countrySlugs = new Map();
  const titleGroups = new Map();

  const group = (map, key, offer) => {
    if (!key) {
      return;
    }

    if (!map.has(key)) {
      map.set(key, []);
    }

    map.get(key).push(offer);
  };

  for (const offer of offers) {
    const id = Number(offer.countryId);

    const name = str(offer.countryName).toLowerCase().replace(/\s+/g, " ");

    const countrySlug = slugify(offer.countrySlug);

    const title = str(offer.title).toLowerCase().replace(/\s+/g, " ");

    if (Number.isSafeInteger(id) && id > 0) {
      group(countryIds, String(id), offer);
    }

    group(countrySlugs, countrySlug, offer);

    if (countrySlug && title) {
      group(titleGroups, `${countrySlug}::${title}`, offer);
    }

    const addIssue = (code, severity, message) => {
      issues.push({
        opportunityId: String(offer._id),
        legacyId: offer.legacyId ?? null,
        title: offer.title || "(Untitled offer)",
        slug: offer.slug || "",
        countryId: offer.countryId ?? null,
        countryName: offer.countryName || "",
        countrySlug: offer.countrySlug || "",
        active: offer.active !== false,
        featured: offer.featured === true,

        issue: {
          code,
          severity,
          message,
        },
      });
    };

    if (!Number.isSafeInteger(id) || id <= 0) {
      addIssue("INVALID_COUNTRY_ID", "ERROR", "Missing or invalid country ID.");
    }

    if (!name) {
      addIssue(
        "MISSING_COUNTRY_NAME",
        "ERROR",
        "Missing destination country name.",
      );
    }

    if (!countrySlug) {
      addIssue("MISSING_COUNTRY_SLUG", "ERROR", "Missing destination slug.");
    }

    if (!str(offer.title)) {
      addIssue("MISSING_OFFER_TITLE", "ERROR", "Missing offer title.");
    }

    if (!slugify(offer.slug)) {
      addIssue("MISSING_OFFER_SLUG", "ERROR", "Missing offer slug.");
    }
  }

  /* Country ID conflicts */

  for (const [id, records] of countryIds) {
    const identities = new Set(
      records.map(
        (offer) =>
          `${str(offer.countryName).toLowerCase()}::${slugify(
            offer.countrySlug,
          )}`,
      ),
    );

    if (identities.size > 1) {
      for (const offer of records) {
        issues.push({
          opportunityId: String(offer._id),
          legacyId: offer.legacyId ?? null,
          title: offer.title || "(Untitled offer)",
          slug: offer.slug || "",
          countryId: offer.countryId ?? null,
          countryName: offer.countryName || "",
          countrySlug: offer.countrySlug || "",
          active: offer.active !== false,
          featured: offer.featured === true,

          issue: {
            code: "COUNTRY_ID_CONFLICT",
            severity: "ERROR",
            message: `Country ID ${id} has conflicting destination identities.`,
          },
        });
      }
    }
  }

  /* Country slug conflicts */

  for (const [slug, records] of countrySlugs) {
    const identities = new Set(
      records.map(
        (offer) =>
          `${Number(offer.countryId)}::${str(offer.countryName).toLowerCase()}`,
      ),
    );

    if (identities.size > 1) {
      for (const offer of records) {
        issues.push({
          opportunityId: String(offer._id),
          legacyId: offer.legacyId ?? null,
          title: offer.title || "(Untitled offer)",
          slug: offer.slug || "",
          countryId: offer.countryId ?? null,
          countryName: offer.countryName || "",
          countrySlug: offer.countrySlug || "",
          active: offer.active !== false,
          featured: offer.featured === true,

          issue: {
            code: "COUNTRY_SLUG_CONFLICT",
            severity: "ERROR",
            message: `Destination slug "${slug}" has conflicting identities.`,
          },
        });
      }
    }
  }

  /* Potential duplicate offers */

  for (const records of titleGroups.values()) {
    if (records.length <= 1) {
      continue;
    }

    for (const offer of records) {
      issues.push({
        opportunityId: String(offer._id),
        legacyId: offer.legacyId ?? null,
        title: offer.title || "(Untitled offer)",
        slug: offer.slug || "",
        countryId: offer.countryId ?? null,
        countryName: offer.countryName || "",
        countrySlug: offer.countrySlug || "",
        active: offer.active !== false,
        featured: offer.featured === true,

        issue: {
          code: "POTENTIAL_DUPLICATE_OFFER",
          severity: "WARNING",
          message: `This offer shares a title and destination with ${
            records.length - 1
          } other record(s). Review before deleting.`,
        },
      });
    }
  }

  const rank = {
    ERROR: 0,
    WARNING: 1,
    INFO: 2,
  };

  issues.sort(
    (a, b) =>
      rank[a.issue.severity] - rank[b.issue.severity] ||
      a.title.localeCompare(b.title),
  );

  const issueCounts = {};

  for (const item of issues) {
    issueCounts[item.issue.code] = (issueCounts[item.issue.code] || 0) + 1;
  }

  const affected = new Set(issues.map((item) => item.opportunityId));

  const errorCount = issues.filter(
    (item) => item.issue.severity === "ERROR",
  ).length;

  const warningCount = issues.filter(
    (item) => item.issue.severity === "WARNING",
  ).length;

  return {
    scannedAt: new Date().toISOString(),

    summary: {
      totalOffersScanned: offers.length,
      totalIssues: issues.length,
      affectedOffers: affected.size,
      errorCount,
      warningCount,
      healthyOffers: offers.length - affected.size,
      issueCounts,
    },

    issues,
  };
};

/* -------------------------------------------------------------------------- */
/* EXPORT SERVICE METHODS                                                     */
/* -------------------------------------------------------------------------- */

export default {
  getAllOpportunities,
  getDestinations,
  getDestinationBySlug,
  updateDestination,
  getIntegrityReport,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  setOpportunityActive,
  setOpportunityFeatured,
  deactivateOpportunity,
};
