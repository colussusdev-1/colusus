import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

/*
|--------------------------------------------------------------------------
| Get All Consultations
|--------------------------------------------------------------------------
*/

const getAllConsultations = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(`${API_URL}/admin/consultations`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Get Consultation By ID
|--------------------------------------------------------------------------
*/

const getConsultationById = async (consultationId) => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${API_URL}/admin/consultations/${consultationId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};

export default {
  getAllConsultations,
  getConsultationById,
};
