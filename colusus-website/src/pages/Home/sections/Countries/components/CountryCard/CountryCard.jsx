import {
    HiOutlineArrowRight,
    HiOutlineUserGroup,
} from "react-icons/hi";

import { useNavigate } from "react-router-dom";

import "./CountryCard.css";


const CountryCard = ({ country }) => {

    const navigate = useNavigate();


    const handleExplore = () => {

        navigate(
            `/opportunities/${country.slug}`
        );

    };


    const handleKeyDown = (event) => {

        if (
            event.key === "Enter" ||
            event.key === " "
        ) {

            event.preventDefault();

            handleExplore();

        }

    };


    return (

        <article
            className="country-card"
            onClick={handleExplore}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
        >


            {/* ==================================================
                COUNTRY IMAGE
            ================================================== */}

            <img
                src={country.image}
                alt={country.name}
                className="country-image"
                loading="lazy"
            />


            <div
                className="country-overlay"
                aria-hidden="true"
            />


            {/* ==================================================
                FEATURED
            ================================================== */}

            {country.featured && (

                <div className="country-featured">

                    Featured

                </div>

            )}


            {/* ==================================================
                EXPLORE HOVER
            ================================================== */}

            <div className="country-hover">

                <span>
                    Explore Opportunities
                </span>

                <HiOutlineArrowRight />

            </div>


            {/* ==================================================
                COUNTRY FLAG
            ================================================== */}

            {country.flag && (

                <div className="country-flag">

                    <img
                        src={country.flag}
                        alt={`${country.name} flag`}
                    />

                </div>

            )}


            {/* ==================================================
                APPLICANTS
            ================================================== */}

            {country.applicants && (

                <div className="country-applicants">

                    <HiOutlineUserGroup />

                    <span>
                        {country.applicants}
                    </span>

                </div>

            )}


            {/* ==================================================
                COUNTRY CONTENT
            ================================================== */}

            <div className="country-content">


                <h3 className="country-name">

                    {country.name}

                </h3>


                <div className="country-meta">


                    {country.duration && (

                        <span className="country-duration">

                            {country.duration}

                        </span>

                    )}


                    {country.visa && (

                        <span className="country-visa">

                            {country.visa}

                        </span>

                    )}

                </div>


            </div>


        </article>

    );

};


export default CountryCard;