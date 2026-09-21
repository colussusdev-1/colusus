import {
    HiArrowRight,
    HiOutlineShieldCheck,
    HiStar
} from "react-icons/hi";

import {
    Link
} from "react-router-dom";

import "./Hero.css";

/* =====================================================
COUNTRY FLAG ASSETS

Flags are stored inside src/assets/flags/
===================================================== */

import canadaFlag from "../../../../assets/flags/canada.png";
import unitedKingdomFlag from "../../../../assets/flags/united-kingdom.png";
import australiaFlag from "../../../../assets/flags/australia.png";
import franceFlag from "../../../../assets/flags/france.png";
import unitedStatesFlag from "../../../../assets/flags/usa.png";
import irelandFlag from "../../../../assets/flags/ireland.png";
import germanyFlag from "../../../../assets/flags/germany.png";
import netherlandsFlag from "../../../../assets/flags/netherlands.png";

const Hero = () => {

    /* =====================================================
       COUNTRIES
    ===================================================== */

    const countries = [
        {
            name: "Canada",
            flag: canadaFlag,
            position: "top"
        },
        {
            name: "United Kingdom",
            flag: unitedKingdomFlag,
            position: "upper-left"
        },
        {
            name: "Australia",
            flag: australiaFlag,
            position: "upper-right"
        },
        {
            name: "France",
            flag: franceFlag,
            position: "left"
        },
        {
            name: "United States",
            flag: unitedStatesFlag,
            position: "right"
        },
        {
            name: "Ireland",
            flag: irelandFlag,
            position: "lower-left"
        },
        {
            name: "Germany",
            flag: germanyFlag,
            position: "lower-right"
        },
        {
            name: "Netherlands",
            flag: netherlandsFlag,
            position: "bottom"
        }
    ];


    /* =====================================================
       SCROLL TO COUNTRIES
    ===================================================== */

    const handleExplorePathways = () => {

        const target = document.getElementById(
            "countries"
        );


        if (!target) {
            return;
        }


        target.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    };


    return (

        <section className="hero">


            {/* =====================================================
            VIDEO BACKGROUND
        ===================================================== */}

            <div
                className="hero-video"
                aria-hidden="true"
            >

                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                >

                    <source
                        src="https://res.cloudinary.com/hq1esbh0/video/upload/v1786377430/colusus.mp4"
                        type="video/mp4"
                    />

                </video>

            </div>


            {/* =====================================================
            CINEMATIC OVERLAY
        ===================================================== */}

            <div
                className="hero-overlay"
                aria-hidden="true"
            />


            {/* =====================================================
            BACKGROUND DETAILS
        ===================================================== */}

            <div
                className="hero-background-details"
                aria-hidden="true"
            >

                <div className="hero-grid" />

                <div className="hero-glow hero-glow-one" />

                <div className="hero-glow hero-glow-two" />

            </div>


            {/* =====================================================
            HERO INNER
        ===================================================== */}

            <div className="hero-inner">

                <div className="hero-container">


                    {/* =================================================
                    LEFT CONTENT
                ================================================= */}

                    <div className="hero-content">


                        {/* =============================================
                        EYEBROW
                    ============================================= */}

                        <div className="hero-eyebrow hero-reveal hero-delay-1">

                            <span className="hero-eyebrow-brand">
                                CM&amp;T
                            </span>

                            <span className="hero-eyebrow-copy">
                                Global Opportunities. Trusted Pathways.
                            </span>

                        </div>


                        {/* =============================================
                        TITLE
                    ============================================= */}

                        <h1 className="hero-title hero-reveal hero-delay-2">

                            <span>
                                Your Next Chapter
                            </span>

                            <span>
                                Starts Beyond
                            </span>

                            <strong>
                                Borders.
                            </strong>

                        </h1>


                        {/* =============================================
                        DESCRIPTION
                    ============================================= */}

                        <p className="hero-description hero-reveal hero-delay-3">

                            Expert immigration and relocation guidance
                            for professionals, students, families and
                            entrepreneurs seeking opportunities to
                            live, work and thrive globally.

                        </p>


                        {/* =============================================
                        ACTIONS
                    ============================================= */}

                        <div className="hero-actions hero-reveal hero-delay-4">

                            <Link
                                to="/free-assessment"
                                className="hero-primary-btn"
                            >

                                <span>
                                    Start Free Assessment
                                </span>

                                <HiArrowRight />

                            </Link>


                            <button
                                type="button"
                                className="hero-secondary-btn"
                                onClick={handleExplorePathways}
                            >

                                <span>
                                    Explore Pathways
                                </span>

                                <HiArrowRight />

                            </button>

                        </div>


                        {/* =================================================
                        SOCIAL PROOF
                    ================================================= */}

                        <div className="hero-social hero-reveal hero-delay-5">


                            {/* =========================================
                            AVATAR GROUP
                        ========================================= */}

                            <div className="hero-avatar-group">

                                <span className="hero-avatar">
                                    C
                                </span>

                                <span className="hero-avatar">
                                    M
                                </span>

                                <span className="hero-avatar">
                                    &amp;
                                </span>

                                <span className="hero-avatar">
                                    T
                                </span>

                            </div>


                            {/* =========================================
                            RATING
                        ========================================= */}

                            <div className="hero-rating">

                                <div className="hero-rating-main">

                                    <HiStar />

                                    <strong>
                                        4.9/5
                                    </strong>

                                    <span>
                                        Average Rating
                                    </span>

                                </div>

                                <small>
                                    Based on 500+ client reviews
                                </small>

                            </div>


                            {/* =========================================
                            TRUST DIVIDER
                        ========================================= */}

                            <div className="hero-trust-divider" />


                            {/* =========================================
                            LICENSED / TRUSTED
                        ========================================= */}

                            <div className="hero-licensed">

                                <span className="hero-licensed-icon">

                                    <HiOutlineShieldCheck />

                                </span>

                                <div>

                                    <strong>
                                        Trusted Guidance
                                    </strong>

                                    <span>
                                        Licensed &amp; Professional
                                    </span>

                                </div>

                            </div>


                        </div>


                    </div>


                    {/* =================================================
                    RIGHT VISUAL
                ================================================= */}

                    <div className="hero-visual hero-reveal hero-delay-3">


                        <div className="hero-visual-stage">


                            {/* =========================================
                            OUTER ORBITAL SYSTEM
                        ========================================= */}

                            <div
                                className="hero-orbit-system"
                                aria-hidden="true"
                            >

                                <span
                                    className="hero-orbit-ring hero-orbit-ring-one"
                                />

                                <span
                                    className="hero-orbit-ring hero-orbit-ring-two"
                                />

                                <span
                                    className="hero-orbit-ring hero-orbit-ring-three"
                                />

                                <span
                                    className="hero-orbit-glow"
                                />

                            </div>


                            {/* =========================================
                            ORBIT LIGHT NODES
                        ========================================= */}

                            <span
                                className="hero-orbit-node hero-orbit-node-one"
                                aria-hidden="true"
                            />

                            <span
                                className="hero-orbit-node hero-orbit-node-two"
                                aria-hidden="true"
                            />

                            <span
                                className="hero-orbit-node hero-orbit-node-three"
                                aria-hidden="true"
                            />

                            <span
                                className="hero-orbit-node hero-orbit-node-four"
                                aria-hidden="true"
                            />


                            {/* =========================================
                            COUNTRY ORBIT

                            IMPORTANT:

                            The outer orbit rotates clockwise.

                            The country content has its own
                            opposite rotation so the flags and
                            country names remain completely
                            upright and readable.
                        ========================================= */}

                            <div
                                className="hero-country-orbit"
                                aria-label="Countries available"
                            >

                                {countries.map((country, index) => (

                                    <div
                                        className={`hero-country hero-country-${country.position}`}
                                        key={country.name}
                                        style={{
                                            "--country-index": index
                                        }}
                                    >


                                        {/* =================================
                                        COUNTRY CONTENT

                                        This is what stays level.

                                        Flag + country name move together
                                        around the orbit but never rotate
                                        visually.
                                    ================================= */}

                                        <div className="hero-country-content">


                                            {/* =============================
                                            FLAG
                                        ============================= */}

                                            <div className="hero-country-flag">

                                                <img
                                                    src={country.flag}
                                                    alt={`${country.name} flag`}
                                                    loading="lazy"
                                                />

                                            </div>


                                            {/* =============================
                                            COUNTRY NAME
                                        ============================= */}

                                            <span className="hero-country-name">
                                                {country.name}
                                            </span>


                                        </div>


                                        {/* =================================
                                        CONNECTOR
                                    ================================= */}

                                        <div
                                            className="hero-country-connector"
                                            aria-hidden="true"
                                        />

                                    </div>

                                ))}

                            </div>


                            {/* =========================================
                            HERO ARTWORK
                        ========================================= */}

                            <div className="hero-artwork">

                                <img
                                    src="/images/cmt-hero-right-visual-reference.png"
                                    alt="Airplane representing global migration and international opportunities"
                                />

                            </div>


                            {/* =========================================
                            BASE LIGHT
                        ========================================= */}

                            <span
                                className="hero-base-light"
                                aria-hidden="true"
                            />


                            {/* =========================================
                            CENTER HUD GLOW
                        ========================================= */}

                            <span
                                className="hero-center-glow"
                                aria-hidden="true"
                            />

                        </div>


                        {/* =============================================
                        VISUAL LABEL
                    ============================================= */}

                        <div className="hero-visual-label">

                            <span
                                className="hero-visual-label-dot"
                                aria-hidden="true"
                            />

                            <span>
                                18+ Countries
                            </span>

                            <span className="hero-label-divider">
                                ·
                            </span>

                            <span>
                                Global Opportunities
                            </span>

                        </div>


                    </div>


                </div>

            </div>


        </section>

    );


};

export default Hero;
