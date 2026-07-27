const AssessmentProfile = ({
    data
}) => {


    return (

        <div className="assessmentResult__summary">


            <div className="profileCard">


                <span className="profileIcon">

                    🎯

                </span>



                <span className="profileLabel">

                    Migration Goal

                </span>



                <strong>

                    {data?.goal}

                </strong>


            </div>





            <div className="profileCard">


                <span className="profileIcon">

                    💼

                </span>



                <span className="profileLabel">

                    Experience

                </span>



                <strong>

                    {data?.experience}

                </strong>


            </div>





            <div className="profileCard">


                <span className="profileIcon">

                    🎓

                </span>



                <span className="profileLabel">

                    Education

                </span>



                <strong>

                    {data?.education}

                </strong>


            </div>






            <div className="profileCard">


                <span className="profileIcon">

                    🌎

                </span>



                <span className="profileLabel">

                    Preferred Destination

                </span>



                <strong>

                    {data?.destination}

                </strong>


            </div>



        </div>

    );

};


export default AssessmentProfile;