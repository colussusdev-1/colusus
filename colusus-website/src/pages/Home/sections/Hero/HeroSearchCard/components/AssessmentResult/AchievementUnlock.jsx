import {
    HiOutlineSparkles,
    HiOutlineCheckCircle
} from "react-icons/hi";

import "./AchievementUnlock.css";


const AchievementUnlock = ({
    assessment
}) => {


    return (

        <section className="achievement-unlock">


            <div className="achievement-particles">

                <span></span>
                <span></span>
                <span></span>
                <span></span>

            </div>




            <div className="unlock-icon">

                <HiOutlineCheckCircle />

            </div>





            <div className="unlock-label">

                <HiOutlineSparkles />

                Profile Assessment Complete

            </div>







            <h2>

                {assessment?.achievementTitle ||
                "Your Migration Opportunity Has Been Identified"}

            </h2>






            <p>

                Based on your profile, we discovered a pathway
                that could match your international goals.

            </p>





            <div className="achievement-status">


                <span>
                    Destination
                </span>


                <strong>
                    {assessment?.destination}
                </strong>



                <span>
                    Pathway
                </span>


                <strong>
                    {assessment?.pathway}
                </strong>


            </div>



        </section>

    );

};


export default AchievementUnlock;