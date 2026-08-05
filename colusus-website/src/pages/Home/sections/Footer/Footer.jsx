import "./Footer.css";

import { Link } from "react-router-dom";

import {
    HiOutlineMail,
    HiOutlinePhone,
    HiOutlineGlobeAlt,
    HiOutlineLocationMarker,
    HiOutlineArrowRight
} from "react-icons/hi";


const Footer = () => {


    return (

        <footer className="footer">


            {/* MAIN FOOTER */}

            <div className="footer-main">


                <div className="container footer-grid">



                    {/* BRAND */}

                    <div className="footer-col footer-brand">


                        <h3>
                            Colossus Migration
                        </h3>


                        <p>

                            Helping professionals, students,
                            families and entrepreneurs achieve
                            their global goals through trusted
                            immigration, relocation and travel
                            solutions.

                        </p>



                        <div className="contact">


                            <div className="contact-item">

                                <HiOutlineMail />

                                <span>
                                    admin@colossusmigration.com
                                </span>

                            </div>




                            <div className="contact-item">

                                <HiOutlinePhone />

                                <span>
                                    +234-703-520-9306
                                </span>

                            </div>




                            <div className="contact-item">

                                <HiOutlineLocationMarker />

                                <span>
                                    Lagos, Nigeria
                                </span>

                            </div>


                        </div>



                    </div>









                    {/* COMPANY */}


                    <div className="footer-col">


                        <h3>
                            Company
                        </h3>



                        <ul>


                            <li>
                                <Link to="/">
                                    Home
                                </Link>
                            </li>



                            <li>
                                <Link to="/about">
                                    About Us
                                </Link>
                            </li>


                            <li>
                                <Link to="/contact">
                                    Contact
                                </Link>
                            </li>



                            <li>
                                <Link to="/consultation">
                                    Book Consultation
                                </Link>
                            </li>



                        </ul>


                    </div>









                    {/* SERVICES */}



                    <div className="footer-col">


                        <h3>
                            Services
                        </h3>



                        <ul>



                            <li>

                                <Link to="/services/canada-migration">

                                    Canada Immigration

                                </Link>

                            </li>




                            <li>

                                <Link to="/services/global-works">

                                    Global Work Pathways

                                </Link>

                            </li>




                            <li>

                                <Link to="/services/tourist-visa">

                                    Tourist Visa

                                </Link>

                            </li>




                            <li>

                                <Link to="/opportunities/bulgaria">

                                    Work Opportunities

                                </Link>

                            </li>




                            <li>

                                <Link to="/free-assessment">

                                    Free Assessment

                                </Link>

                            </li>


                        </ul>



                    </div>









                    {/* EXPLORE */}



                    <div className="footer-col">


                        <h3>
                            Explore
                        </h3>



                        <ul>


                            <li>

                                <Link to="/opportunities/canada">

                                    Canada Opportunities

                                </Link>

                            </li>




                            <li>

                                <Link to="/opportunities/germany">

                                    Germany Opportunities

                                </Link>

                            </li>




                            <li>

                                <Link to="/opportunities/bulgaria">

                                    Bulgaria Opportunities

                                </Link>

                            </li>

                        </ul>



                    </div>









                    {/* NEWSLETTER */}



                    {/* <div className="footer-col newsletter-card">


                        <h3>
                            Stay Updated
                        </h3>



                        <p>

                            Get migration updates,
                            visa opportunities and
                            international travel news.

                        </p>




                        <div className="newsletter">


                            <input

                                type="email"

                                placeholder="Your email address"

                            />


                            <button>

                                <HiOutlineArrowRight />

                            </button>


                        </div>






                        <div className="newsletter-note">


                            <HiOutlineGlobeAlt />


                            <span>

                                Connecting opportunities worldwide

                            </span>


                        </div>



                    </div>
 */}



                </div>


            </div>









            {/* BOTTOM */}



            <div className="footer-bottom">


                <div className="container footer-bottom-inner">


                    <p>

                        © 2026 Colossus Migration & Tours.
                        All rights reserved.

                    </p>



                    {/* <div className="footer-legal">


                        <Link to="/privacy">

                            Privacy Policy

                        </Link>



                        <Link to="/terms">

                            Terms & Conditions

                        </Link>


                    </div> */}


                </div>


            </div>




        </footer>


    );

};



export default Footer;