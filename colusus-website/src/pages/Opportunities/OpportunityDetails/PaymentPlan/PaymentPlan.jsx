import {
  HiOutlineCreditCard,
  HiCheckCircle
} from "react-icons/hi";

import "./PaymentPlan.css";


const PaymentPlan = ({
  opportunity
}) => {


  const paymentPlan =
    opportunity.paymentPlan || [];



  if (!paymentPlan.length) {
    return null;
  }



  return (

    <section className="payment-section">


      <div className="payment-container">



        <header className="payment-header">


          <div className="payment-badge">

            <HiOutlineCreditCard />

            <span>
              Flexible Payment Plan
            </span>

          </div>



          <h2>
            Your Migration Journey, Paid By Milestones
          </h2>



          <p>

            Payments are structured around key
            stages of your relocation process,
            giving you clarity and confidence
            throughout the journey.

          </p>


        </header>






        <div className="payment-roadmap">


          {
            paymentPlan.map(
              (item, index) => (


                <article
                  className="payment-stage"
                  key={index}
                >



                  <div className="stage-number">

                    {String(index + 1)
                      .padStart(2, "0")}

                  </div>




                  <div className="stage-content">


                    <h3>

                      {item.stage}

                    </h3>



                    <strong>

                      {item.amount}

                    </strong>


                  </div>



                  <HiCheckCircle
                    className="stage-check"
                  />



                </article>


              )
            )
          }


        </div>




      </div>


    </section>

  );

};


export default PaymentPlan;