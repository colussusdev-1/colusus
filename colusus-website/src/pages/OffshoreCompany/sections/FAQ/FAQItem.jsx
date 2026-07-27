import {
    FiPlus,
    FiMinus
} from "react-icons/fi";


const FAQItem = ({
    item,
    isOpen,
    onToggle
}) => {


    return (


        <article

            className={`faq-item ${isOpen ? "active" : ""}`}

        >




            <button

                className="faq-question"

                onClick={onToggle}

                aria-expanded={isOpen}

            >



                <span>

                    {item.question}

                </span>





                <span className="faq-icon">


                    {
                        isOpen

                        ?

                        <FiMinus />

                        :

                        <FiPlus />

                    }


                </span>




            </button>







            <div

                className="faq-answer-wrapper"

            >


                <div

                    className="faq-answer"

                >


                    {item.answer}



                </div>



            </div>





        </article>


    );

};


export default FAQItem;