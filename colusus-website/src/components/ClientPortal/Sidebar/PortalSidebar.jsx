import {
    useEffect,
    useState,
} from "react";

import { NavLink } from "react-router-dom";

import {
    HiOutlineHome,
    HiOutlineDocumentText,
    HiOutlineFolderOpen,
    HiOutlineBell,
    HiOutlineUser,
    HiOutlineQuestionMarkCircle,
    HiOutlineLogout,
    HiOutlineX,
} from "react-icons/hi";

import "./PortalSidebar.css";

import colususLogo from "../../../assets/logo.png";


const PortalSidebar = () => {

    const [mobileOpen, setMobileOpen] = useState(false);


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


    /*
    ============================================================
    MOBILE MENU EVENTS
    ============================================================
    */

    useEffect(() => {

        const handleOpenMobileMenu = () => {

            setMobileOpen(true);

        };


        window.addEventListener(
            "colusus:open-mobile-menu",
            handleOpenMobileMenu,
        );


        return () => {

            window.removeEventListener(
                "colusus:open-mobile-menu",
                handleOpenMobileMenu,
            );

        };

    }, []);


    /*
    ============================================================
    LOCK BODY SCROLL
    ============================================================
    */

    useEffect(() => {

        if (mobileOpen) {

            document.body.classList.add(
                "portal-mobile-menu-open",
            );

        } else {

            document.body.classList.remove(
                "portal-mobile-menu-open",
            );

        }


        return () => {

            document.body.classList.remove(
                "portal-mobile-menu-open",
            );

        };

    }, [mobileOpen]);


    /*
    ============================================================
    ESCAPE KEY
    ============================================================
    */

    useEffect(() => {

        const handleKeyDown = (event) => {

            if (
                event.key === "Escape" &&
                mobileOpen
            ) {

                setMobileOpen(false);

            }

        };


        window.addEventListener(
            "keydown",
            handleKeyDown,
        );


        return () => {

            window.removeEventListener(
                "keydown",
                handleKeyDown,
            );

        };

    }, [mobileOpen]);


    /*
    ============================================================
    CLOSE AFTER NAVIGATION
    ============================================================
    */

    const handleNavigation = () => {

        setMobileOpen(false);

    };


    /*
    ============================================================
    LOGOUT
    ============================================================
    */

    const handleLogout = () => {

        localStorage.removeItem("token");

        localStorage.removeItem("user");


        window.dispatchEvent(
            new CustomEvent(
                "colusus:user-updated",
            ),
        );


        window.location.href = "/login";

    };


    /*
    ============================================================
    CLOSE MENU
    ============================================================
    */

    const handleCloseMenu = () => {

        setMobileOpen(false);

    };


    return (

        <>

            {/* =================================================
                MOBILE BACKDROP
            ================================================= */}

            <div
                className={
                    `portal-sidebar__mobile-backdrop ${mobileOpen
                        ? "is-open"
                        : ""
                    }`
                }
                onClick={handleCloseMenu}
                aria-hidden="true"
            />


            {/* =================================================
                SIDEBAR
            ================================================= */}

            <aside
                className={
                    `portal-sidebar ${mobileOpen
                        ? "portal-sidebar--mobile-open"
                        : ""
                    }`
                }
            >

                {/* =================================================
                    BRAND
                ================================================= */}

                <div className="portal-sidebar__brand">

                    <NavLink
                        to="/portal"
                        className="portal-sidebar__brand-link"
                        aria-label="Colusus Client Portal"
                        onClick={handleNavigation}
                    >

                        <img
                            src={colususLogo}
                            alt="Colusus"
                            className="portal-sidebar__logo"
                        />

                    </NavLink>


                    {/* =================================================
                        MOBILE CLOSE
                    ================================================= */}

                    <button
                        type="button"
                        className="portal-sidebar__mobile-close"
                        onClick={handleCloseMenu}
                        aria-label="Close navigation menu"
                    >

                        <HiOutlineX />

                    </button>

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
                                onClick={handleNavigation}
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
                        onClick={handleNavigation}
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

        </>

    );

};


export default PortalSidebar;