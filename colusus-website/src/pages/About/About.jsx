import React from "react";
import { Link } from "react-router-dom";
import {
    ArrowRight,
    Check,
    Globe2,
    BriefcaseBusiness,
    GraduationCap,
    FileCheck2,
    Users,
    Building2,
} from "lucide-react";

import "./About.css";

/* =========================================================
TEAM PHOTOGRAPHS
========================================================= */

import tony from "../../assets/images/team/tony.jpg";
import stanley from "../../assets/images/team/Stanley.jpg";
import nnamdi from "../../assets/images/team/Nnamdi.jpg";
import rosemary from "../../assets/images/team/Rosemary.jpg";
import jane from "../../assets/images/team/jane.png";
import esther from "../../assets/images/team/Esther.jpg";
import praise from "../../assets/images/team/Praise.jpg";
import olaide from "../../assets/images/team/olaide.png";
import sam from "../../assets/images/team/sam.jpg";

/* =========================================================
TEAM DATA
========================================================= */

const teamMembers = [
    {
        name: "Tony Chiugo Josephat",
        role: "Chief Immigration Director",
        category: "Leadership",
        image: tony,
        featured: true,
        description:
            "Leading immigration strategy and helping individuals, families and businesses navigate international migration opportunities through advisory, compliance and long-term planning.",
    },
    {
        name: "Stanley Okonkwo",
        role: "Finance Controller & Account Manager",
        category: "Finance",
        image: stanley,
    },
    {
        name: "Rosemary O. Effiong",
        role: "Office Admin & Content Creator",
        category: "Operations",
        image: rosemary,
    },
    {
        name: "Jane Lilian Onyebuchi",
        role: "Administration Manager",
        category: "Administration",
        image: jane,
    },
    {
        name: "Praise",
        role: "Digital Marketing Lead",
        category: "Marketing",
        image: praise,
    },
    {
        name: "Akosile Olaide J.",
        role: "Web Application Engineer",
        category: "Technology",
        image: olaide,
    },
    {
        name: "Udeme Sam",
        role: "Software Engineer",
        category: "Technology",
        image: sam,
    },

];

/* =========================================================
COMPANY SERVICES
========================================================= */

const services = [
    {
        number: "01",
        icon: BriefcaseBusiness,
        title: "International Recruitment",
        description:
            "Connecting eligible African professionals with legitimate international employment opportunities.",
    },
    {
        number: "02",
        icon: GraduationCap,
        title: "Overseas Education",
        description:
            "Helping prospective students understand international education options and application requirements.",
    },
    {
        number: "03",
        icon: Globe2,
        title: "Immigration Guidance",
        description:
            "Providing guidance on immigration pathways, eligibility considerations and documentation requirements.",
    },
    {
        number: "04",
        icon: Users,
        title: "Candidate Assessment",
        description:
            "Understanding individual backgrounds, professional experience and suitability for potential opportunities.",
    },
    {
        number: "05",
        icon: FileCheck2,
        title: "Application Support",
        description:
            "Supporting clients with relevant preparation and application processes within agreed service terms.",
    },
    {
        number: "06",
        icon: Building2,
        title: "Strategic Partnerships",
        description:
            "Building relationships with employers, recruitment partners, training providers and educational institutions.",
    },
];

/* =========================================================
CORE VALUES
========================================================= */

const values = [
    {
        number: "01",
        title: "Integrity",
        description:
            "We value honesty, transparency and responsible communication.",
    },
    {
        number: "02",
        title: "Professionalism",
        description:
            "We approach every engagement with care, preparation and respect for applicable requirements.",
    },
    {
        number: "03",
        title: "Opportunity",
        description:
            "We believe individuals should have access to reliable information about international career and education possibilities.",
    },
    {
        number: "04",
        title: "Client-Centred Service",
        description:
            "We consider each client's circumstances, goals and eligibility when discussing potential pathways.",
    },
    {
        number: "05",
        title: "Accountability",
        description:
            "We aim to communicate clearly, maintain appropriate records and provide support according to agreed service terms.",
    },
    {
        number: "06",
        title: "Global Collaboration",
        description:
            "We build relationships with employers, recruitment partners, training providers and educational institutions.",
    },
];

/* =========================================================
DESTINATIONS
========================================================= */

const destinations = [
    "Australia",
    "New Zealand",
    "Canada",
    "United Kingdom",
    "Ireland",
    "Germany",
];

/* =========================================================
HELPER: EXPLORE SERVICES
========================================================= */

const exploreServices = () => {
    navigate("/services");
};

/* =========================================================
TEAM CARD
========================================================= */

const TeamCard = ({ member }) => {
    return (
        <article
            className={`about-team-card ${member.featured ? "about-team-card-featured" : ""
                }`}
        > <div className="about-team-card-image">


                <img
                    src={member.image}
                    alt={member.name}
                    loading="lazy"
                />

                <span className="about-team-card-category">
                    {member.category}
                </span>

            </div>

            <div className="about-team-card-content">

                <h3>{member.name}</h3>

                <span className="about-team-card-role">
                    {member.role}
                </span>

                {member.description && (
                    <p>{member.description}</p>
                )}

            </div>
        </article>
    );


};

