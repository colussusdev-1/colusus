import "./AboutStory.css";

import {
    HiOutlineCheckCircle,
    HiOutlineCalendar,
    HiOutlineGlobeAlt,
    HiOutlineUserGroup,
    HiOutlineShieldCheck,
    HiOutlineHeart,
    HiOutlinePaperAirplane,
} from "react-icons/hi";

import storyImage from "../../../../assets/images/about/about.jpg";

const features = [
    {
        icon: HiOutlineShieldCheck,
        title: "Established Since 2019",
        description: "Years of experience you can trust and rely on.",
    },
    {
        icon: HiOutlineUserGroup,
        title: "Trusted Immigration Guidance",
        description: "Clear, ethical and reliable advice at every step.",
    },
    {
        icon: HiOutlineGlobeAlt,
        title: "Global Opportunities",
        description: "Your future, supported across 15+ countries worldwide.",
    },
    {
        icon: HiOutlineHeart,
        title: "Personalized Client Support",
        description: "Real people, real support tailored to your journey.",
    },
];

const AboutStory = () => {

    return (

        <section className="about-story">


            {/* =================================================
                ATMOSPHERIC BACKGROUND
            ================================================= */}

            <div className="about-story-background">

                <span className="story-bg-orbit story-orbit-one"></span>

                <span className="story-bg-orbit story-orbit-two"></span>

                <span className="story-bg-dot story-dot-one"></span>

                <span className="story-bg-dot story-dot-two"></span>

            </div>


            <div className="container about-story-container">


                {/* =================================================
                    LEFT — IMAGE SIDE
                ================================================= */}

                <div className="about-story-visual">


                    <div className="about-story-image-wrapper">

                        <span className="about-story-glow glow-one"></span>

                        <span className="about-story-glow glow-two"></span>


                        {/* Decorative flight path */}

                        <div className="story-flight-path">

                            <span className="story-flight-line"></span>

                            <HiOutlinePaperAirplane />

                        </div>


                        {/* Image frame */}

                        <div className="about-story-frame">

                            <div className="about-story-image">

                                <img
                                    src={storyImage}
                                    alt="Colossus Migration and Tours helping clients cross borders"
                                />

                                <span className="about-story-reflection"></span>

                            </div>

                        </div>


                        {/* =================================================
                            SINCE 2019 CARD
                        ================================================= */}

                        <div className="about-story-floating-card story-since-card">

                            <div className="about-story-card-icon">

                                <HiOutlineCalendar />

                            </div>

                            <div>

                                <span>
                                    SINCE
                                </span>

                                <strong>
                                    2019
                                </strong>

                            </div>

                        </div>


                        {/* =================================================
                            CLIENTS CARD
                        ================================================= */}

                        <div className="about-story-floating-card story-clients-card">

                            <div className="about-story-card-icon">

                                <HiOutlineUserGroup />

                            </div>

                            <div>

                                <strong>
                                    500+
                                </strong>

                                <span>
                                    Clients Assisted
                                </span>

                            </div>

                        </div>


                    </div>


                    {/* =================================================
                        STATISTICS PANEL
                    ================================================= */}

                    <div className="about-story-stat-panel">


                        <div className="about-story-stat">

                            <div className="story-stat-icon">

                                <HiOutlineCalendar />

                            </div>

                            <strong>
                                2019
                            </strong>

                            <span>
                                Founded
                            </span>

                        </div>


                        <div className="story-stat-divider"></div>


                        <div className="about-story-stat">

                            <div className="story-stat-icon">

                                <HiOutlineGlobeAlt />

                            </div>

                            <strong>
                                15+
                            </strong>

                            <span>
                                Countries Served
                            </span>

                        </div>


                        <div className="story-stat-divider"></div>


                        <div className="about-story-stat">

                            <div className="story-stat-icon">

                                <HiOutlineUserGroup />

                            </div>

                            <strong>
                                500+
                            </strong>

                            <span>
                                Clients Assisted
                            </span>

                        </div>


                    </div>


                </div>


                {/* =================================================
                    RIGHT — STORY CONTENT
                ================================================= */}

                <div className="about-story-content">


                    <span className="about-story-tag">

                        <span className="story-tag-dot"></span>

                        OUR STORY

                    </span>


                    <h2 className="about-story-title">

                        Founded on a

                        <br />

                        Vision.

                        <span>
                            Built Around
                        </span>

                        <span>
                            People.
                        </span>

                    </h2>


                    <div className="about-story-title-line"></div>


                    <p className="about-story-description">

                        Colossus Migration & Tours was founded in 2019
                        with a simple belief that international
                        opportunities should be accessible to everyone.

                    </p>


                    <p className="about-story-description">

                        Whether your dream is to study abroad, build a
                        global career, relocate with your family, expand
                        a business or simply explore the world, every
                        journey deserves trusted guidance and
                        professional support.

                    </p>


                    <p className="about-story-description">

                        We simplify complex immigration and travel
                        processes through transparent advice, structured
                        planning and personalized assistance, helping
                        every client move forward with confidence
                        regardless of background, nationality or
                        circumstances.

                    </p>


                    {/* =================================================
                        FEATURE CARDS
                    ================================================= */}

                    <div className="about-story-features">

                        {features.map((feature) => {

                            const Icon = feature.icon;

                            return (

                                <div
                                    className="about-story-feature"
                                    key={feature.title}
                                >

                                    <div className="story-feature-icon">

                                        <Icon />

                                    </div>


                                    <div className="story-feature-content">

                                        <strong>
                                            {feature.title}
                                        </strong>

                                        <span>
                                            {feature.description}
                                        </span>

                                        <i></i>

                                    </div>

                                </div>

                            );

                        })}

                    </div>


                </div>

            </div>


            {/* =================================================
                STORY STATEMENT
            ================================================= */}

            <div className="container about-story-statement-container">

                <div className="about-story-statement">


                    <div className="story-quote-mark">
                        “
                    </div>


                    <div className="story-statement-content">

                        <h3>

                            <span>
                                Your journey is personal.
                            </span>

                            <strong>
                                Our responsibility is to make it clearer.
                            </strong>

                        </h3>

                        <p>
                            At Colossus Migration & Tours, your dreams
                            drive our commitment.
                        </p>

                    </div>


                    {/* Decorative global visual */}

                    <div className="story-statement-world">

                        <span className="statement-route route-one"></span>

                        <span className="statement-route route-two"></span>

                        <span className="statement-route route-three"></span>

                        <span className="statement-pin pin-one"></span>

                        <span className="statement-pin pin-two"></span>

                        <span className="statement-pin pin-three"></span>

                        <span className="statement-plane">

                            <HiOutlinePaperAirplane />

                        </span>

                    </div>

                </div>

            </div>


        </section>

    );

};

export default AboutStory;