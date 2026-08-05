import {
    useRef
} from "react";

import "./Services.css";

import services from "./servicesData";

import FlightScene from "./FlightScene/FlightScene";
import ServiceCard from "./ServiceCard/ServiceCard";

import {
    HiOutlineGlobeAlt,
    HiOutlineArrowRight
} from "react-icons/hi";



const Services = () => {


    const sectionRef = useRef(null);

    const cardRefs = useRef([]);




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







            {/* BACKGROUND */}

            <div className="services-bg">


                <span className="star star-1"></span>

                <span className="star star-2"></span>

                <span className="star star-3"></span>



                <span className="aurora aurora-1"></span>

                <span className="aurora aurora-2"></span>



            </div>









            <div className="container">







                {/* HEADER */}


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












                {/* PATHWAY JOURNEY */}


                <div className="services-timeline">







                    <FlightScene

                        sectionRef={sectionRef}

                        cardRefs={cardRefs}

                        totalStops={services.length}

                    />











                    <div className="timeline-column">



                        {
                            services.map(

                                (service, index) => (


                                    <ServiceCard


                                        key={service.id}



                                        ref={(element) => {


                                            cardRefs.current[index] =
                                                element;


                                        }}



                                        service={service}



                                        index={index}



                                        total={services.length}



                                    />


                                )

                            )
                        }





                    </div>







                </div>













                {/* OPPORTUNITIES CTA */}



                <div className="opportunities-cta">





                    <button


                        className="opportunities-btn"



                        onClick={scrollToOpportunities}



                        type="button"



                    >




                        <HiOutlineGlobeAlt />





                        <span>

                            Explore Available Opportunities

                        </span>





                        <HiOutlineArrowRight />




                    </button>





                </div>







            </div>








        </section>


    );

};



export default Services;