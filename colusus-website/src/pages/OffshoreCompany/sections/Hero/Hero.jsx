import "./Hero.css";

import {
    FiArrowRight,
    FiGlobe,
    FiShield,
    FiCreditCard
} from "react-icons/fi";

import {
    useNavigate
} from "react-router-dom";


const Hero = () => {


    const navigate = useNavigate();



    const scrollToJurisdictions = () => {


        document
        .getElementById("jurisdictions")
        ?.scrollIntoView({

            behavior:"smooth",

            block:"start"

        });


    };




    return (

        <section className="offshore-hero">



            {/* BACKGROUND IMAGE */}

            <div className="offshore-hero__background"></div>


            <div className="offshore-hero__overlay"></div>





            <div className="offshore-hero__container">


                <div className="offshore-hero__content">





                    <span className="offshore-badge">

                        Global Business Expansion

                    </span>






                    <h1>

                        Expand Your Business

                        <span>

                            Beyond Borders

                        </span>

                    </h1>







                    {/* DESKTOP DESCRIPTION */}

                    <p className="offshore-description desktop-copy">


                        Launch your company in trusted global
                        jurisdictions with expert support for
                        incorporation, compliance, banking and
                        international business strategies.


                    </p>







                    {/* MOBILE DESCRIPTION */}

                    <p className="offshore-description mobile-copy">


                        Set up your global company with
                        expert guidance.


                    </p>









                    <div className="offshore-actions">





                        <button

                            className="offshore-primary"

                            onClick={() =>
                                navigate("/consultation")
                            }

                        >

                            Book Consultation


                            <FiArrowRight />

                        </button>









                        <button

                            className="offshore-secondary"

                            onClick={scrollToJurisdictions}

                        >

                            Explore Jurisdictions


                        </button>






                    </div>









                    <div className="offshore-trust">





                        <div>

                            <FiGlobe />

                            <span>

                                Global Setup

                            </span>

                        </div>







                        <div>

                            <FiShield />

                            <span>

                                Compliance

                            </span>

                        </div>







                        <div>

                            <FiCreditCard />

                            <span>

                                Banking

                            </span>

                        </div>






                    </div>







                </div>






            </div>







        </section>

    );

};


export default Hero;