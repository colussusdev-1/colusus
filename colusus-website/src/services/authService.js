import api from "./api";

/*
============================================================
colossus — AUTH SERVICE
============================================================

Shared authentication service for:

- Client
- Admin
- Staff

The backend remains responsible for determining the user's
actual role.

This service does NOT decide whether a user is ADMIN, STAFF,
or CLIENT.

The individual portal decides where the authenticated user
is allowed to go.

============================================================
*/

/*
============================================================
LOGIN
============================================================
*/

const login = async (email, password) => {
  const { data } = await api.post("/auth/login", {
    email: String(email || "").trim(),

    password,
  });

  /*
  ----------------------------------------------------------
  STORE TOKEN
  ----------------------------------------------------------
  */

  if (data?.token) {
    localStorage.setItem("colossus_token", data.token);
  }

  /*
  ----------------------------------------------------------
  STORE USER
  ----------------------------------------------------------
  */

  if (data?.user) {
    localStorage.setItem("colossus_user", JSON.stringify(data.user));
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

  /*
  ----------------------------------------------------------
  STORE TOKEN
  ----------------------------------------------------------
  */

  if (data?.token) {
    localStorage.setItem("colossus_token", data.token);
  }

  /*
  ----------------------------------------------------------
  STORE USER
  ----------------------------------------------------------
  */

  if (data?.user) {
    localStorage.setItem("colossus_user", JSON.stringify(data.user));
  }

  return data;
};

/*
============================================================
LOGOUT
============================================================
*/

const logout = () => {
  localStorage.removeItem("colossus_token");

  localStorage.removeItem("colossus_user");
};

/*
============================================================
GET CURRENT USER
============================================================
*/

const getCurrentUser = () => {
  const user = localStorage.getItem("colossus_user");

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
GET CURRENT USER ROLE
============================================================
*/

const getCurrentUserRole = () => {
  const user = getCurrentUser();

  return String(user?.role || "")
    .trim()
    .toUpperCase();
};

/*
============================================================
CHECK AUTHENTICATION
============================================================
*/

const isAuthenticated = () => {
  return Boolean(localStorage.getItem("colossus_token"));
};

/*
============================================================
EXPORT
============================================================
*/

export default {
  login,

  register,

  logout,

  getCurrentUser,

  getCurrentUserRole,

  isAuthenticated,
};
