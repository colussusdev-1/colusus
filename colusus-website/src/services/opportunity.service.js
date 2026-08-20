import api from "./api";

const getOpportunities = async (params = {}) => {
  const { data } = await api.get("/opportunities", {
    params,
  });

  return data.data;
};

const getOpportunity = async (id) => {
  const { data } = await api.get(`/opportunities/${id}`);

  return data.data;
};

export default {
  getOpportunities,
  getOpportunity,
};
