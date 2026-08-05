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


    const openWhatsApp = () => {

        window.open(
            "YOUR_WHATSAPP_LINK",
            "_blank"
        );

    };



    return (

        <section className="lead-cta">


            <div className="lead-cta-container">


                <div className="lead-cta-content">


                    <div className="lead-cta-badge">

                        {country.flag}

                        {opportunity.title}

                    </div>




                    <h2>

                        Ready To Start Your
                        Migration Journey?

                    </h2>




                    <p>

                        Check your eligibility and speak
                        with a migration specialist.

                    </p>





                    <div className="lead-cta-actions">


                        <button

                            className="lead-primary"

                            onClick={openCalendly}

                        >

                            Start Assessment

                            <HiArrowRight />

                        </button>





                        <button

                            className="lead-secondary"

                            onClick={openWhatsApp}

                        >

                            <HiOutlineChatAlt2 />

                            Chat With Advisor

                        </button>



                    </div>




                    <div className="lead-trust">


                        <span>

                            <HiOutlineCheckCircle />

                            Expert guidance

                        </span>


                        <span>

                            <HiOutlineCheckCircle />

                            Secure process

                        </span>


                    </div>



                </div>


            </div>


        </section>

    );

};


export default LeadCTA;