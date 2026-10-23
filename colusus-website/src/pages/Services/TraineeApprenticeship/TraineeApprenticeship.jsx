import React, { useMemo, useState } from "react";
import {
  HiArrowRight,
  HiCheckCircle,
  HiChevronDown,
  HiClock,
  HiCurrencyDollar,
  HiGlobeAlt,
  HiMagnifyingGlass,
  HiMapPin,
  HiOutlineAcademicCap,
  HiOutlineBriefcase,
  HiOutlineBuildingLibrary,
  HiOutlineCalendarDays,
  HiOutlineChatBubbleLeftRight,
  HiOutlineClipboardDocumentCheck,
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiOutlineShieldCheck,
  HiXMark,
} from "react-icons/hi2";

import "./TraineeApprenticeship.css";
import studentHero from "../../../assets/trainee-apprenticeship-student.png";

/* =========================================================
   PROGRAMME DATA
========================================================= */

const PROGRAMS = [
  {
    id: "au-light-vehicle",
    country: "Australia",
    category: "Automotive",
    title: "Certificate III in Light Vehicle Mechanical Technology",
    duration: "78 weeks",
    tuition: "AUD 16,800",
    materials: "AUD 900",
    campus: "Western Australia (WA)",
    intakes: "2027 intakes; confirm availability",
    description:
      "Develop practical foundational skills for working with light vehicle mechanical systems, servicing and repair.",
    highlights: [
      "Practical automotive training",
      "Mechanical servicing and repair",
      "For students interested in vehicle technology",
    ],
  },
  {
    id: "au-automotive-diagnosis",
    country: "Australia",
    category: "Automotive",
    title: "Certificate IV in Automotive Mechanical Diagnosis",
    duration: "26 weeks",
    tuition: "AUD 5,800",
    materials: "AUD 500",
    campus: "Western Australia (WA)",
    intakes: "Confirm available intake",
    description:
      "Build on automotive knowledge with a focus on identifying and diagnosing mechanical system issues.",
    highlights: [
      "Automotive diagnostic skills",
      "Problem-solving and fault identification",
      "Progression-focused training",
    ],
  },
  {
    id: "au-automotive-management",
    country: "Australia",
    category: "Business",
    title: "Diploma of Automotive Management",
    duration: "26 weeks",
    tuition: "AUD 5,800",
    materials: "AUD 500",
    campus: "Western Australia (WA)",
    intakes: "Confirm available intake",
    description:
      "Explore management practices relevant to automotive businesses and service operations.",
    highlights: [
      "Business and operations concepts",
      "Automotive industry context",
      "Management-focused learning",
    ],
  },
  {
    id: "au-business",
    country: "Australia",
    category: "Business",
    title: "Diploma of Business",
    duration: "52 weeks",
    tuition: "AUD 8,800",
    materials: "AUD 300",
    campus: "Western Australia (WA)",
    intakes: "2027 intakes; confirm availability",
    description:
      "Build business knowledge across workplace operations, planning, communication and team coordination.",
    highlights: [
      "Business operations",
      "Planning and communication",
      "Useful across a range of industries",
    ],
  },
  {
    id: "au-management-learning",
    country: "Australia",
    category: "Business",
    title: "Graduate Diploma of Management (Learning)",
    duration: "104 weeks",
    tuition: "AUD 19,800",
    materials: "AUD 300",
    campus: "Western Australia (WA)",
    intakes: "Confirm available intake",
    description:
      "Explore advanced management and learning-related practices for organisational environments.",
    highlights: [
      "Leadership and management",
      "Learning and development focus",
      "Longer-form qualification",
    ],
  },
  {
    id: "au-construction",
    country: "Australia",
    category: "Construction",
    title: "Certificate III in Construction",
    duration: "104 weeks",
    tuition: "AUD 24,800",
    materials: "AUD 2,000",
    campus: "Western Australia (WA)",
    intakes: "Confirm available intake",
    description:
      "A construction pathway for students who want to develop industry-related knowledge and practical skills.",
    highlights: [
      "Construction-focused training",
      "Practical learning pathway",
      "Course requirements should be confirmed",
    ],
  },
  {
    id: "au-individual-support",
    country: "Australia",
    category: "Aged Care",
    title: "Certificate III in Individual Support (Ageing)",
    duration: "Confirm with provider",
    tuition: "AUD 11,240",
    materials: "Confirm with provider",
    campus: "Western Australia (WA)",
    intakes: "February and July 2027",
    description:
      "Prepare for support work with older people in appropriate care and community settings.",
    highlights: [
      "Ageing support fundamentals",
      "Care and support practices",
      "February and July 2027 intakes listed",
    ],
  },
  {
    id: "au-ageing-support",
    country: "Australia",
    category: "Aged Care",
    title: "Certificate IV in Ageing Support",
    duration: "1 year",
    tuition: "AUD 13,725–15,784",
    materials: "Confirm with provider",
    campus: "Western Australia (WA)",
    intakes: "February and July 2027",
    description:
      "Develop skills relevant to supporting older people and coordinating care in different settings.",
    highlights: [
      "Aged care support",
      "Community and residential care pathways",
      "Duration listed as one year",
    ],
    careers: [
      "Aged care worker",
      "Community care worker",
      "Direct care worker",
      "Home care support worker",
      "Personal care worker",
      "Residential care worker",
    ],
  },
  {
    id: "au-cyber-cloud",
    country: "Australia",
    category: "Information Technology",
    title: "Diploma of IT (Cyber Security and Cloud Architecture)",
    duration: "6 months",
    tuition: "AUD 16,200–16,690",
    materials: "Confirm with provider",
    campus: "Western Australia (WA)",
    intakes: "Confirm available intake",
    description:
      "Explore IT projects, websites, virtual networks, cyber security and cloud-related concepts.",
    highlights: [
      "IT project and network concepts",
      "Cyber security and cloud architecture",
      "Course-specific entry requirements apply",
    ],
    careers: [
      "Entry-level programmer",
      "Web developer",
      "Level 2 network support",
    ],
  },
  {
    id: "nz-health-wellbeing",
    country: "New Zealand",
    category: "Healthcare",
    title:
      "New Zealand Diploma in Health and Wellbeing (Applied Practice – Ageing and Disability Support)",
    duration: "44 weeks (40 teaching weeks + 4-week break)",
    tuition: "NZD 18,946",
    materials: "Confirm with provider",
    campus: "New Zealand",
    intakes: "Confirm available intake",
    description:
      "A face-to-face programme focused on applied practice in ageing and disability support.",
    highlights: [
      "Face-to-face classes 3 days per week",
      "Class hours listed as 9:00am–4:30pm",
      "Clinical placement details must be confirmed with the provider",
    ],
  },
];

