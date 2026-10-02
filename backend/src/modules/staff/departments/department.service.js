import Department from "./department.model.js";

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

const serializeDepartment = (department) => {
  if (!department) {
    return null;
  }

  return {
    id: department._id,
    name: department.name,
    key: department.key,
    description: department.description || "",
    isActive: Boolean(department.isActive),
    createdAt: department.createdAt,
    updatedAt: department.updatedAt,
  };
};

const getDepartments = async ({ search = "", status = "" } = {}) => {
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

  const departments = await Department.find(filter)
    .sort({
      name: 1,
    })
    .lean();

  return departments.map(serializeDepartment);
};

const getDepartmentById = async (departmentId) => {
  const department = await Department.findById(departmentId).lean();

  if (!department) {
    const error = new Error("Department not found.");

    error.statusCode = 404;

    throw error;
  }

  return serializeDepartment(department);
};

const createDepartment = async (data = {}) => {
  const name = normalizeString(data.name);
  const key = normalizeKey(data.key || data.name);
  const description = normalizeString(data.description);

  if (!name) {
    const error = new Error("Department name is required.");

    error.statusCode = 400;

    throw error;
  }

  if (!key) {
    const error = new Error("Department key is required.");

    error.statusCode = 400;

    throw error;
  }

  const existingName = await Department.findOne({
    name,
  });

  if (existingName) {
    const error = new Error("A department with this name already exists.");

    error.statusCode = 409;

    throw error;
  }

  const existingKey = await Department.findOne({
    key,
  });

  if (existingKey) {
    const error = new Error("A department with this key already exists.");

    error.statusCode = 409;

    throw error;
  }

  const department = await Department.create({
    name,
    key,
    description,
    isActive: data.isActive === undefined ? true : Boolean(data.isActive),
  });

  return getDepartmentById(department._id);
};

const updateDepartment = async (departmentId, data = {}) => {
  const department = await Department.findById(departmentId);

  if (!department) {
    const error = new Error("Department not found.");

    error.statusCode = 404;

    throw error;
  }

  if (data.name !== undefined) {
    const name = normalizeString(data.name);

    if (!name) {
      const error = new Error("Department name cannot be empty.");

      error.statusCode = 400;

      throw error;
    }

    const existingName = await Department.findOne({
      name,
      _id: {
        $ne: department._id,
      },
    });

    if (existingName) {
      const error = new Error("A department with this name already exists.");

      error.statusCode = 409;

      throw error;
    }

    department.name = name;
  }

  if (data.key !== undefined) {
    const key = normalizeKey(data.key);

    if (!key) {
      const error = new Error("Department key cannot be empty.");

      error.statusCode = 400;

      throw error;
    }

    const existingKey = await Department.findOne({
      key,
      _id: {
        $ne: department._id,
      },
    });

    if (existingKey) {
      const error = new Error("A department with this key already exists.");

      error.statusCode = 409;

      throw error;
    }

    department.key = key;
  }

  if (data.description !== undefined) {
    department.description = normalizeString(data.description);
  }

  if (data.isActive !== undefined) {
    department.isActive = Boolean(data.isActive);
  }

  await department.save();

  return getDepartmentById(department._id);
};

const deleteDepartment = async (departmentId) => {
  const department = await Department.findById(departmentId);

  if (!department) {
    const error = new Error("Department not found.");

    error.statusCode = 404;

    throw error;
  }

  await Department.deleteOne({
    _id: department._id,
  });

  return {
    id: department._id,
    deleted: true,
  };
};

export default {
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};
