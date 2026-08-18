import "./TravelTrustBar.css";

import {
    HiOutlineShieldCheck,
    HiOutlineDocumentText,
    HiOutlineGlobeAlt,
    HiOutlineClock,
    HiOutlineArrowRight,
} from "react-icons/hi";

import travelTrustBackground from "../../../../assets/images/travel/why-travel-background.png";


const trustItems = [
    {
        number: "01",
        icon: HiOutlineShieldCheck,
        title: "Professional Guidance",
        description:
            "Expert support throughout your visa application journey.",
    },

    {
        number: "02",
        icon: HiOutlineDocumentText,
        title: "Document Review",
        description:
            "Comprehensive checks before submission.",
    },

    {
        number: "03",
        icon: HiOutlineGlobeAlt,
        title: "Multiple Destinations",
        description:
            "Travel support for popular destinations worldwide.",
    },

    {
        number: "04",
        icon: HiOutlineClock,
        title: "Timely Updates",
        description:
            "Stay informed throughout every stage.",
    },
];


const stats = [
    {
        value: "20+",
        label: "Destinations",
        detail: "Popular countries worldwide",
        icon: HiOutlineGlobeAlt,
    },

    {
        value: "95%",
        label: "Application Accuracy",
        detail: "Careful preparation & review",
        icon: HiOutlineShieldCheck,
    },

    {
        value: "Fast",
        label: "Consultation Response",
        detail: "Quick replies when you need us",
        icon: HiOutlineClock,
    },
];


const TravelTrustBar = () => {

    return (

        <section className="travel-trust">


            {/* =====================================================
                FULL SECTION BACKGROUND
            ===================================================== */}

            <div
                className="travel-trust-background"
                aria-hidden="true"
            >

                <img
                    className="travel-trust-background-image"
                    src={travelTrustBackground}
                    alt=""
                />

                <div className="travel-trust-background-overlay"></div>

                <div className="travel-trust-background-glow"></div>

            </div>


            {/* =====================================================
                CONTENT
            ===================================================== */}

            <div className="travel-trust-container">


                {/* =================================================
                    TOP AREA
                ================================================= */}

                <div className="travel-trust-top">


                    {/* =================================================
                        INTRO
                    ================================================= */}

                    <div className="travel-trust-intro">


                        <span className="travel-trust-tag">

                            <span className="travel-trust-tag-dot"></span>

                            WHY TRAVEL WITH US

                        </span>


                        <h2 className="travel-trust-title">

                            Travel Planning

                            <span>
                                Backed By
                            </span>

                            <strong>
                                Professional Guidance.
                            </strong>

                        </h2>


                        <div className="travel-trust-accent">

                            <span></span>

                            <span></span>

                        </div>


                        <p className="travel-trust-description">

                            Every successful trip begins with proper
                            preparation. Our specialists help reduce
                            mistakes, improve application quality and
                            guide you from planning to submission.

                        </p>


                        <div className="travel-trust-meta">

                            <span className="travel-trust-meta-line"></span>

                            <span>
                                PLAN • PREPARE • TRAVEL
                            </span>

                        </div>


                        {/* GLOBAL SUPPORT */}

                        <div className="travel-trust-mini-trust">

                            <div className="travel-trust-mini-icon">

                                <HiOutlineGlobeAlt />

                            </div>


                            <div>

                                <strong>
                                    Global Support
                                </strong>

                                <span>
                                    Wherever your journey takes you
                                </span>

                            </div>

                        </div>


                    </div>


                    {/* =================================================
                        SERVICE CARDS
                    ================================================= */}

                    <div className="travel-trust-services">

                        {trustItems.map((item, index) => {

                            const Icon = item.icon;

                            return (

                                <article
                                    className="travel-trust-card"
                                    key={item.number}
                                    style={{
                                        "--card-index": index,
                                    }}
                                >


                                    <span className="travel-trust-card-number">
                                        {item.number}
                                    </span>


                                    <div className="travel-trust-icon">

                                        <Icon />

                                    </div>


                                    <div className="travel-trust-card-content">

                                        <span className="travel-trust-card-label">
                                            TRUSTED SERVICE
                                        </span>

                                        <h3>
                                            {item.title}
                                        </h3>

                                        <p>
                                            {item.description}
                                        </p>

                                    </div>


                                    <div className="travel-trust-card-footer">

                                        <span>
                                            LEARN MORE
                                        </span>

                                        <HiOutlineArrowRight />

                                    </div>


                                    <div
                                        className="travel-trust-card-accent"
                                        aria-hidden="true"
                                    ></div>


                                </article>

                            );

                        })}

                    </div>

                </div>


                {/* =================================================
                    STATS
                ================================================= */}

                <div className="travel-trust-stats">

                    {stats.map((item, index) => {

                        const Icon = item.icon;

                        return (

                            <div
                                className="travel-stat"
                                key={item.label}
                            >

                                <div className="travel-stat-icon">

                                    <Icon />

                                </div>


                                <div className="travel-stat-content">

                                    <strong className="travel-stat-value">
                                        {item.value}
                                    </strong>

                                    <span className="travel-stat-label">
                                        {item.label}
                                    </span>

                                    <small>
                                        {item.detail}
                                    </small>

                                </div>


                                {index < stats.length - 1 && (

                                    <span
                                        className="travel-stat-divider"
                                        aria-hidden="true"
                                    />

                                )}

                            </div>

                        );

                    })}

                </div>


                {/* =================================================
                    BOTTOM STATEMENT
                ================================================= */}

                <div className="travel-trust-bottom">

                    <span className="travel-trust-bottom-dot"></span>

                    <span>
                        Your journey deserves more than paperwork.
                    </span>

                    <strong>
                        It deserves a clear plan.
                    </strong>

                </div>


            </div>

        </section>

    );

};


export default TravelTrustBar;