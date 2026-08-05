import "./TravelVisaGrid.css";

import { Link } from "react-router-dom";

import {
  HiOutlineGlobeAlt,
  HiOutlineBriefcase,
  HiOutlineAcademicCap,
  HiOutlineHeart,
  HiOutlineArrowRight,
  HiOutlineSparkles,
} from "react-icons/hi";

const visaOptions = [
  {
    id: 1,
    icon: HiOutlineGlobeAlt,

    title: "Tourism & Holidays",

    subtitle: "Explore the World",

    description:
      "Discover beautiful destinations for vacations, sightseeing and unforgettable travel experiences.",

    tags: ["Vacation", "Tourism", "Adventure"],

    button: "Explore Destinations",

    path: "/travel/tourism",
  },

  {
    id: 2,
    icon: HiOutlineBriefcase,

    title: "Business Travel",

    subtitle: "Grow Internationally",

    description:
      "Attend business meetings, conferences and international networking opportunities with confidence.",

    tags: ["Business", "Meetings", "Events"],

    button: "View Opportunities",

    path: "/travel/business",
  },

  {
    id: 3,
    icon: HiOutlineAcademicCap,

    title: "Study Abroad",

    subtitle: "Learn Without Borders",

    description:
      "Access international education pathways, universities and student visa guidance.",

    tags: ["Universities", "Programs", "Education"],

    button: "Find Programs",

    path: "/travel/study",
  },

  {
    id: 4,
    icon: HiOutlineHeart,

    title: "Family Visits",

    subtitle: "Reconnect Abroad",

    description:
      "Travel confidently to reunite with loved ones for family visits, celebrations and special moments.",

    tags: ["Family", "Visits", "Support"],

    button: "Learn More",

    path: "/travel/family",
  },
];

const TravelVisaGrid = () => {
  return (
    <section className="travel-visa-grid">

      <div className="container">

        {/* Header */}

        <div className="travel-visa-header">

          <span>

            START YOUR JOURNEY

          </span>

          <h2>

            What Brings You

            <strong> Abroad?</strong>

          </h2>

          <p>

            Every journey begins with a purpose.
            Choose the option that best matches your travel goals
            and explore the opportunities available to you.

          </p>

        </div>

        {/* Cards */}

        <div className="travel-visa-cards">

          {visaOptions.map((item) => {

            const Icon = item.icon;

            return (

              <Link
                key={item.id}
                to={item.path}
                className="travel-visa-card"
              >

                <div className="travel-card-top">

                  <div className="travel-visa-icon">

                    <Icon />

                  </div>

                  <span className="travel-card-subtitle">

                    {item.subtitle}

                  </span>

                </div>

                <h3>

                  {item.title}

                </h3>

                <p>

                  {item.description}

                </p>

                <div className="travel-visa-tags">

                  {item.tags.map((tag) => (

                    <span key={tag}>

                      {tag}

                    </span>

                  ))}

                </div>

                <div className="travel-card-footer">

                  <span>

                    {item.button}

                  </span>

                  <HiOutlineArrowRight />

                </div>

              </Link>

            );

          })}

        </div>

        {/* Bottom CTA */}

        <div className="travel-visa-highlight">

          <div className="travel-highlight-icon">

            <HiOutlineSparkles />

          </div>

          <div className="travel-highlight-content">

            <h3>

              Not Sure Which Pathway Is Right For You?

            </h3>

            <p>

              Speak with one of our migration advisors and receive
              personalised guidance based on your goals,
              eligibility and preferred destination.

            </p>

          </div>

          <Link
            to="/contact"
            className="travel-highlight-button"
          >

            Book Free Consultation

            <HiOutlineArrowRight />

          </Link>

        </div>

      </div>

    </section>
  );
};

export default TravelVisaGrid;