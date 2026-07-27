import {
    useState,
    useEffect
} from "react";


import {
    HiOutlineCheckCircle,
    HiOutlineSparkles,
    HiOutlineShieldCheck,
    HiOutlineLightningBolt
} from "react-icons/hi";


import "./HeroAssessmentOverlay.css";





const HeroAssessmentOverlay = ({
    stage,
    data
}) => {



    const [activeStep,setActiveStep] = useState(0);




    const checks = [

        "Reviewing your destination eligibility",

        "Matching your migration pathway",

        "Analyzing your profile requirements",

        "Finding suitable opportunities"

    ];







    useEffect(()=>{


        if(stage !== "checking"){

            setActiveStep(0);

            return;

        }



        const timers = checks.map((_,index)=>{


            return setTimeout(()=>{


                setActiveStep(index + 1);


            },(index + 1) * 900);



        });



        return ()=>{


            timers.forEach(timer=>{

                clearTimeout(timer);

            });


        };



    },[stage]);









    return (

        <div className="assessment-overlay">



            <div className="assessment-container">







                {
                    stage === "checking" && (

                        <>


                            <div className="assessment-loader">


                                <div className="loader-ring"></div>


                                <HiOutlineSparkles/>


                            </div>








                            <h2>


                                Analyzing Your{" "}

                                {data?.destination || "Migration"}

                                {" "}Opportunity


                            </h2>








                            <p className="assessment-message">


                                We are reviewing your profile,
                                matching pathways and preparing
                                personalized recommendations.


                            </p>









                            <div className="assessment-steps">


                                {
                                    checks.map((item,index)=>{


                                        const completed =
                                        index < activeStep;



                                        return (

                                            <span

                                                key={item}

                                                className={
                                                    completed
                                                    ?
                                                    "check-item active"
                                                    :
                                                    "check-item"
                                                }

                                            >



                                                <HiOutlineCheckCircle/>


                                                {item}



                                            </span>

                                        )


                                    })
                                }


                            </div>





                            <div className="analysis-status">


                                <HiOutlineLightningBolt/>


                                Secure assessment in progress



                            </div>





                        </>

                    )

                }













                {
                    stage === "promotion" && (

                        <>





                            <span className="promo-badge">


                                Colossus Opportunity Match


                            </span>









                            <h2>


                                Your{" "}

                                {data?.destination}

                                {" "}Journey Could Start Today 🌎



                            </h2>









                            <p className="assessment-message">


                                We discovered possible pathways
                                based on your migration goals.


                            </p>









                            <div className="promo-card">






                                <div className="promo-icon">


                                    🌍


                                </div>









                                <h3>


                                    {data?.destination}

                                    {" "}

                                    {data?.purpose}

                                    {" "}Pathway



                                </h3>









                                <p>


                                    Our migration advisors will help
                                    you understand requirements,
                                    prepare documents and choose
                                    the strongest option.


                                </p>









                                <div className="promo-trust">





                                    <span>


                                        <HiOutlineShieldCheck/>


                                        Licensed Guidance



                                    </span>









                                    <span>


                                        ✓ Personal Support


                                    </span>





                                </div>





                            </div>









                            <div className="promo-progress">


                                <div className="progress-bar"></div>



                            </div>









                            <p className="promo-countdown">


                                Preparing your personalised result...


                            </p>








                        </>

                    )

                }





            </div>




        </div>


    );


};



export default HeroAssessmentOverlay;