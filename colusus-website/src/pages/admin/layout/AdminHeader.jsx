import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  HiOutlineSearch,
  HiOutlineBell,
  HiOutlineChevronDown,
} from "react-icons/hi";

import authService
  from "../../../services/authService";

import notificationsService
  from "../notifications/notifications.service";

import "./AdminHeader.css";


/* ==========================================================================
   CONFIGURATION
   ========================================================================== */

const REFRESH_INTERVAL = 60 * 1000;


/* ==========================================================================
   RESPONSE NORMALIZATION
   ========================================================================== */

/**
 * Supports common API response structures, including:
 *
 * 1. { unreadCount: 2 }
 * 2. { data: { unreadCount: 2 } }
 * 3. { data: { data: { unreadCount: 2 } } }
 * 4. Axios responses containing any of the above.
 * 5. A complete notification response containing notifications,
 *    pagination, and unreadCount.
 */
const normalizeUnreadCount = (response) => {
  let current = response;

  for (let index = 0; index < 6; index += 1) {
    if (typeof current === "number") {
      return Number.isFinite(current)
        ? Math.max(0, current)
        : 0;
    }

    if (!current || typeof current !== "object") {
      return 0;
    }

    if (Array.isArray(current)) {
      return 0;
    }

    if (
      typeof current.unreadCount === "number" &&
      Number.isFinite(current.unreadCount)
    ) {
      return Math.max(0, current.unreadCount);
    }

    if (
      typeof current.count === "number" &&
      Number.isFinite(current.count)
    ) {
      return Math.max(0, current.count);
    }

    /*
     * Support a full notification-list response.
     * Do not assume the list length is the unread count.
     */
    if (
      Array.isArray(current.notifications) &&
      current.pagination
    ) {
      return current.notifications.filter(
        (notification) => notification?.read === false,
      ).length;
    }

    /*
     * Unwrap Axios responses and nested API payloads.
     */
    if (
      current.data &&
      typeof current.data === "object"
    ) {
      current = current.data;
      continue;
    }

    break;
  }

  return 0;
};


/* ==========================================================================
   ADMIN HEADER
   ========================================================================== */

