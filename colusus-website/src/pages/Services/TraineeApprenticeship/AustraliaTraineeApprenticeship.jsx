import React, { useState } from "react";
import {
    HiArrowLeft,
    HiArrowRight,
    HiCheckCircle,
    HiChevronDown,
    HiClock,
    HiEnvelope,
    HiGlobeAlt,
    HiOutlineAcademicCap,
    HiOutlineBriefcase,
    HiOutlineChatBubbleLeftRight,
    HiOutlineDocumentText,
    HiOutlineShieldCheck,
    HiOutlineUserGroup,
    HiXMark,
} from "react-icons/hi2";

import "./AustraliaTraineeApprenticeship.css";

const PROGRAMMES = [
    {
        id: "automotive-technical",
        title: "Automotive & Technical",
        description:
            "Explore automotive training options, including vehicle servicing, mechanical technology and diagnostic skills.",
        icon: HiOutlineBriefcase,
        duration: "Confirm with provider",
    },
    {
        id: "business-management",
        title: "Business & Management",
        description:
            "Explore business pathways covering workplace operations, administration and professional practice.",
        icon: HiOutlineShieldCheck,
        duration: "Confirm with provider",
    },
    {
        id: "construction-trades",
        title: "Construction & Trades",
        description:
            "Explore practical vocational training related to construction, trades and technical skills.",
        icon: HiOutlineUserGroup,
        duration: "Confirm with provider",
    },
    {
        id: "aged-care-support",
        title: "Aged Care & Support",
        description:
            "Ask about training pathways in aged care, community support and care-related services.",
        icon: HiOutlineAcademicCap,
        duration: "Availability must be confirmed",
    },
    {
        id: "information-technology",
        title: "Information Technology",
        description:
            "Explore potential vocational pathways in information technology and digital skills.",
        icon: HiOutlineDocumentText,
        duration: "Confirm with provider",
    },
];

const APPLICATION_STEPS = [
    {
        number: "01",
        title: "Send an enquiry",
        description:
            "Tell the Colossus team which training area interests you and share your contact details.",
    },
    {
        number: "02",
        title: "Review programme information",
        description:
            "Confirm the course, provider, duration, entry requirements and applicable fees.",
    },
    {
        number: "03",
        title: "Prepare your documents",
        description:
            "Follow the provider's instructions for the documents required.",
    },
    {
        number: "04",
        title: "Submit your application",
        description:
            "Proceed after the programme details, eligibility criteria and terms have been explained.",
    },
    {
        number: "05",
        title: "Confirm your next steps",
        description:
            "Review the provider's decision and obtain official guidance about any relevant visa process.",
    },
];

const FAQS = [
    {
        question: "When is the next intake?",
        answer:
            "Intake dates depend on the course and provider. Contact Colossus to confirm current dates and application deadlines.",
    },
    {
        question: "How long do the programmes last?",
        answer:
            "Duration varies by qualification and provider. Confirm the official duration of your selected course before applying.",
    },
    {
        question: "Is a monthly stipend guaranteed?",
        answer:
            "No stipend or wage is guaranteed. Ask for written confirmation of the amount, eligibility, payment arrangements and conditions.",
    },
    {
        question: "Will I automatically receive a visa or a job?",
        answer:
            "No. Training or submitting an application does not guarantee admission, a visa, employment, a stipend or permanent residency.",
    },
    {
        question: "What happens if my visa is refused?",
        answer:
            "Any refund depends on the provider's written refund policy and your agreement. Review those terms before making a payment.",
    },
    {
        question: "How do I confirm fees and requirements?",
        answer:
            "Ask for the provider's details, course information, entry criteria, full cost breakdown, refund conditions and any stipend terms in writing.",
    },
];

const INITIAL_FORM = {
    fullName: "",
    email: "",
    phone: "",
    programme: "",
    education: "",
    message: "",
};

