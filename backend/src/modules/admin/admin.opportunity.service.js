import mongoose from "mongoose";
import Opportunity from "../opportunities/opportunity.model.js";

/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

const toTrimmedString = (value, fallback = "") => {
  if (value === undefined || value === null) {
    return fallback;
  }

  return String(value).trim();
};

const toNullableString = (value) => {
  const normalized = toTrimmedString(value);

  return normalized || null;
};

const toBoolean = (value, fallback = false) => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    if (value.toLowerCase() === "true") {
      return true;
    }

    if (value.toLowerCase() === "false") {
      return false;
    }
  }

  return fallback;
};

const normalizeArray = (value) => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (typeof item === "string") {
        return item.trim();
      }

      return item;
    })
    .filter((item) => {
      if (typeof item === "string") {
        return item.length > 0;
      }

      return item !== null && item !== undefined;
    });
};

const slugify = (value) => {
  return toTrimmedString(value)
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
};

const escapeRegex = (value) => {
  return String(value || "")
    .trim()
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

/*
|--------------------------------------------------------------------------
| COUNTRY PROFILE
|--------------------------------------------------------------------------
|
| The current Opportunity collection contains both:
|
| 1. Country-level information
| 2. Opportunity-level information
|
| Until a separate Country collection exists, these helpers treat the
| country information as a reusable destination profile.
|
|--------------------------------------------------------------------------
*/

const COUNTRY_FIELDS = [
  "countryId",
  "countryName",
  "countrySlug",
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
  "active",
  "featured",
  "createdAt",
];

const getCountryCompletenessScore = (country) => {
  if (!country) {
    return 0;
  }

  let score = 0;

  const stringFields = [
    "countryName",
    "countrySlug",
    "countryFlag",
    "countryImage",
    "applicants",
    "countryVisa",
    "countryDuration",
    "countryProcessingTime",
    "countryDescription",
    "opportunityScore",
    "successRate",
  ];

  stringFields.forEach((field) => {
    if (toTrimmedString(country[field])) {
      score += 1;
    }
  });

  if (
    Array.isArray(country.countryCategories) &&
    country.countryCategories.length > 0
  ) {
    score += 1;
  }

  return score;
};

const getCountryProfile = async ({
  countryId = null,
  countrySlug = "",
  countryName = "",
  excludeId = null,
} = {}) => {
  const queries = [];

  const parsedCountryId =
    countryId !== null && countryId !== undefined && countryId !== ""
      ? Number(countryId)
      : null;

  if (Number.isFinite(parsedCountryId) && parsedCountryId > 0) {
    queries.push({
      countryId: parsedCountryId,
    });
  }

  const normalizedSlug = slugify(countrySlug);

  if (normalizedSlug) {
    queries.push({
      countrySlug: normalizedSlug,
    });
  }

  const normalizedName = toTrimmedString(countryName);

  if (normalizedName) {
    queries.push({
      countryName: {
        $regex: `^${escapeRegex(normalizedName)}$`,
        $options: "i",
      },
    });
  }

  if (queries.length === 0) {
    return null;
  }

  const query =
    queries.length === 1
      ? { ...queries[0] }
      : {
          $or: queries,
        };

  if (excludeId) {
    query._id = {
      $ne: excludeId,
    };
  }

  const candidates = await Opportunity.find(query)
    .select(COUNTRY_FIELDS.join(" "))
    .lean();

  if (!candidates.length) {
    return null;
  }

  candidates.sort((a, b) => {
    /*
    |--------------------------------------------------------------------------
    | 1. Prefer active records
    |--------------------------------------------------------------------------
    */

    const activeDifference =
      Number(Boolean(b.active)) - Number(Boolean(a.active));

    if (activeDifference !== 0) {
      return activeDifference;
    }

    /*
    |--------------------------------------------------------------------------
    | 2. Prefer complete country records
    |--------------------------------------------------------------------------
    */

    const completenessDifference =
      getCountryCompletenessScore(b) - getCountryCompletenessScore(a);

    if (completenessDifference !== 0) {
      return completenessDifference;
    }

    /*
    |--------------------------------------------------------------------------
    | 3. Prefer records with country imagery
    |--------------------------------------------------------------------------
    */

    const imageDifference =
      Number(Boolean(toTrimmedString(b.countryImage))) -
      Number(Boolean(toTrimmedString(a.countryImage)));

    if (imageDifference !== 0) {
      return imageDifference;
    }

    /*
    |--------------------------------------------------------------------------
    | 4. Prefer featured records
    |--------------------------------------------------------------------------
    */

    const featuredDifference =
      Number(Boolean(b.featured)) - Number(Boolean(a.featured));

    if (featuredDifference !== 0) {
      return featuredDifference;
    }

    /*
    |--------------------------------------------------------------------------
    | 5. Finally use newest record
    |--------------------------------------------------------------------------
    */

    return (
      new Date(b.createdAt || 0).getTime() -
      new Date(a.createdAt || 0).getTime()
    );
  });

  return candidates[0];
};

/*
|--------------------------------------------------------------------------
| GET DESTINATIONS
|--------------------------------------------------------------------------
|
| The database currently has no separate Country collection.
|
| Therefore destinations are derived from existing Opportunity records.
|
| The frontend should use this endpoint when creating a new offer:
|
|     GET /admin/opportunities/destinations
|
| The user selects:
|
|     Australia
|
| instead of manually entering:
|
|     countryName
|     countrySlug
|     countryFlag
|     countryImage
|     visa
|     processing time
|     etc.
|
|--------------------------------------------------------------------------
*/

const getDestinations = async () => {
  const destinations = await Opportunity.aggregate([
    /*
    |--------------------------------------------------------------------------
    | Create temporary ranking values.
    |--------------------------------------------------------------------------
    */

    {
      $addFields: {
        _hasCountryImage: {
          $cond: [
            {
              $and: [
                { $ne: ["$countryImage", null] },
                { $ne: ["$countryImage", ""] },
              ],
            },
            1,
            0,
          ],
        },

        _hasCountryFlag: {
          $cond: [
            {
              $and: [
                { $ne: ["$countryFlag", null] },
                { $ne: ["$countryFlag", ""] },
              ],
            },
            1,
            0,
          ],
        },

        _hasDescription: {
          $cond: [
            {
              $and: [
                { $ne: ["$countryDescription", null] },
                { $ne: ["$countryDescription", ""] },
              ],
            },
            1,
            0,
          ],
        },
      },
    },

    /*
    |--------------------------------------------------------------------------
    | Put the strongest destination record first.
    |--------------------------------------------------------------------------
    |
    | This matters because country metadata currently lives on every
    | opportunity record.
    |
    */

    {
      $sort: {
        active: -1,
        _hasCountryImage: -1,
        _hasCountryFlag: -1,
        _hasDescription: -1,
        featured: -1,
        createdAt: -1,
      },
    },

    /*
    |--------------------------------------------------------------------------
    | Group all offers belonging to the same destination.
    |--------------------------------------------------------------------------
    */

    {
      $group: {
        _id: "$countrySlug",

        countryId: {
          $first: "$countryId",
        },

        countryName: {
          $first: "$countryName",
        },

        countrySlug: {
          $first: "$countrySlug",
        },

        countryFlag: {
          $first: "$countryFlag",
        },

        countryImage: {
          $first: "$countryImage",
        },

        applicants: {
          $first: "$applicants",
        },

        countryCategories: {
          $first: "$countryCategories",
        },

        countryVisa: {
          $first: "$countryVisa",
        },

        countryDuration: {
          $first: "$countryDuration",
        },

        countryProcessingTime: {
          $first: "$countryProcessingTime",
        },

        countryDescription: {
          $first: "$countryDescription",
        },

        opportunityScore: {
          $first: "$opportunityScore",
        },

        successRate: {
          $first: "$successRate",
        },

        offerCount: {
          $sum: 1,
        },

        activeOfferCount: {
          $sum: {
            $cond: [{ $eq: ["$active", true] }, 1, 0],
          },
        },

        inactiveOfferCount: {
          $sum: {
            $cond: [{ $eq: ["$active", false] }, 1, 0],
          },
        },

        featuredOfferCount: {
          $sum: {
            $cond: [{ $eq: ["$featured", true] }, 1, 0],
          },
        },
      },
    },

    /*
    |--------------------------------------------------------------------------
    | Sort destinations alphabetically for the admin selector.
    |--------------------------------------------------------------------------
    */

    {
      $sort: {
        countryName: 1,
      },
    },

    /*
    |--------------------------------------------------------------------------
    | Clean up the temporary aggregation identity.
    |--------------------------------------------------------------------------
    */

    {
      $project: {
        _id: 0,

        countryId: 1,
        countryName: 1,
        countrySlug: 1,
        countryFlag: 1,
        countryImage: 1,
        applicants: 1,
        countryCategories: 1,
        countryVisa: 1,
        countryDuration: 1,
        countryProcessingTime: 1,
        countryDescription: 1,
        opportunityScore: 1,
        successRate: 1,

        offerCount: 1,
        activeOfferCount: 1,
        inactiveOfferCount: 1,
        featuredOfferCount: 1,
      },
    },
  ]);

  return destinations;
};

/*
|--------------------------------------------------------------------------
| COUNTRY ID
|--------------------------------------------------------------------------
*/

const getCountryId = async (countryName, providedCountryId = null) => {
  if (
    providedCountryId !== null &&
    providedCountryId !== undefined &&
    providedCountryId !== ""
  ) {
    const parsed = Number(providedCountryId);

    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed;
    }
  }

  const existingCountry = await getCountryProfile({
    countryName,
  });

  if (existingCountry?.countryId) {
    return existingCountry.countryId;
  }

  const latestCountry = await Opportunity.findOne({
    countryId: {
      $exists: true,
      $ne: null,
    },
  })
    .sort({
      countryId: -1,
    })
    .select("countryId");

  return Number(latestCountry?.countryId || 0) + 1;
};

