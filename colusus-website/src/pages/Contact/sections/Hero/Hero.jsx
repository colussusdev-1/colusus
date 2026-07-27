import "./Hero.css";

import { FiArrowRight } from "react-icons/fi";

import {
    useNavigate
} from "react-router-dom";


const Hero = () => {


    const navigate = useNavigate();



    return (

        <section className="contact-hero">

            <div className="contact-hero-container">

                <span className="contact-badge">

                    Contact Colossus Migration

                </span>



                <h1>

                    Let's Discuss Your
                    Global Plans

                </h1>



                <p>

                    Whether you're exploring immigration,
                    overseas jobs, company formation or travel
                    opportunities, our team is ready to help.

                </p>



                <button

                    onClick={() => navigate("/consultation")}

                >

                    Book Consultation

                    <FiArrowRight />

                </button>

            </div>

        </section>

    );

};

export default Hero;