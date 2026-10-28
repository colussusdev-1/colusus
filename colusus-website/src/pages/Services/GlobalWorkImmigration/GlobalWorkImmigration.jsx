
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    ArrowDown,
    ArrowRight,
    ArrowUpRight,
    BriefcaseBusiness,
    Check,
    ChevronDown,
    Compass,
    FileCheck2,
    Globe2,
    GraduationCap,
    MessageCircle,
    ShieldCheck,
    Sparkles,
} from "lucide-react";

import "./GlobalWorkImmigration.css";

const destinations = [
    {
        name: "Canada",
        code: "CA",
        category: "CAREER & MOBILITY",
        headline: "Build your next chapter.",
        description:
            "Explore available opportunities and discover international pathways that align with your professional goals.",
        image:
            "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1400&q=85",
        link: "/opportunities/canada",
    },
    {
        name: "United Kingdom",
        code: "UK",
        category: "WORK & DEVELOPMENT",
        headline: "Take your ambition further.",
        description:
            "Discover opportunities and get guidance on the preparation required for your next international move.",
        image:
            "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1400&q=85",
        link: "/opportunities/united-kingdom",
    },
    {
        name: "Australia",
        code: "AU",
        category: "SKILLS & OPPORTUNITY",
        headline: "Make room for possibility.",
        description:
            "Explore work-related and professional development opportunities and understand the steps involved in applying.",
        image:
            "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1400&q=85",
        link: "/opportunities/australia",
    },
    {
        name: "New Zealand",
        code: "NZ",
        category: "TRAINING & MOBILITY",
        headline: "Discover a different future.",
        description:
            "Explore relevant opportunities and understand the requirements for your next international experience.",
        image:
            "https://images.unsplash.com/photo-1469521669194-babb45599def?auto=format&fit=crop&w=1400&q=85",
        link: "/opportunities/new-zealand",
    },
];

const services = [
    {
        number: "01",
        icon: Compass,
        title: "Pathway guidance",
        description:
            "Understand the available routes, eligibility considerations, and practical steps relevant to your goals.",
    },
    {
        number: "02",
        icon: FileCheck2,
        title: "Application preparation",
        description:
            "Get structured support with document preparation, application requirements, and submission readiness.",
    },
    {
        number: "03",
        icon: BriefcaseBusiness,
        title: "Opportunity discovery",
        description:
            "Explore relevant opportunities published on our platform and identify options worth pursuing.",
    },
    {
        number: "04",
        icon: ShieldCheck,
        title: "Journey coordination",
        description:
            "Keep track of your next steps, required documents, and progress throughout the agreed service.",
    },
];

const journeySteps = [
    {
        number: "01",
        icon: MessageCircle,
        title: "Tell us where you want to go",
        description:
            "Share your preferred destination, professional background, and what you hope to achieve.",
    },
    {
        number: "02",
        icon: Globe2,
        title: "Explore relevant opportunities",
        description:
            "Review opportunities on our platform and discuss the pathways that may suit your circumstances.",
    },
    {
        number: "03",
        icon: FileCheck2,
        title: "Prepare with direction",
        description:
            "Work through the applicable requirements, documentation, and next steps with our guidance.",
    },
];

const faqs = [
    {
        question: "Does Colossus provide international job opportunities?",
        answer:
            "We publish opportunities on our own platform. Availability, eligibility, employer requirements, and application conditions vary by listing. Review each opportunity carefully before applying.",
    },
    {
        question: "Can you guarantee that I will get a job or visa?",
        answer:
            "No. Employment decisions and immigration outcomes depend on employers and the relevant authorities. We provide guidance and agreed application support but cannot guarantee an outcome.",
    },
    {
        question: "Do I need to have my documents ready before contacting you?",
        answer:
            "Not necessarily. You can begin by discussing your goals and circumstances. We can help you understand which documents may be required for the opportunity or pathway you are considering.",
    },
    {
        question: "How do I find opportunities for a specific country?",
        answer:
            "Choose a destination on this page and select Explore opportunities. You will be taken to that destination's opportunities page on the Colossus website.",
    },
];

function getContactUrl(destination = "") {
    const params = new URLSearchParams({
        service: "global-work-immigration",
    });

    if (destination) {
        params.set("destination", destination);
    }

    return `/contact?${params.toString()}`;
}

