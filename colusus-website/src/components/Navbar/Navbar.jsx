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

const EXPLORE_SERVICES_EVENT = "colossus:explore-services";
const OPEN_DESKTOP_SERVICES_EVENT = "colossus:open-services-dropdown";

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [servicesOpen, setServicesOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const [authenticated, setAuthenticated] = useState(() =>
        authService.isAuthenticated()
    );

    const location = useLocation();
    const navigate = useNavigate();

    /* ---------------------------------------------------------------------- */
    /* AUTHENTICATION                                                         */
    /* ---------------------------------------------------------------------- */

    const refreshAuthentication = useCallback(() => {
        setAuthenticated(authService.isAuthenticated());
    }, []);

    useEffect(() => {
        refreshAuthentication();
    }, [location.pathname, location.key, refreshAuthentication]);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                refreshAuthentication();
            }
        };

        const handleStorageChange = (event) => {
            if (event.key === "colossus_token" || event.key === null) {
                refreshAuthentication();
            }
        };

        window.addEventListener("focus", refreshAuthentication);
        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("focus", refreshAuthentication);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("storage", handleStorageChange);
        };
    }, [refreshAuthentication]);

    /* ---------------------------------------------------------------------- */
    /* SCROLL STATE                                                            */
    /* ---------------------------------------------------------------------- */

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 12);

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    /* ---------------------------------------------------------------------- */
    /* MOBILE SCROLL LOCK                                                      */
    /* ---------------------------------------------------------------------- */

    useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = menuOpen ? "hidden" : "";

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [menuOpen]);

    /* ---------------------------------------------------------------------- */
    /* ROUTE CHANGES                                                           */
    /* ---------------------------------------------------------------------- */

    useEffect(() => {
        setMenuOpen(false);
        setServicesOpen(false);
    }, [location.pathname]);

    /* ---------------------------------------------------------------------- */
    /* MENU ACTIONS                                                            */
    /* ---------------------------------------------------------------------- */

    const closeMenu = useCallback(() => {
        setMenuOpen(false);
        setServicesOpen(false);
    }, []);

    const toggleMobileMenu = useCallback(() => {
        setMenuOpen((previous) => {
            const next = !previous;
            if (!next) setServicesOpen(false);
            return next;
        });
    }, []);

    /* ---------------------------------------------------------------------- */
    /* EXPLORE SERVICES: HERO -> EXISTING NAVBAR MENU                          */
    /* ---------------------------------------------------------------------- */

    const handleExploreServices = useCallback(() => {
        const isMobile = window.matchMedia("(max-width: 900px)").matches;

        if (isMobile) {
            // Set Services open before showing the drawer so it renders expanded.
            setServicesOpen(true);
            setMenuOpen(true);
            return;
        }

        setMenuOpen(false);
        setServicesOpen(false);

        window.dispatchEvent(new CustomEvent(OPEN_DESKTOP_SERVICES_EVENT));
    }, []);

    useEffect(() => {
        window.addEventListener(EXPLORE_SERVICES_EVENT, handleExploreServices);

        return () => {
            window.removeEventListener(
                EXPLORE_SERVICES_EVENT,
                handleExploreServices
            );
        };
    }, [handleExploreServices]);

    /* ---------------------------------------------------------------------- */
    /* CLIENT DASHBOARD                                                        */
    /* ---------------------------------------------------------------------- */

    const handleDashboardClick = (event) => {
        event.preventDefault();
        closeMenu();

        const isLoggedIn = authService.isAuthenticated();
        setAuthenticated(isLoggedIn);
        navigate(isLoggedIn ? "/portal" : "/login");
    };

    /* ---------------------------------------------------------------------- */
    /* DESTINATION SEARCH                                                      */
    /* ---------------------------------------------------------------------- */

    const handleSearch = () => {
        closeMenu();

        const focusSearch = () => {
            const searchInput = document.getElementById("country-search");

            if (searchInput) {
                searchInput.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });

                window.setTimeout(() => {
                    searchInput.focus({ preventScroll: true });
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

    /* ---------------------------------------------------------------------- */
    /* RENDER                                                                  */
    /* ---------------------------------------------------------------------- */

    return (
        <>
            <header
                className={[
                    "navbar",
                    scrolled ? "scrolled" : "",
                    menuOpen ? "menu-is-open" : "",
                ].filter(Boolean).join(" ")}
            >
                <div className="navbar-container">
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

                    <div className="navbar-navigation">
                        <DesktopMenu closeMenu={closeMenu} />
                    </div>

                    <div className="nav-actions">
                        <button
                            type="button"
                            className="nav-search-btn"
                            aria-label="Search destinations"
                            onClick={handleSearch}
                        >
                            <HiOutlineSearch aria-hidden="true" />
                            <span className="nav-search-label">Destinations</span>
                        </button>

                        {authenticated ? (
                            <NavLink
                                to="/portal"
                                className={({ isActive }) =>
                                    `nav-login-btn ${isActive ? "active" : ""}`
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
                                    `nav-login-btn ${isActive ? "active" : ""}`
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

                        <NavLink
                            to="/contact"
                            className="nav-consultation-btn"
                            onClick={closeMenu}
                        >
                            <span>Book a Consultation</span>
                            <HiArrowUpRight aria-hidden="true" />
                        </NavLink>

                        <button
                            type="button"
                            className={`menu-btn ${menuOpen ? "active" : ""}`}
                            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
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
