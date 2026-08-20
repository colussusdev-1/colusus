import applicationService from "./application.service.js";

/*
============================================================
CREATE APPLICATION
============================================================
*/

export const createApplication = async (req, res, next) => {
  try {
    const application = await applicationService.createApplication({
      user: req.user.id,

      opportunity: req.body.opportunity,

      destinationCountry: req.body.destinationCountry,

      priority: req.body.priority,

      notes: req.body.notes,
    });

    return res.status(201).json({
      success: true,

      message: "Application draft created successfully",

      data: application,
    });
  } catch (error) {
    next(error);
  }
};

/*
============================================================
GET USER APPLICATIONS
============================================================
*/

export const getApplications = async (req, res, next) => {
  try {
    const applications = await applicationService.getUserApplications(
      req.user.id,
    );

    return res.status(200).json({
      success: true,

      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

/*
============================================================
GET SINGLE APPLICATION
============================================================
*/

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

    return res.status(200).json({
      success: true,

      data: application,
    });
  } catch (error) {
    next(error);
  }
};
