import {
    HiOutlineCash,
    HiOutlineClock,
    HiOutlineBadgeCheck,
    HiOutlineTrendingUp
} from "react-icons/hi";

import "./DetailsFacts.css";


const DetailsFacts = ({
    country,
    opportunity
}) => {


    const facts = [

        {
            id:1,
            label:"Salary",
            value:opportunity.salary || "Competitive",
            icon:<HiOutlineCash />,
            theme:"salary"
        },

        {
            id:2,
            label:"Processing Time",
            value:opportunity.duration || "Flexible",
            icon:<HiOutlineClock />,
            theme:"time"
        },

        {
            id:3,
            label:"Visa Pathway",
            value:opportunity.type || "Migration Route",
            icon:<HiOutlineBadgeCheck />,
            theme:"visa"
        },

        {
            id:4,
            label:"Market Demand",
            value:
                opportunity.demand ||
                country.successRate ||
                "High",
            icon:<HiOutlineTrendingUp />,
            theme:"demand"
        }

    ];



    return (

        <section className="migration-facts">


            <div className="migration-facts-container">


                <div className="migration-facts-grid">


                    {
                        facts.map((fact,index)=>(


                            <article

                                key={fact.id}

                                className={`migration-fact-card ${fact.theme}`}

                                style={{
                                    animationDelay:`${index * .1}s`
                                }}

                            >



                                <div className="migration-fact-top">


                                    <div className="migration-fact-icon">

                                        {fact.icon}

                                    </div>



                                    <span>

                                        {fact.label}

                                    </span>


                                </div>




                                <strong>

                                    {fact.value}

                                </strong>



                            </article>


                        ))
                    }



                </div>


            </div>


        </section>

    );

};


export default DetailsFacts;