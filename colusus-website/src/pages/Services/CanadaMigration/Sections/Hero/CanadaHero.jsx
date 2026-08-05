import "./CanadaHero.css";

import { Link } from "react-router-dom";

import {
    HiOutlineArrowRight,
    HiOutlineBadgeCheck,
    HiOutlineGlobeAlt,
    HiOutlineOfficeBuilding,
} from "react-icons/hi";

import heroImage from "../../../../../assets/images/countries/canada.jpg";



const CanadaHero = () => {


    return (


        <section className="canada-hero">


            <div className="container canada-hero-container">





                {/* LEFT CONTENT */}

                <div className="canada-hero-content">



                    <span className="canada-hero-tag">

                        Canada Immigration Pathway

                    </span>






                    <h1 className="canada-hero-title">


                        Build Your Future


                        <span>

                            In Canada With Confidence.

                        </span>


                    </h1>







                    <p className="canada-hero-description">


                        Explore the right immigration pathway based on
                        your goals, profile and eligibility. From Express
                        Entry and work permits to study routes and
                        permanent residence, we guide you through every
                        important step.


                    </p>









                    <div className="canada-hero-buttons">



                        <Link

                            to="/consultation"

                            className="canada-hero-btn"

                        >


                            Start Your Assessment


                            <HiOutlineArrowRight />


                        </Link>



                    </div>









                    <div className="canada-trust-row">





                        <div className="trust-pill">


                            <HiOutlineBadgeCheck />


                            <span>

                                Profile Assessment

                            </span>


                        </div>







                        <div className="trust-pill">


                            <HiOutlineOfficeBuilding />


                            <span>

                                Immigration Guidance

                            </span>


                        </div>







                        <div className="trust-pill">


                            <HiOutlineGlobeAlt />


                            <span>

                                Complete Support

                            </span>


                        </div>





                    </div>





                </div>









                {/* RIGHT IMAGE */}


                <div className="canada-hero-image">





                    <img

                        src={heroImage}

                        alt="Canada Immigration Pathway"

                    />








                    <div className="canada-status-card">





                        <span className="status-label">

                            Canada Pathways

                        </span>






                        <strong>

                            Choose The Right Route

                        </strong>







                        <div className="status-item">

                            Express Entry

                        </div>





                        <div className="status-item">

                            Work Permit

                        </div>





                        <div className="status-item">

                            Study Permit

                        </div>





                        <div className="status-item">

                            Permanent Residence

                        </div>






                    </div>






                </div>








            </div>





        </section>


    );

};



export default CanadaHero;