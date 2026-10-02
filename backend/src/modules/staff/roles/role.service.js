import Role from "./role.model.js";

import { ALL_PERMISSIONS } from "../permissions/permission.constants.js";

const normalizeString = (value) => {
  if (value === undefined || value === null) {
    return "";
  }

  return String(value).trim();
};

const normalizeKey = (value) => {
  return normalizeString(value)
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
};

const normalizePermissions = (permissions = []) => {
  if (!Array.isArray(permissions)) {
    return [];
  }

  return [
    ...new Set(
      permissions
        .map((permission) => normalizeString(permission))
        .filter(Boolean),
    ),
  ];
};

const validatePermissions = (permissions = []) => {
  const normalized = normalizePermissions(permissions);

  const invalid = normalized.filter(
    (permission) => !ALL_PERMISSIONS.includes(permission),
  );

  if (invalid.length > 0) {
    const error = new Error(`Invalid permissions: ${invalid.join(", ")}`);

    error.statusCode = 400;

    throw error;
  }

  return normalized;
};

/*
|--------------------------------------------------------------------------
| SERIALIZE ROLE
|--------------------------------------------------------------------------
*/

const serializeRole = (role) => {
  if (!role) {
    return null;
  }

  return {
    id: role._id,
    name: role.name,
    key: role.key,
    description: role.description || "",
    permissions: role.permissions || [],
    isSystem: Boolean(role.isSystem),
    isActive: Boolean(role.isActive),
    createdAt: role.createdAt,
    updatedAt: role.updatedAt,
  };
};

/*
|--------------------------------------------------------------------------
| GET ALL ROLES
|--------------------------------------------------------------------------
*/

const getRoles = async ({ search = "", status = "" } = {}) => {
  const filter = {};

  const normalizedSearch = normalizeString(search);

  if (normalizedSearch) {
    filter.$or = [
      {
        name: {
          $regex: normalizedSearch,
          $options: "i",
        },
      },
      {
        key: {
          $regex: normalizedSearch,
          $options: "i",
        },
      },
      {
        description: {
          $regex: normalizedSearch,
          $options: "i",
        },
      },
    ];
  }

  if (status === "ACTIVE") {
    filter.isActive = true;
  }

  if (status === "INACTIVE") {
    filter.isActive = false;
  }

  const roles = await Role.find(filter)
    .sort({
      isSystem: -1,
      name: 1,
    })
    .lean();

  return roles.map(serializeRole);
};

/*
|--------------------------------------------------------------------------
| GET ROLE BY ID
|--------------------------------------------------------------------------
*/

const getRoleById = async (roleId) => {
  const role = await Role.findById(roleId).lean();

  if (!role) {
    const error = new Error("Staff role not found.");

    error.statusCode = 404;

    throw error;
  }

  return serializeRole(role);
};

/*
|--------------------------------------------------------------------------
| CREATE ROLE
|--------------------------------------------------------------------------
*/

const createRole = async (data = {}) => {
  const name = normalizeString(data.name);
  const key = normalizeKey(data.key || data.name);
  const description = normalizeString(data.description);

  if (!name) {
    const error = new Error("Role name is required.");

    error.statusCode = 400;

    throw error;
  }

  if (!key) {
    const error = new Error("Role key is required.");

    error.statusCode = 400;

    throw error;
  }

  const permissions = validatePermissions(data.permissions);

  const existingName = await Role.findOne({
    name,
  });

  if (existingName) {
    const error = new Error("A role with this name already exists.");

    error.statusCode = 409;

    throw error;
  }

  const existingKey = await Role.findOne({
    key,
  });

  if (existingKey) {
    const error = new Error("A role with this key already exists.");

    error.statusCode = 409;

    throw error;
  }

  const role = await Role.create({
    name,
    key,
    description,
    permissions,
    isSystem: false,
    isActive: true,
  });

  return getRoleById(role._id);
};

/*
|--------------------------------------------------------------------------
| UPDATE ROLE
|--------------------------------------------------------------------------
*/

const updateRole = async (roleId, data = {}) => {
  const role = await Role.findById(roleId);

  if (!role) {
    const error = new Error("Staff role not found.");

    error.statusCode = 404;

    throw error;
  }

  /*
  System roles can have their permissions and description
  adjusted, but their identity should remain stable.
  */

  if (data.name !== undefined) {
    const name = normalizeString(data.name);

    if (!name) {
      const error = new Error("Role name cannot be empty.");

      error.statusCode = 400;

      throw error;
    }

    const existingName = await Role.findOne({
      name,
      _id: {
        $ne: role._id,
      },
    });

    if (existingName) {
      const error = new Error("A role with this name already exists.");

      error.statusCode = 409;

      throw error;
    }

    role.name = name;
  }

  if (data.key !== undefined) {
    if (role.isSystem) {
      const error = new Error("System role keys cannot be changed.");

      error.statusCode = 400;

      throw error;
    }

    const key = normalizeKey(data.key);

    if (!key) {
      const error = new Error("Role key cannot be empty.");

      error.statusCode = 400;

      throw error;
    }

    const existingKey = await Role.findOne({
      key,
      _id: {
        $ne: role._id,
      },
    });

    if (existingKey) {
      const error = new Error("A role with this key already exists.");

      error.statusCode = 409;

      throw error;
    }

    role.key = key;
  }

  if (data.description !== undefined) {
    role.description = normalizeString(data.description);
  }

  if (data.permissions !== undefined) {
    role.permissions = validatePermissions(data.permissions);
  }

  if (data.isActive !== undefined) {
    role.isActive = Boolean(data.isActive);
  }

  await role.save();

  return getRoleById(role._id);
};

/*
|--------------------------------------------------------------------------
| DELETE ROLE
|--------------------------------------------------------------------------
*/

const deleteRole = async (roleId) => {
  const role = await Role.findById(roleId);

  if (!role) {
    const error = new Error("Staff role not found.");

    error.statusCode = 404;

    throw error;
  }

  if (role.isSystem) {
    const error = new Error("System roles cannot be deleted.");

    error.statusCode = 400;

    throw error;
  }

  /*
  We will add Staff-role usage protection when the
  Staff management system is fully wired.

  For now, deleting a custom role is permitted.
  */

  await Role.deleteOne({
    _id: role._id,
  });

  return {
    id: role._id,
    deleted: true,
  };
};

/*
|--------------------------------------------------------------------------
| EXPORT
|--------------------------------------------------------------------------
*/

export default {
  getRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
};
