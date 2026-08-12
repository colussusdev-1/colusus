import { useEffect, useRef } from "react";

import "./AboutWhyChooseUs.css";

import {
    HiOutlineShieldCheck,
    HiOutlineGlobeAlt,
    HiOutlineAcademicCap,
    HiOutlineBriefcase,
    HiOutlineDocumentText,
    HiOutlineUserGroup,
    HiOutlineSparkles,
} from "react-icons/hi";

import whyBackground from "../../../../assets/about/why-background.png";


const pills = [

    {
        icon: <HiOutlineShieldCheck />,
        text: "Trusted Guidance",
    },

    {
        icon: <HiOutlineGlobeAlt />,
        text: "Global Reach",
    },

    {
        icon: <HiOutlineAcademicCap />,
        text: "Study Abroad",
    },

    {
        icon: <HiOutlineBriefcase />,
        text: "Overseas Jobs",
    },

    {
        icon: <HiOutlineDocumentText />,
        text: "Visa Processing",
    },

    {
        icon: <HiOutlineUserGroup />,
        text: "Personalized Support",
    },

];


const stats = [

    {
        value: "500+",
        label: "Clients Assisted",
        icon: <HiOutlineUserGroup />,
    },

    {
        value: "15+",
        label: "Countries Served",
        icon: <HiOutlineGlobeAlt />,
    },

    {
        value: "24/7",
        label: "Expert Support",
        icon: <HiOutlineShieldCheck />,
    },

];


const AboutWhyChooseUs = () => {

    const sectionRef = useRef(null);


    useEffect(() => {

        const section = sectionRef.current;

        if (!section) return;


        const observer = new IntersectionObserver(

            ([entry]) => {

                if (entry.isIntersecting) {

                    section.classList.add("about-why-is-visible");

                    observer.unobserve(section);

                }

            },

            {
                threshold: 0.14,
                rootMargin: "0px 0px -70px 0px",
            }

        );


        observer.observe(section);


        return () => observer.disconnect();

    }, []);


    return (

        <section
            ref={sectionRef}
            className="about-why"
            style={{
                "--why-background": `url(${whyBackground})`,
            }}
        >


            {/* =================================================
                BACKGROUND SYSTEM
            ================================================= */}

            <div
                className="about-why-background"
                aria-hidden="true"
            >

                <div className="about-why-background-image"></div>

                <div className="about-why-background-overlay"></div>

                <div className="about-why-blue-glow"></div>


                <span className="why-star star-one"></span>

                <span className="why-star star-two"></span>

                <span className="why-star star-three"></span>

                <span className="why-star star-four"></span>

                <span className="why-star star-five"></span>

            </div>


            {/* =================================================
                DECORATIVE ORBITS
            ================================================= */}

            <div className="why-orbit orbit-left"></div>

            <div className="why-orbit orbit-right"></div>


            <div className="container about-why-container">


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="about-why-header why-reveal why-reveal-top">


                    <span className="about-why-tag">

                        <HiOutlineSparkles />

                        <span>
                            THE COLOSSUS DIFFERENCE
                        </span>

                    </span>


                    <h2>

                        <span className="why-title-line why-title-line-one">
                            Why Thousands
                        </span>

                        <span className="why-title-line why-title-line-two">
                            Trust
                        </span>

                        <span className="why-title-brand">
                            Colossus
                        </span>

                        <em className="why-title-line why-title-line-four">
                            Migration & Tours.
                        </em>

                    </h2>


                    <div className="about-why-title-line"></div>


                    <p>

                        We combine professional expertise, verified
                        processes and personalized support to make
                        international migration simpler, safer and
                        more successful.

                    </p>


                </div>


                {/* =================================================
                    SERVICE PILLS
                ================================================= */}

                <div className="about-why-pills">


                    {pills.map((item, index) => (

                        <div
                            key={item.text}
                            className={`
                                about-why-pill
                                why-pill-reveal
                                ${index % 2 === 0
                                    ? "why-pill-left"
                                    : "why-pill-right"
                                }
                            `}
                            style={{
                                "--pill-delay":
                                    `${index * 80}ms`,
                            }}
                        >

                            <span className="about-why-pill-icon">

                                {item.icon}

                            </span>


                            <span className="about-why-pill-text">

                                {item.text}

                            </span>


                        </div>

                    ))}


                </div>


                {/* =================================================
                    STATS
                ================================================= */}

                <div className="about-why-stats">


                    {stats.map((item, index) => (

                        <div
                            key={item.label}
                            className="about-why-stat why-stat-reveal"
                            style={{
                                "--stat-delay":
                                    `${index * 120}ms`,
                            }}
                        >

                            <div className="about-why-stat-icon">

                                {item.icon}

                            </div>


                            <div className="about-why-stat-content">

                                <h3>

                                    {item.value}

                                </h3>

                                <span>

                                    {item.label}

                                </span>

                            </div>


                        </div>

                    ))}


                </div>


                {/* =================================================
                    QUOTE
                ================================================= */}

                <div className="about-why-quote">


                    <span className="about-why-quote-mark quote-left why-quote-left">

                        “

                    </span>


                    <p className="why-quote-text">

                        <span>
                            We don't simply process applications.
                        </span>

                        <strong>
                            We build pathways that change lives.
                        </strong>

                    </p>


                    <span className="about-why-quote-mark quote-right why-quote-right">

                        ”

                    </span>


                </div>


            </div>


            {/* =================================================
                BOTTOM LIGHT
            ================================================= */}

            <div
                className="about-why-bottom-glow"
                aria-hidden="true"
            ></div>


        </section>

    );

};


export default AboutWhyChooseUs;