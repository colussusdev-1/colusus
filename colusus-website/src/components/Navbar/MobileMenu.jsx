import { useCallback, useEffect, useRef } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

import {
    HiOutlineX,
    HiOutlineGlobeAlt,
    HiChevronDown,
    HiOutlinePhone,
    HiOutlineMail,
    HiOutlineUserCircle,
    HiOutlineArrowRight,
} from "react-icons/hi";

import { FaWhatsapp } from "react-icons/fa";

import navLinks from "./navLinks";
import logo from "../../assets/logo.png";

import "./MobileMenu.css";

const MobileMenu = ({
    menuOpen,
    servicesOpen,
    setServicesOpen,
    closeMenu,
}) => {
    const location = useLocation();
    const navigate = useNavigate();

    const drawerRef = useRef(null);
    const destinationPendingRef = useRef(false);
    const previousPathRef = useRef(location.pathname);

    /* ---------------------------------------------------------------------- */
    /* RESET SERVICES WHEN THE DRAWER CLOSES                                  */
    /* ---------------------------------------------------------------------- */

    useEffect(() => {
        if (!menuOpen) {
            setServicesOpen(false);
        }
    }, [menuOpen, setServicesOpen]);

    /* ---------------------------------------------------------------------- */
    /* DESTINATION NAVIGATION                                                 */
    /* ---------------------------------------------------------------------- */

    const scrollToDestinations = useCallback(() => {
        const section =
            document.getElementById("countries") ||
            document.getElementById("global-opportunities");

        const searchInput =
            document.getElementById("country-search");

        if (!section && !searchInput) {
            return false;
        }

        const target = section || searchInput;

        target.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });

        if (searchInput) {
            window.setTimeout(() => {
                searchInput.focus({
                    preventScroll: true,
                });
            }, 350);
        }

        return true;
    }, []);

    useEffect(() => {
        if (
            location.pathname === "/" &&
            destinationPendingRef.current
        ) {
            destinationPendingRef.current = false;

            window.requestAnimationFrame(() => {
                window.requestAnimationFrame(
                    scrollToDestinations
                );
            });
        }
    }, [location.pathname, scrollToDestinations]);

    /* ---------------------------------------------------------------------- */
    /* DESTINATIONS ACTION                                                    */
    /* ---------------------------------------------------------------------- */

    const handleDestinations = () => {
        closeMenu();

        if (location.pathname !== "/") {
            destinationPendingRef.current = true;
            navigate("/");
            return;
        }

        scrollToDestinations();
    };

    /* ---------------------------------------------------------------------- */
    /* SERVICES DROPDOWN                                                      */
    /* ---------------------------------------------------------------------- */

    const toggleServices = () => {
        setServicesOpen((previous) => !previous);
    };

    /* ---------------------------------------------------------------------- */
    /* CLOSE ON ESCAPE                                                        */
    /* ---------------------------------------------------------------------- */

    useEffect(() => {
        if (!menuOpen) {
            return undefined;
        }

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                closeMenu();
            }
        };

        document.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => {
            document.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };
    }, [menuOpen, closeMenu]);

    /* ---------------------------------------------------------------------- */
    /* CLOSE WHEN A ROUTE CHANGES                                             */
    /* ---------------------------------------------------------------------- */

    useEffect(() => {
        if (
            previousPathRef.current !== location.pathname
        ) {
            previousPathRef.current = location.pathname;

            if (!destinationPendingRef.current) {
                closeMenu();
            }
        }
    }, [location.pathname, closeMenu]);

    /* ---------------------------------------------------------------------- */
    /* RESTORE FOCUS WHEN OPENING                                             */
    /* ---------------------------------------------------------------------- */

    useEffect(() => {
        if (!menuOpen) {
            return;
        }

        const closeButton =
            drawerRef.current?.querySelector(
                ".mobile-close"
            );

        closeButton?.focus({
            preventScroll: true,
        });
    }, [menuOpen]);

    /* ---------------------------------------------------------------------- */
    /* RENDER                                                                 */
    /* ---------------------------------------------------------------------- */

    return (
        <>
            <aside
                ref={drawerRef}
                id="mobile-navigation"
                className={`mobile-menu ${menuOpen ? "active" : ""
                    }`}
                aria-label="Mobile navigation"
                aria-hidden={!menuOpen}
                inert={!menuOpen}
            >
                {/* HEADER */}

                <div className="mobile-header">
                    <NavLink
                        to="/"
                        className="mobile-brand"
                        onClick={closeMenu}
                        tabIndex={menuOpen ? 0 : -1}
                    >
                        <img
                            src={logo}
                            alt="Colossus Migration & Tours"
                        />
                    </NavLink>

                    <button
                        type="button"
                        className="mobile-close"
                        onClick={closeMenu}
                        aria-label="Close navigation menu"
                        tabIndex={menuOpen ? 0 : -1}
                    >
                        <HiOutlineX aria-hidden="true" />
                    </button>
                </div>

                {/* DESTINATIONS */}

                <div className="mobile-destination-action">
                    <button
                        type="button"
                        className="mobile-destinations-btn"
                        onClick={handleDestinations}
                        tabIndex={menuOpen ? 0 : -1}
                    >
                        <span className="mobile-destinations-icon">
                            <HiOutlineGlobeAlt aria-hidden="true" />
                        </span>

                        <span className="mobile-destinations-copy">
                            <strong>
                                Explore Destinations
                            </strong>

                            <small>
                                Discover countries and pathways
                            </small>
                        </span>

                        <HiOutlineArrowRight
                            className="mobile-action-arrow"
                            aria-hidden="true"
                        />
                    </button>
                </div>

                {/* SCROLLABLE NAVIGATION */}

                <div className="mobile-menu-body">
                    <div className="mobile-section-label">
                        EXPLORE COLOSSUS
                    </div>

                    <nav
                        className="mobile-links"
                        aria-label="Main navigation"
                    >
                        {navLinks.map((item) => {
                            /* SERVICES DROPDOWN */

                            if (item.dropdown) {
                                const isOpen = servicesOpen;

                                const servicesActive =
                                    item.dropdown.some(
                                        (service) =>
                                            location.pathname ===
                                            service.path ||
                                            location.pathname.startsWith(
                                                `${service.path}/`
                                            )
                                    );

                                return (
                                    <div
                                        key={item.name}
                                        className={[
                                            "mobile-dropdown",
                                            isOpen ? "open" : "",
                                            servicesActive
                                                ? "active"
                                                : "",
                                        ]
                                            .filter(Boolean)
                                            .join(" ")}
                                    >
                                        <button
                                            type="button"
                                            className="mobile-dropdown-btn"
                                            onClick={toggleServices}
                                            aria-expanded={isOpen}
                                            aria-controls="mobile-services-panel"
                                            aria-haspopup="true"
                                            tabIndex={
                                                menuOpen ? 0 : -1
                                            }
                                        >
                                            <span>
                                                {item.name}
                                            </span>

                                            <HiChevronDown
                                                className={
                                                    isOpen
                                                        ? "rotate"
                                                        : ""
                                                }
                                                aria-hidden="true"
                                            />
                                        </button>

                                        <div
                                            id="mobile-services-panel"
                                            className="mobile-dropdown-panel"
                                            aria-hidden={!isOpen}
                                            inert={!isOpen}
                                        >
                                            <div className="mobile-dropdown-menu">
                                                {item.dropdown.map(
                                                    (service) => {
                                                        const active =
                                                            location.pathname ===
                                                            service.path ||
                                                            location.pathname.startsWith(
                                                                `${service.path}/`
                                                            );

                                                        return (
                                                            <NavLink
                                                                key={
                                                                    service.path
                                                                }
                                                                to={
                                                                    service.path
                                                                }
                                                                onClick={
                                                                    closeMenu
                                                                }
                                                                tabIndex={
                                                                    menuOpen &&
                                                                        isOpen
                                                                        ? 0
                                                                        : -1
                                                                }
                                                                className={
                                                                    active
                                                                        ? "active"
                                                                        : ""
                                                                }
                                                            >
                                                                <span>
                                                                    {
                                                                        service.name
                                                                    }
                                                                </span>

                                                                <HiOutlineArrowRight
                                                                    aria-hidden="true"
                                                                />
                                                            </NavLink>
                                                        );
                                                    }
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            }

                            /* REGULAR NAVIGATION LINKS */

                            return (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    end={item.path === "/"}
                                    onClick={closeMenu}
                                    tabIndex={
                                        menuOpen ? 0 : -1
                                    }
                                    className={({ isActive }) =>
                                        `mobile-nav-link ${isActive ? "active" : ""
                                        }`
                                    }
                                >
                                    <span>{item.name}</span>

                                    <HiOutlineArrowRight
                                        aria-hidden="true"
                                    />
                                </NavLink>
                            );
                        })}
                    </nav>
                </div>

                {/* PRIMARY ACTIONS */}

                <div className="mobile-menu-actions">
                    <NavLink
                        to="/contact"
                        className="mobile-consultation-btn"
                        onClick={closeMenu}
                        tabIndex={menuOpen ? 0 : -1}
                    >
                        <span className="mobile-consultation-copy">
                            <strong>
                                Book a Consultation
                            </strong>

                            <small>
                                Let's discuss your plans
                            </small>
                        </span>

                        <HiOutlineArrowRight aria-hidden="true" />
                    </NavLink>

                    <NavLink
                        to="/login"
                        className="mobile-portal-btn"
                        onClick={closeMenu}
                        tabIndex={menuOpen ? 0 : -1}
                    >
                        <HiOutlineUserCircle aria-hidden="true" />

                        <span>Client Portal</span>
                    </NavLink>
                </div>

                {/* QUICK CONTACT */}

                <div className="mobile-contact-bar">
                    <a
                        href="tel:+2349026953513"
                        aria-label="Call Colossus Migration and Tours"
                        tabIndex={menuOpen ? 0 : -1}
                    >
                        <HiOutlinePhone aria-hidden="true" />
                        <small>Call</small>
                    </a>

                    <a
                        href="https://wa.me/2349026953513"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Chat with Colossus on WhatsApp"
                        tabIndex={menuOpen ? 0 : -1}
                    >
                        <FaWhatsapp aria-hidden="true" />
                        <small>WhatsApp</small>
                    </a>

                    <a
                        href="mailto:admin@colossusmigration.com"
                        aria-label="Email Colossus Migration and Tours"
                        tabIndex={menuOpen ? 0 : -1}
                    >
                        <HiOutlineMail aria-hidden="true" />
                        <small>Email</small>
                    </a>
                </div>
            </aside>

            {/* BACKDROP */}

            <button
                type="button"
                className={`nav-overlay ${menuOpen ? "active" : ""
                    }`}
                onClick={closeMenu}
                aria-label="Close navigation menu"
                aria-hidden={!menuOpen}
                tabIndex={menuOpen ? 0 : -1}
                inert={!menuOpen}
            />
        </>
    );
};

export default MobileMenu;