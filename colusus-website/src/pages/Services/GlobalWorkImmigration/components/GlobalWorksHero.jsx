import "./GlobalWorksHero.css";

import {
    HiOutlineArrowRight,
    HiOutlineCheckCircle
} from "react-icons/hi";

import { Link } from "react-router-dom";


const GlobalWorksHero = () => {


    return (

        <section className="global-hero">


            {/* VIDEO BACKGROUND */}

            <video

                className="global-hero-video"

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



            {/* CINEMATIC OVERLAY */}

            <div className="global-hero-overlay"></div>





            <div className="global-hero-container">



                <div className="global-hero-content">



                    <span className="global-tag">

                        GLOBAL WORK & IMMIGRATION

                    </span>





                    <h1>

                        Build Your Future

                        <span>

                            Beyond Borders

                        </span>

                    </h1>





                    <p>

                        Access international career opportunities,
                        work visas and relocation pathways designed
                        for professionals seeking a better future abroad.

                    </p>






                    <div className="global-hero-actions">


                        <Link

                            to="/free-assessment"

                            className="global-primary-btn"

                        >

                            Start Free Assessment

                            <HiOutlineArrowRight />

                        </Link>




                        <Link

                            to="/opportunities"

                            className="global-secondary-btn"

                        >

                            Explore Opportunities

                        </Link>



                    </div>






                    <div className="global-trust">


                        <div>

                            <HiOutlineCheckCircle />

                            Verified Pathways

                        </div>




                        <div>

                            <HiOutlineCheckCircle />

                            Global Opportunities

                        </div>




                        <div>

                            <HiOutlineCheckCircle />

                            Expert Guidance

                        </div>


                    </div>



                </div>


            </div>



        </section>

    );

};


export default GlobalWorksHero;