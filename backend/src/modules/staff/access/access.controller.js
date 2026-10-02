import accessService from "./access.service.js";

/*
|--------------------------------------------------------------------------
| GET MY ACCESS
|--------------------------------------------------------------------------
|
| GET /api/v1/staff/access
|
|--------------------------------------------------------------------------
*/

export const getMyAccess = async (req, res, next) => {
  try {
    const access = await accessService.getEffectivePermissions(req.user.id);

    return res.status(200).json({
      success: true,
      data: access,
    });
  } catch (error) {
    next(error);
  }
};
