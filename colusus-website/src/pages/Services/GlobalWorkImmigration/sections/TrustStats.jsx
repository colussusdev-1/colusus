import "./TrustStats.css";

import {
  HiOutlineGlobeAlt,
  HiOutlineUsers,
  HiOutlineBadgeCheck,
  HiOutlineBriefcase
} from "react-icons/hi";


const stats = [

  {
    icon: <HiOutlineGlobeAlt />,
    number: "20+",
    label: "Countries Supported"
  },

  {
    icon: <HiOutlineUsers />,
    number: "500+",
    label: "Applicants Guided"
  },

  {
    icon: <HiOutlineBadgeCheck />,
    number: "98%",
    label: "Client Satisfaction"
  },

  {
    icon: <HiOutlineBriefcase />,
    number: "50+",
    label: "Career Pathways"
  }

];



const TrustStats = () => {


  return (

    <section className="trust-stats">


      <div className="trust-wrapper">


        <div className="trust-strip">


          {
            stats.map((item, index) => (


              <div
                className="trust-item"
                key={index}
              >


                <div className="trust-icon">

                  {item.icon}

                </div>


                <div className="trust-content">


                  <h3>

                    {item.number}

                  </h3>


                  <p>

                    {item.label}

                  </p>


                </div>


              </div>


            ))

          }


        </div>


      </div>


    </section>


  )

}


export default TrustStats;