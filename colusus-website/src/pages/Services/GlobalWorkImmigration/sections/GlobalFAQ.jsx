import "./GlobalFAQ.css";

import {
    HiOutlineBriefcase,
    HiOutlineClock,
    HiOutlineAcademicCap,
    HiOutlineUser,
    HiOutlineShieldCheck,
    HiOutlineCheckCircle,
    HiOutlineArrowRight,
    HiOutlineSupport,
} from "react-icons/hi";

import { Link } from "react-router-dom";


import faqBackground from "../../../../assets/images/global-faq/faq-precise-background-artwork.png";

import faqPlane from "../../../../assets/images/global-faq/faq-plane-exact-cut.png";

import faqFooterImage from "../../../../assets/images/global-faq/faq-footer-image-extracted.png";


const faqs = [

    {
        q: "Do I need a job offer to apply?",

        a:
            "Not always. Some programs like Express Entry and study pathways do not require a job offer.",

        icon: HiOutlineBriefcase,
    },


    {
        q: "How long does the process take?",

        a:
            "Processing times vary by program, typically between 3 months to 18 months depending on the pathway.",

        icon: HiOutlineClock,
    },


    {
        q: "Can I apply without IELTS?",

        a:
            "Some programs require IELTS or language proof, but alternatives may be available depending on your profile.",

        icon: HiOutlineAcademicCap,
    },


    {
        q: "What if I don’t qualify?",

        a:
            "We assess your profile and recommend alternative pathways you may qualify for.",

        icon: HiOutlineUser,
    },


    {
        q: "Do you guarantee visa approval?",

        a:
            "No one can guarantee approval. However, we maximize your chances through proper documentation and strategy.",

        icon: HiOutlineShieldCheck,
    },

];


const GlobalFAQ = () => {

    return (

        <section
            className="gf"
            aria-labelledby="global-faq-title"
        >


            {/* =====================================================
                BACKGROUND ATMOSPHERE
            ===================================================== */}

            <div
                className="gf__background"
                aria-hidden="true"
            >

                <div className="gf__background-glow"></div>

                <div className="gf__background-grid"></div>


                {/* Main immigration artwork */}

                <img
                    src={faqBackground}
                    alt=""
                    className="gf__background-art"
                />


                {/* Plane */}

                <img
                    src={faqPlane}
                    alt=""
                    className="gf__plane"
                />

            </div>



            <div className="container gf__container">


                {/* =================================================
                    TOP / HERO
                ================================================= */}

                <div className="gf__hero">


                    {/* =============================================
                        LEFT CONTENT
                    ============================================= */}

                    <div className="gf__hero-content">


                        <span className="gf__tag">

                            <span className="gf__tag-line"></span>

                            FAQ

                        </span>



                        <h2 id="global-faq-title">

                            Frequently Asked

                            <span>
                                Questions
                            </span>

                        </h2>



                        <p className="gf__intro">

                            Find answers to the most common questions
                            about our immigration services, process,
                            and how we can help you achieve your
                            global goals.

                        </p>



                        {/* =========================================
                            TRUST STRIP
                        ========================================= */}

                        <div className="gf__trust">


                            <div className="gf__trust-item">


                                <div className="gf__trust-icon">

                                    <HiOutlineShieldCheck />

                                </div>


                                <div>

                                    <strong>
                                        Trusted Guidance
                                    </strong>

                                    <span>
                                        Expert advice you can rely on
                                    </span>

                                </div>


                            </div>



                            <div className="gf__trust-divider"></div>



                            <div className="gf__trust-item">


                                <div className="gf__trust-icon">

                                    <HiOutlineClock />

                                </div>


                                <div>

                                    <strong>
                                        Clear Process
                                    </strong>

                                    <span>
                                        Simple, transparent steps
                                    </span>

                                </div>


                            </div>



                            <div className="gf__trust-divider"></div>



                            <div className="gf__trust-item">


                                <div className="gf__trust-icon">

                                    <HiOutlineShieldCheck />

                                </div>


                                <div>

                                    <strong>
                                        Your Privacy
                                    </strong>

                                    <span>
                                        Secure & confidential
                                    </span>

                                </div>


                            </div>


                        </div>


                    </div>



                    {/* =============================================
                        VISUAL SPACE
                    ============================================= */}

                    <div
                        className="gf__hero-visual"
                        aria-hidden="true"
                    ></div>


                </div>



                {/* =================================================
                    FAQ LIST
                ================================================= */}

                <div className="gf__list">


                    {faqs.map((item, index) => {

                        const Icon = item.icon;


                        return (

                            <details
                                className="gf__item"
                                key={index}
                            >


                                {/* =================================
                                    QUESTION
                                ================================= */}

                                <summary>


                                    <div className="gf__question-icon">

                                        <Icon />

                                    </div>


                                    <div className="gf__question-content">

                                        <h3>
                                            {item.q}
                                        </h3>

                                        <p>
                                            {item.a}
                                        </p>

                                    </div>


                                    <span className="gf__arrow">

                                        <HiOutlineArrowRight />

                                    </span>


                                </summary>



                                {/* =================================
                                    ANSWER
                                ================================= */}

                                <div className="gf__answer">

                                    <div className="gf__answer-line"></div>

                                    <p>
                                        {item.a}
                                    </p>

                                </div>


                            </details>

                        );

                    })}


                </div>



                {/* =================================================
                    BOTTOM CTA
                ================================================= */}

                <div className="gf__cta">


                    {/* =============================================
                        FOOTER IMAGE
                    ============================================= */}

                    <div className="gf__cta-image">

                        <img
                            src={faqFooterImage}
                            alt=""
                        />

                    </div>



                    {/* =============================================
                        CTA CONTENT
                    ============================================= */}

                    <div className="gf__cta-content">


                        <span className="gf__cta-label">

                            STILL HAVE QUESTIONS?

                        </span>


                        <h3>

                            Let’s help you take

                            <span>
                                the next step.
                            </span>

                        </h3>


                        <p>

                            Our team is here to help you understand
                            your options and choose the right pathway.

                        </p>


                    </div>



                    {/* =============================================
                        CTA BUTTON
                    ============================================= */}

                    <Link
                        to="/contact"
                        className="gf__cta-button"
                    >

                        <HiOutlineSupport />

                        Talk to an Expert

                        <HiOutlineArrowRight />

                    </Link>



                    {/* Decorative route */}

                    <div
                        className="gf__cta-route"
                        aria-hidden="true"
                    >

                        <span></span>

                        <span></span>

                        <span></span>

                    </div>


                </div>



                {/* =================================================
                    FOOTER TRUST
                ================================================= */}

                <div className="gf__bottom">


                    <div className="gf__bottom-item">

                        <HiOutlineCheckCircle />

                        <span>
                            Professional guidance
                        </span>

                    </div>


                    <div className="gf__bottom-item">

                        <HiOutlineCheckCircle />

                        <span>
                            Transparent process
                        </span>

                    </div>


                    <div className="gf__bottom-item">

                        <HiOutlineCheckCircle />

                        <span>
                            No guaranteed outcomes
                        </span>

                    </div>


                </div>


            </div>


            {/* =====================================================
                BOTTOM ATMOSPHERE
            ===================================================== */}

            <div
                className="gf__bottom-fade"
                aria-hidden="true"
            ></div>


        </section>

    );

};


export default GlobalFAQ;