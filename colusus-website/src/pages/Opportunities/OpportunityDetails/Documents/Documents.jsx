import {
    HiOutlineDocumentText,
    HiCheckCircle
} from "react-icons/hi";

import "./Documents.css";


const Documents = ({
    opportunity
}) => {


    const documents =
        opportunity.documents || [];



    if (!documents.length) return null;



    return (

        <section className="documents-section">


            <div className="documents-container">



                <div className="documents-header">


                    <div className="documents-label">

                        <HiOutlineDocumentText />

                        Application Preparation

                    </div>




                    <h2>

                        Documents You Need To Prepare

                    </h2>




                    <p>

                        Having these documents ready helps
                        make your application process faster
                        and smoother.

                    </p>


                </div>






                <div className="documents-list">


                    {
                        documents.map(

                            (document, index) => (


                                <div

                                    className="document-item"

                                    key={index}

                                >



                                    <div className="document-number">

                                        {String(index + 1).padStart(2, "0")}

                                    </div>




                                    <span>

                                        {document}

                                    </span>



                                    <HiCheckCircle />



                                </div>


                            )

                        )
                    }


                </div>





                <div className="documents-note">


                    <HiCheckCircle />

                    <span>

                        Additional documents may be requested
                        during your official assessment.

                    </span>


                </div>



            </div>


        </section>

    );

};


export default Documents;