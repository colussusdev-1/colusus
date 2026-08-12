import { useEffect, useRef } from "react";

import "./AboutValues.css";

import {
    HiOutlineShieldCheck,
    HiOutlineSparkles,
    HiOutlineHeart,
    HiOutlineGlobeAlt,
    HiOutlineBadgeCheck,
    HiOutlinePaperAirplane,
} from "react-icons/hi";

import valuesBackground from "../../../../assets/about/values-background.png";


const values = [

    {
        icon: <HiOutlineShieldCheck />,
        title: "Integrity",
        text:
            "Honest guidance with complete transparency throughout every migration journey.",
    },

    {
        icon: <HiOutlineSparkles />,
        title: "Excellence",
        text:
            "We pursue the highest standards in every application and every client experience.",
    },

    {
        icon: <HiOutlineHeart />,
        title: "Commitment",
        text:
            "Your goals become our mission from consultation to successful relocation.",
    },

    {
        icon: <HiOutlineGlobeAlt />,
        title: "Global Impact",
        text:
            "Helping people unlock opportunities across borders and build better futures.",
    },

    {
        icon: <HiOutlineBadgeCheck />,
        title: "Professionalism",
        text:
            "Experienced support delivered with precision, respect and accountability.",
    },

];


const AboutValues = () => {

    const sectionRef = useRef(null);


    useEffect(() => {

        const section = sectionRef.current;

        if (!section) return;


        const observer = new IntersectionObserver(

            ([entry]) => {

                if (entry.isIntersecting) {

                    section.classList.add(
                        "about-values-i-is-visible"
                    );

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
            className="about-values-i"
            aria-labelledby="about-values-i-title"
            style={{
                "--about-values-background":
                    `url(${valuesBackground})`,
            }}
        >


            {/* =================================================
                BACKGROUND SYSTEM
            ================================================= */}

            <div
                className="about-values-i-background"
                aria-hidden="true"
            >

                <div className="about-values-i-background-image" />

                <div className="about-values-i-background-overlay" />

                <div className="about-values-i-global-glow" />


                {/* ORBITS */}

                <span
                    className="
                        about-values-i-orbit
                        about-values-i-orbit-one
                    "
                />

                <span
                    className="
                        about-values-i-orbit
                        about-values-i-orbit-two
                    "
                />

                <span
                    className="
                        about-values-i-orbit
                        about-values-i-orbit-three
                    "
                />


                {/* ROUTES */}

                <span
                    className="
                        about-values-i-route
                        about-values-i-route-one
                    "
                />

                <span
                    className="
                        about-values-i-route
                        about-values-i-route-two
                    "
                />

                <span
                    className="
                        about-values-i-route
                        about-values-i-route-three
                    "
                />


                {/* DESTINATIONS */}

                <span
                    className="
                        about-values-i-location
                        about-values-i-location-one
                    "
                />

                <span
                    className="
                        about-values-i-location
                        about-values-i-location-two
                    "
                />

                <span
                    className="
                        about-values-i-location
                        about-values-i-location-three
                    "
                />

                <span
                    className="
                        about-values-i-location
                        about-values-i-location-four
                    "
                />


                {/* AIRCRAFT */}

                <span
                    className="
                        about-values-i-plane
                        about-values-i-plane-one
                    "
                >
                    <HiOutlinePaperAirplane />
                </span>


                <span
                    className="
                        about-values-i-plane
                        about-values-i-plane-two
                    "
                >
                    <HiOutlinePaperAirplane />
                </span>


                <span
                    className="
                        about-values-i-plane
                        about-values-i-plane-three
                    "
                >
                    <HiOutlinePaperAirplane />
                </span>


                {/* PARTICLES */}

                <span
                    className="
                        about-values-i-particle
                        about-values-i-particle-one
                    "
                />

                <span
                    className="
                        about-values-i-particle
                        about-values-i-particle-two
                    "
                />

                <span
                    className="
                        about-values-i-particle
                        about-values-i-particle-three
                    "
                />

                <span
                    className="
                        about-values-i-particle
                        about-values-i-particle-four
                    "
                />

                <span
                    className="
                        about-values-i-particle
                        about-values-i-particle-five
                    "
                />

            </div>


            {/* =================================================
                CONTENT
            ================================================= */}

            <div className="about-values-i-container">


                {/* =================================================
                    CENTERED HEADER
                ================================================= */}

                <header className="about-values-i-header">


                    <span className="about-values-i-tag">

                        <span className="about-values-i-tag-dot" />

                        <span>
                            OUR VALUES
                        </span>

                    </span>


                    <h2
                        id="about-values-i-title"
                        className="about-values-i-title"
                    >

                        <span className="about-values-i-title-dark">
                            The Principles
                        </span>

                        <span className="values-title-line-two">
                            That Guide
                        </span>

                        <span className="values-title-line-three">
                            Everything We Do
                        </span>

                    </h2>


                    <span
                        className="about-values-i-title-line"
                        aria-hidden="true"
                    />


                    <p className="about-values-i-description">

                        Every decision we make is rooted in trust,
                        professionalism and an unwavering commitment
                        to helping our clients achieve their global
                        ambitions.

                    </p>

                </header>


                {/* =================================================
                    VALUES GRID
                ================================================= */}

                <div className="about-values-i-grid">


                    {values.map((value, index) => (

                        <article
                            key={value.title}
                            className={`
                                about-values-i-card
                                about-values-i-card-${index + 1}
                                ${index % 2 === 0
                                    ? "values-card-from-left"
                                    : "values-card-from-right"
                                }
                            `}
                            style={{
                                "--about-values-card-delay":
                                    `${index * 130}ms`,
                            }}
                        >


                            {/* CARD SHINE */}

                            <span
                                className="about-values-i-card-shine"
                                aria-hidden="true"
                            />


                            {/* CARD GLOW */}

                            <span
                                className="about-values-i-card-glow"
                                aria-hidden="true"
                            />


                            {/* NUMBER */}

                            <span
                                className="about-values-i-card-number"
                                aria-hidden="true"
                            >
                                0{index + 1}
                            </span>


                            {/* ICON */}

                            <div className="about-values-i-icon">

                                {value.icon}

                            </div>


                            {/* CONTENT */}

                            <div className="about-values-i-card-content">

                                <h3>
                                    {value.title}
                                </h3>

                                <p>
                                    {value.text}
                                </p>

                            </div>


                            {/* ACCENT */}

                            <span
                                className="about-values-i-card-line"
                                aria-hidden="true"
                            />


                        </article>

                    ))}


                </div>


            </div>


            {/* =================================================
                BOTTOM ATMOSPHERE
            ================================================= */}

            <div
                className="about-values-i-bottom-glow"
                aria-hidden="true"
            />


        </section>

    );

};


export default AboutValues;