const CATEGORIES = [
  "All programmes",
  "Automotive",
  "Business",
  "Construction",
  "Aged Care",
  "Information Technology",
  "Healthcare",
];

const FAQS = [
  {
    question: "Does enrolment guarantee a visa or a job?",
    answer:
      "No. Admission, enrolment and visa decisions are made by the relevant education provider and immigration authorities. Employment is not guaranteed.",
  },
  {
    question: "What is required to start an Australian application?",
    answer:
      "The stated initial payment includes a non-refundable AUD 230 enrolment fee, applicable resource fees and the first-term payment, listed as 30% of training fees. The provider must confirm the exact invoice and payment instructions.",
  },
  {
    question: "Can I pay in instalments?",
    answer:
      "Instalment payments are accepted for the listed Australian pathway, subject to the provider’s terms. The New Zealand programme requires full payment according to the information supplied to Colossus.",
  },
  {
    question: "Are all programmes available at every campus?",
    answer:
      "No. The initial Australian group is limited to the Western Australia campus. Availability, campus, entry requirements and intake dates should be confirmed before applying.",
  },
  {
    question: "What happens after I submit an enquiry?",
    answer:
      "The Colossus team can discuss your preferred programme, explain the next steps and help you identify the documents the provider may require. An enquiry is not an offer of admission.",
  },
];

/* =========================================================
   PROGRAMME CARD
========================================================= */

