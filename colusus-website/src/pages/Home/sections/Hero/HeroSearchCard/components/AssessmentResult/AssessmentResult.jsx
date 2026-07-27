import ResultSequence 
from "./ResultSequence";


import "./AssessmentResult.css";



const AssessmentResult = ({
    assessment,
    formData,
    setResultStep
}) => {


    return (


        <section className="eligibility-result">


            <div className="result-content">


                <ResultSequence

                    assessment={assessment}

                    formData={formData}

                    setResultStep={
                        setResultStep || (()=>{})
                    }

                />


            </div>


        </section>


    );


};


export default AssessmentResult;