import { useCallback, useEffect, useState } from "react";
import {
    NavLink,
    useLocation,
    useNavigate,
} from "react-router-dom";

import {
    HiOutlineMenuAlt3,
    HiOutlineSearch,
    HiOutlineUserCircle,
    HiOutlineX,
} from "react-icons/hi";

import { HiArrowUpRight } from "react-icons/hi2";

import authService from "../../services/authService";

import "./Navbar.css";

import logo from "../../assets/logo.png";

import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [servicesOpen, setServicesOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const [authenticated, setAuthenticated] = useState(() =>
        authService.isAuthenticated()
    );

    const location = useLocation();
    const navigate = useNavigate();

    /* -------------------------------------------------------------------------- */
    /* AUTHENTICATION STATE                                                       */
    /* -------------------------------------------------------------------------- */

    const refreshAuthentication = useCallback(() => {
        setAuthenticated(authService.isAuthenticated());
    }, []);

    useEffect(() => {
        // Recheck whenever the current route changes.
        refreshAuthentication();
    }, [
        location.pathname,
        location.key,
        refreshAuthentication,
    ]);

    useEffect(() => {
        // Recheck when the user returns to the browser tab.
        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                refreshAuthentication();
            }
        };

        const handleStorageChange = (event) => {
            if (
                event.key === "colossus_token" ||
                event.key === null
            ) {
                refreshAuthentication();
            }
        };

        window.addEventListener(
            "focus",
            refreshAuthentication
        );

        document.addEventListener(
            "visibilitychange",
            handleVisibilityChange
        );

        window.addEventListener(
            "storage",
            handleStorageChange
        );

        return () => {
            window.removeEventListener(
                "focus",
                refreshAuthentication
            );

            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            );

            window.removeEventListener(
                "storage",
                handleStorageChange
            );
        };
    }, [refreshAuthentication]);

    /* -------------------------------------------------------------------------- */
    /* SCROLL STATE                                                               */
    /* -------------------------------------------------------------------------- */

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 12);
        };

        handleScroll();

        window.addEventListener("scroll", handleScroll, {
            passive: true,
        });

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    /* -------------------------------------------------------------------------- */
    /* MOBILE SCROLL LOCK                                                         */
    /* -------------------------------------------------------------------------- */

    useEffect(() => {
        document.body.style.overflow = menuOpen ? "hidden" : "";

        return () => {
            document.body.style.overflow = "";
        };
    }, [menuOpen]);

    /* -------------------------------------------------------------------------- */
    /* ROUTE CHANGES                                                              */
    /* -------------------------------------------------------------------------- */

    useEffect(() => {
        setMenuOpen(false);
        setServicesOpen(false);
    }, [location.pathname]);

    /* -------------------------------------------------------------------------- */
    /* MENU ACTIONS                                                               */
    /* -------------------------------------------------------------------------- */

    const closeMenu = useCallback(() => {
        setMenuOpen(false);
        setServicesOpen(false);
    }, []);

    const toggleMobileMenu = () => {
        setMenuOpen((previous) => !previous);
    };

    /* -------------------------------------------------------------------------- */
    /* CLIENT DASHBOARD                                                           */
    /* -------------------------------------------------------------------------- */

    const handleDashboardClick = (event) => {
        closeMenu();

        // Prevent a full-page navigation.
        event.preventDefault();

        // Recheck the stored authentication state before navigating.
        const isLoggedIn = authService.isAuthenticated();

        setAuthenticated(isLoggedIn);

        if (isLoggedIn) {
            navigate("/portal");
        } else {
            navigate("/login");
        }
    };

    /* -------------------------------------------------------------------------- */
    /* DESTINATION SEARCH                                                         */
    /* -------------------------------------------------------------------------- */

    const handleSearch = () => {
        closeMenu();

        const focusSearch = () => {
            const searchInput =
                document.getElementById("country-search");

            if (searchInput) {
                searchInput.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });

                window.setTimeout(() => {
                    searchInput.focus({
                        preventScroll: true,
                    });
                }, 350);

                return;
            }

            const countriesSection =
                document.getElementById("countries") ||
                document.getElementById("global-opportunities");

            countriesSection?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        };

        if (location.pathname !== "/") {
            navigate("/");

            window.setTimeout(focusSearch, 450);

            return;
        }

        focusSearch();
    };

    /* -------------------------------------------------------------------------- */
    /* RENDER                                                                     */
    /* -------------------------------------------------------------------------- */

    return (
        <>
            <header
                className={`navbar ${scrolled ? "scrolled" : ""
                    } ${menuOpen ? "menu-is-open" : ""
                    }`}
            >
                <div className="navbar-container">

                    {/* BRAND */}

                    <NavLink
                        to="/"
                        className="navbar-brand"
                        aria-label="Colossus Migration and Tours home"
                        onClick={closeMenu}
                    >
                        <img
                            src={logo}
                            alt="Colossus Migration & Tours"
                            className="navbar-logo"
                        />
                    </NavLink>

                    {/* DESKTOP NAVIGATION */}

                    <div className="navbar-navigation">
                        <DesktopMenu closeMenu={closeMenu} />
                    </div>

                    {/* ACTIONS */}

                    <div className="nav-actions">

                        {/* DESTINATION SEARCH */}

                        <button
                            type="button"
                            className="nav-search-btn"
                            aria-label="Search destinations"
                            onClick={handleSearch}
                        >
                            <HiOutlineSearch aria-hidden="true" />

                            <span className="nav-search-label">
                                Destinations
                            </span>
                        </button>

                        {/* CLIENT ACCOUNT */}

                        {authenticated ? (
                            <NavLink
                                to="/portal"
                                className={({ isActive }) =>
                                    `nav-login-btn ${isActive ? "active" : ""
                                    }`
                                }
                                onClick={handleDashboardClick}
                            >
                                <HiOutlineUserCircle
                                    className="nav-login-icon"
                                    aria-hidden="true"
                                />

                                <span>My Dashboard</span>
                            </NavLink>
                        ) : (
                            <NavLink
                                to="/login"
                                className={({ isActive }) =>
                                    `nav-login-btn ${isActive ? "active" : ""
                                    }`
                                }
                                onClick={closeMenu}
                            >
                                <HiOutlineUserCircle
                                    className="nav-login-icon"
                                    aria-hidden="true"
                                />

                                <span>Client Login</span>
                            </NavLink>
                        )}

                        {/* CONSULTATION CTA */}

                        <NavLink
                            to="/contact"
                            className="nav-consultation-btn"
                            onClick={closeMenu}
                        >
                            <span>Book a Consultation</span>

                            <HiArrowUpRight aria-hidden="true" />
                        </NavLink>

                        {/* MOBILE MENU TOGGLE */}

                        <button
                            type="button"
                            className={`menu-btn ${menuOpen ? "active" : ""
                                }`}
                            aria-label={
                                menuOpen
                                    ? "Close navigation"
                                    : "Open navigation"
                            }
                            aria-expanded={menuOpen}
                            aria-controls="mobile-navigation"
                            onClick={toggleMobileMenu}
                        >
                            {menuOpen ? (
                                <HiOutlineX aria-hidden="true" />
                            ) : (
                                <HiOutlineMenuAlt3 aria-hidden="true" />
                            )}
                        </button>

                    </div>
                </div>
            </header>

            {/* MOBILE NAVIGATION */}

            <MobileMenu
                menuOpen={menuOpen}
                servicesOpen={servicesOpen}
                setServicesOpen={setServicesOpen}
                closeMenu={closeMenu}
                scrolled={scrolled}
            />
        </>
    );
};

export default Navbar;