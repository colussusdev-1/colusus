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



    return (

        <section className="documents-section">


            <div className="documents-container">





                {/* HEADER */}

                <div className="documents-header">


                    <div className="documents-badge">


                        <HiOutlineDocumentText />


                        <span>
                            Application Checklist
                        </span>


                    </div>




                    <h2>
                        Required Documents
                    </h2>



                    <p>

                        Prepare these documents before
                        submitting your application.

                    </p>



                </div>








                {/* DOCUMENT LIST */}


                <div className="documents-list">


                    {
                        documents.map(
                            (document,index)=>(


                                <article

                                    key={index}

                                    className="document-item"

                                >



                                    <div className="document-number">

                                        {index + 1}

                                    </div>





                                    <span>

                                        {document}

                                    </span>





                                    <HiCheckCircle

                                        className="document-check"

                                    />




                                </article>


                            )
                        )
                    }


                </div>





            </div>



        </section>

    );

};


export default Documents;