import {
    HiOutlineArrowRight,
    HiOutlineCheckCircle,
    HiOutlineClock,
    HiOutlineShieldCheck
} from "react-icons/hi";


import "./ConsultationHero.css";



const ConsultationHero = () => {



    const scrollToBooking = ()=>{


        document
        .getElementById("consultation-form")
        ?.scrollIntoView({

            behavior:"smooth"

        });


    };





    const scrollToBenefits = ()=>{


        document
        .getElementById("consultation-benefits")
        ?.scrollIntoView({

            behavior:"smooth"

        });


    };






    return (

        <section className="consultationHero">



            <div className="consultationHero__glow consultationHero__glow--one"></div>

            <div className="consultationHero__glow consultationHero__glow--two"></div>






            <div className="container consultationHero__container">







                {/* CONTENT */}


                <div className="consultationHero__content">





                    <span className="consultationHero__badge">

                        Professional Immigration Consultation

                    </span>







                    <h1 className="consultationHero__title">


                        Start Your Global Journey


                        <span>

                            With Confidence.

                        </span>


                    </h1>








                    <p className="consultationHero__description">


                        Get expert migration guidance,
                        understand your options, and receive
                        a clear roadmap before taking your next step.


                    </p>









                    <div className="consultationHero__actions">






                        <button

                            type="button"

                            onClick={scrollToBooking}

                            className="consultationHero__button consultationHero__button--primary"

                        >

                            Book Consultation


                            <HiOutlineArrowRight/>


                        </button>










                        <button

                            type="button"

                            onClick={scrollToBenefits}

                            className="consultationHero__button consultationHero__button--secondary"

                        >

                            What's Included


                        </button>







                    </div>









                    <div className="consultationHero__trust">





                        <div className="consultationHero__trustItem">

                            <HiOutlineCheckCircle/>

                            <span>
                                Personal Strategy
                            </span>


                        </div>








                        <div className="consultationHero__trustItem">

                            <HiOutlineClock/>

                            <span>
                                30-60 Minute Session
                            </span>


                        </div>








                        <div className="consultationHero__trustItem">

                            <HiOutlineShieldCheck/>

                            <span>
                                Secure Booking
                            </span>


                        </div>






                    </div>






                </div>













                {/* IMAGE */}


                <div className="consultationHero__visual">





                    <div className="consultationHero__imageWrapper">


                        <img

                            src="/images/consultation/advisor.png"

                            alt="Migration consultation advisor"

                            className="consultationHero__image"

                        />


                    </div>









                    <div className="consultationHero__expertBadge">



                        <HiOutlineCheckCircle/>




                        <div>


                            <strong>

                                Expert Guidance

                            </strong>



                            <span>

                                Before Applying

                            </span>

                        </div>

                    </div>

                </div>

            </div>
        </section>
    );

};



export default ConsultationHero;