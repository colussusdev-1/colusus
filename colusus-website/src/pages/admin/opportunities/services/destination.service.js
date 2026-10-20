import api from "../../../../services/api";

const BASE_URL = "/admin/opportunities";
const DESTINATIONS_URL = `${BASE_URL}/destinations`;

const unwrapResponse = (response) => {
  const body = response?.data;

  if (!body) return null;

  // Handles: { success: true, data: { destinations: [...] } }
  if (body.data !== undefined) {
    return body.data;
  }

  return body;
};

const destinationsService = {
  /**
   * GET ALL DESTINATIONS
   *
   * Uses the backend aggregation endpoint rather than fetching
   * individual offers and treating them as destinations.
   */
  async getDestinations() {
    const response = await api.get(DESTINATIONS_URL);

    const result = unwrapResponse(response);

    if (Array.isArray(result)) {
      return result;
    }

    if (Array.isArray(result?.destinations)) {
      return result.destinations;
    }

    if (Array.isArray(result?.data)) {
      return result.data;
    }

    return [];
  },

  /**
   * GET ONE DESTINATION BY SLUG
   */
  async getDestinationBySlug(countrySlug) {
    if (!countrySlug) {
      throw new Error("Country slug is required.");
    }

    const response = await api.get(
      `${DESTINATIONS_URL}/${encodeURIComponent(countrySlug)}`,
    );

    return unwrapResponse(response);
  },

  /**
   * UPDATE DESTINATION METADATA
   */
  async updateDestination(countrySlug, payload) {
    if (!countrySlug) {
      throw new Error("Country slug is required.");
    }

    const response = await api.patch(
      `${DESTINATIONS_URL}/${encodeURIComponent(countrySlug)}`,
      payload,
    );

    return unwrapResponse(response);
  },

  /**
   * GET DESTINATION INTEGRITY REPORT
   */
  async getIntegrityReport() {
    const response = await api.get(`${BASE_URL}/integrity`);

    return unwrapResponse(response);
  },
};

export default destinationsService;
