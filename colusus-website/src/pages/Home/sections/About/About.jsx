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
    HiOutlineSparkles,
} from "react-icons/hi";

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
                threshold: 0.18,
                rootMargin: "0px 0px -8% 0px",
            }

        );


        observer.observe(section);


        return () => {

            observer.disconnect();

        };

    }, []);



    return (

        <section
            ref={sectionRef}
            className={`home-about ${isVisible
                    ? "home-about--visible"
                    : ""
                }`}
        >

            {/* =====================================================
                BACKGROUND ATMOSPHERE
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
                    HEADER
                ================================================= */}

                <header className="home-about__header">


                    <div className="home-about__eyebrow">

                        <span className="home-about__eyebrow-icon">

                            <HiOutlineGlobeAlt />

                        </span>

                        <span className="home-about__eyebrow-line"></span>

                        <span>
                            ABOUT COLOSSUS
                        </span>

                    </div>


                    <div className="home-about__header-note">

                        <span>
                            Global mobility.
                        </span>

                        <strong>
                            Clearer pathways.
                        </strong>

                    </div>


                </header>



                {/* =================================================
                    MAIN EXPERIENCE
                ================================================= */}

                <div className="home-about__experience">


                    {/* =================================================
                        LEFT VISUAL
                    ================================================= */}

                    <div className="home-about__visual home-about__visual--left">


                        <div className="home-about__image home-about__image--one">

                            <img
                                src="/images/ab1.png"
                                alt="Colossus Migration & Tours international migration"
                            />

                        </div>


                        <div className="home-about__image home-about__image--two">

                            <img
                                src="/images/ab2.png"
                                alt="Colossus Migration & Tours global opportunities"
                            />

                        </div>


                        <div className="home-about__mini-card home-about__mini-card--left">

                            <span className="home-about__mini-icon">

                                <HiOutlineLocationMarker />

                            </span>


                            <div>

                                <strong>
                                    18+ Countries
                                </strong>

                                <span>
                                    Global opportunities
                                </span>

                            </div>

                        </div>


                    </div>



                    {/* =================================================
                        CENTER CONTENT
                    ================================================= */}

                    <div className="home-about__center">


                        <div
                            className="home-about__center-glow"
                            aria-hidden="true"
                        ></div>


                        {/* =============================================
                            ORBITAL DECORATION
                        ============================================= */}

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


                            <div className="home-about__badge">

                                <span className="home-about__badge-icon">

                                    <HiOutlineSparkles />

                                </span>

                                <span>
                                    BEYOND BORDERS
                                </span>

                            </div>



                            <h2 className="home-about__title">

                                <span>
                                    Your move
                                </span>

                                <span>
                                    deserves
                                </span>

                                <em>
                                    a better journey.
                                </em>

                            </h2>



                            <div className="home-about__divider">

                                <span></span>

                                <i></i>

                                <span></span>

                            </div>



                            <p className="home-about__description">

                                <strong>
                                    Colossus Migration & Tours
                                </strong>{" "}
                                helps professionals, students,
                                families and entrepreneurs navigate
                                international opportunities through
                                trusted migration, education,
                                employment and travel pathways.

                            </p>



                            <a
                                href="/about"
                                className="home-about__link"
                            >

                                <span>
                                    Discover Colossus
                                </span>

                                <span className="home-about__link-icon">

                                    <HiArrowRight />

                                </span>

                            </a>


                        </div>


                    </div>



                    {/* =================================================
                        RIGHT VISUAL
                    ================================================= */}

                    <div className="home-about__visual home-about__visual--right">


                        <div className="home-about__image home-about__image--three">

                            <img
                                src="/images/ab3.png"
                                alt="International travel opportunity"
                            />

                        </div>


                        <div className="home-about__image home-about__image--four">

                            <img
                                src="/images/ab4.png"
                                alt="Migration consultation"
                            />

                        </div>


                        <div className="home-about__mini-card home-about__mini-card--right">

                            <span className="home-about__mini-icon">

                                <HiOutlineShieldCheck />

                            </span>


                            <div>

                                <strong>
                                    Trusted Guidance
                                </strong>

                                <span>
                                    Professional support
                                </span>

                            </div>

                        </div>


                    </div>


                </div>



                {/* =================================================
                    VALUE BAR
                ================================================= */}

                <div className="home-about__footer">


                    <div className="home-about__footer-intro">

                        <span>
                            WHY COLOSSUS
                        </span>

                        <strong>
                            One journey.
                            <br />
                            Multiple possibilities.
                        </strong>

                    </div>



                    <div className="home-about__values">


                        <div className="home-about__value">

                            <div className="home-about__value-icon">

                                <HiOutlineGlobeAlt />

                            </div>

                            <div>

                                <strong>
                                    Global Reach
                                </strong>

                                <span>
                                    Opportunities across borders
                                </span>

                            </div>

                        </div>



                        <div className="home-about__value">

                            <div className="home-about__value-icon">

                                <HiOutlineShieldCheck />

                            </div>

                            <div>

                                <strong>
                                    Trusted Guidance
                                </strong>

                                <span>
                                    Clear support at every step
                                </span>

                            </div>

                        </div>



                        <div className="home-about__value">

                            <div className="home-about__value-icon">

                                <HiOutlineSparkles />

                            </div>

                            <div>

                                <strong>
                                    Personal Approach
                                </strong>

                                <span>
                                    Built around your destination
                                </span>

                            </div>

                        </div>


                    </div>


                </div>


            </div>

        </section>

    );

};


export default About;