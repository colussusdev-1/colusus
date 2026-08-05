import {
  HiOutlineClipboardList,
  HiOutlineClock,
  HiCheckCircle
} from "react-icons/hi";

import "./ProcessTimeline.css";


const ProcessTimeline = ({
  opportunity
}) => {


  const steps =
    opportunity?.steps || [];



  if (!steps.length) return null;



  return (

    <section className="process-section">


      <div className="process-container">


        <header className="process-header">


          <div className="process-label">

            <HiOutlineClipboardList />

            Migration Journey

          </div>



          <h2>
            From Application To Relocation
          </h2>



          <p>

            A simple step-by-step process
            guiding you from assessment to
            your final relocation.

          </p>


        </header>





        <div className="process-journey">


          {
            steps.map((step, index) => (


              <div
                className="process-step"
                key={index}
              >


                <div className="process-marker">

                  {String(index + 1).padStart(2, "0")}

                </div>



                <div className="process-body">


                  <div className="process-top">

                    <h3>
                      {step.title}
                    </h3>


                    {
                      step.duration &&

                      <span className="process-time">

                        <HiOutlineClock />

                        {step.duration}

                      </span>

                    }


                  </div>



                  <p>
                    {step.description}
                  </p>


                </div>



              </div>


            ))
          }


        </div>





        <div className="process-footer">


          <HiCheckCircle />


          Dedicated support throughout your migration journey.


        </div>


      </div>


    </section>

  );

};


export default ProcessTimeline;