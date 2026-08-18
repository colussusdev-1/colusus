import { useState } from "react";

import "./TravelFAQ.css";

import {
    HiOutlineQuestionMarkCircle,
    HiOutlineArrowRight,
    HiOutlineChatAlt2,
    HiOutlineShieldCheck,
    HiOutlineGlobeAlt,
    HiOutlineChevronDown,
} from "react-icons/hi";

import { Link } from "react-router-dom";


import migrationBackground from "../../../../assets/tourist/trust/migration-trust-background.png";
import migrationRoute from "../../../../assets/tourist/trust/migration-flight-route.png";
import migrationAirplane from "../../../../assets/tourist/trust/migration-airplane.png";


const faqItems = [

    {
        id: "01",

        question:
            "How do I know which travel option is right for me?",

        answer:
            "It depends on your travel purpose, destination, eligibility and personal circumstances. Our consultants can help you understand the available pathway and determine the option that best matches your goals.",
    },


    {
        id: "02",

        question:
            "What documents are required for a tourist visa?",

        answer:
            "Requirements vary depending on the destination and your individual circumstances. We help you understand the required documents, organise your application and identify areas that may need additional attention before submission.",
    },


    {
        id: "03",

        question:
            "How long does the visa process take?",

        answer:
            "Processing times vary by destination, visa type and application circumstances. During your consultation, we help you understand the expected process and the important stages involved.",
    },


    {
        id: "04",

        question:
            "Can you help me prepare my application?",

        answer:
            "Yes. We provide guidance throughout the preparation process, including document organisation, application preparation and general support before submission.",
    },


    {
        id: "05",

        question:
            "What happens if I am unsure about my eligibility?",

        answer:
            "You can speak with our team before starting your application. We can help you understand the relevant requirements and identify the areas you should consider before proceeding.",
    },

];


const TravelFAQ = () => {


    const [activeId, setActiveId] = useState(null);


    const toggleFAQ = (id) => {

        setActiveId((current) =>
            current === id ? null : id
        );

    };


    return (

        <section
            className="tourist-faq"

            style={{
                "--faq-background": `url(${migrationBackground})`,
                "--faq-route": `url(${migrationRoute})`,
                "--faq-airplane": `url(${migrationAirplane})`,
            }}
        >


            {/* =====================================================
                ATMOSPHERIC BACKGROUND
            ====================================================== */}

            <div
                className="tourist-faq-background"
                aria-hidden="true"
            />

            <div
                className="tourist-faq-route"
                aria-hidden="true"
            />

            <div
                className="tourist-faq-airplane"
                aria-hidden="true"
            />


            <div className="container tourist-faq-container">


                {/* =================================================
                    HEADER
                ================================================= */}

                <header className="tourist-faq-header">


                    <span className="tourist-faq-eyebrow">

                        <span className="tourist-faq-eyebrow-dot" />

                        NEED HELP?

                    </span>


                    <h2>

                        Frequently Asked

                        <strong>
                            Questions
                        </strong>

                    </h2>


                    <p>

                        Everything you need to know before
                        starting your international travel journey.

                    </p>

                </header>



                {/* =================================================
                    MAIN FAQ LAYOUT
                ================================================= */}

                <div className="tourist-faq-layout">


                    {/* =============================================
                        LEFT EDITORIAL PANEL
                    ============================================== */}

                    <div className="tourist-faq-intro">


                        <div className="tourist-faq-intro-number">
                            05
                        </div>


                        <span className="tourist-faq-intro-label">
                            TRAVEL SUPPORT
                        </span>


                        <h3>

                            Have Questions?

                            <span>
                                We've Got You Covered.
                            </span>

                        </h3>


                        <p>

                            Preparing for international travel can
                            feel complicated. Get clear answers and
                            practical guidance before you begin.

                        </p>



                        {/* =========================================
                            CONTACT SUPPORT LINK
                        ========================================== */}

                        <Link
                            to="/contact"
                            className="tourist-faq-support"
                            aria-label="Talk to our travel experts"
                        >


                            <div className="tourist-faq-support-icon">

                                <HiOutlineChatAlt2 />

                            </div>


                            <div>

                                <span>
                                    NEED PERSONAL GUIDANCE?
                                </span>

                                <strong>
                                    Talk to our travel experts.
                                </strong>

                            </div>


                            <HiOutlineArrowRight
                                className="tourist-faq-support-arrow"
                            />

                        </Link>



                        {/* =========================================
                            TRUST MINI ITEMS
                        ========================================== */}

                        <div className="tourist-faq-trust">


                            <div className="tourist-faq-trust-item">

                                <HiOutlineShieldCheck />

                                <div>

                                    <strong>
                                        Expert Guidance
                                    </strong>

                                    <span>
                                        Professional support
                                    </span>

                                </div>

                            </div>


                            <div className="tourist-faq-trust-item">

                                <HiOutlineGlobeAlt />

                                <div>

                                    <strong>
                                        Global Support
                                    </strong>

                                    <span>
                                        Multiple destinations
                                    </span>

                                </div>

                            </div>

                        </div>


                    </div>



                    {/* =============================================
                        FAQ ACCORDION
                    ============================================== */}

                    <div className="tourist-faq-list">


                        {faqItems.map((item) => {


                            const isActive =
                                activeId === item.id;


                            return (

                                <article
                                    key={item.id}
                                    className={
                                        `tourist-faq-item ${isActive
                                            ? "is-active"
                                            : ""
                                        }`
                                    }
                                >


                                    <button
                                        type="button"
                                        className="tourist-faq-question"
                                        onClick={() =>
                                            toggleFAQ(item.id)
                                        }
                                        aria-expanded={isActive}
                                    >


                                        <span className="tourist-faq-question-number">
                                            {item.id}
                                        </span>


                                        <span className="tourist-faq-question-icon">

                                            <HiOutlineQuestionMarkCircle />

                                        </span>


                                        <span className="tourist-faq-question-text">

                                            {item.question}

                                        </span>


                                        <span className="tourist-faq-chevron">

                                            <HiOutlineChevronDown />

                                        </span>


                                    </button>



                                    <div
                                        className="tourist-faq-answer-wrapper"
                                    >

                                        <div className="tourist-faq-answer">

                                            <span className="tourist-faq-answer-line" />

                                            <p>
                                                {item.answer}
                                            </p>

                                        </div>

                                    </div>


                                </article>

                            );

                        })}


                    </div>

                </div>



                {/* =================================================
                    CONTACT FOOTER LINK
                ================================================= */}

                <Link
                    to="/contact"
                    className="tourist-faq-footer"
                    aria-label="Start a conversation with our travel experts"
                >

                    <span className="tourist-faq-footer-dot" />

                    <span>
                        Still unsure?
                    </span>

                    <strong>
                        Start with a conversation.
                    </strong>

                    <HiOutlineArrowRight />

                </Link>


            </div>

        </section>

    );

};


export default TravelFAQ;