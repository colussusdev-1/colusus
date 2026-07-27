import "./AboutHero.css";

import { Link } from "react-router-dom";

import {
    HiOutlineArrowRight,
    HiOutlineGlobeAlt,
    HiOutlineShieldCheck,
    HiOutlineUserGroup,
} from "react-icons/hi";

import heroImage from "../../../../assets/images/about/about.jpg";



const AboutHero = ({
    onOpenServices = () => { }
}) => {


    return (

        <section className="about-hero">


            <div className="about-hero-bg"></div>



            <div className="container about-hero-container">



                {/* CONTENT */}

                <div className="about-hero-content">


                    <span className="about-hero-tag">

                        ABOUT COLOSSUS

                    </span>




                    <h1 className="about-hero-title">

                        Helping You Cross Borders

                        <span>
                            With Confidence.
                        </span>

                    </h1>





                    <p className="about-hero-description">

                        Colossus Migration & Tours helps students,
                        professionals, entrepreneurs and families
                        relocate through trusted immigration,
                        overseas recruitment and premium travel
                        advisory services.

                    </p>







                    <div className="about-hero-buttons">



                        <button

                            type="button"

                            className="about-btn about-btn-primary"

                            onClick={() => {
                                console.log("ABOUT SERVICES CLICK");
                                onOpenServices();
                            }}

                        >
                            Explore Services

                            <HiOutlineArrowRight />

                        </button>







                        <Link

                            to="/contact"

                            className="about-btn about-btn-secondary"

                        >

                            Contact Us

                        </Link>



                    </div>



                </div>









                {/* IMAGE */}

                <div className="about-hero-image-wrapper">



                    <span className="about-hero-glow glow-one"></span>

                    <span className="about-hero-glow glow-two"></span>





                    <div className="about-hero-image-frame">


                        <div className="about-hero-image">


                            <img

                                src={heroImage}

                                alt="Colossus Migration and Tours"

                            />

                            <span className="glass-reflection"></span>


                        </div>


                    </div>









                    <div className="about-floating-card card-one">


                        <div className="card-icon">

                            <HiOutlineGlobeAlt />

                        </div>


                        <div>

                            <strong>
                                15+
                            </strong>

                            <span>
                                Countries Served
                            </span>

                        </div>


                    </div>








                    <div className="about-floating-card card-two">


                        <div className="card-icon">

                            <HiOutlineShieldCheck />

                        </div>


                        <div>

                            <strong>
                                Trusted
                            </strong>

                            <span>
                                Immigration Guidance
                            </span>

                        </div>


                    </div>









                    <div className="about-floating-card card-three">


                        <div className="card-icon">

                            <HiOutlineUserGroup />

                        </div>


                        <div>

                            <strong>
                                500+
                            </strong>

                            <span>
                                Clients Assisted
                            </span>

                        </div>


                    </div>





                </div>





            </div>


        </section>

    );

};


export default AboutHero;