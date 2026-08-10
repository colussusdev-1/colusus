import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,

  withCredentials: true,
});

/*
============================================================
ATTACH AUTH TOKEN
============================================================
*/

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("colusus_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  },
);

export default api;
