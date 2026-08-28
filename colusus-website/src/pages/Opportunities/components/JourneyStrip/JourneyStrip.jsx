import {
    HiOutlineClipboardCheck,
    HiOutlineArrowRight,
    HiOutlineSearch,
    HiOutlineSparkles,
} from "react-icons/hi";

import "./JourneyStrip.css";


const JourneyStrip = ({ country }) => {

    return (

        <section
            className="journey-strip"
            id="assessment"
        >

            <div className="journey-strip__container">


                {/* ==================================================
                    LEFT — INTRO
                ================================================== */}

                <div className="journey-strip__intro">

                    <span className="journey-strip__eyebrow">

                        <HiOutlineSparkles />

                        Your Colusus journey

                    </span>


                    <h2>

                        Not sure where
                        <span> to begin?</span>

                    </h2>


                    <p>

                        You don't have to figure everything
                        out yourself. Explore your options or
                        let Colusus help point you in the right
                        direction.

                    </p>

                </div>



                {/* ==================================================
                    JOURNEY
                ================================================== */}

                <div className="journey-strip__steps">


                    <div className="journey-strip__step">

                        <div className="journey-strip__number">
                            01
                        </div>

                        <div className="journey-strip__step-content">

                            <div className="journey-strip__icon">
                                <HiOutlineClipboardCheck />
                            </div>

                            <div>

                                <strong>
                                    Know your profile
                                </strong>

                                <span>
                                    Take the free assessment
                                </span>

                            </div>

                        </div>

                    </div>



                    <div className="journey-strip__connector">
                        <HiOutlineArrowRight />
                    </div>



                    <div className="journey-strip__step">

                        <div className="journey-strip__number">
                            02
                        </div>

                        <div className="journey-strip__step-content">

                            <div className="journey-strip__icon">
                                <HiOutlineSearch />
                            </div>

                            <div>

                                <strong>
                                    Explore pathways
                                </strong>

                                <span>
                                    Compare available routes
                                </span>

                            </div>

                        </div>

                    </div>



                    <div className="journey-strip__connector">
                        <HiOutlineArrowRight />
                    </div>



                    <div className="journey-strip__step">

                        <div className="journey-strip__number">
                            03
                        </div>

                        <div className="journey-strip__step-content">

                            <div className="journey-strip__icon">
                                <HiOutlineSparkles />
                            </div>

                            <div>

                                <strong>
                                    Start your journey
                                </strong>

                                <span>
                                    Choose your direction
                                </span>

                            </div>

                        </div>

                    </div>

                </div>



                {/* ==================================================
                    CTA
                ================================================== */}

                <a
                    href="/free-assessment"
                    className="journey-strip__cta"
                >

                    <span>
                        Find my pathway
                    </span>

                    <HiOutlineArrowRight />

                </a>


            </div>

        </section>

    );

};


export default JourneyStrip;