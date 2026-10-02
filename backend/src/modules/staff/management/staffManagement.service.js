import bcrypt from "bcryptjs";

import User from "../../users/user.model.js";
import Role from "../roles/role.model.js";
import Department from "../departments/department.model.js";
import { ALL_PERMISSIONS } from "../permissions/permission.constants.js";

const STAFF_ACCOUNT_ROLE = "STAFF";

const normalizeString = (value) => {
  if (value === undefined || value === null) {
    return "";
  }

  return String(value).trim();
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

  if (invalid.length) {
    const error = new Error(`Invalid permissions: ${invalid.join(", ")}`);

    error.statusCode = 400;

    throw error;
  }

  return normalized;
};

const getEffectivePermissions = (staff) => {
  if (!staff) {
    return [];
  }

  const rolePermissions =
    staff.staffRole?.isActive === false
      ? []
      : normalizePermissions(staff.staffRole?.permissions || []);

  const directGrants = normalizePermissions(staff.permissionGrants || []);

  const directDenials = new Set(
    normalizePermissions(staff.permissionDenials || []),
  );

  return normalizePermissions([...rolePermissions, ...directGrants]).filter(
    (permission) => !directDenials.has(permission),
  );
};

const validateStaffRole = async (roleId) => {
  if (!roleId) {
    return null;
  }

  const role = await Role.findOne({
    _id: roleId,
    isActive: true,
  }).lean();

  if (!role) {
    const error = new Error("Staff role not found or inactive.");

    error.statusCode = 400;

    throw error;
  }

  return role;
};

const validateDepartment = async (departmentId) => {
  if (!departmentId) {
    return null;
  }

  const department = await Department.findOne({
    _id: departmentId,
    isActive: true,
  }).lean();

  if (!department) {
    const error = new Error("Department not found or inactive.");

    error.statusCode = 400;

    throw error;
  }

  return department;
};

const serializeStaff = (staff) => {
  if (!staff) {
    return null;
  }

  const effectivePermissions = getEffectivePermissions(staff);

  return {
    id: staff._id,

    name: staff.name,

    email: staff.email,

    role: staff.role,

    isActive: staff.isActive,

    staffRole: staff.staffRole
      ? {
          id: staff.staffRole._id,
          name: staff.staffRole.name,
          key: staff.staffRole.key,
          description: staff.staffRole.description,
          isActive: staff.staffRole.isActive,
          permissions: normalizePermissions(staff.staffRole.permissions || []),
        }
      : null,

    department: staff.department
      ? {
          id: staff.department._id,
          name: staff.department.name,
          key: staff.department.key,
          description: staff.department.description,
          isActive: staff.department.isActive,
        }
      : null,

    position: staff.position || "",

    permissionGrants: normalizePermissions(staff.permissionGrants || []),

    permissionDenials: normalizePermissions(staff.permissionDenials || []),

    effectivePermissions,

    effectivePermissionCount: effectivePermissions.length,

    createdAt: staff.createdAt,

    updatedAt: staff.updatedAt,
  };
};

/*
============================================================
GET STAFF LIST
============================================================
*/

const getStaffList = async ({
  page = 1,
  limit = 20,
  search = "",
  department = "",
  staffRole = "",
  status = "",
} = {}) => {
  const normalizedPage = Math.max(Number(page) || 1, 1);

  const normalizedLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);

  const filter = {
    role: STAFF_ACCOUNT_ROLE,
  };

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
        email: {
          $regex: normalizedSearch,
          $options: "i",
        },
      },
      {
        position: {
          $regex: normalizedSearch,
          $options: "i",
        },
      },
    ];
  }

  if (department) {
    filter.department = department;
  }

  if (staffRole) {
    filter.staffRole = staffRole;
  }

  if (status === "ACTIVE") {
    filter.isActive = true;
  }

  if (status === "INACTIVE") {
    filter.isActive = false;
  }

  const skip = (normalizedPage - 1) * normalizedLimit;

  const [staff, total] = await Promise.all([
    User.find(filter)
      .select("-password")
      .populate({
        path: "staffRole",
        select: "name key description permissions isActive",
      })
      .populate({
        path: "department",
        select: "name key description isActive",
      })
      .sort({
        name: 1,
      })
      .skip(skip)
      .limit(normalizedLimit)
      .lean(),

    User.countDocuments(filter),
  ]);

  return {
    staff: staff.map(serializeStaff),

    pagination: {
      page: normalizedPage,
      limit: normalizedLimit,
      total,
      pages: Math.ceil(total / normalizedLimit),
    },
  };
};

/*
============================================================
GET STAFF BY ID
============================================================
*/

const getStaffById = async (staffId) => {
  const staff = await User.findOne({
    _id: staffId,
    role: STAFF_ACCOUNT_ROLE,
  })
    .select("-password")
    .populate({
      path: "staffRole",
      select: "name key description permissions isActive isSystem",
    })
    .populate({
      path: "department",
      select: "name key description isActive",
    })
    .lean();

  if (!staff) {
    const error = new Error("Staff member not found.");

    error.statusCode = 404;

    throw error;
  }

  return serializeStaff(staff);
};

