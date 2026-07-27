import { useRef } from "react";

import "./Services.css";

import services from "./servicesData";

import FlightScene from "./FlightScene/FlightScene";
import ServiceCard from "./ServiceCard/ServiceCard";
import { HiOutlineGlobeAlt, HiOutlineArrowRight } from "react-icons/hi";
const Services = () => {

    const sectionRef = useRef(null);

    const cardRefs = useRef([]);

    return (

        <section
            ref={sectionRef}
            className="services"
        >

            {/* Background */}

            <div className="services-bg">

                <span className="star star-1"></span>
                <span className="star star-2"></span>
                <span className="star star-3"></span>

                <span className="aurora aurora-1"></span>
                <span className="aurora aurora-2"></span>

            </div>

            <div className="container">

                {/* Header */}

                <div className="services-header">

                    <span className="section-tag dark">
                        Our Services
                    </span>

                    <h2>

                        Every Journey Begins

                        <span> With The Right Path.</span>

                    </h2>

                    <p>

                        From study visas to permanent residency,
                        overseas employment,
                        visitor visas and
                        international education,
                        we guide you through every
                        step of your journey.

                    </p>

                </div>

                {/* Timeline */}

                <div className="services-timeline">

                    <FlightScene
                        sectionRef={sectionRef}
                        cardRefs={cardRefs}
                        totalStops={services.length}
                    />

                    <div className="timeline-column">

                        {services.map((service, index) => (

                            <ServiceCard
                                key={service.id}
                                ref={(el) => {

                                    cardRefs.current[index] = el;

                                }}
                                service={service}
                                index={index}
                                total={services.length}
                            />

                        ))}

                    </div>

                </div>

                {/* Call to Action */}
                <div className="destinations-cta">

                    <button className="destinations-btn">

                        <HiOutlineGlobeAlt className="btn-icon left" />

                        <span>View all 20+ destinations</span>

                        <HiOutlineArrowRight className="btn-icon right" />

                    </button>

                </div>

            </div>

        </section>

    );

};

export default Services;