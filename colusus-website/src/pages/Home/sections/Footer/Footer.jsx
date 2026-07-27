import "./Footer.css";

import { Link } from "react-router-dom";

import {
    HiOutlineShoppingBag,
    HiOutlineNewspaper,
    HiOutlineMail,
    HiOutlinePhone,
    HiOutlineGlobeAlt,
} from "react-icons/hi";

const Footer = () => {
    return (
        <footer className="footer">

            <div className="footer-main">

                <div className="container footer-grid">

                    {/* ABOUT */}
                    <div className="footer-col about">

                        <h3>About</h3>

                        <p>
                            Colossus Migration & Tours helps professionals,
                            students, families and entrepreneurs relocate
                            confidently through trusted immigration, verified
                            overseas opportunities and expert travel guidance.
                        </p>

                        <div className="contact">

                            <div className="contact-item">
                                <HiOutlineMail />
                                <span>admin@colossusmigration.com</span>
                            </div>

                            <div className="contact-item">
                                <HiOutlinePhone />
                                <span>+234-703-520-9306</span>
                            </div>

                            <div className="contact-item">
                                <HiOutlinePhone />
                                <span>+234-902-695-3513</span>
                            </div>

                        </div>

                    </div>

                    {/* QUICK LINKS */}
                    <div className="footer-col">

                        <h3>Quick Links</h3>

                        <ul>

                            <li>
                                <Link to="/">Home</Link>
                            </li>

                            <li>
                                <Link to="/about">About Us</Link>
                            </li>

                            <li>
                                <Link to="/offshore-company">
                                    Offshore Company Formation
                                </Link>
                            </li>

                            <li>
                                <Link to="/overseas-job-matching">
                                    Overseas Job Matching
                                </Link>
                            </li>

                        </ul>

                        <div className="footer-actions">

                            <button className="footer-pill">

                                <HiOutlineShoppingBag />

                                <span>Shop</span>

                            </button>

                            <button className="footer-pill">

                                <HiOutlineNewspaper />

                                <span>Blog</span>

                            </button>

                        </div>

                    </div>

                    {/* SERVICES */}
                    <div className="footer-col">

                        <h3>Our Services</h3>

                        <ul>

                            <li>
                                <Link to="/services">
                                    Canada Immigration
                                </Link>
                            </li>

                            <li>
                                <Link to="/services">
                                    Global Work Pathways
                                </Link>
                            </li>

                            <li>
                                <Link to="/services">
                                    Tourist Visas
                                </Link>
                            </li>

                            <li>
                                <Link to="/services">
                                    Study Permits
                                </Link>
                            </li>

                        </ul>

                    </div>

                    {/* NEWSLETTER */}
                    <div className="footer-col newsletter-card">

                        <h3>Newsletter</h3>

                        <p>
                            Get migration updates, visa opportunities and
                            exclusive announcements directly in your inbox.
                        </p>

                        <div className="newsletter">

                            <input
                                type="email"
                                placeholder="Email address"
                            />

                            <button>
                                GO
                            </button>

                        </div>

                        <div className="newsletter-note">

                            <HiOutlineGlobeAlt />

                            <span>
                                Trusted by applicants across multiple countries.
                            </span>

                        </div>

                    </div>

                </div>

            </div>

            <div className="footer-bottom">

                <p>
                    © 2026 Colossus Migration & Tours. All rights reserved.
                </p>

            </div>

        </footer>
    );
};

export default Footer;