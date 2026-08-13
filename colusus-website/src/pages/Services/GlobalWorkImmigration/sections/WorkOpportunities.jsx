import "./WorkOpportunities.css";

import {
  HiOutlineBriefcase,
  HiOutlineGlobeAlt,
  HiOutlineAcademicCap,
  HiOutlineOfficeBuilding,
  HiOutlineArrowRight,
  HiOutlineCheckCircle,
  HiOutlineShieldCheck,
} from "react-icons/hi";

import { Link } from "react-router-dom";


/* =========================================================
   WORK OPPORTUNITY IMAGES
========================================================= */

import workBackground
  from "../../../../assets/images/work-opportunities/work-opportunities-background.png";

import cardImage01
  from "../../../../assets/images/work-opportunities/card1.png";

import cardImage02
  from "../../../../assets/images/work-opportunities/card2.png";

import cardImage03
  from "../../../../assets/images/work-opportunities/card3.png";

import cardImage04
  from "../../../../assets/images/work-opportunities/card4.png";

import ctaBackground
  from "../../../../assets/images/work-opportunities/cta-background.png";


/* =========================================================
   OPPORTUNITIES
========================================================= */

const opportunities = [

  {
    number: "01",

    icon: HiOutlineBriefcase,

    title: "International Careers",

    text:
      "Access overseas employment pathways connecting skilled professionals with global companies and growing industries.",

    benefits: [
      "Verified opportunities",
      "Career guidance",
      "Relocation support",
    ],

    image: cardImage01,

    theme: "blue",
  },


  {
    number: "02",

    icon: HiOutlineGlobeAlt,

    title: "Work Visa Pathways",

    text:
      "Discover legal immigration routes designed for professionals seeking better career opportunities abroad.",

    benefits: [
      "Eligibility assessment",
      "Application guidance",
      "Documentation support",
    ],

    image: cardImage02,

    theme: "green",
  },


  {
    number: "03",

    icon: HiOutlineAcademicCap,

    title: "Study & Work Routes",

    text:
      "Combine international education with career opportunities through structured study and employment programs.",

    benefits: [
      "School selection",
      "Visa preparation",
      "Future career planning",
    ],

    image: cardImage03,

    theme: "orange",
  },


  {
    number: "04",

    icon: HiOutlineOfficeBuilding,

    title: "Business Relocation",

    text:
      "Expand your business globally with expert support for international relocation and market opportunities.",

    benefits: [
      "Business setup support",
      "Market guidance",
      "Global expansion",
    ],

    image: cardImage04,

    theme: "purple",
  },

];


/* =========================================================
   WORK OPPORTUNITIES
========================================================= */

const WorkOpportunities = () => {

  return (

    <section
      className="work-opportunities"
      aria-labelledby="work-opportunities-title"
      style={{
        "--work-background":
          `url(${workBackground})`,

        "--work-cta-background":
          `url(${ctaBackground})`,
      }}
    >


      {/* =================================================
                SECTION BACKGROUND
            ================================================= */}

      <div
        className="work-opportunities-background"
        aria-hidden="true"
      >

        <div className="work-background-image" />

        <div className="work-background-overlay" />

        <span className="work-background-glow work-glow-one" />

        <span className="work-background-glow work-glow-two" />

        <span className="work-background-orbit work-orbit-one" />

        <span className="work-background-orbit work-orbit-two" />

      </div>


      {/* =================================================
                MAIN CONTAINER
            ================================================= */}

      <div className="work-container">


        {/* =================================================
                    HEADER
                ================================================= */}

        <header className="work-header">

          <span className="work-tag">

            <span className="work-tag-icon">

              <HiOutlineGlobeAlt />

            </span>

            GLOBAL OPPORTUNITIES

          </span>


          <h2 id="work-opportunities-title">

            Build Your Future

            <span>
              Beyond Borders
            </span>

          </h2>


          <span
            className="work-title-line"
            aria-hidden="true"
          />


          <p>

            Whether you are seeking employment,
            education, entrepreneurship or relocation,
            we help you discover the right global
            pathway for your ambitions.

          </p>

        </header>


        {/* =================================================
                    OPPORTUNITY CARDS
                ================================================= */}

        <div className="work-grid">

          {opportunities.map((item, index) => {

            const Icon = item.icon;

            return (

              <article
                key={item.number}
                className={`
                                    work-card
                                    work-card-${item.theme}
                                `}
                style={{
                  "--card-delay":
                    `${index * 100}ms`,
                }}
              >


                {/* =================================
                                    CARD IMAGE
                                ================================= */}

                <div className="work-card-image">

                  <img
                    src={item.image}
                    alt=""
                    aria-hidden="true"
                  />

                  <div className="work-card-image-overlay" />


                  {/* IMAGE HEADER */}

                  <div className="work-card-top">

                    <div className="work-icon">

                      <Icon />

                    </div>


                    <span className="work-number">

                      {item.number}

                    </span>

                  </div>

                </div>


                {/* =================================
                                    CARD BODY
                                ================================= */}

                <div className="work-card-body">


                  <h3>
                    {item.title}
                  </h3>


                  <p className="work-card-description">

                    {item.text}

                  </p>


                  {/* BENEFITS */}

                  <ul className="work-benefits">

                    {item.benefits.map(
                      (benefit) => (

                        <li
                          key={benefit}
                        >

                          <HiOutlineCheckCircle />

                          <span>
                            {benefit}
                          </span>

                        </li>

                      )
                    )}

                  </ul>


                  {/* CARD CTA */}

                  <Link
                    to="/free-assessment"
                    className="work-card-link"
                  >

                    <span>
                      Explore Pathway
                    </span>

                    <HiOutlineArrowRight />

                  </Link>

                </div>


                {/* CARD ACCENT */}

                <span
                  className="work-card-accent"
                  aria-hidden="true"
                />

              </article>

            );

          })}

        </div>


        {/* =================================================
                    CTA
                ================================================= */}

        <section className="work-cta">


          {/* CTA IMAGE */}

          <div
            className="work-cta-background"
            aria-hidden="true"
          />

          <div
            className="work-cta-overlay"
            aria-hidden="true"
          />


          {/* CTA DECORATION */}

          <div
            className="work-cta-decoration"
            aria-hidden="true"
          >

            <span className="work-cta-orbit" />

            <span className="work-cta-dot work-cta-dot-one" />

            <span className="work-cta-dot work-cta-dot-two" />

          </div>


          {/* CTA CONTENT */}

          <div className="work-cta-content">


            <div className="work-cta-icon">

              <HiOutlineGlobeAlt />

            </div>


            <div>

              <span className="work-cta-kicker">

                YOUR NEXT MOVE

              </span>


              <h3>

                Ready to discover your
                global opportunity?

              </h3>


              <p>

                Take our assessment and understand
                which pathway matches your profile.

              </p>

            </div>

          </div>


          {/* CTA ACTION */}

          <div className="work-cta-action">


            <Link
              to="/free-assessment"
              className="work-cta-button"
            >

              <span>
                Start Free Assessment
              </span>

              <HiOutlineArrowRight />

            </Link>


            <span className="work-cta-trust">

              <HiOutlineShieldCheck />

              Quick • Secure • Personalized

            </span>

          </div>


        </section>


      </div>

    </section>

  );

};


export default WorkOpportunities;