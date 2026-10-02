import User from "../../users/user.model.js";

/*
|--------------------------------------------------------------------------
| NORMALIZE PERMISSIONS
|--------------------------------------------------------------------------
*/

const normalizePermissions = (permissions = []) => {
  if (!Array.isArray(permissions)) {
    return [];
  }

  return [
    ...new Set(
      permissions
        .map((permission) => String(permission || "").trim())
        .filter(Boolean),
    ),
  ];
};

/*
|--------------------------------------------------------------------------
| GET EFFECTIVE STAFF PERMISSIONS
|--------------------------------------------------------------------------
|
| Effective permissions are calculated as:
|
|     Role permissions
|     + Direct grants
|     - Direct denials
|
| ADMIN accounts remain unrestricted.
|
|--------------------------------------------------------------------------
*/

const getEffectivePermissions = async (userId) => {
  const user = await User.findById(userId)
    .populate({
      path: "staffRole",
      select: "name key permissions isActive",
    })
    .select("_id role isActive staffRole permissionGrants permissionDenials")
    .lean();

  /*
  |--------------------------------------------------------------------------
  | USER NOT FOUND
  |--------------------------------------------------------------------------
  */

  if (!user) {
    const error = new Error("User not found.");

    error.statusCode = 404;

    throw error;
  }

  /*
  |--------------------------------------------------------------------------
  | ADMIN
  |--------------------------------------------------------------------------
  |
  | Admin accounts do not require individual permission checks.
  |
  */

  if (user.role === "ADMIN") {
    return {
      userId: user._id,
      accountRole: user.role,
      staffRole: null,
      unrestricted: true,
      permissions: [],
    };
  }

  /*
  |--------------------------------------------------------------------------
  | INACTIVE USER
  |--------------------------------------------------------------------------
  |
  | An inactive account has no effective permissions.
  |
  */

  if (!user.isActive) {
    return {
      userId: user._id,
      accountRole: user.role,
      staffRole: user.staffRole
        ? {
            id: user.staffRole._id,
            name: user.staffRole.name,
            key: user.staffRole.key,
          }
        : null,
      unrestricted: false,
      permissions: [],
    };
  }

  /*
  |--------------------------------------------------------------------------
  | ROLE PERMISSIONS
  |--------------------------------------------------------------------------
  |
  | If the assigned Staff Role is inactive, its permissions
  | are not inherited.
  |
  */

  const rolePermissions =
    user.staffRole?.isActive === false ? [] : user.staffRole?.permissions || [];

  /*
  |--------------------------------------------------------------------------
  | DIRECT GRANTS
  |--------------------------------------------------------------------------
  */

  const directGrants = normalizePermissions(user.permissionGrants);

  /*
  |--------------------------------------------------------------------------
  | DIRECT DENIALS
  |--------------------------------------------------------------------------
  |
  | Denials are evaluated after role permissions and grants.
  |
  | Therefore:
  |
  | role permission
  |      +
  | direct grant
  |      -
  | direct denial
  |
  | means a direct denial wins.
  |
  */

  const directDenials = new Set(normalizePermissions(user.permissionDenials));

  /*
  |--------------------------------------------------------------------------
  | CALCULATE EFFECTIVE ACCESS
  |--------------------------------------------------------------------------
  */

  const effectivePermissions = normalizePermissions([
    ...rolePermissions,
    ...directGrants,
  ]).filter((permission) => !directDenials.has(permission));

  /*
  |--------------------------------------------------------------------------
  | RETURN ACCESS
  |--------------------------------------------------------------------------
  */

  return {
    userId: user._id,

    /*
    | Account-level authorization role.
    |
    | Examples:
    | ADMIN
    | STAFF
    | CLIENT
    | DEVELOPER
    */
    accountRole: user.role,

    /*
    | Staff-specific role.
    |
    | Examples:
    | Case Officer
    | Finance Officer
    | Operations Officer
    */
    staffRole: user.staffRole
      ? {
          id: user.staffRole._id,
          name: user.staffRole.name,
          key: user.staffRole.key,
        }
      : null,

    unrestricted: false,

    permissions: effectivePermissions,
  };
};

/*
|--------------------------------------------------------------------------
| HAS PERMISSION
|--------------------------------------------------------------------------
*/

const hasPermission = async (userId, permission) => {
  const access = await getEffectivePermissions(userId);

  if (access.unrestricted) {
    return true;
  }

  return access.permissions.includes(permission);
};

/*
|--------------------------------------------------------------------------
| HAS ANY PERMISSION
|--------------------------------------------------------------------------
*/

const hasAnyPermission = async (userId, permissions = []) => {
  const normalizedPermissions = normalizePermissions(permissions);

  if (!normalizedPermissions.length) {
    return false;
  }

  const access = await getEffectivePermissions(userId);

  if (access.unrestricted) {
    return true;
  }

  return normalizedPermissions.some((permission) =>
    access.permissions.includes(permission),
  );
};

/*
|--------------------------------------------------------------------------
| HAS ALL PERMISSIONS
|--------------------------------------------------------------------------
*/

const hasAllPermissions = async (userId, permissions = []) => {
  const normalizedPermissions = normalizePermissions(permissions);

  if (!normalizedPermissions.length) {
    return false;
  }

  const access = await getEffectivePermissions(userId);

  if (access.unrestricted) {
    return true;
  }

  return normalizedPermissions.every((permission) =>
    access.permissions.includes(permission),
  );
};

/*
|--------------------------------------------------------------------------
| GET ACCESS SNAPSHOT
|--------------------------------------------------------------------------
|
| Used by frontend session/access-control logic.
|
|--------------------------------------------------------------------------
*/

const getAccessSnapshot = async (userId) => {
  const access = await getEffectivePermissions(userId);

  return {
    userId: access.userId,
    accountRole: access.accountRole,
    staffRole: access.staffRole,
    unrestricted: access.unrestricted,
    permissions: access.permissions,
  };
};

/*
|--------------------------------------------------------------------------
| EXPORTS
|--------------------------------------------------------------------------
*/

export default {
  getEffectivePermissions,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  getAccessSnapshot,
};
