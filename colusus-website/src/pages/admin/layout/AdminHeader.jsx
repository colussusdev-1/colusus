
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  HiOutlineSearch,
  HiOutlineBell,
  HiOutlineChevronDown,
} from "react-icons/hi";

import authService from "../../../services/authService";

import "./AdminHeader.css";

/*
|--------------------------------------------------------------------------
| ADMIN HEADER
|--------------------------------------------------------------------------
|
| Shared by:
|
| ADMIN
| STAFF
|
| The header adapts to the authenticated user's role.
|
|--------------------------------------------------------------------------
*/

const AdminHeader = () => {
  const navigate = useNavigate();

  const [notice, setNotice] = useState("");

  /*
  |--------------------------------------------------------------------------
  | CURRENT USER
  |--------------------------------------------------------------------------
  */

  const user = authService.getCurrentUser();

  const role = String(
    user?.role || ""
  )
    .trim()
    .toUpperCase();

  const isStaff = role === "STAFF";

  /*
  |--------------------------------------------------------------------------
  | USER INFORMATION
  |--------------------------------------------------------------------------
  */

  const displayName =
    user?.name ||
    (isStaff ? "Staff" : "Admin");

  const displayRole =
    isStaff
      ? "Staff Member"
      : "Administrator";

  /*
  |--------------------------------------------------------------------------
  | AVATAR INITIALS
  |--------------------------------------------------------------------------
  */

  const avatar = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) =>
      part.charAt(0).toUpperCase()
    )
    .join("");

  /*
  |--------------------------------------------------------------------------
  | TEMPORARY NOT AVAILABLE MESSAGE
  |--------------------------------------------------------------------------
  */

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

  /*
  |--------------------------------------------------------------------------
  | UNAVAILABLE ACTIONS
  |--------------------------------------------------------------------------
  */

  const handleSearch = () => {
    showNotice("Search not available");
  };

  const handleNotifications = () => {
    showNotice("Notifications not available");
  };

  const handleProfile = () => {
    showNotice("Profile not available");
  };

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <header className="admin-header">

      {/* ============================================================
                LEFT
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
                RIGHT
            ============================================================ */}

      <div className="admin-header-right">

        {/* ========================================================
                    SEARCH
                ======================================================== */}

        <button
          type="button"
          className="admin-header-icon-button"
          aria-label="Search"
          onClick={handleSearch}
        >
          <HiOutlineSearch />
        </button>


        {/* ========================================================
                    NOTIFICATIONS
                ======================================================== */}

        <button
          type="button"
          className="
                        admin-header-icon-button
                        admin-notification-button
                    "
          aria-label="Notifications"
          onClick={handleNotifications}
        >
          <HiOutlineBell />

          <span
            className="admin-notification-dot"
            aria-hidden="true"
          />
        </button>


        {/* ========================================================
                    USER
                ======================================================== */}

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

