import "./ContactOptions.css";

import {
    FiPhone,
    FiMail,
    FiMessageCircle,
    FiMapPin
} from "react-icons/fi";


const options = [

    {
        id: 1,
        icon: <FiPhone />,
        title: "Call Our Team",
        value: "+234-703-520-9306",
        description: "Speak directly with our migration advisors"
    },


    {
        id: 2,
        icon: <FiMail />,
        title: "Email Support",
        value: "admin@colossusmigration.com",
        description: "Send your enquiry and receive guidance"
    },


    {
        id: 3,
        icon: <FiMessageCircle />,
        title: "WhatsApp",
        value: "Quick Response",
        description: "Chat with our team instantly"
    },


    {
        id: 4,
        icon: <FiMapPin />,
        title: "Visit Office",
        value: "Lagos, Nigeria",
        description: "Meet our team for consultation"
    }

];



const ContactOptions = () => {


    return (

        <section className="contact-options">


            <div className="contact-options-container">


                <div className="contact-options-header">


                    <span>
                        GET IN TOUCH
                    </span>


                    <h2>
                        Multiple Ways To
                        <strong>
                            Connect With Us
                        </strong>
                    </h2>


                    <p>
                        Choose the communication method that works best
                        for you. Our team is ready to guide your next
                        international move.
                    </p>


                </div>





                <div className="contact-options-grid">


                    {
                        options.map(item => (

                            <article
                                key={item.id}
                                className="contact-option-card"
                            >



                                <div className="option-icon">

                                    {item.icon}

                                </div>




                                <h3>

                                    {item.title}

                                </h3>




                                <strong>

                                    {item.value}

                                </strong>



                                <p>

                                    {item.description}

                                </p>




                            </article>

                        ))
                    }



                </div>



            </div>


        </section>

    );

};


export default ContactOptions;