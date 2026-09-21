import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    HiOutlineArrowLeft,
    HiOutlineArrowRight,
    HiOutlineCheckCircle,
    HiOutlineClock,
    HiOutlineDocumentText,
    HiOutlineGlobeAlt,
    HiOutlineInformationCircle,
    HiOutlineSearch,
    HiOutlineUser,
} from "react-icons/hi";

import {
    useNavigate,
} from "react-router-dom";

import opportunityService
    from "../../services/opportunity.service.js";

import clientProfileService
    from "../../services/clientPortal.service.js";

import applicationService
    from "../../services/application.service.js";

import {
    canada,
    uk,
    australia,
    germany,
    poland,
    finland,
    hungary,
    serbia,
    lithuania,
    latvia,
    croatia,
    spain,
    norway,
    bulgaria,
    romania,
} from "../../assets/images/countries/index.js";

import "./ClientOnboarding.css";


/*
============================================================
COUNTRY IMAGES
============================================================
*/

const COUNTRY_IMAGES = {
    canada,
    "united kingdom": uk,
    uk,
    australia,
    germany,
    poland,
    finland,
    hungary,
    serbia,
    lithuania,
    latvia,
    croatia,
    spain,
    norway,
    bulgaria,
    romania,
};


/*
============================================================
NORMALIZE COUNTRY
============================================================
*/

const normalizeCountryName = (value) => {

    return String(value || "")
        .trim()
        .toLowerCase()
        .replace(/[_-]+/g, " ")
        .replace(/\s+/g, " ");

};


/*
============================================================
COUNTRY IMAGE
============================================================
*/

const getCountryImage = (country) => {

    if (!country) {
        return null;
    }


    const possibleNames = [
        country.name,
        country.slug,
        country.countryCode,
        country.code,
    ];


    for (const value of possibleNames) {

        const normalized =
            normalizeCountryName(value);


        if (
            normalized &&
            Object.prototype.hasOwnProperty.call(
                COUNTRY_IMAGES,
                normalized,
            )
        ) {

            return COUNTRY_IMAGES[normalized];

        }

    }


    return null;

};


/*
============================================================
FIRST NAME
============================================================
*/

const getFirstName = (profile) => {

    const name =
        profile?.user?.name ||
        "";


    return (
        name
            .trim()
            .split(/\s+/)[0] ||
        "there"
    );

};


/*
============================================================
OPPORTUNITY HELPERS
============================================================
*/

const getOpportunityTitle = (
    opportunity,
) => {

    return (
        opportunity?.title ||
        opportunity?.name ||
        "Migration opportunity"
    );

};


const getOpportunityCategory = (
    opportunity,
) => {

    return (
        opportunity?.category ||
        opportunity?.type ||
        "Migration pathway"
    );

};


const getOpportunityDescription = (
    opportunity,
) => {

    return (
        opportunity?.description ||
        "Explore this migration pathway and see whether it fits your plans."
    );

};


/*
============================================================
FORMAT LABEL
============================================================
*/

const formatLabel = (value) => {

    return String(value || "")
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/[_-]+/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/\b\w/g, (char) =>
            char.toUpperCase(),
        );

};


/*
============================================================
FORMAT VALUE
============================================================
*/

const formatValue = (value) => {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {

        return "";

    }


    if (
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean"
    ) {

        return String(value);

    }


    if (Array.isArray(value)) {

        return value
            .map((item) =>
                formatValue(item),
            )
            .filter(Boolean)
            .join(", ");

    }


    if (typeof value === "object") {

        return Object.entries(value)
            .map(
                ([key, item]) => {

                    const formatted =
                        formatValue(item);


                    if (!formatted) {
                        return "";
                    }


                    return `${formatLabel(key)}: ${formatted}`;

                },
            )
            .filter(Boolean)
            .join(" • ");

    }


    return String(value);

};


/*
============================================================
GET OBJECT ENTRIES
============================================================
*/

const getObjectEntries = (
    value,
) => {

    if (
        !value ||
        typeof value !== "object" ||
        Array.isArray(value)
    ) {

        return [];

    }


    return Object.entries(value)
        .filter(
            ([, item]) =>
                item !== null &&
                item !== undefined &&
                item !== "",
        );

};


/*
============================================================
GET PRICING ITEMS
============================================================
*/

const getPricingItems = (
    pricing,
) => {

    if (!pricing) {
        return [];
    }


    if (
        typeof pricing === "string" ||
        typeof pricing === "number"
    ) {

        return [
            {
                label: "Service fee",
                value: String(pricing),
            },
        ];

    }


    if (Array.isArray(pricing)) {

        return pricing
            .map(
                (item, index) => {

                    if (
                        item === null ||
                        item === undefined ||
                        item === ""
                    ) {

                        return null;

                    }


                    if (
                        typeof item === "string" ||
                        typeof item === "number"
                    ) {

                        return {
                            label:
                                index === 0
                                    ? "Price"
                                    : `Price ${index + 1}`,

                            value:
                                String(item),
                        };

                    }


                    if (
                        typeof item === "object"
                    ) {

                        const entries =
                            getObjectEntries(
                                item,
                            );


                        if (
                            entries.length === 1
                        ) {

                            return {
                                label:
                                    formatLabel(
                                        entries[0][0],
                                    ),

                                value:
                                    formatValue(
                                        entries[0][1],
                                    ),
                            };

                        }


                        return {
                            label:
                                item.name ||
                                item.label ||
                                item.title ||
                                `Option ${index + 1}`,

                            value:
                                item.price ||
                                item.amount ||
                                item.value ||
                                formatValue(item),
                        };

                    }


                    return null;

                },
            )
            .filter(Boolean);

    }


    const entries =
        getObjectEntries(
            pricing,
        );


    return entries.map(
        ([key, value]) => ({
            label:
                formatLabel(key),

            value:
                formatValue(value),
        }),
    );

};