/*
|--------------------------------------------------------------------------
| APPLY COUNTRY PROFILE
|--------------------------------------------------------------------------
*/

const applyCountryProfile = (data, country, payload = {}) => {
  if (!country) {
    return data;
  }

  data.countryId = country.countryId ?? data.countryId;

  data.countryName = toTrimmedString(
    country.countryName,
    data.countryName || toTrimmedString(payload.countryName),
  );

  data.countrySlug =
    slugify(country.countrySlug) ||
    data.countrySlug ||
    slugify(payload.countrySlug);

  data.countryFlag =
    toNullableString(country.countryFlag) ??
    toNullableString(payload.countryFlag);

  data.countryImage =
    toNullableString(country.countryImage) ??
    toNullableString(payload.countryImage);

  data.applicants = toTrimmedString(
    country.applicants,
    toTrimmedString(payload.applicants),
  );

  data.countryCategories =
    Array.isArray(country.countryCategories) && country.countryCategories.length
      ? normalizeArray(country.countryCategories)
      : normalizeArray(payload.countryCategories);

  data.countryVisa =
    toNullableString(country.countryVisa) ??
    toNullableString(payload.countryVisa);

  data.countryDuration =
    toNullableString(country.countryDuration) ??
    toNullableString(payload.countryDuration);

  data.countryProcessingTime =
    toNullableString(country.countryProcessingTime) ??
    toNullableString(payload.countryProcessingTime);

  data.countryDescription =
    toNullableString(country.countryDescription) ??
    toNullableString(payload.countryDescription);

  data.opportunityScore = toTrimmedString(
    country.opportunityScore,
    toTrimmedString(payload.opportunityScore),
  );

  data.successRate = toTrimmedString(
    country.successRate,
    toTrimmedString(payload.successRate),
  );

  return data;
};

