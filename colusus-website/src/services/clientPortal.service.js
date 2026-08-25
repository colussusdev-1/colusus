import api from "./api";

/*
============================================================
GET CLIENT PROFILE
============================================================
*/

const getProfile = async () => {
  const { data } = await api.get("/client-profile");

  return data.data;
};

/*
============================================================
GET PROFILE COMPLETION
============================================================
*/

const getProfileCompletion = async () => {
  const { data } = await api.get("/client-profile/completion");

  return data.data;
};

/*
============================================================
UPDATE CLIENT PROFILE
============================================================
*/

const updateProfile = async (profileData) => {
  const { data } = await api.patch("/client-profile", profileData);

  return data.data;
};

/*
============================================================
EXPORT
============================================================
*/

export default {
  getProfile,

  getProfileCompletion,

  updateProfile,
};