function ProgramCard({ program, onEnquire }) {
  return (
    <article className="ta-program-card">
      <div className="ta-card-topline">
        <span className="ta-category-pill">{program.category}</span>

        <span className="ta-country">
          <HiGlobeAlt />
          {program.country}
        </span>
      </div>

      <h3>{program.title}</h3>

      <p className="ta-program-description">{program.description}</p>

      <div className="ta-program-facts">
        <div>
          <HiClock />
          <span>
            <small>Duration</small>
            <strong>{program.duration}</strong>
          </span>
        </div>

        <div>
          <HiMapPin />
          <span>
            <small>Location</small>
            <strong>{program.campus}</strong>
          </span>
        </div>

        <div>
          <HiCurrencyDollar />
          <span>
            <small>Tuition</small>
            <strong>{program.tuition}</strong>
          </span>
        </div>
      </div>

      <div className="ta-card-details">
        <h4>Programme highlights</h4>

        <ul>
          {program.highlights.map((item) => (
            <li key={item}>
              <HiCheckCircle />
              {item}
            </li>
          ))}
        </ul>

        {program.careers?.length > 0 && (
          <>
            <h4>Possible career pathways</h4>

            <div className="ta-career-tags">
              {program.careers.map((career) => (
                <span key={career}>{career}</span>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="ta-card-bottom">
        <div className="ta-materials">
          <span>Materials / resources</span>
          <strong>{program.materials}</strong>
        </div>

        <div className="ta-intake">
          <HiOutlineCalendarDays />
          <span>{program.intakes}</span>
        </div>

        <button
          type="button"
          className="ta-button ta-button-primary ta-card-button"
          onClick={() => onEnquire(program)}
        >
          Enquire about programme <HiArrowRight />
        </button>
      </div>
    </article>
  );
}

/* =========================================================
   ENQUIRY MODAL
========================================================= */

function EnquiryModal({ program, onClose }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [error, setError] = useState("");

  if (!program) return null;

  function updateForm(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      setError("Please complete your name, email and phone number.");
      return;
    }

    const subject = encodeURIComponent(
      `Programme enquiry: ${program.title}`
    );

    const body = encodeURIComponent(
      `Programme: ${program.title}\n` +
        `Destination: ${program.country}\n` +
        `Name: ${form.name}\n` +
        `Email: ${form.email}\n` +
        `Phone: ${form.phone}\n` +
        `Message: ${
          form.message || "Please contact me with more information."
        }`
    );

    window.location.href =
      `mailto:admin@colossusmigration.com?subject=${subject}&body=${body}`;
  }

  return (
    <div
      className="ta-modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="ta-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ta-modal-title"
      >
        <button
          type="button"
          className="ta-modal-close"
          onClick={onClose}
          aria-label="Close enquiry form"
        >
          <HiXMark />
        </button>

        <span className="ta-eyebrow">PROGRAMME ENQUIRY</span>

        <h2 id="ta-modal-title">
          Let’s discuss your study pathway.
        </h2>

        <p className="ta-modal-program">
          {program.title} · {program.country}
        </p>

        <form onSubmit={handleSubmit}>
          <label>
            Full name
            <input
              name="name"
              value={form.name}
              onChange={updateForm}
              autoComplete="name"
              required
            />
          </label>

          <label>
            Email address
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={updateForm}
              autoComplete="email"
              required
            />
          </label>

          <label>
            Phone / WhatsApp
            <input
              name="phone"
              value={form.phone}
              onChange={updateForm}
              autoComplete="tel"
              required
            />
          </label>

          <label>
            What would you like to know?
            <textarea
              name="message"
              rows="3"
              value={form.message}
              onChange={updateForm}
              placeholder="Tell us about your questions or preferred intake."
            />
          </label>

          {error && <p className="ta-form-error">{error}</p>}

          <button
            type="submit"
            className="ta-button ta-button-primary ta-submit"
          >
            Prepare email enquiry <HiArrowRight />
          </button>

          <p className="ta-form-note">
            This opens your email application. Your enquiry is not submitted
            to a website database.
          </p>
        </form>
      </section>
    </div>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function TraineeApprenticeship() {
  const [destination, setDestination] = useState("All destinations");
  const [category, setCategory] = useState("All programmes");
  const [search, setSearch] = useState("");
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [openFaq, setOpenFaq] = useState(0);

  const filteredPrograms = useMemo(() => {
    const query = search.trim().toLowerCase();

    return PROGRAMS.filter((program) => {
      const matchesDestination =
        destination === "All destinations" ||
        program.country === destination;

      const matchesCategory =
        category === "All programmes" ||
        program.category === category;

      const searchableContent = [
        program.title,
        program.category,
        program.country,
        program.description,
        ...(program.highlights || []),
        ...(program.careers || []),
      ]
        .join(" ")
        .toLowerCase();

      return (
        matchesDestination &&
        matchesCategory &&
        (!query || searchableContent.includes(query))
      );
    });
  }, [destination, category, search]);

  function resetFilters() {
    setDestination("All destinations");
    setCategory("All programmes");
    setSearch("");
  }

  return (
    <main className="ta-page">
      {/* HERO */}
      <section
        className="ta-hero"
        style={{ "--ta-hero-image": `url(${studentHero})` }}
      >
        <div className="ta-hero-overlay" />

        <div className="ta-container ta-hero-grid">
          <div className="ta-hero-copy">
            <span className="ta-eyebrow ta-eyebrow-light">
              <span />
              INTERNATIONAL STUDY & SKILLS PATHWAYS
            </span>

            <h1>
              Build skills.
              <br />
              <em>Open new pathways.</em>
            </h1>

            <p>
              Explore vocational, technical, business and care programmes in
              Australia and New Zealand with guidance from Colossus Migration
              & Tours.
            </p>

            <div className="ta-hero-actions">
              <a className="ta-button ta-button-gold" href="#ta-programmes">
                Explore programmes <HiArrowRight />
              </a>

              <a
                className="ta-button ta-button-outline"
                href="#ta-how-it-works"
              >
                How it works
              </a>
            </div>

            <div className="ta-hero-trust">
              <span>
                <HiCheckCircle /> Programme information in one place
              </span>

              <span>
                <HiCheckCircle /> Guidance on next steps
              </span>
            </div>
          </div>

          <div className="ta-hero-panel">
            <div className="ta-panel-orbit">
              <HiOutlineAcademicCap />
            </div>

            <span className="ta-panel-kicker">YOUR NEXT CHAPTER</span>

            <h2>Choose a pathway that fits your goals.</h2>

            <p>
              Compare programme areas, published fees and durations before
              speaking with our team.
            </p>

            <div className="ta-panel-destinations">
              <div>
                <span className="ta-destination-icon">AU</span>

                <span>
                  <strong>Australia</strong>
                  <small>
                    Western Australia campus for the initial group
                  </small>
                </span>
              </div>

              <div>
                <span className="ta-destination-icon ta-nz-icon">NZ</span>

                <span>
                  <strong>New Zealand</strong>
                  <small>Health and wellbeing pathway</small>
                </span>
              </div>
            </div>

            <a href="#ta-programmes" className="ta-panel-link">
              Browse available programmes <HiArrowRight />
            </a>
          </div>
        </div>

        <div className="ta-hero-bottom">
          <span>COLOSSUS MIGRATION & TOURS</span>
          <span>LEARN · PREPARE · PROGRESS</span>
        </div>
      </section>

      {/* INTRODUCTION */}
      <section className="ta-intro-section">
        <div className="ta-container ta-intro-grid">
          <div>
            <span className="ta-eyebrow">A CLEARER START</span>
            <h2>Make an informed choice about your next step.</h2>
          </div>

          <p>
            Choosing a programme is a big decision. Use this catalogue to
            review the course information currently available, compare
            pathways and ask questions before you begin an application.
          </p>
        </div>

        <div className="ta-container ta-benefits">
          <div>
            <span className="ta-benefit-icon">
              <HiOutlineClipboardDocumentCheck />
            </span>
            <h3>Compare programmes</h3>
            <p>Review listed fees, durations, locations and intakes.</p>
          </div>

          <div>
            <span className="ta-benefit-icon">
              <HiOutlineChatBubbleLeftRight />
            </span>
            <h3>Ask questions</h3>
            <p>
              Tell our team which course and destination you are considering.
            </p>
          </div>

          <div>
            <span className="ta-benefit-icon">
              <HiOutlineShieldCheck />
            </span>
            <h3>Understand the steps</h3>
            <p>
              Confirm entry requirements and costs with the education provider.
            </p>
          </div>
        </div>
      </section>

      {/* PROGRAMME CATALOGUE */}
      <section className="ta-catalogue-section" id="ta-programmes">
        <div className="ta-container">
          <div className="ta-section-heading">
            <div>
              <span className="ta-eyebrow">PROGRAMME CATALOGUE</span>
              <h2>Find your pathway.</h2>
              <p>
                Explore the course options shared with Colossus. Fees and
                availability should be reconfirmed before applying.
              </p>
            </div>

            <div className="ta-catalogue-count">
              <strong>
                {filteredPrograms.length.toString().padStart(2, "0")}
              </strong>
              <span>programmes shown</span>
            </div>
          </div>

          <div className="ta-filter-panel">
            <label className="ta-search-field">
              <HiMagnifyingGlass />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search courses, skills or career paths..."
                aria-label="Search programmes"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                >
                  <HiXMark />
                </button>
              )}
            </label>

            <label className="ta-select-field">
              <span>Destination</span>

              <select
                value={destination}
                onChange={(event) => setDestination(event.target.value)}
              >
                <option>All destinations</option>
                <option>Australia</option>
                <option>New Zealand</option>
              </select>

              <HiChevronDown />
            </label>

            <label className="ta-select-field">
              <span>Study area</span>

              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                {CATEGORIES.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>

              <HiChevronDown />
            </label>
          </div>

          {filteredPrograms.length > 0 ? (
            <div className="ta-program-grid">
              {filteredPrograms.map((program) => (
                <ProgramCard
                  key={program.id}
                  program={program}
                  onEnquire={setSelectedProgram}
                />
              ))}
            </div>
          ) : (
            <div className="ta-empty-state">
              <HiMagnifyingGlass />
              <h3>No matching programmes found</h3>
              <p>Try a different search term or reset the filters.</p>

              <button
                type="button"
                className="ta-button ta-button-primary"
                onClick={resetFilters}
              >
                Reset filters
              </button>
            </div>
          )}

          <p className="ta-catalogue-disclaimer">
            Programme details are based on information currently available to
            Colossus and may change. Final fees, course duration, campus, entry
            requirements and intake availability must be confirmed by the
            provider.
          </p>
        </div>
      </section>

      {/* PAYMENT */}
      <section className="ta-payment-section">
        <div className="ta-container">
          <div className="ta-section-heading ta-heading-light">
            <div>
              <span className="ta-eyebrow ta-eyebrow-light">
                PAYMENT OVERVIEW
              </span>
              <h2>Know the payment structure.</h2>
              <p>
                Payment rules differ by destination. Confirm your individual
                invoice before making a payment.
              </p>
            </div>
          </div>

          <div className="ta-payment-grid">
            <article className="ta-payment-card">
              <span className="ta-payment-country">AUSTRALIA</span>
              <h3>Initial payment</h3>

              <p className="ta-payment-big">
                AUD 230 <small>enrolment fee</small>
              </p>

              <p>
                The stated initial payment also includes applicable resource
                fees and the first-term payment, listed as 30% of training fees.
              </p>

              <ul>
                <li>
                  <HiCheckCircle /> Enrolment fee is non-refundable
                </li>
                <li>
                  <HiCheckCircle /> Instalment payments are accepted, subject
                  to provider terms
                </li>
                <li>
                  <HiCheckCircle /> Payment and documents are used for the
                  provider’s enrolment process
                </li>
              </ul>
            </article>

            <article className="ta-payment-card ta-payment-card-featured">
              <span className="ta-payment-country">NEW ZEALAND</span>
              <h3>Full payment</h3>

              <p className="ta-payment-big">
                NZD 18,946 <small>listed tuition</small>
              </p>

              <p>
                The supplied information states that the New Zealand programme
                requires full payment.
              </p>

              <ul>
                <li>
                  <HiCheckCircle /> Confirm the current invoice with the
                  provider
                </li>
                <li>
                  <HiCheckCircle /> Ask about included and additional costs
                </li>
                <li>
                  <HiCheckCircle /> Confirm payment deadlines before proceeding
                </li>
              </ul>
            </article>
          </div>

          <p className="ta-payment-note">
            Do not transfer funds based only on this page. Request and verify
            official payment instructions and a provider-issued invoice first.
          </p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="ta-process-section" id="ta-how-it-works">
        <div className="ta-container">
          <div className="ta-section-heading">
            <div>
              <span className="ta-eyebrow">HOW IT WORKS</span>
              <h2>Four steps to get started.</h2>
              <p>
                Our team can help you understand the process. Admission and
                visa decisions remain with the relevant institutions and
                authorities.
              </p>
            </div>
          </div>

          <div className="ta-process-grid">
            <div className="ta-process-step">
              <span>01</span>
              <HiOutlineChatBubbleLeftRight />
              <h3>Share your goals</h3>
              <p>
                Tell us your preferred destination, programme and intended
                intake.
              </p>
            </div>

            <div className="ta-process-step">
              <span>02</span>
              <HiOutlineClipboardDocumentCheck />
              <h3>Review eligibility</h3>
              <p>
                Check the provider’s entry criteria, documents and English
                requirements.
              </p>
            </div>

            <div className="ta-process-step">
              <span>03</span>
              <HiOutlineBuildingLibrary />
              <h3>Confirm the details</h3>
              <p>
                Verify fees, course availability, campus and payment
                conditions.
              </p>
            </div>

            <div className="ta-process-step">
              <span>04</span>
              <HiOutlineBriefcase />
              <h3>Prepare your application</h3>
              <p>
                Follow the provider’s instructions and keep copies of all
                documents.
              </p>
            </div>
          </div>

          <div className="ta-process-callout">
            <div>
              <strong>Not sure which course fits?</strong>
              <p>
                Talk to the Colossus team before deciding on a programme.
              </p>
            </div>

            <a
              className="ta-button ta-button-primary"
              href="https://wa.me/2347035209306"
              target="_blank"
              rel="noreferrer"
            >
              Talk to an adviser <HiArrowRight />
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="ta-faq-section">
        <div className="ta-container ta-faq-layout">
          <div className="ta-faq-intro">
            <span className="ta-eyebrow">GOOD TO KNOW</span>
            <h2>Questions before you begin?</h2>
            <p>
              Here are a few important points to review before you commit to a
              course or payment.
            </p>

            <a href="mailto:admin@colossusmigration.com">
              Email our team <HiArrowRight />
            </a>
          </div>

          <div className="ta-faq-list">
            {FAQS.map((faq, index) => (
              <article
                className={`ta-faq-item ${
                  openFaq === index ? "is-open" : ""
                }`}
                key={faq.question}
              >
                <button
                  type="button"
                  onClick={() =>
                    setOpenFaq(openFaq === index ? -1 : index)
                  }
                  aria-expanded={openFaq === index}
                >
                  <span>{faq.question}</span>
                  <HiChevronDown />
                </button>

                {openFaq === index && <p>{faq.answer}</p>}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="ta-final-cta">
        <div className="ta-container ta-final-cta-inner">
          <div>
            <span className="ta-eyebrow ta-eyebrow-light">
              YOUR NEXT STEP STARTS HERE
            </span>

            <h2>Let’s talk about your study plans.</h2>

            <p>
              Share the destination and programme you’re interested in. We’ll
              help you understand what to confirm next.
            </p>
          </div>

          <div className="ta-final-actions">
            <a
              className="ta-button ta-button-gold"
              href="https://wa.me/2347035209306"
              target="_blank"
              rel="noreferrer"
            >
              <HiOutlineChatBubbleLeftRight /> Chat on WhatsApp
            </a>

            <a
              className="ta-button ta-button-outline"
              href="mailto:admin@colossusmigration.com"
            >
              <HiOutlineEnvelope /> Send an email
            </a>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="ta-contact-strip">
        <div className="ta-container ta-contact-inner">
          <div>
            <HiMapPin />
            <span>
              <strong>Visit us</strong>
              <small>
                Plot 16, Lateef Jakande Road, Agidingbi Bus Stop, Ikeja, Lagos,
                Nigeria
              </small>
            </span>
          </div>

          <div>
            <HiOutlinePhone />
            <span>
              <strong>Call us</strong>
              <small>
                +234 703 520 9306 · +234 902 695 3513 · +44 7455 674027
              </small>
            </span>
          </div>

          <div>
            <HiOutlineEnvelope />
            <span>
              <strong>Email us</strong>
              <small>admin@colossusmigration.com</small>
            </span>
          </div>
        </div>
      </section>

      <div className="ta-legal-note">
        <div className="ta-container">
          Colossus Migration & Tours provides guidance and application support.
          Programme information may change. No admission, visa approval,
          employment or migration outcome is guaranteed. Always confirm details
          directly with the education provider and relevant authorities.
        </div>
      </div>

      <EnquiryModal
        program={selectedProgram}
        onClose={() => setSelectedProgram(null)}
      />
    </main>
  );
}