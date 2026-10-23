import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useLocation,
    useNavigate,
} from "react-router-dom";

import {
    HiOutlineArrowLeft,
    HiOutlineArrowRight,
    HiOutlineCheckCircle,
    HiOutlineChevronRight,
    HiOutlineDocumentText,
    HiOutlineGlobeAlt,
    HiOutlineSearch,
    HiOutlineUser,
    HiOutlineX,
} from "react-icons/hi";

import opportunityService
    from "../../services/opportunity.service.js";

import applicationService
    from "../../services/application.service.js";

import WorkflowStepper
    from "../../components/ClientPortal/applications/NewApplication/WorkflowStepper/WorkflowStepper.jsx";

import NewApplicationHeader
    from "../../components/ClientPortal/applications/NewApplication/NewApplicationHeader/NewApplicationHeader.jsx";

import ChoosePathwayPanel
    from "../../components/ClientPortal/applications/NewApplication/ChoosePathwayPanel/ChoosePathwayPanel.jsx";

import OpportunityPreview
    from "../../components/ClientPortal/applications/NewApplication/OpportunityPreview/OpportunityPreview.jsx";

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

import "./NewApplication.css";

const COUNTRY_IMAGES = {
    canada,

    "united states": null,
    usa: null,

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

const normalizeCountryName = (value) => {
    return String(value || "")
        .trim()
        .toLowerCase()
        .replace(/[_-]+/g, " ")
        .replace(/\s+/g, " ");
};

const normalizeOpportunitySlug = (value) => {
    return String(value || "")
        .trim()
        .toLowerCase()
        .replace(/^\/+|\/+$/g, "");
};

const getOpportunityId = (opportunity) => {
    return (
        opportunity?._id ||
        opportunity?.id ||
        opportunity?.legacyId ||
        null
    );
};

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

            const image =
                COUNTRY_IMAGES[normalized];

            if (image) {
                return image;
            }

        }

    }

    return null;
};

