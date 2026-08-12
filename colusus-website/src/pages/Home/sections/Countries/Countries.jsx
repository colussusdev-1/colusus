import {
  useMemo,
  useState
} from "react";

import {
  HiOutlineGlobeAlt,
  HiOutlineBriefcase,
  HiOutlineAcademicCap,
  HiOutlineUser
} from "react-icons/hi";

import "./Countries.css";

import countries from "./countriesData";
import CountryTabs from "./CountryTabs";
import CountryCard from "./components/CountryCard/CountryCard";

import ScrollReveal from "../../../../components/ScrollReveal/ScrollReveal";

import countriesBackground
  from "../../../../assets/images/countries/countries-section-bg.png";


const Countries = () => {

  const [activeTab, setActiveTab] = useState("All");


  const filteredCountries = useMemo(() => {

    if (activeTab === "Most Popular") {

      return countries.filter((country) =>
        country.category.includes("popular")
      );

    }


    if (activeTab === "Most Affordable") {

      return countries.filter((country) =>
        country.category.includes("affordable")
      );

    }


    return countries;

  }, [activeTab]);


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

          {
            filteredCountries.map(
              (country, index) => (

                <ScrollReveal
                  key={`${activeTab}-${country.id}`}
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