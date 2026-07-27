import { NavLink } from "react-router-dom";
import {
    HiOutlineX,
    HiOutlineSearch,
    HiChevronDown,
    HiOutlinePhone,
    HiOutlineMail,
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
    const toggleServices = () => {
        setServicesOpen((prev) => !prev);
    };

    return (
        <>
            <aside className={`mobile-menu ${menuOpen ? "active" : ""}`}>

                {/* Header */}

                <div className="mobile-header">

                    <img
                        src={logo}
                        alt="Colusus"
                    />

                    <button
                        type="button"
                        className="mobile-close"
                        onClick={closeMenu}
                    >
                        <HiOutlineX />
                    </button>

                </div>

                {/* Search */}

                <div className="mobile-search">

                    <HiOutlineSearch />

                    <input
                        type="text"
                        placeholder="Search..."
                    />

                </div>

                {/* Scrollable Navigation */}

                <div className="mobile-menu-body">

                    <div className="mobile-links">

                        {navLinks.map((item) => {

                            if (item.dropdown) {

                                return (

                                    <div
                                        key={item.name}
                                        className={`mobile-dropdown ${servicesOpen ? "open" : ""
                                            }`}
                                    >

                                        <button
                                            type="button"
                                            className="mobile-dropdown-btn"
                                            onClick={toggleServices}
                                        >

                                            <span>{item.name}</span>

                                            <HiChevronDown />

                                        </button>

                                        <div className="mobile-dropdown-menu">

                                            {item.dropdown.map((service) => (

                                                <NavLink
                                                    key={service.path}
                                                    to={service.path}
                                                    onClick={closeMenu}
                                                >
                                                    {service.name}
                                                </NavLink>

                                            ))}

                                        </div>

                                    </div>

                                );

                            }

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

                    </div>

                </div>

                {/* Fixed Bottom Contact */}

                <div className="mobile-contact-bar">

                    <a
                        href="tel:+2340000000000"
                        aria-label="Call"
                    >
                        <HiOutlinePhone />
                        <small>Call</small>
                    </a>

                    <a
                        href="https://wa.me/2340000000000"
                        target="_blank"
                        rel="noreferrer"
                        aria-label="WhatsApp"
                    >
                        <FaWhatsapp />
                        <small>Chat</small>
                    </a>

                    <a
                        href="mailto:info@colusus.com"
                        aria-label="Email"
                    >
                        <HiOutlineMail />
                        <small>Email</small>
                    </a>

                </div>

            </aside>

            {menuOpen && (
                <div
                    className="nav-overlay"
                    onClick={closeMenu}
                />
            )}
        </>
    );
};

export default MobileMenu;