import { NavLink } from "react-router-dom";

import {
    HiOutlineHome,
    HiOutlineDocumentText,
    HiOutlineFolderOpen,
    HiOutlineBell,
    HiOutlineUser,
    HiOutlineQuestionMarkCircle,
    HiOutlineLogout,
} from "react-icons/hi";

import "./PortalSidebar.css";

import colususLogo from "../../../assets/logo.png";


const PortalSidebar = () => {

    const navigation = [
        {
            label: "Dashboard",
            path: "/portal",
            icon: HiOutlineHome,
            end: true,
        },
        {
            label: "Applications",
            path: "/portal/applications",
            icon: HiOutlineDocumentText,
        },
        {
            label: "Documents",
            path: "/portal/documents",
            icon: HiOutlineFolderOpen,
        },
        {
            label: "Updates",
            path: "/portal/updates",
            icon: HiOutlineBell,
        },
        {
            label: "Profile",
            path: "/portal/profile",
            icon: HiOutlineUser,
        },
    ];


    const handleLogout = () => {

        /*
        ------------------------------------------------------
        CLEAR AUTHENTICATION
        ------------------------------------------------------
        */

        localStorage.removeItem("token");
        localStorage.removeItem("user");


        /*
        ------------------------------------------------------
        NOTIFY OTHER PORTAL COMPONENTS
        ------------------------------------------------------
        */

        window.dispatchEvent(
            new CustomEvent(
                "colusus:user-updated",
            ),
        );


        /*
        ------------------------------------------------------
        REDIRECT
        ------------------------------------------------------
        */

        window.location.href = "/login";

    };


    return (

        <aside className="portal-sidebar">


            {/* =================================================
                BRAND
            ================================================= */}

            <div className="portal-sidebar__brand">

                <NavLink
                    to="/portal"
                    className="portal-sidebar__brand-link"
                    aria-label="Colusus Client Portal"
                >

                    <img
                        src={colususLogo}
                        alt="Colusus"
                        className="portal-sidebar__logo"
                    />

                </NavLink>

            </div>


            {/* =================================================
                NAVIGATION
            ================================================= */}

            <nav
                className="portal-sidebar__nav"
                aria-label="Client portal navigation"
            >

                <div className="portal-sidebar__section-label">
                    Workspace
                </div>


                {navigation.map((item) => {

                    const Icon = item.icon;


                    return (

                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.end}
                            className={({ isActive }) =>
                                `portal-sidebar__link ${isActive
                                    ? "active"
                                    : ""
                                }`
                            }
                        >

                            <Icon
                                className="portal-sidebar__icon"
                                aria-hidden="true"
                            />

                            <span>
                                {item.label}
                            </span>

                        </NavLink>

                    );

                })}

            </nav>


            {/* =================================================
                BOTTOM AREA
            ================================================= */}

            <div className="portal-sidebar__bottom">


                {/* =================================================
                    HELP
                ================================================= */}

                <NavLink
                    to="/portal/help"
                    className={({ isActive }) =>
                        `portal-sidebar__link ${isActive
                            ? "active"
                            : ""
                        }`
                    }
                >

                    <HiOutlineQuestionMarkCircle
                        className="portal-sidebar__icon"
                        aria-hidden="true"
                    />

                    <span>
                        Help & Support
                    </span>

                </NavLink>


                {/* =================================================
                    LOGOUT
                ================================================= */}

                <button
                    type="button"
                    className="portal-sidebar__logout"
                    onClick={handleLogout}
                >

                    <HiOutlineLogout
                        className="portal-sidebar__icon"
                        aria-hidden="true"
                    />

                    <span>
                        Logout
                    </span>

                </button>

            </div>

        </aside>

    );

};


export default PortalSidebar;