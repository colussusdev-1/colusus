import { useState } from "react";

import AssessmentHero from "./components/AssessmentHero/AssessmentHero";
import AssessmentJourney from "./components/AssessmentJourney/AssessmentJourney";
import AssessmentResult from "./components/AssessmentResult/AssessmentResult";

import "./FreeAssessment.css";

const FreeAssessment = () => {

    const [stage, setStage] = useState("hero");

    const [assessmentData, setAssessmentData] = useState({});



    const startAssessment = () => {

        setStage("journey");

        setTimeout(() => {

            document
                .getElementById("assessment-journey")
                ?.scrollIntoView({
                    behavior: "smooth"
                });

        }, 100);

    };



    const completeAssessment = (data) => {

        setAssessmentData(data);

        setStage("result");

        setTimeout(() => {

            document
                .getElementById("assessment-result")
                ?.scrollIntoView({
                    behavior: "smooth"
                });

        }, 150);

    };



    return (

        <main className="free-assessment">

            <AssessmentHero
                onStart={startAssessment}
            />



            {
                stage === "journey" && (

                    <AssessmentJourney
                        onComplete={completeAssessment}
                    />

                )
            }



            {
                stage === "result" && (

                    <AssessmentResult
                        data={assessmentData}
                    />

                )
            }

        </main>

    );

};

export default FreeAssessment;