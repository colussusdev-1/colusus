
import "./Footer.css";

import { Link } from "react-router-dom";

import {
    HiOutlineMail,
    HiOutlinePhone,
    HiOutlineLocationMarker,
    HiOutlineArrowRight,
    HiOutlineGlobeAlt,
} from "react-icons/hi";

import footerBackground from "../../../../assets/footer/footer-background.png";

const Footer = () => {
    /* =========================================================
       COMPANY LINKS
    ========================================================= */

    const companyLinks = [
        { label: "Home", to: "/" },
        { label: "About Us", to: "/about" },
        { label: "Contact", to: "/contact" },
        { label: "Book Consultation", to: "/consultation" },
    ];

    /* =========================================================
       SERVICE LINKS
    ========================================================= */

    const serviceLinks = [
        { label: "Canada Immigration", to: "/services/canada-migration" },
        { label: "Global Work Pathways", to: "/services/global-works" },
        { label: "Tourist Visa", to: "/services/tourist-visa" },
        { label: "Work Opportunities", to: "/opportunities/work" },
        { label: "Free Assessment", to: "/free-assessment" },
    ];

    /* =========================================================
       EXPLORE LINKS
    ========================================================= */

    const exploreLinks = [
        { label: "Canada Opportunities", to: "/opportunities/canada" },
        { label: "Germany Opportunities", to: "/opportunities/germany" },
        { label: "Bulgaria Opportunities", to: "/opportunities/bulgaria" },
    ];

    /* =========================================================
       CONTACT TEAM
    ========================================================= */

    const teamContacts = [
        {
            name: "Rose",
            phone: "+234 703 520 9306",
            href: "tel:+2347035209306",
        },
        {
            name: "Tony",
            role: "Migration Director",
            phone: "+234 902 695 3513",
            href: "tel:+2349026953513",
        },
        {
            name: "Blessing",
            phone: "+234 916 983 0624",
            href: "tel:+2349169830624",
        },
    ];

    const whatsappLink =
        "https://wa.me/2347035209306?text=Hello%20Colossus%20Migration%2C%20I%20would%20like%20to%20speak%20with%20an%20agent%20about%20my%20migration%20options.";

    return (
        <footer className="colossus-footer">
            {/* BACKGROUND */}

            <div
                className="colossus-footer-background"
                aria-hidden="true"
            >
                <div
                    className="colossus-footer-background-image"
                    style={{
                        backgroundImage: `url(${footerBackground})`,
                    }}
                />

                <div className="colossus-footer-background-overlay" />

                <div className="colossus-footer-glow colossus-footer-glow-one" />

                <div className="colossus-footer-glow colossus-footer-glow-two" />
            </div>

            {/* MAIN FOOTER */}

            <div className="colossus-footer-main">
                {/* BRAND AND CONTACT PANEL */}

                <section
                    className="
                        colossus-footer-panel
                        colossus-footer-brand-panel
                    "
                >
                    {/* BRAND */}

                    <div className="colossus-footer-brand">
                        <div className="colossus-footer-brand-mark">
                            <HiOutlineGlobeAlt />
                        </div>

                        <div className="colossus-footer-brand-name">
                            <strong>Colossus</strong>

                            <span>Migration &amp; Tours</span>
                        </div>
                    </div>

                    {/* DESCRIPTION */}

                    <p className="colossus-footer-description">
                        Helping professionals, students, families
                        and entrepreneurs achieve their global
                        goals through trusted immigration,
                        relocation and travel solutions.
                    </p>

                    {/* EXISTING CONTACT INFORMATION */}

                    <div className="colossus-footer-contact-list">
                        {/* EMAIL */}

                        <a
                            href="mailto:admin@colossusmigration.com"
                            className="colossus-footer-contact-item"
                        >
                            <span className="colossus-footer-contact-icon">
                                <HiOutlineMail />
                            </span>

                            <span>admin@colossusmigration.com</span>
                        </a>

                        {/* NIGERIA PHONE */}

                        <a
                            href="tel:+2347035209306"
                            className="colossus-footer-contact-item"
                        >
                            <span className="colossus-footer-contact-icon">
                                <HiOutlinePhone />
                            </span>

                            <span>+234 703 520 9306</span>
                        </a>

                        {/* LOCATION */}

                        <div className="colossus-footer-contact-item">
                            <span className="colossus-footer-contact-icon">
                                <HiOutlineLocationMarker />
                            </span>

                            <span>Lagos, Nigeria</span>
                        </div>

                        {/* WHATSAPP */}

                        <a
                            href={whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="colossus-footer-contact-item"
                        >
                            <span className="colossus-footer-contact-icon">
                                <HiOutlinePhone />
                            </span>

                            <span>
                                <strong>WHATSAPP</strong>
                                <br />
                                +234 703 520 9306
                            </span>

                            <HiOutlineArrowRight />
                        </a>

                        {/* CONTACT OUR TEAM */}

                        <div className="colossus-footer-team">
                            <h4>CONTACT OUR TEAM</h4>

                            {teamContacts.map((contact) => (
                                <a
                                    key={contact.name}
                                    href={contact.href}
                                    className="colossus-footer-contact-item"
                                >
                                    <span className="colossus-footer-contact-icon">
                                        <HiOutlinePhone />
                                    </span>

                                    <span>
                                        <strong>{contact.name}</strong>

                                        {contact.role && (
                                            <>
                                                <br />
                                                <small>
                                                    ({contact.role})
                                                </small>
                                                <br />
                                            </>
                                        )}

                                        {contact.phone}
                                    </span>
                                </a>
                            ))}
                        </div>

                        {/* UK OFFICE */}

                        <a
                            href="tel:+447455674027"
                            className="colossus-footer-contact-item"
                        >
                            <span className="colossus-footer-contact-icon">
                                <HiOutlinePhone />
                            </span>

                            <span>
                                <strong>UK OFFICE</strong>
                                <br />
                                +44 7455 674027
                            </span>
                        </a>
                    </div>
                </section>

                {/* COMPANY */}

                <section
                    className="
                        colossus-footer-panel
                        colossus-footer-links-panel
                    "
                >
                    <div className="colossus-footer-panel-heading">
                        <h3>Company</h3>
                    </div>

                    <nav className="colossus-footer-links">
                        {companyLinks.map((link) => (
                            <Link
                                key={link.label}
                                to={link.to}
                                className="colossus-footer-link"
                            >
                                <span className="colossus-footer-link-text">
                                    {link.label}
                                </span>

                                <HiOutlineArrowRight />
                            </Link>
                        ))}
                    </nav>
                </section>

                {/* SERVICES */}

                <section
                    className="
                        colossus-footer-panel
                        colossus-footer-links-panel
                    "
                >
                    <div className="colossus-footer-panel-heading">
                        <h3>Services</h3>
                    </div>

                    <nav className="colossus-footer-links">
                        {serviceLinks.map((link) => (
                            <Link
                                key={link.label}
                                to={link.to}
                                className="colossus-footer-link"
                            >
                                <span className="colossus-footer-link-text">
                                    {link.label}
                                </span>

                                <HiOutlineArrowRight />
                            </Link>
                        ))}
                    </nav>
                </section>

                {/* EXPLORE */}

                <section
                    className="
                        colossus-footer-panel
                        colossus-footer-links-panel
                    "
                >
                    <div className="colossus-footer-panel-heading">
                        <h3>Explore</h3>
                    </div>

                    <nav className="colossus-footer-links">
                        {exploreLinks.map((link) => (
                            <Link
                                key={link.label}
                                to={link.to}
                                className="colossus-footer-link"
                            >
                                <span className="colossus-footer-link-text">
                                    {link.label}
                                </span>

                                <HiOutlineArrowRight />
                            </Link>
                        ))}
                    </nav>
                </section>
            </div>

            {/* BOTTOM FOOTER */}

            <div className="colossus-footer-bottom">
                <div className="colossus-footer-bottom-inner">
                    <p>
                        © {new Date().getFullYear()} Colossus Migration
                        &amp; Tours. All rights reserved.
                    </p>

                    <div className="colossus-footer-bottom-links">
                        <Link to="/contact">Contact Us</Link>

                        <span>|</span>

                        <Link to="/about">About</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