function DestinationCard({ destination, index }) {
    return (
        <article
            className="gwi-destination"
            style={{ "--gwi-card-index": index }}
        >
            <Link
                className="gwi-destination__image-link"
                to={destination.link}
                aria-label={`Explore ${destination.name} opportunities`}
            >
                <img
                    className="gwi-destination__image"
                    src={destination.image}
                    alt={`${destination.name} destination`}
                    loading="lazy"
                />

                <span
                    className="gwi-destination__image-shade"
                    aria-hidden="true"
                />

                <span className="gwi-destination__code">
                    {destination.code}
                </span>

                <span className="gwi-destination__image-action">
                    <ArrowUpRight size={19} strokeWidth={1.8} />
                </span>
            </Link>

            <div className="gwi-destination__content">
                <p className="gwi-eyebrow gwi-destination__category">
                    {destination.category}
                </p>

                <h3>{destination.name}</h3>

                <h4>{destination.headline}</h4>

                <p className="gwi-destination__description">
                    {destination.description}
                </p>

                <Link className="gwi-text-link" to={destination.link}>
                    <span>Explore opportunities</span>
                    <ArrowRight size={17} strokeWidth={1.8} />
                </Link>
            </div>
        </article>
    );
}

function GlobalWorkImmigration() {
    const [openFaq, setOpenFaq] = useState(0);

    return (
        <main className="gwi-page">
            {/* HERO */}

            <section
                className="gwi-hero"
                aria-labelledby="gwi-hero-title"
            >
                <div className="gwi-hero__background" aria-hidden="true">
                    <img
                        src="https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=2400&q=90"
                        alt=""
                        fetchPriority="high"
                    />
                </div>

                <div className="gwi-hero__overlay" aria-hidden="true" />
                <div className="gwi-hero__grid" aria-hidden="true" />

                <div className="gwi-container gwi-hero__inner">
                    <div className="gwi-hero__copy">
                        <div className="gwi-label">
                            <Globe2 size={16} strokeWidth={1.8} />
                            <span>GLOBAL WORK & IMMIGRATION</span>
                        </div>

                        <h1 id="gwi-hero-title">
                            Your ambition
                            <br />
                            deserves a
                            <br />
                            <span>bigger world.</span>
                        </h1>

                        <p className="gwi-hero__description">
                            Explore international opportunities. Understand your options.
                            Move forward with a clearer plan and the right support.
                        </p>

                        <div className="gwi-hero__actions">
                            <Link
                                className="gwi-button gwi-button--primary"
                                to={getContactUrl()}
                            >
                                Start your journey
                                <ArrowUpRight size={19} />
                            </Link>

                            <a
                                className="gwi-button gwi-button--glass"
                                href="#destinations"
                            >
                                Explore destinations
                                <ArrowDown size={17} />
                            </a>
                        </div>

                        <div className="gwi-hero__assurance">
                            <span className="gwi-hero__assurance-icon">
                                <Check size={15} />
                            </span>

                            <p>
                                Clear guidance. Structured preparation.{" "}
                                <strong>No guaranteed outcomes.</strong>
                            </p>
                        </div>
                    </div>

                    <aside className="gwi-hero-panel">
                        <div className="gwi-hero-panel__top">
                            <span className="gwi-hero-panel__icon">
                                <Compass size={21} strokeWidth={1.7} />
                            </span>

                            <span className="gwi-hero-panel__index">
                                YOUR NEXT CHAPTER
                            </span>
                        </div>

                        <p className="gwi-hero-panel__heading">
                            One destination.
                            <br />
                            A world of possibilities.
                        </p>

                        <p className="gwi-hero-panel__description">
                            Start with your goals. Explore available options. Understand
                            the journey ahead.
                        </p>

                        <Link
                            to="#destinations"
                            className="gwi-hero-panel__link"
                        >
                            Find your starting point
                            <ArrowDown size={18} />
                        </Link>
                    </aside>

                    <a className="gwi-hero__scroll" href="#destinations">
                        <span>SCROLL TO EXPLORE</span>
                        <ArrowDown size={15} />
                    </a>
                </div>

                <div className="gwi-hero__bottom-bar" aria-hidden="true">
                    <span>THINK BEYOND BORDERS</span>
                    <span>PLAN WITH PURPOSE</span>
                    <span>MOVE WITH DIRECTION</span>
                </div>
            </section>

            {/* INTRODUCTION */}

            <section className="gwi-intro">
                <div className="gwi-container gwi-intro__inner">
                    <div className="gwi-intro__label">

                        <span className="gwi-eyebrow">
                            A MORE CONSIDERED JOURNEY
                        </span>
                    </div>

                    <div className="gwi-intro__main">
                        <h2>
                            International opportunities.
                            <br />
                            <span>A clearer way forward.</span>
                        </h2>

                        <div className="gwi-intro__right">
                            <p>
                                Going global involves more than choosing a country. It means
                                finding relevant opportunities, understanding requirements,
                                preparing properly, and knowing what to do next.
                            </p>

                            <Link
                                className="gwi-text-link"
                                to={getContactUrl()}
                            >
                                <span>Discuss your plans with us</span>
                                <ArrowRight size={17} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* DESTINATIONS */}

            <section
                className="gwi-destinations"
                id="destinations"
                aria-labelledby="gwi-destinations-title"
            >
                <div className="gwi-container">
                    <div className="gwi-section-heading">
                        <div>
                            <div className="gwi-section-index">
                                DESTINATIONS
                            </div>

                            <h2 id="gwi-destinations-title">
                                Where could
                                <br />
                                <span>your next move take you?</span>
                            </h2>
                        </div>

                        <div className="gwi-section-heading__aside">
                            <p>
                                Start with a destination. Explore opportunities published
                                on our platform and discover options worth considering.
                            </p>

                            <Link
                                className="gwi-text-link"
                                to={getContactUrl()}
                            >
                                <span>Ask about available opportunities</span>
                                <ArrowUpRight size={17} />
                            </Link>
                        </div>
                    </div>

                    <div className="gwi-destinations__grid">
                        {destinations.map((destination, index) => (
                            <DestinationCard
                                key={destination.code}
                                destination={destination}
                                index={index}
                            />
                        ))}
                    </div>

                    <div className="gwi-destinations__footnote">
                        <span className="gwi-destinations__footnote-icon">
                            <ShieldCheck size={19} />
                        </span>

                        <p>
                            <strong>Stay informed before you commit.</strong>{" "}
                            Availability, eligibility, costs, and immigration requirements
                            differ by opportunity. Review the listing and confirm the
                            applicable requirements before proceeding.
                        </p>
                    </div>
                </div>
            </section>

            {/* SERVICES */}

            <section
                className="gwi-services"
                id="our-services"
                aria-labelledby="gwi-services-title"
            >
                <div className="gwi-container gwi-services__layout">
                    <div className="gwi-services__intro">
                        <div className="gwi-section-index">
                            HOW WE HELP
                        </div>

                        <h2 id="gwi-services-title">
                            More direction.
                            <br />
                            <span>Less guesswork.</span>
                        </h2>

                        <p>
                            We help you understand the process, organise the details, and
                            approach your international plans with greater clarity.
                        </p>

                        <Link
                            className="gwi-button gwi-button--dark"
                            to={getContactUrl()}
                        >
                            Discuss your plans
                            <ArrowUpRight size={18} />
                        </Link>

                        <div className="gwi-services__visual">
                            <img
                                src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1000&q=85"
                                alt="Professionals collaborating on a project"
                                loading="lazy"
                            />

                            <div className="gwi-services__visual-caption">
                                <span className="gwi-services__visual-icon">
                                    <Globe2 size={20} />
                                </span>

                                <div>
                                    <strong>Plan with perspective.</strong>
                                    <span>Prepare with purpose.</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="gwi-services__list">
                        {services.map((service) => {
                            const Icon = service.icon;

                            return (
                                <article className="gwi-service" key={service.number}>
                                    <div className="gwi-service__number">
                                        {service.number}
                                    </div>

                                    <div className="gwi-service__icon">
                                        <Icon size={23} strokeWidth={1.65} />
                                    </div>

                                    <div className="gwi-service__body">
                                        <h3>{service.title}</h3>
                                        <p>{service.description}</p>
                                    </div>

                                    <span
                                        className="gwi-service__arrow"
                                        aria-hidden="true"
                                    >
                                        <ArrowUpRight size={19} />
                                    </span>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* JOURNEY */}

            <section
                className="gwi-journey"
                aria-labelledby="gwi-journey-title"
            >
                <div className="gwi-container">
                    <div className="gwi-journey__heading">
                        <div className="gwi-section-index">
                            THE PROCESS
                        </div>

                        <h2 id="gwi-journey-title">
                            A practical first step.
                            <br />
                            <span>A better-informed next move.</span>
                        </h2>

                        <p>
                            You do not need every answer before you begin. Start with your
                            goals and work through the next steps in a structured way.
                        </p>
                    </div>

                    <div className="gwi-journey__grid">
                        {journeySteps.map((step) => {
                            const Icon = step.icon;

                            return (
                                <article
                                    className="gwi-journey-step"
                                    key={step.number}
                                >
                                    <div className="gwi-journey-step__top">
                                        <span>{step.number}</span>
                                        <Icon size={23} strokeWidth={1.6} />
                                    </div>

                                    <h3>{step.title}</h3>
                                    <p>{step.description}</p>
                                </article>
                            );
                        })}
                    </div>

                    <div className="gwi-journey__action">
                        <div>
                            <Sparkles size={20} />
                            <span>
                                Your journey starts with a conversation.
                            </span>
                        </div>

                        <Link to={getContactUrl()}>
                            Take the first step
                            <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* FAQ */}

            <section
                className="gwi-faq"
                aria-labelledby="gwi-faq-title"
            >
                <div className="gwi-container gwi-faq__layout">
                    <div className="gwi-faq__intro">
                        <div className="gwi-section-index">
                            GOOD TO KNOW
                        </div>

                        <h2 id="gwi-faq-title">
                            Before you
                            <br />
                            <span>take the next step.</span>
                        </h2>

                        <p>
                            Useful answers to help you make informed decisions about your
                            international plans.
                        </p>

                        <Link
                            className="gwi-text-link"
                            to={getContactUrl()}
                        >
                            <span>Have another question?</span>
                            <ArrowUpRight size={17} />
                        </Link>
                    </div>

                    <div className="gwi-faq__list">
                        {faqs.map((faq, index) => {
                            const isOpen = openFaq === index;

                            return (
                                <article
                                    className={`gwi-faq-item ${isOpen ? "gwi-faq-item--open" : ""
                                        }`}
                                    key={faq.question}
                                >
                                    <button
                                        type="button"
                                        className="gwi-faq-item__question"
                                        aria-expanded={isOpen}
                                        onClick={() =>
                                            setOpenFaq(isOpen ? -1 : index)
                                        }
                                    >
                                        <span>{faq.question}</span>

                                        <span className="gwi-faq-item__toggle">
                                            <ChevronDown size={19} />
                                        </span>
                                    </button>

                                    <div
                                        className="gwi-faq-item__answer"
                                        hidden={!isOpen}
                                    >
                                        <p>{faq.answer}</p>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* FINAL CTA */}

            <section className="gwi-final-cta">
                <div
                    className="gwi-final-cta__background"
                    aria-hidden="true"
                >
                    <img
                        src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=2200&q=85"
                        alt=""
                        loading="lazy"
                    />
                </div>

                <div
                    className="gwi-final-cta__overlay"
                    aria-hidden="true"
                />

                <div className="gwi-container gwi-final-cta__inner">
                    <div className="gwi-final-cta__content">
                        <div className="gwi-label">
                            <GraduationCap size={17} />
                            <span>YOUR NEXT CHAPTER STARTS HERE</span>
                        </div>

                        <h2>
                            Think beyond
                            <br />
                            <span>where you are.</span>
                        </h2>

                        <p>
                            Explore opportunities, understand your options, and take a more
                            informed approach to your international future.
                        </p>

                        <div className="gwi-final-cta__actions">


                            <Link
                                className="gwi-button gwi-button--primary"
                                to="/pathways"
                            >
                                Explore your options
                                <ArrowUpRight size={19} />
                            </Link>

                            <Link
                                className="gwi-button gwi-button--glass"
                                to={getContactUrl()}
                            >
                                Talk to our team
                                <ArrowRight size={18} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default GlobalWorkImmigration;

