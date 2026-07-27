import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
    HiOutlineMenuAlt3,
    HiOutlineSearch,
} from "react-icons/hi";

import "./Navbar.css";

import logo from "../../assets/logo.png";

import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";

const Navbar = () => {

    const [menuOpen, setMenuOpen] = useState(false);

    const [servicesOpen, setServicesOpen] = useState(false);

    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {

        const handleScroll = () => {

            setScrolled(window.scrollY > 20);

        };

        window.addEventListener("scroll", handleScroll);

        handleScroll();

        return () => {

            window.removeEventListener("scroll", handleScroll);

        };

    }, []);

    useEffect(() => {

        document.body.style.overflow = menuOpen ? "hidden" : "";

        return () => {

            document.body.style.overflow = "";

        };

    }, [menuOpen]);

    const closeMenu = () => {

        setMenuOpen(false);

        setServicesOpen(false);

    };

    return (
        <>
            <header
                className={`navbar ${scrolled ? "scrolled" : ""}`}
            >

                <div className="container navbar-container">

                    {/* Logo */}

                    <NavLink
                        to="/"
                        className="logo"
                        onClick={closeMenu}
                    >

                        <img
                            src={logo}
                            alt="Colossus Migration & Tours"
                        />

                    </NavLink>

                    {/* Desktop Navigation */}

                    <DesktopMenu
                        scrolled={scrolled}
                    />

                    {/* Right Actions */}

                    <div className="nav-actions">

                        <button
                            className="search-btn"
                            aria-label="Search"
                        >

                            <HiOutlineSearch />

                        </button>

                        <button
                            className="menu-btn"
                            aria-label="Open Menu"
                            onClick={() => setMenuOpen(true)}
                        >

                            <HiOutlineMenuAlt3 />

                        </button>

                    </div>

                </div>

            </header>

            {/* Mobile */}

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