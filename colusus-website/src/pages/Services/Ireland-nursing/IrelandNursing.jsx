
import { Link } from "react-router-dom";
import "./IrelandNursing.css";
import IrelandNursingLeadForm from "./components/IrelandNursingLeadForm/IrelandNursingLeadForm";

function IrelandNursing() {
    return (
        <main className="ireland-page">

            {/* =====================================================
                HERO
            ===================================================== */}

            <section className="ireland-hero">

                <div className="ireland-hero-bg" />

                <div className="ireland-container ireland-hero-inner">

                    <div className="ireland-hero-copy">

                        <h1>
                            Your nursing career,
                            <span>closer to Ireland.</span>
                        </h1>

                        <p>
                            A structured pathway for qualified nurses and
                            eligible healthcare professionals seeking
                            employment opportunities and migration support
                            in Ireland.
                        </p>

                        <div className="ireland-hero-actions">

                            <a
                                href="#ireland-interest"
                                className="ireland-btn ireland-btn-primary"
                            >
                                Register Your Interest
                            </a>

                            <Link
                                to="/opportunities/ireland/ireland-nursing-healthcare"
                                className="ireland-btn ireland-btn-light"
                            >
                                Explore the pathway
                            </Link>

                        </div>

                    </div>


                    <div className="ireland-hero-panel">

                        <div className="ireland-hero-panel-top">

                            <span>
                                Ireland Healthcare Pathway
                            </span>

                            <span className="ireland-status">
                                Open
                            </span>

                        </div>


                        <div className="ireland-hero-main-stat">

                            <small>
                                Indicative annual salary
                            </small>

                            <strong>
                                €37K – €98K
                            </strong>

                            <p>
                                Depending on qualifications
                                and experience.
                            </p>

                        </div>


                        <div className="ireland-hero-meta">

                            <div>
                                <span>Process</span>

                                <strong>
                                    4–6 months
                                </strong>
                            </div>

                            <div>
                                <span>Accommodation</span>

                                <strong>
                                    Employer arranged
                                </strong>
                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* =====================================================
                LEAD FORM
            ===================================================== */}

            <IrelandNursingLeadForm />


            {/* =====================================================
                OVERVIEW
            ===================================================== */}

            <section
                className="ireland-overview"
                id="overview"
            >

                <div className="ireland-container">

                    <div className="ireland-overview-grid">

                        <div className="ireland-section-intro">

                            <h2>
                                A complete pathway,
                                not just a job search.
                            </h2>

                        </div>


                        <div className="ireland-overview-copy">

                            <p>
                                Colossus Migration & Tours supports candidates
                                through the major stages involved in pursuing
                                a healthcare career in Ireland.
                            </p>

                            <p>
                                The pathway covers qualification recognition,
                                professional registration, employment support
                                and work visa processing, with guidance
                                throughout the application.
                            </p>

                        </div>

                    </div>


                    <div className="ireland-highlight-grid">

                        <div className="ireland-highlight">

                            <div>
                                <strong>
                                    Qualification recognition
                                </strong>

                                <p>
                                    Support through the relevant recognition
                                    and registration process.
                                </p>
                            </div>

                        </div>


                        <div className="ireland-highlight">

                            <div>
                                <strong>
                                    Employment pathway
                                </strong>

                                <p>
                                    Job placement support for adaptation
                                    or full-time employment.
                                </p>
                            </div>

                        </div>


                        <div className="ireland-highlight">

                            <div>
                                <strong>
                                    Immigration support
                                </strong>

                                <p>
                                    Guidance through the work visa and
                                    related documentation process.
                                </p>
                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* =====================================================
                WHO THIS IS FOR
            ===================================================== */}

            <section className="ireland-who">

                <div className="ireland-container">

                    <div className="ireland-who-layout">

                        <div>

                            <h2>
                                Built around your
                                professional credentials.
                            </h2>

                        </div>


                        <div className="ireland-who-content">

                            <p>
                                The pathway is designed for qualified nurses
                                and eligible healthcare professionals who can
                                satisfy the relevant professional registration,
                                employment and immigration requirements.
                            </p>

                            <p>
                                Your existing qualifications and professional
                                experience determine the appropriate route
                                and documentation required.
                            </p>

                        </div>

                    </div>

                </div>

            </section>


            {/* =====================================================
                REQUIREMENTS
            ===================================================== */}

            <section
                className="ireland-requirements"
                id="requirements"
            >

                <div className="ireland-container">

                    <div className="ireland-section-header">

                        <div>

                            <h2>
                                What you need to prepare.
                            </h2>

                        </div>

                        <p>
                            Start with the documents already available to you.
                            Outstanding documents can be arranged as the
                            application progresses.
                        </p>

                    </div>


                    <div className="ireland-requirements-grid">

                        <article className="ireland-requirement">

                            <h3>
                                Basic documents
                            </h3>

                            <ul>
                                <li>CV</li>
                                <li>Passport photograph</li>
                                <li>Passport data page</li>
                                <li>IELTS Academic or OET</li>
                            </ul>

                        </article>


                        <article className="ireland-requirement">

                            <h3>
                                Education
                            </h3>

                            <ul>
                                <li>Academic transcripts</li>
                                <li>Detailed curriculum / syllabus</li>
                                <li>Clinical placement records / hours</li>
                            </ul>

                        </article>


                        <article className="ireland-requirement">

                            <h3>
                                Professional registration
                            </h3>

                            <ul>
                                <li>
                                    Current nursing licence from NMCN
                                </li>

                                <li>
                                    CCPS / Certificate of Good Standing
                                </li>

                                <li>
                                    Registration history where applicable
                                </li>
                            </ul>

                        </article>


                        <article className="ireland-requirement">

                            <h3>
                                Employment
                            </h3>

                            <ul>
                                <li>Employment reference letters</li>
                                <li>Evidence of nursing experience</li>
                                <li>Employer verification documents</li>
                            </ul>

                        </article>


                        <article className="ireland-requirement">

                            <h3>
                                Supporting documents
                            </h3>

                            <ul>
                                <li>Certified copies of documents</li>
                                <li>Postgraduate qualifications</li>
                                <li>Specialist certificates where applicable</li>
                            </ul>

                        </article>

                    </div>

                </div>

            </section>


            {/* =====================================================
                COLOSSUS SUPPORT
            ===================================================== */}

            <section className="ireland-services">

                <div className="ireland-container">

                    <div className="ireland-services-layout">

                        <div className="ireland-services-heading">

                            <h2>
                                We help you move through
                                each stage with structure.
                            </h2>

                        </div>


                        <div className="ireland-services-list">

                            <div className="ireland-service-row">

                                <div>
                                    <h3>
                                        Qualification recognition
                                    </h3>

                                    <p>
                                        Support with qualification recognition
                                        and professional registration,
                                        including applicable NMBI processes.
                                    </p>
                                </div>

                            </div>


                            <div className="ireland-service-row">

                                <div>
                                    <h3>
                                        Job placement
                                    </h3>

                                    <p>
                                        Service support for job placement with
                                        an employer for adaptation or
                                        full-time employment.
                                    </p>
                                </div>

                            </div>


                            <div className="ireland-service-row">

                                <div>
                                    <h3>
                                        Work visa processing
                                    </h3>

                                    <p>
                                        Guidance and service support for the
                                        work visa application and associated
                                        documentation.
                                    </p>
                                </div>

                            </div>


                            <div className="ireland-service-row">

                                <div>
                                    <h3>
                                        Candidate preparation
                                    </h3>

                                    <p>
                                        Guidance with documentation,
                                        language or occupational test
                                        preparation and interview readiness.
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* =====================================================
                PROCESS
            ===================================================== */}

            <section className="ireland-process">

                <div className="ireland-container">

                    <div className="ireland-section-header">

                        <div>

                            <h2>
                                Four stages to get you moving.
                            </h2>

                        </div>

                    </div>


                    <div className="ireland-process-grid">

                        <div className="ireland-process-step">

                            <h3>
                                Submit your documents
                            </h3>

                            <p>
                                Send the documents you currently have available.
                                Additional documents can follow as required.
                            </p>

                        </div>


                        <div className="ireland-process-step">

                            <h3>
                                Sign the agreement
                            </h3>

                            <p>
                                Colossus Migration and the candidate formalise
                                the engagement through a Service Level Agreement.
                            </p>

                        </div>


                        <div className="ireland-process-step">

                            <h3>
                                Begin processing
                            </h3>

                            <p>
                                The initial mobilisation payment is made to
                                begin the registration and processing stage.
                            </p>

                        </div>


                        <div className="ireland-process-step">

                            <h3>
                                Progress toward relocation
                            </h3>

                            <p>
                                Registration, employment, work permit and
                                immigration stages are completed progressively.
                            </p>

                        </div>

                    </div>

                </div>

            </section>


            {/* =====================================================
                PRICING
            ===================================================== */}

            <section className="ireland-pricing">

                <div className="ireland-container">

                    <div className="ireland-pricing-layout">

                        <div className="ireland-pricing-main">

                            <h2>
                                A structured package
                                with staged payments.
                            </h2>

                            <p>
                                The individual package covers the major
                                service components of the pathway.
                            </p>


                            <div className="ireland-price-block">

                                <span>
                                    Individual package
                                </span>

                                <strong>
                                    ₦15,000,000
                                </strong>

                            </div>


                            <div className="ireland-price-note">
                                Family applications are available at
                                additional cost.
                            </div>

                        </div>


                        <div className="ireland-payment">

                            <div className="ireland-payment-header">

                                <span>
                                    Payment schedule
                                </span>

                                <small>
                                    4 stages
                                </small>

                            </div>


                            <div className="ireland-payment-item">

                                <div>
                                    <strong>
                                        ₦3,000,000
                                    </strong>

                                    <p>
                                        Mobilisation for registration with NMBI
                                    </p>
                                </div>

                            </div>


                            <div className="ireland-payment-item">

                                <div>
                                    <strong>
                                        ₦5,000,000
                                    </strong>

                                    <p>
                                        After registration / NMBI decision letter
                                    </p>
                                </div>

                            </div>


                            <div className="ireland-payment-item">

                                <div>
                                    <strong>
                                        ₦5,000,000
                                    </strong>

                                    <p>
                                        After job offer and employment /
                                        work permit documents
                                    </p>
                                </div>

                            </div>


                            <div className="ireland-payment-item">

                                <div>
                                    <strong>
                                        ₦2,000,000
                                    </strong>

                                    <p>
                                        After receiving work-to-enter
                                        Ireland documentation
                                    </p>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* =====================================================
                INCLUDED
            ===================================================== */}

            <section className="ireland-included">

                <div className="ireland-container">

                    <div className="ireland-included-header">

                        <h2>
                            The major service costs
                            are built into the package.
                        </h2>

                    </div>


                    <div className="ireland-included-grid">

                        <div>

                            <h3>
                                Registration
                            </h3>

                            <p>
                                Qualification recognition and professional
                                registration service support, including
                                applicable NMBI fees.
                            </p>

                        </div>


                        <div>

                            <h3>
                                Employment
                            </h3>

                            <p>
                                Job placement service support with an employer
                                for adaptation or full-time employment.
                            </p>

                        </div>


                        <div>

                            <h3>
                                Work visa
                            </h3>

                            <p>
                                Work visa application service support and
                                applicable visa fees.
                            </p>

                        </div>

                    </div>

                </div>

            </section>


            {/* =====================================================
                FAMILY
            ===================================================== */}

            <section className="ireland-family">

                <div className="ireland-container">

                    <div className="ireland-family-layout">

                        <div>

                            <h2>
                                Your relocation can
                                include your family.
                            </h2>

                            <p>
                                Family members can be added to the individual
                                package at the applicable additional cost.
                            </p>

                        </div>


                        <div className="ireland-family-prices">

                            <div>

                                <span>
                                    Spouse
                                </span>

                                <strong>
                                    +₦3M
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Each child
                                </span>

                                <strong>
                                    +₦1M
                                </strong>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* =====================================================
                FAQ
            ===================================================== */}

            <section className="ireland-faq">

                <div className="ireland-container">

                    <div className="ireland-faq-layout">

                        <div>

                            <h2>
                                Before you begin.
                            </h2>

                            <p>
                                A few of the questions candidates commonly
                                have about the pathway.
                            </p>

                        </div>


                        <div className="ireland-faq-list">

                            <details>

                                <summary>
                                    How long does the process take?
                                </summary>

                                <p>
                                    The stated estimated process time is
                                    approximately 4–6 months. Actual timelines
                                    may vary depending on registration,
                                    employment, documentation and immigration
                                    processing.
                                </p>

                            </details>


                            <details>

                                <summary>
                                    Do I need IELTS or OET?
                                </summary>

                                <p>
                                    Candidates are expected to provide IELTS
                                    Academic or Occupational English Test (OET)
                                    documentation as required for the pathway.
                                </p>

                            </details>


                            <details>

                                <summary>
                                    Can I start without every document?
                                </summary>

                                <p>
                                    Candidates can submit the documents
                                    currently available to them and arrange
                                    outstanding documents during the process,
                                    subject to the requirements of each stage.
                                </p>

                            </details>


                            <details>

                                <summary>
                                    Is accommodation provided?
                                </summary>

                                <p>
                                    The offer states that accommodation is to
                                    be arranged by the employer.
                                </p>

                            </details>


                            <details>

                                <summary>
                                    Can my family come with me?
                                </summary>

                                <p>
                                    Family options are available at additional
                                    package costs for a spouse and children.
                                </p>

                            </details>

                        </div>

                    </div>

                </div>

            </section>


            {/* =====================================================
                FINAL CTA
            ===================================================== */}

            <section className="ireland-final-cta">

                <div className="ireland-final-cta-bg" />

                <div className="ireland-container">

                    <div className="ireland-final-cta-content">

                        <h2>
                            Ready to explore
                            your pathway to Ireland?
                        </h2>

                        <p>
                            Speak with Colossus Migration & Tours about your
                            qualifications, documents and next steps.
                        </p>

                        <div className="ireland-final-actions">

                            <a
                                href="#ireland-interest"
                                className="ireland-btn ireland-btn-primary"
                            >
                                Register Your Interest
                            </a>

                            <a
                                href="https://wa.me/2347035209306"
                                target="_blank"
                                rel="noreferrer"
                                className="ireland-btn ireland-btn-light"
                            >
                                WhatsApp Colossus
                            </a>

                        </div>

                    </div>

                </div>

            </section>

        </main>
    );
}

export default IrelandNursing;