function EnquiryModal({ onClose, onContinue, selectedProgramme }) {
    const [form, setForm] = useState({
        ...INITIAL_FORM,
        programme: selectedProgramme || "",
    });
    const [error, setError] = useState("");

    const updateField = (event) => {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setError("");

        if (
            !form.fullName.trim() ||
            !form.email.trim() ||
            !form.programme
        ) {
            setError(
                "Please provide your name, email address and programme interest."
            );
            return;
        }

        const subject = encodeURIComponent(
            `Australia Training Enquiry — ${form.programme}`
        );

        const body = encodeURIComponent(
            [
                "Hello Colossus Migration & Tours,",
                "",
                "I would like to enquire about Australia's trainee and vocational training opportunities.",
                "",
                `Full name: ${form.fullName.trim()}`,
                `Email: ${form.email.trim()}`,
                `Phone/WhatsApp: ${form.phone.trim() || "Not provided"}`,
                `Programme interest: ${form.programme}`,
                `Education/background: ${form.education.trim() || "Not provided"}`,
                "",
                `Questions: ${form.message.trim() ||
                "Please share the current programme details, eligibility requirements, fees, duration and intake availability."
                }`,
                "",
                "Please confirm the programme details and applicable terms in writing.",
            ].join("\n")
        );

        const mailto =
            `mailto:admin@colossusmigration.com?subject=${subject}&body=${body}`;

        window.location.href = mailto;
        onContinue();
    };

    return (
        <div
            className="auta-modal-backdrop"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <section
                className="auta-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="auta-enquiry-title"
                onMouseDown={(event) => event.stopPropagation()}
            >
                <button
                    className="auta-modal-close"
                    type="button"
                    onClick={onClose}
                    aria-label="Close enquiry form"
                >
                    <HiXMark />
                </button>

                <span className="auta-modal-kicker">AUSTRALIA PATHWAYS</span>

                <h2 id="auta-enquiry-title">
                    Tell us what you're looking for.
                </h2>

                <p className="auta-modal-intro">
                    Complete this form to prepare an enquiry email for our team.
                    Your email application will open so you can review and send it.
                </p>

                <form
                    className="auta-enquiry-form"
                    onSubmit={handleSubmit}
                >
                    <label>
                        Full name <span>*</span>
                        <input
                            name="fullName"
                            value={form.fullName}
                            onChange={updateField}
                            autoComplete="name"
                            required
                            placeholder="Your full name"
                        />
                    </label>

                    <div className="auta-form-row">
                        <label>
                            Email address <span>*</span>
                            <input
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={updateField}
                                autoComplete="email"
                                required
                                placeholder="you@example.com"
                            />
                        </label>

                        <label>
                            Phone / WhatsApp
                            <input
                                name="phone"
                                type="tel"
                                value={form.phone}
                                onChange={updateField}
                                autoComplete="tel"
                                placeholder="+234..."
                            />
                        </label>
                    </div>

                    <label>
                        Programme interest <span>*</span>
                        <select
                            name="programme"
                            value={form.programme}
                            onChange={updateField}
                            required
                        >
                            <option value="">Choose a training area</option>

                            {PROGRAMMES.map((programme) => (
                                <option
                                    key={programme.id}
                                    value={programme.title}
                                >
                                    {programme.title}
                                </option>
                            ))}

                            <option value="Not sure yet">
                                I'm not sure yet
                            </option>
                        </select>
                    </label>

                    <label>
                        Education or work background
                        <input
                            name="education"
                            value={form.education}
                            onChange={updateField}
                            placeholder="e.g. graduate, secondary school, work experience"
                        />
                    </label>

                    <label>
                        Questions or additional information
                        <textarea
                            name="message"
                            value={form.message}
                            onChange={updateField}
                            rows="3"
                            placeholder="What would you like us to clarify?"
                        />
                    </label>

                    {error && (
                        <p className="auta-form-error">{error}</p>
                    )}

                    <p className="auta-form-disclaimer">
                        This form prepares an email. It does not save information
                        to a Colossus database or send an email automatically.
                    </p>

                    <button
                        className="auta-button auta-button-primary"
                        type="submit"
                    >
                        Continue to email <HiArrowRight />
                    </button>
                </form>
            </section>
        </div>
    );
}

