import {
    HiArrowRight,
    HiOutlineShieldCheck,
    HiStar,
} from "react-icons/hi";

import { Link } from "react-router-dom";
import "./Hero.css";

const Hero = () => {
    /*
    =====================================================
    COUNTRIES
    =====================================================
    */


    const countries = [
        "Canada",
        "United Kingdom",
        "Australia",
        "France",
        "United States",
        "Ireland",
        "Germany",
        "Netherlands",
    ];

    /*
    =====================================================
    SCROLL TO COUNTRIES
    =====================================================
    */

    const handleExplorePathways = () => {
        const target = document.getElementById("countries");

        if (!target) {
            return;
        }

        target.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    return (
        <section className="hero">

            {/* VIDEO BACKGROUND */}

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

            {/* BACKGROUND OVERLAY */}

            <div
                className="hero-overlay"
                aria-hidden="true"
            />

            {/* BACKGROUND DETAILS */}

            <div
                className="hero-background-details"
                aria-hidden="true"
            >
                <div className="hero-grid" />
            </div>

            {/* HERO CONTENT */}

            <div className="hero-inner">

                <div className="hero-container">

                    {/* LEFT CONTENT */}

                    <div className="hero-content">

                        {/* EYEBROW */}

                        <div className="hero-eyebrow hero-reveal hero-delay-1">

                            <span className="hero-eyebrow-brand">
                                CM&amp;T
                            </span>

                            <span className="hero-eyebrow-copy">
                                Global Opportunities. Trusted Pathways.
                            </span>

                        </div>

                        {/* HEADLINE */}

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

                        {/* DESCRIPTION */}

                        <p className="hero-description hero-reveal hero-delay-3">
                            Expert immigration and relocation guidance
                            for professionals, students, families and
                            entrepreneurs seeking opportunities to
                            live, work and thrive globally.
                        </p>

                        {/* ACTION BUTTONS */}

                        <div className="hero-actions hero-reveal hero-delay-4">

                            <Link
                                to="/free-assessment"
                                className="hero-primary-btn"
                            >
                                <span>
                                    Start Free Assessment
                                </span>

                                <HiArrowRight aria-hidden="true" />
                            </Link>

                            <button
                                type="button"
                                className="hero-secondary-btn"
                                onClick={handleExplorePathways}
                            >
                                <span>
                                    Explore Pathways
                                </span>

                                <HiArrowRight aria-hidden="true" />
                            </button>

                        </div>

                        {/* SOCIAL PROOF */}

                        <div className="hero-social hero-reveal hero-delay-5">

                            <div
                                className="hero-avatar-group"
                                aria-hidden="true"
                            >
                                <span className="hero-avatar">C</span>
                                <span className="hero-avatar">M</span>
                                <span className="hero-avatar">&amp;</span>
                                <span className="hero-avatar">T</span>
                            </div>

                            <div className="hero-rating">

                                <div className="hero-rating-main">

                                    <HiStar aria-hidden="true" />

                                    <strong>4.9/5</strong>

                                    <span>
                                        Average Rating
                                    </span>

                                </div>

                                <small>
                                    Based on 500+ client reviews
                                </small>

                            </div>

                            <div className="hero-trust-divider" />

                            <div className="hero-licensed">

                                <span className="hero-licensed-icon">
                                    <HiOutlineShieldCheck aria-hidden="true" />
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

                    {/* RIGHT SECTION: DESTINATIONS ONLY */}

                    <div className="hero-visual hero-reveal hero-delay-3">

                        {/* AIRPLANE IMAGE REMOVED */}

                        {/* DESTINATION LIST PRESERVED */}

                        <div className="hero-country-list">

                            <div className="hero-country-list-heading">

                                <span>
                                    EXPLORE DESTINATIONS
                                </span>

                            </div>

                            <div className="hero-country-list-items">

                                {countries.map((country) => (
                                    <button
                                        type="button"
                                        className="hero-country-item"
                                        key={country}
                                        onClick={handleExplorePathways}
                                        aria-label={`Explore migration pathways for ${country}`}
                                    >
                                        <span>{country}</span>

                                        <HiArrowRight aria-hidden="true" />
                                    </button>
                                ))}

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </section>
    );


};

export default Hero;