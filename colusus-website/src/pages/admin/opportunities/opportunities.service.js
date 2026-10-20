import api from "../../../services/api";

/* -------------------------------------------------------------------------- */
/* CONFIGURATION                                                              */
/* -------------------------------------------------------------------------- */

const BASE_URL = "/admin/opportunities";

/* -------------------------------------------------------------------------- */
/* OPPORTUNITIES                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Fetch all opportunities.
 *
 * Supported filters:
 * search, countrySlug, countryName, category, type,
 * active, featured, page, limit, sort, order.
 */
const getAllOpportunities = async (filters = {}) => {
  const params = {};

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params[key] = value;
    }
  });

  const { data } = await api.get(BASE_URL, { params });

  return data;
};

/**
 * Fetch a single opportunity by MongoDB ID.
 */
const getOpportunityById = async (id) => {
  if (!id) {
    throw new Error("An opportunity ID is required.");
  }

  const { data } = await api.get(`${BASE_URL}/${encodeURIComponent(id)}`);

  return data;
};

/**
 * Create an opportunity.
 */
const createOpportunity = async (payload) => {
  if (!payload || typeof payload !== "object") {
    throw new Error("Valid opportunity data is required.");
  }

  const { data } = await api.post(BASE_URL, payload);

  return data;
};

/**
 * Update an existing opportunity.
 */
const updateOpportunity = async (id, payload) => {
  if (!id) {
    throw new Error("An opportunity ID is required.");
  }

  if (!payload || typeof payload !== "object") {
    throw new Error("Valid opportunity data is required.");
  }

  const { data } = await api.patch(
    `${BASE_URL}/${encodeURIComponent(id)}`,
    payload,
  );

  return data;
};

/* -------------------------------------------------------------------------- */
/* OPPORTUNITY ACTIVE STATUS                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Publish or unpublish an opportunity.
 */
const setOpportunityActive = async (id, active) => {
  if (!id) {
    throw new Error("An opportunity ID is required.");
  }

  if (typeof active !== "boolean") {
    throw new Error("Active status must be a boolean.");
  }

  const { data } = await api.patch(
    `${BASE_URL}/${encodeURIComponent(id)}/active`,
    { active },
  );

  return data;
};

/* -------------------------------------------------------------------------- */
/* OPPORTUNITY FEATURED STATUS                                                */
/* -------------------------------------------------------------------------- */

/**
 * Feature or unfeature an opportunity.
 */
const setOpportunityFeatured = async (id, featured) => {
  if (!id) {
    throw new Error("An opportunity ID is required.");
  }

  if (typeof featured !== "boolean") {
    throw new Error("Featured status must be a boolean.");
  }

  const { data } = await api.patch(
    `${BASE_URL}/${encodeURIComponent(id)}/featured`,
    { featured },
  );

  return data;
};

/* -------------------------------------------------------------------------- */
/* DEACTIVATE OPPORTUNITY                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Deactivate an opportunity through the existing DELETE endpoint.
 *
 * The backend service should perform a soft deactivation by setting
 * active = false rather than permanently deleting the document.
 */
const deactivateOpportunity = async (id) => {
  if (!id) {
    throw new Error("An opportunity ID is required.");
  }

  const { data } = await api.delete(`${BASE_URL}/${encodeURIComponent(id)}`);

  return data;
};

/* -------------------------------------------------------------------------- */
/* DESTINATIONS                                                               */
/* -------------------------------------------------------------------------- */

/**
 * Fetch destinations.
 *
 * Supported filters:
 * search, active.
 */
const getDestinations = async (filters = {}) => {
  const params = {};

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params[key] = value;
    }
  });

  const { data } = await api.get(`${BASE_URL}/destinations`, { params });

  return data;
};

/**
 * Fetch destination details by country slug.
 */
const getDestinationBySlug = async (countrySlug) => {
  if (!countrySlug) {
    throw new Error("A destination country slug is required.");
  }

  const { data } = await api.get(
    `${BASE_URL}/destinations/${encodeURIComponent(countrySlug)}`,
  );

  return data;
};

/**
 * Update shared destination metadata.
 */
const updateDestination = async (countrySlug, payload) => {
  if (!countrySlug) {
    throw new Error("A destination country slug is required.");
  }

  if (!payload || typeof payload !== "object") {
    throw new Error("Valid destination data is required.");
  }

  const { data } = await api.patch(
    `${BASE_URL}/destinations/${encodeURIComponent(countrySlug)}`,
    payload,
  );

  return data;
};

/* -------------------------------------------------------------------------- */
/* DATA INTEGRITY                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Fetch the opportunity integrity report.
 */
const getIntegrityReport = async () => {
  const { data } = await api.get(`${BASE_URL}/integrity`);

  return data;
};

/* -------------------------------------------------------------------------- */
/* EXPORT                                                                     */
/* -------------------------------------------------------------------------- */

const opportunitiesService = {
  // Opportunity CRUD
  getAllOpportunities,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,

  // Opportunity status
  setOpportunityActive,
  setOpportunityFeatured,
  deactivateOpportunity,

  // Destinations
  getDestinations,
  getDestinationBySlug,
  updateDestination,

  // Integrity
  getIntegrityReport,
};

export default opportunitiesService;