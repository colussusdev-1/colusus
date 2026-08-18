import "./WhyChooseTravel.css";

import {
  HiOutlineShieldCheck,
  HiOutlineDocumentText,
  HiOutlineClock,
  HiOutlineChatAlt2,
  HiOutlineArrowRight,
} from "react-icons/hi";

import { Link } from "react-router-dom";

import trustGuidance from "../../../../assets/tourist/trust/trust-guidance.png";
import trustDocumentation from "../../../../assets/tourist/trust/trust-documentation.png";
import trustProcess from "../../../../assets/tourist/trust/trust-process.png";
import trustSupport from "../../../../assets/tourist/trust/trust-support.png";

import trustBackground from "../../../../assets/tourist/trust/migration-trust-background.png";
import trustRoute from "../../../../assets/tourist/trust/migration-flight-route.png";
import trustAirplane from "../../../../assets/tourist/trust/migration-airplane.png";
import trustLandmarksLeft from "../../../../assets/tourist/trust/migration-landmarks-left.png";
import trustLandmarksRight from "../../../../assets/tourist/trust/migration-landmarks-right.png";


/* =========================================================
   TRUST / WHY CHOOSE ITEMS
========================================================= */

const reasons = [
  {
    id: "01",

    icon: HiOutlineShieldCheck,

    eyebrow: "TRUSTED SERVICE",

    title: "Trusted Guidance",

    text:
      "Receive reliable migration advice and professional support tailored to your travel goals.",

    image: trustGuidance,
  },

  {
    id: "02",

    icon: HiOutlineDocumentText,

    eyebrow: "DOCUMENTATION",

    title: "Accurate Documentation",

    text:
      "We help you prepare complete and accurate documents to improve your application process.",

    image: trustDocumentation,
  },

  {
    id: "03",

    icon: HiOutlineClock,

    eyebrow: "YOUR JOURNEY",

    title: "Structured Process",

    text:
      "Our step-by-step approach keeps your journey organised from consultation to submission.",

    image: trustProcess,
  },

  {
    id: "04",

    icon: HiOutlineChatAlt2,

    eyebrow: "GLOBAL SUPPORT",

    title: "Continuous Support",

    text:
      "Stay informed with updates and guidance throughout every stage of your migration journey.",

    image: trustSupport,
  },
];


/* =========================================================
   COMPONENT
========================================================= */

