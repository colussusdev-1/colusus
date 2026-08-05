import "./WhyChooseTravel.css";

import {
  HiOutlineShieldCheck,
  HiOutlineDocumentText,
  HiOutlineClock,
  HiOutlineChatAlt2,
  HiOutlineSparkles,
  HiOutlineArrowRight,
} from "react-icons/hi";

import { Link } from "react-router-dom";

const reasons = [
  {
    id: 1,
    icon: HiOutlineShieldCheck,
    title: "Trusted Guidance",
    text:
      "Receive reliable migration advice and professional support tailored to your travel goals.",
  },

  {
    id: 2,
    icon: HiOutlineDocumentText,
    title: "Accurate Documentation",
    text:
      "We help you prepare complete and accurate documents to improve your application process.",
  },

  {
    id: 3,
    icon: HiOutlineClock,
    title: "Structured Process",
    text:
      "Our step-by-step approach keeps your journey organised from consultation to submission.",
  },

  {
    id: 4,
    icon: HiOutlineChatAlt2,
    title: "Continuous Support",
    text:
      "Stay informed with updates and guidance throughout every stage of your migration journey.",
  },
];

const WhyChooseTravel = () => {
  return (
    <section className="why-travel">

      <div className="container">

        <div className="why-travel-header">

          <span>WHY CHOOSE COLUSUS</span>

          <h2>

            Migration Made

            <strong> Simpler & More Reliable</strong>

          </h2>

          <p>

            Whether you're travelling to work, study, visit or relocate,
            our team provides the guidance, preparation and support
            needed to help you move forward with confidence.

          </p>

        </div>

        <div className="why-travel-grid">

          {reasons.map((item) => {

            const Icon = item.icon;

            return (

              <article
                key={item.id}
                className="why-travel-card"
              >

                <div className="why-travel-icon">

                  <Icon />

                </div>

                <h3>{item.title}</h3>

                <p>{item.text}</p>

              </article>

            );

          })}

        </div>

        <div className="why-travel-highlight">

          <div className="highlight-icon">

            <HiOutlineSparkles />

          </div>

          <div className="highlight-content">

            <h3>

              Ready To Find Your Best Pathway?

            </h3>

            <p>

              Explore work, study, tourism and permanent residence
              opportunities tailored to your goals and start your
              international journey today.

            </p>

          </div>

          <Link
            to="/opportunities"
            className="highlight-button"
          >

            Explore Opportunities

            <HiOutlineArrowRight />

          </Link>

        </div>

      </div>

    </section>
  );
};

export default WhyChooseTravel;