import { useCallback, useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

import {
    HiOutlineMenuAlt3,
    HiOutlineSearch,
    HiOutlineUserCircle,
    HiOutlineX,
} from "react-icons/hi";

import { HiArrowUpRight } from "react-icons/hi2";

import "./Navbar.css";

import logo from "../../assets/logo.png";

import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [servicesOpen, setServicesOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

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
    /* DESTINATION SEARCH                                                        */
    /* -------------------------------------------------------------------------- */

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

            // Allow the homepage to render before searching for the input.
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
                className={`navbar ${scrolled ? "scrolled" : ""} ${menuOpen ? "menu-is-open" : ""
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

                        {/* CLIENT LOGIN */}

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