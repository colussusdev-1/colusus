import api from "./api";

/*
|--------------------------------------------------------------------------
| COLOSSUS — AUTH SERVICE
|--------------------------------------------------------------------------
|
| Shared authentication service for:
|
| - Client
| - Admin
| - Staff
|
| Authentication state is stored in localStorage.
|
| Token:
|   colossus_token
|
| User:
|   colossus_user
|
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| STORAGE KEYS
|--------------------------------------------------------------------------
*/

const TOKEN_KEY = "colossus_token";
const USER_KEY = "colossus_user";

/*
|--------------------------------------------------------------------------
| LOGIN
|--------------------------------------------------------------------------
*/

const login = async (email, password) => {
  const { data } = await api.post("/auth/login", {
    email: String(email || "").trim(),

    password,
  });

  /*
    |--------------------------------------------------------------------------
    | STORE TOKEN
    |--------------------------------------------------------------------------
    */

  if (data?.token) {
    localStorage.setItem(TOKEN_KEY, data.token);
  }

  /*
    |--------------------------------------------------------------------------
    | STORE USER
    |--------------------------------------------------------------------------
    */

  if (data?.user) {
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  }

  return data;
};

/*
|--------------------------------------------------------------------------
| REGISTER
|--------------------------------------------------------------------------
*/

const register = async (registrationData) => {
  const { data } = await api.post("/auth/register", registrationData);

  /*
    |--------------------------------------------------------------------------
    | STORE TOKEN
    |--------------------------------------------------------------------------
    */

  if (data?.token) {
    localStorage.setItem(TOKEN_KEY, data.token);
  }

  /*
    |--------------------------------------------------------------------------
    | STORE USER
    |--------------------------------------------------------------------------
    */

  if (data?.user) {
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  }

  return data;
};

/*
|--------------------------------------------------------------------------
| LOGOUT
|--------------------------------------------------------------------------
*/

const logout = () => {
  localStorage.removeItem(TOKEN_KEY);

  localStorage.removeItem(USER_KEY);
};

/*
|--------------------------------------------------------------------------
| GET TOKEN
|--------------------------------------------------------------------------
*/

const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/*
|--------------------------------------------------------------------------
| GET CURRENT USER
|--------------------------------------------------------------------------
*/

const getCurrentUser = () => {
  const storedUser = localStorage.getItem(USER_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch {
    /*
        |--------------------------------------------------------------------------
        | Invalid stored user
        |--------------------------------------------------------------------------
        */

    localStorage.removeItem(USER_KEY);

    return null;
  }
};

/*
|--------------------------------------------------------------------------
| GET CURRENT USER ROLE
|--------------------------------------------------------------------------
*/

const getCurrentUserRole = () => {
  const user = getCurrentUser();

  return String(user?.role || "")
    .trim()
    .toUpperCase();
};

/*
|--------------------------------------------------------------------------
| CHECK AUTHENTICATION
|--------------------------------------------------------------------------
*/

const isAuthenticated = () => {
  return Boolean(getToken());
};

/*
|--------------------------------------------------------------------------
| CLEAR AUTH
|--------------------------------------------------------------------------
|
| Useful when authentication becomes invalid.
|
|--------------------------------------------------------------------------
*/

const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);

  localStorage.removeItem(USER_KEY);
};

/*
|--------------------------------------------------------------------------
| EXPORT
|--------------------------------------------------------------------------
*/

const authService = {
  login,

  register,

  logout,

  getToken,

  getCurrentUser,

  getCurrentUserRole,

  isAuthenticated,

  clearAuth,
};

export default authService;
