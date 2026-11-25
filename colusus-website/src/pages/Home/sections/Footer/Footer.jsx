import "./Footer.css";
import { Link } from "react-router-dom";

import {
    HiOutlineMail,
    HiOutlinePhone,
    HiOutlineLocationMarker,
    HiOutlineArrowRight,
    HiOutlineGlobeAlt,
    HiOutlineClock,
    HiOutlineExternalLink,
    HiOutlineChatAlt2,
} from "react-icons/hi";

import footerBackground from "../../../../assets/footer/footer-background.png";

const companyLinks = [
    { label: "Home", to: "/" },
    { label: "About Us", to: "/about" },
    { label: "Contact Us", to: "/contact" },
    { label: "Book a Consultation", to: "/consultation" },
];

const serviceLinks = [
    { label: "Canada Immigration", to: "/services/canada-migration" },
    { label: "Global Work Pathways", to: "/services/global-works" },
    { label: "Tourist Visa", to: "/services/tourist-visa" },
    { label: "Work Opportunities", to: "/opportunities/work" },
    { label: "Free Assessment", to: "/free-assessment" },
];

const opportunityLinks = [
    { label: "Canada Opportunities", to: "/opportunities/canada" },
    { label: "Germany Opportunities", to: "/opportunities/germany" },
    { label: "Bulgaria Opportunities", to: "/opportunities/bulgaria" },
];

const contactNumbers = [
    {
        label: "Nigeria",
        number: "+234 703 520 9306",
        href: "tel:+2347035209306",
    },
    {
        label: "Additional line",
        number: "+234 902 695 3513",
        href: "tel:+2349026953513",
    },
    {
        label: "Additional line",
        number: "+234 916 983 0624",
        href: "tel:+2349169830624",
    },
    {
        label: "United Kingdom",
        number: "+44 7455 674027",
        href: "tel:+447455674027",
    },
];

const offices = [
    {
        country: "Canada",
        city: "Toronto, Ontario",
        address: "3500 Dufferin St, Toronto, ON M3K 1N2, Canada",
        mapQuery: "3500 Dufferin St, Toronto, ON M3K 1N2, Canada",
        mapLink:
            "https://www.google.com/maps/search/?api=1&query=3500+Dufferin+St%2C+Toronto%2C+ON+M3K+1N2%2C+Canada",
    },
    {
        country: "Nigeria",
        city: "Ikeja, Lagos",
        address: "16 Lateef Jakande Rd, Agidingbi, Ikeja 100248, Lagos",
        mapQuery: "16 Lateef Jakande Rd, Agidingbi, Ikeja 100248, Lagos",
        mapLink:
            "https://www.google.com/maps/search/?api=1&query=16+Lateef+Jakande+Rd%2C+Agidingbi%2C+Ikeja+100248%2C+Lagos",
    },
];

const whatsappLink =
    "https://wa.me/2347035209306?text=Hello%20Colossus%20Migration%2C%20I%20would%20like%20to%20speak%20with%20an%20agent%20about%20my%20migration%20options.";

