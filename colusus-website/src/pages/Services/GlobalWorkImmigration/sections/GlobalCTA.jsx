import "./GlobalCTA.css";

import {
    HiOutlinePhone,
    HiOutlineMail,
    HiOutlineArrowRight
} from "react-icons/hi";


const GlobalCTA = () => {


    return (


        <section className="global-cta-section">


            <div className="global-cta-container">


                <div className="global-cta-card">



                    {/* CONTENT SIDE */}

                    <div className="global-cta-content">


                        <span className="global-cta-badge">

                            START YOUR GLOBAL JOURNEY

                        </span>




                        <h2 className="global-cta-title">

                            Get Your Personalized Immigration Assessment

                        </h2>




                        <p className="global-cta-description">

                            Speak with a migration specialist and discover
                            the best pathway based on your profile,
                            goals and international ambitions.

                        </p>




                        <div className="global-cta-actions">


                            <button className="global-cta-primary">

                                Book Consultation

                                <HiOutlineArrowRight />

                            </button>




                   


                        </div>



                    </div>





                    {/* CONTACT SIDE */}

                    <div className="global-cta-contact">



                        <h3 className="global-cta-contact-title">

                            Contact Details

                        </h3>




                        <div className="global-cta-contact-item">


                            <div className="global-cta-icon">

                                <HiOutlineMail />

                            </div>



                            <div>

                                <span>
                                    Email
                                </span>


                                <p>
                                    admin@colossusmigration.com
                                </p>


                            </div>


                        </div>







                        <div className="global-cta-contact-item">


                            <div className="global-cta-icon">

                                <HiOutlinePhone />

                            </div>



                            <div>

                                <span>
                                    Phone
                                </span>


                                <p>
                                    +234-703-520-9306
                                </p>


                                <p>
                                    +234-902-695-3513
                                </p>


                            </div>


                        </div>






                        <div className="global-cta-note">


                            Response within 24 hours • Global support available


                        </div>




                    </div>



                </div>



            </div>



        </section>


    );


};


export default GlobalCTA;