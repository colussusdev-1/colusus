import "./ContactForm.css";

import {
    FiMail,
    FiPhone,
    FiClock,
    FiSend,
    FiShield,
    FiGlobe
} from "react-icons/fi";


const ContactForm = () => {


    return (

        <section className="contact-section">


            <div className="contact-container">



                {/* FORM */}

                <div className="contact-form-card">


                    <div className="contact-header">

                        <span>
                            CONTACT OUR TEAM
                        </span>


                        <h2>
                            Start Your Global Journey
                        </h2>


                        <p>
                            Tell us about your plans and our specialists
                            will guide you towards the right pathway.
                        </p>


                    </div>




                    <form>


                        <div className="contact-grid">


                            <input
                                type="text"
                                placeholder="Full Name"
                            />


                            <input
                                type="email"
                                placeholder="Email Address"
                            />


                        </div>





                        <div className="contact-grid">


                            <input
                                type="text"
                                placeholder="Phone Number"
                            />


                            <select>


                                <option>
                                    Select Service
                                </option>


                                <option>
                                    Immigration
                                </option>


                                <option>
                                    Overseas Jobs
                                </option>


                                <option>
                                    Study Abroad
                                </option>


                                <option>
                                    Offshore Company
                                </option>


                                <option>
                                    Travel Services
                                </option>


                            </select>


                        </div>




                        <textarea

                            rows="5"

                            placeholder="Tell us about your goals..."

                        />




                        <button>


                            Send Message


                            <FiSend />


                        </button>



                    </form>


                </div>







                {/* INFORMATION */}



                <aside className="contact-info-card">


                    <div className="info-brand">


                        <FiGlobe />


                        <span>
                            Colossus Migration
                        </span>


                    </div>




                    <h3>

                        Professional Support
                        Beyond Borders

                    </h3>




                    <p>

                        We help individuals, families and businesses
                        navigate international opportunities with
                        confidence.

                    </p>





                    <div className="info-benefits">


                        <div>

                            <FiShield />

                            <span>
                                Verified pathways
                            </span>

                        </div>


                        <div>

                            <FiGlobe />

                            <span>
                                Global opportunities
                            </span>

                        </div>


                    </div>





                    <div className="info-contact">


                        <div>

                            <FiMail />

                            admin@colossusmigration.com

                        </div>



                        <div>

                            <FiPhone />

                            +234 703 520 9306

                        </div>



                        <div>

                            <FiPhone />

                            +234 902 695 3513

                        </div>




                        <div>

                            <FiClock />

                            Mon - Sat · 9AM - 6PM

                        </div>



                    </div>



                </aside>



            </div>



        </section>

    );

};


export default ContactForm;