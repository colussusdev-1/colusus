import {
    HiOutlineCheckCircle
} from "react-icons/hi";

const TouristProcessCard = ({
    process,
    last
}) => {

    const Icon = process.icon;

    return (

        <article className="tpCard">

            <div className="tpCard__top">

                <div className="tpCard__circle">

                    <Icon />

                </div>

                {
                    !last &&

                    <div className="tpCard__line"></div>
                }

            </div>

            <div className="tpCard__glass">

                <span className="tpCard__step">

                    {process.step}

                </span>

                <h3>

                    {process.title}

                </h3>

                <p>

                    {process.description}

                </p>

                <div className="tpCard__footer">

                    <span className="tpCard__pill">

                        <HiOutlineCheckCircle />

                        Guided By Experts

                    </span>

                </div>

            </div>

        </article>

    );

};

export default TouristProcessCard;