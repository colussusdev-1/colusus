import "./GlobalCTA.css";

import {
    HiOutlinePhone,
    HiOutlineMail,
    HiOutlineArrowRight,
    HiOutlineGlobeAlt,
    HiOutlineShieldCheck,
    HiOutlineClock,
    HiOutlineUserGroup,
    HiOutlineSupport,
    HiOutlineCheckCircle,
} from "react-icons/hi";

import globalJourneyPlane from "../../../../assets/images/globalcta/global-journey-plane.png";

import globalJourneyPath from "../../../../assets/images/globalcta/global-journey-dotted-path.png";


const GlobalCTA = () => {

    return (

        <section
            className="global-cta-section"
            aria-labelledby="global-cta-title"
        >


            {/* =====================================================
                SECTION ATMOSPHERE
            ===================================================== */}

            <div
                className="global-cta-background"
                aria-hidden="true"
            >

                <div className="global-cta-background-glow"></div>

                <div className="global-cta-background-grid"></div>

                <div className="global-cta-world-map"></div>

            </div>



            {/* =====================================================
                MAIN CONTAINER
            ===================================================== */}

            <div className="global-cta-container">


                <div className="global-cta-card">


                    {/* =================================================
                        LEFT / CONTENT SIDE
                    ================================================= */}

                    <div className="global-cta-content">


                        {/* =============================================
                            BADGE
                        ============================================= */}

                        <div className="global-cta-badge">

                            <span className="global-cta-badge-icon">

                                <HiOutlineGlobeAlt />

                            </span>

                            <span>
                                START YOUR GLOBAL JOURNEY
                            </span>

                        </div>



                        {/* =============================================
                            HEADLINE
                        ============================================= */}

                        <h2
                            id="global-cta-title"
                            className="global-cta-title"
                        >

                            Get Your Personalized

                            <span>
                                Immigration
                            </span>

                            Assessment

                        </h2>



                        {/* =============================================
                            TITLE ACCENT
                        ============================================= */}

                        <div
                            className="global-cta-title-accent"
                            aria-hidden="true"
                        >

                            <span></span>

                            <span></span>

                        </div>



                        {/* =============================================
                            DESCRIPTION
                        ============================================= */}

                        <p className="global-cta-description">

                            Speak with a migration specialist and discover
                            the best pathway based on your profile, goals
                            and international ambitions.

                        </p>



                        {/* =============================================
                            JOURNEY PATH
                        ============================================= */}

                        <div
                            className="global-cta-journey"
                            aria-hidden="true"
                        >

                            <img
                                src={globalJourneyPath}
                                alt=""
                                className="global-cta-journey-path"
                            />


                            <img
                                src={globalJourneyPlane}
                                alt=""
                                className="global-cta-journey-plane"
                            />


                            <span className="global-cta-journey-pin">

                                <span></span>

                            </span>

                        </div>



                        {/* =============================================
                            PRIMARY ACTION
                        ============================================= */}

                        <div className="global-cta-actions">

                            <button
                                type="button"
                                className="global-cta-primary"
                            >

                                <span>
                                    Book Consultation
                                </span>

                                <HiOutlineArrowRight />

                            </button>

                        </div>



                        {/* =============================================
                            VALUE FEATURES
                        ============================================= */}

                        <div className="global-cta-features">


                            {/* FEATURE 01 */}

                            <div className="global-cta-feature">


                                <div className="global-cta-feature-icon">

                                    <HiOutlineShieldCheck />

                                </div>


                                <div>

                                    <strong>
                                        100% Confidential
                                    </strong>

                                    <span>
                                        Your information is safe with us.
                                    </span>

                                </div>


                            </div>



                            <div className="global-cta-feature-divider"></div>



                            {/* FEATURE 02 */}

                            <div className="global-cta-feature">


                                <div className="global-cta-feature-icon">

                                    <HiOutlineClock />

                                </div>


                                <div>

                                    <strong>
                                        Quick & Easy
                                    </strong>

                                    <span>
                                        Takes only a few minutes to complete.
                                    </span>

                                </div>


                            </div>



                            <div className="global-cta-feature-divider"></div>



                            {/* FEATURE 03 */}

                            <div className="global-cta-feature">


                                <div className="global-cta-feature-icon">

                                    <HiOutlineUserGroup />

                                </div>


                                <div>

                                    <strong>
                                        Expert Guidance
                                    </strong>

                                    <span>
                                        Get advice from migration specialists.
                                    </span>

                                </div>


                            </div>


                        </div>


                    </div>



                    {/* =================================================
                        RIGHT / CONTACT SIDE
                    ================================================= */}

                    <aside className="global-cta-contact">


                        {/* =============================================
                            CONTACT HEADER
                        ============================================= */}

                        <div className="global-cta-contact-header">


                            <div className="global-cta-contact-main-icon">

                                <HiOutlineSupport />

                            </div>


                            <div>

                                <h3 className="global-cta-contact-title">
                                    Contact Details
                                </h3>

                                <p>
                                    We're here to help you every step
                                    of the way.
                                </p>

                            </div>


                        </div>



                        {/* =============================================
                            DIVIDER
                        ============================================= */}

                        <div className="global-cta-contact-divider"></div>



                        {/* =============================================
                            EMAIL
                        ============================================= */}

                        <div className="global-cta-contact-item">


                            <div className="global-cta-icon">

                                <HiOutlineMail />

                            </div>


                            <div className="global-cta-contact-info">

                                <span>
                                    EMAIL
                                </span>

                                <a href="mailto:admin@colossusmigration.com">
                                    admin@colossusmigration.com
                                </a>

                            </div>


                        </div>



                        {/* =============================================
                            PHONE
                        ============================================= */}

                        <div className="global-cta-contact-item">


                            <div className="global-cta-icon">

                                <HiOutlinePhone />

                            </div>


                            <div className="global-cta-contact-info">

                                <span>
                                    PHONE
                                </span>

                                <a href="tel:+2347035209306">
                                    +234-703-520-9306
                                </a>

                                <a href="tel:+2349026953513">
                                    +234-902-695-3513
                                </a>

                            </div>


                        </div>



                        {/* =============================================
                            CONTACT STATUS
                        ============================================= */}

                        <div className="global-cta-contact-divider"></div>


                        <div className="global-cta-status">


                            <div className="global-cta-status-icon">

                                <HiOutlineCheckCircle />

                            </div>


                            <div>

                                <strong>
                                    Response within 24 hours
                                </strong>

                                <span>
                                    Global support available
                                </span>

                            </div>


                        </div>



                        {/* =============================================
                            CONTACT DECORATION
                        ============================================= */}

                        <div
                            className="global-cta-contact-dots"
                            aria-hidden="true"
                        ></div>


                    </aside>


                </div>


            </div>



            {/* =====================================================
                BOTTOM ATMOSPHERE
            ===================================================== */}

            <div
                className="global-cta-bottom-fade"
                aria-hidden="true"
            ></div>


        </section>

    );

};


export default GlobalCTA;