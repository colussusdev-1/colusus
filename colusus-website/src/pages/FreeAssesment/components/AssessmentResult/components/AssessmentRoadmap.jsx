import {
    HiCheckCircle,
    HiOutlineClipboardCheck,
    HiOutlineChatAlt2
} from "react-icons/hi";


const AssessmentRoadmap = () => {


    return (

        <div className="assessmentResult__steps">


            <div className="stepsHeader">

                <span>
                    Your Migration Roadmap
                </span>


                <h4>
                    Recommended Next Steps
                </h4>


                <p>
                    Follow these steps to move closer
                    to your migration goal.
                </p>

            </div>




            <div className="stepsTimeline">


                <div className="stepItem">


                    <div className="stepNumber">
                        01
                    </div>



                    <div className="stepContent">


                        <div className="stepIcon">

                            <HiOutlineClipboardCheck />

                        </div>



                        <div>

                            <h5>
                                CV Review
                            </h5>


                            <p>
                                Improve your profile
                                for international opportunities.
                            </p>

                        </div>


                    </div>


                </div>





                <div className="stepItem">


                    <div className="stepNumber">
                        02
                    </div>



                    <div className="stepContent">


                        <div className="stepIcon">

                            <HiCheckCircle />

                        </div>



                        <div>

                            <h5>
                                Eligibility Check
                            </h5>


                            <p>
                                Confirm your best migration
                                pathways and requirements.
                            </p>

                        </div>


                    </div>


                </div>





                <div className="stepItem">


                    <div className="stepNumber">
                        03
                    </div>



                    <div className="stepContent">


                        <div className="stepIcon">

                            <HiOutlineChatAlt2 />

                        </div>



                        <div>

                            <h5>
                                Consultation Call
                            </h5>


                            <p>
                                Connect with experts and
                                create your migration plan.
                            </p>

                        </div>


                    </div>


                </div>



            </div>


        </div>

    );

};


export default AssessmentRoadmap;