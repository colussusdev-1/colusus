import "./TravelVisaGrid.css";

import { Link } from "react-router-dom";

import {
  HiOutlineGlobeAlt,
  HiOutlineBriefcase,
  HiOutlineAcademicCap,
  HiOutlineHeart,
  HiOutlineArrowRight,
  HiOutlineSparkles,
  HiOutlineLocationMarker,
} from "react-icons/hi";

import backgroundImage
  from "../../../../assets/tourist/travel-pathways/what-brings-you-abroad-background.png";

import routeImage
  from "../../../../assets/tourist/travel-pathways/what-brings-you-abroad-route.png";

import tourismImage
  from "../../../../assets/tourist/travel-pathways/pathway-tourism.png";

import businessImage
  from "../../../../assets/tourist/travel-pathways/pathway-business.png";

import studyImage
  from "../../../../assets/tourist/travel-pathways/pathway-study.png";

import familyImage
  from "../../../../assets/tourist/travel-pathways/pathway-family.png";

import landmarksImage
  from "../../../../assets/tourist/travel-pathways/global-destinations-landmarks.png";

import consultationRoute
  from "../../../../assets/tourist/travel-pathways/pathway-consultation-route.png";

import consultationIcon
  from "../../../../assets/tourist/travel-pathways/pathway-consultation-icon.png";


const visaOptions = [

  {
    id: "01",

    icon: HiOutlineGlobeAlt,

    title: "Tourism & Holidays",

    subtitle: "Explore the World",

    description:
      "Discover beautiful destinations for vacations, sightseeing and unforgettable travel experiences.",

    tags: [
      "Vacation",
      "Tourism",
      "Adventure"
    ],

    image: tourismImage,

    destination: "Global Destinations",

    path: "/travel/tourism",
  },


  {
    id: "02",

    icon: HiOutlineBriefcase,

    title: "Business Travel",

    subtitle: "Grow Internationally",

    description:
      "Attend business meetings, conferences and international networking opportunities with confidence.",

    tags: [
      "Business",
      "Meetings",
      "Events"
    ],

    image: businessImage,

    destination: "International Business",

    path: "/travel/business",
  },


  {
    id: "03",

    icon: HiOutlineAcademicCap,

    title: "Study Abroad",

    subtitle: "Learn Without Borders",

    description:
      "Access international education pathways, universities and student visa guidance.",

    tags: [
      "Universities",
      "Programs",
      "Education"
    ],

    image: studyImage,

    destination: "Global Education",

    path: "/travel/study",

    featured: true,
  },


  {
    id: "04",

    icon: HiOutlineHeart,

    title: "Family Visits",

    subtitle: "Reconnect Abroad",

    description:
      "Travel confidently to reunite with loved ones for family visits, celebrations and special moments.",

    tags: [
      "Family",
      "Visits",
      "Support"
    ],

    image: familyImage,

    destination: "Family Travel",

    path: "/travel/family",
  },

];


const TravelVisaGrid = () => {

  return (

    <section className="travel-visa-grid">


      {/* =====================================================
                BACKGROUND
            ===================================================== */}

      <div
        className="travel-visa-background"
        aria-hidden="true"
      >

        <img
          src={backgroundImage}
          alt=""
          className="travel-visa-background-image"
        />

        <div className="travel-visa-background-wash"></div>

        <img
          src={routeImage}
          alt=""
          className="travel-visa-route"
        />

        <img
          src={landmarksImage}
          alt=""
          className="travel-visa-landmarks"
        />

      </div>


      {/* =====================================================
                CONTENT
            ===================================================== */}

      <div className="container">


        {/* =================================================
                    HEADER
                ================================================= */}

        <header className="travel-visa-header">

          <span className="travel-visa-eyebrow">

            <i></i>

            START YOUR JOURNEY

          </span>


          <h2>

            What Brings You

            <strong>
              Abroad?
            </strong>

          </h2>


          <div className="travel-visa-heading-line">

            <span></span>

            <span></span>

          </div>


          <p>

            Every journey begins with a purpose.
            Choose the pathway that best matches
            your travel goals and discover what
            becomes possible beyond your borders.

          </p>


          <div className="travel-visa-route-label">

            <HiOutlineLocationMarker />

            <span>
              CHOOSE YOUR PATH • PLAN WITH CONFIDENCE
            </span>

          </div>

        </header>



        {/* =================================================
                    PATHWAY CARDS
                ================================================= */}

        <div className="travel-visa-cards">


          {visaOptions.map((item) => {

            const Icon = item.icon;


            return (

              <Link
                key={item.id}
                to={item.path}
                className={`travel-visa-card ${item.featured
                    ? "travel-visa-card-featured"
                    : ""
                  }`}
              >


                {/* =================================
                                    IMAGE
                                ================================= */}

                <div className="travel-visa-card-image">


                  <img
                    src={item.image}
                    alt={item.title}
                  />


                  <div className="travel-visa-card-image-overlay"></div>


                  <span className="travel-visa-card-number">
                    {item.id}
                  </span>


                  <div className="travel-visa-icon">

                    <Icon />

                  </div>


                  <div className="travel-visa-destination">

                    <HiOutlineLocationMarker />

                    {item.destination}

                  </div>


                </div>



                {/* =================================
                                    CONTENT
                                ================================= */}

                <div className="travel-visa-card-content">


                  <span className="travel-visa-subtitle">

                    <i></i>

                    {item.subtitle}

                  </span>


                  <h3>
                    {item.title}
                  </h3>


                  <p>
                    {item.description}
                  </p>



                  {/* TAGS */}

                  <div className="travel-visa-tags">

                    {item.tags.map((tag) => (

                      <span key={tag}>
                        {tag}
                      </span>

                    ))}

                  </div>



                  {/* CARD FOOTER */}

                  <div className="travel-visa-card-footer">

                    <span>
                      EXPLORE PATHWAY
                    </span>

                    <span className="travel-visa-card-arrow">

                      <HiOutlineArrowRight />

                    </span>

                  </div>


                </div>


                <div
                  className="travel-visa-card-glow"
                  aria-hidden="true"
                ></div>


              </Link>

            );

          })}


        </div>



        {/* =================================================
                    CONSULTATION CTA
                ================================================= */}

        <div className="travel-visa-highlight">


          {/* Decorative route */}

          <img
            src={consultationRoute}
            alt=""
            className="travel-highlight-route"
            aria-hidden="true"
          />



          {/* Left icon */}

          <div className="travel-highlight-icon">

            <img
              src={consultationIcon}
              alt=""
            />

          </div>



          {/* Content */}

          <div className="travel-highlight-content">


            <span className="travel-highlight-eyebrow">

              PERSONALIZED GUIDANCE

            </span>


            <h3>

              Not Sure Which Pathway
              <strong> Is Right For You?</strong>

            </h3>


            <p>

              Speak with one of our migration advisors
              and receive personalised guidance based
              on your goals, eligibility and preferred
              destination.

            </p>


          </div>



          {/* CTA */}

          <Link
            to="/contact"
            className="travel-highlight-button"
          >

            <span>
              Book Free Consultation
            </span>

            <HiOutlineArrowRight />

          </Link>


        </div>



        {/* =================================================
                    BOTTOM STATEMENT
                ================================================= */}

        <div className="travel-visa-bottom">

          <span></span>

          <p>

            Every destination starts with a decision.

            <strong>
              Let’s make yours a clear one.
            </strong>

          </p>

          <span></span>

        </div>


      </div>

    </section>

  );

};


export default TravelVisaGrid;