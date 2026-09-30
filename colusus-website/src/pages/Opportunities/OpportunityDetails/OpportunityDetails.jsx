import {
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
    useParams,
    Link,
} from "react-router-dom";

import {
    HiOutlineArrowLeft,
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

import opportunityService
    from "../../../services/opportunity.service";

import "./OpportunityDetails.css";


/* ============================================================
   COUNTRY FLAG
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
            className={`opportunity-details__country-flag ${className}`}
        />
    );
};


/* ============================================================
   NORMALIZATION
============================================================ */

const normalize = (
    value,
) => {

    return String(
        value || "",
    )
        .trim()
        .toLowerCase()
        .replace(
            /[_-]+/g,
            " ",
        )
        .replace(
            /\s+/g,
            " ",
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
       STATE
    ======================================================== */

    const [
        selectedCountry,
        setSelectedCountry,
    ] = useState(null);


    const [
        selectedOpportunity,
        setSelectedOpportunity,
    ] = useState(null);


    const [
        loading,
        setLoading,
    ] = useState(true);


    const [
        error,
        setError,
    ] = useState("");


    /* ========================================================
       LOAD COUNTRY + OPPORTUNITY
    ======================================================== */

    useEffect(() => {

        let mounted = true;


        const loadOpportunity = async () => {

            try {

                setLoading(true);
                setError("");

                setSelectedCountry(null);
                setSelectedOpportunity(null);


                /* ==================================================
                   VALIDATE ROUTE
                ================================================== */

                if (
                    !country ||
                    !slug
                ) {

                    if (!mounted) {
                        return;
                    }

                    setError(
                        "OPPORTUNITY_NOT_FOUND",
                    );

                    setLoading(false);

                    return;
                }


                /* ==================================================
                   LOAD COUNTRY DIRECTORY
                ==================================================

                   MongoDB:

                   GET /opportunities/countries

                ================================================== */

                const countries =
                    await opportunityService.getCountries();


                if (!mounted) {
                    return;
                }


                const normalizedCountry =
                    normalize(
                        country,
                    );


                const foundCountry =
                    countries.find(
                        (item) =>
                            normalize(
                                item?.slug,
                            ) ===
                            normalizedCountry,
                    );


                /* ==================================================
                   COUNTRY NOT FOUND
                ================================================== */

                if (!foundCountry) {

                    setError(
                        "COUNTRY_NOT_FOUND",
                    );

                    return;
                }


                setSelectedCountry(
                    foundCountry,
                );


                /* ==================================================
                   LOAD EXACT OPPORTUNITY
                ==================================================

                   MongoDB:

                   GET
                   /opportunities/:country/:slug

                ================================================== */

                const foundOpportunity =
                    await opportunityService.getOpportunity(
                        foundCountry.slug,
                        decodeURIComponent(
                            slug,
                        ),
                    );


                if (!mounted) {
                    return;
                }


                /* ==================================================
                   OPPORTUNITY NOT FOUND
                ================================================== */

                if (!foundOpportunity) {

                    setError(
                        "OPPORTUNITY_NOT_FOUND",
                    );

                    return;
                }


                /* ==================================================
                   MERGE COUNTRY FALLBACK DATA
                ==================================================

                   Opportunity records already contain country
                   information, but country-level fields remain
                   available as fallbacks.

                ================================================== */

                const normalizedOpportunity = {

                    ...foundOpportunity,

                    country:
                        foundOpportunity.country ||
                        foundOpportunity.countryName ||
                        foundCountry.name,

                    countryName:
                        foundOpportunity.countryName ||
                        foundCountry.name,

                    countrySlug:
                        foundOpportunity.countrySlug ||
                        foundCountry.slug,

                    countryFlag:
                        foundOpportunity.countryFlag ||
                        foundCountry.flag ||
                        "",

                    image:
                        foundOpportunity.image ||
                        foundCountry.image ||
                        "",

                    location:
                        foundOpportunity.location ||
                        foundCountry.name,

                    duration:
                        foundOpportunity.duration ||
                        foundCountry.duration ||
                        foundCountry.processingTime ||
                        "Varies",

                    visa:
                        foundOpportunity.visa ||
                        foundCountry.visa ||
                        "Varies",

                    applicants:
                        foundOpportunity.applicants ||
                        foundCountry.applicants ||
                        "",

                };


                setSelectedOpportunity(
                    normalizedOpportunity,
                );


            } catch (loadError) {

                console.error(
                    "Failed to load opportunity details:",
                    loadError,
                );


                if (!mounted) {
                    return;
                }


                setSelectedCountry(null);
                setSelectedOpportunity(null);

                setError(
                    "LOAD_FAILED",
                );

            } finally {

                if (mounted) {
                    setLoading(false);
                }

            }

        };


        loadOpportunity();


        return () => {

            mounted = false;

        };

    }, [
        country,
        slug,
    ]);


    /* ========================================================
       LOADING
    ======================================================== */

    if (loading) {

        return (

            <main
                className="
                    opportunity-details
                    opportunity-details--loading
                "
            >

                <div className="opportunity-details__error">

                    <span className="opportunity-details__error-eyebrow">
                        Global Opportunities
                    </span>

                    <h1>
                        Loading pathway...
                    </h1>

                    <p>
                        We're loading the opportunity
                        details.
                    </p>

                </div>

            </main>

        );

    }


    /* ========================================================
       LOAD ERROR
    ======================================================== */

    if (error === "LOAD_FAILED") {

        return (

            <main
                className="
                    opportunity-details
                    opportunity-details--error
                "
            >

                <div className="opportunity-details__error">

                    <span className="opportunity-details__error-eyebrow">
                        Global Opportunities
                    </span>

                    <h1>
                        Unable to load pathway
                    </h1>

                    <p>
                        We couldn't load this migration
                        pathway right now. Please refresh
                        the page and try again.
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            window.location.reload()
                        }
                    >
                        <span>
                            Try again
                        </span>
                    </button>

                </div>

            </main>

        );

    }


    /* ========================================================
       COUNTRY ERROR
    ======================================================== */

    if (
        error === "COUNTRY_NOT_FOUND" ||
        !selectedCountry
    ) {

        return (

            <main
                className="
                    opportunity-details
                    opportunity-details--error
                "
            >

                <div className="opportunity-details__error">

                    <span className="opportunity-details__error-eyebrow">
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
                            navigate(-1)
                        }
                    >
                        <HiOutlineArrowLeft />

                        <span>
                            Back
                        </span>

                    </button>

                </div>

            </main>

        );

    }


    /* ========================================================
       OPPORTUNITY ERROR
    ======================================================== */

    if (
        error === "OPPORTUNITY_NOT_FOUND" ||
        !selectedOpportunity
    ) {

        return (

            <main
                className="
                    opportunity-details
                    opportunity-details--error
                "
            >

                <div className="opportunity-details__error">

                    <div className="opportunity-details__error-country">

                        <CountryFlag
                            flag={
                                selectedCountry.flag
                            }
                            countryName={
                                selectedCountry.name
                            }
                        />

                        <span>
                            {
                                selectedCountry.name
                            }
                        </span>

                    </div>

                    <span className="opportunity-details__error-eyebrow">
                        Migration pathway
                    </span>

                    <h1>
                        Pathway unavailable
                    </h1>

                    <p>
                        The migration pathway
                        you're looking for
                        could not be found.
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                `/opportunities/${selectedCountry.slug}`,
                            )
                        }
                    >
                        <HiOutlineArrowLeft />

                        <span>
                            Back to pathways
                        </span>

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
        location:
        opportunityLocation,
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


    /* ========================================================
       HERO IMAGE
    ======================================================== */

    const heroImage =
        image ||
        selectedCountry.image;


    /* ========================================================
       PRICING
    ======================================================== */

    const hasPublishedPricing =
        Boolean(
            pricing?.total,
        );


    /* ========================================================
       APPLICATION FLOW
    ======================================================== */

    const handleContinueWithPathway = () => {

        if (!selectedOpportunity) {
            return;
        }


        const applicationPath =
            "/portal/applications/new";


        const opportunityId =
            selectedOpportunity?._id ||
            selectedOpportunity?.id ||
            selectedOpportunity?.legacyId ||
            null;


        const applicationState = {

            opportunity:
                selectedOpportunity,

            opportunityId,

            opportunitySlug:
                selectedOpportunity?.slug ||
                slug ||
                null,

            countrySlug:
                selectedCountry?.slug ||
                country ||
                null,

            source:
                "opportunity-details",

        };


        try {

            sessionStorage.setItem(
                "colossus_pending_application",
                JSON.stringify(
                    applicationState,
                ),
            );

        } catch (storageError) {

            console.warn(
                "Unable to preserve pending application:",
                storageError,
            );

        }


        const token =
            localStorage.getItem(
                "colusus_token",
            );


        if (token) {

            navigate(
                applicationPath,
                {
                    state:
                        applicationState,
                },
            );

            return;
        }


        navigate(
            "/login",
            {
                state: {

                    returnTo:
                        applicationPath,

                    returnState:
                        applicationState,

                    source:
                        "opportunity-details",

                },
            },
        );

    };


    /* ========================================================
       ELIGIBILITY
    ======================================================== */

    const handleCheckEligibility = () => {

        navigate(
            "/free-assessment",
            {
                state: {

                    opportunity:
                        selectedOpportunity,

                    opportunityId:
                        selectedOpportunity?._id ||
                        selectedOpportunity?.id ||
                        selectedOpportunity?.legacyId ||
                        null,

                    countrySlug:
                        selectedCountry?.slug ||
                        country ||
                        null,

                    opportunitySlug:
                        selectedOpportunity?.slug ||
                        slug ||
                        null,

                    source:
                        "opportunity-details",

                },
            },
        );

    };


    /* ========================================================
       CONTACT AGENT
    ======================================================== */

    const handleContactAgent = () => {

        navigate(
            "/contact",
            {
                state: {

                    opportunity:
                        selectedOpportunity,

                    country:
                        selectedCountry,

                    source:
                        "opportunity-details",

                },
            },
        );

    };


    /* ========================================================
       FEATURE ITEMS
    ======================================================== */

    const featureItems =
        highlights.length > 0
            ? highlights
            : benefits;


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
                    className="opportunity-details__back-link"
                >

                    <HiOutlineArrowLeft />

                    <span>
                        Back to{" "}
                        {selectedCountry.name}
                    </span>

                </Link>


                <div className="opportunity-details__topbar-meta">

                    <CountryFlag
                        flag={
                            selectedCountry.flag
                        }
                        countryName={
                            selectedCountry.name
                        }
                    />

                    <span>
                        {selectedCountry.name}
                    </span>

                    <i />

                    <span>
                        Migration pathway
                    </span>

                </div>

            </div>


            {/* ==================================================
                HERO
            ================================================== */}

            <section className="opportunity-details__hero">

                <div className="opportunity-details__hero-image">

                    {heroImage ? (

                        <img
                            src={heroImage}
                            alt={title}
                            className="opportunity-details__hero-image-element"
                        />

                    ) : (

                        <div className="opportunity-details__hero-image-fallback">

                            <CountryFlag
                                flag={
                                    selectedCountry.flag
                                }
                                countryName={
                                    selectedCountry.name
                                }
                            />

                            <span>
                                {selectedCountry.name}
                            </span>

                        </div>

                    )}

                </div>


                <div className="opportunity-details__hero-content">

                    <div className="opportunity-details__hero-breadcrumb">

                        <CountryFlag
                            flag={
                                selectedCountry.flag
                            }
                            countryName={
                                selectedCountry.name
                            }
                        />

                        <span>
                            {selectedCountry.name}
                        </span>

                        <HiOutlineChevronRight />

                        <span>
                            {category ||
                                "Opportunity"}
                        </span>

                    </div>


                    <div className="opportunity-details__hero-title-row">

                        <div className="opportunity-details__hero-title-content">

                            <span className="opportunity-details__hero-eyebrow">
                                {type ||
                                    "Migration pathway"}
                            </span>

                            <h1>
                                {title}
                            </h1>

                            <p>
                                {description ||
                                    "Explore this migration pathway and understand the requirements, process and next steps."}
                            </p>

                        </div>


                        <div className="opportunity-details__hero-actions">

                            <button
                                className="opportunity-details__hero-apply"
                                type="button"
                                onClick={
                                    handleContinueWithPathway
                                }
                            >
                                Continue with pathway
                            </button>


                            <button
                                className="opportunity-details__hero-eligibility"
                                type="button"
                                onClick={
                                    handleCheckEligibility
                                }
                            >
                                Check eligibility
                            </button>

                        </div>

                    </div>

                </div>

            </section>


            {/* ==================================================
                QUICK FACTS
            ================================================== */}

            <section className="opportunity-details__quick-facts">

                <div className="opportunity-details__quick-fact">

                    <HiOutlineLocationMarker />

                    <div>

                        <span>
                            Location
                        </span>

                        <strong>
                            {opportunityLocation ||
                                selectedCountry.name}
                        </strong>

                    </div>

                </div>


                <div className="opportunity-details__quick-fact">

                    <HiOutlineClock />

                    <div>

                        <span>
                            Processing
                        </span>

                        <strong>
                            {duration ||
                                "Varies"}
                        </strong>

                    </div>

                </div>


                <div className="opportunity-details__quick-fact">

                    <HiOutlineCurrencyDollar />

                    <div>

                        <span>
                            Salary
                        </span>

                        <strong>
                            {salary ||
                                "Varies"}
                        </strong>

                    </div>

                </div>


                <div className="opportunity-details__quick-fact">

                    <HiOutlineBriefcase />

                    <div>

                        <span>
                            Demand
                        </span>

                        <strong>
                            {demand ||
                                "Available"}
                        </strong>

                    </div>

                </div>

            </section>


            {/* ==================================================
                PAGE BODY
            ================================================== */}

            <div className="opportunity-details__body">


                {/* ==================================================
                    OVERVIEW
                ================================================== */}

                <section className="opportunity-details__overview-section">

                    <div className="opportunity-details__section-heading">

                        <span>
                            01
                        </span>

                        <div>

                            <small>
                                Pathway overview
                            </small>

                            <h2>
                                Understand the opportunity
                            </h2>

                        </div>

                    </div>


                    <div className="opportunity-details__overview-grid">

                        <div className="opportunity-details__overview-main">

                            <p className="opportunity-details__copy">
                                {description ||
                                    "Explore this migration pathway and understand the main requirements, process and next steps."}
                            </p>

                        </div>


                        {featureItems.length > 0 && (

                            <div className="opportunity-details__overview-benefits">

                                <div className="opportunity-details__mini-heading">

                                    <span>
                                        Why this pathway
                                    </span>

                                    <HiOutlineCheckCircle />

                                </div>


                                <div className="opportunity-details__check-list">

                                    {featureItems.map(
                                        (
                                            item,
                                            index,
                                        ) => (

                                            <div
                                                className="opportunity-details__check-item"
                                                key={`${item}-${index}`}
                                            >

                                                <HiOutlineCheckCircle />

                                                <span>
                                                    {item}
                                                </span>

                                            </div>

                                        ),
                                    )}

                                </div>

                            </div>

                        )}

                    </div>


                    {terms.length > 0 && (

                        <div className="opportunity-details__terms-strip">

                            <HiOutlineInformationCircle />

                            <div>

                                <strong>
                                    Important pathway terms
                                </strong>

                                <ul>

                                    {terms.map(
                                        (
                                            term,
                                            index,
                                        ) => (

                                            <li
                                                key={index}
                                            >
                                                {term}
                                            </li>

                                        ),
                                    )}

                                </ul>

                            </div>

                        </div>

                    )}

                </section>


                {/* ==================================================
                    POSITIONS
                ================================================== */}

                {positions.length > 0 && (

                    <section className="opportunity-details__positions-section">

                        <div className="opportunity-details__section-heading">

                            <span>
                                02
                            </span>

                            <div>

                                <small>
                                    Available opportunities
                                </small>

                                <h2>
                                    Jobs & employment areas
                                </h2>

                            </div>

                        </div>


                        <p className="opportunity-details__section-lead">
                            Review the positions associated
                            with this migration pathway.
                        </p>


                        <div className="opportunity-details__positions-list">

                            {positions.map(
                                (
                                    position,
                                    index,
                                ) => {

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
                                            className="opportunity-details__position-row"
                                            key={
                                                position?.id ||
                                                `${positionTitle}-${index}`
                                            }
                                        >

                                            <div className="opportunity-details__position-number">
                                                {String(
                                                    index + 1,
                                                ).padStart(
                                                    2,
                                                    "0",
                                                )}
                                            </div>


                                            <div className="opportunity-details__position-main">

                                                <div className="opportunity-details__position-heading">

                                                    <div>

                                                        <span>
                                                            {
                                                                positionCategory
                                                            }
                                                        </span>

                                                        <h3>
                                                            {
                                                                positionTitle
                                                            }
                                                        </h3>

                                                    </div>

                                                </div>


                                                {position?.description && (

                                                    <p className="opportunity-details__position-description">
                                                        {
                                                            position.description
                                                        }
                                                    </p>

                                                )}


                                                {position?.roles?.length > 0 && (

                                                    <div className="opportunity-details__role-tags">

                                                        {position.roles.map(
                                                            (
                                                                role,
                                                                roleIndex,
                                                            ) => (

                                                                <span
                                                                    key={
                                                                        roleIndex
                                                                    }
                                                                >
                                                                    {role}
                                                                </span>

                                                            ),
                                                        )}

                                                    </div>

                                                )}


                                                {position?.responsibilities?.length > 0 && (

                                                    <div className="opportunity-details__position-responsibilities">

                                                        {position.responsibilities.map(
                                                            (
                                                                responsibility,
                                                                responsibilityIndex,
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

                                                            ),
                                                        )}

                                                    </div>

                                                )}


                                                {position?.specialCondition && (

                                                    <div className="opportunity-details__position-condition">

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

                                },
                            )}

                        </div>

                    </section>

                )}


                {/* ==================================================
                    ELIGIBILITY
                ================================================== */}

                {requirements.length > 0 && (

                    <section className="opportunity-details__eligibility-section">

                        <div className="opportunity-details__section-heading">

                            <span>
                                03
                            </span>

                            <div>

                                <small>
                                    Before you apply
                                </small>

                                <h2>
                                    Eligibility requirements
                                </h2>

                            </div>

                        </div>


                        <p className="opportunity-details__section-lead">
                            Review the basic requirements
                            for this pathway before starting.
                        </p>


                        <div className="opportunity-details__requirements-grid">

                            {requirements.map(
                                (
                                    requirement,
                                    index,
                                ) => (

                                    <div
                                        className="opportunity-details__requirement-item"
                                        key={index}
                                    >

                                        <span>
                                            {String(
                                                index + 1,
                                            ).padStart(
                                                2,
                                                "0",
                                            )}
                                        </span>

                                        <p>
                                            {requirement}
                                        </p>

                                    </div>

                                ),
                            )}

                        </div>


                        {benefits.length > 0 && (

                            <div className="opportunity-details__benefits-section">

                                <div className="opportunity-details__mini-heading">

                                    <span>
                                        Included benefits
                                    </span>

                                    <HiOutlineShieldCheck />

                                </div>


                                <div className="opportunity-details__check-list">

                                    {benefits.map(
                                        (
                                            benefit,
                                            index,
                                        ) => (

                                            <div
                                                className="opportunity-details__check-item"
                                                key={index}
                                            >

                                                <HiOutlineCheckCircle />

                                                <span>
                                                    {benefit}
                                                </span>

                                            </div>

                                        ),
                                    )}

                                </div>

                            </div>

                        )}

                    </section>

                )}


                {/* ==================================================
                    DOCUMENTS
                ================================================== */}

                {documents.length > 0 && (

                    <section className="opportunity-details__documents-section">

                        <div className="opportunity-details__section-heading">

                            <span>
                                04
                            </span>

                            <div>

                                <small>
                                    Application preparation
                                </small>

                                <h2>
                                    Documents you'll need
                                </h2>

                            </div>

                        </div>


                        <p className="opportunity-details__section-lead">
                            Prepare the following documents
                            before beginning your application.
                        </p>


                        <div className="opportunity-details__documents-list">

                            {documents.map(
                                (
                                    document,
                                    index,
                                ) => (

                                    <div
                                        className="opportunity-details__document-row"
                                        key={index}
                                    >

                                        <div className="opportunity-details__document-number">
                                            {String(
                                                index + 1,
                                            ).padStart(
                                                2,
                                                "0",
                                            )}
                                        </div>


                                        <div className="opportunity-details__document-icon">

                                            <HiOutlineDocumentText />

                                        </div>


                                        <div className="opportunity-details__document-content">

                                            <strong>
                                                {document}
                                            </strong>

                                            <span>
                                                Required for pathway processing
                                            </span>

                                        </div>

                                    </div>

                                ),
                            )}

                        </div>

                    </section>

                )}


                {/* ==================================================
                    PROCESS
                ================================================== */}

                {steps.length > 0 && (

                    <section className="opportunity-details__process-section">

                        <div className="opportunity-details__section-heading">

                            <span>
                                05
                            </span>

                            <div>

                                <small>
                                    Your journey
                                </small>

                                <h2>
                                    Migration process
                                </h2>

                            </div>

                        </div>


                        <p className="opportunity-details__section-lead">
                            The major stages from eligibility
                            through the final decision.
                        </p>


                        <div className="opportunity-details__process-list">

                            {steps.map(
                                (
                                    step,
                                    index,
                                ) => {

                                    const stepTitle =
                                        typeof step ===
                                            "string"
                                            ? step
                                            : (
                                                step?.title ||
                                                step?.name ||
                                                `Stage ${index + 1}`
                                            );

                                    const stepDescription =
                                        typeof step ===
                                            "string"
                                            ? ""
                                            : (
                                                step?.description ||
                                                ""
                                            );


                                    return (

                                        <article
                                            className="opportunity-details__process-row"
                                            key={`${stepTitle}-${index}`}
                                        >

                                            <div className="opportunity-details__process-marker">

                                                <span>
                                                    {String(
                                                        index + 1,
                                                    ).padStart(
                                                        2,
                                                        "0",
                                                    )}
                                                </span>

                                            </div>


                                            <div className="opportunity-details__process-line" />


                                            <div className="opportunity-details__process-content">

                                                <span>
                                                    Stage{" "}
                                                    {index + 1}
                                                </span>

                                                <h3>
                                                    {
                                                        stepTitle
                                                    }
                                                </h3>

                                                {stepDescription && (

                                                    <p>
                                                        {
                                                            stepDescription
                                                        }
                                                    </p>

                                                )}

                                            </div>

                                        </article>

                                    );

                                },
                            )}

                        </div>

                    </section>

                )}


                {/* ==================================================
                    PRICING
                ================================================== */}

                <section className="opportunity-details__pricing-section">

                    <div className="opportunity-details__section-heading">

                        <span>
                            06
                        </span>

                        <div>

                            <small>
                                Investment
                            </small>

                            <h2>
                                Pricing & payment
                            </h2>

                        </div>

                    </div>


                    <p className="opportunity-details__section-lead">
                        Review the pathway cost and payment
                        stages before continuing.
                    </p>


                    {hasPublishedPricing ? (

                        <div className="opportunity-details__pricing-layout">

                            <section className="opportunity-details__price-card">

                                <div>

                                    <span>
                                        Total pathway fee
                                    </span>

                                    <strong>
                                        {pricing.total}
                                    </strong>

                                    <small>
                                        {pricing.currency ||
                                            "NGN"}
                                    </small>

                                </div>


                                <button
                                    type="button"
                                    onClick={
                                        handleContinueWithPathway
                                    }
                                >
                                    Continue with pathway
                                </button>

                            </section>


                            {paymentPlan.length > 0 && (

                                <section className="opportunity-details__payment-plan">

                                    <div className="opportunity-details__payment-plan-heading">

                                        <div>

                                            <span>
                                                Payment structure
                                            </span>

                                            <strong>
                                                Split payment available
                                            </strong>

                                        </div>

                                        <small>
                                            {
                                                paymentPlan.length
                                            }{" "}
                                            stages
                                        </small>

                                    </div>


                                    {paymentPlan.map(
                                        (
                                            payment,
                                            index,
                                        ) => (

                                            <div
                                                className="opportunity-details__payment-row"
                                                key={index}
                                            >

                                                <div>

                                                    <span>
                                                        Stage{" "}
                                                        {index + 1}
                                                    </span>

                                                    <strong>
                                                        {
                                                            payment.stage
                                                        }
                                                    </strong>

                                                </div>

                                                <b>
                                                    {
                                                        payment.amount
                                                    }
                                                </b>

                                            </div>

                                        ),
                                    )}

                                </section>

                            )}

                        </div>

                    ) : (

                        <div className="opportunity-details__pricing-contact">

                            <div className="opportunity-details__pricing-contact-icon">

                                <HiOutlineUserGroup />

                            </div>


                            <div>

                                <span>
                                    Pricing available on request
                                </span>

                                <h3>
                                    Speak with our team
                                </h3>

                                <p>
                                    You can begin your pathway
                                    application and our team can
                                    confirm the current cost and
                                    payment structure.
                                </p>

                            </div>


                            <button
                                type="button"
                                onClick={
                                    handleContactAgent
                                }
                            >
                                Contact an agent
                            </button>

                        </div>

                    )}

                </section>


                {/* ==================================================
                    FINAL CTA
                ================================================== */}

                <section className="opportunity-details__final-cta">

                    <div>

                        <span>
                            Ready to move forward?
                        </span>

                        <h2>
                            Start your{" "}
                            {title} pathway
                        </h2>

                        <p>
                            Continue with this pathway
                            to begin your application.
                            We'll preserve this pathway
                            while you sign in.
                        </p>

                    </div>


                    <div className="opportunity-details__final-actions">

                        <button
                            type="button"
                            onClick={
                                handleCheckEligibility
                            }
                            className="opportunity-details__final-secondary-action"
                        >
                            Check eligibility
                        </button>


                        <button
                            type="button"
                            onClick={
                                handleContinueWithPathway
                            }
                            className="opportunity-details__final-primary-action"
                        >
                            Continue with pathway
                        </button>

                    </div>

                </section>

            </div>

        </main>

    );

};


export default OpportunityDetails;