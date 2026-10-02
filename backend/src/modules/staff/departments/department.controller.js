import departmentService from "./department.service.js";

export const getDepartments = async (req, res, next) => {
  try {
    const departments = await departmentService.getDepartments({
      search: req.query.search,
      status: req.query.status,
    });

    return res.status(200).json({
      success: true,
      data: departments,
    });
  } catch (error) {
    next(error);
  }
};

export const getDepartmentById = async (req, res, next) => {
  try {
    const department = await departmentService.getDepartmentById(req.params.id);

    return res.status(200).json({
      success: true,
      data: department,
    });
  } catch (error) {
    next(error);
  }
};

export const createDepartment = async (req, res, next) => {
  try {
    const department = await departmentService.createDepartment(req.body);

    return res.status(201).json({
      success: true,
      message: "Department created successfully.",
      data: department,
    });
  } catch (error) {
    next(error);
  }
};

export const updateDepartment = async (req, res, next) => {
  try {
    const department = await departmentService.updateDepartment(
      req.params.id,
      req.body,
    );

    return res.status(200).json({
      success: true,
      message: "Department updated successfully.",
      data: department,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteDepartment = async (req, res, next) => {
  try {
    const result = await departmentService.deleteDepartment(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Department deleted successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