function FooterLinkColumn({ title, links }) {
    return (
        <div className="colossus-footer__link-column">
            <h3>{title}</h3>

            <ul>
                {links.map((link) => (
                    <li key={link.to}>
                        <Link to={link.to}>
                            <HiOutlineArrowRight />
                            <span>{link.label}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function OfficeMapCard({ office }) {
    return (
        <article className="colossus-footer__office-card">
            <div className="colossus-footer__office-map">
                <iframe
                    title={`${office.country} office location map`}
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(
                        office.mapQuery
                    )}&output=embed`}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                />

                <a
                    href={office.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="colossus-footer__map-open"
                    aria-label={`Open ${office.country} office in Google Maps`}
                >
                    <HiOutlineExternalLink />
                    Open map
                </a>
            </div>

            <div className="colossus-footer__office-details">
                <div className="colossus-footer__office-heading">
                    <div className="colossus-footer__office-icon">
                        <HiOutlineLocationMarker />
                    </div>

                    <div>
                        <span className="colossus-footer__eyebrow">
                            OUR OFFICE
                        </span>
                        <h3>{office.country} Office</h3>
                        <p>{office.city}</p>
                    </div>
                </div>

                <a
                    href={office.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="colossus-footer__office-address"
                >
                    {office.address}
                    <HiOutlineExternalLink />
                </a>
            </div>
        </article>
    );
}

function Footer() {
    return (
        <footer className="colossus-footer">
            <div
                className="colossus-footer__background"
                style={{ backgroundImage: `url(${footerBackground})` }}
            />

            <div className="colossus-footer__overlay" />

            <div className="colossus-footer__container">
                {/* TOP CTA */}
                <section className="colossus-footer__cta">
                    <div className="colossus-footer__cta-content">
                        <span className="colossus-footer__eyebrow">
                            YOUR JOURNEY STARTS HERE
                        </span>

                        <h2>
                            A world of opportunities.
                            <br />
                            <span>A future without limits.</span>
                        </h2>

                        <p>
                            Whether you're planning to work, study, visit or relocate,
                            we're here to help you take the next step with confidence.
                        </p>
                    </div>

                    <div className="colossus-footer__cta-actions">
                        <Link
                            to="/consultation"
                            className="colossus-footer__primary-button"
                        >
                            Book a consultation
                            <HiOutlineArrowRight />
                        </Link>

                        <Link
                            to="/free-assessment"
                            className="colossus-footer__secondary-button"
                        >
                            Get a free assessment
                        </Link>
                    </div>
                </section>

                {/* BRAND AND NAVIGATION */}
                <section className="colossus-footer__main">
                    <div className="colossus-footer__brand">
                        <Link to="/" className="colossus-footer__brand-name">
                            <span className="colossus-footer__brand-symbol">
                                <HiOutlineGlobeAlt />
                            </span>

                            <span>
                                <strong>COLOSSUS</strong>
                                <small>MIGRATION & TOURS</small>
                            </span>
                        </Link>

                        <p>
                            Connecting people to global opportunities through
                            trusted migration guidance, professional support and
                            practical pathways to a better future.
                        </p>

                        <div className="colossus-footer__brand-note">
                            <span className="colossus-footer__status-dot" />
                            Your journey. Our guidance. Global possibilities.
                        </div>
                    </div>

                    <FooterLinkColumn
                        title="Company"
                        links={companyLinks}
                    />

                    <FooterLinkColumn
                        title="Our Services"
                        links={serviceLinks}
                    />

                    <FooterLinkColumn
                        title="Explore"
                        links={opportunityLinks}
                    />

                    {/* CONTACT PANEL */}
                    <div className="colossus-footer__contact">
                        <h3>Get in touch</h3>

                        <p className="colossus-footer__contact-intro">
                            Have a question about your migration options? Speak
                            with our team.
                        </p>

                        <a
                            href="mailto:admin@colossusmigration.com"
                            className="colossus-footer__contact-email"
                        >
                            <span className="colossus-footer__contact-icon">
                                <HiOutlineMail />
                            </span>

                            <span>
                                <small>EMAIL OUR TEAM</small>
                                <strong>admin@colossusmigration.com</strong>
                            </span>
                        </a>

                        <div className="colossus-footer__phone-list">
                            {contactNumbers.map((contact, index) => (
                                <a href={contact.href} key={`${contact.href}-${index}`}>
                                    <HiOutlinePhone />
                                    <span>
                                        <small>{contact.label}</small>
                                        <strong>{contact.number}</strong>
                                    </span>
                                </a>
                            ))}
                        </div>

                        <a
                            href={whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="colossus-footer__whatsapp"
                        >
                            <HiOutlineChatAlt2 />
                            Chat with us on WhatsApp
                            <HiOutlineArrowRight />
                        </a>
                    </div>
                </section>

                {/* OFFICE LOCATIONS */}
                <section className="colossus-footer__locations">
                    <div className="colossus-footer__section-heading">
                        <div>
                            <span className="colossus-footer__eyebrow">
                                FIND US
                            </span>

                            <h2>Our office locations</h2>

                            <p>
                                Wherever you're planning to go, we're here to help
                                you move forward.
                            </p>
                        </div>

                        <div className="colossus-footer__location-caption">
                            <HiOutlineGlobeAlt />
                            <span>Connecting you to the world</span>
                        </div>
                    </div>

                    <div className="colossus-footer__office-grid">
                        {offices.map((office) => (
                            <OfficeMapCard
                                key={office.country}
                                office={office}
                            />
                        ))}
                    </div>
                </section>

                {/* BOTTOM BAR */}
                <section className="colossus-footer__bottom">
                    <div className="colossus-footer__copyright">
                        <span>
                            © {new Date().getFullYear()} Colossus Migration & Tours.
                        </span>
                        <span>All rights reserved.</span>
                    </div>

                    <div className="colossus-footer__bottom-links">
                        <Link to="/about">About Colossus</Link>
                        <Link to="/contact">Contact</Link>
                        <Link to="/consultation">Consultation</Link>
                    </div>

                    <div className="colossus-footer__bottom-location">
                        <HiOutlineLocationMarker />
                        <span>Canada · Nigeria</span>
                    </div>
                </section>
            </div>
        </footer>
    );
}

export default Footer;