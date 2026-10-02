import roleService from "./role.service.js";

/*
|--------------------------------------------------------------------------
| GET ROLES
|--------------------------------------------------------------------------
*/

export const getRoles = async (req, res, next) => {
  try {
    const roles = await roleService.getRoles({
      search: req.query.search,
      status: req.query.status,
    });

    return res.status(200).json({
      success: true,
      data: roles,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| GET ROLE BY ID
|--------------------------------------------------------------------------
*/

export const getRoleById = async (req, res, next) => {
  try {
    const role = await roleService.getRoleById(req.params.id);

    return res.status(200).json({
      success: true,
      data: role,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| CREATE ROLE
|--------------------------------------------------------------------------
*/

export const createRole = async (req, res, next) => {
  try {
    const role = await roleService.createRole(req.body);

    return res.status(201).json({
      success: true,
      message: "Staff role created successfully.",
      data: role,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| UPDATE ROLE
|--------------------------------------------------------------------------
*/

export const updateRole = async (req, res, next) => {
  try {
    const role = await roleService.updateRole(req.params.id, req.body);

    return res.status(200).json({
      success: true,
      message: "Staff role updated successfully.",
      data: role,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| DELETE ROLE
|--------------------------------------------------------------------------
*/

export const deleteRole = async (req, res, next) => {
  try {
    const result = await roleService.deleteRole(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Staff role deleted successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
