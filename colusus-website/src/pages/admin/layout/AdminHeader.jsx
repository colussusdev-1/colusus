import React from "react";
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
  | NOTIFICATIONS
  |--------------------------------------------------------------------------
  |
  | Notification functionality is intentionally not being rebuilt here.
  |
  | The notification system will be handled separately later.
  |
  |--------------------------------------------------------------------------
  */


  const handleNotifications = () => {

    navigate(
      isStaff
        ? "/admin/staff"
        : "/admin/notifications"
    );

  };


  /*
  |--------------------------------------------------------------------------
  | PROFILE
  |--------------------------------------------------------------------------
  */

  const handleProfile = () => {

    navigate("/admin/profile");

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

          <span className="admin-notification-dot" />

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

    </header>

  );

};


export default AdminHeader;