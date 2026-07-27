import {
    HiCheckCircle
} from "react-icons/hi";


const AssessmentHeader = () => {

    return (

        <>

            {/* COMPLETION BADGE */}

            <div className="assessmentResult__badge">

                <span className="assessmentResult__badgeIcon">

                    <HiCheckCircle />

                </span>


                <span>

                    Assessment Complete

                </span>

            </div>



            {/* TITLE */}

            <h2>

                Your Migration Report

            </h2>



            {/* DESCRIPTION */}

            <p>

                We've analyzed your profile and identified
                the migration opportunities that best fit
                your goals and background.

            </p>

        </>

    );

};


export default AssessmentHeader;