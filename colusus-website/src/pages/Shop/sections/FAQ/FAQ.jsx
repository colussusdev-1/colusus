import { useState } from "react";

import "./FAQ.css";

import faqs from "./faqData";

import {
    FiChevronDown,
    FiChevronUp
} from "react-icons/fi";

const FAQ = () => {

    const [active,setActive] = useState(0);

    return (

        <section className="faq-section">

            <div className="faq-container">

                <div className="faq-header">

                    <span>

                        Frequently Asked Questions

                    </span>

                    <h2>

                        Everything You Need To Know

                    </h2>

                </div>

                <div className="faq-list">

                    {

                        faqs.map((faq,index)=>(

                            <div
                                key={index}
                                className={`faq-item ${
                                    active === index
                                    ? "active"
                                    : ""
                                }`}
                            >

                                <button
                                    className="faq-question"
                                    onClick={()=>
                                        setActive(
                                            active === index
                                            ? null
                                            : index
                                        )
                                    }
                                >

                                    <span>

                                        {faq.question}

                                    </span>

                                    {

                                        active === index

                                        ?

                                        <FiChevronUp />

                                        :

                                        <FiChevronDown />

                                    }

                                </button>

                                {

                                    active === index && (

                                        <div className="faq-answer">

                                            {faq.answer}

                                        </div>

                                    )

                                }

                            </div>

                        ))

                    }

                </div>

            </div>

        </section>

    );

};

export default FAQ;