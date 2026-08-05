import "./WorkOpportunities.css";

import {
  HiOutlineBriefcase,
  HiOutlineGlobeAlt,
  HiOutlineAcademicCap,
  HiOutlineOfficeBuilding,
  HiOutlineArrowRight,
  HiOutlineCheckCircle
} from "react-icons/hi";

import { Link } from "react-router-dom";


const opportunities = [

  {
    number: "01",
    icon: <HiOutlineBriefcase />,
    title: "International Careers",
    text:
      "Access overseas employment pathways connecting skilled professionals with global companies and growing industries.",
    benefits: [
      "Verified opportunities",
      "Career guidance",
      "Relocation support"
    ]
  },


  {
    number: "02",
    icon: <HiOutlineGlobeAlt />,
    title: "Work Visa Pathways",
    text:
      "Discover legal immigration routes designed for professionals seeking better career opportunities abroad.",
    benefits: [
      "Eligibility assessment",
      "Application guidance",
      "Documentation support"
    ]
  },


  {
    number: "03",
    icon: <HiOutlineAcademicCap />,
    title: "Study & Work Routes",
    text:
      "Combine international education with career opportunities through structured study and employment programs.",
    benefits: [
      "School selection",
      "Visa preparation",
      "Future career planning"
    ]
  },


  {
    number: "04",
    icon: <HiOutlineOfficeBuilding />,
    title: "Business Relocation",
    text:
      "Expand your business globally with expert support for international relocation and market opportunities.",
    benefits: [
      "Business setup support",
      "Market guidance",
      "Global expansion"
    ]
  }

];



const WorkOpportunities = () => {


  return (

    <section className="work-opportunities">


      <div className="work-container">


        <div className="work-header">


          <span className="work-tag">

            GLOBAL OPPORTUNITIES

          </span>



          <h2>

            Build Your Future Beyond

            <span>
              Borders
            </span>

          </h2>



          <p>

            Whether you are seeking employment,
            education, entrepreneurship or relocation,
            we help you discover the right global pathway
            for your ambitions.

          </p>


        </div>





        <div className="work-grid">


          {
            opportunities.map((item) => {


              return (

                <article
                  className="work-card"
                  key={item.number}
                >


                  <div className="work-number">

                    {item.number}

                  </div>



                  <div className="work-icon">

                    {item.icon}

                  </div>



                  <h3>

                    {item.title}

                  </h3>



                  <p>

                    {item.text}

                  </p>




                  <ul>

                    {
                      item.benefits.map((benefit, index) => (

                        <li key={index}>

                          <HiOutlineCheckCircle />

                          {benefit}

                        </li>

                      ))
                    }

                  </ul>



                  <Link to="/free-assessment">


                    Explore Pathway

                    <HiOutlineArrowRight />


                  </Link>



                </article>

              )

            })
          }



        </div>






        <div className="work-cta">


          <div>

            <h3>

              Ready to discover your global opportunity?

            </h3>


            <p>

              Take our assessment and understand
              which pathway matches your profile.

            </p>


          </div>



          <Link to="/free-assessment">

            Start Free Assessment

            <HiOutlineArrowRight />

          </Link>



        </div>



      </div>


    </section>


  );


};


export default WorkOpportunities;