/*
|--------------------------------------------------------------------------
| UNIQUE SLUG
|--------------------------------------------------------------------------
*/

const makeUniqueSlug = async (value, excludeId = null) => {
  const baseSlug = slugify(value);

  if (!baseSlug) {
    const error = new Error("A valid opportunity slug could not be generated.");

    error.statusCode = 400;

    throw error;
  }

  let slug = baseSlug;
  let counter = 2;

  while (true) {
    const query = {
      slug,
    };

    if (excludeId) {
      query._id = {
        $ne: excludeId,
      };
    }

    const existing = await Opportunity.findOne(query).select("_id");

    if (!existing) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;

    counter += 1;
  }
};

/*
|--------------------------------------------------------------------------
| LEGACY ID
|--------------------------------------------------------------------------
*/

const getNextLegacyId = async () => {
  const latestOpportunity = await Opportunity.findOne({
    legacyId: {
      $exists: true,
      $ne: null,
    },
  })
    .sort({
      legacyId: -1,
    })
    .select("legacyId");

  return Number(latestOpportunity?.legacyId || 0) + 1;
};

/*
|--------------------------------------------------------------------------
| POSITIONS
|--------------------------------------------------------------------------
*/

const normalizePositions = (positions) => {
  if (!Array.isArray(positions)) {
    return [];
  }

  return positions
    .map((position) => {
      if (typeof position === "string") {
        const title = position.trim();

        if (!title) {
          return null;
        }

        return {
          title,
        };
      }

      if (!position || typeof position !== "object") {
        return null;
      }

      return {
        ...position,

        title: toTrimmedString(position.title),

        description: toNullableString(position.description),

        salary: toNullableString(position.salary),

        demand: toNullableString(position.demand),

        requirements: normalizeArray(position.requirements),

        benefits: normalizeArray(position.benefits),
      };
    })
    .filter(Boolean);
};

