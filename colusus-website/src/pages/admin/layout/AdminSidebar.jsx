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
    HiOutlineCollection,
    HiOutlinePencilAlt,
} from "react-icons/hi";

import authService
    from "../../../services/authService";

import useStaffAccess
    from "../staff/hooks/useStaffAccess";

import "./AdminSidebar.css";


/*
|--------------------------------------------------------------------------
| ADMIN NAVIGATION
|--------------------------------------------------------------------------
|
| ADMIN users have unrestricted access through the backend access layer.
|
| These items are therefore not filtered by staff permissions.
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
        label: "Opportunities",
        path: "/admin/opportunities",
        icon: HiOutlineBriefcase,
    },

    {
        label: "Documents",
        path: "/admin/documents",
        icon: HiOutlineFolderOpen,
    },

    {
        label: "Forms",
        path: "/admin/forms",
        icon: HiOutlineCollection,
    },

    {
        label: "Blog",
        path: "/admin/blog",
        icon: HiOutlinePencilAlt,
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
        disabled: true,
    },

    {
        label: "Staff",
        path: "/admin/staff-management",
        icon: HiOutlineUserGroup,
    },

    {
        label: "Activity",
        path: "/admin/activity",
        icon: HiOutlineClock,
        disabled: true,
    },

];


/*
|--------------------------------------------------------------------------
| STAFF NAVIGATION
|--------------------------------------------------------------------------
|
| The permission controls visibility.
|
| The backend remains the actual authorization authority.
|
*/

const staffNavigation = [

    {
        label: "My Workspace",
        path: "/admin/staff",
        icon: HiOutlineBriefcase,
        permission: "dashboard.view",
    },

    {
        label: "Application Pipeline",
        path: "/admin/staff/applications",
        icon: HiOutlineViewBoards,
        permission: "applications.view",
    },

    {
        label: "Website Enquiries",
        path: "/admin/staff/form-submissions",
        icon: HiOutlineCollection,
        permission: "forms.view",
    },

];


/*
|--------------------------------------------------------------------------
| STAFF ACTIVE PATHS
|--------------------------------------------------------------------------
|
| Used to keep detail pages highlighted under their parent workspace.
|
*/

const isPathActive = (
    pathname,
    path,
) => {

    if (path === "/admin/staff") {
        return pathname === path;
    }

    return (
        pathname === path ||
        pathname.startsWith(`${path}/`)
    );

};


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
    | STAFF ACCESS
    |--------------------------------------------------------------------------
    |
    | Only STAFF accounts need to request their granular permissions.
    |
    */

    const {
        loading: accessLoading,
        hasPermission,
    } = useStaffAccess(
        isStaff,
    );


    /*
    |--------------------------------------------------------------------------
    | NAVIGATION
    |--------------------------------------------------------------------------
    */

    const navigation =
        isStaff
            ? staffNavigation.filter(
                (item) => {

                    if (!item.permission) {
                        return true;
                    }

                    /*
                    | Keep navigation visible while access is loading.
                    | StaffPermissionRoute protects the actual route.
                    */

                    if (accessLoading) {
                        return true;
                    }

                    return hasPermission(
                        item.permission,
                    );

                },
            )
            : adminNavigation;


    /*
    |--------------------------------------------------------------------------
    | USER DISPLAY
    |--------------------------------------------------------------------------
    */

    const displayName =
        user?.name ||
        (
            isStaff
                ? "Staff"
                : "Admin"
        );


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
                (part) =>
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
                        (item) => {

                            const Icon =
                                item.icon;


                            /*
                            |--------------------------------------------------------------------------
                            | DISABLED ADMIN ITEM
                            |--------------------------------------------------------------------------
                            */

                            if (
                                !isStaff &&
                                item.disabled
                            ) {

                                return (

                                    <div
                                        key={
                                            item.label
                                        }
                                        className="
                                            admin-nav-item
                                            admin-nav-item-disabled
                                        "
                                        aria-disabled="true"
                                    >

                                        <Icon
                                            className="admin-nav-icon"
                                        />

                                        <span>
                                            {
                                                item.label
                                            }
                                        </span>

                                        <small>
                                            Not available
                                        </small>

                                    </div>

                                );

                            }


                            /*
                            |--------------------------------------------------------------------------
                            | STAFF NAVIGATION
                            |--------------------------------------------------------------------------
                            */

                            if (isStaff) {

                                const active =
                                    isPathActive(
                                        location.pathname,
                                        item.path,
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
                                            item.path ===
                                            "/admin/staff"
                                        }
                                        className={
                                            active
                                                ? "admin-nav-item admin-nav-item-active"
                                                : "admin-nav-item"
                                        }
                                    >

                                        <span className="admin-nav-icon-wrapper">

                                            <Icon
                                                className="admin-nav-icon"
                                            />

                                        </span>


                                        <span className="admin-nav-label">

                                            {
                                                item.label
                                            }

                                        </span>

                                    </NavLink>

                                );

                            }


                            /*
                            |--------------------------------------------------------------------------
                            | ADMIN NAVIGATION
                            |--------------------------------------------------------------------------
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
                                        ${isActive
                                            ? "admin-nav-item-active"
                                            : ""
                                        }
                                        `
                                    }
                                >

                                    <Icon
                                        className="admin-nav-icon"
                                    />

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

                {isStaff ? (

                    <NavLink
                        to="/admin/staff"
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

                ) : (

                    <div
                        className="
                            admin-profile-link
                            admin-profile-link-disabled
                        "
                        aria-disabled="true"
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


                        <small>
                            Not available
                        </small>

                    </div>

                )}


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