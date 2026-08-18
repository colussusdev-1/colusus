import "./TouristProcess.css";

import {
    HiOutlineClipboardCheck,
    HiOutlineDocumentSearch,
    HiOutlinePaperAirplane,
    HiOutlineArrowRight,
} from "react-icons/hi";


/* =========================================================
   EXISTING TRAVEL ASSETS
========================================================= */

import processBackground
    from "../../../../assets/tourist/trust/migration-trust-background.png";

import processRoute
    from "../../../../assets/tourist/trust/migration-flight-route.png";

import processAirplane
    from "../../../../assets/tourist/trust/migration-airplane.png";

import processLandmarksLeft
    from "../../../../assets/tourist/trust/migration-landmarks-left.png";

import processLandmarksRight
    from "../../../../assets/tourist/trust/migration-landmarks-right.png";


/* =========================================================
   EXISTING TRUST VISUALS

   We reuse the assets already extracted for the page.
========================================================= */

import trustGuidance
    from "../../../../assets/tourist/trust/trust-guidance.png";

import trustDocumentation
    from "../../../../assets/tourist/trust/trust-documentation.png";

import trustProcess
    from "../../../../assets/tourist/trust/trust-process.png";


/* =========================================================
   PROCESS DATA
========================================================= */

const processSteps = [

    {
        id: "01",

        icon: HiOutlineClipboardCheck,

        eyebrow: "STEP 01",

        title: "Document Review",

        text:
            "We carefully review your documents and assess your eligibility before an application is submitted.",

        image: trustGuidance,

        badge: "Expert Guidance",
    },


    {
        id: "02",

        icon: HiOutlineDocumentSearch,

        eyebrow: "STEP 02",

        title: "Application Preparation",

        text:
            "Our consultants organise your supporting documents and prepare a complete application package.",

        image: trustDocumentation,

        badge: "Complete Preparation",
    },


    {
        id: "03",

        icon: HiOutlinePaperAirplane,

        eyebrow: "STEP 03",

        title: "Submission & Tracking",

        text:
            "We guide you through submission and keep you informed until a decision is reached.",

        image: trustProcess,

        badge: "Ongoing Support",
    },

];


/* =========================================================
   COMPONENT
========================================================= */