/*
|--------------------------------------------------------------------------
| STEPS
|--------------------------------------------------------------------------
*/

const normalizeSteps = (steps) => {
  if (!Array.isArray(steps)) {
    return [];
  }

  return steps
    .map((step) => {
      if (!step || typeof step !== "object") {
        return null;
      }

      const title = toTrimmedString(step.title);

      if (!title) {
        return null;
      }

      return {
        title,

        description: toNullableString(step.description),

        duration: toNullableString(step.duration),
      };
    })
    .filter(Boolean);
};

/*
|--------------------------------------------------------------------------
| PAYMENT PLAN
|--------------------------------------------------------------------------
*/

const normalizePaymentPlan = (paymentPlan) => {
  if (!Array.isArray(paymentPlan)) {
    return [];
  }

  return paymentPlan
    .map((item) => {
      if (typeof item === "string") {
        const description = item.trim();

        if (!description) {
          return null;
        }

        return {
          description,
        };
      }

      if (!item || typeof item !== "object") {
        return null;
      }

      return {
        ...item,

        title: toNullableString(item.title),

        description: toNullableString(item.description),

        amount: toNullableString(item.amount),

        percentage:
          item.percentage !== undefined &&
          item.percentage !== null &&
          item.percentage !== ""
            ? Number(item.percentage)
            : undefined,
      };
    })
    .filter(Boolean);
};

/*
|--------------------------------------------------------------------------
| PRICING
|--------------------------------------------------------------------------
*/

const normalizePricing = (pricing) => {
  if (!pricing || typeof pricing !== "object") {
    return {};
  }

  return {
    ...pricing,

    amount:
      pricing.amount !== undefined &&
      pricing.amount !== null &&
      pricing.amount !== ""
        ? Number(pricing.amount)
        : undefined,

    currency: toNullableString(pricing.currency),

    label: toNullableString(pricing.label),

    description: toNullableString(pricing.description),
  };
};

/*
|--------------------------------------------------------------------------
| REQUIRED DOCUMENTS
|--------------------------------------------------------------------------
*/

const normalizeRequiredDocuments = (documents) => {
  if (!Array.isArray(documents)) {
    return [];
  }

  const allowedTypes = [
    "PASSPORT",
    "IDENTIFICATION",
    "ACADEMIC_CERTIFICATE",
    "FINANCIAL_DOCUMENT",
    "EMPLOYMENT_DOCUMENT",
    "OTHER",
  ];

  return documents
    .map((document) => {
      if (typeof document === "string") {
        const name = document.trim();

        if (!name) {
          return null;
        }

        return {
          name,
          type: "OTHER",
          description: "",
          required: true,
        };
      }

      if (!document || typeof document !== "object") {
        return null;
      }

      const name = toTrimmedString(document.name);

      if (!name) {
        return null;
      }

      const type = allowedTypes.includes(document.type)
        ? document.type
        : "OTHER";

      return {
        name,

        type,

        description: toNullableString(document.description),

        required: toBoolean(document.required, true),
      };
    })
    .filter(Boolean);
};

/*
|--------------------------------------------------------------------------
| APPLICATION CONFIG
|--------------------------------------------------------------------------
*/

const normalizeApplicationConfig = (applicationConfig) => {
  if (!applicationConfig || typeof applicationConfig !== "object") {
    return {
      steps: ["DOCUMENTS", "REVIEW"],
      questions: [],
      requiredDocuments: [],
      workflow: [],
    };
  }

  const steps =
    Array.isArray(applicationConfig.steps) && applicationConfig.steps.length > 0
      ? normalizeArray(applicationConfig.steps)
      : ["DOCUMENTS", "REVIEW"];

  return {
    steps,

    questions: Array.isArray(applicationConfig.questions)
      ? applicationConfig.questions
      : [],

    requiredDocuments: normalizeRequiredDocuments(
      applicationConfig.requiredDocuments,
    ),

    workflow: Array.isArray(applicationConfig.workflow)
      ? applicationConfig.workflow
      : [],
  };
};

