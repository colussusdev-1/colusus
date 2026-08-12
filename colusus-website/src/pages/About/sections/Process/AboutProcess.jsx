import { useEffect, useRef } from "react";

import "./AboutProcess.css";

import {
    HiOutlineChatAlt2,
    HiOutlineClipboardCheck,
    HiOutlineDocumentText,
    HiOutlinePaperAirplane,
    HiOutlineBadgeCheck,
    HiOutlineGlobeAlt,
} from "react-icons/hi";


const process = [

    {
        number: "01",
        icon: <HiOutlineChatAlt2 />,
        title: "Consultation",
        description:
            "We understand your goals and recommend the most suitable migration pathway.",
    },

    {
        number: "02",
        icon: <HiOutlineClipboardCheck />,
        title: "Eligibility Review",
        description:
            "Our experts assess your profile and identify the strongest application strategy.",
    },

    {
        number: "03",
        icon: <HiOutlineDocumentText />,
        title: "Documentation",
        description:
            "We guide you through preparing accurate and complete supporting documents.",
    },

    {
        number: "04",
        icon: <HiOutlinePaperAirplane />,
        title: "Application Submission",
        description:
            "Your application is carefully prepared, reviewed and submitted with confidence.",
    },

    {
        number: "05",
        icon: <HiOutlineBadgeCheck />,
        title: "Approval & Updates",
        description:
            "We keep you informed throughout the process until your application is approved.",
    },

    {
        number: "06",
        icon: <HiOutlineGlobeAlt />,
        title: "Travel & Relocation",
        description:
            "From travel preparation to arrival guidance, we support your next chapter.",
    },

];


const AboutProcess = () => {

    const sectionRef = useRef(null);


    useEffect(() => {

        const section = sectionRef.current;

        if (!section) return;


        const observer = new IntersectionObserver(

            ([entry]) => {

                if (entry.isIntersecting) {

                    section.classList.add(
                        "about-process-is-visible"
                    );

                    observer.unobserve(section);

                }

            },

            {
                threshold: 0.12,
                rootMargin: "0px 0px -80px 0px",
            }

        );


        observer.observe(section);


        return () => observer.disconnect();

    }, []);


    return (

        <section
            ref={sectionRef}
            className="about-process"
        >


            {/* =================================================
                BACKGROUND ATMOSPHERE
            ================================================= */}

            <div
                className="about-process-background"
                aria-hidden="true"
            >

                <span className="process-orbit process-orbit-one"></span>

                <span className="process-orbit process-orbit-two"></span>

                <span className="process-glow process-glow-one"></span>

                <span className="process-glow process-glow-two"></span>

                <span className="process-particle process-particle-one"></span>

                <span className="process-particle process-particle-two"></span>

                <span className="process-particle process-particle-three"></span>

            </div>


            <div className="container about-process-container">


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="about-process-header process-header-reveal">


                    <span className="about-process-tag">

                        <span className="process-tag-dot"></span>

                        SIMPLE PROCESS

                    </span>


                    <h2>

                        <span className="process-title-dark">
                            Your Journey
                        </span>

                        <span>
                            Starts Here
                        </span>

                    </h2>


                    <div className="process-title-line"></div>


                    <p>

                        Every successful relocation follows a structured
                        path. Our experienced team guides you through each
                        stage with transparency, expertise and continuous
                        support.

                    </p>


                </div>


                {/* =================================================
                    TIMELINE
                ================================================= */}

                <div className="about-process-timeline">


                    {/* Progress line */}

                    <span
                        className="timeline-progress-line"
                        aria-hidden="true"
                    ></span>


                    {process.map((step, index) => (

                        <article
                            key={step.number}
                            className={`
                                timeline-step
                                process-step-reveal
                                ${index % 2 === 0
                                    ? "process-step-left"
                                    : "process-step-right"
                                }
                            `}
                            style={{
                                "--process-delay":
                                    `${index * 140}ms`,
                            }}
                        >


                            {/* =================================================
                                MARKER
                            ================================================= */}

                            <div className="timeline-marker">


                                <div className="timeline-dot">

                                    <span className="timeline-dot-inner">

                                        {step.icon}

                                    </span>

                                </div>


                                {index !== process.length - 1 && (

                                    <span className="timeline-line"></span>

                                )}


                            </div>


                            {/* =================================================
                                CARD
                            ================================================= */}

                            <div className="timeline-card">


                                <div className="timeline-card-top">


                                    <span className="timeline-number">

                                        STEP {step.number}

                                    </span>


                                    <span className="timeline-card-index">

                                        {step.number}

                                    </span>


                                </div>


                                <h3>

                                    {step.title}

                                </h3>


                                <p>

                                    {step.description}

                                </p>


                                <span className="timeline-card-accent"></span>


                                {/* Travel indicator */}

                                <span className="timeline-travel-icon">

                                    <HiOutlinePaperAirplane />

                                </span>


                            </div>


                        </article>

                    ))}


                </div>


                {/* =================================================
    BOTTOM JOURNEY STATEMENT
================================================= */}

                <div className="about-process-footer process-footer-reveal">

                    <div className="process-footer-icon">

                        <HiOutlineGlobeAlt />

                    </div>


                    <div className="process-footer-content">

                        <strong>
                            One journey. Six guided steps.
                        </strong>

                        <span>
                            From your first conversation to your next destination.
                        </span>

                    </div>


                    <div className="process-footer-route">

                        <span className="process-footer-route-line"></span>

                        <span className="process-footer-route-dot"></span>

                        <HiOutlinePaperAirplane />

                    </div>

                </div>


            </div>

        </section>

    );

};


export default AboutProcess;