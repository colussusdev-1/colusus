import {
    useState
} from "react";

import {
    HiArrowRight,
    HiArrowLeft,
    HiSparkles,
    HiCheckCircle
} from "react-icons/hi";

import "./AssessmentJourney.css";


const questions = [

    {
        id:"goal",
        title:"What does your future look like?",
        subtitle:"Choose the pathway you want to explore.",
        options:[
            "Work Abroad",
            "Study Overseas",
            "Permanent Residency",
            "Business Migration"
        ]
    },

    {
        id:"experience",
        title:"Tell us about your experience",
        subtitle:"This helps us match better opportunities.",
        options:[
            "Student",
            "Early Career",
            "Experienced Professional",
            "Entrepreneur"
        ]
    },


    {
        id:"education",
        title:"What is your education level?",
        subtitle:"Education affects eligibility.",
        options:[
            "High School",
            "Diploma",
            "Bachelor Degree",
            "Master Degree"
        ]
    },


    {
        id:"destination",
        title:"Where would you like to go?",
        subtitle:"Select your preferred destination.",
        options:[
            "Canada",
            "Australia",
            "United Kingdom",
            "Europe"
        ]
    }

];




const AssessmentJourney = ({
    onComplete
}) => {


    const [step,setStep] = useState(0);

    const [answers,setAnswers] = useState({});


    const current = questions[step];




    const selectOption=(option)=>{


        setAnswers(prev=>({

            ...prev,

            [current.id]:option

        }));


    };





    const next=()=>{


        if(!answers[current.id]) return;



        if(step < questions.length - 1){

            setStep(prev=>prev+1);

        }
        else{

            onComplete(answers);

        }


    };






    const back=()=>{


        if(step > 0){

            setStep(prev=>prev-1);

        }


    };







    return (


        <section
            id="assessment-journey"
            className="assessmentJourney"
        >


            <div className="journey-container">



                <div className="journey-top">


                    <div className="journey-brand">

                        <HiSparkles/>

                        <span>
                            Migration Journey
                        </span>

                    </div>



                    <div className="journey-counter">

                        {step + 1}/{questions.length}

                    </div>


                </div>





                <div className="journey-progress">

                    <span
                        style={{
                            width:
                            `${((step+1)/questions.length)*100}%`
                        }}
                    />

                </div>







                <div
                    className="journey-card"
                    key={current.id}
                >



                    <div className="journey-header">


                        <small>

                            Question {step+1}

                        </small>



                        <h1>

                            {current.title}

                        </h1>



                        <p>

                            {current.subtitle}

                        </p>


                    </div>








                    <div className="journey-options">


                        {
                            current.options.map(option=>(


                                <button

                                    key={option}

                                    className={
                                        answers[current.id] === option
                                        ?
                                        "journey-option active"
                                        :
                                        "journey-option"
                                    }


                                    onClick={()=>selectOption(option)}

                                >


                                    <span>
                                        {option}
                                    </span>


                                    {
                                        answers[current.id] === option &&
                                        <HiCheckCircle/>
                                    }


                                </button>


                            ))
                        }


                    </div>



                </div>









                <div className="journey-actions">


                    <button

                        className="back"

                        disabled={step===0}

                        onClick={back}

                    >

                        <HiArrowLeft/>

                        Back

                    </button>





                    <button

                        className="next"

                        disabled={!answers[current.id]}

                        onClick={next}

                    >


                        {
                            step === questions.length-1
                            ?
                            "Discover Path"
                            :
                            "Continue"
                        }


                        <HiArrowRight/>

                    </button>


                </div>



            </div>


        </section>


    );

};


export default AssessmentJourney;