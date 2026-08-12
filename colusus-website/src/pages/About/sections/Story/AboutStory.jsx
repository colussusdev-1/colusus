import { useEffect, useRef } from "react";

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

    const sectionRef = useRef(null);


    useEffect(() => {

        const section = sectionRef.current;

        if (!section) return;


        const observer = new IntersectionObserver(

            ([entry]) => {

                if (entry.isIntersecting) {

                    section.classList.add("about-story-is-visible");

                    observer.unobserve(section);

                }

            },

            {
                threshold: 0.12,
                rootMargin: "0px 0px -80px 0px",
            }

        );


        observer.observe(section);


        return () => observer.disconnect();

    }, []);


    return (

        <section
            ref={sectionRef}
            className="about-story"
        >


            {/* =================================================
                ATMOSPHERIC BACKGROUND
            ================================================= */}

            <div
                className="about-story-background"
                aria-hidden="true"
            >

                <span className="story-bg-orbit story-orbit-one"></span>

                <span className="story-bg-orbit story-orbit-two"></span>

                <span className="story-bg-dot story-dot-one"></span>

                <span className="story-bg-dot story-dot-two"></span>

            </div>


            <div className="container about-story-container">


                {/* =================================================
                    LEFT — IMAGE SIDE
                ================================================= */}

                <div className="about-story-visual story-reveal story-reveal-left">


                    <div className="about-story-image-wrapper">


                        <span className="about-story-glow glow-one"></span>

                        <span className="about-story-glow glow-two"></span>


                        {/* Decorative flight path */}

                        <div className="story-flight-path story-reveal story-reveal-top">

                            <span className="story-flight-line"></span>

                            <HiOutlinePaperAirplane />

                        </div>


                        {/* Image frame */}

                        <div className="about-story-frame story-image-reveal">

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

                        <div className="about-story-floating-card story-since-card story-reveal story-reveal-right">

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

                        <div className="about-story-floating-card story-clients-card story-reveal story-reveal-bottom">

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

                    <div className="about-story-stat-panel story-reveal story-reveal-bottom">


                        <div className="about-story-stat story-stat-item">

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


                        <div className="about-story-stat story-stat-item">

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


                        <div className="about-story-stat story-stat-item">

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


                    <span className="about-story-tag story-reveal story-reveal-top">

                        <span className="story-tag-dot"></span>

                        OUR STORY

                    </span>


                    <h2 className="about-story-title">


                        <span className="story-title-line story-reveal story-reveal-right">
                            Founded on a
                        </span>


                        <span className="story-title-line story-reveal story-reveal-right">
                            Vision.
                        </span>


                        <span className="story-title-accent story-reveal story-reveal-left">
                            Built Around
                        </span>


                        <span className="story-title-accent story-reveal story-reveal-left">
                            People.
                        </span>


                    </h2>


                    <div className="about-story-title-line story-reveal story-reveal-left"></div>


                    <p className="about-story-description story-reveal story-reveal-right">

                        Colossus Migration & Tours was founded in 2019
                        with a simple belief that international
                        opportunities should be accessible to everyone.

                    </p>


                    <p className="about-story-description story-reveal story-reveal-left">

                        Whether your dream is to study abroad, build a
                        global career, relocate with your family, expand
                        a business or simply explore the world, every
                        journey deserves trusted guidance and
                        professional support.

                    </p>


                    <p className="about-story-description story-reveal story-reveal-right">

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


                        {features.map((feature, index) => {

                            const Icon = feature.icon;


                            return (

                                <div
                                    className={`
                                        about-story-feature
                                        story-feature-reveal
                                        ${index % 2 === 0
                                            ? "story-reveal-right"
                                            : "story-reveal-left"
                                        }
                                    `}
                                    style={{
                                        "--feature-delay": `${index * 120}ms`,
                                    }}
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


                <div className="about-story-statement story-statement-reveal">


                    <div className="story-quote-mark story-reveal story-reveal-left">
                        “
                    </div>


                    <div className="story-statement-content">


                        <h3>

                            <span className="story-reveal story-reveal-left">

                                Your journey is personal.

                            </span>

                            <strong className="story-reveal story-reveal-right">

                                Our responsibility is to make it clearer.

                            </strong>

                        </h3>


                        <p className="story-reveal story-reveal-bottom">

                            At Colossus Migration & Tours, your dreams
                            drive our commitment.

                        </p>


                    </div>


                    {/* Decorative global visual */}

                    <div className="story-statement-world story-reveal story-reveal-right">


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