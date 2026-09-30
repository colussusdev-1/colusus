import api from "../../../services/api";

/*
|--------------------------------------------------------------------------
| OPPORTUNITIES
|--------------------------------------------------------------------------
*/

const getAllOpportunities = async () => {
  const { data } = await api.get("/admin/opportunities");
  return data;
};

const getOpportunityById = async (id) => {
  const { data } = await api.get(`/admin/opportunities/${id}`);
  return data;
};

const createOpportunity = async (payload) => {
  const { data } = await api.post("/admin/opportunities", payload);
  return data;
};

const updateOpportunity = async (id, payload) => {
  const { data } = await api.patch(`/admin/opportunities/${id}`, payload);

  return data;
};

/*
|--------------------------------------------------------------------------
| ACTIVE STATUS
|--------------------------------------------------------------------------
*/

const setOpportunityActive = async (id, active) => {
  const { data } = await api.patch(`/admin/opportunities/${id}/active`, {
    active,
  });

  return data;
};

/*
|--------------------------------------------------------------------------
| FEATURED STATUS
|--------------------------------------------------------------------------
*/

const setOpportunityFeatured = async (id, featured) => {
  const { data } = await api.patch(`/admin/opportunities/${id}/featured`, {
    featured,
  });

  return data;
};

/*
|--------------------------------------------------------------------------
| DEACTIVATE
|--------------------------------------------------------------------------
*/

const deactivateOpportunity = async (id) => {
  const { data } = await api.delete(`/admin/opportunities/${id}`);

  return data;
};

/*
|--------------------------------------------------------------------------
| EXPORT
|--------------------------------------------------------------------------
*/

export default {
  getAllOpportunities,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  setOpportunityActive,
  setOpportunityFeatured,
  deactivateOpportunity,
};
