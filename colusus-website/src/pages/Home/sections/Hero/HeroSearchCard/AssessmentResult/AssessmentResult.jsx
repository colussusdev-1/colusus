import ResultFlow from "./ResultFlow";

import "./AssessmentResult.css";

const AssessmentResult = ({
    assessment,
    formData
}) => {

    return (

        <div className="eligibility-result">

            <ResultFlow
                assessment={assessment}
                formData={formData}
            />

        </div>

    );

};

export default AssessmentResult;