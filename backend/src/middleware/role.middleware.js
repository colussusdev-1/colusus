/*
|--------------------------------------------------------------------------
| ROLE-BASED AUTHORIZATION MIDDLEWARE
|--------------------------------------------------------------------------
|
| Responsibilities:
| - Ensure a user is authenticated.
| - Normalize user and permitted roles.
| - Support multiple permitted roles.
| - Restrict access to permitted roles.
| - Provide diagnostic logs during development.
|
*/

export const authorize = (...roles) => {
  /*
    |--------------------------------------------------------------------------
    | NORMALIZE ALLOWED ROLES
    |--------------------------------------------------------------------------
    */

  const allowedRoles = roles
    .flat()
    .filter((role) => typeof role === "string")
    .map((role) => role.trim().toUpperCase())
    .filter(Boolean);

  return (req, res, next) => {
    /*
        |--------------------------------------------------------------------------
        | AUTHENTICATION CHECK
        |--------------------------------------------------------------------------
        */

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    /*
        |--------------------------------------------------------------------------
        | NORMALIZE AUTHENTICATED USER ROLE
        |--------------------------------------------------------------------------
        */

    const userRole =
      typeof req.user.role === "string"
        ? req.user.role.trim().toUpperCase()
        : null;

    /*
        |--------------------------------------------------------------------------
        | AUTHORIZATION DEBUG
        |--------------------------------------------------------------------------
        */

    console.log("========== AUTHORIZATION DEBUG ==========");

    console.log({
      userId: req.user.id || req.user._id || null,
      userRole,
      allowedRoles,
      roleMatched: Boolean(userRole && allowedRoles.includes(userRole)),
    });

    console.log("==========================================");

    /*
        |--------------------------------------------------------------------------
        | ROLE VALIDATION
        |--------------------------------------------------------------------------
        */

    if (!userRole) {
      return res.status(403).json({
        success: false,
        message: "Access denied: User role is missing.",
      });
    }

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    /*
        |--------------------------------------------------------------------------
        | AUTHORIZATION SUCCESSFUL
        |--------------------------------------------------------------------------
        */

    return next();
  };
};

/*
|--------------------------------------------------------------------------
| BACKWARD COMPATIBILITY
|--------------------------------------------------------------------------
*/

export const allowRoles = authorize;
