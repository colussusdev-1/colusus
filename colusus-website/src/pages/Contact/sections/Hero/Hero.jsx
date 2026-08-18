import "./Hero.css";

import {
    FiArrowRight,
    FiGlobe,
    FiShield,
    FiClock,
    FiPhone,
    FiMail,
    FiMessageCircle,
    FiMapPin,
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";


const contactMethods = [
    {
        icon: FiPhone,
        title: "Call Our Team",
        value: (
            <>
                +234 703 520 9306
                <br />
                +234 902 695 3513
            </>
        ),
        description: "Speak directly with our experts",
        href: "tel:+2347035209306",
    },

    {
        icon: FiMail,
        title: "Email Support",
        value: "admin@colossusmigration.com",
        description: "Send your enquiry anytime",
        href: "mailto:admin@colossusmigration.com",
    },

    {
        icon: FiMessageCircle,
        title: "WhatsApp",
        value: "Quick Response",
        description: "Chat with our team instantly",
        href: "https://wa.me/2347035209306",
    },

    {
        icon: FiMapPin,
        title: "Visit Office",
        value: "Lagos, Nigeria",
        description: "Meet our team for consultation",
        href: "#contact-form",
    },
];


const Hero = () => {

    const navigate = useNavigate();


    const handleConsultation = () => {

        const formSection = document.getElementById("contact-form");

        if (formSection) {

            formSection.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });

            return;
        }

        navigate("/consultation");

    };


    return (

        <section className="contact-hero">

            {/* =====================================================
                ATMOSPHERIC BACKGROUND
            ====================================================== */}

            <div
                className="contact-hero-map"
                aria-hidden="true"
            />

            <div
                className="contact-hero-glow contact-hero-glow--one"
                aria-hidden="true"
            />

            <div
                className="contact-hero-glow contact-hero-glow--two"
                aria-hidden="true"
            />


            {/* =====================================================
                AIRPLANE DETAIL
            ====================================================== */}

            <div
                className="contact-hero-plane"
                aria-hidden="true"
            >
                ✈
            </div>


            {/* =====================================================
                MAIN LAYOUT
            ====================================================== */}

            <div className="contact-hero-container">


                {/* =================================================
                    LEFT SIDE
                ================================================= */}

                <div className="contact-hero-content">


                    <span className="contact-badge">

                        <FiGlobe />

                        CONTACT COLOSSUS MIGRATION

                    </span>


                    <h1>

                        Your Journey Abroad

                        <span>

                            Starts With A Conversation

                        </span>

                    </h1>


                    <p className="contact-hero-description">

                        Whether you are planning to study overseas,
                        secure international employment, relocate your
                        family or explore global opportunities, our
                        experts are ready to guide your next move.

                    </p>


                    {/* =================================================
                        PRIMARY ACTION
                    ================================================= */}

                    <button
                        type="button"
                        className="contact-primary"
                        onClick={handleConsultation}
                    >

                        <span>
                            Book Consultation
                        </span>

                        <FiArrowRight />

                    </button>


                    {/* =================================================
                        TRUST POINTS
                    ================================================= */}

                    <div className="contact-trust">


                        <div className="contact-trust-item">

                            <span className="contact-trust-icon">
                                <FiGlobe />
                            </span>

                            <div>
                                <strong>
                                    Global Opportunities
                                </strong>

                                <small>
                                    Explore worldwide possibilities
                                </small>
                            </div>

                        </div>


                        <div className="contact-trust-item">

                            <span className="contact-trust-icon">
                                <FiShield />
                            </span>

                            <div>
                                <strong>
                                    Trusted Guidance
                                </strong>

                                <small>
                                    Expert advice you can trust
                                </small>
                            </div>

                        </div>


                        <div className="contact-trust-item">

                            <span className="contact-trust-icon">
                                <FiClock />
                            </span>

                            <div>
                                <strong>
                                    Fast Response
                                </strong>

                                <small>
                                    Quick support, always
                                </small>
                            </div>

                        </div>


                    </div>


                    {/* =================================================
                        CONTACT METHODS
                    ================================================= */}

                    <div className="contact-methods-header">

                        <span />

                        <p>
                            CHOOSE HOW YOU WANT TO CONNECT
                        </p>

                        <span />

                    </div>


                    <div className="contact-methods">


                        {contactMethods.map((item) => {

                            const Icon = item.icon;


                            return (

                                <a
                                    key={item.title}
                                    href={item.href}
                                    className="contact-method"
                                >

                                    <div className="contact-method-icon">

                                        <Icon />

                                    </div>


                                    <div className="contact-method-content">

                                        <span className="contact-method-title">
                                            {item.title}
                                        </span>

                                        <strong>
                                            {item.value}
                                        </strong>

                                        <small>
                                            {item.description}
                                        </small>

                                    </div>

                                </a>

                            );

                        })}


                    </div>


                </div>


            </div>

        </section>

    );

};


export default Hero;