import "./ContactCTA.css";

import {
    HiOutlinePhone,
    HiOutlineMail,
    HiOutlineClock,
    HiArrowRight
} from "react-icons/hi";


import {
    useNavigate
} from "react-router-dom";



const ContactCTA = () => {


    const navigate = useNavigate();



    const contactItems = [
        {
            icon:<HiOutlinePhone />,
            title:"Call Us",
            text:"+234-703-520-9306"
        },
        {
            icon:<HiOutlineMail />,
            title:"Email",
            text:"admin@colossusmigration.com"
        },
        {
            icon:<HiOutlineClock />,
            title:"Availability",
            text:"Mon - Sat | 9AM - 6PM"
        }
    ];





    const handleConsultation = () => {

        navigate("/consultation");

    };






    return (

        <section
            id="contact"
            className="contact-cta"
        >

            <div className="container contact-cta-container">

                <div className="contact-cta-card">


                    <div className="contact-cta-content">


                        <span className="contact-cta-tag">
                            Start Your Journey
                        </span>





                        <h2>

                            Ready To Explore

                            <span>
                                Your Options?
                            </span>

                        </h2>





                        <p>

                            Speak with our migration advisors
                            and discover the best pathway for
                            work, study, travel or relocation.

                        </p>






                        <button

                            className="contact-cta-button"

                            onClick={handleConsultation}

                        >

                            Book Consultation

                            <HiArrowRight />

                        </button>





                    </div>





                    <div className="contact-cta-divider"></div>





                    <div className="contact-cta-info">


                        {
                            contactItems.map((item,index)=>(

                                <div
                                    className="contact-mini-card"
                                    key={index}
                                >

                                    <div className="contact-mini-icon">

                                        {item.icon}

                                    </div>



                                    <div>

                                        <small>

                                            {item.title}

                                        </small>


                                        <p>

                                            {item.text}

                                        </p>


                                    </div>


                                </div>

                            ))
                        }


                    </div>



                </div>


            </div>


        </section>

    );

};


export default ContactCTA;