/*
|--------------------------------------------------------------------------
| VALIDATION
|--------------------------------------------------------------------------
*/

const validateOpportunityPayload = (payload) => {
  const hasCountryReference =
    payload.countryId !== undefined &&
    payload.countryId !== null &&
    payload.countryId !== "" &&
    Number.isFinite(Number(payload.countryId)) &&
    Number(payload.countryId) > 0;

  const requiredFields = [
    ["countryName", hasCountryReference ? "selected" : payload.countryName],
    ["title", payload.title],
    ["category", payload.category],
    ["type", payload.type],
    ["description", payload.description],
  ];

  const missingFields = requiredFields
    .filter(([, value]) => !toTrimmedString(value))
    .map(([field]) => field);

  if (missingFields.length > 0) {
    const error = new Error(
      `Missing required opportunity fields: ${missingFields.join(", ")}.`,
    );

    error.statusCode = 400;

    throw error;
  }
};

/*
|--------------------------------------------------------------------------
| CREATE DATA
|--------------------------------------------------------------------------
*/

const buildCreateData = async (payload) => {
  validateOpportunityPayload(payload);

  const selectedCountry = await getCountryProfile({
    countryId: payload.countryId,
    countrySlug: payload.countrySlug,
    countryName: payload.countryName,
  });

  const countryName = toTrimmedString(
    selectedCountry?.countryName || payload.countryName,
  );

  const countrySlug =
    slugify(selectedCountry?.countrySlug) ||
    slugify(payload.countrySlug) ||
    slugify(countryName);

  if (!countrySlug) {
    const error = new Error("A valid country slug is required.");

    error.statusCode = 400;

    throw error;
  }

  const title = toTrimmedString(payload.title);

  const slug = await makeUniqueSlug(payload.slug || title);

  const countryId =
    selectedCountry?.countryId ||
    (await getCountryId(countryName, payload.countryId));

  const legacyId =
    payload.legacyId !== undefined &&
    payload.legacyId !== null &&
    payload.legacyId !== ""
      ? Number(payload.legacyId)
      : await getNextLegacyId();

  const data = {
    countryId,

    countryName,

    countrySlug,

    countryFlag: toNullableString(payload.countryFlag),

    countryImage: toNullableString(payload.countryImage),

    applicants: toTrimmedString(payload.applicants),

    countryCategories: normalizeArray(payload.countryCategories),

    countryVisa: toNullableString(payload.countryVisa),

    countryDuration: toNullableString(payload.countryDuration),

    countryProcessingTime: toNullableString(payload.countryProcessingTime),

    countryDescription: toNullableString(payload.countryDescription),

    opportunityScore: toTrimmedString(payload.opportunityScore),

    successRate: toTrimmedString(payload.successRate),

    featured: toBoolean(payload.featured, false),

    legacyId,

    title,

    slug,

    image: toNullableString(payload.image),

    category: toTrimmedString(payload.category),

    location: toNullableString(payload.location),

    type: toTrimmedString(payload.type),

    duration: toNullableString(payload.duration),

    icon: toNullableString(payload.icon),

    salary: toNullableString(payload.salary),

    demand: toNullableString(payload.demand),

    description: toTrimmedString(payload.description),

    highlights: normalizeArray(payload.highlights),

    requirements: normalizeArray(payload.requirements),

    documents: normalizeArray(payload.documents),

    benefits: normalizeArray(payload.benefits),

    steps: normalizeSteps(payload.steps),

    positions: normalizePositions(payload.positions),

    workConditions:
      payload.workConditions !== undefined ? payload.workConditions : null,

    contract: toNullableString(payload.contract),

    faq: Array.isArray(payload.faq) ? payload.faq : [],

    pricing: normalizePricing(payload.pricing),

    paymentPlan: normalizePaymentPlan(payload.paymentPlan),

    terms: normalizeArray(payload.terms),

    applicationConfig: normalizeApplicationConfig(payload.applicationConfig),

    active: toBoolean(payload.active, true),
  };

  if (selectedCountry) {
    applyCountryProfile(data, selectedCountry, payload);
  }

  return data;
};

