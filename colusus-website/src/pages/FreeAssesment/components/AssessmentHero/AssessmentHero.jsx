import {
  HiArrowRight,
  HiOutlineCheckCircle,
  HiOutlineGlobeAlt,
  HiOutlineSparkles
} from "react-icons/hi";

import "./AssessmentHero.css";


const AssessmentHero = ({
  onStart
}) => {

  const trustItems = [
    "Expert Migration Guidance",
    "Personalized Recommendations",
    "100% Free Assessment"
  ];

  return (
    <section className="assessmentHero">
      {/* BACKGROUND ELEMENTS */}
      <div className="assessmentHero__glow"></div>
      <div className="assessmentHero__container">

        {/* LEFT CONTENT */}

        <div className="assessmentHero__content">
          <div className="assessmentHero__badge">
            <HiOutlineSparkles />
            Free Migration Assessment
          </div>
          <h1>
            Discover Your
            <span>
              Best Migration Pathway
            </span>
          </h1>
          <p>
            Answer a few questions about your
            goals, experience and future plans.
            Our assessment will identify the
            immigration opportunities that fit you best.
          </p>
          <button
            className="assessmentHero__button"
            onClick={onStart}
          >
            Start Your Assessment
            <HiArrowRight />
          </button>

          <div className="assessmentHero__trust">
            {
              trustItems.map(item => (
                <div
                  className="assessmentHero__trustItem"
                  key={item}
                >
                  <HiOutlineCheckCircle />
                  <span>
                    {item}
                  </span>
                </div>
              ))
            }
          </div>
        </div>

        {/* RIGHT VISUAL */}

        <div className="assessmentHero__visual">
          <div className="assessmentHero__card">
            <div className="assessmentHero__cardTop">
              <HiOutlineGlobeAlt />
              <span>
                Your Journey
              </span>
            </div>
            <h3>
              Find Your
              <span>
                Global Opportunity
              </span>
            </h3>
            <div className="assessmentSteps">
              <div className="step active">
                Canada
              </div>
              <div className="step">
                Australia
              </div>
              <div className="step">
                Europe
              </div>
            </div>

            <div className="assessmentProgress">
              <span></span>
            </div>
            <p>
              Matching your profile with
              suitable pathways...
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
export default AssessmentHero;