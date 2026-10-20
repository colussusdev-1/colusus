import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
    HiOutlineSearch,
    HiOutlineArrowRight,
    HiOutlineGlobeAlt,
    HiOutlineAdjustments,
    HiOutlineBriefcase,
    HiOutlineAcademicCap,
    HiOutlineHeart,
    HiOutlineClock,
    HiOutlineExternalLink,
    HiOutlineX,
    HiOutlineRefresh,
} from "react-icons/hi";

import opportunityService from "../../services/opportunity.service";
import normalizeOpportunities from "../Opportunities/utils/normalizeOpportunities";
import "./Pathways.css";

const CATEGORIES = [
    "All pathways",
    "Skilled Migration",
    "Work & Employment",
    "Healthcare",
    "Education",
];

const CATEGORY_ICONS = {
    "Skilled Migration": HiOutlineGlobeAlt,
    "Work & Employment": HiOutlineBriefcase,
    Healthcare: HiOutlineHeart,
    Education: HiOutlineAcademicCap,
};

function getCategory(pathway) {
    const raw = Array.isArray(pathway.category)
        ? pathway.category.join(" ")
        : String(pathway.category || pathway.type || "");

    const value = raw.toLowerCase();

    if (value.includes("health") || value.includes("nurs")) {
        return "Healthcare";
    }

    if (
        value.includes("educat") ||
        value.includes("study") ||
        value.includes("student")
    ) {
        return "Education";
    }

    if (
        value.includes("work") ||
        value.includes("employment") ||
        value.includes("job")
    ) {
        return "Work & Employment";
    }

    if (
        value.includes("skill") ||
        value.includes("migration") ||
        value.includes("immigration") ||
        value.includes("pr")
    ) {
        return "Skilled Migration";
    }

    return pathway.category || pathway.type || "Other";
}

const getCountryName = (pathway) =>
    pathway.countryName ||
    pathway.country ||
    pathway.countrySlug ||
    "International";

const getTitle = (pathway) =>
    pathway.title || pathway.name || "Migration Opportunity";

const getDescription = (pathway) =>
    pathway.description ||
    pathway.summary ||
    "Explore this opportunity and discover whether it fits your goals.";

const getDuration = (pathway) =>
    pathway.duration ||
    pathway.countryDuration ||
    pathway.processingTime ||
    "Varies";

function findCountry(pathway, countries) {
    const slug = String(
        pathway.countrySlug || pathway.country?.slug || ""
    ).toLowerCase();

    return countries.find(
        (country) => String(country.slug || "").toLowerCase() === slug
    );
}

function getFlag(pathway, countries) {
    return (
        pathway.countryFlag ||
        findCountry(pathway, countries)?.flag ||
        "🌍"
    );
}

function getImage(pathway, countries) {
    return (
        pathway.image ||
        pathway.countryImage ||
        findCountry(pathway, countries)?.image ||
        ""
    );
}

function getLink(pathway) {
    const countrySlug =
        pathway.countrySlug || pathway.country?.slug;

    if (countrySlug && pathway.slug) {
        return `/opportunities/${encodeURIComponent(
            countrySlug
        )}/${encodeURIComponent(pathway.slug)}`;
    }

    if (countrySlug) {
        return `/opportunities/${encodeURIComponent(countrySlug)}`;
    }

    return "/contact";
}

/* ======================================================
   PATHWAY IMAGE
====================================================== */

function PathwayImage({ pathway, countries }) {
    const [failed, setFailed] = useState(false);

    const image = getImage(pathway, countries);
    const country = getCountryName(pathway);

    useEffect(() => {
        setFailed(false);
    }, [image]);

    return (
        <div className="pathway-image">
            {image && !failed ? (
                <img
                    src={image}
                    alt={`${country} destination`}
                    loading="lazy"
                    onError={() => setFailed(true)}
                />
            ) : (
                <div className="pathway-image-fallback">
                    <HiOutlineGlobeAlt aria-hidden="true" />
                    <span>{country}</span>
                </div>
            )}

            <div className="pathway-image-shade" />

            {pathway.featured && (
                <span className="pathway-featured-pill">
                    Featured
                </span>
            )}

            <span className="pathway-country-pill">
                <span className="pathway-country-flag">
                    {getFlag(pathway, countries)}
                </span>

                <span>{country}</span>
            </span>
        </div>
    );
}