const NewApplication = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const PENDING_APPLICATION_KEY =
        "colossus_pending_application";

    const PENDING_APPLICATION_RETURN_KEY =
        "colossus_pending_application_return_to";

    const storedPendingApplication = useMemo(() => {
        try {
            const raw = sessionStorage.getItem(
                PENDING_APPLICATION_KEY,
            );

            return raw ? JSON.parse(raw) : null;
        } catch (storageError) {
            console.error(
                "Unable to restore pending application context:",
                storageError,
            );

            return null;
        }
    }, []);

    const pendingOpportunity =
        location.state?.opportunity ||
        storedPendingApplication?.opportunity ||
        null;

    const pendingOpportunityId =
        location.state?.opportunityId ||
        storedPendingApplication?.opportunityId ||
        getOpportunityId(storedPendingApplication?.opportunity) ||
        null;

    const pendingOpportunitySlug =
        location.state?.opportunitySlug ||
        storedPendingApplication?.opportunitySlug ||
        storedPendingApplication?.opportunity?.slug ||
        null;

    const pendingCountrySlug =
        location.state?.countrySlug ||
        storedPendingApplication?.countrySlug ||
        storedPendingApplication?.opportunity?.countrySlug ||
        null;

    const [opportunities, setOpportunities] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [selectedCountry, setSelectedCountry] =
        useState(null);

    const [countrySearch, setCountrySearch] =
        useState("");

    const [selectedOpportunity, setSelectedOpportunity] =
        useState(null);

    const [startingApplication, setStartingApplication] =
        useState(false);

    const [profilePrompt, setProfilePrompt] =
        useState(null);

    const [error, setError] =
        useState("");

    const [filters, setFilters] = useState({
        search: "",
        category: "",
    });

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

            } catch (error) {

                if (!mounted) {
                    return;
                }

                console.error(
                    "FAILED TO LOAD OPPORTUNITIES:",
                    error,
                );

                setError(
                    error?.response?.data?.message ||
                    "Unable to load migration opportunities. Please try again.",
                );

                setOpportunities([]);

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

    const pendingOpportunityFromApi = useMemo(() => {

        if (!opportunities.length) {
            return null;
        }

        if (pendingOpportunityId) {

            const byId =
                opportunities.find(
                    (opportunity) =>
                        String(
                            getOpportunityId(
                                opportunity,
                            ),
                        ) ===
                        String(
                            pendingOpportunityId,
                        ),
                );

            if (byId) {
                return byId;
            }

        }

        if (
            pendingOpportunitySlug
        ) {

            const targetSlug =
                normalizeOpportunitySlug(
                    pendingOpportunitySlug,
                );

            const targetCountry =
                normalizeCountryName(
                    pendingCountrySlug,
                );

            const bySlug =
                opportunities.find(
                    (opportunity) => {

                        const opportunitySlug =
                            normalizeOpportunitySlug(
                                opportunity?.slug,
                            );

                        const opportunityCountry =
                            normalizeCountryName(
                                opportunity?.countrySlug,
                            );

                        const slugMatches =
                            opportunitySlug ===
                            targetSlug;

                        const countryMatches =
                            !targetCountry ||
                            opportunityCountry ===
                            targetCountry;

                        return (
                            slugMatches &&
                            countryMatches
                        );

                    },
                );

            if (bySlug) {
                return bySlug;
            }

        }

        if (pendingOpportunity) {

            const passedId =
                getOpportunityId(
                    pendingOpportunity,
                );

            if (passedId) {

                const byPassedId =
                    opportunities.find(
                        (opportunity) =>
                            String(
                                getOpportunityId(
                                    opportunity,
                                ),
                            ) ===
                            String(
                                passedId,
                            ),
                    );

                if (byPassedId) {
                    return byPassedId;
                }

            }

            const passedSlug =
                normalizeOpportunitySlug(
                    pendingOpportunity?.slug,
                );

            if (passedSlug) {

                const byPassedSlug =
                    opportunities.find(
                        (opportunity) =>
                            normalizeOpportunitySlug(
                                opportunity?.slug,
                            ) ===
                            passedSlug,
                    );

                if (byPassedSlug) {
                    return byPassedSlug;
                }

            }

        }

        return null;

    }, [
        opportunities,
        pendingOpportunity,
        pendingOpportunityId,
        pendingOpportunitySlug,
        pendingCountrySlug,
    ]);

    useEffect(() => {

        if (
            !pendingOpportunityFromApi ||
            loading
        ) {
            return;
        }

        const opportunity =
            pendingOpportunityFromApi;

        const countryName =
            opportunity?.countryName ||
            opportunity?.destinationCountry ||
            opportunity?.country ||
            "";

        if (countryName) {

            setSelectedCountry(
                countryName,
            );

        }

        setSelectedOpportunity(
            opportunity,
        );

        setCountrySearch("");

        setFilters({
            search: "",
            category: "",
        });

        window.history.replaceState(
            {},
            document.title,
            window.location.href,
        );

    }, [
        pendingOpportunityFromApi,
        loading,
    ]);

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

                const countryKey =
                    normalizeCountryName(
                        countryName,
                    );

                if (!countryMap.has(countryKey)) {

                    const country = {

                        name: countryName,

                        opportunities: [],

                        flag:
                            opportunity?.countryFlag ||
                            opportunity?.flag ||
                            null,

                        slug:
                            opportunity?.countrySlug ||
                            opportunity?.countryCode ||
                            countryKey
                                .replace(
                                    /\s+/g,
                                    "-",
                                ),

                        countryCode:
                            opportunity?.countryCode ||
                            opportunity?.code ||
                            "",

                    };

                    country.image =
                        getCountryImage(
                            country,
                        );

                    countryMap.set(
                        countryKey,
                        country,
                    );

                }

                countryMap
                    .get(countryKey)
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

    }, [
        opportunities,
    ]);

    const filteredCountries = useMemo(() => {

        const search =
            countrySearch
                .trim()
                .toLowerCase();

        if (!search) {
            return countries;
        }

        return countries.filter(
            (country) => {

                const searchableText = [

                    country.name,

                    country.slug,

                    country.countryCode,

                ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();

                return searchableText.includes(
                    search,
                );

            },
        );

    }, [
        countries,
        countrySearch,
    ]);

    const selectedCountryData = useMemo(() => {

        if (!selectedCountry) {
            return null;
        }

        const selectedKey =
            normalizeCountryName(
                selectedCountry,
            );

        return (
            countries.find(
                (country) =>
                    normalizeCountryName(
                        country.name,
                    ) === selectedKey,
            ) || null
        );

    }, [
        countries,
        selectedCountry,
    ]);

    const categories = useMemo(() => {

        if (!selectedCountryData) {
            return [];
        }

        const values = [];

        selectedCountryData.opportunities.forEach(
            (opportunity) => {

                if (opportunity?.category) {

                    values.push(
                        opportunity.category,
                    );

                }

                if (
                    Array.isArray(
                        opportunity?.countryCategories,
                    )
                ) {

                    values.push(
                        ...opportunity.countryCategories,
                    );

                }

            },
        );

        return [
            ...new Set(
                values
                    .filter(Boolean)
                    .map(
                        (value) =>
                            String(value).trim(),
                    )
                    .filter(Boolean),
            ),
        ].sort();

    }, [
        selectedCountryData,
    ]);

    const filteredOpportunities = useMemo(() => {

        if (!selectedCountryData) {
            return [];
        }

        const search =
            filters.search
                .trim()
                .toLowerCase();

        return selectedCountryData.opportunities.filter(
            (opportunity) => {

                const searchableText = [

                    opportunity?.title,

                    opportunity?.countryName,

                    opportunity?.description,

                    opportunity?.category,

                    opportunity?.type,

                    opportunity?.location,

                    opportunity?.salary,

                    opportunity?.demand,

                    ...(Array.isArray(
                        opportunity?.highlights,
                    )
                        ? opportunity.highlights
                        : []),

                ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();

                const matchesSearch =
                    !search ||
                    searchableText.includes(
                        search,
                    );

                const opportunityCategories =
                    Array.isArray(
                        opportunity?.countryCategories,
                    )
                        ? opportunity.countryCategories
                        : [];

                const matchesCategory =
                    !filters.category ||
                    opportunity?.category ===
                    filters.category ||
                    opportunityCategories.includes(
                        filters.category,
                    );

                return (
                    matchesSearch &&
                    matchesCategory
                );

            },
        );

    }, [
        selectedCountryData,
        filters,
    ]);

    const handleSelectCountry = (country) => {

        if (!country?.name) {
            return;
        }

        setError("");

        setSelectedCountry(
            country.name,
        );

        setCountrySearch("");

        setFilters({
            search: "",
            category: "",
        });

        setSelectedOpportunity(
            null,
        );

    };

    const handleBackToCountries = () => {

        if (startingApplication) {
            return;
        }

        setSelectedCountry(null);

        setSelectedOpportunity(null);

        setCountrySearch("");

        setFilters({
            search: "",
            category: "",
        });

        setError("");

    };

    const handleSearchChange = (value) => {

        setFilters(
            (previous) => ({

                ...previous,

                search: value,

            }),
        );

    };

    const handleCategoryChange = (value) => {

        setFilters(
            (previous) => ({

                ...previous,

                category: value,

            }),
        );

    };

    const handleSelectOpportunity = (
        opportunity,
    ) => {

        if (!opportunity) {
            return;
        }

        setError("");

        setSelectedOpportunity(
            opportunity,
        );

    };

    const handleClosePreview = () => {

        if (startingApplication) {
            return;
        }

        setSelectedOpportunity(
            null,
        );

    };

    const handleCloseProfilePrompt = () => {

        if (startingApplication) {
            return;
        }

        setProfilePrompt(
            null,
        );

    };

    const handleChooseAnotherPathway = () => {

        setProfilePrompt(null);

        setSelectedOpportunity(null);

        setError("");

    };

    const handleContinueToProfile = () => {
        if (!profilePrompt?.opportunityId) {
            return;
        }

        const opportunity = profilePrompt.opportunity;

        const pendingApplication = {
            opportunityId: profilePrompt.opportunityId,
            opportunity,
            opportunitySlug: opportunity?.slug || null,
            countrySlug: opportunity?.countrySlug || null,
            source: "new-application-profile-gate",
        };

        try {
            sessionStorage.setItem(
                PENDING_APPLICATION_KEY,
                JSON.stringify(pendingApplication),
            );

            sessionStorage.setItem(
                PENDING_APPLICATION_RETURN_KEY,
                "/portal/applications/new",
            );
        } catch (storageError) {
            console.error(
                "Unable to save pending application context:",
                storageError,
            );

            setError(
                "We couldn't save your selected pathway. Please try again.",
            );

            return;
        }

        navigate(
            "/portal/profile?returnTo=/portal/applications/new",
        );
    };

    const handleStartApplication =
        async () => {

            if (
                !selectedOpportunity ||
                startingApplication
            ) {
                return;
            }

            try {

                setStartingApplication(
                    true,
                );

                setError("");

                const profileCompletion =
                    await applicationService
                        .getProfileCompletion();

                console.log(
                    "PROFILE COMPLETION:",
                    profileCompletion,
                );

                if (
                    !profileCompletion?.isComplete
                ) {

                    setProfilePrompt({

                        open: true,

                        opportunityId:
                            getOpportunityId(
                                selectedOpportunity,
                            ),

                        opportunity:
                            selectedOpportunity,

                        missingProfileFields:
                            profileCompletion
                                ?.missingFields ||
                            [],

                        percentage:
                            profileCompletion
                                ?.percentage ||
                            0,

                    });

                    return;

                }

                const opportunityId =
                    getOpportunityId(
                        selectedOpportunity,
                    );

                if (!opportunityId) {

                    throw new Error(
                        "This migration pathway could not be identified. Please choose the pathway again.",
                    );

                }

                const result =
                    await applicationService
                        .createApplication({

                            opportunity:
                                opportunityId,

                            destinationCountry:
                                selectedOpportunity
                                    .countryName,

                        });

                console.log(
                    "CREATE APPLICATION RESPONSE:",
                    result,
                );

                const application =
                    result?.application ||
                    result?.data?.application ||
                    result;

                if (
                    !application?._id
                ) {

                    console.error(
                        "INVALID CREATE APPLICATION RESPONSE:",
                        result,
                    );

                    throw new Error(
                        "The application was created, but no application ID was returned.",
                    );

                }

                sessionStorage.removeItem(
                    PENDING_APPLICATION_KEY,
                );

                sessionStorage.removeItem(
                    PENDING_APPLICATION_RETURN_KEY,
                );

                setSelectedOpportunity(
                    null,
                );

                navigate(
                    `/portal/applications/${application._id}`,
                );

            } catch (error) {

                console.error(
                    "FAILED TO START APPLICATION:",
                    error,
                );

                setError(
                    error?.response?.data?.message ||
                    error?.message ||
                    "Unable to start your application. Please try again.",
                );

            } finally {

                setStartingApplication(
                    false,
                );

            }

        };

    return (

        <section className="new-application">

            { }

            <WorkflowStepper
                currentStep={1}
            />

            { }

            <NewApplicationHeader
                opportunitiesCount={
                    selectedCountryData
                        ? filteredOpportunities.length
                        : countries.length
                }
            />

            { }

            {error && (

                <div
                    className="new-application-error"
                    role="alert"
                >
                    {error}
                </div>

            )}

            { }

            {!selectedCountry && (

                <div className="new-application-countries">

                    { }

                    <div className="new-application-countries-header">

                        <div>

                            <span className="new-application-section-eyebrow">
                                DESTINATION
                            </span>

                            <h2>
                                Choose your destination
                            </h2>

                            <p>
                                Select a country to explore the
                                migration pathways available there.
                            </p>

                        </div>

                        <div className="new-application-country-count">

                            <strong>
                                {countries.length}
                            </strong>

                            <span>
                                countries
                            </span>

                        </div>

                    </div>

                    { }

                    <div className="new-application-country-search">

                        <HiOutlineSearch />

                        <input
                            type="text"
                            value={countrySearch}
                            onChange={(event) =>
                                setCountrySearch(
                                    event.target.value,
                                )
                            }
                            placeholder="Search countries..."
                            aria-label="Search countries"
                        />

                    </div>

                    { }

                    {loading ? (

                        <div className="new-application-country-loading">

                            <div className="new-application-loading-spinner" />

                            <p>
                                Loading destinations...
                            </p>

                        </div>

                    ) : filteredCountries.length === 0 ? (

                        <div className="new-application-country-empty">

                            <HiOutlineGlobeAlt />

                            <h3>
                                No countries found
                            </h3>

                            <p>
                                Try searching for another destination.
                            </p>

                        </div>

                    ) : (

                        <div className="new-application-country-grid">

                            {filteredCountries.map(
                                (country) => {

                                    const countryImage =
                                        country.image ||
                                        country.flag ||
                                        null;

                                    return (

                                        <button
                                            type="button"
                                            key={country.slug}
                                            className="new-application-country-card"
                                            onClick={() =>
                                                handleSelectCountry(
                                                    country,
                                                )
                                            }
                                        >

                                            <div className="new-application-country-card-image">

                                                {countryImage ? (

                                                    <img
                                                        src={
                                                            countryImage
                                                        }
                                                        alt={`${country.name} migration`}
                                                        loading="lazy"
                                                    />

                                                ) : (

                                                    <div className="new-application-country-card-image-fallback">

                                                        <HiOutlineGlobeAlt />

                                                    </div>

                                                )}

                                                <div className="new-application-country-card-image-overlay" />

                                                <div className="new-application-country-card-arrow">

                                                    <HiOutlineArrowRight />

                                                </div>

                                            </div>

                                            <div className="new-application-country-card-content">

                                                <h3>
                                                    {country.name}
                                                </h3>

                                                <p>

                                                    {
                                                        country
                                                            .opportunities
                                                            .length
                                                    }

                                                    {" "}

                                                    {
                                                        country
                                                            .opportunities
                                                            .length ===
                                                            1
                                                            ? "pathway"
                                                            : "pathways"
                                                    }

                                                    {" "}
                                                    available

                                                </p>

                                            </div>

                                        </button>

                                    );

                                },
                            )}

                        </div>

                    )}

                </div>

            )}

            { }

            {selectedCountry && (

                <div className="new-application-country-pathways">

                    { }

                    <button
                        type="button"
                        className="new-application-back-countries"
                        onClick={
                            handleBackToCountries
                        }
                    >

                        <HiOutlineArrowLeft />

                        <span>
                            All countries
                        </span>

                    </button>

                    { }

                    <div className="new-application-selected-country-header">

                        <div className="new-application-selected-country-identity">

                            <div className="new-application-selected-country-flag">

                                {selectedCountryData?.image ? (

                                    <img
                                        src={
                                            selectedCountryData.image
                                        }
                                        alt={`${selectedCountry} migration`}
                                    />

                                ) : selectedCountryData?.flag ? (

                                    <img
                                        src={
                                            selectedCountryData.flag
                                        }
                                        alt={`${selectedCountry} flag`}
                                    />

                                ) : (

                                    <HiOutlineGlobeAlt />

                                )}

                            </div>

                            <div>

                                <span className="new-application-section-eyebrow">
                                    DESTINATION
                                </span>

                                <h2>
                                    {selectedCountry}
                                </h2>

                                <p>
                                    Explore migration pathways
                                    available in{" "}
                                    {selectedCountry}.
                                </p>

                            </div>

                        </div>

                        <div className="new-application-selected-country-count">

                            <strong>
                                {
                                    selectedCountryData
                                        ?.opportunities
                                        ?.length || 0
                                }
                            </strong>

                            <span>
                                pathways
                            </span>

                        </div>

                    </div>

                    { }

                    <ChoosePathwayPanel

                        opportunities={
                            filteredOpportunities
                        }

                        loading={
                            loading
                        }

                        search={
                            filters.search
                        }

                        category={
                            filters.category
                        }

                        categories={
                            categories
                        }

                        onSearchChange={
                            handleSearchChange
                        }

                        onCategoryChange={
                            handleCategoryChange
                        }

                        onSelect={
                            handleSelectOpportunity
                        }

                    />

                </div>

            )}

            { }

            {selectedOpportunity && (

                <OpportunityPreview

                    opportunity={
                        selectedOpportunity
                    }

                    onClose={
                        handleClosePreview
                    }

                    onStartApplication={
                        handleStartApplication
                    }

                    loading={
                        startingApplication
                    }

                />

            )}

            { }

            {profilePrompt?.open && (

                <div
                    className="application-profile-gate"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="application-profile-gate-title"
                >

                    <div
                        className="application-profile-gate-backdrop"
                        onClick={
                            handleCloseProfilePrompt
                        }
                    />

                    <div className="application-profile-gate-modal">

                        <button
                            type="button"
                            className="application-profile-gate-close"
                            onClick={
                                handleCloseProfilePrompt
                            }
                            aria-label="Close"
                        >

                            <HiOutlineX />

                        </button>

                        <div className="application-profile-gate-icon">

                            <HiOutlineUser />

                        </div>

                        <span className="application-profile-gate-eyebrow">

                            PROFILE REQUIRED

                        </span>

                        <h2 id="application-profile-gate-title">

                            Complete your profile to continue

                        </h2>

                        <p className="application-profile-gate-description">

                            Before we start your{" "}

                            <strong>
                                {
                                    profilePrompt
                                        ?.opportunity
                                        ?.title ||
                                    "migration application"
                                }
                            </strong>

                            {" "}for{" "}

                            <strong>
                                {
                                    profilePrompt
                                        ?.opportunity
                                        ?.countryName ||
                                    "your destination"
                                }
                            </strong>

                            , we need a few more details
                            from your client profile.

                        </p>

                        <div className="application-profile-gate-saved">

                            <div className="application-profile-gate-saved-icon">

                                <HiOutlineCheckCircle />

                            </div>

                            <div>

                                <strong>
                                    Your pathway has been selected
                                </strong>

                                <span>

                                    We have not created the application
                                    yet. Once your profile is complete,
                                    you'll return here and continue.

                                </span>

                            </div>

                        </div>

                        {Array.isArray(
                            profilePrompt
                                ?.missingProfileFields,
                        ) &&
                            profilePrompt
                                .missingProfileFields
                                .length > 0 && (

                                <div className="application-profile-gate-fields">

                                    <span>
                                        PROFILE COMPLETION
                                    </span>

                                    <strong>

                                        {
                                            profilePrompt
                                                .missingProfileFields
                                                .length
                                        }{" "}

                                        details required

                                    </strong>

                                </div>

                            )}

                        <div className="application-profile-gate-actions">

                            <button
                                type="button"
                                className="application-profile-gate-primary"
                                onClick={
                                    handleContinueToProfile
                                }
                            >

                                <HiOutlineUser />

                                <span>
                                    Complete My Profile
                                </span>

                                <HiOutlineArrowRight />

                            </button>

                            <button
                                type="button"
                                className="application-profile-gate-secondary"
                                onClick={
                                    handleChooseAnotherPathway
                                }
                            >

                                <HiOutlineDocumentText />

                                <span>
                                    Choose Another Pathway
                                </span>

                                <HiOutlineChevronRight />

                            </button>

                        </div>

                        <p className="application-profile-gate-footnote">

                            Your application will only be created
                            after your profile is complete.

                        </p>

                    </div>

                </div>

            )}

        </section>

    );

};

export default NewApplication;