/*
============================================================
CREATE STAFF
============================================================
*/

const createStaff = async (data = {}) => {
  const name = normalizeString(data.name);

  const email = normalizeString(data.email).toLowerCase();

  const password = normalizeString(data.password);

  const position = normalizeString(data.position);

  if (!name) {
    const error = new Error("Staff name is required.");

    error.statusCode = 400;

    throw error;
  }

  if (!email) {
    const error = new Error("Staff email is required.");

    error.statusCode = 400;

    throw error;
  }

  if (!password || password.length < 8) {
    const error = new Error("Staff password must be at least 8 characters.");

    error.statusCode = 400;

    throw error;
  }

  const existingUser = await User.findOne({
    email,
  });

  if (existingUser) {
    const error = new Error("A user with this email already exists.");

    error.statusCode = 409;

    throw error;
  }

  const staffRole = await validateStaffRole(data.staffRole);

  const department = await validateDepartment(data.department);

  const permissionGrants = validatePermissions(data.permissionGrants);

  const permissionDenials = validatePermissions(data.permissionDenials);

  const passwordHash = await bcrypt.hash(password, 12);

  const staff = await User.create({
    name,

    email,

    password: passwordHash,

    role: STAFF_ACCOUNT_ROLE,

    isActive: data.isActive === undefined ? true : Boolean(data.isActive),

    staffRole: staffRole?._id || null,

    department: department?._id || null,

    position,

    permissionGrants,

    permissionDenials,
  });

  return getStaffById(staff._id);
};

/*
============================================================
UPDATE STAFF
============================================================
*/

const updateStaff = async (staffId, data = {}) => {
  const staff = await User.findOne({
    _id: staffId,
    role: STAFF_ACCOUNT_ROLE,
  });

  if (!staff) {
    const error = new Error("Staff member not found.");

    error.statusCode = 404;

    throw error;
  }

  if (data.name !== undefined) {
    const name = normalizeString(data.name);

    if (!name) {
      const error = new Error("Staff name cannot be empty.");

      error.statusCode = 400;

      throw error;
    }

    staff.name = name;
  }

  if (data.email !== undefined) {
    const email = normalizeString(data.email).toLowerCase();

    if (!email) {
      const error = new Error("Staff email cannot be empty.");

      error.statusCode = 400;

      throw error;
    }

    const emailOwner = await User.findOne({
      email,
      _id: {
        $ne: staff._id,
      },
    });

    if (emailOwner) {
      const error = new Error("Another user already uses this email.");

      error.statusCode = 409;

      throw error;
    }

    staff.email = email;
  }

  if (data.position !== undefined) {
    staff.position = normalizeString(data.position);
  }

  if (data.staffRole !== undefined) {
    const role = await validateStaffRole(data.staffRole);

    staff.staffRole = role?._id || null;
  }

  if (data.department !== undefined) {
    const department = await validateDepartment(data.department);

    staff.department = department?._id || null;
  }

  if (data.password !== undefined) {
    const password = normalizeString(data.password);

    if (password.length < 8) {
      const error = new Error("Staff password must be at least 8 characters.");

      error.statusCode = 400;

      throw error;
    }

    staff.password = await bcrypt.hash(password, 12);
  }

  await staff.save();

  return getStaffById(staff._id);
};

/*
============================================================
UPDATE STAFF ACCESS
============================================================
*/

const updateStaffAccess = async (staffId, data = {}) => {
  const staff = await User.findOne({
    _id: staffId,
    role: STAFF_ACCOUNT_ROLE,
  });

  if (!staff) {
    const error = new Error("Staff member not found.");

    error.statusCode = 404;

    throw error;
  }

  if (data.permissionGrants !== undefined) {
    staff.permissionGrants = validatePermissions(data.permissionGrants);
  }

  if (data.permissionDenials !== undefined) {
    staff.permissionDenials = validatePermissions(data.permissionDenials);
  }

  /*
  A permission should not be simultaneously
  granted and denied.

  Explicit denial wins during effective
  permission calculation, but keeping the
  arrays mutually exclusive makes the
  admin interface easier to understand.
  */

  const grants = new Set(staff.permissionGrants || []);

  staff.permissionDenials = (staff.permissionDenials || []).filter(
    (permission) => !grants.has(permission),
  );

  await staff.save();

  return getStaffById(staff._id);
};

/*
============================================================
UPDATE STAFF STATUS
============================================================
*/

const updateStaffStatus = async (staffId, isActive) => {
  const staff = await User.findOne({
    _id: staffId,
    role: STAFF_ACCOUNT_ROLE,
  });

  if (!staff) {
    const error = new Error("Staff member not found.");

    error.statusCode = 404;

    throw error;
  }

  staff.isActive = Boolean(isActive);

  await staff.save();

  return getStaffById(staff._id);
};

/*
============================================================
EXPORT
============================================================
*/

export default {
  getStaffList,
  getStaffById,
  createStaff,
  updateStaff,
  updateStaffAccess,
  updateStaffStatus,
};
