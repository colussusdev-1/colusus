import opportunityService from "../../../services/opportunity.service";

import { createOpportunityPool } from "./normalizer";

/* -------------------------------------------------------------------------- */
/* OPPORTUNITY POOL                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Opportunities are loaded from the public API instead of local country data.
 *
 * API:
 * GET /opportunities
 *
 * The pool is cached after the first successful request.
 */
let opportunities = [];
let loadingPromise = null;

/* -------------------------------------------------------------------------- */
/* NORMALIZE API RESPONSE                                                     */
/* -------------------------------------------------------------------------- */

const normalizeApiResponse = (data) => {
  if (!Array.isArray(data)) {
    return [];
  }

  /*
   * Support APIs that return countries containing nested opportunities.
   */
  const containsNestedOpportunities = data.some((item) =>
    Array.isArray(item?.opportunities),
  );

  if (containsNestedOpportunities) {
    return createOpportunityPool(data);
  }

  /*
   * Support APIs that return a flat list of opportunities.
   *
   * Preserve database slugs and existing country information.
   */
  return data.map((opportunity) => {
    const country =
      typeof opportunity.country === "object" && opportunity.country !== null
        ? opportunity.country
        : {};

    return {
      ...opportunity,

      id: opportunity.id ?? opportunity._id,

      countryId:
        opportunity.countryId ??
        country.id ??
        country._id ??
        opportunity.country_id ??
        opportunity.countrySlug,

      countryName:
        opportunity.countryName ??
        country.name ??
        (typeof opportunity.country === "string"
          ? opportunity.country
          : undefined),

      countrySlug:
        opportunity.countrySlug ?? country.slug ?? opportunity.country_slug,

      countryFlag: opportunity.countryFlag ?? country.flag ?? opportunity.flag,

      countryImage:
        opportunity.countryImage ??
        country.image ??
        opportunity.countryImageUrl,

      slug: opportunity.slug,

      searchable: [
        opportunity.title,
        opportunity.name,
        opportunity.category,
        opportunity.type,
        opportunity.location,
        opportunity.description,
        opportunity.salary,
        opportunity.demand,
        opportunity.countryName,
        country.name,
        ...(Array.isArray(opportunity.highlights)
          ? opportunity.highlights
          : []),
        ...(Array.isArray(opportunity.benefits) ? opportunity.benefits : []),
        ...(Array.isArray(opportunity.requirements)
          ? opportunity.requirements
          : []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase(),
    };
  });
};

/* -------------------------------------------------------------------------- */
/* LOAD OPPORTUNITIES                                                         */
/* -------------------------------------------------------------------------- */

/**
 * Fetch current opportunities from the public API.
 *
 * Concurrent callers share the same request.
 * Failed requests can be retried.
 */
export const loadOpportunityPool = async ({ forceRefresh = false } = {}) => {
  if (loadingPromise && !forceRefresh) {
    return loadingPromise;
  }

  if (opportunities.length > 0 && !forceRefresh) {
    return opportunities;
  }

  loadingPromise = (async () => {
    try {
      const response = await opportunityService.getOpportunities();

      const normalized = normalizeApiResponse(response);

      opportunities = normalized;

      return opportunities;
    } catch (error) {
      console.error("Failed to load opportunities for assessment:", error);

      throw error;
    } finally {
      loadingPromise = null;
    }
  })();

  return loadingPromise;
};

/* -------------------------------------------------------------------------- */
/* GET ALL OPPORTUNITIES                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Returns the currently loaded opportunities.
 *
 * Call loadOpportunityPool() first to populate the pool.
 */
export const getOpportunityPool = () => {
  return opportunities;
};

/* -------------------------------------------------------------------------- */
/* GET COUNT                                                                  */
/* -------------------------------------------------------------------------- */

export const getOpportunityCount = () => {
  return opportunities.length;
};

/* -------------------------------------------------------------------------- */
/* GET OPPORTUNITY                                                            */
/* -------------------------------------------------------------------------- */

export const getOpportunityById = (countryId, opportunityId) => {
  return opportunities.find(
    (opportunity) =>
      String(opportunity.countryId) === String(countryId) &&
      String(opportunity.id) === String(opportunityId),
  );
};

/* -------------------------------------------------------------------------- */
/* DEFAULT EXPORT                                                             */
/* -------------------------------------------------------------------------- */

export default {
  loadOpportunityPool,
  getOpportunityPool,
  getOpportunityCount,
  getOpportunityById,
};
