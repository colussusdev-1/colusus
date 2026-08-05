import "./Benefits.css";

import {
  HiOutlineShieldCheck,
  HiOutlineUserGroup,
  HiOutlineDocumentText,
  HiOutlineSupport,
  HiOutlineGlobeAlt,
  HiOutlineTrendingUp
} from "react-icons/hi";


const benefits = [

  {
    icon: <HiOutlineShieldCheck />,
    number: "01",
    title: "Trusted Migration Guidance",
    text:
      "Navigate international opportunities with professional support designed to reduce uncertainty and migration risks."
  },


  {
    icon: <HiOutlineDocumentText />,
    number: "02",
    title: "Complete Application Support",
    text:
      "From documentation preparation to submission guidance, we help you stay organised throughout your migration journey."
  },


  {
    icon: <HiOutlineGlobeAlt />,
    number: "03",
    title: "Global Destination Access",
    text:
      "Explore work, study and relocation pathways across some of the world's most attractive destinations."
  },


  {
    icon: <HiOutlineUserGroup />,
    number: "04",
    title: "Personalised Consultation",
    text:
      "Every applicant receives guidance based on their skills, goals and international ambitions."
  },


  {
    icon: <HiOutlineSupport />,
    number: "05",
    title: "End-To-End Assistance",
    text:
      "Receive support beyond applications including relocation planning and settling-in guidance."
  },


  {
    icon: <HiOutlineTrendingUp />,
    number: "06",
    title: "Career Growth Opportunities",
    text:
      "Unlock pathways that help professionals build stronger careers in global markets."
  }

];



const Benefits = () => {


  return (

    <section className="benefits">


      <div className="benefits-container">


        <div className="benefits-header">


          <span>
            WHY CHOOSE COLOSSUS
          </span>


          <h2>

            More Than Migration.

            <strong>
              A Complete Global Journey.
            </strong>

          </h2>


          <p>

            Relocating internationally requires the right strategy,
            support and information. We provide everything you need
            to confidently pursue global opportunities.

          </p>


        </div>




        <div className="benefits-grid">


          {
            benefits.map((item, index) => (


              <article
                className="benefit-card"
                key={index}
              >


                {/* TOP HEADER */}

                <div className="benefit-top">


                  <div className="benefit-icon">

                    {item.icon}

                  </div>


                  <div className="benefit-number">

                    {item.number}

                  </div>


                </div>





                <div className="benefit-content">


                  <h3>

                    {item.title}

                  </h3>


                  <p>

                    {item.text}

                  </p>


                </div>





                {/* BASE NUMBER */}

                <div className="benefit-footer-number">

                  {item.number}

                </div>



                <div className="benefit-glow"></div>


              </article>


            ))
          }



        </div>


      </div>


    </section>

  );


};


export default Benefits;