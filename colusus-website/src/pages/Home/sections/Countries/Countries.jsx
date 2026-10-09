import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  HiOutlineGlobeAlt,
  HiOutlineBriefcase,
  HiOutlineAcademicCap,
  HiOutlineUser,
  HiOutlineSearch,
  HiOutlineX,
} from "react-icons/hi";

import "./Countries.css";

import CountryTabs from "./CountryTabs";
import CountryCard from "./components/CountryCard/CountryCard";

import ScrollReveal from "../../../../components/ScrollReveal/ScrollReveal";

import opportunityService from "../../../../services/opportunity.service";

import countriesBackground
  from "../../../../assets/images/countries/countries-section-bg.png";


const Countries = () => {
  const [activeTab, setActiveTab] = useState("All");

  const [searchQuery, setSearchQuery] = useState("");

  const [countries, setCountries] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  /*
  ============================================================
  LOAD COUNTRIES
  ============================================================
  */

  useEffect(() => {
    let mounted = true;

    const loadCountries = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await opportunityService.getCountries();

        if (!mounted) {
          return;
        }

        setCountries(
          Array.isArray(data) ? data : []
        );
      } catch (error) {
        console.error(
          "Failed to load countries:",
          error
        );

        if (!mounted) {
          return;
        }

        setCountries([]);

        setError(
          "Unable to load available destinations right now."
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadCountries();

    return () => {
      mounted = false;
    };
  }, []);


  /*
  ============================================================
  NORMALIZE SEARCH TEXT

  Makes searching case-insensitive and tolerant of
  extra spaces and punctuation.
  ============================================================
  */

  const normalizeSearchText = (value) => {
    return String(value ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  };


  /*
  ============================================================
  FILTER BY CATEGORY

  Uses the existing backend category field.
  ============================================================
  */

  const tabFilteredCountries = useMemo(() => {
    if (activeTab === "Most Popular") {
      return countries.filter((country) =>
        Array.isArray(country.category) &&
        country.category.some(
          (category) =>
            String(category).toLowerCase() === "popular"
        )
      );
    }

    if (activeTab === "Most Affordable") {
      return countries.filter((country) =>
        Array.isArray(country.category) &&
        country.category.some(
          (category) =>
            String(category).toLowerCase() === "affordable"
        )
      );
    }

    return countries;
  }, [activeTab, countries]);


  /*
  ============================================================
  SEARCH COUNTRIES

  Searches fields that may be present in the existing
  country objects. Missing fields are safely ignored.

  The original country objects are returned unchanged.
  ============================================================
  */

  const filteredCountries = useMemo(() => {
    const query = normalizeSearchText(searchQuery);

    if (!query) {
      return tabFilteredCountries;
    }

    const searchableFields = [
      "name",
      "shortName",
      "slug",
      "visa",
      "processingTime",
      "duration",
      "description",
    ];

    return tabFilteredCountries.filter((country) => {
      const values = searchableFields.map(
        (field) => country[field]
      );

      if (Array.isArray(country.category)) {
        values.push(...country.category);
      }

      const searchableText = normalizeSearchText(
        values
          .filter((value) =>
            typeof value === "string" ||
            typeof value === "number"
          )
          .join(" ")
      );

      return searchableText.includes(query);
    });
  }, [
    searchQuery,
    tabFilteredCountries,
  ]);


  /*
  ============================================================
  SEARCH HANDLERS
  ============================================================
  */

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };


  /*
  ============================================================
  RENDER
  ============================================================
  */

  return (
    <section
      id="global-opportunities"
      className="countries"
    >

      {/* BACKGROUND */}

      <div
        className="countries-background"
        aria-hidden="true"
      >
        <img
          src={countriesBackground}
          alt=""
        />
      </div>


      {/* AMBIENT DECORATION */}

      <div
        className="countries-atmosphere"
        aria-hidden="true"
      >
        <span className="countries-orb countries-orb-one" />

        <span className="countries-orb countries-orb-two" />

        <span className="countries-orbit countries-orbit-one" />

        <span className="countries-orbit countries-orbit-two" />

        <span className="countries-floating-dot countries-floating-dot-one" />

        <span className="countries-floating-dot countries-floating-dot-two" />

        <span className="countries-floating-dot countries-floating-dot-three" />
      </div>


      <div className="container">

        {/* =================================================
                    SECTION HEADER
                ================================================= */}

        <ScrollReveal
          direction="up"
          duration={1}
          distance={35}
        >
          <header className="countries-section-header">

            <span className="countries-section-tag">
              <HiOutlineGlobeAlt aria-hidden="true" />

              <span>
                Global Opportunities
              </span>
            </span>


            <h2>
              Explore Countries That Match

              <span>
                Your Migration Goals
              </span>
            </h2>


            <p>
              Discover trusted destinations for work,
              study, relocation, and future opportunities
              abroad. Search available destinations and
              find the pathway that fits your goals.
            </p>


            <div
              className="countries-title-line"
              aria-hidden="true"
            >
              <span />
              <i />
              <span />
            </div>

          </header>
        </ScrollReveal>


        {/* =================================================
                    QUICK STATS
                ================================================= */}

        <ScrollReveal
          direction="up"
          duration={1.1}
          distance={40}
          delay={0.08}
        >
          <div className="countries-stats">

            <div className="countries-stat">
              <div className="countries-stat-icon">
                <HiOutlineGlobeAlt aria-hidden="true" />
              </div>

              <div className="countries-stat-content">
                <h3>
                  {countries.length}+
                </h3>

                <p>Destinations</p>

                <span className="countries-stat-line" />
              </div>
            </div>


            <div className="countries-stat">
              <div className="countries-stat-icon">
                <HiOutlineBriefcase aria-hidden="true" />
              </div>

              <div className="countries-stat-content">
                <h3>Work</h3>

                <p>Opportunities</p>

                <span className="countries-stat-line" />
              </div>
            </div>


            <div className="countries-stat">
              <div className="countries-stat-icon">
                <HiOutlineAcademicCap aria-hidden="true" />
              </div>

              <div className="countries-stat-content">
                <h3>Study</h3>

                <p>Pathways</p>

                <span className="countries-stat-line" />
              </div>
            </div>


            <div className="countries-stat">
              <div className="countries-stat-icon">
                <HiOutlineUser aria-hidden="true" />
              </div>

              <div className="countries-stat-content">
                <h3>PR</h3>

                <p>Settlement Options</p>

                <span className="countries-stat-line" />
              </div>
            </div>

          </div>
        </ScrollReveal>


        {/* =================================================
                    DESTINATION DISCOVERY
                ================================================= */}

        <ScrollReveal
          direction="up"
          duration={0.9}
          distance={25}
          delay={0.1}
        >
          <div className="countries-discovery-tools">

            {/* SEARCH */}

            <div className="countries-search">

              <HiOutlineSearch
                className="countries-search-icon"
                aria-hidden="true"
              />

              <input
                type="search"
                id="country-search"
                className="countries-search-input"
                placeholder="Search countries, e.g. Canada..."
                value={searchQuery}
                onChange={handleSearchChange}
                aria-label="Search migration destinations"
                aria-controls="countries-results"
                autoComplete="off"
              />

              {searchQuery && (
                <button
                  type="button"
                  className="countries-search-clear"
                  onClick={handleClearSearch}
                  aria-label="Clear destination search"
                >
                  <HiOutlineX aria-hidden="true" />
                </button>
              )}

            </div>


            {/* SEARCH RESULTS SUMMARY */}

            <div
              className="countries-results-summary"
              aria-live="polite"
            >
              {loading
                ? "Loading destinations..."
                : searchQuery.trim()
                  ? `${filteredCountries.length} ${filteredCountries.length === 1
                    ? "destination"
                    : "destinations"
                  } found`
                  : `${tabFilteredCountries.length} ${tabFilteredCountries.length === 1
                    ? "destination"
                    : "destinations"
                  } available`
              }
            </div>


            {/* CATEGORY FILTERS */}

            <div className="countries-filter-wrapper">
              <CountryTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            </div>

          </div>
        </ScrollReveal>


        {/* =================================================
                    DESTINATION RESULTS
                ================================================= */}

        <div
          id="countries-results"
          className="countries-grid"
          aria-live="polite"
          aria-busy={loading}
        >

          {loading && (
            <div className="countries-loading">
              Loading available destinations...
            </div>
          )}


          {!loading && error && (
            <div
              className="countries-error"
              role="alert"
            >
              {error}
            </div>
          )}


          {!loading &&
            !error &&
            filteredCountries.length === 0 && (
              <div className="countries-empty">

                <span className="countries-empty-icon">
                  <HiOutlineSearch aria-hidden="true" />
                </span>

                <h3>
                  {searchQuery.trim()
                    ? "No matching destinations"
                    : "No destinations available"
                  }
                </h3>

                <p>
                  {searchQuery.trim()
                    ? `We couldn't find a destination matching "${searchQuery.trim()}". Try another country name or change your filters.`
                    : "There are currently no destinations in this category."
                  }
                </p>

                {(searchQuery || activeTab !== "All") && (
                  <button
                    type="button"
                    className="countries-reset-btn"
                    onClick={() => {
                      setSearchQuery("");
                      setActiveTab("All");
                    }}
                  >
                    Clear search and filters
                  </button>
                )}

              </div>
            )
          }


          {!loading &&
            !error &&
            filteredCountries.map((country, index) => (
              <ScrollReveal
                key={`${activeTab}-${country.slug || country.name}`}
                direction="up"
                duration={0.7}
                distance={24}
                delay={Math.min(index * 0.04, 0.24)}
              >
                <CountryCard
                  country={country}
                />
              </ScrollReveal>
            ))
          }

        </div>


        {/* =================================================
                    BOTTOM DISCOVERY MESSAGE
                ================================================= */}

        {!loading && !error && filteredCountries.length > 0 && (
          <ScrollReveal
            direction="up"
            duration={0.9}
            distance={25}
            delay={0.1}
          >
            <div className="countries-discovery">

              <div className="countries-discovery-icon">
                <HiOutlineGlobeAlt aria-hidden="true" />
              </div>

              <div className="countries-discovery-content">
                <strong>
                  Your destination is out there.
                </strong>

                <span>
                  Explore available migration pathways
                  and find the country that fits your goals.
                </span>
              </div>

              <span className="countries-discovery-pulse" />

            </div>
          </ScrollReveal>
        )}

      </div>
    </section>
  );
};

export default Countries;