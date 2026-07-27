import {
    HiOutlineSparkles,
    HiCheckCircle
} from "react-icons/hi";


import "./Benefits.css";



const Benefits = ({
    opportunity
}) => {


    const benefits =
        opportunity.benefits || [];



    return (

        <section className="benefits-section">


            <div className="benefits-container">





                {/* HEADER */}


                <div className="benefits-header">



                    <div className="benefits-badge">


                        <HiOutlineSparkles />


                        <span>
                            Why Choose This Pathway
                        </span>


                    </div>





                    <h2>
                        Key Benefits
                    </h2>



                    <p>

                        Explore the advantages available
                        through this migration opportunity.

                    </p>



                </div>








                {/* BENEFIT GRID */}



                <div className="benefits-grid">


                    {
                        benefits.map(
                            (benefit,index)=>(


                                <article

                                    key={index}

                                    className="benefit-card"

                                >



                                    <div className="benefit-icon">


                                        <HiCheckCircle />


                                    </div>





                                    <span>

                                        {benefit}

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


export default Benefits;