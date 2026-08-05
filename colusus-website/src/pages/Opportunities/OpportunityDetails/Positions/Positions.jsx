import {
  HiOutlineBriefcase,
  HiOutlineUserGroup
} from "react-icons/hi";

import "./Positions.css";


const Positions = ({
  opportunity
}) => {


  if (!opportunity?.positions?.length) {
    return null;
  }



  return (

    <section className="positions-section">


      <div className="positions-container">



        <div className="positions-header">


          <div className="positions-label">

            <HiOutlineBriefcase />

            Available Roles

          </div>




          <h2>

            Find A Role That Matches Your Experience

          </h2>




          <p>

            Explore the employment opportunities
            available under this migration pathway.

          </p>


        </div>






        <div className="positions-list">


          {
            opportunity.positions.map(

              (position, index) => (


                <article

                  className="position-item"

                  key={index}

                >



                  <div className="position-sector">


                    <div className="position-icon">

                      <HiOutlineUserGroup />

                    </div>



                    <div>

                      <span>
                        Sector
                      </span>


                      <h3>

                        {position.sector}

                      </h3>


                    </div>


                  </div>






                  <div className="position-roles">


                    {
                      position.roles.map(

                        (role, i) => (

                          <span

                            key={i}

                          >

                            {role}

                          </span>

                        )

                      )
                    }


                  </div>




                </article>


              )

            )
          }


        </div>


      </div>


    </section>

  );

};


export default Positions;