function PostEnquiryModal({ onClose }) {
    return (
        <div
            className="auta-modal-backdrop"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <section
                className="auta-modal auta-post-enquiry"
                role="dialog"
                aria-modal="true"
                aria-labelledby="auta-post-title"
                onMouseDown={(event) => event.stopPropagation()}
            >
                <button
                    className="auta-modal-close"
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                >
                    <HiXMark />
                </button>

                <span className="auta-success-icon">
                    <HiEnvelope />
                </span>

                <span className="auta-modal-kicker">ONE MORE STEP</span>

                <h2 id="auta-post-title">
                    Your enquiry email is ready.
                </h2>

                <p className="auta-modal-intro">
                    Your email application should have opened with your enquiry.
                    Review the message and press Send in your email application.
                    It has not been sent automatically.
                </p>

                <div className="auta-post-actions">
                    <a
                        className="auta-button auta-button-primary"
                        href="/services/trainee-apprenticeship"
                        onClick={onClose}
                    >
                        Explore other pathways <HiArrowRight />
                    </a>

                    <a
                        className="auta-button auta-button-secondary"
                        href="/register"
                        onClick={onClose}
                    >
                        Create an account <HiOutlineAcademicCap />
                    </a>

                    <button
                        className="auta-text-button"
                        type="button"
                        onClick={onClose}
                    >
                        Stay on this page
                    </button>
                </div>
            </section>
        </div>
    );
}

