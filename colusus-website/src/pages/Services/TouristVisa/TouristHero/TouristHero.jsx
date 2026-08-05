import "./TouristHero.css";

import {
    HiOutlineArrowRight,
    HiOutlineGlobeAlt,
    HiOutlineShieldCheck,
    HiOutlineDocumentText,
    HiOutlineCheckCircle
} from "react-icons/hi";

import {
    Link
} from "react-router-dom";

import heroImage from "../../../../assets/tourist/travel-hero.jpg";


const TouristHero = () => {


    return (

        <section className="tourist-hero">


            <div className="container">


                <div className="tourist-hero-wrapper">



                    {/* ==========================
                        CONTENT
                    =========================== */}


                    <div className="tourist-hero-content">


                        <span className="tourist-hero-tag">

                            GLOBAL TRAVEL SERVICES

                        </span>




                        <h1>

                            Explore The World

                            <span>

                                Without The Stress.

                            </span>

                        </h1>




                        <p>

                            From visa assessment to application
                            preparation, we guide you through every
                            step of your international travel journey
                            with confidence.

                        </p>





                        <div className="tourist-hero-actions">


                            <Link

                                to="/consultation"

                                className="tourist-primary-btn"

                            >

                                Start Your Travel Assessment

                                <HiOutlineArrowRight />

                            </Link>




                          
                          


                        </div>







                        {/* TRUST ITEMS */}


                        <div className="tourist-trust">


                            <div className="tourist-trust-item">


                                <HiOutlineGlobeAlt />


                                <div>

                                    <strong>
                                        Global Reach
                                    </strong>


                                    <span>
                                        Multiple destinations
                                    </span>

                                </div>


                            </div>





                            <div className="tourist-trust-item">


                                <HiOutlineDocumentText />


                                <div>

                                    <strong>
                                        Documentation
                                    </strong>


                                    <span>
                                        Complete guidance
                                    </span>

                                </div>


                            </div>





                            <div className="tourist-trust-item">


                                <HiOutlineShieldCheck />


                                <div>

                                    <strong>
                                        Expert Support
                                    </strong>


                                    <span>
                                        Professional assistance
                                    </span>

                                </div>


                            </div>



                        </div>



                    </div>









                    {/* ==========================
                        IMAGE AREA
                    =========================== */}


                    <div className="tourist-hero-image">



                        <div className="travel-image-badge">


                            <HiOutlineCheckCircle />


                            Trusted Travel Partner


                        </div>





                        <img

                            src={heroImage}

                            alt="International travel"

                        />






                        {/* FLOATING CARD */}


                        <div className="travel-floating-card">



                            <div className="floating-card-header">


                                <HiOutlineShieldCheck />


                                <span>
                                    Expert Guidance
                                </span>


                            </div>





                            <h3>

                                Your Journey Starts Here

                            </h3>





                            <ul>


                                <li>

                                    Visa Assessment

                                </li>



                                <li>

                                    Document Review

                                </li>



                                <li>

                                    Application Support

                                </li>


                            </ul>



                        </div>




                    </div>



                </div>



            </div>


        </section>

    );

};


export default TouristHero;