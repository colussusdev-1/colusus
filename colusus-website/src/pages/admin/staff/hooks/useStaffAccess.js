import { useCallback, useEffect, useMemo, useState } from "react";

import staffAccessService from "../services/staffAccess.service";

const useStaffAccess = (enabled = true) => {
  const [access, setAccess] = useState(null);

  const [loading, setLoading] = useState(Boolean(enabled));

  const [error, setError] = useState(null);

  /*
    |--------------------------------------------------------------------------
    | LOAD ACCESS
    |--------------------------------------------------------------------------
    */

  const loadAccess = useCallback(async () => {
    /*
                --------------------------------------------------------------
                | Do not request staff access when the current user is not
                | a Staff account.
                |
                | Admin users are unrestricted and do not need this request.
                --------------------------------------------------------------
                */

    if (!enabled) {
      setAccess(null);

      setError(null);

      setLoading(false);

      return;
    }

    try {
      setLoading(true);

      setError(null);

      const response = await staffAccessService.getMyAccess();

      const accessData = response?.data || response || null;

      setAccess(accessData);
    } catch (err) {
      console.error("Failed to load staff access:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load staff access.",
      );

      setAccess(null);
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  /*
    |--------------------------------------------------------------------------
    | INITIAL LOAD
    |--------------------------------------------------------------------------
    */

  useEffect(() => {
    loadAccess();
  }, [loadAccess]);

  /*
    |--------------------------------------------------------------------------
    | EFFECTIVE PERMISSIONS
    |--------------------------------------------------------------------------
    */

  const permissions = useMemo(() => {
    if (!Array.isArray(access?.permissions)) {
      return [];
    }

    return access.permissions;
  }, [access]);

  /*
    |--------------------------------------------------------------------------
    | HAS PERMISSION
    |--------------------------------------------------------------------------
    */

  const hasPermission = useCallback(
    (permission) => {
      if (!permission) {
        return false;
      }

      /*
                --------------------------------------------------------------
                | ADMIN / unrestricted access.
                --------------------------------------------------------------
                */

      if (access?.unrestricted) {
        return true;
      }

      return permissions.includes(permission);
    },
    [access, permissions],
  );

  /*
    |--------------------------------------------------------------------------
    | HAS ANY PERMISSION
    |--------------------------------------------------------------------------
    */

  const hasAnyPermission = useCallback(
    (...requiredPermissions) => {
      if (!requiredPermissions.length) {
        return false;
      }

      if (access?.unrestricted) {
        return true;
      }

      return requiredPermissions.some((permission) =>
        permissions.includes(permission),
      );
    },
    [access, permissions],
  );

  /*
    |--------------------------------------------------------------------------
    | HAS ALL PERMISSIONS
    |--------------------------------------------------------------------------
    */

  const hasAllPermissions = useCallback(
    (...requiredPermissions) => {
      if (!requiredPermissions.length) {
        return false;
      }

      if (access?.unrestricted) {
        return true;
      }

      return requiredPermissions.every((permission) =>
        permissions.includes(permission),
      );
    },
    [access, permissions],
  );

  /*
    |--------------------------------------------------------------------------
    | RETURN
    |--------------------------------------------------------------------------
    */

  return {
    access,

    permissions,

    loading,

    error,

    hasPermission,

    hasAnyPermission,

    hasAllPermissions,

    refresh: loadAccess,
  };
};

export default useStaffAccess;
