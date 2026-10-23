import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

import {
    HiOutlineArrowRight,
    HiOutlineCalendar,
    HiOutlineCheckCircle,
    HiOutlineClock,
    HiOutlineGlobeAlt,
    HiOutlineLocationMarker,
    HiOutlineLockClosed,
    HiOutlineMail,
    HiOutlinePaperAirplane,
    HiOutlinePhone,
    HiOutlineUser,
} from "react-icons/hi";

import {
    FaWhatsapp,
} from "react-icons/fa";

import contactHero from "../../assets/images/contact/contact-hero.png";

import "./Contact.css";


const Contact = () => {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        service: "",
        subject: "",
        message: "",
    });

    const [status, setStatus] = useState({
        type: "",
        message: "",
    });

    const [loading, setLoading] = useState(false);


    /* ==========================================================
       FORM CHANGE
    ========================================================== */

    const handleChange = (event) => {

        const {
            name,
            value,
        } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

    };


    /* ==========================================================
       FORM SUBMIT
    ========================================================== */

    const handleSubmit = async (event) => {

        event.preventDefault();

        setStatus({
            type: "",
            message: "",
        });

        setLoading(true);

        try {

            await api.post("/form-submissions", {
                formKey: "contact",
                formName: "Contact Form",
                submissionData: {
                    fullName: formData.name.trim(),
                    email: formData.email.trim(),
                    phone: formData.phone.trim(),
                    service: formData.service,
                    subject: formData.subject.trim(),
                    message: formData.message.trim(),
                },
                source: "website-contact",
            });

            setStatus({
                type: "success",
                message:
                    "Your enquiry has been received. Our team will get back to you shortly.",
            });

            setFormData({
                name: "",
                email: "",
                phone: "",
                service: "",
                subject: "",
                message: "",
            });

        } catch (error) {

            console.error(
                "CONTACT FORM ERROR:",
                error
            );

            setStatus({
                type: "error",
                message:
                    error?.response?.data?.message ||
                    "We couldn't send your enquiry right now. Please try again or contact us directly.",
            });

        } finally {

            setLoading(false);

        }

    };


    /* ==========================================================
       WHATSAPP
    ========================================================== */

    const whatsappNumber =
        "2347035209306";

    const whatsappMessage =
        encodeURIComponent(
            "Hello Colossus Migration, I would like to speak with an agent about my migration options."
        );

    const whatsappUrl =
        `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;


    return (

        <main className="contact-page">
            <div className="contact-nav-spacer" aria-hidden="true" />


            {/* ==================================================
                HERO
            ================================================== */}

            <section className="contact-hero">

                <div className="contact-shell">

                    <div className="contact-hero__content">




                        <h1>

                            Let's talk about{" "}

                            <span>
                                your journey.
                            </span>

                        </h1>


                        <p>

                            Have questions about your migration options, need personalised
                            guidance, or want to book a consultation? Our team is here to help
                            you every step of the way.

                        </p>


                        <div className="contact-hero__actions">

                            <Link
                                to="/consultation"
                                className="contact-button contact-button--primary"
                            >

                                <HiOutlineCalendar />

                                <span>
                                    Book a consultation
                                </span>

                                <HiOutlineArrowRight />

                            </Link>


                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="contact-button contact-button--secondary"
                            >

                                <FaWhatsapp />

                                <span>
                                    WhatsApp us
                                </span>

                            </a>

                        </div>

                    </div>


                    <div className="contact-hero__visual">

                        <div className="contact-hero__glow" />

                        <img
                            src={contactHero}
                            alt="Airplane flying over Sydney Harbour, representing international travel"
                        />

                    </div>

                </div>

            </section>
            {/* ==================================================
                HERO TRUST FEATURES
            ================================================== */}

            <section className="contact-trust">
                <div className="contact-shell contact-trust__grid">
                    <div className="contact-trust__item">
                        <span className="contact-trust__icon"><HiOutlinePaperAirplane /></span>
                        <div><strong>Expert Guidance</strong><small>Get advice from migration professionals.</small></div>
                    </div>
                    <div className="contact-trust__item">
                        <span className="contact-trust__icon"><HiOutlineCheckCircle /></span>
                        <div><strong>Trusted Support</strong><small>Accurate, reliable and up-to-date information.</small></div>
                    </div>
                    <div className="contact-trust__item">
                        <span className="contact-trust__icon"><HiOutlineGlobeAlt /></span>
                        <div><strong>Global Opportunities</strong><small>Pathways to destinations worldwide.</small></div>
                    </div>
                </div>
            </section>

            {/* ==================================================
                CONTACT WORKSPACE
            ================================================== */}


            <section className="contact-workspace">

                <div className="contact-shell">

                    <div className="contact-workspace__card">


                        {/* ==================================================
                            FORM
                        ================================================== */}

                        <div className="contact-form-panel">

                            <div className="contact-section-heading">

                                <span className="contact-section-heading__icon">
                                    <HiOutlinePaperAirplane />
                                </span>

                                <div>

                                    <span>
                                        SEND AN ENQUIRY
                                    </span>

                                    <h2>
                                        How can we help you?
                                    </h2>

                                    <p>
                                        Fill out the form below and our team will get back to you as soon as possible.
                                    </p>

                                </div>

                            </div>


                            <form
                                className="contact-form"
                                onSubmit={handleSubmit}
                            >


                                <div className="contact-form__row">


                                    <label className="contact-field">

                                        <span>
                                            Full Name
                                        </span>

                                        <div className="contact-field__input">

                                            <HiOutlineUser />

                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="Your full name"
                                                required
                                            />

                                        </div>

                                    </label>


                                    <label className="contact-field">

                                        <span>
                                            Email Address
                                        </span>

                                        <div className="contact-field__input">

                                            <HiOutlineMail />

                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="you@example.com"
                                                required
                                            />

                                        </div>

                                    </label>

                                </div>


                                <div className="contact-form__row">


                                    <label className="contact-field">

                                        <span>
                                            Phone Number
                                        </span>

                                        <div className="contact-field__input">

                                            <HiOutlinePhone />

                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                placeholder="+234..."
                                                required
                                            />

                                        </div>

                                    </label>


                                    <label className="contact-field">

                                        <span>
                                            Service Interested In
                                        </span>

                                        <div className="contact-field__input">

                                            <HiOutlineGlobeAlt />

                                            <select
                                                name="service"
                                                value={formData.service}
                                                onChange={handleChange}
                                                required
                                            >

                                                <option value="">
                                                    Select a service
                                                </option>

                                                <option value="Work Migration">
                                                    Work Migration
                                                </option>

                                                <option value="Study Abroad">
                                                    Study Abroad
                                                </option>

                                                <option value="Tourist Visa">
                                                    Tourist Visa
                                                </option>

                                                <option value="Residency">
                                                    Residency
                                                </option>

                                                <option value="General Consultation">
                                                    General Consultation
                                                </option>

                                            </select>

                                        </div>

                                    </label>

                                </div>


                                <label className="contact-field contact-field--full">
                                    <span>Subject <b aria-hidden="true">*</b></span>
                                    <div className="contact-field__input">
                                        <HiOutlineMail />
                                        <input
                                            type="text"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            placeholder="Briefly describe your enquiry"
                                            maxLength={120}
                                            required
                                        />
                                    </div>
                                </label>

                                <label className="contact-field contact-field--full">
                                    <span>Your Message <b aria-hidden="true">*</b></span>

                                    <div className="contact-field__textarea">

                                        <HiOutlinePaperAirplane />

                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            placeholder="Tell us about your goals, destination or what you need help with..."
                                            rows="5"
                                            maxLength={500}
                                            required
                                        />
                                    </div>
                                    <small className="contact-message-count">{formData.message.length}/500</small>
                                </label>


                                {status.message && (

                                    <div
                                        className={`contact-status contact-status--${status.type}`}
                                    >

                                        {status.message}

                                    </div>

                                )}


                                <div className="contact-form__footer">

                                    <button
                                        type="submit"
                                        className="contact-submit"
                                        disabled={loading}
                                    >

                                        <span>
                                            {loading
                                                ? "Sending..."
                                                : "Send enquiry"
                                            }
                                        </span>

                                        {!loading && (
                                            <HiOutlineArrowRight />
                                        )}

                                    </button>


                                    <div className="contact-secure">

                                        <HiOutlineLockClosed />

                                        <span>
                                            Your information is confidential
                                            and secure.
                                        </span>

                                    </div>

                                </div>

                            </form>

                        </div>


                        {/* ==================================================
                            CONTACT DETAILS
                        ================================================== */}

                        <aside className="contact-details">


                            <div className="contact-details__heading">

                                <span className="contact-section-heading__icon">
                                    <HiOutlinePhone />
                                </span>

                                <div>

                                    <span>
                                        SPEAK WITH OUR TEAM
                                    </span>

                                    <h2>
                                        Need guidance?
                                    </h2>

                                    <p>
                                        Not sure which pathway is right
                                        for you? We're here to help.
                                    </p>

                                </div>

                            </div>


                            <Link
                                to="/consultation"
                                className="contact-consultation"
                            >

                                <span>
                                    Book a consultation
                                </span>

                                <HiOutlineArrowRight />

                            </Link>


                            <div className="contact-methods">


                                {/* WHATSAPP */}

                                <a
                                    href={whatsappUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="contact-method"
                                >

                                    <span className="contact-method__icon contact-method__icon--whatsapp">
                                        <FaWhatsapp />
                                    </span>

                                    <div>

                                        <small>
                                            WHATSAPP
                                        </small>

                                        <strong>
                                            +234 703 520 9306
                                        </strong>

                                    </div>

                                </a>


                                {/* NIGERIA TEAM CONTACTS */}

                                <div className="contact-method contact-method--team">

                                    <span className="contact-method__icon">
                                        <HiOutlinePhone />
                                    </span>

                                    <div className="contact-method__details">

                                        <small>CONTACT OUR TEAM</small>

                                        <a href="tel:+2347035209306">
                                            <strong>Rose</strong>
                                            <span>+234 703 520 9306</span>
                                        </a>

                                        <a href="tel:+2349026953513">
                                            <strong>Tony <em>(Migration Director)</em></strong>
                                            <span>+234 902 695 3513</span>
                                        </a>

                                        <a href="tel:+2349169830624">
                                            <strong>Blessing</strong>
                                            <span>+234 916 983 0624</span>
                                        </a>
                                    </div>
                                </div>

                                {/* UK OFFICE */}

                                <a
                                    href="tel:+447455674027"
                                    className="contact-method"
                                >
                                    <span className="contact-method__icon">
                                        <HiOutlinePhone />
                                    </span>

                                    <div>
                                        <small>UK OFFICE</small>
                                        <strong>+44 7455 674027</strong>
                                    </div>
                                </a>


                                {/* EMAIL */}

                                <a
                                    href="mailto:admin@colossusmigration.com"
                                    className="contact-method"
                                >

                                    <span className="contact-method__icon">
                                        <HiOutlineMail />
                                    </span>

                                    <div>

                                        <small>
                                            EMAIL
                                        </small>

                                        <strong>
                                            admin@colossusmigration.com
                                        </strong>

                                    </div>

                                </a>


                                {/* LOCATION */}

                                <div className="contact-method">

                                    <span className="contact-method__icon">
                                        <HiOutlineLocationMarker />
                                    </span>

                                    <div>

                                        <small>
                                            LOCATION
                                        </small>

                                        <strong>
                                            Lagos, Nigeria
                                        </strong>

                                    </div>

                                </div>


                                {/* HOURS */}

                                <div className="contact-method">

                                    <span className="contact-method__icon">
                                        <HiOutlineClock />
                                    </span>

                                    <div>

                                        <small>
                                            HOURS
                                        </small>

                                        <strong>
                                            Mon – Sat · 9:00 AM – 6:00 PM
                                        </strong>

                                    </div>

                                </div>


                            </div>

                        </aside>

                    </div>

                </div>

            </section>


            {/* ==================================================
                FINAL CTA
            ================================================== */}

            <section className="contact-trust-cta">

                <div className="contact-shell">

                    <div className="contact-trust-cta__inner">


                        <div className="contact-trust-cta__badge">

                            <HiOutlineCheckCircle />

                        </div>


                        <div className="contact-trust-cta__content">

                            <span>
                                YOUR JOURNEY DESERVES A CLEAR PLAN
                            </span>

                            <h2>
                                Start with confidence.
                            </h2>

                            <p>
                                From choosing the right pathway to final
                                approval, we walk with you every step of
                                the way.
                            </p>

                        </div>


                        <Link
                            to="/consultation"
                            className="contact-trust-cta__button"
                        >

                            <span>
                                Start your journey
                            </span>

                            <HiOutlineArrowRight />

                        </Link>


                    </div>

                </div>

            </section>


        </main>

    );

};


export default Contact;