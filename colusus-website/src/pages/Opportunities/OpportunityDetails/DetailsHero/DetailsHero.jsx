import {
    HiArrowRight,
    HiOutlineBadgeCheck,
    HiOutlineLocationMarker,
    HiOutlineClock,
    HiOutlineTrendingUp,
    HiOutlineOfficeBuilding,
    HiOutlineCurrencyEuro,
    HiOutlineCheckCircle,
    HiOutlineChevronRight,
    HiOutlineDownload
} from "react-icons/hi";

import "./DetailsHero.css";


const DetailsHero = ({ country, opportunity }) => {


    const goToConsultation = () => {

        window.location.href = "/consultation";

    };


    const highlights =
        opportunity.highlights ||
        opportunity.benefits ||
        [];



    const totalRoles =
        opportunity.positions?.reduce(

            (total, item) => {

                return total +
                    (item.roles?.length || 1);

            },

            0

        ) || 0;



    return (

        <section className="opportunity-hero">


            <div className="opportunity-hero-container">



                {/* BREADCRUMB */}

                <div className="opportunity-hero-breadcrumb">


                    <span>Home</span>

                    <HiOutlineChevronRight />

                    <span>Opportunities</span>

                    <HiOutlineChevronRight />

                    <span>{country.name}</span>

                    <HiOutlineChevronRight />

                    <strong>
                        {opportunity.title}
                    </strong>


                </div>





                {/* HEADER */}

                <div className="opportunity-hero-header">


                    <div className="opportunity-hero-country">


                        <span className="opportunity-hero-flag">

                            {country.flag}

                        </span>


                        <span>

                            {country.name}

                        </span>


                    </div>





                    <div className="opportunity-hero-verified">


                        <HiOutlineBadgeCheck />

                        Verified Migration Opportunity


                    </div>



                </div>







                {/* MAIN */}

                <div className="opportunity-hero-main">





                    {/* CONTENT */}


                    <div className="opportunity-hero-content">



                        <span className="opportunity-hero-category">


                            {
                                opportunity.subtitle ||
                                opportunity.category ||
                                "Employment Program"
                            }


                        </span>





                        <h1>

                            {opportunity.title}

                        </h1>





                        <p className="opportunity-hero-description">


                            {opportunity.description}


                        </p>







                        {/* TRUST */}


                        <div className="opportunity-hero-trust">


                            {

                                highlights.slice(0, 4)
                                    .map(

                                        (item, index) => (


                                            <div

                                                key={index}

                                                className="opportunity-trust-item"

                                            >


                                                <HiOutlineCheckCircle />


                                                <span>

                                                    {item}

                                                </span>



                                            </div>


                                        )

                                    )

                            }


                        </div>









                        {/* ACTIONS */}


                        <div className="opportunity-hero-actions">



                            <button

                                className="opportunity-hero-primary"

                                onClick={goToConsultation}

                            >

                                Apply Now

                                <HiArrowRight />

                            </button>





                            <button

                                className="opportunity-hero-secondary"

                                onClick={goToConsultation}

                            >

                                Book Consultation


                            </button>





                            <button

                                className="opportunity-hero-download"

                            >


                                <HiOutlineDownload />

                                Download Guide


                            </button>



                        </div>





                    </div>









                    {/* IMAGE AREA */}



                    <div className="opportunity-hero-showcase">



                        <div className="opportunity-hero-image">



                            <img

                                src={
                                    opportunity.image ||
                                    country.image
                                }

                                alt={opportunity.title}

                            />




                            <div className="opportunity-salary-card">


                                <span>
                                    Estimated Salary
                                </span>



                                <strong>

                                    {
                                        opportunity.salary ||
                                        "Contact Us"
                                    }

                                </strong>



                            </div>



                        </div>







                        <aside className="opportunity-summary-card">


                            <h3>

                                Opportunity Snapshot

                            </h3>




                            <div className="opportunity-summary-list">



                                <div>


                                    <HiOutlineBadgeCheck />

                                    <span>
                                        Visa
                                    </span>


                                    <strong>
                                        {country.visa}
                                    </strong>


                                </div>





                                <div>


                                    <HiOutlineClock />

                                    <span>
                                        Processing
                                    </span>


                                    <strong>

                                        {
                                            country.processingTime ||
                                            "6 Weeks"
                                        }

                                    </strong>


                                </div>






                                <div>


                                    <HiOutlineTrendingUp />

                                    <span>
                                        Demand
                                    </span>


                                    <strong>

                                        {
                                            opportunity.demand ||
                                            "High"
                                        }

                                    </strong>


                                </div>







                                <div>


                                    <HiOutlineLocationMarker />

                                    <span>
                                        Location
                                    </span>


                                    <strong>

                                        {
                                            opportunity.location ||
                                            country.name
                                        }

                                    </strong>


                                </div>



                            </div>



                        </aside>



                    </div>






                </div>









                {/* METRICS */}


                <div className="opportunity-hero-metrics">


                    <div>

                        <HiOutlineCurrencyEuro />

                        <span>
                            Salary
                        </span>

                        <strong>
                            {
                                opportunity.salary ||
                                "Contact Us"
                            }
                        </strong>


                    </div>




                    <div>

                        <HiOutlineClock />

                        <span>
                            Duration
                        </span>

                        <strong>

                            {
                                opportunity.duration ||
                                "Varies"
                            }

                        </strong>


                    </div>




                    <div>

                        <HiOutlineTrendingUp />

                        <span>
                            Demand
                        </span>

                        <strong>

                            {
                                opportunity.demand ||
                                "High"
                            }

                        </strong>


                    </div>




                    <div>

                        <HiOutlineLocationMarker />

                        <span>
                            Location
                        </span>


                        <strong>

                            {
                                opportunity.location ||
                                country.name
                            }

                        </strong>


                    </div>





                    <div>

                        <HiOutlineOfficeBuilding />

                        <span>
                            Open Roles
                        </span>


                        <strong>

                            {totalRoles}

                        </strong>


                    </div>



                </div>





            </div>


        </section>

    );

};


export default DetailsHero;