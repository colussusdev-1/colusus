import { useState } from "react";
import axios from "axios";

import "./ContactForm.css";

import {
    FiMail,
    FiPhone,
    FiClock,
    FiSend,
    FiShield,
    FiGlobe,
    FiCheckCircle,
    FiAlertCircle,
} from "react-icons/fi";

const ContactForm = () => {

    const [form, setForm] = useState({

        fullName: "",

        email: "",

        phone: "",

        service: "",

        message: "",

    });

    const [loading, setLoading] = useState(false);

    const [success, setSuccess] = useState("");

    const [error, setError] = useState("");

    const handleChange = (event) => {

        const { name, value } = event.target;

        setForm((previous) => ({

            ...previous,

            [name]: value,

        }));

    };

    const handleSubmit = async (event) => {

        event.preventDefault();

        setSuccess("");

        setError("");

        if (

            !form.fullName ||

            !form.email ||

            !form.phone ||

            !form.service ||

            !form.message

        ) {

            setError("Please complete all fields.");

            return;

        }

        try {

            setLoading(true);

            await axios.post(

                `${import.meta.env.VITE_API_URL}/contact`,

                form

            );

            setSuccess(

                "Thank you! Your enquiry has been received. One of our immigration specialists will contact you shortly."

            );

            setForm({

                fullName: "",

                email: "",

                phone: "",

                service: "",

                message: "",

            });

        }

        catch (err) {

            setError(

                err.response?.data?.message ||

                "Unable to send your message. Please try again."

            );

        }

        finally {

            setLoading(false);

        }

    };

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

                            Tell us about your plans and our specialists will guide you towards the right pathway.

                        </p>

                    </div>

                    {success && (

                        <div className="contact-success">

                            <FiCheckCircle />

                            <span>{success}</span>

                        </div>

                    )}

                    {error && (

                        <div className="contact-error">

                            <FiAlertCircle />

                            <span>{error}</span>

                        </div>

                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="contact-grid">

                            <input

                                type="text"

                                name="fullName"

                                placeholder="Full Name"

                                value={form.fullName}

                                onChange={handleChange}

                            />

                            <input

                                type="email"

                                name="email"

                                placeholder="Email Address"

                                value={form.email}

                                onChange={handleChange}

                            />

                        </div>

                        <div className="contact-grid">

                            <input

                                type="tel"

                                name="phone"

                                placeholder="Phone Number"

                                value={form.phone}

                                onChange={handleChange}

                            />

                            <select

                                name="service"

                                value={form.service}

                                onChange={handleChange}

                            >

                                <option value="">

                                    Select Service

                                </option>

                                <option value="Immigration">

                                    Immigration

                                </option>

                                <option value="Overseas Jobs">

                                    Overseas Jobs

                                </option>

                                <option value="Study Abroad">

                                    Study Abroad

                                </option>

                                <option value="Offshore Company">

                                    Offshore Company

                                </option>

                                <option value="Travel Services">

                                    Travel Services

                                </option>

                            </select>

                        </div>

                        <textarea

                            rows="6"

                            name="message"

                            placeholder="Tell us about your goals..."

                            value={form.message}

                            onChange={handleChange}

                        />

                        <button

                            type="submit"

                            className="contact-submit"

                            disabled={loading}

                        >

                            {

                                loading

                                    ?

                                    "Sending..."

                                    :

                                    <>

                                        Send Message

                                        <FiSend />

                                    </>

                            }

                        </button>

                    </form>

                </div>
                {/* CONTACT INFORMATION */}

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

                        We help individuals, families and businesses navigate international opportunities with confidence through trusted immigration guidance, professional consultation and global opportunities.

                    </p>

                    <div className="info-benefits">

                        <div>

                            <FiShield />

                            <span>

                                Verified Immigration Pathways

                            </span>

                        </div>

                        <div>

                            <FiGlobe />

                            <span>

                                Global Opportunities

                            </span>

                        </div>

                    </div>

                    <div className="info-contact">

                        <div>

                            <FiMail />

                            <span>

                                admin@colossusmigration.com

                            </span>

                        </div>

                        <div>

                            <FiPhone />

                            <span>

                                +234 703 520 9306

                            </span>

                        </div>

                        <div>

                            <FiPhone />

                            <span>

                                +234 902 695 3513

                            </span>

                        </div>

                        <div>

                            <FiClock />

                            <span>

                                Monday – Saturday
                                <br />
                                9:00 AM – 6:00 PM

                            </span>

                        </div>

                    </div>

                </aside>

            </div>

        </section>

    );

};

export default ContactForm;