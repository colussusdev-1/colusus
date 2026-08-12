import { Link } from "react-router-dom";

import {
    HiOutlineArrowRight,
    HiOutlineCheckCircle,
    HiOutlineGlobeAlt,
    HiOutlineAcademicCap,
    HiOutlineBriefcase,
    HiOutlineDocumentText,
} from "react-icons/hi";

import ScrollReveal from "../../../../components/ScrollReveal/ScrollReveal";

import "./Home-about.css";

import aboutImage from "../../../../assets/images/about/about.jpg";
import aboutBackground
    from "../../../../assets/images/about/about-background.png";


const About = () => {

    const trustPoints = [

        {
            title: "Work Visa",
            subtitle: "Pathways",
            icon: HiOutlineBriefcase,
        },

        {
            title: "Study",
            subtitle: "Opportunities",
            icon: HiOutlineAcademicCap,
        },

        {
            title: "Immigration",
            subtitle: "Guidance",
            icon: HiOutlineDocumentText,
        },

        {
            title: "Travel",
            subtitle: "Support",
            icon: HiOutlineGlobeAlt,
        },

    ];


    return (

        <section className="home-about">


            {/* =====================================================
                PREMIUM BACKGROUND
            ===================================================== */}

            <div
                className="home-about-background"
                aria-hidden="true"
            >

                <img
                    src={aboutBackground}
                    alt=""
                />

            </div>


            {/* =====================================================
                BACKGROUND READABILITY
            ===================================================== */}

            <div
                className="home-about-background-overlay"
                aria-hidden="true"
            />


            {/* =====================================================
                CONTENT
            ===================================================== */}

            <div className="container home-about-container">


                {/* =================================================
                    LEFT IMAGE EXPERIENCE
                ================================================= */}

                <ScrollReveal
                    direction="left"
                    duration={1.15}
                    distance={70}
                    delay={0.05}
                    className="home-about-image-reveal"
                >

                    <div className="home-about-image">

                        <img
                            src={aboutImage}
                            alt="Colossus Migration and Tours helping clients explore international opportunities"
                        />


                        {/* IMAGE OVERLAY */}

                        <div className="home-about-image-overlay" />


                        {/* IMAGE TOP BADGE */}

                        <div className="home-about-image-badge">

                            <HiOutlineCheckCircle />

                            <span>
                                Trusted Migration Support
                            </span>

                        </div>


                        {/* TRUST CARD */}

                        <div className="home-about-trust-card">


                            <div className="home-about-trust-icon">

                                <HiOutlineCheckCircle />

                            </div>


                            <div className="home-about-trust-content">

                                <span>
                                    TRUSTED SUPPORT FOR
                                </span>

                                <p>
                                    Professionals • Students • Families
                                </p>

                                <small>
                                    Seeking opportunities abroad
                                </small>

                            </div>


                        </div>


                    </div>

                </ScrollReveal>


                {/* =================================================
                    RIGHT CONTENT
                ================================================= */}

                <div className="home-about-content">


                    {/* =================================================
                        TAG
                    ================================================= */}

                    <ScrollReveal
                        direction="up"
                        duration={1}
                        distance={35}
                    >

                        <span className="home-about-tag">

                            <HiOutlineGlobeAlt />

                            ABOUT COLOSSUS

                        </span>

                    </ScrollReveal>


                    {/* =================================================
                        TITLE
                    ================================================= */}

                    <ScrollReveal
                        direction="up"
                        duration={1.15}
                        distance={45}
                        delay={0.08}
                    >

                        <h2>

                            Trusted Pathways

                            <br />

                            To Canada

                            <span>
                                & Beyond
                            </span>

                        </h2>

                    </ScrollReveal>


                    {/* =================================================
                        DECORATIVE LINE
                    ================================================= */}

                    <ScrollReveal
                        direction="up"
                        duration={0.9}
                        distance={20}
                        delay={0.12}
                    >

                        <div className="home-about-heading-line">

                            <span />

                            <i />

                        </div>

                    </ScrollReveal>


                    {/* =================================================
                        DESCRIPTION
                    ================================================= */}

                    <ScrollReveal
                        direction="up"
                        duration={1.15}
                        distance={40}
                        delay={0.16}
                    >

                        <p className="home-about-description">

                            Colossus Migration & Tours helps professionals,
                            students, families and entrepreneurs confidently
                            explore global opportunities through trusted
                            immigration pathways, overseas employment and
                            international education solutions.

                        </p>

                    </ScrollReveal>


                    {/* =================================================
                        TRUST POINTS
                    ================================================= */}

                    <div className="home-about-trust-points">


                        {
                            trustPoints.map(
                                (
                                    item,
                                    index
                                ) => {

                                    const Icon = item.icon;


                                    return (

                                        <ScrollReveal
                                            key={item.title}
                                            direction="up"
                                            duration={0.9}
                                            distance={35}
                                            delay={
                                                0.2 +
                                                index * 0.09
                                            }
                                        >

                                            <div className="home-about-trust-point">


                                                <span className="home-about-point-icon">

                                                    <Icon />

                                                </span>


                                                <span className="home-about-point-content">

                                                    <strong>
                                                        {item.title}
                                                    </strong>

                                                    <small>
                                                        {item.subtitle}
                                                    </small>

                                                </span>


                                            </div>

                                        </ScrollReveal>

                                    );

                                }
                            )
                        }


                    </div>


                    {/* =================================================
                        CTA
                    ================================================= */}

                    <ScrollReveal
                        direction="up"
                        duration={1}
                        distance={30}
                        delay={0.52}
                    >

                        <div className="home-about-buttons">

                            <Link
                                to="/about"
                                className="home-about-contact-btn"
                            >

                                <span>
                                    Learn More About Us
                                </span>

                                <HiOutlineArrowRight />

                            </Link>

                        </div>

                    </ScrollReveal>


                </div>


            </div>


            {/* =====================================================
                DECORATIVE FLOATING ELEMENT
            ===================================================== */}

            <div
                className="home-about-floating-badge"
                aria-hidden="true"
            >

                <span className="home-about-floating-dot" />

                <span>
                    Global Opportunities
                </span>

            </div>


        </section>

    );

};


export default About;