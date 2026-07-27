import applicationService from "./application.service.js";

export const createApplication = async (req, res, next) => {
  try {
    const application = await applicationService.createApplication({
      user: req.user.id,

      ...req.body,
    });

    res.status(201).json({
      success: true,

      data: application,
    });
  } catch (error) {
    next(error);
  }
};

export const getApplications = async (req, res, next) => {
  try {
    const applications = await applicationService.getUserApplications(
      req.user.id,
    );

    res.json({
      success: true,

      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

export const getApplication = async (req, res, next) => {
  try {
    const application = await applicationService.getApplicationById(
      req.params.id,

      req.user.id,
    );

    if (!application) {
      return res.status(404).json({
        success: false,

        message: "Application not found",
      });
    }

    res.json({
      success: true,

      data: application,
    });
  } catch (error) {
    next(error);
  }
};
