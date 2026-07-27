import "./TouristVisa.css";

import TouristHero from "./TouristHero/TouristHero";
import TouristVisaGrid from "./sections/TouristVisaGrid";
import TouristProcess from "./TouristProcess/TouristProcess";

import {
    HiOutlineArrowRight
} from "react-icons/hi";

import {
    Link
} from "react-router-dom";


const TouristVisa = () => {


    return (

        <div className="tv">


            <div className="container">


                {/* HERO */}

                <TouristHero />




                {/* VISA OPTIONS */}

                <TouristVisaGrid />




                {/* PROCESS */}

                <TouristProcess />





                {/* CONSULTATION CTA */}

                <section className="tv__cta">


                    <h2>

                        Ready To Start Your Travel Journey?

                    </h2>




                    <p>

                        Speak with our visa experts and receive
                        professional guidance before submitting
                        your application.

                    </p>





                    <Link

                        to="/consultation"

                        className="tv__btn"

                    >

                        Book Consultation


                        <HiOutlineArrowRight />

                    </Link>



                </section>




            </div>


        </div>

    );

};


export default TouristVisa;