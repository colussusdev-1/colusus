import {
    HiArrowRight,
    HiOutlineClock
} from "react-icons/hi";

import {
    Link
} from "react-router-dom";

import "./RelatedOpportunities.css";


const RelatedOpportunities = ({
    opportunities = [],
    countrySlug
}) => {


    if(!opportunities.length){
        return null;
    }



    return (

        <section className="related-section">


            <div className="related-container">



                {/* HEADER */}

                <div className="related-heading">


                    <span className="related-label">

                        Explore More

                    </span>



                    <h2>

                        Other Pathways In This Country

                    </h2>



                    <p>

                        Discover alternative opportunities that
                        may better match your goals and profile.

                    </p>


                </div>






                {/* CARDS */}

                <div className="related-list">


                    {
                        opportunities.map((item)=>(


                            <article

                                key={item.id || item.slug}

                                className="related-item"

                            >



                                {/* TOP */}

                                <div className="related-top">


                                    <div className="related-icon">

                                        {item.icon}

                                    </div>



                                    <span className="related-category">

                                        {item.category}

                                    </span>


                                </div>







                                {/* TITLE */}

                                <h3>

                                    {item.title}

                                </h3>







                                {/* LOCATION */}

                                <p className="related-location">

                                    📍 {item.location}

                                </p>







                                {/* META */}

                                <div className="related-info">


                                    <span>

                                        <HiOutlineClock/>

                                        {item.duration}

                                    </span>


                                </div>







                                {/* CTA */}

                                <Link

                                    to={`/opportunities/${countrySlug}/${item.slug}`}

                                    className="related-link"

                                >

                                    View Pathway


                                    <HiArrowRight/>


                                </Link>





                            </article>


                        ))
                    }


                </div>



            </div>



        </section>

    );

};


export default RelatedOpportunities;