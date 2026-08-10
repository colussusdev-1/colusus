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

    return (
        <aside className="portal-sidebar">

            {/* =================================================
                BRAND
            ================================================= */}

            <div className="portal-sidebar__brand">

                <div className="portal-sidebar__logo">
                    C
                </div>

                <div className="portal-sidebar__brand-text">

                    <strong>
                        COLUSUS
                    </strong>

                    <span>
                        Migration Platform
                    </span>

                </div>

            </div>


            {/* =================================================
                NAVIGATION
            ================================================= */}

            <nav className="portal-sidebar__nav">

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
                                `portal-sidebar__link ${isActive ? "active" : ""
                                }`
                            }
                        >

                            <Icon className="portal-sidebar__icon" />

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

                <NavLink
                    to="/portal/help"
                    className={({ isActive }) =>
                        `portal-sidebar__link ${isActive ? "active" : ""
                        }`
                    }
                >

                    <HiOutlineQuestionMarkCircle
                        className="portal-sidebar__icon"
                    />

                    <span>
                        Help & Support
                    </span>

                </NavLink>


                <button
                    type="button"
                    className="portal-sidebar__logout"
                >

                    <HiOutlineLogout
                        className="portal-sidebar__icon"
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