const WhyChooseTravel = () => {


  /* =======================================================
     RETURN HOME
  ======================================================= */

  const handleExploreOpportunities = () => {

    /*
      Give React Router a moment to complete
      the navigation before scrolling.
    */

    setTimeout(() => {

      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });

    }, 50);

  };


  return (

    <section
      className="why-travel"

      style={{
        "--trust-bg": `url(${trustBackground})`,
        "--trust-route": `url(${trustRoute})`,
        "--trust-airplane": `url(${trustAirplane})`,
        "--trust-landmarks-left": `url(${trustLandmarksLeft})`,
        "--trust-landmarks-right": `url(${trustLandmarksRight})`,
      }}
    >


      {/* =================================================
          ATMOSPHERIC BACKGROUND
      ================================================= */}

      <div
        className="why-travel-background"
        aria-hidden="true"
      />


      {/* FLIGHT ROUTE */}

      <div
        className="why-travel-route"
        aria-hidden="true"
      />


      {/* AIRPLANE */}

      <div
        className="why-travel-airplane"
        aria-hidden="true"
      />


      {/* LEFT LANDMARKS */}

      <div
        className="
          why-travel-landmarks
          why-travel-landmarks--left
        "
        aria-hidden="true"
      />


      {/* RIGHT LANDMARKS */}

      <div
        className="
          why-travel-landmarks
          why-travel-landmarks--right
        "
        aria-hidden="true"
      />


      {/* =================================================
          MAIN CONTAINER
      ================================================= */}

      <div className="container why-travel-container">


        {/* =================================================
            HEADER
        ================================================= */}

        <header className="why-travel-header">


          {/* EYEBROW */}

          <span className="why-travel-eyebrow">

            <i />

            WHY CHOOSE COLUSUS

          </span>


          {/* TITLE */}

          <h2>

            Migration Made

            <strong>
              Simpler &amp; More Reliable.
            </strong>

          </h2>


          {/* DECORATIVE LINE */}

          <div className="why-travel-heading-line">

            <span />

            <span />

          </div>


          {/* DESCRIPTION */}

          <p>

            Whether you're travelling to work, study, visit or relocate,
            our team provides the guidance, preparation and support
            needed to help you move forward with confidence.

          </p>


          {/* JOURNEY META */}

          <div className="why-travel-meta">

            <span>
              PLAN
            </span>

            <b>
              •
            </b>

            <span>
              PREPARE
            </span>

            <b>
              •
            </b>

            <span>
              MOVE FORWARD
            </span>

          </div>


        </header>


        {/* =================================================
            TRUST CARDS
        ================================================= */}

        <div className="why-travel-grid">


          {reasons.map((item) => {


            const Icon = item.icon;


            return (

              <article
                key={item.id}
                className="why-travel-card"
              >


                {/* =========================================
                    CARD VISUAL
                ========================================= */}

                <div className="why-travel-card-visual">


                  {/* IMAGE */}

                  <img
                    src={item.image}
                    alt=""
                    className="why-travel-card-image"
                  />


                  {/* IMAGE OVERLAY */}

                  <div
                    className="
                      why-travel-card-image-overlay
                    "
                  />


                  {/* NUMBER */}

                  <span className="why-travel-number">

                    {item.id}

                  </span>


                  {/* ICON */}

                  <div className="why-travel-icon">

                    <Icon />

                  </div>


                </div>


                {/* =========================================
                    CARD CONTENT
                ========================================= */}

                <div className="why-travel-card-content">


                  {/* EYEBROW */}

                  <span className="why-travel-card-eyebrow">

                    {item.eyebrow}

                  </span>


                  {/* TITLE */}

                  <h3>

                    {item.title}

                  </h3>


                  {/* DESCRIPTION */}

                  <p>

                    {item.text}

                  </p>


                </div>


              </article>

            );

          })}


        </div>


        {/* =================================================
            PATHWAY CTA
        ================================================= */}

        <div className="why-travel-highlight">


          {/* BACKGROUND GLOW */}

          <div
            className="why-travel-highlight-glow"
            aria-hidden="true"
          />


          {/* CTA ICON */}

          <div className="why-travel-highlight-icon">

            <HiOutlineShieldCheck />

          </div>


          {/* CTA CONTENT */}

          <div className="highlight-content">


            <span className="highlight-eyebrow">

              YOUR NEXT STEP

            </span>


            <h3>

              Ready To Find Your Best Pathway?

            </h3>


            <p>

              Explore work, study, tourism and permanent residence
              opportunities tailored to your goals and start your
              international journey today.

            </p>


          </div>


          {/* =================================================
              EXPLORE OPPORTUNITIES

              Returns to HOME and scrolls to the top.
          ================================================= */}

          <Link
            to="/#global-opportunities"
            className="highlight-button"
          >
            <span>
              Explore Opportunities
            </span>

            <span className="highlight-button-icon">
              <HiOutlineArrowRight />
            </span>
          </Link>


          {/* CTA ROUTE ART */}

          <div
            className="highlight-route"
            aria-hidden="true"
          />


        </div>


        {/* =================================================
            FOOTER MICRO MESSAGE
        ================================================= */}

        <div className="why-travel-footer-note">


          <span
            className="why-travel-footer-dot"
            aria-hidden="true"
          />


          <span>

            Your journey deserves more than paperwork.

          </span>


          <strong>

            It deserves a clear plan.

          </strong>


        </div>


      </div>


    </section>

  );

};


export default WhyChooseTravel;