export default function AustraliaTraineeApprenticeship() {
    const [showEnquiry, setShowEnquiry] = useState(false);
    const [showPostEnquiry, setShowPostEnquiry] = useState(false);
    const [openFaq, setOpenFaq] = useState(0);
    const [selectedProgramme, setSelectedProgramme] = useState("");

    const openEnquiry = (programme = "") => {
        setSelectedProgramme(programme);
        setShowEnquiry(true);
    };

    const handleEnquiryContinue = () => {
        setShowEnquiry(false);
        setShowPostEnquiry(true);
    };

    return (
        <main className="auta-page">
            {/* HERO */}
            <section className="auta-hero">
                <div
                    className="auta-hero-grid-pattern"
                    aria-hidden="true"
                />

                <div className="auta-container auta-hero-layout">
                    <div className="auta-hero-copy">
                        <a
                            className="auta-back-link"
                            href="/services/trainee-apprenticeship"
                        >
                            <HiArrowLeft />
                            All training destinations
                        </a>

                        <span className="auta-eyebrow">
                            <span />
                            AUSTRALIA · TRAINING PATHWAYS
                        </span>

                        <h1>
                            Build your skills.
                            <br />
                            <em>Explore what's next.</em>
                        </h1>

                        <p>
                            Explore vocational and career-focused training opportunities
                            in Australia. Review the available programme areas, then
                            enquire to confirm current courses, entry requirements
                            and provider terms.
                        </p>

                        <div className="auta-hero-actions">
                            <button
                                className="auta-button auta-button-primary"
                                type="button"
                                onClick={() => openEnquiry()}
                            >
                                Enquire about programmes <HiArrowRight />
                            </button>

                            <a
                                className="auta-button auta-button-ghost"
                                href="#auta-programmes"
                            >
                                Explore training areas
                            </a>
                        </div>

                        <div className="auta-hero-trust">
                            <span>
                                <HiCheckCircle />
                                Programme-specific guidance
                            </span>

                            <span>
                                <HiCheckCircle />
                                Requirements to be confirmed
                            </span>
                        </div>
                    </div>

                    <aside className="auta-hero-card">
                        <div className="auta-hero-card-top">
                            <span className="auta-country-mark">AU</span>

                            <span className="auta-status-pill">
                                <span />
                                PROGRAMME INFORMATION
                            </span>
                        </div>

                        <span className="auta-card-label">
                            EXPLORE AUSTRALIAN PATHWAYS
                        </span>

                        <h2>
                            Build skills.
                            <span> Plan ahead.</span>
                        </h2>

                        <p>
                            Explore vocational training areas and request details
                            for courses currently available through the relevant
                            education provider.
                        </p>

                        <div className="auta-card-divider" />

                        <div className="auta-stat-row">
                            <span>
                                <HiClock />
                                Course duration
                            </span>
                            <strong>Provider confirmed</strong>
                        </div>

                        <div className="auta-stat-row">
                            <span>
                                <HiGlobeAlt />
                                Destination
                            </span>
                            <strong>Australia</strong>
                        </div>

                        <small className="auta-card-footnote">
                            Course availability, fees, intake dates and entry
                            requirements must be confirmed with the provider.
                        </small>
                    </aside>
                </div>

                <div className="auta-hero-footer">
                    <span>COLOSSUS MIGRATION &amp; TOURS</span>
                    <span>EXPLORE · PREPARE · PROGRESS</span>
                </div>
            </section>

            {/* INTRODUCTION */}
            <section className="auta-intro-section">
                <div className="auta-container auta-intro-grid">
                    <div>
                        <span className="auta-eyebrow">
                            ABOUT THE PATHWAYS
                        </span>

                        <h2>
                            Practical training starts with the right information.
                        </h2>
                    </div>

                    <div className="auta-intro-copy">
                        <p>
                            These opportunities cover several vocational and
                            career-focused areas. The exact course, education provider,
                            fees, entry criteria and any available support depend
                            on the programme.
                        </p>

                        <p>
                            Use this page to identify your area of interest. Our team
                            can help you request current programme information before
                            you decide whether to proceed.
                        </p>
                    </div>
                </div>
            </section>

            {/* PROGRAMMES */}
            <section
                className="auta-programmes-section"
                id="auta-programmes"
            >
                <div className="auta-container">
                    <div className="auta-section-heading">
                        <div>
                            <span className="auta-eyebrow">
                                EXPLORE YOUR OPTIONS
                            </span>

                            <h2>Training areas</h2>

                            <p>
                                Choose an area to discuss with the Colossus team.
                                Availability of individual courses must be confirmed.
                            </p>
                        </div>

                        <span className="auta-heading-count">
                            {String(PROGRAMMES.length).padStart(2, "0")} AREAS
                        </span>
                    </div>

                    <div className="auta-programme-grid">
                        {PROGRAMMES.map((programme, index) => {
                            const Icon = programme.icon;

                            return (
                                <article
                                    className="auta-programme-card"
                                    key={programme.id}
                                >
                                    <div className="auta-programme-card-top">
                                        <span className="auta-programme-number">
                                            {String(index + 1).padStart(2, "0")}
                                        </span>

                                        <span className="auta-programme-icon">
                                            <Icon />
                                        </span>
                                    </div>

                                    <h3>{programme.title}</h3>

                                    <p>{programme.description}</p>

                                    <div className="auta-programme-meta">
                                        <HiClock />
                                        <span>Duration: {programme.duration}</span>
                                    </div>

                                    <button
                                        className="auta-inline-link"
                                        type="button"
                                        onClick={() => openEnquiry(programme.title)}
                                    >
                                        Ask about this area <HiArrowRight />
                                    </button>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* DURATION AND STIPEND */}
            <section className="auta-overview-section">
                <div className="auta-container auta-overview-grid">
                    <article className="auta-overview-card auta-duration-card">
                        <span className="auta-overview-icon">
                            <HiClock />
                        </span>

                        <span className="auta-overview-label">
                            PROGRAMME DURATION
                        </span>

                        <h2>
                            Varies <small>by course</small>
                        </h2>

                        <p>
                            Programme length depends on the selected qualification
                            and provider. Request the official course duration
                            before applying.
                        </p>
                    </article>

                    <article className="auta-overview-card auta-stipend-card">
                        <span className="auta-overview-icon">
                            <HiOutlineBriefcase />
                        </span>

                        <span className="auta-overview-label">
                            STIPEND OR WAGE
                        </span>

                        <h2>
                            Confirm <small>in writing</small>
                        </h2>

                        <p>
                            A stipend or wage is not guaranteed. Ask whether your
                            specific programme is paid and request written details
                            of the amount, eligibility and payment conditions.
                        </p>
                    </article>
                </div>

                <div className="auta-container">
                    <div className="auta-information-notice">
                        <HiOutlineShieldCheck />

                        <span>
                            <strong>Before making a decision:</strong> Request the
                            provider's official course information, full fees,
                            eligibility criteria, stipend terms if applicable,
                            and refund policy in writing.
                        </span>
                    </div>
                </div>
            </section>

            {/* ELIGIBILITY */}
            <section className="auta-eligibility-section">
                <div className="auta-container auta-eligibility-grid">
                    <div className="auta-eligibility-copy">
                        <span className="auta-eyebrow">
                            CHECK BEFORE APPLYING
                        </span>

                        <h2>Confirm your eligibility first.</h2>

                        <p>
                            Entry requirements vary by programme and education
                            provider. Request the exact criteria for your chosen
                            course and confirm that your education, experience
                            and documents meet those requirements.
                        </p>

                        <button
                            className="auta-button auta-button-primary"
                            type="button"
                            onClick={() => openEnquiry()}
                        >
                            Ask about eligibility <HiArrowRight />
                        </button>
                    </div>

                    <div className="auta-checklist">
                        {[
                            "Confirm the exact course and provider.",
                            "Request the official entry requirements.",
                            "Ask which academic and identity documents are needed.",
                            "Confirm the full cost and payment schedule.",
                            "Review stipend conditions, if applicable.",
                            "Read the written refund and cancellation terms.",
                        ].map((item) => (
                            <div
                                className="auta-checklist-item"
                                key={item}
                            >
                                <HiCheckCircle />
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* APPLICATION PROCESS */}
            <section className="auta-process-section">
                <div className="auta-container">
                    <div className="auta-section-heading">
                        <div>
                            <span className="auta-eyebrow">
                                YOUR APPLICATION JOURNEY
                            </span>

                            <h2>Five steps to get started.</h2>

                            <p>
                                This is a general overview. The provider's official
                                instructions take precedence for your selected programme.
                            </p>
                        </div>
                    </div>

                    <div className="auta-process-grid">
                        {APPLICATION_STEPS.map((step) => (
                            <article
                                className="auta-process-step"
                                key={step.number}
                            >
                                <span className="auta-step-number">
                                    {step.number}
                                </span>

                                <h3>{step.title}</h3>
                                <p>{step.description}</p>
                            </article>
                        ))}
                    </div>

                    <div className="auta-process-cta">
                        <div>
                            <HiOutlineDocumentText />

                            <div>
                                <h3>Need the programme details?</h3>
                                <p>
                                    Enquire about current course options, provider
                                    information and applicable requirements.
                                </p>
                            </div>
                        </div>

                        <button
                            className="auta-button auta-button-primary"
                            type="button"
                            onClick={() => openEnquiry()}
                        >
                            Start an enquiry <HiArrowRight />
                        </button>
                    </div>
                </div>
            </section>

            {/* REFUND INFORMATION */}
            <section className="auta-refund-section">
                <div className="auta-container auta-refund-panel">
                    <span className="auta-refund-icon">
                        <HiOutlineShieldCheck />
                    </span>

                    <div>
                        <span className="auta-eyebrow">
                            IMPORTANT INFORMATION
                        </span>

                        <h2>Understand the refund terms.</h2>

                        <p>
                            Any refund following a visa refusal depends on the
                            education provider's written refund policy and your
                            agreement. Review the applicable policy before paying.
                            Never assume a refund is automatic or unconditional.
                        </p>
                    </div>

                    <button
                        className="auta-button auta-button-secondary"
                        type="button"
                        onClick={() => openEnquiry()}
                    >
                        Ask about refund terms
                    </button>
                </div>
            </section>

            {/* FAQ */}
            <section className="auta-faq-section">
                <div className="auta-container auta-faq-layout">
                    <div className="auta-faq-heading">
                        <span className="auta-eyebrow">
                            COMMON QUESTIONS
                        </span>

                        <h2>What should you know?</h2>

                        <p>
                            Review these answers, then ask our team to confirm
                            the details that apply to your selected programme.
                        </p>

                        <button
                            className="auta-button auta-button-primary"
                            type="button"
                            onClick={() => openEnquiry()}
                        >
                            Ask a question <HiArrowRight />
                        </button>
                    </div>

                    <div className="auta-faq-list">
                        {FAQS.map((faq, index) => (
                            <article
                                className={`auta-faq-item ${openFaq === index ? "is-open" : ""
                                    }`}
                                key={faq.question}
                            >
                                <button
                                    className="auta-faq-question"
                                    type="button"
                                    aria-expanded={openFaq === index}
                                    onClick={() =>
                                        setOpenFaq(openFaq === index ? -1 : index)
                                    }
                                >
                                    <span>{faq.question}</span>
                                    <HiChevronDown />
                                </button>

                                {openFaq === index && (
                                    <div className="auta-faq-answer">
                                        <p>{faq.answer}</p>
                                    </div>
                                )}
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* FINAL CTA */}
            <section className="auta-final-cta">
                <div className="auta-container auta-final-cta-inner">
                    <div>
                        <span className="auta-eyebrow auta-eyebrow-light">
                            YOUR NEXT STEP STARTS HERE
                        </span>

                        <h2>Let's clarify your options.</h2>

                        <p>
                            Tell us which training area interests you. We'll prepare
                            an enquiry so you can request the latest programme
                            information.
                        </p>
                    </div>

                    <button
                        className="auta-button auta-button-primary"
                        type="button"
                        onClick={() => openEnquiry()}
                    >
                        Enquire now <HiArrowRight />
                    </button>
                </div>
            </section>

            {/* CONTACT */}
            <section className="auta-contact-strip">
                <div className="auta-container auta-contact-grid">
                    <div>
                        <HiGlobeAlt />
                        <span>
                            <strong>Destination</strong>
                            <small>Australia</small>
                        </span>
                    </div>

                    <div>
                        <HiEnvelope />
                        <span>
                            <strong>Email</strong>
                            <small>admin@colossusmigration.com</small>
                        </span>
                    </div>

                    <div>
                        <HiOutlineChatBubbleLeftRight />
                        <span>
                            <strong>WhatsApp</strong>
                            <small>+234 703 520 9306</small>
                        </span>
                    </div>
                </div>
            </section>

            {/* DISCLAIMER */}
            <footer className="auta-legal">
                <div className="auta-container">
                    Colossus Migration &amp; Tours provides guidance and application
                    support. Programme availability, duration, fees and conditions
                    may change. Stipends are not guaranteed unless confirmed in
                    writing by the responsible provider. Training does not
                    guarantee admission, a visa, employment or permanent residency.
                    Confirm details with the provider and relevant authorities
                    before making payments or commitments.
                </div>
            </footer>

            {showEnquiry && (
                <EnquiryModal
                    selectedProgramme={selectedProgramme}
                    onClose={() => setShowEnquiry(false)}
                    onContinue={handleEnquiryContinue}
                />
            )}

            {showPostEnquiry && (
                <PostEnquiryModal
                    onClose={() => setShowPostEnquiry(false)}
                />
            )}
        </main>
    );
}