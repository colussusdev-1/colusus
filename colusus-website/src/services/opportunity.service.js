import api from "./api";

/* ============================================================
   GET COUNTRIES
============================================================ */

const getCountries = async () => {
  const { data } = await api.get("/opportunities/countries");

  return data.data || [];
};

/* ============================================================
   GET ALL OPPORTUNITIES
============================================================ */

const getOpportunities = async (params = {}) => {
  const { data } = await api.get("/opportunities", {
    params,
  });

  return data.data || [];
};

/* ============================================================
   GET OPPORTUNITY BY COUNTRY + SLUG
============================================================ */

const getOpportunity = async (countrySlug, opportunitySlug) => {
  if (!countrySlug || !opportunitySlug) {
    return null;
  }

  const { data } = await api.get(
    `/opportunities/${encodeURIComponent(countrySlug)}/${encodeURIComponent(
      opportunitySlug,
    )}`,
  );

  return data.data || null;
};

/* ============================================================
   GET OPPORTUNITY BY MONGODB ID
============================================================ */

const getOpportunityById = async (id) => {
  if (!id) {
    return null;
  }

  const { data } = await api.get(`/opportunities/${encodeURIComponent(id)}`);

  return data.data || null;
};

/* ============================================================
   EXPORT
============================================================ */

export default {
  getCountries,

  getOpportunities,

  getOpportunity,

  getOpportunityById,
};