const AdminHeader = () => {
  const navigate = useNavigate();

  const [notice, setNotice] = useState("");

  const [unreadCount, setUnreadCount] = useState(0);

  const [notificationError, setNotificationError] =
    useState(false);

  const [notificationLoading, setNotificationLoading] =
    useState(true);


  /* ----------------------------------------------------------------------
     CURRENT USER
     ---------------------------------------------------------------------- */

  let user = null;

  try {
    const storedUser =
      localStorage.getItem("colossus_user");

    if (storedUser) {
      user = JSON.parse(storedUser);
    }
  } catch {
    user = null;
  }


  /* ----------------------------------------------------------------------
     USER ROLE
     ---------------------------------------------------------------------- */

  const role = String(user?.role || "")
    .trim()
    .toUpperCase();

  const isStaff = role === "STAFF";


  /* ----------------------------------------------------------------------
     USER INFORMATION
     ---------------------------------------------------------------------- */

  const displayName =
    user?.name ||
    (isStaff ? "Staff" : "Admin");

  const displayRole = isStaff
    ? "Staff Member"
    : "Administrator";


  /* ----------------------------------------------------------------------
     AVATAR INITIALS
     ---------------------------------------------------------------------- */

  const avatar = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");


  /* ----------------------------------------------------------------------
     LOAD UNREAD NOTIFICATIONS
     ---------------------------------------------------------------------- */

  const loadUnreadCount = useCallback(async () => {
    try {
      const response =
        await notificationsService.getUnreadCount();

      const count =
        normalizeUnreadCount(response);

      setUnreadCount(count);

      setNotificationError(false);

      return count;
    } catch (error) {
      console.error(
        "Failed to load header notification count:",
        error,
      );

      setNotificationError(true);

      /*
       * Preserve the last successfully retrieved count.
       * A temporary API failure should not erase it.
       */
      return null;
    } finally {
      setNotificationLoading(false);
    }
  }, []);


  /* ----------------------------------------------------------------------
     INITIAL LOAD AND PERIODIC REFRESH
     ---------------------------------------------------------------------- */

  useEffect(() => {
    let mounted = true;

    const refreshNotifications = async () => {
      try {
        const response =
          await notificationsService.getUnreadCount();

        if (!mounted) {
          return;
        }

        setUnreadCount(
          normalizeUnreadCount(response),
        );

        setNotificationError(false);
      } catch (error) {
        if (!mounted) {
          return;
        }

        console.error(
          "Failed to refresh notification count:",
          error,
        );

        setNotificationError(true);
      } finally {
        if (mounted) {
          setNotificationLoading(false);
        }
      }
    };

    refreshNotifications();

    const interval = setInterval(
      refreshNotifications,
      REFRESH_INTERVAL,
    );

    /*
     * Refresh when the user returns to the browser tab.
     */
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refreshNotifications();
      }
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange,
    );

    return () => {
      mounted = false;

      clearInterval(interval);

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange,
      );
    };
  }, []);


  /* ----------------------------------------------------------------------
     TEMPORARY NOTICE
     ---------------------------------------------------------------------- */

  const showNotice = (message) => {
    setNotice(message);
  };

  useEffect(() => {
    if (!notice) {
      return undefined;
    }

    const timer = setTimeout(() => {
      setNotice("");
    }, 1800);

    return () => clearTimeout(timer);
  }, [notice]);


  /* ----------------------------------------------------------------------
     HEADER ACTIONS
     ---------------------------------------------------------------------- */

  const handleSearch = () => {
    showNotice("Search is coming soon");
  };

  const handleNotifications = () => {
    navigate("/admin/notifications");
  };

  const handleProfile = () => {
    showNotice("Profile management is coming soon");
  };


  /* ----------------------------------------------------------------------
     RENDER
     ---------------------------------------------------------------------- */

  return (
    <header className="admin-header">

      {/* ============================================================
                LEFT SECTION
            ============================================================ */}

      <div className="admin-header-left">

        <div className="admin-mobile-title">

          <span>
            colossus
          </span>

          <small>
            Operations Portal
          </small>

        </div>

      </div>


      {/* ============================================================
                RIGHT SECTION
            ============================================================ */}

      <div className="admin-header-right">

        {/* SEARCH */}

        <button
          type="button"
          className="admin-header-icon-button"
          aria-label="Search"
          title="Search"
          onClick={handleSearch}
        >
          <HiOutlineSearch />
        </button>


        {/* NOTIFICATIONS */}

        <button
          type="button"
          className={[
            "admin-header-icon-button",
            "admin-notification-button",
            unreadCount > 0
              ? "has-unread-notifications"
              : "",
            notificationError
              ? "notification-load-error"
              : "",
          ]
            .filter(Boolean)
            .join(" ")}
          aria-label={
            notificationLoading
              ? "Notifications loading"
              : notificationError
                ? "Notifications unavailable"
                : unreadCount > 0
                  ? `Notifications, ${unreadCount} unread`
                  : "Notifications"
          }
          title={
            notificationError
              ? "Unable to refresh notifications"
              : unreadCount > 0
                ? `${unreadCount} unread notification${unreadCount === 1 ? "" : "s"
                }`
                : "Notifications"
          }
          onClick={handleNotifications}
        >

          <HiOutlineBell />

          {unreadCount > 0 && (
            <span
              className="admin-notification-count"
              aria-hidden="true"
            >
              {unreadCount > 99
                ? "99+"
                : unreadCount}
            </span>
          )}

          {notificationError && unreadCount === 0 && (
            <span
              className="admin-notification-dot"
              aria-hidden="true"
            />
          )}

        </button>


        {/* USER PROFILE */}

        <button
          type="button"
          className="admin-header-user"
          onClick={handleProfile}
          aria-label="Open profile"
        >

          <div className="admin-header-avatar">
            {avatar || "U"}
          </div>

          <div className="admin-header-user-info">

            <strong>
              {displayName}
            </strong>

            <span>
              {displayRole}
            </span>

          </div>

          <HiOutlineChevronDown
            className="admin-header-chevron"
          />

        </button>

      </div>


      {/* ============================================================
                TEMPORARY NOTICE
            ============================================================ */}

      {notice && (
        <div
          className="admin-header-notice"
          role="status"
          aria-live="polite"
        >
          {notice}
        </div>
      )}

    </header>
  );
};


export default AdminHeader;