/* ======================================================
   PATHWAY CARD
====================================================== */

function PathwayCard({ pathway, countries }) {
    const category = getCategory(pathway);

    const Icon =
        CATEGORY_ICONS[category] || HiOutlineGlobeAlt;

    const title = getTitle(pathway);
    const link = getLink(pathway);

    return (
        <article className="pathway-card">
            <Link
                to={link}
                className="pathway-card-visual-link"
                aria-label={`Explore ${title}`}
            >
                <PathwayImage
                    pathway={pathway}
                    countries={countries}
                />
            </Link>

            <div className="pathway-card-body">
                <div className="pathway-card-topline">
                    <span className="pathway-category-label">
                        <Icon aria-hidden="true" />
                        {category}
                    </span>

                    {pathway.active === false && (
                        <span className="pathway-status-label">
                            Unavailable
                        </span>
                    )}
                </div>

                <h3 className="pathway-card-title">
                    <Link to={link}>{title}</Link>
                </h3>

                <p className="pathway-card-description">
                    {getDescription(pathway)}
                </p>

                <div className="pathway-card-footer">
                    <span className="pathway-duration">
                        <HiOutlineClock aria-hidden="true" />
                        {getDuration(pathway)}
                    </span>

                    <Link
                        to={link}
                        className="pathway-card-action"
                        aria-label={`View ${title}`}
                    >
                        <HiOutlineArrowRight aria-hidden="true" />
                    </Link>
                </div>
            </div>
        </article>
    );
}

/* ======================================================
   HERO
====================================================== */

function PathwaysHero({
    search,
    setSearch,
    onSearch,
    totalCount,
    destinationCount,
}) {
    return (
        <section className="pathways-hero">
            <div className="pathways-hero-glow pathways-hero-glow-one" />
            <div className="pathways-hero-glow pathways-hero-glow-two" />

            <div className="pathways-hero-inner">
                <div className="pathways-hero-copy">
                    <div className="pathways-eyebrow">
                        <span className="pathways-eyebrow-dot" />
                        YOUR NEXT CHAPTER STARTS HERE
                    </div>

                    <h1>
                        A world of options.
                        <br />
                        <span>One clear next step.</span>
                    </h1>

                    <p className="pathways-hero-description">
                        Discover migration, work, healthcare, and
                        education pathways designed to help you plan
                        your next move with confidence.
                    </p>

                    <form
                        className="pathways-search"
                        onSubmit={onSearch}
                    >
                        <HiOutlineSearch
                            className="pathways-search-icon"
                            aria-hidden="true"
                        />

                        <input
                            type="search"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="Search a country or opportunity"
                            aria-label="Search countries and opportunities"
                        />

                        {search && (
                            <button
                                type="button"
                                className="pathways-search-clear"
                                onClick={() => setSearch("")}
                                aria-label="Clear search"
                            >
                                <HiOutlineX />
                            </button>
                        )}

                        <button
                            type="submit"
                            className="pathways-search-submit"
                        >
                            <span>Search pathways</span>
                            <HiOutlineArrowRight aria-hidden="true" />
                        </button>
                    </form>

                    <div className="pathways-quick-search">
                        <span>Try:</span>

                        {["Canada", "Healthcare", "Education"].map(
                            (term) => (
                                <button
                                    key={term}
                                    type="button"
                                    onClick={() => setSearch(term)}
                                >
                                    {term}
                                </button>
                            )
                        )}
                    </div>
                </div>

                <div
                    className="pathways-hero-side"
                    aria-label="Catalogue overview"
                >
                    <div className="pathways-hero-globe">
                        <div className="pathways-globe-ring pathways-globe-ring-one" />
                        <div className="pathways-globe-ring pathways-globe-ring-two" />

                        <div className="pathways-globe-core">
                            <HiOutlineGlobeAlt aria-hidden="true" />
                        </div>

                        <span className="pathways-orbit-dot pathways-orbit-dot-one" />
                        <span className="pathways-orbit-dot pathways-orbit-dot-two" />
                    </div>

                    <div className="pathways-hero-stat pathways-hero-stat-one">
                        <span className="pathways-stat-icon">
                            <HiOutlineGlobeAlt />
                        </span>

                        <span>
                            <strong>{totalCount}</strong>
                            <small>Available pathways</small>
                        </span>
                    </div>

                    <div className="pathways-hero-stat pathways-hero-stat-two">
                        <span className="pathways-stat-icon">
                            <HiOutlineArrowRight />
                        </span>

                        <span>
                            <strong>{destinationCount}</strong>
                            <small>Destinations to explore</small>
                        </span>
                    </div>
                </div>
            </div>

            <div className="pathways-hero-bottom">
                <span>
                    Explore opportunities. Understand your options.
                    Plan with purpose.
                </span>

                <a href="#pathways-catalogue">
                    Explore catalogue
                    <HiOutlineArrowRight aria-hidden="true" />
                </a>
            </div>
        </section>
    );
}

