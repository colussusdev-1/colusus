import {
    useEffect,
    useState
} from "react";

import AchievementUnlock from "./AchievementUnlock";
import ScoreReveal from "./ScoreReveal";
import PathwayCard from "./PathwayCard";
import AdvisorCTA from "./AdvisorCTA";

import "./ResultFlow.css";


const ResultFlow = ({
    assessment,
    formData
}) => {


    const [step,setStep] = useState(0);



    useEffect(()=>{


        setStep(0);



        const timers = [


            setTimeout(()=>{

                setStep(1);

            },2500),





            setTimeout(()=>{

                setStep(2);

            },5500),





            setTimeout(()=>{

                setStep(3);

            },8500)


        ];





        return ()=>{


            timers.forEach(timer=>{

                clearTimeout(timer);

            });


        };



    },[assessment]);







    const renderStep = ()=>{


        switch(step){


            case 0:

                return (

                    <AchievementUnlock

                        assessment={assessment}

                    />

                );



            case 1:

                return (

                    <ScoreReveal

                        assessment={assessment}

                    />

                );



            case 2:

                return (

                    <PathwayCard

                        assessment={assessment}

                        formData={formData}

                    />

                );



            case 3:

            default:

                return (

                    <AdvisorCTA

                        assessment={assessment}

                    />

                );


        }


    };







    return (


        <div className="result-flow">


            <div
                key={step}
                className="result-screen"
            >

                {
                    renderStep()
                }


            </div>


        </div>


    );

};



export default ResultFlow;