import { forwardRef } from "react";
import { HiArrowRight } from "react-icons/hi";

import "./ServiceCard.css";

const ServiceCard = forwardRef(({ service, index }, ref) => {

    const Icon = service.icon;

    return (
        <article
            ref={ref}
            className="timeline-item"
            data-index={index}
        >

            {/* Node */}
            <div className="timeline-node">
                <span className="node-dot"></span>
            </div>

            {/* Card */}
            <div className="service-card">

                {/* subtle glow layer */}
                <div className="card-glow" />

                <div className="service-card-top">

                    <div className="service-icon">
                        <Icon />
                    </div>

                    <span className="service-number">
                        {(index + 1).toString().padStart(2, "0")}
                    </span>

                </div>

                <div className="service-content">

                    <h3>{service.title}</h3>

                    <p>{service.description}</p>

                    <div className="service-mini-features">
                        {service.features.slice(0, 2).map((feature) => (
                            <span key={feature}>{feature}</span>
                        ))}
                    </div>

                </div>

                <button className="service-btn" type="button">
                    Learn More
                    <HiArrowRight />
                </button>

            </div>

        </article>
    );
});

ServiceCard.displayName = "ServiceCard";

export default ServiceCard;