/* ======================================================
   FILTERS
====================================================== */

function PathwaysFilters({
    selectedCategory,
    setSelectedCategory,
    destinations,
    selectedCountry,
    setSelectedCountry,
    resultCount,
    clearFilters,
    hasFilters,
}) {
    return (
        <section
            className="pathways-filter-panel"
            aria-label="Filter pathways"
        >
            <div className="pathways-filter-heading">
                <div className="pathways-filter-heading-icon">
                    <HiOutlineAdjustments aria-hidden="true" />
                </div>

                <div>
                    <h2>Find your fit</h2>
                    <p>Narrow the list to what matters to you.</p>
                </div>

                {hasFilters && (
                    <button
                        type="button"
                        className="pathways-clear-filters"
                        onClick={clearFilters}
                    >
                        <HiOutlineRefresh aria-hidden="true" />
                        <span>Reset</span>
                    </button>
                )}
            </div>

            <div className="pathways-filter-content">
                <div
                    className="pathways-category-scroll"
                    role="group"
                    aria-label="Filter by category"
                >
                    {CATEGORIES.map((category) => {
                        const Icon = CATEGORY_ICONS[category];

                        const active =
                            selectedCategory === category;

                        return (
                            <button
                                key={category}
                                type="button"
                                className={`pathways-category-chip ${active ? "is-active" : ""
                                    }`}
                                aria-pressed={active}
                                onClick={() =>
                                    setSelectedCategory(category)
                                }
                            >
                                {Icon && (
                                    <Icon aria-hidden="true" />
                                )}
                                <span>{category}</span>
                            </button>
                        );
                    })}
                </div>

                <label className="pathways-destination-select">
                    <HiOutlineGlobeAlt aria-hidden="true" />

                    <span className="sr-only">
                        Filter by destination
                    </span>

                    <select
                        value={selectedCountry}
                        onChange={(event) =>
                            setSelectedCountry(event.target.value)
                        }
                    >
                        <option value="all">All destinations</option>

                        {destinations.map((destination) => (
                            <option
                                key={destination.slug}
                                value={destination.slug}
                            >
                                {destination.name}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            <div
                className="pathways-filter-summary"
                aria-live="polite"
            >
                <span>
                    <strong>{resultCount}</strong>{" "}
                    {resultCount === 1 ? "pathway" : "pathways"} found
                </span>

                {hasFilters && (
                    <span className="pathways-filter-active-note">
                        Filters applied
                    </span>
                )}
            </div>
        </section>
    );
}

/* ======================================================
   LOADING, ERROR AND EMPTY STATES
====================================================== */

function LoadingState() {
    return (
        <main className="pathways-page">
            <section className="pathways-state">
                <div className="pathways-spinner" />

                <span className="pathways-state-kicker">
                    COLOSSUS PATHWAYS
                </span>

                <h1>Opening up your options</h1>

                <p>
                    We're loading the latest available opportunities.
                </p>
            </section>
        </main>
    );
}

function ErrorState({ onRetry }) {
    return (
        <main className="pathways-page">
            <section className="pathways-state pathways-state-error">
                <div className="pathways-state-icon">
                    <HiOutlineGlobeAlt />
                </div>

                <span className="pathways-state-kicker">
                    TEMPORARILY UNAVAILABLE
                </span>

                <h1>We couldn't load the pathways</h1>

                <p>
                    Please check your connection and try again.
                    Your existing opportunities have not been changed.
                </p>

                <button
                    type="button"
                    className="pathways-primary-button"
                    onClick={onRetry}
                >
                    Try again
                    <HiOutlineRefresh aria-hidden="true" />
                </button>
            </section>
        </main>
    );
}

function EmptyState({ clearFilters, searching }) {
    return (
        <div className="pathways-empty-state">
            <div className="pathways-empty-icon">
                <HiOutlineSearch aria-hidden="true" />
            </div>

            <h3>
                {searching
                    ? "No matches for this search"
                    : "No pathways match these filters"}
            </h3>

            <p>
                Try a different keyword, destination, or category
                to see more opportunities.
            </p>

            <button
                type="button"
                className="pathways-secondary-button"
                onClick={clearFilters}
            >
                Clear filters
                <HiOutlineArrowRight aria-hidden="true" />
            </button>
        </div>
    );
}

function PathwayGrid({
    pathways,
    countries,
    clearFilters,
    searching,
}) {
    if (!pathways.length) {
        return (
            <EmptyState
                clearFilters={clearFilters}
                searching={searching}
            />
        );
    }

    return (
        <div className="pathways-grid">
            {pathways.map((pathway, index) => (
                <PathwayCard
                    key={
                        pathway._id ||
                        pathway.id ||
                        pathway.slug ||
                        index
                    }
                    pathway={pathway}
                    countries={countries}
                />
            ))}
        </div>
    );
}

function FeaturedPathways({
    pathways,
    countries,
    onExploreAll,
}) {
    if (!pathways.length) return null;

    return (
        <section className="pathways-featured-section">
            <div className="pathways-section-heading">
                <div>
                    <span className="pathways-section-kicker">
                        A GOOD PLACE TO START
                    </span>

                    <h2>
                        Featured <span>pathways</span>
                    </h2>

                    <p>
                        Take a closer look at selected opportunities
                        from our catalogue.
                    </p>
                </div>

                <button
                    type="button"
                    className="pathways-text-link"
                    onClick={onExploreAll}
                >
                    View all pathways
                    <HiOutlineArrowRight aria-hidden="true" />
                </button>
            </div>

            <div className="pathways-featured-grid">
                {pathways.slice(0, 3).map((pathway, index) => (
                    <PathwayCard
                        key={
                            pathway._id ||
                            pathway.id ||
                            pathway.slug ||
                            index
                        }
                        pathway={pathway}
                        countries={countries}
                    />
                ))}
            </div>
        </section>
    );
}

/* ======================================================
   MAIN PAGE
====================================================== */

export default function Pathways() {
    const [pathways, setPathways] = useState([]);
    const [countries, setCountries] = useState([]);

    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] =
        useState("All pathways");
    const [selectedCountry, setSelectedCountry] =
        useState("all");
    const [activeTab, setActiveTab] = useState("all");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        let mounted = true;

        async function loadPathways() {
            setLoading(true);
            setError(false);

            try {
                const [
                    countryResponse,
                    opportunityResponse,
                ] = await Promise.all([
                    opportunityService.getCountries(),
                    opportunityService.getOpportunities(),
                ]);

                if (!mounted) return;

                const safeCountries = Array.isArray(countryResponse)
                    ? countryResponse
                    : [];

                const safeOpportunities =
                    Array.isArray(opportunityResponse)
                        ? opportunityResponse
                        : [];

                const countryMap = new Map(
                    safeCountries.map((country) => [
                        String(country.slug || "")
                            .trim()
                            .toLowerCase(),
                        country,
                    ])
                );

                const normalized = safeOpportunities
                    .map((opportunity) => {
                        const slug = String(
                            opportunity.countrySlug ||
                            opportunity.country?.slug ||
                            ""
                        )
                            .trim()
                            .toLowerCase();

                        const country = countryMap.get(slug) || {
                            name:
                                opportunity.countryName ||
                                opportunity.country ||
                                "International",
                            slug,
                            flag: opportunity.countryFlag || "",
                            image: opportunity.countryImage || "",
                        };

                        return normalizeOpportunities(
                            country,
                            [opportunity]
                        )[0];
                    })
                    .filter(Boolean)
                    .filter(
                        (opportunity) =>
                            opportunity.active !== false
                    );

                setCountries(safeCountries);
                setPathways(normalized);
            } catch (loadError) {
                console.error(
                    "Failed to load Pathways catalogue:",
                    loadError
                );

                if (mounted) setError(true);
            } finally {
                if (mounted) setLoading(false);
            }
        }

        loadPathways();

        return () => {
            mounted = false;
        };
    }, [reloadKey]);

    const destinations = useMemo(() => {
        const map = new Map();

        pathways.forEach((pathway) => {
            const slug = String(pathway.countrySlug || "")
                .trim()
                .toLowerCase();

            if (!slug) return;

            const country = countries.find(
                (item) =>
                    String(item.slug || "")
                        .trim()
                        .toLowerCase() === slug
            );

            map.set(slug, {
                slug,
                name:
                    country?.name ||
                    country?.countryName ||
                    pathway.countryName ||
                    pathway.country ||
                    slug,
            });
        });

        return [...map.values()].sort((a, b) =>
            a.name.localeCompare(b.name)
        );
    }, [pathways, countries]);

    const filteredPathways = useMemo(() => {
        const query = search.trim().toLowerCase();

        return pathways.filter((pathway) => {
            const category = getCategory(pathway);

            const searchable = [
                getTitle(pathway),
                getCountryName(pathway),
                getDescription(pathway),
                category,
                pathway.countrySlug,
                pathway.slug,
                pathway.visa,
                pathway.location,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            const matchesSearch =
                !query || searchable.includes(query);

            const matchesCategory =
                selectedCategory === "All pathways" ||
                category === selectedCategory;

            const matchesCountry =
                selectedCountry === "all" ||
                String(pathway.countrySlug || "").toLowerCase() ===
                selectedCountry;

            const matchesTab =
                activeTab !== "featured" ||
                pathway.featured === true;

            return (
                matchesSearch &&
                matchesCategory &&
                matchesCountry &&
                matchesTab
            );
        });
    }, [
        pathways,
        search,
        selectedCategory,
        selectedCountry,
        activeTab,
    ]);

    const featuredPathways = useMemo(
        () =>
            pathways.filter(
                (pathway) => pathway.featured === true
            ),
        [pathways]
    );

    const hasFilters =
        Boolean(search.trim()) ||
        selectedCategory !== "All pathways" ||
        selectedCountry !== "all" ||
        activeTab !== "all";

    const clearFilters = () => {
        setSearch("");
        setSelectedCategory("All pathways");
        setSelectedCountry("all");
        setActiveTab("all");
    };

    const handleSearch = (event) => {
        event.preventDefault();

        document
            .getElementById("pathways-catalogue")
            ?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
    };

    const exploreAll = () => {
        setActiveTab("all");

        document
            .getElementById("pathways-catalogue")
            ?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
    };

    if (loading) return <LoadingState />;

    if (error) {
        return (
            <ErrorState
                onRetry={() =>
                    setReloadKey((value) => value + 1)
                }
            />
        );
    }

    return (
        <main className="pathways-page">
            <PathwaysHero
                search={search}
                setSearch={setSearch}
                onSearch={handleSearch}
                totalCount={pathways.length}
                destinationCount={destinations.length}
            />

            <div className="pathways-content-shell">
                {!hasFilters && (
                    <FeaturedPathways
                        pathways={featuredPathways}
                        countries={countries}
                        onExploreAll={exploreAll}
                    />
                )}

                <section
                    id="pathways-catalogue"
                    className="pathways-catalogue-section"
                >
                    <div className="pathways-catalogue-heading">
                        <div>
                            <span className="pathways-section-kicker">
                                THE COLOSSUS DIRECTORY
                            </span>

                            <h2>
                                Explore your <span>options</span>
                            </h2>

                            <p>
                                Compare available pathways and find
                                the direction that fits your plans.
                            </p>
                        </div>

                        <div className="pathways-total-badge">
                            <strong>
                                {filteredPathways.length}
                            </strong>

                            <span>
                                {filteredPathways.length === 1
                                    ? "result"
                                    : "results"}
                            </span>
                        </div>
                    </div>

                    <PathwaysFilters
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                        destinations={destinations}
                        selectedCountry={selectedCountry}
                        setSelectedCountry={setSelectedCountry}
                        resultCount={filteredPathways.length}
                        clearFilters={clearFilters}
                        hasFilters={hasFilters}
                    />

                    <div className="pathways-results-toolbar">
                        <div
                            className="pathways-results-tabs"
                            role="group"
                            aria-label="Pathway view"
                        >
                            <button
                                type="button"
                                className={
                                    activeTab === "all"
                                        ? "is-active"
                                        : ""
                                }
                                aria-pressed={activeTab === "all"}
                                onClick={() => setActiveTab("all")}
                            >
                                All pathways
                            </button>

                            <button
                                type="button"
                                className={
                                    activeTab === "featured"
                                        ? "is-active"
                                        : ""
                                }
                                aria-pressed={
                                    activeTab === "featured"
                                }
                                onClick={() =>
                                    setActiveTab("featured")
                                }
                            >
                                Featured only
                            </button>
                        </div>

                        {hasFilters && (
                            <button
                                type="button"
                                className="pathways-reset-link"
                                onClick={clearFilters}
                            >
                                <HiOutlineX aria-hidden="true" />
                                Clear all
                            </button>
                        )}
                    </div>

                    <PathwayGrid
                        pathways={filteredPathways}
                        countries={countries}
                        clearFilters={clearFilters}
                        searching={Boolean(search.trim())}
                    />
                </section>

                <section className="pathways-bottom-cta">
                    <div className="pathways-cta-emblem">
                        <HiOutlineGlobeAlt aria-hidden="true" />
                    </div>

                    <div className="pathways-cta-copy">
                        <span className="pathways-section-kicker">
                            NEED A LITTLE DIRECTION?
                        </span>

                        <h2>
                            Your next move starts with a conversation.
                        </h2>

                        <p>
                            Tell us what you want to achieve and take
                            the next step with a clearer plan.
                        </p>
                    </div>

                    <Link
                        to="/free-assessment"
                        className="pathways-cta-button"
                    >
                        Start your assessment
                        <HiOutlineArrowRight aria-hidden="true" />
                    </Link>

                    <HiOutlineExternalLink
                        className="pathways-cta-decoration"
                        aria-hidden="true"
                    />
                </section>
            </div>
        </main>
    );
}