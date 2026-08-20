import {
  HiOutlineArrowRight,
  HiOutlineBriefcase,
  HiOutlineClock,
  HiOutlineLocationMarker,
  HiOutlineTrendingUp,
  HiOutlineCheckCircle,
} from "react-icons/hi";

import "./OpportunityCard.css";


/* ============================================================
   LOCAL OPPORTUNITY IMAGES
============================================================ */

const opportunityImages = import.meta.glob(
  "/src/assets/images/opportunities/*.{jpg,jpeg,png,webp}",
  {
    eager: true,
    import: "default",
  }
);


/* ============================================================
   LOCAL COUNTRY FLAGS
============================================================ */

const flagImages = import.meta.glob(
  "/src/assets/images/flags/*.{png,jpg,jpeg,webp}",
  {
    eager: true,
    import: "default",
  }
);


/* ============================================================
   HELPERS
============================================================ */

const normalize = (value = "") => {
  return String(value)
    .toLowerCase()
    .trim();
};


/* ============================================================
   OPPORTUNITY IMAGE
============================================================ */

const getOpportunityImage = (filename) => {

  if (!filename) {
    return "";
  }

  const path =
    `/src/assets/images/opportunities/${filename}`;

  return opportunityImages[path] || "";
};


/* ============================================================
   ASSET RESOLVER
============================================================ */

const resolveAsset = (asset) => {

  if (!asset) {
    return "";
  }

  if (typeof asset === "string") {

    /*
     * If this is already a real URL,
     * use it directly.
     */

    if (
      asset.startsWith("http://") ||
      asset.startsWith("https://") ||
      asset.startsWith("/")
    ) {
      return asset;
    }

    /*
     * If it is an imported/local-looking asset,
     * return it as-is.
     */

    if (
      asset.includes("/") ||
      asset.includes(".")
    ) {
      return asset;
    }

    return "";
  }


  if (typeof asset === "object") {

    if (typeof asset.src === "string") {
      return asset.src;
    }

    if (typeof asset.default === "string") {
      return asset.default;
    }

  }

  return "";
};


/* ============================================================
   COUNTRY FLAG RESOLVER
============================================================ */

const resolveCountryFlag = (opportunity) => {

  if (!opportunity) {
    return "";
  }


  const {
    countryName = "",
    countrySlug = "",
    countryFlag = "",
  } = opportunity;


  /*
   * ----------------------------------------------------------
   * 1. If backend provides a real image URL
   * ----------------------------------------------------------
   */

  const directFlag = resolveAsset(countryFlag);

  if (
    directFlag &&
    (
      directFlag.startsWith("http") ||
      directFlag.startsWith("/")
    )
  ) {
    return directFlag;
  }


  /*
   * ----------------------------------------------------------
   * 2. Build country identity
   * ----------------------------------------------------------
   */

  const country = normalize(
    countrySlug ||
    countryName ||
    countryFlag
  );


  /*
   * ----------------------------------------------------------
   * 3. Explicit country mapping
   *
   * These filenames are the REAL files you showed.
   * ----------------------------------------------------------
   */

  const countryMap = {

    australia:
      "australia.png",

    "united kingdom":
      "united-kingdom.png",

    "united-kingdom":
      "united-kingdom.png",

    uk:
      "united-kingdom.png",

    gb:
      "united-kingdom.png",

    britain:
      "united-kingdom.png",

    canada:
      "canada.png",

    germany:
      "germany.png",

    bulgaria:
      "bulgaria.png",

    hungary:
      "hungary.png",

    nigeria:
      "nigeria.png",

    poland:
      "poland.png",

    romania:
      "romania.png",

    serbia:
      "serbia.png",

    china:
      "china.png",

    singapore:
      "singapore.png",

    usa:
      "usa.png",

    "united states":
      "usa.png",

    "united-states":
      "usa.png",

    us:
      "usa.png",
  };


  /*
   * ----------------------------------------------------------
   * 4. Find exact country
   * ----------------------------------------------------------
   */

  let filename =
    countryMap[country];


  /*
   * ----------------------------------------------------------
   * 5. Handle values such as:
   *
   * "United Kingdom Visa"
   * "Australia Jobs"
   * "Canada - Healthcare"
   * ----------------------------------------------------------
   */

  if (!filename) {

    const matchedCountry =
      Object.keys(countryMap).find(
        (name) =>
          country.includes(name)
      );


    if (matchedCountry) {

      filename =
        countryMap[matchedCountry];

    }

  }


  /*
   * ----------------------------------------------------------
   * 6. If backend literally gives:
   *
   * "united-kingdom.png"
   *
   * ----------------------------------------------------------
   */

  if (
    countryFlag &&
    typeof countryFlag === "string"
  ) {

    const normalizedFlag =
      normalize(countryFlag)
        .replace(/\s+/g, "-");


    const matchingFile =
      Object.keys(flagImages).find(
        (path) =>
          path.toLowerCase().endsWith(
            normalizedFlag
          )
      );


    if (matchingFile) {

      return flagImages[matchingFile];

    }

  }


  /*
   * ----------------------------------------------------------
   * 7. Resolve mapped filename
   * ----------------------------------------------------------
   */

  if (filename) {

    const path =
      `/src/assets/images/flags/${filename}`;

    if (flagImages[path]) {
      return flagImages[path];
    }

  }


  return "";
};


