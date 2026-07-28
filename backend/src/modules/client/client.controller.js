import clientService from "./client.service.js";

/*
|--------------------------------------------------------------------------
| Get Client Profile
|--------------------------------------------------------------------------
*/

export const getClientProfile = async (req, res, next) => {
  try {
    const profile = await clientService.getClientProfile(req.user.id);

    if (!profile) {
      return res.status(404).json({
        success: false,

        message: "Client profile not found",
      });
    }

    res.status(200).json({
      success: true,

      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Get Client Applications
|--------------------------------------------------------------------------
*/

export const getClientApplications = async (req, res, next) => {
  try {
    const applications = await clientService.getClientApplications(req.user.id);

    res.status(200).json({
      success: true,

      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Get Client Documents
|--------------------------------------------------------------------------
*/

export const getClientDocuments = async (req, res, next) => {
  try {
    const documents = await clientService.getClientDocuments(req.user.id);

    res.status(200).json({
      success: true,

      data: documents,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Get Client Progress
|--------------------------------------------------------------------------
*/

export const getClientProgress = async (req, res, next) => {
  try {
    const progress = await clientService.getClientProgress(req.user.id);

    res.status(200).json({
      success: true,

      data: progress,
    });
  } catch (error) {
    next(error);
  }
};
