import {
    forwardRef
} from "react";

import {
    useNavigate
} from "react-router-dom";

import {
    HiArrowRight
} from "react-icons/hi";

import "./ServiceCard.css";


const ServiceCard = forwardRef(
    ({ service, index }, ref) => {

        const Icon = service.icon;

        const navigate = useNavigate();


        const openService = () => {

            navigate(
                `/services/${service.slug}`
            );

        };


        const handleKeyDown = (event) => {

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {

                event.preventDefault();

                openService();

            }

        };


        return (

            <article
                ref={ref}
                className="timeline-item"
            >


                {/* =================================================
                    TIMELINE NODE
                ================================================= */}

                <div
                    className="timeline-node"
                    aria-hidden="true"
                >

                    <span className="node-dot" />

                </div>


                {/* =================================================
                    SERVICE CARD
                ================================================= */}

                <div
                    className="service-card"

                    onClick={openService}

                    onKeyDown={handleKeyDown}

                    role="button"

                    tabIndex={0}

                >


                    {/* CARD LIGHT */}

                    <div
                        className="card-glow"
                        aria-hidden="true"
                    />


                    <div
                        className="card-shine"
                        aria-hidden="true"
                    />


                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <div className="service-card-top">


                        <div className="service-icon">

                            <Icon />

                        </div>


                        <span className="service-number">

                            {String(index + 1).padStart(2, "0")}

                        </span>


                    </div>


                    {/* =================================================
                        CONTENT
                    ================================================= */}

                    <div className="service-content">


                        <h3>
                            {service.title}
                        </h3>


                        <p>
                            {service.description}
                        </p>


                        {/* FEATURES */}

                        {
                            service.features?.length > 0 && (

                                <div className="service-mini-features">

                                    {
                                        service.features
                                            .slice(0, 3)
                                            .map(
                                                (feature) => (

                                                    <span
                                                        key={feature}
                                                    >

                                                        {feature}

                                                    </span>

                                                )
                                            )
                                    }

                                </div>

                            )
                        }


                    </div>


                    {/* =================================================
                        CTA
                    ================================================= */}

                    <button
                        type="button"
                        className="service-btn"

                        onClick={(event) => {

                            event.stopPropagation();

                            openService();

                        }}
                    >

                        <span>
                            Explore Pathway
                        </span>

                        <HiArrowRight />

                    </button>


                </div>


            </article>

        );

    }
);


ServiceCard.displayName = "ServiceCard";


export default ServiceCard;