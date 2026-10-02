import accessService from "./access.service.js";

/*
|--------------------------------------------------------------------------
| REQUIRE PERMISSION
|--------------------------------------------------------------------------
|
| Example:
|
| router.get(
|   "/applications",
|   authenticate,
|   requirePermission("applications.view"),
|   controller,
| );
|
|--------------------------------------------------------------------------
*/

export const requirePermission = (permission) => {
  return async (req, res, next) => {
    try {
      /*
      |--------------------------------------------------------------------------
      | AUTHENTICATION
      |--------------------------------------------------------------------------
      */

      if (!req.user?.id) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      /*
      |--------------------------------------------------------------------------
      | PERMISSION
      |--------------------------------------------------------------------------
      */

      if (!permission) {
        return res.status(500).json({
          success: false,
          message: "Permission requirement is not configured.",
        });
      }

      /*
      |--------------------------------------------------------------------------
      | CHECK ACCESS
      |--------------------------------------------------------------------------
      */

      const allowed = await accessService.hasPermission(
        req.user.id,
        permission,
      );

      if (!allowed) {
        return res.status(403).json({
          success: false,
          message: "You do not have permission to perform this action.",
          permission,
        });
      }

      /*
      |--------------------------------------------------------------------------
      | CONTINUE
      |--------------------------------------------------------------------------
      */

      next();
    } catch (error) {
      next(error);
    }
  };
};

/*
|--------------------------------------------------------------------------
| REQUIRE ANY PERMISSION
|--------------------------------------------------------------------------
*/

export const requireAnyPermission = (...permissions) => {
  return async (req, res, next) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      const allowed = await accessService.hasAnyPermission(
        req.user.id,
        permissions,
      );

      if (!allowed) {
        return res.status(403).json({
          success: false,
          message: "You do not have the required permission.",
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/*
|--------------------------------------------------------------------------
| REQUIRE ALL PERMISSIONS
|--------------------------------------------------------------------------
*/

export const requireAllPermissions = (...permissions) => {
  return async (req, res, next) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      const allowed = await accessService.hasAllPermissions(
        req.user.id,
        permissions,
      );

      if (!allowed) {
        return res.status(403).json({
          success: false,
          message: "You do not have all required permissions.",
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