/*
|--------------------------------------------------------------------------
| UPDATE DATA
|--------------------------------------------------------------------------
*/

const buildUpdateData = async (payload, existing) => {
  validateOpportunityPayload({
    countryId: payload.countryId ?? existing.countryId,

    countryName: payload.countryName ?? existing.countryName,

    title: payload.title ?? existing.title,

    category: payload.category ?? existing.category,

    type: payload.type ?? existing.type,

    description: payload.description ?? existing.description,
  });

  const data = {};

  /*
  |--------------------------------------------------------------------------
  | DESTINATION
  |--------------------------------------------------------------------------
  */

  const destinationWasChanged =
    payload.countryId !== undefined ||
    payload.countrySlug !== undefined ||
    payload.countryName !== undefined;

  if (destinationWasChanged) {
    const selectedCountry = await getCountryProfile({
      countryId: payload.countryId,
      countrySlug: payload.countrySlug,
      countryName: payload.countryName,
      excludeId: existing._id,
    });

    if (selectedCountry) {
      applyCountryProfile(data, selectedCountry, payload);
    } else {
      if (payload.countryName !== undefined) {
        data.countryName = toTrimmedString(payload.countryName);
      }

      if (payload.countrySlug !== undefined) {
        data.countrySlug = slugify(payload.countrySlug);
      }

      if (payload.countryId !== undefined) {
        const countryId = Number(payload.countryId);

        if (Number.isFinite(countryId) && countryId > 0) {
          data.countryId = countryId;
        }
      }

      if (payload.countryFlag !== undefined) {
        data.countryFlag = toNullableString(payload.countryFlag);
      }

      if (payload.countryImage !== undefined) {
        data.countryImage = toNullableString(payload.countryImage);
      }

      if (payload.applicants !== undefined) {
        data.applicants = toTrimmedString(payload.applicants);
      }

      if (payload.countryCategories !== undefined) {
        data.countryCategories = normalizeArray(payload.countryCategories);
      }

      if (payload.countryVisa !== undefined) {
        data.countryVisa = toNullableString(payload.countryVisa);
      }

      if (payload.countryDuration !== undefined) {
        data.countryDuration = toNullableString(payload.countryDuration);
      }

      if (payload.countryProcessingTime !== undefined) {
        data.countryProcessingTime = toNullableString(
          payload.countryProcessingTime,
        );
      }

      if (payload.countryDescription !== undefined) {
        data.countryDescription = toNullableString(payload.countryDescription);
      }

      if (payload.opportunityScore !== undefined) {
        data.opportunityScore = toTrimmedString(payload.opportunityScore);
      }

      if (payload.successRate !== undefined) {
        data.successRate = toTrimmedString(payload.successRate);
      }
    }
  }

  /*
  |--------------------------------------------------------------------------
  | PUBLISHING
  |--------------------------------------------------------------------------
  */

  if (payload.featured !== undefined) {
    data.featured = toBoolean(payload.featured, existing.featured ?? false);
  }

  if (payload.active !== undefined) {
    data.active = toBoolean(payload.active, existing.active ?? true);
  }

  /*
  |--------------------------------------------------------------------------
  | OPPORTUNITY IDENTITY
  |--------------------------------------------------------------------------
  */

  if (payload.title !== undefined) {
    data.title = toTrimmedString(payload.title);
  }

  if (payload.slug !== undefined) {
    data.slug = await makeUniqueSlug(
      payload.slug || payload.title || existing.title,
      existing._id,
    );
  }

  /*
  |--------------------------------------------------------------------------
  | OPPORTUNITY CONTENT
  |--------------------------------------------------------------------------
  */

  if (payload.image !== undefined) {
    data.image = toNullableString(payload.image);
  }

  if (payload.category !== undefined) {
    data.category = toTrimmedString(payload.category);
  }

  if (payload.location !== undefined) {
    data.location = toNullableString(payload.location);
  }

  if (payload.type !== undefined) {
    data.type = toTrimmedString(payload.type);
  }

  if (payload.duration !== undefined) {
    data.duration = toNullableString(payload.duration);
  }

  if (payload.icon !== undefined) {
    data.icon = toNullableString(payload.icon);
  }

  if (payload.salary !== undefined) {
    data.salary = toNullableString(payload.salary);
  }

  if (payload.demand !== undefined) {
    data.demand = toNullableString(payload.demand);
  }

  if (payload.description !== undefined) {
    data.description = toTrimmedString(payload.description);
  }

  /*
  |--------------------------------------------------------------------------
  | ADVANCED FIELDS
  |--------------------------------------------------------------------------
  */

  if (payload.highlights !== undefined) {
    data.highlights = normalizeArray(payload.highlights);
  }

  if (payload.requirements !== undefined) {
    data.requirements = normalizeArray(payload.requirements);
  }

  if (payload.documents !== undefined) {
    data.documents = normalizeArray(payload.documents);
  }

  if (payload.benefits !== undefined) {
    data.benefits = normalizeArray(payload.benefits);
  }

  if (payload.steps !== undefined) {
    data.steps = normalizeSteps(payload.steps);
  }

  if (payload.positions !== undefined) {
    data.positions = normalizePositions(payload.positions);
  }

  if (payload.workConditions !== undefined) {
    data.workConditions = payload.workConditions;
  }

  if (payload.contract !== undefined) {
    data.contract = toNullableString(payload.contract);
  }

  if (payload.faq !== undefined) {
    data.faq = Array.isArray(payload.faq) ? payload.faq : [];
  }

  if (payload.pricing !== undefined) {
    data.pricing = normalizePricing(payload.pricing);
  }

  if (payload.paymentPlan !== undefined) {
    data.paymentPlan = normalizePaymentPlan(payload.paymentPlan);
  }

  if (payload.terms !== undefined) {
    data.terms = normalizeArray(payload.terms);
  }

  if (payload.applicationConfig !== undefined) {
    data.applicationConfig = normalizeApplicationConfig(
      payload.applicationConfig,
    );
  }

  /*
  |--------------------------------------------------------------------------
  | NEVER UPDATE
  |--------------------------------------------------------------------------
  |
  | _id
  | legacyId
  | createdAt
  |
  |--------------------------------------------------------------------------
  */

  return data;
};

