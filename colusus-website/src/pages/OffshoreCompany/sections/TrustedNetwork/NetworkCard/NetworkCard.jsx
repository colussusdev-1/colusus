import "./NetworkCard.css";

import {
    FiCheckCircle,
    FiArrowRight
} from "react-icons/fi";

const NetworkCard = ({
    partner
}) => {

    return (

        <article className="network-card">

            <div className="network-top">

                <img
                    src={partner.flag}
                    alt={partner.country}
                />

                <span>

                    {partner.country}

                </span>

            </div>

            <h3>

                {partner.title}

            </h3>

            <p>

                {partner.description}

            </p>

            <div className="network-footer">

                <FiCheckCircle />

                Trusted Partner

            </div>

        </article>

    );

};

export default NetworkCard;