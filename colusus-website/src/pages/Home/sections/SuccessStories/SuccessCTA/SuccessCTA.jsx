import {
    HiOutlinePaperAirplane,
    HiArrowRight
} from "react-icons/hi";

import {
    Link
} from "react-router-dom";

import ScrollReveal from "../../../../../components/ScrollReveal/ScrollReveal";

import "./SuccessCTA.css";

import successCtaPlane
    from "../../../../../assets/success-stories/success-cta-plane.png";


const SuccessCTA = () => {

    return (

        <section className="success-cta">


            {/* =================================================
                ATMOSPHERE
            ================================================= */}

            <div
                className="success-cta-atmosphere"
                aria-hidden="true"
            >

                <span className="success-cta-glow success-cta-glow-one" />

                <span className="success-cta-glow success-cta-glow-two" />

                <span className="success-cta-orbit success-cta-orbit-one" />

                <span className="success-cta-orbit success-cta-orbit-two" />

            </div>


            {/* =================================================
                CONTENT
            ================================================= */}

            <div className="success-cta-container">


                {/* =================================================
                    ICON
                ================================================= */}

                <ScrollReveal
                    direction="left"
                    duration={1}
                    distance={35}
                >

                    <div className="success-cta-icon">

                        <HiOutlinePaperAirplane />

                    </div>

                </ScrollReveal>


                {/* =================================================
                    TEXT
                ================================================= */}

                <ScrollReveal
                    direction="up"
                    duration={1}
                    distance={35}
                    delay={0.08}
                >

                    <div className="success-cta-content">

                        <span className="success-cta-eyebrow">

                            YOUR JOURNEY STARTS HERE

                        </span>


                        <h2>

                            Ready to Start Your

                            <span>
                                Success Story?
                            </span>

                        </h2>


                        <p>

                            Take the first step towards your
                            dream destination. We're here to
                            guide you every step of the way.

                        </p>

                    </div>

                </ScrollReveal>


                {/* =================================================
                    CTA
                ================================================= */}

                <ScrollReveal
                    direction="right"
                    duration={1}
                    distance={35}
                    delay={0.16}
                >

                    <Link
                        to="/consultation"
                        className="success-cta-button"
                    >

                        <span>
                            Start Your Application
                        </span>

                        <HiArrowRight />

                    </Link>

                </ScrollReveal>


                {/* =================================================
                    AIRCRAFT
                ================================================= */}

                <div
                    className="success-cta-plane"
                    aria-hidden="true"
                >

                    <img
                        src={successCtaPlane}
                        alt=""
                    />

                </div>


            </div>

        </section>

    );

};


export default SuccessCTA;