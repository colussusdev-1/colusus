import "./TouristCTA.css";

import {
    HiOutlineArrowRight,
    HiOutlineGlobeAlt,
    HiOutlineShieldCheck,
    HiOutlineDocumentText
} from "react-icons/hi";

import {
    Link
} from "react-router-dom";


const TouristCTA = () => {


    return (

        <section className="tourist-cta">


            <div className="container">


                <div className="tourist-cta-card">


                    {/* Background Glow */}

                    <div className="tourist-cta-glow"></div>




                    <div className="tourist-cta-content">



                        <span className="tourist-cta-tag">

                            START YOUR JOURNEY

                        </span>





                        <h2>

                            Your Dream Destination

                            <span>

                                Is Closer Than You Think

                            </span>

                        </h2>





                        <p>

                            Whether you are planning a holiday,
                            business trip, study journey or visiting
                            loved ones abroad, our experts help you
                            understand your options, prepare your
                            documents and move forward confidently.

                        </p>





                        <div className="tourist-cta-actions">



                            <Link

                                to="/consultation"

                                className="tourist-cta-primary"

                            >

                                Book Your Consultation

                                <HiOutlineArrowRight />

                            </Link>







                        </div>







                        <div className="tourist-cta-trust">





                            <div className="cta-trust-item">


                                <HiOutlineGlobeAlt />


                                <span>

                                    Global Destinations

                                </span>


                            </div>






                            <div className="cta-trust-item">


                                <HiOutlineDocumentText />


                                <span>

                                    Document Guidance

                                </span>


                            </div>






                            <div className="cta-trust-item">


                                <HiOutlineShieldCheck />


                                <span>

                                    Expert Support

                                </span>


                            </div>





                        </div>





                    </div>





                </div>




            </div>



        </section>

    );

};


export default TouristCTA;