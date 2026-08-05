import { forwardRef } from "react";
import { useNavigate } from "react-router-dom";

import {
    HiArrowRight
} from "react-icons/hi";

import "./ServiceCard.css";


const ServiceCard = forwardRef(
    ({ service, index }, ref) => {


        const Icon = service.icon;

        const navigate = useNavigate();



        const openService = () => {

            navigate(`/services/${service.slug}`);

        };





        return (

            <article

                ref={ref}

                className="timeline-item"

            >



                {/* Timeline Node */}

                <div className="timeline-node">

                    <span className="node-dot"></span>

                </div>





                <div

                    className="service-card"

                    onClick={openService}

                    role="button"

                    tabIndex="0"

                >



                    <div className="card-glow"></div>






                    {/* HEADER */}


                    <div className="service-card-top">


                        <div className="service-icon">

                            <Icon />

                        </div>




                        <span className="service-number">

                            {(index + 1)
                                .toString()
                                .padStart(2, "0")}

                        </span>


                    </div>







                    {/* CONTENT */}


                    <div className="service-content">


                        <h3>

                            {service.title}

                        </h3>



                        <p>

                            {service.description}

                        </p>





                        <div className="service-mini-features">


                            {
                                service.features
                                    ?.slice(0, 3)
                                    .map(feature => (


                                        <span key={feature}>

                                            {feature}

                                        </span>


                                    ))
                            }


                        </div>



                    </div>








                    <button

                        className="service-btn"

                        onClick={(e) => {

                            e.stopPropagation();

                            openService();

                        }}

                    >

                        Explore Pathway

                        <HiArrowRight />

                    </button>




                </div>



            </article>

        );

    });


ServiceCard.displayName = "ServiceCard";


export default ServiceCard;