import {
  HiOutlineGlobeAlt,
  HiOutlineArrowRight,
  HiOutlineCheckCircle,
  HiOutlineSparkles,
} from "react-icons/hi";

import "./CountryHero.css";


const CountryHero = ({ country }) => {

  const pathways =
    country?.opportunities || [];


  const categories = [
    ...new Set(
      pathways
        .map((item) => item.category)
        .filter(Boolean)
    ),
  ];


  return (

    <section className="country-hero">


      {/* =====================================================
                BACKGROUND
            ===================================================== */}

      <div className="country-hero__background">

        {country?.image && (

          <img
            src={country.image}
            alt=""
          />

        )}

      </div>


      <div className="country-hero__wash" />


      {/* =====================================================
                CONTENT
            ===================================================== */}

      <div className="country-hero__container">


        {/* =================================================
                    TOP LINE
                ================================================= */}

        <div className="country-hero__topline">


          <div className="country-hero__crumb">

            <HiOutlineGlobeAlt />

            <span>
              Destinations
            </span>

            <i>
              /
            </i>


            {/* COUNTRY FLAG */}

            {country?.flag && (

              <img
                className="country-hero__flag"
                src={country.flag}
                alt={`${country.name} flag`}
              />

            )}


            <strong>
              {country?.name}
            </strong>

          </div>


          <div className="country-hero__status">

            <span />

            {pathways.length}{" "}

            {pathways.length === 1
              ? "pathway"
              : "pathways"}{" "}

            available

          </div>

        </div>



        {/* =================================================
                    MAIN
                ================================================= */}

        <div className="country-hero__main">


          {/* =================================================
                        LEFT CONTENT
                    ================================================= */}

          <div className="country-hero__content">


            <span className="country-hero__eyebrow">

              <HiOutlineSparkles />

              Destination intelligence

            </span>


            <h1>

              Explore{" "}

              <span>
                {country?.name}
              </span>

            </h1>


            <p className="country-hero__description">

              Explore migration routes into{" "}

              <strong>
                {country?.name}
              </strong>

              {" "}and find the pathway
              that aligns with your direction.

            </p>


            {/* =================================================
                            CATEGORY SIGNALS
                        ================================================= */}

            {categories.length > 0 && (

              <div className="country-hero__signals">

                {categories
                  .slice(0, 4)
                  .map((category) => (

                    <span
                      key={category}
                    >

                      <HiOutlineCheckCircle />

                      {category}

                    </span>

                  ))}

              </div>

            )}

          </div>



          {/* =================================================
                        RIGHT INTELLIGENCE PANEL
                    ================================================= */}

          <div className="country-hero__intel">


            <div className="country-hero__intel-label">

              <span>
                COLUSUS SIGNAL
              </span>

              <HiOutlineSparkles />

            </div>


            <div className="country-hero__intel-title">

              <strong>
                {country?.opportunityScore ||
                  "Strong"}
              </strong>

              <span>
                opportunity signal
              </span>

            </div>


            <div className="country-hero__intel-line">

              <span />

            </div>


            <div className="country-hero__intel-grid">


              <div>

                <strong>
                  {country?.pathwaysCount ||
                    pathways.length}
                </strong>

                <span>
                  Routes
                </span>

              </div>


              <div>

                <strong>
                  {country?.processingTime ||
                    "Varies"}
                </strong>

                <span>
                  Processing
                </span>

              </div>


              <div>

                <strong>
                  {country?.successRate ||
                    "Strong"}
                </strong>

                <span>
                  Success signal
                </span>

              </div>

            </div>

          </div>

        </div>



        {/* =================================================
                    BOTTOM ACTION
                ================================================= */}

        <div className="country-hero__bottom">


          <button
            type="button"
            onClick={() =>
              document
                .getElementById("pathways")
                ?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                })
            }
          >

            <span>
              Explore pathways
            </span>

            <HiOutlineArrowRight />

          </button>


          <span className="country-hero__hint">

            Compare available routes before
            choosing your direction.

          </span>

        </div>


      </div>

    </section>

  );

};


export default CountryHero;