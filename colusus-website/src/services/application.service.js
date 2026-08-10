import api from "./api";

const getApplications = async () => {
  const { data } = await api.get("/applications");

  return data.data;
};

const getApplication = async (applicationId) => {
  const { data } = await api.get(`/applications/${applicationId}`);

  return data.data;
};

const createApplication = async (applicationData) => {
  const { data } = await api.post("/applications", applicationData);

  return data.data;
};

export default {
  getApplications,

  getApplication,

  createApplication,
};
