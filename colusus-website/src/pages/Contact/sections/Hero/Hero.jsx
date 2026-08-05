import "./Hero.css";

import {
    FiArrowRight,
    FiGlobe,
    FiShield,
    FiClock
} from "react-icons/fi";

import {
    useNavigate
} from "react-router-dom";


const Hero = () => {


    const navigate = useNavigate();



    return (

        <section className="contact-hero">


            <div className="contact-hero-glow"></div>



            <div className="contact-hero-container">



                <span className="contact-badge">

                    CONTACT COLOSSUS MIGRATION

                </span>





                <h1>

                    Your Journey Abroad

                    <span>

                        Starts With A Conversation

                    </span>

                </h1>





                <p>

                    Whether you are planning to study overseas,
                    secure international employment, relocate your
                    family or explore global opportunities, our
                    experts are ready to guide your next move.

                </p>





                <div className="contact-actions">


                    <button

                        onClick={() => navigate("/consultation")}

                        className="contact-primary"

                    >

                        Book Consultation

                        <FiArrowRight />

                    </button>







                </div>





                <div className="contact-trust">



                    <div>

                        <FiGlobe />

                        <span>

                            Global Opportunities

                        </span>

                    </div>




                    <div>

                        <FiShield />

                        <span>

                            Trusted Guidance

                        </span>

                    </div>




                    <div>

                        <FiClock />

                        <span>

                            Fast Response

                        </span>

                    </div>



                </div>





            </div>

        </section>

    );

};


export default Hero;