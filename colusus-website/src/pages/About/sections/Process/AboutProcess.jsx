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

    return (

        <section className="about-process">

            <div className="container">

                {/* Header */}

                <div className="about-process-header">

                    <span className="about-process-tag">

                        SIMPLE PROCESS

                    </span>

                    <h2>

                        Your Journey

                        <span> Starts Here</span>

                    </h2>

                    <p>

                        Every successful relocation follows a structured path.
                        Our experienced team guides you through each stage with
                        transparency, expertise and continuous support.

                    </p>

                </div>

                {/* Timeline */}

                <div className="about-process-timeline">

                    {process.map((step, index) => (

                        <article
                            key={step.number}
                            className="timeline-step"
                        >

                            {/* Timeline Left */}

                            <div className="timeline-marker">

                                <div className="timeline-dot">

                                    {step.icon}

                                </div>

                                {index !== process.length - 1 && (

                                    <span className="timeline-line"></span>

                                )}

                            </div>

                            {/* Timeline Card */}

                            <div className="timeline-card">

                                <span className="timeline-number">

                                    STEP {step.number}

                                </span>

                                <h3>

                                    {step.title}

                                </h3>

                                <p>

                                    {step.description}

                                </p>

                            </div>

                        </article>

                    ))}

                </div>

            </div>

        </section>

    );

};

export default AboutProcess;