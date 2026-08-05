import { useMemo, useState } from "react";

import {
    HiOutlineBriefcase,
    HiOutlineAcademicCap,
    HiOutlineHome,
    HiOutlineOfficeBuilding,
    HiOutlineHeart,
    HiOutlineCurrencyEuro,
    HiOutlineClock,
    HiOutlineCollection,
    HiOutlineCheckCircle
} from "react-icons/hi";

import OpportunityCard from "./OpportunityCard";

import "./OpportunityExplorer.css";



const categories = [

    {
        name: "All",
        icon: <HiOutlineCollection />
    },

    {
        name: "Jobs",
        icon: <HiOutlineBriefcase />
    },

    {
        name: "Study",
        icon: <HiOutlineAcademicCap />
    },

    {
        name: "Residency",
        icon: <HiOutlineHome />
    },

    {
        name: "Business",
        icon: <HiOutlineOfficeBuilding />
    },

    {
        name: "Healthcare",
        icon: <HiOutlineHeart />
    }

];




const OpportunityExplorer = ({
    country
}) => {


    const [activeCategory, setActiveCategory] =
        useState("All");



    if (!country) return null;



    const opportunities =
        country.opportunities || [];




    const filteredOpportunities =
        useMemo(() => {


            if (activeCategory === "All") {
                return opportunities;
            }



            return opportunities.filter(item => {


                const category =
                    item.category?.toLowerCase();


                const type =
                    item.type?.toLowerCase();


                const badge =
                    item.badge?.toLowerCase();



                const selected =
                    activeCategory.toLowerCase();



                return (

                    category === selected ||

                    type?.includes(selected) ||

                    badge?.includes(selected)

                );


            });



        }, [
            activeCategory,
            opportunities
        ]);







    const totalPositions =
        useMemo(() => {


            return filteredOpportunities.reduce(
                (total, item) => {


                    if (!item.positions) {
                        return total;
                    }



                    return (

                        total +

                        item.positions.reduce(
                            (count, position) => {


                                return (

                                    count +

                                    (
                                        position.roles
                                            ?
                                            position.roles.length
                                            :
                                            1
                                    )

                                );


                            },
                            0
                        )

                    );


                },
                0
            );


        }, [
            filteredOpportunities
        ]);







    return (

        <section
            className="opportunity-explorer"
            id="opportunity-explorer"
        >


            <div className="explorer-container">





                {/* HEADER */}

                <header className="explorer-header">


                    <div className="explorer-header-left">



                        <div className="explorer-badge">


                            <span className="explorer-flag">

                                {country.flag}

                            </span>


                            Explore {country.name} Opportunities


                        </div>






                        <h2>

                            Choose The Right Pathway

                            <span>

                                Build Your Future In {country.name}

                            </span>


                        </h2>







                        <p>

                            Discover verified work, study, residency,
                            healthcare and business migration routes.
                            Compare opportunities and find the pathway
                            that matches your goals.

                        </p>




                        <div className="explorer-trust">


                            <div>

                                <HiOutlineCheckCircle />

                                Verified Programs

                            </div>



                            <div>

                                <HiOutlineCheckCircle />

                                Expert Guidance

                            </div>



                            <div>

                                <HiOutlineCheckCircle />

                                Full Support

                            </div>


                        </div>



                    </div>


                </header>









                {/* STATS */}


                <div className="explorer-overview">



                    <div className="overview-card">


                        <HiOutlineCollection />


                        <div>

                            <strong>
                                {filteredOpportunities.length}
                            </strong>

                            <span>
                                Programs
                            </span>


                        </div>


                    </div>







                    <div className="overview-card">


                        <HiOutlineBriefcase />


                        <div>

                            <strong>
                                {totalPositions}+
                            </strong>

                            <span>
                                Positions
                            </span>


                        </div>


                    </div>







                    <div className="overview-card">


                        <HiOutlineCurrencyEuro />


                        <div>

                            <strong>
                                High
                            </strong>

                            <span>
                                Salary Potential
                            </span>


                        </div>


                    </div>







                    <div className="overview-card">


                        <HiOutlineClock />


                        <div>

                            <strong>
                                {country.processingTime || "Fast"}
                            </strong>

                            <span>
                                Processing
                            </span>


                        </div>


                    </div>



                </div>









                {/* FILTER HEADER */}



                <div className="explorer-filter-header">


                    <h3>
                        Available Pathways
                    </h3>


                    <span>

                        {filteredOpportunities.length}
                        Results

                    </span>


                </div>










                {/* FILTERS */}



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


                                onClick={() => setActiveCategory(category.name)}

                            >


                                <span>

                                    {category.icon}

                                </span>


                                {category.name}


                            </button>


                        ))
                    }



                </div>









                {/* CARDS */}


                <div className="explorer-grid">


                    {
                        filteredOpportunities.length > 0


                            ?


                            filteredOpportunities.map(opportunity => (


                                <OpportunityCard

                                    key={opportunity.id}

                                    opportunity={opportunity}

                                    countrySlug={country.slug}

                                />


                            ))


                            :


                            <div className="no-opportunities">


                                <h3>
                                    No Opportunities Available
                                </h3>


                                <p>

                                    Try another pathway or speak with
                                    our migration advisors.

                                </p>


                            </div>


                    }


                </div>





            </div>


        </section>


    );

};


export default OpportunityExplorer;