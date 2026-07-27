import { HiArrowRight } from "react-icons/hi";

import { Link } from "react-router-dom";

import "./Hero.css";

import HeroTrustBar from "./HeroTrustBar";
import HeroVisual from "./HeroVisual";



const Hero = ({
    openServices
}) => {



    return (

        <section className="hero">


            {/* VIDEO BACKGROUND */}

            <div className="hero-video">

                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                >

                    <source
                        src="https://colossusmigration.com/wp-content/uploads/2026/06/COLOSSUS-ADS-VIDEO1.mp4"
                        type="video/mp4"
                    />

                </video>


            </div>





            <div className="hero-bg">

                <span className="grid-pattern"></span>

            </div>





            <div className="container hero-container">


                <div className="hero-content">



                    <div className="hero-eyebrow">


                        <span className="hero-line"></span>


                        <div>

                            <strong>
                                Colossus Migration & Tours
                            </strong>


                            <p className="hero-eyebrow-text">

                                Expert Guidance for Work,
                                Study, Travel & Immigration

                            </p>


                        </div>


                    </div>





                    <h1>

                        Your Journey To

                        <span>
                            Canada & Beyond
                        </span>

                        Starts Here.

                    </h1>






                    <p className="hero-mobile-summary">

                        Work visas, study opportunities,
                        immigration pathways and relocation
                        support for ambitious Nigerians.

                    </p>





                    <p className="hero-description">

                        We help professionals,
                        students, families, and
                        entrepreneurs migrate confidently
                        through trusted immigration pathways,
                        overseas employment, and
                        international education opportunities.

                    </p>






                    <div className="hero-buttons">


                        <Link

                            to="/free-assessment"

                            className="btn btn-primary"

                        >

                            Free Assessment

                            <HiArrowRight />

                        </Link>






                        <button

                            type="button"

                            className="btn btn-secondary"

                            onClick={openServices}

                        >

                            Explore Services


                        </button>



                    </div>






                    <HeroTrustBar />



                </div>







                <div className="hero-right">


                    <HeroVisual />


                </div>



            </div>



        </section>

    );

};



export default Hero;