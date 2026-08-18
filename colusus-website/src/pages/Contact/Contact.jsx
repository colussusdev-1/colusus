import { useState } from "react";
import axios from "axios";

import {
    FiArrowRight,
    FiPhone,
    FiMail,
    FiMessageCircle,
    FiMapPin,
    FiClock,
    FiShield,
    FiGlobe,
    FiCheckCircle,
    FiAlertCircle,
} from "react-icons/fi";

import { Link } from "react-router-dom";

import migrationBackground from "../../assets/tourist/trust/migration-trust-background.png";

import "./Contact.css";


const Contact = () => {

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


    const phoneOne = "+234 703 520 9306";
    const phoneTwo = "+234 902 695 3513";

    const email = "admin@colossusmigration.com";

    const whatsapp = "2347035209306";


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
                "Your enquiry has been received. Our team will contact you shortly."
            );


            setForm({
                fullName: "",
                email: "",
                phone: "",
                service: "",
                message: "",
            });

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Unable to send your message. Please try again."
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <main
            className="contact-page"
            style={{
                "--contact-background": `url(${migrationBackground})`,
            }}
        >


            {/* =====================================================
                HERO
            ===================================================== */}

            <section className="contact-hero">

                <div className="contact-background" />


                <div className="container contact-container">

                    <div className="contact-hero-content">


                        <span className="contact-eyebrow">

                            <span />

                            CONTACT COLOSSUS MIGRATION

                        </span>


                        <h1>

                            Let's Talk About

                            <strong>
                                Your Journey Abroad.
                            </strong>

                        </h1>


                        <p>

                            Whether you're planning to study, work,
                            visit family or explore a new destination,
                            our team is ready to help you understand
                            your next step.

                        </p>


                        <div className="contact-hero-actions">

                            <Link
                                to="/consultation"
                                className="contact-primary-button"
                            >

                                Book Consultation

                                <FiArrowRight />

                            </Link>


                            <a
                                href={`https://wa.me/${whatsapp}`}
                                target="_blank"
                                rel="noreferrer"
                                className="contact-secondary-button"
                            >

                                <FiMessageCircle />

                                Talk On WhatsApp

                            </a>

                        </div>


                        <div className="contact-trust">

                            <div>

                                <FiShield />

                                <span>
                                    Trusted Guidance
                                </span>

                            </div>


                            <div>

                                <FiGlobe />

                                <span>
                                    Global Opportunities
                                </span>

                            </div>


                            <div>

                                <FiClock />

                                <span>
                                    Fast Response
                                </span>

                            </div>

                        </div>

                    </div>

                </div>

            </section>



            {/* =====================================================
                CONTACT CONTENT
            ===================================================== */}

            <section className="contact-main">

                <div className="container">


                    <div className="contact-layout">


                        {/* =================================================
                            FORM
                        ================================================= */}

                        <div className="contact-form-card">


                            <div className="contact-section-heading">

                                <span>
                                    SEND AN ENQUIRY
                                </span>

                                <h2>
                                    Tell Us How We Can Help
                                </h2>

                                <p>
                                    Share a few details about your plans
                                    and our specialists will get back to you.
                                </p>

                            </div>


                            {success && (

                                <div className="contact-alert success">

                                    <FiCheckCircle />

                                    <span>
                                        {success}
                                    </span>

                                </div>

                            )}


                            {error && (

                                <div className="contact-alert error">

                                    <FiAlertCircle />

                                    <span>
                                        {error}
                                    </span>

                                </div>

                            )}


                            <form onSubmit={handleSubmit}>


                                <div className="contact-form-row">


                                    <div className="contact-field">

                                        <label>
                                            Full Name
                                        </label>

                                        <input
                                            type="text"
                                            name="fullName"
                                            placeholder="Your full name"
                                            value={form.fullName}
                                            onChange={handleChange}
                                        />

                                    </div>


                                    <div className="contact-field">

                                        <label>
                                            Email Address
                                        </label>

                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="you@example.com"
                                            value={form.email}
                                            onChange={handleChange}
                                        />

                                    </div>


                                </div>


                                <div className="contact-form-row">


                                    <div className="contact-field">

                                        <label>
                                            Phone Number
                                        </label>

                                        <input
                                            type="tel"
                                            name="phone"
                                            placeholder="+234..."
                                            value={form.phone}
                                            onChange={handleChange}
                                        />

                                    </div>


                                    <div className="contact-field">

                                        <label>
                                            What Do You Need Help With?
                                        </label>

                                        <select
                                            name="service"
                                            value={form.service}
                                            onChange={handleChange}
                                        >

                                            <option value="">
                                                Select a service
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


                                </div>


                                <div className="contact-field">

                                    <label>
                                        Your Message
                                    </label>

                                    <textarea
                                        name="message"
                                        rows="5"
                                        placeholder="Tell us about your plans..."
                                        value={form.message}
                                        onChange={handleChange}
                                    />

                                </div>


                                <button
                                    type="submit"
                                    className="contact-submit"
                                    disabled={loading}
                                >

                                    {loading
                                        ? "Sending..."
                                        : "Send Enquiry"
                                    }

                                    {!loading && <FiArrowRight />}

                                </button>


                                <div className="contact-form-note">

                                    <FiShield />

                                    Your information is handled
                                    confidentially.

                                </div>

                            </form>

                        </div>



                        {/* =================================================
                            CONTACT INFORMATION
                        ================================================= */}

                        <aside className="contact-info">


                            <span className="contact-info-eyebrow">

                                NEED PERSONAL GUIDANCE?

                            </span>


                            <h2>

                                Start With A

                                <strong>
                                    Conversation.
                                </strong>

                            </h2>


                            <p>

                                Not sure where to begin?
                                Talk directly with our team and
                                get pointed in the right direction.

                            </p>


                            {/* CONSULTATION */}

                            <Link
                                to="/consultation"
                                className="consultation-card"
                            >

                                <div className="consultation-icon">

                                    <FiGlobe />

                                </div>


                                <div>

                                    <span>
                                        RECOMMENDED
                                    </span>

                                    <strong>
                                        Book A Consultation
                                    </strong>

                                    <small>
                                        Get personalised guidance
                                        for your situation.
                                    </small>

                                </div>


                                <FiArrowRight />

                            </Link>



                            {/* WHATSAPP */}

                            <a
                                href={`https://wa.me/${whatsapp}`}
                                target="_blank"
                                rel="noreferrer"
                                className="info-link"
                            >

                                <div className="info-link-icon">
                                    <FiMessageCircle />
                                </div>

                                <div>

                                    <span>
                                        WHATSAPP
                                    </span>

                                    <strong>
                                        Start a conversation
                                    </strong>

                                </div>

                                <FiArrowRight />

                            </a>



                            {/* PHONE */}

                            <div className="info-group">

                                <span>
                                    CALL OUR TEAM
                                </span>


                                <a
                                    href="tel:+2347035209306"
                                >

                                    <FiPhone />

                                    {phoneOne}

                                </a>


                                <a
                                    href="tel:+2349026953513"
                                >

                                    <FiPhone />

                                    {phoneTwo}

                                </a>

                            </div>



                            {/* EMAIL */}

                            <div className="info-group">

                                <span>
                                    EMAIL
                                </span>


                                <a
                                    href={`mailto:${email}`}
                                >

                                    <FiMail />

                                    {email}

                                </a>

                            </div>



                            {/* LOCATION */}

                            <div className="info-bottom">


                                <div>

                                    <FiMapPin />

                                    <span>

                                        Lagos, Nigeria

                                    </span>

                                </div>


                                <div>

                                    <FiClock />

                                    <span>

                                        Monday – Saturday

                                        <small>
                                            9:00 AM – 6:00 PM
                                        </small>

                                    </span>

                                </div>


                            </div>

                        </aside>

                    </div>

                </div>

            </section>



            {/* =====================================================
                BOTTOM MESSAGE
            ===================================================== */}

            <section className="contact-bottom">

                <div className="container">

                    <span>
                        YOUR JOURNEY DESERVES A CLEAR PLAN
                    </span>

                    <h3>

                        Wherever You're Going,

                        <strong>
                            Start With Confidence.
                        </strong>

                    </h3>

                </div>

            </section>


        </main>

    );

};


export default Contact;