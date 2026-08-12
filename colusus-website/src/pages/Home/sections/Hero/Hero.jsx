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

            {/* =================================================
                VIDEO BACKGROUND
            ================================================= */}

            <div className="hero-video">

                <video
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

            </div>


            {/* =================================================
                HERO BACKGROUND
            ================================================= */}

            <div className="hero-bg">

                <span className="grid-pattern"></span>

            </div>


            {/* =================================================
                HERO CONTAINER
            ================================================= */}

            <div className="container hero-container">


                {/* =================================================
                    HERO CONTENT
                ================================================= */}

                <div className="hero-content">


                    {/* =================================================
                        EYEBROW
                    ================================================= */}

                    <div className="hero-eyebrow hero-animate hero-animate-1">

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


                    {/* =================================================
                        HERO TITLE
                    ================================================= */}

                    <h1 className="hero-animate hero-animate-2">

                        Your Journey To

                        <span>
                            Canada, UK, Germany & Australia
                        </span>

                        Starts Here... And Beyond.

                    </h1>


                    {/* =================================================
                        MOBILE SUMMARY
                    ================================================= */}

                    <p className="hero-mobile-summary hero-animate hero-animate-3">

                        Work visas, study opportunities,
                        immigration pathways and relocation
                        support for ambitious Nigerians.

                    </p>


                    {/* =================================================
                        DESCRIPTION
                    ================================================= */}

                    <p className="hero-description hero-animate hero-animate-4">

                        We help professionals,
                        students, families, and
                        entrepreneurs migrate confidently
                        through trusted immigration pathways,
                        overseas employment, and
                        international education opportunities.

                    </p>


                    {/* =================================================
                        ACTION BUTTONS
                    ================================================= */}

                    <div className="hero-buttons hero-animate hero-animate-5">


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


                    {/* =================================================
                        TRUST BAR
                    ================================================= */}

                    <div className="hero-animate hero-animate-6">

                        <HeroTrustBar />

                    </div>


                </div>


                {/* =================================================
                    HERO VISUAL
                ================================================= */}

                <div className="hero-right hero-visual-animate">

                    <HeroVisual />

                </div>


            </div>


        </section>

    );

};


export default Hero;