import React from "react";

import {
    NavLink,
    useLocation,
} from "react-router-dom";

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
    HiOutlineChatAlt2,
    HiOutlineBriefcase,
    HiOutlineViewBoards,
} from "react-icons/hi";

import authService from "../../../services/authService";

import "./AdminSidebar.css";


/*
|--------------------------------------------------------------------------
| ADMIN NAVIGATION
|--------------------------------------------------------------------------
|
| Full navigation available to ADMIN users.
|
*/

const adminNavigation = [

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
        label: "Consultations",
        path: "/admin/consultations",
        icon: HiOutlineChatAlt2,
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
    },

    {
        label: "Activity",
        path: "/admin/activity",
        icon: HiOutlineClock,
    },

];


/*
|--------------------------------------------------------------------------
| STAFF NAVIGATION
|--------------------------------------------------------------------------
|
| Staff gets its own operational navigation while continuing to use
| the shared AdminSidebar component.
|
| IMPORTANT:
|
| We are only exposing routes that actually exist.
|
*/

const staffNavigation = [

    {
        label: "My Workspace",
        path: "/admin/staff",
        icon: HiOutlineBriefcase,
        type: "dashboard",
    },

    {
        label: "Application Pipeline",
        path: "/admin/staff/applications",
        icon: HiOutlineViewBoards,
        type: "pipeline",
    },

];


/*
|--------------------------------------------------------------------------
| ADMIN SIDEBAR
|--------------------------------------------------------------------------
*/

