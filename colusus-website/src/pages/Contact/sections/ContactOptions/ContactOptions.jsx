import "./ContactOptions.css";

import {
    FiPhone,
    FiMail,
    FiMessageCircle,
    FiMapPin
} from "react-icons/fi";

const options = [

    {
        id:1,
        icon:<FiPhone />,
        title:"Call Us",
        value:"+234-703-520-9306"
    },

    {
        id:2,
        icon:<FiMail />,
        title:"Email",
        value:"admin@colossusmigration.com"
    },

    {
        id:3,
        icon:<FiMessageCircle />,
        title:"WhatsApp",
        value:"Quick Response"
    },

    {
        id:4,
        icon:<FiMapPin />,
        title:"Location",
        value:"Lagos, Nigeria"
    }

];

const ContactOptions = () => {

    return (

        <section className="contact-options">

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

                            <span>

                                {item.value}

                            </span>

                        </article>

                    ))

                }

            </div>

        </section>

    );

};

export default ContactOptions;