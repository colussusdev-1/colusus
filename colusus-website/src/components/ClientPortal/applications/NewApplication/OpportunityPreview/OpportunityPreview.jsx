import {
  useEffect,
  useState,
} from "react";

import OpportunityPreviewHeader
  from "./OpportunityPreviewHeader/OpportunityPreviewHeader.jsx";

import OpportunityPreviewMedia
  from "./OpportunityPreviewMedia/OpportunityPreviewMedia.jsx";

import OpportunityPreviewTabs
  from "./OpportunityPreviewTabs/OpportunityPreviewTabs.jsx";

import OpportunityPreviewOverview
  from "./OpportunityPreviewOverview/OpportunityPreviewOverview.jsx";

import OpportunityPreviewEligibility
  from "./OpportunityPreviewEligibility/OpportunityPreviewEligibility.jsx";

import OpportunityPreviewRequirements
  from "./OpportunityPreviewRequirements/OpportunityPreviewRequirements.jsx";

import OpportunityPreviewBenefits
  from "./OpportunityPreviewBenefits/OpportunityPreviewBenefits.jsx";

import OpportunityPreviewProcess
  from "./OpportunityPreviewProcess/OpportunityPreviewProcess.jsx";

import OpportunityPreviewCTA
  from "./OpportunityPreviewCTA/OpportunityPreviewCTA.jsx";

import "./OpportunityPreview.css";


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
   LOCAL FLAGS
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

const normalize = (value = "") =>
  String(value)
    .toLowerCase()
    .trim();


/* ============================================================
   COUNTRY FLAG
============================================================ */

const getFlag = (countryName = "") => {

  const country = normalize(countryName);

  const map = {

    australia: "australia.png",

    bulgaria: "bulgaria.png",

    canada: "canada.png",

    china: "china.png",

    germany: "germany.png",

    hungary: "hungary.png",

    nigeria: "nigeria.png",

    poland: "poland.png",

    romania: "romania.png",

    serbia: "serbia.png",

    singapore: "singapore.png",

    "united kingdom": "united-kingdom.png",

    "united-kingdom": "united-kingdom.png",

    uk: "united-kingdom.png",

    usa: "usa.png",

    "united states": "usa.png",

    "united-states": "usa.png",

    us: "usa.png",

  };


  const filename = map[country];


  if (!filename) {
    return "";
  }


  const path =
    `/src/assets/images/flags/${filename}`;


  return flagImages[path] || "";
};


/* ============================================================
   OPPORTUNITY IMAGE
============================================================ */

