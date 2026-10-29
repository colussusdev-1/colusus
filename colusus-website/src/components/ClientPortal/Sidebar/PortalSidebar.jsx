import {
    useEffect,
    useState,
} from "react";

import { NavLink } from "react-router-dom";

import {
    HiOutlineHome,
    HiOutlineDocumentText,
    HiOutlineFolderOpen,
    HiOutlineCreditCard,
    HiOutlineUser,
    HiOutlineQuestionMarkCircle,
    HiOutlineLogout,
    HiOutlineX,
    HiOutlineClipboardCheck,
    HiOutlineChatAlt2,
} from "react-icons/hi";

import "./PortalSidebar.css";

import colossusLogo from "../../../assets/logo.png";

const PortalSidebar = () => {
    const [mobileOpen, setMobileOpen] = useState(false);

    /* ============================================================
       NAVIGATION
    ============================================================ */

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
            label: "My Assessments",
            path: "/portal/assessments",
            icon: HiOutlineClipboardCheck,
        },
        {
            label: "Documents",
            path: "/portal/documents",
            icon: HiOutlineFolderOpen,
        },
        {
            label: "Messages",
            path: "/portal/chat",
            icon: HiOutlineChatAlt2,
        },
        {
            label: "Finance",
            path: "/portal/finance",
            icon: HiOutlineCreditCard,
        },
        {
            label: "Profile",
            path: "/portal/profile",
            icon: HiOutlineUser,
        },
    ];

    /* ============================================================
       MOBILE MENU EVENTS
    ============================================================ */

    useEffect(() => {
        const handleOpenMobileMenu = () => {
            setMobileOpen(true);
        };

        window.addEventListener(
            "colossus:open-mobile-menu",
            handleOpenMobileMenu
        );

        return () => {
            window.removeEventListener(
                "colossus:open-mobile-menu",
                handleOpenMobileMenu
            );
        };
    }, []);

    /* ============================================================
       LOCK BODY SCROLL WHEN MOBILE MENU IS OPEN
    ============================================================ */

    useEffect(() => {
        if (mobileOpen) {
            document.body.classList.add(
                "portal-mobile-menu-open"
            );
        } else {
            document.body.classList.remove(
                "portal-mobile-menu-open"
            );
        }

        return () => {
            document.body.classList.remove(
                "portal-mobile-menu-open"
            );
        };
    }, [mobileOpen]);

    /* ============================================================
       ESCAPE KEY HANDLING
    ============================================================ */

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape" && mobileOpen) {
                setMobileOpen(false);
            }
        };

        window.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => {
            window.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };
    }, [mobileOpen]);

    /* ============================================================
       CLOSE MENU AFTER NAVIGATION
    ============================================================ */

    const handleNavigation = () => {
        setMobileOpen(false);
    };

    /* ============================================================
       LOGOUT
    ============================================================ */

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.dispatchEvent(
            new CustomEvent("colossus:user-updated")
        );

        window.location.href = "/login";
    };

    /* ============================================================
       CLOSE MENU
    ============================================================ */

    const handleCloseMenu = () => {
        setMobileOpen(false);
    };

    /* ============================================================
       RENDER
    ============================================================ */

    return (
        <>
            {/* MOBILE BACKDROP */}

            <div
                className={`portal-sidebar__mobile-backdrop ${mobileOpen ? "is-open" : ""
                    }`}
                onClick={handleCloseMenu}
                aria-hidden="true"
            />

            {/* SIDEBAR */}

            <aside
                id="portal-sidebar"
                className={`portal-sidebar ${mobileOpen
                        ? "portal-sidebar--mobile-open"
                        : ""
                    }`}
                aria-label="Client portal sidebar"
            >
                {/* BRAND */}

                <div className="portal-sidebar__brand">
                    <NavLink
                        to="/portal"
                        className="portal-sidebar__brand-link"
                        aria-label="Colossus Client Portal"
                        onClick={handleNavigation}
                    >
                        <img
                            src={colossusLogo}
                            alt="Colossus"
                            className="portal-sidebar__logo"
                        />
                    </NavLink>

                    {/* MOBILE CLOSE BUTTON */}

                    <button
                        type="button"
                        className="portal-sidebar__mobile-close"
                        onClick={handleCloseMenu}
                        aria-label="Close navigation menu"
                    >
                        <HiOutlineX aria-hidden="true" />
                    </button>
                </div>

                {/* NAVIGATION */}

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
                                onClick={handleNavigation}
                                className={({ isActive }) =>
                                    `portal-sidebar__link ${isActive ? "active" : ""
                                    }`
                                }
                            >
                                <Icon
                                    className="portal-sidebar__icon"
                                    aria-hidden="true"
                                />

                                <span>{item.label}</span>
                            </NavLink>
                        );
                    })}
                </nav>

                {/* BOTTOM AREA */}

                <div className="portal-sidebar__bottom">
                    {/* HELP & SUPPORT */}

                    <div
                        className="portal-sidebar__link portal-sidebar__link--disabled"
                        aria-disabled="true"
                    >
                        <HiOutlineQuestionMarkCircle
                            className="portal-sidebar__icon"
                            aria-hidden="true"
                        />

                        <span>Help &amp; Support</span>

                        <small>Not available</small>
                    </div>

                    {/* LOGOUT */}

                    <button
                        type="button"
                        className="portal-sidebar__logout"
                        onClick={handleLogout}
                    >
                        <HiOutlineLogout
                            className="portal-sidebar__icon"
                            aria-hidden="true"
                        />

                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default PortalSidebar;
