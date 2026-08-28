import {
    HiArrowRight,
    HiOutlineShieldCheck,
    HiStar
} from "react-icons/hi";

import {
    Link
} from "react-router-dom";

import "./Hero.css";


const Hero = () => {


    /* =====================================================
       SCROLL TO COUNTRIES

       Navigates to the Countries section without
       changing the browser URL or adding a hash.
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

                            <span className="hero-eyebrow-line" />

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


                            {/* -----------------------------------------
                                PRIMARY CTA
                            ----------------------------------------- */}

                            <Link
                                to="/free-assessment"
                                className="hero-primary-btn"
                            >

                                <span>
                                    Start Free Assessment
                                </span>

                                <HiArrowRight />

                            </Link>


                            {/* -----------------------------------------
                                EXPLORE PATHWAYS

                                IMPORTANT:

                                This is intentionally a button instead
                                of an anchor.

                                It scrolls to Countries without adding
                                #countries to the browser URL.
                            ----------------------------------------- */}

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


                            {/* -----------------------------------------
                                TEMPORARY CM&T AVATAR FALLBACK

                                Replace with profile images later.
                            ----------------------------------------- */}

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


                            {/* -----------------------------------------
                                RATING
                            ----------------------------------------- */}

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


                            {/* -----------------------------------------
                                TRUST DIVIDER
                            ----------------------------------------- */}

                            <div className="hero-trust-divider" />


                            {/* -----------------------------------------
                                TRUSTED GUIDANCE
                            ----------------------------------------- */}

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
                                ORBITAL SYSTEM
                            ========================================= */}

                            <div
                                className="hero-orbits"
                                aria-hidden="true"
                            >

                                <span className="hero-orbit hero-orbit-one">

                                    <i />

                                </span>


                                <span className="hero-orbit hero-orbit-two">

                                    <i />

                                </span>


                                <span className="hero-orbit hero-orbit-three">

                                    <i />

                                </span>


                                <span className="hero-orbit-glow" />

                            </div>


                            {/* =========================================
                                ORBITING LIGHTS
                            ========================================= */}

                            <span
                                className="hero-orbit-point hero-orbit-point-one"
                                aria-hidden="true"
                            />


                            <span
                                className="hero-orbit-point hero-orbit-point-two"
                                aria-hidden="true"
                            />


                            <span
                                className="hero-orbit-point hero-orbit-point-three"
                                aria-hidden="true"
                            />


                            {/* =========================================
                                HERO ARTWORK
                            ========================================= */}

                            <div className="hero-artwork">

                                <img
                                    src="/images/cmt-hero-right-visual-reference.png"
                                    alt="CM&T global migration destinations"
                                />

                            </div>


                            {/* =========================================
                                BASE LIGHT
                            ========================================= */}

                            <span
                                className="hero-base-light"
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