/* ============================================================
   OPPORTUNITY IMAGE RESOLVER
============================================================ */

const resolveOpportunityImage = (opportunity) => {

  if (!opportunity) {
    return "";
  }


  const {
    countryName = "",
    countrySlug = "",
    title = "",
    category = "",
    type = "",
  } = opportunity;


  const country =
    normalize(
      countrySlug ||
      countryName
    );


  const text =
    normalize(
      `${title} ${category} ${type}`
    );


  /* ----------------------------------------------------------
     CANADA
  ---------------------------------------------------------- */

  if (country.includes("canada")) {

    if (
      text.includes("software") ||
      text.includes("developer") ||
      text.includes("technology") ||
      text.includes("tech")
    ) {
      return getOpportunityImage(
        "canada-tech.jpg"
      );
    }

    if (
      text.includes("health") ||
      text.includes("nurse") ||
      text.includes("medical")
    ) {
      return getOpportunityImage(
        "canada-healthcare.jpg"
      );
    }

    if (
      text.includes("student") ||
      text.includes("study") ||
      text.includes("education")
    ) {
      return getOpportunityImage(
        "canada-study.jpg"
      );
    }

    if (
      text.includes("business") ||
      text.includes("entrepreneur")
    ) {
      return getOpportunityImage(
        "canada-business.jpg"
      );
    }

    if (text.includes("residen")) {
      return getOpportunityImage(
        "canada-residency.jpg"
      );
    }

    return getOpportunityImage(
      "canada-tech.jpg"
    );
  }


  /* ----------------------------------------------------------
     GERMANY
  ---------------------------------------------------------- */

  if (country.includes("germany")) {

    if (
      text.includes("nursing") ||
      text.includes("nurse")
    ) {
      return getOpportunityImage(
        "germany-nursing.jpg"
      );
    }

    if (
      text.includes("healthcare") ||
      text.includes("health care")
    ) {
      return getOpportunityImage(
        "germany-nurse.jpg"
      );
    }

    if (
      text.includes("factory") ||
      text.includes("manufactur")
    ) {
      return getOpportunityImage(
        "germany-factory.jpg"
      );
    }

    if (
      text.includes("hospitality") ||
      text.includes("hotel")
    ) {
      return getOpportunityImage(
        "germany-hospitality.jpg"
      );
    }

    if (
      text.includes("logistics") ||
      text.includes("logistic")
    ) {
      return getOpportunityImage(
        "germany-logistics.jpg"
      );
    }

    if (text.includes("construction")) {
      return getOpportunityImage(
        "germany-construction.jpg"
      );
    }

    return getOpportunityImage(
      "germany-work.jpg"
    );
  }


  /* ----------------------------------------------------------
     BULGARIA
  ---------------------------------------------------------- */

  if (country.includes("bulgaria")) {

    if (
      text.includes("agricultur") ||
      text.includes("farm")
    ) {
      return getOpportunityImage(
        "bulgaria-agriculture.jpg"
      );
    }

    if (
      text.includes("hospitality") ||
      text.includes("hotel")
    ) {
      return getOpportunityImage(
        "bulgaria-hospitality.jpg"
      );
    }

    return getOpportunityImage(
      "bulgaria-work.jpg"
    );
  }


  /* ----------------------------------------------------------
     CROATIA
  ---------------------------------------------------------- */

  if (country.includes("croatia")) {

    if (
      text.includes("agricultur") ||
      text.includes("farm")
    ) {
      return getOpportunityImage(
        "croatia-agriculture.jpg"
      );
    }

    return getOpportunityImage(
      "croatia-work.jpg"
    );
  }


  /* ----------------------------------------------------------
     HUNGARY
  ---------------------------------------------------------- */

  if (country.includes("hungary")) {

    if (
      text.includes("agricultur") ||
      text.includes("farm")
    ) {
      return getOpportunityImage(
        "hungary-agriculture.jpg"
      );
    }

    if (text.includes("construction")) {
      return getOpportunityImage(
        "hungary-construction.jpg"
      );
    }

    return getOpportunityImage(
      "hungary-work.jpg"
    );
  }


  /* ----------------------------------------------------------
     LATVIA
  ---------------------------------------------------------- */

  if (country.includes("latvia")) {

    if (text.includes("clean")) {
      return getOpportunityImage(
        "latvia-cleaning.jpg"
      );
    }

    if (text.includes("construction")) {
      return getOpportunityImage(
        "latvia-construction.jpg"
      );
    }

    if (
      text.includes("quality") ||
      text.includes("control")
    ) {
      return getOpportunityImage(
        "latvia-quality-control.jpg"
      );
    }

    return getOpportunityImage(
      "latvia-work.jpg"
    );
  }


  /* ----------------------------------------------------------
     LITHUANIA
  ---------------------------------------------------------- */

  if (country.includes("lithuania")) {

    if (
      text.includes("agricultur") ||
      text.includes("farm")
    ) {
      return getOpportunityImage(
        "lithuania-agriculture.jpg"
      );
    }

    return getOpportunityImage(
      "lithuania-work.jpg"
    );
  }


  /* ----------------------------------------------------------
     NORWAY
  ---------------------------------------------------------- */

  if (country.includes("norway")) {

    if (
      text.includes("seafood") ||
      text.includes("fish")
    ) {
      return getOpportunityImage(
        "norway-seafood.jpg"
      );
    }

    return getOpportunityImage(
      "norway-work.jpg"
    );
  }


  /* ----------------------------------------------------------
     POLAND
  ---------------------------------------------------------- */

  if (country.includes("poland")) {

    if (
      text.includes("agricultur") ||
      text.includes("farm")
    ) {
      return getOpportunityImage(
        "poland-agriculture.jpg"
      );
    }

    if (
      text.includes("factory") ||
      text.includes("manufactur")
    ) {
      return getOpportunityImage(
        "poland-factory.jpg"
      );
    }

    if (text.includes("warehouse")) {
      return getOpportunityImage(
        "poland-warehouse.jpg"
      );
    }

    return getOpportunityImage(
      "poland-work.jpg"
    );
  }


  /* ----------------------------------------------------------
     ROMANIA
  ---------------------------------------------------------- */

  if (country.includes("romania")) {

    if (text.includes("construction")) {
      return getOpportunityImage(
        "romania-construction.jpg"
      );
    }

    if (
      text.includes("factory") ||
      text.includes("manufactur")
    ) {
      return getOpportunityImage(
        "romania-factory.jpg"
      );
    }

    if (
      text.includes("housekeep") ||
      text.includes("clean")
    ) {
      return getOpportunityImage(
        "romania-housekeeping.jpg"
      );
    }

    return getOpportunityImage(
      "romania-work.jpg"
    );
  }


  /* ----------------------------------------------------------
     SERBIA
  ---------------------------------------------------------- */

  if (country.includes("serbia")) {

    if (
      text.includes("agricultur") ||
      text.includes("farm")
    ) {
      return getOpportunityImage(
        "serbia-agriculture.jpg"
      );
    }

    if (text.includes("warehouse")) {
      return getOpportunityImage(
        "serbia-warehouse.jpg"
      );
    }

    return getOpportunityImage(
      "serbia-work.jpg"
    );
  }


  /* ----------------------------------------------------------
     SPAIN
  ---------------------------------------------------------- */

  if (country.includes("spain")) {

    if (
      text.includes("fruit") ||
      text.includes("packing")
    ) {
      return getOpportunityImage(
        "spain-fruit-packing.jpg"
      );
    }

    if (text.includes("warehouse")) {
      return getOpportunityImage(
        "spain-warehouse.jpg"
      );
    }

    return getOpportunityImage(
      "spain-work.jpg"
    );
  }


  /* ----------------------------------------------------------
     UNITED KINGDOM
  ---------------------------------------------------------- */

  if (
    country.includes("united kingdom") ||
    country.includes("united-kingdom") ||
    country === "uk"
  ) {

    if (
      text.includes("software") ||
      text.includes("developer") ||
      text.includes("technology")
    ) {
      return getOpportunityImage(
        "software-engineer.jpg"
      );
    }

    if (
      text.includes("health") ||
      text.includes("nurse")
    ) {
      return getOpportunityImage(
        "caregiver.jpg"
      );
    }

    if (text.includes("construction")) {
      return getOpportunityImage(
        "construction-worker.jpg"
      );
    }

    return getOpportunityImage(
      "construction-worker.jpg"
    );
  }


  /* ----------------------------------------------------------
     AUSTRALIA
  ---------------------------------------------------------- */

  if (country.includes("australia")) {

    if (
      text.includes("software") ||
      text.includes("developer") ||
      text.includes("technology")
    ) {
      return getOpportunityImage(
        "software-engineer.jpg"
      );
    }

    if (
      text.includes("health") ||
      text.includes("nurse")
    ) {
      return getOpportunityImage(
        "caregiver.jpg"
      );
    }

    if (text.includes("construction")) {
      return getOpportunityImage(
        "construction-worker.jpg"
      );
    }

    return getOpportunityImage(
      "construction-worker.jpg"
    );
  }


  /* ----------------------------------------------------------
     GLOBAL OCCUPATION FALLBACKS
  ---------------------------------------------------------- */

  if (
    text.includes("software") ||
    text.includes("developer") ||
    text.includes("technology")
  ) {
    return getOpportunityImage(
      "software-engineer.jpg"
    );
  }

  if (text.includes("truck")) {
    return getOpportunityImage(
      "truck-driver.jpg"
    );
  }

  if (
    text.includes("caregiver") ||
    text.includes("care giver")
  ) {
    return getOpportunityImage(
      "caregiver.jpg"
    );
  }

  if (text.includes("construction")) {
    return getOpportunityImage(
      "construction-worker.jpg"
    );
  }

  return "";
};


