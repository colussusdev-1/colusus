import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import { HiChevronDown } from "react-icons/hi";

import navLinks from "./navLinks";
import "./DesktopMenu.css";

const DesktopMenu = ({ closeMenu = () => {} }) => {

  const location = useLocation();

  const [openDropdown, setOpenDropdown] = useState(null);

  const handleOpen = (name) => {
    setOpenDropdown(name);
  };

  const handleClose = () => {
    setOpenDropdown(null);
  };

  return (
    <nav className="desktop-nav">

      {navLinks.map((item) => {

        /* =========================
           DROPDOWN ITEM (SERVICES)
        ========================= */

        if (item.dropdown) {

          const isOpen = openDropdown === item.name;

          const servicesActive =
            location.pathname.startsWith("/services");

          return (
            <div
              key={item.name}
              className={`dropdown ${
                servicesActive ? "active" : ""
              }`}
              onMouseEnter={() => handleOpen(item.name)}
              onMouseLeave={handleClose}
            >

              {/* TRIGGER */}
              <button
                type="button"
                className="dropdown-btn"
                aria-haspopup="true"
                aria-expanded={isOpen}
                onClick={() =>
                  setOpenDropdown(isOpen ? null : item.name)
                }
              >

                <span>{item.name}</span>

                <HiChevronDown
                  className={`dropdown-icon ${
                    isOpen ? "rotate" : ""
                  }`}
                />

              </button>

              {/* MENU */}
              <div
                className={`dropdown-menu ${
                  isOpen ? "show" : ""
                }`}
              >

                {item.dropdown.map((service) => (

                  <NavLink
                    key={service.path}
                    to={service.path}
                    onClick={() => {
                      closeMenu();
                      handleClose();
                    }}
                    className={({ isActive }) =>
                      isActive ? "active" : ""
                    }
                  >

                    {service.name}

                  </NavLink>

                ))}

              </div>

            </div>
          );
        }

        /* =========================
           NORMAL LINK
        ========================= */

        return (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={closeMenu}
            className={({ isActive }) =>
              isActive ? "active" : ""
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