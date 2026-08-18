import "./TravelExperience.css";

import {
  HiOutlineGlobeAlt,
  HiOutlineCamera,
  HiOutlineSparkles,
  HiOutlineMap,
  HiOutlineArrowRight,
  HiOutlineLocationMarker,
} from "react-icons/hi";

import travel1 from "../../../../assets/tourist/experience-1.jpg";
import travel2 from "../../../../assets/tourist/experience-2.jpg";
import travel3 from "../../../../assets/tourist/experience-3.jpg";

import moreThanVisaBackground
  from "../../../../assets/tourist/more-than-visa/more-than-visa-background.png";

import worldStamp
  from "../../../../assets/tourist/more-than-visa/travel-stamp-world.png";

import passportStamp
  from "../../../../assets/tourist/more-than-visa/travel-stamp-passport.png";

import adventureStamp
  from "../../../../assets/tourist/more-than-visa/travel-stamp-adventure.png";

import promiseGlobe
  from "../../../../assets/tourist/more-than-visa/promise-globe-icon.png";

import journeyWorldMap
  from "../../../../assets/tourist/more-than-visa/journey-world-map.png";


const experiences = [

  {
    id: "01",

    icon: HiOutlineCamera,

    label: "EXPLORE",

    title: "Discover Iconic Destinations",

    text:
      "Experience world-famous landmarks, breathtaking landscapes and unforgettable cities across the globe.",

    image: travel1,
  },


  {
    id: "02",

    icon: HiOutlineSparkles,

    label: "MEMORIES",

    title: "Create Lifelong Experiences",

    text:
      "Whether travelling alone, with family or loved ones, every journey becomes a story worth remembering.",

    image: travel2,
  },


  {
    id: "03",

    icon: HiOutlineMap,

    label: "CONFIDENCE",

    title: "Travel Without Uncertainty",

    text:
      "From preparation to documentation, we help you move forward with clarity before your departure.",

    image: travel3,
  },

];


const TravelExperience = () => {

  return (

    <section className="travel-experience">


      {/* =====================================================
                FULL BACKGROUND
            ===================================================== */}

      <div
        className="travel-experience-background"
        aria-hidden="true"
      >

        <img
          src={moreThanVisaBackground}
          alt=""
          className="travel-experience-background-image"
        />

        <div className="travel-experience-background-wash"></div>

      </div>



      {/* =====================================================
                DECORATIVE TRAVEL ELEMENTS
            ===================================================== */}

      <img
        src={worldStamp}
        alt=""
        className="travel-experience-stamp travel-experience-stamp-one"
        aria-hidden="true"
      />

      <img
        src={passportStamp}
        alt=""
        className="travel-experience-stamp travel-experience-stamp-two"
        aria-hidden="true"
      />

      <img
        src={adventureStamp}
        alt=""
        className="travel-experience-stamp travel-experience-stamp-three"
        aria-hidden="true"
      />



      {/* =====================================================
                CONTENT
            ===================================================== */}

      <div className="container">


        {/* =================================================
                    HEADER
                ================================================= */}

        <header className="travel-experience-header">


          <span className="travel-experience-eyebrow">

            <span className="travel-experience-eyebrow-dot"></span>

            THE WORLD IS WAITING

          </span>



          <h2>

            More Than A Visa.

            <span>
              It's A Journey.
            </span>

          </h2>



          <div className="travel-experience-header-line">

            <span></span>

            <span></span>

          </div>



          <p>

            Every destination tells a story. We help you
            prepare, plan and travel with confidence so
            you can focus on experiencing the world.

          </p>


          <div className="travel-experience-route-label">

            <HiOutlineGlobeAlt />

            <span>
              PLAN • PREPARE • EXPERIENCE
            </span>

          </div>

        </header>



        {/* =================================================
                    EXPERIENCE CARDS
                ================================================= */}

        <div className="travel-experience-grid">


          {experiences.map((item, index) => {

            const Icon = item.icon;


            return (

              <article
                className={`travel-experience-card ${index === 1
                    ? "travel-experience-card-featured"
                    : ""
                  }`}
                key={item.id}
              >


                {/* =================================
                                    IMAGE
                                ================================= */}

                <div className="travel-card-image">


                  <img
                    src={item.image}
                    alt={item.title}
                    loading={
                      index === 0
                        ? "eager"
                        : "lazy"
                    }
                  />


                  <div className="travel-card-image-overlay"></div>


                  {/* NUMBER */}

                  <div className="travel-card-number">

                    {item.id}

                  </div>



                  {/* ICON */}

                  <div className="travel-card-icon">

                    <Icon />

                  </div>



                  {/* LOCATION MARKER */}

                  <div className="travel-card-location">

                    <HiOutlineLocationMarker />

                    <span>
                      GLOBAL DESTINATION
                    </span>

                  </div>


                </div>



                {/* =================================
                                    CONTENT
                                ================================= */}

                <div className="travel-card-content">


                  <span className="travel-card-label">

                    <span></span>

                    {item.label}

                  </span>



                  <h3>

                    {item.title}

                  </h3>



                  <p>

                    {item.text}

                  </p>



                  <div className="travel-card-footer">

                    <span>
                      DISCOVER MORE
                    </span>

                    <HiOutlineArrowRight />

                  </div>


                </div>



                {/* =================================
                                    CARD EDGE
                                ================================= */}

                <div
                  className="travel-card-edge"
                  aria-hidden="true"
                ></div>


              </article>

            );

          })}

        </div>



        {/* =================================================
                    JOURNEY PROMISE
                ================================================= */}

        <div className="travel-highlight">


          {/* IMAGE / ICON */}

          <div className="travel-highlight-icon">

            <img
              src={promiseGlobe}
              alt=""
              aria-hidden="true"
            />

          </div>



          {/* CONTENT */}

          <div className="travel-highlight-content">


            <span className="travel-highlight-label">

              YOUR JOURNEY STARTS HERE

            </span>


            <h3>

              Your Journey Begins Long Before
              You Board The Plane.

            </h3>


            <p>

              Proper preparation reduces delays and
              uncertainty. We guide you through travel
              planning, documentation and application
              preparation so your journey starts with
              confidence.

            </p>


          </div>



          {/* STATUS */}

          <div className="travel-highlight-status">

            <span className="travel-highlight-status-dot"></span>

            <span>
              READY WHEN YOU ARE
            </span>

          </div>


        </div>



        {/* =================================================
                    BOTTOM WORLD MAP
                ================================================= */}

        <div
          className="travel-experience-map"
          aria-hidden="true"
        >

          <img
            src={journeyWorldMap}
            alt=""
          />

        </div>



        {/* =================================================
                    BOTTOM STATEMENT
                ================================================= */}

        <div className="travel-experience-bottom">

          <div className="travel-experience-bottom-line"></div>

          <span>
            The world is bigger than a visa.
          </span>

          <strong>
            Let your journey begin.
          </strong>

          <div className="travel-experience-bottom-line"></div>

        </div>


      </div>

    </section>

  );

};


export default TravelExperience;