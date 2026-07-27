import {
    useEffect,
    useState
} from "react";


import AchievementUnlock
    from "./AchievementUnlock";


import ScoreReveal
    from "./ScoreReveal";


import AdvisorCTA
    from "./AdvisorCTA";


import "./ResultSequence.css";



const ResultSequence = ({
    assessment,
    formData,
    setResultStep
}) => {


    const [step,setStep] = useState(1);





    useEffect(()=>{


        setStep(1);

        setResultStep(1);



        const timers = [


            setTimeout(()=>{


                setStep(2);

                setResultStep(2);


            },3200),





            setTimeout(()=>{


                setStep(3);

                setResultStep(3);


            },6500)



        ];





        return ()=>{


            timers.forEach(timer=>{

                clearTimeout(timer);

            });


        };


    },[assessment,setResultStep]);









    const renderStep = ()=>{


        switch(step){


            case 1:

                return (

                    <AchievementUnlock

                        assessment={assessment}

                    />

                );




            case 2:

                return (

                    <ScoreReveal

                        assessment={assessment}

                    />

                );





            case 3:

                return (

                    <AdvisorCTA

                        assessment={assessment}

                        formData={formData}

                    />

                );




            default:

                return null;


        }


    };









    return (


        <div className="result-sequence">


            <div

                key={step}

                className="sequence-item"

            >


                {renderStep()}


            </div>


        </div>


    );


};


export default ResultSequence;