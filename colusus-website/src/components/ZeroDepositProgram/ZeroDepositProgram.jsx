import "./ZeroDepositProgram.css";

import {
    HiOutlineGlobeAlt,
    HiOutlineCheckCircle,
    HiArrowRight,
    HiOutlineShieldCheck,
    HiOutlineUser,
    HiOutlineDocumentText,
    HiOutlineLocationMarker,
    HiOutlineLockClosed,
    HiOutlineUsers,
    HiOutlineClock
} from "react-icons/hi";

import ScrollReveal from "../ScrollReveal/ScrollReveal";

import zeroDepositBackground
    from "../../assets/images/zero-deposit/zero-deposit-background.png";

import germanyFlag
    from "../../assets/flags/germany.png";

import serbiaFlag
    from "../../assets/flags/serbia.png";

import bulgariaFlag
    from "../../assets/flags/bulgaria.png";

import hungaryFlag
    from "../../assets/flags/hungary.png";

import polandFlag
    from "../../assets/flags/poland.png";

import romaniaFlag
    from "../../assets/flags/romania.png";


const ZeroDepositProgram = () => {

    const scrollToCountries = () => {

        document
            .getElementById("global-opportunities")
            ?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

    };


    /* =========================================================
       AVAILABLE COUNTRIES
    ========================================================= */
    const countries = [

        {
            code: "DE",
            name: "Germany",
            flag: germanyFlag
        },

        {
            code: "RS",
            name: "Serbia",
            flag: serbiaFlag
        },

        {
            code: "BG",
            name: "Bulgaria",
            flag: bulgariaFlag
        },

        {
            code: "HU",
            name: "Hungary",
            flag: hungaryFlag
        },

        {
            code: "PL",
            name: "Poland",
            flag: polandFlag
        },

        {
            code: "RO",
            name: "Romania",
            flag: romaniaFlag
        }

    ];


    /* =========================================================
       PROGRAM STEPS
    ========================================================= */

    const steps = [

        {
            title: "Free eligibility assessment",
            icon: HiOutlineUser
        },

        {
            title: "Professional document review",
            icon: HiOutlineDocumentText
        },

        {
            title: "Opportunity matching based on your profile",
            icon: HiOutlineLocationMarker
        },

        {
            title: "Pay only after qualification",
            icon: HiOutlineShieldCheck
        }

    ];


    /* =========================================================
       TRUST FEATURES
    ========================================================= */

    const trustFeatures = [

        {
            icon: HiOutlineShieldCheck,
            title: "100% Transparent",
            description: "No hidden charges. No surprises."
        },

        {
            icon: HiOutlineLockClosed,
            title: "Secure & Confidential",
            description: "Your documents and information are safe."
        },

        {
            icon: HiOutlineUsers,
            title: "Expert Guidance",
            description: "Licensed advisors with proven expertise."
        },

        {
            icon: HiOutlineClock,
            title: "Save Time & Money",
            description: "Start smart. Pay only when you qualify."
        }

    ];


    return (

        <section className="zd-section">


            {/* =====================================================
                CINEMATIC BACKGROUND
            ===================================================== */}

            <div
                className="zd-background"
                aria-hidden="true"
            >

                <img
                    src={zeroDepositBackground}
                    alt=""
                    className="zd-background-image"
                />

                <div className="zd-background-overlay"></div>

                <div className="zd-background-vignette"></div>

            </div>


            {/* =====================================================
                ATMOSPHERIC LIGHT
            ===================================================== */}

            <div
                className="zd-atmosphere"
                aria-hidden="true"
            >

                <span className="zd-atmosphere-glow zd-atmosphere-glow-one"></span>

                <span className="zd-atmosphere-glow zd-atmosphere-glow-two"></span>

                <span className="zd-atmosphere-star zd-atmosphere-star-one"></span>

                <span className="zd-atmosphere-star zd-atmosphere-star-two"></span>

                <span className="zd-atmosphere-star zd-atmosphere-star-three"></span>

                <span className="zd-atmosphere-star zd-atmosphere-star-four"></span>

            </div>


            <div className="container zd-container">


                {/* =================================================
                    HEADER
                ================================================= */}

                <ScrollReveal
                    direction="up"
                    duration={1}
                    distance={35}
                >

                    <header className="zd-header">


                        <span className="zd-section-tag">

                            <HiOutlineShieldCheck />

                            Zero Deposit Initiative

                        </span>


                        <h2 className="zd-title">

                            Start Your Migration

                            <br />

                            Journey

                            <span>

                                Without Upfront Fees

                            </span>

                        </h2>


                        <p className="zd-description">

                            We assess your eligibility, review your
                            documents and match you with genuine
                            migration opportunities before discussing
                            service fees.

                        </p>


                        <span className="zd-header-line"></span>


                    </header>

                </ScrollReveal>


                {/* =================================================
                    MAIN GLASS PANEL
                ================================================= */}

                <ScrollReveal
                    direction="up"
                    duration={1.1}
                    distance={45}
                    delay={0.1}
                >

                    <div className="zd-card">


                        {/* =================================================
                            LEFT SIDE
                        ================================================= */}

                        <div className="zd-left">


                            <div className="zd-left-intro">


                                <div className="zd-intro-icon">

                                    <HiOutlineShieldCheck />

                                </div>


                                <p>

                                    Our Zero Deposit Program is designed
                                    for qualified applicants who want to
                                    begin their migration journey without
                                    financial pressure. We focus on
                                    helping you understand your eligibility
                                    first before recommending the right
                                    pathway.

                                </p>

                            </div>


                            {/* =================================================
                                PROGRAM STEPS
                            ================================================= */}

                            <div className="zd-steps">

                                {
                                    steps.map(
                                        (step, index) => {

                                            const StepIcon =
                                                step.icon;


                                            return (

                                                <div
                                                    key={step.title}
                                                    className="zd-step"
                                                    style={{
                                                        "--zd-step-delay":
                                                            `${index * 0.1}s`
                                                    }}
                                                >


                                                    <div className="zd-step-icon">

                                                        <StepIcon />

                                                    </div>


                                                    <div className="zd-step-content">

                                                        <span>
                                                            {step.title}
                                                        </span>

                                                    </div>


                                                    <div className="zd-step-arrow">

                                                        <HiArrowRight />

                                                    </div>


                                                </div>

                                            );

                                        }
                                    )
                                }

                            </div>


                        </div>


                        {/* =================================================
                            RIGHT SIDE
                        ================================================= */}

                        <div className="zd-right">


                            <div className="zd-highlight">


                                {/* =============================================
                                    AVAILABLE HEADER
                                ============================================= */}

                                <div className="zd-highlight-header">


                                    <div className="zd-globe-icon">

                                        <HiOutlineGlobeAlt />

                                    </div>


                                    <div className="zd-highlight-heading">

                                        <h3>

                                            Currently Available

                                        </h3>


                                        <p>

                                            Countries participating in
                                            the Zero Deposit Program

                                        </p>

                                    </div>


                                </div>


                                {/* =============================================
                                    COUNTRIES
                                ============================================= */}

                                <div className="zd-country-grid">

                                    {
                                        countries.map(
                                            (country, index) => (

                                                <div
                                                    key={country.code}
                                                    className="zd-country-pill"
                                                    style={{
                                                        "--zd-country-delay":
                                                            `${index * 0.08}s`
                                                    }}
                                                >

                                                    <span className="zd-country-flag">

                                                        <img
                                                            src={country.flag}
                                                            alt={`${country.name} flag`}
                                                        />

                                                    </span>


                                                    <span className="zd-country-name">

                                                        {country.name}

                                                    </span>

                                                </div>

                                            )
                                        )
                                    }

                                </div>


                                {/* =============================================
                                    STATUS
                                ============================================= */}

                                <div className="zd-status">

                                    <span className="zd-status-indicator">

                                        <span className="zd-status-dot"></span>

                                    </span>


                                    <span>

                                        Program Currently Open

                                    </span>

                                </div>


                                {/* =============================================
                                    CTA
                                ============================================= */}

                                <button
                                    className="zd-primary-btn"
                                    onClick={scrollToCountries}
                                    type="button"
                                >

                                    <span>

                                        Explore Eligible Opportunities

                                    </span>


                                    <HiArrowRight />

                                </button>


                            </div>


                        </div>


                    </div>

                </ScrollReveal>


                {/* =================================================
                    TRUST FEATURES
                ================================================= */}

                <ScrollReveal
                    direction="up"
                    duration={1}
                    distance={30}
                    delay={0.2}
                >

                    <div className="zd-trust-grid">

                        {
                            trustFeatures.map(
                                (feature, index) => {

                                    const FeatureIcon =
                                        feature.icon;


                                    return (

                                        <div
                                            key={feature.title}
                                            className="zd-trust-feature"
                                        >


                                            <div className="zd-trust-icon">

                                                <FeatureIcon />

                                            </div>


                                            <div className="zd-trust-content">

                                                <strong>

                                                    {feature.title}

                                                </strong>


                                                <span>

                                                    {feature.description}

                                                </span>

                                            </div>


                                            {
                                                index <
                                                trustFeatures.length - 1
                                                &&
                                                (
                                                    <span className="zd-trust-divider"></span>
                                                )
                                            }


                                        </div>

                                    );

                                }
                            )
                        }

                    </div>

                </ScrollReveal>


            </div>


        </section>

    );

};


export default ZeroDepositProgram;