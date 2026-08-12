import "./ContactCTA.css";

import {
    HiOutlinePhone,
    HiOutlineMail,
    HiOutlineClock,
    HiOutlineShieldCheck,
    HiOutlineGlobeAlt,
    HiOutlineStar,
    HiArrowRight,
} from "react-icons/hi";

import { useNavigate } from "react-router-dom";

import ScrollReveal from "../../../../components/ScrollReveal/ScrollReveal";

import contactCtaBackground
    from "../../../../assets/contact/contact-cta-background.png";


const ContactCTA = () => {

    const navigate = useNavigate();


    /* =========================================================
       CONTACT INFORMATION
    ========================================================= */

    const contactItems = [

        {
            icon: <HiOutlinePhone />,
            title: "Call Us",
            text: "+234-703-520-9306",
        },

        {
            icon: <HiOutlineMail />,
            title: "Email",
            text: "admin@colossusmigration.com",
        },

        {
            icon: <HiOutlineClock />,
            title: "Availability",
            text: "Mon - Sat | 9AM - 6PM",
        },

    ];


    /* =========================================================
       TRUST STATISTICS
    ========================================================= */

    const stats = [

        {
            icon: <HiOutlineShieldCheck />,
            value: "4,500+",
            label: "Trusted by",
            sublabel: "Happy Clients",
        },

        {
            icon: <HiOutlineGlobeAlt />,
            value: "18+",
            label: "Countries",
            sublabel: "We Serve",
        },

        {
            icon: <HiOutlineShieldCheck />,
            value: "98%",
            label: "Success Rate",
            sublabel: "On Applications",
        },

        {
            icon: <HiOutlineStar />,
            value: "4.9/5",
            label: "Rating",
            sublabel: "From Clients",
        },

    ];


    /* =========================================================
       CONSULTATION
    ========================================================= */

    const handleConsultation = () => {

        navigate("/consultation");

    };


    return (

        <section
            id="contact"
            className="contact-cta"
        >


            {/* =================================================
                THE IMAGE IS THE ENTIRE BACKGROUND

                No generated background color.
                No gradient background.
                No atmospheric overlay.
            ================================================= */}

            <div
                className="contact-cta-background"
                aria-hidden="true"
            >

                <img
                    src={contactCtaBackground}
                    alt=""
                />

            </div>


            {/* =================================================
                CONTENT LAYER
            ================================================= */}

            <div className="contact-cta-content-layer">


                {/* =================================================
                    MAIN CONTENT
                ================================================= */}

                <div className="container contact-cta-container">


                    <div className="contact-cta-main">


                        {/* =================================================
                            LEFT CONTENT
                        ================================================= */}

                        <ScrollReveal
                            direction="left"
                            duration={0.9}
                            distance={45}
                        >

                            <div className="contact-cta-copy">


                                {/* BADGE */}

                                <div className="contact-cta-tag">

                                    <span className="contact-cta-tag-icon">
                                        ✈
                                    </span>

                                    <span>
                                        START YOUR JOURNEY
                                    </span>

                                </div>


                                {/* TITLE */}

                                <h2>

                                    Ready To Explore

                                    <span>
                                        Your Options?
                                    </span>

                                </h2>


                                {/* DESCRIPTION */}

                                <p>

                                    Speak with our migration advisors
                                    and discover the best pathway for
                                    work, study, travel or relocation.

                                </p>


                                {/* CTA */}

                                <button
                                    type="button"
                                    className="contact-cta-button"
                                    onClick={handleConsultation}
                                >

                                    <span>
                                        Book Consultation
                                    </span>

                                    <HiArrowRight />

                                </button>


                            </div>

                        </ScrollReveal>


                        {/* =================================================
                            RIGHT CONTACT CARDS
                        ================================================= */}

                        <ScrollReveal
                            direction="right"
                            duration={0.9}
                            distance={45}
                            delay={0.12}
                        >

                            <div className="contact-cta-info">


                                {contactItems.map(
                                    (item, index) => (

                                        <div
                                            className="contact-mini-card"
                                            key={index}
                                        >


                                            <div className="contact-mini-icon">

                                                {item.icon}

                                            </div>


                                            <div className="contact-mini-content">

                                                <span>
                                                    {item.title}
                                                </span>

                                                <strong>
                                                    {item.text}
                                                </strong>

                                            </div>


                                            <div className="contact-mini-indicator" />


                                        </div>

                                    )
                                )}


                            </div>

                        </ScrollReveal>


                    </div>


                    {/* =================================================
                        BOTTOM STATISTICS
                    ================================================= */}

                    <ScrollReveal
                        direction="up"
                        duration={0.8}
                        distance={25}
                        delay={0.2}
                    >

                        <div className="contact-cta-stats">


                            {/* LEFT DECORATION */}

                            <div className="contact-stat-decoration">

                                <span />
                                <span />
                                <span />

                            </div>


                            {/* STATS */}

                            {stats.map(
                                (stat, index) => (

                                    <div
                                        className="contact-stat"
                                        key={index}
                                    >


                                        <div className="contact-stat-icon">

                                            {stat.icon}

                                        </div>


                                        <div className="contact-stat-content">

                                            <strong>
                                                {stat.value}
                                            </strong>

                                            <span>
                                                {stat.label}
                                            </span>

                                            <small>
                                                {stat.sublabel}
                                            </small>

                                        </div>


                                    </div>

                                )
                            )}


                            {/* RIGHT DECORATION */}

                            <div className="contact-stat-decoration">

                                <span />
                                <span />
                                <span />

                            </div>


                        </div>

                    </ScrollReveal>


                </div>


            </div>


        </section>

    );

};


export default ContactCTA;