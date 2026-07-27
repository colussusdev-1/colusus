import {
    useState,
    useEffect,
    useRef
} from "react";


import HeroAssessmentOverlay
    from "./components/AssessmentOverlay/HeroAssessmentOverlay";


import OverlayPortal
    from "./components/AssessmentOverlay/OverlayPortal";


import assessmentConfig
    from "./assessment/assessmentConfig";


import runAssessment
    from "./assessment/assessmentEngine";


import AssessmentResult
    from "./components/AssessmentResult/AssessmentResult";


import AssessmentForm
    from "./components/AssessmentForm/AssessmentForm";


import "./HeroSearchCard.css";



const HeroSearchCard = () => {


    const [stage,setStage] = useState("form");


    const [assessment,setAssessment] = useState(null);



    const [resultStep,setResultStep] = useState(0);



    const timerRef = useRef([]);


    const cardRef = useRef(null);


    const resetTimerRef = useRef(null);




    const [formData,setFormData] = useState({

        destination:"",
        purpose:"",
        requirement:""

    });






    const currentAssessment =
        assessmentConfig[formData.purpose];









    /*
    ======================================
        LOCK PAGE DURING ANALYSIS
    ======================================
    */


    useEffect(()=>{


        const locked =
            stage === "checking" ||
            stage === "promotion";



        document.body.style.overflow =
            locked
            ? "hidden"
            : "auto";



        return ()=>{


            document.body.style.overflow="auto";


        };


    },[stage]);












    /*
    ======================================
        CLEAN TIMERS
    ======================================
    */


    useEffect(()=>{


        return ()=>{


            timerRef.current.forEach(timer=>{


                clearTimeout(timer);


            });



            if(resetTimerRef.current){


                clearTimeout(resetTimerRef.current);


            }


        };


    },[]);












    /*
    ======================================
        AUTO RESET EXPERIENCE
        WHEN USER LEAVES HERO
    ======================================
    */


    useEffect(()=>{


        const element = cardRef.current;



        if(
            !element ||
            stage !== "result"
        ){

            return;

        }




        const observer = new IntersectionObserver(

            ([entry])=>{



                if(!entry.isIntersecting){



                    resetTimerRef.current = setTimeout(()=>{


                        handleReset();



                    },800);



                }



            },


            {
                threshold:.15
            }


        );





        observer.observe(element);





        return ()=>{


            observer.disconnect();



            if(resetTimerRef.current){


                clearTimeout(resetTimerRef.current);


            }


        };



    },[stage]);












    /*
    ======================================
        INPUT CHANGE
    ======================================
    */


    const handleChange = (e)=>{


        const {
            name,
            value
        } = e.target;



        setFormData(prev=>({


            ...prev,


            [name]:value,



            ...(name==="purpose" && {

                requirement:""

            })


        }));


    };













    /*
    ======================================
        START ASSESSMENT
    ======================================
    */


    const handleSubmit = (e)=>{


        e.preventDefault();




        if(

            !formData.destination ||

            !formData.purpose ||

            !formData.requirement

        ){

            return;

        }







        const result =
            runAssessment(formData);





        setAssessment(result);



        setResultStep(0);



        setStage("checking");







        timerRef.current.push(


            setTimeout(()=>{


                setStage("promotion");



            },4000)



        );







        timerRef.current.push(


            setTimeout(()=>{


                setStage("result");



            },9000)



        );



    };













    /*
    ======================================
        RESET EXPERIENCE
    ======================================
    */


    const handleReset = ()=>{


        setAssessment(null);



        setResultStep(0);



        setStage("form");



        setFormData({

            destination:"",
            purpose:"",
            requirement:""

        });



    };












    const isResult =
        stage === "result";








    const cardClass = isResult


        ?


        `hero-card hero-card-result step-${resultStep}`


        :


        "hero-card hero-card-form";












    return (


        <>





            {

                (

                    stage === "checking" ||

                    stage === "promotion"


                )

                &&


                (


                    <OverlayPortal>


                        <HeroAssessmentOverlay


                            stage={stage}


                            data={formData}


                            assessment={assessment}


                        />


                    </OverlayPortal>


                )

            }









            <div

                ref={cardRef}

                className={cardClass}

            >






                {


                    !isResult


                    ?


                    (


                        <AssessmentForm


                            formData={formData}


                            handleChange={handleChange}


                            handleSubmit={handleSubmit}


                            currentAssessment={currentAssessment}


                        />


                    )



                    :



                    (


                        <AssessmentResult


                            assessment={assessment}


                            formData={formData}


                            onReset={handleReset}


                            setResultStep={setResultStep}


                        />


                    )


                }





            </div>





        </>

    );


};



export default HeroSearchCard;