import {
    HiOutlineArrowRight,
    HiOutlineShieldCheck,
    HiOutlineCalendar,
    HiOutlineSparkles
} from "react-icons/hi";


import {
    useNavigate
} from "react-router-dom";


import "./AdvisorCTA.css";



const AdvisorCTA = ({
    assessment
}) => {



    const navigate = useNavigate();




    const handleConsultation = () => {


        navigate("/consultation");


    };







    return (


        <div className="advisor-cta">





            <div className="advisor-glow"/>








            <div className="advisor-top">



                <div className="advisor-icon">


                    <HiOutlineSparkles />


                </div>







                <div>


                    <span className="advisor-label">


                        Your Pathway Is Ready


                    </span>





                    <h4>


                        Speak With A Migration Expert


                    </h4>




                </div>



            </div>









            <div className="advisor-match">



                <HiOutlineShieldCheck/>




                <span>

                    Profile matched with:

                </span>





                <strong>


                    {
                        assessment?.pathway ||
                        "Migration Opportunity"
                    }


                </strong>




            </div>









            <p className="advisor-description">


                Your assessment shows a potential pathway.
                A specialist can review your profile and
                recommend the best next step.



            </p>









            <button


                className="advisor-button"


                onClick={handleConsultation}


            >



                <HiOutlineCalendar />



                <span>


                    Book Consultation


                </span>




                <HiOutlineArrowRight />



            </button>









            <div className="advisor-trust">



                <span>


                    <HiOutlineShieldCheck/>


                    Verified


                </span>






                <span>


                    No Pressure


                </span>







                <span>


                    Personal Advice


                </span>




            </div>







        </div>


    );

};



export default AdvisorCTA;