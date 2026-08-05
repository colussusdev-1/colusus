import { Link } from "react-router-dom";

import {
    HiArrowRight,
    HiOutlineClock,
    HiOutlineLocationMarker,
    HiOutlineBadgeCheck,
    HiOutlineCurrencyDollar,
    HiOutlineTrendingUp
} from "react-icons/hi";

import "./OpportunityCard.css";


const OpportunityCard = ({
    opportunity,
    countrySlug
}) => {


    if (!opportunity) return null;



    const opportunitySlug =
        opportunity.slug ||
        opportunity.id;



    const positions =
        opportunity.positions ||
        [];



    const benefits =
        opportunity.benefits ||
        opportunity.highlights ||
        [];




    return (


        <article className="opportunity-card">



            {/* IMAGE */}


            <div className="opportunity-card__visual">


                {
                    opportunity.image && (

                        <img
                            src={opportunity.image}
                            alt={opportunity.title}
                        />

                    )
                }



                <div className="opportunity-card__overlay" />





                <div className="opportunity-card__category">


                    <span>

                        {opportunity.icon || "🌍"}

                    </span>


                    <span>

                        {
                            opportunity.category ||
                            "Opportunity"
                        }

                    </span>


                </div>





                {
                    opportunity.demand && (

                        <div className="opportunity-card__demand">

                            <HiOutlineTrendingUp />

                            {opportunity.demand}

                        </div>

                    )
                }




            </div>








            {/* CONTENT */}


            <div className="opportunity-card__content">





                <h3>

                    {opportunity.title}

                </h3>






                <p className="opportunity-card__description">

                    {
                        opportunity.description ||
                        "Explore this migration opportunity and begin your application process."
                    }

                </p>








                {/* MAIN FACTS */}


                <div className="opportunity-card__facts">



                    <div>

                        <HiOutlineBadgeCheck />

                        <span>

                            {
                                opportunity.type ||
                                "Work Permit"
                            }

                        </span>

                    </div>





                    <div>

                        <HiOutlineClock />

                        <span>

                            {
                                opportunity.duration ||
                                opportunity.timeline ||
                                "Processing Available"
                            }

                        </span>


                    </div>





                    <div>

                        <HiOutlineLocationMarker />

                        <span>

                            {
                                opportunity.location ||
                                countrySlug
                            }

                        </span>


                    </div>





                </div>









                {/* SALARY */}



                {
                    opportunity.salary && (

                        <div className="opportunity-card__salary">

                            <HiOutlineCurrencyDollar />

                            <strong>
                                Salary:
                            </strong>

                            <span>

                                {opportunity.salary}

                            </span>


                        </div>

                    )
                }









                {/* POSITIONS */}


                {
                    positions.length > 0 && (

                        <div className="opportunity-card__section">


                            <h4>
                                Available Positions
                            </h4>



                            <ul>

                                {
                                    positions.slice(0, 3).map(
                                        (position, index) => (

                                            <li key={index}>

                                                {
                                                    position.title ||
                                                    position.sector
                                                }


                                            </li>

                                        )
                                    )
                                }


                            </ul>


                        </div>

                    )

                }









                {/* BENEFITS */}


                {
                    benefits.length > 0 && (

                        <div className="opportunity-card__benefits">


                            {
                                benefits.slice(0, 3).map(
                                    (benefit, index) => (

                                        <span key={index}>

                                            ✓ {benefit}

                                        </span>

                                    )
                                )
                            }


                        </div>

                    )

                }









                <Link

                    to={`/opportunities/${countrySlug}/${opportunitySlug}`}

                    className="opportunity-card__button"

                >

                    View Full Pathway

                    <HiArrowRight />


                </Link>





            </div>



        </article>


    );

};


export default OpportunityCard;