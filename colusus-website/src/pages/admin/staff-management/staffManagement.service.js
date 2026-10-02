import api from "../../../services/api";

/*
============================================================
colossus — ADMIN STAFF MANAGEMENT SERVICE
============================================================

Frontend API service for Admin Staff Management.

Backend routes:

GET    /api/v1/admin/staff/manage
POST   /api/v1/admin/staff/manage
GET    /api/v1/admin/staff/manage/:id
GET    /api/v1/admin/staff/manage/:id/access
PATCH  /api/v1/admin/staff/manage/:id
PATCH  /api/v1/admin/staff/manage/:id/access
PATCH  /api/v1/admin/staff/manage/:id/status

Supporting resources:

GET /api/v1/admin/staff/roles
GET /api/v1/admin/staff/departments

Authentication is handled centrally by services/api.js.

============================================================
*/

/*
============================================================
GET STAFF LIST
============================================================
*/

const getStaffList = async (params = {}) => {
  const { data } = await api.get("/admin/staff/manage", {
    params,
  });

  return data;
};

/*
============================================================
GET STAFF DETAILS
============================================================
*/

const getStaffById = async (staffId) => {
  if (!staffId) {
    throw new Error("Staff ID is required.");
  }

  const { data } = await api.get(`/admin/staff/manage/${staffId}`);

  return data;
};

/*
============================================================
GET STAFF ACCESS
============================================================
*/

const getStaffAccess = async (staffId) => {
  if (!staffId) {
    throw new Error("Staff ID is required.");
  }

  const { data } = await api.get(`/admin/staff/manage/${staffId}/access`);

  return data;
};

/*
============================================================
CREATE STAFF
============================================================
*/

const createStaff = async (staffData) => {
  if (!staffData) {
    throw new Error("Staff data is required.");
  }

  const { data } = await api.post("/admin/staff/manage", staffData);

  return data;
};

/*
============================================================
UPDATE STAFF
============================================================
*/

const updateStaff = async (staffId, staffData) => {
  if (!staffId) {
    throw new Error("Staff ID is required.");
  }

  if (!staffData) {
    throw new Error("Staff data is required.");
  }

  const { data } = await api.patch(`/admin/staff/manage/${staffId}`, staffData);

  return data;
};

/*
============================================================
UPDATE STAFF ACCESS
============================================================
*/

const updateStaffAccess = async (staffId, accessData) => {
  if (!staffId) {
    throw new Error("Staff ID is required.");
  }

  if (!accessData) {
    throw new Error("Access data is required.");
  }

  const { data } = await api.patch(
    `/admin/staff/manage/${staffId}/access`,
    accessData,
  );

  return data;
};

/*
============================================================
UPDATE STAFF STATUS
============================================================
*/

const updateStaffStatus = async (staffId, isActive) => {
  if (!staffId) {
    throw new Error("Staff ID is required.");
  }

  const { data } = await api.patch(`/admin/staff/manage/${staffId}/status`, {
    isActive,
  });

  return data;
};

/*
============================================================
GET STAFF ROLES
============================================================
*/

const getRoles = async () => {
  const { data } = await api.get("/admin/staff/roles");

  return data;
};

/*
============================================================
GET STAFF DEPARTMENTS
============================================================
*/

const getDepartments = async () => {
  const { data } = await api.get("/admin/staff/departments");

  return data;
};

/*
============================================================
EXPORT
============================================================
*/

export default {
  getStaffList,

  getStaffById,

  getStaffAccess,

  createStaff,

  updateStaff,

  updateStaffAccess,

  updateStaffStatus,

  getRoles,

  getDepartments,
};
