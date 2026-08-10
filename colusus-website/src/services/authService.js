import api from "./api";

/*
============================================================
LOGIN
============================================================
*/

const login = async (email, password) => {
  const { data } = await api.post("/auth/login", {
    email,
    password,
  });

  if (data.token) {
    localStorage.setItem("colusus_token", data.token);
  }

  if (data.user) {
    localStorage.setItem("colusus_user", JSON.stringify(data.user));
  }

  return data;
};

/*
============================================================
REGISTER
============================================================
*/

const register = async (registrationData) => {
  const { data } = await api.post("/auth/register", registrationData);

  if (data.token) {
    localStorage.setItem("colusus_token", data.token);
  }

  if (data.user) {
    localStorage.setItem("colusus_user", JSON.stringify(data.user));
  }

  return data;
};

/*
============================================================
LOGOUT
============================================================
*/

const logout = () => {
  localStorage.removeItem("colusus_token");

  localStorage.removeItem("colusus_user");
};

/*
============================================================
GET CURRENT USER
============================================================
*/

const getCurrentUser = () => {
  const user = localStorage.getItem("colusus_user");

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
};

/*
============================================================
CHECK AUTHENTICATION
============================================================
*/

const isAuthenticated = () => {
  return Boolean(localStorage.getItem("colusus_token"));
};

export default {
  login,

  register,

  logout,

  getCurrentUser,

  isAuthenticated,
};
