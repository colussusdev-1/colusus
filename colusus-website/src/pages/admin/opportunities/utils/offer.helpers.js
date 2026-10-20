/* -------------------------------------------------------------------------- */
/* RESPONSE HELPERS                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Extract opportunities from supported API response structures.
 *
 * Handles:
 * - Raw arrays
 * - { success: true, data: [...] }
 * - { success: true, data: { opportunities: [...] } }
 * - { success: true, data: { items: [...] } }
 * - { opportunities: [...] }
 * - Paginated response objects
 */
export function getResponseData(response) {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response?.data?.opportunities)) {
    return response.data.opportunities;
  }

  if (Array.isArray(response?.data?.items)) {
    return response.data.items;
  }

  if (Array.isArray(response?.opportunities)) {
    return response.opportunities;
  }

  if (Array.isArray(response?.items)) {
    return response.items;
  }

  if (Array.isArray(response?.results)) {
    return response.results;
  }

  return [];
}

/**
 * Extract a single object from an API response.
 */
export function getResponseObject(response) {
  if (!response || typeof response !== "object") {
    return null;
  }

  const data = response.data ?? response;

  if (Array.isArray(data)) {
    return null;
  }

  return data && typeof data === "object" ? data : null;
}

/* -------------------------------------------------------------------------- */
/* IDENTITY                                                                   */
/* -------------------------------------------------------------------------- */

export function getOpportunityId(opportunity) {
  return opportunity?._id || opportunity?.id || opportunity?.legacyId || null;
}

export function getCountryName(opportunity) {
  return opportunity?.countryName || opportunity?.country?.name || "—";
}

export function getCountrySlug(opportunity) {
  return opportunity?.countrySlug || opportunity?.country?.slug || "";
}

export function getCountryFlag(opportunity) {
  return opportunity?.countryFlag || opportunity?.country?.flag || "";
}

/* -------------------------------------------------------------------------- */
/* STATUS                                                                     */
/* -------------------------------------------------------------------------- */

export function getOpportunityStatus(opportunity) {
  return opportunity?.active === false ? "INACTIVE" : "PUBLISHED";
}

export function isOpportunityActive(opportunity) {
  return opportunity?.active !== false;
}

export function isOpportunityFeatured(opportunity) {
  return opportunity?.featured === true;
}

/* -------------------------------------------------------------------------- */
/* OPPORTUNITY FIELDS                                                         */
/* -------------------------------------------------------------------------- */

export function getOpportunityTitle(opportunity) {
  return opportunity?.title || "Untitled offer";
}

export function getOpportunitySlug(opportunity) {
  return opportunity?.slug || "";
}

export function getOpportunityCategory(opportunity) {
  const category = opportunity?.category;

  if (Array.isArray(category)) {
    return category.length ? category.join(", ") : "Uncategorized";
  }

  return category || "Uncategorized";
}

export function getOpportunityType(opportunity) {
  return opportunity?.type || "—";
}

export function getOpportunityLocation(opportunity) {
  return opportunity?.location || "—";
}

export function getOpportunityDuration(opportunity) {
  return opportunity?.duration || "—";
}

export function getOpportunityDescription(opportunity) {
  return opportunity?.description || "";
}

/* -------------------------------------------------------------------------- */
/* IMAGE                                                                      */
/* -------------------------------------------------------------------------- */

export function getOpportunityImage(opportunity) {
  const image = opportunity?.image;

  if (typeof image === "string") {
    return image;
  }

  return (
    image?.url ||
    image?.secure_url ||
    opportunity?.imageUrl ||
    opportunity?.coverImage ||
    ""
  );
}

export function getDestinationImage(opportunity) {
  return (
    opportunity?.countryImage ||
    opportunity?.country?.image ||
    getOpportunityImage(opportunity)
  );
}

/* -------------------------------------------------------------------------- */
/* SALARY                                                                     */
/* -------------------------------------------------------------------------- */

export function formatSalary(salary) {
  if (salary === null || salary === undefined || salary === "") {
    return "—";
  }

  if (typeof salary === "string") {
    return salary;
  }

  if (typeof salary === "number") {
    return salary.toLocaleString();
  }

  if (typeof salary !== "object") {
    return "—";
  }

  if (salary.display) {
    return salary.display;
  }

  const currency = salary.currency ? `${salary.currency} ` : "";

  if (salary.amount !== undefined && salary.amount !== null) {
    const amount = Number(salary.amount);

    return Number.isFinite(amount)
      ? `${currency}${amount.toLocaleString()}`
      : "—";
  }

  if (salary.min !== undefined || salary.max !== undefined) {
    const min =
      salary.min !== undefined && salary.min !== null
        ? Number(salary.min).toLocaleString()
        : "—";

    const max =
      salary.max !== undefined && salary.max !== null
        ? Number(salary.max).toLocaleString()
        : "—";

    return `${currency}${min} – ${currency}${max}`;
  }

  return "—";
}

/* -------------------------------------------------------------------------- */
/* PUBLIC URL                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Public opportunity route:
 * /opportunities/:countrySlug/:slug
 */
export function getPublicOpportunityPath(opportunity) {
  const countrySlug = getCountrySlug(opportunity);
  const slug = getOpportunitySlug(opportunity);

  if (!countrySlug || !slug) {
    return "";
  }

  return (
    `/opportunities/` +
    `${encodeURIComponent(countrySlug)}/` +
    `${encodeURIComponent(slug)}`
  );
}

/* -------------------------------------------------------------------------- */
/* SEARCH                                                                     */
/* -------------------------------------------------------------------------- */

export function getOpportunitySearchText(opportunity) {
  return [
    getOpportunityTitle(opportunity),
    getCountryName(opportunity),
    getOpportunityCategory(opportunity),
    getOpportunityType(opportunity),
    getOpportunityLocation(opportunity),
    getOpportunityDescription(opportunity),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}
