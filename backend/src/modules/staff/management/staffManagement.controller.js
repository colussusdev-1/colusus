import staffManagementService from "./staffManagement.service.js";
import accessService from "../access/access.service.js";

/*
============================================================
GET STAFF LIST
============================================================
*/

export const getStaffList = async (req, res, next) => {
  try {
    const result = await staffManagementService.getStaffList({
      page: req.query.page,
      limit: req.query.limit,
      search: req.query.search,
      department: req.query.department,
      staffRole: req.query.staffRole,
      status: req.query.status,
    });

    return res.status(200).json({
      success: true,
      data: result.staff,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

/*
============================================================
GET STAFF BY ID
============================================================
*/

export const getStaffById = async (req, res, next) => {
  try {
    const staff = await staffManagementService.getStaffById(req.params.id);

    return res.status(200).json({
      success: true,
      data: staff,
    });
  } catch (error) {
    next(error);
  }
};

/*
============================================================
GET STAFF EFFECTIVE ACCESS
============================================================
*/

export const getStaffAccess = async (req, res, next) => {
  try {
    const access = await accessService.getEffectivePermissions(req.params.id);

    return res.status(200).json({
      success: true,
      data: access,
    });
  } catch (error) {
    next(error);
  }
};

/*
============================================================
CREATE STAFF
============================================================
*/

export const createStaff = async (req, res, next) => {
  try {
    const staff = await staffManagementService.createStaff(req.body);

    return res.status(201).json({
      success: true,
      message: "Staff member created successfully.",
      data: staff,
    });
  } catch (error) {
    next(error);
  }
};

/*
============================================================
UPDATE STAFF
============================================================
*/

export const updateStaff = async (req, res, next) => {
  try {
    const staff = await staffManagementService.updateStaff(
      req.params.id,
      req.body,
    );

    return res.status(200).json({
      success: true,
      message: "Staff member updated successfully.",
      data: staff,
    });
  } catch (error) {
    next(error);
  }
};

/*
============================================================
UPDATE STAFF ACCESS
============================================================
*/

export const updateStaffAccess = async (req, res, next) => {
  try {
    const staff = await staffManagementService.updateStaffAccess(
      req.params.id,
      req.body,
    );

    return res.status(200).json({
      success: true,
      message: "Staff access updated successfully.",
      data: staff,
    });
  } catch (error) {
    next(error);
  }
};

/*
============================================================
UPDATE STAFF STATUS
============================================================
*/

export const updateStaffStatus = async (req, res, next) => {
  try {
    if (typeof req.body.isActive !== "boolean") {
      const error = new Error("isActive must be a boolean.");

      error.statusCode = 400;

      throw error;
    }

    const staff = await staffManagementService.updateStaffStatus(
      req.params.id,
      req.body.isActive,
    );

    return res.status(200).json({
      success: true,
      message: req.body.isActive
        ? "Staff member activated successfully."
        : "Staff member deactivated successfully.",
      data: staff,
    });
  } catch (error) {
    next(error);
  }
};
