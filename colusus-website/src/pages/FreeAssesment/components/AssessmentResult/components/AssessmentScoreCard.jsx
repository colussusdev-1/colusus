import {
    HiCheckCircle
} from "react-icons/hi";


const AssessmentScoreCard = ({
    recommendation
}) => {


    return (

        <div className="assessmentResult__scoreCard">


            {/* HEADER */}

            <div className="scoreHeader">

                <span>

                    AI Migration Analysis

                </span>


                <HiCheckCircle />

            </div>



            {/* MAIN SCORE AREA */}

            <div className="scoreMain">


                <div className="scoreCircle">


                    <strong>

                        {recommendation.score}%

                    </strong>


                    <span>

                        Match

                    </span>


                </div>



                <div className="scoreContent">


                    <span className="scoreLabel">

                        Migration Readiness Score

                    </span>



                    <h3>

                        {recommendation.level}

                    </h3>



                    <p>

                        Your profile shows strong alignment
                        with international migration opportunities
                        based on your goals, education and
                        experience.

                    </p>


                </div>


            </div>



            {/* RECOMMENDED PATHWAY */}


            <div className="scoreRecommendation">


                <span>

                    Recommended Pathway

                </span>


                <strong>

                    {recommendation.pathway}

                </strong>


            </div>




            {/* INSIGHTS */}


            <div className="scoreInsights">


                <div>

                    🎓

                    <span>

                        Education

                    </span>


                    <strong>

                        Strong Fit

                    </strong>


                </div>



                <div>

                    💼


                    <span>

                        Experience

                    </span>


                    <strong>

                        Competitive

                    </strong>


                </div>



                <div>

                    🌎


                    <span>

                        Destination

                    </span>


                    <strong>

                        Suitable

                    </strong>


                </div>


            </div>



        </div>

    );

};


export default AssessmentScoreCard;