/*
============================================================
RENDER LIST
============================================================
*/

const renderListItems = (
    items,
) => {

    if (
        !Array.isArray(items) ||
        !items.length
    ) {

        return null;

    }


    return (
        <ul className="client-onboarding-detail-list">

            {items.map(
                (item, index) => {

                    const value =
                        typeof item === "string"
                            ? item
                            : formatValue(item);


                    if (!value) {
                        return null;
                    }


                    return (

                        <li
                            key={`${value}-${index}`}
                        >

                            <HiOutlineCheckCircle />

                            <span>
                                {value}
                            </span>

                        </li>

                    );

                },
            )}

        </ul>
    );

};


/*
============================================================
CLIENT ONBOARDING
============================================================
*/

const ClientOnboarding = () => {

    const navigate = useNavigate();


    /*
    ============================================================
    PROFILE
    ============================================================
    */

    const [profile, setProfile] =
        useState(null);

    const [completion, setCompletion] =
        useState({
            exists: false,
            isComplete: false,
            percentage: 0,
            missingFields: [],
        });


    /*
    ============================================================
    OPPORTUNITIES
    ============================================================
    */

    const [opportunities, setOpportunities] =
        useState([]);


    /*
    ============================================================
    UI STATE
    ============================================================
    */

    const [loading, setLoading] =
        useState(true);

    const [profileLoading, setProfileLoading] =
        useState(true);

    const [startingApplication, setStartingApplication] =
        useState(false);

    const [showProfileRequiredModal, setShowProfileRequiredModal] =
        useState(false);

    const [search, setSearch] =
        useState("");

    const [selectedCountry, setSelectedCountry] =
        useState(null);

    const [viewingOpportunity, setViewingOpportunity] =
        useState(null);

    const [error, setError] =
        useState("");


    /*
    ============================================================
    LOAD PROFILE
    ============================================================
    */

    useEffect(() => {

        let mounted = true;


        const loadProfile = async () => {

            try {

                setProfileLoading(true);


                const [
                    profileData,
                    completionData,
                ] = await Promise.all([
                    clientProfileService.getProfile(),
                    clientProfileService.getProfileCompletion(),
                ]);


                if (!mounted) {
                    return;
                }


                setProfile(
                    profileData || null,
                );


                setCompletion({

                    exists:
                        completionData?.exists ?? false,

                    isComplete:
                        completionData?.isComplete ?? false,

                    percentage:
                        completionData?.percentage ?? 0,

                    missingFields:
                        Array.isArray(
                            completionData?.missingFields,
                        )
                            ? completionData.missingFields
                            : [],

                });

            } catch (err) {

                console.error(
                    "FAILED TO LOAD ONBOARDING PROFILE:",
                    err,
                );

            } finally {

                if (mounted) {
                    setProfileLoading(false);
                }

            }

        };


        loadProfile();


        return () => {
            mounted = false;
        };

    }, []);


    /*
    ============================================================
    LOAD OPPORTUNITIES
    ============================================================
    */

    useEffect(() => {

        let mounted = true;


        const loadOpportunities = async () => {

            try {

                setLoading(true);

                setError("");


                const data =
                    await opportunityService.getOpportunities();


                if (!mounted) {
                    return;
                }


                setOpportunities(
                    Array.isArray(data)
                        ? data
                        : [],
                );

            } catch (err) {

                console.error(
                    "FAILED TO LOAD ONBOARDING OPPORTUNITIES:",
                    err,
                );


                if (mounted) {

                    setError(
                        err?.response?.data?.message ||
                        "Unable to load migration opportunities.",
                    );

                }

            } finally {

                if (mounted) {
                    setLoading(false);
                }

            }

        };


        loadOpportunities();


        return () => {
            mounted = false;
        };

    }, []);


    /*
    ============================================================
    BUILD COUNTRIES
    ============================================================
    */

    const countries = useMemo(() => {

        const countryMap = new Map();


        opportunities.forEach(
            (opportunity) => {

                const countryName =
                    String(
                        opportunity?.countryName ||
                        opportunity?.destinationCountry ||
                        opportunity?.country ||
                        "",
                    ).trim();


                if (!countryName) {
                    return;
                }


                const key =
                    normalizeCountryName(
                        countryName,
                    );


                if (!countryMap.has(key)) {

                    const country = {

                        name: countryName,

                        slug:
                            opportunity?.countrySlug ||
                            opportunity?.countryCode ||
                            key.replace(
                                /\s+/g,
                                "-",
                            ),

                        countryCode:
                            opportunity?.countryCode ||
                            opportunity?.code ||
                            "",

                        flag:
                            opportunity?.countryFlag ||
                            opportunity?.flag ||
                            null,

                        opportunities: [],

                    };


                    country.image =
                        getCountryImage(
                            country,
                        );


                    countryMap.set(
                        key,
                        country,
                    );

                }


                countryMap
                    .get(key)
                    .opportunities
                    .push(opportunity);

            },
        );


        return Array.from(
            countryMap.values(),
        ).sort(
            (a, b) =>
                a.name.localeCompare(
                    b.name,
                ),
        );

    }, [opportunities]);


    /*
    ============================================================
    FILTER COUNTRIES
    ============================================================
    */

    const filteredCountries =
        useMemo(() => {

            const query =
                search
                    .trim()
                    .toLowerCase();


            if (!query) {
                return countries;
            }


            return countries.filter(
                (country) => {

                    const text = [
                        country.name,
                        country.slug,
                        country.countryCode,
                    ]
                        .filter(Boolean)
                        .join(" ")
                        .toLowerCase();


                    return text.includes(
                        query,
                    );

                },
            );

        }, [
            countries,
            search,
        ]);


    /*
    ============================================================
    SELECT COUNTRY
    ============================================================
    */

    const handleSelectCountry = (
        country,
    ) => {

        setSelectedCountry(
            country,
        );

        setViewingOpportunity(
            null,
        );

        setSearch("");


        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });

    };


    /*
    ============================================================
    BACK TO COUNTRIES
    ============================================================
    */

    const handleBackToCountries = () => {

        setSelectedCountry(null);

        setViewingOpportunity(null);

        setSearch("");


        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });

    };


    /*
    ============================================================
    OPEN PATHWAY DETAILS
    ============================================================
    */

    const handleViewOpportunity = (
        opportunity,
    ) => {

        if (!opportunity) {
            return;
        }


        setViewingOpportunity(
            opportunity,
        );


        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });

    };


    /*
    ============================================================
    BACK TO PATHWAYS
    ============================================================
    */

    const handleBackToPathways = () => {

        setViewingOpportunity(
            null,
        );


        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });

    };


    /*
    ============================================================
    STORE PENDING APPLICATION
    ============================================================
    */

    const storePendingApplication = () => {

        if (!viewingOpportunity?._id) {
            return;
        }


        sessionStorage.setItem(
            "colossus_pending_application",
            JSON.stringify({

                opportunityId:
                    viewingOpportunity._id,

                opportunity:
                    viewingOpportunity,

                destinationCountry:
                    selectedCountry?.name ||
                    viewingOpportunity?.countryName ||
                    "",

            }),
        );

    };


    /*
    ============================================================
    PROCEED TO PROFILE
    ============================================================
    */

    const handleProceedToProfile = () => {

        setShowProfileRequiredModal(
            false,
        );


        navigate(
            "/portal/profile?returnTo=/portal",
        );

    };


    /*
    ============================================================
    START APPLICATION
    ============================================================
    */

    const handleContinue = async () => {

        if (
            !viewingOpportunity?._id ||
            startingApplication
        ) {

            return;

        }


        try {

            setStartingApplication(true);

            setError("");


            /*
            ========================================================
            CHECK PROFILE COMPLETION
            ========================================================
            */

            const profileCompletion =
                await clientProfileService.getProfileCompletion();


            /*
            ========================================================
            PROFILE INCOMPLETE
            ========================================================
            */

            if (!profileCompletion?.isComplete) {

                storePendingApplication();

                setShowProfileRequiredModal(
                    true,
                );

                setStartingApplication(
                    false,
                );

                return;

            }


            /*
            ========================================================
            PROFILE COMPLETE
            ========================================================
            */

            const application =
                await applicationService.createApplication({

                    opportunity:
                        viewingOpportunity._id,

                    destinationCountry:
                        selectedCountry?.name ||
                        viewingOpportunity?.countryName ||
                        "",

                });


            /*
            ========================================================
            REMOVE PENDING APPLICATION
            ========================================================
            */

            sessionStorage.removeItem(
                "colossus_pending_application",
            );


            /*
            ========================================================
            OPEN CREATED APPLICATION
            ========================================================
            */

            const applicationId =
                application?._id ||
                application?.id;


            if (applicationId) {

                navigate(
                    `/portal/applications/${applicationId}`,
                );

                return;

            }


            /*
            ========================================================
            FALLBACK
            ========================================================
            */

            navigate(
                "/portal/applications",
            );

        } catch (err) {

            console.error(
                "FAILED TO START APPLICATION:",
                err,
            );


            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Unable to start this application. Please try again.",
            );

        } finally {

            setStartingApplication(false);

        }

    };


    /*
    ============================================================
    COMPLETE PROFILE DIRECTLY
    ============================================================
    */

    const handleCompleteProfile = () => {

        navigate(
            "/portal/profile?returnTo=/portal",
        );

    };


    /*
    ============================================================
    DERIVED VALUES
    ============================================================
    */

    const firstName =
        getFirstName(profile);


    const selectedCountryImage =
        selectedCountry
            ? (
                selectedCountry.image ||
                selectedCountry.flag ||
                null
            )
            : null;


    const pricingItems =
        getPricingItems(
            viewingOpportunity?.pricing,
        );


    const requiredDocuments =
        viewingOpportunity
            ?.applicationConfig
            ?.requiredDocuments ||
        [];


    /*
    ============================================================
    RENDER
    ============================================================
    */

    return (

        <main className="client-onboarding">


            {/* ==================================================
                WELCOME HERO
            ================================================== */}

            <section className="client-onboarding-hero">

                <div className="client-onboarding-hero-copy">

                    <span className="client-onboarding-eyebrow">
                        WELCOME TO COLUSUS
                    </span>

                    <h1>
                        Your migration journey

                        <span>
                            starts here, {firstName}.
                        </span>
                    </h1>

                    <p>
                        Explore destinations, compare
                        migration pathways, and find the
                        opportunity that fits your plans.
                    </p>

                </div>


                {!profileLoading && (

                    <div className="client-onboarding-profile-card">

                        <div className="client-onboarding-profile-icon">

                            <HiOutlineUser />

                        </div>


                        <div className="client-onboarding-profile-content">

                            <div className="client-onboarding-profile-heading">

                                <div>

                                    <span>
                                        YOUR PROFILE
                                    </span>

                                    <strong>
                                        {completion.isComplete
                                            ? "Profile complete"
                                            : "Complete your profile"}
                                    </strong>

                                </div>


                                <strong>
                                    {completion.percentage}%
                                </strong>

                            </div>


                            <div className="client-onboarding-profile-track">

                                <span
                                    style={{
                                        width:
                                            `${completion.percentage}%`,
                                    }}
                                />

                            </div>


                            <p>
                                {completion.isComplete
                                    ? "You're ready to continue with a migration application."
                                    : "Complete your profile so we're ready when you find the right opportunity."}
                            </p>


                            {!completion.isComplete && (

                                <button
                                    type="button"
                                    onClick={
                                        handleCompleteProfile
                                    }
                                    className="client-onboarding-profile-link"
                                >

                                    Complete profile

                                    <HiOutlineArrowRight />

                                </button>

                            )}

                        </div>

                    </div>

                )}

            </section>


            {/* ==================================================
                ERROR
            ================================================== */}

            {error && (

                <div
                    className="client-onboarding-error"
                    role="alert"
                >
                    {error}
                </div>

            )}


            {/* ==================================================
                COUNTRY DISCOVERY
            ================================================== */}

            {!selectedCountry && (

                <section className="client-onboarding-opportunities">

                    <div className="client-onboarding-section-header">

                        <div>

                            <span className="client-onboarding-section-eyebrow">
                                EXPLORE YOUR OPTIONS
                            </span>

                            <h2>
                                Where would you like to go?
                            </h2>

                            <p>
                                Explore the migration destinations
                                currently available through Colusus.
                            </p>

                        </div>


                        <div className="client-onboarding-country-count">

                            <strong>
                                {countries.length}
                            </strong>

                            <span>
                                destinations
                            </span>

                        </div>

                    </div>


                    <div className="client-onboarding-search">

                        <HiOutlineSearch />

                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value,
                                )
                            }
                            placeholder="Search destinations..."
                            aria-label="Search destinations"
                        />

                    </div>


                    {loading ? (

                        <div className="client-onboarding-loading">

                            <div className="client-onboarding-spinner" />

                            <p>
                                Finding migration opportunities...
                            </p>

                        </div>

                    ) : filteredCountries.length === 0 ? (

                        <div className="client-onboarding-empty">

                            <HiOutlineGlobeAlt />

                            <h3>
                                No destinations found
                            </h3>

                            <p>
                                Try searching for another destination.
                            </p>

                        </div>

                    ) : (

                        <div className="client-onboarding-country-grid">

                            {filteredCountries.map(
                                (country) => {

                                    const image =
                                        country.image ||
                                        country.flag ||
                                        null;


                                    return (

                                        <button
                                            type="button"
                                            key={
                                                country.slug
                                            }
                                            className="client-onboarding-country-card"
                                            onClick={() =>
                                                handleSelectCountry(
                                                    country,
                                                )
                                            }
                                        >

                                            <div className="client-onboarding-country-image">

                                                {image ? (

                                                    <img
                                                        src={image}
                                                        alt={`${country.name} migration`}
                                                        loading="lazy"
                                                    />

                                                ) : (

                                                    <div className="client-onboarding-country-fallback">

                                                        <HiOutlineGlobeAlt />

                                                    </div>

                                                )}


                                                <div className="client-onboarding-country-overlay" />


                                                <div className="client-onboarding-country-arrow">

                                                    <HiOutlineArrowRight />

                                                </div>

                                            </div>


                                            <div className="client-onboarding-country-content">

                                                <h3>
                                                    {country.name}
                                                </h3>

                                                <span>

                                                    {
                                                        country
                                                            .opportunities
                                                            .length
                                                    }

                                                    {" "}

                                                    {
                                                        country
                                                            .opportunities
                                                            .length === 1
                                                            ? "pathway"
                                                            : "pathways"
                                                    }

                                                </span>

                                            </div>

                                        </button>

                                    );

                                },
                            )}

                        </div>

                    )}

                </section>

            )}


            {/* ==================================================
                PATHWAY DISCOVERY
            ================================================== */}

            {selectedCountry &&
                !viewingOpportunity && (

                    <section className="client-onboarding-opportunities">

                        <button
                            type="button"
                            className="client-onboarding-back"
                            onClick={
                                handleBackToCountries
                            }
                        >

                            <HiOutlineArrowLeft />

                            Back to destinations

                        </button>


                        <div className="client-onboarding-selected-country">

                            <div className="client-onboarding-selected-country-image">

                                {selectedCountryImage ? (

                                    <img
                                        src={
                                            selectedCountryImage
                                        }
                                        alt=""
                                    />

                                ) : (

                                    <HiOutlineGlobeAlt />

                                )}

                            </div>


                            <div>

                                <span>
                                    DESTINATION
                                </span>

                                <h2>
                                    {selectedCountry.name}
                                </h2>

                                <p>
                                    Explore the migration
                                    pathways available for
                                    this destination.
                                </p>

                            </div>

                        </div>


                        <div className="client-onboarding-pathway-header">

                            <div>

                                <span>
                                    AVAILABLE PATHWAYS
                                </span>

                                <h2>
                                    Choose what fits your plans
                                </h2>

                            </div>


                            <p>
                                Open a pathway to review its
                                full details, requirements,
                                documents, benefits and pricing
                                before continuing.
                            </p>

                        </div>


                        <div className="client-onboarding-pathway-grid">

                            {selectedCountry.opportunities.map(
                                (opportunity) => {

                                    return (

                                        <button
                                            type="button"
                                            key={
                                                opportunity?._id
                                            }
                                            className="client-onboarding-pathway-card"
                                            onClick={() =>
                                                handleViewOpportunity(
                                                    opportunity,
                                                )
                                            }
                                        >

                                            <div className="client-onboarding-pathway-icon">

                                                <HiOutlineGlobeAlt />

                                            </div>


                                            <span>
                                                {
                                                    getOpportunityCategory(
                                                        opportunity,
                                                    )
                                                }
                                            </span>


                                            <h3>
                                                {
                                                    getOpportunityTitle(
                                                        opportunity,
                                                    )
                                                }
                                            </h3>


                                            <p>
                                                {
                                                    getOpportunityDescription(
                                                        opportunity,
                                                    )
                                                }
                                            </p>


                                            <div className="client-onboarding-pathway-meta">

                                                {opportunity?.duration && (

                                                    <span>

                                                        <HiOutlineClock />

                                                        {
                                                            opportunity.duration
                                                        }

                                                    </span>

                                                )}


                                                {opportunity?.salary && (

                                                    <span>
                                                        {
                                                            opportunity.salary
                                                        }
                                                    </span>

                                                )}

                                            </div>


                                            <strong>

                                                View full pathway

                                                <HiOutlineArrowRight />

                                            </strong>

                                        </button>

                                    );

                                },
                            )}

                        </div>

                    </section>

                )}


            {/* ==================================================
                PATHWAY DETAILS
            ================================================== */}

            {selectedCountry &&
                viewingOpportunity && (

                    <section className="client-onboarding-opportunities">

                        <button
                            type="button"
                            className="client-onboarding-back"
                            onClick={
                                handleBackToPathways
                            }
                        >

                            <HiOutlineArrowLeft />

                            Back to pathways

                        </button>


                        <article className="client-onboarding-details">


                            {/* ==================================================
                                DETAIL HERO
                            ================================================== */}

                            <header className="client-onboarding-details-hero">

                                <div className="client-onboarding-details-hero-icon">

                                    <HiOutlineGlobeAlt />

                                </div>


                                <div className="client-onboarding-details-hero-content">

                                    <span>
                                        {
                                            getOpportunityCategory(
                                                viewingOpportunity,
                                            )
                                        }
                                    </span>


                                    <h1>
                                        {
                                            getOpportunityTitle(
                                                viewingOpportunity,
                                            )
                                        }
                                    </h1>


                                    <div className="client-onboarding-details-location">

                                        <HiOutlineGlobeAlt />

                                        {selectedCountry.name}


                                        {viewingOpportunity?.location && (

                                            <>
                                                <span>
                                                    •
                                                </span>

                                                {
                                                    viewingOpportunity.location
                                                }
                                            </>

                                        )}

                                    </div>

                                </div>

                            </header>


                            {/* ==================================================
                                QUICK FACTS
                            ================================================== */}

                            <div className="client-onboarding-detail-facts">

                                <div className="client-onboarding-detail-fact">

                                    <span>
                                        DESTINATION
                                    </span>

                                    <strong>
                                        {selectedCountry.name}
                                    </strong>

                                </div>


                                <div className="client-onboarding-detail-fact">

                                    <span>
                                        PATHWAY TYPE
                                    </span>

                                    <strong>
                                        {
                                            getOpportunityCategory(
                                                viewingOpportunity,
                                            )
                                        }
                                    </strong>

                                </div>


                                {viewingOpportunity?.type && (

                                    <div className="client-onboarding-detail-fact">

                                        <span>
                                            PROGRAM TYPE
                                        </span>

                                        <strong>
                                            {
                                                viewingOpportunity.type
                                            }
                                        </strong>

                                    </div>

                                )}


                                {viewingOpportunity?.duration && (

                                    <div className="client-onboarding-detail-fact">

                                        <span>
                                            DURATION
                                        </span>

                                        <strong>
                                            {
                                                viewingOpportunity.duration
                                            }
                                        </strong>

                                    </div>

                                )}


                                {viewingOpportunity?.salary && (

                                    <div className="client-onboarding-detail-fact">

                                        <span>
                                            SALARY
                                        </span>

                                        <strong>
                                            {
                                                viewingOpportunity.salary
                                            }
                                        </strong>

                                    </div>

                                )}


                                {viewingOpportunity?.demand && (

                                    <div className="client-onboarding-detail-fact">

                                        <span>
                                            DEMAND
                                        </span>

                                        <strong>
                                            {
                                                viewingOpportunity.demand
                                            }
                                        </strong>

                                    </div>

                                )}

                            </div>


                            {/* ==================================================
                                DETAIL CONTENT
                            ================================================== */}

                            <div className="client-onboarding-details-layout">


                                {/* ==================================================
                                    MAIN CONTENT
                                ================================================== */}

                                <div className="client-onboarding-details-main">


                                    {/* OVERVIEW */}

                                    <section className="client-onboarding-detail-section">

                                        <span className="client-onboarding-details-label">
                                            ABOUT THIS PATHWAY
                                        </span>


                                        <h2>
                                            {
                                                getOpportunityTitle(
                                                    viewingOpportunity,
                                                )
                                            }
                                        </h2>


                                        <p className="client-onboarding-detail-description">

                                            {
                                                getOpportunityDescription(
                                                    viewingOpportunity,
                                                )
                                            }

                                        </p>

                                    </section>


                                    {/* HIGHLIGHTS */}

                                    {Array.isArray(
                                        viewingOpportunity?.highlights,
                                    ) &&
                                        viewingOpportunity.highlights.length > 0 && (

                                            <section className="client-onboarding-detail-section">

                                                <span className="client-onboarding-details-label">
                                                    PATHWAY HIGHLIGHTS
                                                </span>


                                                <h2>
                                                    What this pathway offers
                                                </h2>


                                                <div className="client-onboarding-highlight-grid">

                                                    {viewingOpportunity.highlights.map(
                                                        (
                                                            highlight,
                                                            index,
                                                        ) => (

                                                            <div
                                                                className="client-onboarding-highlight"
                                                                key={`${highlight}-${index}`}
                                                            >

                                                                <HiOutlineCheckCircle />

                                                                <span>
                                                                    {
                                                                        highlight
                                                                    }
                                                                </span>

                                                            </div>

                                                        ),
                                                    )}

                                                </div>

                                            </section>

                                        )}


                                    {/* BENEFITS */}

                                    {Array.isArray(
                                        viewingOpportunity?.benefits,
                                    ) &&
                                        viewingOpportunity.benefits.length > 0 && (

                                            <section className="client-onboarding-detail-section">

                                                <span className="client-onboarding-details-label">
                                                    BENEFITS
                                                </span>


                                                <h2>
                                                    What you get
                                                </h2>


                                                {
                                                    renderListItems(
                                                        viewingOpportunity.benefits,
                                                    )
                                                }

                                            </section>

                                        )}


                                    {/* REQUIREMENTS */}

                                    {Array.isArray(
                                        viewingOpportunity?.requirements,
                                    ) &&
                                        viewingOpportunity.requirements.length > 0 && (

                                            <section className="client-onboarding-detail-section">

                                                <span className="client-onboarding-details-label">
                                                    REQUIREMENTS
                                                </span>


                                                <h2>
                                                    What you need
                                                </h2>


                                                {
                                                    renderListItems(
                                                        viewingOpportunity.requirements,
                                                    )
                                                }

                                            </section>

                                        )}


                                    {/* DOCUMENTS */}

                                    {Array.isArray(
                                        viewingOpportunity?.documents,
                                    ) &&
                                        viewingOpportunity.documents.length > 0 && (

                                            <section className="client-onboarding-detail-section">

                                                <span className="client-onboarding-details-label">
                                                    DOCUMENTS
                                                </span>


                                                <h2>
                                                    Documents you may need
                                                </h2>


                                                {
                                                    renderListItems(
                                                        viewingOpportunity.documents,
                                                    )
                                                }

                                            </section>

                                        )}


                                    {/* APPLICATION DOCUMENTS */}

                                    {requiredDocuments.length > 0 && (

                                        <section className="client-onboarding-detail-section">

                                            <span className="client-onboarding-details-label">
                                                APPLICATION DOCUMENTS
                                            </span>


                                            <h2>
                                                Required for this application
                                            </h2>


                                            <div className="client-onboarding-required-documents">

                                                {requiredDocuments.map(
                                                    (
                                                        document,
                                                        index,
                                                    ) => (

                                                        <div
                                                            className="client-onboarding-required-document"
                                                            key={
                                                                `${document?.name || "document"}-${index}`
                                                            }
                                                        >

                                                            <div className="client-onboarding-required-document-icon">

                                                                <HiOutlineDocumentText />

                                                            </div>


                                                            <div>

                                                                <strong>
                                                                    {
                                                                        document?.name ||
                                                                        "Required document"
                                                                    }
                                                                </strong>


                                                                {document?.description && (

                                                                    <p>
                                                                        {
                                                                            document.description
                                                                        }
                                                                    </p>

                                                                )}


                                                                {document?.required !== false && (

                                                                    <span>
                                                                        Required
                                                                    </span>

                                                                )}

                                                            </div>

                                                        </div>

                                                    ),
                                                )}

                                            </div>

                                        </section>

                                    )}


                                    {/* STEPS */}

                                    {Array.isArray(
                                        viewingOpportunity?.steps,
                                    ) &&
                                        viewingOpportunity.steps.length > 0 && (

                                            <section className="client-onboarding-detail-section">

                                                <span className="client-onboarding-details-label">
                                                    YOUR JOURNEY
                                                </span>


                                                <h2>
                                                    How the pathway works
                                                </h2>


                                                <div className="client-onboarding-steps">

                                                    {viewingOpportunity.steps.map(
                                                        (
                                                            step,
                                                            index,
                                                        ) => (

                                                            <div
                                                                className="client-onboarding-step"
                                                                key={`${step?.title || "step"}-${index}`}
                                                            >

                                                                <div className="client-onboarding-step-number">

                                                                    {String(
                                                                        index + 1,
                                                                    ).padStart(
                                                                        2,
                                                                        "0",
                                                                    )}

                                                                </div>


                                                                <div className="client-onboarding-step-content">

                                                                    <div className="client-onboarding-step-heading">

                                                                        <h3>
                                                                            {
                                                                                step?.title ||
                                                                                `Step ${index + 1}`
                                                                            }
                                                                        </h3>


                                                                        {step?.duration && (

                                                                            <span>

                                                                                <HiOutlineClock />

                                                                                {
                                                                                    step.duration
                                                                                }

                                                                            </span>

                                                                        )}

                                                                    </div>


                                                                    {step?.description && (

                                                                        <p>
                                                                            {
                                                                                step.description
                                                                            }
                                                                        </p>

                                                                    )}

                                                                </div>

                                                            </div>

                                                        ),
                                                    )}

                                                </div>

                                            </section>

                                        )}


                                    {/* POSITIONS */}

                                    {Array.isArray(
                                        viewingOpportunity?.positions,
                                    ) &&
                                        viewingOpportunity.positions.length > 0 && (

                                            <section className="client-onboarding-detail-section">

                                                <span className="client-onboarding-details-label">
                                                    AVAILABLE POSITIONS
                                                </span>


                                                <h2>
                                                    Opportunities available
                                                </h2>


                                                <div className="client-onboarding-mixed-grid">

                                                    {viewingOpportunity.positions.map(
                                                        (
                                                            position,
                                                            index,
                                                        ) => (

                                                            <div
                                                                className="client-onboarding-mixed-card"
                                                                key={`position-${index}`}
                                                            >

                                                                <strong>

                                                                    {
                                                                        typeof position === "string"
                                                                            ? position
                                                                            : position?.title ||
                                                                            position?.name ||
                                                                            `Position ${index + 1}`
                                                                    }

                                                                </strong>


                                                                {typeof position === "object" && (

                                                                    <p>

                                                                        {
                                                                            formatValue(
                                                                                position,
                                                                            )
                                                                        }

                                                                    </p>

                                                                )}

                                                            </div>

                                                        ),
                                                    )}

                                                </div>

                                            </section>

                                        )}


                                    {/* WORK CONDITIONS */}

                                    {viewingOpportunity?.workConditions && (

                                        <section className="client-onboarding-detail-section">

                                            <span className="client-onboarding-details-label">
                                                WORK CONDITIONS
                                            </span>


                                            <h2>
                                                Work information
                                            </h2>


                                            <div className="client-onboarding-information-grid">

                                                {getObjectEntries(
                                                    viewingOpportunity.workConditions,
                                                ).map(
                                                    (
                                                        [key, value],
                                                    ) => (

                                                        <div
                                                            className="client-onboarding-information-item"
                                                            key={key}
                                                        >

                                                            <span>
                                                                {
                                                                    formatLabel(
                                                                        key,
                                                                    )
                                                                }
                                                            </span>


                                                            <strong>
                                                                {
                                                                    formatValue(
                                                                        value,
                                                                    )
                                                                }
                                                            </strong>

                                                        </div>

                                                    ),
                                                )}

                                            </div>

                                        </section>

                                    )}


                                    {/* CONTRACT */}

                                    {viewingOpportunity?.contract && (

                                        <section className="client-onboarding-detail-section">

                                            <span className="client-onboarding-details-label">
                                                CONTRACT
                                            </span>


                                            <h2>
                                                Contract information
                                            </h2>


                                            <p className="client-onboarding-detail-description">

                                                {
                                                    viewingOpportunity.contract
                                                }

                                            </p>

                                        </section>

                                    )}


                                    {/* PAYMENT PLAN */}

                                    {Array.isArray(
                                        viewingOpportunity?.paymentPlan,
                                    ) &&
                                        viewingOpportunity.paymentPlan.length > 0 && (

                                            <section className="client-onboarding-detail-section">

                                                <span className="client-onboarding-details-label">
                                                    PAYMENT PLAN
                                                </span>


                                                <h2>
                                                    How payments work
                                                </h2>


                                                <div className="client-onboarding-payment-list">

                                                    {viewingOpportunity.paymentPlan.map(
                                                        (
                                                            payment,
                                                            index,
                                                        ) => (

                                                            <div
                                                                className="client-onboarding-payment-item"
                                                                key={`payment-${index}`}
                                                            >

                                                                <div className="client-onboarding-payment-number">

                                                                    {index + 1}

                                                                </div>


                                                                <div>

                                                                    <strong>

                                                                        {
                                                                            typeof payment === "string"
                                                                                ? payment
                                                                                : payment?.title ||
                                                                                payment?.name ||
                                                                                `Payment ${index + 1}`
                                                                        }

                                                                    </strong>


                                                                    {typeof payment === "object" && (

                                                                        <p>

                                                                            {
                                                                                formatValue(
                                                                                    payment,
                                                                                )
                                                                            }

                                                                        </p>

                                                                    )}

                                                                </div>

                                                            </div>

                                                        ),
                                                    )}

                                                </div>

                                            </section>

                                        )}


                                    {/* TERMS */}

                                    {Array.isArray(
                                        viewingOpportunity?.terms,
                                    ) &&
                                        viewingOpportunity.terms.length > 0 && (

                                            <section className="client-onboarding-detail-section">

                                                <span className="client-onboarding-details-label">
                                                    TERMS & CONDITIONS
                                                </span>


                                                <h2>
                                                    Important information
                                                </h2>


                                                {
                                                    renderListItems(
                                                        viewingOpportunity.terms,
                                                    )
                                                }

                                            </section>

                                        )}


                                    {/* FAQ */}

                                    {Array.isArray(
                                        viewingOpportunity?.faq,
                                    ) &&
                                        viewingOpportunity.faq.length > 0 && (

                                            <section className="client-onboarding-detail-section">

                                                <span className="client-onboarding-details-label">
                                                    FREQUENTLY ASKED QUESTIONS
                                                </span>


                                                <h2>
                                                    Before you continue
                                                </h2>


                                                <div className="client-onboarding-faq">

                                                    {viewingOpportunity.faq.map(
                                                        (
                                                            item,
                                                            index,
                                                        ) => {

                                                            const question =
                                                                typeof item === "string"
                                                                    ? item
                                                                    : item?.question ||
                                                                    item?.title ||
                                                                    `Question ${index + 1}`;


                                                            const answer =
                                                                typeof item === "object"
                                                                    ? item?.answer ||
                                                                    item?.description ||
                                                                    item?.response ||
                                                                    ""
                                                                    : "";


                                                            return (

                                                                <div
                                                                    className="client-onboarding-faq-item"
                                                                    key={`faq-${index}`}
                                                                >

                                                                    <div className="client-onboarding-faq-question">

                                                                        <HiOutlineInformationCircle />

                                                                        <strong>
                                                                            {
                                                                                question
                                                                            }
                                                                        </strong>

                                                                    </div>


                                                                    {answer && (

                                                                        <p>
                                                                            {
                                                                                answer
                                                                            }
                                                                        </p>

                                                                    )}

                                                                </div>

                                                            );

                                                        },
                                                    )}

                                                </div>

                                            </section>

                                        )}

                                </div>


                                {/* ==================================================
                                    STICKY SIDEBAR
                                ================================================== */}

                                <aside className="client-onboarding-details-sidebar">


                                    {/* PRICING */}

                                    <div className="client-onboarding-price-card">

                                        <span>
                                            PATHWAY PRICING
                                        </span>


                                        {pricingItems.length > 0 ? (

                                            <div className="client-onboarding-pricing-values">

                                                {pricingItems.map(
                                                    (
                                                        item,
                                                        index,
                                                    ) => (

                                                        <div
                                                            className={
                                                                index === 0
                                                                    ? "client-onboarding-pricing-primary"
                                                                    : "client-onboarding-pricing-secondary"
                                                            }
                                                            key={`${item.label}-${index}`}
                                                        >

                                                            <small>
                                                                {
                                                                    item.label
                                                                }
                                                            </small>


                                                            <strong>
                                                                {
                                                                    item.value
                                                                }
                                                            </strong>

                                                        </div>

                                                    ),
                                                )}

                                            </div>

                                        ) : (

                                            <strong className="client-onboarding-price-unavailable">

                                                Pricing available during consultation

                                            </strong>

                                        )}

                                    </div>


                                    {/* QUICK SUMMARY */}

                                    <div className="client-onboarding-sidebar-card">

                                        <span>
                                            PATHWAY SUMMARY
                                        </span>


                                        <div className="client-onboarding-sidebar-row">

                                            <span>
                                                Destination
                                            </span>


                                            <strong>
                                                {selectedCountry.name}
                                            </strong>

                                        </div>


                                        <div className="client-onboarding-sidebar-row">

                                            <span>
                                                Category
                                            </span>


                                            <strong>
                                                {
                                                    getOpportunityCategory(
                                                        viewingOpportunity,
                                                    )
                                                }
                                            </strong>

                                        </div>


                                        {viewingOpportunity?.duration && (

                                            <div className="client-onboarding-sidebar-row">

                                                <span>
                                                    Duration
                                                </span>


                                                <strong>
                                                    {
                                                        viewingOpportunity.duration
                                                    }
                                                </strong>

                                            </div>

                                        )}


                                        {viewingOpportunity?.countryProcessingTime && (

                                            <div className="client-onboarding-sidebar-row">

                                                <span>
                                                    Processing
                                                </span>


                                                <strong>
                                                    {
                                                        viewingOpportunity.countryProcessingTime
                                                    }
                                                </strong>

                                            </div>

                                        )}

                                    </div>


                                    {/* DOCUMENT COUNT */}

                                    {(requiredDocuments.length > 0 ||
                                        viewingOpportunity?.documents?.length > 0) && (

                                            <div className="client-onboarding-sidebar-card">

                                                <div className="client-onboarding-sidebar-icon">

                                                    <HiOutlineDocumentText />

                                                </div>


                                                <strong>
                                                    Document preparation
                                                </strong>


                                                <p>
                                                    Review the document requirements
                                                    before beginning your application.
                                                </p>

                                            </div>

                                        )}


                                    {/* NOTICE */}

                                    <div className="client-onboarding-sidebar-notice">

                                        <HiOutlineCheckCircle />

                                        <p>
                                            You can review this pathway
                                            before deciding whether to
                                            continue.
                                        </p>

                                    </div>

                                </aside>

                            </div>


                            {/* ==================================================
                                CTA
                            ================================================== */}

                            <footer className="client-onboarding-details-footer">

                                <div>

                                    <span>
                                        READY TO CONTINUE?
                                    </span>


                                    <strong>
                                        {
                                            getOpportunityTitle(
                                                viewingOpportunity,
                                            )
                                        }
                                    </strong>


                                    <p>
                                        {startingApplication
                                            ? "Starting your application..."
                                            : "Continue to your application when you're ready."}
                                    </p>

                                </div>


                                <button
                                    type="button"
                                    onClick={
                                        handleContinue
                                    }
                                    disabled={
                                        startingApplication
                                    }
                                >

                                    {startingApplication
                                        ? "Starting application..."
                                        : "Continue with this pathway"}


                                    {!startingApplication && (

                                        <HiOutlineArrowRight />

                                    )}

                                </button>

                            </footer>

                        </article>

                    </section>

                )}


            {/* ==================================================
                SUPPORT
            ================================================== */}

            {!viewingOpportunity && (

                <section className="client-onboarding-support">

                    <div>

                        <span>
                            YOUR JOURNEY, YOUR PACE
                        </span>


                        <h2>
                            Explore before you decide.
                        </h2>


                        <p>
                            Review pathways, requirements and
                            available options before starting
                            your application.
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={() =>
                            window.scrollTo({
                                top: 0,
                                behavior: "smooth",
                            })
                        }
                    >

                        Explore destinations

                        <HiOutlineArrowRight />

                    </button>

                </section>

            )}


            {/* ==================================================
                PROFILE REQUIRED MODAL
            ================================================== */}

            {showProfileRequiredModal && (

                <div
                    className="client-onboarding-modal-backdrop"
                    role="presentation"
                    onClick={() =>
                        setShowProfileRequiredModal(false)
                    }
                >

                    <div
                        className="client-onboarding-profile-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="profile-required-title"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        <div className="client-onboarding-profile-modal-icon">

                            <HiOutlineUser />

                        </div>


                        <div className="client-onboarding-profile-modal-content">

                            <span>
                                BEFORE YOU START
                            </span>


                            <h2 id="profile-required-title">
                                Complete your profile first
                            </h2>


                            <p>
                                Before you can start this migration
                                application, you need to complete your
                                client profile.
                            </p>


                            <p>
                                Your profile information is required to
                                prepare your application and determine
                                the information and documents you need
                                to provide.
                            </p>


                            <div className="client-onboarding-profile-modal-pathway">

                                <strong>
                                    Selected pathway
                                </strong>


                                <span>
                                    {
                                        getOpportunityTitle(
                                            viewingOpportunity,
                                        )
                                    }
                                </span>

                            </div>


                            <div className="client-onboarding-profile-modal-actions">

                                <button
                                    type="button"
                                    className="client-onboarding-profile-modal-secondary"
                                    onClick={() =>
                                        setShowProfileRequiredModal(false)
                                    }
                                >

                                    Go back

                                </button>


                                <button
                                    type="button"
                                    className="client-onboarding-profile-modal-primary"
                                    onClick={
                                        handleProceedToProfile
                                    }
                                >

                                    Complete my profile

                                    <HiOutlineArrowRight />

                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            )}

        </main>

    );

};


export default ClientOnboarding;