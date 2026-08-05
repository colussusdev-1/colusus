import {
  HiOutlineCreditCard,
  HiOutlineBadgeCheck,
  HiOutlineArrowRight
} from "react-icons/hi";

import "./Pricing.css";


const Pricing = ({
  opportunity
}) => {


  const pricing =
    opportunity?.pricing;



  if (!pricing) return null;



  return (

    <section className="migration-pricing-section">


      <div className="migration-pricing-container">



        {/* HEADER */}

        <header className="migration-pricing-header">


          <div className="migration-pricing-label">

            <HiOutlineCreditCard />

            <span>
              Migration Investment
            </span>

          </div>




          <h2>

            Understand Your Relocation Investment

          </h2>




          <p>

            Every migration pathway is different.
            Your final investment depends on eligibility,
            documentation, and the support required
            throughout your journey.

          </p>


        </header>








        {/* INVESTMENT PANEL */}


        <article className="migration-investment-panel">



          <div className="investment-main">


            <div className="investment-icon">

              ₦

            </div>




            <div>


              <span>

                Estimated Pathway Investment

              </span>



              <h3>

                {
                  pricing.total
                  ||
                  "Available After Assessment"
                }

              </h3>



              <small>

                {
                  pricing.currency
                  ||
                  "Complete migration support package"
                }

              </small>


            </div>



          </div>







          <div className="investment-benefits">


            <div>

              <HiOutlineBadgeCheck />

              <span>
                Eligibility assessment
              </span>

            </div>



            <div>

              <HiOutlineBadgeCheck />

              <span>
                Application guidance
              </span>

            </div>



            <div>

              <HiOutlineBadgeCheck />

              <span>
                Relocation support
              </span>

            </div>


          </div>







          <button className="investment-action">


            Discuss Your Pathway

            <HiOutlineArrowRight />


          </button>



        </article>





      </div>


    </section>

  );

};


export default Pricing;