/* =========================================================
MAIN ABOUT PAGE
========================================================= */

const About = () => {


    return (
        <main className="about-page">

            {/* =================================================
            01 — HERO
        ================================================= */}

            <section className="about-hero">

                <div className="about-hero-image" />

                <div className="about-hero-shade" />

                <div className="about-container about-hero-inner">

                    <div className="about-hero-copy">

                        <h1>
                            Connecting African talent
                            <span>
                                to global opportunities.
                            </span>
                        </h1>

                        <p>
                            An international recruitment, education
                            and immigration consulting company
                            helping people make informed decisions
                            about their future.
                        </p>

                        <div className="about-hero-buttons">


                            <Link
                                to="/services"
                                className="about-button-primary"
                            >
                                Explore our services
                                <ArrowRight size={18} />
                            </Link>

                            <Link
                                to="/contact"
                                className="about-button-text"
                            >
                                Talk to our team
                                <ArrowRight size={17} />
                            </Link>

                        </div>

                    </div>

                    <div className="about-hero-bottom">

                        <span>
                            COLOSSUS MIGRATION & TOURS LTD
                        </span>

                        <span>
                            LAGOS, NIGERIA
                        </span>

                    </div>

                </div>

            </section>


            {/* =================================================
            02 — TEAM
        ================================================= */}

            <section className="about-team-section">

                <div className="about-container">

                    <div className="about-section-intro about-team-intro">

                        <div>

                            <h2>
                                The people behind
                                <span> the possibilities.</span>
                            </h2>

                        </div>

                        <div className="about-section-intro-side">

                            <p>
                                Behind Colossus is a team bringing
                                together different areas of expertise
                                to support our clients, operations
                                and international partnerships.
                            </p>

                        </div>

                    </div>


                    <div className="about-team-grid">

                        {teamMembers.map((member) => (
                            <TeamCard
                                key={member.name}
                                member={member}
                            />
                        ))}

                    </div>

                </div>

            </section>


            {/* =================================================
            03 — COMPANY STORY
        ================================================= */}

            <section className="about-story-section">

                <div className="about-story-visual">

                    <img
                        src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=90"
                        alt="Professionals collaborating in a modern workspace"
                        loading="lazy"
                    />

                    <div className="about-story-image-caption">
                        <span>COLOSSUS MIGRATION & TOURS</span>
                        <strong>
                            Connecting people to possibilities.
                        </strong>
                    </div>

                </div>


                <div className="about-story-copy">

                    <div className="about-story-content">

                        <h2>
                            More than migration.
                            <span> A connection to opportunity.</span>
                        </h2>

                        <p className="about-story-lead">
                            Colossus Migration & Tours Ltd is an
                            international recruitment, education
                            and immigration consulting company
                            founded in 2019 and based in Lagos,
                            Nigeria.
                        </p>

                        <p>
                            We were established with a clear purpose:
                            to connect African talent with legitimate
                            international opportunities and help
                            individuals make informed decisions about
                            their careers, education and migration goals.
                        </p>

                        <p>
                            We understand that pursuing an opportunity
                            abroad can be complex. Candidates must
                            navigate different recruitment systems,
                            educational requirements, professional
                            registration processes, immigration rules,
                            documentation requirements and financial
                            considerations.
                        </p>

                        <p>
                            Our role is to help make these processes
                            clearer through structured guidance,
                            relevant opportunity information and
                            professional support within the scope
                            of our services.
                        </p>

                    </div>

                </div>

            </section>


            {/* =================================================
            04 — VISION AND MISSION
        ================================================= */}

            <section className="about-purpose-section">

                <div className="about-purpose-visual">

                    <div className="about-purpose-background" />

                    <div className="about-purpose-overlay" />

                    <div className="about-purpose-inner">

                        <h2>
                            A world where
                            <span> opportunity knows no borders.</span>
                        </h2>

                    </div>

                </div>


                <div className="about-container about-purpose-grid">

                    <article className="about-purpose-card">

                        <span className="about-purpose-label">
                            OUR VISION
                        </span>

                        <h3>
                            Where we want to be.
                        </h3>

                        <p>
                            To become a trusted international platform
                            connecting African talent, global employers
                            and educational institutions.
                        </p>

                    </article>


                    <article className="about-purpose-card about-purpose-card-blue">

                        <span className="about-purpose-label">
                            OUR MISSION
                        </span>

                        <h3>
                            What drives us.
                        </h3>

                        <p>
                            To connect skilled and aspiring African
                            professionals with international
                            opportunities through ethical recruitment,
                            education consulting, immigration guidance
                            and strategic global partnerships.
                        </p>

                    </article>

                </div>

            </section>


            {/* =================================================
            05 — WHAT WE DO
        ================================================= */}

            <section className="about-services-section">

                <div className="about-container">

                    <div className="about-section-intro">

                        <div>

                            <h2>
                                What we
                                <span> do.</span>
                            </h2>

                        </div>

                        <div className="about-section-intro-side">

                            <p>
                                Our services bring together international
                                recruitment, education consulting,
                                immigration guidance and strategic
                                collaboration.
                            </p>

                        </div>

                    </div>


                    <div className="about-services-grid">

                        {services.map((service) => {

                            const Icon = service.icon;

                            return (
                                <article
                                    className="about-service-card"
                                    key={service.number}
                                >

                                    <div className="about-service-top">

                                        <span>
                                            {service.number}
                                        </span>

                                        <Icon size={25} />

                                    </div>

                                    <h3>
                                        {service.title}
                                    </h3>

                                    <p>
                                        {service.description}
                                    </p>

                                    <div className="about-service-bottom">
                                        <span />
                                    </div>

                                </article>
                            );
                        })}

                    </div>

                </div>

            </section>


            {/* =================================================
            06 — GLOBAL REACH
        ================================================= */}

            <section className="about-global-section">

                <div className="about-global-image">

                    <img
                        src="https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=1800&q=90"
                        alt="International city skyline"
                        loading="lazy"
                    />

                    <div className="about-global-image-overlay" />

                </div>


                <div className="about-container about-global-content">

                    <div className="about-global-heading">

                        <h2>
                            Connecting African talent
                            <span> to the wider world.</span>
                        </h2>

                        <p>
                            We support eligible candidates seeking
                            opportunities across selected destinations,
                            including the following countries, subject
                            to current opportunities and applicable
                            requirements.
                        </p>

                    </div>


                    <div className="about-destination-list">

                        {destinations.map((country, index) => (

                            <div
                                className="about-destination-item"
                                key={country}
                            >

                                <span>
                                    {String(index + 1).padStart(2, "0")}
                                </span>

                                <strong>
                                    {country}
                                </strong>

                                <ArrowRight size={19} />

                            </div>

                        ))}

                    </div>

                </div>

            </section>


            {/* =================================================
            07 — CORE VALUES
        ================================================= */}

            <section className="about-values-section">

                <div className="about-container">

                    <div className="about-section-intro">

                        <div>

                            <h2>
                                The principles
                                <span> behind our work.</span>
                            </h2>

                        </div>

                        <div className="about-section-intro-side">

                            <p>
                                Our values shape how we work,
                                communicate, make decisions and
                                build lasting professional relationships.
                            </p>

                        </div>

                    </div>


                    <div className="about-values-grid">

                        {values.map((value) => (

                            <article
                                className="about-value-card"
                                key={value.number}
                            >

                                <span className="about-value-number">
                                    {value.number}
                                </span>

                                <h3>
                                    {value.title}
                                </h3>

                                <p>
                                    {value.description}
                                </p>

                            </article>

                        ))}

                    </div>

                </div>

            </section>


            {/* =================================================
            08 — OUR COMMITMENT
        ================================================= */}

            <section className="about-commitment-section">

                <div className="about-container about-commitment-layout">

                    <div className="about-commitment-heading">

                        <h2>
                            We believe informed decisions
                            <span> create better outcomes.</span>
                        </h2>

                    </div>


                    <div className="about-commitment-content">

                        <p className="about-commitment-lead">
                            Our commitment is to clarity,
                            professionalism and responsible support.
                        </p>

                        <p>
                            We are committed to explaining processes
                            clearly, helping candidates understand
                            their responsibilities and treating clients
                            with professionalism throughout the agreed
                            engagement.
                        </p>


                        <div className="about-commitment-list">

                            {[
                                "Clear and responsible communication",
                                "Professional client support",
                                "Transparent engagement terms",
                                "Respect for applicable requirements",
                            ].map((item) => (

                                <div key={item}>

                                    <span>
                                        <Check size={15} />
                                    </span>

                                    <strong>{item}</strong>

                                </div>

                            ))}

                        </div>


                        <div className="about-disclaimer">

                            <h3>
                                Important information
                            </h3>

                            <p>
                                We do not promise guaranteed jobs,
                                admissions, work permits, permanent
                                residence or visa approvals. These
                                outcomes depend on the relevant employer,
                                institution and government authority.
                            </p>

                        </div>

                    </div>

                </div>

            </section>


            {/* =================================================
            09 — FINAL CALL TO ACTION
        ================================================= */}

            <section className="about-final-section">

                <div className="about-final-background" />

                <div className="about-container about-final-content">

                    <h2>
                        Your next chapter
                        <span> could begin here.</span>
                    </h2>

                    <p>
                        Whether you are exploring international
                        employment, education or migration pathways,
                        we are here to help you understand your options.
                    </p>

                    <div className="about-final-actions">

                        <Link
                            to="/services"
                            className="about-button-primary"
                        >
                            Explore our services
                            <ArrowRight size={18} />
                        </Link>

                        <Link
                            to="/contact"
                            className="about-button-text"
                        >
                            Talk to our team
                            <ArrowRight size={17} />
                        </Link>

                    </div>

                    <div className="about-final-brand">
                        COLOSSUS MIGRATION & TOURS LTD
                    </div>

                </div>

            </section>

        </main>
    );


};

export default About;
