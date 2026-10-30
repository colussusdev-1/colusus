
import React, {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    HiArrowRight,
    HiOutlineGlobeAlt,
    HiOutlineLocationMarker,
    HiOutlineShieldCheck,
    HiOutlineAcademicCap,
    HiOutlineBriefcase,
    HiOutlineUsers,
    HiOutlineCheckCircle,
} from "react-icons/hi";

import { Link } from "react-router-dom";

import "./Home-about.css";


const About = () => {

    const sectionRef = useRef(null);

    const [isVisible, setIsVisible] = useState(false);


    /* ============================================================
       SCROLL ENTRY OBSERVER
    ============================================================ */

    useEffect(() => {

        const section = sectionRef.current;

        if (!section) return;

        const observer = new IntersectionObserver(

            ([entry]) => {

                if (entry.isIntersecting) {

                    setIsVisible(true);

                    observer.disconnect();

                }

            },

            {
                threshold: 0.12,
                rootMargin: "0px 0px -8% 0px",
            }

        );

        observer.observe(section);

        return () => observer.disconnect();

    }, []);


    const destinations = [
        "Australia",
        "New Zealand",
        "Canada",
        "United Kingdom",
        "Ireland",
        "Germany",
    ];


    return (

        <section
            ref={sectionRef}
            className={`home-about ${isVisible ? "home-about--visible" : ""
                }`}
        >


            {/* =====================================================
                BACKGROUND
            ===================================================== */}

            <div
                className="home-about__background"
                aria-hidden="true"
            >

                <span className="home-about__glow home-about__glow--one"></span>

                <span className="home-about__glow home-about__glow--two"></span>

                <span className="home-about__grid"></span>

                <span className="home-about__ambient-orb home-about__ambient-orb--one"></span>

                <span className="home-about__ambient-orb home-about__ambient-orb--two"></span>

            </div>


            <div className="home-about__inner">


                {/* =================================================
                    MAIN INTRODUCTION
                ================================================= */}

                <header className="home-about__header">

                    <div className="home-about__header-note">

                        <span>
                            Connecting African Talent.
                        </span>

                        <strong>
                            Creating Global Possibilities.
                        </strong>

                    </div>

                </header>



                {/* =================================================
                    MAIN EXPERIENCE
                ================================================= */}

                <div className="home-about__experience">


                    {/* LEFT IMAGES */}

                    <div className="home-about__visual home-about__visual--left">

                        <div className="home-about__image home-about__image--one">

                            <img
                                src="/images/ab1.png"
                                alt="International migration and global opportunities"
                            />

                        </div>


                        <div className="home-about__image home-about__image--two">

                            <img
                                src="/images/ab2.png"
                                alt="People exploring international opportunities"
                            />

                        </div>


                        <div className="home-about__mini-card home-about__mini-card--left">

                            <span className="home-about__mini-icon">
                                <HiOutlineLocationMarker />
                            </span>

                            <div>

                                <strong>
                                    Lagos, Nigeria
                                </strong>

                                <span>
                                    Our home base
                                </span>

                            </div>

                        </div>

                    </div>



                    {/* CENTER CONTENT */}

                    <div className="home-about__center">


                        <div
                            className="home-about__center-glow"
                            aria-hidden="true"
                        ></div>


                        <div
                            className="home-about__orbit"
                            aria-hidden="true"
                        >

                            <span className="home-about__orbit-ring home-about__orbit-ring--one"></span>

                            <span className="home-about__orbit-ring home-about__orbit-ring--two"></span>

                            <span className="home-about__orbit-dot home-about__orbit-dot--one"></span>

                            <span className="home-about__orbit-dot home-about__orbit-dot--two"></span>

                        </div>



                        <div className="home-about__content">


                            <h2 className="home-about__title">

                                <span>
                                    Connecting
                                </span>

                                <span>
                                    African Talent
                                </span>

                                <em>
                                    To Global Opportunities.
                                </em>

                            </h2>



                            <div className="home-about__divider">

                                <span></span>

                                <i></i>

                                <span></span>

                            </div>



                            <p className="home-about__description">

                                <strong>
                                    Colossus Migration & Tours Ltd
                                </strong>{" "}
                                is an international recruitment,
                                education and immigration consulting
                                company based in Lagos, Nigeria.

                                We help individuals explore legitimate
                                international opportunities, understand
                                available pathways and make informed
                                decisions about their future.

                            </p>



                            <div className="home-about__quick-facts">

                                <div>

                                    <strong>
                                        2019
                                    </strong>

                                    <span>
                                        Established
                                    </span>

                                </div>


                                <div>

                                    <strong>
                                        Global
                                    </strong>

                                    <span>
                                        Opportunities
                                    </span>

                                </div>


                                <div>

                                    <strong>
                                        People
                                    </strong>

                                    <span>
                                        At Our Centre
                                    </span>

                                </div>

                            </div>



                            <Link
                                to="/about"
                                className="home-about__link"
                            >

                                <span>
                                    Discover Our Story
                                </span>

                                <span className="home-about__link-icon">
                                    <HiArrowRight />
                                </span>

                            </Link>


                        </div>


                    </div>



                    {/* RIGHT IMAGES */}

                    <div className="home-about__visual home-about__visual--right">


                        <div className="home-about__image home-about__image--three">

                            <img
                                src="/images/ab3.png"
                                alt="International travel and global destinations"
                            />

                        </div>


                        <div className="home-about__image home-about__image--four">

                            <img
                                src="/images/ab4.png"
                                alt="Professional migration consultation"
                            />

                        </div>


                        <div className="home-about__mini-card home-about__mini-card--right">

                            <span className="home-about__mini-icon">
                                <HiOutlineShieldCheck />
                            </span>

                            <div>

                                <strong>
                                    Ethical Guidance
                                </strong>

                                <span>
                                    Informed decisions
                                </span>

                            </div>

                        </div>


                    </div>


                </div>



                {/* =================================================
                    COMPANY STORY
                ================================================= */}

                <div className="home-about__story">


                    <div className="home-about__story-heading">

                        <h3>
                            Helping people see
                            <br />
                            <em>what's possible.</em>
                        </h3>

                    </div>


                    <div className="home-about__story-content">

                        <p>

                            We understand that pursuing an international
                            opportunity is a major decision. It involves
                            more than choosing a destination. It requires
                            understanding requirements, evaluating
                            opportunities, preparing documentation and
                            making decisions that can shape your future.

                        </p>


                        <p>

                            That's why Colossus brings recruitment,
                            education consulting and migration guidance
                            together. Our goal is to make complex
                            international processes easier to understand
                            and help people approach their next steps
                            with greater clarity and confidence.

                        </p>


                        <Link
                            to="/about"
                            className="home-about__story-link"
                        >

                            Learn More About Colossus

                            <HiArrowRight />

                        </Link>

                    </div>


                </div>



                {/* =================================================
                    OUR SERVICES
                ================================================= */}

                <div className="home-about__services-intro">


                    <div className="home-about__services-heading">

                        <div>

                            <h3>
                                Creating pathways
                                <br />
                                to new possibilities.
                            </h3>

                        </div>


                        <p>

                            We support different ambitions through
                            connected international services.

                        </p>

                    </div>



                    <div className="home-about__service-grid">


                        <div className="home-about__service-item">

                            <div className="home-about__service-icon">
                                <HiOutlineBriefcase />
                            </div>

                            <div>

                                <h4>
                                    International Recruitment
                                </h4>

                                <p>
                                    Connecting talent with international
                                    career opportunities and employers.
                                </p>

                            </div>

                        </div>



                        <div className="home-about__service-item">

                            <div className="home-about__service-icon">
                                <HiOutlineAcademicCap />
                            </div>

                            <div>

                                <h4>
                                    Overseas Education
                                </h4>

                                <p>
                                    Helping students explore international
                                    education and study pathways.
                                </p>

                            </div>

                        </div>



                        <div className="home-about__service-item">

                            <div className="home-about__service-icon">
                                <HiOutlineGlobeAlt />
                            </div>

                            <div>

                                <h4>
                                    Immigration Guidance
                                </h4>

                                <p>
                                    Helping individuals understand
                                    migration pathways and requirements.
                                </p>

                            </div>

                        </div>



                        <div className="home-about__service-item">

                            <div className="home-about__service-icon">
                                <HiOutlineUsers />
                            </div>

                            <div>

                                <h4>
                                    Trainee & Apprenticeships
                                </h4>

                                <p>
                                    Exploring international training,
                                    skills development and experience.
                                </p>

                            </div>

                        </div>


                    </div>


                </div>



                {/* =================================================
                    GLOBAL DESTINATIONS
                ================================================= */}

                <div className="home-about__destinations">


                    <div className="home-about__destinations-copy">

                        <h3>
                            Your ambitions
                            <br />
                            have no borders.
                        </h3>

                        <p>

                            We support opportunities across multiple
                            international destinations, subject to
                            available programmes and applicable
                            requirements.

                        </p>

                    </div>



                    <div className="home-about__destination-list">

                        {destinations.map((destination) => (

                            <div
                                className="home-about__destination"
                                key={destination}
                            >

                                <HiOutlineCheckCircle />

                                <span>
                                    {destination}
                                </span>

                            </div>

                        ))}


                        <Link
                            to="/services"
                            className="home-about__destination-link"
                        >

                            Explore Our Services

                            <HiArrowRight />

                        </Link>

                    </div>


                </div>



                {/* =================================================
                    OUR APPROACH
                ================================================= */}

                <div className="home-about__footer">


                    <div className="home-about__footer-intro">

                        <strong>
                            Every journey deserves
                            thoughtful guidance.
                        </strong>

                        <p>
                            Our work is guided by principles that put
                            people, transparency and accountability first.
                        </p>

                    </div>



                    <div className="home-about__values">


                        <div className="home-about__value">

                            <div className="home-about__value-icon">
                                <HiOutlineShieldCheck />
                            </div>

                            <div>

                                <strong>
                                    Integrity
                                </strong>

                                <span>
                                    Honest and ethical guidance
                                </span>

                            </div>

                        </div>



                        <div className="home-about__value">

                            <div className="home-about__value-icon">
                                <HiOutlineGlobeAlt />
                            </div>

                            <div>

                                <strong>
                                    Global Perspective
                                </strong>

                                <span>
                                    Connecting opportunities worldwide
                                </span>

                            </div>

                        </div>



                        <div className="home-about__value">

                            <div className="home-about__value-icon">
                                <HiOutlineUsers />
                            </div>

                            <div>

                                <strong>
                                    Client-Centred
                                </strong>

                                <span>
                                    Understanding individual goals
                                </span>

                            </div>

                        </div>



                        <div className="home-about__value">

                            <div className="home-about__value-icon">
                                <HiOutlineCheckCircle />
                            </div>

                            <div>

                                <strong>
                                    Accountability
                                </strong>

                                <span>
                                    Clear and responsible service
                                </span>

                            </div>

                        </div>


                    </div>


                </div>



                {/* =================================================
                    COMMITMENT
                ================================================= */}

                <div className="home-about__commitment">

                    <div className="home-about__commitment-icon">
                        <HiOutlineShieldCheck />
                    </div>

                    <div>

                        <strong>
                            Our commitment to you
                        </strong>

                        <p>

                            We believe people deserve clear information,
                            professional treatment and honest guidance.
                            We do not promise guaranteed jobs, admissions,
                            visas or immigration outcomes. Every opportunity
                            is subject to the requirements and decisions
                            of the relevant employers, institutions and
                            government authorities.

                        </p>

                    </div>

                </div>



                {/* =================================================
                    FINAL CALL TO ACTION
                ================================================= */}

                <div className="home-about__final-link">

                    <div>

                        <h3>
                            Let's explore what's possible.
                        </h3>

                    </div>


                    <Link
                        to="/about"
                        className="home-about__final-button"
                    >

                        Get to Know Us

                        <HiArrowRight />

                    </Link>

                </div>


            </div>

        </section>

    );

};


export default About;
