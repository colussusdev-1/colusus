import "./AboutHero.css";

import { Link } from "react-router-dom";

import {
    HiOutlineArrowRight,
    HiOutlineGlobeAlt,
    HiOutlineShieldCheck,
    HiOutlineUserGroup,
    HiOutlineBadgeCheck,
} from "react-icons/hi";

import aboutBackground from "../../../../assets/about/about-background.jpg";

const AboutHero = ({
    onOpenServices = () => { }
}) => {

    return (
        <section
            className="about-hero"
            style={{
                "--about-background": `url(${aboutBackground})`
            }}
        >

            {/* =================================================
                ATMOSPHERIC BACKGROUND
            ================================================= */}

            <div className="about-hero-background">

                <div className="about-hero-background-image"></div>

                <div className="about-hero-background-wash"></div>

                <span className="hero-orbit orbit-one"></span>

                <span className="hero-orbit orbit-two"></span>

                <span className="hero-orbit orbit-three"></span>

                <span className="hero-particle particle-one"></span>

                <span className="hero-particle particle-two"></span>

                <span className="hero-particle particle-three"></span>

                <span className="hero-particle particle-four"></span>

            </div>


            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <div className="container about-hero-container">


                {/* =================================================
                    CONTENT
                ================================================= */}

                <div className="about-hero-content">

                    <span className="about-hero-tag">

                        <span className="tag-dot"></span>

                        ABOUT COLOSSUS

                    </span>


                    <h1 className="about-hero-title">

                        Helping You

                        <br />

                        Cross Borders

                        <span>
                            With Confidence.
                        </span>

                    </h1>


                    <div className="about-title-line"></div>


                    <p className="about-hero-description">

                        Colossus Migration & Tours helps students,
                        professionals, entrepreneurs and families
                        relocate through trusted immigration,
                        overseas recruitment and premium travel
                        advisory services.

                    </p>


                    {/* =================================================
                        BUTTONS
                    ================================================= */}

                    <div className="about-hero-buttons">

                        <button
                            type="button"
                            className="about-btn about-btn-primary"
                            onClick={onOpenServices}
                        >

                            <span>
                                Explore Services
                            </span>

                            <span className="about-btn-icon">
                                <HiOutlineArrowRight />
                            </span>

                        </button>


                        <Link
                            to="/contact"
                            className="about-btn about-btn-secondary"
                        >

                            <span>
                                Contact Us
                            </span>

                            <span className="about-secondary-arrow">
                                <HiOutlineArrowRight />
                            </span>

                        </Link>

                    </div>


                    {/* =================================================
                        TRUST ROW
                    ================================================= */}

                    <div className="about-trust-row">

                        <div className="trust-avatars">

                            <span className="trust-avatar avatar-one">
                                C
                            </span>

                            <span className="trust-avatar avatar-two">
                                M
                            </span>

                            <span className="trust-avatar avatar-three">
                                T
                            </span>

                            <span className="trust-avatar avatar-four">
                                +
                            </span>

                        </div>


                        <div className="trust-content">

                            <strong>
                                Trusted by 500+ clients worldwide
                            </strong>


                            <div className="trust-rating">

                                <span className="stars">
                                    ★★★★★
                                </span>

                                <span>
                                    4.9/5
                                </span>

                                <small>
                                    (120+ reviews)
                                </small>

                            </div>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    RIGHT SIDE — BACKGROUND VISUAL ONLY
                ================================================= */}

                <div className="about-hero-visual">

                    <div className="about-hero-visual-glow"></div>

                </div>

            </div>


            {/* =================================================
                STATISTICS
            ================================================= */}

            <div className="container about-stats-container">

                <div className="about-stats">


                    <div className="about-stat">

                        <div className="stat-icon">
                            <HiOutlineGlobeAlt />
                        </div>

                        <div className="stat-content">

                            <strong>
                                15+
                            </strong>

                            <span>
                                Countries Served
                            </span>

                            <small>
                                Global reach, local expertise.
                            </small>

                        </div>

                    </div>


                    <div className="stat-divider"></div>


                    <div className="about-stat">

                        <div className="stat-icon">
                            <HiOutlineUserGroup />
                        </div>

                        <div className="stat-content">

                            <strong>
                                500+
                            </strong>

                            <span>
                                Clients Assisted
                            </span>

                            <small>
                                Real people, real journeys.
                            </small>

                        </div>

                    </div>


                    <div className="stat-divider"></div>


                    <div className="about-stat">

                        <div className="stat-icon">
                            <HiOutlineShieldCheck />
                        </div>

                        <div className="stat-content">

                            <strong>
                                98%
                            </strong>

                            <span>
                                Success Rate
                            </span>

                            <small>
                                We don't just promise. We deliver.
                            </small>

                        </div>

                    </div>


                    <div className="stat-divider"></div>


                    <div className="about-stat">

                        <div className="stat-icon">
                            <HiOutlineBadgeCheck />
                        </div>

                        <div className="stat-content">

                            <strong>
                                5+
                            </strong>

                            <span>
                                Years of Excellence
                            </span>

                            <small>
                                Experience you can trust.
                            </small>

                        </div>

                    </div>


                </div>

            </div>


            {/* =================================================
                VALUES BAR
            ================================================= */}

            <div className="container about-values-container">

                <div className="about-values">


                    <div className="values-heading">

                        <span>
                            Built on Trust.
                        </span>

                        <strong>
                            Driven by Purpose.
                        </strong>

                    </div>


                    <div className="value-item">

                        <div className="value-icon">
                            <HiOutlineUserGroup />
                        </div>

                        <div>

                            <strong>
                                People First
                            </strong>

                            <span>
                                Your goals are our priority.
                            </span>

                        </div>

                    </div>


                    <div className="value-item">

                        <div className="value-icon">
                            <HiOutlineShieldCheck />
                        </div>

                        <div>

                            <strong>
                                Integrity
                            </strong>

                            <span>
                                Honest advice, always.
                            </span>

                        </div>

                    </div>


                    <div className="value-item">

                        <div className="value-icon">
                            <HiOutlineGlobeAlt />
                        </div>

                        <div>

                            <strong>
                                Global Standards
                            </strong>

                            <span>
                                International processes.
                            </span>

                        </div>

                    </div>


                    <div className="value-item">

                        <div className="value-icon">
                            <HiOutlineBadgeCheck />
                        </div>

                        <div>

                            <strong>
                                Excellence
                            </strong>

                            <span>
                                Premium service, exceptional results.
                            </span>

                        </div>

                    </div>


                </div>

            </div>

        </section>
    );
};

export default AboutHero;