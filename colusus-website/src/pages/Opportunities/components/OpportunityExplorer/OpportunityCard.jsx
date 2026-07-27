import { Link } from "react-router-dom";

import {
    HiArrowRight,
    HiOutlineClock,
    HiOutlineLocationMarker,
    HiOutlineBadgeCheck
} from "react-icons/hi";

import "./OpportunityCard.css";


const OpportunityCard = ({
    opportunity,
    countrySlug
}) => {


    return (

        <article className="opportunity-card">


            {/* VISUAL AREA */}

            <div className="opportunity-card__visual">


                {
                    opportunity.image && (

                        <img
                            src={opportunity.image}
                            alt={opportunity.title}
                        />

                    )
                }



                <div className="opportunity-card__overlay"></div>





                <div className="opportunity-card__category">


                    {
                        opportunity.icon
                    }


                    <span>

                        {opportunity.category}

                    </span>


                </div>


            </div>







            {/* CONTENT */}


            <div className="opportunity-card__content">





                <h3>

                    {opportunity.title}

                </h3>






                <p className="opportunity-card__description">

                    {opportunity.description}

                </p>








                {/* QUICK DETAILS */}


                <div className="opportunity-card__facts">


                    <div>

                        <HiOutlineBadgeCheck />


                        <span>

                            {opportunity.type}

                        </span>


                    </div>





                    <div>

                        <HiOutlineClock />


                        <span>

                            {opportunity.duration}

                        </span>


                    </div>





                    <div>

                        <HiOutlineLocationMarker />


                        <span>

                            {opportunity.location}

                        </span>


                    </div>



                </div>








                {/* ACTION */}


                <Link

                    to={
                        `/opportunities/${countrySlug}/${opportunity.slug}`
                    }

                    className="opportunity-card__button"

                >

                    View Pathway

                    <HiArrowRight />


                </Link>





            </div>


        </article>

    );

};


export default OpportunityCard;