import { useMemo, useState } from "react";

import {
    useNavigate,
    useParams,
    Link,
} from "react-router-dom";

import {
    HiOutlineArrowLeft,
    HiOutlineArrowRight,
    HiOutlineCheckCircle,
    HiOutlineDocumentText,
    HiOutlineBriefcase,
    HiOutlineShieldCheck,
    HiOutlineClock,
    HiOutlineLocationMarker,
    HiOutlineCurrencyDollar,
    HiOutlineInformationCircle,
    HiOutlineChevronRight,
    HiOutlineUserGroup,
} from "react-icons/hi";

import countries from "../../Home/sections/Countries/countriesData";
import normalizeOpportunities from "../utils/normalizeOpportunities";

import "./OpportunityDetails.css";


/* ============================================================
   COUNTRY FLAG
   ------------------------------------------------------------
   Country data already contains the imported image:

   import ukFlag from ".../united-kingdom.png";

   flag: ukFlag

   Therefore we simply use that imported asset as the
   image source. We NEVER render the path as text.
============================================================ */

const CountryFlag = ({
    flag,
    countryName,
    className = "",
}) => {

    if (!flag) {
        return null;
    }

    return (
        <img
            src={flag}
            alt={`${countryName} flag`}
            className={`country-flag-image ${className}`}
        />
    );
};


/* ============================================================
   OPPORTUNITY DETAILS
============================================================ */

