import {
    HiOutlineArrowRight,
    HiOutlineUserGroup,
} from "react-icons/hi";

import { useNavigate } from "react-router-dom";

import "./CountryCard.css";


const CountryCard = ({ country }) => {

    const navigate = useNavigate();


    const handleExplore = () => {

        navigate(`/opportunities/${country.slug}`);

    };


    return (

        <div
            className="country-card"
            onClick={handleExplore}
            role="button"
            tabIndex="0"
        >


            <img
                src={country.image}
                alt={country.name}
                className="country-image"
            />



            <div className="country-overlay" />




            {
                country.featured && (

                    <div className="country-featured">

                        Featured

                    </div>

                )
            }





            <div className="country-hover">

                <span>
                    Explore Opportunities
                </span>

                <HiOutlineArrowRight />

            </div>





            <div className="country-flag">

                {country.flag}

            </div>





            <div className="country-applicants">

                <HiOutlineUserGroup />

                {country.applicants}

            </div>





            <div className="country-content">


                <h3 className="country-name">

                    {country.name}

                </h3>




                <div className="country-meta">


                    <span className="country-duration">

                        {country.duration}

                    </span>




                    <span className="country-visa">

                        {country.visa}

                    </span>


                </div>


            </div>




        </div>

    );

};


export default CountryCard;