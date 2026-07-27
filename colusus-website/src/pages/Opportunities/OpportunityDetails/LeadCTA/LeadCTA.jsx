import {
    HiArrowRight,
    HiOutlineChatAlt2,
    HiOutlineCheckCircle
} from "react-icons/hi";

import "./LeadCTA.css";


const LeadCTA = ({
    country,
    opportunity
}) => {


    const openCalendly = () => {

        window.open(
            "YOUR_CALENDLY_LINK",
            "_blank"
        );

    };


    return (

        <section className="lead-cta">


            <div className="lead-cta-card">



                <div className="lead-cta-content">


                    <div className="lead-cta-badge">

                        <span>
                            {country.flag}
                        </span>

                        Start Your Migration Journey

                    </div>





                    <h2>

                        Ready To Explore

                        <span>
                            {" "}
                            {opportunity.title}
                        </span>

                        ?

                    </h2>





                    <p>

                        Get a personalised assessment from our
                        migration specialists and understand the
                        best pathway available for your profile.

                    </p>





                    <div className="lead-cta-actions">


                        <button

                            className="lead-primary"

                            onClick={openCalendly}

                        >

                            Book Free Consultation

                            <HiArrowRight/>

                        </button>





                        <button

                            className="lead-secondary"

                        >

                            <HiOutlineChatAlt2/>

                            WhatsApp Advisor

                        </button>


                    </div>



                </div>







                <div className="lead-cta-side">


                    <div className="advisor-card">


                        <div className="advisor-icon">

                            <HiOutlineCheckCircle/>

                        </div>



                        <strong>

                            Expert Guidance

                        </strong>


                        <p>

                            Eligibility review,
                            pathway selection,
                            and application guidance.

                        </p>


                    </div>


                </div>



            </div>


        </section>

    );

};


export default LeadCTA;