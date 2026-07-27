import {
    HiOutlineBriefcase,
    HiOutlineAcademicCap,
    HiOutlineGlobeAlt
} from "react-icons/hi";


const AssessmentPathwayCard = ({
    recommendation
}) => {


    return (

        <div className="assessmentResult__heroCard">


            <div className="assessmentResult__icon">

                {recommendation.icon}

            </div>



            <div>


                <span>

                    Best Pathway

                </span>



                <h3>

                    {recommendation.pathway}

                </h3>


            </div>


        </div>

    );

};


export default AssessmentPathwayCard;