const AdminSidebar = () => {

    const location =
        useLocation();


    /*
    |--------------------------------------------------------------------------
    | CURRENT USER
    |--------------------------------------------------------------------------
    */

    const user =
        authService.getCurrentUser();


    const role =
        String(
            user?.role || "",
        )
            .trim()
            .toUpperCase();


    const isStaff =
        role === "STAFF";


    /*
    |--------------------------------------------------------------------------
    | SELECT NAVIGATION
    |--------------------------------------------------------------------------
    */

    const navigation =
        isStaff
            ? staffNavigation
            : adminNavigation;


    /*
    |--------------------------------------------------------------------------
    | USER DISPLAY DATA
    |--------------------------------------------------------------------------
    */

    const displayName =
        user?.name ||
        (isStaff
            ? "Staff"
            : "Admin");


    const displayRole =
        isStaff
            ? "Staff Member"
            : "Administrator";


    /*
    |--------------------------------------------------------------------------
    | AVATAR
    |--------------------------------------------------------------------------
    */

    const avatar =
        displayName
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map(
                (
                    part,
                ) =>
                    part
                        .charAt(0)
                        .toUpperCase(),
            )
            .join("");


    /*
    |--------------------------------------------------------------------------
    | LOGOUT
    |--------------------------------------------------------------------------
    */

    const handleLogout = () => {

        authService.logout();

        window.location.href =
            "/admin/login";
    };


    /*
    |--------------------------------------------------------------------------
    | STAFF ACTIVE STATE
    |--------------------------------------------------------------------------
    |
    | We don't want "My Workspace" to stay highlighted when the user
    | is actually working inside the Application Pipeline.
    |
    | Instead:
    |
    | /admin/staff
    |        → My Workspace
    |
    | /admin/staff/applications
    |        → Application Pipeline
    |
    | /admin/staff/applications/:id
    |        → Application Pipeline
    |
    */

    const isStaffNavigationActive = (
        item,
    ) => {

        if (!isStaff) {
            return false;
        }


        if (
            item.type ===
            "dashboard"
        ) {

            return (
                location.pathname ===
                "/admin/staff"
            );
        }


        if (
            item.type ===
            "pipeline"
        ) {

            return (
                location.pathname ===
                    "/admin/staff/applications" ||
                location.pathname.startsWith(
                    "/admin/staff/applications/",
                )
            );
        }


        return false;
    };


    /*
    |--------------------------------------------------------------------------
    | RENDER
    |--------------------------------------------------------------------------
    */

    return (

        <aside className="admin-sidebar">


            {/* ============================================================
                SIDEBAR TOP
            ============================================================ */}

            <div className="admin-sidebar-top">


                {/* ========================================================
                    BRAND
                ======================================================== */}

                <div className="admin-brand">

                    <div className="admin-brand-mark">
                        C
                    </div>


                    <div className="admin-brand-text">

                        <span className="admin-brand-name">
                            colossus
                        </span>

                        <span className="admin-brand-label">
                            Operations Portal
                        </span>

                    </div>

                </div>


                {/* ========================================================
                    NAVIGATION
                ======================================================== */}

                <nav className="admin-navigation">


                    {/* ====================================================
                        STAFF SECTION LABEL
                    ==================================================== */}

                    {isStaff && (

                        <div className="admin-navigation-section">

                            <span>
                                Workspace
                            </span>

                        </div>

                    )}


                    {navigation.map(
                        (
                            item,
                        ) => {

                            const Icon =
                                item.icon;


                            /*
                            ------------------------------------------------
                            STAFF
                            ------------------------------------------------
                            */

                            if (isStaff) {

                                const active =
                                    isStaffNavigationActive(
                                        item,
                                    );


                                return (

                                    <NavLink
                                        key={
                                            item.label
                                        }
                                        to={
                                            item.path
                                        }
                                        end={
                                            item.type ===
                                            "dashboard"
                                        }
                                        className={
                                            active
                                                ? "admin-nav-item admin-nav-item-active"
                                                : "admin-nav-item"
                                        }
                                    >

                                        <span className="admin-nav-icon-wrapper">

                                            <Icon className="admin-nav-icon" />

                                        </span>


                                        <span className="admin-nav-label">
                                            {
                                                item.label
                                            }
                                        </span>


                                        {item.type ===
                                            "pipeline" && (
                                            <span className="admin-nav-arrow">
                                                →
                                            </span>
                                        )}

                                    </NavLink>

                                );

                            }


                            /*
                            ------------------------------------------------
                            ADMIN
                            ------------------------------------------------
                            */

                            return (

                                <NavLink
                                    key={
                                        item.label
                                    }
                                    to={
                                        item.path
                                    }
                                    end={
                                        item.path ===
                                        "/admin"
                                    }
                                    className={({
                                        isActive,
                                    }) =>
                                        `
                                        admin-nav-item
                                        ${
                                            isActive
                                                ? "admin-nav-item-active"
                                                : ""
                                        }
                                        `
                                    }
                                >

                                    <Icon className="admin-nav-icon" />

                                    <span>
                                        {
                                            item.label
                                        }
                                    </span>

                                </NavLink>

                            );

                        },
                    )}

                </nav>

            </div>


            {/* ============================================================
                SIDEBAR BOTTOM
            ============================================================ */}

            <div className="admin-sidebar-bottom">


                {/* ========================================================
                    USER PROFILE
                ======================================================== */}

                <NavLink
                    to={
                        isStaff
                            ? "/admin/staff"
                            : "/admin/profile"
                    }
                    className="admin-profile-link"
                >

                    <div className="admin-avatar">
                        {
                            avatar ||
                            "U"
                        }
                    </div>


                    <div className="admin-profile-info">

                        <strong>
                            {
                                displayName
                            }
                        </strong>

                        <span>
                            {
                                displayRole
                            }
                        </span>

                    </div>


                    <HiOutlineUserCircle
                        className="admin-profile-icon"
                    />

                </NavLink>


                {/* ========================================================
                    LOGOUT
                ======================================================== */}

                <button
                    type="button"
                    className="admin-logout-button"
                    onClick={
                        handleLogout
                    }
                >

                    <HiOutlineLogout />

                    <span>
                        Logout
                    </span>

                </button>

            </div>


        </aside>

    );
};


export default AdminSidebar;