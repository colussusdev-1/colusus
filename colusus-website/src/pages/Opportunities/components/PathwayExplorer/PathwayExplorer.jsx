import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  HiOutlineBriefcase,
  HiOutlineAcademicCap,
  HiOutlineHome,
  HiOutlineArrowRight,
  HiOutlineLocationMarker,
  HiOutlineClock,
  HiOutlineSparkles,
} from "react-icons/hi";

import "./PathwayExplorer.css";


const PathwayExplorer = ({ country }) => {

  const navigate = useNavigate();


  /* ==========================================================
     STATE
  ========================================================== */

  const [activeCategory, setActiveCategory] =
    useState("All");


  /* ==========================================================
     OPPORTUNITIES
  ========================================================== */

  const opportunities =
    country?.opportunities || [];


  /* ==========================================================
     CATEGORIES
  ========================================================== */

  const categories = useMemo(() => {

    const found = new Set();

    opportunities.forEach((opportunity) => {

      if (opportunity?.category) {

        found.add(
          String(
            opportunity.category
          )
        );

      }

    });

    return [
      "All",
      ...Array.from(found),
    ];

  }, [opportunities]);


  /* ==========================================================
     FILTERED OPPORTUNITIES
  ========================================================== */

  const filteredOpportunities = useMemo(() => {

    if (activeCategory === "All") {
      return opportunities;
    }

    return opportunities.filter(
      (opportunity) =>
        String(
          opportunity?.category
        ) === activeCategory
    );

  }, [
    opportunities,
    activeCategory,
  ]);


  /* ==========================================================
     CATEGORY ICON
  ========================================================== */

  const getCategoryIcon = (category) => {

    const value =
      String(category || "")
        .toLowerCase();


    if (
      value.includes("study") ||
      value.includes("education") ||
      value.includes("student")
    ) {

      return <HiOutlineAcademicCap />;

    }


    if (
      value.includes("residen") ||
      value.includes("settlement") ||
      value.includes("pr")
    ) {

      return <HiOutlineHome />;

    }


    return <HiOutlineBriefcase />;

  };


  /* ==========================================================
     OPEN PATHWAY
     ----------------------------------------------------------
     The pathway now gets its own URL.

     Example:

     /opportunities/germany/germany-work-permit

     No modal.
     No overlay.
     No selected-pathway state.
     ========================================================== */

  const openPathway = (opportunity) => {

    if (
      !opportunity?.slug ||
      !country?.slug
    ) {
      return;
    }

    navigate(
      `/opportunities/${country.slug}/${opportunity.slug}`
    );

  };


  /* ==========================================================
     KEYBOARD ACCESS
  ========================================================== */

  const handleCardKeyDown = (
    event,
    opportunity
  ) => {

    if (
      event.key === "Enter" ||
      event.key === " "
    ) {

      event.preventDefault();

      openPathway(
        opportunity
      );

    }

  };


  /* ==========================================================
     RENDER
  ========================================================== */

  return (

    <section
      className="pathway-explorer"
      id="pathways"
    >

      <div className="pathway-explorer__container">


        {/* ==================================================
                    HEADER
                ================================================== */}

        <header
          className="pathway-explorer__header"
        >

          <div
            className="pathway-explorer__heading"
          >

            <span
              className="pathway-explorer__eyebrow"
            >

              <HiOutlineSparkles />

              Explore your options

            </span>


            <h2>

              Find your
              <span> pathway.</span>

            </h2>


            <p>

              Compare the routes available
              in{" "}

              <strong>
                {country?.name}
              </strong>

              {" "}and choose the direction
              that fits your goals.

            </p>

          </div>


          <div
            className="pathway-explorer__count"
          >

            <strong>
              {opportunities.length}
            </strong>

            <span>
              available
            </span>

          </div>

        </header>


        {/* ==================================================
                    CATEGORY FILTERS
                ================================================== */}

        {categories.length > 1 && (

          <div
            className="pathway-explorer__filters"
            role="tablist"
            aria-label="Pathway categories"
          >

            {categories.map(
              (category) => (

                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={
                    activeCategory ===
                    category
                  }
                  className={
                    activeCategory ===
                      category
                      ? "is-active"
                      : ""
                  }
                  onClick={() =>
                    setActiveCategory(
                      category
                    )
                  }
                >

                  {getCategoryIcon(
                    category
                  )}

                  <span>
                    {category}
                  </span>

                </button>

              )
            )}

          </div>

        )}


        {/* ==================================================
                    PATHWAY GRID
                ================================================== */}

        <div
          className="pathway-explorer__grid"
        >

          {filteredOpportunities.map(
            (
              opportunity,
              index
            ) => {

              const title =
                opportunity?.title ||
                opportunity?.name ||
                "Migration Pathway";


              const description =
                opportunity?.description ||
                opportunity?.summary ||
                opportunity?.shortDescription ||
                "Explore this pathway and discover the requirements, benefits and next steps.";


              const location =
                opportunity?.location ||
                country?.name;


              const duration =
                opportunity?.duration ||
                opportunity?.timeline;


              const image =
                opportunity?.image;


              return (

                <article
                  className="pathway-card"
                  key={
                    opportunity?.id ||
                    opportunity?.slug ||
                    index
                  }
                  role="button"
                  tabIndex={0}
                  aria-label={`View ${title} pathway`}
                  onClick={() =>
                    openPathway(
                      opportunity
                    )
                  }
                  onKeyDown={(
                    event
                  ) =>
                    handleCardKeyDown(
                      event,
                      opportunity
                    )
                  }
                >


                  {/* ==================================================
                                        IMAGE
                                    ================================================== */}

                  <div
                    className="pathway-card__image"
                  >

                    {image ? (

                      <img
                        src={image}
                        alt={
                          `${title} — ${country?.name || "destination"}`
                        }
                        loading="lazy"
                      />

                    ) : (

                      <div
                        className="pathway-card__image-fallback"
                        aria-hidden="true"
                      >

                        {getCategoryIcon(
                          opportunity?.category
                        )}

                      </div>

                    )}


                    <div
                      className="pathway-card__image-overlay"
                    />


                    <div
                      className="pathway-card__image-top"
                    >

                      <span
                        className="pathway-card__category"
                      >

                        {opportunity?.category ||
                          "Opportunity"}

                      </span>


                      <span
                        className="pathway-card__index"
                      >

                        {String(
                          index + 1
                        ).padStart(
                          2,
                          "0"
                        )}

                      </span>

                    </div>


                    <div
                      className="pathway-card__image-icon"
                    >

                      {getCategoryIcon(
                        opportunity?.category
                      )}

                    </div>

                  </div>


                  {/* ==================================================
                                        CONTENT
                                    ================================================== */}

                  <div
                    className="pathway-card__body"
                  >

                    <h3>
                      {title}
                    </h3>


                    <p>
                      {description}
                    </p>


                    {/* META */}

                    {(location ||
                      duration) && (

                        <div
                          className="pathway-card__meta"
                        >

                          {location && (

                            <span>

                              <HiOutlineLocationMarker />

                              {location}

                            </span>

                          )}


                          {duration && (

                            <span>

                              <HiOutlineClock />

                              {duration}

                            </span>

                          )}

                        </div>

                      )}


                    {/* FOOTER */}

                    <div
                      className="pathway-card__footer"
                    >

                      <span>
                        View pathway
                      </span>


                      <span
                        className="pathway-card__arrow"
                        aria-hidden="true"
                      >

                        <HiOutlineArrowRight />

                      </span>

                    </div>

                  </div>

                </article>

              );

            }
          )}

        </div>


        {/* ==================================================
                    EMPTY STATE
                ================================================== */}

        {filteredOpportunities.length === 0 && (

          <div
            className="pathway-explorer__empty"
          >

            <HiOutlineBriefcase />

            <strong>
              More pathways are coming
            </strong>

            <span>
              We're expanding the opportunities
              available for this destination.
            </span>

          </div>

        )}

      </div>

    </section>

  );

};


export default PathwayExplorer;