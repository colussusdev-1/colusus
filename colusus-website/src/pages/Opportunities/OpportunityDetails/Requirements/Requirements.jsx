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



    return (

        <section className="requirements-section">


            <div className="requirements-container">



                {/* HEADER */}

                <div className="requirements-header">


                    <div className="requirements-badge">


                        <HiOutlineClipboardCheck />


                        <span>
                            Eligibility Check
                        </span>


                    </div>




                    <h2>
                        Requirements
                    </h2>



                    <p>

                        Review the basic conditions required
                        before applying for this opportunity.

                    </p>



                </div>







                {/* REQUIREMENT LIST */}


                <div className="requirements-list">


                    {
                        requirements.map(
                            (item,index)=>(


                                <article

                                    key={index}

                                    className="requirement-item"

                                >



                                    <div className="requirement-check">


                                        <HiCheckCircle />


                                    </div>





                                    <span>

                                        {item}

                                    </span>




                                </article>


                            )
                        )
                    }


                </div>



            </div>



        </section>

    );

};


export default Requirements;