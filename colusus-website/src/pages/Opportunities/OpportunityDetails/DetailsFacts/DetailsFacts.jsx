import {
    HiOutlineCurrencyDollar,
    HiOutlineClock,
    HiOutlineBadgeCheck,
    HiOutlineTrendingUp,
    HiOutlineLocationMarker
} from "react-icons/hi";

import "./DetailsFacts.css";


const DetailsFacts = ({
    country,
    opportunity
}) => {


    const facts = [

        {
            icon: <HiOutlineCurrencyDollar />,
            label: "Salary Range",
            value:
                opportunity.salary ||
                "Available Upon Assessment"
        },


        {
            icon: <HiOutlineClock />,
            label: "Processing Time",
            value:
                opportunity.duration ||
                country.duration ||
                "Varies"
        },


        {
            icon: <HiOutlineBadgeCheck />,
            label: "Migration Route",
            value:
                opportunity.type ||
                country.visa
        },


        {
            icon: <HiOutlineTrendingUp />,
            label: "Demand Level",
            value:
                opportunity.demand ||
                country.successRate ||
                "High"
        },


        {
            icon: <HiOutlineLocationMarker />,
            label: "Destination",
            value:
                opportunity.location ||
                country.name
        }

    ];



    return (

        <section className="details-facts">


            <div className="details-facts-container">


                <div className="facts-header">

                    <span>
                        Opportunity Overview
                    </span>

                    <p>
                        Key information to help you understand this migration pathway.
                    </p>

                </div>




                <div className="facts-grid">


                    {
                        facts.map((fact) => (

                            <div

                                className="details-fact"

                                key={fact.label}

                            >

                                <div className="details-fact-icon">

                                    {fact.icon}

                                </div>



                                <div className="details-fact-content">


                                    <span>

                                        {fact.label}

                                    </span>


                                    <strong>

                                        {fact.value}

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


export default DetailsFacts;