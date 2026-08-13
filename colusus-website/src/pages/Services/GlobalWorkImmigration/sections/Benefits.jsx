import "./Benefits.css";

import {
  HiOutlineShieldCheck,
  HiOutlineUserGroup,
  HiOutlineDocumentText,
  HiOutlineSupport,
  HiOutlineGlobeAlt,
  HiOutlineTrendingUp,
  HiOutlineArrowRight,
} from "react-icons/hi";

import benefit01 from "../../../../assets/images/benefits/01.png";
import benefit02 from "../../../../assets/images/benefits/02.png";
import benefit03 from "../../../../assets/images/benefits/03.png";
import benefit04 from "../../../../assets/images/benefits/04.png";
import benefit05 from "../../../../assets/images/benefits/05.png";
import benefit06 from "../../../../assets/images/benefits/06.png";


const benefits = [

  {
    icon: <HiOutlineShieldCheck />,
    number: "01",
    label: "TRUSTED GUIDANCE",
    title: "Trusted Migration Guidance",
    text:
      "Navigate international opportunities with professional support designed to reduce uncertainty and migration risks.",
    image: benefit01,
    theme: "blue",
  },

  {
    icon: <HiOutlineDocumentText />,
    number: "02",
    label: "APPLICATION SUPPORT",
    title: "Complete Application Support",
    text:
      "From documentation preparation to submission guidance, we help you stay organised throughout your migration journey.",
    image: benefit02,
    theme: "green",
  },

  {
    icon: <HiOutlineGlobeAlt />,
    number: "03",
    label: "GLOBAL ACCESS",
    title: "Global Destination Access",
    text:
      "Explore work, study and relocation pathways across some of the world's most attractive destinations.",
    image: benefit03,
    theme: "orange",
  },

  {
    icon: <HiOutlineUserGroup />,
    number: "04",
    label: "PERSONALISED SUPPORT",
    title: "Personalised Consultation",
    text:
      "Every applicant receives guidance based on their skills, goals and international ambitions.",
    image: benefit04,
    theme: "purple",
  },

  {
    icon: <HiOutlineSupport />,
    number: "05",
    label: "END-TO-END SUPPORT",
    title: "End-To-End Assistance",
    text:
      "Receive support beyond applications including relocation planning and settling-in guidance.",
    image: benefit05,
    theme: "cyan",
  },

  {
    icon: <HiOutlineTrendingUp />,
    number: "06",
    label: "CAREER GROWTH",
    title: "Career Growth Opportunities",
    text:
      "Unlock pathways that help professionals build stronger careers in global markets.",
    image: benefit06,
    theme: "indigo",
  },

];


const Benefits = () => {

  return (

    <section
      className="benefits"
      aria-labelledby="benefits-title"
    >

      {/* =================================================
                BACKGROUND
            ================================================= */}

      <div
        className="benefits-background"
        aria-hidden="true"
      >

        <div className="benefits-background-glow"></div>

        <div className="benefits-background-grid"></div>

      </div>


      <div className="benefits-container">


        {/* =================================================
                    HEADER
                ================================================= */}

        <header className="benefits-header">

          <span className="benefits-tag">

            <span className="benefits-tag-dot"></span>

            WHY CHOOSE COLOSSUS

          </span>


          <h2 id="benefits-title">

            More Than Migration.

            <span>
              A Complete Global Journey.
            </span>

          </h2>


          <div className="benefits-header-line"></div>


          <p>

            Relocating internationally requires the right
            strategy, support and information. We provide
            everything you need to confidently pursue
            global opportunities.

          </p>

        </header>



        {/* =================================================
                    BENEFITS GRID
                ================================================= */}

        <div className="benefits-grid">

          {benefits.map((item, index) => (

            <article
              className={`benefit-card benefit-card-${item.theme}`}
              key={item.number}
              style={{
                "--benefit-image": `url(${item.image})`,
                "--card-index": index,
              }}
            >

              {/* =================================================
                                IMAGE SYSTEM
                            ================================================= */}

              <div
                className="benefit-image"
                aria-hidden="true"
              ></div>


              <div
                className="benefit-image-wash"
                aria-hidden="true"
              ></div>


              {/* =================================================
                                TOP ROW
                            ================================================= */}

              <div className="benefit-top">

                <div className="benefit-icon">

                  {item.icon}

                </div>


                <span className="benefit-number">

                  {item.number}

                </span>

              </div>


              {/* =================================================
                                CONTENT
                            ================================================= */}

              <div className="benefit-content">

                <span className="benefit-label">

                  {item.label}

                </span>


                <h3>

                  {item.title}

                </h3>


                <p>

                  {item.text}

                </p>

              </div>


              {/* =================================================
                                FOOTER
                            ================================================= */}

              <div className="benefit-footer">

                <span className="benefit-footer-line"></span>


                <span className="benefit-footer-number">

                  {item.number}

                </span>


                <HiOutlineArrowRight
                  className="benefit-arrow"
                />

              </div>


              {/* Hover atmosphere */}

              <span
                className="benefit-glow"
                aria-hidden="true"
              ></span>


              <span
                className="benefit-border"
                aria-hidden="true"
              ></span>

            </article>

          ))}

        </div>


      </div>


      {/* =================================================
                BOTTOM FADE
            ================================================= */}

      <div
        className="benefits-bottom-fade"
        aria-hidden="true"
      ></div>

    </section>

  );

};


export default Benefits;