import React from "react";
import { NavLink } from "react-router-dom";

import {
  HiOutlineViewGrid,
  HiOutlineUsers,
  HiOutlineDocumentText,
  HiOutlineFolderOpen,
  HiOutlineBell,
  HiOutlineUserGroup,
  HiOutlineClock,
  HiOutlineUserCircle,
  HiOutlineLogout,
} from "react-icons/hi";

import "./AdminSidebar.css";

const navigation = [
  {
    label: "Overview",
    path: "/admin",
    icon: HiOutlineViewGrid,
  },
  {
    label: "Clients",
    path: "/admin/clients",
    icon: HiOutlineUsers,
  },
  {
    label: "Applications",
    path: "/admin/applications",
    icon: HiOutlineDocumentText,
  },
  {
    label: "Documents",
    path: "/admin/documents",
    icon: HiOutlineFolderOpen,
  },
  {
    label: "Notifications",
    path: "/admin/notifications",
    icon: HiOutlineBell,
  },
  {
    label: "Staff",
    path: "/admin/staff",
    icon: HiOutlineUserGroup,
    superAdminOnly: true,
  },
  {
    label: "Activity",
    path: "/admin/activity",
    icon: HiOutlineClock,
  },
];

const AdminSidebar = () => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");

    window.location.href = "/admin/login";
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-top">
        <div className="admin-brand">
          <div className="admin-brand-mark">
            C
          </div>

          <div className="admin-brand-text">
            <span className="admin-brand-name">Colusus</span>
            <span className="admin-brand-label">Admin Portal</span>
          </div>
        </div>

        <nav className="admin-navigation">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.label}
                to={item.path}
                end={item.path === "/admin"}
                className={({ isActive }) =>
                  `admin-nav-item ${isActive ? "admin-nav-item-active" : ""
                  }`
                }
              >
                <Icon className="admin-nav-icon" />

                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="admin-sidebar-bottom">
        <NavLink
          to="/admin/profile"
          className={({ isActive }) =>
            `admin-profile-link ${isActive ? "admin-profile-link-active" : ""
            }`
          }
        >
          <div className="admin-avatar">
            SA
          </div>

          <div className="admin-profile-info">
            <strong>Admin</strong>
            <span>Administrator</span>
          </div>

          <HiOutlineUserCircle className="admin-profile-icon" />
        </NavLink>

        <button
          type="button"
          className="admin-logout-button"
          onClick={handleLogout}
        >
          <HiOutlineLogout />

          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;