const OpportunityDetails = () => {

    const navigate = useNavigate();

    const {
        country,
        slug,
    } = useParams();


    /* ========================================================
       ACTIVE TAB
    ======================================================== */

    const [activeTab, setActiveTab] = useState(
        "overview"
    );


    /* ========================================================
       COUNTRY
    ======================================================== */

    const selectedCountry = useMemo(() => {

        if (!country) {
            return null;
        }

        return countries.find(
            (item) =>
                item?.slug?.toLowerCase() ===
                country.toLowerCase()
        ) || null;

    }, [country]);


    /* ========================================================
       OPPORTUNITIES
    ======================================================== */

    const opportunities = useMemo(() => {

        if (!selectedCountry) {
            return [];
        }

        return normalizeOpportunities(
            selectedCountry
        );

    }, [selectedCountry]);


    /* ========================================================
       SELECTED OPPORTUNITY
    ======================================================== */

    const selectedOpportunity = useMemo(() => {

        if (
            !slug ||
            opportunities.length === 0
        ) {
            return null;
        }

        const normalizedSlug = decodeURIComponent(
            slug
        )
            .trim()
            .toLowerCase();


        return opportunities.find(
            (item) =>
                String(item?.slug || "")
                    .trim()
                    .toLowerCase() ===
                normalizedSlug
        ) || null;

    }, [
        opportunities,
        slug,
    ]);


    /* ========================================================
       TABS
    ======================================================== */

    const tabs = useMemo(() => {

        if (!selectedOpportunity) {
            return [];
        }

        const result = [
            {
                id: "overview",
                label: "Overview",
                icon: HiOutlineInformationCircle,
            },

            {
                id: "positions",
                label: "Jobs",
                icon: HiOutlineBriefcase,
                show:
                    Array.isArray(
                        selectedOpportunity.positions
                    ) &&
                    selectedOpportunity.positions.length > 0,
            },

            {
                id: "eligibility",
                label: "Eligibility",
                icon: HiOutlineShieldCheck,
                show:
                    Array.isArray(
                        selectedOpportunity.requirements
                    ) &&
                    selectedOpportunity.requirements.length > 0,
            },

            {
                id: "documents",
                label: "Documents",
                icon: HiOutlineDocumentText,
                show:
                    Array.isArray(
                        selectedOpportunity.documents
                    ) &&
                    selectedOpportunity.documents.length > 0,
            },

            {
                id: "process",
                label: "Process",
                icon: HiOutlineClock,
                show:
                    Array.isArray(
                        selectedOpportunity.steps
                    ) &&
                    selectedOpportunity.steps.length > 0,
            },

            {
                id: "pricing",
                label: "Pricing",
                icon: HiOutlineCurrencyDollar,
                show: true,
            },
        ];

        return result.filter(
            (tab) => tab.show !== false
        );

    }, [selectedOpportunity]);


    /* ========================================================
       SAFE TAB
    ======================================================== */

    const safeActiveTab = tabs.some(
        (tab) =>
            tab.id === activeTab
    )
        ? activeTab
        : "overview";


    /* ========================================================
       CURRENT TAB INDEX
    ======================================================== */

    const currentTabIndex = tabs.findIndex(
        (tab) =>
            tab.id === safeActiveTab
    );


    /* ========================================================
       TAB NAVIGATION
    ======================================================== */

    const goToTab = (tabId) => {

        if (!tabId) {
            return;
        }

        setActiveTab(tabId);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });

    };


    const goNext = () => {

        if (
            currentTabIndex < 0 ||
            currentTabIndex >= tabs.length - 1
        ) {
            return;
        }

        const nextTab =
            tabs[currentTabIndex + 1];

        if (nextTab) {
            goToTab(nextTab.id);
        }

    };


    const goPrevious = () => {

        if (
            currentTabIndex <= 0
        ) {
            return;
        }

        const previousTab =
            tabs[currentTabIndex - 1];

        if (previousTab) {
            goToTab(previousTab.id);
        }

    };


    /* ========================================================
       CONTACT AGENT
    ======================================================== */

    const handleContactAgent = () => {

        navigate("/contact");

    };


    /* ========================================================
       BACK TO COUNTRY
    ======================================================== */

    const handleBackToCountry = () => {

        if (!selectedCountry) {

            navigate(
                "/opportunities"
            );

            return;

        }

        navigate(
            `/opportunities/${selectedCountry.slug}`
        );

    };


    /* ========================================================
       COUNTRY NOT FOUND
    ======================================================== */

    if (!selectedCountry) {

        return (
            <main className="opportunity-details opportunity-details--error">

                <div className="opportunity-details__error">

                    <span className="error-eyebrow">
                        Global Opportunities
                    </span>

                    <h1>
                        Country unavailable
                    </h1>

                    <p>
                        We couldn't find the destination
                        associated with this pathway.
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/opportunities")
                        }
                    >
                        <HiOutlineArrowLeft />

                        Back to opportunities
                    </button>

                </div>

            </main>
        );

    }


    /* ========================================================
       OPPORTUNITY NOT FOUND
    ======================================================== */

    if (!selectedOpportunity) {

        return (
            <main className="opportunity-details opportunity-details--error">

                <div className="opportunity-details__error">

                    <div className="error-country">

                        <CountryFlag
                            flag={selectedCountry.flag}
                            countryName={selectedCountry.name}
                        />

                        <span>
                            {selectedCountry.name}
                        </span>

                    </div>

                    <span className="error-eyebrow">
                        Opportunity
                    </span>

                    <h1>
                        Pathway unavailable
                    </h1>

                    <p>
                        The migration pathway you're
                        looking for could not be found.
                    </p>

                    <button
                        type="button"
                        onClick={handleBackToCountry}
                    >
                        <HiOutlineArrowLeft />

                        Back to pathways
                    </button>

                </div>

            </main>
        );

    }


    /* ========================================================
       OPPORTUNITY DATA
    ======================================================== */

    const {
        title,
        image,
        category,
        location,
        type,
        duration,
        salary,
        demand,
        description,
        highlights = [],
        benefits = [],
        positions = [],
        requirements = [],
        documents = [],
        steps = [],
        pricing,
        paymentPlan = [],
        terms = [],
    } = selectedOpportunity;


    const heroImage =
        image ||
        selectedCountry.image;


    const hasPublishedPricing =
        Boolean(pricing?.total);


    /* ========================================================
       OVERVIEW
    ======================================================== */

    const renderOverview = () => {

        const featureItems =
            highlights.length > 0
                ? highlights
                : benefits;


        return (
            <div className="opportunity-tab-content">

                <div className="opportunity-content-grid">

                    <section className="opportunity-section">

                        <div className="section-heading">

                            <span>
                                01
                            </span>

                            <div>

                                <small>
                                    Pathway overview
                                </small>

                                <h2>
                                    What this pathway offers
                                </h2>

                            </div>

                        </div>

                        <p className="opportunity-copy">
                            {description}
                        </p>

                    </section>


                    <section className="opportunity-section">

                        <div className="section-heading">

                            <span>
                                02
                            </span>

                            <div>

                                <small>
                                    Key advantages
                                </small>

                                <h2>
                                    Why this pathway
                                </h2>

                            </div>

                        </div>


                        {featureItems.length > 0 && (

                            <div className="check-list">

                                {featureItems.map(
                                    (item, index) => (

                                        <div
                                            className="check-item"
                                            key={`${item}-${index}`}
                                        >

                                            <HiOutlineCheckCircle />

                                            <span>
                                                {item}
                                            </span>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                    </section>

                </div>


                {terms.length > 0 && (

                    <section className="terms-strip">

                        <HiOutlineInformationCircle />

                        <div>

                            <strong>
                                Important pathway terms
                            </strong>

                            <ul>

                                {terms.map(
                                    (term, index) => (

                                        <li key={index}>
                                            {term}
                                        </li>

                                    )
                                )}

                            </ul>

                        </div>

                    </section>

                )}

            </div>
        );

    };


    /* ========================================================
       POSITIONS
    ======================================================== */

    const renderPositions = () => {

        return (
            <div className="opportunity-tab-content">

                <div className="tab-introduction">

                    <span>
                        Available opportunities
                    </span>

                    <h2>
                        Roles & employment areas
                    </h2>

                    <p>
                        Review the positions associated
                        with this migration pathway.
                    </p>

                </div>


                <div className="positions-list">

                    {positions.map(
                        (position, index) => {

                            const positionTitle =
                                position?.title ||
                                position?.sector ||
                                "Employment opportunity";

                            const positionCategory =
                                position?.category ||
                                position?.sector ||
                                "Employment";


                            return (
                                <article
                                    className="position-row"
                                    key={
                                        position?.id ||
                                        `${positionTitle}-${index}`
                                    }
                                >

                                    <div className="position-number">

                                        {String(index + 1).padStart(
                                            2,
                                            "0"
                                        )}

                                    </div>


                                    <div className="position-main">

                                        <span>
                                            {positionCategory}
                                        </span>

                                        <h3>
                                            {positionTitle}
                                        </h3>

                                        {position?.description && (

                                            <p>
                                                {
                                                    position.description
                                                }
                                            </p>

                                        )}


                                        {position?.roles?.length > 0 && (

                                            <div className="role-tags">

                                                {position.roles.map(
                                                    (
                                                        role,
                                                        roleIndex
                                                    ) => (

                                                        <span
                                                            key={
                                                                roleIndex
                                                            }
                                                        >
                                                            {role}
                                                        </span>

                                                    )
                                                )}

                                            </div>

                                        )}


                                        {position?.responsibilities?.length > 0 && (

                                            <div className="position-responsibilities">

                                                {position.responsibilities.map(
                                                    (
                                                        responsibility,
                                                        responsibilityIndex
                                                    ) => (

                                                        <div
                                                            key={
                                                                responsibilityIndex
                                                            }
                                                        >

                                                            <HiOutlineCheckCircle />

                                                            <span>
                                                                {
                                                                    responsibility
                                                                }
                                                            </span>

                                                        </div>

                                                    )
                                                )}

                                            </div>

                                        )}


                                        {position?.specialCondition && (

                                            <div className="position-condition">

                                                <HiOutlineInformationCircle />

                                                <span>
                                                    {
                                                        position.specialCondition
                                                    }
                                                </span>

                                            </div>

                                        )}

                                    </div>

                                </article>
                            );

                        }
                    )}

                </div>

            </div>
        );

    };


    /* ========================================================
       ELIGIBILITY
    ======================================================== */

    const renderEligibility = () => {

        return (
            <div className="opportunity-tab-content">

                <div className="tab-introduction">

                    <span>
                        Before you apply
                    </span>

                    <h2>
                        Eligibility requirements
                    </h2>

                    <p>
                        Review the basic requirements for
                        this pathway before starting.
                    </p>

                </div>


                <div className="requirements-grid">

                    {requirements.map(
                        (requirement, index) => (

                            <div
                                className="requirement-item"
                                key={index}
                            >

                                <span>
                                    {String(index + 1).padStart(
                                        2,
                                        "0"
                                    )}
                                </span>

                                <p>
                                    {requirement}
                                </p>

                            </div>

                        )
                    )}

                </div>


                {benefits.length > 0 && (

                    <section className="benefits-section">

                        <div className="section-heading">

                            <span>
                                +
                            </span>

                            <div>

                                <small>
                                    Included benefits
                                </small>

                                <h2>
                                    What comes with the pathway
                                </h2>

                            </div>

                        </div>


                        <div className="check-list">

                            {benefits.map(
                                (benefit, index) => (

                                    <div
                                        className="check-item"
                                        key={index}
                                    >

                                        <HiOutlineCheckCircle />

                                        <span>
                                            {benefit}
                                        </span>

                                    </div>

                                )
                            )}

                        </div>

                    </section>

                )}

            </div>
        );

    };


    /* ========================================================
       DOCUMENTS
    ======================================================== */

    const renderDocuments = () => {

        return (
            <div className="opportunity-tab-content">

                <div className="tab-introduction">

                    <span>
                        Application preparation
                    </span>

                    <h2>
                        Documents you'll need
                    </h2>

                    <p>
                        Have these documents ready before
                        beginning your application.
                    </p>

                </div>


                <div className="documents-list">

                    {documents.map(
                        (document, index) => (

                            <div
                                className="document-row"
                                key={index}
                            >

                                <div className="document-icon">

                                    <HiOutlineDocumentText />

                                </div>


                                <div>

                                    <strong>
                                        {document}
                                    </strong>

                                    <span>
                                        Required for pathway processing
                                    </span>

                                </div>


                                <span className="document-number">

                                    {String(index + 1).padStart(
                                        2,
                                        "0"
                                    )}

                                </span>

                            </div>

                        )
                    )}

                </div>

            </div>
        );

    };


    /* ========================================================
       PROCESS
    ======================================================== */

    const renderProcess = () => {

        return (
            <div className="opportunity-tab-content">

                <div className="tab-introduction">

                    <span>
                        Your journey
                    </span>

                    <h2>
                        How the pathway works
                    </h2>

                    <p>
                        Follow the major stages from
                        eligibility through relocation.
                    </p>

                </div>


                <div className="process-list">

                    {steps.map(
                        (step, index) => (

                            <article
                                className="process-row"
                                key={index}
                            >

                                <div className="process-marker">

                                    <span>
                                        {String(index + 1).padStart(
                                            2,
                                            "0"
                                        )}
                                    </span>

                                </div>


                                <div className="process-line" />


                                <div className="process-content">

                                    <span>
                                        Stage {index + 1}
                                    </span>

                                    <h3>
                                        {step.title}
                                    </h3>

                                    <p>
                                        {step.description}
                                    </p>

                                </div>

                            </article>

                        )
                    )}

                </div>

            </div>
        );

    };


    /* ========================================================
       PRICING
    ======================================================== */

    const renderPricing = () => {

        return (
            <div className="opportunity-tab-content">

                <div className="tab-introduction">

                    <span>
                        Investment
                    </span>

                    <h2>
                        Pricing & payment structure
                    </h2>

                    <p>
                        Review the pathway cost and payment
                        stages before contacting our team.
                    </p>

                </div>


                {hasPublishedPricing ? (

                    <div className="pricing-layout">

                        <section className="price-card">

                            <span>
                                Total pathway fee
                            </span>

                            <strong>
                                {pricing.total}
                            </strong>

                            <small>
                                {pricing.currency || "NGN"}
                            </small>


                            <button
                                type="button"
                                onClick={handleContactAgent}
                            >

                                Contact an agent

                                <HiOutlineArrowRight />

                            </button>

                        </section>


                        {paymentPlan.length > 0 && (

                            <section className="payment-plan">

                                <div className="payment-plan__heading">

                                    <span>
                                        Payment structure
                                    </span>

                                    <small>
                                        {paymentPlan.length} stages
                                    </small>

                                </div>


                                {paymentPlan.map(
                                    (payment, index) => (

                                        <div
                                            className="payment-row"
                                            key={index}
                                        >

                                            <div>

                                                <span>
                                                    Stage {index + 1}
                                                </span>

                                                <strong>
                                                    {payment.stage}
                                                </strong>

                                            </div>


                                            <b>
                                                {payment.amount}
                                            </b>

                                        </div>

                                    )
                                )}

                            </section>

                        )}

                    </div>

                ) : (

                    <div className="pricing-contact">

                        <div className="pricing-contact__icon">

                            <HiOutlineUserGroup />

                        </div>


                        <div>

                            <span>
                                Pricing available on request
                            </span>

                            <h3>
                                Speak with a migration agent
                            </h3>

                            <p>
                                This pathway does not currently
                                have a published price. Contact
                                our team to confirm the current
                                cost and payment structure.
                            </p>

                        </div>


                        <button
                            type="button"
                            onClick={handleContactAgent}
                        >

                            Contact an agent

                            <HiOutlineArrowRight />

                        </button>

                    </div>

                )}

            </div>
        );

    };


    /* ========================================================
       TAB CONTENT
    ======================================================== */

    const renderTabContent = () => {

        switch (safeActiveTab) {

            case "positions":
                return renderPositions();

            case "eligibility":
                return renderEligibility();

            case "documents":
                return renderDocuments();

            case "process":
                return renderProcess();

            case "pricing":
                return renderPricing();

            case "overview":
            default:
                return renderOverview();

        }

    };


    /* ========================================================
       PAGE
    ======================================================== */

    return (

        <main className="opportunity-details">

            {/* ==================================================
                TOP BAR
            ================================================== */}

            <div className="opportunity-details__topbar">

                <Link
                    to={`/opportunities/${selectedCountry.slug}`}
                    className="back-link"
                >

                    <HiOutlineArrowLeft />

                    <span>
                        Back to {selectedCountry.name}
                    </span>

                </Link>


                <span className="topbar-label">
                    Migration pathway
                </span>

            </div>


            {/* ==================================================
                HERO
            ================================================== */}

            <section className="opportunity-details__hero">

                <div className="hero-image">

                    {heroImage ? (

                        <img
                            src={heroImage}
                            alt={title}
                        />

                    ) : (

                        <div className="hero-image__fallback">

                            <CountryFlag
                                flag={selectedCountry.flag}
                                countryName={selectedCountry.name}
                            />

                            <span>
                                {selectedCountry.name}
                            </span>

                        </div>

                    )}

                </div>


                <div className="hero-content">

                    {/* BREADCRUMB */}

                    <div className="hero-breadcrumb">

                        <CountryFlag
                            flag={selectedCountry.flag}
                            countryName={selectedCountry.name}
                        />

                        <span>
                            {selectedCountry.name}
                        </span>

                        <HiOutlineChevronRight />

                        <span>
                            {category || "Opportunity"}
                        </span>

                    </div>


                    <div className="hero-title-row">

                        <div className="hero-title-content">

                            <span className="hero-eyebrow">
                                {type || "Migration pathway"}
                            </span>

                            <h1>
                                {title}
                            </h1>

                            <p>
                                {description}
                            </p>

                        </div>


                        <button
                            className="hero-apply"
                            type="button"
                            onClick={handleContactAgent}
                        >

                            Contact an agent

                            <HiOutlineArrowRight />

                        </button>

                    </div>

                </div>

            </section>


            {/* ==================================================
                QUICK FACTS
            ================================================== */}

            <section className="quick-facts">

                <div className="quick-fact">

                    <HiOutlineLocationMarker />

                    <span>
                        Location
                    </span>

                    <strong>
                        {location || selectedCountry.name}
                    </strong>

                </div>


                <div className="quick-fact">

                    <HiOutlineClock />

                    <span>
                        Processing
                    </span>

                    <strong>
                        {duration || "Varies"}
                    </strong>

                </div>


                <div className="quick-fact">

                    <HiOutlineCurrencyDollar />

                    <span>
                        Salary
                    </span>

                    <strong>
                        {salary || "Varies"}
                    </strong>

                </div>


                <div className="quick-fact">

                    <HiOutlineBriefcase />

                    <span>
                        Demand
                    </span>

                    <strong>
                        {demand || "Available"}
                    </strong>

                </div>

            </section>


            {/* ==================================================
                TABS
            ================================================== */}

            <nav
                className="opportunity-tabs"
                aria-label="Opportunity details"
            >

                {tabs.map((tab) => {

                    const Icon = tab.icon;

                    const isActive =
                        safeActiveTab === tab.id;


                    return (
                        <button
                            type="button"
                            key={tab.id}
                            className={
                                isActive
                                    ? "active"
                                    : ""
                            }
                            aria-current={
                                isActive
                                    ? "page"
                                    : undefined
                            }
                            onClick={() =>
                                goToTab(tab.id)
                            }
                        >

                            <Icon />

                            <span>
                                {tab.label}
                            </span>

                        </button>
                    );

                })}

            </nav>


            {/* ==================================================
                CONTENT
            ================================================== */}

            <section className="opportunity-details__body">

                {renderTabContent()}

            </section>


            {/* ==================================================
                FOOTER NAVIGATION
            ================================================== */}

            <footer className="opportunity-details__footer">

                <button
                    type="button"
                    onClick={goPrevious}
                    disabled={
                        currentTabIndex <= 0
                    }
                >

                    <HiOutlineArrowLeft />

                    <span>
                        Previous
                    </span>

                </button>


                <div className="tab-progress">

                    <span>
                        {currentTabIndex + 1}
                    </span>

                    <i>
                        /
                    </i>

                    <span>
                        {tabs.length}
                    </span>

                </div>


                {currentTabIndex <
                    tabs.length - 1 ? (

                    <button
                        type="button"
                        onClick={goNext}
                    >

                        <span>
                            Next
                        </span>

                        <HiOutlineArrowRight />

                    </button>

                ) : (

                    <button
                        type="button"
                        className="footer-apply"
                        onClick={handleContactAgent}
                    >

                        <span>
                            Contact an agent
                        </span>

                        <HiOutlineArrowRight />

                    </button>

                )}

            </footer>

        </main>
    );

};


export default OpportunityDetails;