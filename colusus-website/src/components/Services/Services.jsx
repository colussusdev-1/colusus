import {
    useRef
} from "react";

import "./Services.css";

import services from "./servicesData";

import FlightScene from "./FlightScene/FlightScene";
import ServiceCard from "./ServiceCard/ServiceCard";

import ScrollReveal from "../../components/ScrollReveal/ScrollReveal";

import {
    HiOutlineGlobeAlt,
    HiOutlineArrowRight
} from "react-icons/hi";

import servicesBackground
    from "../../assets/images/services/services-background.png";


const Services = () => {

    const sectionRef = useRef(null);

    const cardRefs = useRef([]);


    /* =========================================================
       SCROLL TO OPPORTUNITIES
    ========================================================= */

    const scrollToOpportunities = () => {

        const opportunitiesSection =
            document.getElementById(
                "global-opportunities"
            );

        if (opportunitiesSection) {

            opportunitiesSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    };


    return (

        <section
            ref={sectionRef}
            className="services"
        >


            {/* =================================================
                CINEMATIC BACKGROUND
            ================================================= */}

            <div
                className="services-background"
                aria-hidden="true"
            >

                <img
                    src={servicesBackground}
                    alt=""
                />

            </div>


            {/* =================================================
                READABILITY OVERLAY
            ================================================= */}

            <div
                className="services-background-overlay"
                aria-hidden="true"
            />


            {/* =================================================
                ATMOSPHERIC LIGHT
            ================================================= */}

            <div
                className="services-atmosphere"
                aria-hidden="true"
            >

                <span
                    className="
                        services-atmosphere-glow
                        services-atmosphere-glow-one
                    "
                />

                <span
                    className="
                        services-atmosphere-glow
                        services-atmosphere-glow-two
                    "
                />

                <span
                    className="
                        services-atmosphere-light
                        services-atmosphere-light-one
                    "
                />

                <span
                    className="
                        services-atmosphere-light
                        services-atmosphere-light-two
                    "
                />

            </div>


            {/* =================================================
                CONTENT
            ================================================= */}

            <div className="container">


                {/* =================================================
                    HEADER
                ================================================= */}

                <ScrollReveal
                    direction="up"
                    duration={1.1}
                    distance={40}
                >

                    <header className="services-header">

                        <span className="section-tag dark">
                            Migration Pathways
                        </span>


                        <h2>

                            Discover Your Route

                            <span>
                                To Global Opportunities
                            </span>

                        </h2>


                        <p>

                            Choose the migration pathway
                            that matches your goals,
                            experience and future plans.
                            Our team helps you navigate
                            the right process from start
                            to relocation.

                        </p>

                    </header>

                </ScrollReveal>


                {/* =================================================
                    PATHWAY JOURNEY
                ================================================= */}

                <div className="services-timeline">


                    {/* INTERACTIVE FLIGHT SYSTEM */}

                    <FlightScene
                        sectionRef={sectionRef}
                        cardRefs={cardRefs}
                        totalStops={services.length}
                    />


                    {/* SERVICE CARDS */}

                    <div className="timeline-column">

                        {
                            services.map(
                                (service, index) => (

                                    <ScrollReveal
                                        key={service.id}
                                        direction={
                                            index % 2 === 0
                                                ? "left"
                                                : "right"
                                        }
                                        duration={1}
                                        distance={55}
                                        delay={
                                            0.05 +
                                            index * 0.08
                                        }
                                        className={
                                            index % 2 === 0
                                                ? "service-reveal-left"
                                                : "service-reveal-right"
                                        }
                                    >

                                        <ServiceCard

                                            ref={(element) => {

                                                cardRefs.current[index] =
                                                    element;

                                            }}

                                            service={service}

                                            index={index}

                                            total={
                                                services.length
                                            }

                                        />

                                    </ScrollReveal>

                                )
                            )
                        }

                    </div>

                </div>


                {/* =================================================
                    CTA
                ================================================= */}

                <ScrollReveal
                    direction="up"
                    duration={1}
                    distance={35}
                    delay={0.2}
                >

                    <div className="opportunities-cta">

                        <button
                            type="button"
                            className="opportunities-btn"
                            onClick={scrollToOpportunities}
                        >

                            <HiOutlineGlobeAlt />

                            <span>
                                Explore Available Opportunities
                            </span>

                            <HiOutlineArrowRight />

                        </button>

                    </div>

                </ScrollReveal>


            </div>

        </section>

    );

};


export default Services;