/* ============================================================
   COMPONENT
============================================================ */

const OpportunityCard = ({
  opportunity,
  onSelect,
}) => {

  if (!opportunity) {
    return null;
  }


  const {
    _id,
    title = "Migration Pathway",
    countryName = "",
    countryFlag = "",
    countryImage = "",
    image = "",
    countrySlug = "",
    category = "",
    type = "",
    duration = "",
    salary = "",
    demand = "",
    description = "",
    opportunityScore = "",
    successRate = "",
    featured = false,
    requirements = [],
    highlights = [],
  } = opportunity;


  /* ==========================================================
     RESOLVE IMAGES
  ========================================================== */

  const pathwayImage =
    resolveAsset(image) ||
    resolveAsset(countryImage) ||
    resolveOpportunityImage(opportunity);


  const flagImage =
    resolveCountryFlag(opportunity);


  /* ==========================================================
     DISPLAY
  ========================================================== */

  const displayCategory =
    category ||
    type ||
    "Migration pathway";


  const displayLocation =
    opportunity?.location ||
    countryName ||
    "International";


  const displayDescription =
    description ||
    "Explore this pathway and discover the requirements, benefits and next steps.";


  /* ==========================================================
     HIGHLIGHTS
  ========================================================== */

  const pathwayHighlights =
    Array.isArray(highlights) &&
      highlights.length > 0
      ? highlights
      : Array.isArray(requirements)
        ? requirements
        : [];


  const visibleHighlights =
    pathwayHighlights.slice(0, 2);


  /* ==========================================================
     ACTION
  ========================================================== */

  const handleSelect = () => {

    if (typeof onSelect === "function") {
      onSelect(opportunity);
    }

  };


  /* ==========================================================
     RENDER
  ========================================================== */

  return (

    <article
      className={`opportunity-card ${featured
          ? "opportunity-card-featured"
          : ""
        }`}
      data-opportunity-id={_id}
    >

      {/* ======================================================
          IMAGE
      ====================================================== */}

      <div className="opportunity-card-image-wrapper">

        {pathwayImage ? (

          <img
            src={pathwayImage}
            alt={`${title} — ${countryName || "Migration"}`}
            className="opportunity-card-image"
            loading="lazy"
          />

        ) : (

          <div className="opportunity-card-image-fallback">
            <HiOutlineBriefcase />
          </div>

        )}


        <div className="opportunity-card-image-overlay" />


        {/* ====================================================
            TOP BADGES
        ==================================================== */}

        <div className="opportunity-card-image-top">

          {featured && (

            <span className="opportunity-card-recommended">

              <HiOutlineTrendingUp />

              <span>
                Recommended
              </span>

            </span>

          )}


          {opportunityScore && (

            <span className="opportunity-card-fit">

              <small>
                FIT
              </small>

              <strong>
                {opportunityScore}
              </strong>

            </span>

          )}

        </div>


        {/* ====================================================
            COUNTRY
        ==================================================== */}

        <div className="opportunity-card-country-overlay">

          <div className="opportunity-card-country-flag">

            {flagImage ? (

              <img
                src={flagImage}
                alt={`${countryName || "Country"} flag`}
                className="opportunity-card-flag-image"
              />

            ) : (

              <HiOutlineLocationMarker />

            )}

          </div>


          <span>
            {countryName || "International"}
          </span>

        </div>

      </div>


      {/* ======================================================
          CONTENT
      ====================================================== */}

      <div className="opportunity-card-content">

        <span className="opportunity-card-category">
          {displayCategory}
        </span>


        <h3 className="opportunity-card-title">
          {title}
        </h3>


        <p className="opportunity-card-description">
          {displayDescription}
        </p>


        {/* ====================================================
            META
        ==================================================== */}

        <div className="opportunity-card-meta">

          <span className="opportunity-card-meta-item">

            <HiOutlineLocationMarker />

            <span>
              {displayLocation}
            </span>

          </span>


          {duration && (

            <span className="opportunity-card-meta-item">

              <HiOutlineClock />

              <span>
                {duration}
              </span>

            </span>

          )}

        </div>


        {/* ====================================================
            HIGHLIGHTS
        ==================================================== */}

        {visibleHighlights.length > 0 && (

          <div className="opportunity-card-highlights">

            <span className="opportunity-card-highlights-label">
              PATHWAY HIGHLIGHTS
            </span>


            <div className="opportunity-card-highlights-list">

              {visibleHighlights.map(
                (highlight, index) => (

                  <div
                    key={`${highlight}-${index}`}
                    className="opportunity-card-highlight"
                  >

                    <HiOutlineCheckCircle />

                    <span>
                      {highlight}
                    </span>

                  </div>

                )
              )}

            </div>

          </div>

        )}


        {/* ====================================================
            OUTCOME
        ==================================================== */}

        {(salary || demand || successRate) && (

          <div className="opportunity-card-outcome">

            {salary && (

              <div className="opportunity-card-outcome-item">

                <span>
                  Salary
                </span>

                <strong>
                  {salary}
                </strong>

              </div>

            )}


            {demand && (

              <div className="opportunity-card-outcome-item">

                <span>
                  Demand
                </span>

                <strong>
                  {demand}
                </strong>

              </div>

            )}


            {successRate && (

              <div className="opportunity-card-outcome-item">

                <span>
                  Success
                </span>

                <strong>
                  {successRate}
                </strong>

              </div>

            )}

          </div>

        )}

      </div>


      {/* ======================================================
          FOOTER
      ====================================================== */}

      <div className="opportunity-card-footer">

        <button
          type="button"
          className="opportunity-card-button"
          onClick={handleSelect}
        >

          <span>
            Explore this pathway
          </span>

          <HiOutlineArrowRight />

        </button>


        <span className="opportunity-card-footer-hint">
          Requirements · Eligibility · Application steps
        </span>

      </div>

    </article>

  );
};


export default OpportunityCard;