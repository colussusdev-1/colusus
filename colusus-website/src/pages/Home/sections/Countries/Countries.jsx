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

  const [countries, setCountries] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  /*
  |--------------------------------------------------------------------------
  | LOAD COUNTRIES
  |--------------------------------------------------------------------------
  |
  | Countries are now derived from active Opportunities in MongoDB.
  |
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
          Array.isArray(data)
            ? data
            : []
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
  |--------------------------------------------------------------------------
  | FILTER COUNTRIES
  |--------------------------------------------------------------------------
  |
  | The category field now comes from the Opportunity backend.
  |
  | Example:
  | category: ["popular", "affordable"]
  |
  */

  const filteredCountries = useMemo(() => {
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
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <section
      id="global-opportunities"
      className="countries"
    >

      {/* =====================================================
                PREMIUM BACKGROUND
            ===================================================== */}

      <div
        className="countries-background"
        aria-hidden="true"
      >

        <img
          src={countriesBackground}
          alt=""
        />

      </div>


      {/* =====================================================
                AMBIENT DECORATION
            ===================================================== */}

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
                    HEADER
                ================================================= */}

        <ScrollReveal
          direction="up"
          duration={1}
          distance={35}
        >

          <header className="countries-section-header">

            <span className="countries-section-tag">

              <HiOutlineGlobeAlt />

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
              abroad. Compare pathways and find the option
              that fits your personal goals.

            </p>


            <div className="countries-title-line">

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


            {/* DESTINATIONS */}

            <div className="countries-stat">

              <div className="countries-stat-icon">

                <HiOutlineGlobeAlt />

              </div>


              <div className="countries-stat-content">

                <h3>
                  {countries.length}+
                </h3>

                <p>
                  Destinations
                </p>

                <span className="countries-stat-line" />

              </div>

            </div>


            {/* WORK */}

            <div className="countries-stat">

              <div className="countries-stat-icon">

                <HiOutlineBriefcase />

              </div>


              <div className="countries-stat-content">

                <h3>
                  Work
                </h3>

                <p>
                  Opportunities
                </p>

                <span className="countries-stat-line" />

              </div>

            </div>


            {/* STUDY */}

            <div className="countries-stat">

              <div className="countries-stat-icon">

                <HiOutlineAcademicCap />

              </div>


              <div className="countries-stat-content">

                <h3>
                  Study
                </h3>

                <p>
                  Pathways
                </p>

                <span className="countries-stat-line" />

              </div>

            </div>


            {/* PR */}

            <div className="countries-stat">

              <div className="countries-stat-icon">

                <HiOutlineUser />

              </div>


              <div className="countries-stat-content">

                <h3>
                  PR
                </h3>

                <p>
                  Settlement Options
                </p>

                <span className="countries-stat-line" />

              </div>

            </div>


          </div>

        </ScrollReveal>


        {/* =================================================
                    FILTERS
                ================================================= */}

        <ScrollReveal
          direction="up"
          duration={0.9}
          distance={25}
          delay={0.14}
        >

          <div className="countries-filter-wrapper">

            <CountryTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />

          </div>

        </ScrollReveal>


        {/* =================================================
                    COUNTRY GRID
                ================================================= */}

        <div className="countries-grid">

          {loading && (

            <div className="countries-loading">

              Loading available destinations...

            </div>

          )}


          {!loading && error && (

            <div className="countries-error">

              {error}

            </div>

          )}


          {!loading &&
            !error &&
            filteredCountries.length === 0 && (

              <div className="countries-empty">

                No destinations are currently available.

              </div>

            )
          }


          {!loading &&
            !error &&
            filteredCountries.map(
              (country, index) => (

                <ScrollReveal
                  key={`${activeTab}-${country.slug}`}
                  direction="up"
                  duration={0.8}
                  distance={32}
                  delay={
                    Math.min(
                      index * 0.055,
                      0.45
                    )
                  }
                >

                  <CountryCard
                    country={country}
                  />

                </ScrollReveal>

              )
            )
          }

        </div>


        {/* =================================================
                    BOTTOM DISCOVERY MESSAGE
                ================================================= */}

        <ScrollReveal
          direction="up"
          duration={0.9}
          distance={25}
          delay={0.15}
        >

          <div className="countries-discovery">

            <div className="countries-discovery-icon">

              <HiOutlineGlobeAlt />

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


      </div>

    </section>
  );
};


export default Countries;