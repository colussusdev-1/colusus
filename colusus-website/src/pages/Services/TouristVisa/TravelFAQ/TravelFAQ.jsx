import {
    useState
} from "react";

import "./TravelFAQ.css";

import {
    HiOutlineChevronDown,
    HiOutlineQuestionMarkCircle
} from "react-icons/hi";


const faqData = [

    {
        id: 1,
        question: "How do I know which travel option is right for me?",
        answer:
            "Our travel experts assess your purpose, destination, profile and goals before recommending the most suitable pathway."
    },


    {
        id: 2,
        question: "What documents are required for a tourist visa?",
        answer:
            "Requirements depend on your destination. Generally, applicants may need a valid passport, financial documents, travel history, accommodation details and supporting documents."
    },


    {
        id: 3,
        question: "How long does the visa process take?",
        answer:
            "Processing times vary by country and visa type. During consultation, we provide a realistic timeline based on your selected destination."
    },


    {
        id: 4,
        question: "Can you help if my visa application was previously rejected?",
        answer:
            "Yes. We review previous applications, identify possible issues and help you prepare a stronger application strategy."
    },


    {
        id: 5,
        question: "Do you only assist with tourist visas?",
        answer:
            "No. We support multiple international travel pathways including business travel, study opportunities, family visits and relocation options."
    },


    {
        id: 6,
        question: "How do I begin my travel journey?",
        answer:
            "Start by booking a consultation. Our experts will evaluate your goals and guide you through the next steps."
    }

];



const TravelFAQ = () => {


    const [active, setActive] = useState(null);



    return (

        <section className="travel-faq">


            <div className="container">



                <div className="travel-faq-header">


                    <span className="travel-faq-tag">

                        NEED HELP?

                    </span>



                    <h2>

                        Frequently Asked

                        <span>
                            Questions
                        </span>

                    </h2>



                    <p>

                        Everything you need to know before
                        starting your international travel journey.

                    </p>


                </div>




                <div className="travel-faq-wrapper">


                    {
                        faqData.map((item) => {


                            const open = active === item.id;



                            return (

                                <article

                                    key={item.id}

                                    className={`travel-faq-card ${open ? "active" : ""
                                        }`}

                                >


                                    <button

                                        onClick={() => setActive(
                                            open ? null : item.id
                                        )}

                                    >


                                        <div className="faq-question">


                                            <div className="faq-icon">

                                                <HiOutlineQuestionMarkCircle />

                                            </div>



                                            <h3>

                                                {item.question}

                                            </h3>


                                        </div>



                                        <HiOutlineChevronDown

                                            className="faq-arrow"

                                        />


                                    </button>




                                    {

                                        open &&

                                        <div className="faq-answer">

                                            <p>

                                                {item.answer}

                                            </p>

                                        </div>

                                    }



                                </article>

                            )


                        })
                    }


                </div>


            </div>


        </section>

    )

}


export default TravelFAQ;