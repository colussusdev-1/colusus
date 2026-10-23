
import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

import { HiChevronDown } from "react-icons/hi";
import { HiArrowUpRight } from "react-icons/hi2";

import navLinks from "./navLinks";
import "./DesktopMenu.css";

const DesktopMenu = ({
  closeMenu = () => { },
}) => {
  const location = useLocation();

  const [openDropdown, setOpenDropdown] = useState(null);

  const navRef = useRef(null);

  /* -------------------------------------------------------------------------- */
  /* CLOSE DROPDOWN WHEN ROUTE CHANGES                                          */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    setOpenDropdown(null);
  }, [location.pathname]);

  /* -------------------------------------------------------------------------- */
  /* LISTEN FOR EXPLORE SERVICES BUTTON                                         */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    const handleOpenServices = () => {
      const servicesItem = navLinks.find(
        (item) =>
          item.dropdown &&
          item.name.toLowerCase() === "services"
      );

      if (servicesItem) {
        setOpenDropdown(servicesItem.name);
      }
    };

    window.addEventListener(
      "colossus:open-services-dropdown",
      handleOpenServices
    );

    return () => {
      window.removeEventListener(
        "colossus:open-services-dropdown",
        handleOpenServices
      );
    };
  }, []);

  /* -------------------------------------------------------------------------- */
  /* CLOSE DROPDOWN WHEN CLICKING OUTSIDE                                       */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        navRef.current &&
        !navRef.current.contains(event.target)
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener(
      "pointerdown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "pointerdown",
        handleOutsideClick
      );
    };
  }, []);

  /* -------------------------------------------------------------------------- */
  /* DROPDOWN ACTIONS                                                           */
  /* -------------------------------------------------------------------------- */

  const toggleDropdown = (name) => {
    setOpenDropdown((current) =>
      current === name ? null : name
    );
  };

  const closeDropdown = () => {
    setOpenDropdown(null);
  };

  const handleLinkClick = () => {
    closeDropdown();
    closeMenu();
  };

  /* -------------------------------------------------------------------------- */
  /* KEYBOARD ACCESSIBILITY                                                     */
  /* -------------------------------------------------------------------------- */

  const handleKeyDown = (event) => {
    if (event.key === "Escape" && openDropdown) {
      closeDropdown();
      event.preventDefault();
    }
  };

  /* -------------------------------------------------------------------------- */
  /* RENDER                                                                     */
  /* -------------------------------------------------------------------------- */

  return (
    <nav
      ref={navRef}
      className="desktop-nav"
      aria-label="Main navigation"
      onKeyDown={handleKeyDown}
    >
      {navLinks.map((item) => {
        /* ------------------------------------------------------------------ */
        /* SERVICES DROPDOWN                                                   */
        /* ------------------------------------------------------------------ */

        if (item.dropdown) {
          const isOpen =
            openDropdown === item.name;

          const servicesActive =
            item.dropdown.some(
              (service) =>
                location.pathname === service.path ||
                location.pathname.startsWith(
                  `${service.path}/`
                )
            );

          return (
            <div
              key={item.name}
              className={[
                "desktop-dropdown",
                servicesActive ? "active" : "",
                isOpen ? "is-open" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {/* Dropdown trigger */}

              <button
                type="button"
                className={[
                  "desktop-nav-link",
                  "dropdown-btn",
                  servicesActive ? "active" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                aria-haspopup="true"
                aria-expanded={isOpen}
                onClick={() =>
                  toggleDropdown(item.name)
                }
              >
                <span>{item.name}</span>

                <HiChevronDown
                  className={[
                    "dropdown-icon",
                    isOpen ? "rotate" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  aria-hidden="true"
                />
              </button>

              {/* Existing dropdown panel */}

              <div
                className={[
                  "desktop-dropdown-menu",
                  isOpen ? "show" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                aria-label={`${item.name} menu`}
                aria-hidden={!isOpen}
                inert={!isOpen}
              >
                <div className="dropdown-heading">
                  <span className="dropdown-eyebrow">
                    EXPLORE OUR SERVICES
                  </span>

                  <span className="dropdown-title">
                    Find your pathway
                  </span>
                </div>

                <div className="dropdown-links">
                  {item.dropdown.map((service) => {
                    const serviceActive =
                      location.pathname === service.path ||
                      location.pathname.startsWith(
                        `${service.path}/`
                      );

                    return (
                      <NavLink
                        key={service.path}
                        to={service.path}
                        onClick={handleLinkClick}
                        className={[
                          "dropdown-link",
                          serviceActive ? "active" : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        tabIndex={isOpen ? 0 : -1}
                      >
                        <span className="dropdown-link-text">
                          {service.name}
                        </span>

                        <HiArrowUpRight
                          className="dropdown-link-icon"
                          aria-hidden="true"
                        />
                      </NavLink>
                    );
                  })}
                </div>

                <div className="dropdown-footer">
                  <span>
                    Not sure which pathway is right for you?
                  </span>

                  <NavLink
                    to="/contact"
                    onClick={handleLinkClick}
                  >
                    Talk to our team
                    <HiArrowUpRight aria-hidden="true" />
                  </NavLink>
                </div>
              </div>
            </div>
          );
        }

        /* ------------------------------------------------------------------ */
        /* STANDARD NAVIGATION LINKS                                           */
        /* ------------------------------------------------------------------ */

        return (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            onClick={handleLinkClick}
            className={({ isActive }) =>
              [
                "desktop-nav-link",
                "nav-link",
                isActive ? "active" : "",
              ]
                .filter(Boolean)
                .join(" ")
            }
          >
            {item.name}
          </NavLink>
        );
      })}
    </nav>
  );
};

export default DesktopMenu;

