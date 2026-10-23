import React from "react";
import {
  HiArrowRight,
  HiCheckCircle,
  HiGlobeAlt,
  HiOutlineAcademicCap,
  HiOutlineBriefcase,
  HiOutlineBuildingLibrary,
  HiOutlineChatBubbleLeftRight,
  HiOutlineShieldCheck,
} from "react-icons/hi2";

import "./TraineeApprenticeship.css";
import studentHero from "../../../assets/trainee-apprenticeship-student.png";

/**
 * Graduate Trainee & Apprenticeship hub
 *
 * This is the first page visitors land on. Country-specific programme pages
 * contain their own programme information and enquiry processes.
 */
const DESTINATIONS = [
  {
    id: "australia",
    country: "Australia",
    code: "AU",
    label: "Explore Australian pathways",
    description:
      "Explore vocational and career-focused programmes across automotive, business, construction, aged care and information technology.",
    areas: [
      "Automotive & technical",
      "Business & management",
      "Construction",
      "Aged care & support",
      "Information technology",
    ],
    note: "Initial programme options include a Western Australia campus. Course availability and entry requirements must be confirmed.",
    href: "/services/australia-trainee-apprenticeship",
    className: "ta-destination-card-australia",
  },
  {
    id: "new-zealand",
    country: "New Zealand",
    code: "NZ",
    label: "Explore New Zealand pathways",
    description:
      "Discover training options focused on health, wellbeing, ageing support and other vocational pathways as opportunities become available.",
    areas: [
      "Health & wellbeing",
      "Ageing support",
      "Disability support",
      "Vocational training",
    ],
    note: "Programme availability, duration, entry criteria and provider terms should be confirmed before applying.",
    // Keep this path exactly aligned with the route in App.jsx.
    href: "/services/newzealandtrainee-apprenticeship",
    className: "ta-destination-card-new-zealand",
  },
];

const BENEFITS = [
  {
    icon: HiOutlineAcademicCap,
    title: "Explore career-focused learning",
    description:
      "Discover training pathways designed to help you develop practical knowledge and skills.",
  },
  {
    icon: HiOutlineBuildingLibrary,
    title: "Compare destinations",
    description:
      "Review the opportunities available in each destination before choosing a pathway.",
  },
  {
    icon: HiOutlineShieldCheck,
    title: "Understand the requirements",
    description:
      "Get clear information about eligibility, course details and the steps to take next.",
  },
];

const STEPS = [
  {
    number: "01",
    title: "Choose a destination",
    description:
      "Explore the countries where Colossus currently shares trainee and vocational programme information.",
  },
  {
    number: "02",
    title: "Review available programmes",
    description:
      "Open a destination page to review programme areas, durations and provider requirements.",
  },
  {
    number: "03",
    title: "Send an enquiry",
    description:
      "Use the programme enquiry option to email our team about the pathway you are considering.",
  },
  {
    number: "04",
    title: "Confirm your next steps",
    description:
      "Verify availability, costs, eligibility and any provider terms before making a commitment.",
  },
];

