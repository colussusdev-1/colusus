import "./TouristHero.css";

import {
    HiOutlineArrowRight,
    HiOutlineGlobeAlt,
    HiOutlineShieldCheck,
    HiOutlineDocumentText,
    HiOutlineCheckCircle,
    HiOutlineLocationMarker,
} from "react-icons/hi";

import { Link } from "react-router-dom";

import heroImage from "../../../../assets/tourist/travel-hero.jpg";


const TouristHero = () => {

    return (

        <section
            className="tourist-hero"
            style={{
                "--tourist-hero-image": `url(${heroImage})`,
            }}
        >

            {/* =====================================================
                FULL BACKGROUND
            ===================================================== */}

            <div
                className="tourist-hero-background"
                aria-hidden="true"
            >

                <div className="tourist-hero-image-layer"></div>

                <div className="tourist-hero-overlay"></div>

                <div className="tourist-hero-light"></div>

                <div className="tourist-hero-vignette"></div>

            </div>


            {/* =====================================================
                ATMOSPHERIC DECORATION
            ===================================================== */}

            <div
                className="tourist-hero-atmosphere"
                aria-hidden="true"
            >

                <span className="tourist-orbit orbit-one"></span>

                <span className="tourist-orbit orbit-two"></span>

                <span className="tourist-hero-dot dot-one"></span>

                <span className="tourist-hero-dot dot-two"></span>

                <span className="tourist-hero-dot dot-three"></span>

            </div>


            {/* =====================================================
                MAIN CONTENT
            ===================================================== */}

            <div className="tourist-hero-container">

                <div className="tourist-hero-content">


                    {/* =================================================
                        EYEBROW
                    ================================================= */}

                    <div className="tourist-hero-tag">

                        <span className="tourist-hero-tag-icon">

                            <HiOutlineGlobeAlt />

                        </span>

                        <span>
                            GLOBAL TRAVEL SERVICES
                        </span>

                    </div>


                    {/* =================================================
                        HEADING
                    ================================================= */}

                    <h1 className="tourist-hero-title">

                        Explore The World

                        <span>
                            Without The Stress.
                        </span>

                    </h1>


                    {/* =================================================
                        TITLE ACCENT
                    ================================================= */}

                    <div
                        className="tourist-hero-accent"
                        aria-hidden="true"
                    >

                        <span></span>

                        <span></span>

                    </div>


                    {/* =================================================
                        DESCRIPTION
                    ================================================= */}

                    <p className="tourist-hero-description">

                        From visa assessment to application preparation,
                        we guide you through every step of your
                        international travel journey with confidence.

                    </p>


                    {/* =================================================
                        CTA
                    ================================================= */}

                    <div className="tourist-hero-actions">

                        <Link
                            to="/consultation"
                            className="tourist-primary-btn"
                        >

                            <span>
                                Start Your Travel Assessment
                            </span>

                            <HiOutlineArrowRight />

                        </Link>

                    </div>


                    {/* =================================================
                        TRUST STRIP
                    ================================================= */}

                    <div className="tourist-trust">


                        {/* GLOBAL REACH */}

                        <div className="tourist-trust-item">

                            <div className="tourist-trust-icon">

                                <HiOutlineGlobeAlt />

                            </div>

                            <div>

                                <strong>
                                    Global Reach
                                </strong>

                                <span>
                                    Multiple destinations
                                </span>

                            </div>

                        </div>


                        <span className="tourist-trust-divider"></span>


                        {/* DOCUMENTATION */}

                        <div className="tourist-trust-item">

                            <div className="tourist-trust-icon">

                                <HiOutlineDocumentText />

                            </div>

                            <div>

                                <strong>
                                    Documentation
                                </strong>

                                <span>
                                    Complete guidance
                                </span>

                            </div>

                        </div>


                        <span className="tourist-trust-divider"></span>


                        {/* EXPERT SUPPORT */}

                        <div className="tourist-trust-item">

                            <div className="tourist-trust-icon">

                                <HiOutlineShieldCheck />

                            </div>

                            <div>

                                <strong>
                                    Expert Support
                                </strong>

                                <span>
                                    Professional assistance
                                </span>

                            </div>

                        </div>


                    </div>


                </div>


                {/* =====================================================
                    RIGHT SIDE FLOATING UI
                ===================================================== */}

                <div className="tourist-hero-visual">


                    {/* =================================================
                        TRUST BADGE
                    ================================================= */}

                    <div className="travel-image-badge">

                        <span className="travel-badge-check">

                            <HiOutlineCheckCircle />

                        </span>

                        <div>

                            <strong>
                                Trusted Travel Partner
                            </strong>

                            <span>
                                Your journey starts with us
                            </span>

                        </div>

                    </div>


                    {/* =================================================
                        FLOATING JOURNEY CARD
                    ================================================= */}

                    <div className="travel-floating-card">


                        <div className="floating-card-header">

                            <div className="floating-card-icon">

                                <HiOutlineShieldCheck />

                            </div>

                            <div>

                                <span>
                                    EXPERT GUIDANCE
                                </span>

                                <strong>
                                    Professional Support
                                </strong>

                            </div>

                        </div>


                        <h2>
                            Your Journey
                            <span>
                                Starts Here
                            </span>
                        </h2>


                        <ul>

                            <li>

                                <span>
                                    <HiOutlineCheckCircle />
                                </span>

                                Visa Assessment

                            </li>


                            <li>

                                <span>
                                    <HiOutlineCheckCircle />
                                </span>

                                Document Review

                            </li>


                            <li>

                                <span>
                                    <HiOutlineCheckCircle />
                                </span>

                                Application Support

                            </li>

                        </ul>


                        <div className="floating-card-footer">

                            <HiOutlineLocationMarker />

                            <span>
                                Global destinations
                            </span>

                        </div>

                    </div>


                    {/* =================================================
                        MINI STATUS
                    ================================================= */}

                    <div className="travel-mini-status">

                        <span className="travel-status-dot"></span>

                        <div>

                            <strong>
                                Travel support
                            </strong>

                            <span>
                                Available worldwide
                            </span>

                        </div>

                    </div>


                </div>


            </div>


            {/* =====================================================
                SCROLL INDICATOR
            ===================================================== */}

            <div className="tourist-hero-scroll">

                <span>
                    SCROLL TO EXPLORE
                </span>

                <i></i>

            </div>


        </section>

    );

};


export default TouristHero;