const getOpportunityImage = (opportunity) => {

  if (!opportunity) {
    return "";
  }


  const directImage =
    opportunity.image ||
    opportunity.countryImage;


  if (
    typeof directImage === "string" &&
    (
      directImage.startsWith("http") ||
      directImage.startsWith("/")
    )
  ) {
    return directImage;
  }


  const country =
    normalize(opportunity.countryName);


  const text =
    normalize(
      `${opportunity.title || ""} ${opportunity.category || ""
      } ${opportunity.type || ""
      }`
    );


  const findImage = (filename) => {

    const path =
      `/src/assets/images/opportunities/${filename}`;

    return opportunityImages[path] || "";
  };


  /* ----------------------------------------------------------
     CANADA
  ---------------------------------------------------------- */

  if (country.includes("canada")) {

    if (
      text.includes("health") ||
      text.includes("nurse")
    ) {
      return findImage("canada-healthcare.jpg");
    }

    if (
      text.includes("student") ||
      text.includes("study")
    ) {
      return findImage("canada-study.jpg");
    }

    if (
      text.includes("business") ||
      text.includes("entrepreneur")
    ) {
      return findImage("canada-business.jpg");
    }

    if (text.includes("residen")) {
      return findImage("canada-residency.jpg");
    }

    return findImage("canada-tech.jpg");
  }


  /* ----------------------------------------------------------
     GERMANY
  ---------------------------------------------------------- */

  if (country.includes("germany")) {

    if (
      text.includes("nursing") ||
      text.includes("nurse")
    ) {
      return findImage("germany-nursing.jpg");
    }

    if (text.includes("factory")) {
      return findImage("germany-factory.jpg");
    }

    if (text.includes("hospitality")) {
      return findImage("germany-hospitality.jpg");
    }

    if (text.includes("logistics")) {
      return findImage("germany-logistics.jpg");
    }

    if (text.includes("construction")) {
      return findImage("germany-construction.jpg");
    }

    return findImage("germany-work.jpg");
  }


  /* ----------------------------------------------------------
     BULGARIA
  ---------------------------------------------------------- */

  if (country.includes("bulgaria")) {

    if (text.includes("agricultur")) {
      return findImage("bulgaria-agriculture.jpg");
    }

    if (text.includes("hospitality")) {
      return findImage("bulgaria-hospitality.jpg");
    }

    return findImage("bulgaria-work.jpg");
  }


  /* ----------------------------------------------------------
     CROATIA
  ---------------------------------------------------------- */

  if (country.includes("croatia")) {

    if (text.includes("agricultur")) {
      return findImage("croatia-agriculture.jpg");
    }

    return findImage("croatia-work.jpg");
  }


  /* ----------------------------------------------------------
     HUNGARY
  ---------------------------------------------------------- */

  if (country.includes("hungary")) {

    if (text.includes("agricultur")) {
      return findImage("hungary-agriculture.jpg");
    }

    if (text.includes("construction")) {
      return findImage("hungary-construction.jpg");
    }

    return findImage("hungary-work.jpg");
  }


  /* ----------------------------------------------------------
     LATVIA
  ---------------------------------------------------------- */

  if (country.includes("latvia")) {

    if (text.includes("clean")) {
      return findImage("latvia-cleaning.jpg");
    }

    if (text.includes("construction")) {
      return findImage("latvia-construction.jpg");
    }

    if (
      text.includes("quality") ||
      text.includes("control")
    ) {
      return findImage("latvia-quality-control.jpg");
    }

    return findImage("latvia-work.jpg");
  }


  /* ----------------------------------------------------------
     LITHUANIA
  ---------------------------------------------------------- */

  if (country.includes("lithuania")) {

    if (text.includes("agricultur")) {
      return findImage("lithuania-agriculture.jpg");
    }

    return findImage("lithuania-work.jpg");
  }


  /* ----------------------------------------------------------
     NORWAY
  ---------------------------------------------------------- */

  if (country.includes("norway")) {

    if (
      text.includes("seafood") ||
      text.includes("fish")
    ) {
      return findImage("norway-seafood.jpg");
    }

    return findImage("norway-work.jpg");
  }


  /* ----------------------------------------------------------
     POLAND
  ---------------------------------------------------------- */

  if (country.includes("poland")) {

    if (text.includes("agricultur")) {
      return findImage("poland-agriculture.jpg");
    }

    if (text.includes("factory")) {
      return findImage("poland-factory.jpg");
    }

    if (text.includes("warehouse")) {
      return findImage("poland-warehouse.jpg");
    }

    return findImage("poland-work.jpg");
  }


  /* ----------------------------------------------------------
     ROMANIA
  ---------------------------------------------------------- */

  if (country.includes("romania")) {

    if (text.includes("construction")) {
      return findImage("romania-construction.jpg");
    }

    if (text.includes("factory")) {
      return findImage("romania-factory.jpg");
    }

    if (
      text.includes("housekeep") ||
      text.includes("clean")
    ) {
      return findImage("romania-housekeeping.jpg");
    }

    return findImage("romania-work.jpg");
  }


  /* ----------------------------------------------------------
     SERBIA
  ---------------------------------------------------------- */

  if (country.includes("serbia")) {

    if (text.includes("agricultur")) {
      return findImage("serbia-agriculture.jpg");
    }

    if (text.includes("warehouse")) {
      return findImage("serbia-warehouse.jpg");
    }

    return findImage("serbia-work.jpg");
  }


  /* ----------------------------------------------------------
     SPAIN
  ---------------------------------------------------------- */

  if (country.includes("spain")) {

    if (
      text.includes("fruit") ||
      text.includes("packing")
    ) {
      return findImage("spain-fruit-packing.jpg");
    }

    if (text.includes("warehouse")) {
      return findImage("spain-warehouse.jpg");
    }

    return findImage("spain-work.jpg");
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
      return findImage("software-engineer.jpg");
    }

    if (
      text.includes("health") ||
      text.includes("nurse")
    ) {
      return findImage("caregiver.jpg");
    }

    if (text.includes("construction")) {
      return findImage("construction-worker.jpg");
    }

    return findImage("construction-worker.jpg");
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
      return findImage("software-engineer.jpg");
    }

    if (
      text.includes("health") ||
      text.includes("nurse")
    ) {
      return findImage("caregiver.jpg");
    }

    return findImage("construction-worker.jpg");
  }


  /* ----------------------------------------------------------
     GLOBAL FALLBACKS
  ---------------------------------------------------------- */

  if (
    text.includes("software") ||
    text.includes("developer") ||
    text.includes("technology")
  ) {
    return findImage("software-engineer.jpg");
  }


  if (text.includes("truck")) {
    return findImage("truck-driver.jpg");
  }


  if (
    text.includes("caregiver") ||
    text.includes("health")
  ) {
    return findImage("caregiver.jpg");
  }


  if (text.includes("construction")) {
    return findImage("construction-worker.jpg");
  }


  return "";
};


