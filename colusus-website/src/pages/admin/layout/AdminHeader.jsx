import React from "react";

import {
  HiOutlineSearch,
  HiOutlineBell,
  HiOutlineChevronDown,
} from "react-icons/hi";

import "./AdminHeader.css";

const AdminHeader = () => {
  return (
    <header className="admin-header">
      <div className="admin-header-left">
        <div className="admin-mobile-title">
          <span>Colusus</span>
          <small>Admin Portal</small>
        </div>
      </div>

      <div className="admin-header-right">
        <button
          type="button"
          className="admin-header-icon-button"
          aria-label="Search"
        >
          <HiOutlineSearch />
        </button>

        <button
          type="button"
          className="admin-header-icon-button admin-notification-button"
          aria-label="Notifications"
        >
          <HiOutlineBell />

          <span className="admin-notification-dot" />
        </button>

        <div className="admin-header-user">
          <div className="admin-header-avatar">
            SA
          </div>

          <div className="admin-header-user-info">
            <strong>Super Admin</strong>
            <span>Administrator</span>
          </div>

          <HiOutlineChevronDown className="admin-header-chevron" />
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;