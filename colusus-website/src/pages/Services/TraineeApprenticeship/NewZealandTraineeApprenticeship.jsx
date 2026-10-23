import React, { useState } from "react";
import {
    HiArrowLeft,
    HiArrowRight,
    HiCheckCircle,
    HiChevronDown,
    HiClipboardDocumentCheck,
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
import "./NewZealandTraineeApprenticeship.css";

const PROGRAMMES = [
    {
        id: "trades-construction",
        title: "Trades & Construction",
        description:
            "Explore vocational pathways related to practical trades, construction and site-based skills.",
        icon: HiOutlineBriefcase,
        duration: "Confirm with provider",
    },
    {
        id: "automotive-technical",
        title: "Automotive & Technical",
        description:
            "Explore training options focused on automotive work and technical skills.",
        icon: HiOutlineShieldCheck,
        duration: "Confirm with provider",
    },
    {
        id: "hospitality-culinary",
        title: "Hospitality & Culinary",
        description:
            "Review potential training pathways in hospitality, food preparation and culinary services.",
        icon: HiOutlineUserGroup,
        duration: "Confirm with provider",
    },
    {
        id: "healthcare-care-support",
        title: "Healthcare & Care Support",
        description:
            "Explore health, wellbeing and care-support training options where available.",
        icon: HiOutlineAcademicCap,
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
            "Confirm the available course, provider, duration, entry requirements and applicable fees.",
    },
    {
        number: "03",
        title: "Prepare your documents",
        description:
            "Follow the confirmed provider and application instructions for the documents required.",
    },
    {
        number: "04",
        title: "Submit your application",
        description:
            "Proceed only after the programme details, eligibility criteria and terms have been explained.",
    },
    {
        number: "05",
        title: "Confirm your next steps",
        description:
            "Review the provider's decision and obtain official guidance on any relevant visa process.",
    },
];

const FAQS = [
    {
        question: "When is the next intake?",
        answer:
            "The programme information shared with us refers to a January–March 2027 intake window. Availability and deadlines must be confirmed for the specific programme and provider.",
    },
    {
        question: "How long do the programmes last?",
        answer:
            "Indicative durations shared for these opportunities range from approximately 6 to 18 months. The duration depends on the specific programme and must be confirmed with the provider.",
    },
    {
        question: "Is a monthly stipend guaranteed?",
        answer:
            "A proposed range of NZD 2,000–3,000 per month has been mentioned in the programme information available to us. It should not be treated as guaranteed income. Ask for written confirmation of eligibility, conditions, payment arrangements and whether it applies to your selected programme.",
    },
    {
        question: "Will I automatically receive a visa or a job?",
        answer:
            "No. Training, an application or an enquiry does not guarantee admission, a visa, employment, a stipend or permanent residency. Visa decisions are made by the relevant authorities.",
    },
    {
        question: "What happens if my visa is refused?",
        answer:
            "Any refund depends on the education provider's written refund policy and the terms of your agreement. Obtain and review those terms before making a payment.",
    },
    {
        question: "How do I confirm the exact fees and requirements?",
        answer:
            "Send an enquiry to the Colossus team. Ask for the specific provider, course details, entry criteria, full cost breakdown, refund conditions and any stipend terms in writing before committing.",
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

function EnquiryModal({ onClose, onContinue }) {
    const [form, setForm] = useState(INITIAL_FORM);
    const [error, setError] = useState("");

    const updateField = (event) => {
        setForm((current) => ({
            ...current,
            [event.target.name]: event.target.value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setError("");

        if (!form.fullName.trim() || !form.email.trim() || !form.programme) {
            setError("Please provide your name, email address and programme interest.");
            return;
        }

        const subject = encodeURIComponent(
            `New Zealand Training Enquiry — ${form.programme}`
        );

        const body = encodeURIComponent(
            [
                "Hello Colossus Migration & Tours,",
                "",
                "I would like to enquire about the New Zealand trainee/apprenticeship-style training opportunities.",
                "",
                `Full name: ${form.fullName.trim()}`,
                `Email: ${form.email.trim()}`,
                `Phone/WhatsApp: ${form.phone.trim() || "Not provided"}`,
                `Programme interest: ${form.programme}`,
                `Education/background: ${form.education.trim() || "Not provided"}`,
                "",
                `Questions or additional information: ${form.message.trim() || "Please share the current programme details, eligibility requirements, full fees, duration, intake availability and any applicable stipend conditions."}`,
                "",
                "Please confirm the programme details and applicable terms in writing.",
            ].join("\n")
        );

        const mailto = `mailto:admin@colossusmigration.com?subject=${subject}&body=${body}`;

        // Open the user's configured email application. This does not send the email automatically.
        window.location.href = mailto;
        onContinue();
    };

    return (
        <div className="nzta-modal-backdrop" onMouseDown={onClose}>
            <section
                className="nzta-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="nzta-enquiry-title"
                onMouseDown={(event) => event.stopPropagation()}
            >
                <button
                    className="nzta-modal-close"
                    type="button"
                    onClick={onClose}
                    aria-label="Close enquiry form"
                >
                    <HiXMark />
                </button>

                <span className="nzta-modal-kicker">NEW ZEALAND PATHWAYS</span>
                <h2 id="nzta-enquiry-title">Tell us what you're looking for.</h2>
                <p className="nzta-modal-intro">
                    Complete this short form to prepare an enquiry email for our team.
                    Your email application will open so you can review and send it.
                </p>

                <form className="nzta-enquiry-form" onSubmit={handleSubmit}>
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

                    <div className="nzta-form-row">
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
                                <option key={programme.id} value={programme.title}>
                                    {programme.title}
                                </option>
                            ))}
                            <option value="Not sure yet">I'm not sure yet</option>
                        </select>
                    </label>

                    <label>
                        Education or work background
                        <input
                            name="education"
                            value={form.education}
                            onChange={updateField}
                            placeholder="e.g. secondary school, graduate, work experience"
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

                    {error && <p className="nzta-form-error">{error}</p>}

                    <p className="nzta-form-disclaimer">
                        This form prepares an email; it does not submit information to a
                        Colossus database or send an email automatically.
                    </p>

                    <button className="nzta-button nzta-button-primary" type="submit">
                        Continue to email <HiArrowRight />
                    </button>
                </form>
            </section>
        </div>
    );
}

function PostEnquiryModal({ onClose }) {
    return (
        <div className="nzta-modal-backdrop" onMouseDown={onClose}>
            <section
                className="nzta-modal nzta-post-enquiry"
                role="dialog"
                aria-modal="true"
                aria-labelledby="nzta-post-title"
                onMouseDown={(event) => event.stopPropagation()}
            >
                <button
                    className="nzta-modal-close"
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                >
                    <HiXMark />
                </button>

                <span className="nzta-success-icon">
                    <HiEnvelope />
                </span>
                <span className="nzta-modal-kicker">ONE MORE STEP</span>
                <h2 id="nzta-post-title">Your enquiry email is ready.</h2>
                <p className="nzta-modal-intro">
                    Your email application should have opened with your enquiry prepared.
                    Review the message and press Send in your email application. It has
                    not been sent automatically.
                </p>

                <div className="nzta-post-actions">
                    <a
                        className="nzta-button nzta-button-primary"
                        href="/services/trainee-apprenticeship"
                        onClick={onClose}
                    >
                        Explore other pathways <HiArrowRight />
                    </a>
                    <a
                        className="nzta-button nzta-button-secondary"
                        href="/register"
                        onClick={onClose}
                    >
                        Create an account <HiOutlineAcademicCap />
                    </a>
                    <button className="nzta-text-button" type="button" onClick={onClose}>
                        Stay on this page
                    </button>
                </div>
            </section>
        </div>
    );
}

export default function NewZealandTraineeApprenticeship() {
    const [showEnquiry, setShowEnquiry] = useState(false);
    const [showPostEnquiry, setShowPostEnquiry] = useState(false);
    const [openFaq, setOpenFaq] = useState(0);

    const openEnquiry = () => setShowEnquiry(true);

    const handleEnquiryContinue = () => {
        setShowEnquiry(false);
        setShowPostEnquiry(true);
    };

    return (
        <main className="nzta-page">
            {/* HERO */}
            <section className="nzta-hero">
                <div className="nzta-hero-grid-pattern" aria-hidden="true" />
                <div className="nzta-container nzta-hero-layout">
                    <div className="nzta-hero-copy">
                        <a
                            className="nzta-back-link"
                            href="/services/trainee-apprenticeship"
                        >
                            <HiArrowLeft /> All training destinations
                        </a>

                        <span className="nzta-eyebrow">
                            <span /> NEW ZEALAND · TRAINING PATHWAYS
                        </span>

                        <h1>
                            Build your skills.
                            <br />
                            <em>Explore what's next.</em>
                        </h1>

                        <p>
                            Explore vocational and career-focused training opportunities in
                            New Zealand. Review the available programme areas, then enquire
                            to confirm current courses, entry requirements and provider terms.
                        </p>

                        <div className="nzta-hero-actions">
                            <button
                                className="nzta-button nzta-button-primary"
                                type="button"
                                onClick={openEnquiry}
                            >
                                Enquire about programmes <HiArrowRight />
                            </button>
                            <a className="nzta-button nzta-button-ghost" href="#nzta-programmes">
                                Explore training areas
                            </a>
                        </div>

                        <div className="nzta-hero-trust">
                            <span><HiCheckCircle /> Programme-specific guidance</span>
                            <span><HiCheckCircle /> Requirements to be confirmed</span>
                        </div>
                    </div>

                    <aside className="nzta-hero-card">
                        <div className="nzta-hero-card-top">
                            <span className="nzta-country-mark">NZ</span>
                            <span className="nzta-status-pill">
                                <span /> INTAKE INFORMATION
                            </span>
                        </div>

                        <span className="nzta-card-label">INDICATIVE INTAKE WINDOW</span>
                        <h2>Jan – Mar <span>2027</span></h2>
                        <p>
                            The shared programme information references this intake window.
                            Availability and application deadlines must be confirmed.
                        </p>

                        <div className="nzta-card-divider" />

                        <div className="nzta-stat-row">
                            <span><HiClock /> Indicative duration</span>
                            <strong>6–18 months</strong>
                        </div>
                        <div className="nzta-stat-row">
                            <span><HiGlobeAlt /> Destination</span>
                            <strong>New Zealand</strong>
                        </div>

                        <small className="nzta-card-footnote">
                            Figures are indicative, not a guarantee of availability or eligibility.
                        </small>
                    </aside>
                </div>

                <div className="nzta-hero-footer">
                    <span>COLOSSUS MIGRATION & TOURS</span>
                    <span>EXPLORE · PREPARE · PROGRESS</span>
                </div>
            </section>

            {/* INTRODUCTION */}
            <section className="nzta-intro-section">
                <div className="nzta-container nzta-intro-grid">
                    <div>
                        <span className="nzta-eyebrow">ABOUT THE PATHWAYS</span>
                        <h2>Practical training starts with the right information.</h2>
                    </div>
                    <div className="nzta-intro-copy">
                        <p>
                            These opportunities cover several vocational and career-focused
                            areas. The exact course, education provider, fees, entry criteria
                            and any available support depend on the programme.
                        </p>
                        <p>
                            Use this page to identify your area of interest. Our team can help
                            you request the current programme information before you decide
                            whether to proceed.
                        </p>
                    </div>
                </div>
            </section>

            {/* PROGRAMMES */}
            <section className="nzta-programmes-section" id="nzta-programmes">
                <div className="nzta-container">
                    <div className="nzta-section-heading">
                        <div>
                            <span className="nzta-eyebrow">EXPLORE YOUR OPTIONS</span>
                            <h2>Training areas</h2>
                            <p>
                                Choose an area to discuss with the Colossus team. Availability
                                of individual courses must be confirmed.
                            </p>
                        </div>
                        <span className="nzta-heading-count">04 AREAS</span>
                    </div>

                    <div className="nzta-programme-grid">
                        {PROGRAMMES.map((programme, index) => {
                            const Icon = programme.icon;
                            return (
                                <article className="nzta-programme-card" key={programme.id}>
                                    <div className="nzta-programme-card-top">
                                        <span className="nzta-programme-number">
                                            {String(index + 1).padStart(2, "0")}
                                        </span>
                                        <span className="nzta-programme-icon"><Icon /></span>
                                    </div>
                                    <h3>{programme.title}</h3>
                                    <p>{programme.description}</p>
                                    <div className="nzta-programme-meta">
                                        <HiClock />
                                        <span>Duration: {programme.duration}</span>
                                    </div>
                                    <button
                                        className="nzta-inline-link"
                                        type="button"
                                        onClick={() => {
                                            setShowEnquiry(true);
                                        }}
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
            <section className="nzta-overview-section">
                <div className="nzta-container nzta-overview-grid">
                    <article className="nzta-overview-card nzta-duration-card">
                        <span className="nzta-overview-icon"><HiClock /></span>
                        <span className="nzta-overview-label">INDICATIVE PROGRAMME DURATION</span>
                        <h2>6–18 <small>months</small></h2>
                        <p>
                            Programme information shared with us mentions durations of
                            approximately 6, 12 or up to 18 months. Confirm the exact duration
                            for the selected course with its provider.
                        </p>
                    </article>

                    <article className="nzta-overview-card nzta-stipend-card">
                        <span className="nzta-overview-icon"><HiOutlineBriefcase /></span>
                        <span className="nzta-overview-label">PROPOSED STIPEND RANGE</span>
                        <h2>NZD 2,000–3,000 <small>/ month</small></h2>
                        <p>
                            This is an indicative range mentioned in the information available
                            to us, not guaranteed income. Ask for written confirmation of
                            eligibility, conditions, payment arrangements and whether it
                            applies to your programme.
                        </p>
                    </article>
                </div>
                <div className="nzta-container">
                    <p className="nzta-information-notice">
                        <HiOutlineShieldCheck />
                        <span>
                            <strong>Before making a decision:</strong> Request the provider's
                            official course information, full fees, stipend terms (if
                            applicable), eligibility criteria and refund policy in writing.
                            Do not rely on indicative figures alone.
                        </span>
                    </p>
                </div>
            </section>

            {/* ELIGIBILITY */}
            <section className="nzta-eligibility-section">
                <div className="nzta-container nzta-eligibility-grid">
                    <div className="nzta-eligibility-copy">
                        <span className="nzta-eyebrow">CHECK BEFORE APPLYING</span>
                        <h2>Confirm your eligibility first.</h2>
                        <p>
                            Entry requirements can vary by programme and education provider.
                            Before applying, request the exact criteria for your chosen course
                            and confirm that your education, experience and documents meet
                            those requirements.
                        </p>
                        <button
                            className="nzta-button nzta-button-primary"
                            type="button"
                            onClick={openEnquiry}
                        >
                            Ask about eligibility <HiArrowRight />
                        </button>
                    </div>

                    <div className="nzta-checklist">
                        {[
                            "Confirm the exact course and provider.",
                            "Request the official entry requirements.",
                            "Ask which academic and identity documents are needed.",
                            "Confirm the full cost and payment schedule.",
                            "Review stipend conditions, if applicable.",
                            "Read the written refund and cancellation terms.",
                        ].map((item) => (
                            <div className="nzta-checklist-item" key={item}>
                                <HiCheckCircle />
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* APPLICATION PROCESS */}
            <section className="nzta-process-section">
                <div className="nzta-container">
                    <div className="nzta-section-heading">
                        <div>
                            <span className="nzta-eyebrow">YOUR APPLICATION JOURNEY</span>
                            <h2>Five steps to get started.</h2>
                            <p>
                                A practical overview. The provider's official instructions take
                                precedence for the programme you choose.
                            </p>
                        </div>
                    </div>

                    <div className="nzta-process-grid">
                        {APPLICATION_STEPS.map((step) => (
                            <article className="nzta-process-step" key={step.number}>
                                <span className="nzta-step-number">{step.number}</span>
                                <h3>{step.title}</h3>
                                <p>{step.description}</p>
                            </article>
                        ))}
                    </div>

                    <div className="nzta-process-cta">
                        <div>
                            <HiOutlineDocumentText />
                            <div>
                                <h3>Need the programme details?</h3>
                                <p>
                                    Enquire for the current course options, provider information
                                    and applicable requirements.
                                </p>
                            </div>
                        </div>
                        <button
                            className="nzta-button nzta-button-primary"
                            type="button"
                            onClick={openEnquiry}
                        >
                            Start an enquiry <HiArrowRight />
                        </button>
                    </div>
                </div>
            </section>

            {/* REFUND INFORMATION */}
            <section className="nzta-refund-section">
                <div className="nzta-container nzta-refund-panel">
                    <span className="nzta-refund-icon"><HiOutlineShieldCheck /></span>
                    <div>
                        <span className="nzta-eyebrow">IMPORTANT INFORMATION</span>
                        <h2>Understand the refund terms.</h2>
                        <p>
                            Any refund following a visa refusal depends on the education
                            provider's written refund policy and the terms of your agreement.
                            Request, read and retain the applicable policy before paying.
                            Never assume a refund is automatic or unconditional.
                        </p>
                    </div>
                    <button
                        className="nzta-button nzta-button-secondary"
                        type="button"
                        onClick={openEnquiry}
                    >
                        Ask about refund terms
                    </button>
                </div>
            </section>

            {/* FAQ */}
            <section className="nzta-faq-section">
                <div className="nzta-container nzta-faq-layout">
                    <div className="nzta-faq-heading">
                        <span className="nzta-eyebrow">COMMON QUESTIONS</span>
                        <h2>What should you know?</h2>
                        <p>
                            Review these answers, then ask our team to confirm the details
                            that apply to your selected programme.
                        </p>
                        <button
                            className="nzta-button nzta-button-primary"
                            type="button"
                            onClick={openEnquiry}
                        >
                            Ask a question <HiArrowRight />
                        </button>
                    </div>

                    <div className="nzta-faq-list">
                        {FAQS.map((faq, index) => (
                            <article
                                className={`nzta-faq-item ${openFaq === index ? "is-open" : ""}`}
                                key={faq.question}
                            >
                                <button
                                    className="nzta-faq-question"
                                    type="button"
                                    aria-expanded={openFaq === index}
                                    onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                                >
                                    <span>{faq.question}</span>
                                    <HiChevronDown />
                                </button>
                                {openFaq === index && (
                                    <div className="nzta-faq-answer">
                                        <p>{faq.answer}</p>
                                    </div>
                                )}
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* FINAL CTA */}
            <section className="nzta-final-cta">
                <div className="nzta-container nzta-final-cta-inner">
                    <div>
                        <span className="nzta-eyebrow nzta-eyebrow-light">
                            YOUR NEXT STEP STARTS HERE
                        </span>
                        <h2>Let's clarify your options.</h2>
                        <p>
                            Tell us which training area interests you. We'll prepare an
                            enquiry so you can request the latest programme information.
                        </p>
                    </div>
                    <button
                        className="nzta-button nzta-button-primary"
                        type="button"
                        onClick={openEnquiry}
                    >
                        Enquire now <HiArrowRight />
                    </button>
                </div>
            </section>

            {/* CONTACT AND DISCLAIMER */}
            <section className="nzta-contact-strip">
                <div className="nzta-container nzta-contact-grid">
                    <div>
                        <HiGlobeAlt />
                        <span>
                            <strong>Destination</strong>
                            <small>New Zealand</small>
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

            <footer className="nzta-legal">
                <div className="nzta-container">
                    Colossus Migration & Tours provides guidance and application support.
                    Programme availability, duration, fees and conditions may change.
                    Stipends are not guaranteed unless confirmed in writing by the
                    responsible provider. Training does not guarantee admission, a visa,
                    employment or permanent residency. Confirm details with the provider
                    and relevant authorities before making payments or commitments.
                </div>
            </footer>

            {showEnquiry && (
                <EnquiryModal
                    onClose={() => setShowEnquiry(false)}
                    onContinue={handleEnquiryContinue}
                />
            )}

            {showPostEnquiry && (
                <PostEnquiryModal onClose={() => setShowPostEnquiry(false)} />
            )}
        </main>
    );
}
