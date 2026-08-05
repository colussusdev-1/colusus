import "./TravelExperience.css";

import {
  HiOutlineGlobeAlt,
  HiOutlineCamera,
  HiOutlineSparkles,
  HiOutlineMap
} from "react-icons/hi";

import travel1 from "../../../../assets/tourist/experience-1.jpg";
import travel2 from "../../../../assets/tourist/experience-2.jpg";
import travel3 from "../../../../assets/tourist/experience-3.jpg";


const experiences = [

  {
    id: "01",

    icon: HiOutlineCamera,

    label: "Explore",

    title: "Discover Iconic Destinations",

    text:
      "Experience world-famous landmarks, breathtaking landscapes and unforgettable cities across the globe.",

    image: travel1
  },


  {
    id: "02",

    icon: HiOutlineSparkles,

    label: "Memories",

    title: "Create Lifelong Experiences",

    text:
      "Whether travelling alone, with family or loved ones, every journey becomes a story worth remembering.",

    image: travel2
  },


  {
    id: "03",

    icon: HiOutlineMap,

    label: "Confidence",

    title: "Travel Without Uncertainty",

    text:
      "From preparation to documentation, we help you move forward with clarity before your departure.",

    image: travel3
  }

];



const TravelExperience = () => {


  return (

    <section className="travel-experience">


      <div className="container">


        {/* HEADER */}

        <div className="travel-experience-header">


          <span>

            THE WORLD IS WAITING

          </span>



          <h2>

            More Than A Visa.

            <span>

              It's A Journey.

            </span>

          </h2>



          <p>

            Every destination tells a story. We help you prepare,
            plan and travel with confidence so you can focus on
            experiencing the world.

          </p>


        </div>





        {/* EXPERIENCE CARDS */}


        <div className="travel-experience-grid">


          {
            experiences.map((item) => {


              const Icon = item.icon;


              return (

                <article

                  key={item.id}

                  className="travel-experience-card"

                >


                  <div

                    className="travel-card-image"

                    style={{
                      backgroundImage:
                        `url(${item.image})`
                    }}

                  >


                    <div className="travel-card-overlay" />



                    <div className="travel-card-number">

                      {item.id}

                    </div>



                    <div className="travel-card-icon">

                      <Icon />

                    </div>



                  </div>





                  <div className="travel-card-content">



                    <span className="travel-card-label">

                      {item.label}

                    </span>




                    <h3>

                      {item.title}

                    </h3>




                    <p>

                      {item.text}

                    </p>



                  </div>


                </article>

              )


            })

          }


        </div>





        {/* HIGHLIGHT */}


        <div className="travel-highlight">


          <div className="travel-highlight-icon">


            <HiOutlineGlobeAlt />


          </div>



          <div>


            <h3>

              Your Journey Begins Long Before You Board The Plane

            </h3>



            <p>

              Proper preparation reduces delays and uncertainty.
              We guide you through travel planning, documentation
              and application preparation so your journey starts
              with confidence.

            </p>


          </div>



        </div>



      </div>


    </section>

  );

};


export default TravelExperience;