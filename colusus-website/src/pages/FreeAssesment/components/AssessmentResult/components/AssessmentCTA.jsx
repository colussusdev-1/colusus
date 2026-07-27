import {
    HiCheckCircle,
    HiArrowRight
} from "react-icons/hi";


import {
    useNavigate
} from "react-router-dom";



const AssessmentCTA = () => {


    const navigate = useNavigate();



    const handleConsultation = () => {


        navigate("/consultation");


    };




    return (

        <div className="assessmentResult__cta">


            <div className="assessmentResult__ctaContent">



                <span className="ctaBadge">


                    <HiCheckCircle />


                    Free Expert Guidance


                </span>








                <h3>

                    Ready To Start Your Migration Journey?

                </h3>








                <p>


                    Your assessment has identified
                    potential migration opportunities.
                    Our experts will help you understand
                    your best next steps.


                </p>








                <div className="ctaFeatures">


                    <span>

                        ✓ No obligation

                    </span>



                    <span>

                        ✓ Personalized advice

                    </span>



                    <span>

                        ✓ Expert review

                    </span>



                </div>









                <button

                    onClick={handleConsultation}

                >


                    Book Consultation


                    <HiArrowRight />


                </button>








            </div>



        </div>

    );

};


export default AssessmentCTA;