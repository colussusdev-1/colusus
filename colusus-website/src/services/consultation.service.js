import axios from "axios";

/*
|--------------------------------------------------------------------------
| API Configuration
|--------------------------------------------------------------------------
*/

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

/*
|--------------------------------------------------------------------------
| Authentication Token
|--------------------------------------------------------------------------
*/

const getToken = () => {
  return localStorage.getItem("colusus_token");
};

/*
|--------------------------------------------------------------------------
| Authentication Headers
|--------------------------------------------------------------------------
*/

const getAuthHeaders = () => {
  const token = getToken();

  return {
    Authorization: `Bearer ${token}`,
  };
};

/*
|--------------------------------------------------------------------------
| Get All Consultations
|--------------------------------------------------------------------------
*/

const getAllConsultations = async () => {
  const response = await axios.get(`${API_URL}/admin/consultations`, {
    headers: getAuthHeaders(),
  });

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Get Consultation By ID
|--------------------------------------------------------------------------
*/

const getConsultationById = async (consultationId) => {
  const response = await axios.get(
    `${API_URL}/admin/consultations/${consultationId}`,
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

export default {
  getAllConsultations,

  getConsultationById,
};
