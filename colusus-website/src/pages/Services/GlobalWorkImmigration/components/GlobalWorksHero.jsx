import "./GlobalWorksHero.css";

import {
    HiOutlineArrowRight,
    HiOutlineCheckCircle
} from "react-icons/hi";

import { Link } from "react-router-dom";


const GlobalWorksHero = () => {

    return (

        <section className="global-hero">


            {/* =================================================
                VIDEO BACKGROUND
            ================================================= */}

            <video
                className="global-hero-video"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
            >

                <source
                    src="https://res.cloudinary.com/hq1esbh0/video/upload/v1786377430/colusus.mp4"
                    type="video/mp4"
                />

                Your browser does not support
                the video element.

            </video>


            {/* =================================================
                CINEMATIC OVERLAY
            ================================================= */}

            <div className="global-hero-overlay"></div>


            {/* =================================================
                HERO CONTAINER
            ================================================= */}

            <div className="global-hero-container">


                <div className="global-hero-content">


                    {/* =================================================
                        TAG
                    ================================================= */}

                    <span className="global-tag">

                        GLOBAL WORK & IMMIGRATION

                    </span>


                    {/* =================================================
                        HEADING
                    ================================================= */}

                    <h1>

                        Build Your Future

                        <span>

                            Beyond Borders

                        </span>

                    </h1>


                    {/* =================================================
                        DESCRIPTION
                    ================================================= */}

                    <p>

                        Access international career opportunities,
                        work visas and relocation pathways designed
                        for professionals seeking a better future abroad.

                    </p>


                    {/* =================================================
                        ACTIONS
                    ================================================= */}

                    <div className="global-hero-actions">


                        <Link
                            to="/free-assessment"
                            className="global-primary-btn"
                        >

                            Start Free Assessment

                            <HiOutlineArrowRight />

                        </Link>


                     


                    </div>


                    {/* =================================================
                        TRUST
                    ================================================= */}

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