/* ============================================================
   COMPONENT
============================================================ */

const OpportunityPreview = ({
  opportunity,
  onClose,
  onStartApplication,
  loading = false,
}) => {

  const [
    activeTab,
    setActiveTab,
  ] = useState("overview");


  /* ==========================================================
     RESET TAB WHEN OPPORTUNITY CHANGES
  ========================================================== */

  useEffect(() => {

    setActiveTab("overview");

  }, [opportunity?._id]);


  /* ==========================================================
     EMPTY STATE
  ========================================================== */

  if (!opportunity) {
    return null;
  }


  /* ==========================================================
     DATA
  ========================================================== */

  const {
    title = "Migration Pathway",
    countryName = "International",
  } = opportunity;


  /* ==========================================================
     DISPLAY DATA
  ========================================================== */

  const image =
    getOpportunityImage(opportunity);


  const flag =
    getFlag(countryName);


  /* ==========================================================
     RENDER
  ========================================================== */

  return (

    <div
      className="opportunity-preview-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`${title} pathway overview`}
    >

      <div className="opportunity-preview">


        {/* ==================================================
            HEADER
        ================================================== */}

        <OpportunityPreviewHeader
          onClose={onClose}
          loading={loading}
        />


        {/* ==================================================
            MAIN
        ================================================== */}

        <div className="opportunity-preview-main">


          {/* =================================================
              MEDIA
          ================================================= */}

          <OpportunityPreviewMedia
            image={image}
            flag={flag}
            title={title}
            countryName={countryName}
          />


          {/* =================================================
              DETAILS
          ================================================= */}

          <div className="opportunity-preview-details">


            {/* =================================================
                TABS
            ================================================= */}

            <OpportunityPreviewTabs
              activeTab={activeTab}
              onChange={setActiveTab}
            />


            {/* =================================================
                TAB CONTENT
            ================================================= */}

            <div className="opportunity-preview-overview">

              {activeTab === "overview" && (

                <OpportunityPreviewOverview
                  opportunity={opportunity}
                />

              )}


              {activeTab === "eligibility" && (

                <OpportunityPreviewEligibility
                  opportunity={opportunity}
                />

              )}


              {activeTab === "requirements" && (

                <OpportunityPreviewRequirements
                  opportunity={opportunity}
                />

              )}


              {activeTab === "benefits" && (

                <OpportunityPreviewBenefits
                  opportunity={opportunity}
                />

              )}


              {activeTab === "process" && (

                <OpportunityPreviewProcess
                  opportunity={opportunity}
                />

              )}

            </div>


            {/* =================================================
                CTA
            ================================================= */}

            <OpportunityPreviewCTA
              onStartApplication={onStartApplication}
              loading={loading}
            />

          </div>

        </div>

      </div>

    </div>

  );
};


export default OpportunityPreview;