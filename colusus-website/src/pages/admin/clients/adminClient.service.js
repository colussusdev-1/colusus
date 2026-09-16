import api from "../../../services/api";

/*
============================================================
ADMIN CLIENT SERVICE
============================================================
|
| Handles all API communication for the admin Clients module.
|
============================================================
*/

/*
============================================================
GET ALL CLIENTS
============================================================
|
| GET /api/v1/admin/clients
|
| Optional:
|
| ?search=...
|
============================================================
*/

const getAllClients = async (search = "") => {
  const params = {};

  if (search && search.trim()) {
    params.search = search.trim();
  }

  const { data } = await api.get("/admin/clients", {
    params,
  });

  return data.data;
};

/*
============================================================
GET CLIENT DETAILS
============================================================
|
| GET /api/v1/admin/clients/:id
|
============================================================
*/

const getClientDetails = async (clientId) => {
  if (!clientId) {
    throw new Error("Client ID is required.");
  }

  const { data } = await api.get(`/admin/clients/${clientId}`);

  return data.data;
};

/*
============================================================
EXPORT
============================================================
*/

export default {
  getAllClients,
  getClientDetails,
};
