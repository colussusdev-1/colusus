import "./HowItWorks.css";

import {
    HiOutlineSearch,
    HiOutlineClipboardCheck,
    HiOutlineDocumentText,
    HiOutlineGlobeAlt,
    HiOutlineArrowRight,
} from "react-icons/hi";

import howItWorksBackground from "../../../../assets/images/how-it-works/how-it-works-background.png";

import card01Image from "../../../../assets/images/how-it-works/how-it-works-card-01.png";
import card02Image from "../../../../assets/images/how-it-works/how-it-works-card-02.png";
import card03Image from "../../../../assets/images/how-it-works/how-it-works-card-03.png";
import card04Image from "../../../../assets/images/how-it-works/how-it-works-card-04.png";


const steps = [

    {
        number: "01",

        icon: HiOutlineSearch,

        label: "DISCOVERY",

        title: "Discover Your Opportunity",

        text:
            "We analyse your profile, experience and goals to identify the strongest international work and migration pathways available to you.",

        image: card01Image,
    },

    {
        number: "02",

        icon: HiOutlineClipboardCheck,

        label: "STRATEGY",

        title: "Eligibility & Strategy",

        text:
            "Our specialists evaluate your eligibility and create a personalised migration strategy designed around your career ambitions.",

        image: card02Image,
    },

    {
        number: "03",

        icon: HiOutlineDocumentText,

        label: "PREPARATION",

        title: "Application Preparation",

        text:
            "We help you prepare documentation, applications and requirements with accuracy to maximise your chances of success.",

        image: card03Image,
    },

    {
        number: "04",

        icon: HiOutlineGlobeAlt,

        label: "TRANSITION",

        title: "Approval & Global Transition",

        text:
            "From approval preparation to relocation guidance, we support you as you begin your journey into a new country.",

        image: card04Image,
    },

];


const HowItWorks = () => {

    return (

        <section className="how-it-works">


            {/* =====================================================
                FULL SECTION BACKGROUND
            ===================================================== */}

            <div
                className="how-background"
                aria-hidden="true"
            >

                <img
                    src={howItWorksBackground}
                    alt=""
                    className="how-background-image"
                />

                <div className="how-background-overlay"></div>

                <div className="how-background-glow"></div>

            </div>



            {/* =====================================================
                MAIN CONTENT
            ===================================================== */}

            <div className="how-container">


                {/* =================================================
                    HEADER
                ================================================= */}

                <header className="how-header">


                    <span className="how-tag">

                        <span className="how-tag-dot"></span>

                        HOW IT WORKS

                    </span>



                    <h2>

                        Your Global Journey

                        <span>
                            Simplified Step By Step
                        </span>

                    </h2>



                    <p>

                        International relocation involves many decisions.
                        Our structured process gives you clarity, confidence
                        and professional guidance from start to finish.

                    </p>


                </header>



                {/* =================================================
                    JOURNEY TIMELINE
                ================================================= */}

                <div className="how-journey">


                    {/* CENTRAL TIMELINE */}

                    <div
                        className="how-journey-line"
                        aria-hidden="true"
                    >

                        <span></span>

                    </div>



                    {/* =================================================
                        STEPS
                    ================================================= */}

                    {steps.map((step, index) => {

                        const Icon = step.icon;

                        const isReverse = index % 2 === 1;


                        return (

                            <article
                                key={step.number}
                                className={`
                                    how-step
                                    ${isReverse
                                        ? "how-step-reverse"
                                        : ""
                                    }
                                `}
                            >


                                {/* =========================================
                                    TIMELINE MARKER
                                ========================================= */}

                                <div className="how-step-marker">


                                    <div className="how-step-marker-icon">

                                        <Icon />

                                    </div>


                                    <span>

                                        {step.number}

                                    </span>


                                </div>



                                {/* =========================================
                                    STEP CARD
                                ========================================= */}

                                <div className="how-step-card">


                                    {/* =====================================
                                        CARD IMAGE
                                    ===================================== */}

                                    <div className="how-step-image">


                                        <img
                                            src={step.image}
                                            alt={step.title}
                                            loading={
                                                index === 0
                                                    ? "eager"
                                                    : "lazy"
                                            }
                                        />


                                        <div
                                            className="how-step-image-overlay"
                                            aria-hidden="true"
                                        ></div>


                                        <div className="how-step-image-number">

                                            {step.number}

                                        </div>


                                    </div>



                                    {/* =====================================
                                        CARD CONTENT
                                    ===================================== */}

                                    <div className="how-step-content">


                                        <div className="how-step-label">

                                            <span></span>

                                            {step.label}

                                        </div>



                                        <h3>

                                            {step.title}

                                        </h3>



                                        <p>

                                            {step.text}

                                        </p>



                                        <div className="how-step-footer">


                                            <span>

                                                STEP {step.number}

                                            </span>


                                            <HiOutlineArrowRight />


                                        </div>


                                    </div>



                                    {/* =====================================
                                        CARD GLOW
                                    ===================================== */}

                                    <div
                                        className="how-step-glow"
                                        aria-hidden="true"
                                    ></div>


                                </div>


                            </article>

                        );

                    })}


                </div>



                {/* =================================================
                    JOURNEY FOOTER
                ================================================= */}

                <div className="how-bottom">


                    <div
                        className="how-bottom-line"
                        aria-hidden="true"
                    ></div>



                    <div className="how-bottom-content">


                        <div className="how-bottom-icon">

                            <HiOutlineGlobeAlt />

                        </div>



                        <div>

                            <strong>

                                Your journey starts with clarity.

                            </strong>


                            <span>

                                Let us help you take the next step
                                with confidence.

                            </span>

                        </div>


                    </div>



                    <div className="how-bottom-progress">


                        <span>
                            01
                        </span>


                        <div>

                            <i></i>

                        </div>


                        <span>
                            04
                        </span>


                    </div>


                </div>


            </div>



            {/* =====================================================
                SECTION BOTTOM ATMOSPHERE
            ===================================================== */}

            <div
                className="how-bottom-fade"
                aria-hidden="true"
            ></div>


        </section>

    );

};


export default HowItWorks;