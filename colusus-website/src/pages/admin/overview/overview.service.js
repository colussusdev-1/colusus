import api from "../../../services/api";

/*
============================================================
ADMIN DASHBOARD
============================================================
*/

const getDashboardStats = async () => {
  const { data } = await api.get("/admin/dashboard");

  return data;
};

export default {
  getDashboardStats,
};
