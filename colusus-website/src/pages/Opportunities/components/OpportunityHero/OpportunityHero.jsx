import {
    HiArrowRight,
    HiOutlineClock,
    HiOutlineUsers,
    HiOutlineBadgeCheck
} from "react-icons/hi";

import "./OpportunityHero.css";


const OpportunityHero = ({
    country
}) => {


    const stats = [

        {
            icon:<HiOutlineUsers />,
            label:"Applicants Guided",
            value:`${country.applicants}+`
        },

        {
            icon:<HiOutlineBadgeCheck />,
            label:"Primary Route",
            value:country.visa
        },

        {
            icon:<HiOutlineClock />,
            label:"Timeline",
            value:country.duration
        }

    ];



    const explorePathways = () => {

        document
        .getElementById("opportunity-explorer")
        ?.scrollIntoView({
            behavior:"smooth"
        });

    };



    const contactAdvisor = () => {

        document
        .getElementById("contact")
        ?.scrollIntoView({
            behavior:"smooth"
        });

    };



    return (

        <section className="opportunity-hero">


            <img

                src={country.image}

                alt={`${country.name} opportunities`}

                className="opportunity-hero-image"

            />



            <div className="opportunity-overlay"></div>





            <div className="opportunity-container">



                <div className="country-badge">


                    <span className="country-flag-icon">


                        {
                            country.flagImage ? (

                                <img
                                    src={country.flagImage}
                                    alt={`${country.name} flag`}
                                />

                            ) : (

                                <span>
                                    {country.flag}
                                </span>

                            )
                        }


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







                <h1>

                    Unlock Your Future

                    <span>
                        In {country.name}
                    </span>

                </h1>






                <p>

                    {country.description}

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
                        stats.map((item)=>(


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