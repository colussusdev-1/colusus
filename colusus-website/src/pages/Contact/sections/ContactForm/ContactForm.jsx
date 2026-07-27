import "./ContactForm.css";

import {
    FiMail,
    FiPhone,
    FiClock,
    FiSend
} from "react-icons/fi";

const ContactForm = () => {

    return (

        <section className="contact-section">

            <div className="contact-container">

                {/* FORM */}

                <div className="contact-form-card">

                    <h2>

                        Send Us A Message

                    </h2>

                    <p>

                        Tell us about your goals and we'll
                        get back to you shortly.

                    </p>

                    <form>

                        <input
                            type="text"
                            placeholder="Full Name"
                        />

                        <input
                            type="email"
                            placeholder="Email Address"
                        />

                        <input
                            type="text"
                            placeholder="Phone Number"
                        />

                        <select>

                            <option>

                                Immigration

                            </option>

                            <option>

                                Overseas Jobs

                            </option>

                            <option>

                                Offshore Company

                            </option>

                            <option>

                                Study Abroad

                            </option>

                            <option>

                                Travel Services

                            </option>

                        </select>

                        <textarea
                            rows="5"
                            placeholder="Tell us how we can help..."
                        />

                        <button type="submit">

                            Send Message

                            <FiSend />

                        </button>

                    </form>

                </div>

                {/* INFO */}

                <div className="contact-info-card">

                    <h3>

                        Colossus Migration & Tours

                    </h3>

                    <p>

                        Helping individuals, families
                        and businesses achieve their
                        international goals.

                    </p>

                    <div className="info-item">

                        <FiMail />

                        <span>

                            admin@colossusmigration.com

                        </span>

                    </div>

                    <div className="info-item">

                        <FiPhone />

                        <span>

                            +234-703-520-9306

                        </span>

                    </div>

                    <div className="info-item">

                        <FiPhone />

                        <span>

                            +234-902-695-3513

                        </span>

                    </div>

                    <div className="info-item">

                        <FiClock />

                        <span>

                            Mon - Sat · 9AM - 6PM

                        </span>

                    </div>

                </div>

            </div>

        </section>

    );

};

export default ContactForm;