/*
|--------------------------------------------------------------------------
| GET ALL OPPORTUNITIES
|--------------------------------------------------------------------------
*/

const getAllOpportunities = async () => {
  return Opportunity.find({})
    .sort({
      active: -1,
      featured: -1,
      countryName: 1,
      title: 1,
    })
    .lean();
};

/*
|--------------------------------------------------------------------------
| GET SINGLE OPPORTUNITY
|--------------------------------------------------------------------------
*/

const getOpportunityById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  return Opportunity.findById(id).lean();
};

/*
|--------------------------------------------------------------------------
| CREATE OPPORTUNITY
|--------------------------------------------------------------------------
*/

const createOpportunity = async (payload) => {
  const data = await buildCreateData(payload);

  const opportunity = await Opportunity.create(data);

  return opportunity.toObject();
};

/*
|--------------------------------------------------------------------------
| UPDATE OPPORTUNITY
|--------------------------------------------------------------------------
*/

const updateOpportunity = async (id, payload) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  const existing = await Opportunity.findById(id);

  if (!existing) {
    return null;
  }

  const data = await buildUpdateData(payload, existing);

  const updatedOpportunity = await Opportunity.findByIdAndUpdate(
    id,
    {
      $set: data,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  return updatedOpportunity;
};

/*
|--------------------------------------------------------------------------
| SET ACTIVE / INACTIVE
|--------------------------------------------------------------------------
*/

const setOpportunityActive = async (id, active) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  return Opportunity.findByIdAndUpdate(
    id,
    {
      $set: {
        active: Boolean(active),
      },
    },
    {
      new: true,
      runValidators: true,
    },
  );
};

/*
|--------------------------------------------------------------------------
| SET FEATURED
|--------------------------------------------------------------------------
*/

const setOpportunityFeatured = async (id, featured) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  return Opportunity.findByIdAndUpdate(
    id,
    {
      $set: {
        featured: Boolean(featured),
      },
    },
    {
      new: true,
      runValidators: true,
    },
  );
};

/*
|--------------------------------------------------------------------------
| DEACTIVATE
|--------------------------------------------------------------------------
|
| Soft-delete only.
|--------------------------------------------------------------------------
*/

const deactivateOpportunity = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
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

/*
|--------------------------------------------------------------------------
| EXPORT
|--------------------------------------------------------------------------
*/

export default {
  getAllOpportunities,

  getDestinations,

  getOpportunityById,

  createOpportunity,

  updateOpportunity,

  setOpportunityActive,

  setOpportunityFeatured,

  deactivateOpportunity,
};
