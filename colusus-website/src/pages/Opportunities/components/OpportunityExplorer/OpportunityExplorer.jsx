import { useState } from "react";

import {
    HiOutlineBriefcase,
    HiOutlineAcademicCap,
    HiOutlineHome,
    HiOutlineOfficeBuilding
} from "react-icons/hi";

import OpportunityCard from "./OpportunityCard";

import "./OpportunityExplorer.css";


const categories = [
    {
        name:"All",
        icon:null
    },
    {
        name:"Jobs",
        icon:<HiOutlineBriefcase />
    },
    {
        name:"Study",
        icon:<HiOutlineAcademicCap />
    },
    {
        name:"Residency",
        icon:<HiOutlineHome />
    },
    {
        name:"Business",
        icon:<HiOutlineOfficeBuilding />
    }
];



const OpportunityExplorer = ({
    country
}) => {


    const [activeCategory,setActiveCategory] =
        useState("All");



    if(!country) return null;



    const opportunities =
        country.opportunities || [];




    const filteredOpportunities =

        activeCategory === "All"

        ?

        opportunities

        :

        opportunities.filter(
            item =>
            item.category === activeCategory
        );




    return (


        <section
            id="opportunity-explorer"
            className="opportunity-explorer"
        >



            <div className="explorer-container">





                {/* HEADER */}


                <div className="explorer-header">



                    <div className="explorer-header-left">



                        <div className="explorer-badge">


                            <span className="explorer-flag">

                                {country.flag}

                            </span>


                            Explore {country.name} Pathways


                        </div>







                        <h2>

                            Find The Right Opportunity
                            
                            <span>

                                For Your Future

                            </span>


                        </h2>







                        <p>

                            Discover available work,
                            study, residency and business
                            pathways designed for people
                            looking to build a future in
                            {` ${country.name}`}.


                        </p>



                    </div>








                    {/* RESULTS */}


                    <div className="explorer-results">


                        <strong>

                            {filteredOpportunities.length}

                        </strong>


                        <span>

                            Available Pathways

                        </span>


                    </div>



                </div>









                {/* FILTER NAV */}


                <div className="explorer-tabs">


                    {
                        categories.map(category => (


                            <button

                                key={category.name}

                                className={

                                    activeCategory === category.name

                                    ?

                                    "active"

                                    :

                                    ""

                                }


                                onClick={()=>{

                                    setActiveCategory(
                                        category.name
                                    );

                                }}

                            >



                                {
                                    category.icon &&
                                    <span>
                                        {category.icon}
                                    </span>
                                }


                                {category.name}



                            </button>


                        ))
                    }


                </div>









                {/* OPPORTUNITY GRID */}


                <div className="explorer-grid">


                    {

                        filteredOpportunities.length > 0


                        ?


                        filteredOpportunities.map(
                            opportunity => (


                                <OpportunityCard

                                    key={
                                        opportunity.id
                                    }

                                    opportunity={
                                        opportunity
                                    }

                                    countrySlug={
                                        country.slug
                                    }


                                />


                            )
                        )


                        :


                        (

                            <div className="no-opportunities">


                                <h3>

                                    No Pathways Available

                                </h3>


                                <p>

                                    Contact our advisors
                                    and we will help you
                                    find the best route.

                                </p>


                            </div>


                        )


                    }


                </div>




            </div>



        </section>


    );

};


export default OpportunityExplorer;