import { Link } from "react-router-dom";

import { HiOutlineArrowRight } from "react-icons/hi";

import { visaTypes } from "../data/touristVisaData";

const TouristVisaGrid = () => {

    return (

        <section className="tv__grid">

            {visaTypes.map((visa) => {

                const Icon = visa.icon;

                return (

                    <Link
                        key={visa.id}
                        to={visa.path}
                        className="tv__card"
                    >

                        <div className="tv__icon">

                            <Icon />

                        </div>

                        <h3>

                            {visa.title}

                        </h3>

                        <p>

                            {visa.desc}

                        </p>

                        <div className="tv__link">

                            <span>

                                Apply Now

                            </span>

                            <HiOutlineArrowRight />

                        </div>

                    </Link>

                );

            })}

        </section>

    );

};

export default TouristVisaGrid;