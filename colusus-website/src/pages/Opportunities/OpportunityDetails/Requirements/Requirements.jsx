import {
    HiCheckCircle,
    HiOutlineClipboardCheck
} from "react-icons/hi";

import "./Requirements.css";


const Requirements = ({
    opportunity
}) => {


    const requirements =
        opportunity.requirements || [];



    if (!requirements.length) return null;



    return (

        <section className="requirements-section">


            <div className="requirements-container">



                <div className="requirements-header">


                    <div className="requirements-label">

                        <HiOutlineClipboardCheck />

                        Eligibility Requirements

                    </div>



                    <h2>

                        Check If You Qualify

                    </h2>




                    <p>

                        Review the essential criteria
                        required before starting your
                        application process.

                    </p>


                </div>






                <div className="requirements-list">


                    {
                        requirements.map(

                            (item,index)=>(


                                <div

                                    className="requirement-item"

                                    key={index}

                                >



                                    <HiCheckCircle />



                                    <span>

                                        {item}

                                    </span>



                                </div>


                            )

                        )
                    }



                </div>





                <div className="requirements-footer">


                    <HiCheckCircle />


                    <span>

                        Meeting these requirements does not
                        guarantee approval. Final decisions
                        depend on official assessment.

                    </span>


                </div>




            </div>


        </section>

    );

};


export default Requirements;