const TouristProcess = () => {

    return (

        <section
            className="tourist-process"

            style={{
                "--process-bg": `url(${processBackground})`,
                "--process-route": `url(${processRoute})`,
                "--process-airplane": `url(${processAirplane})`,
                "--process-landmarks-left":
                    `url(${processLandmarksLeft})`,
                "--process-landmarks-right":
                    `url(${processLandmarksRight})`,
            }}
        >

            {/* =================================================
                ATMOSPHERIC BACKGROUND
            ================================================= */}

            <div
                className="tourist-process-background"
                aria-hidden="true"
            />

            <div
                className="tourist-process-map-glow"
                aria-hidden="true"
            />

            <div
                className="tourist-process-route"
                aria-hidden="true"
            />

            <div
                className="tourist-process-airplane"
                aria-hidden="true"
            />

            <div
                className="
                    tourist-process-landmarks
                    tourist-process-landmarks--left
                "
                aria-hidden="true"
            />

            <div
                className="
                    tourist-process-landmarks
                    tourist-process-landmarks--right
                "
                aria-hidden="true"
            />


            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <div className="container tourist-process-container">


                {/* =================================================
                    HEADER
                ================================================= */}

                <header className="tourist-process-header">

                    <span className="tourist-process-eyebrow">

                        <span className="tourist-process-eyebrow-dot" />

                        HOW IT WORKS

                    </span>


                    <h2>

                        <span className="process-heading-main">
                            A Simple Path To Your
                        </span>

                        <span className="process-heading-accent">
                            International Journey
                        </span>

                    </h2>


                    <div className="process-heading-decoration">

                        <span className="process-heading-line" />

                        <span className="process-heading-dot" />

                        <span className="process-heading-line process-heading-line--short" />

                    </div>


                    <p className="tourist-process-description">

                        From your first consultation to travel preparation,
                        our experts guide you through every important stage
                        with clarity and confidence.

                    </p>


                    <div className="tourist-process-meta">

                        <span>CONSULT</span>

                        <i />

                        <span>PREPARE</span>

                        <i />

                        <span>TRAVEL</span>

                    </div>

                </header>


                {/* =================================================
                    PROCESS JOURNEY
                ================================================= */}

                <div className="tourist-process-journey">


                    {/* CONNECTING JOURNEY */}

                    <div
                        className="tourist-process-journey-path"
                        aria-hidden="true"
                    >

                        <span className="journey-path-line" />

                        <span className="journey-path-dot journey-path-dot--one" />

                        <span className="journey-path-dot journey-path-dot--two" />

                        <span className="journey-path-dot journey-path-dot--three" />

                    </div>


                    {/* PROCESS CARDS */}

                    <div className="tourist-process-grid">

                        {processSteps.map((step) => {

                            const Icon = step.icon;

                            return (

                                <article
                                    key={step.id}
                                    className="tourist-process-card"
                                >

                                    {/* CARD ATMOSPHERE */}

                                    <div
                                        className="tourist-process-card-image"
                                        style={{
                                            backgroundImage:
                                                `url(${step.image})`,
                                        }}
                                        aria-hidden="true"
                                    />

                                    <div
                                        className="tourist-process-card-image-fade"
                                        aria-hidden="true"
                                    />


                                    {/* CARD TOP */}

                                    <div className="tourist-process-card-top">

                                        <div className="tourist-process-card-icon">

                                            <Icon />

                                        </div>


                                        <span className="tourist-process-card-number">

                                            {step.id}

                                        </span>

                                    </div>


                                    {/* CARD CONTENT */}

                                    <div className="tourist-process-card-content">

                                        <span className="tourist-process-card-eyebrow">

                                            {step.eyebrow}

                                        </span>


                                        <h3>

                                            {step.title}

                                        </h3>


                                        <p>

                                            {step.text}

                                        </p>

                                    </div>


                                    {/* CARD FOOTER */}

                                    <div className="tourist-process-card-footer">

                                        <div className="process-card-status">

                                            <span className="process-card-status-dot" />

                                            <span>
                                                {step.badge}
                                            </span>

                                        </div>


                                        <span className="process-card-arrow">

                                            <HiOutlineArrowRight />

                                        </span>

                                    </div>

                                </article>

                            );

                        })}

                    </div>

                </div>


                {/* =================================================
                    DESTINATION CTA
                ================================================= */}

                <div className="tourist-process-note">


                    <div
                        className="tourist-process-note-glow"
                        aria-hidden="true"
                    />


                    <div
                        className="tourist-process-note-route"
                        aria-hidden="true"
                    />


                    <div
                        className="tourist-process-note-plane"
                        aria-hidden="true"
                    />


                    <div className="tourist-process-note-icon">

                        <HiOutlinePaperAirplane />

                    </div>


                    <div className="tourist-process-note-content">

                        <span className="tourist-process-note-eyebrow">

                            YOUR JOURNEY STARTS HERE

                        </span>


                        <h3>

                            Your Destination Is Closer Than You Think

                        </h3>


                        <p>

                            Proper preparation increases your chances
                            of a smooth travel experience. Our team helps
                            you understand requirements, prepare documents
                            and avoid common mistakes.

                        </p>

                    </div>


                    <div className="tourist-process-note-action">

                        <span>
                            READY TO MOVE?
                        </span>

                        <strong>
                            Plan with confidence.
                        </strong>

                    </div>

                </div>


                {/* =================================================
                    FOOTER MESSAGE
                ================================================= */}

                <div className="tourist-process-footer">

                    <span className="tourist-process-footer-line" />

                    <span className="tourist-process-footer-dot" />

                    <span className="tourist-process-footer-text">

                        Every successful journey starts with
                        the right preparation.

                    </span>

                    <strong>

                        Plan with confidence.

                    </strong>

                    <span className="tourist-process-footer-line" />

                </div>

            </div>

        </section>

    );

};


export default TouristProcess;