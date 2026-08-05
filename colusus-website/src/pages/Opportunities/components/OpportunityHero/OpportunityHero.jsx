import {
    HiArrowRight,
    HiOutlineClock,
    HiOutlineBadgeCheck,
    HiOutlineChartBar,
    HiOutlineUserGroup,
    HiOutlineGlobeAlt
} from "react-icons/hi";

import "./OpportunityHero.css";


const OpportunityHero = ({
    country
}) => {



    const pathwayCount =
        country.opportunities?.length || 0;



    const stats = [


        {
            icon: <HiOutlineChartBar />,
            label: "Opportunity Score",
            value: country.opportunityScore || "High"
        },


        {
            icon: <HiOutlineBadgeCheck />,
            label: "Visa Route",
            value: country.visa || "Work Permit"
        },


        {
            icon: <HiOutlineClock />,
            label: "Processing",
            value:
                country.processingTime ||
                country.duration ||
                "Available"
        },


        {
            icon: <HiOutlineUserGroup />,
            label: "Applicants",
            value:
                country.applicants || "500+"
        },


        {
            icon: <HiOutlineGlobeAlt />,
            label: "Pathways",
            value:
                `${pathwayCount} Available`
        }


    ];







    const explorePathways = () => {


        document
            .getElementById("opportunity-explorer")
            ?.scrollIntoView({

                behavior: "smooth"

            });


    };







    const contactAdvisor = () => {


        document
            .getElementById("contact")
            ?.scrollIntoView({

                behavior: "smooth"

            });


    };








    return (


        <section className="opportunity-hero">



            <img

                src={country.image}

                alt={`${country.name} migration opportunities`}

                className="opportunity-hero-image"

            />




            <div className="opportunity-overlay" />







            <div className="opportunity-container">





                {
                    country.featured && (

                        <div className="featured-badge">

                            ⭐ Featured Destination

                        </div>

                    )
                }







                <div className="country-badge">


                    <span className="country-flag-icon">

                        {country.flag}

                    </span>





                    <div className="country-badge-copy">


                        <small>
                            Destination
                        </small>


                        <strong>

                            {country.name}

                        </strong>


                    </div>


                </div>









                <div className="country-tags">


                    {
                        country.category?.slice(0, 4)
                            .map((item) => (

                                <span key={item}>

                                    {item}

                                </span>

                            ))
                    }


                </div>









                <h1>


                    Unlock Your Future


                    <span>

                        In {country.name}

                    </span>


                </h1>









                <p>

                    {
                        country.description ||
                        `Explore verified migration pathways and opportunities in ${country.name}.`
                    }


                </p>









                <div className="hero-actions">



                    <button

                        className="hero-primary-action"

                        onClick={explorePathways}

                    >

                        Explore Pathways

                        <HiArrowRight />

                    </button>







                    <button

                        className="hero-secondary-action"

                        onClick={contactAdvisor}

                    >

                        Talk To An Expert

                    </button>




                </div>









                <div className="hero-stats">


                    {
                        stats.map((item) => (


                            <div

                                className="hero-stat"

                                key={item.label}

                            >



                                <div className="hero-stat-icon">

                                    {item.icon}

                                </div>






                                <div className="hero-stat-content">


                                    <span>

                                        {item.label}

                                    </span>



                                    <strong>

                                        {item.value}

                                    </strong>


                                </div>



                            </div>


                        ))
                    }



                </div>






            </div>



        </section>


    );

};


export default OpportunityHero;