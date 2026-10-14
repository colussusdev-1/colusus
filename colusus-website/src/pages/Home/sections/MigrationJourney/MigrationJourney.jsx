import { Link } from "react-router-dom";

import {
    FaGlobeAfrica,
    FaUserPlus,
    FaFolderOpen,
    FaFileSignature,
    FaCreditCard,
    FaBriefcase,
    FaPassport,
    FaCheckCircle,
    FaArrowRight,
    FaRegCompass,
} from "react-icons/fa";

import "./MigrationJourney.css";

/* ======================================================
   MIGRATION JOURNEY STEPS
====================================================== */

const journeySteps = [
    {
        number: "01",
        title: "Choose Your Destination",
        description:
            "Choose your preferred destination and migration pathway, or book a consultation with our team for guidance on the options that may suit your goals.",
        icon: FaGlobeAfrica,
        label: "Explore your options",
    },

    {
        number: "02",
        title: "Create Your Account",
        description:
            "Register on the Colossus client portal to establish your profile and access your migration journey.",
        icon: FaUserPlus,
        label: "Get started",
    },

    {
        number: "03",
        title: "Upload Your Documents",
        description:
            "Upload your CV, international passport, and other documents required for your selected pathway through the client portal.",
        icon: FaFolderOpen,
        label: "Prepare your documents",
    },

    {
        number: "04",
        title: "Review & Sign Your Agreement",
        description:
            "Review your service agreement, understand the applicable terms, and sign your contract before proceeding.",
        icon: FaFileSignature,
        label: "Understand the process",
    },

    {
        number: "05",
        title: "Complete Your Initial Payment",
        description:
            "Pay the applicable advance or initial fees in accordance with your service agreement and selected pathway.",
        icon: FaCreditCard,
        label: "Understand payment requirements",
    },

    {
        number: "06",
        title: "Reach Your Next Milestone",
        description:
            "Depending on your pathway, this could be a job offer, work permit, admission letter, invitation to apply for permanent residence, or another relevant milestone.",
        icon: FaBriefcase,
        label: "Track your progress",
    },

    {
        number: "07",
        title: "Submit Your Visa Application",
        description:
            "Prepare and submit your visa application and attend biometrics appointments or other required procedures at the relevant embassy or visa application centre.",
        icon: FaPassport,
        label: "Prepare for submission",
    },

    {
        number: "08",
        title: "Receive Your Visa Decision",
        description:
            "Receive the decision on your visa application and review the next steps applicable to your outcome.",
        icon: FaCheckCircle,
        label: "Your next chapter",
    },
];

/* ======================================================
   MIGRATION JOURNEY COMPONENT
====================================================== */

function MigrationJourney() {
    return (
        <section
            className="migration-journey"
            id="migration-journey"
        >
            <div className="migration-journey-container">

                {/* ==========================================
                    SECTION HEADER
                ========================================== */}

                <div className="migration-journey-header">

                    <div className="migration-journey-eyebrow">
                        <span className="migration-journey-eyebrow-icon">
                            <FaRegCompass />
                        </span>

                        <span>
                            YOUR JOURNEY STARTS HERE
                        </span>
                    </div>

                    <h2 className="migration-journey-heading">
                        8 Steps to Your{" "}
                        <span>Dream Destination</span>
                    </h2>

                    <p className="migration-journey-description">
                        Every successful migration journey begins
                        with a plan. From choosing your preferred
                        destination to receiving your visa decision,
                        we help you understand the process and
                        navigate each stage with greater clarity.
                    </p>

                </div>

                {/* ==========================================
                    JOURNEY OVERVIEW
                ========================================== */}

                <div className="migration-journey-overview">

                    <div className="migration-journey-overview-content">

                        <div className="migration-journey-overview-icon">
                            <FaGlobeAfrica />
                        </div>

                        <div>
                            <span className="migration-journey-overview-label">
                                YOUR FUTURE. YOUR JOURNEY.
                            </span>

                            <h3>
                                One step at a time.
                            </h3>

                            <p>
                                Know what to expect, prepare with
                                confidence, and keep your journey
                                moving forward.
                            </p>
                        </div>

                    </div>

                    <div className="migration-journey-step-count">
                        <strong>08</strong>

                        <span>
                            KEY STEPS
                        </span>
                    </div>

                </div>

                {/* ==========================================
                    JOURNEY STEPS
                ========================================== */}

                <div className="migration-journey-grid">

                    {journeySteps.map((step, index) => {
                        const Icon = step.icon;

                        return (
                            <article
                                className="migration-journey-card"
                                key={step.number}
                            >
                                <div className="migration-journey-card-top">

                                    <span className="migration-journey-number">
                                        {step.number}
                                    </span>

                                    <span className="migration-journey-card-icon">
                                        <Icon />
                                    </span>

                                </div>

                                <div className="migration-journey-card-content">

                                    <h3>
                                        {step.title}
                                    </h3>

                                    <p>
                                        {step.description}
                                    </p>

                                </div>

                                <div className="migration-journey-card-bottom">

                                    <span>
                                        {step.label}
                                    </span>

                                    <span className="migration-journey-card-arrow">
                                        <FaArrowRight />
                                    </span>

                                </div>

                                <span
                                    className="migration-journey-card-progress"
                                    aria-hidden="true"
                                />

                            </article>
                        );
                    })}

                </div>

                {/* ==========================================
                    IMPORTANT INFORMATION
                ========================================== */}

                <div className="migration-journey-note">

                    <span className="migration-journey-note-icon">
                        <FaRegCompass />
                    </span>

                    <p>
                        <strong>Every journey is different.</strong>{" "}
                        The exact steps, requirements, timelines,
                        and outcomes depend on your destination
                        and immigration pathway. Completing these
                        steps does not guarantee a job offer,
                        admission, permit, or visa approval.
                    </p>

                </div>

                {/* ==========================================
                    CALL TO ACTION
                ========================================== */}

                <div className="migration-journey-cta">

                    <div className="migration-journey-cta-content">

                        <span className="migration-journey-cta-eyebrow">
                            YOUR NEXT CHAPTER STARTS HERE
                        </span>

                        <h3>
                            Ready to take the first step?
                        </h3>

                        <p>
                            Let's discuss your goals and help you
                            understand the next steps for your
                            migration journey.
                        </p>

                    </div>

                    <div className="migration-journey-cta-actions">

                        <Link
                            to="/consultation"
                            className="migration-journey-btn migration-journey-btn-primary"
                        >
                            Book a Consultation

                            <FaArrowRight />
                        </Link>

                        <Link
                            to="/register"
                            className="migration-journey-btn migration-journey-btn-secondary"
                        >
                            Create Your Account
                        </Link>

                    </div>

                </div>

            </div>
        </section>
    );
}

export default MigrationJourney;