export default function TraineeApprenticeship() {
  return (
    <main className="ta-page">
      <section
        className="ta-hero"
        style={{ "--ta-hero-image": `url(${studentHero})` }}
      >
        <div className="ta-hero-overlay" />

        <div className="ta-container ta-hero-grid">
          <div className="ta-hero-copy">
            <span className="ta-eyebrow ta-eyebrow-light">
              <span />
              INTERNATIONAL TRAINING OPPORTUNITIES
            </span>

            <h1>
              Find your next
              <br />
              <em>career pathway.</em>
            </h1>

            <p>
              Explore graduate trainee, apprenticeship-style and vocational
              training opportunities across our available destinations. Start
              by choosing the country that fits your interests and goals.
            </p>

            <div className="ta-hero-actions">
              <a className="ta-button ta-button-gold" href="#ta-destinations">
                Explore destinations <HiArrowRight />
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
                <HiCheckCircle /> Destination-specific information
              </span>
              <span>
                <HiCheckCircle /> Guidance on the next steps
              </span>
            </div>
          </div>

          <aside className="ta-hero-panel">
            <div className="ta-panel-orbit">
              <HiOutlineAcademicCap />
            </div>

            <span className="ta-panel-kicker">YOUR NEXT CHAPTER</span>
            <h2>One starting point. Different pathways.</h2>
            <p>
              Explore the available destinations first. Each country has its
              own programme information, requirements and enquiry process.
            </p>

            <div className="ta-panel-destinations">
              {DESTINATIONS.map((destination) => (
                <a
                  href={destination.href}
                  key={destination.id}
                  className="ta-panel-destination-link"
                >
                  <span
                    className={`ta-destination-icon ${destination.id === "new-zealand" ? "ta-nz-icon" : ""
                      }`}
                  >
                    {destination.code}
                  </span>
                  <span>
                    <strong>{destination.country}</strong>
                    <small>{destination.label}</small>
                  </span>
                  <HiArrowRight />
                </a>
              ))}
            </div>
          </aside>
        </div>

        <div className="ta-hero-bottom">
          <span>COLOSSUS MIGRATION &amp; TOURS</span>
          <span>EXPLORE · PREPARE · PROGRESS</span>
        </div>
      </section>

      <section className="ta-intro-section">
        <div className="ta-container ta-intro-grid">
          <div>
            <span className="ta-eyebrow">START HERE</span>
            <h2>Explore the opportunities before choosing a country.</h2>
          </div>
          <p>
            This page is the central starting point for Colossus trainee and
            apprenticeship-style programme information. Choose a destination
            to see the programmes currently listed for that country. Course
            availability, eligibility and provider conditions can vary.
          </p>
        </div>

        <div className="ta-container ta-benefits">
          {BENEFITS.map(({ icon: Icon, title, description }) => (
            <article key={title}>
              <span className="ta-benefit-icon">
                <Icon />
              </span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        className="ta-catalogue-section ta-destinations-section"
        id="ta-destinations"
      >
        <div className="ta-container">
          <div className="ta-section-heading">
            <div>
              <span className="ta-eyebrow">AVAILABLE DESTINATIONS</span>
              <h2>Where would you like to go?</h2>
              <p>
                Select a destination to explore its available training
                programmes, course information and enquiry options.
              </p>
            </div>

            <div className="ta-catalogue-count">
              <strong>{String(DESTINATIONS.length).padStart(2, "0")}</strong>
              <span>destinations</span>
            </div>
          </div>

          <div className="ta-destination-grid">
            {DESTINATIONS.map((destination) => (
              <article
                className={`ta-program-card ta-destination-card ${destination.className}`}
                key={destination.id}
              >
                <div className="ta-card-topline">
                  <span className="ta-category-pill">
                    <HiGlobeAlt /> Destination
                  </span>
                  <span className="ta-country">{destination.code}</span>
                </div>

                <div className="ta-destination-card-heading">
                  <span
                    className={`ta-destination-icon ${destination.id === "new-zealand" ? "ta-nz-icon" : ""
                      }`}
                  >
                    {destination.code}
                  </span>
                  <div>
                    <h3>{destination.country}</h3>
                    <p>{destination.label}</p>
                  </div>
                </div>

                <p className="ta-program-description">
                  {destination.description}
                </p>

                <div className="ta-card-details">
                  <h4>Programme areas to explore</h4>
                  <ul>
                    {destination.areas.map((area) => (
                      <li key={area}>
                        <HiCheckCircle />
                        {area}
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="ta-destination-note">{destination.note}</p>

                <div className="ta-card-bottom">
                  <a
                    className="ta-button ta-button-primary ta-card-button"
                    href={destination.href}
                  >
                    Explore {destination.country} <HiArrowRight />
                  </a>
                </div>
              </article>
            ))}
          </div>

          <p className="ta-catalogue-disclaimer">
            Programme details and availability may change. Training does not
            guarantee employment, visa approval or permanent residency. Confirm
            the relevant provider&apos;s terms and official requirements before
            making payments or other commitments.
          </p>
        </div>
      </section>

      <section className="ta-process-section" id="ta-how-it-works">
        <div className="ta-container">
          <div className="ta-section-heading">
            <div>
              <span className="ta-eyebrow">HOW IT WORKS</span>
              <h2>Your next steps, made clearer.</h2>
              <p>
                Start with a destination, learn about the available options and
                confirm the requirements before proceeding.
              </p>
            </div>
          </div>

          <div className="ta-process-grid">
            {STEPS.map((step, index) => {
              const icons = [
                HiGlobeAlt,
                HiOutlineAcademicCap,
                HiOutlineChatBubbleLeftRight,
                HiOutlineBriefcase,
              ];
              const Icon = icons[index];

              return (
                <article className="ta-process-step" key={step.number}>
                  <span>{step.number}</span>
                  <Icon />
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </article>
              );
            })}
          </div>

          <div className="ta-process-callout">
            <div>
              <strong>Have questions before choosing?</strong>
              <p>
                Contact the Colossus team to discuss the destinations and
                programme information currently available.
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

      <section className="ta-final-cta">
        <div className="ta-container ta-final-cta-inner">
          <div>
            <span className="ta-eyebrow ta-eyebrow-light">
              YOUR NEXT STEP STARTS HERE
            </span>
            <h2>Explore your options with Colossus.</h2>
            <p>
              Choose a destination to view its programmes and find out what
              information you need before making a decision.
            </p>
          </div>

          <div className="ta-final-actions">
            <a className="ta-button ta-button-gold" href="#ta-destinations">
              <HiGlobeAlt /> Explore destinations
            </a>
            <a
              className="ta-button ta-button-outline"
              href="mailto:admin@colossusmigration.com"
            >
              <HiOutlineChatBubbleLeftRight /> Email our team
            </a>
          </div>
        </div>
      </section>

      <section className="ta-contact-strip">
        <div className="ta-container ta-contact-inner">
          <div>
            <HiOutlineBuildingLibrary />
            <span>
              <strong>Visit us</strong>
              <small>
                Plot 16, Lateef Jakande Road, Agidingbi Bus Stop, Ikeja, Lagos,
                Nigeria
              </small>
            </span>
          </div>

          <div>
            <HiOutlineChatBubbleLeftRight />
            <span>
              <strong>Call us</strong>
              <small>
                +234 703 520 9306 · +234 902 695 3513 · +44 7455 674027
              </small>
            </span>
          </div>

          <div>
            <HiGlobeAlt />
            <span>
              <strong>Email us</strong>
              <small>admin@colossusmigration.com</small>
            </span>
          </div>
        </div>
      </section>

      <div className="ta-legal-note">
        <div className="ta-container">
          Colossus Migration &amp; Tours provides guidance and application
          support. Programme information may change. No admission, visa
          approval, employment or migration outcome is guaranteed. Confirm
          programme details with the education provider and relevant
          authorities.
        </div>
      </div>
    </main>
  );
}
